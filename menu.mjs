#!/usr/bin/env -S node --experimental-modules

import { exec, spawn } from 'child_process';
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
      name: "Add New Poem",
      value: "bin/new/index.mjs",
    },

    {
      name: "1) Build The Main Data Feed",
      value: "bin/feed/index.mjs",
    },

    {
      name: "2) Run Feed Tests",
      value: "bin/test/index.mjs",
    },

    {
      name: "3) Copy audio to ./dist",
      value: "bin/audio/index.sh",
    },

    {
      name: "4) Convert PNG to JPG and Resize Images",
      value: "bin/image/index.sh",
    },

    {
      name: "5) Generate Spectrograms",
      value: "bin/spectrogram/index.sh",
    },

    {
      name: "6) Build A Local Mirror",
      value: "bin/mirror/index.sh",
    },

    {
      name: "7) Publish To Github",
      value: "bin/publish/index.sh",
    },

    {
      name: "Convert (copy) Each Audio To Separate Video File",
      value: "bin/video/index.sh",
    },

    {
      name: "Build a Audio and Visual Book",
      value: "bin/audiobook/index.sh",
    },

    {
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

    const child = spawn(answers.action);

    child.stdout.on('data', (data) => {
      console.log(`${data}`);
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
