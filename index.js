const moviePlaceholder = 'https://critics.io/img/movies/poster-placeholder.png';

const autoCompleteConfig = {
  renderOption({ Poster, Title, Year }) {
    const imgSrc = Poster === 'N/A' ? moviePlaceholder : Poster;
    return `
    <img src="${imgSrc}" />
    <h3>${Title} <b>${Year}<b></h3>
    `;
  },
  inputValue({ Title }) {
    return Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: '{Your Api Key Here}',
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary', 'right'));
  },
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  let i = movie.imdbID;

  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'b52d741b',
      i,
    },
  });

  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-danger');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-danger');
    }
  });
};

const movieTemplate = (movieDetails) => {
  let {
    Poster,
    Title,
    Genre,
    Plot,
    Awards,
    BoxOffice,
    Metascore,
    imdbRating,
    imdbVotes,
  } = movieDetails;

  // const dollars = parseInt(BoxOffice.replace(/\$/g, '').replace(/\,/g, ''));
  const score = parseInt(Metascore);
  const rating = parseFloat(imdbRating);
  const votes = parseInt(imdbVotes.replace(/\,/g, ''));

  const awards = Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    }
    return prev + value;
  }, 0);

  const hasProperty = (property) => {
    if (property === 'N/A') {
      return `None`;
    } else {
      return property;
    }
  };

  const hasPoster = (poster) => {
    if (poster === 'N/A') {
      return moviePlaceholder;
    } else {
      return poster;
    }
  };

  return `
  <article class="media">
  <figure class = "media-left">
  <p class="image">
  <img src="${hasPoster(Poster)}" />
  </p>
  </figure>

  <div class="media-content>
  <div class="content">
  <h1>${Title}</h1>
  <h4>${Genre}</h4>
  <p>${Plot}</p>
  </div>
  </div>
  </article>

  <article data-value=${awards} class="notification is-primary">
  <p class="title">${hasProperty(Awards)}</p>
  <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-primary">
  <p class="title">${hasProperty(BoxOffice)}</p>
  <p class="subtitle">Box Office</p>
  </article>
   <article data-value=${score} class="notification is-primary">
  <p class="title">${hasProperty(Metascore)}</p>
  <p class="subtitle">Meta Score</p>
  </article>
   <article data-value=${rating} class="notification is-primary">
  <p class="title">${hasProperty(imdbRating)}</p>
  <p class="subtitle">Imdb Rating</p>
  </article>
     <article data-value=${votes} class="notification is-primary">
  <p class="title">${hasProperty(imdbVotes)}</p>
  <p class="subtitle">Imdb Votes</p>
  </article>
  `;
};
