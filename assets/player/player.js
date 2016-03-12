window.onload = function() {
  var myMedia = document.createElement('audio');
  $('#player').append(myMedia);
  myMedia.id = "myMedia";
  playAudio('../sound/setting', 0);
  
  $("#volume").slider({
    min: 0,
    max: 100,
    value: 0,
  	range: "min",
  	animate: true,
    slide: function(event, ui) {
      setVolume((ui.value) / 100);
    }
  });
  
  function playAudio(fileName, myVolume) {
    var mediaExt = (myMedia.canPlayType('audio/mp3')) ? '.mp3' 
    	: (myMedia.canPlayType('audio/ogg')) ? '.ogg' 
    	: '';
    if (mediaExt) {
      myMedia.src = fileName + mediaExt;
      myMedia.setAttribute('loop', 'loop');
      setVolume(myVolume);
      myMedia.play();
    }
  }
  
  function setVolume(myVolume) {
      var myMedia = document.getElementById('myMedia');
      myMedia.volume = myVolume;
  }
    
    
  $('div').on('click', function() {
      $(this).toggleClass('show-description');
  });
  
  $('#volume-label').click(function(e) {
    // $('#player').toggleClass('hidden');
    $('#player').animate({width:'toggle'},350);
  });
}

