(async function (){

    await load('/css/form.css')

    try {

        var json = {};

        json.name = 'content_list'
        json.token = JSON.parse(sessionStorage.getItem('token'))
        json.id = JSON.parse(sessionStorage.getItem('contents_id'))

        const data = await supabase_fetch(json);
  
        document.querySelector('content').innerHTML = '';

        let window = createCustomElement('window');
    
        let header = createCustomElement('header');
    
        let footer = createCustomElement('footer');
    
        let description = createCustomElement('description');
        let description_label = createCustomElement('label','Descrição');
        let description_textarea = createCustomElement('textarea', data[0].description);
    
            description.append(description_label,description_textarea);
    
        let form = createCustomElement('form');
        
            form.append(formTipo(data[0].tipo,data[0].tipos));

            form.append(description);
    
        let button_salvar = createCustomElement('button','Salvar');
        let button_cancelar = createCustomElement('button','Cancelar');
    
            footer.append(button_salvar, button_cancelar);
    
            button_salvar.onclick = function (){
                rota_salvar();
            }

            button_cancelar.onclick = function (){
                rota_contents();
            }

        window.append(header, form, footer);
    
        document.querySelector('content').append(window);  

    } catch (error) {
        console.error('Ocorreu um erro durante a chamada supabase_fetch:', error);
    }

    function createCustomElement(name, value) {

        const element = document.createElement(name.toLowerCase()); 
        element.textContent = value;

        return element;

    }

    function formTipo(value,data) {

        let tipo = createCustomElement('tipo');
        let label = createCustomElement('label','Tipo');
        let input = createCustomElement('input')

        input.setAttribute('type','hidden');
        input.setAttribute('value',value);

        tipo.append(label)

        for (const fields of data) {

            const element = createCustomElement('button');

            element.setAttribute('class',`fa-solid ${fields.icon}`)

            if(value == fields.id){
                element.setAttribute('selected','1');
            }
            
            element.onclick = function (){

                document.querySelectorAll('button').forEach(button => button.removeAttribute('selected'));

                this.setAttribute('selected','1');

                document.querySelector('window tipo > input').value = fields.id;

            }

            element.setAttribute('type','button')

            tipo.append(element)
            
        }
        
        tipo.append(input)
        return tipo;

    }
    document.querySelector('loading').removeAttribute('show')
})()