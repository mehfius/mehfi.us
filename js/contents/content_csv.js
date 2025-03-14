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

                const status = await fetch(`${globalThis.auth.SUPABASE_URL}/rest/v1/users_insert`, {
                    method: 'POST',
                    headers: {
                        'Apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd25ucWJpb2hobGRmcm9vZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTc2MjgsImV4cCI6MjAyODQzMzYyOH0.Mrxll-WATVuV0NXB36Tf2LJBf5KDZRsXSqFhLmTVbME',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${globalThis.auth.ACCESS_TOKEN}`
                    },
                    body: JSON.stringify(json.data)
                });

        })
        .catch(error => console.error('Ocorreu um erro:', error));
}