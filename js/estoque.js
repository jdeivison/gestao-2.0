// Lógica de Estoque e Movimentação
const Estoque = {
    produtos: [],

    registrarEntrada(produto, quantidade, valorCusto) {
        const item = { produto, quantidade, valorCusto, data: new Date().toLocaleDateString() };
        this.produtos.push(item);
        console.log(`Entrada registrada: ${quantidade}x ${produto}`);
        this.atualizarLocalStorage();
    },

    registrarSaida(produto, quantidade, valorVenda) {
        // Ao sair um produto (venda), enviamos o valor para o Financeiro
        if (typeof Financeiro !== 'undefined') {
            Financeiro.registrarRecebimento(`Venda: ${produto}`, valorVenda);
        }
        console.log(`Saída de ${produto} processada.`);
    },

    atualizarLocalStorage() {
        localStorage.setItem('estoque_dados', JSON.stringify(this.produtos));
    }
};