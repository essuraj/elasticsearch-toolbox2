declare var elasticsearch;
declare var UIkit;
export class ESFactory {
    esURL = 'http://localhost:9200';
    public client: Elasticsearch.Client;

    // async connectToES() {
    //     this.client = elasticsearch.Client({
    //         host: this.url
    //     });
    //     await this.getIndexData();
    // }
    async connectToESWithURL(url: string) {
        this.client = elasticsearch.Client({
            host: url
        });
        return this.client;
    }
    async getIndexData(url: string) {
        await this.connectToESWithURL(url);
        var indexes = await this.client.cat.indices({ format: "json" });
        console.info(indexes);

        var res = await this.client.indices.getMapping({});

        var op = indexes.map(x => {
            let index = x;
            if (res[x.index])
                index.mappings = Object.keys(res[x.index].mappings);
            return index;
        })
        console.info(op);

        return op;
    }
    async getData(url: string, indexName: string) {
        await this.connectToESWithURL(url);
        var res = await this.client.search({
            index: indexName,
            body: {
                query: {
                    match_all: {
                    }
                }
            }
        });
        console.log(res);
        if (res.hits.total === 0) {
            console.warn('no data');
            return { data: [], dataHeader: [] };
        }
        let data = res.hits.hits.map(x => {
            let op: any = x._source;
            op._type = x._type
            return op
        });
        let dataHeader = Object.keys(data[0]);
        return { data: data, dataHeader: dataHeader };
    }


}

