#!/usr/bin/env -S node --experimental-modules
// --redirect-warnings=/dev/null

import fs from 'fs-extra';
const { COPYFILE_EXCL } = fs.constants;

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

  let c = 0;
  for (const entry of texts) {
      const code = fs.readFileSync(entry.location).toString();
      const $ = cheerio.load(code);
      // //console.log(entry.location);

      let baseName = path.basename(entry.location, path.extname(entry.location));
      let imageFilename = $('meta[name=image]').attr('content');

      const images = $('img') .map(function (i, el) { return $(this).attr('src'); }).get()
      .map(i=>i.replace(/^\/image\/[a-z]{2}-/, '')).join(', ');
      if(images.length){
        console.log('%s: %s', baseName, images);
      }

      // if(!imageFilename){
      //   c++;
      //   console.log('%d: needs an image: %s', c, baseName);
      //
      //
      //
      //
      //
      //   //$('html > head').append(`<meta name="image" content="${baseName}-illustration.jpg" source="https://catpea.com/">`)
      //   //fs.copyFileSync(`/home/meow/n/${c}.jpg`, `src/image/${baseName}-illustration.jpg`, COPYFILE_EXCL);
      //   //save(entry.location, $)
      //
      // }

      // fixImages($);
      // fixSectionTags($);
      // fixLinks($);



      // save(entry.location, $)

  };



  //console.log(texts);

} // main





main();


// function fixImages($){
//   let fixed = false;
//   $('img').each(function (i, elem) {
//     let src = $(this).attr('src');
//     if(src.match(/^image\//)){
//       src = '/'+src;
//       $(this).attr('src', src);
//       fixed = true;
//     }
//   });
// }
//
// function fixSectionTags($){
//   $('section').each(function (i, elem) {
//     this.tagName = 'div';
//     $(this).addClass('section');
//   });
// }
//
// function fixLinks($){
//   //
//   // $('a').each(function (i, elem) {
//   //   let href = $(this).attr('href');
//   // });
// }


function save(location, $){
  let updated =  pretty($.html(), {ocd:true});
  updated = updated.replace(/&apos;/gi, '\'');
  updated = updated.replace(/&quot;/gi, '"');
  updated = updated.replace(/&amp;/gi, '&');
  fs.writeFileSync(location, updated);
}
