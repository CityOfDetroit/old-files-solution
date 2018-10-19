'use strict';
const moment = require('moment');
export default class Panel {
  constructor(version) {
    this.version = version;
    this.indexLvl = 0;
    this.index = 0;
    this.indexes = [];
  }

  creatPanel(data, controller){
    console.log(data);
    let markup = controller.panel.createMarkup(data, controller);
    console.log(markup);
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
        if(value.doc[key].includes('http://') || value.doc[key].includes('https://')){
          tempHTML = `<a href="${value.doc[key]}" target="_blank">${key}</a>`;
        }else{
          tempHTML = `<a href="${baseURL}${value.doc[key]}" target="_blank">${key}</a>`;
        }
      }
    }
    return tempHTML;
  }
  getIndexID(lvl, controller){
    let tempID = '';
    for (let index = 0; index < lvl+1; index++) {
      tempID += controller.panel.indexes[index];
      (index < lvl) ? tempID += '-' : 0;
    }
    return tempID;
  }
  buildChildren(mainValue, basePath, lvl, controller){
    let tempIndexLvl = lvl;
    let tempHTML = '';
    if(Array.isArray(mainValue)){
      tempHTML = `
      <div id="c-${controller.panel.getIndexID(lvl, controller)}" class="collapse" aria-labelledby="h-${controller.panel.getIndexID(lvl, controller)}">
        <div class="card-body">
          <ul>
            ${mainValue.map(doc => `
              <li>${controller.panel.getFileLink({doc}, basePath)}</li>
            `).join('')}
          </ul>
        </div>
      </div>
      `;
    }else {
      tempHTML = `
      <div id="c-${controller.panel.indexes[lvl]}" class="collapse" aria-labelledby="h-${controller.panel.indexes[lvl]}">
        <div class="card-body">`;
      tempIndexLvl++;
      controller.panel.indexes.push(0);
      Object.entries(mainValue).forEach(([key, value]) => {
        tempHTML += `
        <div class="card">
          <div class="card-header" id="h-${controller.panel.getIndexID(tempIndexLvl, controller)}">
            <h5 class="mb-0">
              <button class="btn btn-link" data-toggle="collapse" data-target="#c-${controller.panel.getIndexID(tempIndexLvl, controller)}" aria-expanded="true" aria-controls="c-${controller.panel.getIndexID(tempIndexLvl, controller)}">
                ${key}
              </button>
            </h5>
          </div>

          ${controller.panel.buildChildren(value, basePath, tempIndexLvl, controller)}
        </div>
        `;
        controller.panel.indexes[tempIndexLvl]++;
      });
      tempHTML += `
        </div>
      </div>
      `;
    }
    return tempHTML;
  }
  createMarkup(values, controller){
    console.log(values);
    let tempHTML = '';
    let params = controller.panel.version.split('--');
    console.log(params);
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
               ${controller.panel.getStatus(location.status)}
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
        switch (params[1]) {
          case 'v01':
            let tempIndexLvl = 0;
            controller.panel.indexes.push(0);
            Object.entries(values.reports).forEach(([key, value]) => {
              tempHTML += `
              <div class="card">
                <div class="card-header" id="h-${controller.panel.indexes[tempIndexLvl]}">
                  <h5 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#c-${controller.panel.indexes[tempIndexLvl]}" aria-expanded="true" aria-controls="c-${controller.panel.indexes[tempIndexLvl]}">
                      ${key}
                    </button>
                  </h5>
                </div>
                ${controller.panel.buildChildren(value, values.base_path, tempIndexLvl, controller)}
              </div>
              `;
              controller.panel.indexes[tempIndexLvl]++;
            });
            break;
          default:

        }
        break;
      default:
        console.log('no valid format found');
    }
    console.log(tempHTML);
    return tempHTML;
  }

  buildStructure(data){
    console.log(data);
    let structData = [];
    data.map(doc => {
      if(doc.section != null){
        console.log(doc.section);
        console.log(Object.keys(structData).includes(doc.section));
        if(Object.keys(structData).includes(doc.section)){
          if(doc.sub_section != null){
            if(Object.keys(structData[doc.section]).includes(doc.sub_section)){
              structData[doc.section][doc.sub_section].push(doc);
            }else{
              structData[doc.section][doc.sub_section] = [doc];
            }
          }else{
            structData[doc.section].push(doc);
          }
        }else{
          if(doc.sub_section != null){
            structData[doc.section][doc.sub_section] = [doc];
          }else{
            structData[doc.section] = [doc];
          }
        }
      }else{
        structData['root'] = [doc];
      }
    });
    console.log(structData);
    return structData;
  }
}
