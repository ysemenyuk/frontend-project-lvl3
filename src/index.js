// import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const getResponse = () => {
  const form = document.querySelector('form');
  // const feeds = document.querySelector('.feeds');
  // const posts = document.querySelector('.posts');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    console.log(1, url);

    axios.get(url)
      .then((response) => {
        console.log(response.data);
      });
  });
};

getResponse();
