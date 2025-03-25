(async function () {
    const e_content = document.querySelector('body > content');
    let e_aside = document.querySelector('body > aside');
    
    if (!e_aside) {
        e_aside = jte({ tag: 'aside' });
        document.body.insertBefore(e_aside, e_content);
    }

    e_aside.innerHTML = '';

    // Get all items from content
    const content_items = document.querySelectorAll('body > content > item');
    console.log(content_items)
    content_items.forEach(item => {
        const label = item.querySelector('label').textContent;
        const id = item.getAttribute('id');

        const e_button = jte({
            tag: 'button'
        });

        const e_text = jte({
            tag: 'span',
            class: 'text',
            textnode: label || 'Sem título'
        });

        e_button.append(e_text);
        e_aside.append(e_button);
    });
})();
