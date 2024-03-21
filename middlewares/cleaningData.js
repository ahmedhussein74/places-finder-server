const { removeDiacritics } = require("./replaceChars");

const cleanData = async (data) => {
  let newData = data.map((str) => removeDiacritics(str));
  newData = Array.from(new Set(newData));
  newData.sort();
  return newData;
};

module.exports = { cleanData };
