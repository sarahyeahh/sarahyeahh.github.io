angular.module('modalTest',['ui.bootstrap','dialogs'])
.controller('dialogServiceTest',function($scope,$rootScope,$timeout,$dialogs){
  $scope.confirmed = 'You have yet to be confirmed!';
  $scope.name = '"Your name here."';

  $scope.plots = [
    { id: 627,name: "Plot 1", surface : "100", actualSeed: "corn", status:"success" },
    { name: "Plot 2", surface : "100", actualSeed: "corn", status:"danger" },
    { name: "Plot 3", surface : "100", actualSeed: "corn" }
  ];
  $scope.weenats = [
    { name: "Pluvio1", device : "1C5B0", latitude: 40, longitude: 0},
    { name: "Pluvio1", device : "1C5B0", latitude: 40, longitude: 0},
    { name: "Pluvio1", device : "1C5B0", latitude: 40, longitude: 0},
    { name: "Pluvio1", device : "1C5B0", latitude: 40, longitude: 0},
    
  ];  
  $scope.app = {
    title: "Weenat",
    logo: "http://127.0.0.1:9000/images/logo_weenat.png",
    urlLogin: "http://api.weenat.com/accounts/login/",
    urlLogout: "http://api.weenat.com/accounts/logout/",
    urlSetting: "/settings"
    
  }
  $scope.profile = {
    "id": 7,
    "username": "jerome",
    "first_name": "Jerome",
    "last_name": "Leroy",
    "email": "jerome.leroy@weenat.com",
    "last_login": "2015-12-17T20:34:29.098276Z",
    "plots": [
        {
            "id": 422,
            "url": "http://api.weenat.com/plots/422/",
            "name": "Merris",
            "surface": 120,
            "actualSeed": "corn",
            "start": "2015-06-01",
            "weenats": [
                {
                    "id": 393,
                    "url": "http://api.weenat.com/weenats/393/",
                    "name": "Pluvio",
                    "type": "P+",
                    "depth_level": ""
                }
            ]
        },
        {
            "id": 483,
            "url": "http://api.weenat.com/plots/483/",
            "name": "_Test",
            "weenats": [
                {
                    "id": 677,
                    "url": "http://api.weenat.com/weenats/677/",
                    "name": "Pluvio Longeves",
                    "type": "P+",
                    "depth_level": ""
                },
                {
                    "id": 676,
                    "url": "http://api.weenat.com/weenats/676/",
                    "name": "Pluvio Rheges",
                    "type": "P+",
                    "depth_level": ""
                },
                {
                    "id": 659,
                    "url": "http://api.weenat.com/weenats/659/",
                    "name": "Test HP1 20",
                    "type": "CHP",
                    "depth_level": ""
                },
                {
                    "id": 661,
                    "url": "http://api.weenat.com/weenats/661/",
                    "name": "Test HP2 10",
                    "type": "CHP",
                    "depth_level": ""
                }
              ]
        }
     ]
  }
  
  
  
  $scope.launch = function(which){
    var dlg = null;
    switch(which){
        
      // Error Dialog
      case 'error':
        dlg = $dialogs.error('This is my error message');
        break;
        
      // Wait / Progress Dialog
      case 'wait':
        dlg = $dialogs.wait(msgs[i++],progress);
        fakeProgress();
        break;
        
      // Notify Dialog
      case 'notify':
        dlg = $dialogs.notify('Something Happened!','Something happened that I need to tell you.');
        break;
        
      // Confirm Dialog
      case 'confirm':
        dlg = $dialogs.confirm('Please Confirm','Is this awesome or what?');
        dlg.result.then(function(btn){
          $scope.confirmed = 'You thought this quite awesome!';
        },function(btn){
          $scope.confirmed = 'Shame on you for not thinking this is awesome!';
        });
        break;
       
      // Create Your Own Dialog
      case 'create':
        dlg = $dialogs.create('/dialogs/whatsyourname.html','whatsYourNameCtrl',{},{key: false,back: 'static'});
        dlg.result.then(function(name){
          $scope.name = name;
        },function(){
          $scope.name = 'You decided not to enter in your name, that makes me sad.';
        });
        
        break;
    }; // end switch
  }; // end launch
  
  // for faking the progress bar in the wait dialog
  var progress = 25;
  var msgs = [
    'Hey! I\'m waiting here...',
    'About half way done...',
    'Almost there?',
    'Woo Hoo! I made it!'
  ];
  var i = 0;
  
  var fakeProgress = function(){
    $timeout(function(){
      if(progress < 100){
        progress += 25;
        $rootScope.$broadcast('dialogs.wait.progress',{msg: msgs[i++],'progress': progress});
        fakeProgress();
      }else{
        $rootScope.$broadcast('dialogs.wait.complete');
      }
    },1000);
  }; // end fakeProgress 
  
}) // end dialogsServiceTest
.controller('whatsYourNameCtrl',function($scope,$modalInstance,data){
  $scope.user = {name : ''};

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  }; // end cancel
  
  $scope.save = function(){
    $modalInstance.close($scope.user.name);
  }; // end save
  
  $scope.hitEnter = function(evt){
    if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.name,null) || angular.equals($scope.name,'')))
				$scope.save();
  }; // end hitEnter
}) // end whatsYourNameCtrl
.run(['$templateCache',function($templateCache){
  $templateCache.put('/dialogs/whatsyourname.html','<div class="modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"><span class="glyphicon glyphicon-star"></span> User\'s Name</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="username">Name:</label><input type="text" class="form-control" name="username" id="username" ng-model="user.name" ng-keyup="hitEnter($event)" required><span class="help-block">Enter your full name, first &amp; last.</span></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div></div></div></div>');
}]); // end run / module



var MFX = (function(L,undefined){
	function init(){
    var map = new L.Map('map', {
			center: new L.LatLng(52.520, 13.385),
			zoom: 15
		}),
       layer = new L.tileLayer('http://{s}.tiles.mapbox.com/v3/moklick.lh736gg3/{z}/{x}/{y}.png', {
			minZoom: 5,
			maxZoom: 18
		});
				
		map.addLayer(layer);

		return this;
  };
	return {
		init : init
	}
}(L));

MFX.init();



