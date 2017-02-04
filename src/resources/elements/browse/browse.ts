import { bindable } from 'aurelia-framework';
import { ESFactory as esF } from '../../services/esFactory'
declare var UIkit;
export class Browse {
  @bindable client;
  @bindable indexes;
  @bindable esURL;
  data: any[];

  dataHeader: string[];
  factory: esF;
  constructor() {
    this.factory = new esF();
  }
  title = 'Welcome to browse'
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
    this.indexes = await this.factory.getIndexData(this.esURL);
    UIkit.notification("Completed", { status: 'primary' })
  }
  async getData(indexName: string) {
    var result = await this.factory.getData(this.esURL, indexName);
    this.data = result.data;
    this.dataHeader = result.dataHeader;
  }

}

