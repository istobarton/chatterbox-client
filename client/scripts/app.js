
var app = {

  //get username
  uzer : window.location.search.split("=")[1],

  //friend storage
  friendStorage: {},

  init : function(){

    $(document).ready(function() {

      // var uzer =
      // console.log(uzer);

      //fetches new messages
      app.fetch('https://api.parse.com/1/classes/chatterbox')

      //friends
      // $(".friend").on('click', app.addFriend(this.username));

      //button click events
      $(".submit").on("click", function(){
        app.send($("form").serializeArray()[0]["value"], "THE BEST CHATROOM");
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
      username: app.uzer,
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
    //Initializing a get request
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      //in the event of a sucessful GET request do the following:
      success: function (data) {
        //1. Initialize Storage & Make data accessible
        var storage = {};
        var arr = data['results'];
        console.log(data)

        //2. Loop through results array, set storage keys to each roomname, set storage properties to empty arrays, push data to each respective roomname
        for (var i = 0; i < 50; i ++){

          // add messages to main page
          app.addMessage(arr[i]);

          // initiate room keys in storage
          if (arr[i]["roomname"] === undefined || arr[i]["roomname"] === '') {
            i++;
          } else {
              // create readable variable for the roomname property
              var currentRoomName = arr[i]["roomname"];

              //if the Room Key exists, push the current message into the Room Key's Array
              if (storage[currentRoomName]) {
                storage[currentRoomName].push(arr[i]);

              // else initiate array and push current message into Array as first property
              } else {

                storage[currentRoomName] = [];
                storage[currentRoomName].push(arr[i]);

              }


          }
        };

        // Use addRoom to add each room to the select HTML selector
        for (var roomName in storage){
          app.addRoom(roomName);
        }

        //Listen for room change
        $("select").on("change", function(){
           var selectRoom = $(this).val()
           console.log(storage);

           // app.fetch('https://api.parse.com/1/classes/chatterbox')
           app.clearMessages();


           debugger
           for (var m = 0; m < storage[selectRoom].length; m++) {
             if (storage[selectRoom][m] === undefined) {
               m++;
             } else {
               console.log(storage[selectRoom][m]);
               app.addMessage(storage[selectRoom][m]);
             }
           }
        });


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
    // if(obj['roomname']===selectRoom){
      // console.log("It should be obvious if I'm working")
      var $message = $("<div class='message'></div>");

      var $username = $("<span class='user'></span>");
      $username.text(obj["username"]);

      var $text = $("<span></span>")
      $text.text(": " + obj["text"]);


      $message.append($username)
      $message.append($text)


      $("#chats").append($message);
   // }
  },

  clearMessages : function(){
    $("#chats").empty();
  },

  addRoom : function(roomName){
    //sanitize
    var $roomList = $("<option></option>");
    $roomList.text(roomName);
    $("#roomSelect").append($roomList);
  },

  clearRooms: function(){
    $('#roomSelect').empty();
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




