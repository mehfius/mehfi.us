const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd25ucWJwb2hobGRmcm9vZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTc2MjgsImV4cCI6MjAyODQzMzYyOH0.Mrxll-WATVuV0NXB36Tf2LJBf5KDZRsXSqFhLmTVbME"
const url = "https://kgwnnqbpohhldfroogmm.supabase.co/"
const supabase = { "key":key, "url": url }

sessionStorage.setItem("supabase", JSON.stringify(supabase));

const load_js = async function(url){
  
    script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
  
}

const load_css = function(url){
    
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    
}

const load_function = async function(url){

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