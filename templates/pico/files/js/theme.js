document.addEventListener('DOMContentLoaded', (event) => {
  var currentTheme = localStorage.getItem('current-theme');
  if(currentTheme){
    document.querySelector('html').setAttribute('data-theme', currentTheme);
  }
})
