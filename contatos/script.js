// esperar por esse tal de "dom" carregar
// não sei o que muda na prática, mas foi o que fez o código funcionar
// vi no stackoverflow e funcionou, ele cria uma função vazia e faz o que tem dentro
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('#formulario'); // acha o formulário no html
    const tabela = document.querySelector('#tabela'); // acha a tabela
    formulario.addEventListener('submit', (event) => {
        // não enviar o formulário pela url (com os parâmetros ? e &), em vez disso o js toma conta
        event.preventDefault();

        // pegando as variáveis do formulário e jogando para essa constante
        const {nome, celular, email, uf, cidade} = event.target.elements;

        // passando os parâmetros para a função abaixo
        adicionarContato(nome.value, celular.value, email.value, uf.value, cidade.value);

        formulario.reset(); // resetando o furmulário
    });

    // Função numa const para adicionar o contato
    const adicionarContato = (nome, celular, email, uf, cidade) => {
        const novaLinha = tabela.insertRow();

        // Insere uma nova célula para cada e joga o conteúdo...
        const celulaNome = novaLinha.insertCell(0);
        const celulaCelular = novaLinha.insertCell(1);
        const celulaEmail = novaLinha.insertCell(2);
        const celulauf = novaLinha.insertCell(3);
        const celulaCidade = novaLinha.insertCell(4);

        // ...daqui
        celulaNome.textContent = nome
        celulaCelular.textContent = celular
        celulaEmail.textContent = email
        celulauf.textContent = uf
        celulaCidade.textContent = cidade
    };
});