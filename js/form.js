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
        
            form.append(formTipo());

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

    function formTipo() {

        let tipo = createCustomElement('tipo');
        let label = createCustomElement('label','Tipo');

        json = [
            {'description':'Sem Tipo','value':'0'},
            {'description':'Arquivo','value':'1'},
            {'description':'Configuração','value':'2'},
            {'description':'Autenticacao','value':'3'}
        ]

        for (const fields of json) {

            const element = createCustomElement('button', fields.description);

            element.onclick = function (){

                alert(fields.value)

            }

            tipo.append(element)
            
        }

/* 
        let tipo_padrao       = createCustomElement('button', 'Sem tipo');
        let tipo_arquivo      = createCustomElement('button', 'Arquivo');
        let tipo_configuracao = createCustomElement('button', 'Configuração');
        let tipo_autenticacao = createCustomElement('button', 'Autenticacao');

            tipo.append(label, tipo_padrao, tipo_arquivo, tipo_configuracao, tipo_autenticacao);
 */

        return tipo;

    }

})()