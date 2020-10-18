import auth from './auth';
import episodes from './episodes';
import files from './files';
import movies from './movies';
import tvshows from './tvshows';
import settings from './settings';
import users from './users';
import web from './web';
import sets from './sets';
import clients from './clients';

import config from '../../../config';


export default (server, owoblecto) => {
    if (config.web.enabled) {
        web(server, owoblecto);
    }

    auth(server, owoblecto);
    episodes(server, owoblecto);
    files(server, owoblecto);
    movies(server, owoblecto);
    tvshows(server, owoblecto);
    settings(server, owoblecto);
    users(server, owoblecto);
    sets(server, owoblecto);
    clients(server, owoblecto);
};
