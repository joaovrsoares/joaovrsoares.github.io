// esperar por esse tal de "dom" carregar
// não sei o que muda na prática, mas foi o que fez o código funcionar
// vi no stackoverflow e funcionou, ele cria uma função vazia e faz o que tem dentro
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('#formulario'); // acha o formulário no html
    const tabela = document.querySelector('#tabela'); // acha a tabela

    // Função numa const para adicionar o contato
    const adicionarContato = (nome, celular, email, uf, cidade) => {
        const novaLinha = tabela.insertRow();

        // Insere uma nova célula para cada e joga o conteúdo...
        const celulaNome = novaLinha.insertCell(0);
        const celulaCelular = novaLinha.insertCell(1);
        const celulaEmail = novaLinha.insertCell(2);
        const celulaUF = novaLinha.insertCell(3);
        const celulaCidade = novaLinha.insertCell(4);
        const celulaAcoes = novaLinha.insertCell(5)

        // ...daqui
        celulaNome.textContent = nome;
        celulaCelular.textContent = celular;
        celulaEmail.textContent = email;
        celulaUF.textContent = uf;
        celulaCidade.textContent = cidade;

        // Cria o botão de excluir
        const botaoExcluir = document.createElement('a');
        botaoExcluir.textContent = '🗑️';
        botaoExcluir.setAttribute('style', 'cursor: pointer;');
        celulaAcoes.setAttribute('style', 'text-align: center;');
        celulaAcoes.appendChild(botaoExcluir);
        // Faz a ação dele
        botaoExcluir.addEventListener('click', () => {
            excluirContato(nome, novaLinha);
        });

    };

    // Função para salvar os contatos no localStorage
    const salvarContatos = (contatos) => {
        localStorage.setItem('contatos', JSON.stringify(contatos));
    };

    // Função para carregar os contatos do localStorage
    const carregarContatos = () => {
        const contatos = JSON.parse(localStorage.getItem('contatos')) || [];
        contatos.forEach(contato => adicionarContato(contato.nome, contato.celular, contato.email, contato.uf, contato.cidade));
    };

    // função para excluir um contato da tabela
    const excluirContato = (nome, linha) => {
        linha.remove();
        // atualizar o index da pessoa no localStorage
        const contatos = JSON.parse(localStorage.getItem('contatos')) || [];
        // refaz a lista de contatos sem a pessoa excluída
        const novosContatos = contatos.filter(contato => contato.nome !== nome);
        salvarContatos(novosContatos);
    };

    carregarContatos()

    // função para carregar as cidades de acordo com estado pela api do ibge
    const selectUF = document.getElementById('uf');
    const selectCidade = document.getElementById('cidade');
    const carregarCidades = (uf) => {
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome&view=nivelado`) // pega a api do ibge
            .then(response => response.json()) // transforma a resposta em json
            .then(data => { // pega os dados
                selectCidade.innerHTML = '<option value="" selected disabled>Selecione a Cidade</option>'; // Resetar as opções
                data.forEach(municipio => { // para cada município, cria uma opção
                    const option = document.createElement('option');
                    option.value = municipio["municipio-nome"]; // pega o nome do município e joga no value
                    option.textContent = municipio["municipio-nome"]; // pega o nome do município e joga no texto
                    selectCidade.appendChild(option); // joga a opção criada no select
                }); // repete até acabar os municípios
            })
    };

    // Evento para carregar cidades ao selecionar um estado
    selectUF.addEventListener('change', (event) => { // ao mudar o select de estado
        const uf = event.target.value; // pega o valor do select
        carregarCidades(uf); // chama a função de carregar cidades passando o valor do select
    });

    formulario.addEventListener('submit', (event) => {
        // não enviar o formulário pela url (com os parâmetros ? e &), em vez disso o js toma conta
        event.preventDefault();

        // pegando as variáveis do formulário e jogando para essa constante
        const {nome, celular, email, uf, cidade} = event.target.elements;

        const contato = { // criando um objeto com os valores do formulário
            nome: nome.value, celular: celular.value, email: email.value, uf: uf.value, cidade: cidade.value
        };

        // passando os parâmetros para a função abaixo
        adicionarContato(contato.nome, contato.celular, contato.email, contato.uf, contato.cidade);

        // salva no localStorage
        const contatos = JSON.parse(localStorage.getItem('contatos')) || []; // pega os contatos do localStorage e se não tiver, cria um array vazio
        contatos.push(contato); // adiciona o contato no array
        salvarContatos(contatos) // salva o array no localStorage

        formulario.reset(); // resetando o furmulário
    });

    // função para baixar o backup
    const backupContatos = () => {
        const contatos = JSON.parse(localStorage.getItem('contatos')); // pegar os dados dos cookies, se nao tiver, nao pega nada
        // se retornar um array vazio, escrever no html que não tem contatos
        if (contatos.length === 0) {
            // escrever no html que não tem contatos
            const erroBackup = document.getElementById('erro-backup'); // pega o elemento do html
            erroBackup.textContent = ('Não há contatos para fazer backup.'); // escreve a mensagem de erro
        } else {
            const dadosDoBackup = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(contatos)) // transforma o json em string de dados para fazer o download
            const download = document.createElement('a'); // cria um <a> para anexar o arquivo
            download.setAttribute('href', dadosDoBackup); // anexa
            download.setAttribute('download', 'contatos_backup.json'); // cria o atributo download com a string
            document.body.appendChild(download); // joga isso pro body do html
            download.click(); // clica nesse botão
            download.remove(); // remove rapidamente ele
        }
    };

    // ao clicar no botão backup, fazer download do json criado acima
    document.getElementById('backup').addEventListener('click', backupContatos);

    // função para restaurar o backup
    const restaurarContatos = (event) => {
        const arquivo = event.target.files[0]; // pega o arquivo
        const ler = new FileReader(); // cria um leitor de arquivos
        ler.onload = (event => { // ao carregar o arquivo
            const enviado = event.target.result; // pega o resultado do arquivo
            if (typeof enviado == 'string') {
                try { // tenta fazer o parse do json, salvar os contatos e recarregar a página, se der erro, joga a mensagem de erro
                    const contatos = JSON.parse(enviado);
                    salvarContatos(contatos);
                    location.reload();
                } catch (e) {
                    const erroUpload = document.getElementById('erro-upload');
                    erroUpload.textContent = ('Erro ao processar o arquivo: ' + e.message)
                }
            }
        });
        ler.readAsText(arquivo);
    };
    document.getElementById('restaurar').addEventListener('change', restaurarContatos);
});
