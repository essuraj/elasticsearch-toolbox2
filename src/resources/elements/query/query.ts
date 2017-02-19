import { bindable } from 'aurelia-framework';
declare var CodeMirror;
export class Query {

  @bindable indexes;
  @bindable esURL;
  title = 'Welcome. Your query'

  attached() {
    var editor = CodeMirror.fromTextArea(document.getElementById("my-code-wrapper"), {
      lineNumbers: true
    });
  }

}

