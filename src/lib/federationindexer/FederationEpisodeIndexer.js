import {Series} from '../../models/series';
import {Episode} from '../../models/episode';
import {File} from '../../models/file';

export default class FederationEpisodeIndexer {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        // Register task availability to owoblecto queue
        this.owoblecto.queue.addJob('federationIndexEpisode', async (job) => {
            await this.indexEpisode(job);
        });
    }

    async indexEpisode(file) {
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

        let [series, seriesInserted] = await Series.findOrCreate({
            where: {
                tvdbid: file.fileInfo.seriesTvdbid || null,
                tmdbid: file.fileInfo.seriesTmdbid || null
            }
        });

        let [episode, episodeInserted] = await Episode.findOrCreate({
            where: {
                tvdbid: file.fileInfo.tvdbid || null,
                tmdbid: file.fileInfo.tmdbid || null,
                SeriesId: series.id
            },
            defaults: {
                airedEpisodeNumber: file.fileInfo.episode,
                airedSeason: file.fileInfo.season
            }
        });

        await episode.addFile(fileEntity);

        if (!episodeInserted) return;
        await this.owoblecto.seriesUpdateCollector.collectEpisode(episode);
        await this.owoblecto.seriesArtworkCollector.collectArtworkEpisodeBanner(episode);

        if (!seriesInserted) return;
        await this.owoblecto.seriesUpdateCollector.collectSeries(series);
        await this.owoblecto.seriesArtworkCollector.collectArtworkSeriesPoster(series);

    }
}
