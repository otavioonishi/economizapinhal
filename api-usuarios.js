// Simular banco de dados em localStorage
const BD_USUARIOS = 'economiza_usuarios';

class GerenciadorUsuarios {
  constructor() {
    this.inicializar();
  }

  inicializar() {
    if (!localStorage.getItem(BD_USUARIOS)) {
      const usuariosIniciais = [
        {
          id: 1,
          email: 'usuario@email.com',
          nome: 'Usuário Teste',
          tipo: 'consumidor',
          telefone: '(19) 99999-9999',
          senha: 'hash_Senha123!',
          dataCadastro: new Date().toISOString(),
          ativo: true
        },
        {
          id: 2,
          email: 'loja@email.com',
          nome: 'Loja Teste',
          tipo: 'loja',
          telefone: '(19) 98888-8888',
          endereco: 'Rua Principal, 100',
          tipoEstabelecimento: 'Supermercado',
          senha: 'hash_Loja123!',
          dataCadastro: new Date().toISOString(),
          ativo: true
        }
      ];
      localStorage.setItem(BD_USUARIOS, JSON.stringify(usuariosIniciais));
    }
  }

  obterTodos() {
    return JSON.parse(localStorage.getItem(BD_USUARIOS) || '[]');
  }

  obterPorEmail(email) {
    const usuarios = this.obterTodos();
    return usuarios.find(u => u.email === email);
  }

  emailJaExiste(email) {
    return !!this.obterPorEmail(email);
  }

  criarUsuario(dados) {
    const usuarios = this.obterTodos();
    
    // Validações
    if (this.emailJaExiste(dados.email)) {
      return { sucesso: false, erro: 'E-mail já cadastrado' };
    }

    // Novo usuário
    const novoUsuario = {
      id: Math.max(...usuarios.map(u => u.id), 0) + 1,
      ...dados,
      dataCadastro: new Date().toISOString(),
      ativo: true
    };

    usuarios.push(novoUsuario);
    localStorage.setItem(BD_USUARIOS, JSON.stringify(usuarios));

    return { sucesso: true, usuario: novoUsuario, mensagem: 'Usuário criado com sucesso!' };
  }

  autenticar(email, senha) {
    const usuario = this.obterPorEmail(email);
    
    if (!usuario) {
      return { sucesso: false, erro: 'E-mail não encontrado' };
    }

    if (usuario.senha !== 'hash_' + senha) {
      return { sucesso: false, erro: 'Senha incorreta' };
    }

    return { sucesso: true, usuario: { ...usuario, senha: undefined } };
  }

  atualizarUsuario(email, dados) {
    const usuarios = this.obterTodos();
    const index = usuarios.findIndex(u => u.email === email);

    if (index === -1) {
      return { sucesso: false, erro: 'Usuário não encontrado' };
    }

    usuarios[index] = { ...usuarios[index], ...dados };
    localStorage.setItem(BD_USUARIOS, JSON.stringify(usuarios));

    return { sucesso: true, usuario: usuarios[index] };
  }

  deletarUsuario(email) {
    const usuarios = this.obterTodos();
    const usuariosFiltrados = usuarios.filter(u => u.email !== email);

    localStorage.setItem(BD_USUARIOS, JSON.stringify(usuariosFiltrados));
    return { sucesso: true, mensagem: 'Usuário deletado' };
  }

  obterEstatisticas() {
    const usuarios = this.obterTodos();
    return {
      total: usuarios.length,
      consumidores: usuarios.filter(u => u.tipo === 'consumidor').length,
      lojas: usuarios.filter(u => u.tipo === 'loja').length,
      ativos: usuarios.filter(u => u.ativo).length
    };
  }
}

// Exportar para uso global
const gerenciadorUsuarios = new GerenciadorUsuarios();
