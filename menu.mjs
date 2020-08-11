#!/usr/bin/env -S node --experimental-modules

import { exec, spawn } from 'child_process' ;
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
        name: '1) Convert PNG to JPG',
        value: './bin/tojpg/index.sh'
      },

      {
        key: 'j',
        name: '2) Resize Images',
        value: './bin/resize/index.sh'
      },


      {
        key: 'u',
        name: '3) Update Everything',
        value: './bin/make/index.mjs'
      },
      {
        key: 'y',
        name: '4) Update Data Feed',
        value: './bin/feed/feed.mjs'
      },
      {
        key: 'y',
        name: '5) Update Spectrograms',
        value: './bin/spectrogram/index.sh'
      },

      {
        key: 'p',
        name: '6) Publish To Github',
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


    // exec(answers.action, (err, stdout, stderr) => {
    //   if (err) {
    //     if(stderr) console.log(`${stderr}`);
    //     NO(err);
    //   } else {
    //    if(stdout) console.log(`${stdout}`);
    //    if(stderr) console.log(`${stderr}`);
    //   }
    // })
    // .on('exit', (code) => {
    //   console.log('');
    //   operate++;
    //   OK();
    // });



    const child = spawn(answers.action);

    child.stdout.on('data', (data) => {
      console.log(`stdout:\n${data}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on('error', (error) => {
      console.error(`error: ${error.message}`);
      NO(error.message);
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
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
