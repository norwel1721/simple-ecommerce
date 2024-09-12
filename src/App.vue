<template>
  <v-app >
    <v-expand-transition>
      <v-app-bar v-show="appbar" color="primary" density="comfortable" scroll-behavior="elevate" >
        <v-app-bar-nav-icon @click="drawer = !drawer" tile></v-app-bar-nav-icon>
        <v-app-bar-title>Application Bar</v-app-bar-title>
        <v-switch
          color="primary"
          v-model="darkMode"
          hide-details
          base-color="secondary"
          @change="toggleTheme()"
          :label="` ${darkMode ? 'Dark Mode' : 'Light Mode'}!`">
        </v-switch>
      </v-app-bar>
    </v-expand-transition>
    
    <v-navigation-drawer v-model="drawer">
      <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
      <v-divider></v-divider>
      <v-list-item link title="List Item 1"></v-list-item>
      <v-list-item link title="List Item 2"></v-list-item>
      <v-list-item link title="List Item 3"></v-list-item>
    </v-navigation-drawer>

    <transition name="slide-up" mode="out-in">
      <v-main v-if="main" style="min-width:100vh!important;">
        <Product />
      </v-main>
    </transition>
    <transition name="slide-up" mode="out-in">
      <div v-if="openShopButton" class="position-relative h-100 w-100 bg-primary landing-page">
        <v-sheet color="#eff2f345" class="pa-2 " max-width="500px" rounded>
          Discover unique products, curated just for you
          <v-btn class="ml-2" @click="openShop()">Shop Now!</v-btn>
        </v-sheet>
      </div>
    </transition>
  </v-app>
</template>

<script setup>
import Product from '@/views/Product.vue'
import {ref, onMounted, onBeforeUnmount} from 'vue'
import { useTheme } from "vuetify";


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
};


function openShop(){
  openShopButton.value = false
  localStorage.setItem('shopState', 'false');
  
  setTimeout(() => {
    appbar.value = true
    setTimeout(() => {
      drawer.value = true
      setTimeout(() => {
        main.value = true  
      }, 100);
    }, 100);

  }, 300);
}

const clearShopState = () => {
    localStorage.removeItem('shopState');
    openShopButton.value = true;
};

const resetInactivityTimeout = () => {
    if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
    }
      inactivityTimeout = setTimeout(clearShopState, 300000);
    
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
          drawer.value = true
          setTimeout(() => {
            main.value = true  
          }, 100);
        }, 100);

      }, 300);
    }

    setupInactivityListeners();
    resetInactivityTimeout();
});
</script>
