// Função para lidar com o cadastro de novos clientes
function cadastrarCliente(event) {
  // Previne o comportamento padrão de submissão do formulário, que recarregaria a página
  event.preventDefault();

  // Coleta os valores dos campos de nome e CPF do formulário
  const nome = document.getElementById('cliente-nome').value;
  const cpf = document.getElementById('cliente-cpf').value;
  const contato = document.getElementById('cliente-contato').value;
  const email = document.getElementById('cliente-email').value;
  const cep = document.getElementById('cliente-cep').value;
  const rua = document.getElementById('cliente-rua').value;
  const numero = document.getElementById('cliente-numero').value;
  const bairro = document.getElementById('cliente-bairro').value;
  const cidade = document.getElementById('cliente-cidade').value;

  // Validação simples para garantir que os campos obrigatórios não estão vazios
  if (!nome || !cpf) {
    // A função exibirAviso está definida em os.js e mostra um modal de aviso
    exibirAviso('Por favor, preencha os campos obrigatórios (Nome e CPF).');
    return;
  }

  // Cria um objeto para representar o novo cliente
  const novoCliente = {
    id: 'c' + Date.now(), // Gera um ID único para o cliente
    nome: nome,
    cpf: cpf,
    contato: contato,
    email: email,
    cep: cep,
    rua: rua,
    numero: numero,
    bairro: bairro,
    cidade: cidade,
    dataCadastro: new Date().toLocaleDateString()
  };

  // Recupera a lista de clientes existentes do localStorage ou cria uma lista vazia
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  
  // Adiciona o novo cliente à lista
  clientes.push(novoCliente);

  // Salva a lista atualizada de volta no localStorage
  localStorage.setItem('clientes', JSON.stringify(clientes));

  // Exibe uma mensagem de sucesso para o usuário
  exibirAviso(`Cliente "${nome}" cadastrado com sucesso!`);

  // Limpa os campos do formulário para o próximo cadastro
  document.getElementById('cliente-form').reset();

  // Atualiza a tabela de clientes para exibir o novo registro
  renderizarTabelaClientes();

  // Opcional: Log para fins de depuração
  console.log('Clientes cadastrados:', clientes);
}

/**
 * Renderiza a tabela de clientes com os dados do localStorage.
 */
function renderizarTabelaClientes() {
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const corpoTabela = document.getElementById('corpo-tabela-clientes');

  // Limpa o conteúdo atual da tabela
  corpoTabela.innerHTML = '';

  // Itera sobre cada cliente e cria uma linha na tabela
  clientes.forEach(cliente => {
    const enderecoCompleto = `${cliente.rua || ''}, ${cliente.numero || ''} - ${cliente.bairro || ''}, ${cliente.cidade || ''} (${cliente.cep || ''})`;
    
    const linha = `
      <tr>
        <td>${cliente.nome}</td>
        <td>${cliente.cpf}</td>
        <td>${cliente.contato || '-'}</td>
        <td>${cliente.email || '-'}</td>
        <td>${cliente.rua ? enderecoCompleto : '-'}</td>
        <td>
          <button class="btn-acao btn-edit" onclick="editarCliente('${cliente.id}')">✏️</button>
          <button class="btn-acao btn-delete" onclick="excluirCliente('${cliente.id}')">🗑️</button>
        </td>
      </tr>
    `;
    corpoTabela.innerHTML += linha;
  });
}

/**
 * Edita um cliente (funcionalidade a ser implementada).
 * @param {string} id - O ID do cliente a ser editado.
 */
function editarCliente(id) {
  exibirAviso(`Funcionalidade de editar cliente (ID: ${id}) a ser implementada.`);
  // Futuro: Implementar a lógica para preencher o formulário com os dados do cliente para edição.
}

/**
 * Exclui um cliente do localStorage e atualiza a tabela.
 * @param {string} id - O ID do cliente a ser excluído.
 */
function excluirCliente(id) {
  exibirConfirmacao(
    'Excluir Cliente',
    'Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.',
    () => {
      let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
      clientes = clientes.filter(c => c.id !== id);
      localStorage.setItem('clientes', JSON.stringify(clientes));
      renderizarTabelaClientes();
      exibirAviso('Cliente excluído com sucesso!');
    }
  );
}
