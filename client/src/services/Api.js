import axios from 'axios';

export default() => {
  return axios.create({
    baseURL: 'https://idea-machine-enterprise.herokuapp.com', // || 'http://localhost:3000'
    json: true,
  });
};
