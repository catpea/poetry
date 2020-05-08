const oneOf = require('./index.js');

console.log( oneOf() );
console.log( oneOf([]) );

for (var x = 0; x<10; x++){
  console.log(oneOf(['a', 'b', 'c']))
}
