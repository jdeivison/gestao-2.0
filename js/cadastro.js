let clienteEmEdicao = null;

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

  // Validação simples do e-mail
  if (email && (!email.includes('@') || !email.includes('.com'))) {
    exibirAviso('Por favor, insira um e-mail válido (deve conter @ e .com).');
    return;
  }

  // Cria um objeto para representar o novo cliente
  const clienteData = {
    nome: nome,
    cpf: cpf,
    contato: contato,
    email: email,
    cep: cep,
    rua: rua,
    numero: numero,
    bairro: bairro,
    cidade: cidade,
  };

  // Recupera a lista de clientes existentes do localStorage ou cria uma lista vazia
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  
  if (clienteEmEdicao) {
    // Atualiza o cliente existente
    const index = clientes.findIndex(c => c.id === clienteEmEdicao);
    if (index !== -1) {
      clientes[index] = { ...clientes[index], ...clienteData };
      exibirAviso(`Cliente "${nome}" atualizado com sucesso!`);
    }
  } else {
    // Adiciona o novo cliente à lista
    clienteData.id = 'c' + Date.now();
    clienteData.dataCadastro = new Date().toLocaleDateString();
    clientes.push(clienteData);
    exibirAviso(`Cliente "${nome}" cadastrado com sucesso!`);
  }


  // Salva a lista atualizada de volta no localStorage
  localStorage.setItem('clientes', JSON.stringify(clientes));

  // Limpa os campos do formulário para o próximo cadastro
  document.getElementById('cliente-form').reset();

  // Reseta o estado de edição
  clienteEmEdicao = null;
  document.querySelector('#cliente-form .btn-save').innerText = '💾 Cadastrar';


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
        <td class="td-endereco" title="${cliente.rua ? enderecoCompleto : ''}">
          ${cliente.rua ? enderecoCompleto : '-'}
        </td>
        <td class="actions-cell">
          <button class="btn-acao btn-edit" onclick="editarCliente('${cliente.id}')">✏️</button>
          <button class="btn-acao btn-delete" onclick="excluirCliente('${cliente.id}')">🗑️</button>
        </td>
      </tr>
    `;
    corpoTabela.innerHTML += linha;
  });
}

/**
 * Edita um cliente.
 * @param {string} id - O ID do cliente a ser editado.
 */
function editarCliente(id) {
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const cliente = clientes.find(c => c.id === id);

  if (cliente) {
    clienteEmEdicao = id;
    document.getElementById('cliente-nome').value = cliente.nome;
    document.getElementById('cliente-cpf').value = cliente.cpf;
    document.getElementById('cliente-contato').value = cliente.contato;
    document.getElementById('cliente-email').value = cliente.email;
    document.getElementById('cliente-cep').value = cliente.cep;
    document.getElementById('cliente-rua').value = cliente.rua;
    document.getElementById('cliente-numero').value = cliente.numero;
    document.getElementById('cliente-bairro').value = cliente.bairro;
    document.getElementById('cliente-cidade').value = cliente.cidade;

    document.querySelector('#cliente-form .btn-save').innerText = '💾 Atualizar';
    document.getElementById('cliente-nome').focus();
    
    fecharModalClientes(); // Fecha o modal após preencher os dados
  }
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

function abrirModalClientes() {
  renderizarTabelaClientes();
  const modal = document.getElementById('modal-lista-clientes');
  modal.style.display = 'block';
}

function fecharModalClientes() {
  const modal = document.getElementById('modal-lista-clientes');
  modal.style.display = 'none';
}
