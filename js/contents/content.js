async function init() {
    sessionStorage.removeItem('contents_form');

    await speedj('js/contents/header.js');
    await speedj('js/contents/content.css');

    let e_content = document.querySelector('body > content');

    if (e_content) {
        e_content.innerHTML = '';
    } else {
        e_content = jte({
            tag: 'content'
        });
    }

    var json = {};
    json.name = 'content';
    json.tipo = JSON.parse(sessionStorage.getItem('tipo'));
    sessionStorage.removeItem('contents_id');
    const auth_token = globalThis.auth.ACCESS_TOKEN;

    const myHeaders = new Headers();
    myHeaders.append("Apikey", globalThis.auth.SUPABASE_KEY);
    myHeaders.append("Content-Type", "application/json");

    if (auth_token) {
        try {       
            myHeaders.append("Authorization", `Bearer ${auth_token}`);    
        } catch (error) {
            console.error('Erro ao parsear token:', error);
        }
    }

    let url = `${globalThis.auth.SUPABASE_URL}/rest/v1/${json.name}?category=eq.${json.tipo}&order=created_at.desc`;

    const data = await fetch(url, {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    }).then(response => response.json())
      .catch(error => console.error(error));

    e_content.innerHTML = '';

    for (const dataItem of data) {
        const e_item = jte({ tag: 'item', id: dataItem['id'] });
        const e_container = jte({ tag: 'container' });

        // Criar elementos separadamente
        let e_label = jte({
            tag: 'label',
            textnode: dataItem['label'] || ''
        });
        let e_created_at = null;
        let e_description = null;

        for (const [key, value] of Object.entries(dataItem)) {
            if (key == 'created_at') {
                moment.locale('pt-br');
                e_created_at = jte({
                    tag: key,
                    textnode: moment(value, 'YYYY-MM-DD HH24:mm').utc(false).fromNow()
                });
            } else if (key == 'description') {
                if (dataItem['tipo'] == 4) {
                    e_description = jte({ tag: key });
                    const linhas = value.split(/\n\s*?(?=\n|$)/);

                    linhas.forEach(secao => {
                        const linhas_da_secao = secao.split('\n');
                        const e_button = jte({
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
                    e_description = jte({ tag: key });
                    const e_button = jte({
                        tag: 'button',
                        textnode: 'Download CSV',
                        onclick: () => fetchCSVAndPrint(value)
                    });
                    e_description.append(e_button);
                } else {
                    e_description = jte({
                        tag: key,
                        textnode: value
                    });
                }
            }
        }

        if (e_label) e_container.append(e_label);
        if (e_created_at) e_container.append(e_created_at);
        if (e_description) e_container.append(e_description);

        const e_files = jte({ tag: 'files' });

        const e_menu = jte({ tag: 'menu' });

        const e_button_editar = jte({
            tag: 'button',
            textnode: 'Editar',
            onclick: async () => {
                sessionStorage.setItem('contents_id', dataItem['id']);
                await speedj('js/form/form.js');
            }
        });

        const e_input_file = jte({
            tag: 'input',
            type: 'file',
            id: 'file_input_' + dataItem['id'],
            style: 'display: none;'
        });

        // Adicionar botão processar se o tipo for 8
        if (dataItem['tipo'] == 8) {
            let user_id = JSON.parse(localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token')).user.id;
            const e_button_processar = jte({
                tag: 'button',
                textnode: 'Processar',
                onclick: async () => {
                    const descricao = dataItem['description'];
                    const links = descricao.split('\n').filter(link => link.trim() !== '');
                    
                    for (const link of links) {
                        try {
                            const video_id = link.split('v=')[1].split('&')[0];
                            
                            // Adicionando timeout de 10 segundos
                            const controller = new AbortController();
                            const timeout = setTimeout(() => controller.abort(), 10000);
                            
                            const response = await fetch('https://open-pumped-lacewing.ngrok-free.app/download', {
                                method: 'POST',
                                headers: {
                                   
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    video_id: video_id,
                                    user_id: user_id,
                                    item_id: dataItem['id']
                                }),
                                signal: controller.signal
                            });
                            
                            clearTimeout(timeout);
                            
                            if (!response.ok) {
                                throw new Error(`Erro no servidor: ${response.status} ${response.statusText}`);
                            }
                            
                            const result = await response.json();
                            console.log(`Sucesso ao processar o link: ${link}`, result);
                            
                        } catch (error) {
                            if (error.name === 'AbortError') {
                                console.error(`Timeout ao processar o link ${link}: O servidor demorou muito para responder`);
                            } else {
                                console.error(`Erro ao processar o link ${link}:`, error);
                            }
                        }
                    }
                    
                    alert(`Processamento concluído! ${links.length} links processados.`);
                }
            });
            e_menu.append(e_button_processar);
        }

        e_menu.append(e_button_editar, e_input_file);
        e_item.append(e_container, e_files, e_menu);
        e_content.append(e_item);
    }
    document.body.append(e_content);
    /* await speedj('js/contents/files.js'); */
}

init();