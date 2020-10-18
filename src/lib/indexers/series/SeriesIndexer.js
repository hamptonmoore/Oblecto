import AggregateIdentifier from '../../common/AggregateIdentifier';

import TmdbSeriesIdentifier from './identifiers/TmdbSeriesIdentifier';
import TmdbEpisodeIdentifier from './identifiers/TmdbEpisodeIdentifier';

import FileExistsError from '../../errors/FileExistsError';

import { Series } from '../../../models/series';
import { Episode } from '../../../models/episode';

export default class SeriesIndexer {
    /**
     *
     * @param {owoblecto} owoblecto
     */
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        this.seriesIdentifier = new AggregateIdentifier();
        this.episodeIdentifer = new AggregateIdentifier();

        //this.seriesIdentifier.loadIdentifier(new TvdbSeriesIdentifier());
        this.seriesIdentifier.loadIdentifier(new TmdbSeriesIdentifier(this.owoblecto));

        //this.episodeIdentifer.loadIdentifier(new TvdbEpisodeIdentifier());
        this.episodeIdentifer.loadIdentifier(new TmdbEpisodeIdentifier(this.owoblecto));

        // Register task availability to owoblecto queue
        this.owoblecto.queue.addJob('indexEpisode', async (job) => await this.indexFile(job.path));
    }

    async indexFile(episodePath) {
        let file = await this.owoblecto.fileIndexer.indexVideoFile(episodePath);

        let seriesIdentification = await this.seriesIdentifier.identify(episodePath);
        let episodeIdentification = await this.episodeIdentifer.identify(episodePath, seriesIdentification);

        let seriesQuery = {};
        let episodeQuery = {};

        if (seriesIdentification.tvdbid) seriesQuery['tvdbid'] = seriesIdentification.tvdbid;
        if (seriesIdentification.tmdbid) seriesQuery['tmdbid'] = seriesIdentification.tmdbid;

        delete seriesIdentification.tvdbid;
        delete seriesIdentification.tmdbid;

        if (episodeIdentification.tvdbid) episodeQuery['tvdbid'] = episodeIdentification.tvdbid;
        if (episodeIdentification.tmdbid) episodeQuery['tmdbid'] = episodeIdentification.tmdbid;

        delete episodeIdentification.tvdbid;
        delete episodeIdentification.tmdbid;

        let [series, seriesCreated] = await Series.findOrCreate(
            {
                where: seriesQuery,
                defaults: seriesIdentification
            });

        let [episode, episodeCreated] = await Episode.findOrCreate(
            {
                where: {
                    ...episodeQuery,
                    airedSeason: episodeIdentification.airedSeason || 1,
                    airedEpisodeNumber: episodeIdentification.airedEpisodeNumber,

                    SeriesId: series.id
                },
                defaults: episodeIdentification,
            });

        await episode.addFile(file);

        if (episodeCreated) {
            this.owoblecto.queue.pushJob('updateEpisode', episode);
            this.owoblecto.queue.pushJob('downloadEpisodeBanner', episode);
        }

        if (seriesCreated) {
            this.owoblecto.queue.pushJob('updateSeries', series);
            this.owoblecto.queue.pushJob('downloadSeriesPoster', series);
        }
    }

}
