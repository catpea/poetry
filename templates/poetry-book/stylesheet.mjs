const html = {

  breakpoints: [
    { name:'xs',  value:0,    maxWidth:'auto',    fontDelta: 1,  paddingDelta: .5},
    { name:'sm',  value:576,  maxWidth:500,  fontDelta:.9,  paddingDelta: 2.2},
    { name:'md',  value:768,  maxWidth:700,  fontDelta:.85, paddingDelta: 3.6},
    { name:'lg',  value:992,  maxWidth:900,  fontDelta:.8,  paddingDelta: 3.8},
    { name:'xl',  value:1200, maxWidth:1100, fontDelta:.75, paddingDelta: 3.7},
    { name:'xxl', value:1400, maxWidth:1000, fontDelta:.7,  paddingDelta: 4},
  ],

  headings: [
    { name: 'h1', value:0, fontSize: 2.5 },
    { name: 'h2', value:0, fontSize: 2.4 },
    { name: 'h3', value:0, fontSize: 2.2 },
    { name: 'h4', value:0, fontSize: 1.7 },
    { name: 'h5', value:0, fontSize: 1.5 },
    { name: 'h6', value:0, fontSize: 1 },
  ],


}


function rem(str){return str+'rem'};

const css = {

  "@import url('https://fonts.googleapis.com/css2?family=Montserrat&family=Old+Standard+TT:wght@700&display=swap')": true,

  ':root': {

      '--background':`#10181e`,
      '--text':`#a2afb9`,

      '--h1':`#edf0f3`,
      '--h2':`#d5dce2`,
      '--h3':`#bbc6ce`,
      '--h4':`#a2afb9`,
      '--h5':`#8a99a3`,
      '--h6':`#73828c`,

      '--primary':`#1095c1`,
      '--primary-hover':`#1ab3e6`,
      '--primary-focus':`rgba(16, 149, 193, 0.25)`,
      '--primary-inverse':`#FFF`,
      '--secondary':`#596b78`,
      '--secondary-hover':`#73828c`,
      '--secondary-focus':`rgba(89, 107, 120, 0.25)`,
      '--secondary-inverse':`#FFF`,
      '--contrast':`#d5dce2`,
      '--contrast-hover':`#FFF`,
      '--contrast-focus':`rgba(89, 107, 120, 0.25)`,
      '--contrast-border':`rgba(255, 223, 128, 0.33)`,
      '--contrast-inverse':`#10181e`,
      '--input-background':`#10181e`,
      '--input-border':`#374956`,
      '--valid':`#1f7a5c`,
      '--invalid':`#943838`,
      '--mark':`rgba(255, 223, 128, 0.5)`,
      '--mark-text':`#FFF`,
      '--muted-text':`#73828c`,
      '--muted-background':`#10181e`,
      '--muted-border':`#23333e`,
      '--card-background':`#17232b`,
      '--card-sections':`#141d24`,
      '--card-shadow':` 0.5rem 0.5rem 2rem .2rem rgba(0, 0, 0, 1)`,
      '--code-background':`#141d24`,
      '--code-inlined':`rgba(65, 84, 98, 0.25)`,
      '--code-color-1':`#73828c`,
      '--code-color-2':`#a65980`,
      '--code-color-3':`#599fa6`,
      '--code-color-4':`#8c8473`,
      '--code-color-5':`#4d606d`,
      '--table-border':`#10181e`,
      '--table-stripping':`rgba(115, 130, 140, 0.02)`,

  },

  //NOTE: The seconday font is applied in the html declaration
   html: {
     color: 'var(--text)',
     backgroundColor: 'var(--background)',
     fontFamily: "'Montserrat', sans-serif"
   },



   // header: { marginBottom: '3rem' },

   'article > p': { marginTop: '2rem', marginBottom: '2rem' },

   img: {
     maxWidth: '50%',
     height: 'auto',
     borderRadius: '.5rem',
     boxShadow: 'var(--card-shadow)',
     filter: 'grayscale(80%)',
     transition: 'filter 1s ease-in-out'
   },
   'img:hover': { filter: 'grayscale(0)' },

   //NOTE:  ul has default padding and margin removed, these are automatically calculated in the responsive section
   ul: {
     listStyle: 'none',
     margin: 0,
     padding: 0,
   },

   'a:active,\n  a:focus,\n  a:hover': { color: 'var(--primary-hover)' },
   'a:focus': { outline: 'none', backgroundColor: 'var(--primary-focus)' },


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
     textDecoration: 'none'
   },

   //NOTE:  The primary font is applied in the headings declaration
   'h1, h2, h3, h4, h5, h6': {
     fontFamily: "'Old Standard TT', serif",
     fontWeight: '700',
     letterSpacing: '0.035em',
     marginTop: '2rem',
     marginLeft: '0rem',
     marginBottom: '0'
   },
   // 'h1, h1 > a': { color: 'var(--h1)', fontSize: '4rem' },
   // 'h2, h2 > a': { color: 'var(--h2)', fontSize: '1.75rem' },
   // 'h3, h3 > a': { color: 'var(--h3)', fontSize: '1.2rem' },
   // 'h4, h4 > a': { color: 'var(--h4)', fontSize: '1.1rem' },
   // 'h5, h5 > a': { color: 'var(--h5)', fontSize: '1rem' },
   // 'h6, h6 > a': { color: 'var(--h6)', fontSize: '.9rem' },
   a: {
     backgroundColor: 'transparent',
     color: 'var(--primary)',
     textDecoration: 'none',
     transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, text-decoration 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
   },


};




// for breakpoints....

export default async function (options) {

  for ( let breakpoint of html.breakpoints ) {
    let stylesheet = {};

    if(breakpoint.value){
      css[`@media (min-width:${breakpoint.value}px)`] = stylesheet;
    }else{
      stylesheet = css;
    }

    for (let heading of html.headings){
      stylesheet[heading.name] = {
        fontSize: rem(heading.fontSize * breakpoint.fontDelta)
      };
    }


    stylesheet['body > header, body > nav, body > main, body > footer'] = {
      border: '1px solid gold',
      paddingTop: rem(.5*breakpoint.paddingDelta),
      paddingBottom: rem(1*breakpoint.paddingDelta),

      display: 'block',
      width: '100%',
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      maxWidth: (typeof breakpoint.maxWidth === 'string')?breakpoint.maxWidth:breakpoint.maxWidth+'px',
    };


    stylesheet['nav, main, aside, article, section'] = {
      //padding: rem(1*breakpoint.paddingDelta)
    };

    stylesheet['li > ul'] = {
      padding: rem(1*breakpoint.paddingDelta)
    };

  }

  return css;
}
