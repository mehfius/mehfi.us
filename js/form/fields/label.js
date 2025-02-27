(async function (){ 

  const form = JSON.parse(sessionStorage.contents_form || '{}');
  const value = form.label || '';

  let e_div = jsonToObject({ 
      tag: 'div'
  });

  let e_label = jsonToObject({
      tag: 'label',
      innerhtml: 'Título'
  });

  let e_input = jsonToObject({ 
      tag: 'input',
      id: 'label',
      type: 'text',       
      required: 'true',
      value: value
  });

  let e_error = jsonToObject({
      tag: 'error'
  });

  e_div.append(e_label, e_input, e_error);
 
  document.querySelector('window > form').append(e_div);

})();
