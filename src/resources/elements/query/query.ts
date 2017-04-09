import { bindable } from 'aurelia-framework';
import { ESFactory as esF } from '../../services/esFactory'
interface cm{
	getValue():string;
	setValue(data:string):any;
}
declare var CodeMirror: any;
export class Query {
	factory: esF;
	@bindable indexes;
	@bindable esURL;
	result = {};
	queryEditor: cm ;
	resultEditor: cm ;
	title = 'Welcome. Your query';
	selectedIndices = [];
	constructor() {
		this.factory = new esF();

	}
	attached() {
		this.queryEditor = CodeMirror(document.getElementById("my-code-wrapper"), {
			mode: "application/json",
			lineNumbers: true,
			matchBrackets: true,
			continueComments: "Enter",
			lineWrapping: true,
			extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
			lint: true

		});
		this.queryEditor.setValue(`{
  "query": {
    "bool": {
      "must": [
        {
          "match_all": {}
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 10,
  "sort": [],
  "aggs": {}
}`)
		this.resultEditor = CodeMirror(document.getElementById("result-wrapper"), {
			mode: "application/json",
			lineNumbers: true,
			matchBrackets: true,
			continueComments: "Enter",
			lineWrapping: true,
			extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
			lint: true

		});
	}
	async getQ() {

		console.log(this.selectedIndices)
		this.result = await this.factory.getResult(this.esURL, this.selectedIndices,undefined,this.queryEditor.getValue());
		this.resultEditor.setValue(JSON.stringify(this.result, null, 4));
	}

}

