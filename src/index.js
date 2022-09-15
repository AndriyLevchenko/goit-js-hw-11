// Імпорти та константи

import './css/styles.css';
import { fetchPixabay } from './js/fetchPixabay.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// import articlecTpl from "./templates/articles.hbs";

// Пошук елементів

const searchForm = document.querySelector('.search-form');
const toGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// Слухачі подій

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

// Змінні

let searchQueryInput = '';
let page = 1;
let totalPages = null;

// Пошуковий запит

function onSearch (e) {
    e.preventDefault ();
    reserPage ();
    cleanerGallery ();
    searchQueryInput = e.currentTarget.elements.searchQuery.value.trim();
    if (searchQueryInput === '') {
        // loadMoreBtn.classList.add('is-hidden');
        return Notify.info('Please enter a more specific name.')
    }
    fetchPixabay(searchQueryInput, page)
    .then(r => {
        console.log(r.data)
        totalPages = Math.ceil(r.data.totalHits / 40);
        if (r.data.totalHits === 0) {
            loadMoreBtn.classList.add('is-hidden');
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        if (page === 1) {
            Notify.success(`Hooray! We found ${r.data.totalHits} images.`);
        }
        loadMoreBtn.classList.remove('is-hidden');
        if (totalPages <= 1) {
            loadMoreBtn.classList.add('is-hidden');
        }
        incrementPage ();
        
        return r.data.hits;
    })
    .then(getResponse)
    .catch(onFetchError)
    .finally(() => console.log('Make a second request'));
}

// Створення та рендер розмітки

function createGallery(hits) {
    const markup = hits.map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
        return `
        <a href="${largeImageURL}">
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                    <b>Likes</b><br>${likes}
                    </p>
                    <p class="info-item">
                    <b>Views</b><br>${views}
                    </p>
                    <p class="info-item">
                    <b>Comments</b><br>${comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads</b><br>${downloads}
                    </p>
                </div>
            </div>
        </a>`
    }).join('');
    toGallery.insertAdjacentHTML('beforeend', markup);
}
  
// Завантажити ще (ф-я)

function onLoadMore () {
    if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        Notify.info("We're sorry, but you've reached the end of search results.");
        
    }

    fetchPixabay(searchQueryInput, page)
    .then(r => {
        incrementPage();
        return r.data.hits;
    })
    .then(getResponse)
}

// Допоміжні ф-ї

function cleanerGallery () {
    toGallery.innerHTML = '';
}

function incrementPage () {
    page += 1;
}

function reserPage () {
    page = 1;
    totalPages = null;
}

function onFetchError (error) {
    Notify.failure('Oops, error!!!');
}

// Бібліотека SimpleLightbox

const gallery = new SimpleLightbox('.gallery a', {});

function getResponse(r) {
    createGallery(r);
  gallery.refresh();
}



