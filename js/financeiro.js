// Função para transformar OS em Venda com Verso da Nota
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

  if (!dados.serie || !dados.marca)
    return alert("Dados do equipamento incompletos para venda!");

  const valorVenda = parseFloat(
    prompt("Informe o valor final da venda/serviço:", "0.00"),
  );
  if (isNaN(valorVenda) || valorVenda <= 0) return;

  // 1. Registrar no Financeiro como Entrada
  salvarNoFinanceiro(`Venda/OS SN: ${dados.serie}`, valorVenda, "Entrada");

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
                <p><strong>Cliente (CPF/CNPJ):</strong> ${dados.cliente}</p>
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
                <p><strong>Marca:</strong> ${dados.marca}</p>
                <p><strong>Modelo:</strong> ${dados.modelo}</p>
                <p><strong>Número de Série (S/N):</strong> ${dados.serie}</p>
                <p><strong>Lacre de Segurança:</strong> ${dados.lacre}</p>
                <p><strong>Etiqueta de Controle:</strong> ${dados.etiqueta}</p>
                <p><strong>N° de Inventário:</strong> ${dados.inventario}</p>
                <p style="font-size: 10px; color: #666; margin-top: 30px;">
                    * Este documento comprova os dados técnicos do equipamento no ato da transação.
                </p>
            </div>
            <script>window.print(); window.close();</script>
        </body>
        </html>
    `);
  janelaImpressao.document.close();
}

// Lógica de Contas a Pagar e Receber no Dashboard
function atualizarDashboard() {
  const financeiro = JSON.parse(localStorage.getItem("financeiro_dados")) || [];
  const os = JSON.parse(localStorage.getItem("meu_sistema_os")) || [];

  let saldoCaixa = 0;
  let aPagar = 0;
  let aReceber = 0;

  financeiro.forEach((mov) => {
    if (mov.tipo === "Entrada") {
      saldoCaixa += mov.valor;
    } else {
      saldoCaixa -= mov.valor;
      aPagar += mov.valor; // Exemplo simplificado de contas a pagar
    }
  });

  document.getElementById("dash-saldo").innerText =
    `R$ ${saldoCaixa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  document.getElementById("total-pagar").innerText =
    `R$ ${aPagar.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  document.getElementById("count-os").innerText = os.length;

  // Atualiza barras de progresso visuais
  document.getElementById("bar-os").style.width =
    Math.min(os.length * 10, 100) + "%";
  document.getElementById("bar-saldo").style.width =
    Math.min((saldoCaixa / 10000) * 100, 100) + "%";
}
