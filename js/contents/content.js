async function init() {
    sessionStorage.removeItem('contents_form');

    await speedj('js/contents/header.js');
    await speedj('js/contents/content.css');
    await speedj('js/contents/aside/aside.css');
    await speedj('js/contents/tools/tools.css');
    await speedj('js/contents/tools/tools.js');
    let e_content = document.querySelector('body > content');

    if (e_content) {
        e_content.innerHTML = '';
    }

    var json = {};
    json.name = 'content';
    json.category = JSON.parse(sessionStorage.getItem('category'));
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

    let url = `${globalThis.auth.SUPABASE_URL}/rest/v1/${json.name}?category=eq.${json.category}&order=created_at.desc`;

    const data = await fetch(url, {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    }).then(response => {
        if (response.status === 401) {
            navdialog.show_dialog(navdialog.create_dialog_alert('Erro de autenticação', 'Sua sessão expirou. Por favor, faça login novamente.'));
            return null;
        }
        return response.json();
    }).catch(error => {
        console.error(error);
        return null;
    });

    if (!data) return;

    // Create aside element
    let e_aside = document.querySelector('body > aside');
    if (!e_aside) {
        e_aside = jte({ tag: 'aside' });
        document.body.insertBefore(e_aside, e_content);
    }
    e_aside.innerHTML = '';

    e_content.innerHTML = '';

    for (const dataItem of data) {
        // Create aside button for each item
        const e_button = jte({
            tag: 'button',
            textnode: dataItem.label || 'Sem título',
            'data-id': dataItem['id'],
            onclick: () => {
                // Remove selected from all buttons
                document.querySelectorAll('body > aside > button').forEach(btn => {
                    btn.removeAttribute('selected');
                });
                
                // Set selected on the clicked button
                e_button.setAttribute('selected', '1');
                
                const item_id = dataItem['id'];
                const target_item = document.querySelector(`item[id="${item_id}"]`);
                if (target_item) {
                    const label_element = target_item.querySelector('label');
                    if (label_element) {
                        label_element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
        });

        e_aside.append(e_button);

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
                if (dataItem['category'] == 4) {
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
                } else if (dataItem['category'] == 6) {
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
        if (dataItem['category'] == 8) {
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

    // Define handleScroll function before using it
    const handleScroll = () => {
        const items = document.querySelectorAll('body > content > item');
        
        if (items.length === 0) return;

        let selected_item = null;
        
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom >= 120) {
                selected_item = item;
            }
        });

        // Update aside button selection
        const buttons = document.querySelectorAll('body > aside > button');
        buttons.forEach(button => {
            button.removeAttribute('selected');
        });

        if (selected_item) {
            const selected_button = document.querySelector(`body > aside > button[data-id="${selected_item.id}"]`);
            if (selected_button) {
                selected_button.setAttribute('selected', '1');
            }
        }
    };

    // Add scroll event listener to window
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleScroll);

    // Manually trigger the scroll handler once
    handleScroll();

    document.body.append(e_content);
}

init();