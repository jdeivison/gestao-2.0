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

  // Renderiza o conteúdo específico da seção
  if (sectionId === "cadastro-section") renderizarTabelaClientes();
  if (sectionId === "financeiro-section") renderizarFinanceiro();
  if (sectionId === "estoque-section") renderizarEstoque();
  if (sectionId === "remessa-section") renderizarRemessas();
  
  atualizarDashboard();
}

let tipoBuscaAtivo = "";
function buscarHistorico(tipo) {
  tipoBuscaAtivo = tipo;
  const modal = document.getElementById("modal-busca");
  const lista = document.getElementById("lista-resultados");
  const tituloModal = document.getElementById("modal-titulo");
  const estoque = JSON.parse(localStorage.getItem("estoque")) || [];

  const nomePecaAtual = document.getElementById("peca-produto").value;
  const marcaAtual = document.getElementById("marca").value;

  lista.innerHTML = "";

  if (estoque.length === 0) {
    lista.innerHTML = "<li>Nenhum item encontrado no estoque.</li>";
    modal.style.display = "block";
    return;
  }

  // 'peca': Mostra produtos únicos com quantidade somada.
  if (tipo === 'peca') {
    tituloModal.innerText = "Buscar Peça / Produto";
    const itensComQtd = new Map();

    estoque.forEach(item => {
      if (item.nome) {
        const nomeKey = item.nome.toLowerCase();
        const qtdAtual = itensComQtd.has(nomeKey) ? itensComQtd.get(nomeKey).qtd : 0;
        itensComQtd.set(nomeKey, { nome: item.nome, qtd: qtdAtual + (item.qtd || 0) });
      }
    });

    if (itensComQtd.size === 0) {
      lista.innerHTML = `<li>Nenhum produto encontrado.</li>`;
    } else {
      itensComQtd.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="search-result-item">
            <span class="search-result-main">${item.nome}</span>
            <span class="search-result-qty">Qtd: ${item.qtd}</span>
          </div>`;
        li.onclick = () => {
          document.getElementById("peca-produto").value = item.nome;
          fecharModal();
        };
        lista.appendChild(li);
      });
    }
  } 
  // 'marca': Filtra por peça, mostra marcas com quantidade somada.
  else if (tipo === 'marca') {
    tituloModal.innerText = `Marcas para "${nomePecaAtual || 'Todos'}"`;
    const marcasComQtd = new Map();
    
    const estoqueFiltrado = nomePecaAtual 
      ? estoque.filter(item => item.nome === nomePecaAtual)
      : estoque;

    estoqueFiltrado.forEach(item => {
      if (item.marca) {
        const marcaKey = item.marca.toLowerCase();
        const qtdAtual = marcasComQtd.has(marcaKey) ? marcasComQtd.get(marcaKey).qtd : 0;
        marcasComQtd.set(marcaKey, { nome: item.marca, qtd: qtdAtual + (item.qtd || 0) });
      }
    });

    if (marcasComQtd.size === 0) {
      lista.innerHTML = `<li>Nenhuma marca encontrada.</li>`;
    } else {
      marcasComQtd.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="search-result-item">
            <span class="search-result-main">${item.nome}</span>
            <span class="search-result-qty">Qtd: ${item.qtd}</span>
          </div>`;
        li.onclick = () => {
          document.getElementById("marca").value = item.nome;
          fecharModal();
        };
        lista.appendChild(li);
      });
    }
  }
  // 'modelo': Filtra por peça e marca, mostra modelos com quantidade somada.
  else if (tipo === 'modelo') {
    tituloModal.innerText = `Modelos para "${nomePecaAtual} - ${marcaAtual || 'Todos'}"`;
    const modelosComQtd = new Map();

    let estoqueFiltrado = estoque;
    if (nomePecaAtual) {
      estoqueFiltrado = estoqueFiltrado.filter(item => item.nome === nomePecaAtual);
    }
    if (marcaAtual) {
      estoqueFiltrado = estoqueFiltrado.filter(item => item.marca === marcaAtual);
    }

    estoqueFiltrado.forEach(item => {
      if (item.modelo) {
        const modeloKey = item.modelo.toLowerCase();
        const qtdAtual = modelosComQtd.has(modeloKey) ? modelosComQtd.get(modeloKey).qtd : 0;
        modelosComQtd.set(modeloKey, { nome: item.modelo, qtd: qtdAtual + (item.qtd || 0) });
      }
    });

    if (modelosComQtd.size === 0) {
      lista.innerHTML = `<li>Nenhum modelo encontrado.</li>`;
    } else {
      modelosComQtd.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="search-result-item">
            <span class="search-result-main">${item.nome}</span>
            <span class="search-result-qty">Qtd: ${item.qtd}</span>
          </div>`;
        li.onclick = () => {
          document.getElementById("modelo").value = item.nome;
          fecharModal();
        };
        lista.appendChild(li);
      });
    }
  }

  modal.style.display = "block";
  document.getElementById("input-busca-modal").value = "";
  filtrarBusca();
}

function buscarCliente() {
  tipoBuscaAtivo = 'cliente';
  const modal = document.getElementById("modal-busca");
  const lista = document.getElementById("lista-resultados");
  const tituloModal = document.getElementById("modal-titulo");
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  lista.innerHTML = "";
  tituloModal.innerText = "Buscar Cliente";

  if (clientes.length === 0) {
    lista.innerHTML = "<li>Nenhum cliente cadastrado.</li>";
  } else {
    clientes.forEach(cliente => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="search-result-item">
          <span class="search-result-main">${cliente.nome}</span>
          <span class="search-result-qty">CPF: ${cliente.cpf}</span>
        </div>`;
      li.onclick = () => {
        document.getElementById("nome-cliente").value = cliente.nome;
        document.getElementById("documento-cliente").value = cliente.cpf;
        fecharModal();
      };
      lista.appendChild(li);
    });
  }

  modal.style.display = "block";
  document.getElementById("input-busca-modal").value = "";
  filtrarBusca();
}

