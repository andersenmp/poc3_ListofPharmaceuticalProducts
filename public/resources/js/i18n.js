/**
 * This file is used for internationalization
 */

function getString(labelName) {
  if (typeof eeas_lang[labelName] === "undefined") {
    return '??? '+labelName+' ???';
  } else {
    return eeas_lang[labelName];
  }
};