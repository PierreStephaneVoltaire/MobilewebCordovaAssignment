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
var getbtn=null;
var clearbtn=null;
var deletebtn=null;
var uploadbtn=null;
var savebtn=null;
var photo=null;
var age=null;
var email=null;
var sname=null;


$.when(jqmReady,pgReady).then (function(){

  getbtn=$("#getPhoto");
  clearbtn=$("#clear");
  uploadbtn=$("#takePhoto");
  photo=  $("#photo");
  deletebtn=  $("#deletePhoto");
  age=$("#age");
  email=$("#email");
  sname=$("#name");
  savebtn=$("#save");

  deletebtn.hide();
  uploadbtn.on("click",takePhoto);

  deletebtn.on('click',function(){photo.attr('src', '');});
  getbtn.on('click', getEmail(email.val()));
  clearbtn.on('click',function() {

    photo.attr('src', '');
    age.val(0);
    email.val('');
    sname.val('');
    deletebtn.hide();
  });

  savebtn.on('click',function() {

    var allOk=true;

    if (age.val()==0) {

      allOk=false;
    }
    if (email.val().trim().length==0) {
      allOk=false;
      showPopup("you forgot the email");
    }
    if (sname.val().trim().length==0) {

    }
    if (age.val()==0) {
      allOk=false;
    }
    if(allOk){
      opendb();
      addEmail(sname,email,age,photo.attr("src"));}
    });

  });

  function opendb(){
    var db = null;
    db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
    console.log("db opened");
    db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name TEXT, email TEXT PRIMARY KEY,age INT,picture TEXT)');
    }, function(error) {
      console.log('Transaction ERROR: ' + error.message);
      console.log("something went wrong");
    }, function() {
      console.log('Populated database OK');
    });}

    function getEmail(email) {
      console.log("in get email");
      var db=null;
        db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
      db.executeSql('SELECT * FROM DemoTable WHERE email like ?', [email], function(rs) {
        photo.attr('src', rs.rows.item(0).picture);
        console.log(rs.rows.item(0).picture);
        age=rs.rows.item(0).age;
        console.log(rs.rows.item(0).age);
        email=rs.rows.item(0).email;
        console.log(rs.rows.item(0).email);
        sname=rs.rows.item(0).name;
        console.log(rs.rows.item(0).name);
      }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
      });

    }

    function addEmail(dbname,dbemail,dbage,dbpicture) {
      var  db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
      db.transaction(function(tx) {
        tx.executeSql('INSERT INTO DemoTable VALUES (?,?,?,?)', [dbname, dbemail,dbage,dbpicture]);
      }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
      }, function() {
        console.log('Populated database OK');
        alert('it works!!! ');

      });
    }


    function takePhoto() {
      var options = { quality: 25,

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

      photo.attr("src",imageData);
console.log("the picture:",imageData);
      deletebtn.show();

    }

    function cameraError(errorData){
      navigator.notification.alert("Error: " + JSON.stringify(errorData),
      null, "Camera Error", "Ok");
    }

    function showPopup(msg){
      $("#pop").html("<p>"+msg+"</p>").popup("open");
      setTimeout(function() {$("#pop").popup("close"), 10000});
    }
