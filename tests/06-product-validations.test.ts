/*trazer todas as validações para este arquivo*/
import request from 'supertest';
import app from '../src/app';

jest.mock('mysql2/promise', () => {
	const connectionError = new Error("Neste requisito de validação, não é necessário conectar com o banco de dados");
	const connectionMock = jest.fn().mockImplementation(() => ({
		execute: jest.fn().mockRejectedValue(connectionError),
		query: jest.fn().mockRejectedValue(connectionError),
	}))

	return {
		createPool: connectionMock,
		createConnection: connectionMock, createPoolCluster: connectionMock
	}
});

describe('6 - Crie as validações dos produtos', function() {
  it('Será validado que o campo "name" é obrigatório', async () => {
    const result = await request(app).post("/products").send({
      amount: "amount",
    })

    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual("\"name\" is required");
  });

  it('Será validado que o campo "name" tem o tipo string', async () => {
    const result = await request(app).post("/products").send({
      name: 1,
      amount: "amount",
    })

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual("\"name\" must be a string");
  });

  it('Será validado que o campo "name" é uma string com mais de 2 caracteres', async () => {
    const result = await request(app).post("/products").send({
      name: "1",
      amount: "amount",
    })

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual("\"name\" length must be at least 3 characters long");
  });

  it('Será validado que o campo "amount" é obrigatório', async () => {
    const result = await request(app).post("/products").send({
      name: "name",
    })

    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual("\"amount\" is required");
  });

  it('Será validado que o campo "amount" tem o tipo string', async () => {
    const result = await request(app).post("/products").send({
      name: "name",
      amount: 1,
    })

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual("\"amount\" must be a string");
  });

  it('Será validado que o campo "amount" é uma string com mais de 2 caracteres', async () => {
    const result = await request(app).post("/products").send({
      name: "name",
      amount: "1",
    })

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual("\"amount\" length must be at least 3 characters long");
  });
 
});