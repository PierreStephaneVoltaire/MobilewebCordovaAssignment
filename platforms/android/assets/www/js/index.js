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

$.when(jqmReady,pgReady).then (initApp);
function initApp(){
  var getbtn=$("#getPhoto");
  var clearbtn=$("#clear");
  var uploadbtn=$("#takePhoto");
  var photo=  $("#photo");
  var deletebtn=  $("#deletePhoto");
  var age=$("#age");
  var email=$("#email");
  var sname=$("#name");
  var db=null;
  var $pop=$("#pop");

  var emptyPhoto=photo.attr("src");

  savebtn=$("#save");
  deletebtn.hide();
  uploadbtn.on("click",takePhoto);
  deletebtn.on('click',function(){photo.prop('src', '');});

  getbtn.on('click', function() {
    var em=email.val().trim();

    if (em.length==0) {
      showPopup("email cannot be empty");return;
    }
    else{
      getPicture(email.val());}
    });

    clearbtn.on('click',function() {
      photo.attr('src', '');
      age.val(20);
      email.val('');
      sname.val('');
      deletebtn.hide();
    });

    savebtn.on('click',function() {
      var allOk=true;
      var errmsg="";
      if (email.val().trim().length==0) {


        errmsg+="email cannot be empty";
      }
      if (sname.val().trim().length==0) {

        errmsg+="name cannot be empty";
      }
      if (age.val()==0) {

        errmsg+="age cannot be empty";
      }

      if(errmsg.length<1){
        opendb();
        var ph = photo.prop("src");
        if (ph == emptyPhoto) { ph="";}

        addEmail(sname.val(),email.val(),age.val(),ph);}
        else{showPopup(errmsg);}
      });

    function opendb(){
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

      function getPicture(e) {
        db.executeSql('SELECT * FROM DemoTable WHERE email like "' + e+ '"', [], function(rs) {
          if (rs.rows.length < 1) {showPopup("email does not exist"); return;}
          var ph= rs.rows.item(0).picture;
          if (ph.length<1) {ph=emptyPhoto;}
          photo.prop('src', ph);
          age.val(rs.rows.item(0).age);
          email.val(rs.rows.item(0).email);
          sname.val(rs.rows.item(0).name);
          deletebtn.show();
        }, function(error) {
          showPopup("email does not exist");return;
        });
      }
      function addEmail(dbname,dbemail,dbage,dbpicture) {
        db.transaction(function(tx) {
          tx.executeSql('REPLACE INTO  DemoTable VALUES (?,?,?,?)', [dbname, dbemail,dbage,dbpicture]);
        }, function(error) {
          console.log('Transaction ERROR: ' + error.message);
          navigator.notification.alert("this email already exists", null, "DB Error", "Ok");
        }, function() {
          console.log('added to db');
          navigator.notification.alert("information saved", null, "Save info", "Ok");
          deletebtn.hide();
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
        photo.attr("src",imageData);
        console.log("the picture:",imageData);
        deletebtn.show();
      }
      function cameraError(errorData){
        navigator.notification.alert("Error: " + JSON.stringify(errorData),
        null, "Camera Error", "Ok");
      }

      function showPopup(msg){
        $pop.html("<p>"+msg+"</p>").popup("open");
        setTimeout(function() {$pop.popup("close"), 3000});
      }
}
