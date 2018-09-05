import Vue from 'vue';
import Router from 'vue-router';
import Ideas from '@/components/Ideas';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Ideas',
      component: Ideas,
    },
  ],
});