function fecharModal() {
  document.getElementById("modal-busca").style.display = "none";
  // Limpa os eventos de clique para evitar que a seleção anterior seja acionada
  const lista = document.getElementById("lista-resultados");
  const itens = lista.getElementsByTagName('li');
  for (let i = 0; i < itens.length; i++) {
    itens[i].onclick = null;
  }
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
          <th>Número da OS</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>`;
    
    ordens.forEach((os, index) => {
      tabelaHTML += `
        <tr>
          <td><input type="checkbox" class="os-checkbox" value="${index}" onchange="atualizarBotaoVenda()"></td>
          <td>${os.numero || ''}</td>
          <td>${os.dataCadastro || ''}</td>
          <td class="actions-cell">
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
  document.getElementById("peca-produto").value = os.pecaProduto || "";
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
  const termo = document.getElementById("input-busca-modal").value.toLowerCase();
  const itens = document.querySelectorAll("#lista-resultados li");

  itens.forEach((li) => {
    const textoItem = li.innerText.toLowerCase();
    let corresponde = textoItem.includes(termo);

    if (tipoBuscaAtivo === 'cliente' && !corresponde) {
      const cpfElement = li.querySelector('.search-result-qty');
      if (cpfElement) {
        const cpfText = cpfElement.innerText.toLowerCase();
        corresponde = cpfText.includes(termo);
      }
    }
    
    li.style.display = corresponde ? "block" : "none";
  });
}




