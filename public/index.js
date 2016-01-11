
  //
  // socket.io code
  //
  var socket = io.connect();

  socket.on('connect', function () {
    $('#chat').addClass('connected');
  });

  socket.on('announcement', function (msg) {
    $('#lines').append($('<p>').append($('<em>').text(msg)));
  });

  socket.on('nicknames', function (nicknames) {
    $('#nicknames').empty().append($('<span>Online: </span>'));
    for (var i in nicknames) {
      $('#nicknames').append($('<b>').text(nicknames[i]));
    }
  });

  socket.on('user message', message);
  socket.on('user image', image);
  socket.on('reconnect', function () {
    $('#lines').remove();
    message('System', 'Reconnected to the server');
  });

  socket.on('reconnecting', function () {
    message('System', 'Attempting to re-connect to the server');
  });

  socket.on('error', function (e) {
    message('System', e ? e : 'A unknown error occurred');
  });

  function message (from, msg) {
    $('#lines').append($('<p>').append($('<b>').text(from +" : "), msg));
	$('#lines').get(0).scrollTop = 10000000;
  }

  function image (from, base64Image) {
    $('#lines').append($('<p>').append($('<b>').text(from +" : "), '<img src="' + base64Image + '" width="250">'));
	$('#lines').get(0).scrollTop = 10000000;
  }

  //
  // dom manipulation code
  //
  $(function () {
    $('#set-nickname').submit(function (ev) {
      socket.emit('nickname', $('#nick').val(), function (set) {
        if (!set) {
          clear();
          return $('#chat').addClass('nickname-set');
        }
        $('#nickname-err').css('visibility', 'visible');
      });
      return false;
    });

    $('#send-message').submit(function () {
	if($('#message').val()==""){
		return false;
	}
	else{
      message('me', $('#message').val());
      socket.emit('user message', $('#message').val());
      clear();
     // $('#lines').get(0).scrollTop = 10000000;
      return false;
	}
    });

    function clear () {
      $('#message').val('').focus();
    };

    $('#imagefile').bind('change', function(e){
      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        image('me', evt.target.result);
        socket.emit('user image', evt.target.result);
      };
      reader.readAsDataURL(data);
      // $('#lines').get(0).scrollTop = 10000000;
    });
	
	$(".imageLibraryWrap ul li img").click(function(){
		image('me', $(this).attr("src"));
        socket.emit('user image', $(this).attr("src"));
		TweenMax.to($(".imageLibraryWrap"), 0.6, {bottom:"-300", ease: Back. easeOut});
		$('#lines').get(0).scrollTop = 10000000;
	});
  });
  
//jquery script
$(function(){
	$(".openLibraryButton a").click(function(){
		//$(".imageLibraryWrap").show();
		TweenMax.to($(".imageLibraryWrap"), 0.6, {bottom:0, ease: Back. easeOut});
	});
	$(document).mouseup(function (e)
	{
	var container = $(".imageLibraryWrap");
	
	if (!container.is(e.target) // if the target of the click isn't the container...
		&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		TweenMax.to($(".imageLibraryWrap"), 0.6, {bottom:"-300", ease: Back. easeOut});
	}
	});
});  
  
