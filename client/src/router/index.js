import Vue from 'vue';
import Router from 'vue-router';
import Ideas from '@/components/Ideas';
import Billing from '@/components/Billing';
import Settings from '@/components/Settings';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Ideas',
      component: Ideas,
    },
    {
      path: '/Settings',
      name: 'Settings',
      component: Settings,
    },
    {
      path: '/Billing',
      name: 'Billing',
      component: Billing,
    },
  ],
});