function salvarOS(event) {
  event.preventDefault();

  // Validação de campos obrigatórios
  const campos = [
    { id: 'peca-produto', nome: 'Peça / Produto' },
    { id: 'marca', nome: 'Marca' },
    { id: 'modelo', nome: 'Modelo' },
    { id: 'serie', nome: 'N° de Série' },
    { id: 'nome-cliente', nome: 'Nome' },
    { id: 'documento-cliente', nome: 'CPF/CNPJ Cliente' },
    { id: 'lacre', nome: 'N° Lacre' },
    { id: 'etiqueta', nome: 'Etiqueta' },
    { id: 'inventario', nome: 'Inventário' }
  ];

  for (const campo of campos) {
    const valor = document.getElementById(campo.id).value.trim();
    if (!valor) {
      exibirAviso(`Campo "${campo.nome}" é obrigatório!`);
      return;
    }
  }

  const osData = {
    pecaProduto: document.getElementById("peca-produto").value,
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    serie: document.getElementById("serie").value,
    nomeCliente: document.getElementById("nome-cliente").value,
    documento: document.getElementById("documento-cliente").value,
    lacre: document.getElementById("lacre").value,
    etiqueta: document.getElementById("etiqueta").value,
    inventario: document.getElementById("inventario").value,
    dataCadastro: new Date().toLocaleDateString(),
  };

  let historico = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];

  // Gerar número da OS
  let numeroOS = "GP-1001";
  if (historico.length > 0) {
    const ultimosNumeros = historico.map(os => os.numero ? parseInt(os.numero.replace("GP-", "")) : 0);
    const maiorNumero = Math.max(...ultimosNumeros);
    numeroOS = "GP-" + (maiorNumero + 1);
  }
  osData.numero = numeroOS;

  if (osEmEdicao !== null) {
    // Modo de Edição
    historico[osEmEdicao] = osData;
    exibirAviso("✅ OS Atualizada com sucesso!");
  } else {
    // Modo de Criação
    historico.push(osData);
    exibirAviso(`✅ OS ${numeroOS} Salva com sucesso!`);
    
    // Dá baixa no estoque
    darBaixaEstoque(osData.pecaProduto, osData.marca, osData.modelo, 1);
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
          <td class="actions-cell">
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

function confirmarVendaOS() {
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

  // Gera PDF da OS
  gerarPDFOS(os, valor);

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

  // Migrar OSs antigas para adicionar campo nomeCliente se necessário
  migrarOSsAntigas();

  // Recupera e exibe a última seção salva, ou a padrão
  const lastSection =
    localStorage.getItem("last_active_section") || "os-section";
  showSection(lastSection);

  // As funções de renderização já são chamadas dentro de showSection,
  // então não é mais necessário chamá-las diretamente aqui.
  // Apenas o dashboard precisa de uma atualização inicial.
  atualizarDashboard();
};

// Função para gerar PDF da Ordem de Serviço
function gerarPDFOS(os, valor) {
  // Tenta obter o nome do cliente
  let nomeCliente = os.nomeCliente;
  if (!nomeCliente && os.documento) {
    // Busca o nome nos cadastros de clientes
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(c => c.cpf === os.documento);
    if (cliente) {
      nomeCliente = cliente.nome;
    }
  }

  const element = document.createElement('div');
  element.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto;">
      <h1 style="text-align: center; color: #333;">NOTA DE VENDA</h1>
      <h2 style="border-bottom: 2px solid #333; padding-bottom: 10px;">Dados da Ordem de Serviço</h2>
      <p><strong>Número da OS:</strong> ${os.numero || ''}</p>
      <p><strong>Data de Cadastro:</strong> ${os.dataCadastro || ''}</p>
      <p><strong>Peça/Produto:</strong> ${os.pecaProduto || ''}</p>
      <p><strong>Marca:</strong> ${os.marca || ''}</p>
      <p><strong>Modelo:</strong> ${os.modelo || ''}</p>
      <p><strong>N° de Série:</strong> ${os.serie || ''}</p>
      <p><strong>Nome do Cliente:</strong> ${nomeCliente || 'Não informado'}</p>
      <p><strong>CPF/CNPJ Cliente:</strong> ${os.documento || ''}</p>
      <p><strong>N° Lacre:</strong> ${os.lacre || ''}</p>
      <p><strong>Etiqueta:</strong> ${os.etiqueta || ''}</p>
      <p><strong>Inventário:</strong> ${os.inventario || ''}</p>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
      <h2 style="color: #666;">Valor da Venda</h2>
      <p style="font-size: 18px; font-weight: bold; color: #28a745;">R$ ${valor.toFixed(2)}</p>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
      <p style="text-align: center; font-size: 12px; color: #666;">Documento gerado automaticamente pelo Sistema Gestão Pro</p>
    </div>
  `;

  const options = {
    margin: 1,
    filename: `OS_${os.numero || 'sem_numero'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(options).from(element).save();
}

// Função para migrar OSs antigas adicionando o campo nomeCliente se não existir
function migrarOSsAntigas() {
  const ordens = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];
  let atualizou = false;

  ordens.forEach(os => {
    if (!os.nomeCliente && os.documento) {
      // Tenta encontrar o cliente pelo documento nos cadastros
      const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
      const cliente = clientes.find(c => c.cpf === os.documento);
      if (cliente) {
        os.nomeCliente = cliente.nome;
        atualizou = true;
      }
    }
  });

  if (atualizou) {
    localStorage.setItem("meu_sistema_os", JSON.stringify(ordens));
    console.log('OSs migradas com sucesso - campo nomeCliente adicionado');
  }
}
