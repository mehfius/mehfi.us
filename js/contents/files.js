(async function () {
    let files = []
    let storage_url = 'https://kgwnnqbpohhldfroogmm.supabase.co/storage/v1/'

    try {
        const user_id = JSON.parse(localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token')).user.id;
        const url = `${storage_url}object/list/mp3`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + globalThis.access_token
            },
            body: JSON.stringify({
                prefix: `${user_id}`,
                limit: 100,
                offset: 0,
                sortBy: {
                    column: 'name',
                    order: 'asc'
                }
            })
        });

        if (response.ok) {
            const json = await response.json();
            
            // Filtrar e mapear apenas nomes numéricos
            const numbers = json
                .filter(file => !isNaN(file.name) && file.name !== '.emptyFolderPlaceholder')
                .map(file => Number(file.name));
            
            files = numbers;

            // Para cada número no array, buscar os arquivos correspondentes
            for (const id of numbers) {
                try {
                    const files_element = document.querySelector(`item[id="${id}"] > files`);
                    
                    if (!files_element) continue;

                    const file_response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + globalThis.access_token
                        },
                        body: JSON.stringify({
                            prefix: `${user_id}/${id}`,
                            limit: 100,
                            offset: 0,
                            sortBy: {
                                column: 'name',
                                order: 'asc'
                            }
                        })
                    });

                    if (file_response.ok) {
                        const item_files = await file_response.json();
                        
                        item_files.forEach(async file => {
                            try {
                                // Decodificar o JSON do filename
                                const encoded_json = file.name.split('.')[0];
                                const decoded_json = JSON.parse(atob(encoded_json));
                                console.log('JSON decodificado:', decoded_json);

                                // Gerar URL assinada
                                const sign_url = `${storage_url}object/sign/mp3`;
                                const sign_response = await fetch(sign_url, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + globalThis.access_token
                                    },
                                    body: JSON.stringify({
                                        expiresIn: 3600,
                                        paths: [`${user_id}/${id}/${file.name}`]
                                    })
                                });

                                let signed_url = '';
                                if (sign_response.ok) {
                                    const sign_data = await sign_response.json();
                                    signed_url = `${storage_url}${sign_data[0].signedURL}`;
                                    
                                    // Baixar e armazenar o arquivo no cache
                                    const cache_response = await fetch(signed_url);
                                    if (cache_response.ok) {
                                        const cache = await caches.open('audio_cache');
                                        const cache_request = new Request(`/audio/${user_id}/${id}/${file.name}`);
                                        await cache.put(cache_request, cache_response.clone());
                                    }
                                }

                                const file_item = jte({ tag: 'item' });
                                
                                const file_name = jte({
                                    tag: 'span',
                                    textnode: `Nome: ${file.name}`
                                });
                                
                                const file_date = jte({
                                    tag: 'span',
                                    textnode: `Criado em: ${moment(file.created_at).format('DD/MM/YYYY HH:mm')}`
                                });
                                
                                const file_size = jte({
                                    tag: 'span',
                                    textnode: `Tamanho: ${(file.metadata.size / 1024).toFixed(2)} KB`
                                });
                                
                                const file_type = jte({
                                    tag: 'span',
                                    textnode: `Tipo: ${file.metadata.mimetype}`
                                });

                                if (file.metadata.mimetype === 'audio/mpeg') {
                                    const audio_player = jte({
                                        tag: 'audio',
                                        controls: true,
                                        src: signed_url,
                                        crossorigin: 'anonymous'
                                    });

                                    file_item.append(audio_player);
                                }

                              /*       file_item.append(file_name, file_date, file_size, file_type); */
                                files_element.append(file_item);
                            } catch (error) {
                                console.error('Erro ao decodificar JSON:', error);
                            }
                        });
                    } else {
                        throw new Error('Erro ao buscar arquivos');
                    }
                } catch (error) {
                    console.error('Erro ao buscar arquivos:', error);
                }
            }
        } else {
            throw new Error('Erro ao buscar arquivos');
        }
    } catch (error) {
        console.error('Erro ao buscar arquivos:', error);
    }
})();