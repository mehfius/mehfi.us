(async function () {

    speedj('js/autenticacao/login.css')

    document.body.innerHTML = ''
    const e_login = jsonToObject({ tag: 'login' });
    const e_fields = jsonToObject({ tag: 'fields' });

    e_fields.append(
        jsonToObject({ tag: 'label', innerhtml: 'Email: ' }),
        jsonToObject({ tag: 'input', type: 'text' }),
        jsonToObject({ tag: 'label', innerhtml: 'Senha: ' }),
        jsonToObject({ tag: 'input', type: 'password' })
    );

    const e_actions = jsonToObject({ tag: 'actions' });
    e_actions.append(
        jsonToObject({
            tag: 'button',
            id: 'login',
            innerhtml: 'Send',
            onclick: async function () {
                try {
                    const email = e_fields.querySelector('input[type="text"]').value;
                    const password = e_fields.querySelector('input[type="password"]').value;

                    const { data, error } = await supabaseClient.auth.signInWithPassword({
                        email,
                        password
                    });

                    if (error) {
                        if (error.message === "Email not confirmed") {
                            alert('Erro: Email não confirmado. Por favor, verifique seu email.');
                        } else if (error.code === "invalid_credentials") {
                            alert('Erro: Credenciais de login inválidas.');
                        }
                        throw error;
                    }

                    console.log("Login bem-sucedido:", data);

                } catch (err) {
                    console.error("Erro ao fazer login:", err.message);
                }
            }
        })
    );

    const e_buttons = jsonToObject({ tag: 'buttons' });
    e_buttons.append(
        jsonToObject({
            tag: 'button',
            id: 'insert',
            innerhtml: 'Sign Up',
            onclick: async function () {
                speedj('js/autenticacao/cadastro.js')
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