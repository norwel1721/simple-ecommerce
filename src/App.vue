<template>
  <v-app >
    <v-expand-transition>
      <v-app-bar 
        class="transitonImportant"
        v-show="appbar" 
        color="primary" 
        density="comfortable" 
        scroll-behavior="elevate"
      >
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
        <v-btn @click="closeShop()">back</v-btn>
      </v-app-bar>
    </v-expand-transition>
    
    <v-navigation-drawer v-model="drawer" class="transitonImportant">
      <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
      <v-divider></v-divider>
      <div class="pa-2">
        <v-text-field>
        </v-text-field>
      </div>
    </v-navigation-drawer>

    <transition name="slide-up" mode="out-in">
      <v-main v-if="main" style="min-height:100vh!important;" class="transitonImportant">
        <Product />
      </v-main>
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


function closeShop(){
  localStorage.setItem('shopState', 'true');
  setTimeout(() => {
    main.value = false
    setTimeout(() => {
      drawer.value = false
      setTimeout(() => {
        appbar.value = false  
        setTimeout(() => {
          location.reload()
        }, 1000);
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
