(async function (){
  
  load('/css/loading.css')

  if(sessionStorage.getItem('token')){
      return rota_contents();
  }


  load('/css/form_login.css')
  load_html('/html/login.html',document.querySelector("body > content"));

})()