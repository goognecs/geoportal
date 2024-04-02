const db = require("../model/mode");
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");

exports.userSignUp = async (req, res) => {
  try {
    const { firstName, surname, email, occupation, country, city, password } =
      req.body;
    if (
      !(
        firstName ||
        password ||
        email ||
        surname ||
        occupation ||
        country ||
        city
      )
    ) {
      res.status(400).json("All field required");
      return;
    }
    const checkUser = await User.findOne({where:{ email }});
    if (checkUser) {
      res.status(400).json({ message: "User already exist" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      firstName,
      surname,
      email,
      occupation,
      country,
      city,
      password: hashedPassword,
    });
    // res.status(200).json({ Message: "User successfully created", newUser });
    res.redirect("/login");
    return;
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!(password && email)) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // check if user exist in database
    const checkUser = await User.findOne({where:{ email }});

    // if user doesn't exist throw error
    if (!checkUser) {
      return res.status(404).json({ message: "user not found" });
    }

    // if user exist in database, check if user password is correct
    const checkPassword = await bcrypt.compare(password, checkUser.password);

    // if user password is not correct throw error ==> invalid credentials
    if (!checkPassword) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // if user password is correct store in the req session and redirect to /geoportal
    req.session.user = {
      id: checkUser.id,
      surname: checkUser.surname,
      firstName: checkUser.firstName,
      //add fullname
      fullname: checkUser.firstName + ' ' + checkUser.surname,
      email: checkUser.email,
    };
    return res.redirect("/geoportal");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.keyValue, message: "internal server error" });
  }
};
