
/**
 * represents a session, handles 
 */
var Session = function(options) {
  options = options || {};

  // after how many seconds does a session time out?
  this.timeout = options.timeout || 3600;

  // seconds before session expiration when a warning should be displayed
  this.warning = options.warning || 60;

  // modal pop up for the warning
  this.warningModal = options.warningModal || '#popup-warning';

  // modal pop up when the session has expired
  this.expiredModal = options.expiredModal || '#popup-expired';

  // array of ids (or any jQuery selector) that should be updated with the current ticker value
  this.tickerContainer = options.tickerContainer || ['#expire-seconds'];

  // function to run once the warning time was reached
  this.warningCallback = options.warningCallback || function() {}

  // function to run once the session has expired
  this.expiredCallback = options.expiredCallback || function() {}

  // stores current timeout in here
  this.currentTimeout;

  // stores the ticker interval in here
  this.ticker;


  // start a new session
  this.start = function() {
    this.currentTimeout = this.timeout;
    this.updateTickers();

    thisSession = this;
    this.ticker = setInterval(function(){thisSession.tick()}, 1000);
  }

  this.updateTickers = function() {
    for (var i = 0, len = this.tickerContainer.length; i < len; i++) {
      $('' + this.tickerContainer[i]).html(this.currentTimeout);
    }
  }

  this.tick = function() {
    this.currentTimeout--;

    this.updateTickers();

    // session is about to expire
    if (this.currentTimeout == this.warning) {
      this.warningCallback();
      if (this.warningModal) {
        $(this.warningModal).modal('show');
      }
    }

    // session has expired
    if (this.currentTimeout == 0) {
      clearInterval(this.ticker);

      // hide warning popup if it exists
      if (this.warningModal) {
        $(this.warningModal).modal('hide');
      }
      if (this.expiredModal) {
        $(this.expiredModal).modal('show');
      }
      this.expiredCallback();
    }
  }

  this.stop = function() {
    clearInterval(this.ticker);
  }

  this.restart = function() {
    this.stop();
    if (this.warningModal) {
      $(this.warningModal).modal('hide');
    }
    if (this.expiredModal) {
      $(this.expiredModal).modal('hide');
    }
    this.start();
  }
  
}