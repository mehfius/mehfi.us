(async function (){ 

    const form = JSON.parse(sessionStorage.contents_form || '{}');
    const contents_category = globalThis.category;    
    const value = form.category || '';

    let e_div = jte({
        tag: 'div'
    });

    let e_label = jte({
        tag: 'label',
        innerhtml: 'Category'
    });

    let e_input = jte({ 
        tag: 'input',
        type: 'hidden',
        id: 'category',
        value: value,
        required: 'true'
    });

    let e_error = jte({
        tag: 'error',
        style: 'display: none;'
    });

 /*    e_div.append(e_label); */

    contents_category.forEach(category => {
        let e_button = jte({
            tag: 'button',
            type: 'button',
            class: 'category-'+category.slug        
        });

        if(value == category.id) {
            e_button.setAttribute('selected', '1');
        }

        e_button.onclick = function() {
            this.parentNode.querySelectorAll('button').forEach(button => {
                button.removeAttribute('selected');
            });
            
            this.setAttribute('selected', '1');
            e_input.value = category.id;
            e_error.style.display = 'none';
        };

        e_div.append(e_button);
    });

    e_div.append(e_input, e_error);
   
    document.querySelector('dialog > content > form').append(e_div);

    e_input.onchange = function() {
        if (!this.value) {
            e_error.innerHTML = 'Select a category';
            e_error.style.display = 'block';
        } else {
            e_error.style.display = 'none';
        }
    };

})();