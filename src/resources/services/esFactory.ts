declare var elasticsearch;
declare var UIkit;
export class ESFactory {
    public client: Elasticsearch.Client;

    async connectToESWithURL(url: string) {
        this.client = elasticsearch.Client({
            host: url
        });
        return this.client;
    }

    async createIndex(url: string, indexName: string, noOfShards: number, noOfReplicas: number) {
        await this.connectToESWithURL(url);
        return await this.client.indices.create({
            index: indexName, body: {
                settings: {
                    "number_of_shards": noOfShards,
                    "number_of_replicas": noOfReplicas
                }
            }

        });
    }
    async getIndexData(url: string) {
        try {
            await this.connectToESWithURL(url);
            var indexes = await this.client.cat.indices({ format: "json" });
            var res = await this.client.indices.getMapping({});
            var indexWithMappings = indexes.map(x => {
                if (res[x.index])
                    x.mappings = Object.keys(res[x.index].mappings);
                return x;
            })
            console.info(indexWithMappings);

            return indexWithMappings;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getData(url: string, indexName: string | string[], types: string | string[] = undefined) {
        try {
            await this.connectToESWithURL(url);
            let query = {
                index: indexName,
                body: {
                    query: {
                        match_all: {
                        }
                    }
                }
            } as any;
            if (types !== undefined) {
                query.type = types;
            }
            var res = await this.client.search(query);
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
        } catch (error) {
            console.error(error);
        }
    }


}

