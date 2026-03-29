// Função para lidar com o cadastro de novos clientes
function cadastrarCliente(event) {
  // Previne o comportamento padrão de submissão do formulário, que recarregaria a página
  event.preventDefault();

  // Coleta os valores dos campos de nome e CPF do formulário
  const nome = document.getElementById('cliente-nome').value;
  const cpf = document.getElementById('cliente-cpf').value;
  const contato = document.getElementById('cliente-contato').value;
  const email = document.getElementById('cliente-email').value;
  const endereco = document.getElementById('cliente-endereco').value;

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
    endereco: endereco,
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

  // Opcional: Log para fins de depuração
  console.log('Clientes cadastrados:', clientes);
}
