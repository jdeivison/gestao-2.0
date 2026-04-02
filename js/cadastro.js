let clienteEmEdicao = null;

// Função para lidar com o cadastro de novos clientes
function cadastrarCliente(event) {
  // Previne o comportamento padrão de submissão do formulário, que recarregaria a página
  event.preventDefault();

  // Validação de campos obrigatórios
  const campos = [
    { id: 'cliente-nome', nome: 'Nome Completo' },
    { id: 'cliente-cpf', nome: 'CPF/CNPJ' },
    { id: 'cliente-contato', nome: 'WhatsApp/Telefone' },
    { id: 'cliente-email', nome: 'E-mail' },
    { id: 'cliente-cep', nome: 'CEP' },
    { id: 'cliente-rua', nome: 'Rua' },
    { id: 'cliente-numero', nome: 'Número' },
    { id: 'cliente-bairro', nome: 'Bairro' },
    { id: 'cliente-cidade', nome: 'Cidade' }
  ];

  for (const campo of campos) {
    const valor = document.getElementById(campo.id).value.trim();
    if (!valor) {
      exibirAviso(`Campo "${campo.nome}" é obrigatório!`);
      return;
    }
  }

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
    document.getElementById('edit-cliente-nome').value = cliente.nome || '';
    document.getElementById('edit-cliente-cpf').value = cliente.cpf || '';
    document.getElementById('edit-cliente-contato').value = cliente.contato || '';
    document.getElementById('edit-cliente-email').value = cliente.email || '';
    document.getElementById('edit-cliente-cep').value = cliente.cep || '';
    document.getElementById('edit-cliente-rua').value = cliente.rua || '';
    document.getElementById('edit-cliente-numero').value = cliente.numero || '';
    document.getElementById('edit-cliente-bairro').value = cliente.bairro || '';
    document.getElementById('edit-cliente-cidade').value = cliente.cidade || '';

    document.getElementById('modal-editar-cliente').style.display = 'block';
  }
}

function fecharModalEditarCliente() {
  document.getElementById('modal-editar-cliente').style.display = 'none';
  clienteEmEdicao = null;
}

function salvarEdicaoCliente() {
  if (!clienteEmEdicao) return;
  
  const nome = document.getElementById('edit-cliente-nome').value.trim();
  const cpf = document.getElementById('edit-cliente-cpf').value.trim();
  
  if (!nome || !cpf) {
    return exibirAviso("Nome e CPF/CNPJ são obrigatórios!");
  }

  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const index = clientes.findIndex(c => c.id === clienteEmEdicao);
  
  if (index !== -1) {
    clientes[index].nome = nome;
    clientes[index].cpf = cpf;
    clientes[index].contato = document.getElementById('edit-cliente-contato').value;
    clientes[index].email = document.getElementById('edit-cliente-email').value;
    clientes[index].cep = document.getElementById('edit-cliente-cep').value;
    clientes[index].rua = document.getElementById('edit-cliente-rua').value;
    clientes[index].numero = document.getElementById('edit-cliente-numero').value;
    clientes[index].bairro = document.getElementById('edit-cliente-bairro').value;
    clientes[index].cidade = document.getElementById('edit-cliente-cidade').value;

    localStorage.setItem('clientes', JSON.stringify(clientes));
    exibirAviso(`Cliente "${nome}" atualizado com sucesso!`);
    renderizarTabelaClientes();
    
    // Atualizar no os.js também se for necessário preencher os modais dependentes.
    fecharModalEditarCliente();
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
