(async function (){

    load('/css/form.css')

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
        
            form.append(formTipo(data[0].tipo));

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

    function formTipo(value) {

        let tipo = createCustomElement('tipo');
        let label = createCustomElement('label','Tipo');
        let input = createCustomElement('input','0')

        input.setAttribute('type','hidden');

        json = [
            {'description':'Sem Tipo', 'value':'0'},
            {'description':'Arquivo', 'value':'1'},
            {'description':'Configuração', 'value':'2'},
            {'description':'Autenticação', 'value':'3'}
        ]

        tipo.append(label)

        for (const fields of json) {

            const element = createCustomElement('button', fields.description);

            if(value == fields.value){
                element.setAttribute('selected','1');
            }
            
            element.onclick = function (){

                document.querySelectorAll('button').forEach(button => button.removeAttribute('selected'));

                this.setAttribute('selected','1');

                document.querySelector('window tipo > input').value = fields.value;

            }

            element.setAttribute('type','button')

            tipo.append(element)
            
        }
        
        tipo.append(input)
        return tipo;

    }

})()