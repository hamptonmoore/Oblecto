import errors from 'restify-errors';
import authMiddleWare from '../middleware/auth';
import {File} from '../../../models/file';
import DirectHttpStreamSession from '../../../lib/streamSessions/StreamSessionTypes/DirectHttpStreamSession';
import HLSStreamer from '../../../lib/streamSessions/StreamSessionTypes/HLSStreamer';

/**
 *
 * @param {Server} server
 * @param {owoblecto} owoblecto
 */
export default (server, owoblecto) => {
    server.get('/HLS/:sessionId/segment/:id', async function (req, res, next) {
        if (!owoblecto.streamSessionController.sessionExists(req.params.sessionId)) {
            return next(new errors.InvalidCredentialsError('Stream session token does not exist'));
        }

        let streamSession = owoblecto.streamSessionController.sessions[req.params.sessionId];

        // TODO: Send approriate error if session is not a HLS stream session
        if (!(streamSession instanceof HLSStreamer)) return next();

        let segmentId = parseInt(req.params.id);

        streamSession.streamSegment(req, res, segmentId);
    });

    server.get('/HLS/:sessionId/playlist', async function (req, res, next) {
        if (!owoblecto.streamSessionController.sessionExists(req.params.sessionId)) {
            return next(new errors.InvalidCredentialsError('Stream session token does not exist'));
        }

        let streamSession = owoblecto.streamSessionController.sessions[req.params.sessionId];

        // TODO: Send approriate error if session is not a HLS stream session
        if (!(streamSession instanceof HLSStreamer)) return next(new errors.InvalidContentError('Not a HLS stream'));

        streamSession.sendPlaylistFile(res);
    });


    server.get('/session/create/:id', authMiddleWare.requiresAuth, async function (req, res, next) {
        let file;

        try {
            file = await File.findByPk(req.params.id);
        } catch (ex) {
            return next(new errors.NotFoundError('File does not exist'));
        }

        if (!file) return next(new errors.NotFoundError('File does not exist'));

        let streamType = 'recode';

        if (req.params.type in ['recode', 'directhttp', 'hls'])
            streamType = req.params.type;

        if (req.params.noremux) streamType = 'directhttp';

        let streamSession = owoblecto.streamSessionController.newSession(file, {
            streamType,

            target: {
                formats: (req.params.format || 'mp4').split(','),
                videoCodecs: (req.params.videoCodec || 'h264').split(','),
                audioCodecs: (req.params.audioCodec || 'aac').split(',')
            },

            offset: req.params.offset || 0
        });

        res.send({
            sessionId: streamSession.sessionId,
            seeking: streamSession instanceof DirectHttpStreamSession ? 'client' : 'server'
        });
    });

    server.get('/session/stream/:sessionId', async function (req, res, next) {
        if (!owoblecto.streamSessionController.sessionExists(req.params.sessionId)) {
            return next(new errors.InvalidCredentialsError('Stream session token does not exist'));
        }

        return next();
    }, async function (req, res, next) {
        owoblecto.streamSessionController.sessions[req.params.sessionId].offset = req.params.offset || 0;

        await owoblecto.streamSessionController.sessions[req.params.sessionId].addDestination({
            request: req,
            stream: res,

            type: 'http'
        });

        if (req.params.nostart) return;

        await owoblecto.streamSessionController.sessions[req.params.sessionId].startStream();
    });
};
