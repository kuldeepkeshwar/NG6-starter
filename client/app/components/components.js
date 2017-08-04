import angular from 'angular';
import Home from './home/home';
import About from './about/about';
import React from './react/react';

let componentModule = angular.module('app.components', [
  Home,
  About,
  React
])

.name;

export default componentModule;
