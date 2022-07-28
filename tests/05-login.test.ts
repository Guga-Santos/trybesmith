import request from "supertest";
import app from "../src/app";
import connection from "../src/models/connection";
import recreateDatabase from "./recreateDatabase";

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("5 - Crie um endpoint para o login de pessoas usuárias", () => {
  beforeAll(async () => {
    await recreateDatabase(connection);
  });
  afterAll(() => {
    connection.end();
  })

  it('Será validado que o campo "username" é enviado', async () => {
    const result = await request(app).post("/login").send({
      password: "senha1234",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual("\"username\" is required");
  });

  it('Será validado que o campo "password" é enviado', async () => {
    const result = await request(app).post("/login").send({
      username: "username",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual("\"password\" is required");
  });

  it('Será validado que não é possível fazer login com um username inválido',
    async () => {
      const result = await request(app).post("/login").send({
        username: "userinvalido",
        password: "1dragaonoceu",
      });
      expect(result.statusCode).toEqual(401);
      expect(result.body.message).toEqual("Username or password invalid");
    }
  );

  it('Será validado que não é possível fazer login com uma senha inválida',
    async () => {
      const result = await request(app).post("/login").send({
        username: "reigal",
        password: "1senharerrada",
      });
      expect(result.statusCode).toEqual(401);
      expect(result.body.message).toEqual("Username or password invalid");
    }
  );

  it('Será validado que é possível fazer login com sucesso', async () => {
    const result = await request(app).post("/login").send({
      username: "reigal",
      password: "1dragaonoceu",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.token).toBeDefined();
  });
});

