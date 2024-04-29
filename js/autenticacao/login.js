(async function (){

    var fields = document.querySelectorAll("fields input");
    var isEmpty = false;

    for (var i = 0; i < fields.length; i++) {
        if (fields[i].value === "") {
            isEmpty = true;
            break;
        }
    }

    if (isEmpty) {

        alert("Por favor, preencha todos os campos.");

    } else {

        var formData = {};
        formData.name = 'login';
        fields.forEach(function(field) {
            var fieldName = field.parentElement.tagName.toLowerCase();
            formData[fieldName] = field.value;
        });

        //var jsonData = JSON.stringify(formData);

        const res = await supabase_fetch(formData);

        if(res.status == 1){

            sessionStorage.setItem("token", JSON.stringify(res.token));

            rota_contents();
          
        }else{

            alert('email ou senha invalido');

        }

    }

})()