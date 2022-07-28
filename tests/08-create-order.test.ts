import request from 'supertest';
import app from '../src/app';
import connection from '../src/models/connection';
import recreateDatabase from './recreateDatabase';

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe('8 - Crie um endpoint para o cadastro de um pedido', function() {
  let token: string;
  beforeEach(async () => {
    await recreateDatabase(connection);

    const result = await request(app).post('/login').send({
      username: 'yraa',
      password: 'valarmorg',
    });

    token = result.body.token;
  });

  afterAll(() => {
    connection.end();
  })

  it('Será validado que não é possível cadastrar pedidos sem token', async function() {
    const result = await request(app).post('/orders').send({
      productsIds: [1, 2],
    });

    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toEqual('Token not found');
  });

  it('Será validado que não é possível cadastrar um pedido com token inválido', async function() {
    const result = await request(app).post('/orders').send({
      productsIds: 'amount',
    }).set('Authorization', 'Bearer 123');

    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toEqual('Invalid token');
  });

  it('Será validado que o campo "productsIds" é obrigatório"', async function() {
    const result = await request(app).post('/orders').send({
    }).set('Authorization', token);

    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('\"productsIds\" is required');
  });

  it('Será validado que não é possível criar um pedido com o campo "productsIds" não sendo um array', async function() {
    const result = await request(app).post('/orders').send({
      productsIds: 'products',
    }).set('Authorization', token);

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"productsIds\" must be an array');
  });

  it('Será validado que não é possível criar um pedido com o campo "productsIds" vazio', async function() {
    const result = await request(app).post('/orders').send({
      productsIds: [],
    }).set('Authorization', token);

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('\"productsIds\" must include only numbers');
  });

  it('Será validado que é possível criar um pedido com sucesso com 1', async function() {
    const loggedUserId = 3;
    const fakeProductId = 6;
    const fakeProduct = {
      name: 'café sem açúcar daquele naipão',
      amount: 'meio pão de queijo',
    };

    await request(app).post('/products').send(fakeProduct).set('Authorization', token);

    const result = await request(app).post('/orders').send({
      productsIds: [fakeProductId],
    }).set('Authorization', token);

    expect(result.statusCode).toBe(201);
    expect(result.body).toBeDefined();
    expect(result.body.userId).toBeDefined();
    expect(result.body.userId).toBe(3);
    expect(result.body.productsIds).toBeDefined();
    expect(result.body.productsIds).toEqual([fakeProductId]);

    const [selected] = await connection.execute('SELECT * FROM Trybesmith.Orders');
    const orders = selected as {
      id?: number
      userId: number
    }[];

    expect(orders).toEqual(
      expect.arrayContaining(
        [expect.objectContaining({ userId: loggedUserId, id: 4 })]
      )
    );

    const [selectedProducts] = await connection.execute('SELECT * FROM Trybesmith.Products');
    const products = selectedProducts as {
      id?: number
      name: string
      amount: string
      orderId?: number
    }[];

    expect(products).toEqual(
      expect.arrayContaining(
        [expect.objectContaining({ ...fakeProduct, id: fakeProductId, orderId: 4 })]
      )
    );
  });

  it('Será validado que é possível criar um pedido com sucesso com vários itens', async function() {
    const loggedUserId = 3;
    const orderId = 4;
    const fakeProductId = 6;
    const fakeProduct2Id = 7;
    const fakeProduct = {
      name: 'Mate Couro em garrafa de ouro',
      amount: '0.5 diamante',
    };
    const fakeProduct2 = {
      name: 'Porção de Falafel +7',
      amount: '1 moeda de prata',
    };
  
    await request(app).post('/products').send(fakeProduct).set('Authorization', token);
    await request(app).post('/products').send(fakeProduct2).set('Authorization', token);

    const result = await request(app).post('/orders').send({
      productsIds: [fakeProductId, fakeProduct2Id],
    }).set('Authorization', token);

    expect(result.statusCode).toBe(201);
    expect(result.body).toBeDefined();
    expect(result.body.userId).toBeDefined();
    expect(result.body.userId).toBe(loggedUserId);
    expect(result.body.productsIds).toBeDefined();
    expect(result.body.productsIds).toEqual([fakeProductId, fakeProduct2Id]);

    const [selected] = await connection.execute('SELECT * FROM Trybesmith.Orders');
    const orders = selected as {
      id?: number
      userId: number
    }[];

    expect(orders).toEqual(
      expect.arrayContaining(
        [expect.objectContaining({ userId: loggedUserId, id: orderId })]
      )
    );

    const [selectedProducts] = await connection.execute('SELECT * FROM Trybesmith.Products');
    const products = selectedProducts as {
      id?: number
      name: string
      amount: string
      orderId?: number
    }[];

    expect(products).toEqual(
      expect.arrayContaining(
        [
          expect.objectContaining({ ...fakeProduct, id: fakeProductId }),
          expect.objectContaining({ ...fakeProduct2, id: fakeProduct2Id }),
        ]
      )
    );
  });
});
