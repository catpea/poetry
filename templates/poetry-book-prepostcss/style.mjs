const html = {

  breakpoints: [
    { name:'xs',  value:0,    fontDelta: 1, paddingDelta: 1},
    { name:'sm',  value:576,  fontDelta:.9, paddingDelta: 1.2},
    { name:'md',  value:768,  fontDelta:.8, paddingDelta: 1.6},
    { name:'lg',  value:992,  fontDelta:.7, paddingDelta: 2},
    { name:'xl',  value:1200, fontDelta:.5, paddingDelta: 2.5},
    { name:'xxl', value:1400, fontDelta:.4, paddingDelta: 3},
  ],

  headings: [
    { name: 'h1', value:0, fontSize: 5 },
    { name: 'h2', value:0, fontSize: 4 },
    { name: 'h3', value:0, fontSize: 3.5 },
    { name: 'h4', value:0, fontSize: 3 },
    { name: 'h5', value:0, fontSize: 2.5 },
    { name: 'h6', value:0, fontSize: 2 },
  ],


}


function rem(str){return str+'rem'};

const css = {



    bork: {
      top: 10,
      "&:hover": {
        top: 5,
      },
    },

};




// for breakpoints....

export default async function (options) {

  for ( let breakpoint of html.breakpoints ) {
    let stylesheet = {};

    if(breakpoint.value){
      css[`@media (min-width:${breakpoint.value})`] = stylesheet;
    }else{
      stylesheet = css;
    }

    for (let heading of html.headings){
      stylesheet[heading.name] = {
        fontSize: rem(heading.fontSize * breakpoint.fontDelta)
      };
    }

  }

  return css;
}
