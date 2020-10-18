import FederationDataClient from './FederationDataClient';

export default class FederationClientController{
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        this.syncServers = [];
    }

    async addAllSyncMasters () {
        for (let server in this.owoblecto.config.federation.servers) {
            await this.addSyncMaster(server);
        }
    }

    async addSyncMaster (server) {
        let client = new FederationDataClient(this.owoblecto, server);
        await client.connect();
        await client.requestFullSync();

        this.syncServers.push(client);
    }

    requestFullSync() {
        for (let server of this.syncServers) {
            server.requestFullSync();
        }
    }

    close() {
        for (let server of this.syncServers) {
            server.close();
        }
    }
}
