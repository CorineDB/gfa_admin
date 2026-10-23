import { defineStore } from "pinia";

export const useSideMenuStore = defineStore("sideMenu", {
    state: () => ({
        menu: [{
                icon: "HomeIcon",
                pageName: "Dashboard",
                title: "Tableau de bord",
            }, {
                icon: "BoxIcon",
                pageName: "programme",
                title: "Programmes",
            }, {
                icon: "BuildingIcon",
                pageName: "Clients",
                title: "Clients",
            }, {
                icon: "ListIcon",
                pageName: "unite_gestion",
                title: "Unités de gestion",
            },

            {
                icon: "UnlockIcon",
                pageName: "Roles",
                title: "Roles & Permissions",
            },
            {
                icon: "UsersIcon",
                pageName: "Utilisateur",
                title: "Utilisateurs",
            },
        ],
    }),
});