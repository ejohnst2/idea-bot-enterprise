import Api from '@/services/Api';

export default {
  getIdeas() {
    return Api().get('idea');
  },
};
