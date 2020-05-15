#!/usr/bin/env -S node --experimental-modules --no-warnings

import commander from 'commander';
import rhyme from 'rhyme';


async function find(word){
  return new Promise(function(resolve, reject) {
    rhyme(function (r) {
        resolve(r.rhyme(word).join('\n').toLowerCase());
    });
  });
}

async function main(){

  commander.option('-d, --debug', 'output extra debugging')
  commander.parse(process.argv);
  let word = commander.args[0];

  console.log(await find(word))

}

main();
