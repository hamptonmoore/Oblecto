import recursive from 'recursive-readdir';
import path from 'path';

export default class SeriesCollector {
    /**
     *
     * @param {owoblecto} owoblecto
     */
    constructor(owoblecto) {
        this.owoblecto = owoblecto;
    }

    /**
     *
     * @param {String} directory - Which directory to add to the index queue
     * @returns {Promise<void>}
     */
    async collectDirectory(directory) {
        let files = await recursive(directory);

        files.forEach(file => {
            this.collectFile(file);
        });
    }

    /**
     *
     * @param {String} file - File path to add to the index queue
     * @returns {Promise<void>}
     */
    async collectFile(file) {
        let extension = path.parse(file).ext.toLowerCase();

        if (this.owoblecto.config.fileExtensions.video.indexOf(extension) !== -1) {
            this.owoblecto.queue.queueJob('indexEpisode',{path: file});
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async collectAll() {
        this.owoblecto.config.tvshows.directories.forEach(directory => {
            this.collectDirectory(directory.path);
        });
    }
}
