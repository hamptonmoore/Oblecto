import authMiddleWare from '../../middleware/auth';
import errors from 'restify-errors';
import {ConfigManager} from '../../../../config';

/**
 *
 * @param server
 * @param {owoblecto} owoblecto
 */
export default (server, owoblecto) => {
    // API Endpoint to request a re-index of certain library types
    server.get('/settings/:setting', authMiddleWare.requiresAuth, function (req, res, next) {
        if (!owoblecto.config[req.params.setting]) return next(new errors.NotFoundError('Setting does not exist'));

        res.send(owoblecto.config[req.params.setting]);
    });

    server.put('/settings/:setting', authMiddleWare.requiresAuth, function (req, res, next) {
        if (!owoblecto.config[req.params.setting]) return next(new errors.NotFoundError('Setting does not exist'));

        owoblecto.config[req.params.setting] = req.body;

        ConfigManager.saveConfig();

        res.send(owoblecto.config[req.params.setting]);

        return next();
    });

};
