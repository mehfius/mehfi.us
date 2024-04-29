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
    
            form.append(description);
    
        let button_salvar = createCustomElement('button','Salvar');
        let button_cancelar = createCustomElement('button','Cancelar');
    
            footer.append(button_salvar, button_cancelar);
    
            button_salvar.onclick = function (){
                load('/js/form_salvar.js');
            }

            button_cancelar.onclick = function (){
                load('/js/contents/content.js');
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

})()