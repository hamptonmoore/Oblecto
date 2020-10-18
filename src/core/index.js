import owoblecto from '../lib/owoblecto';
import config from '../config';


export default {
    owoblecto: new owoblecto(config),

    start() {

    },

    close() {
        this.owoblecto.close();
    },
};
