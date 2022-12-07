const bcrypt = require("bcrypt");

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword =  (password, hashPassword) => {
    const checkPassword = bcrypt.compareSync(password, hashPassword);
  return checkPassword
};

module.exports = {
  hashPassword,
  comparePassword,
};
