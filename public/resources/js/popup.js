var uniqueID = 0;

var Popup = function(options) {
  options = options || {};

  // the jQuery pop-up element will be stored in here
  this.element;

  this.id      = options.id || false;
  this.title   = options.title || '';
  this.content = options.content || '';

  // is this pop-up a form? Then the wrapper element will be form element instead of a div.
  this.isForm  = (options.isForm === true ? true : false);

  // can this pop-up be closed by the user?
  this.closable = (options.closable === false ? false : true);

  // an array of buttons - if any
  this.buttons = options.buttons || [];

  // container in the DOM where the pop-up should be added to
  this.container = options.container || 'body';


  // the size of the pop-up
  this.size = options.size || false;
  if (this.size !== false) {

    // only allow values lg (large) or sm (small)
    if (this.size != 'lg' && this.size != 'sm') {
      this.size = false;
    }
  }


  // set an default id if not set
  if (this.id === false) {
    uniqueID++;
    this.id = 'uid-' + uniqueID;
  }


  // return the pop-up as HTML code
  this.html = function() {

    var modalHeader = '';

    if (this.closable) {
      modalHeader += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
    }

    if (this.title.length > 0) {
      modalHeader += '<h4 class="modal-title">' + this.title + '</h4>';
    }

    var modalFooter = '';

    if (this.buttons.length > 0) {
      for (var i = 0, len = this.buttons.length; i < len; i++) {
        modalFooter += '<button class="btn btn-' + this.buttons[i].type + '"' + (this.buttons[i].id ? ' id="' + this.buttons[i].id + '"' : '') + (this.buttons[i].click ? ' onclick="' + this.buttons[i].click + '"' : '') + '>' + (this.buttons[i].glyph ? '<i class="glyphicon glyphicon-' + this.buttons[i].glyph + '"></i>' : '') + this.buttons[i].label + '</button>';
      };
    }

    var html = 
      '<' + (this.isForm ? 'form' : 'div') + ' class="modal fade"' + (this.id ? ' id="' + this.id + '"' : '') + ' tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="' + (this.closable ? 'true' : 'false') + '">' + 
        '<div class="modal-dialog' + (this.size !== false ? 'modal-' + this.size : '') + '">' +
          '<div class="modal-content">' +
            (modalHeader.length > 0 ? '<div class="modal-header">' + modalHeader + '</div>' : '') +
            '<div class="modal-body">' + this.content + '</div>' +
            (modalFooter.length > 0 ? '<div class="modal-footer">' + modalFooter + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</' + (this.isForm ? 'form' : 'div') + '>';

    return html;
  }

  // add the pop-up to the DOM
  this.add = function() {
    $(this.container).append(this.html());
    this.element = $('#' + this.id);
  }

  // show the pop-up
  this.show = function() {
    this.element.modal('show');
  }

  // hide the pop-up
  this.hide = function() {
    this.element.modal('hide');
  }

  // toggle visibility of the pop-up
  this.toggle = function() {
    this.element.modal('toggle');
  }
}