<template>
  <div class="py-6">
    <!-- BEGIN: En-tête -->
    <div class="intro-y flex items-center mt-2">
      <h2 class="text-lg font-medium mr-auto">Mon profil</h2>
    </div>
    <!-- END: En-tête -->

    <div class="grid grid-cols-12 gap-6 mt-5">
      <!-- BEGIN: Carte identité -->
      <div class="intro-y col-span-12 lg:col-span-4">
        <div class="box p-5">
          <div class="flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-primary/10 text-primary">
              <img v-if="photoUrl" :src="photoUrl" alt="Photo de profil" class="w-full h-full object-cover" />
              <span v-else class="text-2xl font-semibold uppercase">{{ initiales }}</span>
            </div>
            <div class="font-medium text-lg mt-4">{{ displayName }}</div>
            <div class="text-slate-500 text-sm mt-0.5">{{ form.email || "—" }}</div>
            <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mt-3">
              {{ roleLabel }}
            </span>
          </div>

          <div class="mt-6 pt-5 border-t border-slate-200/60 dark:border-darkmode-400 space-y-4">
            <router-link to="/dashboard/profil" class="flex items-center text-primary font-medium">
              <ActivityIcon class="w-4 h-4 mr-2" /> Informations personnelles
            </router-link>
            <router-link to="/dashboard/profil/reset-password" class="flex items-center text-slate-600 dark:text-slate-300">
              <LockIcon class="w-4 h-4 mr-2" /> Changer de mot de passe
            </router-link>
          </div>
        </div>

        <!-- BEGIN: Photo -->
        <div class="box p-5 mt-5">
          <h2 class="font-medium text-base mb-4">Photo de profil</h2>
          <div class="flex items-center">
            <div class="w-16 h-16 rounded-full overflow-hidden flex-none flex items-center justify-center bg-primary/10 text-primary">
              <img v-if="previewUrl || photoUrl" :src="previewUrl || photoUrl" alt="Aperçu" class="w-full h-full object-cover" />
              <span v-else class="text-lg font-semibold uppercase">{{ initiales }}</span>
            </div>
            <div class="ml-4">
              <label class="btn btn-outline-secondary cursor-pointer">
                Choisir une image
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
              </label>
              <div class="text-slate-500 text-xs mt-2">JPG ou PNG, 2 Mo maximum.</div>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-primary w-full mt-4"
            :disabled="!selectedFile || savingPhoto"
            @click="savePhoto"
          >
            <span v-if="!savingPhoto">Enregistrer la photo</span>
            <span v-else>Enregistrement...</span>
          </button>
        </div>
        <!-- END: Photo -->
      </div>
      <!-- END: Carte identité -->

      <!-- BEGIN: Formulaire -->
      <div class="intro-y col-span-12 lg:col-span-8">
        <div class="box">
          <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 class="font-medium text-base mr-auto">Informations personnelles</h2>
          </div>
          <form class="p-5" @submit.prevent="saveInfo">
            <div class="grid grid-cols-12 gap-x-5 gap-y-3">
              <div class="col-span-12 xl:col-span-6">
                <label class="form-label" for="profil-nom">Nom</label>
                <input id="profil-nom" v-model.trim="form.nom" type="text" class="form-control" placeholder="Votre nom" />
                <p v-if="errors.nom" class="text-red-500 text-xs mt-1">{{ errors.nom }}</p>
              </div>
              <div class="col-span-12 xl:col-span-6">
                <label class="form-label" for="profil-prenom">Prénom</label>
                <input id="profil-prenom" v-model.trim="form.prenom" type="text" class="form-control" placeholder="Votre prénom" />
                <p v-if="errors.prenom" class="text-red-500 text-xs mt-1">{{ errors.prenom }}</p>
              </div>
              <div class="col-span-12 xl:col-span-6">
                <label class="form-label" for="profil-email">Email</label>
                <input id="profil-email" v-model.trim="form.email" type="email" class="form-control" placeholder="Votre email" />
                <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
              </div>
              <div class="col-span-12 xl:col-span-6">
                <label class="form-label" for="profil-contact">Contact</label>
                <input id="profil-contact" v-model.trim="form.contact" type="text" class="form-control" placeholder="Votre contact" />
                <p v-if="errors.contact" class="text-red-500 text-xs mt-1">{{ errors.contact }}</p>
              </div>
              <div class="col-span-12 xl:col-span-6">
                <label class="form-label" for="profil-poste">Poste</label>
                <input id="profil-poste" v-model.trim="form.poste" type="text" class="form-control" placeholder="Votre poste" />
                <p v-if="errors.poste" class="text-red-500 text-xs mt-1">{{ errors.poste }}</p>
              </div>
              <div class="col-span-12 xl:col-span-6">
                <label class="form-label" for="profil-role">Rôle</label>
                <input id="profil-role" :value="roleLabel" type="text" class="form-control" disabled />
              </div>
            </div>

            <div class="flex justify-end mt-5">
              <button type="submit" class="btn btn-primary w-full sm:w-auto" :disabled="savingInfo">
                <span v-if="!savingInfo">Mettre à jour</span>
                <span v-else>Enregistrement...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- END: Formulaire -->
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import AuthentificationService from "@/services/modules/authentification.service";
import { API_BASE_URL } from "@/services/configs/environment";

