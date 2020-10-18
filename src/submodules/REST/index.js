import restify from 'restify';
import routes from './routes';
import corsMiddleware from 'restify-cors-middleware';
import logger from '../logger';

export default class owoblectoAPI {
    /**
     * @param {owoblecto} owoblecto
     */
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        // Initialize REST based server
        this.server = restify.createServer({
            'name': 'owoblecto'
        });

        // Allow remote clients to connect to the backend
        const cors = corsMiddleware({
            preflightMaxAge: 5, //Optional
            origins: ['*'],
            allowHeaders: ['API-Token', 'authorization'],
            exposeHeaders: ['API-Token-Expiry']
        });

        this.server.pre(cors.preflight);
        this.server.use(cors.actual);
        this.server.use(restify.plugins.authorizationParser());
        this.server.use(restify.plugins.queryParser({ mapParams: true }));
        this.server.use(restify.plugins.bodyParser({ mapParams: true }));

        // Add routes routes
        routes(this.server, this.owoblecto);

        // Start restify server
        this.server.listen(this.owoblecto.config.server.port,  () => {
            logger.log('INFO', this.server.name, 'REST API Listening at', this.server.url);
        });
    }

    close() {
        this.server.close();
    }
}
