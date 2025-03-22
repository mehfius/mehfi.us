(async function () {
    await speedj('/js/contents/header.css');
    sessionStorage.removeItem('contents_form');
    sessionStorage.removeItem('contents_id');
    
    const e_header = document.querySelector('body > header');    

    const existing_buttons = e_header.querySelector('buttons');
    const existing_category = e_header.querySelector('category');
    
    if (!existing_buttons || !existing_category) {
        const [category_section, buttons_section, profile_section] = await Promise.all([
            build_category_section(),
            build_buttons_section(),
            build_profile_section()
        ]);
        
        if (!existing_category) e_header.append(category_section);
        if (!e_header.querySelector('profile')) e_header.append(profile_section);
        if (!existing_buttons) e_header.append(buttons_section);
    }
  
    async function build_category_section() {
        const e_element = jte({ tag: 'category' });

        if (!globalThis.category) {
            await fetch(`${globalThis.auth.SUPABASE_URL}/rest/v1/category?order=created_at.desc`, {
                method: "GET",
                headers: {
                    "Apikey": globalThis.auth.SUPABASE_KEY,
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if (response.status === 401) {
                    navdialog.show_dialog(navdialog.create_dialog_alert('Erro de autenticação', 'Sua sessão expirou. Por favor, faça login novamente.'));
                    return null;
                }
                return response.json();
            }).then(categories => {
                if (categories) {
                    globalThis.category = categories;
                    window.dispatchEvent(new Event('categories_loaded'));
                }
            }).catch(error => {
                console.error('Error:', error);
            });
        }

        const categories = globalThis.category || [];
        const current_category = JSON.parse(sessionStorage.getItem('category'));

        categories.forEach(category_item => {
            const e_button = jte({
                tag: 'button',
                textnode: category_item.label,
                onclick: async () => handle_category_click(category_item, e_button)
            });

            if (current_category == category_item.id) {
                e_button.setAttribute('selected', '1');
            }

            e_element.append(e_button);
        });

        return e_element;
    }

    async function handle_category_click(category_item, button) {
        if (JSON.parse(sessionStorage.getItem('category')) == category_item.id) {
            sessionStorage.removeItem('category');
            button.removeAttribute('selected');
        } else {
            document.querySelectorAll('body > header > category > button')
                .forEach(btn => btn.removeAttribute('selected'));
            button.setAttribute('selected', '1');
            sessionStorage.setItem('category', category_item.id);
        }
        await speedj('js/contents/content.js');
    }

    function build_buttons_section() {
        const e_buttons = jte({ tag: 'buttons' });

        const e_logout_button = jte({
            tag: 'button',
            id: 'logout_button',
            textnode: 'Logout',
            onclick: authSignAuth
        });

        const e_button_novo = jte({
            tag: 'button',
            textnode: 'Novo',
            id: 'new_button',
            onclick: async () => {
                sessionStorage.removeItem('contents_id');
                sessionStorage.removeItem('contents_form');
                await speedj('js/form/form.js');
            }
        });

        e_buttons.append(e_logout_button, e_button_novo);
        return e_buttons;
    }

    function build_profile_section() {
        const e_profile = jte({
            tag: 'profile',
            style: `background-image: url('${globalThis.auth.PROFILE_IMAGE_URL}')`
        });
        return e_profile;
    }
})();