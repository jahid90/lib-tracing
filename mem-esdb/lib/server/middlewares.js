const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');

const primeRequestContext = () => {
    return (req, res, next) => {
        req.context = {
            ...req.context,
            requestId: uuid(),
        };

        next();
    };
};

const mountMiddlewares = ({ app }) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(primeRequestContext());
};

module.exports = mountMiddlewares;
