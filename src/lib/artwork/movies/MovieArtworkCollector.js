import {promises as fs} from 'fs';
import {Movie} from '../../../models/movie';

export default class MovieArtworkCollector {
    /**
     *
     * @param {owoblecto} owoblecto
     */
    constructor(owoblecto) {
        this.owoblecto = owoblecto;
    }

    /**
     *
     * @param movie - Movie for which to download fanart for
     * @returns {Promise<void>}
     */
    async collectArtworkMovieFanart(movie) {
        let stat;

        try {
            stat = await fs.stat(this.owoblecto.artworkUtils.movieFanartPath(movie));
        } catch (e) {}

        if (stat) return;

        this.owoblecto.queue.queueJob('downloadMovieFanart', movie);
    }

    /**
     *
     * @param movie - Movie for which to download poster for
     * @returns {Promise<void>}
     */
    async collectArtworkMoviePoster(movie) {
        let stat;

        try {
            stat = await fs.stat(this.owoblecto.artworkUtils.moviePosterPath(movie));
        } catch (e) {}

        if (stat) return;

        this.owoblecto.queue.queueJob('downloadMoviePoster', movie);
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async collectAllMovieFanart() {
        let movies = await Movie.findAll();

        for (let movie of movies) {
            this.collectArtworkMovieFanart(movie);
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async collectAllMoviePosters() {
        let movies = await Movie.findAll();

        for (let movie of movies) {
            this.collectArtworkMoviePoster(movie);
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async collectAll() {
        await this.collectAllMovieFanart();
        await this.collectAllMoviePosters();
    }
}
