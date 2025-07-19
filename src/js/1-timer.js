import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const timer = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');

let userSelectedDate = null;
let countdownInterval = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate < new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
        progressBar: false,
        closeOnEscape: true,
        closeOnClick: true,
      });
      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

flatpickr(timer, options);

startButton.addEventListener('click', () => {
  if (countdownInterval) {
    //Çalışıyorsa yeniden başlatmayı engeller
    clearInterval(countdownInterval);
  }

  startButton.disabled = true;
  timer.disabled = true; // Disable the date picker to prevent changes during countdown

  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = userSelectedDate - currentTime;
    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      iziToast.success({
        message: 'Times up!',
        position: 'topRight',
        progressBar: false,
        closeOnEscape: true,
        closeOnClick: true,
      });
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      timer.disabled = false; // Re-enable the date picker
      startButton.disabled = true; // Disable the start button again
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    updateTimerDisplay({ days, hours, minutes, seconds });
  }, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  document.querySelector('span[data-days]').textContent = addLeadingZero(days);
  document.querySelector('span[data-hours]').textContent =
    addLeadingZero(hours);
  document.querySelector('span[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('span[data-seconds]').textContent =
    addLeadingZero(seconds);
}
