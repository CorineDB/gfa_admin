import { defineStore } from "pinia";

export const useSideMenuStore = defineStore("sideMenu", {
    state: () => ({
        menu: [{
                icon: "BoxIcon",
                pageName: "programme",
                title: "Programme",
            }, {
                icon: "ListIcon",
                pageName: "unite_gestion",
                title: "Unité degestion",
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