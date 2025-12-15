<template>
  <div class="p-4"></div>

  <div class="container mx-auto px-4"></div>

  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">Unité de gestion</h2>
    <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
      <button class="btn btn-primary shadow-md mr-2" @click="addUnite()"><PlusIcon class="w-4 h-4 mr-3" /> Ajouter une nouvelle unité de gestion</button>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
      <table class="table table-report -mt-2">
        <thead>
          <tr>
            <th class="whitespace-nowrap">Unité de gestion</th>
            <th class="whitespace-nowrap">E-mail</th>
            <th class="text-center whitespace-nowrap">Programmes</th>
            <th class="text-center whitespace-nowrap">Date de création</th>
            <th class="text-center whitespace-nowrap">ACTIONS</th>
          </tr>
        </thead>
        <tbody v-if="uniteeDeGestions.length > 0">
          <tr v-for="(unite, index) in uniteeDeGestions" :key="index" class="intro-x">
            <!-- <pre>{{ unite }}</pre> -->
            <td class="w-40">
              {{ unite.nom }}
            </td>
            <td>
              {{ unite.user?.email }}
            </td>
            <td class="text-center">Nom du programme</td>
            <td class="w-40">
              {{ unite.created_at }}
            </td>
            <td class="table-report__action w-56">
              <div class="flex justify-center items-center">
                <a class="flex items-center mr-3" href="javascript:;" @click="modifierUniteDeGestion(unite)"> <CheckSquareIcon class="w-4 h-4 mr-1" /> Modifier </a>
                <a class="flex items-center text-danger" href="javascript:;" @click="openDeleteModal(unite)"> <Trash2Icon class="w-4 h-4 mr-1" /> Supprimer </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- END: HTML Table Data -->

  <Modal :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 v-if="!update" class="font-medium text-base mr-auto">Ajouter une unité de gestion</h2>
      <h2 v-else class="font-medium text-base mr-auto">Modifier une unité de gestion</h2>
    </ModalHeader>
    <ModalBody v-if="!update" class="grid grid-cols-12 gap-4 gap-y-3">
      <div class="col-span-12">
        <label for="modal-form-3" class="form-label">Nom</label>
        <input id="modal-form-3" v-model="formAjoutUnite.nom" type="text" class="form-control" placeholder="Nom de l'unité de gestion" />
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
      </div>
      <div class="col-span-12">
        <label for="modal-form-4" class="form-label">E-mail</label>
        <input id="modal-form-4" type="email" v-model="formAjoutUnite.email" class="form-control" placeholder="Ex: a@g.com" />
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.email">{{ messageErreur.email }}</p>
      </div>

      <div class="col-span-12">
        <label for="modal-form-5" class="form-label">Contact</label>
        <input id="modal-form-5" type="number" v-model="formAjoutUnite.contact" class="form-control" placeholder="Contact" />
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.contact">{{ messageErreur.contact }}</p>
      </div>
      <div class="col-span-12">
        <label for="modal-form-6" class="form-label">Programme</label>
        <select id="modal-form-6" class="form-select" v-model="formAjoutUnite.programmeId">
          <option v-for="programme in programmes" :key="programme.id" :value="programme.id">
            {{ programme.nom }}
          </option>
        </select>
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.programmeId">{{ messageErreur.programmeId }}</p>
      </div>
    </ModalBody>
    <ModalBody v-else class="grid grid-cols-12 gap-4 gap-y-3">
      <div class="col-span-12">
        <label for="modal-form-3" class="form-label">Nom</label>
        <input id="modal-form-3" v-model="formUpdate.nom" type="text" class="form-control" placeholder="Nom de l'unité de gestion" />
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
      </div>
      <div class="col-span-12">
        <label for="modal-form-4" class="form-label">E-mail</label>
        <input id="modal-form-4" v-model="formUpdate.email" type="text" class="form-control" placeholder="Ex: 4.1" />
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.email">{{ messageErreur.email }}</p>
      </div>

      <div class="col-span-12">
        <label for="modal-form-5" class="form-label">Contact</label>
        <input id="modal-form-5" type="text" v-model="formUpdate.contact" class="form-control" placeholder="contact" />
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.contact">{{ messageErreur.contact }}</p>
      </div>
      <div class="col-span-12">
        <label for="modal-form-6" class="form-label">Programme</label>
        <select id="modal-form-6" class="form-select" v-model="formUpdate.programmeId">
          <option v-for="programme in programmes" :key="programme.id" :value="programme.id">
            {{ programme.nom }}
          </option>
        </select>
        <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.programmeId">{{ messageErreur.programmeId }}</p>
      </div>
    </ModalBody>
    <ModalFooter>
      <button type="button" @click="showModal = false" class="btn btn-outline-secondary w-20 mr-1">Annuler</button>
      <button v-if="addUniteLoader" class="btn btn-primary mr-1 mb-2">
        Chargement
        <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
      </button>
      <button v-else type="button" class="btn btn-primary w-20" @click="sendForm">
        <span v-if="!update"> Ajouter</span>
        <span v-else> Modifier</span>
      </button>
    </ModalFooter>
  </Modal>

  <!-- Dlete modal  -->
  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal :show="deleteModal" @hidden="deleteModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Etes vous sûr?</div>
        <div class="text-slate-500 mt-2">Voulez vous vraiment supprimer cette unité de gestion ? <br />Ce processus ne peut pas être annulé.</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="deleteModal = false" class="btn btn-outline-secondary w-24 mr-1">Annuler</button>
        <button v-if="deleteLoader" class="btn btn-primary mr-1 mb-2">
          Chargement
          <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
        </button>
        <button v-else type="button" class="btn btn-danger w-24" @click="supprimer">Supprimer</button>
      </div>
    </ModalBody>
  </Modal>
