(async function () {

    speedj('js/autenticacao/login.css')

    document.body.innerHTML = ''
    const e_login = jsonToObject({ tag: 'login' });
    const e_fields = jsonToObject({ tag: 'fields' });

    e_fields.append(
        jsonToObject({ tag: 'label', innerhtml: 'Nome Completo: ' }),
        jsonToObject({ tag: 'input', type: 'text', id: 'full_name', required: 'true' }),
        jsonToObject({ tag: 'label', innerhtml: 'Email: ' }),
        jsonToObject({ tag: 'input', type: 'text', id: 'email' }),
        jsonToObject({ tag: 'label', innerhtml: 'Senha: ' }),
        jsonToObject({ tag: 'input', type: 'password', id: 'password' })
    );

    const e_actions = jsonToObject({ tag: 'actions' });
    e_actions.append(
        jsonToObject({
            tag: 'button',
            id: 'login',
            innerhtml: 'Send',
            onclick: async function () {
                try {
                    const full_name = document.getElementById('full_name').value;
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;

                    const { data, error } = await supabaseClient.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: {
                                full_name: full_name
                            }
                        }
                    });

                    if (error) throw error;

                    console.log("Cadastro realizado com sucesso:", data);
                    alert('Cadastro realizado! Verifique seu email para confirmar.');

                } catch (err) {
                    console.error("Erro ao cadastrar:", err.message);
                    alert('Erro ao cadastrar: ' + err.message);
                }
            }
        })
    );

    const e_buttons = jsonToObject({ tag: 'buttons' });
    e_buttons.append(
        jsonToObject({
            tag: 'button',
            id: 'insert',
            innerhtml: 'Sign In',
            onclick: async function () {
                speedj('js/autenticacao/login.js')
            }
        }),
        jsonToObject({
            tag: 'button',
            id: 'git_login',
            innerhtml: 'Git Hub',
            onclick: () => {
                signInWithGitHub();
            }
        }),
        jsonToObject({
            tag: 'button',
            id: 'google_login',
            innerhtml: 'Google',
            onclick: () => {
                signInWithGoogle();
            }
        })
    );

    e_login.append(e_fields, e_actions, e_buttons);
    document.body.appendChild(e_login);
})()