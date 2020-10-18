import authMiddleWare from '../middleware/auth';

/**
 *
 * @param {Server} server
 * @param {owoblecto} owoblecto
 */
export default (server, owoblecto) => {
    server.get('/clients', authMiddleWare.requiresAuth, async function (req, res, next) {
        let clients = [];

        for (let clientId in owoblecto.realTimeController.clients) {
            let client = owoblecto.realTimeController.clients[clientId];

            if (client.user.id === req.authorization.user.id) {
                clients.push({
                    clientId,
                    clientName: client.clientName
                });
            }
        }

        res.send(clients);

        return next();
    });

    server.post('/client/:clientId/playback', authMiddleWare.requiresAuth, async function (req, res, next) {
        let type = req.params.type;
        let client = owoblecto.realTimeController.clients[req.params.clientId];

        switch (type) {
            case 'episode':
                client.playEpisode(req.params.id);
                break;
            case 'movie':
                client.playMovie(req.params.id);
                break;
        }
        res.send();

        return next();
    });
};
