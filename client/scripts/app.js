
//Grab username
var uzerString = window.location.search;
var uzerArr = uzerString.split("=");
var uzer = uzerArr[1];

var app = {

  init : function(){

    $(document).ready(function() {

      //fetches new messages
      app.fetch('https://api.parse.com/1/classes/chatterbox')

      //friends
      // $(".friend").on('click', app.addFriend(this.username));

      //button click events
      $(".submit").on("click", function(){
        app.send($("form").serializeArray()[0]["value"]);
        $('form').find("input[type=text], textarea").val("");
      });

      $(".new").on("click", function(){
        app.fetch('https://api.parse.com/1/classes/chatterbox');
        app.clearMessages();
      });

      $(".clean").on("click", function(){
        app.clearMessages();
      });

    })



  },

  send : function(text, room){

    //create message object
    var obj = {
      username: uzer,
      text: text,
      roomname: room
    };

    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(obj),
      contentType: 'application/json',

      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch : function(url){

    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // console.log(data)

        var arr = data['results'];
        //loop through results array
        for (var i = 0; i < 50; i ++){
          //stringify key
          var key = i + '';
          //add messages
          app.addMessage(arr[i]);

        };
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

  addMessage : function(obj){


    var $message = $("<div class='message'></div>");
    $message.text(obj["username"] + ": " + obj['text'])

    $("#chats").append($message);


  },

  clearMessages : function(){
    $("#chats").empty();
  },

  addRoom : function(roomName){
    $("#roomSelect").append("<div class='room'>" + roomName + "</div>");
  },

  addFriend : function(username){
    console.log("test");
    // $('#chats').append("<a class='friend'>" + username + "</a>")
  }


};

app.init();




