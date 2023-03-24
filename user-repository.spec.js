const { MongoClient } = require("mongodb");
const UserRepository = require("./user-repository");

let repository;
let collection;
let client;

//#region Methods
beforeAll(async () => {
  const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority';
  client = new MongoClient(dsn);
  await client.connect();
  collection = client.db("users_db").collection("users");
  repository = new UserRepository(collection);
});

beforeEach(async () => {
  await collection.deleteMany({});
});

afterAll(() => {
  client.close();
});

describe("UserRepository", () => {

  // CREATE
  test("Criar um novo usuário", async () => {
    const user = await repository.insert({
        name: "Mateus Maia",
        email: "mateusmaia@gmail.com",
        password: "123456"
    });

    const users = await collection.find({}).toArray();

    expect(users.length).toBe(1);

    expect(user).toStrictEqual(users[0]);
  });

  // READ
  test("Recuperar um usuário existente por ID", async () => {
    const dummy = await repository.insert({
        name: "Mateus Maia",
        email: "mateusmaia@gmail.com",
        password: "123456"
    });

    const user = await repository.find(dummy._id);

    expect(user).toStrictEqual(dummy);
  });

  test("Listar todos os usuários", async () => {
    await repository.insert({ name: "Predro Henrique" });
    await repository.insert({ name: "Mateus Maia" });
    await repository.insert({ name: "John John" });

    const result = await repository.findAll();

    expect(result.length).toBe(3);
  });

  // UPDATE
  test("Atualizar um usuário", async () => {
    const user = await repository.insert({
        name: "Mateus Maia",
        email: "mateusmaia@gmail.com",
        password: "123456"
    });

    user.name = "Mateus Maia";

    await repository.update(user._id, {
      name: "Mateus Maia",
    });

    const expectedUser = await repository.find(user._id);

    expect(expectedUser.name).toBe("Mateus Maia");
  });

  // DELETE
  test("Remover um usuário", async () => {
    const user = await repository.insert({
        name: "Mateus Maia",
        email: "mateusmaia@gmail.com",
        password: "123456"
    });

    await repository.remove(user._id);

    const result = await repository.find(user._id);

    expect(result).toBe(null);
  });

});