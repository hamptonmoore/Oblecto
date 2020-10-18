export default class ArtworkUtils {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;
    }

    episodeBannerPath(episode, size) {
        if (size && this.owoblecto.config.artwork.banner[size])
            return `${this.owoblecto.config.assets.episodeBannerLocation}/${size}/${episode.id}.jpg`;
        return `${this.owoblecto.config.assets.episodeBannerLocation}/original/${episode.id}.jpg`;
    }

    seriesPosterPath(series, size) {
        if (size && this.owoblecto.config.artwork.poster[size])
            return `${this.owoblecto.config.assets.showPosterLocation}/${size}/${series.id}.jpg`;
        return `${this.owoblecto.config.assets.showPosterLocation}/original/${series.id}.jpg`;
    }

    moviePosterPath(movie, size) {
        if (size && this.owoblecto.config.artwork.poster[size])
            return `${this.owoblecto.config.assets.moviePosterLocation}/${size}/${movie.id}.jpg`;
        return `${this.owoblecto.config.assets.moviePosterLocation}/original/${movie.id}.jpg`;
    }

    movieFanartPath(movie, size) {
        if (size && this.owoblecto.config.artwork.fanart[size])
            return `${this.owoblecto.config.assets.movieFanartLocation}/${size}/${movie.id}.jpg`;
        return `${this.owoblecto.config.assets.movieFanartLocation}/original/${movie.id}.jpg`;
    }
}
