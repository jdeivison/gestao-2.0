// --- Funções do Modal de Aviso ---
function exibirAviso(mensagem) {
    document.getElementById('modal-aviso-mensagem').innerText = mensagem;
    document.getElementById('modal-aviso').style.display = 'block';
}

function fecharAviso() {
    document.getElementById('modal-aviso').style.display = 'none';
}
// ------------------------------------

// Adicionar item ao estoque com custo
function adicionarEstoque() {
  const nome = document.getElementById("est-nome").value;
  const qtd = parseInt(document.getElementById("est-qtd").value);
  const custo = parseFloat(document.getElementById("est-custo").value) || 0;

  if (!nome || !qtd) return exibirAviso("Preencha nome e quantidade!");

  let estoque = JSON.parse(localStorage.getItem("estoque")) || [];

  // Verifica se o item já existe para somar a quantidade
  const index = estoque.findIndex(
    (item) => item.nome.toLowerCase() === nome.toLowerCase(),
  );

  if (index !== -1) {
    estoque[index].qtd += qtd;
    estoque[index].data = new Date().toLocaleDateString();
  } else {
    estoque.push({ nome, qtd, custo, data: new Date().toLocaleDateString() });
  }

  localStorage.setItem("estoque", JSON.stringify(estoque));

  // Limpar campos
  document.getElementById("est-nome").value = "";
  document.getElementById("est-qtd").value = "";
  document.getElementById("est-custo").value = "";

  renderizarEstoque();
}

// Renderizar com botão de Remessa (Garantia/Conserto)
function renderizarEstoque() {
  const lista = JSON.parse(localStorage.getItem("estoque")) || [];
  const corpo = document.getElementById("corpo-estoque");

  corpo.innerHTML = lista
    .map(
      (i, index) => `
        <tr>
            <td><strong>${i.nome}</strong></td>
            <td>${i.qtd} un</td>
            <td>R$ ${i.custo.toFixed(2)}</td>
            <td>${i.data}</td>
            <td>
                <button title="Enviar para Garantia/Conserto" class="btn-search" 
                        onclick="abrirFluxoRemessa(${index})" style="background: var(--warning)">
                    🚛
                </button>
            </td>
        </tr>
    `,
    )
    .join("");
}

let itemParaRemessa = null; // Guarda o { index, maxQtd } do item

function fecharModalRemessaEstoque() {
    document.getElementById('modal-remessa-estoque').style.display = 'none';
    itemParaRemessa = null;
}

function confirmarEnvioRemessa() {
    if (!itemParaRemessa) return;

    const motivo = document.getElementById('input-motivo-remessa').value;
    const qtdSaida = parseInt(document.getElementById('input-qtd-remessa').value);
    
    if (!motivo || isNaN(qtdSaida) || qtdSaida <= 0 || qtdSaida > itemParaRemessa.maxQtd) {
        return exibirAviso("Operação cancelada ou quantidade inválida.");
    }

    let estoque = JSON.parse(localStorage.getItem("estoque"));
    const item = estoque[itemParaRemessa.index];

    const motivosMap = { 1: "Garantia", 2: "Conserto", 3: "Devolução" };
    const motivoFinal = motivosMap[motivo] || "Outros";

    // 1. Diminuir do estoque
    item.qtd -= qtdSaida;
    if (item.qtd <= 0) estoque.splice(itemParaRemessa.index, 1); // Remove se zerar
    localStorage.setItem("estoque", JSON.stringify(estoque));

    // 2. Registrar na tabela de Remessas
    let remessas = JSON.parse(localStorage.getItem("remessas")) || [];
    remessas.push({
        item: item.nome,
        motivo: motivoFinal,
        status: "Aguardando Envio",
        qtd: qtdSaida,
        data: new Date().toLocaleDateString(),
    });
    localStorage.setItem("remessas", JSON.stringify(remessas));

    exibirAviso(`Sucesso! ${qtdSaida} unidade(s) enviada(s) para ${motivoFinal}.`);
    
    fecharModalRemessaEstoque();
    renderizarEstoque();
    if (typeof atualizarDashboard === 'function') {
        atualizarDashboard();
    }
}


// Função para Garantia, Conserto ou Devolução
function abrirFluxoRemessa(index) {
  const estoque = JSON.parse(localStorage.getItem("estoque"));
  const item = estoque[index];

  itemParaRemessa = { index: index, maxQtd: item.qtd };
  
  document.getElementById('modal-remessa-estoque-titulo').innerText = `Enviar "${item.nome}"`;
  document.getElementById('input-qtd-remessa').setAttribute('max', item.qtd);
  document.getElementById('input-qtd-remessa').value = 1;
  document.getElementById('modal-remessa-estoque').style.display = 'block';
}
