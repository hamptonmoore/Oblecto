import jwt from 'jsonwebtoken';
import events from 'events';
import {TrackEpisode} from '../../models/trackEpisode';
import {TrackMovie} from '../../models/trackMovie';
import logger from '../../submodules/logger';

export default class RealtimeClient extends events.EventEmitter {
    /**
     * @param {owoblecto} owoblecto
     * @param {*} socket
     */
    constructor(owoblecto, socket) {
        super();

        this.clientName = 'default';

        this.owoblecto = owoblecto;
        this.socket = socket;
        this.user = null;

        this.storage = {
            series: {},
            movie: {}
        };

        this.socket.on('authenticate', (data) => this.authenticationHandler(data));
        this.socket.on('playing', (data) => this.playingHandler(data));
        this.socket.on('disconnect', () => this.disconnectHandler());

        setInterval(() => {
            this.saveAllTracks();
        }, 10000);
    }

    authenticationHandler(data) {
        try {
            this.user = jwt.verify(data.token, this.owoblecto.config.authentication.secret);
        } catch (e) {
            logger.log('WARN', 'An unauthorized user attempted connection to realtime server');
            logger.log('WARN', 'Disconnecting client...');

            this.socket.disconnect();
        }
    }

    playingHandler(data) {
        if (this.user == null) return;
        if (data.type === 'tv') return this.playingEpisodeHandler(data);
        if (data.type === 'movie') return this.playingMovieHandler(data);
    }

    playingEpisodeHandler(data) {
        this.storage.series[data.episodeId] = data;
    }

    playingMovieHandler(data) {
        this.storage.movie[data.movieId] = data;
    }

    disconnectHandler() {
        this.emit('disconnect');
    }

    async saveEpisodeTrack(id) {
        if (this.user === null) return;

        let [item, created] = await TrackEpisode.findOrCreate({
            where: {
                UserId: this.user.id,
                EpisodeId: id
            },
            defaults: {
                time: this.storage.series[id].time,
                progress: this.storage.series[id].progress
            }
        });

        if (created) return;

        await item.update({
            time: this.storage.series[id].time,
            progress: this.storage.series[id].progress
        });

        delete this.storage.series[id];
    }

    async saveMovieTrack(id) {
        if (this.user == null) return;

        let [item, created] = await TrackMovie.findOrCreate({
            where: {
                UserId: this.user.id,
                MovieId: id
            },
            defaults: {
                time: this.storage.movie[id].time,
                progress: this.storage.movie[id].progress
            }
        });

        if (created) return;

        await item.update({
            time: this.storage.movie[id].time,
            progress: this.storage.movie[id].progress
        });

        delete this.storage.movie[id];
    }

    async saveAllTracks() {
        for (let i in this.storage.series) {
            await this.saveEpisodeTrack(i);
        }

        for (let i in this.storage.movie) {
            await this.saveMovieTrack(i);
        }
    }

    async playEpisode(episodeId) {
        this.socket.emit('play', {
            episodeId
        });
    }

    async playMovie(movieId) {
        this.socket.emit('play', {
            movieId
        });
    }
}
