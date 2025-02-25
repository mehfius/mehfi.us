(async function () {
    await speedj('/js/contents/header.css');
    sessionStorage.removeItem('contents_form');

    let e_header = jsonToObject({
        tag: 'header'
    });

    var json = {};
    json.name = 'content';
    json.tipo = JSON.parse(sessionStorage.getItem('tipo'));
    sessionStorage.removeItem('contents_id');
    e_header.append(tipo());
    const e_logout_button = jsonToObject({
        tag: 'button',
        id: 'logout_button',
        textnode: 'Logout',
        onclick: signOut
    });
    let e_button_videocall = jsonToObject({
        tag: 'button',
        textnode: 'Videocall',
        onclick: () => speedj('js/videocall/index.js')
    });

    let e_button_novo = jsonToObject({
        tag: 'button',
        textnode: 'Novo',
        onclick: () => rota_form()
    });

    e_header.append(e_button_videocall, e_button_novo, e_logout_button);

    if(!document.querySelector('header')){
        document.body.append(e_header);
    }
    function tipo() {
        const e_element = jsonToObject({ tag: 'tipo' });
        let tipos = JSON.parse(sessionStorage.getItem('contents_tipos'));
        let tipo_atual = JSON.parse(sessionStorage.getItem('tipo'));

        for (const tipo_item of tipos) {
            const e_button = jsonToObject({
                tag: 'button',
                class: `fa-solid ${tipo_item.icon}`,
                type: 'button',
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