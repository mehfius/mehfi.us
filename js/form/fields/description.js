(async function (){ 
  
  const form = JSON.parse(sessionStorage.contents_form || '{}');
  const value = form.description || '';

  let e_div = jsonToObject({ 
      tag: 'div'
  });

  let e_label = jsonToObject({
      tag: 'label',
      innerhtml: 'Descrição'
  });

  let e_textarea = jsonToObject({ 
      tag: 'textarea',
      id: 'description',
      placeholder: 'Insira a descrição aqui...',
      value: value
  });

  let e_error = jsonToObject({
      tag: 'error'
  });

  e_div.append(e_label, e_textarea, e_error);
 
  document.querySelector('window > form').append(e_div);

})();
