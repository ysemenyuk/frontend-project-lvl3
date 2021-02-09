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
const pathToRssResp = path.join('__fixtures__', 'rssResponse.json');
const pathToNotRssResp = path.join('__fixtures__', 'notRssResponse.json');

const elements = {};

beforeEach(async () => {
  document.body.innerHTML = await fsp.readFile(pathToIndex, 'utf-8');

  elements.input = screen.getByRole('textbox');
  elements.submit = screen.getByRole('button');
  elements.feedback = screen.getByRole('feedback');

  run();
});

test('test1 valid input', async () => {
  userEvent.type(elements.input, 'notUrl');
  userEvent.click(elements.submit);

  await waitFor(() => {
    expect(elements.feedback).toHaveTextContent(/Must be valid url/i);
  });
});

test('test2 network error', async () => {
  const url = 'http://test.ru/feed';

  const scope = nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get')
    .query({ url, disableCache: true })
    .replyWithError('no inet');

  userEvent.type(elements.input, url);
  userEvent.click(elements.submit);

  await waitFor(() => {
    expect(elements.feedback).toHaveTextContent(/Network Error/i);
  });

  scope.done();
});

test('test4 not rss', async () => {
  const url = 'http://test.ru';
  const notRssResp = await fsp.readFile(pathToNotRssResp, 'utf-8');

  const scope = nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get')
    .query({ url, disableCache: true })
    .reply(200, notRssResp);

  userEvent.type(elements.input, url);
  userEvent.click(elements.submit);

  await waitFor(() => {
    expect(elements.feedback).toHaveTextContent(/This source doesn't contain valid rss/i);
  });

  scope.done();
});

test('test5 add feed and post and check exist url', async () => {
  const url = 'http://test.ru/feed';
  const rssResp = await fsp.readFile(pathToRssResp, 'utf-8');

  const scope = nock('https://hexlet-allorigins.herokuapp.com')
    .persist()
    .get('/get')
    .query({ url, disableCache: true })
    .reply(200, rssResp);

  userEvent.type(elements.input, url);
  expect(elements.submit).toBeEnabled();

  userEvent.click(elements.submit);
  await waitFor(() => {
    expect(elements.submit).toBeDisabled();
  });

  await waitFor(() => {
    expect(elements.feedback).toHaveTextContent(/Loading.../i);
  });

  await waitFor(() => {
    expect(elements.feedback).toHaveTextContent(/Rss has been loaded/i);
  });

  await waitFor(() => {
    expect(elements.submit).toBeEnabled();
  });

  expect(await screen.findByText(/Lorem ipsum feed for an interval/i)).toBeInTheDocument();
  expect(await screen.findByText(/Lorem ipsum 2021-02-03T21:08:00Z/i)).toBeInTheDocument();

  userEvent.type(elements.input, url);
  userEvent.click(elements.submit);

  await waitFor(() => {
    expect(elements.feedback).toHaveTextContent(/Rss already exists/i);
  });

  scope.done();
  scope.persist(false);
});
