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
        name: 'Add New Poem',
        value: './bin/new/index.mjs'
      },
      {
        key: 'u',
        name: 'Update Everything',
        value: './bin/make/index.mjs'
      },
      {
        key: 'p',
        name: 'Publish To Github',
        value: './bin/publish/index.sh'
      },
      {
        key: 'j',
        name: 'Resize Images',
        value: './bin/resize/index.sh'
      },
      {
        key: 'j',
        name: 'Convert PNG to JPG',
        value: './bin/tojpg/index.sh'
      },
      {
        key: 'k',
        name: 'New Build System',
        value: './bin/build/all.sh'
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
