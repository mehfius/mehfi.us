(async function (){

    await load('/css/header.css')
    await load('/css/item.css')
    
    var json = {};

        json.name = 'content_list'
        json.token = JSON.parse(sessionStorage.getItem('token'))
        json.tipo = JSON.parse(sessionStorage.getItem('contents_tipo'))

        sessionStorage.removeItem('contents_id')

    const data = await supabase_fetch(json);

    document.querySelector("body > header").innerHTML = ''

    document.querySelector("body > header").append(tipo(data.tipo));
    
    let button_novo = createCustomElement('button', 'Novo');
    
    button_novo.addEventListener('click', () => {
                      
        rota_form();

    });

    document.querySelector("body > header").append(button_novo);

    document.querySelector('body > content').innerHTML = '';

    for (const dataItem of data.rows) {

        const item = createCustomElement('item');
        const container = createCustomElement('container');

        for (const [key, value] of Object.entries(dataItem)) {
    
            if(key=='created_at'){

                moment.locale('pt-br');
                const element = createCustomElement(key, moment(value, 'YYYY-MM-DD HH24:mm').utc(false).fromNow());
                container.appendChild(element);

            } else if (key=='tipo_icon') {

                const element = createCustomElement('icon');
                element.setAttribute('class',`fa-solid ${value}`)
                container.appendChild(element);

            } else if (key=='description') { 

                if(dataItem['tipo']==3){
                    
                    const element = createCustomElement(key);
                    container.appendChild(element);
       
                    linhas = value.split(/\n\s*?(?=\n|$)/)

                    linhas.forEach(secao => {
                   
                        const linhasDaSecao = secao.split('\n');         
                        const button = createCustomElement('button', linhasDaSecao[1]);
                        button.setAttribute('type','button')
                        element.appendChild(button);
                        
                        button.addEventListener('click', () => {
                       
                            navigator.clipboard.writeText(linhasDaSecao[3])
                            .then(() => {
                            
                            })
                            .catch(err => {
                            console.error('Erro ao copiar o atributo:', err);
                            });

                        });

                    });
                    

                } else {

                    const element = createCustomElement(key, value);
                    container.appendChild(element);

                }
                
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

    function tipo(data){

        const element = createCustomElement('tipo');

        let tipo = JSON.parse(sessionStorage.getItem('contents_tipo'))

        for (const fields of data) {
    
            const button = createCustomElement('button');
    
            button.setAttribute('class',`fa-solid ${fields.icon}`)

            if(tipo == fields.id){
                button.setAttribute('selected','1');
            }

            button.addEventListener('click', () => {
                      
                document.querySelectorAll('body > header > tipo > button').forEach(button => button.removeAttribute('selected'));
    
                button.setAttribute('selected','1');

                sessionStorage.setItem('contents_tipo',fields.id); 

                rota_contents();
        
            });

            button.setAttribute('type','button')
    
            element.append(button)
    
        }

        return element;


    }

    document.querySelector('loading').removeAttribute('show');
    
})()