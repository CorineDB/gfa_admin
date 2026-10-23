<template>
  <!-- BEGIN: Top Bar -->
  <div class="top-bar">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}</div>
        <div class="text-slate-500 mt-1">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- realtime notifications -->
    <RealtimeNotification />
    <!-- toast notification -->
    <!-- BEGIN: Breadcrumb -->

    <nav aria-label="breadcrumb" class="-intro-x mr-auto hidden sm:flex">
      <ol class="breadcrumb breadcrumb-light">
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          class="breadcrumb-item"
          :class="{ active: index === breadcrumbs.length - 1 }"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          <router-link v-if="crumb.to && index !== breadcrumbs.length - 1" :to="crumb.to">
            {{ crumb.label }}
          </router-link>
          <span v-else>{{ crumb.label }}</span>
        </li>
      </ol>
    </nav>

    <!-- END: Breadcrumb -->

    <!-- BEGIN: Notifications -->
    <!-- <Dropdown class="intro-x mr-auto sm:mr-6">
      <DropdownToggle tag="div" role="button" class="notification notification--bullet cursor-pointer">
        <BellIcon class="notification__icon dark:text-slate-500" />
      </DropdownToggle>
      <DropdownMenu class="notification-content pt-2">
        <DropdownContent tag="div" class="notification-content__box">
          <div class="notification-content__title">Notifications</div>
          <div v-for="(faker, fakerKey) in $_.take($f(), 5)" :key="fakerKey"
            class="cursor-pointer relative flex items-center" :class="{ 'mt-5': fakerKey }">
            <div class="w-12 h-12 flex-none image-fit mr-1">
              <img alt="Tinker Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" />
              <div
                class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600">
              </div>
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a href="javascript:;" class="font-medium truncate mr-5">{{
                  faker.users[0].name
                }}</a>
                <div class="text-xs text-slate-400 ml-auto whitespace-nowrap">
                  {{ faker.times[0] }}
                </div>
              </div>
              <div class="w-full truncate text-slate-500 mt-0.5">
                {{ faker.news[0].shortContent }}
              </div>
            </div>
          </div>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown> -->
    <!-- END: Notifications -->

    <!-- BEGIN: Account Menu -->

    <button
      type="button"
      class="intro-x relative flex items-center justify-center w-8 h-8 mr-3 rounded-full hover:bg-white/10"
      title="Notifications non lues"
      @click="loadUnreadNotifications"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full"
      >
        {{ unreadCount > 99 ? "99+" : unreadCount }}
      </span>
    </button>

    <Dropdown class="intro-x w-8 h-8">
      <DropdownToggle tag="div" role="button" class="dropdown-toggle image-fit zoom-in">
        <div class="flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full shadow-lg cursor-pointer">
          <img v-if="usersProfileImage" :src="usersProfileImage" alt="" />
          <span v-else class="text-sm font-bold p-2 text-white uppercase"> {{ currentUsers.initiale }} </span>
        </div>
      </DropdownToggle>
      <DropdownMenu class="w-56">
        <DropdownContent class="bg-primary text-white">
          <DropdownHeader tag="div" class="!font-normal">
            <div class="font-medium">
              <span> {{ currentUsers.nom }} {{ currentUsers.prenom }} </span>
            </div>
            <div class="text-xs text-white/70 mt-0.5 dark:text-slate-500">
              {{ currentUsers.role }}
            </div>
          </DropdownHeader>
          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem class="dropdown-item hover:bg-white/5">
            <span @click="gotoProfil" class="flex space-y-2 w-full" to=""> <UserIcon class="w-4 h-4 mr-2" /> Profil </span>
          </DropdownItem>
          <DropdownItem class="dropdown-item hover:bg-white/5">
            <router-link class="flex space-y-2 w-full" to="/dashboard/profil/reset-password"> <LockIcon class="w-4 h-4 mr-2" /> Réinitialiser le Mot de Passe </router-link>
          </DropdownItem>

          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem class="dropdown-item hover:bg-white/5">
            <span class="cursor-pointer flex space-x-2 items-center" @click="logout"> <ToggleRightIcon class="w-4 h-4 mr-2" /> Se déconnecter </span>
          </DropdownItem>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>

    <!-- END: Account Menu -->
  </div>
  <!-- END: Top Bar -->

  <!-- BEGIN: Search -->
  <!--     <div class="intro-x relative mr-3 sm:mr-6">
      <div class="search hidden sm:block">
        <input
          type="text"
          class="search__input form-control border-transparent"
          placeholder="Rechercher"
          @focus="showSearchDropdown"
          @blur="hideSearchDropdown"
        />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
      <a class="notification sm:hidden" href="">
        <SearchIcon class="notification__icon dark:text-slate-500" />
      </a>
      <div class="search-result" :class="{ show: searchDropdown }">
        <div class="search-result__content">
          <div class="search-result__content__title">Pages</div>
          <div class="mb-5">
            <a href="" class="flex items-center">
              <div
                class="w-8 h-8 bg-success/20 dark:bg-success/10 text-success flex items-center justify-center rounded-full"
              >
                <InboxIcon class="w-4 h-4" />
              </div>
              <div class="ml-3">Mail Settings</div>
            </a>
            <a href="" class="flex items-center mt-2">
              <div
                class="w-8 h-8 bg-pending/10 text-pending flex items-center justify-center rounded-full"
              >
                <UsersIcon class="w-4 h-4" />
              </div>
              <div class="ml-3">Users & Permissions</div>
            </a>
            <a href="" class="flex items-center mt-2">
              <div
                class="w-8 h-8 bg-primary/10 dark:bg-primary/20 text-primary/80 flex items-center justify-center rounded-full"
              >
                <CreditCardIcon class="w-4 h-4" />
              </div>
              <div class="ml-3">Transactions Report</div>
            </a>
          </div>
          <div class="search-result__content__title">Users</div>
          <div class="mb-5">
            <a
              v-for="(faker, fakerKey) in $_.take($f(), 4)"
              :key="fakerKey"
              href
              class="flex items-center mt-2"
            >
              <div class="w-8 h-8 image-fit">
                <img
                  alt="Tinker Tailwind HTML Admin Template"
                  class="rounded-full"
                  :src="faker.photos[0]"
                />
              </div>
              <div class="ml-3">{{ faker.users[0].name }}</div>
              <div
                class="ml-auto w-48 truncate text-slate-500 text-xs text-right"
              >
                {{ faker.users[0].email }}
              </div>
            </a>
          </div>
          <div class="search-result__content__title">Products</div>
          <a
            v-for="(faker, fakerKey) in $_.take($f(), 4)"
            :key="fakerKey"
            href
            class="flex items-center mt-2"
          >
            <div class="w-8 h-8 image-fit">
              <img
                alt="Tinker Tailwind HTML Admin Template"
                class="rounded-full"
                :src="faker.images[0]"
              />
            </div>
            <div class="ml-3">{{ faker.products[0].name }}</div>
            <div
              class="ml-auto w-48 truncate text-slate-500 text-xs text-right"
            >
              {{ faker.products[0].category }}
            </div>
          </a>
        </div>
      </div>
    </div> -->
  <!-- END: Search -->
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from "vue";
import { useAuthStore } from "@/stores/modules/authentification";
import AuthentificationService from "@/services/modules/authentification.service";
import { useRouter, useRoute } from "vue-router";
import { API_BASE_URL } from "@/services/configs/environment";
import RealtimeNotification from "@/components/Notification.vue";
import vuexStore from "@/stores/index";
import NotificationService from "@/services/modules/notification.service.js";
const router = useRouter();
const route = useRoute();
const searchDropdown = ref(false);
const showSearchDropdown = () => {
  searchDropdown.value = true;
};
const hideSearchDropdown = () => {
  searchDropdown.value = false;
};

