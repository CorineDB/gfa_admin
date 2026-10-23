<template>
  <div class="py-6">
    <!-- BEGIN: En-tête -->
    <div class="intro-y flex flex-col sm:flex-row items-start sm:items-center">
      <div class="mr-auto">
        <h2 class="text-lg font-medium">Tableau de bord</h2>
        <div class="text-slate-500 mt-1">
          Bonjour <span class="font-medium text-slate-600">{{ displayName }}</span
          >, voici une vue d'ensemble de l'espace d'administration.
        </div>
      </div>
      <div class="flex items-center text-slate-500 mt-3 sm:mt-0">
        <CalendarIcon class="w-4 h-4 mr-2" />
        <span class="capitalize">{{ today }}</span>
      </div>
    </div>
    <!-- END: En-tête -->

    <!-- BEGIN: Erreur de chargement -->
    <div v-if="loadError" class="intro-y alert alert-danger show mt-5" role="alert">
      <div class="flex items-center">
        <AlertCircleIcon class="w-6 h-6 mr-2" />
        <span>{{ loadError }}</span>
        <button class="btn btn-sm btn-outline-danger ml-auto" @click="loadDashboard">Réessayer</button>
      </div>
    </div>
    <!-- END: Erreur de chargement -->

    <!-- BEGIN: Cartes statistiques -->
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div v-for="stat in stats" :key="stat.key" class="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
        <div class="box p-5 zoom-in">
          <div class="flex items-start">
            <div class="w-12 h-12 flex items-center justify-center rounded-full" :class="stat.iconBg">
              <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
            </div>
            <div class="ml-auto text-right">
              <div class="text-3xl font-medium leading-8">
                <span v-if="isLoading" class="inline-block w-10 h-7 rounded bg-slate-200 animate-pulse"></span>
                <span v-else>{{ stat.value }}</span>
              </div>
              <div class="text-base text-slate-500 mt-1">{{ stat.label }}</div>
            </div>
          </div>
          <div class="text-slate-500 text-xs mt-4">{{ stat.hint }}</div>
        </div>
      </div>
    </div>
    <!-- END: Cartes statistiques -->

    <div class="grid grid-cols-12 gap-6 mt-5">
      <!-- BEGIN: Programmes récents -->
      <div class="intro-y col-span-12 xl:col-span-8">
        <div class="box">
          <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 class="font-medium text-base mr-auto">Programmes récents</h2>
            <router-link :to="{ name: 'programme' }" class="text-primary flex items-center text-sm">
              Tout voir <ArrowRightIcon class="w-4 h-4 ml-1" />
            </router-link>
          </div>
          <div class="p-5">
            <div v-if="isLoading" class="space-y-3">
              <div v-for="n in 4" :key="n" class="h-10 rounded bg-slate-100 animate-pulse"></div>
            </div>
            <div v-else-if="recentProgrammes.length === 0" class="text-center text-slate-500 py-8">
              Aucun programme enregistré pour le moment.
            </div>
            <div v-else class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap">Programme</th>
                    <th class="whitespace-nowrap">Code</th>
                    <th class="whitespace-nowrap">Période</th>
                    <th class="whitespace-nowrap text-right">Budget national</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="programme in recentProgrammes" :key="programme.id" class="intro-x">
                    <td>
                      <div class="font-medium">{{ programme.nom || "—" }}</div>
                      <div class="text-slate-500 text-xs truncate max-w-[16rem]">
                        {{ programme.objectifGlobaux || programme.description || "" }}
                      </div>
                    </td>
                    <td>
                      <span class="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                        {{ programme.code || "—" }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap">{{ programmePeriode(programme) }}</td>
                    <td class="text-right whitespace-nowrap">{{ formatBudget(programme.budgetNational) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Programmes récents -->

      <!-- BEGIN: Répartition des unités de gestion -->
      <div class="intro-y col-span-12 xl:col-span-4">
        <div class="box h-full">
          <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 class="font-medium text-base mr-auto">Unités de gestion par programme</h2>
            <router-link :to="{ name: 'unite_gestion' }" class="text-primary flex items-center text-sm">
              Gérer <ArrowRightIcon class="w-4 h-4 ml-1" />
            </router-link>
          </div>
          <div class="p-5">
            <div v-if="isLoading" class="space-y-4">
              <div v-for="n in 4" :key="n" class="h-8 rounded bg-slate-100 animate-pulse"></div>
            </div>
            <div v-else-if="unitesParProgramme.length === 0" class="text-center text-slate-500 py-8">
              Aucune unité de gestion enregistrée.
            </div>
            <div v-else class="space-y-4">
              <div v-for="item in unitesParProgramme" :key="item.id">
                <div class="flex items-center mb-1">
                  <span class="truncate mr-2">{{ item.nom }}</span>
                  <span class="ml-auto text-slate-500 text-xs whitespace-nowrap">
                    {{ item.count }} / {{ totalUnites }}
                  </span>
                </div>
                <div class="h-1.5 rounded bg-slate-200/70 dark:bg-darkmode-400">
                  <div class="h-full rounded bg-primary" :style="{ width: item.percent + '%' }"></div>
                </div>
              </div>
              <div
                v-if="unitesSansProgramme > 0"
                class="text-slate-500 text-xs pt-2 border-t border-slate-200/60 dark:border-darkmode-400"
              >
                {{ unitesSansProgramme }} unité(s) non rattachée(s) à un programme.
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Répartition des unités de gestion -->
    </div>

    <div class="grid grid-cols-12 gap-6 mt-5">
      <!-- BEGIN: Derniers utilisateurs -->
      <div class="intro-y col-span-12 xl:col-span-8">
        <div class="box">
          <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 class="font-medium text-base mr-auto">Derniers utilisateurs</h2>
            <router-link :to="{ name: 'Utilisateur' }" class="text-primary flex items-center text-sm">
              Tout voir <ArrowRightIcon class="w-4 h-4 ml-1" />
            </router-link>
          </div>
          <div class="p-5">
            <div v-if="isLoading" class="space-y-3">
              <div v-for="n in 4" :key="n" class="h-10 rounded bg-slate-100 animate-pulse"></div>
            </div>
            <div v-else-if="recentUtilisateurs.length === 0" class="text-center text-slate-500 py-8">
              Aucun utilisateur enregistré.
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="user in recentUtilisateurs"
                :key="user.id"
                class="flex items-center pb-4 border-b border-slate-200/60 dark:border-darkmode-400 last:border-0 last:pb-0"
              >
                <div class="w-10 h-10 flex-none flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium uppercase">
                  {{ initiales(user) }}
                </div>
                <div class="ml-3 overflow-hidden">
                  <div class="font-medium truncate">{{ fullName(user) }}</div>
                  <div class="text-slate-500 text-xs truncate">
                    {{ user.email || "—" }}<span v-if="user.poste"> · {{ user.poste }}</span>
                  </div>
                </div>
                <div class="ml-auto flex flex-wrap justify-end gap-1 pl-2">
                  <span
                    v-for="role in (user.roles || []).slice(0, 2)"
                    :key="role.id || role.nom"
                    class="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs whitespace-nowrap"
                  >
                    {{ role.nom }}
                  </span>
                  <span v-if="!(user.roles || []).length" class="text-slate-400 text-xs">Sans rôle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Derniers utilisateurs -->

      <!-- BEGIN: Actions rapides -->
      <div class="intro-y col-span-12 xl:col-span-4">
        <div class="box h-full">
          <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 class="font-medium text-base mr-auto">Actions rapides</h2>
          </div>
          <div class="p-5 space-y-3">
            <router-link
              v-for="action in quickActions"
              :key="action.name"
              :to="{ name: action.name }"
              class="flex items-center p-3 rounded border border-slate-200/60 dark:border-darkmode-400 hover:bg-slate-50 dark:hover:bg-darkmode-400"
            >
              <div class="w-9 h-9 flex-none flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <component :is="action.icon" class="w-4 h-4" />
              </div>
              <div class="ml-3">
                <div class="font-medium text-sm">{{ action.label }}</div>
                <div class="text-slate-500 text-xs">{{ action.hint }}</div>
              </div>
              <ArrowRightIcon class="w-4 h-4 ml-auto text-slate-400" />
            </router-link>
          </div>
        </div>
      </div>
      <!-- END: Actions rapides -->
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import dayjs from "dayjs";
import ProgrammeService from "@/services/modules/programme.service";
import UniteeDeGestionService from "@/services/modules/unitee.gestion.service";
import UsersService from "@/services/modules/user.service";
import RoleService from "@/services/modules/roles.permissions.service";
import { toast } from "vue3-toastify";

const isLoading = ref(true);
const loadError = ref("");
const programmes = ref([]);
const unites = ref([]);
const utilisateurs = ref([]);
const roles = ref([]);

const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("authenticateUser")) || {};
  } catch (e) {
    return {};
  }
});

