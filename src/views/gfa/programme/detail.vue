<template>
  <div class="py-6">
    <div class="intro-y flex flex-col sm:flex-row sm:items-start">
      <div class="mr-auto">
        <router-link to="/dashboard/programmes" class="inline-flex items-center text-slate-500 text-sm hover:text-primary">
          <ArrowLeftIcon class="w-4 h-4 mr-1" /> Retour aux programmes
        </router-link>
        <h2 class="text-xl font-medium mt-2 flex flex-wrap items-center">
          <span>{{ programme?.nom || "Détail du programme" }}</span>
          <span v-if="programme?.code" class="ml-3 px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">{{ programme.code }}</span>
        </h2>
        <p v-if="programme?.description" class="text-slate-500 mt-1 max-w-3xl">{{ programme.description }}</p>
      </div>
      <div class="flex items-center mt-4 sm:mt-0">
        <router-link v-if="programme" :to="{ name: 'programme', query: { edit: programme.id } }" class="btn btn-primary shadow-md">
          <PencilIcon class="w-4 h-4 mr-2" /> Modifier le programme
        </router-link>
      </div>
    </div>

    <div v-if="isLoadingProgramme" class="mt-6 space-y-4">
      <div class="grid grid-cols-12 gap-5">
        <div v-for="n in 4" :key="n" class="col-span-12 sm:col-span-6 xl:col-span-3">
          <div class="box p-5">
            <div class="h-4 w-24 rounded bg-slate-100 animate-pulse"></div>
            <div class="h-6 w-32 rounded bg-slate-100 animate-pulse mt-3"></div>
          </div>
        </div>
      </div>
      <div class="box p-6">
        <div class="h-4 w-1/3 rounded bg-slate-100 animate-pulse"></div>
        <div class="h-3 w-full rounded bg-slate-100 animate-pulse mt-4"></div>
        <div class="h-3 w-2/3 rounded bg-slate-100 animate-pulse mt-2"></div>
      </div>
    </div>

    <div v-else-if="programmeError" class="mt-6">
      <div class="alert alert-danger show" role="alert">
        <div class="flex items-center">
          <AlertCircleIcon class="w-6 h-6 mr-2 flex-none" />
          <span>{{ programmeError }}</span>
          <button class="btn btn-sm btn-outline-danger ml-auto" @click="loadProgramme">Réessayer</button>
        </div>
      </div>
    </div>

    <template v-else-if="programme">
      <div class="grid grid-cols-12 gap-5 mt-6">
        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
          <div class="box p-5">
            <div class="flex items-center">
              <div class="w-10 h-10 flex-none rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <CoinsIcon class="w-5 h-5" />
              </div>
              <div class="ml-3 overflow-hidden">
                <div class="text-slate-500 text-xs uppercase tracking-wider">Budget national</div>
                <div class="text-lg font-medium mt-0.5 truncate">{{ formatMoney(programme.budgetNational) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
          <div class="box p-5">
            <div class="flex items-center">
              <div class="w-10 h-10 flex-none rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <ListIcon class="w-5 h-5" />
              </div>
              <div class="ml-3">
                <div class="text-slate-500 text-xs uppercase tracking-wider">Unités de gestion</div>
                <div class="text-lg font-medium mt-0.5">{{ relationCount("unites") }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
          <div class="box p-5">
            <div class="flex items-center">
              <div class="w-10 h-10 flex-none rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <CheckSquareIcon class="w-5 h-5" />
              </div>
              <div class="ml-3">
                <div class="text-slate-500 text-xs uppercase tracking-wider">Activités</div>
                <div class="text-lg font-medium mt-0.5">{{ relationCount("activites") }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
          <div class="box p-5">
            <div class="flex items-center">
              <div class="w-10 h-10 flex-none rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <BriefcaseIcon class="w-5 h-5" />
              </div>
              <div class="ml-3">
                <div class="text-slate-500 text-xs uppercase tracking-wider">Projets</div>
                <div class="text-lg font-medium mt-0.5">{{ relationCount("projets") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="box mt-6">
        <div class="flex overflow-x-auto border-b border-slate-200/60 dark:border-darkmode-400">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors"
            :class="activeTab === tab.key ? 'border-primary text-primary font-medium' : 'border-transparent text-slate-500 hover:text-slate-700'"
            @click="activeTab = tab.key"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            <span>{{ tab.label }}</span>
            <span v-if="tab.countKey" class="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px]">{{ relationCount(tab.countKey) }}</span>
          </button>
        </div>

        <div class="p-5">
          <div v-if="activeTab === 'synthese'">
            <div class="grid grid-cols-12 gap-6">
              <div class="col-span-12 xl:col-span-7 space-y-6">
                <div>
                  <div class="text-slate-500 text-xs uppercase tracking-wider font-medium">Objectif global</div>
                  <p class="text-slate-600 mt-2 whitespace-pre-line">{{ programme.objectifGlobaux || "Non renseigné" }}</p>
                </div>
                <div>
                  <div class="text-slate-500 text-xs uppercase tracking-wider font-medium">Description</div>
                  <p class="text-slate-600 mt-2 whitespace-pre-line">{{ programme.description || "Non renseignée" }}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="rounded-md border border-slate-200/60 dark:border-darkmode-400 p-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium">Avancement temporel</span>
                      <span class="text-sm font-medium text-primary">{{ timeProgress === null ? "—" : `${timeProgress}%` }}</span>
                    </div>
                    <div class="h-2 rounded-full bg-slate-100 dark:bg-darkmode-400 mt-3 overflow-hidden">
                      <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${timeProgress || 0}%` }"></div>
                    </div>
                    <div class="text-slate-500 text-xs mt-2">
                      {{ formatDateValue(programme.debut) }} → {{ formatDateValue(programme.fin) }}
                    </div>
                  </div>

                  <div class="rounded-md border border-slate-200/60 dark:border-darkmode-400 p-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium">Exécution budgétaire</span>
                      <span class="text-sm font-medium text-primary">{{ budgetExecution === null ? "—" : `${budgetExecution}%` }}</span>
                    </div>
                    <div class="h-2 rounded-full bg-slate-100 dark:bg-darkmode-400 mt-3 overflow-hidden">
                      <div class="h-full rounded-full bg-success transition-all" :style="{ width: `${budgetExecution || 0}%` }"></div>
                    </div>
                    <div class="text-slate-500 text-xs mt-2">
                      {{ formatMoney(totalDecaisse) }} décaissés sur {{ formatMoney(programme.budgetNational) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-span-12 xl:col-span-5">
                <div class="rounded-md border border-slate-200/60 dark:border-darkmode-400 divide-y divide-slate-200/60 dark:divide-darkmode-400">
                  <div class="flex items-center justify-between px-4 py-3">
                    <span class="text-slate-500 text-sm">Code</span>
                    <span class="font-medium text-right">{{ programme.code || "—" }}</span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-3 gap-4">
                    <span class="text-slate-500 text-sm">Organisme de tutelle</span>
                    <span class="font-medium text-right">{{ programme.organismeDeTutelle || "—" }}</span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-3">
                    <span class="text-slate-500 text-sm">Date de début</span>
                    <span class="font-medium text-right">{{ formatDateValue(programme.debut) }}</span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-3">
                    <span class="text-slate-500 text-sm">Date de fin</span>
                    <span class="font-medium text-right">{{ formatDateValue(programme.fin) }}</span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-3">
                    <span class="text-slate-500 text-sm">Durée</span>
                    <span class="font-medium text-right">{{ durationLabel }}</span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-3">
                    <span class="text-slate-500 text-sm">Créé le</span>
                    <span class="font-medium text-right">{{ formatDateValue(programme.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'unites'">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">Unités de gestion rattachées</h3>
              <router-link to="/dashboard/unites-de-gestion" class="text-primary text-sm flex items-center">
                Gérer <ArrowRightIcon class="w-4 h-4 ml-1" />
              </router-link>
            </div>
            <RelationState :state="relationState.unites" empty="Aucune unité de gestion rattachée à ce programme." @retry="loadRelation('unites')">
              <table class="table table-report -mt-2">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap">Unité de gestion</th>
                    <th class="whitespace-nowrap">Responsable</th>
                    <th class="whitespace-nowrap">Email</th>
                    <th class="whitespace-nowrap">Contact</th>
                    <th class="whitespace-nowrap">Créée le</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(unite, index) in relations.unites" :key="unite.id || index" class="intro-x">
                    <td class="font-medium">{{ unite.nom || unite.libelle || "—" }}</td>
                    <td class="whitespace-nowrap">{{ personName(unite.user) }}</td>
                    <td>{{ unite.user?.email || unite.email || "—" }}</td>
                    <td class="whitespace-nowrap">{{ unite.user?.contact || unite.contact || "—" }}</td>
                    <td class="whitespace-nowrap">{{ formatDateValue(unite.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </RelationState>
          </div>

          <div v-else-if="activeTab === 'activites'">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">Activités du programme</h3>
              <span class="text-slate-500 text-sm">{{ relationCount("activites") }} activité(s)</span>
            </div>
            <RelationState :state="relationState.activites" empty="Aucune activité rattachée à ce programme." @retry="loadRelation('activites')">
              <table class="table table-report -mt-2">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap">Activité</th>
                    <th class="whitespace-nowrap">Composante / responsable</th>
                    <th class="whitespace-nowrap">Période</th>
                    <th class="whitespace-nowrap text-center">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(activite, index) in relations.activites" :key="activite.id || index" class="intro-x">
                    <td class="font-medium">{{ activite.nom || activite.libelle || activite.intitule || "—" }}</td>
                    <td>{{ activite.composante?.nom || activite.composante?.libelle || activite.structureResponsable || "—" }}</td>
                    <td class="whitespace-nowrap">{{ periodOf(activite) }}</td>
                    <td class="text-center">
                      <span v-if="statusInfo(activite)" class="px-2 py-1 rounded text-xs font-medium" :class="statusInfo(activite).class">
                        {{ statusInfo(activite).label }}
                      </span>
                      <span v-else class="text-slate-400">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </RelationState>
          </div>

          <div v-else-if="activeTab === 'projets'">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">Projets du programme</h3>
              <span class="text-slate-500 text-sm">{{ relationCount("projets") }} projet(s)</span>
            </div>
            <RelationState :state="relationState.projets" empty="Aucun projet rattaché à ce programme." @retry="loadRelation('projets')">
              <table class="table table-report -mt-2">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap">Projet</th>
                    <th class="whitespace-nowrap">Bailleur</th>
                    <th class="whitespace-nowrap">Période</th>
                    <th class="whitespace-nowrap text-right">Budget</th>
                    <th class="whitespace-nowrap text-center">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(projet, index) in relations.projets" :key="projet.id || index" class="intro-x">
                    <td>
                      <div class="font-medium">{{ projet.nom || projet.libelle || "—" }}</div>
                      <div v-if="projet.code" class="text-slate-500 text-xs">Code {{ projet.code }}</div>
                    </td>
                    <td>{{ projet.bailleur?.nom || projet.bailleur?.libelle || "—" }}</td>
                    <td class="whitespace-nowrap">{{ periodOf(projet) }}</td>
                    <td class="text-right whitespace-nowrap">{{ formatMoney(amountOf(projet)) }}</td>
                    <td class="text-center">
                      <span v-if="statusInfo(projet)" class="px-2 py-1 rounded text-xs font-medium" :class="statusInfo(projet).class">
                        {{ statusInfo(projet).label }}
                      </span>
                      <span v-else class="text-slate-400">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </RelationState>
          </div>

          <div v-else-if="activeTab === 'structures'">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">Structures impliquées</h3>
              <span class="text-slate-500 text-sm">{{ relationCount("structures") }} structure(s)</span>
            </div>
            <RelationState :state="relationState.structures" empty="Aucune structure rattachée à ce programme." @retry="loadRelation('structures')">
              <table class="table table-report -mt-2">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap">Structure</th>
                    <th class="whitespace-nowrap">Type</th>
                    <th class="whitespace-nowrap">Poste</th>
                    <th class="whitespace-nowrap">Email</th>
                    <th class="whitespace-nowrap">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(structure, index) in relations.structures" :key="structure.id || index" class="intro-x">
                    <td class="font-medium">{{ structure.nom || structure.libelle || "—" }}</td>
                    <td class="whitespace-nowrap">{{ structure.type || structure.sigle || "—" }}</td>
                    <td class="whitespace-nowrap">{{ structure.poste || "—" }}</td>
                    <td>{{ structure.email || "—" }}</td>
                    <td class="whitespace-nowrap">{{ structure.contact || structure.telephone || "—" }}</td>
                  </tr>
                </tbody>
              </table>
            </RelationState>
          </div>

          <div v-else-if="activeTab === 'financement'">
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 sm:col-span-4">
                <div class="rounded-md border border-slate-200/60 dark:border-darkmode-400 p-4">
                  <div class="text-slate-500 text-xs uppercase tracking-wider">Budget national</div>
                  <div class="text-lg font-medium mt-1">{{ formatMoney(programme.budgetNational) }}</div>
                </div>
              </div>
              <div class="col-span-12 sm:col-span-4">
                <div class="rounded-md border border-slate-200/60 dark:border-darkmode-400 p-4">
                  <div class="text-slate-500 text-xs uppercase tracking-wider">Total décaissé</div>
                  <div class="text-lg font-medium mt-1">{{ hasDecaissementAmount ? formatMoney(totalDecaisse) : "—" }}</div>
                </div>
              </div>
              <div class="col-span-12 sm:col-span-4">
                <div class="rounded-md border border-slate-200/60 dark:border-darkmode-400 p-4">
                  <div class="text-slate-500 text-xs uppercase tracking-wider">Taux d'exécution</div>
                  <div class="text-lg font-medium mt-1">{{ budgetExecution === null ? "—" : `${budgetExecution}%` }}</div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between mt-6 mb-3">
              <h3 class="font-medium">Décaissements</h3>
              <span class="text-slate-500 text-sm">{{ relationCount("decaissements") }} opération(s)</span>
            </div>
            <RelationState :state="relationState.decaissements" empty="Aucun décaissement enregistré pour ce programme." @retry="loadRelation('decaissements')">
              <table class="table table-report -mt-2">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap">Libellé</th>
                    <th class="whitespace-nowrap">Date</th>
                    <th class="whitespace-nowrap text-right">Montant</th>
                    <th class="whitespace-nowrap">Source</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(decaissement, index) in relations.decaissements" :key="decaissement.id || index" class="intro-x">
                    <td class="font-medium">{{ decaissement.libelle || decaissement.nom || decaissement.description || "—" }}</td>
                    <td class="whitespace-nowrap">{{ formatDateValue(decaissement.date || decaissement.dateDecaissement || decaissement.created_at) }}</td>
                    <td class="text-right whitespace-nowrap font-medium">{{ formatMoney(amountOf(decaissement)) }}</td>
                    <td>{{ decaissement.bailleur?.nom || decaissement.source || decaissement.type || "—" }}</td>
                  </tr>
                </tbody>
              </table>
            </RelationState>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import ProgrammeService from "@/services/modules/programme.service";

const RelationState = defineComponent({
  name: "RelationState",
  props: {
    state: { type: Object, required: true },
    empty: { type: String, default: "Aucune donnée disponible." },
  },
  emits: ["retry"],
  setup(props, { slots, emit }) {
    return () => {
      if (props.state.loading) {
        return h("div", { class: "space-y-2" }, Array.from({ length: 3 }).map((_, index) =>
          h("div", { key: index, class: "h-10 rounded bg-slate-100 animate-pulse" })
        ));
      }
      if (props.state.error) {
        return h("div", { class: "text-center py-8" }, [
          h("div", { class: "text-slate-500" }, props.state.error),
          h("button", { type: "button", class: "btn btn-outline-secondary mt-3", onClick: () => emit("retry") }, "Réessayer"),
        ]);
      }
      if (props.state.empty) {
        return h("div", { class: "text-center text-slate-500 py-10" }, props.empty);
      }
      return slots.default ? slots.default() : null;
    };
  },
});

const route = useRoute();
const programme = ref(null);
const isLoadingProgramme = ref(true);
const programmeError = ref("");
const activeTab = ref("synthese");

const relations = reactive({
  unites: [],
  activites: [],
  projets: [],
  structures: [],
  decaissements: [],
});

const relationState = reactive({
  unites: { loading: false, error: "", empty: false },
  activites: { loading: false, error: "", empty: false },
  projets: { loading: false, error: "", empty: false },
  structures: { loading: false, error: "", empty: false },
  decaissements: { loading: false, error: "", empty: false },
});

const tabs = [
  { key: "synthese", label: "Synthèse", icon: "ClipboardListIcon" },
  { key: "unites", label: "Unités de gestion", icon: "ListIcon", countKey: "unites" },
  { key: "activites", label: "Activités", icon: "CheckSquareIcon", countKey: "activites" },
  { key: "projets", label: "Projets", icon: "BriefcaseIcon", countKey: "projets" },
  { key: "structures", label: "Structures", icon: "LandmarkIcon", countKey: "structures" },
  { key: "financement", label: "Financement", icon: "WalletIcon", countKey: "decaissements" },
];

const relationSources = {
  unites: { embedded: ["uniteeDeGestions", "unitesDeGestion", "unitee_de_gestion"], fetch: (id) => ProgrammeService.uniteeGestion(id) },
  activites: { embedded: ["activites"], fetch: (id) => ProgrammeService.activites(id) },
  projets: { embedded: ["projets"], fetch: (id) => ProgrammeService.projets(id) },
  structures: { embedded: ["structures"], fetch: (id) => ProgrammeService.structures(id) },
  decaissements: { embedded: ["decaissements"], fetch: (id) => ProgrammeService.decaissements(id) },
};

const extractItem = (response) => {
  const body = response?.data;
  const candidate = body?.data ?? body;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
  for (const key of ["programme", "item", "result"]) {
    if (candidate[key] && typeof candidate[key] === "object" && !Array.isArray(candidate[key])) return candidate[key];
  }
  return candidate;
};

const extractList = (response) => {
  const body = response?.data;
  if (Array.isArray(body)) return body;
  for (const candidate of [body?.data, body?.data?.data]) {
    if (Array.isArray(candidate)) return candidate;
  }
  if (body && typeof body === "object") {
    const arrayValue = Object.values(body).find((value) => Array.isArray(value));
    if (arrayValue) return arrayValue;
    if (body.data && typeof body.data === "object") {
      const nestedValue = Object.values(body.data).find((value) => Array.isArray(value));
      if (nestedValue) return nestedValue;
    }
  }
  return [];
};

const embeddedList = (key) => {
  for (const field of relationSources[key].embedded) {
    const value = programme.value?.[field];
    if (Array.isArray(value)) return value;
  }
  return null;
};

const loadProgramme = async () => {
  isLoadingProgramme.value = true;
  programmeError.value = "";
  try {
    const response = await ProgrammeService.get(route.params.id);
    const data = extractItem(response);
    if (!data) throw new Error("empty");
    programme.value = data;
  } catch (error) {
    programme.value = null;
    programmeError.value =
      error?.response?.status === 404
        ? "Programme introuvable."
        : "Impossible de charger le programme. Vérifiez votre connexion puis réessayez.";
  } finally {
    isLoadingProgramme.value = false;
  }
};

const loadRelation = async (key) => {
  const state = relationState[key];
  state.loading = true;
  state.error = "";
  try {
    const embedded = embeddedList(key);
    if (embedded) {
      relations[key] = embedded;
      return;
    }
    const response = await relationSources[key].fetch(route.params.id);
    relations[key] = extractList(response);
  } catch (error) {
    state.error =
      error?.response?.status === 404
        ? "Cette rubrique n'est pas disponible pour ce programme."
        : "Impossible de charger les données de cette rubrique.";
  } finally {
    state.loading = false;
    state.empty = !state.error && relations[key].length === 0;
  }
};

const loadRelations = () => {
  return Promise.all(Object.keys(relationSources).map((key) => loadRelation(key)));
};

const relationCount = (key) => {
  const state = relationState[key];
  if (state.loading) return "…";
  if (state.error) return "—";
  return relations[key].length;
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "" || Number.isNaN(Number(value))) return "—";
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(value))} FCFA`;
};

const formatDateValue = (value) => {
  if (!value) return "—";
  const date = dayjs(value);
  return date.isValid() ? date.format("DD/MM/YYYY") : String(value);
};

const personName = (person) => {
  if (!person) return "—";
  const name = [person.prenom, person.nom].filter(Boolean).join(" ");
  return name || person.nom || person.name || "—";
};

const periodOf = (item) => {
  const start = item?.debut ?? item?.dateDebut ?? item?.date_debut ?? item?.start_date;
  const end = item?.fin ?? item?.dateFin ?? item?.date_fin ?? item?.end_date;
  if (!start && !end) return "—";
  return `${formatDateValue(start)} → ${formatDateValue(end)}`;
};

const amountOf = (item) => {
  const keys = ["montant", "budget", "budgetNational", "budget_national", "montantDecaisse", "montant_decaisse", "montantNational", "montant_national", "valeur"];
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== "" && !Number.isNaN(Number(value))) return Number(value);
  }
  return null;
};

const statusInfo = (item) => {
  const raw = item?.statut ?? item?.status ?? item?.etat;
  if (raw === null || raw === undefined || raw === "") return null;
  const value = String(raw).toLowerCase();
  const statuses = {
    "-2": ["Non validé", "bg-slate-200 text-slate-600"],
    "-1": ["En attente", "bg-slate-200 text-slate-600"],
    "0": ["En cours", "bg-warning/10 text-warning"],
    "1": ["En retard", "bg-danger/10 text-danger"],
    "2": ["Terminé", "bg-success/10 text-success"],
    "en cours": ["En cours", "bg-warning/10 text-warning"],
    "encours": ["En cours", "bg-warning/10 text-warning"],
    "en attente": ["En attente", "bg-slate-200 text-slate-600"],
    "termine": ["Terminé", "bg-success/10 text-success"],
    "terminé": ["Terminé", "bg-success/10 text-success"],
    "en retard": ["En retard", "bg-danger/10 text-danger"],
    "annule": ["Annulé", "bg-danger/10 text-danger"],
    "annulé": ["Annulé", "bg-danger/10 text-danger"],
  };
  const found = statuses[value];
  return found ? { label: found[0], class: found[1] } : { label: String(raw), class: "bg-slate-100 text-slate-600" };
};

const timeProgress = computed(() => {
  const start = dayjs(programme.value?.debut);
  const end = dayjs(programme.value?.fin);
  if (!programme.value?.debut || !programme.value?.fin || !start.isValid() || !end.isValid() || !end.isAfter(start)) return null;
  const elapsed = dayjs().diff(start);
  const total = end.diff(start);
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
});

const durationLabel = computed(() => {
  const start = dayjs(programme.value?.debut);
  const end = dayjs(programme.value?.fin);
  if (!programme.value?.debut || !programme.value?.fin || !start.isValid() || !end.isValid() || !end.isAfter(start)) return "—";
  const months = end.diff(start, "month");
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years <= 0) return `${months} mois`;
  return `${years} an${years > 1 ? "s" : ""}${rest ? ` ${rest} mois` : ""}`;
});

const hasDecaissementAmount = computed(() => relations.decaissements.some((item) => amountOf(item) !== null));

const totalDecaisse = computed(() =>
  relations.decaissements.reduce((total, item) => total + (amountOf(item) || 0), 0)
);

const budgetExecution = computed(() => {
  const budget = Number(programme.value?.budgetNational);
  if (!budget || !hasDecaissementAmount.value) return null;
  return Math.round((totalDecaisse.value / budget) * 100);
});

onMounted(async () => {
  await loadProgramme();
  if (programme.value) await loadRelations();
});
</script>
