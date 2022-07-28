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

describe('7 - Crie as validações para as pessoas usuárias', function() {
  it('Será validado que o campo "username" é obrigatório', async function() {
    const result = await request(app).post('/users').send({
      level: 2,
      classe: 'classe',
      password: 'senha1234',
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('\"username\" is required');
  });

  it('Será validado que o campo "username" tem o tipo string', async function() {
    const result = await request(app).post('/users').send({
      username: 1,
      password: 'senha1234',
      level: 2,
      classe: 'classe',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"username\" must be a string');
  });

  it('Será validado que o campo "username" é uma string com mais de 2 caracteres', async function() {
    const result = await request(app).post('/users').send({
      username: 'Lê',
      password: 'senha1234',
      level: 2,
      classe: 'classe',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"username\" length must be at least 3 characters long');
  });

  it('Será validado que o campo "classe" é obrigatório', async function() {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 2,
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('\"classe\" is required');
  });
  

  it('Será validado que o campo "classe" tem o tipo string', async function() {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 2,
      classe: 1,
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"classe\" must be a string');
  });

  it('Será validado que o campo "classe" é uma string com mais de 2 caracteres', async function() {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 2,
      classe: 'el',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"classe\" length must be at least 3 characters long');
  });

  it('Será validado que o campo "level" é obrigatório', async function() {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      classe: 'classe',
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('\"level\" is required');
  });

  it('Será validado que o campo "level" tem o tipo number', async function() {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 'um',
      classe: 'classe',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"level\" must be a number');
  });

  it('Será validado que o campo "level" deve ser um número maior que 0', async function() {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 0,
      classe: 'classe',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"level\" must be greater than or equal to 1');
  });

  it('Será validado que o campo "password" é obrigatório', async function() {
    const result = await request(app).post('/users').send({
      username: 'username',
      level: 2,
      classe: 'classe',
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('\"password\" is required');
  });

  it('Será validado que o campo "password" tem o tipo string', async function() {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 12345678,
      level: 2,
      classe: 'classe',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"password\" must be a string');
  });

  it('Será validado que o campo "password" é uma string com 8 ou mais caracteres', async function() {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: '1234567',
      level: 2,
      classe: 'classe',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"password\" length must be at least 8 characters long');
  });

});