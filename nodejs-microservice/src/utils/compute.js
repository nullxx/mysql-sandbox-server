function getRandomInt(min, max) {
  const nMin = Math.ceil(min);
  const nmax = Math.floor(max);
  return Math.floor(Math.random() * (nmax - nMin + 1)) + nMin;
}

module.exports.getRandomInt = getRandomInt;