const breadcrumbs = computed(() => {
  const title = route.meta?.title;
  if (route.name === "Dashboard") {
    return [{ label: title || "Tableau de bord" }];
  }

  const items = [{ label: "Tableau de bord", to: "/dashboard" }];
  if (Array.isArray(route.meta?.breadcrumb)) {
    items.push(...route.meta.breadcrumb);
  }
  if (title) {
    items.push({ label: title });
  } else if (route.name) {
    items.push({ label: String(route.name) });
  }
  return items;
});

const store = useAuthStore();
const currentUsers = reactive({});
const successNotification = ref();
const initiale = ref();

const message = reactive({
  type: "success",
  message: "",
});

const usersProfileImage = ref("");
const unreadCount = computed(() => vuexStore.getters.getCount);

const loadUnreadNotifications = () => {
  NotificationService.get()
    .then((response) => {
      const datas = response?.data?.data ?? [];
      vuexStore.commit("updateCounter", Array.isArray(datas) ? datas.length : 0);
    })
    .catch(() => {});
};

onMounted(() => {
  loadUnreadNotifications();
  const usersInfo = JSON.parse(localStorage.getItem("authenticateUser")) || {};
  const user = usersInfo.users || usersInfo;
  const roles = Array.isArray(user.roles) ? user.roles : Array.isArray(user.role) ? user.role : user.role ? [user.role] : [];

  currentUsers.nom = user.nom || "";
  currentUsers.prenom = user.prenom || "";
  currentUsers.role = roles.map((role) => role.nom).filter(Boolean).join(", ") || user.type || "";
  initiale.value = [(user.nom || "")[0], (user.prenom || "")[0]].filter(Boolean).join("").toUpperCase();
  currentUsers.initiale = initiale.value;

  if (user.profil) {
    usersProfileImage.value = /^https?:\/\//i.test(user.profil)
      ? user.profil
      : `${API_BASE_URL.replace(/\/$/, "")}/${String(user.profil).replace(/^\//, "")}`;
  }
});

const logout = () => {
  AuthentificationService.logout()
    .then(() => {
      localStorage.clear();
      store.resetInfo();
      setTimeout(() => {
        router.push("/");
      }, 3000);
      message.type = "success";
      message.message = "Vous etes déconnecté";
      successNotificationToggle();
      //toast success
    
    })
    .catch((error) => {
      if (error.response) {
        const message = error.response.data.message;
        message.type = "erreur";
        message.message = message;
        successNotificationToggle();
      }
    });
};

const gotoProfil = () => {
  router.push("/dashboard/profil");
};
provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};
</script>
