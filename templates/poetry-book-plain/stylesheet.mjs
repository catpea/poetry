import merge from 'lodash/merge.js';


const options = {
  responsive: [576, 768, 992, 1200, 1400],
  headings:[
    {name:'h1', from:2.5, to:4.5, unit: 'rem'},
    {name:'h2', from:1.9, to:3.4, unit: 'rem'},
    {name:'h3', from:1.5, to:3.2, unit: 'rem'},
    {name:'h4', from:1.3, to:2.3, unit: 'rem'},
    {name:'h5', from:1.2, to:2.0, unit: 'rem'},
    {name:'h6', from:1.0, to:1.5, unit: 'rem'},
  ]
}


function responsiveSpread({object, path, from, to, unit, responsive}){
  let patch = {};
  let property = path.pop();
  let fraction = (to - from) / responsive.length;

  responsive.forEach((spec,increase)=>{
    const data = {};
    patch[`@media (min-width: ${spec}px)`] = data;
    let location = data;
    for(let fragment of path){
      if(!location[fragment]) location[fragment] = {};
      location = location[fragment];
    }
    location[property] = (from + (fraction*(increase+1))).toFixed(2) + unit;
  });
  console.log(patch);
  object = merge(object, patch);
}
function rem(str){return str+'rem'};








const responsive = {



    // Small devices (landscape phones, 576px and up)
    '@media (min-width: 576px)':{
      'body > *':{
        maxWidth:'540px',
      }
    },

    // Medium devices (tablets, 768px and up)
    '@media (min-width: 768px)':{
      'body > *':{
        maxWidth:'720px',
      }
    },

    // Large devices (desktops, 992px and up)
    '@media (min-width: 992px)':{
      'body > *':{
        maxWidth:'960px',
      }
    },

    // Extra large devices (large desktops, 1200px and up)
    '@media (min-width: 1200px)':{
      'body > *':{
        maxWidth:'1140px',
      }
    },

    // Extra extra large devices (large desktops, 1200px and up)
    '@media (min-width: 1400px)':{
      'body > *':{
        maxWidth:'1320px',
      }
    },





};

const variables = {
   ':root': {
    '--background':`#10181e`,
    '--text':`#a2afb9`,
    '--primary':`#1095c1`,
    '--primary-inverse':`#FFF`,
    '--card-shadow':` 0.5rem 0.5rem 2rem .2rem rgba(0, 0, 0, 1)`,
  }
}

const layout = {
  '*, ::after, ::before': {
    boxSizing: 'border-box',
  },
  'body > *':{
    width: '100%',
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
    boxSizing: 'border-box',
  },
};


const space = {

  'body > *':{
    //marginTop: '3rem',
    marginBottom: '5rem',

    'article':{
      marginBottom: '5rem',
    }
  },

  'ul': {
    padding: '0',
    marginBottom: '1rem',
  },

  'ul ul': {
    padding: '1rem',
    marginBottom: '1rem',
  },

  p: {
    lineHeight: '1.8rem',
    //paddingBottom: '1rem',
  },

  hgroup:{
    marginBottom: '2rem',
    h1:{
      marginBottom: '0.2rem',
    },
    h2:{
      marginBottom: '0.2rem',
    },
    h3:{
      marginBottom: '0.2rem',
    },
    h4:{
      marginBottom: '0.2rem',
    },
    h5:{
      marginBottom: '0.2rem',
    },
    h6:{
      marginBottom: '0.2rem',
    },
  }
}

// options.responsive.forEach((px,ix)=>{
//   space['body > *']['article, ul,'].marginBottom = '';
// })



responsiveSpread({
  object: responsive,
  path: ['body > *', 'marginBottom'],
  from:5,
  to:15,
  unit: 'rem',
  responsive: options.responsive
})
responsiveSpread({
  object: responsive,
  path: ['body > *', 'article', 'marginBottom'],
  from:1,
  to:15,
  unit: 'rem',
  responsive: options.responsive
})
responsiveSpread({
  object: responsive,
  path: ['hgroup', 'marginBottom'],
  from:1,
  to:5,
  unit: 'rem',
  responsive: options.responsive
})
responsiveSpread({
  object: responsive,
  path: ['ul ul', 'marginBottom'],
  from:1,
  to:5,
  unit: 'rem',
  responsive: options.responsive
})
responsiveSpread({
  object: responsive,
  path: ['ul ul', 'padding'],
  from:1,
  to:5,
  unit: 'rem',
  responsive: options.responsive
})


