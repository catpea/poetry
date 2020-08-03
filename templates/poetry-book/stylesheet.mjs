#!/usr/bin/env -S node --experimental-modules

import util from 'util';
import merge from 'lodash/merge.js';


const options = {
  fibonacci:   [   5,   8,  13,   21,   34,   55],
  designations:['sm','md','lg', 'xl','xxl','xxxl'],
  breakpoints: [576,  768, 992, 1200, 1400, 1600],
  container:   [540,  720, 960, 1140, 1320, 1400, 'px'],

  styles:{
    ':root': {
     '--background':`#10181e`,
     '--text':`#a2afb9`,
     '--primary':`#1095c1`,
     '--primary-inverse':`#FFF`,
     '--card-shadow':` 0.5rem 0.5rem 2rem .2rem rgba(0, 0, 0, 1)`,
   },


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

   // NOTE: The seconday font is applied in the html declaration
    html: {
      color: 'var(--text)',
      backgroundColor: 'var(--background)',
      fontFamily: "'Lato', sans-serif",

    },

  // NOTE:  The primary font is applied in the headings declaration
   'h1, h2, h3, h4, h5': {
     fontFamily: "'Staatliches', sans-serif;",
     fontWeight: '700',
     letterSpacing: '0.035em',
   },

   menu: { paddingLeft: 0},

   ol: { paddingLeft: 'none',},
   ul: { paddingLeft: 0, listStyle: 'none'},
   'ul ul': {
     paddingLeft: '1rem',
   },
   li: { listStyle: 'none',},


   img: {
     marginBottom: '2rem',

     width: '100%',
     maxWidth: '100%',
     height: 'auto',
     borderRadius: '.5rem',
     boxShadow: 'var(--card-shadow)',

     // filter: 'grayscale(80%)',
     // transition: 'filter 1s ease-in-out'

   },
   //'img:hover': { filter: 'grayscale(0)' },

   // LINKS
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

    hgroup:{
      marginBottom: '2rem',
      h1:{
        marginTop: '0.2rem',
        marginBottom: '0.2rem',
      },
      h2:{
        marginTop: '0.2rem',
        marginBottom: '0.2rem',
      },
      h3:{
        marginTop: '0.2rem',
        marginBottom: '0.2rem',
      },
      h4:{
        marginTop: '0.2rem',
        marginBottom: '0.2rem',
      },
      h5:{
        marginTop: '0.2rem',
        marginBottom: '0.2rem',
      },
      h6:{
        marginTop: '0.2rem',
        marginBottom: '0.2rem',
      },
    },

    'header > hgroup': {paddingBottom: '3rem'},
    'header > nav > menu > li': { fontSize: '1.1rem', marginBottom: '1.2rem' },
    'footer > nav > menu > li': { fontSize: '1.1rem', marginBottom: '1.2rem' },

  },

  responsive:[


    {path: ['li > h2'], property:[{name:'paddingTop', from:2.5, to:4.5, unit:'rem'}] }, // top padding for h2 tags within a list

    {path: ['h1'], property:[{name:'fontSize', from:2.5, to:4.5, unit:'rem'}] },
    {path: ['h2'], property:[{name:'fontSize', from:1.9, to:3.4, unit:'rem'}] },
    {path: ['h3'], property:[{name:'fontSize', from:1.5, to:3.2, unit:'rem'}] },
    {path: ['h4'], property:[{name:'fontSize', from:1.3, to:2.3, unit:'rem'}] },
    {path: ['h5'], property:[{name:'fontSize', from:1.2, to:2.0, unit:'rem'}] },
    {path: ['h6'], property:[{name:'fontSize', from:1.0, to:0.9, unit:'rem'}] },

    {path: ['p'], property:[
      {name:'marginBottom', from:2, to:5, unit:'rem'},
      {name:'fontSize', from:1.1, to:1.7, unit:'rem'},
    ]},


    {path: ['body > *'], property:[
      {name:'marginTop',    from:1.0, to:1.5, unit:'rem'},
      {name:'marginBottom', from:5, to:10, unit:'rem'}
    ]},

    {path: ['body > *', 'article'], property:[
      {name:'marginBottom', from:5, to:10, unit:'rem'}
    ]},
    {path: ['body > *', 'article header'], property:[
      {name:'marginBottom', from:5, to:8, unit:'rem'}
    ]},

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
  //console.log(patch);
  object = merge(object, patch);
}


function rem(str){return str+'rem'};





//
//
//
// const responsive = {
//
//
//
//     // Small devices (landscape phones, 576px and up)
//     '@media (min-width: 576px)':{
//       'body > *':{
//         maxWidth:'540px',
//       }
//     },
//
//     // Medium devices (tablets, 768px and up)
//     '@media (min-width: 768px)':{
//       'body > *':{
//         maxWidth:'720px',
//       }
//     },
//
//     // Large devices (desktops, 992px and up)
//     '@media (min-width: 992px)':{
//       'body > *':{
//         maxWidth:'960px',
//       }
//     },
//
//     // Extra large devices (large desktops, 1200px and up)
//     '@media (min-width: 1200px)':{
//       'body > *':{
//         maxWidth:'1140px',
//       }
//     },
//
//     // Extra extra large devices (large desktops, 1200px and up)
//     '@media (min-width: 1400px)':{
//       'body > *':{
//         maxWidth:'1320px',
//       }
//     },
//
//
//
//
//
// };
//
//
// const layout = {
//   '*, ::after, ::before': {
//     boxSizing: 'border-box',
//   },
//   'body > *':{
//     width: '100%',
//     paddingRight: '15px',
//     paddingLeft: '15px',
//     marginRight: 'auto',
//     marginLeft: 'auto',
//     boxSizing: 'border-box',
//   },
// };
//
//
// const space = {
//
//   'body > *':{
//     //marginTop: '3rem',
//     marginBottom: '5rem',
//
//     'article':{
//       marginBottom: '5rem',
//     }
//   },
//
//   'ul': {
//     padding: '0',
//     marginBottom: '1rem',
//   },
//
//   'ul ul': {
//     padding: '1rem',
//     marginBottom: '1rem',
//   },
//
//   p: {
//     lineHeight: '1.8rem',
//     //paddingBottom: '1rem',
//   },
//
//
// }
//
// // options.responsive.forEach((px,ix)=>{
// //   space['body > *']['article, ul,'].marginBottom = '';
// // })
//
//
//
//
// responsiveSpread({
//   object: responsive,
//   path: ['body > *', 'article', 'marginBottom'],
//   from:1,
//   to:15,
//   unit: 'rem',
//   responsive: options.responsive
// })
// responsiveSpread({
//   object: responsive,
//   path: ['hgroup', 'marginBottom'],
//   from:1,
//   to:5,
//   unit: 'rem',
//   responsive: options.responsive
// })
// responsiveSpread({
//   object: responsive,
//   path: ['ul ul', 'marginBottom'],
//   from:1,
//   to:5,
//   unit: 'rem',
//   responsive: options.responsive
// })
// responsiveSpread({
//   object: responsive,
//   path: ['ul ul', 'padding'],
//   from:1,
//   to:5,
//   unit: 'rem',
//   responsive: options.responsive
// })
//
//
// const fonts = {
//
//
//   // NOTE: The seconday font is applied in the html declaration
//    html: {
//      color: 'var(--text)',
//      backgroundColor: 'var(--background)',
//      fontFamily: "'Lato', sans-serif",
//
//    },
//
//    // NOTE:  The primary font is applied in the headings declaration
//     'h1, h2, h3, h4, h5, h6': {
//       fontFamily: "'Staatliches', sans-serif;",
//       fontWeight: '700',
//       letterSpacing: '0.035em',
//     },
//
// }
//
// const headings = {};
//
//
//
//
//
//

function calculate(options){
  const base = merge({}, options.styles);
  const responsive = {};

  options.breakpoints.forEach((breakpointWidth,index)=>{
    const containerWidth = options.container[index];
    responsive[`@media (min-width: ${breakpointWidth}px)`] = {'body > *':{maxWidth: `${containerWidth}px`}};
  })

  options.breakpoints.forEach((breakpointWidth,index)=>{
    const containerWidth = options.container[index];
    responsive[`@media (min-width: ${breakpointWidth}px)`] = {'body > *':{maxWidth: `${containerWidth}px`}};
  })

  options.responsive.forEach((item)=>{
     let location = base;
    for(let fragment of item.path){
      if(!location[fragment]) location[fragment] = {};
      location = location[fragment];
    }
    for(let setup of item.property){
      location[setup.name] = setup.from + setup.unit;
    }
  });

  options.responsive.forEach((item)=>{
    options.breakpoints.forEach((breakpointWidth,increase)=>{

      let location = responsive[`@media (min-width: ${breakpointWidth}px)`]
      for(let fragment of item.path){
        if(!location[fragment]) location[fragment] = {};
        location = location[fragment];
      }
      for(let setup of item.property){
        let fraction = (setup.to - setup.from) / options.breakpoints.length;
        // ????????????? location[setup.name] = setup.from + setup.unit;
        location[setup.name] = (setup.from + (fraction*(increase+1))).toFixed(2) + setup.unit;
      }
    })
  })

  const response = merge({}, base, responsive);
  return response;
}

export default async function main () {
  const css = calculate(options);
  return css;
}

//console.log(util.inspect( main() ));
