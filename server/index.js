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

app.post('/api/games', async (req, res) => {
  const client = new MongoClient(uri);
  const { owner, player1, player2, places_of_x, places_of_y, is_over, player_won } = req.body;

  try {
    await client.connect();
    const database = client.db('gomoku');
    const games = database.collection('games');

    const gameData = {
      game_id: uuidv4(),
      owner,
      player1,
      player2,
      places_of_x,
      places_of_y,
      is_over,
      player_won,
    };

    await games.insertOne(gameData);
    
    res.status(201).json({ message: 'Game created successfully', gameId: gameData.game_id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});


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



app.get('/search-users', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required for search.' });
    }

    await client.connect();
    const database = client.db('gomoku');
    const users = database.collection('users');

    const regex = new RegExp(email, 'i');
    const searchCriteria = { email: { $regex: regex } };

    const searchResults = await users.find(searchCriteria).toArray();
    res.status(200).json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});


app.get('/users-db', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('gomoku');
    const users = database.collection('users');

    const allUsers = await users.find({}).toArray();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});

app.get('/api/games/:gameId/owner', async (req, res) => {
  const client = new MongoClient(uri);
  const { gameId } = req.params;

  try {
    await client.connect();
    const database = client.db('gomoku');
    const games = database.collection('games');

    const game = await games.findOne({ game_id: gameId });

    if (game) {
      res.status(200).json({ owner: game.owner });
    } else {
      res.status(404).send('Game not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});

app.put('/edit-account/:userId', async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.params.userId;
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db('gomoku');
    const users = database.collection('users');

    const existingUser = await users.findOne({ user_id: userId });

    if (!existingUser) {
      res.status(404).send('User not found');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.updateOne({ user_id: userId }, { $set: { email: email.toLowerCase(), hashed_password: hashedPassword } });

    res.status(200).send('Account updated successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});

app.get('/api/games/:gameId/places', async (req, res) => {
  const client = new MongoClient(uri);
  const { gameId } = req.params;

  try {
    await client.connect();
    const database = client.db('gomoku');
    const games = database.collection('games');

    const game = await games.findOne({ game_id: gameId });

    if (game) {
      res.status(200).json({ placesX: game.places_of_x, placesO: game.places_of_y });
    } else {
      res.status(404).send('Game not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});


app.delete('/delete-account/:userId', async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.params.userId;

  try {
    await client.connect();
    const database = client.db('gomoku');
    const users = database.collection('users');

    const deletedUser = await users.findOneAndDelete({ user_id: userId });

    if (!deletedUser.value) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('Account deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});


app.listen(port, () => console.log(`Server listening on port ${port}`))
