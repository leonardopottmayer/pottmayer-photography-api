const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

const getUserFromToken = async (req, res) => {
  try {
    let currentUser = {};

    const token = await getToken(req);

    if (!token) {
      res.status(401).json({ message: "Invalid token!" });
      return;
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    currentUser = await User.findById(decoded.id);

    res.status(200).send(currentUser);
    return currentUser;
  } catch (error) {
    return;
  }
};

module.exports = getUserFromToken;
