#!/usr/bin/env -S node --experimental-modules --redirect-warnings=/dev/null

import fs from 'fs-extra';
import path from 'path';
import username from 'username';
import moment from 'moment';
import startCase from 'lodash/startCase.js';

const dirname = path.dirname((new URL(import.meta.url)).pathname);
let written = "2020-05-08T14:10:45.556Z";

if(!fs.pathExistsSync(path.join(dirname,'.timestamp'))) fs.writeFileSync(path.join(dirname,'.timestamp'), (new Date).toISOString())
let used = fs.readFileSync( path.join(dirname,'.timestamp') ).toString();

async function main(){

  const name = startCase(await username());
  const last = moment(used).fromNow(true);
  console.log('\n');
  console.log('-'.repeat(80));
  console.log(`LTS MENU SYSTEM: Written ${moment(written).format("MMM Do YY")}`);
  console.log(`Welcome back Dr. ${name}, it has been ${last}.`);
  fs.writeFileSync(path.join(dirname,'.timestamp'), (new Date).toISOString());
}

main();