const fonts = {


  // NOTE: The seconday font is applied in the html declaration
   html: {
     color: 'var(--text)',
     backgroundColor: 'var(--background)',
     fontFamily: "'Lato', sans-serif",

   },

   // NOTE:  The primary font is applied in the headings declaration
    'h1, h2, h3, h4, h5, h6': {
      fontFamily: "'Staatliches', sans-serif;",
      fontWeight: '700',
      letterSpacing: '0.035em',
    },

}

const headings = {};

for( let {name, from, to, unit} of options.headings){
  headings[name] = {
    fontSize: from + unit
  }
}

for( let {name, from, to, unit} of options.headings){
  responsiveSpread({
    object: responsive,
    path: [name, 'fontSize'],
    from,
    to,
    unit,
    responsive: options.responsive
  })
}

//responsiveSpread({ object: responsive, path: ['p', 'fontSize'],     from:1.2, to:1.5, unit:'rem', responsive: options.responsive });
responsiveSpread({ object: responsive, path: ['p', 'marginBottom'], from:2,   to:3,   unit:'rem', responsive: options.responsive })
//responsiveSpread({ object: responsive, path: ['p', 'lineHeight'], from:3,   to:4,   unit:'rem', responsive: options.responsive })

const images = {
   img: {
     marginBottom: '2rem',

     width: '100%',
     maxWidth: '100%',
     height: 'auto',
     borderRadius: '.5rem',
     boxShadow: 'var(--card-shadow)',

     filter: 'grayscale(80%)',
     transition: 'filter 1s ease-in-out'

   },
   'img:hover': { filter: 'grayscale(0)' },
}

const links = {
   a: {
     textDecoration: 'none',
     color: 'var(--primary-inverse)',
   },
    'a[role=button],\n  button,\n  input[type=submit]': {
      border: '1px solid transparent',
      padding: '0.75rem 1rem',
      borderRadius: '0.25rem',
      outline: 'none',
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-inverse)',
      fontSize: '1rem',
      fontWeight: 'normal',
      lineHeight: '1.5',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      textDecoration: 'none',

      display: 'inline-block',

    },
}

const lists = {
  ul: { listStyle: 'none', },
  li: { listStyle: 'none', },
}




const css = merge({},
  variables,
  fonts,
  headings,
  layout,
  space,
  images,
  links,
  lists,
  responsive,
)


