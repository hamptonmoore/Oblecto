import FederationClient from './FederationClient';

export default class FederationDataClient extends FederationClient {
    /**
     *
     * @param {owoblecto} owoblecto
     * @param {string} server
     */
    constructor(owoblecto, server) {
        super(owoblecto, server);

        this.port = owoblecto.config.federation.servers[server].dataPort;
    }

    headerHandler(data) {
        super.headerHandler(data);

        let split = data.split(':');

        switch (split[0]) {
            case 'FILE':
                this.fileHandler(split[1]);
                break;
        }
    }

    requestFullSync() {
        this.write('SYNC', 'FULL');
    }

    async fileHandler(data) {
        let input = Buffer.from(data, 'base64').toString();

        let file = JSON.parse(input);
        file.host = this.serverName;

        switch (file.fileInfo.type) {
            case 'episode':
                this.owoblecto.queue.queueJob('federationIndexEpisode', file);
                break;
            case 'movie':
                this.owoblecto.queue.queueJob('federationIndexMovie', file);
                break;
        }

    }
}
