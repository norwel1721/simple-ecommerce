import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './styles/transition.css'
import './styles/cards.css'
import App from './App.vue';
import LandingPage from './LandingPage.vue';
import vuetify from './plugins/vuetify'



const app = createApp({});
const pinia = createPinia();
// const shopState = localStorage.getItem('shopState');

// if (shopState === 'true') {
//     app.component('LandingPage', LandingPage);
// } else {
//     app.component('App', App);
// }
app.component('LandingPage',LandingPage)
app.component('App',App)
app.use(pinia);
app.use(vuetify);
app.mount('#app');
