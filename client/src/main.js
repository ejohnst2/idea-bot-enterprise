// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'vuetify/dist/vuetify.min.css';
import Vuetify from 'vuetify';
import axios from 'axios';

import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

/**
 * @desc override axios default config to pass cookie session to vue instance on requests
 * @see https://github.com/expressjs/session/issues/464#issuecomment-306044124
 */
axios.defaults.withCredentials = true;

Vue.use(Vuetify);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
