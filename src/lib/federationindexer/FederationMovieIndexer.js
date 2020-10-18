import {File} from '../../models/file';
import {Movie} from '../../models/movie';

export default class FederationMovieIndexer {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        // Register task availability to owoblecto queue
        this.owoblecto.queue.addJob('federationIndexMovie', async (job) => {
            await this.indexMovie(job);
        });
    }

    async indexMovie(file) {
        let [fileEntity, fileInserted] = await File.findOrCreate({
            where: {
                host: file.host,
                path: file.id
            },
            defaults: {
                name: '',
                directory: '',
                extension: '',
                duration: file.duration
            }
        });

        let [movie, movieInserted] = await Movie.findOrCreate({
            where: {
                tmdbid: file.fileInfo.tmdbid
            }
        });

        await movie.addFile(fileEntity);

        if (!movieInserted) return;

        await this.owoblecto.movieUpdateCollector.collectMovie(movie);
        await this.owoblecto.movieArtworkCollector.collectArtworkMovieFanart(movie);
        await this.owoblecto.movieArtworkCollector.collectArtworkMoviePoster(movie);

    }
}
