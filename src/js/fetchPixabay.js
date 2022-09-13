const axios = require('axios').default;

const API_KEY = `29781488-c1f8f32b8cf0d06ff300c84b0`;
const OPTIONS = `image_type=photo&orientation=horizontal&safesearch=true&lang=en&lang=uk&per_page=40`;

export function fetchPixabay (searchQueryInput, page) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQueryInput}&${OPTIONS}&page=${page}`;
  return axios.get(url)
  
  // return fetch(url)
  // .then(r => r.json()
     
    
  // )
}

