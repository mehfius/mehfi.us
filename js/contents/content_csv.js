const fetchCSVAndPrint = function (url) {
    fetch(url)
        .then(response => response.text())
        .then(text => {
           
                const lines = text.split('\n');
                const objects = [];
                const existingEmails = new Set();

                for (let i = 0; i < lines.length; i++) {
                    const columns = lines[i].split(',');
                    if (columns.length >= 9) {
                        
                        const cpf = columns[5].replace(/\D/g, '') || '';
                        const whatsapp = columns[8].replace(/\D/g, '') || null;
                        const nome = columns[4].trim()
                        const email = columns[2].trim()
         
                        if (!existingEmails.has(email)) {
                            const obj = {
                                email: email,
                                nome: nome,
                                cpf: cpf,
                                whatsapp: whatsapp,
                                forca_tarefa_rs: true
                            };
                            objects.push(obj);
                            existingEmails.add(email);
                        }
                    }
                }
                var json = {};

                json.name = 'users_insert'
                json.data = objects

                const status = supabase_fetch_doctor(json);

        })
        .catch(error => console.error('Ocorreu um erro:', error));
}