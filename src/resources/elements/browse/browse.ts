import { bindable } from 'aurelia-framework';
import { ESFactory as esF } from '../../services/esFactory'
// declare var UIkit;
declare var UIkit, Prism;
export class Browse {
  @bindable client;
  @bindable indexes;
  @bindable esURL;
  data: any[];
  show: string;
  dataHeader: string[];
  types: string[];
  factory: esF;
  query = {
    from: 0,
    size: 20,
    indexName: undefined,
    types: undefined
  }
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
  async setData(indexName:string,types:string|string[]){
        this.query.from = 0;
    this.query.size = 0;
 this.query.indexName = indexName;
    if (!types)
       this.query.types = this.indexes.filter(x => x.index === indexName)[0].mappings;
    this.query.types = types;
    await this.getData()
  }
  async getData() {
   
    console.warn(this.types);
    var result = await this.factory.getData(this.esURL, this.query.indexName, this.query.types, this.query.from, this.query.size);
    this.data = result.data;
    this.dataHeader = result.dataHeader;
  }
  async paginate(isNext: boolean) {

    if (isNext === true)
      this.query.size += 20;
    else
      this.query.size -= 20;
      if(this.query.size<0)
        this.query.size = 20;
    await this.getData()
  }
  viewDoc(item) {
    this.show = JSON.stringify(item, null, 4);
    // $('pre code').each(function(i, block) {
    // hljs.highlightBlock(block);
    // Prism.highlight(code, Prism.languages.javascript);
    // });
    var block = document.getElementById('previewCode')
    Prism.highlightElement(block);
  }

}

