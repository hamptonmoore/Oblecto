import {promises as fs} from 'fs';

import {Episode} from '../../../models/episode';
import {Series} from '../../../models/series';

export default class SeriesArtworkCollector {
    /**
     *
     * @param {owoblecto} owoblecto
     */
    constructor(owoblecto) {
        this.owoblecto = owoblecto;
    }

    /**
     *
     * @param {Episode} episode - Episode for which to download the episode banner for
     * @returns {Promise<void>}
     */
    async collectArtworkEpisodeBanner(episode) {
        let stat;

        try {
            stat = await fs.stat(this.owoblecto.artworkUtils.episodeBannerPath(episode));
        } catch (e) {}

        if (stat) return;

        this.owoblecto.queue.queueJob('downloadEpisodeBanner', episode);
    }

    /**
     *
     * @param {Series} series - Series for which to download the series poster for
     * @returns {Promise<void>}
     */
    async collectArtworkSeriesPoster(series) {
        let stat;

        try {
            stat = await fs.stat(this.owoblecto.artworkUtils.seriesPosterPath(series));
        } catch (e) {}

        if (stat) return;

        this.owoblecto.queue.queueJob('downloadSeriesPoster', series);
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async collectAllEpisodeBanners() {
        let episodes = await Episode.findAll();

        for (let episode of episodes) {
            this.collectArtworkEpisodeBanner(episode);
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async collectAllSeriesPosters() {
        let allSeries = await Series.findAll();

        for (let series of allSeries) {
            this.collectArtworkSeriesPoster(series);
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async collectAll() {
        await this.collectAllEpisodeBanners();
        await this.collectAllSeriesPosters();
    }
}
