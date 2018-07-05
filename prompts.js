module.exports = [
  {
    name: 'name',
    type: 'input',
    message: 'Name of the module (leave empty for initial code)?',
  },
  {
    when: answers => answers.name === '',
    name: 'persist',
    type: 'confirm',
    message: 'Persist the vuex state?',
    default: true,
  },
  {
    when: answers => answers.name !== '',
    name: 'folder',
    type: 'confirm',
    message: 'Make the module a folder?',
    default: false,
  },
];
