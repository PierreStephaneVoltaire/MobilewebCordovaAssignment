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
  var savebtn=$("#savePhoto");
  var getbtn=$("#getPhoto");
  var clearbtn=$("#clear");
  var deletebtn=$("#deletePhoto");
  var age=$("#age");
  var email=$("#email");
  var name=$("#name");
    var photo=$("#photo");
  deletebtn.hide();
  $("#takePhoto").on("click",takePhoto);
deletebtn.on('click',function(){photo.attr('src', '');} )

});

function opendb(){
  var db = null;

  $(document).on('deviceready', function() {
    db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
  });
}

db.transaction(function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, email,age,picture)');
}, function(error) {
  console.log('Transaction ERROR: ' + error.message);
}, function() {
  console.log('Populated database OK');
});


function takePhoto() {
  var options = {
    quality: 50,
        destinationType: Camera.DestinationType.DATA_URI,
    cameraDirection: Camera.Direction.FRONT,
    correctOrientation: true,
    allowEdit: false
  };
  navigator.camera.getPicture(cameraSuccess, cameraError, options);
}
function cameraSuccess(imageData){
  deletebtn.show();
  photo.attr('src', "data:image/jpeg;base64,"+imageData);
  var image = document.getElementById('myImage');
     image.src =  imageData;

}
function cameraError(errorData){
   name.text('some text');
}
