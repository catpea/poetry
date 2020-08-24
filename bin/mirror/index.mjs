#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
import path from 'path';
import pretty from 'pretty';
import Handlebars from 'handlebars';

const options = {
  src: './src',
  dest: './docs',
  feed: './dist/feed/feed.json',
}

const file = path.resolve(options.feed);
const feed = fs.readJsonSync(file);

index();
poems();
files();

function index(){
  // Create Table of Contents
  const template = Handlebars.compile(fs.readFileSync('bin/mirror/templates/index.hbs').toString());
  const filename = path.resolve(path.join(options.dest, 'index.html'));
  fs.ensureDirSync(path.dirname(filename));
  fs.writeFileSync(filename, pretty(template({data:feed})));
}

function poems(){
  // Create Each Poem
  const template = Handlebars.compile(fs.readFileSync('bin/mirror/templates/page.hbs').toString());
  for(let item of feed){
    const filename = path.resolve(path.join(options.dest, item.id + '.html'));
    fs.ensureDirSync(path.dirname(filename));
    fs.writeFileSync(filename, pretty(template(item)));
  }
}

function files(){
  fs.ensureDirSync(path.resolve(options.dest));
  fs.readdirSync(path.resolve(options.src), { withFileTypes: true })
  .filter(o => o.isDirectory()) // select directories for copying
  .filter(o => o.name != 'text') // skip sources
  .map(o => o.name)
  .map(name => ({ name, path: path.join(options.src, name) }))
  .map(o=>{fs.copySync(o.path, path.join(options.dest, o.name) ); return o;})
}
