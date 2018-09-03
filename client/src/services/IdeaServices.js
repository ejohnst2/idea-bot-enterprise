import Api from '@/services/Api';

export default {
  fetchIdeas() {
    return Api().get('idea');
  },
};
