'use strict';
import Panel from './panel.class.js';
import "isomorphic-fetch";
export default class Controller {
  constructor(version, source) {
    this.source = source;
    this.panel = new Panel(version);
    this.initialLoad(this);
  }
  initialLoad(controller){
    fetch(controller.source)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      controller.panel.creatPanel(data.features, controller);
    });
  }
}
