import app from '../app';
import supertest from 'supertest';

let token: string;
let recipeId: string;

describe('signup', () => {
  const data = {
    email: 'oladapoi@gmail.com',
    fullname: 'johnson Ayo',
    password: 'test12345',
  };

  test('signup', async () => {
    const response = await supertest(app).post('/users/signup').send(data);
    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe(data.email);
  });
});

describe('login', () => {
  const data = {
    email: 'oladapoi@gmail.com',
    password: 'test12345',
  };

  test('login', async () => {
    const response = await supertest(app).post('/users/login').send(data);
    token = response.body.token;
    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe(data.email);
  });
});

describe('logout', () => {
 
  test('logout', async () => {
    const response = await supertest(app).get('/users/logout')
    expect(response.body.status).toBe('success');
    expect(response.status).toBe(200);
  });
});

describe('createReceipe', () => {
  const data = {
    title: 'isi ewu',
    meal_type: 'breakfast',
    difficulty_level: 'advanced',
    ingredients: ['***'],
    preparation: '***',
  };

  test('postRecipe', async () => {
    const response = await supertest(app)
      .post('/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    recipeId = response.body.data.data._id;
    expect(response.body.status).toBe('success');
    expect(response.body.data.data.title).toBe(data.title);
  });
});

describe('getAllRecipe', () => {
  test('getAllReceipe', async () => {
    const response = await supertest(app)
      .get('/recipes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(1);
  });
});

describe('getOneRecipe', () => {
  test('getRecipe', async () => {
    const response = await supertest(app)
      .get(`/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.body.status).toBe('success');
    expect(response.statusCode).toBe(200);
    expect(response.ok).toBe(true);
  });
});

describe('updateRecipe', () => {
  const data = {
    title: 'isi ewu',
    meal_type: 'breakfast',
    difficulty_level: 'advanced',
    ingredients: ['***'],
    preparation: '***',
  };
  test('UpdateRecipe', async () => {
    const response = await supertest(app)
      .patch(`/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(response.body.status).toBe('success');
    expect(response.statusCode).toBe(200);
    expect(response.ok).toBe(true);
  });
});

describe('DeleteRecipe', () => {
  test('deleteRecipe', async () => {
    const response = await supertest(app)
      .delete(`/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(204);
    expect(response.ok).toBe(true);
  });
});
