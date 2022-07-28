import request from "supertest";
import app from "../src/app";
import connection from "../src/models/connection";
import recreateDatabase from "./recreateDatabase";

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("4 - Crie um endpoint para listar todos os pedidos", () => {
  beforeAll(async () => {
    await recreateDatabase(connection);
  });
  afterAll(() => {
    connection.end();
  })

  it('Será validado que é possível listar todos os pedidos com sucesso', async () => {
    const result = await request(app).get("/orders")

    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
    expect(result.body.length).toBe(3);
    expect(result.body[0].id).toBeDefined();
    expect(result.body[0].userId).toBe(1);
    expect(result.body[0].productsIds).toBeDefined();
    expect(result.body[0].productsIds).toEqual([2]);
    expect(result.body[1].id).toBeDefined();
    expect(result.body[1].userId).toBe(2);
    expect(result.body[1].productsIds).toBeDefined();
    expect(result.body[1].productsIds).toEqual([5]);
    expect(result.body[2].id).toBeDefined();
    expect(result.body[2].id).toBe(2);
    expect(result.body[2].productsIds).toHaveLength(2);
  });
});
