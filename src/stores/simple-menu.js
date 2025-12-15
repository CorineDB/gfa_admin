import { defineStore } from "pinia";

export const useSimpleMenuStore = defineStore("simpleMenu", {
    state: () => ({
        menu: [{
                icon: "ListIcon",
                pageName: "programme",
                title: "Programme",
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