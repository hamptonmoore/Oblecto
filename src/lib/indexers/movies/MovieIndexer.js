import AggregateIdentifier from '../../common/AggregateIdentifier';
import TmdbMovieIdentifier from './identifiers/TmdbMovieidentifier';
import FileExistsError from '../../errors/FileExistsError';
import { Movie } from '../../../models/movie';

export default class MovieIndexer {
    /**
     *
     * @param {owoblecto} owoblecto
     */
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        this.movieIdentifer = new AggregateIdentifier();

        this.movieIdentifer.loadIdentifier(new TmdbMovieIdentifier(this.owoblecto));

        // Register task availability to owoblecto queue
        this.owoblecto.queue.addJob('indexMovie', async (job) => await this.indexFile(job.path, job.doReIndex));
    }

    async indexFile(moviePath) {
        let file = await this.owoblecto.fileIndexer.indexVideoFile(moviePath);

        let movieIdentification = await this.movieIdentifer.identify(moviePath);

        let [movie, movieCreated] = await Movie.findOrCreate(
            {
                where: {
                    tmdbid: movieIdentification.tmdbid
                },
                defaults: movieIdentification
            });

        movie.addFile(file);

        if (!movieCreated) return;

        this.owoblecto.queue.queueJob('updateMovie', movie);
        this.owoblecto.queue.queueJob('downloadMovieFanart', movie);
        this.owoblecto.queue.pushJob('downloadMoviePoster', movie);
    }
}
