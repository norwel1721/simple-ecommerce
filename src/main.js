import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './styles/transition.css'
import './styles/pagination.css'
import './styles/cards.css'
import App from './App.vue';
import LandingPage from './LandingPage.vue';
import vuetify from './plugins/vuetify'



const app = createApp({});
const pinia = createPinia();
app.component('LandingPage',LandingPage)
app.component('App',App)
app.use(pinia);
app.use(vuetify);
app.mount('#app');
