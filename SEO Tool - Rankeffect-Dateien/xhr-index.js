

var GetCheckXhr = {

  loading: '<img src="gfx/ajax-spinner.png" alt="still loading" class="center" id="spin" />',
  refresh: '<img class="iconrefresh" src="gfx/refresh.png" alt="refresh" />',
  pdficon: '<img class="iconpdf" src="gfx/pdf-icon.png" alt="download PDF" />',
  pdfloader: '<img class="iconpdf2" src="gfx/ajax-loader-pdf.gif" alt="rendering" />',
  pdfdownload: '<img class="icondownload" src="gfx/pdf-download.png" alt="download" />',
  pdfdownloaderror: '<img class="iconerror" src="gfx/pdf-download-error.png" alt="error" />',
  url: null,
  keyword: null,
  txt: null,
  intro: null,
  result: null,
  submit: null,

  createPdf: function () {

    var that = this,
        makepdf = $('#createpdf'),
        select = $(".dynamic.perma a");
        
    var path = select.attr('href');  
    var size = 'standard';
  
    makepdf.click(function(e) {

      e.preventDefault();

      makepdf.html('<a href="#" target="_blank">WAIT</a>');

      $.ajax({
        type: "GET",
        url: "php/tools/createPdf.php",
        data: { url: path, size: size },
        error:function (xhr, ajaxOptions, thrownError){
          makepdf.html(that.pdfdownloaderror);
        },
        success: function(data){
          makepdf.off('click');
          makepdf.html('<a href="' + $.trim(data) + '" target="_blank">DOWNLOAD</a>');
        }
      });

    });

  },

  refreshsite: function () {

    var that = this,
        refreshbutton = $('#refresh');

    refreshbutton.click(function(e) {

      e.preventDefault();

      that.result.html(that.loading);
      that.result.append('<br /><h3 class="center">' + lang['WORKING'] + that.site +'</h3>');

      if ( that.ver === 'pro') {
        that.result.append(lang['DUR_60']);
      } else {
        that.result.append(lang['DUR_30']);
      }
      that.onPageRequest();
    });

  },

  reloadJs: function () {

    var externalLinks = $('a[rel="external"]');

    $.getScript("js/lightbox-content.js");

    externalLinks.each(function(i) {

      $(this).attr('target', '_blank');

    });

  },


  parseUrl: function () {

    var url = this.url.val();
    var res = url.split('/');

    if (res[1] == '') {
      this.site = res[2];
    } else {
      this.site = res[0];
    }

  },

  onPageRequest: function () {

    var that = this;

    $.ajax({
      type: "GET",
      url: "php/checker-onpage/controller.php",
      data: { url1: this.url.val(), keyword1: this.keyword.val(), lang: lang['V'], version: this.ver, bot: this.bot, username: this.username, password: this.password, screen: 'web'},
      error:function (xhr, ajaxOptions, thrownError){
        that.result.html(lang['ERROR']);
        that.result.append('<p>' +xhr.status+ '</p>');
        that.result.append('<p>' +thrownError+ '</p>');
       },
       success: function(data){
        that.result.show('fast');
        that.result.html($.trim(data));
        // NESTED CALL
        that.refreshsite();
        that.createPdf();
        that.reloadJs();
       }
     });

  },


  main: function() {

    this.url       = $("#url1");
    this.keyword   = $("#keyword1");
    this.errorinfo = $("#errorinfo");
    this.intro     = $(".intro");
    this.result    = $("#result");
    this.submit    = $("#check");
    this.ver       = $('input:hidden[name=version]').val();
    this.bot       = $('select[name=useragent]').val();
    this.username  = $("#username").val();
    this.password  = $("#password").val();

    this.parseUrl();

    if ( this.url === '' || this.url.val().indexOf(".") === -1 ) {

      this.errorinfo.html(lang['ENTER_URL']);
      this.submit.effect("shake", { times:4 }, 70);

    } else {

      this.errorinfo.html('');
      this.intro.hide('fast');
      this.result.show('fast');
      this.result.html(this.loading);
      this.result.append('<br /><h3 class="center">' + lang['WORKING'] + this.site +'</h3>');

      if (this.ver === 'pro') {
        this.result.append(lang['DUR_60']);
      } else {
        this.result.append(lang['DUR_30']);
      }

      this.onPageRequest();

    }

  }

};


$(document).ready(function() {

  $('#target').submit(function() {
    GetCheckXhr.main();
    return false;
  });


  $('#toggle').click( function () {
    $('#togglearea').toggle();
    $('#toggle').hide();
  });

});
