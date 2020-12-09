const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

// let config = {};

// const getPoster = Poster => {
//     if (Poster === 'N/A') {
//       return div.innerHTML = `
//     <img src="${moviePlaceholder}" />
//     <h1>${Title}</h1>
//     `;
//     } else {
//       return div.innerHTML = `
//     <img src="${Poster}" />
//     <h1>${Title}</h1>
//     `;
// }
