import fs from 'fs';
import path from 'path';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import run from '../src/app';

const fsp = fs.promises;
nock.disableNetConnect();
axios.defaults.adapter = httpAdapter;

const pathToIndex = path.join('__fixtures__', 'index.html');
const pathToResponse = path.join('__fixtures__', 'response.json');
// const response = await fsp.readFile(pathToResponse, 'utf-8');

let submit;
let input;
let feedback;

beforeEach(async () => {
  document.body.innerHTML = await fsp.readFile(pathToIndex, 'utf-8');
  submit = screen.getByRole('button');
  input = screen.getByRole('textbox');
  feedback = screen.getByRole('feedback');

  run();
});

test('test1 validate input', () => {
  userEvent.type(input, '12345');
  userEvent.click(submit);

  expect(feedback).toHaveTextContent('Must be valid url');
});

test('test2 network error', async () => {
  const url = 'http://test.ru/feed';

  nock('http://test.ru')
    .get('/feed')
    .reply(404, '');

  userEvent.type(input, url);
  userEvent.click(submit);

  expect(feedback).toHaveTextContent('Loading...');

  await waitFor(() => {
    expect(feedback).toHaveTextContent('Network Error');
  });
});

test('test3', async () => {
  const url = 'http://test.ru/feed';
  const response = await fsp.readFile(pathToResponse, 'utf-8');

  nock('http://hexlet-allorigins.herokuapp.com')
    .get('/get?url=http%3A%2F%2Ftest.ru%2Ffeed&disableCache=true')
    .reply(200, response);

  // nock('http://test.ru')
  //   .get('/feed')
  //   .reply(200, response);

  userEvent.type(input, url);
  userEvent.click(submit);

  expect(feedback).toHaveTextContent('Loading...');

  await waitFor(() => {
    expect(feedback).toHaveTextContent('Rss has been loaded');
  });
});
