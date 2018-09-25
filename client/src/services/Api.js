import axios from 'axios';

export default() => {
  return axios.create({
    baseURL: 'http://localhost:3000', // || 'https://idea-machine-enterprise.herokuapp.com'
    json: true,
  });
};
