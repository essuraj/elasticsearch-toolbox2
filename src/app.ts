declare var elasticsearch;
declare var UIkit;
import { ESFactory as esF } from './resources/services/esFactory'
export class App {
  esurl = 'http://localhost:9200';
  heading = 'elastic5earch toolbox';
  public client: Elasticsearch.Client;
  indexes: any[];
  factory: esF;
  constructor() {
    this.factory = new esF();
  }
  async connectToES() {
    this.indexes = await this.factory.getIndexData(this.esurl);
    UIkit.notification("Connecting and getting indexes", { status: 'primary', pos: 'top-right' })
  }


}

