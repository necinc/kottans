webpackJsonp([2],{ZAL5:function(e){e.exports={searchContainer:"searchContainer__7xQLa",hiddenLabel:"hiddenLabel__3DE5g",searchInput:"searchInput__3kBTp",searchBtn:"searchBtn__2ccQw"}},mJFl:function(e,t,n){"use strict";function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),n.d(t,"default",function(){return s});var i=n("KM04"),o=(n.n(i),n("/QC5")),c=n("ZAL5"),u=n.n(c),s=function(e){function t(){for(var t,a,i,c=arguments.length,u=Array(c),s=0;s<c;s++)u[s]=arguments[s];return t=a=r(this,e.call.apply(e,[this].concat(u))),a.input=null,a.registerInput=function(e){a.input=e},a.search=function(e){e.preventDefault(),(a.input.value||"").length?n.i(o.route)(a.input.value):a.input.focus()},i=t,r(a,i)}return a(t,e),t.prototype.render=function(){return n.i(i.h)("div",{class:u.a.searchContainer},n.i(i.h)("label",{className:u.a.hiddenLabel,htmlFor:"mainSearch",id:"mainSearchLabel"},"User/organisation name:"),n.i(i.h)("input",{type:"text",id:"mainSearch",ref:this.registerInput,className:u.a.searchInput,onKeyUp:this.changeHandler,placeholder:"User / Organisation","aria-labelledby":"mainSearchLabel"}),n.i(i.h)("button",{type:"submit",className:u.a.searchBtn,"aria-label":"Search",onClick:this.search},"Search..."))},t}(i.Component)}});
//# sourceMappingURL=route-home.chunk.d401e.js.map