const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const usersDB = [];

function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }

  jwt.verify(token.split(" ")[1], "secreto", (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ mensagem: "Sessão inválida" });
      }
      return res.status(401).json({ mensagem: "Não autorizado" });
    }

    req.userId = decoded.id;
    next();
  });
}

router.get("/", verificarToken, (req, res) => {
  const user = usersDB.find((u) => u.id === req.userId);

  res.json({
    id: user.id,
    data_criacao: user.data_criacao,
    data_atualizacao: user.data_atualizacao,
    ultimo_login: user.ultimo_login,
    token: req.headers.authorization,
  });
});

router.use((req, res) => {
  res.status(404).json({ mensagem: "Endpoint não encontrado" });
});

module.exports = router;
