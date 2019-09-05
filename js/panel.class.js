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
    switch (true) {
      case value == 'Acceptable':
        return `<span class="green-text">${value}</span>`;
        break;

      case value == 'Pending':
        return `<span class="yellow-text">${value}</span>`;
        break;

      case value == 'Elevated':
        return `<span class="red-text">${value}</span>`;
        break;
      
      case value != null:
          return `<a href="https://detroitmi.gov${value}" target="_blank"><span class="green-text"><i class="far fa-check-square"></i></span></a>`;
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
    let tempLvl = lvl;
    this.indexes[tempLvl]++;
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

            case 'v02':
              console.log(values.features);
              tempHTML = `
              <section class="archives-row header">
                <article class="fixed-size">Certificate of Compliance</article>
                <article class="flex-size">School</article>
                <article class="fixed-size">Type</article>
                <article class="fixed-size">Safety Insp.</article>
                <article class="fixed-size">Safety Re-Insp.</article>
                <article class="fixed-size">Health Insp.</article>
                <article class="fixed-size">Health Re-Insp.</article>
              </section>
              ${values.features.map(location =>
                `<section class="archives-row">
                  <article class="mobile-header">Certificate of Compliance</article>
                  <article class="fixed-size">
                  ${this.getStatus(location.attributes.Certificate_of_Compliance)}
                  </article>
                 <article class="mobile-header">School</article>
                 <article class="flex-size">${location.attributes.School_Name}</article>
                 <article class="mobile-header">Type</article>
                 <article class="fixed-size">${location.attributes.School_Type}</article>
                 <article class="mobile-header">Safety Insp.</article>
                 ${location.attributes.Safety_Inspection_Report ? `<article class="fixed-size"><a href="https://detroitmi.gov${location.attributes.Safety_Inspection_Report}" target="_blank">${location.attributes.Safety_Inspection_Date}</a></article>` : `<article class="fixed-size"></article>`}
                 <article class="mobile-header">Safety Re-Insp.</article>
                 ${location.attributes.Safety_Re_Inspection_Report ? `<article class="fixed-size"><a href="https://detroitmi.gov${location.attributes.Safety_Re_Inspection_Report}" target="_blank">${location.attributes.Safety_Re_Inspection_Date}</a></article>` : `<article class="fixed-size"></article>`}
                 <article class="mobile-header">Health Insp.</article>
                 ${location.attributes.Health_Inspection_Report ? `<article class="fixed-size"><a href="https://detroitmi.gov${location.attributes.Health_Inspection_Report}" target="_blank">${location.attributes.Health_Inspection_Date}</a></article>` : `<article class="fixed-size"></article>`}
                 <article class="mobile-header">Health Re-Insp.</article>
                 ${location.attributes.Health_Re_Inspection_Report ? `<article class="fixed-size"><a href="https://detroitmi.gov${location.attributes.Health_Re_Inspection_Report}" target="_blank">${location.attributes.Health_Re_Inspection_Date}</a></article>` : `<article class="fixed-size"></article>`}
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
    console.log(data);
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
