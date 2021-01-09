#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
import path from 'path';
import cheerio from 'cheerio';
import moment from 'moment';
import pretty from 'pretty';
import startCase from 'lodash/startCase.js';

const options = {
  sourceDatabasePath: './src/text', // used to get a list of md files
  extension: '.html', // files to scan
  distributionDirectoryPath: './dist', // to save the feed to
  dataFeedFile: 'furkies-purrkies.json',
  dataFeedDirectory: 'server-object',
}

// Prepare the feed Object
let data = fs.readdirSync(path.resolve(options.sourceDatabasePath), { withFileTypes: true })
.filter(o => o.isFile())
.map(o => o.name)
.filter(s => s.endsWith(options.extension))
.sort() // sorted by id which is specially formatted: db/poetry-000n.xxx
.map(name => ({
  path: path.join(options.sourceDatabasePath, name),
}))
.map(object => ({
  ...object,
  ...meta(object),
  //extension: path.extname(object.path), // example to add additional props
}))
.map(object => ({
  ...object,
  path: undefined,
  id: path.basename(object.path, options.extension), // Forcing ID based on file name. THis means that id is no longer required in the metaddata, filename takes over...

  text: text(object),
  html: html(object),
  //  page: page(object),

}))
.map(object => ({
  ...object,
  images: images(object),
  links: links(object),
}))
.map(i=>{
  delete i.path;
  return i;
})
;



const object = {
  name: "furkies-purrkies",
  title: "Furkies Purrkies",
  subtitle: "Anthology of Inspirational Rhyme",
  description: "Just another dang old Audio Book about wisdom and growing up.",
  "links":{
    "Source Code":"https://github.com/catpea/poetry",
    "Mirror":"https://catpea.github.io/poetry/",
    "Bugs":"https://github.com/catpea/poetry/issues",
    "YouTube":"https://www.youtube.com/playlist?list=PLOo-pqnffyOqsK6hf5tFwMqzvhogksrgW"
  },
  order: "latest",
  data,
}

// Save The Feed
const feedFile = path.resolve(path.join(options.distributionDirectoryPath, options.dataFeedDirectory, options.dataFeedFile));
fs.emptyDirSync(path.dirname(feedFile));
fs.writeFileSync(feedFile, JSON.stringify(object, null, '  '));





function meta(object){
  // Compute metadata
  const response = {};
  const $ = cheerio.load(fs.readFileSync(object.path));
  response.title = $('head > title').text();
  $('head > meta[name][content]').each(function(index, element){
    const name = $(element).attr('name');
    const content = $(element).attr('content');
    response[name] = content;
  })
  if(!response.image){
    response.image = "poetry-cover.jpg";
  }
  return response;
}

function text(object){
  // This is the normalized text version.
  const $ = cheerio.load(fs.readFileSync(object.path));
  // Destroy paragraphs with links, this is considered a stand-alone link line, a button, data not relevant to an excerpt.
  $('p > a').each(function(index, element){
    if($(element).parent().contents().length == 1) $(element).remove();
  })
  // Add texts so that links can be featured in text.
  let links = [];
  $('p > a').each(function(index, element){
    const name = $(element).text();
    const url = $(element).attr('href');
    links.push({name, url})
  })
  let text = $('body')
  .text().trim()
  .split("\n")
  .map(i=>i.trim())
  .join("\n")
  .replace(/\n{2,}/g,'\n\n').trim();
  if(links.length) text = text + "\n\n\n" + links.map(({name, url})=>`[${name}]: ${url}`).join("\n");
  return text;
}

function html(object){
  // Grab only the inner HTML (this does not include metadata use the one in the object)
  const $ = cheerio.load(fs.readFileSync(object.path));
  return pretty($('body').html()).trim();
}

function images(object){
  const $ = cheerio.load(object.html);
  const list = $('img') .map(function (i, el) { return {title: $(this).attr('title')||$(this).attr('alt'), url: $(this).attr('src').replace(/^\/image\/[a-z]{2}-/, '')} }).get()
  return list;
}
function links(object){
  const $ = cheerio.load(object.html);
  const list = $('a') .map(function (i, el) { return {title: ($(this).attr('title')||$(this).text()), url: $(this).attr('href')} }).get()
  return list;
}

function page(object){
  // Construct a whole page with html and head and body.
  const $ = cheerio.load(fs.readFileSync(object.path));
  $('head > meta').remove();
  const illustrationSection = $(`<section/>`)
  const audioSection = $(`<section/>`)
  const illustration = $(`<img src="image/${object.image}">`)
  const audio = $(`<p><a href="audio/${object.audio}">Audio Version</a></p>`)
  illustrationSection.append(illustration);
  audioSection.append(audio);
  $('body').prepend(audioSection);
  $('body').prepend(illustrationSection);
  return pretty($.html()).trim();
}
