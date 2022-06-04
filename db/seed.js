// grab our client with destructuring from the export in index.js
const { 
  client, 
  getAllUsers,
  createUser,
  updateUser,
  getAllPosts,
  getPostsByUser,
  getUserById,
  createPost,
  updatePost
} = require('./index');

// this function should call a query which drops all tables from our database
async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);

        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
  }
  
  // this function should call a query which creates all tables for our database 
  async function createTables() {
    try {
        console.log("Starting to build tables...");
    
        await client.query(`
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
          );
        `);

        await client.query(`
          CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
          );
        `);
    
        console.log("Finished building tables!");
      } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
  }

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        await createUser({ username: 'albert', password: 'bertie99', name: 'Albert Frank', location: 'Lansing, MI' });
        await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandra Day', location: 'North Pole' });
        await createUser({ username: 'glamgal', password: 'soglam', name: 'Jim', location: 'The Attic' });

        console.log("Finished creating users!");
    } catch(error) {
        console.error("Error creating users!");
        throw error;
    }
}
  
async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      throw error;
    }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers")
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Creating new post...")
    const createPostResult = await createPost({
      authorId: 1,
      title: 'New post',
      content: 'I wrote a new post!'
    });
    console.log("Result:", createPostResult);

    console.log("Creating new post...")
    const createPostResult2 = await createPost({
      authorId: 1,
      title: 'Yet another post',
      content: 'I am on a roll!'
    });
    console.log("Result:", createPostResult2);

    console.log("Getting user by id...")
    const getUserResult = await getUserById(1)
    console.log("Result:", getUserResult);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());