import angular from 'angular';
import React from 'react';
import { render } from 'react-dom';

export const componentFactory=(()=>{
  const components={};
  return {
    getReactComponent:(name)=>{
      if(components[name]){
        return components[name].promise;
      }else{
        components[name]={};
        components[name].promise= new Promise((resolve)=>{
          components[name].resolver=resolve;
        })
      }
      return components[name].promise; 
    },
    registerReactComponent:(name,component)=>{
      if(components[name]){
        return components[name].resolver(component);
      }else{
        components[name]={};
        components[name].promise= new Promise((resolve)=>{
          components[name].resolver=resolve;
          resolve(component);
        });
      }
      return components[name].promise; 
    }
  }
})();

const reactComponent = function($injector) {
    return {
      restrict: 'E',
      replace: true,
      link: function(scope, elem, attrs) {
        componentFactory.getReactComponent(attrs.name).then((component)=>{
            render(React.createElement(component),elem[0]);
        });
        scope.$on('$destroy', function() {
          if (!attrs.onScopeDestroy) {
            ReactDOM.unmountComponentAtNode(elem[0]);
          } else {
            scope.$eval(attrs.onScopeDestroy, {
              unmountComponent: ReactDOM.unmountComponentAtNode.bind(this, elem[0])
            });
          }
        });
      }
    };
  };
angular.module('react', []).directive('reactComponent', ['$injector', reactComponent]);

