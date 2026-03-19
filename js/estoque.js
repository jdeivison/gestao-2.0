// Adicionar item ao estoque com custo
function adicionarEstoque() {
  const nome = document.getElementById("est-nome").value;
  const qtd = parseInt(document.getElementById("est-qtd").value);
  const custo = parseFloat(document.getElementById("est-custo").value) || 0;

  if (!nome || !qtd) return alert("Preencha nome e quantidade!");

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

// Função para Garantia, Conserto ou Devolução
function abrirFluxoRemessa(index) {
  const estoque = JSON.parse(localStorage.getItem("estoque"));
  const item = estoque[index];

  const motivo = prompt(
    `Enviar "${item.nome}" para:\n1 - Garantia\n2 - Conserto\n3 - Devolução`,
  );
  const qtdSaida = parseInt(prompt(`Quantidade (Máximo ${item.qtd}):`, "1"));

  if (!motivo || isNaN(qtdSaida) || qtdSaida > item.qtd)
    return alert("Operação cancelada ou quantidade inválida.");

  const motivosMap = { 1: "Garantia", 2: "Conserto", 3: "Devolução" };
  const motivoFinal = motivosMap[motivo] || "Outros";

  // 1. Diminuir do estoque
  item.qtd -= qtdSaida;
  if (item.qtd <= 0) estoque.splice(index, 1); // Remove se zerar
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

  alert(`Sucesso! ${qtdSaida} unidade(s) enviada(s) para ${motivoFinal}.`);
  renderizarEstoque();
  atualizarDashboard();
}
