import request from "supertest";
import app from "../src/app";
import connection from "../src/models/connection";
import recreateDatabase from "./recreateDatabase";
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("1 - Crie um endpoint para o cadastro de produtos", () => {
  beforeAll(async () => {
    await recreateDatabase(connection);
  });
  afterAll(() => {
    connection.end();
  })

  it('Será validado que é possível cadastrar um produto com sucesso', async () => {
    const product = {
      name: 'Arco Escudo Invejável',
      amount: '3 Gemas da Noite'
    }

    const result = await request(app).post("/products").send(product)
    expect(result.statusCode).toEqual(201);
    expect(result.body.id).toBeDefined();
    expect(result.body.name).toEqual(product.name);
    expect(result.body.amount).toEqual(product.amount);

    const [selected] = await connection.execute('SELECT * FROM Trybesmith.Products');
    const products = selected as {
      id?: number
      name: string
      amount: string
      orderId?: number
    }[];

    expect(products).toEqual(
      expect.arrayContaining(
        [expect.objectContaining(product)]
      )
    )
  });
});