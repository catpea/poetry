#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
import path from 'path';
import cheerio from 'cheerio';
import matter from 'gray-matter';
import pretty from 'pretty';
import marked from 'marked';
import moment from 'moment';
import tz from 'moment-timezone';
import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';
import padStart from 'lodash/padStart.js';
import take from 'lodash/take.js';
import reverse from 'lodash/reverse.js';

const P = 'p75c674defd7743ab8ca35fa8d2e3f65d';


// Override function
const renderer = {

  paragraph(text) {
    return '<section>' + text + '</section>\n\n';
  },

  heading(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return `
            <h${level}>
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${level}>`;
  }
};

marked.use({ renderer });


const rootDirectory = './db';

const database = fs.readdirSync(path.resolve(rootDirectory), { withFileTypes: true })
.filter(o => o.isFile())
.map(o => o.name)
.filter(s => s.endsWith('.md'))
.sort()
.map(name => ({ name, path: path.join(rootDirectory, name) }))
.map(o => ({ ...o, raw: fs.readFileSync(o.path).toString() }))
.map(o => ({ ...o, ...matter(o.raw) }))
.map(o=>{
  bump(o)
  return o;
})
.map(o=>{
  o.content = pp(o.content)
  return o;
})
.map(o => ({ ...o, html: marked(o.content, {}) }))
.map(o => {
  const r = new RegExp(P, 'g')
  o.html = o.html.replace(r,'p')
  return o;
})




function bump(o){

  //TODO: extract the Listen button, remove it, add it as audio: into the metadata.
  //TODO: extract the Illustration, remove it TOTALLY, add it as illustration: into the metadata.

  if(o.content.includes(`![Illustration](image/${o.data.id}-illustration.jpg)`)){
    o.data.image = `${o.data.id}-illustration.jpg`;
    o.content = o.content.replace(`![Illustration](image/${o.data.id}-illustration.jpg)`, '');
  }


  if(o.content.includes(`[Listen](audio/${o.data.id}.mp3)`)){
    o.data.audio = `${o.data.id}.mp3`;
    o.content = o.content.replace(`[Listen](audio/${o.data.id}.mp3)`, '');
  }

}




function pp(text){
  let list = text.split(/\n/)

  list = list.map(line=>{
    if(line == '<br><br>'){
      line = `<hr>`
    }
    return line;
  })

    list = list.map(line=>{
      if(line.trim() && line.endsWith(' ')){
        line = `${line.trim()}<br>`
      }
      return line;
    })


  list = list.map(line=>{

    if( line.trim() ){
      if(line != '<hr>'){
        line = line.replace(/<br>/ig,'')
        line = `<${P}>${line}</${P}>`
      }else{
        line = `<section><hr></section>`
      }
    }

    return line;
  })

  //console.log(list);

  return list.join('\n');
}

for (let entry of  database ){

  let html = entry.html;


const $ = cheerio.load(html, {
    normalizeWhitespace: true,
    //decodeEntities: true,
    xmlMode: false
})

// $('h2.title').text('Hello there!')
// $('h2').addClass('welcome')

$('head').append(`<title>${entry.data.title}</title>`)
$('head').append(`<meta name="id" content="${entry.data.id}" />`)
$('head').append(`<meta name="date" content="${entry.data.date.toISOString()}" />`)
if(entry.data.image){
  $('head').append(`<meta name="image" content="${entry.data.image}" />`)
}

if(entry.data.audio){
  $('head').append(`<meta name="audio" content="${entry.data.audio}" />`)
}

   $('section > p > img').each(function(index, e){


     if(entry.data.id == 'poetry-0119') console.log(e.parent);
     // e.attr('x',e.parent().length)
     if(e.parent.children.length === 1){
       $(e).insertBefore(e.parent);

     }


   })

   $('section > p').each(function(index, e){



     if(e.children.length === 0){
       $(e).remove()

     }


   })


html = $.html()


  html = html.replace(/&apos;/g, `'`);
  html = html.replace(/&quot;/g, `"`);

 if(entry.data.id == 'poetry-0119') console.log('\n\n\n\n\n'+ pretty(html));
  //break;


  fs.writeFileSync(`dist/poetry/src/text/${entry.data.id}.html`, pretty(html));


}
