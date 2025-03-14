(async function () {
    await speedj('/js/contents/header.css');
    sessionStorage.removeItem('contents_form');

    let e_header = jte({
        tag: 'header'
    });

    var json = {};
    json.name = 'content';
    json.tipo = JSON.parse(sessionStorage.getItem('tipo'));
    sessionStorage.removeItem('contents_id');
    e_header.append(await tipo());

    const e_buttons = jte({ tag: 'buttons' }); // Criação do elemento buttons

    const e_logout_button = jte({
        tag: 'button',
        id: 'logout_button',
        textnode: 'Logout',
        onclick: authSignAuth
    });
    let e_button_videocall = jte({
        tag: 'button',
        textnode: 'Videocall',
        onclick: () => speedj('js/videocall/index.js')
    });

    let e_button_novo = jte({
        tag: 'button',
        textnode: 'Novo',
        onclick: async () => {
            sessionStorage.removeItem('contents_id'); // Ensure it's a new record
            sessionStorage.removeItem('contents_form'); // Clear any existing form data
            await speedj('js/form/form.js');
        }
    });

    // Adicionando os botões dentro do elemento buttons
    e_buttons.append(e_button_videocall, e_button_novo, e_logout_button);
    e_header.append(e_buttons); // Adicionando o elemento buttons ao header

    if(!document.querySelector('header')){
        document.body.append(e_header);
    }
    async function tipo() {
        const e_element = jte({ tag: 'tipo' });

        // Wait for categories to be loaded
        if (!globalThis.category) {
            await new Promise(resolve => {
                window.addEventListener('categories_loaded', () => {
                    resolve();
                });
            });
        }

        let tipos = globalThis.category || [];
        let tipo_atual = JSON.parse(sessionStorage.getItem('tipo'));

        for (const tipo_item of tipos) {
            const e_button = jte({
                tag: 'button',
                textnode: tipo_item.label,
                onclick: async () => {                   
                    if (JSON.parse(sessionStorage.getItem('tipo')) == tipo_item.id) {
                        sessionStorage.removeItem('tipo');
                        e_button.removeAttribute('selected');              
                    } else {
                        document.querySelectorAll('body > header > tipo > button').forEach(button => button.removeAttribute('selected'));
                        e_button.setAttribute('selected', '1');
                        sessionStorage.setItem('tipo', tipo_item.id);
                    }
                    await speedj('js/contents/content.js');
                }
            });

            if (tipo_atual == tipo_item.id) {
                e_button.setAttribute('selected', '1');
            }

            e_element.append(e_button);
        }

        return e_element;
    }

})();