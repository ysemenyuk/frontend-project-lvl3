export default {
  string: {
    url: () => ({ key: 'validUrl' }),
  },
  mixed: {
    required: () => ({ key: 'required' }),
    notOneOf: () => ({ key: 'existing' }),
  },
};
