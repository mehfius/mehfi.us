(async function () {

    let e_button_back = jsonToObject({
        tag: 'button',
        textnode: 'Voltar',
        onclick: async function () {          
            speedj('js/contents/content.js');
            document.querySelector('window').remove();
        }
    });

    let e_button_save = jsonToObject({
        tag: 'button',
        textnode: 'Salvar',
        onclick: async function () {
            const inputs = document.querySelectorAll('window > form > div > input, window > form > div > select, window > form > div > textarea')
            const data = {
 
            };
            let isValid = true;
      
            inputs.forEach(input => {
                const errorTag = input.parentNode.querySelector('error');
                if (!errorTag) {
                    console.error(`Erro: A tag 'error' não foi encontrada para o input ${input.id}`);
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
                
                const response = await fetch(`https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/content?id=eq.${sessionStorage.contents_id}`, {
                    method: 'PATCH',
                    headers: { 
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json', 
                        'Apikey': sessionStorage.supabasekey,
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token')).access_token}`
                    },
                    body: JSON.stringify({ ...data })
                });

                if (response.status === 204) {
 
                    document.querySelector('window').remove(); 

                    await speedj('js/contents/content.js'); 
            
                } else {
                    alert('Erro ao atualizar o registro');
                }

            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao tentar salvar as alterações');
            }
        }
    });

    document.querySelector('window > footer').append(e_button_back, e_button_save);
})();
