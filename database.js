const bcrypt = require("bcrypt");

const usersDB = [];

const createUser = ({ nome, email, senha, telefones }) => {
  const newUser = {
    id: usersDB.length + 1,
    nome,
    email,
    senha: bcrypt.hashSync(senha, 10),
    telefones,
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString(),
    ultimo_login: new Date().toISOString(),
  };

  usersDB.push(newUser);

  return newUser;
};

const findUserByEmail = (email) => {
  return usersDB.find((user) => user.email === email);
};

const findUserById = (id) => {
  return usersDB.find((user) => user.id === id);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  usersDB,
};
