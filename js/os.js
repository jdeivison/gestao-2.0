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
  tipoBuscaAtivo = tipo;
  const modal = document.getElementById("modal-busca");
  const lista = document.getElementById("lista-resultados");
  document.getElementById("modal-titulo").innerText =
    `Buscar ${tipo.toUpperCase()}`;
  lista.innerHTML = "";
  modal.style.display = "block";

  let dados =
    tipo === "marca"
      ? bancoDadosFake.marcas
      : tipo === "modelo"
        ? bancoDadosFake.modelos
        : bancoDadosFake.historicoServicos;

  dados.forEach((item) => {
    const li = document.createElement("li");
    if (typeof item === "string") {
      li.innerText = item;
      li.onclick = () => {
        document.getElementById(tipoBuscaAtivo).value = item;
        fecharModal();
      };
    } else {
      li.innerHTML = `<strong>SN: ${item.serie}</strong><br><small>${item.marca} - ${item.documento}</small>`;
      li.onclick = () => {
        document.getElementById("serie").value = item.serie;
        document.getElementById("marca").value = item.marca;
        document.getElementById("modelo").value = item.modelo;
        document.getElementById("documento-cliente").value = item.documento;
        fecharModal();
      };
    }
    lista.appendChild(li);
  });
}

function fecharModal() {
  document.getElementById("modal-busca").style.display = "none";
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
  const novaOS = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    serie: document.getElementById("serie").value,
    documento: document.getElementById("documento-cliente").value,
    lacre: document.getElementById("lacre").value,
    etiqueta: document.getElementById("etiqueta").value,
    inventario: document.getElementById("inventario").value,
    dataCadastro: new Date().toLocaleDateString(),
  };
  if (!novaOS.serie) return exibirAviso("Série Obrigatória!");
  let historico = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];
  historico.push(novaOS);
  localStorage.setItem("meu_sistema_os", JSON.stringify(historico));
  bancoDadosFake.historicoServicos.push(novaOS);
  exibirAviso("✅ OS Salva!");
  document.getElementById("os-form").reset();
  atualizarDashboard();
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
  financeiro.push({ desc, valor, tipo, data: new Date().toLocaleDateString() });
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
          <td class="${f.tipo === "Entrada" ? "valor-entrada" : "valor-saida"}">R$ ${f.valor.toFixed(2)}</td>
          <td>${f.tipo}</td>
          <td>${f.tipo === "Entrada" ? "Pago" : "A pagar"}</td>
        </tr>`,
    )
    .join("");
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
                  <td>${r.qtd}</td>
                  <td><span class="badge">${r.motivo}</span></td>
                  <td>${r.status}</td>
                  <td>${r.data}</td>
                  <td>${acoes}</td>
              </tr>`;
    })
    .join("");
}

function filtrarRemessas(filtro) {
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

function converterEmVenda() {
  const dados = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    serie: document.getElementById("serie").value,
    lacre: document.getElementById("lacre").value,
    etiqueta: document.getElementById("etiqueta").value,
    inventario: document.getElementById("inventario").value,
    cliente: document.getElementById("documento-cliente").value,
  };
  if (!dados.serie) return exibirAviso("Selecione um equipamento!");
  const valor = parseFloat(prompt("Valor da Venda:"));
  if (isNaN(valor)) return;
  salvarNoFinanceiro(`Venda SN: ${dados.serie}`, valor, "Entrada");
  const win = window.open("", "", "height=600,width=800");
  win.document.write(
    `<html><body style="font-family:sans-serif; padding:40px;"><h1>NOTA DE VENDA</h1><p>Cliente: ${dados.cliente}</p><p>Valor: R$ ${valor.toFixed(2)}</p><hr><h2>VERSO (EQUIPAMENTO)</h2><p>Marca: ${dados.marca} | Série: ${dados.serie}</p><p>Lacre: ${dados.lacre} | Etiqueta: ${dados.etiqueta}</p><script>window.print();</script></body></html>`,
  );
  win.document.close();
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
