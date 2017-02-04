declare var elasticsearch;
declare var UIkit;
export class App {
  url: String; esURL = 'http://localhost:9200';
  heading = 'elastic5earch toolbox';
  public client: Elasticsearch.Client;
  indexes: any[];
  data: any[];
  dataHeader: string[];
  async connectToES() {
    this.client = elasticsearch.Client({
      host: this.url
    });
    await this.getIndexData();
    UIkit.notification("Connecting and getting indexes", { status: 'primary' })
  }
  async getIndexData() {
    var indexes = await this.client.cat.indices({ format: "json" });
    console.info(indexes);

    var res = await this.client.indices.getMapping({});

    var op = indexes.map(x => {
      let index = x;
      index.mappings = Object.keys(res[x.index].mappings);
      return index;
    })
    console.info(op);

    this.indexes = op;
  }

  async createIndex(indexName, noOfShards, noOfReplicas) {
    var res = await this.client.indices.create({
      index: indexName, body: {
        settings: {
          "number_of_shards": noOfShards,
          "number_of_replicas": noOfReplicas
        }
      }

    });
    console.info(res);
    await this.getIndexData();
    UIkit.notification("Completed", { status: 'primary' })
  }
  async getData(indexName: string) {
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
      this.data = this.dataHeader = [];
      return;
    }
    this.data = res.hits.hits.map(x => {
      let op: any = x._source;
      op._type = x._type
      return op
    });
    this.dataHeader = Object.keys(this.data[0]);
  }
}

