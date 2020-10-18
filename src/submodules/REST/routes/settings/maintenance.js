import authMiddleWare from '../../middleware/auth';

/**
 *
 * @param server
 * @param {owoblecto} owoblecto
 */
export default (server, owoblecto) => {
    // API Endpoint to request a re-index of certain library types
    server.get('/settings/maintenance/index/:libraries', authMiddleWare.requiresAuth, function (req, res) {
        switch (req.params.libraries) {
            case 'series':
                owoblecto.seriesCollector.collectAll();
                break;
            case 'movies':
                owoblecto.movieCollector.collectAll();
                break;
            case 'all':
                owoblecto.seriesCollector.collectAll();
                owoblecto.movieCollector.collectAll();
                break;
        }

        res.send([true]);
    });

    // API Endpoint to request a re-index of certain library types
    server.get('/settings/maintenance/series/download/art', authMiddleWare.requiresAuth, function (req, res) {
        owoblecto.seriesArtworkCollector.collectAll();
        res.send([true]);
    });


    server.get('/settings/maintenance/movies/download/art', authMiddleWare.requiresAuth, function (req, res) {
        owoblecto.movieArtworkCollector.collectAll();
        res.send([true]);
    });

    server.get('/settings/maintenance/update/series', authMiddleWare.requiresAuth, function (req, res) {
        owoblecto.seriesUpdateCollector.collectAllSeries();
        res.send([true]);
    });

    server.get('/settings/maintenance/update/episodes', authMiddleWare.requiresAuth, function (req, res) {
        owoblecto.seriesUpdateCollector.collectAllEpisodes();
        res.send([true]);
    });

    server.get('/settings/maintenance/update/movies', authMiddleWare.requiresAuth, function (req, res) {
        owoblecto.movieUpdateCollector.collectAllMovies();
        res.send([true]);
    });

    server.get('/settings/maintenance/update/files', authMiddleWare.requiresAuth, function (req, res) {
        owoblecto.fileUpdateCollector.collectAllFiles();
        res.send([true]);
    });

    server.get('/settings/maintenance/clean/:type', authMiddleWare.requiresAuth, function (req, res) {
        switch  (req.params.type) {
            case 'files':
                owoblecto.fileCleaner.removeAssoclessFiles();
                owoblecto.fileCleaner.removedDeletedFiled();
                break;
            case 'movies':
                owoblecto.movieCleaner.removeFileLessMovies();
                break;
            case 'series':
                owoblecto.seriesCleaner.removeEpisodeslessShows();
                owoblecto.seriesCleaner.removePathLessShows();
                break;
            case 'episodes':
                owoblecto.seriesCleaner.removeFileLessEpisodes();
                break;
        }

        res.send([true]);
    });

};
