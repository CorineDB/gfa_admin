<template>
  <div class="py-6">
    <!-- BEGIN: En-tête -->
    <div class="intro-y flex flex-col sm:flex-row items-start sm:items-center">
      <div class="mr-auto">
        <h2 class="text-lg font-medium">Clients</h2>
        <div class="text-slate-500 mt-1">Organisations clientes rattachées à la plateforme.</div>
      </div>
      <button class="btn btn-primary shadow-md mt-3 sm:mt-0" @click="openAdd">
        <PlusIcon class="w-4 h-4 mr-2" /> Ajouter un client
      </button>
    </div>
    <!-- END: En-tête -->

    <!-- BEGIN: Erreur de chargement -->
    <div v-if="loadError" class="alert alert-danger show mt-5" role="alert">
      <div class="flex items-center">
        <AlertCircleIcon class="w-6 h-6 mr-2 flex-none" />
        <span>{{ loadError }}</span>
        <button class="btn btn-sm btn-outline-danger ml-auto" @click="loadClients">Réessayer</button>
      </div>
    </div>
    <!-- END: Erreur de chargement -->

    <!-- BEGIN: Filtres -->
    <div class="intro-y flex flex-col sm:flex-row items-center mt-5">
      <div class="search hidden sm:block">
        <input v-model="search" type="text" class="search__input form-control border-transparent" placeholder="Rechercher un client..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
      <div class="ml-auto flex items-center text-slate-500 text-sm mt-3 sm:mt-0">
        <span>{{ filteredClients.length }} client(s)</span>
      </div>
    </div>
    <!-- END: Filtres -->

    <!-- BEGIN: Tableau -->
    <div class="intro-y mt-5">
      <div class="overflow-x-auto">
        <table class="table table-report">
          <thead>
            <tr>
              <th class="whitespace-nowrap">Client</th>
              <th class="whitespace-nowrap">Secteur</th>
              <th class="whitespace-nowrap">Contact</th>
              <th class="whitespace-nowrap">Email</th>
              <th class="whitespace-nowrap">Téléphone</th>
              <th class="whitespace-nowrap text-center">Statut</th>
              <th class="whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="isLoading">
            <tr v-for="n in 5" :key="n">
              <td colspan="7">
                <div class="h-8 rounded bg-slate-100 animate-pulse my-1"></div>
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="paginatedClients.length === 0">
            <tr>
              <td colspan="7" class="text-center text-slate-500 py-10">
                <BuildingIcon class="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <div v-if="clients.length === 0">Aucun client enregistré pour le moment.</div>
                <div v-else>Aucun client ne correspond à votre recherche.</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="client in paginatedClients" :key="client.id" class="intro-x">
              <td>
                <div class="font-medium">{{ client.nom || "—" }}</div>
                <div v-if="client.sigle" class="text-slate-500 text-xs">{{ client.sigle }}</div>
              </td>
              <td>{{ client.secteur || "—" }}</td>
              <td>{{ client.contact || "—" }}</td>
              <td>
                <a v-if="client.email" :href="`mailto:${client.email}`" class="text-primary">{{ client.email }}</a>
                <span v-else>—</span>
              </td>
              <td>{{ client.telephone || "—" }}</td>
              <td class="text-center">
                <span class="px-2 py-1 rounded text-xs font-medium" :class="statusClass(client.statut)">
                  {{ statusLabel(client.statut) }}
                </span>
              </td>
              <td class="table-report__action">
                <div class="flex justify-center items-center">
                  <a class="flex items-center mr-3" href="javascript:;" @click="openEdit(client)">
                    <EditIcon class="w-4 h-4 mr-1" /> Modifier
                  </a>
                  <a class="flex items-center text-danger" href="javascript:;" @click="openDelete(client)">
                    <Trash2Icon class="w-4 h-4 mr-1" /> Supprimer
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- BEGIN: Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-end mt-2">
        <button class="btn btn-outline-secondary w-24 mr-2" :disabled="currentPage === 1" @click="currentPage--">
          Précédent
        </button>
        <span class="text-slate-500 text-sm mr-2">Page {{ currentPage }} / {{ totalPages }}</span>
        <button class="btn btn-outline-secondary w-24" :disabled="currentPage === totalPages" @click="currentPage++">
          Suivant
        </button>
      </div>
      <!-- END: Pagination -->
    </div>
    <!-- END: Tableau -->

    <!-- BEGIN: Modal ajout / modification -->
    <Modal :show="showModal" @hidden="closeModal">
      <ModalHeader>
        <h2 class="font-medium text-base mr-auto">
          {{ isUpdate ? "Modifier un client" : "Ajouter un client" }}
        </h2>
      </ModalHeader>
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12 sm:col-span-8">
          <label class="form-label" for="client-nom">Nom <span class="text-danger">*</span></label>
          <input id="client-nom" v-model.trim="formData.nom" type="text" class="form-control" placeholder="Nom de l'organisation" />
          <p v-if="messageErreur.nom" class="text-red-500 text-xs mt-1">{{ messageErreur.nom }}</p>
        </div>
        <div class="col-span-12 sm:col-span-4">
          <label class="form-label" for="client-sigle">Sigle</label>
          <input id="client-sigle" v-model.trim="formData.sigle" type="text" class="form-control" placeholder="Ex : PNUD" />
          <p v-if="messageErreur.sigle" class="text-red-500 text-xs mt-1">{{ messageErreur.sigle }}</p>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label" for="client-secteur">Secteur</label>
          <input id="client-secteur" v-model.trim="formData.secteur" type="text" class="form-control" placeholder="Ex : Gouvernance" />
          <p v-if="messageErreur.secteur" class="text-red-500 text-xs mt-1">{{ messageErreur.secteur }}</p>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label" for="client-statut">Statut</label>
          <select id="client-statut" v-model="formData.statut" class="form-select">
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
          <p v-if="messageErreur.statut" class="text-red-500 text-xs mt-1">{{ messageErreur.statut }}</p>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label" for="client-contact">Contact</label>
          <input id="client-contact" v-model.trim="formData.contact" type="text" class="form-control" placeholder="Personne de contact" />
          <p v-if="messageErreur.contact" class="text-red-500 text-xs mt-1">{{ messageErreur.contact }}</p>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <label class="form-label" for="client-telephone">Téléphone</label>
          <input id="client-telephone" v-model.trim="formData.telephone" type="text" class="form-control" placeholder="Ex : +229 00 00 00 00" />
          <p v-if="messageErreur.telephone" class="text-red-500 text-xs mt-1">{{ messageErreur.telephone }}</p>
        </div>
        <div class="col-span-12">
          <label class="form-label" for="client-email">Email</label>
          <input id="client-email" v-model.trim="formData.email" type="email" class="form-control" placeholder="contact@organisation.org" />
          <p v-if="messageErreur.email" class="text-red-500 text-xs mt-1">{{ messageErreur.email }}</p>
        </div>
        <div class="col-span-12">
          <label class="form-label" for="client-adresse">Adresse</label>
          <textarea id="client-adresse" v-model.trim="formData.adresse" class="form-control" rows="2" placeholder="Adresse complète"></textarea>
          <p v-if="messageErreur.adresse" class="text-red-500 text-xs mt-1">{{ messageErreur.adresse }}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <button type="button" class="btn btn-outline-secondary w-24 mr-1" @click="closeModal">Annuler</button>
        <button type="button" class="btn btn-primary w-28" :disabled="saving" @click="saveClient">
          <span v-if="!saving">{{ isUpdate ? "Modifier" : "Enregistrer" }}</span>
          <span v-else>Chargement...</span>
        </button>
      </ModalFooter>
    </Modal>
    <!-- END: Modal ajout / modification -->

    <!-- BEGIN: Modal suppression -->
    <Modal :show="deleteModal" @hidden="deleteModal = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">
          <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
          <div class="text-xl mt-5">Supprimer {{ deleteData.nom }} ?</div>
          <div class="text-slate-500 mt-2">Cette opération est irréversible.</div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" class="btn btn-outline-secondary w-24 mr-1" @click="deleteModal = false">Annuler</button>
          <button type="button" class="btn btn-danger w-24" :disabled="deleting" @click="deleteClient">
            <span v-if="!deleting">Supprimer</span>
            <span v-else>...</span>
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal suppression -->
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import ClientService from "@/services/modules/client.service";

