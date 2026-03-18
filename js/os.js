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
  if (!novaOS.serie) return alert("Série Obrigatória!");
  let historico = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];
  historico.push(novaOS);
  localStorage.setItem("meu_sistema_os", JSON.stringify(historico));
  bancoDadosFake.historicoServicos.push(novaOS);
  alert("✅ OS Salva!");
  document.getElementById("os-form").reset();
  atualizarDashboard();
}

function atualizarDashboard() {
  const historico = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];
  const financeiro = JSON.parse(localStorage.getItem("financeiro_dados")) || [];
  const remessas = JSON.parse(localStorage.getItem("remessas")) || [];

  document.getElementById("count-os").innerText = historico.length;
  document.getElementById("count-pendencias").innerText = remessas.length;

  let saldo = financeiro.reduce(
    (acc, current) =>
      current.tipo === "Entrada" ? acc + current.valor : acc - current.valor,
    0,
  );
  document.getElementById("dash-saldo").innerText =
    `R$ ${saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  document.getElementById("bar-os").style.width =
    Math.min(historico.length * 10, 100) + "%";
  document.getElementById("bar-saldo").style.width =
    Math.min((saldo / 5000) * 100, 100) + "%";
  document.getElementById("bar-pendencia").style.width =
    Math.min(remessas.length * 20, 100) + "%";
}

function adicionarEstoque() {
  const nome = document.getElementById("est-nome").value;
  const qtd = document.getElementById("est-qtd").value;
  if (!nome || !qtd) return;
  let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
  estoque.push({ nome, qtd, data: new Date().toLocaleDateString() });
  localStorage.setItem("estoque", JSON.stringify(estoque));
  renderizarEstoque();
}

function renderizarEstoque() {
  const lista = JSON.parse(localStorage.getItem("estoque")) || [];
  document.getElementById("corpo-estoque").innerHTML = lista
    .map(
      (i) =>
        `<tr><td>${i.nome}</td><td>${i.qtd} un</td><td>${i.data}</td><td><button class="btn-search" onclick="gerarRemessaManual('${i.nome}')">🚛</button></td></tr>`,
    )
    .join("");
}

function registrarPagamentoManual() {
  const desc = document.getElementById("fin-desc").value;
  const valor = parseFloat(document.getElementById("fin-valor").value);
  if (!desc || !valor) return;
  salvarNoFinanceiro(desc, valor, "Saída");
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
        `<tr><td>${f.desc}</td><td style="color:${f.tipo === "Entrada" ? "#2ecc71" : "#e74c3c"}">R$ ${f.valor.toFixed(2)}</td><td>${f.tipo}</td><td>${f.data}</td></tr>`,
    )
    .join("");
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
  });
  localStorage.setItem("remessas", JSON.stringify(remessas));
  renderizarRemessas();
  atualizarDashboard();
}

function renderizarRemessas() {
  const lista = JSON.parse(localStorage.getItem("remessas")) || [];
  document.getElementById("corpo-remessas").innerHTML = lista
    .map(
      (r) =>
        `<tr><td>${r.item}</td><td><span class="badge">${r.motivo}</span></td><td>${r.status}</td><td>${r.data}</td></tr>`,
    )
    .join("");
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
  if (!dados.serie) return alert("Selecione um equipamento!");
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

  // Adicione isso para as tabelas carregarem sozinhas ao abrir o site:
  renderizarEstoque();
  renderizarFinanceiro();
  renderizarRemessas();

  atualizarDashboard();
};
