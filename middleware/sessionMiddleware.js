const session = require("express-session");

const secret = process.env.SESSION_SECRET

const sessionMiddleware = session({
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
});

module.exports = sessionMiddleware;