const clients = ref([]);
const isLoading = ref(false);
const loadError = ref("");
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);

const showModal = ref(false);
const isUpdate = ref(false);
const saving = ref(false);
const selectedId = ref(null);
const messageErreur = reactive({});

const deleteModal = ref(false);
const deleting = ref(false);
const deleteData = reactive({ id: null, nom: "" });

const emptyForm = () => ({
  nom: "",
  sigle: "",
  secteur: "",
  contact: "",
  email: "",
  telephone: "",
  adresse: "",
  statut: "actif",
});

const formData = reactive(emptyForm());

const statusLabel = (statut) => {
  if (statut === undefined || statut === null || statut === "") return "—";
  const value = String(statut);
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const statusClass = (statut) => {
  const value = String(statut ?? "").toLowerCase();
  if (["actif", "active", "1", "true"].includes(value)) return "bg-success/10 text-success";
  if (["inactif", "inactive", "0", "false"].includes(value)) return "bg-danger/10 text-danger";
  return "bg-slate-100 text-slate-600";
};

const listFrom = (response) => {
  const body = response?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.data)) return body.data.data;
  return [];
};

const filteredClients = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return clients.value;
  const words = term.split(/\s+/);
  const fields = ["nom", "sigle", "secteur", "contact", "email", "telephone", "adresse", "statut"];
  return clients.value.filter((client) =>
    words.every((word) => fields.some((field) => String(client[field] ?? "").toLowerCase().includes(word)))
  );
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredClients.value.length / itemsPerPage.value)));

