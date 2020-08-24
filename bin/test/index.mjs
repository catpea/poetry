#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
import path from 'path';
import cheerio from 'cheerio';
import chalk from 'chalk';

const options = {

  distributionDirectoryPath: './dist',
  dataFeedFile: 'feed.json',
  dataFeedDirectory: 'feed',

}

const file = path.resolve(path.join(options.distributionDirectoryPath, options.dataFeedDirectory, options.dataFeedFile));
const feed = fs.readJsonSync(file);

for(let item of feed){
  const [,poemNumber] = item.id.split('-');
  const matches = item.data.text.match(/\svery\s/g)
  if(matches && (poemNumber > 144)){
    console.log(`\n${item.id}: Contains the word "VERY" ${matches.length} time${matches.length==1?'':'s'}.`);
    item.data.text
    .split(/\n/)
    .map((line, number)=>`${chalk.green(number+1)}: ${line}`)
    .filter(i=>i.match(/\svery\s/))
    .map(line=>line.replace(/very/g, chalk.yellow('very')))
    .map(line=>console.log(' '.repeat(item.id.length+2) + line))
  }
}
