const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./auth");
const userRoutes = require("./user");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use((req, res) => {
  res.status(404).json({ mensagem: "Endpoint não encontrado" });
});

const server = app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});

module.exports = { app, server };
