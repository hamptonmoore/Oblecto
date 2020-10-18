import DirectStreamSession from './StreamSessionTypes/DirectStreamSession';
import DirectHttpStreamSession from './StreamSessionTypes/DirectHttpStreamSession';
import RecodeStreamSession from './StreamSessionTypes/RecodeStreamSession';
import RecodeFederationStreamSession from './StreamSessionTypes/RecodeFederationStreamSession';
import logger from '../../submodules/logger';
import HLSStreamer from './StreamSessionTypes/HLSStreamer';

export default class StreamSessionController {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        this.sessions = {};
    }

    /**
     *
     * @param {File} file
     * @param options
     * @returns {StreamSession}
     */
    newSession(file, options) {
        const streamSession = this.createSession(file, options);

        this.sessions[streamSession.sessionId] = streamSession;

        streamSession.on('close', () => {
            logger.log('INFO', streamSession.sessionId, 'has ended');
            delete this.sessions[streamSession.sessionId];
        });

        return streamSession;
    }

    createSession(file, options) {
        if (file.host !== 'local') {
            return new RecodeFederationStreamSession(file, options, this.owoblecto);
        }

        if (options.streamType === 'hls') {
            return new HLSStreamer(file, options, this.owoblecto);
        }

        if (this.owoblecto.config.transcoding.transcodeEverything) {
            return new RecodeStreamSession(file, options, this.owoblecto);
        }

        if (options.streamType === 'direct') {
            return new DirectStreamSession(file, options, this.owoblecto);
        }

        if (options.streamType === 'directhttp') {
            return new DirectHttpStreamSession(file, options, this.owoblecto);
        }

        if (options.streamType === 'recode') {
            return new RecodeStreamSession(file, options, this.owoblecto);
        }
    }

    sessionExists(sessionId) {
        return this.sessions[sessionId] !== undefined;
    }

}
