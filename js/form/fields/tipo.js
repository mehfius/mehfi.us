(async function (){ 

    const form = JSON.parse(sessionStorage.contents_form || '{}');
    const contents_tipo = globalThis.category;    
    const value = form.tipo || '';

    let e_div = jte({
        tag: 'div'
    });

    let e_label = jte({
        tag: 'label',
        innerhtml: 'Tipo'
    });

    let e_input = jte({ 
        tag: 'input',
        type: 'hidden',
        id: 'tipo',
        value: value,
        required: 'true'
    });

    let e_error = jte({
        tag: 'error',
        style: 'display: none;'
    });

 /*    e_div.append(e_label); */

    contents_tipo.forEach(tipo => {
        let e_button = jte({
            tag: 'button',
            type: 'button'
        });

        if(value == tipo.id) {
            e_button.setAttribute('selected', '1');
        }

        e_button.onclick = function() {
            this.parentNode.querySelectorAll('button').forEach(button => {
                button.removeAttribute('selected');
            });
            
            this.setAttribute('selected', '1');
            e_input.value = tipo.id;
            e_error.style.display = 'none';
        };

        e_div.append(e_button);
    });

    e_div.append(e_input, e_error);
   
    document.querySelector('dialog > content > form').append(e_div);

    e_input.onchange = function() {
        if (!this.value) {
            e_error.innerHTML = 'Selecione um tipo';
            e_error.style.display = 'block';
        } else {
            e_error.style.display = 'none';
        }
    };

})();