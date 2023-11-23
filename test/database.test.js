const chai = require("chai");
const chaiHttp = require("chai-http");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail, findUserById } = require("../database");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Database Tests", () => {
  const mockUser = {
    nome: "Test User",
    email: "test@example.com",
    senha: "testpassword",
    telefones: [{ numero: "123456789", ddd: "11" }],
  };

  it("Deve criar um novo usuário", () => {
    const newUser = createUser(mockUser);

    expect(newUser).to.have.property("id");
    expect(newUser.nome).to.equal(mockUser.nome);
    expect(newUser.email).to.equal(mockUser.email);
    expect(bcrypt.compareSync(mockUser.senha, newUser.senha)).to.be.true;
    expect(newUser.telefones).to.deep.equal(mockUser.telefones);
  });

  it("Deve buscar usuário por email", () => {
    const foundUser = findUserByEmail(mockUser.email);

    expect(foundUser).to.have.property("id");
    expect(foundUser.nome).to.equal(mockUser.nome);
    expect(foundUser.email).to.equal(mockUser.email);
    expect(bcrypt.compareSync(mockUser.senha, foundUser.senha)).to.be.true;
    expect(foundUser.telefones).to.deep.equal(mockUser.telefones);
  });

  it("Deve buscar usuário por ID", () => {
    const user = findUserByEmail(mockUser.email);
    const foundUser = findUserById(user.id);

    expect(foundUser).to.have.property("id");
    expect(foundUser.nome).to.equal(mockUser.nome);
    expect(foundUser.email).to.equal(mockUser.email);
    expect(bcrypt.compareSync(mockUser.senha, foundUser.senha)).to.be.true;
    expect(foundUser.telefones).to.deep.equal(mockUser.telefones);
  });
});
