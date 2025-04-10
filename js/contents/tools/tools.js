(async function() {
    let e_tools = document.querySelector('body > tools');
    if (!e_tools) {
        e_tools = jte({ tag: 'tools' });
        document.body.append(e_tools);
    }
    
    e_tools.innerHTML = '';

    const tools_buttons = [
        { label: 'Button 1', class: 'tools-airbnb' },
        { label: 'Button 2', class: 'tools-passokeeper' },
        { label: 'Button 3', class: 'tools-youtube' }
    ];

    tools_buttons.forEach(button => {
        const e_button = jte({
            tag: 'button',
            text: button.label,
            class: button.class
        });
        e_tools.append(e_button);
    });
})();
