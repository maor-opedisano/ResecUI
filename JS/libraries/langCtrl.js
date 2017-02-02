app.controller('langCtrl', [function($rootscope, $translate){
    this.changeLanguage = function(key){
        $translate.use(key)
    }
}])