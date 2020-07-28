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
import handlebars from 'handlebars';



import beautifulPagination from 'beautiful-pagination';




const options = {
  title: 'Poetry',
  author: 'Dr. Meow',

  source: 'https://github.com/catpea/poetry',
  website: 'http://catpea.com',

  // Database Containing Posts
  sourceDatabase: {
    path: './db',
    audio: './db/audio',
    image: './db/image',
  },

  // Root Directory for all the generated code.
  distributionDirectory: {
    path: './dist',
  },

  // Configuration for the poetry book generation
  poetryBook: {

    canonical: 'https://catpea.com/',
    directory: 'poetry-book',

    index: 'index.html',

    changelog: 'changelog.html',

    sectionFileName:'section-{{id}}.html',
    sectionName:'section-{{id}}',

    template: {
      files: 'templates/poetry-book/files',
      path: 'templates/poetry-book',

      page: 'page.hbs',
      index: 'index.hbs',
      poem: 'poem.hbs',
      print: 'print.hbs',

      changelog: 'changelog.hbs',
    }

  },

  //
  // docs: {
  //   path: './docs',
  //   file: 'index.html',
  // },
  //
  //
  //
  // md: {
  //   path: './dist',
  //   file: 'README.md',
  // },
  // readme: {
  //   path: './',
  //   file: 'README.md',
  // },
  // js: {
  //   path: './dist',
  //   file: 'index.js',
  // },
  // mjs: {
  //   path: './dist',
  //   file: 'index.mjs',
  // },
  // sh: {
  //   path: './dist',
  //   file: 'advice.sh',
  // },
}

// fs.ensureDirSync(options.docs.path);
// fs.readdirSync(path.resolve(options.sourceDatabase.path), { withFileTypes: true })
// .filter(o => o.isDirectory())
// .map(o => o.name)
// .map(name => ({ name, path: path.join(options.sourceDatabase.path, name) }))
// .map(o=>{fs.copySync(o.path, path.join(options.docs.path, o.name) ); return o;})
// .map(o=>{fs.copySync(o.path, path.join(options.dist.path, o.name) ); return o;})
//
// .filter(o=>o.name !== 'css') // MARKDOWN ZONE drop css folder, or just use images
// .map(o=>{fs.copySync(o.path, path.join(options.readme.path, o.name) ); return o;})


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
  return $.html('body > *');
}

function upgradeDividersForPrinting(str){
  const $ = cheerio.load(str);
  // const node = $('p > br + br');
  // node.parent().addClass('page-break-after')

  const node = $('img[alt="Illustration"]');
  node.addClass('page-break-after')

  return $.html('body > *');
}

const dataStream = fs.readdirSync(path.resolve(options.sourceDatabase.path), { withFileTypes: true })
.filter(o => o.isFile())
.map(o => o.name)
.filter(s => s.endsWith('.md'))
.sort() // sorted by id which is specially formatted: db/poetry-000n.md
.map(name => ({
  meta: {
    name: path.basename(name, '.md'),
    path: path.join(options.sourceDatabase.path, name)
  },
  data:{}
}))
.map(o => {

  const raw = fs.readFileSync(o.meta.path).toString();
  const {data:properties, content} = matter(raw);
  const html = marked(content, {})

  // Cleanup matter properties
  delete properties.raw;
  delete properties.excerpt;
  delete properties.isEmpty;

  properties.tags = properties.tags.split(" ");

  properties.timestamp = moment((new Date(properties.date))).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z");
  properties.author = options.author;
  properties.canonical = options.poetryBook.canonical;

  Object.assign(o.meta, properties);
  o.data.md = content
  o.data.html = html;

  o.meta.images = createImageMetadata(o);
  o.meta.sounds = createSoundMetadata(o);

  o.data.html = upgradeAudioLinks(o.data.html);
  o.data.html = upgradeDividersForPrinting(o.data.html);

  return o;
})
.filter(o=>o.meta.tags.includes('Poem'))
.reverse() // now latest post will be the top entry

const pageStream = beautifulPagination(dataStream, {
  perPage:7,
  sectionFileName: options.poetryBook.sectionFileName,
  sectionName: options.poetryBook.sectionName,
});







// TODO: USE THIS fs.emptyDirSync(path.resolve(options.distributionDirectory.path));

fs.emptyDirSync(path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory)));
fs.copySync(path.resolve(options.poetryBook.template.files), path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory)))
fs.copySync(path.resolve(options.sourceDatabase.audio), path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, path.basename(path.resolve(options.sourceDatabase.audio)))))
fs.copySync(path.resolve(options.sourceDatabase.image), path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, path.basename(path.resolve(options.sourceDatabase.image)))))



