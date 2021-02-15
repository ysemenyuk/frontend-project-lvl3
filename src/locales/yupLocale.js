export default {
  string: {
    url: () => ({ key: 'inputUrlErr' }),
  },
  mixed: {
    required: () => ({ key: 'required' }),
    notOneOf: () => ({ key: 'existingUrlErr' }),
  },
};
