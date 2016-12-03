var debug = require('debug')('api');

module.exports = [
    require('./badRequest'),
    require('./created'),
    require('./forbidden'),
    require('./notFound'),
    require('./ok'),
    require('./serverError'),
    require('./unauthorized'),
    require('./tokenExpired'),
    require('./notActiveUser'),
    require('./conflict')
].map(function (desc) {
    return function (req, res, next) {
        res[desc.name] = function (data, code, message) {
            if (data instanceof Error) {
                // log error 
                debug(data);
                
                // clear data variable, do not send it to client
                data = undefined;
            }

            var response = {
                code: code || desc.code,
                message: message || desc.message,
                data: data || desc.data
            };

            return res.status(desc.status).json(response);
        };

        next();
    };
});