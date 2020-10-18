import FederationMediaServer from './FederationMediaServer';
import FederationDataServer from './FederationDataServer';

export default class FederationController{
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        this.initiateFederation();
    }

    initiateFederation () {
        this.federationMediaServer = new FederationMediaServer(this.owoblecto, this.owoblecto.config.federation.mediaPort);
        this.federationDataServer = new FederationDataServer(this.owoblecto, this.owoblecto.config.federation.dataPort);
    }

    close() {
        this.federationDataServer.close();
        this.federationMediaServer.close();
    }
}

