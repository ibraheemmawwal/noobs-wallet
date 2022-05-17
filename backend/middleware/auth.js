const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    '' + process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    }
  );
};

module.exports.isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, '' + process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).json({
          message: 'Invalid token',
        });
      }
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      message: 'no token',
    });
  }
};
