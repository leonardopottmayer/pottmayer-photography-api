const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    process.env.SECRET
  );

  user.password = undefined;

  res.status(200).json({
    message: "You are authenticated!",
    token: token,
    user: user,
  });
};

module.exports = createUserToken;
