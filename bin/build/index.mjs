#!/usr/bin/env -S node --experimental-modules

import {inspect} from 'util';

import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import pretty from 'pretty';
import marked from 'marked';
import moment from 'moment';
import tz from 'moment-timezone';
import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';
import padStart from 'lodash/padStart.js';

import beautifulPagination from 'beautiful-pagination';



const options = {
  title: 'Poetry',

  source: 'https://github.com/catpea/poetry',
  website: 'http://catpea.com',

  //
  sourceDatabase: {
    path: './db',
  },


  dist: {
    path: './dist',
  },

  docs: {
    path: './docs',
    file: 'index.html',
  },


  html: {
    path: './dist',
    file: 'index.html',
  },
  md: {
    path: './dist',
    file: 'README.md',
  },
  readme: {
    path: './',
    file: 'README.md',
  },
  js: {
    path: './dist',
    file: 'index.js',
  },
  mjs: {
    path: './dist',
    file: 'index.mjs',
  },
  sh: {
    path: './dist',
    file: 'advice.sh',
  },
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
  const str = o.content;
  const matches = str.matchAll(regex);
  for (const match of matches) {
    if(match){
      if(match.groups){
        const {label, file} = match.groups;
        if(!label) console.log(`WARN: Unlabeled image (${file}), all images should have unique lables. File: ${o.path}`);
        if(duplicateLabels.has(label)) console.log(`WARN: Same label (${label}) used for multiple immages, all images should have unique lables. File: ${o.path}`); duplicateLabels.add(label);
        response.push({label, file});
      }
    }
  }
  return response;
}

const dataStream = fs.readdirSync(path.resolve(options.sourceDatabase.path), { withFileTypes: true })
.filter(o => o.isFile())
.map(o => o.name)
.filter(s => s.endsWith('.md'))
.sort() // sorted by id which is specially formatted: db/poetry-000n.md
.map(name => ({ name, path: path.join(options.sourceDatabase.path, name) }))
.map(o => ({ ...o, raw: fs.readFileSync(o.path).toString() }))
.map(o => ({ ...o, ...matter(o.raw) }))
.map(o => ({ ...o, html: marked(o.content, {}) }))
.map(o => ({ ...o, images: createImageMetadata(o) }))
.reverse() // now the top entry will be latest

const pageStream = beautifulPagination(dataStream,{perPage: 3});

console.log(pageStream);

console.log(inspect(pageStream, { showHidden: true, depth: null }));

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
