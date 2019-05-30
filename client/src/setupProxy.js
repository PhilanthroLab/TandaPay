const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/auth/google", { target: "http://localhost:5000" }));
  app.use(proxy("/auth/login", { target: "http://localhost:5000" }));
  app.use(proxy("/auth/user", { target: "http://localhost:5000" }));
  app.use(proxy("/auth/signup", { target: "http://localhost:5000" }));
  app.use(proxy("/auth/logout", { target: "http://localhost:5000" }));
};
