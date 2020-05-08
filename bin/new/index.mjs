#!/usr/bin/env -S node --experimental-modules --redirect-warnings=/dev/null

import fs from 'fs-extra';
import path from 'path';
import oneof from 'oneof';
import padStart from 'lodash/padStart.js';
import handlebars from 'handlebars';
const dirname = path.dirname((new URL(import.meta.url)).pathname);

const options = {
  db: {
    path: './db',
    template: 'new.hbs',
    text: 'lines.txt',
  },
}


const text = oneof(fs.readFileSync(path.join(dirname, options.db.text)).toString().split('\n'));
const format = fs.readFileSync(path.join(dirname, options.db.template)).toString();
const template = handlebars.compile(format);
const last = fs.readdirSync(path.resolve(options.db.path), { withFileTypes: true }) .filter(o => o.isFile()) .map(o => o.name) .filter(s => s.endsWith('.md')) .sort() .pop()
const category = last.split('-')[0];
const index = parseInt(last.replace(/\D/g,'').replace(/^0+/,'')) + 1;
const id = category + '-' + padStart(index,4,'0');
const date = (new Date()).toISOString();
const filename = id + '.md';
const filepath = path.resolve(path.join(options.db.path, filename));
const defaults = { id, index, date, text, };
fs.writeFileSync(filepath, template(defaults))
console.log('Generated: %s', filepath);
