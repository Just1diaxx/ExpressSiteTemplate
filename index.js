const express =  require('express');
const session = require('express-session');
const uuid = require('uuid');
const serverless = require('serverless-http');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ejs uses the same codebase of HTML, but with embedded javascript templating
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: jsonwebtoken.sign({ id: uuid.v4() }, uuid.v4(), { expiresIn: '24h' }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV || 'production',
        httpOnly: true
    }
}));

const modules = [];

const routes = fs.readdirSync("./routes").filter(file => file.endsWith(".js"));

function isLoaded(pluginName) {
    return !!modules.includes(pluginName);
};

function load(routeName) {
    const route = require(`./routes/${routeName}`);
    delete require.cache[require.resolve(`./routes/${routeName}`)];
    app.use(route)
    modules.push(routeName)
};

routes.forEach(file => {
        if (!isLoaded(file.split(".")[0])) {
            load(file)
        }
    }
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(express.static('root'));

app.use((req, res) => {
    res.render('404')
});

app.listen(process.env.PORT, () => {
    console.log(`Loaded on port ${process.env.PORT}`)
})

module.exports = serverless(app);