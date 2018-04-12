'use strict';
const moment = require('moment');
export default class Panel {
  constructor(version) {
    this.version = version;
  }

  creatPanel(data, controller){
    let markup = controller.panel.createMarkup(data.data, controller);
    document.querySelector('#archive-display').innerHTML = markup;
  }
  getStatus(value){
    switch (value) {
      case 'Acceptable':
        return `<span class="green-text">${value}</span>`;
        break;

      case 'Pending':
        return `<span class="yellow-text">${value}</span>`;
        break;

      case 'Elevated':
        return `<span class="red-text">${value}</span>`;
        break;
      default:

    }
  }
  createMarkup(values, controller){
    console.log(values);
    let tempHTML = '';
    let params = controller.panel.version.split('--');
    switch (params[0]) {
      case 'table':
        switch (params[1]) {
          case 'v01':
            tempHTML = `
            <section class="archives-row header">
              <article class="flex-size">DPS School</article>
              <article class="fixed-size">Analysis Completed</article>
              <article class="fixed-size">Max Lead Result</article>
              <article class="fixed-size">Fix Plan</article>
            </section>
            ${values.locations.map(location =>
              `<section class="archives-row">
               <article class="mobile-header">DPS School</article>
               <article class="flex-size">${location.name}</article>
               <article class="mobile-header">Analysis Completed</article>
               <article class="fixed-size"><a href="${values.base_url}${location.report_path}" target="_blank">Report</a></article>
               <article class="mobile-header">Max Lead Result</article>
               <article class="fixed-size">
               ${controller.panel.getStatus(location.status)}
               </article>
               <article class="mobile-header">Fix Plan</article>
               <article class="fixed-size">
               ${location.fix_plan_path != '' ? `<a href="${values.base_url}${location.fix_plan_path}" target="_blank">${location.fix_plan_status}</a>` : ''}
               </article>
              </section>`
            ).join('')}
            `;
            break;
          default:

        }
        break;
      default:
        console.log('no valid format found');
    }
    return tempHTML;
  }
}
