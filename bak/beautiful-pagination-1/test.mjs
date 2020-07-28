#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
import pagination from './index.mjs';

async function main(){

  const list = await fs.readJSON('./list.json');
  //console.log(data);

  console.log( pagination(list, {size:10}).data );

}

main();
