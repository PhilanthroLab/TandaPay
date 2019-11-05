const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["data:"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://verify.sendwyre.com/js/widget-loader.js"
      ],
      imgSrc: [
        "data:",
        "https://source.unsplash.com/random",
        "'self'",
        "https://lorempixel.com/",
        "https://images.unsplash.com",
        "https://lh3.googleusercontent.com/",
        "https://via.placeholder.com/150"
      ],
      connectSrc: [
        "https://x2.fortmatic.com/",
        "'self'",
        "https://backend-api-dot-peerless-dahlia-229121.appspot.com/",
        "https://tanday-lastest.appspot.com/",
        "https://backend-api-dot-tandapay-255615.appspot.com/",
        "http://backend-api-dot-tandapay-255615.appspot.com/",
        "http://localhost:8080",
        "https://storage.googleapis.com/"
      ],
      frameSrc: ["https://x2.fortmatic.com/", "https://verify.testwyre.com/"]
    }
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected"))
  .catch(err => console.log("We're experiencing a server downtime.", err));
app.options("*", cors());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
if (process.env.NODE_ENV === "production") {
  console.log("we re in production");

  app.use(express.static("client/build"));
  app.use(morgan("combined"));
  const path = require("path");
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

let server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = {
  server,
  app
};
