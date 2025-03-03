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
            const data = {};
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
                    document.querySelector('window').remove(); 
                    await speedj('js/contents/content.js'); 
                } else {
                    alert('Erro ao salvar o registro');
                }

            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao tentar salvar as alterações');
            }
        }
    });

    let e_button_delete = jsonToObject({
        tag: 'button',
        textnode: 'Deletar',
        onclick: async function () {
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
                    document.querySelector('window').remove();
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

    let e_button_anexar = jsonToObject({
        tag: 'button',
        textnode: 'Anexar',
        onclick: async function () {
            const file_input = jsonToObject({
                tag: 'input',
                type: 'file',
                id: 'file_input',
                style: 'display: none;'
            });
            
            file_input.setAttribute('multiple', true);
            document.body.appendChild(file_input);
            file_input.click();

            file_input.onchange = async (event) => {
                const files = event.target.files;
                if (files.length > 0) {
                    const folder = JSON.parse(localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token')).user.id;
                    const base_url = 'https://kgwnnqbpohhldfroogmm.supabase.co/storage/v1/object/mp3/';
                    const content_id = sessionStorage.contents_id;

                    try {
                        let success_count = 0;
                        
                        for (const file of files) {
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            const uuid = crypto.randomUUID();
                            const file_extension = file.name.split('.').pop();
                            const new_file_name = `${uuid}.${file_extension}`;
                            
                            const url = `${base_url}${folder}/${content_id}/${new_file_name}`;
                            
                            const customMetadata = {
                                content_id: content_id,
                                user_id: folder
                            };
                            
                            const uploadMetadata = Object.entries(customMetadata)
                                .map(([key, value]) => `${key} ${btoa(value)}`)
                                .join(',');

                            const response = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': file.type,
                                    'Authorization': `Bearer ${globalThis.access_token}`,
                                    'Upload-Metadata': uploadMetadata,
                                },
                                body: formData
                            });

                            if (response.ok) {
                                success_count++;
                            } else {
                                throw new Error(`Erro ao anexar arquivo: ${file.name}`);
                            }
                        }
                        
                        if (success_count === files.length) {
                            alert(`${success_count} arquivo(s) anexado(s) com sucesso!`);
                        } else {
                            alert(`${success_count} de ${files.length} arquivos foram anexados com sucesso.`);
                        }
                        
                    } catch (error) {
                        console.error('Erro:', error);
                        alert('Erro ao anexar arquivos');
                    }
                }
                document.body.removeChild(file_input);
            };
        }
    });

    document.querySelector('window > footer').append(e_button_back, e_button_save, e_button_anexar, e_button_delete);
})();
