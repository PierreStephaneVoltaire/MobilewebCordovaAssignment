/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
var jqmReady=$.Deferred();
var pgReady=$.Deferred();

$(document).on("pagecreate",  jqmReady.resolve);
document.addEventListener("deviceready",pgReady.resolve,false);

// We must wait until both objects are resolved!
$.when(jqmReady,pgReady).then (function(){

  var getbtn=$("#getPhoto");
  var clearbtn=$("#clear");
  var age=$("#age");
  var email=$("#email");
  var name=$("#name");

  $("#deletePhoto").hide();
  $("#takePhoto").on("click",takePhoto);

  $("#deletePhoto").on('click',function(){photo.removeAttr("src")});

  $("#clear").on('click',function() {
    alert("in clear");
    $("#photo").removeAttr("src");
    age.val(0);
    email.val('');
    name.val('');
    $("#deletePhoto").hide();
  });

  $("#save").on('click',function() {
    alert(age.val()+" "+email.val()+" "+name.val()+"");
    var allOk=false;
    
    if (age.val()==0) {

      allOk=false;
    }
    if (email.val().trim().length==0) {
      allOk=false;
      //  showPopup("you forgot the email, you fucking failure!!!");
    }
    if (name.val().trim().length==0) {

    }
    if (age.val()==0) {
      allOk=false;
    }
    if(allOk){
      opendb();}
    });

  });

  function opendb(){
    var db = null;
    db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
    db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, email,age,picture)');
    }, function(error) {
      console.log('Transaction ERROR: ' + error.message);
    }, function() {
      console.log('Populated database OK');
    });}


    function takePhoto() {
      var options = { quality: 25,
        //destinationType: Camera.DestinationType.DATA_URL,
        destinationType: Camera.DestinationType.FILE_URI,
        cameraDirection: Camera.Direction.FRONT,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true,
        allowEdit: true
      };
      navigator.camera.getPicture(cameraSuccess, cameraError, options);
    }

    function cameraSuccess(imageData){
      // Uncomment the line below to see what you get as imageData:
      //navigator.notification.alert(imageData, null, "Photo Results", "Ok");

      $("#photo").attr("src",imageData);

      $("#deletePhoto").show();

      // Use this only if you need raw image data.
      // You also must activate Camera.DestinationType.DATA_URL option above.
      //image.src = "data:image/jpeg;base64," + imageData;
    }

    function cameraError(errorData){
      navigator.notification.alert("Error: " + JSON.stringify(errorData),
      null, "Camera Error", "Ok");
    }

    /*  function showPopup(msg){
    $("#pop").html("<p>"+msg+"</p>").popup("open");
    setTimeout(function() $pop.popup("close"), 1000);
  }*/
