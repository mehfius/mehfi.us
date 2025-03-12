(async function () {

    document.body.setAttribute("loading", "");

    let rawResponse;
    let isNewRecord = false; // Flag to indicate if it's a new record

    if (!sessionStorage.contents_id || sessionStorage.contents_id === "undefined" || sessionStorage.contents_id === "") {
        // New record: no need to fetch data
        isNewRecord = true;
        console.log("Creating a new record.");
    } else {
        // Existing record: fetch data from the server
        console.log(`Fetching data for record ID: ${sessionStorage.contents_id}`);
        rawResponse = await fetch(`https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/content?id=eq.${sessionStorage.contents_id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Apikey': sessionStorage.supabasekey,
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token')).access_token}`
            },
        });

        if (rawResponse.status !== 200) {
            const errorMessage = await rawResponse.text();
            alert(`Erro: Não foi possível obter a resposta do servidor. Mensagem: ${errorMessage}`);
            document.body.removeAttribute("loading");
            return; // Stop execution if there is an error getting data
        } else {
            sessionStorage.contents_form = JSON.stringify((await rawResponse.json())[0]);
        }
    }

    // Create the form element
    let form = jte({
        tag: 'form'
    });

    // Create the dialog with the form directly
    const dialog = navdialog.create_dialog(form, {
        on_save: async function() {
            const inputs = document.querySelectorAll('dialog > content > form > div > input, dialog > content > form > div > select, dialog > content > form > div > textarea');
            const data = {};
            let isValid = true;

            inputs.forEach(input => {
                const errorTag = input.parentNode.querySelector('error');
                if (!errorTag) {
                    console.error(`Erro: A tag 'error' não foi encontrada para o input ${input.id}`);
                    isValid = false;
                    return;
                }
                
                if (input.id === 'tipo' && !input.value) {
                    errorTag.innerHTML = 'Campo obrigatório';
                    errorTag.style.display = 'block';
                    isValid = false;
                    return;
                }
                
                if (input.getAttribute('required') === 'true' && input.value.trim() === '') {                
                    errorTag.innerHTML = 'campo vazio';
                    errorTag.style.display = 'block';
                    isValid = false;      
                    input.scrollIntoView({ block: "center", behavior: "smooth" });
                } else {             
                    errorTag.innerHTML = '';
                    errorTag.style.display = 'none';
                    data[input.id] = input.type === 'number' && input.value.trim() === '' ? null : input.value;
                }
            });

            if (!isValid) return;

            try {
                const url = sessionStorage.contents_id 
                    ? `https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/content?id=eq.${sessionStorage.contents_id}`
                    : 'https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/content';

                const method = sessionStorage.contents_id ? 'PATCH' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: { 
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json', 
                        'Apikey': sessionStorage.supabasekey,
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token')).access_token}`
                    },
                    body: JSON.stringify({ ...data })
                });

                if (response.status === 204 || response.status === 201) {
                    navdialog.close_dialog(dialog);
                    await speedj('js/contents/content.js'); 
                } else {
                    alert('Erro ao salvar o registro');
                }

            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao tentar salvar as alterações');
            }
        },
        on_delete: async function() {
            if (!confirm('Tem certeza que deseja deletar este registro?')) return;

            try {
                const url = `https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/content?id=eq.${sessionStorage.contents_id}`;

                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: { 
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json', 
                        'Apikey': sessionStorage.supabasekey,
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token')).access_token}`
                    }
                });

                if (response.status === 204) {
                    navdialog.close_dialog(dialog);
                    await speedj('js/contents/content.js');
                } else {
                    alert('Erro ao deletar o registro');
                }

            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao tentar deletar o registro');
            }
        }
    });

    // Show the dialog
    navdialog.show_dialog(dialog);

    // Wait for the dialog to be added to the DOM
    await new Promise(resolve => setTimeout(resolve, 0));

    await speedj('js/form/form.css');
    await speedj('js/form/header.js');

    const fields = [
        'tipo',
        'label',
        'description'
    ];

    for (const field of fields) {
        await speedj(`js/form/fields/${field}.js`);
    }

    document.body.removeAttribute("loading");

})();
