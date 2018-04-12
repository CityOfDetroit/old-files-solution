'use strict';
import Controller from './controller.class.js';
(function(){
  try {
    let format = document.querySelector('input[name="archive-format"]').value;
    let source = document.querySelector('input[name="archive-source"]').value;
    let controller = new Controller(format,source);
  } catch (e) {
    console.log('no archive to display');
  }
})(window);
