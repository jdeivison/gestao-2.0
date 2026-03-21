// --- Funções do Modal de Aviso ---
function exibirAviso(mensagem) {
  document.getElementById("modal-aviso-mensagem").innerText = mensagem;
  document.getElementById("modal-aviso").style.display = "block";
}

function fecharAviso() {
  document.getElementById("modal-aviso").style.display = "none";
}
// ------------------------------------

let dadosVendaAtual = null; // Guarda os dados da OS para a venda

// --- Funções do Modal de Venda ---
function fecharModalVenda() {
  document.getElementById("modal-valor-venda").style.display = "none";
  document.getElementById("input-valor-venda").value = ""; // Limpa o input
  dadosVendaAtual = null; // Limpa os dados guardados
}

function confirmarVenda() {
  const inputValor = document.getElementById("input-valor-venda");
  const valorVenda = parseFloat(inputValor.value);

  if (isNaN(valorVenda) || valorVenda <= 0) {
    exibirAviso("Valor inválido. Por favor, informe um número positivo.");
    return;
  }

  if (!dadosVendaAtual) {
    exibirAviso("Erro: Dados da venda não encontrados. Tente novamente.");
    fecharModalVenda();
    return;
  }

  // Oculta o modal antes de processar
  document.getElementById("modal-valor-venda").style.display = "none";

  // 1. Registrar no Financeiro como Entrada
  salvarNoFinanceiro(
    `Venda/OS SN: ${dadosVendaAtual.serie}`,
    valorVenda,
    "Entrada",
  );

  // 2. Gerar Impressão (Frente e Verso)
  const janelaImpressao = window.open("", "", "width=900,height=700");
  janelaImpressao.document.write(`
        <html>
        <head>
            <title>Nota de Venda - G-PRO</title>
            <style>
                body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
                .nota-box { border: 2px solid #000; padding: 20px; margin-bottom: 50px; position: relative; }
                .verso { border: 2px dashed #666; padding: 20px; margin-top: 100px; background: #f9f9f9; }
                .header { text-align: center; border-bottom: 1px solid #ccc; }
                .row { display: flex; justify-content: space-between; margin: 10px 0; }
                @media print { .page-break { page-break-before: always; } }
            </style>
        </head>
        <body>
            <div class="nota-box">
                <div class="header">
                    <h1>COMPROVANTE DE VENDA E SERVIÇO</h1>
                    <p>Tecnologia G-Pro - Sistema de Gestão Profissional</p>
                </div>
                <p><strong>Cliente (CPF/CNPJ):</strong> ${dadosVendaAtual.cliente}</p>
                <p><strong>Data:</strong> ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}</p>
                <div class="row">
                    <span><strong>Descrição:</strong> Venda de Equipamento/Serviço</span>
                    <span><strong>Total:</strong> R$ ${valorVenda.toFixed(2)}</span>
                </div>
                <br><br><br>
                <p align="center">__________________________________________<br>Assinatura do Responsável</p>
            </div>

            <div class="page-break"></div>

            <div class="verso">
                <h2 align="center">VERSO DA NOTA - DADOS DO EQUIPAMENTO</h2>
                <hr>
                <p><strong>Marca:</strong> ${dadosVendaAtual.marca}</p>
                <p><strong>Modelo:</strong> ${dadosVendaAtual.modelo}</p>
                <p><strong>Número de Série (S/N):</strong> ${dadosVendaAtual.serie}</p>
                <p><strong>Lacre de Segurança:</strong> ${dadosVendaAtual.lacre}</p>
                <p><strong>Etiqueta de Controle:</strong> ${dadosVendaAtual.etiqueta}</p>
                <p><strong>N° de Inventário:</strong> ${dadosVendaAtual.inventario}</p>
                <p style="font-size: 10px; color: #666; margin-top: 30px;">
                    * Este documento comprova os dados técnicos do equipamento no ato da transação.
                </p>
            </div>
            <script>window.print(); window.close();</script>
        </body>
        </html>
    `);
  janelaImpressao.document.close();

  // Limpa os dados após o uso
  fecharModalVenda();
}

// Função para transformar OS em Venda com Verso da Nota
function converterEmVenda() {
  dadosVendaAtual = {
    // Salva os dados na variável global
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    serie: document.getElementById("serie").value,
    lacre: document.getElementById("lacre").value,
    etiqueta: document.getElementById("etiqueta").value,
    inventario: document.getElementById("inventario").value,
    cliente: document.getElementById("documento-cliente").value,
  };

  if (!dadosVendaAtual.serie || !dadosVendaAtual.marca) {
    dadosVendaAtual = null; // Limpa se houver erro
    return exibirAviso("Dados do equipamento incompletos para venda!");
  }

  // Mostra o novo modal em vez do prompt
  document.getElementById("modal-valor-venda").style.display = "block";
  document.getElementById("input-valor-venda").focus();
}

// Lógica de Contas a Pagar e Receber no Dashboard
function atualizarDashboard() {
  const financeiro = JSON.parse(localStorage.getItem("financeiro_dados")) || [];
  const os = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];

  let saldoCaixa = 0;
  let aPagar = 0;
  let aReceber = 0; // Esta variável agora será usada

  financeiro.forEach((mov) => {
    // Garantimos que mov.valor seja tratado como número
    const valor = parseFloat(mov.valor) || 0;

    if (mov.tipo === "Entrada") {
      saldoCaixa += valor;
      aReceber += valor; // SOMA NO RECEBER AQUI
    } else {
      saldoCaixa -= valor;
      aPagar += valor; 
    }
  });

  // ATUALIZAÇÃO DOS CARDS NO HTML
  // Card Verde (A Receber)
  const receberElem = document.getElementById("total-receber");
  if (receberElem) {
    receberElem.innerText = `R$ ${aReceber.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  }

  // Card Vermelho (A Pagar)
  const pagarElem = document.getElementById("total-pagar");
  if (pagarElem) {
    pagarElem.innerText = `R$ ${aPagar.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  }

  // Saldo Geral (Dashboard)
  const saldoElem = document.getElementById("dash-saldo");
  if (saldoElem) {
    saldoElem.innerText = `R$ ${saldoCaixa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  }

  document.getElementById("count-os").innerText = os.length;

  // Atualiza barras de progresso
  document.getElementById("bar-os").style.width = Math.min(os.length * 10, 100) + "%";
  document.getElementById("bar-saldo").style.width = Math.min((saldoCaixa / 10000) * 100, 100) + "%";
}