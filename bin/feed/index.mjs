#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
import path from 'path';
import cheerio from 'cheerio';
import moment from 'moment';
import pretty from 'pretty';

const options = {
  sourceDatabasePath: './src/text', // used to get a list of md files
  extension: '.html', // files to scan
  distributionDirectoryPath: './dist', // to save the feed to
  dataFeedFile: 'feed.json',
  dataFeedDirectory: 'feed',
}

// Prepare the feed Object
let feed = fs.readdirSync(path.resolve(options.sourceDatabasePath), { withFileTypes: true })
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
  data:{
    text: text(object),
    html: html(object),
    page: page(object),
  }
}));

//feed = feed.slice(15);

feed = feed.map((entry, index)=>{

  let newestElementNumber = feed.length;
  let oldestElementNumber = 1; // oldest Element is page one

  let currentElementNumber = index+1;

  let olderElementNumber = currentElementNumber - 1;
  let newerElementNumber = currentElementNumber + 1;

  if (olderElementNumber == 0) olderElementNumber = newestElementNumber; // wrap around
  if (newerElementNumber > newestElementNumber) newerElementNumber = oldestElementNumber; // wrap around

  entry.counter = index+1;
  entry.isNewest =  currentElementNumber==feed.length?true:false;
  entry.isOldest = currentElementNumber==1?true:false;
  entry.olderId = feed[olderElementNumber-1].id;
  entry.newerId = feed[newerElementNumber-1].id;
  entry.newestId = feed[newestElementNumber-1].id;
  entry.oldestId = feed[oldestElementNumber-1].id;

  return entry;
})


// Save The Feed
const feedFile = path.resolve(path.join(options.distributionDirectoryPath, options.dataFeedDirectory, options.dataFeedFile));
fs.emptyDirSync(path.dirname(feedFile));
fs.writeFileSync(feedFile, JSON.stringify(feed, null, '  '));



{
  // Calculate Schema Stats
  const schema = {};
  for(let file of feed){
    for(let key of Object.keys(file)){
        if(!schema[key]) schema[key] = 0;
        schema[key]++
    }
  }
  schema.data = {};
  for(let file of feed){
    for(let key of Object.keys(file.data)){
        if(!schema.data[key]) schema.data[key] = 0;
        schema.data[key]++
    }
  }
  console.log('schema');
  console.log(schema)
}

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
  response.timestamp = moment(response.date).format('dddd, MMMM Do YYYY, h:mm:ss a'); // Monday, August 15th 2020, 12:59:34 pm
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

function page(object){
  // Construct a whole page with html and head and body.
  const $ = cheerio.load(fs.readFileSync(object.path));
  $('head > meta').remove();
  const illustrationSection = $(`<div class="section"/>`)
  const audioSection = $(`<div class="section"/>`)
  const illustration = $(`<img src="image/${object.image}">`)
  const audio = $(`<p><a href="audio/${object.audio}">Audio Version</a></p>`)
  illustrationSection.append(illustration);
  audioSection.append(audio);
  $('body').prepend(audioSection);
  $('body').prepend(illustrationSection);
  return pretty($.html()).trim();
}
