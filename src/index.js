import _ from 'lodash';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function component() {
  const element = document.createElement('div');
  element.textContent = _.join(['Hello', 'webpack', '!!!'], ' ');
  element.classList.add('hello');
  document.body.prepend(element);
  return element;
}

component();
