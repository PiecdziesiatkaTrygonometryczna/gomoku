const port = 3003;
const express = require('express');
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27777/';
const app = express();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require('http').createServer(app);

app.use(cors());
app.use(express.json());

app.post('/signup', async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  const generatedUserId = uuidv4();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    const database = client.db('gomoku');
    const users = database.collection('users');

    const existingUser = await users.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(409).send('User already exists');
      return;
    }

    const data = {
      user_id: generatedUserId,
      email: email.toLowerCase(),
      hashed_password: hashedPassword,
    };

    const insertedUser = await users.insertOne(data);

    const token = jwt.sign({ _id: insertedUser.insertedId }, email.toLowerCase(), {
      expiresIn: 60 * 24,
    });

    res.status(201).json({ token, userId: generatedUserId });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});


app.post('/login', async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db('gomoku');
    const users = database.collection('users');

    const existingUser = await users.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      res.status(401).send('User does not exist');
      return;
    }

    const passwordIsValid = await bcrypt.compare(password, existingUser.hashed_password);

    if (!passwordIsValid) {
      res.status(401).send('Invalid password');
      return;
    }

    const token = jwt.sign({ _id: existingUser._id }, email.toLowerCase(), {
      expiresIn: 60 * 24,
    });

    res.status(200).json({ token, userId: existingUser.user_id });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});


app.listen(port, () => console.log(`Server listening on port ${port}`))
