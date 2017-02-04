declare var elasticsearch;
declare var UIkit;
export class App {
  url: String; esURL = 'http://localhost:9200';
  heading = 'elastic5earch toolbox';
  public client: Elasticsearch.Client;
  indexes: any[];
  data: any[];
  mappings: string[];
  dataHeader: string[];
  async connectToES() {
    this.client = elasticsearch.Client({
      host: this.url
    });
    var indexes = await this.client.cat.indices({ format: "json" });
    console.info(indexes);
     var res = await this.client.indices.getMapping({});
 
    var op=indexes.map(x=> {
      let index=x;
      index.mappings= Object.keys(res[x.index].mappings);
      return index;
    })
       console.info(op);
    UIkit.notification("...", { status: 'primary' })
    this.indexes = op;
    UIkit.nav(document.getElementById("ind"), {});
  }
  async getMapping(indexName: string) {
    var res = await this.client.indices.getMapping({ index: indexName });
    console.info(res[indexName].mappings);

    this.mappings = Object.keys(res[indexName].mappings);
    this.getData(indexName);
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
    console.log(this.data);
    this.data = res.hits.hits.map(x => {
      let op:any = x._source;
      op._type = x._type
      return op
    });
    this.dataHeader = Object.keys(this.data[0]);
  }
}

