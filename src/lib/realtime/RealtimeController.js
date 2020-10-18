import socketio from 'socket.io';
import RealtimeClient from './RealtimeClient';

export default class RealtimeController {
    /**
     *
     * @param {owoblecto} owoblecto
     */
    constructor(owoblecto) {
        this.owoblecto = owoblecto;
        this.clients = {};

        this.server = socketio.listen(owoblecto.owoblectoAPI.server.server, {
            log: false,
            agent: false,
            origins: '*:*',
            transports: ['websocket', 'polling']
        });

        this.server.on('connection', socket => {
            this.connectionHandler(socket);
        });
    }

    connectionHandler(socket) {
        this.clients[socket.id] = new RealtimeClient(this.owoblecto, socket);
        this.clients[socket.id].on('disconnect', () => {
            delete this.clients[socket.id];
        });
    }

    close() {
        for (let client of Object.keys(this.clients)) {
            this.clients[client].disconnect();
        }

        this.server.close();
    }
}
