
app.service('contactService', function(accessService, $q, $rootScope){
    //Stores phone_booth_id and data
    var _contact_data_arr = [];
    var self = this;

    this.getContactData = function(){
        accessService.getPhoneBoothData()
        .then(function(phoneBoothRes){
            //Since this reloads everthing, just broadcast
            _contact_data_arr = phoneBoothRes.data.data.phone_booth;
            $rootScope.$broadcast('contactService:contact_update', _contact_data_arr);
        });

        //Return data first
        return $q.resolve(_contact_data_arr);
    }

    this.addContactData = function(contact_name, contact_num, contact_ext){
        return accessService.addPhoneBooth(contact_name, contact_num, contact_ext)
        .then(function(phoneBoothRes){
            //Structure similar to data received from server
            var data = {
                phone_booth_id : phoneBoothRes.data.data.phone_booth_id,
                name : contact_name,
                contact_ext : contact_ext,
                contact_num : contact_num,
                phone_booth_extras : [],
            }

            _contact_data_arr.push(data);
        });
    };

    this.removeContact = function(phone_booth_id){
        return accessService.removePhoneBooth(phone_booth_id)
        .then(function(){
            for(var i=0; i < _contact_data_arr.length; i++){
                if(_contact_data_arr[i].phone_booth_id == phone_booth_id){
                    _contact_data_arr.splice(i,1);
                    break;
                }
            }
        });
    };

    this.getContactDataWithID = function(phone_booth_id){
        for(index in _contact_data_arr){
            var phoneBoothData = _contact_data_arr[index];
            //Look for data with the same phone_booth_id
            if(phoneBoothData.phone_booth_id == phone_booth_id){
                return phoneBoothData;
            }
        }

        return null;
    };

    this.updateContact = function(phone_booth_id, name, contact_ext, contact_num){
        var origData = self.getContactDataWithID(phone_booth_id);
        if(origData == null){
            return $q.reject(new Error("updateContact phone_booth_id does not exist"));
        }else{
            return accessService.updatePhoneBooth(phone_booth_id, name, contact_num, contact_ext)
            .then(function(){
                if(name){
                    origData.name = name;
                }
                if(contact_ext){
                    origData.contact_ext = contact_ext;
                }
                if(contact_num){
                    origData.contact_num = contact_num;
                }

                return origData;
            });
        }
    };

    this.updateContactExtra = function(phone_booth_id, new_phone_booth_extra_arr){
        var origData = self.getContactDataWithID(phone_booth_id);
        if(origData == null){
            return $q.reject(new Error("updateContactExtra phone_booth_id does not exist"));
        }else{
            var copyArr = JSON.parse(JSON.stringify(new_phone_booth_extra_arr));

            //Extra to add
            var extraToAdd = _.remove(copyArr, function(extra_data){
                return (extra_data.phone_booth_extra_id == null);
            });

            //Extra to delete
            var extraToDelete = _.filter(origData.phone_booth_extras, function(extra_data){
                for(index in copyArr){
                    if(extra_data.phone_booth_extra_id == copyArr[index].phone_booth_extra_id){
                        return false;
                    }
                }
                return true;
            });

            //Extra to update
            var extraToUpdate = _.remove(copyArr, function(extra_data){
                for(index in origData.phone_booth_extras){
                    var ref = origData.phone_booth_extras[index];
                    if(extra_data.phone_booth_extra_id == ref.phone_booth_extra_id){
                        return (ref.name != extra_data.name || ref.details != extra_data.details);
                    }
                }
                return false;
            });

            var promiseArr = [];
            _.forEach(extraToAdd, function(extra_data){
                var addPromise = accessService.addPhoneBoothExtra(phone_booth_id, extra_data.name, extra_data.details)
                .then(function(addRes){
                    var phone_booth_extra_id = addRes.data.data.phone_booth_extra_id;
                    //Add to local
                    origData.phone_booth_extras.push({
                        phone_booth_extra_id : phone_booth_extra_id,
                        name : extra_data.name,
                        details : extra_data.details
                    });
                });

                promiseArr.push(addPromise);
            });

            _.forEach(extraToDelete, function(extra_data){
                var deletePromise = accessService.removePhoneBoothExtra(phone_booth_id, extra_data.phone_booth_extra_id)
                .then(function(){
                    //Remove from local
                    for(index in origData.phone_booth_extras){
                        if(origData.phone_booth_extras[index].phone_booth_extra_id == extra_data.phone_booth_extra_id){
                            origData.phone_booth_extras.splice(index, 1);
                            break;
                        }
                    }
                });

                promiseArr.push(deletePromise);
            });

            _.forEach(extraToUpdate, function(extra_data){
                var updatePromise = accessService.updatePhoneBoothExtra(phone_booth_id, extra_data.phone_booth_extra_id, extra_data.name, extra_data.details)
                .then(function(){
                    //Update local
                    for(index in origData.phone_booth_extras){
                        var ref = origData.phone_booth_extras[index];
                        if(ref.phone_booth_extra_id == extra_data.phone_booth_extra_id){
                            ref.name = extra_data.name;
                            ref.details = extra_data.details;
                            break;
                        }
                    }
                });

                promiseArr.push(updatePromise);
            });

            return $q.all(promiseArr);
        }
    }

    //Run to retrieve data
    this.getContactData();
});

