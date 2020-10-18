export default class TmdbSeriesRetriever {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;
    }

    /**
     *
     * @param {Series} series
     * @returns {Promise<{overview: *, siteRating: *, seriesName: *, firstAired: *, popularity: *, siteRatingCount: *, status: *}>}
     */
    async retrieveInformation(series) {
        let seriesInfo = await this.owoblecto.tmdb.tvInfo({ id: series.tmdbid });

        let data = {
            seriesName: seriesInfo.name,
            //alias:  seriesInfo.
            //genre:  seriesInfo.genres.map((item) => return item.)
            status: seriesInfo.status,
            firstAired: seriesInfo.first_air_date,
            //network:
            //runtime: seriesInfo.
            overview: seriesInfo.overview,
            //airsDayOfWeek:
            //airsTime:
            //rating:
            popularity: seriesInfo.popularity,
            siteRating: seriesInfo.vote_average,
            siteRatingCount: seriesInfo.vote_count
        };

        let externalIds = {};

        if (!(series.tvdbid && series.imdbid)) {
            externalIds = await this.owoblecto.tmdb.tvExternalIds({id: series.tmdbid});
        }

        if (!series.tvdbid) {
            data.tvdbid = externalIds.tvdb_id;
        }

        if (!series.imdbid) {
            data.imdbid = externalIds.imdb_id;
        }

        return data;

    }
}
