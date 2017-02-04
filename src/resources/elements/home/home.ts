import { bindable } from 'aurelia-framework';

export class Home {
  @bindable client;
  @bindable indexes;
  @bindable esURL;
  title = 'Welcome. Your connected..'

}

