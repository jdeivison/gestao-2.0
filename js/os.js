// --- Funções do Modal de Aviso ---
function exibirAviso(mensagem) {
  document.getElementById("modal-aviso-mensagem").innerText = mensagem;
  document.getElementById("modal-aviso").style.display = "block";
}

function fecharAviso() {
  document.getElementById("modal-aviso").style.display = "none";
}
// ------------------------------------

const bancoDadosFake = {
  marcas: [
    "Samsung",
    "Apple",
    "Dell",
    "HP",
    "Lenovo",
    "Asus",
    "Acer",
    "Positivo",
  ],
  modelos: [
    "Galaxy S23 Ultra",
    "iPhone 15 Pro",
    "Inspiron 15",
    "ThinkPad T14",
    "Macbook Air M2",
  ],
  historicoServicos: [],
};


let osEmEdicao = null; // Variável para rastrear a OS em edição

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("tema_preferido", isDark ? "dark" : "light");
  document.getElementById("theme-toggle").innerText = isDark
    ? "☀️ Claro"
    : "🌙 Escuro";
}

function carregarTema() {
  if (localStorage.getItem("tema_preferido") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").innerText = "☀️ Claro";
  }
}

function toggleSidebar() {
  // Seleciona a sidebar pelo ID e alterna a classe 'collapsed'
  document.getElementById("sidebar").classList.toggle("collapsed");
}

function showSection(sectionId) {
  document
    .querySelectorAll("main > section")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById(sectionId).style.display = "block";

  // Salva a última seção ativa no localStorage
  localStorage.setItem("last_active_section", sectionId);


  if (sectionId === "financeiro-section") renderizarFinanceiro();
  if (sectionId === "estoque-section") renderizarEstoque();
  if (sectionId === "remessa-section") renderizarRemessas();
  atualizarDashboard();
}

