import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

const createPromise = ({ delay, state}) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                resolve(delay);
            } else {
                reject(delay);
            }
        },  delay);
    });
};


form.addEventListener('submit', event => { 
    event.preventDefault();

    const inputDelay = form.elements.delay;
    const inputState = form.elements.state;

    const delay = Number(inputDelay.value);
    const state = inputState.value;

    createPromise({delay, state})
        .then(resultDelay => {
            iziToast.success({
              message: `✅ Fulfilled promise in ${resultDelay}ms`,
              position: 'topRight',
              transitionIn: 'fadeIn',
              transitionOut: 'fadeOut',
              progressBarColor: '#4caf50',
              backgroundColor: '#e8f5e9',
              icon: false,
              close: true,
              closeOnClick: true,
              closeOnEscape: true,
            });
        })
        .catch(errorDelay => {
            iziToast.error({
              message: `❌ Rejected promise in ${errorDelay}ms`,
              position: 'topRight',
              transitionIn: 'fadeIn',
              transitionOut: 'fadeOut',
              progressBarColor: '#f44336',
              backgroundColor: '#ffebee',
              icon: false,
              close: true,
              closeOnClick: true,
              closeOnEscape: true,
            });
        });
    form.reset();
});