const displayName = computed(() => {
  const user = currentUser.value;
  const name = [user.nom, user.prenom].filter(Boolean).join(" ");
  return name || user.email || "administrateur";
});

const today = computed(() => dayjs().format("dddd D MMMM YYYY"));

const totalProgrammes = computed(() => programmes.value.length);
const totalUnites = computed(() => unites.value.length);
const totalUtilisateurs = computed(() => utilisateurs.value.length);
const totalRoles = computed(() => roles.value.length);

const totalPermissions = computed(() => {
  const ids = new Set();
  roles.value.forEach((role) => {
    (role.permissions || []).forEach((permission) => ids.add(permission.id ?? permission.slug));
  });
  return ids.size;
});

const totalAdmins = computed(() =>
  utilisateurs.value.filter((user) =>
    (user.roles || []).some((role) => /admin/i.test(role.nom || ""))
  ).length
);

const totalBudget = computed(() =>
  programmes.value.reduce((sum, programme) => sum + (Number(programme.budgetNational) || 0), 0)
);

const stats = computed(() => [
  {
    key: "programmes",
    label: "Programmes",
    value: totalProgrammes.value,
    hint: formatBudget(totalBudget.value) + " de budget national cumulé",
    icon: "BoxIcon",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    key: "unites",
    label: "Unités de gestion",
    value: totalUnites.value,
    hint: `${unitesParProgramme.value.length} programme(s) couvert(s)`,
    icon: "ListIcon",
    iconBg: "bg-pending/10",
    iconColor: "text-pending",
  },
  {
    key: "utilisateurs",
    label: "Utilisateurs",
    value: totalUtilisateurs.value,
    hint: `${totalAdmins.value} administrateur(s)`,
    icon: "UsersIcon",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    key: "roles",
    label: "Rôles & permissions",
    value: totalRoles.value,
    hint: `${totalPermissions.value} permission(s) distincte(s)`,
    icon: "LockIcon",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
]);

const recentProgrammes = computed(() =>
  [...programmes.value]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5)
);