const sectionStack = [];
for (let pagePosts of pageStream.data){
  sectionStack.push(pagePosts);
}












// NOTE: Create all the pages.
const pageTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.page))).toString());

for (let variables of sectionStack){
  // NOTE: Render pageTemplate and save the page
  let pageHtml = pageTemplate(variables);
  pageHtml = pretty(pageHtml, {ocd: true});
  const fileLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, variables.meta.currentFileName));
  fs.writeFileSync(fileLocation, pageHtml);
}





// NOTE: Create poem specific pages.
const poemTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.poem))).toString());

// for (let poem of dataStream){
//   // NOTE: Render poemTemplate and save the page
//   let poemHtml = poemTemplate(poem);
//   poemHtml = pretty(poemHtml, {ocd: true});
//   const fileLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, poem.meta.id + '.html'));
//   fs.writeFileSync(fileLocation, poemHtml);
//   console.log('Written',fileLocation);
// }

for (let section of sectionStack){
  for (let poem of section.data){

    // NOTE: Render pageTemplate and save the page
    let pageHtml = poemTemplate(Object.assign({sectionFileName: section.meta.currentFileName},poem));
    pageHtml = pretty(pageHtml, {ocd: true});

    const fileLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, poem.meta.id + '.html'));
    fs.writeFileSync(fileLocation, pageHtml);

  }
}



// NOTE: Create poem specific pages.
const printTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.print))).toString());
for (let poem of dataStream){
  // NOTE: Render poemTemplate and save the page
  let poemHtml = printTemplate(poem);
  poemHtml = pretty(poemHtml, {ocd: true});
  const fileLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, 'print-' + poem.meta.id + '.html'));
  fs.writeFileSync(fileLocation, poemHtml);
}




// NOTE: Creation of an easy to browse table of contents, based on sections.

const indexTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.index))).toString());
const indexLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, options.poetryBook.index));

// NOTE: Render Template
let indexHtml = indexTemplate({section:sectionStack});
indexHtml = pretty(indexHtml, {ocd: true});

// NOTE: Save the page to index file
fs.writeFileSync(indexLocation, indexHtml);
















//
//
//
// // NOTE: Create all the pages.
//
// const pageTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.page))).toString());
//
// for (let pagePosts of pageStream.data){
//   //console.log(pagePosts);
//
//   // NOTE: using filename template establish filenames
//   const fileNameTemplate = handlebars.compile(options.poetryBook.page);
//   const fileNames = {
//     currentFileName: fileNameTemplate({id:pagePosts.meta.currentSection}),
//     olderFileName: fileNameTemplate({id:pagePosts.meta.olderSection}),
//     newerFileName: fileNameTemplate({id:pagePosts.meta.newerSection}),
//   };
//   //console.log(pagePosts.meta.isLast?'NO MORE     ':fileNames.olderFileName,fileNames.currentFileName,pagePosts.meta.isFirst?'NO MORE      ':fileNames.newerFileName, pagePosts.meta.isFirst?'START':'', pagePosts.meta.isLast?'END':'');
//
//   // NOTE: Prepare variables for the page template
//   const variables = Object.assign({
//     canonical: options.poetryBook.canonical,
//     poem: pagePosts.data.filter(i=>i).map(o=>{
//       o.meta.timestamp = moment((new Date(o.meta.date))).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z");
//       return o;
//     }),
//   }, fileNames, pagePosts);
//
//   // NOTE: Render Template and save the page
//   let pageHtml = pageTemplate(variables);
//   pageHtml = pretty(pageHtml, {ocd: true});
//   const fileLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, fileNames.currentFileName));
//   fs.writeFileSync(fileLocation, pageHtml);
//
//
//   // // NOTE: INDEX LOGIC
//   // if(pagePosts.meta.isFirst){
//   //   // This is the index page
//   //   const fileLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, options.poetryBook.index));
//   //   fs.writeFileSync(fileLocation, pageHtml);
//   // }
//
//   //break;
// }