</template>

<script>
import PermissionsService from "@/services/modules/permission.service.js";
import { mapActions, mapMutations, mapGetters } from "vuex";
import extractFormData from "@/utils/extract-data";
import { toast } from "vue3-toastify";
import xlsx from "xlsx";
import Tabulator from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_modern.css";
export default {
  components: {},
  data() {
    return {
      deleteModal: false,
      uniteId: null,
      messageErreur: {},
      uniteeDeGestionAttributs: ["nom", "email", "contact", "programmeId"],
      showModal: false,
      title: "",
      uniteDeGestionVisible: false,
      uniteDeGestionAdd: false,
      uniteDeGestionDelete: false,
      uniteDeGestionUpdate: false,
      champs: [
        { name: "Nom", key: "nom", type: "text", placeholdere: "Nom de  l'unité de gestion", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
        { name: "Email", key: "email", type: "email", placeholdere: "Votre Email", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
        { name: "Contact", key: "contact", type: "number", placeholdere: "Votre contact", isSelect: false, isTextArea: false, data: "", required: true, errors: [] },
        { name: "Programme", key: "programmeId", type: "", placeholdere: "Choisir un programme", isSelect: true, isTextArea: false, data: "", options: this.programmes, cle: "id", value: "nom", required: true, errors: [] },
      ],
      cols: 1,
      headers: [
        { name: "Nom", props: "user", cle: "nom" },
        { name: "Email", props: "user", cle: "email", edit: false },
        { name: "Programme", props: "programme", cle: "nom", edit: false },
        { name: "Date de création", cle: "created_at", edit: false },
      ],
      actions: [{ name: "supprimer", iconne: "" }],
      tabulator: null,
      formUpdate: {
        email: "",
        nom: "",
        contact: "",
        programmeId: "",
      },
      formAjoutUnite: {
        email: "",
        nom: "",
        contact: "",
        programmeId: "",
      },
      update: false,
      showModal: false,
      addUniteLoader: false,
    };
  },

  computed: {
    //importation des variables du module auths

    ...mapGetters({
      hasErrors: "GET_ERREURS",
      isLoading: "IS_LOADING",
      uniteeDeGestion: "uniteeDeGestions/getUniteeDeGestion",
      uniteeDeGestions: "uniteeDeGestions/getUniteeDeGestions",
      programmes: "programmes/getProgrammes",
    }),
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
  },

  methods: {
    modifierUniteDeGestion(data) {
      console.log("data", data);
      this.messageErreur = {};
      this.showModal = true;
      this.update = true;
      this.formUpdate.email = data.user.email;
      this.formUpdate.nom = data.nom;
      this.formUpdate.contact = data.user.contact;
      this.formUpdate.programmeId = data.programme.id;
      this.uniteId = data.id;
    },
    initTabulator() {
      this.tabulator = new Tabulator("#tabulatorUnite", {
        data: this.uniteeDeGestions,

        // printHeader: "<h1 class='pdfPrint' >TABLEAU DE LA PAGE PROJET</h1>",
        selectableRows: true, //assign data to table
        layout: "fitColumns",
        columns: [
          //Define Table Columns
          {
            title: "UNITE DE GESTION",
            field: "nom",
            minWidth: 125,
            hozAlign: "left",
          },
          {
            title: "E-mail",
            field: "user",
            minWidth: 150,
            hozAlign: "left",
            formatter(cell) {
              return `${cell.getData().user.email}`;
            },
          },
          {
            title: "Programme",
            field: "programme",
            minWidth: 150,
            hozAlign: "left",
            formatter(cell) {
              return `${cell.getData().programme.nom}`;
            },
          },

          {
            title: "Date de création",
            minWidth: 200,
            field: "created_at",
            hozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
        ],
      });
    },
    // Export
    onExportCsv() {
      this.tabulator.download("csv", "data.csv");
    },

    onExportJson() {
      this.tabulator.download("json", "data.json");
    },

    onExportXlsx() {
      const win = window;
      win.XLSX = xlsx;
      this.tabulator.download("xlsx", "data.xlsx", {
        sheetName: "Products",
      });
    },

    onExportHtml() {
      this.tabulator.download("html", "data.html", {
        style: true,
      });
    },

    // Print
    onPrint() {
      this.tabulator.print();
    },
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setUniteeDeGestion: "uniteeDeGestions/FILL", // map `this.CREATE_INSTANCE_PROGRAMME()` to `this.$store.commit('CREATE_INSTANCE_PROGRAMME')`
    }),

    ...mapActions("uniteeDeGestions", {
      fetchUniteeDeGestions: "FETCH_LIST_UNITEE_DE_GESTION",
      saveUniteeDeGestion: "STORE_UNITEE_DE_GESTION",
      updateUniteeDeGestion: "UPDATE_UNITEE_DE_GESTION",
      deleteUniteeDeGestion: "DESTROY_UNITEE_DE_GESTION",
    }),

    ...mapActions("programmes", { fetchProgrammes: "FETCH_LIST_PROGRAMME" }),

    getPermission() {
      this.currentUser.role[0].permissions.forEach((element) => {
        if (element.slug === "voir-un-programme") {
          this.uniteDeGestionVisible = true;
        }
        if (element.slug === "creer-un-programme") {
          this.uniteDeGestionAdd = true;
        }
        if (element.slug === "modifier-un-programme") {
          this.uniteDeGestionUpdate = true;
        }
        if (element.slug === "supprimer-un-programme") {
          this.uniteDeGestionDelete = true;
        }
      });
    },

    addUnite() {
      this.messageErreur = {};
      this.title = "Ajouter";
      if (this.uniteId) {
        this.uniteId = null;
      }
      this.update = false;

      let formData = this.champs.map((value) => {
        if (value.key === "programmeId") {
          value["options"] = this.programmes;
        }

        return value;
      });

      this.champs = [...formData];

      this.showCloseModal(true);
    },

    openDeleteModal(data) {
      this.uniteId = data.id;
      this.deleteModal = true;
      console.log(this.uniteId )
    },

    async supprimer() {
      await this.deleteUniteeDeGestion(this.uniteId)
        .then((response) => {
          this.deleteModal = false;
          this.uniteId = null;
          toast.success("Unité de gestion supprimer avec succès");
        })
        .catch((error) => {
          toast.error(error.message);
          console.log(error);
        });
    },

    close() {
      this.showCloseModal();

      this.resetForm();
    },

    showCloseModal(value = false) {
      this.showModal = value;
    },

    resetForm() {
      this.champs = this.champs.map((item) => {
        item.data = "";
        return item;
      });

      window.document.getElementById("vform")?.reset();

      this.setUniteeDeGestion({});
    },

    async updateInputData(id, attribut, value) {
      await this.updateUniteeDeGestion({ uniteeDeGestion: { [attribut]: value }, id: id })
        .catch((value, status) => {
          if (this.hasErrors[attribut] !== undefined) alert(this.hasErrors[attribut]);
        })
        .finally(() => {
          $("#" + "dataTable").load(location.href + "#" + id + ">*", "");
        });
    },

    sendForm() {
      this.champs = this.champs.map((item) => {
        item.errors = [];
        return item;
      });

      let uniteeDeGestion = extractFormData(this.champs, this.uniteeDeGestionAttributs);

      if (typeof uniteeDeGestion.programmeId === "object") uniteeDeGestion.programmeId = uniteeDeGestion.programmeId.id;

      if (this.uniteId) {
        this.updateUniteeDeGestion({ uniteeDeGestion: this.formUpdate, id: this.uniteId })
          .then((response) => {
            this.uniteId = null;
            this.update = false;

            if (response.status == 200 || response.status == 201) {
              this.close();
            }
            toast.success("Modification éffectué avec succès");
          })
          .catch((error) => {
            console.log(error);
            // this.addProgrammeLoader = false;
            toast.error("Erreur lors de la modification");
            if (error.response && error.response.data && error.response.data.errors) {
              this.messageErreur = error.response.data.errors;
            } else {
              toast.error("Une erreur inconnue s'est produite");
            }
            this.isLoading = false;
          });
      } else {
        console.log("uniteeDeGestion3", uniteeDeGestion);
        this.saveUniteeDeGestion(this.formAjoutUnite)
          .then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.close();
            }
          })
          .catch((error) => {
            console.log("erreur", error);
            // this.addProgrammeLoader = false;
            toast.error("Erreur lors de la modification");
            if (error.response && error.response.data && error.response.data.errors) {
              this.messageErreur = error.response.data.errors;
            } else {
              toast.error("Une erreur inconnue s'est produite");
            }
            this.isLoading = false;
          });
      }
    },
  },

  watch: {
    isLoading: function (value) {
      //this.loading = value
    },

    hasErrors: function (errors) {
      this.champs.forEach((value) => {
        value.errors = errors[value.key];
      });
      //this.errors = errors
    },
  },

  mounted() {
    this.fetchUniteeDeGestions().then((value) => {
      setTimeout(() => {
        //  this.initTabulator();
        this.fetchProgrammes();
        this.getPermission();
        if (!this.uniteDeGestionVisible) {
          this.$router.push("/401-non-autorise");
        }
      }, 100);
    });
  },
};
</script>

<style scoped></style>
