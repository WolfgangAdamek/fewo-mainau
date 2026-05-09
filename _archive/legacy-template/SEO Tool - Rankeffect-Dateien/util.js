/* GOOGLE ANALYTICS GOOGLE ANALYTICS GOOGLE ANALYTICS GOOGLE ANALYTICS GOOGLE ANALYTICS GOOGLE ANALYTICS */

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-6282468-18']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


/* TARGET BLANK TARGET BLANK TARGET BLANK TARGET BLANK TARGET BLANK TARGET BLANK TARGET BLANK */

 var targetBlank = {
  
    setListener: function() {
      var links = document.getElementsByTagName("a");
      for (var i = 0; i < links.length; i++) {    
        var rel = links[i].getAttribute("rel");
        if (rel=='external') {    
          var blank = document.createAttribute("target");
          blank.nodeValue = "_blank";
          links[i].setAttributeNode(blank);
        }  
      }
    },
  
    init: function() {
      this.setListener();
    },

    addEvent: function(obj, type, fn) {
      if (obj.addEventListener)
        obj.addEventListener(type, fn, false);
      else if (obj.attachEvent) {
        obj["e"+type+fn] = fn;
        obj[type+fn] = function() {obj["e"+type+fn]( window.event );}
        obj.attachEvent("on"+type, obj[type+fn]);
      }
    }    
  };


targetBlank.addEvent(window, 'load', function(){
  targetBlank.init();
});


/* NICE FORMS NICE FORMS NICE FORMS NICE FORMS NICE FORMS NICE FORMS NICE FORMS NICE FORMS NICE FORMS NICE FORMS NICE FORMS NICE FORMS */

function niceForms()

{

  this.main = function()

  {

    $('.formsection').each(function() {

      var label = $(this).children("label");

      var input = $(this).children("textarea");

      if (input.val() !== '') {

        var input = $(this).children("input");

      }

      label.click(function() {

         input.focus();

      });

      hideLabel(input, label);

      input.bind('keyup change click', function() {

        hideLabel(input, label);

      });

    });
  }


  function hideLabel(input, label)

  {

    if (input.val() !== '') {

      label.addClass('hidden');

     } else {

      label.removeClass('hidden');

     }

  }

}


$(document).ready(function() {

  var nF = new niceForms;

  nF.main();

});
