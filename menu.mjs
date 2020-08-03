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
        key: 'j',
        name: 'Convert PNG to JPG (1)',
        value: './bin/tojpg/index.sh'
      },

      {
        key: 'j',
        name: 'Resize Images  (2)',
        value: './bin/resize/index.sh'
      },


      {
        key: 'u',
        name: 'Update Everything (3)',
        value: './bin/make/index.mjs'
      },
      {
        key: 'y',
        name: 'Update Data Feed (4)',
        value: './bin/feed/feed.mjs;'
      },

      {
        key: 'p',
        name: 'Publish To Github (5)',
        value: './bin/publish/index.sh'
      },


      // {
      //   key: 'k',
      //   name: 'New Build System',
      //   value: './bin/build/all.sh'
      // },
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
