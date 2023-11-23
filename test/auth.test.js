const chai = require("chai");
const chaiHttp = require("chai-http");
const bcrypt = require("bcrypt");
const { createUser, usersDB } = require("../database");
const { app } = require("../index");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Auth API", () => {
  beforeEach(() => {
    while (usersDB.length > 0) {
      usersDB.pop();
    }
  });

  describe("POST /auth/signup", () => {
    it("Deve criar um novo usuário", (done) => {
      chai
        .request(app)
        .post("/auth/signup")
        .send({
          nome: "Teste",
          email: "teste@gmail.com",
          senha: "senha123",
          telefones: ["123456789"],
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("token");
          done();
        });
    });

    it("Deve retornar erro ao tentar criar um usuário com e-mail existente", (done) => {
      const existingUser = createUser({
        nome: "Existente",
        email: "existente@gmail.com",
        senha: "senha123",
        telefones: ["987654321"],
      });

      chai
        .request(app)
        .post("/auth/signup")
        .send({
          nome: "Teste",
          email: "existente@gmail.com",
          senha: "senha123",
          telefones: ["123456789"],
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("mensagem", "E-mail já existente");
          done();
        });
    });
  });

  describe("POST /auth/signin", () => {
    it("Deve retornar erro ao fazer login com credenciais inválidas", (done) => {
      chai
        .request(app)
        .post("/auth/signin")
        .send({
          email: "naoexistente@gmail.com",
          senha: "senhaerrada",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property(
            "mensagem",
            "Usuário e/ou senha inválidos"
          );
          done();
        });
    });
  });
});
