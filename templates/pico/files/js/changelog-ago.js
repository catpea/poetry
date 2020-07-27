jQuery(function($){
  $('section.log-entry').each(function( index ) {
    var dateCreated = $('meta[itemprop="dateCreated"]', this ).attr('datetime');
    var node = $('<h4></h4>')
    $('hgroup', this ).append(node);
    var update = function(){ node.text(moment(dateCreated).from(moment())) };
    setInterval(update,1000*60);
    update();
  });
})
