import tls from 'tls';
import fs from 'fs';

export default class FederationServer {
    constructor(owoblecto, port) {
        this.owoblecto = owoblecto;

        let options = {
            key: fs.readFileSync(this.owoblecto.config.federation.key),
            cert: fs.readFileSync('/etc/oblecto/keys/public-cert.pem'),
        };

        this.server = tls.createServer(options, (socket) => {});

        this.server.listen(port);

        this.server.on('error', (err) => this.errorHandler(err));
        this.server.on('connection', (socket) => this.connectionHandler(socket));
        this.server.on('secureConnection', (socket) => this.secureConnectionHandler(socket));
    }

    errorHandler(error) {}

    connectionHandler(socket) {}

    secureConnectionHandler(socket) {}

    close() {
        this.server.close();
    }
}
