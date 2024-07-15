const display = document.getElementById("display");

const mostrarNoDisplay = (valor) => {
  display.value += valor;
}

const limpar = () => {
    display.value = "";
}

const calcular = () => {
    display.value = eval(display.value);
}