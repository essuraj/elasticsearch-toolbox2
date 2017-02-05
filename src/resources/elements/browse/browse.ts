import { bindable } from 'aurelia-framework';
import { ESFactory as esF } from '../../services/esFactory'
declare var UIkit;
export class Browse {
  @bindable client;
  @bindable indexes;
  @bindable esURL;
  data: any[];

  dataHeader: string[];
  types: string[];
  factory: esF;
  constructor() {
    this.factory = new esF();
  }
  title = 'Welcome to browse'
  async createIndex(indexName, noOfShards, noOfReplicas) {
    var res = await this.factory.createIndex(this.esURL, indexName, noOfShards, noOfReplicas);
    console.info(res);
    this.indexes = await this.factory.getIndexData(this.esURL);
    UIkit.notification("Completed", { status: 'primary' })
  }
  async getData(indexName: string, types: string[]) {
    if (!types)
      this.types = this.indexes.filter(x => x.index === indexName)[0].mappings;
    console.warn(this.types);
    var result = await this.factory.getData(this.esURL, indexName, types);
    this.data = result.data;
    this.dataHeader = result.dataHeader;
  }

}
