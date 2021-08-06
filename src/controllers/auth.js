const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(206).json({ error: 'Please add all the fields' });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(206)
          .json({ error: 'User already exist with that email' });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        user.save();
        res.status(201).json({ message: 'User Created Successfully', user });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(206).json({ error: 'Please add email and password' });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(206).json({ error: 'Invalid Email or password' });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((didMatched) => {
        if (didMatched) {
          const { _id, name, email } = savedUser;
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET,
            {
              expiresIn: '30d',
            }
          );
          return res.status(200).json({
            token,
            user: {
              _id,
              name,
              email,
            },
          });
        } else {
          return res.status(206).json({ error: 'Invalid Email or password' });
        }
      })
      .catch((err) => {
        console.log('errorrrr', err);
      });
  });
};
