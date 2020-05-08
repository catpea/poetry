module.exports = function(list){

  if(list == undefined) return null;
  if(list.length === 0) return null;

  var min = 0;
  var max = list.length-1;

  var idx = Math.floor( Math.random() * (max - min + 1)) + min;
  
  return list[idx];

}