const foo = {



  //
  // ':root': {
  //
  //     '--background':`#10181e`,
  //     '--text':`#a2afb9`,
  //
  //     '--h1':`#edf0f3`,
  //     '--h2':`#d5dce2`,
  //     '--h3':`#bbc6ce`,
  //     '--h4':`#a2afb9`,
  //     '--h5':`#8a99a3`,
  //     '--h6':`#73828c`,
  //
  //     '--primary':`#1095c1`,
  //     '--primary-hover':`#1ab3e6`,
  //     '--primary-focus':`rgba(16, 149, 193, 0.25)`,
  //     '--primary-inverse':`#FFF`,
  //     '--secondary':`#596b78`,
  //     '--secondary-hover':`#73828c`,
  //     '--secondary-focus':`rgba(89, 107, 120, 0.25)`,
  //     '--secondary-inverse':`#FFF`,
  //     '--contrast':`#d5dce2`,
  //     '--contrast-hover':`#FFF`,
  //     '--contrast-focus':`rgba(89, 107, 120, 0.25)`,
  //     '--contrast-border':`rgba(255, 223, 128, 0.33)`,
  //     '--contrast-inverse':`#10181e`,
  //     '--input-background':`#10181e`,
  //     '--input-border':`#374956`,
  //     '--valid':`#1f7a5c`,
  //     '--invalid':`#943838`,
  //     '--mark':`rgba(255, 223, 128, 0.5)`,
  //     '--mark-text':`#FFF`,
  //     '--muted-text':`#73828c`,
  //     '--muted-background':`#10181e`,
  //     '--muted-border':`#23333e`,
  //     '--card-background':`#17232b`,
  //     '--card-sections':`#141d24`,
  //     '--card-shadow':` 0.5rem 0.5rem 2rem .2rem rgba(0, 0, 0, 1)`,
  //     '--code-background':`#141d24`,
  //     '--code-inlined':`rgba(65, 84, 98, 0.25)`,
  //     '--code-color-1':`#73828c`,
  //     '--code-color-2':`#a65980`,
  //     '--code-color-3':`#599fa6`,
  //     '--code-color-4':`#8c8473`,
  //     '--code-color-5':`#4d606d`,
  //     '--table-border':`#10181e`,
  //     '--table-stripping':`rgba(115, 130, 140, 0.02)`,
  //
  // },
  //
  // //NOTE: The seconday font is applied in the html declaration
  //  html: {
  //    color: 'var(--text)',
  //    backgroundColor: 'var(--background)',
  //    fontFamily: "'Montserrat', sans-serif"
  //  },
  //
  //
  //
  //  // header: { marginBottom: '3rem' },
  //
  //  'article > p': { marginTop: '2rem', marginBottom: '2rem' },
  //
  //  img: {
  //    maxWidth: '50%',
  //    height: 'auto',
  //    borderRadius: '.5rem',
  //    boxShadow: 'var(--card-shadow)',
  //    filter: 'grayscale(80%)',
  //    transition: 'filter 1s ease-in-out'
  //  },
  //  'img:hover': { filter: 'grayscale(0)' },
  //
  //  //NOTE:  ul has default padding and margin removed, these are automatically calculated in the responsive section
  //  ul: {
  //    listStyle: 'none',
  //    margin: 0,
  //    padding: 0,
  //  },
  //
  //  'a:active,\n  a:focus,\n  a:hover': { color: 'var(--primary-hover)' },
  //  'a:focus': { outline: 'none', backgroundColor: 'var(--primary-focus)' },
  //
  //
  //  'a[role=button],\n  button,\n  input[type=submit]': {
  //    border: '1px solid transparent',
  //    padding: '0.75rem 1rem',
  //    borderRadius: '0.25rem',
  //    outline: 'none',
  //    backgroundColor: 'var(--primary)',
  //    color: 'var(--primary-inverse)',
  //    fontSize: '1rem',
  //    fontWeight: 'normal',
  //    lineHeight: '1.5',
  //    textAlign: 'center',
  //    cursor: 'pointer',
  //    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  //    textDecoration: 'none'
  //  },
  //
  //  //NOTE:  The primary font is applied in the headings declaration
  //  'h1, h2, h3, h4, h5, h6': {
  //    fontFamily: "'Old Standard TT', serif",
  //    fontWeight: '700',
  //    letterSpacing: '0.035em',
  //    marginTop: '2rem',
  //    marginLeft: '0rem',
  //    marginBottom: '0'
  //  },
  //  // 'h1, h1 > a': { color: 'var(--h1)', fontSize: '4rem' },
  //  // 'h2, h2 > a': { color: 'var(--h2)', fontSize: '1.75rem' },
  //  // 'h3, h3 > a': { color: 'var(--h3)', fontSize: '1.2rem' },
  //  // 'h4, h4 > a': { color: 'var(--h4)', fontSize: '1.1rem' },
  //  // 'h5, h5 > a': { color: 'var(--h5)', fontSize: '1rem' },
  //  // 'h6, h6 > a': { color: 'var(--h6)', fontSize: '.9rem' },
  //  a: {
  //    backgroundColor: 'transparent',
  //    color: 'var(--primary)',
  //    textDecoration: 'none',
  //    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, text-decoration 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
  //  },
  //

};




// for breakpoints....

export default async function (options) {

  return css;
}
