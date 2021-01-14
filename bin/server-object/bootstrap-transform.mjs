#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
const { COPYFILE_EXCL } = fs.constants;
import path from 'path';

import cheerio from 'cheerio';
import pretty from 'pretty';

const options = {
  name: "furkies-purrkies",
  sourceDatabasePath: './src/text', // used to get a list of md files
  extension: '.html', // files to scan
  distributionDirectoryPath: './dist', // to save the feed to
  dataFeedDirectory: 'server-object',
  inputFeedFile: 'furkies-purrkies.json',
  outputFeedFile: 'furkies-purrkies.bootstrap.json',
}


async function main(){
  const input = path.resolve(path.join(options.distributionDirectoryPath, options.dataFeedDirectory, options.inputFeedFile));
  const output = path.resolve(path.join(options.distributionDirectoryPath, options.dataFeedDirectory, options.outputFeedFile));
  const feed = JSON.parse(fs.readFileSync(input).toString());


  feed.data.forEach(entry=>{


    {
      const $ = cheerio.load(entry.html);

      $('div.section').each(function (i, elem) {
        $(this).addClass('avoid-break-inside');
        $(this).css({'padding-bottom': '2rem'});
      });

      $('div.section > hr').each(function (i, elem) {
        $(this).replaceWith(`<br>`)
      });

      $('div.section > p').each(function (i, elem) {
        this.tagName = 'div';
        $(this).addClass('paragraph');
      });

      $('a').each(function (i, elem) {
        $(this).replaceWith(`<span>${$(this).text()} <small>(${$(this).attr('href')})</small></span>`)
      });

      let updated =  pretty($('body').html(), {ocd:true});
      updated = updated.replace(/&apos;/gi, '\'');
      updated = updated.replace(/&quot;/gi, '"');
      updated = updated.replace(/&amp;/gi, '&');
      entry.print = updated;
    }




    const $ = cheerio.load(entry.html);



      $('div.section > hr').each(function (i, elem) {
        $(this).parent().replaceWith(`<div class="mb-5 section-spacer">&nbsp;</div>`)
      });

      $('div.section > p').each(function (i, elem) {
        this.tagName = 'div';
        $(this).addClass('paragraph');
      });


      $('div.section').each(function (i, elem) {
        $(this).wrap(`<div class="card card-section bg-dark text-warning shadow"></div>`)
      });

      $('div.section').each(function (i, elem) {
          $(this).addClass('card-body mb-0 my-2');
      });

      $('div.section > div.paragraph').each(function (i, elem) {
        $(this).addClass('card-text card-stanza my-5 text-center');
      });

      /// Rebuild






      /// FIX
      $('div.section > img').each(function (i, elem) {
        $(this).addClass('w-100')
      });



    let updated =  pretty($('body').html(), {ocd:true});
    updated = updated.replace(/&apos;/gi, '\'');
    updated = updated.replace(/&quot;/gi, '"');
    updated = updated.replace(/&amp;/gi, '&');
    entry.html = updated;
    //console.log(updated);

  }); // forEach




  fs.writeFileSync(output, JSON.stringify(feed, null, '  '));
}

main()
