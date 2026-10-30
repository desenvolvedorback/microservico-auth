require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ROTA: CADASTRO DE NOVO USUÁRIO
app.post('/api/auth/cadastro', async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;

  // Validação básica dos dados recebidos
  if (!nome || !sobrenome || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve conter no mínimo 6 caracteres.' });
  }

  try {
    // 1. Criptografa a senha antes de persistir
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 2. Insere no banco
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)',
      [nome, sobrenome, email.toLowerCase().trim(), senhaHash]
    );

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuarioId: result.insertId
    });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }
    res.status(500).json({ erro: 'Erro interno ao realizar cadastro.' });
  }
});

// ROTA: LOGIN DE USUÁRIO
app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe o e-mail e a senha.' });
  }

  try {
    // 1. Busca usuário pelo e-mail
    const [rows] = await db.query(
      'SELECT id, nome, sobrenome, email, senha, ativo FROM usuarios WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas (usuário não encontrado).' });
    }

    const usuario = rows[0];

    // Verifica se a conta está ativa (soft delete)
    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Conta de usuário desativada.' });
    }

    // 2. Compara a senha digitada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas (senha incorreta).' });
    }

    // 3. Sucesso no login
    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: `${usuario.nome} ${usuario.sobrenome}`,
        email: usuario.email
      }
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno ao processar login.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Microsserviço de Auth] Rodando na porta http:localhost:${PORT}`);
}); 