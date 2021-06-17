export default {
  format: 'v1',
  name: "furkies-purrkies",
  title: "Furkies Purrkies",
  subtitle: "Anthology of Inspirational Rhyme",
  description: "Just another dang old Audio Book about wisdom and growing up.",
  icon: "earbuds",

  "links":{
    "Source Code":"https://github.com/catpea/poetry",
    "Mirror":"https://catpea.github.io/poetry/",
    "Bugs":"https://github.com/catpea/poetry/issues",
    "YouTube":"https://www.youtube.com/playlist?list=PLOo-pqnffyOqsK6hf5tFwMqzvhogksrgW"
  },

  dependencies: {

    // OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO //
    //   ONLY FOR FILES NOT LINKED IN POEMS!!!!!  //
    // OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO //

    'src/image/poetry-cover.jpg': 'image',
    'src/audio/audio-jogger.mp3': 'audio',
    'src/audio/bird-pecking-complaint.mp3': 'audio',
    'src/audio/emergence.mp3': 'audio',
    //'src/audio/bonus-phone-ring.mp3': 'audio', // this one is linked.

  },

  order: "latest",

  plugins: {
    coverImages: {},
    resizeCoverImage: {},
    convertAudioToVideo: {},
    createMirror: {},
    createWebsite: {},
    localAssets: {},
    // yamlDatabase: {},
    // createContactSheetImage: {},
    // downloadVideoThumbnails: {},
  }

}
