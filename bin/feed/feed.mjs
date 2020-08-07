#!/usr/bin/env -S node --experimental-modules

import util from 'util';
import fs from 'fs-extra';
import path from 'path';

import matter from 'gray-matter';
import marked from 'marked';

import moment from 'moment';
import tz from 'moment-timezone';

import cheerio from 'cheerio';

import beautifulPagination from 'beautiful-pagination';

import pretty from 'pretty';

/*

  Create the data structure that is fed into templating system.

*/

import options from './options.mjs';

const metaDataStream = fs.readdirSync(path.resolve(options.sourceDatabasePath), { withFileTypes: true })
.filter(o => o.isFile())
.map(o => o.name)
.filter(s => s.endsWith('.md'))
.sort() // sorted by id which is specially formatted: db/poetry-000n.md
.map(name => ({
  meta: {
    name: path.basename(name, '.md'),
    path: path.join(options.sourceDatabasePath, name)
  },
  data:{

  }
}))



let dataStream = metaDataStream.map(o => {

  let raw = fs.readFileSync(o.meta.path).toString();
  raw = raw.replace(/<br><br>/g,'<br>');
  //raw = raw.replace(/<br>/g,'');

  const {data:properties, content} = matter(raw);

  const html = marked(content, {})


  // Cleanup matter properties
  delete properties.raw;
  delete properties.excerpt;
  delete properties.isEmpty;

  properties.tags = properties.tags.split(" ");

  properties.timestamp = moment((new Date(properties.date))).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z");


  Object.assign(o.meta, properties);
  o.data.md = content
  o.data.html = pretty(html);

  o.meta.images = createImageMetadata(o); // Create a list of immages
  o.meta.sounds = createSoundMetadata(o); // Create a list of sounds

  o.data.html = upgradeAudioLinks(o.data.html);
  o.data.html = upgradeDividersForPrinting(o.data.html);


  return o;
})

.filter(o=>o.meta.tags.includes('Poem'));



dataStream = dataStream.map((entry,index)=>{

  let newestElementNumber = dataStream.length;
  let oldestElementNumber = 1; // oldest Element is page one

  let currentElementNumber = index+1;

  let olderElementNumber = currentElementNumber - 1;
  let newerElementNumber = currentElementNumber + 1;

  if (olderElementNumber == 0) olderElementNumber = newestElementNumber; // wrap around
  if (newerElementNumber > newestElementNumber) newerElementNumber = oldestElementNumber; // wrap around

  entry.meta.isNewest =  currentElementNumber==dataStream.length?true:false;
  entry.meta.isOldest = currentElementNumber==1?true:false;
  entry.meta.olderId = dataStream[olderElementNumber-1].meta.id;
  entry.meta.newerId = dataStream[newerElementNumber-1].meta.id;
  entry.meta.newestId = dataStream[newestElementNumber-1].meta.id;
  entry.meta.oldestId = dataStream[oldestElementNumber-1].meta.id;


  return entry;
})









const pageStream = beautifulPagination(dataStream, {
  perPage:7,
  sectionFileName: options.sectionFileName,
  sectionName: options.sectionName,
});




const data = {
    element: dataStream,
    chapter: pageStream,
};
const dataLocation = path.resolve(path.join(options.distributionDirectoryPath, options.dataFeedDirectory, options.dataFeedFile));
fs.emptyDirSync(path.dirname(dataLocation));
fs.writeFileSync(dataLocation, JSON.stringify(data, null, '  '));










function createImageMetadata(o){
  const duplicateLabels = new Set();
  const response = [];
  const regex = /\!\[(?<label>.*)\]\(image\/(?<file>.*)\)/gm;
  const str = o.data.md;
  const matches = str.matchAll(regex);
  for (const match of matches) {
    if(match){
      if(match.groups){
        const {label, file} = match.groups;
        if(!label) console.log(`WARN: Unlabeled image (${file}), all images should have unique lables. File: ${o.path}`);
        if(duplicateLabels.has(label)) console.log(`WARN: Same label (${label}) used for multiple immages, all images should have unique lables. File: ${o.path}`); duplicateLabels.add(label);
        response.push({path:'image', label, file});
      }
    }
  }
  return response;
}
function createSoundMetadata(o){
  const duplicateLabels = new Set();
  const response = [];
  const regex = /\[(?<label>.*)\]\(audio\/(?<file>.*)\)/gm;
  const str = o.data.md;
  const matches = str.matchAll(regex);
  for (const match of matches) {
    if(match){
      if(match.groups){
        const {label, file} = match.groups;
        if(!label) console.log(`WARN: Unlabeled sound (${file}), all sounds should have unique lables. File: ${o.path}`);
        if(duplicateLabels.has(label)) console.log(`WARN: Same label (${label}) used for multiple sounds, all sounds should have unique lables. File: ${o.path}`); duplicateLabels.add(label);
        response.push({path:'audio',label, file});
      }
    }
  }

  return response;
}

function upgradeAudioLinks(str){
  const $ = cheerio.load(str);
  const node = $('a[href$=".mp3"]');
  node.attr('role', 'button')
  node.attr('rel', 'noopener noreferrer')
  node.attr('target', '_blank')
  node.addClass('no-print')

  if(node.text() == 'Listen') node.text('Audio Version');

  return $.html('body > *');
}

function upgradeDividersForPrinting(str){
  const $ = cheerio.load(str);
  // const node = $('p > br + br');
  // node.parent().addClass('page-break-after')

  const node = $('img[alt="Illustration"]');
  node.addClass('page-break-after')

  node.parent().attr('style','text-align: center;')

  return $.html('body > *');
}
