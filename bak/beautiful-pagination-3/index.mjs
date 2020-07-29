import chunk from 'lodash/chunk.js';
import last from 'lodash/last.js';
import template from 'lodash/template.js';
import padStart from 'lodash/padStart.js';
import cloneDeep from 'lodash/cloneDeep.js';

export default function main(original, options){

  const defaults = {
    perPage: 10,

    sectionFileName:'section-{{id}}.html',
    sectionName:'section-{{id}}',
  };

  const {perPage,sectionFileName,sectionName} = Object.assign({}, defaults, options);

  // Clone original data.
  let list = cloneDeep(original);

  // Even out number of items.
  while(list.length%perPage){ list.unshift(null); }

  // Chunk it into pieces.
  let data = chunk(list, perPage);

  // Clean up the padding.
  data[0] = data[0].filter(i=>i)

  // Calculate number of caharacters to create tidy padding.
  let numberWidth = (data.length).toString().length + 1;

  data = data
  .map((entry,index)=>({meta:{}, data:entry}))
  .map((entry,index)=>{




    //entry.meta.lastPage = data.length;
    //entry.meta.previousPage = entry.meta.pageNumber - 1;
    //entry.meta.nextPage = entry.meta.pageNumber + 1;
    //if (entry.meta.previousPage == 0) entry.meta.previousPage = entry.meta.lastPage;
    //if (entry.meta.nextPage > entry.meta.lastPage) entry.meta.nextPage = 1;

    let newestSectionNumber = data.length;
    let oldestSectionNumber = 1; // oldest section is page one
    let currentSectionNumber = data.length - (index);
    let olderSectionNumber = currentSectionNumber - 1;
    let newerSectionNumber = currentSectionNumber + 1;

    if (olderSectionNumber == 0) olderSectionNumber = newestSectionNumber; // wrap around
    if (newerSectionNumber > newestSectionNumber) newerSectionNumber = oldestSectionNumber; // wrap around

    let newestSection = padStart(( newestSectionNumber ).toString(), numberWidth, '0'); // relative to number of characters in the last page.
    let oldestSection = padStart(( oldestSectionNumber ).toString(), numberWidth, '0'); // relative to number of characters in the last page.
    let currentSection = padStart(( currentSectionNumber ).toString(), numberWidth, '0'); // relative to number of characters in the last page.
    let olderSection = padStart(( olderSectionNumber ).toString(), numberWidth, '0'); // relative to number of characters in the last page.
    let newerSection = padStart(( newerSectionNumber ).toString(), numberWidth, '0'); // relative to number of characters in the last page.

    entry.meta.sectionNumber = currentSectionNumber;

    entry.meta.isNewest = currentSectionNumber==1?true:false;
    entry.meta.isOldest =  currentSectionNumber==data.length?true:false;

    const sectionFileNameTemplate = template(sectionFileName, { interpolate: /{{([\s\S]+?)}}/g, });
    entry.meta.currentFileName = sectionFileNameTemplate({id:currentSection});
    entry.meta.olderFileName = sectionFileNameTemplate({id:olderSection});
    entry.meta.newerFileName = sectionFileNameTemplate({id:newerSection});

    const sectionNameTemplate = template(sectionName, { interpolate: /{{([\s\S]+?)}}/g, });
    entry.meta.sectionName = sectionNameTemplate({id:currentSection});

    // TODO: find a nice way to create some page numbers
    // entry.meta.previousPages = [];
    // entry.meta.nextPages = [];

    // TODO: create a chain of clickable pages
    // TODO: honor timestamps and introduce concept of OLDER/NEWER pagination


    return entry;
  })

  const meta = {
    perPage,
    totalItems: list.length,
    totalPages: data.length,
  }

  const response = {meta, data};


  return response;

}
