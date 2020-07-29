#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
import path from 'path';

import prettier from 'prettier';

import postcss  from 'postcss';
import postcssJs  from 'postcss-js';
import precss  from 'precss';
import sorting  from 'postcss-sorting';
import autoprefixer  from 'autoprefixer';
import Midas from 'midas';

import moment from 'moment';
import tz from 'moment-timezone';

import handlebars from 'handlebars';

import options from './options.mjs';

// Load Partials
fs.readdirSync(path.join(options.poetryBook.template.path, options.poetryBook.partials))
.filter(name=>name.endsWith('.hbs'))
.map(file=>({file, name: path.basename(file, '.hbs')}))
.map(o=>({...o, path: path.join(options.poetryBook.template.path, options.poetryBook.partials, o.file)}))
.map(o=>({...o, content: fs.readFileSync(o.path).toString()}))
.forEach(o=>handlebars.registerPartial(o.name, o.content));


const midas = new Midas({wrap: true});

const sortingOptions = {
      'order': [
        'custom-properties',
        'dollar-variables',
        'declarations',
        'at-rules',
        'rules'
      ],

      'properties-order': 'alphabetical',

      'unspecified-properties-position': 'bottom'
    };


async function main(){

  const objectCss = (await import( path.resolve(path.join(options.poetryBook.css.path, options.poetryBook.css.main)) )).default;

  console.log(objectCss);

  const {css:precssCss} = await postcss().process(await objectCss(), { parser: postcssJs, from:undefined });

  const {css:unformattedCss} = await postcss([ precss({}), autoprefixer(), sorting(sortingOptions) ]).process(precssCss,{});

  const css = prettier.format(unformattedCss, { parser: "css" });





  const stylesheetLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, options.poetryBook.stylesheet));
  const stylesheetOptions = {
    meta: {
      title: 'CSS Stylesheet',
      timestamp: moment((new Date())).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z"),
      author: options.author,
      canonical: options.poetryBook.canonical,
    },
    data:{
      css
    }
  };


  const stylesheetTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.stylesheet))).toString());
  const stylesheet = stylesheetTemplate(stylesheetOptions);
  console.log(stylesheet);
  fs.writeFileSync(stylesheetLocation, stylesheet);




  const stylecodeLocation = path.resolve(path.join(options.distributionDirectory.path, options.poetryBook.directory, options.poetryBook.stylecode));
  const stylecodeOptions = {
    meta: {
      title: 'CSS Stylesheet',
      timestamp: moment((new Date())).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z"),
      author: options.author,
      canonical: options.poetryBook.canonical,
    },
    data:{
      html: postcss().process(stylesheet, {stringifier: midas.stringifier}).css
    }
  };
  const stylecodeTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.poetryBook.template.path, options.poetryBook.template.stylecode))).toString());
  const stylecode = stylecodeTemplate(stylecodeOptions);

  fs.writeFileSync(stylecodeLocation, stylecode);





}


main()
