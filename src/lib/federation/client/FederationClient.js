import tls from 'tls';
import {promises as fs} from 'fs';
import NodeRSA from 'node-rsa';
import EventEmitter from 'events';
import {readFileSync} from 'fs';
import logger from '../../../submodules/logger';

export default class FederationClient{
    /**
     *
     * @param {owoblecto} owoblecto
     * @param {string} server
     */
    constructor(owoblecto, server) {
        this.owoblecto = owoblecto;
        this.serverName = server;
        this.host = owoblecto.config.federation.servers[server].address;
        this.port = 9131;
        this.isSecure = false;
        this.authenticated = false;

        this.eventEmitter = new EventEmitter();

        this.dataRead = '';
    }

    async connect() {
        logger.log('INFO', 'Connecting to federation master:', this.serverName);

        this.socket = tls.connect({
            host: this.host,
            port: this.port ,

            ca: [readFileSync(this.owoblecto.config.federation.servers[this.serverName].ca)]
        });

        this.socket.on('data', chunk => this.dataHandler(chunk));
        this.socket.on('secureConnect', () => this.secureConnectHandler());
        this.socket.on('error', (error) => this.errorHandler(error));
        this.socket.on('close', () => this.closeHandler());

        if (!this.isSecure) await this.waitForSecure();

        this.socket.write(`IAM:${this.owoblecto.config.federation.uuid}\n`);

        await this.waitForAuth();
    }

    write(header, content) {
        this.socket.write(`${header}:${content}\n`);
    }

    dataHandler (chunk) {
        this.dataRead += chunk.toString();
        let split = this.dataRead.split('\n');

        if (split.length < 2) return;

        for (let item of split) {
            if (item === '') continue;

            this.dataRead = this.dataRead.replace(item + '\n', '');
            this.headerHandler(item);
        }
    }

    headerHandler(data) {
        let split = data.split(':');

        switch (split[0]) {
            case 'CHALLENGE':
                this.challengeHandler(split[1]);
                break;
            case 'AUTH':
                this.authAcceptHandler(split[1]);
                break;
        }
    }

    async challengeHandler(data) {
        const pemKey = await fs.readFile(this.owoblecto.config.federation.key);
        const key = NodeRSA(pemKey);

        const decrypted = key.decrypt(data, 'ascii');

        this.write('CHALLENGE', decrypted);
    }

    async authAcceptHandler(data) {
        if (data === 'ACCEPTED') {
            this.authenticated = true;
            this.eventEmitter.emit('auth');
            return;
        }

        delete this;
    }

    secureConnectHandler() {
        this.isSecure = true;
    }

    errorHandler (error) {

    }

    closeHandler () {

    }

    waitForSecure() {
        return new Promise((resolve, reject) => {
            this.socket.once('secureConnect', resolve);
        });
    }

    waitForAuth() {
        return new Promise((resolve, reject) => {
            this.eventEmitter.once('auth', resolve);
        });
    }

    close() {
        this.socket.destroy();
    }
}
