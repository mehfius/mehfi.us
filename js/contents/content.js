(async function (){

    load('/css/header.css')
    load('/css/content.css')
    load('/css/item.css')
    
    var json = {};

        json.name = 'content_list'
        json.token = JSON.parse(sessionStorage.getItem('token'))

        sessionStorage.removeItem('contents_id')

    const data = await supabase_fetch(json);

    load_html('/html/header.html',document.querySelector("body > header"));

    document.querySelector('body > content').innerHTML = '';

    for (const dataItem of data) {

        const item = createCustomElement('item');
        const container = createCustomElement('container');



        for (const [key, value] of Object.entries(dataItem)) {
    
            if(key=='created_at'){

                moment.locale('pt-br');
                const element = createCustomElement(key, moment(value, 'YYYYMMDD').utc(true).fromNow());
                container.appendChild(element);

            } else if (key=='tipo_icon') {

                const element = createCustomElement('icon');
                element.setAttribute('class',`fa-solid ${value}`)
                container.appendChild(element);
                
            } else {

                const element = createCustomElement(key, value);
                container.appendChild(element);

            }      
            
        }
    
        const menu = createCustomElement('menu');

        const button_deletar = createCustomElement('button', 'Deletar');
        const button_editar = createCustomElement('button', 'Editar');

        button_editar.onclick = function (){

            sessionStorage.setItem('contents_id',dataItem['id'])
            rota_form()

        }

        button_deletar.onclick = function (){
            
            if(confirm('Deseja remover este item?')){
                sessionStorage.setItem('contents_id',dataItem['id'])
                rota_contents_delete()
            }

        }        

        menu.appendChild(button_deletar);
        menu.appendChild(button_editar);
    
        item.appendChild(container);
        item.appendChild(menu);
        
        document.querySelector('content').append(item);

    }
    
    function createCustomElement(name, value) {

        const element = document.createElement(name.toLowerCase()); 
        element.textContent = value;

        return element;

    }

})()