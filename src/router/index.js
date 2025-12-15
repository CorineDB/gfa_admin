import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import ErrorPage from "../views/error-page/Main.vue";
import Activation from "../views/activation/Main.vue";

// Both

//Paga utilisé
import Utilisateur from "../views/dashboard/utilisateur.vue";
import RequestPassword from "../views/request-password/Main.vue";

import Roles from "../views/dashboard/roles.vue";
import Login from "../views/login/Main.vue";
import ResetPassword from "../views/reset-password/Main.vue";
import NewPassword from "../views/reset-password/_mails/newPassword.vue";
import ResetPasswordFromDashboard from "../views/dashboard/resetPasswordFromDashboard.vue";

import programme from "../views/gfa/programme/index.vue";
import unite_gestion from "../views/gfa/unite-gestion/index.vue";
import ResetPasswordConnect from "../views/reset_password/Main.vue";


const routes = [
  {
    path: "/dashboard",
    component: SideMenu,
    name: "dashboard",
    children: [
      {
        path: "programme",
        name: "programme",
        component: programme,
      },
      {
        path: "unite-gestion",
        name: "unite_gestion",
        component: unite_gestion,
      },
      {
        path: "roles",
        name: "Roles",
        component: Roles,
      },
      {
        path: "utilisateurs",
        name: "Utilisateur",
        component: Utilisateur,
      },

      {
        path: "resetPassword",
        name: "ResetPasswordFromDashboard",
        component: ResetPasswordFromDashboard,
      },
    ],
  },

  {
    path: "/",
    name: "login",
    component: Login,
  },

  {
    path: "/reset-password",
    name: "resetPassword",
    component: ResetPassword,
  },
  {
    path: "/activation/:t",
    name: "activation",
    component: Activation,
  },

  {
    path: "/reset_password/:t",
    name: "reset_Password",
    component: ResetPasswordConnect,
  },
  {
    path: "/request-password",
    name: "request_password",
    component: RequestPassword,
  },
  {
    path: "/password_update",
    name: "NewPassword",
    component: NewPassword,
  },
  {
    path: "/error-page",
    name: "error-page",
    component: ErrorPage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("authenticateUser");

  // Permettre l'accès à certaines routes spécifiques sans authentification
  if (["ToolsPerception", "activation", "reset_Password", "view_survey", "request_password", "reset_Password"].includes(to.name)) {
    next();
  }
  // Si authentifié et qu'on essaie d'aller sur "/", rediriger vers "/projet"
  else if (isAuthenticated && to.path === "/") {
    next("/dashboard/projets");
  }
  // Si non authentifié et qu'on essaie d'accéder à une autre page que "/", rediriger vers "/"
  else if (!isAuthenticated && to.path !== "/") {
    next("/");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  // Permettre l'accès à la route "toolsPerception" quel que soit l'état d'authentification
  if (["request_password", "reset_Password","activation"].includes(to.name)) {
    next();
  }
  // Rediriger vers "/" si non authentifié et que la route n'est pas la page d'accueil
  else if (!localStorage.getItem("authenticateUser") && to.path !== "/") {
    next("/");
  } else {
    next();
  }

  // next()
});

export default router;