let tipoBuscaAtivo = "";
function buscarHistorico(tipo) {
  tipoBuscaAtivo = tipo; // 'marca' ou 'modelo'
  const modal = document.getElementById("modal-busca");
  const lista = document.getElementById("lista-resultados");
  const tituloModal = document.getElementById("modal-titulo");

  tituloModal.innerText = "Buscar Produto no Estoque";
  lista.innerHTML = ""; // Limpa resultados anteriores
  
  const estoque = JSON.parse(localStorage.getItem("estoque")) || [];

  if (estoque.length === 0) {
    lista.innerHTML = "<li>Nenhum item encontrado no estoque.</li>";
    modal.style.display = "block";
    return;
  }
  
  // Usar um Set para garantir itens únicos baseados na combinação marca/modelo
  const itensUnicos = new Map();
  estoque.forEach(item => {
    if (item.marca || item.modelo) {
      const chave = `${item.marca}|${item.modelo}`;
      if (!itensUnicos.has(chave)) {
        itensUnicos.set(chave, item);
      }
    }
  });


  if (itensUnicos.size === 0) {
    lista.innerHTML = "<li>Nenhum item com marca/modelo encontrado.</li>";
  } else {
    itensUnicos.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>Marca:</strong> ${item.marca || "N/A"}<br><strong>Modelo:</strong> ${item.modelo || "N/A"}`;
      li.onclick = () => {
        // Preenche ambos os campos ao selecionar
        document.getElementById("marca").value = item.marca || "";
        document.getElementById("modelo").value = item.modelo || "";
        fecharModal();
      };
      lista.appendChild(li);
    });
  }

  modal.style.display = "block";
  document.getElementById("input-busca-modal").value = ""; // Limpa o filtro
  filtrarBusca(); // Aplica o filtro (que não vai filtrar nada, mostrando tudo)
}

function fecharModal() {
  document.getElementById("modal-busca").style.display = "none";
}

function abrirModalListaOS() {
  const modal = document.getElementById("modal-lista-os");
  const conteudo = document.getElementById("lista-os-content");
  const ordens = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];

  if (ordens.length === 0) {
    conteudo.innerHTML = "<p>Nenhuma Ordem de Serviço encontrada.</p>";
  } else {
    let tabelaHTML = `<table class="data-table">
      <thead>
        <tr>
          <th>Selecionar</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>N° de Série</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>`;
    
    ordens.forEach((os, index) => {
      tabelaHTML += `
        <tr>
          <td><input type="checkbox" class="os-checkbox" value="${index}" onchange="atualizarBotaoVenda()"></td>
          <td>${os.marca}</td>
          <td>${os.modelo}</td>
          <td>${os.serie}</td>
          <td>${os.dataCadastro}</td>
          <td>
            <button class="btn-acao btn-edit" onclick="editarOS(${index})">✏️</button>
            <button class="btn-acao btn-delete" onclick="excluirOS(${index})">🗑️</button>
          </td>
        </tr>`;
    });

    tabelaHTML += '</tbody></table>';
    conteudo.innerHTML = tabelaHTML;
  }

  modal.style.display = "block";
  atualizarBotaoVenda(); // Garante que o botão esteja no estado correto ao abrir o modal
}

function fecharModalListaOS() {
  document.getElementById("modal-lista-os").style.display = "none";
}

function editarOS(index) {
  const ordens = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];
  const os = ordens[index];
  if (!os) return exibirAviso("Ordem de serviço não encontrada!");

  osEmEdicao = index; // Define o índice da OS que está sendo editada

  // Preenche o formulário com os dados da OS
  document.getElementById("marca").value = os.marca;
  document.getElementById("modelo").value = os.modelo;
  document.getElementById("serie").value = os.serie;
  document.getElementById("documento-cliente").value = os.documento;
  document.getElementById("lacre").value = os.lacre;
  document.getElementById("etiqueta").value = os.etiqueta;
  document.getElementById("inventario").value = os.inventario;


  
  showSection('os-section'); // Mostra a seção do formulário
  fecharModalListaOS(); // Fecha o modal da lista
  
  // Altera o título da seção e o texto do botão para indicar edição
  document.querySelector("#os-section h2").innerText = "Editando Ordem de Serviço";
  document.querySelector("#os-form .btn-save").innerText = "💾 Atualizar OS";
}

function excluirOS(index) {
    exibirConfirmacao(
    'Excluir Ordem de Serviço',
    'Tem certeza que deseja excluir esta Ordem de Serviço?',
    () => {
      let ordens = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];
      ordens.splice(index, 1);
      localStorage.setItem("meu_sistema_os", JSON.stringify(ordens));
      abrirModalListaOS(); // Atualiza a lista no modal
      atualizarDashboard();
      exibirAviso('Ordem de Serviço excluída com sucesso!');
    }
  );
}

function filtrarBusca() {
  const termo = document
    .getElementById("input-busca-modal")
    .value.toLowerCase();
  const itens = document.querySelectorAll("#lista-resultados li");
  itens.forEach(
    (li) =>
      (li.style.display = li.innerText.toLowerCase().includes(termo)
        ? "block"
        : "none"),
  );
}




function salvarOS(event) {
  event.preventDefault();
  const osData = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    serie: document.getElementById("serie").value,
    documento: document.getElementById("documento-cliente").value,
    lacre: document.getElementById("lacre").value,
    etiqueta: document.getElementById("etiqueta").value,
    inventario: document.getElementById("inventario").value,
    dataCadastro: new Date().toLocaleDateString(),
  };
  if (!osData.serie) return exibirAviso("Série Obrigatória!");

  let historico = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];

  if (osEmEdicao !== null) {
    // Modo de Edição
    historico[osEmEdicao] = osData;
    exibirAviso("✅ OS Atualizada com sucesso!");
  } else {
    // Modo de Criação
    historico.push(osData);
    exibirAviso("✅ OS Salva com sucesso!");
  }

  localStorage.setItem("meu_sistema_os", JSON.stringify(historico));
  bancoDadosFake.historicoServicos = historico; // Atualiza o banco de dados fake
  
  // Resetar estado de edição e formulário
  osEmEdicao = null;
  document.getElementById("os-form").reset();
  
  // Resetar a UI para o estado de criação
  document.querySelector("#os-section h2").innerText = "Abertura de Ordem de Serviço";
  document.querySelector("#os-form .btn-save").innerText = "💾 Salvar OS";
  
  atualizarDashboard();
  if (document.getElementById('estoque-section').style.display !== 'none') {
    renderizarEstoque();
  }
}

function atualizarDashboard() {
  const financeiro = JSON.parse(localStorage.getItem("financeiro_dados")) || [];

  let totalEntradas = 0;
  let totalSaidas = 0;

  financeiro.forEach((item) => {
    if (item.tipo === "Entrada") {
      totalEntradas += parseFloat(item.valor);
    } else {
      totalSaidas += parseFloat(item.valor);
    }
  });

  // Atualiza os cards superiores
  document.getElementById("total-receber").innerText =
    `R$ ${totalEntradas.toFixed(2)}`;
  document.getElementById("total-pagar").innerText =
    `R$ ${totalSaidas.toFixed(2)}`;

  // Atualiza o saldo principal do Dashboard (se houver o elemento)
  const saldoTotal = totalEntradas - totalSaidas;
  const dashSaldo = document.getElementById("dash-saldo");
  if (dashSaldo) dashSaldo.innerText = `R$ ${saldoTotal.toFixed(2)}`;
}

function registrarPagamentoManual() {
  const desc = document.getElementById("fin-desc").value;
  const valor = parseFloat(document.getElementById("fin-valor").value);
  if (!desc || !valor) return;
  salvarNoFinanceiro(desc, valor, "Saída");
  document.getElementById("fin-desc").value = "";
  document.getElementById("fin-valor").value = "";
}

function registrarFinanceiroManual() {
  const desc = document.getElementById("fin-desc").value;
  const valor = parseFloat(document.getElementById("fin-valor").value);
  const tipo = document.getElementById("fin-tipo").value;

  if (!desc || !valor) {
    return exibirAviso("Por favor, preencha descrição e valor.");
  }
  if (isNaN(valor) || valor <= 0) {
    return exibirAviso("O valor deve ser um número positivo.");
  }

  salvarNoFinanceiro(desc, valor, tipo);
  document.getElementById("fin-desc").value = "";
  document.getElementById("fin-valor").value = "";

}

function salvarNoFinanceiro(desc, valor, tipo) {
  let financeiro = JSON.parse(localStorage.getItem("financeiro_dados")) || [];
  financeiro.push({ id: Date.now(), desc, valor, tipo, data: new Date().toLocaleDateString() });
  localStorage.setItem("financeiro_dados", JSON.stringify(financeiro));
  renderizarFinanceiro();
  atualizarDashboard();
}

function renderizarFinanceiro() {
  const lista = JSON.parse(localStorage.getItem("financeiro_dados")) || [];
  document.getElementById("corpo-financeiro").innerHTML = lista
    .map(
      (f) =>
        `<tr>
          <td>${f.data}</td>
          <td>${f.desc}</td>
          <td class="${f.tipo === "Entrada" ? "valor-entrada" : "valor-saida"}">R$ ${parseFloat(f.valor).toFixed(2)}</td>
          <td>${f.tipo}</td>
          <td>${f.tipo === "Entrada" ? "Pago" : "A pagar"}</td>
          <td>
            <button class="btn-acao btn-edit" onclick="editarLancamento(${f.id})">✏️</button>
            <button class="btn-acao btn-delete" onclick="excluirLancamento(${f.id})">🗑️</button>
          </td>
        </tr>`,
    )
    .join("");
}

function exibirConfirmacao(titulo, mensagem, callbackSim) {
  document.getElementById('modal-confirmacao-titulo').innerText = titulo;
  document.getElementById('modal-confirmacao-mensagem').innerText = mensagem;
  const modal = document.getElementById('modal-confirmacao-generica');
  modal.style.display = 'block';

  const btnSim = document.getElementById('btn-confirmacao-sim');
  const btnNao = document.getElementById('btn-confirmacao-nao');

  // Função para fechar o modal e remover os listeners
  const cleanup = () => {
    modal.style.display = 'none';
    btnSim.removeEventListener('click', simHandler);
    btnNao.removeEventListener('click', naoHandler);
  };

  const simHandler = () => {
    if (callbackSim) callbackSim();
    cleanup();
  };

  const naoHandler = () => {
    cleanup();
  };

  // Adiciona os event listeners
  btnSim.addEventListener('click', simHandler);
  btnNao.addEventListener('click', naoHandler);
}

function editarLancamento(id) {
  exibirAviso(`Editar lançamento ID: ${id}. Funcionalidade a ser implementada.`);
  // Futuro: Abrir um modal com os dados de 'f' para edição.
}

function excluirLancamento(id) {
  exibirConfirmacao(
    'Excluir Lançamento',
    'Tem certeza que deseja excluir este lançamento?',
    () => {
      let financeiro = JSON.parse(localStorage.getItem("financeiro_dados")) || [];
      financeiro = financeiro.filter(f => f.id !== id);
      localStorage.setItem("financeiro_dados", JSON.stringify(financeiro));
      renderizarFinanceiro();
      atualizarDashboard();
      exibirAviso('Lançamento excluído com sucesso!');
    }
  );
}


let filtroAtualRemessas = "Todos";

function renderizarRemessas(filtro = "Todos") {
  filtroAtualRemessas = filtro;
  const lista = JSON.parse(localStorage.getItem("remessas")) || [];
  const corpo = document.getElementById("corpo-remessas");

  const listaFiltrada =
    filtro === "Todos" ? lista : lista.filter((r) => r.status === filtro);

  corpo.innerHTML = listaFiltrada
    .map((r, index) => {
      const originalIndex = lista.findIndex(
        (original) =>
          original.item === r.item &&
          original.data === r.data &&
          original.status === r.status,
      );

      let acoes = "";
      if (r.status === "Aguardando Envio") {
        acoes = `<button class="btn-save" onclick="atualizarStatusRemessa(${originalIndex}, 'Em Trânsito')">Enviar</button>`;
      } else if (r.status === "Em Trânsito") {
        acoes = `<button class="btn-save" onclick="atualizarStatusRemessa(${originalIndex}, 'Concluído')">Receber</button>`;
      } else {
        acoes = "<span>Finalizado</span>";
      }

      return `<tr>
                  <td>${r.item}</td>
                  <td>${r.sn || ""}</td>
                  <td>${r.qtd}</td>
                  <td><span class="badge">${r.motivo}</span></td>
                  <td>${r.status}</td>
                  <td>${r.data}</td>
                  <td>${acoes}</td>
              </tr>`;
    })
    .join("");
}

function filtrarRemessas(filtro, element) {
  const buttons = document.querySelectorAll('.filter-buttons .btn-save');
  buttons.forEach(button => {
      button.classList.remove('active');
  });
  if (element) {
    element.classList.add('active');
  }
  renderizarRemessas(filtro);
}



let remessaParaDevolucao = null; // Guarda a remessa para a confirmação

function confirmarDevolucaoEstoque(devolver) {
    if (devolver && remessaParaDevolucao) {
        let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
        const itemEstoque = estoque.find(
            (e) => e.nome.toLowerCase() === remessaParaDevolucao.item.toLowerCase(),
        );
        if (itemEstoque) {
            itemEstoque.qtd += remessaParaDevolucao.qtd;
        } else {
            estoque.push({
                nome: remessaParaDevolucao.item,
                marca: "",
                serie: remessaParaDevolucao.sn || "",
                qtd: remessaParaDevolucao.qtd,
                custo: 0,
                data: new Date().toLocaleDateString(),
            });
        }
        localStorage.setItem("estoque", JSON.stringify(estoque));
        exibirAviso(
            `${remessaParaDevolucao.qtd} unidade(s) de "${remessaParaDevolucao.item}" retornaram ao estoque.`,
        );
        if (document.getElementById("estoque-section").style.display !== "none") {
            renderizarEstoque();
        }
    }
    
    // Fecha o modal e limpa a variável
    document.getElementById('modal-confirmacao-remessa').style.display = 'none';
    remessaParaDevolucao = null;
}


function atualizarStatusRemessa(index, novoStatus) {
  let remessas = JSON.parse(localStorage.getItem("remessas")) || [];
  const remessa = remessas[index];

  if (!remessa) return;

  remessa.status = novoStatus;

  if (novoStatus === "Concluído") {
    remessaParaDevolucao = remessa; // Guarda a remessa
    document.getElementById('modal-remessa-mensagem').innerText = `O item "${remessa.item}" retornou. Deseja adicioná-lo de volta ao estoque?`;
    document.getElementById('modal-confirmacao-remessa').style.display = 'block';
  }

  localStorage.setItem("remessas", JSON.stringify(remessas));
  renderizarRemessas(filtroAtualRemessas);
  atualizarDashboard();
}

function gerarRemessaManual(item) {
  const motivo = prompt(
    "Motivo (Garantia, Conserto ou Devolução):",
    "Garantia",
  );
  if (!motivo) return;
  let remessas = JSON.parse(localStorage.getItem("remessas")) || [];
  remessas.push({
    item,
    motivo,
    status: "Em Trânsito",
    data: new Date().toLocaleDateString(),
    qtd: 1, // Adicionando qtd para consistencia
  });
  localStorage.setItem("remessas", JSON.stringify(remessas));
  renderizarRemessas();
  atualizarDashboard();
}

function atualizarBotaoVenda() {
  const checkboxes = document.querySelectorAll('.os-checkbox:checked');
  const btnVenda = document.getElementById('btn-venda-modal');
  btnVenda.disabled = checkboxes.length === 0;
}

let osParaVendaIndex = null;

function fecharModalVenda() {
  document.getElementById('modal-valor-venda').style.display = 'none';
}

function confirmarVenda() {
  const valor = parseFloat(document.getElementById('input-valor-venda').value);
  if (isNaN(valor) || valor <= 0) {
    return exibirAviso("Por favor, insira um valor de venda válido.");
  }

  const ordens = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];
  const os = ordens[osParaVendaIndex];

  if (!os) {
    fecharModalVenda();
    return exibirAviso("Ordem de Serviço não encontrada!");
  }

  salvarNoFinanceiro(`Venda SN: ${os.serie}`, valor, "Entrada");

  const win = window.open("", "", "height=600,width=800");
  win.document.write(
    `<html><body style="font-family:sans-serif; padding:40px;"><h1>NOTA DE VENDA</h1><p>Cliente: ${os.documento}</p><p>Valor: R$ ${valor.toFixed(2)}</p><hr><h2>VERSO (EQUIPAMENTO)</h2><p>Marca: ${os.marca} | Série: ${os.serie}</p><p>Lacre: ${os.lacre} | Etiqueta: ${os.etiqueta}</p><script>window.print();</script></body></html>`,
  );
  win.document.close();
  
  fecharModalVenda();
  document.getElementById('input-valor-venda').value = ''; // Limpa o input
}

function converterEmVendaModal() {
  const checkboxes = document.querySelectorAll('.os-checkbox:checked');
  if (checkboxes.length === 0) {
    return exibirAviso("Selecione pelo menos uma Ordem de Serviço.");
  }
  
  if (checkboxes.length > 1) {
    return exibirAviso("Por favor, selecione apenas uma OS para vender/imprimir.");
  }

  osParaVendaIndex = checkboxes[0].value;
  document.getElementById('modal-valor-venda').style.display = 'block';
}

window.onload = () => {
  carregarTema();
  const salvos = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];
  bancoDadosFake.historicoServicos = [...salvos];

  // Recupera e exibe a última seção salva, ou a padrão
  const lastSection =
    localStorage.getItem("last_active_section") || "os-section";
  showSection(lastSection);

  // As funções de renderização já são chamadas dentro de showSection,
  // então não é mais necessário chamá-las diretamente aqui.
  // Apenas o dashboard precisa de uma atualização inicial.
  atualizarDashboard();
};
