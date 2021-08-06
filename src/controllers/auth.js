const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
  // Received data from body
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(206).json({ error: 'Please add all the fields' });
  }

  // Checking if user with email already exists
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(206)
          .json({ error: 'User already exist with that email' });
      }
      // Hashing the password
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        // Saving the user into the database
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
  // Finding the user with the email provided in the body
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(206).json({ error: 'Invalid Email or password' });
    }
    // If user exists in database then hashing the password again
    // To match the password provided on the time of signup
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
          //  Sending token and user details on signup except the password
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
        console.log('error', err);
      });
  });
};
