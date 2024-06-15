// esperar por esse tal de "dom" carregar
// não sei o que muda na prática, mas foi o que fez o código funcionar
// vi no stackoverflow e funcionou, ele cria uma função vazia e faz o que tem dentro
document.addEventListener('DOMContentLoaded', function () { 

    // esperar pelo usuário enviar o formulário
    document.getElementById('formulario').addEventListener('submit', function (event) {
        event.preventDefault() // não enviar o formulário pela url, em vez disso o js toma conta

        // pegando as variáveis direto do formulário
        let nome = document.getElementById('nome').value;
        let cel = document.getElementById('celular').value;
        let email = document.getElementById('e-mail').value;
        let estado = document.getElementById('uf').value;
        let cidade = document.getElementById('cidade').value;

        adicionarContato(nome, cel, email, estado, cidade); // função para adicionar o contato
        document.getElementById('formulario').reset(); // resetando o formulário
    });

    function adicionarContato(nome, cel, email, estado, cidade) {
        const tabela = document.getElementById('tabela'); // acha a tabela e joga pra constante

        const novaLinha = tabela.insertRow(); // criar uma linha para jogar as informações

        // consts para jogar as informações de cada variável em célula
        const celulaNome = novaLinha.insertCell(0);
        const celulaCel = novaLinha.insertCell(1);
        const celulaEmail = novaLinha.insertCell(2);
        const celulaEstado = novaLinha.insertCell(3);
        const celulaCidade = novaLinha.insertCell(4);

        // passa a variável como string para a constante que adiciona a célula
        celulaNome.textContent = nome;
        celulaCel.textContent = cel;
        celulaEmail.textContent = email;
        celulaEstado.textContent = estado;
        celulaCidade.textContent = cidade;
    }
})