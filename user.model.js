const bcrypt = require('bcrypt');
const db = require('./db');

const HASH_STRENGTH = 10;

exports.create = async (
  {
    name,
    email,
    password,
  },
  transaction = null
) => {
  console.log(name, email, password)
  const errors = await validate({ name, email, password });
  if (errors.length) {
    const error = new Error(`Record Invalid: ${errors.join(',')}`);
    error.errors = errors;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, HASH_STRENGTH);

  const builder = transaction
    ? db('users').transacting(transaction)
    : db('users');

  try {
    const result = await builder
      .insert({
        name,
        email,
        password_digest: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return result[0];
  } catch (e) {
    console.log(e, "in model")
    const matches = e.message.match(
      /duplicate key value violates unique constraint "(.*)"/
    );
    if (matches) {
      const error = new Error(`Record Invalid: Email has already been taken`);
      error.errors = ['Email has already been taken'];
      throw error;
    } else {
      throw e;
    }
  }
};

exports.findByEmail = async email => {
  return await db('users')
    .whereRaw('lower(email) = ?', email.toLowerCase())
    .first();
};

function validatePassword(password) {
  const errors = [];
  if (!password || !password.trim()) errors.push('Password cannot be blank');
  if (!password || password.length < 8)
    errors.push('Password must be at least 8 characters');
  return errors;
}

async function validate({ name, email, password }) {
  const errors = validatePassword(password);
  if (!name || !name.trim()) errors.push('Name cannot be blank');
  if (!email || !email.trim()) errors.push('Email cannot be blank');
  if (email && !email.match(/^.+@.+\..+$/))
    errors.push('Email format is invalid');

  if (email) {
    const existingUser = await exports.findByEmail(email);
    if (existingUser) errors.push('Email has already been taken');
  }

  return errors;
}
