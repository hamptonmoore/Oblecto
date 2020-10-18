import DebugExtendableError from '../../../errors/DebugExtendableError';
import axiosTimeout from '../../../../submodules/axiosTimeout';

export default class FanarttvSeriesArtworkRetriever {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;
    }

    async retrieveSeriesPoster(series) {
        if (!series.tvdbid) throw new DebugExtendableError(`Fanart.tv Series poster retriever failed for ${series.seriesName}`);

        let {data} = await axiosTimeout({
            method: 'get',
            url: `http://webservice.fanart.tv/v3/tv/${series.tvdbid}?api_key=${this.owoblecto.config['fanart.tv'].key}`
        });

        return data.tvposter[0].url;
    }
}
