# beautiful-pagination
Split array into equal parts and generate metadata for use with GUI pagers.

## Example

for (let pagePosts of pageStream.data){
  //console.log(pagePosts);
  const currentFileName = `page-${pagePosts.meta.currentSection}.ext`
  const olderFileName = `page-${pagePosts.meta.olderSection}.ext`
  const newerFileName = `page-${pagePosts.meta.newerSection}.ext`

  console.log(pagePosts.meta.isLast?'NO MORE     ':olderFileName,currentFileName,pagePosts.meta.isFirst?'NO MORE      ':newerFileName, pagePosts.meta.isFirst?'START':'', pagePosts.meta.isLast?'END':'');

  // for printing the page
  for (let post of pagePosts.data){ // contains "perPage" number of records.
    // console.log(post.meta);
    // break;
  }
  //break;
}
