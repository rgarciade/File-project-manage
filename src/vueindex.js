import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './views/app';
import openfilesbutton from './vuecomponents/openfilesbutton';
import buttontoltip from './vuecomponents/buttontoltip';

(async function init() {

    await Vue.use(Vuetify, {
        iconfont: 'md',
        theme: {
            primary: "#37474F",
            secondary: "#424242",
            accent: "#F57C00",
            error: "#FF5252",
            warning: "#FDD835",
            info: "#82B1FF",
            success: "#81C784"
        }
    })
    Vue.component('openfilesbutton', openfilesbutton)
    Vue.component('buttontoltip', buttontoltip)
    new Vue({
        el: '#app',
        render: h => h(App, {
            props: {}
        })
    })
})()