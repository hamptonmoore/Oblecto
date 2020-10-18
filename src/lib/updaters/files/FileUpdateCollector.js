import {File} from '../../../models/file';

export default class FileUpdateCollector {
    /**
     *
     * @param {owoblecto} owoblecto
     */
    constructor(owoblecto) {
        this.owoblecto = owoblecto;
    }

    /**
     *
     * @param {File} file - File entity to update
     * @returns {Promise<void>}
     */
    async collectFile(file) {
        this.owoblecto.queue.queueJob('updateFile', file);
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async collectAllFiles() {
        let files = await File.findAll();

        for (let file of files) {
            this.collectFile(file);
        }
    }
}
