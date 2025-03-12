(async function (){ 

  const form = JSON.parse(sessionStorage.contents_form || '{}');
  const value = form.label || '';

  let e_div = jte({ 
      tag: 'div'
  });

  let e_label = jte({
      tag: 'label',
      innerhtml: 'Título'
  });

  let e_input = jte({ 
      tag: 'input',
      id: 'label',
      type: 'text',       
      required: 'true',
      value: value
  });

  let e_error = jte({
      tag: 'error'
  });

  e_div.append(e_label, e_input, e_error);
 
  document.querySelector('dialog > content > form').append(e_div);

})();
