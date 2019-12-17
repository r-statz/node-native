const db = require('./db')
const bcrypt = require('bcrypt');
const userModel = require('./user.model')

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const errors = [];
  if (!email || !email.trim()) errors.push('Email cannot be blank');
  if (!password || !password.trim()) errors.push('Password cannot be blank');
  if (errors.length) {
    return res.status(422).json({ errors });
  }

  const user = await db('users').whereRaw('lower(email) = ?', email.toLowerCase()).first();
  if (!user) return res.status(422).json({ loggedIn: false });
  const passwordsMatch = await bcrypt.compare(password, user.password_digest);
  if (!passwordsMatch) return res.status(422).json({ loggedIn: false });

  req.session.userId = user.id;
  console.log(req.session)

  res.json({ loggedIn: true });
};

exports.create = async (req, res, next) => {
  console.log(req)
  const {
    body: {
      name,
      email,
      password
    }
  } = req

  try {
    const user = await userModel.create({
      name,
      email,
      password
    })
    res.json(`${user.name} has been created`)
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.status(422).json({
        errors: e.errors
      })
    } else {
      next(e)
    }
  }
}

exports.logout = async (req, res) => {
  req.session = null;
  res.json({ loggedIn: false });
};