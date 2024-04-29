(async function (){

    load('/css/form.css')
    
    var json = {};

        json.name = 'content_list'
        json.token = JSON.parse(sessionStorage.getItem('token'))

    const data = await supabase_fetch(json);

    document.querySelector('content').innerHTML = '';

    let window = createCustomElement('window');

    let header = createCustomElement('header');

    let footer = createCustomElement('footer');

    let description = createCustomElement('description');
    let description_label = createCustomElement('label');
    let description_textarea = createCustomElement('textarea');

        description.append(description_label,description_textarea);

    let form = createCustomElement('form');

        form.append(description);

    window.append(header, form, footer);

    document.querySelector('content').append(window);    

    function createCustomElement(name, value) {

        const element = document.createElement(name.toLowerCase()); 
        element.textContent = value;

        return element;

    }

})()