app.controller('contactCtrl', function($scope, contactService, ModalHelper, ngDialog) {

    $scope.contact_data_arr = [];
    $scope.alphabetical_contact_data = {};

    $scope.showAlphaneticalOrder = false;
    $scope.searchContactQuery = "";
    $scope.search_result_array = [];

    $scope.recompileAlphabeticalContactData = function(){
        var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var arrCopy = $scope.contact_data_arr.slice();
        var newAlpha = {};

        for(index in charset){
            var currentChar = charset[index];

            newAlpha[currentChar] = _.remove(arrCopy, function(data){
                return (data.name.length > 0 && data.name[0].toUpperCase() == currentChar);
            });
        }

        newAlpha["#"] = arrCopy;

        $scope.alphabetical_contact_data = newAlpha;
    }

    $scope.researchContact = function(newSearchText){
        $scope.search_result_array = [];

        for(index in $scope.contact_data_arr){
            var ref = $scope.contact_data_arr[index];
            if(ref.name.indexOf(newSearchText) >= 0 || ref.contact_num.indexOf(newSearchText) >= 0){
                $scope.search_result_array.push(ref);
            }
        }
    };

    $scope.$watch('searchContactQuery', function(newValue){
        $scope.researchContact(newValue);
    });

    contactService.getContactData()
    .then(function(contactData){
        $scope.contact_data_arr = contactData;
        $scope.recompileAlphabeticalContactData();
    });

    $scope.$on('contactService:contact_update', function(event,contactData){
        $scope.contact_data_arr = contactData;
        $scope.recompileAlphabeticalContactData();
    });

    $scope.addContact = function(){
        return ngDialog.open({
            template    : '/html/template/modal_add_contact.html',
            className   : 'ngdialog-theme-default',
            scope       : true,
            controller  : function($scope, contactService){
                $scope.contact_name = "";
                $scope.contact_ext = "";
                $scope.contact_num = "";

                $scope.createNewContact = function(){
                    if($scope.contact_num){
                        $scope.contact_num = $scope.contact_num.trim();
                        $scope.contact_name = $scope.contact_name || "";
                        $scope.contact_ext = $scope.contact_ext || "";
                        $scope.contact_name = $scope.contact_name.trim();
                        $scope.contact_ext = $scope.contact_ext.trim();

                        ModalHelper.showLoadingModal();
                        contactService.addContactData($scope.contact_name, $scope.contact_num, $scope.contact_ext)
                        .then(function(){
                            ModalHelper.closeLoadingModel();
                            $scope.closeThisDialog();
                        })
                        .catch(function(err){
                            console.log(err);
                            ModalHelper.closeLoadingModel();
                            ModalHelper.showOKModal($scope, "Add Contact", "Error, please try again later");
                        });
                    }
                };
            },
            showClose   : false
        });
    }

    $scope.selectContact = function(phone_booth_id){

        var childScope = $scope.$new();

        var phoneBoothData = contactService.getContactDataWithID(phone_booth_id);
        if(phoneBoothData != null){
            //Deep clone
            childScope.phone_booth_data = JSON.parse(JSON.stringify(phoneBoothData));
        }else{
            console.log("phone booth data not found");
            return;
        }

        return ngDialog.open({
            template    : '/html/template/modal_view_contact.html',
            className   : 'ngdialog-theme-default',
            scope       : childScope,
            width       : 500,
            controller  : function($scope, contactService, $q){

                $scope.modifying_name = false;
                $scope.modifying_ext = false;
                $scope.modifying_num = false;
                $scope.modifying_extra = false;

                $scope.deleteContact = function(){
                    ModalHelper.showDeleteConfirmation()
                    .then(function(){
                        //Delete confirmation
                        ModalHelper.showLoadingModal();

                        return contactService.removeContact($scope.phone_booth_data.phone_booth_id)
                        .then(function(){
                            ModalHelper.closeLoadingModel();
                            $scope.closeThisDialog();
                        })
                        .catch(function(err){
                            console.log(err);
                            ModalHelper.closeLoadingModel();
                            ModalHelper.showOKModal($scope, "Delete Contact", "Error, please try again later");
                        });

                    })
                    .catch(function(){
                        //Delete rejected
                    });
                };

                $scope.saveContact = function(){
                    ModalHelper.showLoadingModal();
                    //Save details before saving extras
                    var save_details;
                    if($scope.modifying_name || $scope.modifying_ext || $scope.modifying_num){
                        save_details = contactService.updateContact($scope.phone_booth_data.phone_booth_id,
                                                        $scope.modifying_name?$scope.phone_booth_data.name:null,
                                                        $scope.modifying_ext?$scope.phone_booth_data.contact_ext:null,
                                                        $scope.modifying_num?$scope.phone_booth_data.contact_num:null);
                    }else{
                        save_details = $q.resolve();
                    }

                    //Save extras
                    save_details.then(function(){
                        return contactService.updateContactExtra($scope.phone_booth_data.phone_booth_id, $scope.phone_booth_data.phone_booth_extras);
                    })
                    .then(function(){
                        ModalHelper.closeLoadingModel();
                        $scope.closeThisDialog();
                    })
                    .catch(function(err){
                        console.log(err);
                        ModalHelper.closeLoadingModel();
                        ModalHelper.showOKModal($scope, "Save Contact", "Error, please try again later");
                    });

                };

                $scope.addExtra = function(){
                    $scope.modifying_extra = true;
                    $scope.phone_booth_data.phone_booth_extras.push({
                        name : "",
                        details : "",
                        modifying : true //Extra attribute
                    });
                };

                //Note that this is index, not phone_booth_extra_id
                $scope.removeExtraAtIndex = function(index){
                    $scope.modifying_extra = true;
                    var array = $scope.phone_booth_data.phone_booth_extras;
                    if(array.length > 0 && index >= 0 || index < array.length){
                        array.splice(index, 1);
                    }else{
                        console.log("bad index: "+index);
                    }
                };
            },
            showClose   : false
        });
    }
});

app.directive("contactDir", function(){
    return {
        template:   '<div class="contact-grid col-md-2 col-sm-3" ng-click="selectContact(item.phone_booth_id)">'+
                        '<div class="row">'+
                            '<label class="col-xs-3">Name:</label>'+
                            '<div class="col-xs-9">{{item.name}}</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-xs-3" ng-show="item.contact_ext.length > 0">{{item.contact_ext}}</div>'+
                            '<div ng-class="{ \'col-xs-12\' : (item.contact_ext.length == 0), \'col-xs-9\' : (item.contact_ext.length > 0) }">{{item.contact_num}}</div>'+
                        '</div>'+
                    '</div>'
    };
});