const bodyParser = require('body-parser');

const mountMiddlewares = ({ app }) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
};

module.exports = mountMiddlewares;
