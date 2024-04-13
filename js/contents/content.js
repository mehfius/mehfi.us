(async function (){

    var json = {};

        json.name = 'content_list'
        json.token = JSON.parse(sessionStorage.getItem('token'))

    const res = await supabase_fetch(json);

    console.log(res)

})()