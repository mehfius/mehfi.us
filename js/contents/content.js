(async function () {
    sessionStorage.removeItem('contents_form');

    await speedj('/js/contents/header.js');
    await speedj('/js/contents/content.css');

    let e_content = document.querySelector('body > content');

    if (e_content) {
        e_content.innerHTML = '';
    } else {
        e_content = jsonToObject({
            tag: 'content'
        });
        document.body.append(e_content);
    }

    var json = {};
    json.name = 'content';
    json.tipo = JSON.parse(sessionStorage.getItem('tipo'));
    sessionStorage.removeItem('contents_id');

    const data = await supabase_fetch_rls(json, 'tipo', json.tipo);

    e_content.innerHTML = '';

    for (const dataItem of data) {
        const e_item = jsonToObject({ tag: 'item' });
        const e_container = jsonToObject({ tag: 'container' });

        // Criar elementos separadamente
        let e_label = null;
        let e_created_at = null;
        let e_description = null;

        for (const [key, value] of Object.entries(dataItem)) {
            if (key == 'label') {
                e_label = jsonToObject({
                    tag: key,
                    textnode: value
                });
            } else if (key == 'created_at') {
                moment.locale('pt-br');
                e_created_at = jsonToObject({
                    tag: key,
                    textnode: moment(value, 'YYYY-MM-DD HH24:mm').utc(false).fromNow()
                });
            } else if (key == 'description') {
                if (dataItem['tipo'] == 4) {
                    e_description = jsonToObject({ tag: key });
                    const linhas = value.split(/\n\s*?(?=\n|$)/);

                    linhas.forEach(secao => {
                        const linhas_da_secao = secao.split('\n');
                        const e_button = jsonToObject({
                            tag: 'button',
                            textnode: linhas_da_secao[1],
                            type: 'button',
                            onclick: () => {
                                navigator.clipboard.writeText(linhas_da_secao[3])
                                    .catch(err => console.error('Erro ao copiar o atributo:', err));
                            }
                        });
                        e_description.append(e_button);
                    });
                } else if (dataItem['tipo'] == 6) {
                    e_description = jsonToObject({ tag: key });
                    const e_button = jsonToObject({
                        tag: 'button',
                        textnode: 'Download CSV',
                        onclick: () => fetchCSVAndPrint(value)
                    });
                    e_description.append(e_button);
                } else {
                    e_description = jsonToObject({
                        tag: key,
                        textnode: value
                    });
                }
            }
        }

        if (e_label) e_container.append(e_label);
        if (e_created_at) e_container.append(e_created_at);
        if (e_description) e_container.append(e_description);

        const e_menu = jsonToObject({ tag: 'menu' });

        const e_button_deletar = jsonToObject({
            tag: 'button',
            textnode: 'Deletar',
            onclick: () => {
                if (confirm('Deseja remover este item?')) {
                    sessionStorage.setItem('contents_id', dataItem['id']);
                    rota_contents_delete();
                }
            }
        });

        const e_button_editar = jsonToObject({
            tag: 'button',
            textnode: 'Editar',
            onclick: async () => {
                sessionStorage.setItem('contents_id', dataItem['id']);
                await speedj('js/form/form.js');
            }
        });

        e_menu.append(e_button_deletar, e_button_editar);
        e_item.append(e_container, e_menu);
        e_content.append(e_item);
    }

})();