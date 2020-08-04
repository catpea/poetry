const options = {

  sourceDatabasePath: './db', // used to get a list of md files
  sectionFileName:'section-{{id}}', // used in filename calculations
  sectionName:'section-{{id}}', // used in filename calculations
  distributionDirectoryPath: './dist', // to save the feed to
  dataFeedFile: 'feed.json',
  dataFeedDirectory: 'feed',

}

export default options;
