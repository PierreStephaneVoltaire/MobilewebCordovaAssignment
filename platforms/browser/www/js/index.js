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
var getbtn=null;
var clearbtn=null;
var deletebtn=null;
var uploadbtn=null;
var savebtn=null;
var photo=null;
var age=null;
var email=null;
var sname=null;
var db=null;
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
  getbtn.on('click', function() {
    if (email.val().trim().length==0) {
      showPopup("email cannot be empty");
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
        allOk=false;

        errmsg+="email cannot be empty";
      }
      if (sname.val().trim().length==0) {
        allOk=false;
        errmsg+="name cannot be empty";
      }
      if (age.val()==0) {
        allOk=false;
        errmsg+="age cannot be empty";
      }
      if(allOk){
        opendb();
        addEmail(sname.val(),email.val(),age.val(),photo.attr("src"));}
        else{showPopup(errmsg);}
      });
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
          photo.attr('src', rs.rows.item(0).picture);
          age.val(rs.rows.item(0).age);
          email.val(rs.rows.item(0).email);
          sname.val(rs.rows.item(0).name);
          deletebtn.show();
        }, function(error) {
          showPopup("email does not exist");
        });
      }
      function addEmail(dbname,dbemail,dbage,dbpicture) {
        db.transaction(function(tx) {
          tx.executeSql('INSERT INTO DemoTable VALUES (?,?,?,?)', [dbname, dbemail,dbage,dbpicture]);
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
        $("#pop").html("<p>"+msg+"</p>").popup("open");
        setTimeout(function() {$("#pop").popup("close"), 3000});
      }
