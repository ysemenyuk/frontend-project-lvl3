import fs from 'fs';
import path from 'path';

import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import nock from 'nock';

import run from '../src/app';

const pathToIndex = path.join('__fixtures__', 'index.html');
// const pathToResponse = path.join('__fixtures__', 'response.json');

const elements = {};
// let response;

beforeAll(() => {
  nock.disableNetConnect();
});

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(pathToIndex, 'utf-8');
  // response = fs.readFileSync(pathToResponse, 'utf-8');

  elements.submit = screen.getByRole('button');
  elements.input = screen.getByRole('textbox');
  elements.feedback = screen.getByRole('feedback');

  run();
});

test('test1', () => {
  const url = 'http://localhost/feed';
  const scope = nock('http://localhost')
    .get('/feed')
    .reply(400);

  userEvent.type(elements.input, url);
  userEvent.click(elements.submit);
  expect(elements.feedback).toHaveTextContent('Network Error');
  expect(screen.getByText('Network Error')).toBeInTheDocument();

  scope.done();
});

test('validate', () => {
  userEvent.type(elements.input, '123');
  userEvent.click(elements.submit);
  expect(elements.feedback).toHaveTextContent('Must be valid url');
  expect(screen.getByText('Must be valid url')).toBeInTheDocument();
});

test('test2', () => {
  const url = 'http://localhost/feed';

  userEvent.type(elements.input, url);
  expect(elements.submit).not.toBeDisabled();
  userEvent.click(elements.submit);
  expect(elements.submit).toBeDisabled();
});
