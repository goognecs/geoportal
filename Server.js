require("dotenv").config();
const express = require("express");
const { isAuth } = require("./app/middleware/isAuth");
const path = require("path");
const session = require("express-session");
const userRoute = require('./app/routes/user.route');
const postRoute = require('./app/routes/post.route');
const {DateTime} = require("luxon");

const app = express();
const db = require("./app/model/mode");

db.sequelize.sync();
// db.sequelize.sync({ force: true });

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    resave: true,
    saveUninitialized: true,
    //
  })
);

//expose current user in ejs template
app.use(function(req, res, next) {
  res.locals.user = req.session?.user
  //lxon date formatter
  res.locals.DateTime = DateTime
  //current url
  res.locals.URL = req.url
  next()
})

app.use('/api', userRoute);
app.use('/post', isAuth, postRoute)


app.get('/', (req, res) => {
  res.redirect('/geoportal')
})

app.get("/signUp", (req, res) => {
  res.render("signUp");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/geoportal", isAuth, (req, res) => {
  res.render("geoportal");
});

const port = process.env.PORT || 3456;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
