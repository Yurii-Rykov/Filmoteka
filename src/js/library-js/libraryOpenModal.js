import libraryGetRefs from './libraryGetRefs.js';
import { MovieAPI } from '../movieAPI.js';
import { renderModalMarkup } from '../renderModalMarkup';
import Notiflix, { Notify } from 'notiflix';

const movieAPI = new MovieAPI();
let watchedMoviesArr = [];
const LOCAL_STORAGE_WATCHED = 'WATCHED';
let queueMoviesArr = [];
const LOCAL_STORAGE_QUEUE = 'QUEUE';

libraryGetRefs().containerListRef.addEventListener(
  'click',
  onFilmCardClickHandle
);

function onFilmCardClickHandle(evt) {
  let id = evt.target.closest('.film-card__item').dataset.id;
  if (evt.target === evt.currentTarget) {
    return;
  }
  libraryGetRefs().modal.classList.remove('is-hidden');
  document.addEventListener('keydown', onEscapeCloseHandle);
  libraryGetRefs().modalContainer.addEventListener(
    'click',
    onModalContainerClickHandle
  );
  movieAPI
    .getFilms(id)
    .then(result => {
      console.log(result);
      const markup = renderModalMarkup(result);

      libraryGetRefs().modalFilm.innerHTML = markup;

      onAddButtonsFunctinal(result);
    })
    // Adding functioning for buttons

    .catch(error => console.log(error));
}

libraryGetRefs().modalCloseBtnRef.addEventListener(
  'click',
  onModalCloseBtnHandle
);

function onModalCloseBtnHandle() {
  libraryGetRefs().modal.classList.add('is-hidden');
  document.removeEventListener('keydown', onEscapeCloseHandle);
  libraryGetRefs().modalContainer.removeEventListener(
    'click',
    onModalContainerClickHandle
  );
}

function onModalContainerClickHandle(evt) {
  if (evt.target === evt.currentTarget) {
    onModalCloseBtnHandle();
  }
}
function onEscapeCloseHandle(evt) {
  if (evt.key === 'Escape') {
    onModalCloseBtnHandle();
  }
}
function onAddButtonsFunctinal(result) {
  currentResult = result;
  const addToWatchedBtnRef = document.querySelector('.js-btn-watched');
  addToWatchedBtnRef.addEventListener('click', onAddToWatchedHandle);
  if (localStorage.getItem(LOCAL_STORAGE_WATCHED) !== null) {
    watchedMoviesArr = [
      ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_WATCHED)),
    ];
  }
  console.log(watchedMoviesArr.some(({ id }) => id === result.id));
  if (watchedMoviesArr.some(({ id }) => id === result.id)) {
    console.log('Check');

    addToWatchedBtnRef.textContent = 'Remove from watched';
  }
  // --------------цей код додано мною
  if (localStorage.getItem(LOCAL_STORAGE_QUEUE) !== null) {
    queueMoviesArr = [...JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUEUE))];
  }
  const addToQueueBtnRef = document.querySelector('.js-btn-queue');
  addToQueueBtnRef.addEventListener('click', onAddToQueueHandle);
  if (queueMoviesArr.some(({ id }) => id === result.id)) {
    console.log('Check');

    addToQueueBtnRef.textContent = 'Remove from queue';
  }
}
// -----------------------------------------------------------------

const onAddToWatchedHandle = evt => {
  let filmObject = currentResult;
  // let id = filmObject.id;
  const addToWatchedBtnRef = document.querySelector('.js-btn-watched');
  if (localStorage.getItem(LOCAL_STORAGE_WATCHED) !== null) {
    watchedMoviesArr = [
      ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_WATCHED)),
    ];
  }
  // check for unique value(id)

  console.log(filmObject);
  if (watchedMoviesArr.lenght === 0) {
    watchedMoviesArr.push(filmObject);
    Notify.success('Film add to watched');
    addToWatchedBtnRef.textContent = 'Remove from watched';
  } else if (!watchedMoviesArr.some(({ id }) => id === filmObject.id)) {
    watchedMoviesArr.push(filmObject);
    Notify.success('Film add to watched');
    addToWatchedBtnRef.textContent = 'Remove from watched';
  } else {
    watchedMoviesArr = watchedMoviesArr.filter(
      film => Number(film) !== filmObject.id
    );
    Notify.warning('Film Remove from watched');
    let index = watchedMoviesArr.findIndex(({ id }) => id === filmObject.id);
    watchedMoviesArr.splice(index, 1);
    addToWatchedBtnRef.textContent = 'Add to watched';
  }

  try {
    const serializedState = JSON.stringify(watchedMoviesArr);
    localStorage.setItem(LOCAL_STORAGE_WATCHED, serializedState);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
};
// --------------onAddToQueueHandle
const onAddToQueueHandle = evt => {
  let filmObject = currentResult;
  const addToQueueBtnRef = document.querySelector('.js-btn-queue');
  if (localStorage.getItem(LOCAL_STORAGE_QUEUE) !== null) {
    queueMoviesArr = [...JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUEUE))];
  }
  // check for unique value(id)
  if (queueMoviesArr.lenght === 0) {
    queueMoviesArr.push(filmObject);
    Notify.success('Film added to queue');
    addToQueueBtnRef.textContent = 'Remove from queue';
  } else if (!queueMoviesArr.some(({ id }) => id === filmObject.id)) {
    queueMoviesArr.push(filmObject);
    Notify.success('Film added to queue');
    addToQueueBtnRef.textContent = 'Remove from queue';
  } else {
    queueMoviesArr = queueMoviesArr.filter(
      film => Number(film) !== filmObject.id
    );
    Notify.warning('Film Removed from queue');
    let index = queueMoviesArr.findIndex(({ id }) => id === filmObject.id);
    console.log(index);
    queueMoviesArr.splice(index, 1);
    addToQueueBtnRef.textContent = 'Add to queue';
  }
  try {
    const serializedState = JSON.stringify(queueMoviesArr);
    localStorage.setItem(LOCAL_STORAGE_QUEUE, serializedState);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
};
