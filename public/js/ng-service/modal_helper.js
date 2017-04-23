app.service('ModalHelper', function(ngDialog){
    this.showOKModal = function(scope, title, body){

        var childScope = scope.$new();
        childScope.title = title;
        childScope.body = body;

        return ngDialog.open({
            template    : '/html/template/modal_ok.html',
            className   : 'ngdialog-theme-default',
            scope       : childScope,
            showClose   : false
        });
    }

    var currentLoadingDialog = null;

    this.showLoadingModal = function(){
        if(!currentLoadingDialog){
            currentLoadingDialog = ngDialog.open({
                template        : '/html/template/modal_loading.html',
                className       : 'ngdialog-theme-default',
                showClose       : false,
                closeByEscape   : false,
                closeByDocument : false,
            });
        }
    }

    this.closeLoadingModel = function(){
        if(currentLoadingDialog){
            currentLoadingDialog.close();
            currentLoadingDialog = null;
        }
    }
});