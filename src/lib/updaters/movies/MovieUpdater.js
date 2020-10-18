import AggregateUpdateRetriever from '../../common/AggregateUpdateRetriever';
import TmdbMovieRetriever from './informationRetrievers/TmdbMovieRetriever';

export default class MovieUpdater {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        this.aggregateMovieUpdateRetriever = new AggregateUpdateRetriever();
        this.aggregateMovieUpdateRetriever.loadRetriever(new TmdbMovieRetriever(this.owoblecto));

        // Register task availability to owoblecto queue
        this.owoblecto.queue.addJob('updateMovie', async (job) => {
            await this.updateMovie(job);
        });
    }

    /**
     *
     * @param {Movie} movie
     * @returns {Promise<void>}
     */
    async updateMovie(movie) {
        let data = await this.aggregateMovieUpdateRetriever.retrieveInformation(movie);
        await movie.update(data);
    }
}
