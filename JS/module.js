 var app = angular.module('resec', ['ngMaterial', 'ui.router', 'chart.js', 'ngMdIcons',
     'xeditable', 'ui.bootstrap', 'ngDraggable', 'angular.vertilize', 'checklist-model', 'ngDragDrop', 'jsonFormatter',
     'md.data.table', 'ng.httpLoader', 'ng-ip-address', 'angular-loading-bar', 'ngAnimate', "googlechart", "ipCookie", "ngCookies"
 ])

 //spinner / loader for GET/POST requests

 app.config([
     'httpMethodInterceptorProvider',
     function (httpMethodInterceptorProvider) {
         var sname = localStorage.getItem("serverName");
         httpMethodInterceptorProvider.whitelistDomain(sname);
     }

 ])