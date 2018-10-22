'use strict';
const moment = require('moment');
export default class Panel {
  constructor(version) {
    this.version = version;
    this.indexLvl = 0;
    this.index = 0;
    this.indexes = [];
  }

  creatPanel(data, controller) {
    // console.log(data);
    let markup = this.createMarkup(data, controller);
    // console.log(markup);
    document.querySelector('#archive-display').innerHTML = markup;
  }

  getStatus(value) {
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

  getFileLink(value, baseURL) {
    let tempHTML = null;
    for (var key in value.doc) {
      if (value.doc.hasOwnProperty(key)) {
        if(value.doc[key].includes('http://') || value.doc[key].includes('https://')) {
          tempHTML = `<a href="${value.doc[key]}" target="_blank">${key}</a>`;
        }else{
          tempHTML = `<a href="${baseURL}${value.doc[key]}" target="_blank">${key}</a>`;
        }
      }
    }
    return tempHTML;
  }

  buildHeaders(value, lvl){
    let tempHTML = '';
    let tempLvl = lvl + 1;
    this.indexes[tempLvl] = 0;
    Object.entries(value).forEach(([key, data]) => {
      tempHTML +=`
      <div class="card">
        <div class="card-header" id="h-${tempLvl}-${this.indexes[tempLvl]}">
          <h5 class="mb-0">
            <button class="btn btn-link" data-toggle="collapse" data-target="#c-${tempLvl}-${this.indexes[tempLvl]}" aria-expanded="true" aria-controls="c-${tempLvl}-${this.indexes[tempLvl]}">
              ${key}
            </button>
          </h5>
        </div>

        ${this.buildChildren(data,tempLvl)}
      </div>
      `;
      this.indexes[tempLvl]++;
    });

    return tempHTML;
  }

  buildChildren(mainValue, lvl) {
    let tempHTML = `
    <div id="c-${lvl}-${this.indexes[lvl]}" class="collapse" aria-labelledby="h-${lvl}-${this.indexes[lvl]}">
      <div class="card-body">
        ${mainValue.docs.length ? `
        <ul>
          ${mainValue.docs.map(doc => `
            <li><a href="${doc.url}" target="_blank">${doc.report_title}</a></li>
          `).join('')}
        </ul>
        ` : ''}
        ${Object.keys(mainValue.sections).length ? `
        ${this.buildHeaders(mainValue.sections, lvl)}
        ` : ''}
      </div>
    </div>`;

    return tempHTML;
  }

  createMarkup(values, controller) {
    // console.log(values);
    let tempHTML = '';
    let params = this.version.split('--');
    // console.log(params);
    switch (params[0]) {
      case 'table':
        switch (params[1]) {
          case 'v01':
            tempHTML = `
            <section class="archives-row header">
              <article class="flex-size">School/Day Care</article>
              <article class="fixed-size">Analysis Completed</article>
              <article class="fixed-size">Max Lead Result</article>
              <article class="fixed-size">Fix Plan</article>
            </section>
            ${values.map(location =>
              `<section class="archives-row">
               <article class="mobile-header">School</article>
               <article class="flex-size">${location.school_name}</article>
               <article class="mobile-header">Analysis Completed</article>
               <article class="fixed-size"><a href="${location.url}" target="_blank">Report</a></article>
               <article class="mobile-header">Max Lead Result</article>
               <article class="fixed-size">
               ${this.getStatus(location.status)}
               </article>
               <article class="mobile-header">Fix Plan</article>
               <article class="fixed-size">
               ${location.fix_plan_url ? `<a href="${location.fix_plan_url}" target="_blank">${location.fix_plan_status}</a>` : ''}
               </article>
              </section>`
            ).join('')}
            `;
            break;
          default:

        }
        break;
      case 'archive':
        let data = this.buildStructure(values);
        // console.log(data);
        switch (params[1]) {
          case 'v01':
            let tempIndexLvl = 0;
            this.indexes.push(0);
            Object.entries(data).forEach(([key, value]) => {
              tempHTML += `
              <div class="card">
                <div class="card-header" id="h-${tempIndexLvl}-${this.indexes[tempIndexLvl]}">
                  <h5 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#c-${tempIndexLvl}-${this.indexes[tempIndexLvl]}" aria-expanded="true" aria-controls="c-${tempIndexLvl}-${this.indexes[tempIndexLvl]}">
                      ${key}
                    </button>
                  </h5>
                </div>
                ${this.buildChildren(value, tempIndexLvl)}
              </div>
              `;
              this.indexes[tempIndexLvl]++;
            });
            break;
          default:

        }
        break;
      default:
        console.log('no valid format found');
    }
    // console.log(tempHTML);
    return tempHTML;
  }

  buildStructure(data) {
    let structData = {};

    data.forEach(item => {
      if(item.section != undefined) {
        if(!Object.keys(structData).includes(item.section)) {
          // console.log('new section');
          structData[item.section] = {sections: {}, docs: []};
        }else{
          // console.log('section already exist');
        }
      }
      if(item.sub_section != undefined) {
        // console.log('found sub');
        if(!Object.keys(structData[item.section].sections).includes(item.sub_section)) {
          // console.log('new sub section');
          structData[item.section].sections[item.sub_section] = {sections: {}, docs: []};
          structData[item.section].sections[item.sub_section].docs.push(item);
        }else{
          structData[item.section].sections[item.sub_section].docs.push(item);
        }
      }else{
        structData[item.section].docs.push(item);
      }
    });
    
    return structData;
  }
}
