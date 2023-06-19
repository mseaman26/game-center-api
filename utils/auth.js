const jwt = require('jsonwebtoken');
require('dotenv').config()
const expiration = '2h';

module.exports = {

  authMiddleware: function (req, res, next) {
    let token = req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    try {
      const { data } = jwt.verify(token, process.env.SECRET, { maxAge: expiration });
      req.user = data;
      console.log(data + "this is the data");
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }
    next();
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, process.env.SECRET, { expiresIn: expiration });
  },
};
