#!/usr/bin/env -S node --experimental-modules

import { exec } from 'child_process' ;
import inquirer from 'inquirer';
const prompt = inquirer.prompt;
let operate = 1;
const questions = [
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      {
        key: 'a',
        name: 'Add New Entry',
        value: './bin/new/index.mjs'
      },
      {
        key: 'c',
        name: 'Update Everything',
        value: './bin/make/index.mjs'
      },
      {
        key: 'g',
        name: 'Publish To Github',
        value: 'publish'
      },
      {
        key: 'g',
        name: 'Convert PNG to JPG',
        value: './bin/tojpg/index.sh'
      },

      {
        key: 'x',
        name: 'Exit Menu',
        value: 'exit-menu',
      },

    ],
  },
];

function execute(answers){
  return new Promise(function(OK, NO){
    if(answers.action === 'exit-menu'){
      operate = false;
      return OK();
    }
    console.log(`Executing ${answers.action}`);
    exec(answers.action, (err, stdout, stderr) => {
      if (err) {
        if(stderr) console.log(`${stderr}`);
        NO(err);
      } else {
       if(stdout) console.log(`${stdout}`);
       if(stderr) console.log(`${stderr}`);
      }
    })
    .on('exit', (code) => {
      console.log('');
      operate++;
      OK();
    });
  });
}

async function main(){
  await execute({action: './bin/banner/index.mjs'})
  while(operate){
    const anwsers = await prompt(questions);
    await execute(anwsers);
  }
}

main();
