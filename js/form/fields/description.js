(async function (){ 
  
  const form = JSON.parse(sessionStorage.contents_form || '{}');
  const value = form.description || '';

  let e_div = jte({ 
      tag: 'div'
  });

  let e_label = jte({
      tag: 'label',
      innerhtml: 'Descrição'
  });

  let e_textarea = jte({ 
      tag: 'textarea',
      id: 'description',
      placeholder: 'Insira a descrição aqui...',
      value: value
  });

  let e_error = jte({
      tag: 'error'
  });

  e_div.append(e_label, e_textarea, e_error);
 
  document.querySelector('dialog > content > form').append(e_div);

})();
