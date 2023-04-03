async function cadastrar(event) {
    event.preventDefault()
    var user;

    const nome = document.getElementById("name").value
    const email = document.getElementById("email").value
    const senha = document.getElementById("password").value

    if ((nome.trim() === "") || (email.trim() === "") || (senha.trim() === "")) {
        //window.alert("Tenha certeza de preencher todos os campos")
    } else {

        const url = `http://localhost:3303/cadastro`

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome: nome,
                senha: senha,
                email: email
            }),


        })
sdsd
        window.location.href = '../index.html'

        console.log(nome)
        console.log(email)
        console.log(senha)

    }
}

// LOGIN
// Requisição para o back-end e retorno de alertas
function login() {
    const usu_email = document.getElementById("email").value
    const usu_senha = document.getElementById("password").value

    if (usu_email === "" || usu_senha === "") {
        return window.alert("Preencha todos o dados")
    }

    fetch("http://localhost:3303/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usu_email, senha: usu_senha })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.usuario) {
                sessionStorage.setItem('usuario', JSON.stringify(data.usuario))
                window.location.assign("../index.html")
            }

        });
    })
}


// Função para colocar as origens no dropdown
function perquisarOrigens() {

    const dropdown = document.getElementById("select-origem")
    $("#select-origem").html(``)
    // Recebe a resposta enviada pela rota de pesquisa no banco de dados
    fetch("http://localhost:3303/selectOrigem", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        $("#select-estado").append(`<option value="null">Origem</option>`)
        res.json().then(function (data) {
            for (let i = 0; i < data.length; i++) {
                $("#select-origem").append('<option value="' + data[i].origem.id + '">' + data[i].origem.nome + '</option>');
            }
        })
    })
}


//Pegar ID da origem 
function getIdOrigem() {

    const origem = document.getElementById("origem").value;
    fetch("http://localhost:3303/getIdOrigem", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' },
        body: JSON.stringify({
            origem: origem,
        })
    }).then(function (res) {
        res.json().then(function (data) {
            return data.res.id;
        });

    });

}

// Função de cadastrar matéria prima
function cadastraMateriaPrima() {

    const nome = document.getElementById("nome").value;
    const origemId = document.getElementById("select-origem").value;
    const estoque_min = document.getElementById("estoque_min").value;
    const estoque_atual = document.getElementById("estoque_atual").value;
    const INCI_nome = document.getElementById("INCI_nome").value;

    fetch("http://localhost:3303/cadastraMateriaPrima", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' },
        body: JSON.stringify({
            nome: nome,
            INCI_nome: INCI_nome,
            estoque_min: estoque_min,
            estoque_atual: estoque_atual,
            origemId: origemId,
        })
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.tipo) {
                window.alert(`${data.nome} cadastrada`)
            }
        });

    });
}

// Função de cadastrar novo produto
function cadastrarProduto(event) {

    event.preventDefault();

    var nome = document.getElementById("name").value;
    var lucro = document.getElementById("lucro").value;

    fetch("http://localhost:3303/cadastrarProduto", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

            nome: nome,
            lucro: lucro

        })
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.tipo) {
                window.alert(`${res.data.nome} cadastrado`)
            }
        });

    });
}


//Session storage cadastrar produto.

async function getInfoProduto() {

    

    var productData = {
        rotulo: null,
        embalagem: null,
        formula: null
    };

    //pega dados de rotulo
    // var response = await fetch('http://localhost:3303/rotulo')
    // var data = await response.json()
    var data = ['rotulo1','rotulo2']
    productData.rotulo = data

   

    //pega dados de embalagem
    // var response = await fetch('http://localhost:3303/embalagem')
    // var data = await response.json()
    var data = ['embalagem1','embalagem2']
    productData.embalagem = data


    //pega dados de formula
    // var response = await fetch('http://localhost:3303/formula')
    // var data = await response.json()
    var data = ['formula1','formula1']
    productData.formula = data

   
    localStorage.setItem("productData", JSON.stringify(productData))



    //Coloca as informações do Local Storage no html

    for(var i=0; i< productData.rotulo.size(); i++){

        document.getElementById('rotulos').innerHTML += `
                <tbody>
                    <tr class="item mt-2">
                    <td>${productData.rotulo[i].nome}</td>
                    <td>${productData.rotulo[i].preco}</td>
                    <td>${productData.rotulo[i].principal}</td>
                    <td><i class="bi bi-x-square"></i></td>
            </tr>
                </tbody>
    `
    }

    for(var i=0; i< productData.embalagem.size(); i++){

        document.getElementById('embalagens').innerHTML += `
                <tbody>
                    <tr class="item mt-2">
                    <td>${productData.embalagem[i].nome}</td>
                    <td>${productData.embalagem[i].preco}</td>
                    <td>${productData.embalagem[i].principal}</td>
                    <td><i class="bi bi-x-square"></i></td>
            </tr>
                </tbody>
    `
    }


    for(var i=0; i< productData.formula.size(); i++){

        document.getElementById('formulas').innerHTML += `
                <tbody>
                    <tr class="item mt-2">
                    <td>${productData.formula[i].nome}</td>
                    <td>${productData.formula[i].preco}</td>
                    <td>${productData.formula[i].principal}</td>
                    <td><i class="bi bi-x-square"></i></td>
            </tr>
                </tbody>
    `
    }


}