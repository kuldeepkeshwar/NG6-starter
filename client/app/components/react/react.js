import angular from 'angular';
import uiRouter from 'angular-ui-router';
import BOP from 'BOP';
import {componentFactory} from './ng-react';



let reactModule = angular.module('react-module', [
  uiRouter , 'react'
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('bank-module', {
    url: '/bank/:path',
    params : {path : {type : "string",raw : true}},  
    templateProvider: function ($timeout, $stateParams) {
      console.log('hola',$stateParams.path);
      let url=[].concat($stateParams.path);
      let path=url.pop();
      console.log(url);
      if(path){
        return BOP.import(path).then((module)=>{
          const component =module.Transactions;
          componentFactory.registerReactComponent(path,component);
          return new Promise((resolve,reject)=>{
            $timeout(()=>{
              resolve(`
              <div>
                  <navbar></navbar>
                  <h1>{{ $ctrl.name }}</h1>
                  <section>
                    <react-component name="${path}"></react-component>
                  </section>
                  <footer>footer</footer>
              </div>
              `);
            },10);
          });
        });
      }else{
        return new Promise((resolve,reject)=>{
          $timeout(()=>{
            resolve(`
            <div>
                <navbar></navbar>
                <h1>{{ $ctrl.name }}</h1>
                <section>
                  page not found !!
                </section>
                <div ui-view></div>
                <footer>footer</footer>
            </div>
            `);
          },10);
        });
      }
    }
  })
}) 
.name;

export default reactModule;
