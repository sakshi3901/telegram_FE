// -------------------Custom Logger-----------------
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];

  return `${day}-${month}-${year}, ${hours}:${minutes}, ${dayOfWeek}`;
}

class Logger {
  constructor() {
    this.logLevel = 'info'; // Default log level
  }

  setLogLevel(level) {
    this.logLevel = level;
  }

  log(message, level = 'info') {
    if (this.shouldLog(level)) {
      console.log(`[${formatDate(new Date())}] [${level.toUpperCase()}]: ${message}`);
    }
  }

  error(message) {
    this.log(message, 'error');
  }

  warn(message) {
    this.log(message, 'warn');
  }

  info(message) {
    this.log(message, 'info');
  }

  debug(message) {
    this.log(message, 'debug');
  }

  shouldLog(level) {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const requestedLevelIndex = levels.indexOf(level);
    return currentLevelIndex >= requestedLevelIndex;
  }
}

logger = new Logger();



//---------- Log Out
const td_logout = () => {
  localStorage.clear();
  var pastDate = new Date(0);
  document.cookie = "lt=; expires=" + pastDate.toUTCString() + "; path=/";

  window.location.href = "/"
}

// comman toast function
const toast_function = (state, message) => {
  if (state == 'success') {
    $('#toast-alert').removeClass().addClass('toast align-items-center bg-success text-success')
    $('#toast-alert-heading').removeClass().addClass('toast-header bg-success text-success')
    $('#Header_toast_message').html('<i class="fa-solid fa-circle-check"></i> Success')
  } else if (state == 'danger') {
    $('#toast-alert').removeClass().addClass('toast align-items-center bg-danger text-danger')
    $('#toast-alert-heading').removeClass().addClass('toast-header bg-danger text-danger')
    $('#Header_toast_message').html('<i class="fa-solid fa-circle-exclamation"></i> Warning')
  } else if (state == 'warning') {
    $('#toast-alert').removeClass().addClass('toast align-items-center bg-warning text-warning')
    $('#toast-alert-heading').removeClass().addClass('toast-header bg-warning text-warning')
    $('#Header_toast_message').html('<i class="fa-solid fa-triangle-exclamation"></i> Warning')
  }

  $('.toast-body_1').text(message)

  toastList.forEach(toast => toast.show());
  setTimeout(() => {
    toastList.forEach(toast => toast.hide());
  }, 2000);
}

$(document).ready(function () {

  logger.setLogLevel('info');

  message_timeout = 100

  root = "https://telebot.tradegini.com";
  main_route = "/whatsapp_auto_crud";
  bot_link = "http://t.me/tciuserinfo_bot"
  min_PhoneNo_length = 8
  max_PhoneNo_length = 10

  // -------- For Alerts
  const toastElList = document.querySelectorAll('#toast-alert')
  const toastoptions = {
    animation: true,
    delay: 5000 // This is just an example, you can adjust the delay as needed
  };
  toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, toastoptions))


  $('.wrapper_2 h5').click(() => {
    td_logout()
  })
});
