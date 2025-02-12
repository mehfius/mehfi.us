(async function (){
  
  speedj('/css/loading.css');

  if(sessionStorage.getItem('token')){
      return rota_contents();
  }

  speedj('/css/form_login.css');
/*   await load_html('/html/login.html',document.querySelector("body > content")); */

/*   document.querySelector('loading').removeAttribute('show');
 */
})()