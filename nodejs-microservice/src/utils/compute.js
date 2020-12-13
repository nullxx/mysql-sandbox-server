const short = require('short-uuid');

function getRandomInt(min, max) {
  const nMin = Math.ceil(min);
  const nmax = Math.floor(max);
  return Math.floor(Math.random() * (nmax - nMin + 1)) + nMin;
}
function generateShort() {
  return short().new();
}
module.exports.getRandomInt = getRandomInt;
module.exports.generateShort = generateShort;
