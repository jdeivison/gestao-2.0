// --- Funções do Modal de Aviso ---
function exibirAviso(mensagem) {
  document.getElementById("modal-aviso-mensagem").innerText = mensagem;
  document.getElementById("modal-aviso").style.display = "block";
}

function fecharAviso() {
  document.getElementById("modal-aviso").style.display = "none";
}
// ------------------------------------

let estoqueEmEdicao = null; // Rastreia o item em edição

// Adicionar ou ATUALIZAR item no estoque
function adicionarEstoque() {
  const nome = document.getElementById("est-nome").value;
  const marca = document.getElementById("est-marca").value || "";
  const modelo = document.getElementById("est-modelo").value || "";
  const qtd = parseInt(document.getElementById("est-qtd").value);
  const custo = parseFloat(document.getElementById("est-custo").value) || 0;

  if (!nome || !qtd) return exibirAviso("Preencha nome e quantidade!");

  let estoque = JSON.parse(localStorage.getItem("estoque")) || [];

  const itemData = {
    nome,
    marca,
    modelo,
    qtd,
    custo,
    data: new Date().toLocaleDateString(),
  };

  if (estoqueEmEdicao !== null) {
    // Atualiza o item existente
    estoque[estoqueEmEdicao] = itemData;
    exibirAviso("✅ Item atualizado com sucesso!");
  } else {
    // Adiciona novo item
    const index = estoque.findIndex(
      (item) =>
        item.nome.toLowerCase() === nome.toLowerCase() &&
        (item.marca || "").toLowerCase() === marca.toLowerCase() &&
        (item.modelo || "").toLowerCase() === modelo.toLowerCase()
    );

    if (index !== -1) {
      estoque[index].qtd += qtd;
      estoque[index].data = new Date().toLocaleDateString();
    } else {
      estoque.push(itemData);
    }
    exibirAviso("✅ Item adicionado ao estoque!");
  }

  localStorage.setItem("estoque", JSON.stringify(estoque));

  // Limpa campos e reseta estado
  document.getElementById("est-nome").value = "";
  document.getElementById("est-marca").value = "";
  document.getElementById("est-modelo").value = "";
  document.getElementById("est-qtd").value = "";
  document.getElementById("est-custo").value = "";
  estoqueEmEdicao = null;
  
  // Restaura o botão para o estado original
  const btn = document.querySelector("#estoque-section .btn-save");
  btn.innerText = "📥 Registrar Entrada";
  btn.onclick = adicionarEstoque;

  renderizarEstoque();
}

function renderizarEstoque() {
  const lista = JSON.parse(localStorage.getItem("estoque")) || [];
  const corpo = document.getElementById("corpo-estoque");

  corpo.innerHTML = lista
    .map(
      (i, index) => `
        <tr>
            <td><strong>${i.nome}</strong></td>
            <td>${i.marca || ""}</td>
            <td>${i.modelo || ""}</td>
            <td>${i.qtd} un</td>
            <td>R$ ${parseFloat(i.custo).toFixed(2)}</td>
            <td>${i.data}</td>
            <td>
                <button title="Editar" class="btn-acao btn-edit" onclick="editarEstoque(${index})">✏️</button>
                <button title="Excluir" class="btn-acao btn-delete" onclick="excluirEstoque(${index})">🗑️</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function editarEstoque(index) {
  let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
  const item = estoque[index];
  if (!item) return;

  estoqueEmEdicao = index;

  document.getElementById("est-nome").value = item.nome;
  document.getElementById("est-marca").value = item.marca;
  document.getElementById("est-modelo").value = item.modelo;
  document.getElementById("est-qtd").value = item.qtd;
  document.getElementById("est-custo").value = item.custo;

  const btn = document.querySelector("#estoque-section .btn-save");
  btn.innerText = "💾 Atualizar Item";
  
  document.getElementById('est-nome').focus();
}

function excluirEstoque(index) {
  // A função exibirConfirmacao está em os.js, precisa estar disponível globalmente
   exibirConfirmacao(
    'Excluir Item do Estoque',
    'Tem certeza que deseja excluir este item?',
    () => {
      let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
      estoque.splice(index, 1);
      localStorage.setItem("estoque", JSON.stringify(estoque));
      renderizarEstoque();
      exibirAviso('Item excluído do estoque com sucesso!');
    }
  );
}



