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

let input;
let submit;
let feedback;
// let feeds;
// let posts;

beforeEach(async () => {
  document.body.innerHTML = await fsp.readFile(pathToIndex, 'utf-8');

  input = screen.getByRole('textbox');
  submit = screen.getByRole('button');
  feedback = screen.getByRole('feedback');
  // feeds = screen.getByRole('feeds');
  // posts = screen.getByRole('posts');

  run();
});

test('test1 valid input', () => {
  userEvent.type(input, 'notUrl');
  userEvent.click(submit);

  expect(feedback).toHaveTextContent(/Must be valid url/i);
});

test('test2 network error', async () => {
  const url = 'http://test.ru/feed';

  const scope = nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get')
    .query({ url, disableCache: true })
    .replyWithError('Network Error');

  userEvent.type(input, url);
  userEvent.click(submit);

  await waitFor(() => {
    expect(feedback).toHaveTextContent(/Network Error/i);
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

  userEvent.type(input, url);
  userEvent.click(submit);

  await waitFor(() => {
    expect(feedback).toHaveTextContent(/This source doesn't contain valid rss/i);
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

  userEvent.type(input, url);
  expect(submit).not.toBeDisabled();

  userEvent.click(submit);
  expect(submit).toBeDisabled();

  expect(feedback).toHaveTextContent(/Loading.../i);

  await waitFor(() => {
    expect(feedback).toHaveTextContent(/Rss has been loaded/i);
  });

  await waitFor(() => {
    expect(submit).not.toBeDisabled();
  });

  expect(await screen.findByText(/Lorem ipsum feed for an interval/i)).toBeInTheDocument();
  expect(await screen.findByText(/Lorem ipsum 2021-02-03T21:08:00Z/i)).toBeInTheDocument();

  userEvent.type(input, url);
  userEvent.click(submit);

  await waitFor(() => {
    expect(feedback).toHaveTextContent(/Rss already exists/i);
  });

  scope.done();
  scope.persist(false);
});
