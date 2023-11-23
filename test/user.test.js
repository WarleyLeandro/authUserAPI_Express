const chai = require("chai");
const chaiHttp = require("chai-http");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserById, usersDB } = require("../database");
const { app } = require("../index");

chai.use(chaiHttp);
const expect = chai.expect;

describe("User API", () => {
  beforeEach(() => {
    while (usersDB.length > 0) {
      usersDB.pop();
    }
  });

  describe("GET /user", () => {
    it("Deve retornar erro ao acessar sem token", (done) => {
      chai
        .request(app)
        .get("/user")
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("mensagem", "Não autorizado");
          done();
        });
    });

    it("Deve retornar erro ao acessar com token expirado", (done) => {
      const user = createUser({
        nome: "Teste",
        email: "teste@example.com",
        senha: bcrypt.hashSync("senha123", 10),
        telefones: ["123456789"],
      });

      const token = jwt.sign({ id: user.id }, "secreto", { expiresIn: "-1s" });

      chai
        .request(app)
        .get("/user")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("mensagem", "Sessão inválida");
          done();
        });
    });
  });
});