// NOTE: Creation of an easy to browse table of contents, based on sections.
//
// const tocTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.index))).toString());
// for (let pagePosts of pageStream.data){
//
//   // NOTE: using filename template establish filenames
//   const fileNameTemplate = handlebars.compile(options.poetryBook.page);
//   const fileNames = {
//     currentFileName: fileNameTemplate({id:pagePosts.meta.currentSection}),
//     olderFileName: fileNameTemplate({id:pagePosts.meta.olderSection}),
//     newerFileName: fileNameTemplate({id:pagePosts.meta.newerSection}),
//   };
//
//   // NOTE: Prepare variables for the page template
//   const variables = Object.assign({
//     canonical: options.poetryBook.canonical,
//     poem: pagePosts.data.filter(i=>i).map(o=>{
//       o.meta.timestamp = moment((new Date(o.meta.date))).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z");
//       return o;
//     }),
//   }, fileNames, pagePosts);
//
//   // NOTE: Render Template and save the page
//   let indexHtml = pageTemplate(variables);
//   indexHtml = pretty(indexHtml, {ocd: true});
//
//   const fileLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, options.poetryBook.index));
//   fs.writeFileSync(fileLocation, indexHtml);
// }
//



// NOTE: Creation of a page dedicated to a specific poem linked from an index.





//
//
//
//
//
// // TODO: This needs a pager.
// const htmlVersion = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="utf-8" />
//   <title>${options.title}</title>
//   <meta name="viewport" content="width=device-width, initial-scale=1">
//   <link rel="stylesheet" type="text/css" href="css/pico.classless-1.0.2.min.css">
// </head>
// <body>
//   <main>
//     <h1>${options.title}</h1>
//       ${data.map(o => `
//       <article>
//       <section class="log-entry" itemscope itemtype="http://schema.org/CreativeWork">
//       <meta itemprop="dateCreated" datetime="${(new Date(o.data.date)).toISOString()}">
//       <hgroup>
//         <h2>${o.data.title}</h2>
//         <h3>${moment((new Date(o.data.date))).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z")}</h3>
//       </hgroup>
//         ${o.html}
//       </section>
//       </article>
//       `).join('\n')}
//   </main>
//   <footer>
//     <small><a href="${options.source}">Source Code</a></small>
//   </footer>
// </body>
// </html>
// `;
//
// fs.ensureDirSync(options.html.path);
// fs.writeFileSync(path.join(options.html.path,options.html.file), pretty(htmlVersion));
//
// fs.ensureDirSync(options.docs.path);
// fs.writeFileSync(path.join(options.docs.path,options.docs.file), pretty(htmlVersion));
//
//
//
//
//
// // NOTE: Used for github readme.
// let mdVersion = `# ${options.title}
//
// ${data.map(o => `## ${o.data.title}
// ### ${moment((new Date(o.data.date))).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z")}
// <meta itemprop="dateCreated" datetime="${(new Date(o.data.date)).toISOString()}">
// ${o.content}
// <br><br>
// `).join('\n')}
//
// `;
//
// fs.ensureDirSync(options.md.path);
// fs.writeFileSync(path.join(options.md.path, options.md.file), mdVersion);
// fs.writeFileSync(path.join(options.readme.path, options.readme.file), mdVersion);
//
//
//
// const jsVersion = `const advice = ${JSON.stringify( data .map(o => o.content.trim()) .map(s=>s.replace(/\n/g, ' ')) .map(s=>s.replace(/ +/g, ' ')) , null, '  ')};
//
// function main(){
//   return advice;
// }
//
// module.exports = main;
// `;
// fs.ensureDirSync(options.js.path);
// fs.writeFileSync(path.join(options.js.path,options.js.file), jsVersion);
//
//
//
//
//
//
//
//
//
//
// const mjsVersion = `const advice = ${JSON.stringify( data .map(o => o.content.trim()) .map(s=>s.replace(/\n/g, ' ')) .map(s=>s.replace(/ +/g, ' ')) , null, '  ')};
//
// export default function main(){
//   return advice;
// }
// `;
// fs.ensureDirSync(options.mjs.path);
// fs.writeFileSync(path.join(options.mjs.path,options.mjs.file), mjsVersion);
//
//
// const shVersion = `#!/usr/bin/env -S node --experimental-modules --no-warnings
// const advice = ${JSON.stringify( data .map(o => o.content.trim()) .map(s=>s.replace(/\n/g, ' ')) .map(s=>s.replace(/ +/g, ' ')) , null, '  ')};
//
// function main(){
//   console.log(advice[Math.floor(Math.random() * advice.length)]);
// }
// main();
// `;
// fs.ensureDirSync(options.sh.path);
// fs.writeFileSync(path.join(options.sh.path,options.sh.file), shVersion);
// fs.chmodSync(path.join(options.sh.path,options.sh.file), 0o755);


// TODO: Add RSS/Atom/Json feeds
// TODO: Add a pager'ed version, this is a JSON structure with 10 entries per page, and pager information.
// TODO: Generate Audiobook
// TODO: Generate YouTube Video
// TODO: Generate entire website, based on pico with complex folder structure that honors tags. THis should be backwards compatible with older browsers
