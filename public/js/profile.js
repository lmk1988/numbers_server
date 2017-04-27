
app.service('profileService', function(accessService, $q, $rootScope){

    var _profile = {
        email : "",
        name : ""
    };

    this.getProfile = function(){
        //Async retrieval
        accessService.retrieveProfile()
        .then(function(profileRes){

            var diff = (_profile.email != profileRes.data.data.email || _profile.name != profileRes.data.data.name);
            //Update values
            _profile.email = profileRes.data.data.email;
            _profile.name = profileRes.data.data.name;

            if(diff){
                $rootScope.$broadcast('profileService:profile_update', _profile);
            }
        });

        //Return reference
        return $q.resolve(_profile);
    };

    this.saveProfile = function(new_name){
        if(new_name != null){
            new_name = new_name.trim();
            return accessService.updateProfile(new_name)
            .then(function(profileRes){
                _profile.name = new_name;
            });
        }else{
            return $q.reject(new Error("invalid new_name"));
        }
    };

    //Run to retrieve data
    this.getProfile();
});

app.controller('profileCtrl', function($scope, profileService, ModalHelper) {
    $scope.email = "";
    $scope.input_name = "";

    profileService.getProfile()
    .then(function(profile){
        $scope.email = profile.email;
        $scope.input_name = profile.name;
    });

    $scope.$on('profileService:profile_update', function(event,profile){
        $scope.email = profile.email;
        $scope.input_name = profile.name;
    });

    $scope.saveProfile = function(){
        $scope.input_name = $scope.input_name.trim();

        if($scope.input_name != null){
            ModalHelper.showLoadingModal();
            profileService.saveProfile($scope.input_name)
            .then(function(){
                ModalHelper.closeLoadingModel();
                ModalHelper.showOKModal($scope, "Save Profile", "Profile saved");
            })
            .catch(function(err){
                ModalHelper.closeLoadingModel();
                ModalHelper.showOKModal($scope, "Save Profile", "Save Profile Error, please try again later");
            });
        }
    };
});

app.controller('passwordCtrl', function($scope, accessService, ModalHelper) {

    $scope.new_password = "";
    $scope.confirm_password = "";

    $scope.changePassword = function(){

        if($scope.new_password != null && $scope.new_password == $scope.confirm_password){

            $scope.new_password = $scope.new_password.trim();
            $scope.confirm_password = $scope.confirm_password.trim();

            ModalHelper.showLoadingModal();
            accessService.setNewPassword($scope.new_password)
            .then(function(passwordRes){
                ModalHelper.closeLoadingModel();

                ModalHelper.showOKModal($scope, "Change Password", "Password has been changed")
                .closePromise
                .then(function(){
                    //Remove old input
                    $scope.new_password = "";
                    $scope.confirm_password = "";
                    //Clear validation
                    $scope.passwordForm.$setPristine();
                });
            })
            .catch(function(err){
                console.log(err);
                ModalHelper.closeLoadingModel();
                ModalHelper.showOKModal($scope, "Change Password", "Password Change Error, please try again later");
            });
        }
    }
});