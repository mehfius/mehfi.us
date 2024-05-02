const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd25ucWJwb2hobGRmcm9vZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTc2MjgsImV4cCI6MjAyODQzMzYyOH0.Mrxll-WATVuV0NXB36Tf2LJBf5KDZRsXSqFhLmTVbME"
const url = "https://kgwnnqbpohhldfroogmm.supabase.co/"
const supabase = { "key":key, "url": url }

sessionStorage.setItem("supabase", JSON.stringify(supabase));

const load = async function(url){
  return new Promise((resolve, reject) => {

    const ext = url.split('.').pop().toLowerCase();

    document.querySelector('loading').setAttribute('show','1')

    switch (ext) {
      case 'js':

        let previousScripts = document.querySelectorAll('script[src="' + url + '"]');

        const script = document.createElement('script');
        script.src = url;
        script.onload =  () => {
          setTimeout(() => {
            previousScripts.forEach(s => { s.remove(); });
            resolve();
          }, 0); 
        };
        script.onerror = () => reject(`Erro ao carregar ${url}`); 
        document.head.appendChild(script);

        break;
      case 'css':
        
        let previousLinks = document.querySelectorAll('link[rel="stylesheet"][href="' + url + '"]');

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => {
          setTimeout(() => {
            previousLinks.forEach(s => { s.remove(); });
            resolve();
          }, 0);
        };
        link.onerror = () => reject(`Erro ao carregar ${url}`); 
        document.head.appendChild(link);


        break;
      default:
        reject(`Tipo de arquivo desconhecido: ${ext}`);
    }
  });
}
const load_html = async function(url,e){

    fetch(url)
    .then(response => {
      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        throw new Error('Falha ao carregar o arquivo HTML');
      }
      // Retorna o conteúdo do arquivo HTML como texto
      return response.text();
    })
    .then(html => {
      // 2. Transforma o conteúdo HTML em um objeto
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
  
      // 3. Armazena o objeto resultante em uma variável
      const objetoHTML = doc;
  
      // Agora você pode manipular o objeto HTML conforme necessário

      e.innerHTML = '';

      e.append(objetoHTML.body.childNodes[0])
 
    })
    .catch(error => {
      console.error('Erro:', error);
    });

}

const supabase_fetch = function (data) {

    const myHeaders = new Headers();
    myHeaders.append("Apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd25ucWJwb2hobGRmcm9vZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTc2MjgsImV4cCI6MjAyODQzMzYyOH0.Mrxll-WATVuV0NXB36Tf2LJBf5KDZRsXSqFhLmTVbME");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({data});

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch("https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/rpc/"+data.name, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.error(error));        

}

function rota_contents() { load('/js/contents/content.js'); }
function rota_formlogin() { load('/js/autenticacao/form_login.js') }
function rota_form() { load('/js/form.js') }

function rota_contents_delete() { load('/js/contents/content_delete.js'); }

function rota_salvar() { load('/js/form_salvar.js') }
function rota_header() { load('/js/page/header.js') }

function rota_login() { load('/js/autenticacao/login.js') }
