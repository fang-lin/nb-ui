const express = require('express');
const errorHandler = require('errorhandler');
const winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()
    ]
});

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(errorHandler());
app.use('/css', express.static('./app/style'));
app.use('/images', express.static('./app/images'));
app.use('/fonts', express.static('./app/fonts'));
app.use('/upload', express.static('./app/upload'));

app.use('/:page', function (req, res, next) {
    app.render('index', {
        page: `page-${req.params.page || 'home'}`
    }, function (err, html) {
        if (err) {
            logger.error(err);
            res.status(404).send('Not Found.');
        } else {
            res.status(200).send(html);
        }
    });
});


app.use('/', function (req, res, next) {
    res.status(200).render('index', {
        page: 'page-home'
    });
});

const post = 8080;
const host = '0.0.0.0';

app.listen(post, host, () => {
    console.log(`site server listening on http://${host}:${post}`);
});