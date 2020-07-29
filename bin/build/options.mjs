
const options = {
  title: 'Poetry',
  author: 'Dr. Meow',

  source: 'https://github.com/catpea/poetry',
  website: 'http://catpea.com',

  // Database Containing Posts
  sourceDatabase: {
    path: './db',
    audio: './db/audio',
    image: './db/image',
  },

  // Root Directory for all the generated code.
  distributionDirectory: {
    path: './dist',
  },

  // Configuration for the poetry book generation
  poetryBook: {

    canonical: 'https://catpea.com/',
    directory: 'poetry-book',
    partials: 'partials',

    stylesheet: 'css/stylesheet.css',
    stylecode: 'stylesheet.html',

    index: 'index.html',

    changelog: 'changelog.html',

    sectionFileName:'section-{{id}}.html',
    sectionName:'section-{{id}}',

    template: {
      files: 'templates/poetry-book/files',
      path: 'templates/poetry-book',

      page: 'page.hbs',
      index: 'index.hbs',
      poem: 'poem.hbs',
      print: 'print.hbs',

      stylesheet: 'stylesheet.hbs',
      stylecode: 'stylecode.hbs',
      changelog: 'changelog.hbs',
    },

    css: {
      path: 'templates/poetry-book',
      main: 'stylesheet.mjs',
    }

  },


  //
  // docs: {
  //   path: './docs',
  //   file: 'index.html',
  // },
  //
  //
  //
  // md: {
  //   path: './dist',
  //   file: 'README.md',
  // },
  // readme: {
  //   path: './',
  //   file: 'README.md',
  // },
  // js: {
  //   path: './dist',
  //   file: 'index.js',
  // },
  // mjs: {
  //   path: './dist',
  //   file: 'index.mjs',
  // },
  // sh: {
  //   path: './dist',
  //   file: 'advice.sh',
  // },
}


export default options;
