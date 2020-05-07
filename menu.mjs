#!/usr/bin/env -S node --experimental-modules

import { exec } from 'child_process' ;
import inquirer from 'inquirer';


console.log('Hi, Welcome to Cat Pea Poetry Club');

var questions = [
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      {
        key: 'a',
        name: 'Add New Entry',
        value: './add-new.mjs'
      },
      {
        key: 'c',
        name: 'Update Everything',
        value: './make-all.mjs'
      },
      {
        key: 'g',
        name: 'Publish To Github',
        value: 'publish'
      },

    ],
  },
];

inquirer.prompt(questions).then(answers => {
  exec(answers.action, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
     console.log(`${stdout}`);
     //console.log(`${stderr}`);
    }
  });
});
