import request from 'supertest';
import app from '../src/app';
import connection from '../src/models/connection';
import recreateDatabase from './recreateDatabase';

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe('3 - Crie um endpoint para o cadastro de pessoas usuárias', function() {
  beforeAll(async () => {
    await recreateDatabase(connection);
  });
  afterAll(() => {
    connection.end();
  })

  it('Será validado que é possível cadastrar a pessoa usuária com sucesso', async function() {
    const user = {
      username: 'catiau',
      password: 'senha1234',
      level: 2,
      classe: 'classe',
    }
    const result = await request(app).post('/users').send(user);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toBeDefined();
    expect(result.body.token).toBeDefined();
    const [selected] = await connection.execute('SELECT * FROM Trybesmith.Users');
    const users = selected as {
      id?: number
      username: string
      classe: string
      level: 1
      password: string
    }[];

    expect(users).toEqual(
      expect.arrayContaining(
        [expect.objectContaining(user)]
      )
    )
  });
});
