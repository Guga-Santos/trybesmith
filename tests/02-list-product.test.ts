import request from "supertest";
import app from "../src/app";
import recreateDatabase from "./recreateDatabase";
import connection from '../src/models/connection'

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("2 - Crie um endpoint para a listagem de produtos", () => {
  beforeAll(async () => {
    await recreateDatabase(connection);
  });
  afterAll(() => {
    connection.end();
  })

  it('Será validado que é possível listar todos os produtos com sucesso', async () => {
    const result = await request(app).get("/products")

    expect(result.statusCode).toEqual(200);
    expect(result.body).toBeDefined();
    expect(result.body.length).toEqual(5);
    expect(result.body[0].id).toBeDefined();
    expect(result.body[0].name).toEqual("Espada curta");
    expect(result.body[0].amount).toEqual("10 peças de ouro");
    expect(result.body[1].id).toBeDefined();
    expect(result.body[1].name).toEqual("Escudo desnecessariamente grande");
    expect(result.body[1].amount).toEqual("20 peças de ouro");
  });
});