const unitesParProgramme = computed(() => {
  const counts = unites.value.reduce((acc, unite) => {
    const id = unite.programme?.id ?? unite.programmeId ?? "none";
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const rows = programmes.value.map((programme) => ({
    id: programme.id,
    nom: programme.nom || "Programme sans nom",
    count: counts[programme.id] || 0,
  }));

  const max = Math.max(1, ...rows.map((row) => row.count));

  return rows
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((row) => ({
      ...row,
      percent: Math.round((row.count / max) * 100),
    }));
});

const unitesSansProgramme = computed(() => {
  const knownIds = new Set(programmes.value.map((programme) => programme.id));
  return unites.value.filter((unite) => {
    const id = unite.programme?.id ?? unite.programmeId;
    return !id || !knownIds.has(id);
  }).length;
});

const recentUtilisateurs = computed(() =>
  [...utilisateurs.value]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5)
);

const quickActions = [
  { name: "programme", label: "Nouveau programme", hint: "Créer un programme", icon: "BoxIcon" },
  { name: "unite_gestion", label: "Nouvelle unité de gestion", hint: "Rattacher une unité", icon: "ListIcon" },
  { name: "Utilisateur", label: "Nouvel utilisateur", hint: "Créer un compte", icon: "UsersIcon" },
  { name: "Roles", label: "Gérer les rôles", hint: "Droits et permissions", icon: "LockIcon" },
];

const listFrom = (response) => {
  const body = response?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.data)) return body.data.data;
  return [];
};

const formatBudget = (value) => {
  const amount = Number(value);
  if (!amount) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount) + " FCFA";
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = dayjs(value);
  return date.isValid() ? date.format("DD/MM/YYYY") : "—";
};

const programmePeriode = (programme) => {
  const debut = programme.debut ? formatDate(programme.debut) : "";
  const fin = programme.fin ? formatDate(programme.fin) : "";
  if (!debut && !fin) return "—";
  return `${debut || "…"} → ${fin || "…"}`;
};

const fullName = (user) => [user.nom, user.prenom].filter(Boolean).join(" ") || user.email || "—";

const initiales = (user) => {
  const source = fullName(user).trim();
  if (!source) return "?";
  const parts = source.split(/\s+/);
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};

const loadDashboard = async () => {
  isLoading.value = true;
  loadError.value = "";

  const results = await Promise.allSettled([
    ProgrammeService.get(),
    UniteeDeGestionService.get(),
    UsersService.get(),
    RoleService.getRole(),
  ]);

  const [programmesResult, unitesResult, utilisateursResult, rolesResult] = results;

  if (programmesResult.status === "fulfilled") {
    programmes.value = listFrom(programmesResult.value);
  }
  if (unitesResult.status === "fulfilled") {
    unites.value = listFrom(unitesResult.value);
  }
  if (utilisateursResult.status === "fulfilled") {
    utilisateurs.value = listFrom(utilisateursResult.value);
  }
  if (rolesResult.status === "fulfilled") {
    roles.value = listFrom(rolesResult.value);
  }

  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length === results.length) {
    loadError.value = "Impossible de charger les données du tableau de bord. Vérifiez votre connexion puis réessayez.";
    toast.error("Chargement du tableau de bord impossible");
  } else if (failed.length > 0) {
    toast.warning("Certaines données du tableau de bord n'ont pas pu être chargées.");
  }

  isLoading.value = false;
};

onMounted(loadDashboard);
</script>
