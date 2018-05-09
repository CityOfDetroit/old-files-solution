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
        return ``;
    }
  }
  getFileLink(value, baseURL){
    let tempHTML = null;
    for (var key in value.doc) {
      if (value.doc.hasOwnProperty(key)) {
        tempHTML = `<a href="${baseURL}/${value.doc[key]}" target="_blank">${key}</a>`
      }
    }
    return tempHTML;
  }
  createMarkup(values, controller){
    // console.log(values);
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
      case 'archive':
        switch (params[1]) {
          case 'v01':
            let index = 0;
            Object.entries(values.reports).forEach(([key, value]) => {tempHTML += `
            <div class="card">
              <div class="card-header" id="h-${index}">
                <h5 class="mb-0">
                  <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#c-${index}" aria-expanded="true" aria-controls="c-${index}">
                    ${key}
                  </button>
                </h5>
              </div>

              <div id="c-${index}" class="collapse" aria-labelledby="h-${index}">
                <div class="card-body">
                  <ul>
                    ${value.map(doc => `
                      <li>${controller.panel.getFileLink({doc}, values.base_url)}</li>
                    `).join('')}
                  </ul>
                </div>
              </div>
            </div>
            `;
            index++;
            });
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
