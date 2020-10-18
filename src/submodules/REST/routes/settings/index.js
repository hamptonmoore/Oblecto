import maintenance from './maintenance';
import sources from './sources';
import misc from './misc';

export default (server, owoblecto) => {
    maintenance(server, owoblecto);
    sources(server, owoblecto);
    misc(server, owoblecto);
};
