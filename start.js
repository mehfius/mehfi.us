

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucHl6eWRsdmN4c2JpdWt1ZmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIzMzk5MDYsImV4cCI6MTk5NzkxNTkwNn0.WZhQPFurWP-H0dnFQWW2ejxdnw0Bb1sPfVi8qtKcaPA"
const url = "https://snpyzydlvcxsbiukufip.supabase.co/"
const supabase = { "key":key, "url": url }

sessionStorage.setItem("supabase", JSON.stringify(supabase));

const load_start = async function(){

  var url = supabase.url + "rest/v1/rpc/start";
  
  fetch(url, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'apikey': supabase.key },
    body: JSON.stringify({ 'agent': navigator.userAgent })
  })  
  .then(response => response.json())
  .then(data => {
    load_scripts(data.scripts); 
     set_session(data.config);
  })
  .catch(error => {
    console.error('Error:', error);
  });

}();

const load_scripts = function(json){
  
/*   if(window.location.hostname=='mehfius.app'){ */
   
  var url_js = supabase.url + "storage/v1/object/public/js/all/"+json.js.production.uuid+".js";
  var url_css = supabase.url + "storage/v1/object/public/css/all/"+json.css.production.uuid+".css";

/*   }else{

    var url_js = localStorage.getItem("supabaseurl")+"storage/v1/object/public/js/all/"+json.js.dev.uuid+".js";
    var url_css = localStorage.getItem("supabaseurl")+"storage/v1/object/public/css/all/"+json.css.dev.uuid+".css";
    
  } */

  load_css(url_css);
  
  script = document.createElement("script");
  script.setAttribute("onload","load()");
  script.src = url_js;

  document.head.appendChild(script);


  Object.entries(json.js.third).forEach(([key, value]) => {
 
    let url_js = value.label;
    
    load_js(url_js);
    
  });

  Object.entries(json.css.third).forEach(([key, value]) => {
    
    let url_css = value.label;
    
    load_css(url_css);
    
  });

}

const load_css = function(url){
  
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
  
}

const load_js = function(url){
  
  script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);

}

const set_session = function(data){

  var text = [];
  var config = {};

  for (var [key, value] of Object.entries(data)) {

    config[value.label] = value.value;

  }

  localStorage.config = JSON.stringify(config);

}
