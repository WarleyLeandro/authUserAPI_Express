const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("./database");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  const { nome, email, senha, telefones } = req.body;

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ mensagem: "E-mail já existente" });
  }

  const newUser = createUser({
    nome,
    email,
    senha: bcrypt.hashSync(senha, 10),
    telefones,
  });

  const token = jwt.sign({ id: newUser.id }, "secreto", { expiresIn: "30m" });

  return res.json({
    id: newUser.id,
    data_criacao: newUser.data_criacao,
    data_atualizacao: newUser.data_atualizacao,
    ultimo_login: newUser.ultimo_login,
    token: token,
  });
});

router.post("/signin", (req, res) => {
  const { email, senha } = req.body;

  const user = findUserByEmail(email);

  if (!user || !bcrypt.compareSync(senha, user.senha)) {
    return res.status(401).json({ mensagem: "Usuário e/ou senha inválidos" });
  }

  const token = jwt.sign({ id: user.id }, "secreto", { expiresIn: "30m" });

  res.json({
    id: user.id,
    data_criacao: user.data_criacao,
    data_atualizacao: user.data_atualizacao,
    ultimo_login: user.ultimo_login,
    token: token,
  });
});

router.use((req, res) => {
  res.status(404).json({ mensagem: "Endpoint não encontrado" });
});

module.exports = router;
