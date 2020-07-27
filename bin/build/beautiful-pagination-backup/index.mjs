import chunk from 'lodash/chunk.js';
import last from 'lodash/last.js';
import padStart from 'lodash/padStart.js';

export default function main(list, options){

  const defaults = {
    perPage: 10,
  };

  const {perPage} = Object.assign({}, defaults, options);

  let data = chunk(list, perPage);
  let numberWidth = (data.length).toString().length + 1;
  data = data
  .map((entry,index)=>({meta:{
    pageNumber: index+1,

    currentSection:null,
    olderSection:null,
    newerSection:null,

    isFirst:null,
    isLast:null,
    previousPage:null,
    nextPage:null
  },data:entry}))
  .map((entry,index)=>{


    entry.meta.isFirst = entry.meta.pageNumber==1?true:false;
    entry.meta.isLast =  entry.meta.pageNumber==data.length?true:false;

    entry.meta.lastPage = data.length;

    entry.meta.previousPage = entry.meta.pageNumber - 1;
    entry.meta.nextPage = entry.meta.pageNumber + 1;

    if (entry.meta.previousPage == 0) entry.meta.previousPage = entry.meta.lastPage;
    if (entry.meta.nextPage > entry.meta.lastPage) entry.meta.nextPage = 1;

    let newestSectionNumber = data.length;
    let oldestSectionNumber = 1; // oldest section is page one
    let currentSectionNumber = data.length - (index);
    let olderSectionNumber = currentSectionNumber - 1;
    let newerSectionNumber = currentSectionNumber + 1;

    if (olderSectionNumber == 0) olderSectionNumber = newestSectionNumber; // wrap around
    if (newerSectionNumber > newestSectionNumber) newerSectionNumber = oldestSectionNumber; // wrap around


    entry.meta.newestSection = padStart(( newestSectionNumber ).toString(), numberWidth, '0'); // relative to number of characters in the last page.
    entry.meta.currentSection = padStart(( currentSectionNumber ).toString(), numberWidth, '0'); // relative to number of characters in the last page.
    entry.meta.olderSection = padStart(( olderSectionNumber ).toString(), numberWidth, '0'); // relative to number of characters in the last page.
    entry.meta.newerSection = padStart(( newerSectionNumber ).toString(), numberWidth, '0'); // relative to number of characters in the last page.

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
