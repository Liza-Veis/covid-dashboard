!function(){"use strict";var t={4618:function(){function t(t,e,n,r,a,s,i){try{var o=t[s](i),c=o.value}catch(t){return void n(t)}o.done?e(c):Promise.resolve(c).then(r,a)}function e(e){return function(){var n=this,r=arguments;return new Promise((function(a,s){var i=e.apply(n,r);function o(e){t(i,a,s,o,c,"next",e)}function c(e){t(i,a,s,o,c,"throw",e)}o(void 0)}))}}function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var r=function(){function t(e,n,r,a,s,i,o,c,u){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.baseUrl="https://api.covid19api.com/",this.isTotal=!0,this.isDivided=!1,this.isHandled=!1,this.selectedCountry="Belarus",this.perHundredThousand=1e5,this.populationData=[],this.informer=e,this.globalCasesSelector=n,this.totalCasesSelector=r,this.totalDeathsSelector=a,this.totalRecoveredSelector=s,this.countryCasesSelector=i,this.countryDeathsSelector=o,this.countryRecoveredSelector=c,this.countryNameSelector=u}var r,a,s,i,o,c,u,l,h,d,p,f,v,m;return r=t,(a=[{key:"getData",value:(m=e(regeneratorRuntime.mark((function t(){var e,n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("".concat(this.baseUrl,"summary"));case 2:return e=t.sent,t.next=5,e.json();case 5:return n=t.sent,t.abrupt("return",{global:n.Global,countries:n.Countries});case 7:case"end":return t.stop()}}),t,this)}))),function(){return m.apply(this,arguments)})},{key:"setGlobalData",value:(v=e(regeneratorRuntime.mark((function t(){var e,n,r,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.getData();case 2:return e=t.sent,t.next=5,this.createCountriesDataFragment(e,this.isTotal?"TotalConfirmed":"NewConfirmed");case 5:return n=t.sent,t.next=8,this.createCountriesDataFragment(e,this.isTotal?"TotalDeaths":"NewDeaths");case 8:return r=t.sent,t.next=11,this.createCountriesDataFragment(e,this.isTotal?"TotalRecovered":"NewRecovered");case 11:a=t.sent,this.totalCasesSelector.innerHTML="",this.totalDeathsSelector.innerHTML="",this.totalRecoveredSelector.innerHTML="",this.totalCasesSelector.appendChild(n),this.totalDeathsSelector.appendChild(r),this.totalRecoveredSelector.appendChild(a);case 18:case"end":return t.stop()}}),t,this)}))),function(){return v.apply(this,arguments)})},{key:"setCountryData",value:(f=e(regeneratorRuntime.mark((function t(e){var n,r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.selectedCountry=e,t.next=3,this.getDataByCountry(this.selectedCountry);case 3:return n=t.sent,r=document.querySelector(".tabs__content"),t.next=7,this.getRefactorCountryData(n,this.isTotal?"TotalConfirmed":"NewConfirmed");case 7:return this.countryCasesSelector.innerHTML=t.sent,t.next=10,this.getRefactorCountryData(n,this.isTotal?"TotalDeaths":"NewDeaths");case 10:return this.countryDeathsSelector.innerHTML=t.sent,t.next=13,this.getRefactorCountryData(n,this.isTotal?"TotalRecovered":"NewRecovered");case 13:if(this.countryRecoveredSelector.innerHTML=t.sent,this.countryNameSelector.innerHTML=this.selectedCountry,this.isHandled){t.next=22;break}return t.t0=r,t.next=19,this.countryListClickHandler.bind(this);case 19:t.t1=t.sent,t.t0.addEventListener.call(t.t0,"click",t.t1,!1),this.isHandled=!0;case 22:document.querySelector("#search").value="",document.querySelector("#search").dispatchEvent(new Event("input"));case 24:case"end":return t.stop()}}),t,this)}))),function(t){return f.apply(this,arguments)})},{key:"countryListClickHandler",value:(p=e(regeneratorRuntime.mark((function t(e){var n,r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e.target.classList.contains("countries-list__item")){t.next=6;break}return n=e.target.querySelector(".countries-list__country-name").textContent,t.next=4,this.setCountryData(n);case 4:t.next=15;break;case 6:if(!e.target.classList.contains("countries-list__country-name")){t.next=11;break}return t.next=9,this.setCountryData(e.target.textContent);case 9:t.next=15;break;case 11:if(!e.target.classList.contains("countries-list__number")){t.next=15;break}return r=e.target.parentNode.querySelector(".countries-list__country-name").textContent,t.next=15,this.setCountryData(r);case 15:case"end":return t.stop()}}),t,this)}))),function(t){return p.apply(this,arguments)})},{key:"init",value:(d=e(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.setGlobalData();case 2:return t.next=4,this.setCountryData(this.selectedCountry);case 4:case"end":return t.stop()}}),t,this)}))),function(){return d.apply(this,arguments)})},{key:"changeIsTotalState",value:(h=e(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.isTotal=!this.isTotal,t.next=3,this.setGlobalData();case 3:return t.next=5,this.setCountryData(this.selectedCountry);case 5:case"end":return t.stop()}}),t,this)}))),function(){return h.apply(this,arguments)})},{key:"changeIsDividedState",value:(l=e(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.isDivided=!this.isDivided,t.next=3,this.setGlobalData();case 3:return t.next=5,this.setCountryData(this.selectedCountry);case 5:case"end":return t.stop()}}),t,this)}))),function(){return l.apply(this,arguments)})},{key:"getPopulationData",value:(u=e(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.populationData.length){t.next=4;break}return t.next=3,this.informer.getAllData();case 3:this.populationData=t.sent;case 4:return t.abrupt("return",this.populationData);case 5:case"end":return t.stop()}}),t,this)}))),function(){return u.apply(this,arguments)})},{key:"getDataByCountry",value:(c=e(regeneratorRuntime.mark((function t(e){var n,r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.getData();case 2:return n=t.sent.countries,r=Object.assign({},n.find((function(t){return t.Country.toLowerCase()===e.toLowerCase()}))),t.abrupt("return",r);case 5:case"end":return t.stop()}}),t,this)}))),function(t){return c.apply(this,arguments)})},{key:"createCountriesDataFragment",value:(o=e(regeneratorRuntime.mark((function t(e,n){var r,a,s,i=this;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=document.createDocumentFragment(),a=e.countries.sort((function(t,e){return e[n]-t[n]})),t.next=4,this.getPopulationData();case 4:return s=t.sent,a.forEach((function(t){var e=document.createElement("div");e.className="countries-list__item",e.setAttribute("data-country",t.Country);var a=null;i.isDivided&&(a=s.find((function(e){return e.name.toLowerCase()===t.Country.toLowerCase()})).population),e.innerHTML='\n          <span class="countries-list__number">'.concat(i.isDivided?(t[n]/a*i.perHundredThousand).toFixed(2):t[n],'</span>\n          <span class="countries-list__country-name">').concat(t.Country,"</span>\n          "),r.append(e)})),t.abrupt("return",r);case 7:case"end":return t.stop()}}),t,this)}))),function(t,e){return o.apply(this,arguments)})},{key:"getRefactorCountryData",value:(i=e(regeneratorRuntime.mark((function t(e,n){var r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.getPopulationData();case 2:return r=t.sent.find((function(t){return t.name.toLowerCase()===e.Country.toLowerCase()})).population,t.abrupt("return",this.isDivided?(e[n]/r*this.perHundredThousand).toFixed(2):e[n]);case 4:case"end":return t.stop()}}),t,this)}))),function(t,e){return i.apply(this,arguments)})},{key:"createCountrySelectList",value:function(t,e,n){var r=document.createElement("select");return r.className=e,t.forEach((function(t){var e=document.createElement("option");e.className=n,e.textContent=t.Country,e.value=t.Country,r.appendChild(e)})),r}},{key:"createCountrySearchList",value:function(t,e,n){var r=document.createElement("div");return r.classList.add(e),t.countries.forEach((function(t){var e=document.createElement("div");e.classList.add(n),e.textContent=t.Country,e.setAttribute("data-country",t.Country),r.appendChild(e)})),r}}])&&n(r.prototype,a),s&&n(r,s),t}();function a(t,e,n,r,a,s,i){try{var o=t[s](i),c=o.value}catch(t){return void n(t)}o.done?e(c):Promise.resolve(c).then(r,a)}function s(t){return function(){var e=this,n=arguments;return new Promise((function(r,s){var i=t.apply(e,n);function o(t){a(i,r,s,o,c,"next",t)}function c(t){a(i,r,s,o,c,"throw",t)}o(void 0)}))}}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.url="../assets/data/populationData.json",this.commonData=[]}var e,n,r,a,o,c,u;return e=t,(n=[{key:"getAllData",value:(u=s(regeneratorRuntime.mark((function t(){var e,n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.commonData.length){t.next=8;break}return t.next=3,fetch(this.url);case 3:return e=t.sent,t.next=6,e.json();case 6:n=t.sent,this.commonData=n;case 8:return t.abrupt("return",this.commonData);case 9:case"end":return t.stop()}}),t,this)}))),function(){return u.apply(this,arguments)})},{key:"getDataByCountry",value:(c=s(regeneratorRuntime.mark((function t(e){var n,r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.commonData.length){t.next=4;break}t.t0=this.commonData,t.next=7;break;case 4:return t.next=6,this.getAllData();case 6:t.t0=t.sent;case 7:return n=t.t0,r=Object.assign({},n.find((function(t){return t.name.toLowerCase()===e.toLowerCase()}))),t.abrupt("return",r);case 10:case"end":return t.stop()}}),t,this)}))),function(t){return c.apply(this,arguments)})},{key:"getCountryPopulation",value:(o=s(regeneratorRuntime.mark((function t(e){var n,r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.commonData.length){t.next=4;break}t.t0=this.commonData,t.next=7;break;case 4:return t.next=6,this.getAllData();case 6:t.t0=t.sent;case 7:return n=t.t0,r=n.find((function(t){return t.name.toLowerCase()===e.toLowerCase()})).population,t.abrupt("return",r);case 10:case"end":return t.stop()}}),t,this)}))),function(t){return o.apply(this,arguments)})},{key:"getCountryFlag",value:(a=s(regeneratorRuntime.mark((function t(e){var n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.commonData.length){t.next=4;break}t.t0=this.commonData,t.next=7;break;case 4:return t.next=6,this.getAllData();case 6:t.t0=t.sent;case 7:return n=t.t0,t.abrupt("return",n.find((function(t){return t.name.toLowerCase()===e})).flag);case 9:case"end":return t.stop()}}),t,this)}))),function(t){return a.apply(this,arguments)})}])&&i(e.prototype,n),r&&i(e,r),t}();function c(t,e,n,r,a,s,i){try{var o=t[s](i),c=o.value}catch(t){return void n(t)}o.done?e(c):Promise.resolve(c).then(r,a)}function u(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var l=function(){function t(e,n,r){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.covidDataMiner=e,this.inputSelector=n,this.dataSelector=r}var e,n,r,a,s;return e=t,(n=[{key:"inputHandler",value:function(t){var e=t.target.value.toLowerCase();document.querySelectorAll(".".concat(this.dataSelector)).forEach((function(t){-1===t.textContent.toLocaleLowerCase().search(e)?t.setAttribute("data-hide",""):t.removeAttribute("data-hide")}))}},{key:"init",value:(a=regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.inputSelector.addEventListener("input",this.inputHandler.bind(this));case 1:case"end":return t.stop()}}),t,this)})),s=function(){var t=this,e=arguments;return new Promise((function(n,r){var s=a.apply(t,e);function i(t){c(s,n,r,i,o,"next",t)}function o(t){c(s,n,r,i,o,"throw",t)}i(void 0)}))},function(){return s.apply(this,arguments)})}])&&u(e.prototype,n),r&&u(e,r),t}();function h(t){return function(t){if(Array.isArray(t))return d(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return d(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return d(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function p(t,e,n,r){var a=document.createElement(t);return e&&a.classList.add(e),n&&(a.id=n),r&&a.setAttribute(r[0],r[1]),a}function f(t,e,n){var r=p("div",t,e);return r.classList.add("switch"),r.innerHTML='\n  <div class="switch__btn">\n  <div class="switch__circle"></div>\n  </div>\n  <span class="switch__title">'.concat(n,"</span>\n  "),r}function v(t,e,n){var r=p("div","tabs"),a=p("div","tabs__nav"),s=p("div","tabs__content"),i=p("div","tabs-nav__item",null,["data-tab-name","cases"]),o=p("div","tabs-nav__item",null,["data-tab-name","deaths"]),c=p("div","tabs-nav__item",null,["data-tab-name","recovered"]);return a.classList.add("tabs-nav"),t.classList.add("active"),i.classList.add("active"),t.classList.add("tab"),e.classList.add("tab"),n.classList.add("tab"),t.setAttribute("data-tab-content","cases"),e.setAttribute("data-tab-content","deaths"),n.setAttribute("data-tab-content","recovered"),i.textContent="Cases",o.textContent="Deaths",c.textContent="Recovered",a.addEventListener("click",(function(t){t.target.dataset.tabName&&(h(a.querySelectorAll(".tabs-nav__item")).forEach((function(t){t.classList.remove("active")})),t.target.classList.add("active"),function(t){var e=s.querySelector('[data-tab-content="'.concat(t,'"]'));h(s.querySelectorAll(".tab")).forEach((function(t){return t.classList.remove("active")})),e.classList.add("active")}(t.target.dataset.tabName))})),s.append(t,e,n),a.append(i,o,c),r.append(a,s),r}var m=p("header","header"),y=p("main","main"),g=p("footer","footer"),w=p("div","map"),b=new function(){this.elem=p("div","statistics"),this.countryName=p("div","statistics__country-name"),this.cases=p("div","statistics__cases"),this.deaths=p("div","statistics__deaths"),this.recovered=p("div","statistics__recovered"),this.periodSwitch=f("statistics__switch","period-switch","daily"),this.dataDisplaySwitch=f("statistics__switch","data-display-switch","per 100k");var t=p("div","statistics__footer"),e=p("div","statistics__content"),n=p("div","statistics__row"),r=p("div","statistics__row"),a=p("div","statistics__row"),s=p("div","statistics__title"),i=p("div","statistics__title"),o=p("div","statistics__title");s.textContent="Cases",i.textContent="Deaths",o.textContent="Recovered",n.append(s,this.cases),r.append(i,this.deaths),a.append(o,this.recovered),this.countryName.textContent="Brazil",this.cases.textContent="1000000",this.deaths.textContent="1000000",this.recovered.textContent="1000000",e.append(n,r,a),t.append(this.periodSwitch,this.dataDisplaySwitch),this.elem.append(this.countryName,e,t)},x=new function(){this.elem=p("div","countries-list"),this.cases=p("div"),this.deaths=p("div"),this.recovered=p("div");var t=v(this.cases,this.deaths,this.recovered);t.classList.add("countries-list__tabs"),this.elem.append(t)},C=new function(){this.elem=p("div","graph"),this.cases=p("div"),this.deaths=p("div"),this.recovered=p("div");var t=v(this.cases,this.deaths,this.recovered);t.classList.add("graph__tabs"),this.elem.append(t)},D=p("input",null,"search",["type","text"]);function _(t,e,n,r,a,s,i){try{var o=t[s](i),c=o.value}catch(t){return void n(t)}o.done?e(c):Promise.resolve(c).then(r,a)}function k(t){return function(){var e=this,n=arguments;return new Promise((function(r,a){var s=t.apply(e,n);function i(t){_(s,r,a,i,o,"next",t)}function o(t){_(s,r,a,i,o,"throw",t)}i(void 0)}))}}m.innerHTML='<span class="header__title">COVID-19 Dashboard</span>',m.append(D),g.textContent="Footer",y.append(x.elem,w,b.elem,C.elem),document.body.append(m,y,g),document.addEventListener("DOMContentLoaded",k(regeneratorRuntime.mark((function t(){var e,n,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=new o,n=new r(e,void 0,x.cases,x.deaths,x.recovered,b.cases,b.deaths,b.recovered,b.countryName),t.next=4,n.init();case 4:return a=new l(n,D,"countries-list__item"),t.next=7,a.init();case 7:document.querySelector("#period-switch").addEventListener("click",k(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.classList.toggle("active"),t.next=3,n.changeIsTotalState();case 3:case"end":return t.stop()}}),t,this)})))),document.querySelector("#data-display-switch").addEventListener("click",k(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.classList.toggle("active"),t.next=3,n.changeIsDividedState();case 3:case"end":return t.stop()}}),t,this)})))),console.log(D,x,b,C,w);case 10:case"end":return t.stop()}}),t)}))))}},e={};function n(r){if(e[r])return e[r].exports;var a=e[r]={exports:{}};return t[r](a,a.exports,n),a.exports}n.m=t,n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},function(){var t={179:0},e=[[1202,202],[4618,202]],r=function(){};function a(){for(var r,a=0;a<e.length;a++){for(var s=e[a],i=!0,o=1;o<s.length;o++){var c=s[o];0!==t[c]&&(i=!1)}i&&(e.splice(a--,1),r=n(n.s=s[0]))}return 0===e.length&&(n.x(),n.x=function(){}),r}n.x=function(){n.x=function(){},i=i.slice();for(var t=0;t<i.length;t++)s(i[t]);return(r=a)()};var s=function(a){for(var s,i,c=a[0],u=a[1],l=a[2],h=a[3],d=0,p=[];d<c.length;d++)i=c[d],n.o(t,i)&&t[i]&&p.push(t[i][0]),t[i]=0;for(s in u)n.o(u,s)&&(n.m[s]=u[s]);for(l&&l(n),o(a);p.length;)p.shift()();return h&&e.push.apply(e,h),r()},i=self.webpackChunk=self.webpackChunk||[],o=i.push.bind(i);i.push=s}(),n.x()}();