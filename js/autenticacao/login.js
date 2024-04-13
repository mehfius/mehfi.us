
    fetch('/html/login.html')
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

      document.body.append(objetoHTML.body.childNodes[0])
 
    })
    .catch(error => {
      console.error('Erro:', error);
    });

