

jQuery(function($){

  $('details.color-mode').show();

  var flipButton = $('<button></button>');
  var resetButton = $('<button></button>');
  resetButton.text('System Default')

  $('li.theme-switcher').append(flipButton);
  $('li.theme-switcher-reset').append(resetButton);

  resetButton.on('click', function(){
    localStorage.removeItem('current-theme');
    $('html').attr('data-theme', null);
    updateUI();
  });

  flipButton.on('click', function(){
    // user action entails use of force
    if(getTheme()=='light'){
      $('html').attr('data-theme', 'dark')
      localStorage.setItem('current-theme', 'dark');
    }else{
      // user action entails use of force
      $('html').attr('data-theme', 'light')
      localStorage.setItem('current-theme', 'light');
    }
    updateUI();
  });

  function updateUI(){
    if(getTheme() == 'light'){
      flipButton.text('Force Dark Mode');
    }else{
      flipButton.text('Force Light Mode');
    }
    if(localStorage.getItem('current-theme')){
      resetButton.show();
    }else{
      resetButton.hide();
    }
  }

  function getTheme() {
    if(localStorage.getItem('current-theme')){
      // user is controlling color scheme by hand, override prefers color scheme
      return localStorage.getItem('current-theme');
    }
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  }

  updateUI();

});