const paginatedClients = computed(() => {
  if (currentPage.value > totalPages.value) currentPage.value = 1;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredClients.value.slice(start, start + itemsPerPage.value);
});

const clearErrors = () => Object.keys(messageErreur).forEach((key) => delete messageErreur[key]);

const loadClients = async () => {
  isLoading.value = true;
  loadError.value = "";
  try {
    const response = await ClientService.get();
    clients.value = listFrom(response);
  } catch (error) {
    clients.value = [];
    loadError.value = "Le service Clients n'est pas disponible pour le moment. Vérifiez que l'endpoint /clients est déployé côté API.";
    toast.error("Impossible de charger les clients.");
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  Object.assign(formData, emptyForm());
  selectedId.value = null;
  isUpdate.value = false;
  clearErrors();
};

const openAdd = () => {
  resetForm();
  showModal.value = true;
};

const openEdit = (client) => {
  clearErrors();
  selectedId.value = client.id;
  isUpdate.value = true;
  Object.assign(formData, {
    nom: client.nom || "",
    sigle: client.sigle || "",
    secteur: client.secteur || "",
    contact: client.contact || "",
    email: client.email || "",
    telephone: client.telephone || client.tel || "",
    adresse: client.adresse || "",
    statut: client.statut || "actif",
  });
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const validate = () => {
  clearErrors();
  if (!formData.nom) messageErreur.nom = "Le nom est obligatoire.";
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    messageErreur.email = "L'email n'est pas valide.";
  }
  return Object.keys(messageErreur).length === 0;
};

const applyServerErrors = (error) => {
  const data = error?.response?.data;
  if (data?.errors) {
    Object.entries(data.errors).forEach(([key, value]) => {
      messageErreur[key] = Array.isArray(value) ? value[0] : value;
    });
  }
  return data?.message;
};

const saveClient = async () => {
  if (!validate() || saving.value) return;

  saving.value = true;
  const payload = {
    nom: formData.nom,
    sigle: formData.sigle,
    secteur: formData.secteur,
    contact: formData.contact,
    email: formData.email,
    telephone: formData.telephone,
    adresse: formData.adresse,
    statut: formData.statut,
  };

  try {
    if (isUpdate.value) {
      await ClientService.update(selectedId.value, payload);
      toast.success("Client modifié avec succès.");
    } else {
      await ClientService.create(payload);
      toast.success("Client ajouté avec succès.");
    }
    closeModal();
    await loadClients();
  } catch (error) {
    const message = applyServerErrors(error);
    toast.error(message || "Impossible d'enregistrer le client.");
  } finally {
    saving.value = false;
  }
};

const openDelete = (client) => {
  deleteData.id = client.id;
  deleteData.nom = client.nom || "ce client";
  deleteModal.value = true;
};

const deleteClient = async () => {
  if (!deleteData.id || deleting.value) return;
  deleting.value = true;
  try {
    await ClientService.destroy(deleteData.id);
    toast.success("Client supprimé avec succès.");
    deleteModal.value = false;
    await loadClients();
  } catch (error) {
    toast.error(applyServerErrors(error) || "Impossible de supprimer le client.");
  } finally {
    deleting.value = false;
  }
};

onMounted(loadClients);
</script>
