declare var elasticsearch;
declare var UIkit;
import {bindable} from 'aurelia-framework';

export class Navbar {
  esURL = 'http://localhost:9200';
   @bindable client = "null";
  async connectToES() {

    var client = elasticsearch.Client({
      host: this.esURL
    });
    // var res = await client.cat.indices({ format: "json" });
    // console.info(res);
   this.client=client;
  }
}