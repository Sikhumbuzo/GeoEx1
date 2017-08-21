(function(){(function(b){function a(c){for(var c=c.split("."),q=this,f=c[0]==="window"?1:0;f<c.length;f++)q=q[c[f]]||(q[c[f]]={});return q}var g=a(b);if(!(g.load&&typeof g.load==="function")){var m=function(){return!0},e={},k={},o=function(){for(var c in k)k.hasOwnProperty(c)&&k[c]&&!k[c].cancelled&&k[c].load()},n=function(c,q){for(var f=e[c],d=f?f.length:0;d--;)if(f[d].name===q)return f[d];throw"InvalidArgument: Feature implementation [$1] does not exist in the registry.".replace("$1",c+":"+q);},i=function(c,
d){var f;if(!d||d==="auto")a:{for(var a=(f=e[c])?f.length:0,p=0;p<a;p++)if(f[p].readyState==="complete"||f[p].readyState==="loading"){f=f[p];break a}for(p=0;p<a;p++)if(f[p].detector()){f=f[p];break a}f=null}else f=d==="none"?null:n(c,d);return f},l=function(c){var c=c||m,d={},f,a,p;for(a in e)if(e.hasOwnProperty(a)){f=[];for(p=0;p<e[a].length;p++)c(e[a][p])&&f.push(e[a][p].name);f.length>0&&(d[a]=f)}return d},j,d=0,h=function(c,d,f,a,p,b,h){this.featureName=c;this.name=d;this.loadPath=f;this.detector=
a||m;this.dependencies=p;this.overrides=b;this.charset=h||"UTF-8";this.readyState="uninitialized"};h.prototype={onWrite:function(c){this.readyState="loading";c&&o()},onLoad:function(c){c&&this.onWrite(c);this.readyState="complete";o()},canLoad:function(c,d){for(var f=this.dependencies,a=f?f.length:0,b;a--;){if(c[f[a]]==="none")throw"InvalidState: Feature [$1] requires [$2] but it has been explicitly set to 'none'. Aborting loader.".replace("$1",this.featureName).replace("$2",f[a]);b=i(f[a],c[f[a]]||
"auto");if(!b)throw"InvalidArgument: Feature implementation [$1] does not exist in the registry.".replace("$1",f[a]);if(b.readyState==="uninitialized"||!d&&b.readyState==="loading")return!1}return!0},writeSync:function(c){this.readyState="loading";c.write('<script type="text/javascript" charset="$ENC$" src="$SRC$"><\/script>'.replace("$SRC$",this.loadPath).replace("$ENC$",this.charset));this.onLoad(!0)},writeAsync:function(c,d,f){this.readyState="loading";var a=this,b=c.createElement("script");d&&
(b.async=!1);b.type="text/javascript";b.charset=this.charset;b.onload=b.onreadystatechange=function(){var f=b.readyState;if(!f||/^(?:loaded|complete)$/i.test(f))b.onload=b.onreadystatechange=null,a.onLoadCallback&&a.onLoadCallback(c),a.onLoad(d)};b.onerror=function(c){f(c)};b.src=this.loadPath;c.getElementsByTagName("head")[0].appendChild(b);this.onWrite(d)}};h.prototype.featureName=null;h.prototype.onLoadCallback=h.prototype.onLoadCallback;h.prototype.readyState=null;var r=function(c){this.matrix=
c};r.prototype={resolve:function(c,d){var f={},a,b=this.matrix,h=c.length,i,j,l;if(d)for(a in d)f[a]=d[a];for(;h--;)for(i=(a=b[c[h]])?a.length:0;i--;)l=a[i]&&a[i].split("="),j=l[0],e[j]&&this.addToMap(l[0],l.length===2?l[1]:null,f);return f},addToMap:function(c,d,a){!d&&!a[c]?a[c]="auto":!a[c]||a[c]=="auto"?a[c]=d:this.doesOverride(c,d,a[c])&&(a[c]=d)},doesOverride:function(c,d,a){if(!d)return!1;var b=(c=n(c,d).overrides)&&c.length;if(!c)throw"InvalidState: Cannot resolve package conflict between [$1] and [$2]. There is no override specification.".replace("$1",
d).replace("$2",a);for(;b--;)if(c[b]===a)return!0;return!1}};var s=function(c,a,b,h,i){h=h||document;this.requested=c;this.onSuccess=a||m;this.onError=b||function(c){throw c;};this.doc=h;i===void 0?(this.inHead=h.readyState!=="complete",this.writeSync=j==null?j=h.createElement("script").async:j):this.inHead=this.writeSync=i;this.id=d++;k[this.id]=this};s.prototype={onFinished:function(c){delete k[this.id];if(c)this.onError(c);else this.onSuccess()},load:function(){var c=this.requested,a,d,b=!0,h=
this;try{for(d in c)e[d]&&(a=i(d,c[d]))&&this.loadSingle(a,c,this.inHead,this.writeSync,function(c){h.onFinished(c)})&&(b=!1);b&&this.onDone()}catch(l){this.onFinished(l),this.onFinished=m}},onDone:function(){if(!this.done){var c=this;this.inHead||window.setTimeout(function(){c.onFinished()},1);this.done=!0}},loadSingle:function(c,d,a,b,h){if(c.readyState==="complete")return!1;else if(c.readyState==="loading")return!0;var e,l;if(c.canLoad(d,b))a?c.writeSync(this.doc,this.id,h):c.writeAsync(this.doc,
b,h);else{c=c.dependencies;for(e=c.length;e--;)l=i(c[e],d[c[e]]||"auto"),this.loadSingle(l,d,a,b,h)}return!0}};s.prototype.onFinished=s.prototype.onFinished;s.prototype.id=null;s.prototype.doc=null;g.loaders=k;g.features=e;g._detectors={};g.get=i;g.add=function(c,d,a,b,i,l,j){if(!c||!d||!a)throw"InvalidArgument: A feature implementation must have at least a feature name, name and a loadPath.";(e[c]||(e[c]=[])).push(new h(c,d,a,b,i,l,j))};g.isLoaded=function(c,d){return n(c,d).readyState==="complete"};
g.load=function(c,d,a,b,h){(new s(c,d,a,b,h)).load()};g.getFeatureMap=function(){return l(function(c){return c.featureName!="base"})};g.getLoadedMap=function(){return l(function(c){return c.featureName!="base"&&c.readyState==="complete"})};g.setFeatureMatrix=function(c){g.featureMatrix=new r(c)};g.getFeaturesFromMatrix=function(c,d){return g.featureMatrix.resolve(c,d)};a("nokia.maps").Features=g}})("nokia.Features");
(function(b,a){var g=b.split(".")[0],m=b.split(".")[1],e,k=function(a){var b={},e;for(e=a.length;e--;){var d=a[e].split(" "),h=d[0],g={};g.key=h;g.iso639_1=h.substr(0,2);g.marc=d[1];g.locale=d[2];b[h]=g}return b}(["al ALB","ar ARA ar-SA","be BEL","bg BUL bg-BG","bn BEN","bs BOS","ca CAT","cs CZE cs-CZ","cy WEL","da DAN da-DK","de GER de-DE","el GRE el-GR","en ENG en-GB","en-us ENG en-US","es SPA es-ES","eu BAQ","et EST et-EE","fa IRN fa-IR","fi FIN fi-FI","fr FRE fr-FR","ga GLE","gl GLG","hi IND hi-IN",
"he HBR","hr SCR hr-HR","hu HUN hu-HU","id IND id-ID","id-id IND id-ID","in-id IND id-ID","is ICE is-IS","it ITA it-IT","ja JPN","km KHM","ko KOR ko-KR","ky KIR","lt LIT lt-LT","lv LAV lv-LV","me MNE","mi MAO","mk MAC","mn MON","mo MOL","ms MAY ms-MY","nl DUT nl-NL","no NOR no-NO","pl POL pl-PL","pt POR pt-PT","pt-br BRA pt-BR","py PYN","ro RUM ro-RO","ru RUS ru-RU","sk SLO sk-SK","sl SLV","sr SRB sr-RS","sv SWE sv-SE","sw SWA","ta TAM","th THA th-TH","tl PHL tl-PH","tr TUR tr-TR","uk UKR uk-UA",
"ur PAK ur-PK","vi VNM vi-VN","zh CHI zh-CN"]),o,n;a[g]||(a[g]={});e=a[g];e.Language={definitions:k,detect:function(a){var b=e.Features&&e.Features.getFeatureMap().language||["en-US"],g=b?b.length:0,d,h={},m=[];if(!o){for(n=b&&b.length>0?b[0]:"en-US";g--;)if(d=b[g].toLowerCase(),(d=this.getDefinition(d))&&d.locale&&!h[d.key])h[d.key]=d,m.push(d.locale);o=h}return a==="none"?"en-US":this.autoDetect(a)},autoDetect:function(a){var b=n,a=this.getDefinition(!a||a==="auto"?ovi.browser.language||b:a,o);
if(!a||!a.locale)a=this.getDefinition(b,o);return a.locale},getDefinition:function(a,b){var b=b||this.definitions,e=a.toLowerCase();return e.length>=2?b[e]||b[e.substr(0,2)]:null},a:function(){nokia.maps.resources={};nokia.maps.resources.ui={};nokia.maps.resources.ui.i18n={}},setTranslations:function(a){var a=this.getDefinition(a),b=a.locale,e=b.substr(0,2).toLowerCase(),b=b.substr(3,2).toUpperCase(),d;nokia.maps.resources||this.a();d=nokia.maps.resources.ui.i18n;if(d[e]&&d[e][b])this.translations=
(new Function("return "+d[e][b].translation.json+";"))(),this.language=a}};m?(e[m]=e[m]||{},e[m].language={},e[m].language.Info=e.Language):(e.language={},e.language.Info=e.Language)})("nokia.maps",this);(function(){var b=[0.1];b.pop();b.push("");if(b[0]!==""){var a=function(a,b){var e=a[b];a[b]=function(){this.length||(this[0]="")||(this.length=0);return e.apply(this,arguments)}},b=Array.prototype;a(b,"push");a(b,"splice")}})();
(function(b,a){function g(a){var b=j[a];return function(a){e.Settings[b]=a}}var m=b.split(".")[0],e,k={},o,n,i=!1,l,j={appId:"app_id",authenticationToken:"app_code",app_id:"appId",app_code:"authenticationToken"};a[m]||(a[m]={});e=a[m];n=e.Features;o=e.Language;e.Settings=m={addObserver:function(a,b,e){(k[a]?k[a]:k[a]=[]).push({callback:b,context:e})},removeObserver:function(a,b,e){var a=k[a],g,c=0;if(a)for(g=a.length;c<g;)a[c]===b&&a[c+1]===e&&a.splice(c,2),c+=2},set:function(a,b,e){var g=this[a];
this[a]=this[a+"Setter"]?this[a+"Setter"](b):b;this.b(a,b,g,e)},b:function(a,b,e,g){if((a=k[a])&&(e!==b||g))for(g=a.length;e=a[--g];)e.callback.call(e.context||null,b)},lockLanguage:function(){i=!0},defaultLanguageSetter:function(a){var b;if(i)throw Error("Illegal: defaultLanguage cannot be set after a display was initialized");a=nokia.maps.config&&nokia.maps.config["language.overrideDetection"]?a==="auto"?o.detect(a):a:o.detect(a)||"en-US";try{b=n&&!n.isLoaded("language",a)}catch(e){b=!0}b?(b=n.getLoadedMap(),
n.load({language:a},null,null,null,!b.language||b.language.length===0?void 0:!1)):o.setTranslations(a);return a},languageLoaded:function(a){var b=i;b&&(i=!1);o.setTranslations(a);this.set("defaultLanguage",a,!0);b&&(i=!0)},defaultLanguage:"",appId:"",authenticationToken:"",app_id:"",app_code:""};for(l in j)j.hasOwnProperty(l)&&m.addObserver(l,g(l))})("nokia.maps",this);nokia.maps.Features._detectors["clustering-clustering"]=function(){return!0};nokia.maps.Features._detectors["heatmap-heatmap"]=function(){return!0};
nokia.maps.Features._detectors["ui-ovi_web"]=function(){return!0};nokia.maps.Features._detectors["ui-nokia_generic"]=function(){var b=navigator.userAgent.toLowerCase(),a=function(){var a=document.createElement("canvas");if(!a||!a.getContext)return!1;return typeof a.getContext("2d").fillText==="function"}(),g=document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"),m=b.match(/msie/)&&!window.opera&&!a,b=b.match(/msie\s7/);return a||g||m&&!b};
nokia.maps.Features._detectors["routing-nlp"]=function(){return!0};nokia.maps.Features._detectors["positioning-w3c"]=function(){var b=!1;try{b=!(!navigator||!(navigator.geolocation&&typeof navigator.geolocation.getCurrentPosition==="function"))}catch(a){}return b};nokia.maps.Features._detectors["behavior-touch"]=function(){return!0};nokia.maps.Features._detectors["behavior-all"]=function(){return!0};nokia.maps.Features._detectors["map-render-display"]=function(){return!0};
nokia.maps.Features._detectors["gfx-vml"]=function(){return!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")};nokia.maps.Features._detectors["gfx-svg"]=function(){return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")};
nokia.maps.Features._detectors["gfx-canvas"]=function(){var b=document.createElement("canvas");if(!b||!b.getContext)return!1;b=b.getContext("2d");return!/MSIE (\d+\.\d+);/.test(navigator.userAgent)&&typeof b.fillText==="function"};nokia.maps.Features._detectors["kml-kml"]=function(){return!0};this.nokia.maps=this.nokia.maps||{};this.nokia.maps.build="nokiamapsapi-2.5.1-Ariel-20130617-w24-r21a36afa049dd16d5c33ee8a7d7b85c88e28553e";
(function(b){var a=b.config||{};a.reporter={full:"http://mapcreator.nokia.com/mapfeedback/widget/1.1.6/"};a.packages=a.packages||{routing:[{name:"nlp",dependencies:["map"]}],positioning:[{name:"w3c"}],map:[{name:"render-display",dependencies:["gfx"]}],behavior:[{name:"all"},{name:"touch"}],gfx:[{name:"canvas"},{name:"svg"},{name:"vml"}],ui:[{name:"nokia_generic",dependencies:["gfx","map"]},{name:"ovi_web",dependencies:["map"]}],language:[{name:"en-US"},{name:"en-GB"},{name:"de-DE"},{name:"es-ES"},
{name:"zh-CN"},{name:"fr-FR"},{name:"ru-RU"},{name:"it-IT"}],kml:[{name:"kml"}],heatmap:[{name:"heatmap",dependencies:["map"]}],clustering:[{name:"clustering",dependencies:["map"]}]};(function(){try{var a=document.createElement("canvas");return!(!window.WebGLRenderingContext||!a.getContext("webgl")&&!a.getContext("experimental-webgl"))}catch(b){return!1}})();a.excludePackaging={advsearch:1,advertising:1,advrouting:1,search:1};a.externalPackages=a.externalPackages||{places:[{name:"dataonly",url:a.places?
a.places.devPath:null,fileName:"jsPlacesDataAPI.js",detector:function(){return!nokia.places},overrides:[]},{name:"withui",url:a.places?a.places.devPath:null,fileName:"jsPlacesAPI.js",detector:function(){return!(nokia.places&&nokia.places.ui)},overrides:["dataonly"]}],reporter:[{name:"default",url:a.reporter?a.reporter.full:null,fileName:"mapfeedback.js",detector:function(){return!0},dependencies:["places","ui"],overrides:[]}]};a.featureMatrix=a.featureMatrix||{maps:["gfx","behavior","map","positioning",
"ui","places"],positions:["gfx","behavior","map","positioning","ui","places"],places:["places=withui"],placesdata:["places=dataonly"],directions:["gfx","behavior","map","positioning","routing","ui","places"],datarendering:["gfx","behavior","map","ui","places","kml","heatmap","clustering"],all:["gfx","behavior","map","ui","positioning","routing","places=withui","kml","heatmap","clustering"]};a.advertisement=a.advertisement||{endpoint:"http://onboard.lcpapi.lpaweb.net/nmg/",properties:{os:"js",device:"desktop",
pub:"grouptest",app:"nokiamaps",output:"json"}};a.routing=a.routing||{baseUrl:"http://route.nlp.nokia.com/routing/7.2/",protocol:"nokia.maps.routing.navteq.protocolV72"};a.assetsPath=a.assetsPath||"assets/ovi/mapsapi";a.adbarCss=a.adbarCss||"adbar.css";a.tileProviders=a.tileProviders||"nokia.maps.map.js.nlpTileProviders";a.copyright=a.copyright||"nokia.maps.map._Copyright";a["language.warnOnMissingTranslation"]=a["language.warnOnMissingTranslation"]||!1;a.includePlaces=!0;b.config=a})(this.nokia.maps);
nokia.maps.config=this.nokia.maps.config;
(function(b){function a(a){d=a.dependencies||[];d.push("base");l=n+"-"+a.name;h.add(n,a.name,e+l+".js",h._detectors[l],d,a.overrides)}function g(a){for(var b=/([\\?&]([^=]+)=([^&#]+))/g,d,e={};d=b.exec(a);)e[d[2]]=d[3];return e}function m(){if(o["jsl.js"])return o["jsl.js"];for(var a="jsl.js".replace(".","\\."),b=document.getElementsByTagName("script"),d=b.length,a=RegExp("^(.*\\/"+a+".*|"+a+".*)");d--;)if(a.test(b[d].src))return o["jsl.js"]=b[d].src,o["jsl.js"];throw"InternalError: could not locate jsl.js in the environment.";
}var e,k,o={};if(!b.developmentMode&&!b.assetsPath)throw"Internal Error: no asset path has been specified";e=b.loadPath||function(a){a=a.split("/").slice(0,-1);return a.join("/")+(a.length>0?"/":"")}(m());k=b.params||g(m());var n,i,l,j,d,h=nokia.maps.Features,r=this;for(n in b.packages){i=b.packages[n];for(j=0;j<i.length;j++)a(i[j])}if(b.externalPackages)for(n in b.externalPackages){i=b.externalPackages[n];for(j=0;j<i.length;j++)h.add(n,i[j].name,(i[j].url?i[j].url:e)+i[j].fileName,i[j].detector,
i[j].dependencies,i[j].overrides)}h.add("base","noovi",e+"base_noovi.js",function(){return r.ovi&&r.ovi.win});h.add("base","withovi",e+"base.js",function(){return!r.ovi||!r.ovi.win});b.params=k;b.baseUrl=e;b.featureMatrix?(h.setFeatureMatrix(b.featureMatrix),b=k["with"]?k["with"].split(","):["maps"],delete k["with"],b=h.getFeaturesFromMatrix(b,k)):b=k;k.blank||h.load(b,null,function(a){throw a;})})(this.nokia.maps.config);})();
