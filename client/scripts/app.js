
//Grab username
var uzerString = window.location.search;
var uzerArr = uzerString.split("=");
var uzer = uzerArr[1];



var app = {

  //friend storage
  friendStorage: {},

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
        app.clearRooms();
      });

      $(".clean").on("click", function(){
        app.clearMessages();
        app.clearRooms();
        app.clearFriends();
      });

    })


      // app.addFriend(this);


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
        console.log(data)

        var storage = {};
        var arr = data['results'];

        //loop through results array
        for (var i = 0; i < 50; i ++){

          //stringify key
          var key = i + '';

          //check if a friend exists
          if ((arr[key]["username"]) in app.friendStorage) {
            //change color to blue
            console.log(arr[key]["username"]);
            $()
          }
          //add messages
          app.addMessage(arr[key]);

          //-----------------------

          // console.log(arr[key]["roomname"]);
          if (arr[key]["roomname"] === undefined || arr[key]["roomname"] === '') {
            i++;
          } else {

            storage[arr[key]["roomname"]] = arr[key]["roomname"]

          }

          // -----------------------


        };

        //calls addRoom for each unique room
        for (var item in storage){
          app.addRoom(storage[item]);
        }


        //friend listener
        $(".user").on("click", function(){
          //capture current friend
          var currentFriend = $(this).text();

          if(!app.friendStorage[currentFriend]){
            app.addFriend($(this).text());
            app.friendStorage[currentFriend] = currentFriend;

            //change friend color
            for (var j = 0; j < $('.user').length; j++){
              var $current = $(this)
              var $compare = $($(".user")[j])

              if ($current.text() === $compare.text()) {
                $current.css({'color':'#E74C3C'});
                $compare.css({'color':'#E74C3C'});
              }
            }
          }
        });

      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

  addMessage : function(obj){

    var $message = $("<div class='message'></div>");

    var $username = $("<span class='user'></span>");
    $username.text(obj["username"]);

    var $text = $("<span></span>")
    $text.text(": " + obj["text"]);


    $message.append($username)
    $message.append($text)


    $("#chats").append($message);
  },

  clearMessages : function(){
    $("#chats").empty();
  },

  addRoom : function(roomName){
    //sanitize
    var $roomList = $("<li></li>");
    $roomList.text(roomName);
    $(".rooms").append($roomList);
  },

  clearRooms: function(){
    $('.rooms').empty();
  },

  addFriend : function(username){

    var $friendList = $("<li></li>")
    $friendList.text(username);
    $(".friends").append($friendList);
  },

  clearFriends : function(){
    $('.friends').empty();
  }


};

app.init();




