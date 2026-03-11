// Lógica de Remessa, Conserto e Devolução
const Garantia = {
    remessas: [],

    gerarGuiaRemessa(dadosOS, motivo) {
        const novaRemessa = {
            id: Date.now(),
            equipamento: dadosOS.serie,
            marca: dadosOS.marca,
            motivo: motivo, // Garantia, Conserto ou Devolução
            status: 'Enviado para Laboratório',
            dataEnvio: new Date().toLocaleDateString()
        };

        this.remessas.push(novaRemessa);
        alert(`Guia de ${motivo} gerada para o equipamento SN: ${dadosOS.serie}`);
        return novaRemessa;
    },

    listarRemessas() {
        return this.remessas;
    }
};