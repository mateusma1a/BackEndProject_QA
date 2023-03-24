const app = require("./app");
const request = require('supertest')(app);

describe("API User", ()=> {

    let repository;
    const container = app.get("container");
    
    beforeAll(async () => {
        repository = await container.getUserRepository();
    });

    beforeEach(async () => {
        await repository.clear();
      });
    
    afterAll(async () => {
        const client = container.getClient();
        await client.close();
    });

    describe("/users/:id", () => {

        // GET /users/:id
        describe("GET", () => {
            test("Buscar um usuário existente", async () => {
                const user = await repository.insert({
                    name: "Mateus Maia",
                    email: "mateusmaia@gmail.com",
                    password: "123456"
                });
        
                const response = await request
                  .get(`/users/${user._id}`)
                  .expect("Content-Type", /application\/json/);
        
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(
                  expect.objectContaining({
                    name: "Mateus Maia",
                    email: "mateusmaia@gmail.com",
                    password: "123456"
                  })
                );
            });

            test("Buscar um usuário não existente", async () => {
                const response = await request
                    .get(`/users/63f8f6bd6ba024559194fe0e`)
                    .expect("Content-Type", /application\/json/);
        
                expect(response.statusCode).toBe(404);
                expect(response.body).toStrictEqual(
                    expect.objectContaining({
                    error: "User not found",
                    code: 404,
                    })
                );
            });
        });

        // DELETE /users/:id
        describe("DELETE", () => {
            test("Deletar um usuário existente", async () => {
                const user = await repository.insert({
                    name: "Mateus Maia",
                    email: "mateusmaia@gmail.com",
                    password: "123456"
                });
        
                const response = await request.delete(`/users/${user._id}`);
                expect(response.statusCode).toBe(204);
            });

            test("Deletar um usuário não existente", async () => {
                const response = await request
                    .delete(`/users/63f8f6bd6ba024559194fe0e`)
                    .expect("Content-Type", /application\/json/);
        
                expect(response.statusCode).toBe(404);
                expect(response.body).toStrictEqual(
                    expect.objectContaining({
                    error: "User not found",
                    code: 404,
                    })
                );
            });
        });

        // PUT /users/:id
        describe("PUT", () => {
            test("Alterar um usuário existente", async () => {
                const user = await repository.insert({
                    name: "Mateus Maia",
                    email: "mateusmaia@gmail.com",
                    password: "123456"
                });

                const response = await request
                .put(`/users/${user._id}`)
                .send({
                    name: "Mateus Maia",
                    email: "mateusmaia@gmail.com",
                    password: "123456"
                })
                .expect("Content-Type", /application\/json/);

                expect(response.statusCode).toBe(200);

                expect(response.body).toStrictEqual(
                    expect.objectContaining({
                            name: "Mateus Maia",
                            email: "mateusmaia@gmail.com",
                            password: "123456"
                    })
                );
            });

            test("Alterar detalhes de um usuário não existente", async () => {
                const response = await request
                  .put(`/users/63f8f6bd6ba024559194fe0e`)
                  .send({
                    name: "Mateus Maia",
                    email: "mateusmaia@gmail.com",
                    password: "123456"
                  })
                  .expect("Content-Type", /application\/json/);
                expect(response.statusCode).toBe(404);
                expect(response.body).toStrictEqual(
                  expect.objectContaining({
                    error: "User not found",
                    code: 404,
                  })
                );
              });
        });
    });
    
    describe("/users", () => {

        // GET /users
        describe("GET", () => {
            test("Listar todos os usuarios", async () => {
                await repository.insert({
                    name: "Mateus Maia",
                    email: "mateusmaia@gmail.com",
                    password: "123456"
                });

                const response = await request
                    .get('/users')
                    .expect("Content-Type", /application\/json/);

                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBe(1);
                expect(response.body[0]).toStrictEqual(
                    expect.objectContaining({
                      name: "Mateus Maia",
                      email: "mateusmaia@gmail.com",
                      password: "123456"
                    })
                );
            });
        });

        // POST /users
        describe("POST", () => {
            test("Cadastrar um usuario", async () => {
                const user = {
                    name: "Mateus Maia",
                    email: "mateusmaia@gmail.com",
                    password: "123456"
                  };
          
                  const response = await request
                    .post("/users")
                    .send(user)
                    .expect("Content-Type", /application\/json/);
          
                  expect(response.statusCode).toBe(201);
                  expect(response.body).toStrictEqual(
                    expect.objectContaining({
                        name: "Mateus Maia",
                        email: "mateusmaia@gmail.com",
                        password: "123456"
                    })
                  );
            });
        });
    });
});