// import _ from 'lodash';
// import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const printAuthor = () => {
  const element = document.createElement('div');
  element.classList.add('text-center');
  element.innerHTML = 'created by <a href="https://github.com/ysemenyuk/frontend-project-lvl3" target="_blank">y.semenyuk</a>';
  const footerConteiner = document.querySelector('.container-xl');
  footerConteiner.append(element);
  return element;
};

printAuthor();
