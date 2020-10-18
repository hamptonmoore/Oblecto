import AggregateSeriesArtworkRetriever from './AggregateSeriesArtworkRetriever';
import Download from '../../downloader';
import TmdbSeriesArtworkRetriever from './artworkRetrievers/TmdbSeriesArtworkRetriever';
import TvdbSeriesArtworkRetriever from './artworkRetrievers/TvdbSeriesArtworkRetriever';
import FanarttvSeriesArtworkRetriever from './artworkRetrievers/FanarttvSeriesArtworkRetriever';

export default class SeriesArtworkDownloader {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        this.seriesArtworkRetriever = new AggregateSeriesArtworkRetriever();
        this.seriesArtworkRetriever.loadRetriever(new TvdbSeriesArtworkRetriever(this.owoblecto));
        this.seriesArtworkRetriever.loadRetriever(new TmdbSeriesArtworkRetriever(this.owoblecto));
        this.seriesArtworkRetriever.loadRetriever(new FanarttvSeriesArtworkRetriever(this.owoblecto));

        // Register task availability to owoblecto queue
        this.owoblecto.queue.addJob('downloadEpisodeBanner', (episode) => this.downloadEpisodeBanner(episode));
        this.owoblecto.queue.addJob('downloadSeriesPoster', (series) => this.downloadSeriesPoster(series));
    }

    async downloadEpisodeBanner(episode) {
        let url = await this.seriesArtworkRetriever.retrieveEpisodeBanner(episode);

        await Download.download(
            url,
            this.owoblecto.artworkUtils.episodeBannerPath(episode)
        );

        for (let size of Object.keys(this.owoblecto.config.artwork.banner)) {
            this.owoblecto.queue.pushJob('rescaleImage', {
                from: this.owoblecto.artworkUtils.episodeBannerPath(episode),
                to: this.owoblecto.artworkUtils.episodeBannerPath(episode, size),
                width: this.owoblecto.config.artwork.banner[size]
            });
        }
    }

    async downloadSeriesPoster(series) {
        let url = await this.seriesArtworkRetriever.retrieveSeriesPoster(series);

        await Download.download(
            url,
            this.owoblecto.artworkUtils.seriesPosterPath(series)
        );

        for (let size of Object.keys(this.owoblecto.config.artwork.poster)) {
            this.owoblecto.queue.pushJob('rescaleImage', {
                from: this.owoblecto.artworkUtils.seriesPosterPath(series),
                to: this.owoblecto.artworkUtils.seriesPosterPath(series, size),
                width: this.owoblecto.config.artwork.poster[size]
            });
        }
    }

}
