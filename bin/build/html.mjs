#!/usr/bin/env -S node --experimental-modules

import {inspect} from 'util';

import fs from 'fs-extra';
import path from 'path';

import matter from 'gray-matter';

import pretty from 'pretty';
import prettier from 'prettier';
import cheerio from 'cheerio';

import marked from 'marked';
import moment from 'moment';
import tz from 'moment-timezone';
import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';
import padStart from 'lodash/padStart.js';
import merge from 'lodash/merge.js';
import handlebars from 'handlebars';


/**
 credit: https://github.com/helpers/handlebars-helpers/blob/master/lib/array.js
 * Reverse the elements in an array, or the characters in a string.
 *
 * ```handlebars
 * <!-- value: 'abcd' -->
 * {{reverse value}}
 * <!-- results in: 'dcba' -->
 * <!-- value: ['a', 'b', 'c', 'd'] -->
 * {{reverse value}}
 * <!-- results in: ['d', 'c', 'b', 'a'] -->
 * ```
 * @param {Array|String} `value`
 * @return {Array|String} Returns the reversed string or array.
 * @api public
 */

handlebars.registerHelper('reverse', function(val) {
   if (Array.isArray(val)) {
     val.reverse();
     return val;
   }
   if (val && typeof val === 'string') {
     return val.split('').reverse().join('');
   }
 })




import beautifulPagination from 'beautiful-pagination';


import options from './options.mjs';

console.log('Reset Destination Directory');
// fs.emptyDirSync(path.resolve(options.distributionDirectory.path));
//fs.emptyDirSync(path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory)));

console.log('Copy Files');
fs.copySync(path.resolve(options.poetryBook.template.files), path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory)))
fs.copySync(path.resolve(options.sourceDatabase.audio), path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, path.basename(path.resolve(options.sourceDatabase.audio)))))
fs.copySync(path.resolve(options.sourceDatabase.image), path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, path.basename(path.resolve(options.sourceDatabase.image)))))

console.log('Load Partials');
fs.readdirSync(path.join(options.poetryBook.template.path, options.poetryBook.partials))
.filter(name=>name.endsWith('.hbs'))
.map(file=>({file, name: path.basename(file, '.hbs')}))
.map(o=>({...o, path: path.join(options.poetryBook.template.path, options.poetryBook.partials, o.file)}))
.map(o=>({...o, content: fs.readFileSync(o.path).toString()}))
.forEach(o=>handlebars.registerPartial(o.name, o.content));

console.log('Load Data Feed');
const dataLocation = path.resolve(path.join(options.distributionDirectory.path, options.dataFeed.directory, options.dataFeed.file));
const feed = fs.readJsonSync(dataLocation);


//console.log(feed.data.data);

//
// // NOTE: Create print specific pages.
// const printTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.print))).toString());
// for (let section of feed.data.data){
// for (let poem of section.data){
//   // NOTE: Render poemTemplate and save the page
//   let poemHtml = printTemplate(Object.assign({},feed,poem));
//   poemHtml = pretty(poemHtml, {ocd: true});
//   const fileLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, 'print-' + poem.meta.id + '.html'));
//   fs.writeFileSync(fileLocation, poemHtml);
// }
// }




// NOTE: Create poem specific pages.
const poemTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.poem))).toString());
for (let section of feed.data.data){
for (let poem of section.data){
  // NOTE: Render poemTemplate and save the page
  let poemHtml = poemTemplate(Object.assign({},feed,poem));
  poemHtml = pretty(poemHtml, {ocd: true});
  const fileLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, poem.meta.id + '.html'));
  fs.writeFileSync(fileLocation, poemHtml);
}
}



function render(id, feed){
// NOTE: Creation of an easy to browse table of contents, based on sections.
const indexTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template[id]))).toString());
const indexLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, options.poetryBook[id]));
// NOTE: Render Template
let indexHtml = indexTemplate(merge({},feed));
indexHtml = pretty(indexHtml, {ocd: true});
// NOTE: Save the page to index file
fs.writeFileSync(indexLocation, indexHtml);
}


render('index', feed);
render('toc', feed);
render('poems', feed);
render('news', feed);
