// Lógica de Contas e Caixa
const Financeiro = {
    contasPagar: [],
    contasReceber: [],
    saldoCaixa: 0,

    registrarPagamento(descricao, valor) {
        this.contasPagar.push({ descricao, valor, status: 'Pago', data: new Date() });
        this.saldoCaixa -= valor;
        this.atualizarInterface();
    },

    registrarRecebimento(descricao, valor) {
        this.contasReceber.push({ descricao, valor, status: 'Recebido', data: new Date() });
        this.saldoCaixa += valor;
        this.atualizarInterface();
    },

    atualizarInterface() {
        console.log(`Saldo Atual em Caixa: R$ ${this.saldoCaixa.toFixed(2)}`);
        // Aqui você pode atualizar um elemento HTML de "Total" na tela
    }
};