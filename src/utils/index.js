"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
const convertToObjectIdMongoodb = (id) => new Types.ObjectId(id);
const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};
// ['a', 'b', 'c'] => {a: 1, b: 1, c: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
// ['a', 'b', 'c'] => {a: 0, b: 0, c: 0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
const removeUndefinedObject = (obj) => {
  const result = {};

  Object.keys(obj).forEach((k) => {
    const current = obj[k];

    if ([null, undefined].includes(current)) return;
    if (Array.isArray(current)) return;

    if (typeof current === "object") {
      result[k] = removeUndefinedObject(current);
      return;
    }

    result[k] = current;
  });

  return result;
};
const updateNestedObjectParser = (obj, prefix = "") => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (obj[key] === null || obj[key] === undefined) {
      console.log(`ingore key`, key);
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      Object.assign(result, updateNestedObjectParser(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  });
  console.log(`newKey`, result);
  return result;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongoodb,
};
