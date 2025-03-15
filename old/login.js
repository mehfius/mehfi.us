(async function () {

    speedj('js/autenticacao/login.css')

    document.body.innerHTML = ''
    const e_login = jte({ tag: 'login' });
    const e_fields = jte({ tag: 'fields' });

    e_fields.append(
        jte({ tag: 'label', innerhtml: 'Email: ' }),
        jte({ tag: 'input', type: 'text' }),
        jte({ tag: 'label', innerhtml: 'Senha: ' }),
        jte({ tag: 'input', type: 'password' })
    );

    const e_actions = jte({ tag: 'actions' });
    e_actions.append(
        jte({
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

    const e_buttons = jte({ tag: 'buttons' });
    e_buttons.append(
        jte({
            tag: 'button',
            id: 'insert',
            innerhtml: 'Sign Up',
            onclick: async function () {
                speedj('js/autenticacao/cadastro.js')
            }
        }),
        jte({
            tag: 'button',
            id: 'git_login',
            innerhtml: 'Git Hub',
            onclick: () => {
                signInWithGitHub();
            }
        }),
        jte({
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