document.addEventListener('DOMContentLoaded', function () {
  const cepInput = document.getElementById('cliente-cep');

  if (cepInput) {
    cepInput.addEventListener('blur', function () {
      const cep = this.value.replace(/\D/g, '');

      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(response => response.json())
          .then(data => {
            if (!data.erro) {
              document.getElementById('cliente-rua').value = data.logradouro;
              document.getElementById('cliente-bairro').value = data.bairro;
              document.getElementById('cliente-cidade').value = data.localidade;
              // O campo de número pode receber o foco para o usuário preencher
              document.getElementById('cliente-numero').focus();
            } else {
              alert('CEP não encontrado.');
            }
          })
          .catch(error => {
            console.error('Erro ao buscar o CEP:', error);
            alert('Não foi possível buscar o CEP. Verifique sua conexão.');
          });
      }
    });
  }
});
