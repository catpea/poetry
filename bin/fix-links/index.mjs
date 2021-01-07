#!/usr/bin/env -S node --experimental-modules
// --redirect-warnings=/dev/null

import fs from 'fs-extra';
import path from 'path';

import cheerio from 'cheerio';
import pretty from 'pretty';

import username from 'username';
import moment from 'moment';
import startCase from 'lodash/startCase.js';

// const dirname = path.dirname((new URL(import.meta.url)).pathname);
// let written = "2020-05-08T14:10:45.556Z";

// if(!fs.pathExistsSync(path.join(dirname,'.timestamp'))) fs.writeFileSync(path.join(dirname,'.timestamp'), (new Date).toISOString())
// let used = fs.readFileSync( path.join(dirname,'.timestamp') ).toString();

const options = {
  sourceDatabasePath: './src/text', // used to get a list of md files
  extension: '.html', // files to scan
  distributionDirectoryPath: './dist', // to save the feed to
  dataFeedFile: 'feed.json',
  dataFeedDirectory: 'feed',
}

async function main(){

  const texts = fs.readdirSync(path.resolve(options.sourceDatabasePath), { withFileTypes: true })
  .filter(o => o.isFile())
  .map(o => o.name)
  .filter(s => s.endsWith(options.extension))
  .sort() // sorted by id which is specially formatted: db/poetry-000n.xxx
  .map(name => ({
    location: path.join(options.sourceDatabasePath, name),
  }));

  for (const entry of texts) {

      const code = fs.readFileSync(entry.location).toString();
      const $ = cheerio.load(code);
      console.log(entry.location);

      fixImages($);
      fixSectionTags($);
      fixLinks($);

      save(entry.location, $)

  };



  //console.log(texts);

} // main





main();


function fixImages($){
  let fixed = false;
  $('img').each(function (i, elem) {
    let src = $(this).attr('src');
    if(src.match(/^image\//)){
      src = '/'+src;
      $(this).attr('src', src);
      fixed = true;
    }
  });
}

function fixSectionTags($){
  $('section').each(function (i, elem) {
    this.tagName = 'div';
    $(this).addClass('section');
  });
}

function fixLinks($){
  //
  // $('a').each(function (i, elem) {
  //   let href = $(this).attr('href');
  // });
}


function save(location, $){
  let updated =  pretty($.html(), {ocd:true});
  updated = updated.replace(/&apos;/gi, '\'');
  updated = updated.replace(/&quot;/gi, '"');
  updated = updated.replace(/&amp;/gi, '&');
  fs.writeFileSync(location, updated);
}
