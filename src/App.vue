<template>
  <v-app >
    <v-expand-transition>
      <v-app-bar 
        class="transitonImportant"
        v-show="appbar" 
        color="primary" 
        density="comfortable" 
      >
        <v-app-bar-nav-icon @click="drawer = !drawer" tile></v-app-bar-nav-icon>
        <v-app-bar-title>E-commerce</v-app-bar-title>
        <v-switch
          color="primary"
          v-model="darkMode"
          hide-details
          base-color="secondary"
          @change="toggleTheme()"
          :label="` ${darkMode ? 'Dark Mode' : 'Light Mode'}!`">
        </v-switch>
        <v-btn @click="closeShop()" prepend-icon="mdi-arrow-left-circle">back</v-btn>
      </v-app-bar>
    </v-expand-transition>
    
    <v-navigation-drawer color="primary" v-model="drawer" class="transitonImportant">
      <v-list-item>
        <v-list-item-title class="headline">
          <img src="/images/user.png" alt="Profile Icon" class="mr-2" style="width: 24px; height: 24px;">
          Norwel Nunez
        </v-list-item-title>
      </v-list-item>
      <div class="pa-2">
      </div>
    </v-navigation-drawer>

    <transition name="slide-up" mode="out-in">
      <v-main v-if="main" style="min-height:100vh!important;" class="transitonImportant bg-secondary">
        <Product />
      </v-main>
    </transition>

  </v-app>
</template>

<script setup>
import Product from '@/views/Product.vue'
import {ref, onMounted, onBeforeUnmount} from 'vue'
import { useTheme } from "vuetify";
import { mainStore } from './stores/mainStore.js'
import { storeToRefs } from 'pinia'
const store = mainStore()
const { DarkMode, shopState } = storeToRefs(store)
const drawer = ref(false)
const appbar =ref(false)
const main = ref(false)
const theme = useTheme();
const darkMode = ref(false);
const openShopButton = ref(true)
let inactivityTimeout = null;

const toggleTheme = () => {
    theme.global.name.value = darkMode.value ? "customDarkTheme" : "customLightTheme";
    localStorage.setItem('theme', darkMode.value ? 'dark' : 'light');
    DarkMode.value = DarkMode.value ? 'dark' : 'light'
};


function closeShop(){
  localStorage.setItem('shopState', 'true');
  setTimeout(() => {
    main.value = false
    setTimeout(() => {
      appbar.value = false  
      setTimeout(() => {
        drawer.value = false
        setTimeout(() => {
          location.reload()
        }, 700);
      }, 100);
    }, 100);

  }, 300);
}

const clearShopState = () => {
    localStorage.setItem('shopState', 'true');;
    openShopButton.value = true;
};

const resetInactivityTimeout = () => {
    if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
    }
      inactivityTimeout = setTimeout(clearShopState, 3000000);
    
};

const setupInactivityListeners = () => {
    window.addEventListener('mousemove', resetInactivityTimeout);
    window.addEventListener('click', resetInactivityTimeout);
    window.addEventListener('keypress', resetInactivityTimeout);
};

onBeforeUnmount(() => {
    clearTimeout(inactivityTimeout);
    window.removeEventListener('mousemove', resetInactivityTimeout);
    window.removeEventListener('click', resetInactivityTimeout);
    window.removeEventListener('keypress', resetInactivityTimeout);
});

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        darkMode.value = savedTheme === 'dark';
        theme.global.name.value = darkMode.value ? "customDarkTheme" : "customLightTheme";
    }

    const shopState = localStorage.getItem('shopState');
    if (shopState === 'false') {
      openShopButton.value = false;
      setTimeout(() => {
        appbar.value = true
        setTimeout(() => {
            main.value = true  
          }, 300);
          setTimeout(() => {
            drawer.value = true
          }, 100);
      }, 400);
    }

    setupInactivityListeners();
    resetInactivityTimeout();
});
</script>
