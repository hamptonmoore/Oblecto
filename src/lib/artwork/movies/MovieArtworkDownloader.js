import Download from '../../downloader';
import TmdbMovieArtworkRetriever from './artworkRetrievers/TmdbMovieArtworkRetriever';
import FanarttvMovieArtworkRetriever from './artworkRetrievers/FanarttvMovieArtworkRetriever';
import AggregateMovieArtworkRetriever from './AggregateMovieArtworkRetriever';

export default class MovieArtworkDownloader {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        this.movieArtworkRetriever = new AggregateMovieArtworkRetriever();
        this.movieArtworkRetriever.loadRetriever(new FanarttvMovieArtworkRetriever(this.owoblecto));
        this.movieArtworkRetriever.loadRetriever(new TmdbMovieArtworkRetriever(this.owoblecto));

        // Register task availability to owoblecto queue
        this.owoblecto.queue.addJob('downloadMoviePoster', async (job) => {
            await this.downloadMoviePoster(job);
        });

        this.owoblecto.queue.addJob('downloadMovieFanart', async (job) => {
            await this.downloadMovieFanart(job);
        });
    }

    async downloadMoviePoster(movie) {
        let url = await this.movieArtworkRetriever.retrievePoster(movie);

        await Download.download(
            url,
            this.owoblecto.artworkUtils.moviePosterPath(movie)
        );

        for (let size of Object.keys(this.owoblecto.config.artwork.poster)) {
            this.owoblecto.queue.pushJob('rescaleImage', {
                from: this.owoblecto.artworkUtils.moviePosterPath(movie),
                to: this.owoblecto.artworkUtils.moviePosterPath(movie, size),
                width: this.owoblecto.config.artwork.poster[size]
            });
        }
    }

    async downloadMovieFanart(movie) {
        let url = await this.movieArtworkRetriever.retrieveFanart(movie);

        await Download.download(
            url,
            this.owoblecto.artworkUtils.movieFanartPath(movie)
        );

        for (let size of Object.keys(this.owoblecto.config.artwork.fanart)) {
            this.owoblecto.queue.pushJob('rescaleImage', {
                from: this.owoblecto.artworkUtils.movieFanartPath(movie),
                to: this.owoblecto.artworkUtils.movieFanartPath(movie, size),
                width: this.owoblecto.config.artwork.fanart[size]
            });
        }
    }

}