const rawUser = ref({});
const form = reactive({ nom: "", prenom: "", email: "", contact: "", poste: "" });
const errors = reactive({});
const photoUrl = ref("");
const previewUrl = ref("");
const selectedFile = ref(null);
const fileInput = ref(null);
const savingInfo = ref(false);
const savingPhoto = ref(false);

const user = computed(() => rawUser.value?.users || rawUser.value || {});

const roles = computed(() => {
  const source = user.value;
  if (Array.isArray(source.roles)) return source.roles;
  if (Array.isArray(source.role)) return source.role;
  if (source.role) return [source.role];
  return [];
});

const roleLabel = computed(() => {
  const names = roles.value.map((role) => role.nom).filter(Boolean);
  return names.length ? names.join(", ") : user.value.type || "Utilisateur";
});

const displayName = computed(() => {
  const name = [form.nom, form.prenom].filter(Boolean).join(" ");
  return name || user.value.email || "Utilisateur";
});

const initiales = computed(() => {
  const parts = [form.nom, form.prenom].filter(Boolean);
  if (!parts.length) return "?";
  return parts.map((part) => part.trim()[0] || "").join("").toUpperCase();
});

const buildPhotoUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("blob:")) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}/${String(path).replace(/^\//, "")}`;
};

const serverMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }
  return data?.message || fallback;
};

const fillForm = (source) => {
  form.nom = source.nom || "";
  form.prenom = source.prenom || source.prenoms || "";
  form.email = source.email || "";
  form.contact = source.contact || "";
  form.poste = source.poste || "";
};

const persistUser = (updates) => {
  const raw = JSON.parse(localStorage.getItem("authenticateUser")) || {};
  const target = raw.users || raw;
  Object.assign(target, updates);
  raw.userInitiale = [(target.nom || "")[0], (target.prenom || "")[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();
  localStorage.setItem("authenticateUser", JSON.stringify(raw));
  rawUser.value = raw;
};

onMounted(() => {
  const raw = JSON.parse(localStorage.getItem("authenticateUser")) || {};
  rawUser.value = raw;
  const source = raw.users || raw;
  fillForm(source);
  photoUrl.value = buildPhotoUrl(source.profil);
});

const validate = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
  if (!form.nom) errors.nom = "Le nom est obligatoire.";
  if (!form.prenom) errors.prenom = "Le prénom est obligatoire.";
  if (!form.email) {
    errors.email = "L'email est obligatoire.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "L'email n'est pas valide.";
  }
  return Object.keys(errors).length === 0;
};

const saveInfo = async () => {
  if (!validate() || savingInfo.value) return;

  const id = user.value.id;
  if (!id) {
    toast.error("Utilisateur introuvable. Reconnectez-vous.");
    return;
  }

  savingInfo.value = true;
  const payload = {
    nom: form.nom,
    prenom: form.prenom,
    email: form.email,
    contact: form.contact,
    poste: form.poste,
  };

  try {
    const response = await AuthentificationService.updateUserInfo(id, payload);
    const updated = response?.data?.data || payload;
    persistUser({
      nom: updated.nom ?? payload.nom,
      prenom: updated.prenom ?? payload.prenom,
      email: updated.email ?? payload.email,
      contact: updated.contact ?? payload.contact,
      poste: updated.poste ?? payload.poste,
    });
    fillForm(user.value);
    toast.success("Profil mis à jour avec succès.");
  } catch (error) {
    const data = error?.response?.data;
    if (data?.errors) {
      Object.entries(data.errors).forEach(([key, value]) => {
        errors[key] = Array.isArray(value) ? value[0] : value;
      });
    }
    toast.error(serverMessage(error, "Impossible de mettre à jour le profil."));
  } finally {
    savingInfo.value = false;
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    toast.error("L'image ne doit pas dépasser 2 Mo.");
    event.target.value = "";
    return;
  }
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const savePhoto = async () => {
  if (!selectedFile.value || savingPhoto.value) return;

  savingPhoto.value = true;
  const data = new FormData();
  data.append("photo", selectedFile.value);

  try {
    const response = await AuthentificationService.changeProfil(data);
    const path = response?.data?.data?.profil ?? response?.data?.profil;
    if (path) {
      persistUser({ profil: path });
      photoUrl.value = buildPhotoUrl(path);
    }
    previewUrl.value = "";
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
    toast.success("Photo de profil mise à jour.");
  } catch (error) {
    toast.error(serverMessage(error, "Impossible de mettre à jour la photo."));
  } finally {
    savingPhoto.value = false;
  }
};
</script>
