var Dv=Object.defineProperty;var Iv=(n,e,t)=>e in n?Dv(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var P=(n,e,t)=>Iv(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();var Lm={exports:{}},jl={},Dm={exports:{}},He={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ko=Symbol.for("react.element"),Nv=Symbol.for("react.portal"),Uv=Symbol.for("react.fragment"),zv=Symbol.for("react.strict_mode"),Fv=Symbol.for("react.profiler"),kv=Symbol.for("react.provider"),Ov=Symbol.for("react.context"),Bv=Symbol.for("react.forward_ref"),Hv=Symbol.for("react.suspense"),Vv=Symbol.for("react.memo"),Gv=Symbol.for("react.lazy"),ud=Symbol.iterator;function Wv(n){return n===null||typeof n!="object"?null:(n=ud&&n[ud]||n["@@iterator"],typeof n=="function"?n:null)}var Im={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Nm=Object.assign,Um={};function Xs(n,e,t){this.props=n,this.context=e,this.refs=Um,this.updater=t||Im}Xs.prototype.isReactComponent={};Xs.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};Xs.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function zm(){}zm.prototype=Xs.prototype;function jh(n,e,t){this.props=n,this.context=e,this.refs=Um,this.updater=t||Im}var Yh=jh.prototype=new zm;Yh.constructor=jh;Nm(Yh,Xs.prototype);Yh.isPureReactComponent=!0;var hd=Array.isArray,Fm=Object.prototype.hasOwnProperty,qh={current:null},km={key:!0,ref:!0,__self:!0,__source:!0};function Om(n,e,t){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Fm.call(e,i)&&!km.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=t;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(n&&n.defaultProps)for(i in a=n.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:Ko,type:n,key:s,ref:o,props:r,_owner:qh.current}}function Xv(n,e){return{$$typeof:Ko,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function $h(n){return typeof n=="object"&&n!==null&&n.$$typeof===Ko}function jv(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var fd=/\/+/g;function vc(n,e){return typeof n=="object"&&n!==null&&n.key!=null?jv(""+n.key):e.toString(36)}function Ka(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case Ko:case Nv:o=!0}}if(o)return o=n,r=r(o),n=i===""?"."+vc(o,0):i,hd(r)?(t="",n!=null&&(t=n.replace(fd,"$&/")+"/"),Ka(r,e,t,"",function(c){return c})):r!=null&&($h(r)&&(r=Xv(r,t+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(fd,"$&/")+"/")+n)),e.push(r)),1;if(o=0,i=i===""?".":i+":",hd(n))for(var a=0;a<n.length;a++){s=n[a];var l=i+vc(s,a);o+=Ka(s,e,t,l,r)}else if(l=Wv(n),typeof l=="function")for(n=l.call(n),a=0;!(s=n.next()).done;)s=s.value,l=i+vc(s,a++),o+=Ka(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function la(n,e,t){if(n==null)return n;var i=[],r=0;return Ka(n,i,"","",function(s){return e.call(t,s,r++)}),i}function Yv(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var on={current:null},Za={transition:null},qv={ReactCurrentDispatcher:on,ReactCurrentBatchConfig:Za,ReactCurrentOwner:qh};function Bm(){throw Error("act(...) is not supported in production builds of React.")}He.Children={map:la,forEach:function(n,e,t){la(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return la(n,function(){e++}),e},toArray:function(n){return la(n,function(e){return e})||[]},only:function(n){if(!$h(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};He.Component=Xs;He.Fragment=Uv;He.Profiler=Fv;He.PureComponent=jh;He.StrictMode=zv;He.Suspense=Hv;He.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=qv;He.act=Bm;He.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=Nm({},n.props),r=n.key,s=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=qh.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var a=n.type.defaultProps;for(l in e)Fm.call(e,l)&&!km.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:Ko,type:n.type,key:r,ref:s,props:i,_owner:o}};He.createContext=function(n){return n={$$typeof:Ov,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:kv,_context:n},n.Consumer=n};He.createElement=Om;He.createFactory=function(n){var e=Om.bind(null,n);return e.type=n,e};He.createRef=function(){return{current:null}};He.forwardRef=function(n){return{$$typeof:Bv,render:n}};He.isValidElement=$h;He.lazy=function(n){return{$$typeof:Gv,_payload:{_status:-1,_result:n},_init:Yv}};He.memo=function(n,e){return{$$typeof:Vv,type:n,compare:e===void 0?null:e}};He.startTransition=function(n){var e=Za.transition;Za.transition={};try{n()}finally{Za.transition=e}};He.unstable_act=Bm;He.useCallback=function(n,e){return on.current.useCallback(n,e)};He.useContext=function(n){return on.current.useContext(n)};He.useDebugValue=function(){};He.useDeferredValue=function(n){return on.current.useDeferredValue(n)};He.useEffect=function(n,e){return on.current.useEffect(n,e)};He.useId=function(){return on.current.useId()};He.useImperativeHandle=function(n,e,t){return on.current.useImperativeHandle(n,e,t)};He.useInsertionEffect=function(n,e){return on.current.useInsertionEffect(n,e)};He.useLayoutEffect=function(n,e){return on.current.useLayoutEffect(n,e)};He.useMemo=function(n,e){return on.current.useMemo(n,e)};He.useReducer=function(n,e,t){return on.current.useReducer(n,e,t)};He.useRef=function(n){return on.current.useRef(n)};He.useState=function(n){return on.current.useState(n)};He.useSyncExternalStore=function(n,e,t){return on.current.useSyncExternalStore(n,e,t)};He.useTransition=function(){return on.current.useTransition()};He.version="18.3.1";Dm.exports=He;var ut=Dm.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $v=ut,Kv=Symbol.for("react.element"),Zv=Symbol.for("react.fragment"),Qv=Object.prototype.hasOwnProperty,Jv=$v.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,e_={key:!0,ref:!0,__self:!0,__source:!0};function Hm(n,e,t){var i,r={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Qv.call(e,i)&&!e_.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Kv,type:n,key:s,ref:o,props:r,_owner:Jv.current}}jl.Fragment=Zv;jl.jsx=Hm;jl.jsxs=Hm;Lm.exports=jl;var O=Lm.exports,Vm={exports:{}},En={},Gm={exports:{}},Wm={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(N,K){var J=N.length;N.push(K);e:for(;0<J;){var ae=J-1>>>1,Me=N[ae];if(0<r(Me,K))N[ae]=K,N[J]=Me,J=ae;else break e}}function t(N){return N.length===0?null:N[0]}function i(N){if(N.length===0)return null;var K=N[0],J=N.pop();if(J!==K){N[0]=J;e:for(var ae=0,Me=N.length,je=Me>>>1;ae<je;){var j=2*(ae+1)-1,ie=N[j],he=j+1,fe=N[he];if(0>r(ie,J))he<Me&&0>r(fe,ie)?(N[ae]=fe,N[he]=J,ae=he):(N[ae]=ie,N[j]=J,ae=j);else if(he<Me&&0>r(fe,J))N[ae]=fe,N[he]=J,ae=he;else break e}}return K}function r(N,K){var J=N.sortIndex-K.sortIndex;return J!==0?J:N.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();n.unstable_now=function(){return o.now()-a}}var l=[],c=[],u=1,h=null,d=3,p=!1,_=!1,x=!1,m=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function v(N){for(var K=t(c);K!==null;){if(K.callback===null)i(c);else if(K.startTime<=N)i(c),K.sortIndex=K.expirationTime,e(l,K);else break;K=t(c)}}function M(N){if(x=!1,v(N),!_)if(t(l)!==null)_=!0,W(b);else{var K=t(c);K!==null&&q(M,K.startTime-N)}}function b(N,K){_=!1,x&&(x=!1,f(L),L=-1),p=!0;var J=d;try{for(v(K),h=t(l);h!==null&&(!(h.expirationTime>K)||N&&!D());){var ae=h.callback;if(typeof ae=="function"){h.callback=null,d=h.priorityLevel;var Me=ae(h.expirationTime<=K);K=n.unstable_now(),typeof Me=="function"?h.callback=Me:h===t(l)&&i(l),v(K)}else i(l);h=t(l)}if(h!==null)var je=!0;else{var j=t(c);j!==null&&q(M,j.startTime-K),je=!1}return je}finally{h=null,d=J,p=!1}}var A=!1,T=null,L=-1,w=5,y=-1;function D(){return!(n.unstable_now()-y<w)}function H(){if(T!==null){var N=n.unstable_now();y=N;var K=!0;try{K=T(!0,N)}finally{K?C():(A=!1,T=null)}}else A=!1}var C;if(typeof g=="function")C=function(){g(H)};else if(typeof MessageChannel<"u"){var X=new MessageChannel,Y=X.port2;X.port1.onmessage=H,C=function(){Y.postMessage(null)}}else C=function(){m(H,0)};function W(N){T=N,A||(A=!0,C())}function q(N,K){L=m(function(){N(n.unstable_now())},K)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(N){N.callback=null},n.unstable_continueExecution=function(){_||p||(_=!0,W(b))},n.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w=0<N?Math.floor(1e3/N):5},n.unstable_getCurrentPriorityLevel=function(){return d},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(N){switch(d){case 1:case 2:case 3:var K=3;break;default:K=d}var J=d;d=K;try{return N()}finally{d=J}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(N,K){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var J=d;d=N;try{return K()}finally{d=J}},n.unstable_scheduleCallback=function(N,K,J){var ae=n.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?ae+J:ae):J=ae,N){case 1:var Me=-1;break;case 2:Me=250;break;case 5:Me=1073741823;break;case 4:Me=1e4;break;default:Me=5e3}return Me=J+Me,N={id:u++,callback:K,priorityLevel:N,startTime:J,expirationTime:Me,sortIndex:-1},J>ae?(N.sortIndex=J,e(c,N),t(l)===null&&N===t(c)&&(x?(f(L),L=-1):x=!0,q(M,J-ae))):(N.sortIndex=Me,e(l,N),_||p||(_=!0,W(b))),N},n.unstable_shouldYield=D,n.unstable_wrapCallback=function(N){var K=d;return function(){var J=d;d=K;try{return N.apply(this,arguments)}finally{d=J}}}})(Wm);Gm.exports=Wm;var t_=Gm.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n_=ut,Sn=t_;function te(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Xm=new Set,Lo={};function kr(n,e){Is(n,e),Is(n+"Capture",e)}function Is(n,e){for(Lo[n]=e,n=0;n<e.length;n++)Xm.add(e[n])}var wi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Mu=Object.prototype.hasOwnProperty,i_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,dd={},pd={};function r_(n){return Mu.call(pd,n)?!0:Mu.call(dd,n)?!1:i_.test(n)?pd[n]=!0:(dd[n]=!0,!1)}function s_(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function o_(n,e,t,i){if(e===null||typeof e>"u"||s_(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function an(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Gt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Gt[n]=new an(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Gt[e]=new an(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Gt[n]=new an(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Gt[n]=new an(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Gt[n]=new an(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Gt[n]=new an(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Gt[n]=new an(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Gt[n]=new an(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Gt[n]=new an(n,5,!1,n.toLowerCase(),null,!1,!1)});var Kh=/[\-:]([a-z])/g;function Zh(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(Kh,Zh);Gt[e]=new an(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(Kh,Zh);Gt[e]=new an(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(Kh,Zh);Gt[e]=new an(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Gt[n]=new an(n,1,!1,n.toLowerCase(),null,!1,!1)});Gt.xlinkHref=new an("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Gt[n]=new an(n,1,!1,n.toLowerCase(),null,!0,!0)});function Qh(n,e,t,i){var r=Gt.hasOwnProperty(e)?Gt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(o_(e,t,r,i)&&(t=null),i||r===null?r_(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var bi=n_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ca=Symbol.for("react.element"),ls=Symbol.for("react.portal"),cs=Symbol.for("react.fragment"),Jh=Symbol.for("react.strict_mode"),Su=Symbol.for("react.profiler"),jm=Symbol.for("react.provider"),Ym=Symbol.for("react.context"),ef=Symbol.for("react.forward_ref"),Eu=Symbol.for("react.suspense"),wu=Symbol.for("react.suspense_list"),tf=Symbol.for("react.memo"),Oi=Symbol.for("react.lazy"),qm=Symbol.for("react.offscreen"),md=Symbol.iterator;function Js(n){return n===null||typeof n!="object"?null:(n=md&&n[md]||n["@@iterator"],typeof n=="function"?n:null)}var gt=Object.assign,_c;function fo(n){if(_c===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);_c=e&&e[1]||""}return`
`+_c+n}var xc=!1;function yc(n,e){if(!n||xc)return"";xc=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(n,[],e)}else{try{e.call()}catch(c){i=c}n.call(e.prototype)}else{try{throw Error()}catch(c){i=c}n()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=o&&0<=a);break}}}finally{xc=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?fo(n):""}function a_(n){switch(n.tag){case 5:return fo(n.type);case 16:return fo("Lazy");case 13:return fo("Suspense");case 19:return fo("SuspenseList");case 0:case 2:case 15:return n=yc(n.type,!1),n;case 11:return n=yc(n.type.render,!1),n;case 1:return n=yc(n.type,!0),n;default:return""}}function Tu(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case cs:return"Fragment";case ls:return"Portal";case Su:return"Profiler";case Jh:return"StrictMode";case Eu:return"Suspense";case wu:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case Ym:return(n.displayName||"Context")+".Consumer";case jm:return(n._context.displayName||"Context")+".Provider";case ef:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case tf:return e=n.displayName||null,e!==null?e:Tu(n.type)||"Memo";case Oi:e=n._payload,n=n._init;try{return Tu(n(e))}catch{}}return null}function l_(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Tu(e);case 8:return e===Jh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function rr(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function $m(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function c_(n){var e=$m(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function ua(n){n._valueTracker||(n._valueTracker=c_(n))}function Km(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=$m(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function ml(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Au(n,e){var t=e.checked;return gt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function gd(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=rr(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Zm(n,e){e=e.checked,e!=null&&Qh(n,"checked",e,!1)}function Cu(n,e){Zm(n,e);var t=rr(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?Ru(n,e.type,t):e.hasOwnProperty("defaultValue")&&Ru(n,e.type,rr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function vd(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function Ru(n,e,t){(e!=="number"||ml(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var po=Array.isArray;function Es(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+rr(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function bu(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(te(91));return gt({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function _d(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(te(92));if(po(t)){if(1<t.length)throw Error(te(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:rr(t)}}function Qm(n,e){var t=rr(e.value),i=rr(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function xd(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function Jm(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Pu(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?Jm(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var ha,e0=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(ha=ha||document.createElement("div"),ha.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=ha.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function Do(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var _o={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},u_=["Webkit","ms","Moz","O"];Object.keys(_o).forEach(function(n){u_.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),_o[e]=_o[n]})});function t0(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||_o.hasOwnProperty(n)&&_o[n]?(""+e).trim():e+"px"}function n0(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=t0(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var h_=gt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Lu(n,e){if(e){if(h_[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(te(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(te(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(te(61))}if(e.style!=null&&typeof e.style!="object")throw Error(te(62))}}function Du(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Iu=null;function nf(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Nu=null,ws=null,Ts=null;function yd(n){if(n=Jo(n)){if(typeof Nu!="function")throw Error(te(280));var e=n.stateNode;e&&(e=Zl(e),Nu(n.stateNode,n.type,e))}}function i0(n){ws?Ts?Ts.push(n):Ts=[n]:ws=n}function r0(){if(ws){var n=ws,e=Ts;if(Ts=ws=null,yd(n),e)for(n=0;n<e.length;n++)yd(e[n])}}function s0(n,e){return n(e)}function o0(){}var Mc=!1;function a0(n,e,t){if(Mc)return n(e,t);Mc=!0;try{return s0(n,e,t)}finally{Mc=!1,(ws!==null||Ts!==null)&&(o0(),r0())}}function Io(n,e){var t=n.stateNode;if(t===null)return null;var i=Zl(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(te(231,e,typeof t));return t}var Uu=!1;if(wi)try{var eo={};Object.defineProperty(eo,"passive",{get:function(){Uu=!0}}),window.addEventListener("test",eo,eo),window.removeEventListener("test",eo,eo)}catch{Uu=!1}function f_(n,e,t,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(t,c)}catch(u){this.onError(u)}}var xo=!1,gl=null,vl=!1,zu=null,d_={onError:function(n){xo=!0,gl=n}};function p_(n,e,t,i,r,s,o,a,l){xo=!1,gl=null,f_.apply(d_,arguments)}function m_(n,e,t,i,r,s,o,a,l){if(p_.apply(this,arguments),xo){if(xo){var c=gl;xo=!1,gl=null}else throw Error(te(198));vl||(vl=!0,zu=c)}}function Or(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function l0(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function Md(n){if(Or(n)!==n)throw Error(te(188))}function g_(n){var e=n.alternate;if(!e){if(e=Or(n),e===null)throw Error(te(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return Md(r),n;if(s===i)return Md(r),e;s=s.sibling}throw Error(te(188))}if(t.return!==i.return)t=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===t){o=!0,t=r,i=s;break}if(a===i){o=!0,i=r,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,i=r;break}if(a===i){o=!0,i=s,t=r;break}a=a.sibling}if(!o)throw Error(te(189))}}if(t.alternate!==i)throw Error(te(190))}if(t.tag!==3)throw Error(te(188));return t.stateNode.current===t?n:e}function c0(n){return n=g_(n),n!==null?u0(n):null}function u0(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=u0(n);if(e!==null)return e;n=n.sibling}return null}var h0=Sn.unstable_scheduleCallback,Sd=Sn.unstable_cancelCallback,v_=Sn.unstable_shouldYield,__=Sn.unstable_requestPaint,St=Sn.unstable_now,x_=Sn.unstable_getCurrentPriorityLevel,rf=Sn.unstable_ImmediatePriority,f0=Sn.unstable_UserBlockingPriority,_l=Sn.unstable_NormalPriority,y_=Sn.unstable_LowPriority,d0=Sn.unstable_IdlePriority,Yl=null,si=null;function M_(n){if(si&&typeof si.onCommitFiberRoot=="function")try{si.onCommitFiberRoot(Yl,n,void 0,(n.current.flags&128)===128)}catch{}}var Yn=Math.clz32?Math.clz32:w_,S_=Math.log,E_=Math.LN2;function w_(n){return n>>>=0,n===0?32:31-(S_(n)/E_|0)|0}var fa=64,da=4194304;function mo(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function xl(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,o=t&268435455;if(o!==0){var a=o&~r;a!==0?i=mo(a):(s&=o,s!==0&&(i=mo(s)))}else o=t&~r,o!==0?i=mo(o):s!==0&&(i=mo(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-Yn(e),r=1<<t,i|=n[t],e&=~r;return i}function T_(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function A_(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var o=31-Yn(s),a=1<<o,l=r[o];l===-1?(!(a&t)||a&i)&&(r[o]=T_(a,e)):l<=e&&(n.expiredLanes|=a),s&=~a}}function Fu(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function p0(){var n=fa;return fa<<=1,!(fa&4194240)&&(fa=64),n}function Sc(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function Zo(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-Yn(e),n[e]=t}function C_(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-Yn(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function sf(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-Yn(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var nt=0;function m0(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var g0,of,v0,_0,x0,ku=!1,pa=[],qi=null,$i=null,Ki=null,No=new Map,Uo=new Map,Hi=[],R_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ed(n,e){switch(n){case"focusin":case"focusout":qi=null;break;case"dragenter":case"dragleave":$i=null;break;case"mouseover":case"mouseout":Ki=null;break;case"pointerover":case"pointerout":No.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Uo.delete(e.pointerId)}}function to(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Jo(e),e!==null&&of(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function b_(n,e,t,i,r){switch(e){case"focusin":return qi=to(qi,n,e,t,i,r),!0;case"dragenter":return $i=to($i,n,e,t,i,r),!0;case"mouseover":return Ki=to(Ki,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return No.set(s,to(No.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Uo.set(s,to(Uo.get(s)||null,n,e,t,i,r)),!0}return!1}function y0(n){var e=Tr(n.target);if(e!==null){var t=Or(e);if(t!==null){if(e=t.tag,e===13){if(e=l0(t),e!==null){n.blockedOn=e,x0(n.priority,function(){v0(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Qa(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=Ou(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);Iu=i,t.target.dispatchEvent(i),Iu=null}else return e=Jo(t),e!==null&&of(e),n.blockedOn=t,!1;e.shift()}return!0}function wd(n,e,t){Qa(n)&&t.delete(e)}function P_(){ku=!1,qi!==null&&Qa(qi)&&(qi=null),$i!==null&&Qa($i)&&($i=null),Ki!==null&&Qa(Ki)&&(Ki=null),No.forEach(wd),Uo.forEach(wd)}function no(n,e){n.blockedOn===e&&(n.blockedOn=null,ku||(ku=!0,Sn.unstable_scheduleCallback(Sn.unstable_NormalPriority,P_)))}function zo(n){function e(r){return no(r,n)}if(0<pa.length){no(pa[0],n);for(var t=1;t<pa.length;t++){var i=pa[t];i.blockedOn===n&&(i.blockedOn=null)}}for(qi!==null&&no(qi,n),$i!==null&&no($i,n),Ki!==null&&no(Ki,n),No.forEach(e),Uo.forEach(e),t=0;t<Hi.length;t++)i=Hi[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<Hi.length&&(t=Hi[0],t.blockedOn===null);)y0(t),t.blockedOn===null&&Hi.shift()}var As=bi.ReactCurrentBatchConfig,yl=!0;function L_(n,e,t,i){var r=nt,s=As.transition;As.transition=null;try{nt=1,af(n,e,t,i)}finally{nt=r,As.transition=s}}function D_(n,e,t,i){var r=nt,s=As.transition;As.transition=null;try{nt=4,af(n,e,t,i)}finally{nt=r,As.transition=s}}function af(n,e,t,i){if(yl){var r=Ou(n,e,t,i);if(r===null)Dc(n,e,i,Ml,t),Ed(n,i);else if(b_(r,n,e,t,i))i.stopPropagation();else if(Ed(n,i),e&4&&-1<R_.indexOf(n)){for(;r!==null;){var s=Jo(r);if(s!==null&&g0(s),s=Ou(n,e,t,i),s===null&&Dc(n,e,i,Ml,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else Dc(n,e,i,null,t)}}var Ml=null;function Ou(n,e,t,i){if(Ml=null,n=nf(i),n=Tr(n),n!==null)if(e=Or(n),e===null)n=null;else if(t=e.tag,t===13){if(n=l0(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return Ml=n,null}function M0(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(x_()){case rf:return 1;case f0:return 4;case _l:case y_:return 16;case d0:return 536870912;default:return 16}default:return 16}}var Xi=null,lf=null,Ja=null;function S0(){if(Ja)return Ja;var n,e=lf,t=e.length,i,r="value"in Xi?Xi.value:Xi.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var o=t-n;for(i=1;i<=o&&e[t-i]===r[s-i];i++);return Ja=r.slice(n,1<i?1-i:void 0)}function el(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function ma(){return!0}function Td(){return!1}function wn(n){function e(t,i,r,s,o){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in n)n.hasOwnProperty(a)&&(t=n[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ma:Td,this.isPropagationStopped=Td,this}return gt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=ma)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=ma)},persist:function(){},isPersistent:ma}),e}var js={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},cf=wn(js),Qo=gt({},js,{view:0,detail:0}),I_=wn(Qo),Ec,wc,io,ql=gt({},Qo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:uf,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==io&&(io&&n.type==="mousemove"?(Ec=n.screenX-io.screenX,wc=n.screenY-io.screenY):wc=Ec=0,io=n),Ec)},movementY:function(n){return"movementY"in n?n.movementY:wc}}),Ad=wn(ql),N_=gt({},ql,{dataTransfer:0}),U_=wn(N_),z_=gt({},Qo,{relatedTarget:0}),Tc=wn(z_),F_=gt({},js,{animationName:0,elapsedTime:0,pseudoElement:0}),k_=wn(F_),O_=gt({},js,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),B_=wn(O_),H_=gt({},js,{data:0}),Cd=wn(H_),V_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},G_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},W_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function X_(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=W_[n])?!!e[n]:!1}function uf(){return X_}var j_=gt({},Qo,{key:function(n){if(n.key){var e=V_[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=el(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?G_[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:uf,charCode:function(n){return n.type==="keypress"?el(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?el(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Y_=wn(j_),q_=gt({},ql,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Rd=wn(q_),$_=gt({},Qo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:uf}),K_=wn($_),Z_=gt({},js,{propertyName:0,elapsedTime:0,pseudoElement:0}),Q_=wn(Z_),J_=gt({},ql,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),ex=wn(J_),tx=[9,13,27,32],hf=wi&&"CompositionEvent"in window,yo=null;wi&&"documentMode"in document&&(yo=document.documentMode);var nx=wi&&"TextEvent"in window&&!yo,E0=wi&&(!hf||yo&&8<yo&&11>=yo),bd=" ",Pd=!1;function w0(n,e){switch(n){case"keyup":return tx.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function T0(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var us=!1;function ix(n,e){switch(n){case"compositionend":return T0(e);case"keypress":return e.which!==32?null:(Pd=!0,bd);case"textInput":return n=e.data,n===bd&&Pd?null:n;default:return null}}function rx(n,e){if(us)return n==="compositionend"||!hf&&w0(n,e)?(n=S0(),Ja=lf=Xi=null,us=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return E0&&e.locale!=="ko"?null:e.data;default:return null}}var sx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ld(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!sx[n.type]:e==="textarea"}function A0(n,e,t,i){i0(i),e=Sl(e,"onChange"),0<e.length&&(t=new cf("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var Mo=null,Fo=null;function ox(n){F0(n,0)}function $l(n){var e=ds(n);if(Km(e))return n}function ax(n,e){if(n==="change")return e}var C0=!1;if(wi){var Ac;if(wi){var Cc="oninput"in document;if(!Cc){var Dd=document.createElement("div");Dd.setAttribute("oninput","return;"),Cc=typeof Dd.oninput=="function"}Ac=Cc}else Ac=!1;C0=Ac&&(!document.documentMode||9<document.documentMode)}function Id(){Mo&&(Mo.detachEvent("onpropertychange",R0),Fo=Mo=null)}function R0(n){if(n.propertyName==="value"&&$l(Fo)){var e=[];A0(e,Fo,n,nf(n)),a0(ox,e)}}function lx(n,e,t){n==="focusin"?(Id(),Mo=e,Fo=t,Mo.attachEvent("onpropertychange",R0)):n==="focusout"&&Id()}function cx(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return $l(Fo)}function ux(n,e){if(n==="click")return $l(e)}function hx(n,e){if(n==="input"||n==="change")return $l(e)}function fx(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var $n=typeof Object.is=="function"?Object.is:fx;function ko(n,e){if($n(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!Mu.call(e,r)||!$n(n[r],e[r]))return!1}return!0}function Nd(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Ud(n,e){var t=Nd(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Nd(t)}}function b0(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?b0(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function P0(){for(var n=window,e=ml();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=ml(n.document)}return e}function ff(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function dx(n){var e=P0(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&b0(t.ownerDocument.documentElement,t)){if(i!==null&&ff(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=Ud(t,s);var o=Ud(t,i);r&&o&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var px=wi&&"documentMode"in document&&11>=document.documentMode,hs=null,Bu=null,So=null,Hu=!1;function zd(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;Hu||hs==null||hs!==ml(i)||(i=hs,"selectionStart"in i&&ff(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),So&&ko(So,i)||(So=i,i=Sl(Bu,"onSelect"),0<i.length&&(e=new cf("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=hs)))}function ga(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var fs={animationend:ga("Animation","AnimationEnd"),animationiteration:ga("Animation","AnimationIteration"),animationstart:ga("Animation","AnimationStart"),transitionend:ga("Transition","TransitionEnd")},Rc={},L0={};wi&&(L0=document.createElement("div").style,"AnimationEvent"in window||(delete fs.animationend.animation,delete fs.animationiteration.animation,delete fs.animationstart.animation),"TransitionEvent"in window||delete fs.transitionend.transition);function Kl(n){if(Rc[n])return Rc[n];if(!fs[n])return n;var e=fs[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in L0)return Rc[n]=e[t];return n}var D0=Kl("animationend"),I0=Kl("animationiteration"),N0=Kl("animationstart"),U0=Kl("transitionend"),z0=new Map,Fd="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function lr(n,e){z0.set(n,e),kr(e,[n])}for(var bc=0;bc<Fd.length;bc++){var Pc=Fd[bc],mx=Pc.toLowerCase(),gx=Pc[0].toUpperCase()+Pc.slice(1);lr(mx,"on"+gx)}lr(D0,"onAnimationEnd");lr(I0,"onAnimationIteration");lr(N0,"onAnimationStart");lr("dblclick","onDoubleClick");lr("focusin","onFocus");lr("focusout","onBlur");lr(U0,"onTransitionEnd");Is("onMouseEnter",["mouseout","mouseover"]);Is("onMouseLeave",["mouseout","mouseover"]);Is("onPointerEnter",["pointerout","pointerover"]);Is("onPointerLeave",["pointerout","pointerover"]);kr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));kr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));kr("onBeforeInput",["compositionend","keypress","textInput","paste"]);kr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));kr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));kr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var go="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),vx=new Set("cancel close invalid load scroll toggle".split(" ").concat(go));function kd(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,m_(i,e,void 0,n),n.currentTarget=null}function F0(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;kd(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;kd(r,a,c),s=l}}}if(vl)throw n=zu,vl=!1,zu=null,n}function ot(n,e){var t=e[ju];t===void 0&&(t=e[ju]=new Set);var i=n+"__bubble";t.has(i)||(k0(e,n,2,!1),t.add(i))}function Lc(n,e,t){var i=0;e&&(i|=4),k0(t,n,i,e)}var va="_reactListening"+Math.random().toString(36).slice(2);function Oo(n){if(!n[va]){n[va]=!0,Xm.forEach(function(t){t!=="selectionchange"&&(vx.has(t)||Lc(t,!1,n),Lc(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[va]||(e[va]=!0,Lc("selectionchange",!1,e))}}function k0(n,e,t,i){switch(M0(e)){case 1:var r=L_;break;case 4:r=D_;break;default:r=af}t=r.bind(null,e,t,n),r=void 0,!Uu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function Dc(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Tr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}a0(function(){var c=s,u=nf(t),h=[];e:{var d=z0.get(n);if(d!==void 0){var p=cf,_=n;switch(n){case"keypress":if(el(t)===0)break e;case"keydown":case"keyup":p=Y_;break;case"focusin":_="focus",p=Tc;break;case"focusout":_="blur",p=Tc;break;case"beforeblur":case"afterblur":p=Tc;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Ad;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=U_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=K_;break;case D0:case I0:case N0:p=k_;break;case U0:p=Q_;break;case"scroll":p=I_;break;case"wheel":p=ex;break;case"copy":case"cut":case"paste":p=B_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Rd}var x=(e&4)!==0,m=!x&&n==="scroll",f=x?d!==null?d+"Capture":null:d;x=[];for(var g=c,v;g!==null;){v=g;var M=v.stateNode;if(v.tag===5&&M!==null&&(v=M,f!==null&&(M=Io(g,f),M!=null&&x.push(Bo(g,M,v)))),m)break;g=g.return}0<x.length&&(d=new p(d,_,null,t,u),h.push({event:d,listeners:x}))}}if(!(e&7)){e:{if(d=n==="mouseover"||n==="pointerover",p=n==="mouseout"||n==="pointerout",d&&t!==Iu&&(_=t.relatedTarget||t.fromElement)&&(Tr(_)||_[Ti]))break e;if((p||d)&&(d=u.window===u?u:(d=u.ownerDocument)?d.defaultView||d.parentWindow:window,p?(_=t.relatedTarget||t.toElement,p=c,_=_?Tr(_):null,_!==null&&(m=Or(_),_!==m||_.tag!==5&&_.tag!==6)&&(_=null)):(p=null,_=c),p!==_)){if(x=Ad,M="onMouseLeave",f="onMouseEnter",g="mouse",(n==="pointerout"||n==="pointerover")&&(x=Rd,M="onPointerLeave",f="onPointerEnter",g="pointer"),m=p==null?d:ds(p),v=_==null?d:ds(_),d=new x(M,g+"leave",p,t,u),d.target=m,d.relatedTarget=v,M=null,Tr(u)===c&&(x=new x(f,g+"enter",_,t,u),x.target=v,x.relatedTarget=m,M=x),m=M,p&&_)t:{for(x=p,f=_,g=0,v=x;v;v=Hr(v))g++;for(v=0,M=f;M;M=Hr(M))v++;for(;0<g-v;)x=Hr(x),g--;for(;0<v-g;)f=Hr(f),v--;for(;g--;){if(x===f||f!==null&&x===f.alternate)break t;x=Hr(x),f=Hr(f)}x=null}else x=null;p!==null&&Od(h,d,p,x,!1),_!==null&&m!==null&&Od(h,m,_,x,!0)}}e:{if(d=c?ds(c):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var b=ax;else if(Ld(d))if(C0)b=hx;else{b=cx;var A=lx}else(p=d.nodeName)&&p.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(b=ux);if(b&&(b=b(n,c))){A0(h,b,t,u);break e}A&&A(n,d,c),n==="focusout"&&(A=d._wrapperState)&&A.controlled&&d.type==="number"&&Ru(d,"number",d.value)}switch(A=c?ds(c):window,n){case"focusin":(Ld(A)||A.contentEditable==="true")&&(hs=A,Bu=c,So=null);break;case"focusout":So=Bu=hs=null;break;case"mousedown":Hu=!0;break;case"contextmenu":case"mouseup":case"dragend":Hu=!1,zd(h,t,u);break;case"selectionchange":if(px)break;case"keydown":case"keyup":zd(h,t,u)}var T;if(hf)e:{switch(n){case"compositionstart":var L="onCompositionStart";break e;case"compositionend":L="onCompositionEnd";break e;case"compositionupdate":L="onCompositionUpdate";break e}L=void 0}else us?w0(n,t)&&(L="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(L="onCompositionStart");L&&(E0&&t.locale!=="ko"&&(us||L!=="onCompositionStart"?L==="onCompositionEnd"&&us&&(T=S0()):(Xi=u,lf="value"in Xi?Xi.value:Xi.textContent,us=!0)),A=Sl(c,L),0<A.length&&(L=new Cd(L,n,null,t,u),h.push({event:L,listeners:A}),T?L.data=T:(T=T0(t),T!==null&&(L.data=T)))),(T=nx?ix(n,t):rx(n,t))&&(c=Sl(c,"onBeforeInput"),0<c.length&&(u=new Cd("onBeforeInput","beforeinput",null,t,u),h.push({event:u,listeners:c}),u.data=T))}F0(h,e)})}function Bo(n,e,t){return{instance:n,listener:e,currentTarget:t}}function Sl(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Io(n,t),s!=null&&i.unshift(Bo(n,s,r)),s=Io(n,e),s!=null&&i.push(Bo(n,s,r))),n=n.return}return i}function Hr(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Od(n,e,t,i,r){for(var s=e._reactName,o=[];t!==null&&t!==i;){var a=t,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=Io(t,s),l!=null&&o.unshift(Bo(t,l,a))):r||(l=Io(t,s),l!=null&&o.push(Bo(t,l,a)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}var _x=/\r\n?/g,xx=/\u0000|\uFFFD/g;function Bd(n){return(typeof n=="string"?n:""+n).replace(_x,`
`).replace(xx,"")}function _a(n,e,t){if(e=Bd(e),Bd(n)!==e&&t)throw Error(te(425))}function El(){}var Vu=null,Gu=null;function Wu(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Xu=typeof setTimeout=="function"?setTimeout:void 0,yx=typeof clearTimeout=="function"?clearTimeout:void 0,Hd=typeof Promise=="function"?Promise:void 0,Mx=typeof queueMicrotask=="function"?queueMicrotask:typeof Hd<"u"?function(n){return Hd.resolve(null).then(n).catch(Sx)}:Xu;function Sx(n){setTimeout(function(){throw n})}function Ic(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),zo(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);zo(e)}function Zi(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function Vd(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Ys=Math.random().toString(36).slice(2),ii="__reactFiber$"+Ys,Ho="__reactProps$"+Ys,Ti="__reactContainer$"+Ys,ju="__reactEvents$"+Ys,Ex="__reactListeners$"+Ys,wx="__reactHandles$"+Ys;function Tr(n){var e=n[ii];if(e)return e;for(var t=n.parentNode;t;){if(e=t[Ti]||t[ii]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=Vd(n);n!==null;){if(t=n[ii])return t;n=Vd(n)}return e}n=t,t=n.parentNode}return null}function Jo(n){return n=n[ii]||n[Ti],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ds(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(te(33))}function Zl(n){return n[Ho]||null}var Yu=[],ps=-1;function cr(n){return{current:n}}function ct(n){0>ps||(n.current=Yu[ps],Yu[ps]=null,ps--)}function st(n,e){ps++,Yu[ps]=n.current,n.current=e}var sr={},Kt=cr(sr),un=cr(!1),Lr=sr;function Ns(n,e){var t=n.type.contextTypes;if(!t)return sr;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function hn(n){return n=n.childContextTypes,n!=null}function wl(){ct(un),ct(Kt)}function Gd(n,e,t){if(Kt.current!==sr)throw Error(te(168));st(Kt,e),st(un,t)}function O0(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(te(108,l_(n)||"Unknown",r));return gt({},t,i)}function Tl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||sr,Lr=Kt.current,st(Kt,n),st(un,un.current),!0}function Wd(n,e,t){var i=n.stateNode;if(!i)throw Error(te(169));t?(n=O0(n,e,Lr),i.__reactInternalMemoizedMergedChildContext=n,ct(un),ct(Kt),st(Kt,n)):ct(un),st(un,t)}var vi=null,Ql=!1,Nc=!1;function B0(n){vi===null?vi=[n]:vi.push(n)}function Tx(n){Ql=!0,B0(n)}function ur(){if(!Nc&&vi!==null){Nc=!0;var n=0,e=nt;try{var t=vi;for(nt=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}vi=null,Ql=!1}catch(r){throw vi!==null&&(vi=vi.slice(n+1)),h0(rf,ur),r}finally{nt=e,Nc=!1}}return null}var ms=[],gs=0,Al=null,Cl=0,Cn=[],Rn=0,Dr=null,xi=1,yi="";function xr(n,e){ms[gs++]=Cl,ms[gs++]=Al,Al=n,Cl=e}function H0(n,e,t){Cn[Rn++]=xi,Cn[Rn++]=yi,Cn[Rn++]=Dr,Dr=n;var i=xi;n=yi;var r=32-Yn(i)-1;i&=~(1<<r),t+=1;var s=32-Yn(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,xi=1<<32-Yn(e)+r|t<<r|i,yi=s+n}else xi=1<<s|t<<r|i,yi=n}function df(n){n.return!==null&&(xr(n,1),H0(n,1,0))}function pf(n){for(;n===Al;)Al=ms[--gs],ms[gs]=null,Cl=ms[--gs],ms[gs]=null;for(;n===Dr;)Dr=Cn[--Rn],Cn[Rn]=null,yi=Cn[--Rn],Cn[Rn]=null,xi=Cn[--Rn],Cn[Rn]=null}var Mn=null,yn=null,ft=!1,Wn=null;function V0(n,e){var t=Ln(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function Xd(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,Mn=n,yn=Zi(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,Mn=n,yn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=Dr!==null?{id:xi,overflow:yi}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Ln(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,Mn=n,yn=null,!0):!1;default:return!1}}function qu(n){return(n.mode&1)!==0&&(n.flags&128)===0}function $u(n){if(ft){var e=yn;if(e){var t=e;if(!Xd(n,e)){if(qu(n))throw Error(te(418));e=Zi(t.nextSibling);var i=Mn;e&&Xd(n,e)?V0(i,t):(n.flags=n.flags&-4097|2,ft=!1,Mn=n)}}else{if(qu(n))throw Error(te(418));n.flags=n.flags&-4097|2,ft=!1,Mn=n}}}function jd(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Mn=n}function xa(n){if(n!==Mn)return!1;if(!ft)return jd(n),ft=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!Wu(n.type,n.memoizedProps)),e&&(e=yn)){if(qu(n))throw G0(),Error(te(418));for(;e;)V0(n,e),e=Zi(e.nextSibling)}if(jd(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(te(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){yn=Zi(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}yn=null}}else yn=Mn?Zi(n.stateNode.nextSibling):null;return!0}function G0(){for(var n=yn;n;)n=Zi(n.nextSibling)}function Us(){yn=Mn=null,ft=!1}function mf(n){Wn===null?Wn=[n]:Wn.push(n)}var Ax=bi.ReactCurrentBatchConfig;function ro(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(te(309));var i=t.stateNode}if(!i)throw Error(te(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof n!="string")throw Error(te(284));if(!t._owner)throw Error(te(290,n))}return n}function ya(n,e){throw n=Object.prototype.toString.call(e),Error(te(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function Yd(n){var e=n._init;return e(n._payload)}function W0(n){function e(f,g){if(n){var v=f.deletions;v===null?(f.deletions=[g],f.flags|=16):v.push(g)}}function t(f,g){if(!n)return null;for(;g!==null;)e(f,g),g=g.sibling;return null}function i(f,g){for(f=new Map;g!==null;)g.key!==null?f.set(g.key,g):f.set(g.index,g),g=g.sibling;return f}function r(f,g){return f=tr(f,g),f.index=0,f.sibling=null,f}function s(f,g,v){return f.index=v,n?(v=f.alternate,v!==null?(v=v.index,v<g?(f.flags|=2,g):v):(f.flags|=2,g)):(f.flags|=1048576,g)}function o(f){return n&&f.alternate===null&&(f.flags|=2),f}function a(f,g,v,M){return g===null||g.tag!==6?(g=Hc(v,f.mode,M),g.return=f,g):(g=r(g,v),g.return=f,g)}function l(f,g,v,M){var b=v.type;return b===cs?u(f,g,v.props.children,M,v.key):g!==null&&(g.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Oi&&Yd(b)===g.type)?(M=r(g,v.props),M.ref=ro(f,g,v),M.return=f,M):(M=al(v.type,v.key,v.props,null,f.mode,M),M.ref=ro(f,g,v),M.return=f,M)}function c(f,g,v,M){return g===null||g.tag!==4||g.stateNode.containerInfo!==v.containerInfo||g.stateNode.implementation!==v.implementation?(g=Vc(v,f.mode,M),g.return=f,g):(g=r(g,v.children||[]),g.return=f,g)}function u(f,g,v,M,b){return g===null||g.tag!==7?(g=Pr(v,f.mode,M,b),g.return=f,g):(g=r(g,v),g.return=f,g)}function h(f,g,v){if(typeof g=="string"&&g!==""||typeof g=="number")return g=Hc(""+g,f.mode,v),g.return=f,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case ca:return v=al(g.type,g.key,g.props,null,f.mode,v),v.ref=ro(f,null,g),v.return=f,v;case ls:return g=Vc(g,f.mode,v),g.return=f,g;case Oi:var M=g._init;return h(f,M(g._payload),v)}if(po(g)||Js(g))return g=Pr(g,f.mode,v,null),g.return=f,g;ya(f,g)}return null}function d(f,g,v,M){var b=g!==null?g.key:null;if(typeof v=="string"&&v!==""||typeof v=="number")return b!==null?null:a(f,g,""+v,M);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case ca:return v.key===b?l(f,g,v,M):null;case ls:return v.key===b?c(f,g,v,M):null;case Oi:return b=v._init,d(f,g,b(v._payload),M)}if(po(v)||Js(v))return b!==null?null:u(f,g,v,M,null);ya(f,v)}return null}function p(f,g,v,M,b){if(typeof M=="string"&&M!==""||typeof M=="number")return f=f.get(v)||null,a(g,f,""+M,b);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case ca:return f=f.get(M.key===null?v:M.key)||null,l(g,f,M,b);case ls:return f=f.get(M.key===null?v:M.key)||null,c(g,f,M,b);case Oi:var A=M._init;return p(f,g,v,A(M._payload),b)}if(po(M)||Js(M))return f=f.get(v)||null,u(g,f,M,b,null);ya(g,M)}return null}function _(f,g,v,M){for(var b=null,A=null,T=g,L=g=0,w=null;T!==null&&L<v.length;L++){T.index>L?(w=T,T=null):w=T.sibling;var y=d(f,T,v[L],M);if(y===null){T===null&&(T=w);break}n&&T&&y.alternate===null&&e(f,T),g=s(y,g,L),A===null?b=y:A.sibling=y,A=y,T=w}if(L===v.length)return t(f,T),ft&&xr(f,L),b;if(T===null){for(;L<v.length;L++)T=h(f,v[L],M),T!==null&&(g=s(T,g,L),A===null?b=T:A.sibling=T,A=T);return ft&&xr(f,L),b}for(T=i(f,T);L<v.length;L++)w=p(T,f,L,v[L],M),w!==null&&(n&&w.alternate!==null&&T.delete(w.key===null?L:w.key),g=s(w,g,L),A===null?b=w:A.sibling=w,A=w);return n&&T.forEach(function(D){return e(f,D)}),ft&&xr(f,L),b}function x(f,g,v,M){var b=Js(v);if(typeof b!="function")throw Error(te(150));if(v=b.call(v),v==null)throw Error(te(151));for(var A=b=null,T=g,L=g=0,w=null,y=v.next();T!==null&&!y.done;L++,y=v.next()){T.index>L?(w=T,T=null):w=T.sibling;var D=d(f,T,y.value,M);if(D===null){T===null&&(T=w);break}n&&T&&D.alternate===null&&e(f,T),g=s(D,g,L),A===null?b=D:A.sibling=D,A=D,T=w}if(y.done)return t(f,T),ft&&xr(f,L),b;if(T===null){for(;!y.done;L++,y=v.next())y=h(f,y.value,M),y!==null&&(g=s(y,g,L),A===null?b=y:A.sibling=y,A=y);return ft&&xr(f,L),b}for(T=i(f,T);!y.done;L++,y=v.next())y=p(T,f,L,y.value,M),y!==null&&(n&&y.alternate!==null&&T.delete(y.key===null?L:y.key),g=s(y,g,L),A===null?b=y:A.sibling=y,A=y);return n&&T.forEach(function(H){return e(f,H)}),ft&&xr(f,L),b}function m(f,g,v,M){if(typeof v=="object"&&v!==null&&v.type===cs&&v.key===null&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case ca:e:{for(var b=v.key,A=g;A!==null;){if(A.key===b){if(b=v.type,b===cs){if(A.tag===7){t(f,A.sibling),g=r(A,v.props.children),g.return=f,f=g;break e}}else if(A.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Oi&&Yd(b)===A.type){t(f,A.sibling),g=r(A,v.props),g.ref=ro(f,A,v),g.return=f,f=g;break e}t(f,A);break}else e(f,A);A=A.sibling}v.type===cs?(g=Pr(v.props.children,f.mode,M,v.key),g.return=f,f=g):(M=al(v.type,v.key,v.props,null,f.mode,M),M.ref=ro(f,g,v),M.return=f,f=M)}return o(f);case ls:e:{for(A=v.key;g!==null;){if(g.key===A)if(g.tag===4&&g.stateNode.containerInfo===v.containerInfo&&g.stateNode.implementation===v.implementation){t(f,g.sibling),g=r(g,v.children||[]),g.return=f,f=g;break e}else{t(f,g);break}else e(f,g);g=g.sibling}g=Vc(v,f.mode,M),g.return=f,f=g}return o(f);case Oi:return A=v._init,m(f,g,A(v._payload),M)}if(po(v))return _(f,g,v,M);if(Js(v))return x(f,g,v,M);ya(f,v)}return typeof v=="string"&&v!==""||typeof v=="number"?(v=""+v,g!==null&&g.tag===6?(t(f,g.sibling),g=r(g,v),g.return=f,f=g):(t(f,g),g=Hc(v,f.mode,M),g.return=f,f=g),o(f)):t(f,g)}return m}var zs=W0(!0),X0=W0(!1),Rl=cr(null),bl=null,vs=null,gf=null;function vf(){gf=vs=bl=null}function _f(n){var e=Rl.current;ct(Rl),n._currentValue=e}function Ku(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function Cs(n,e){bl=n,gf=vs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(cn=!0),n.firstContext=null)}function Nn(n){var e=n._currentValue;if(gf!==n)if(n={context:n,memoizedValue:e,next:null},vs===null){if(bl===null)throw Error(te(308));vs=n,bl.dependencies={lanes:0,firstContext:n}}else vs=vs.next=n;return e}var Ar=null;function xf(n){Ar===null?Ar=[n]:Ar.push(n)}function j0(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,xf(e)):(t.next=r.next,r.next=t),e.interleaved=t,Ai(n,i)}function Ai(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var Bi=!1;function yf(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Y0(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Ei(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function Qi(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,qe&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ai(n,t)}return r=i.interleaved,r===null?(e.next=e,xf(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ai(n,t)}function tl(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,sf(n,t)}}function qd(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function Pl(n,e,t,i){var r=n.updateQueue;Bi=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var u=n.alternate;u!==null&&(u=u.updateQueue,a=u.lastBaseUpdate,a!==o&&(a===null?u.firstBaseUpdate=c:a.next=c,u.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;o=0,u=c=l=null,a=s;do{var d=a.lane,p=a.eventTime;if((i&d)===d){u!==null&&(u=u.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var _=n,x=a;switch(d=e,p=t,x.tag){case 1:if(_=x.payload,typeof _=="function"){h=_.call(p,h,d);break e}h=_;break e;case 3:_.flags=_.flags&-65537|128;case 0:if(_=x.payload,d=typeof _=="function"?_.call(p,h,d):_,d==null)break e;h=gt({},h,d);break e;case 2:Bi=!0}}a.callback!==null&&a.lane!==0&&(n.flags|=64,d=r.effects,d===null?r.effects=[a]:d.push(a))}else p={eventTime:p,lane:d,tag:a.tag,payload:a.payload,callback:a.callback,next:null},u===null?(c=u=p,l=h):u=u.next=p,o|=d;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;d=a,a=d.next,d.next=null,r.lastBaseUpdate=d,r.shared.pending=null}}while(!0);if(u===null&&(l=h),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Nr|=o,n.lanes=o,n.memoizedState=h}}function $d(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(te(191,r));r.call(i)}}}var ea={},oi=cr(ea),Vo=cr(ea),Go=cr(ea);function Cr(n){if(n===ea)throw Error(te(174));return n}function Mf(n,e){switch(st(Go,e),st(Vo,n),st(oi,ea),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Pu(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=Pu(e,n)}ct(oi),st(oi,e)}function Fs(){ct(oi),ct(Vo),ct(Go)}function q0(n){Cr(Go.current);var e=Cr(oi.current),t=Pu(e,n.type);e!==t&&(st(Vo,n),st(oi,t))}function Sf(n){Vo.current===n&&(ct(oi),ct(Vo))}var pt=cr(0);function Ll(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Uc=[];function Ef(){for(var n=0;n<Uc.length;n++)Uc[n]._workInProgressVersionPrimary=null;Uc.length=0}var nl=bi.ReactCurrentDispatcher,zc=bi.ReactCurrentBatchConfig,Ir=0,mt=null,bt=null,zt=null,Dl=!1,Eo=!1,Wo=0,Cx=0;function Wt(){throw Error(te(321))}function wf(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!$n(n[t],e[t]))return!1;return!0}function Tf(n,e,t,i,r,s){if(Ir=s,mt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,nl.current=n===null||n.memoizedState===null?Lx:Dx,n=t(i,r),Eo){s=0;do{if(Eo=!1,Wo=0,25<=s)throw Error(te(301));s+=1,zt=bt=null,e.updateQueue=null,nl.current=Ix,n=t(i,r)}while(Eo)}if(nl.current=Il,e=bt!==null&&bt.next!==null,Ir=0,zt=bt=mt=null,Dl=!1,e)throw Error(te(300));return n}function Af(){var n=Wo!==0;return Wo=0,n}function ti(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return zt===null?mt.memoizedState=zt=n:zt=zt.next=n,zt}function Un(){if(bt===null){var n=mt.alternate;n=n!==null?n.memoizedState:null}else n=bt.next;var e=zt===null?mt.memoizedState:zt.next;if(e!==null)zt=e,bt=n;else{if(n===null)throw Error(te(310));bt=n,n={memoizedState:bt.memoizedState,baseState:bt.baseState,baseQueue:bt.baseQueue,queue:bt.queue,next:null},zt===null?mt.memoizedState=zt=n:zt=zt.next=n}return zt}function Xo(n,e){return typeof e=="function"?e(n):e}function Fc(n){var e=Un(),t=e.queue;if(t===null)throw Error(te(311));t.lastRenderedReducer=n;var i=bt,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var u=c.lane;if((Ir&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:n(i,c.action);else{var h={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=h,o=i):l=l.next=h,mt.lanes|=u,Nr|=u}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,$n(i,e.memoizedState)||(cn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,mt.lanes|=s,Nr|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function kc(n){var e=Un(),t=e.queue;if(t===null)throw Error(te(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var o=r=r.next;do s=n(s,o.action),o=o.next;while(o!==r);$n(s,e.memoizedState)||(cn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function $0(){}function K0(n,e){var t=mt,i=Un(),r=e(),s=!$n(i.memoizedState,r);if(s&&(i.memoizedState=r,cn=!0),i=i.queue,Cf(J0.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||zt!==null&&zt.memoizedState.tag&1){if(t.flags|=2048,jo(9,Q0.bind(null,t,i,r,e),void 0,null),Ft===null)throw Error(te(349));Ir&30||Z0(t,e,r)}return r}function Z0(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=mt.updateQueue,e===null?(e={lastEffect:null,stores:null},mt.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function Q0(n,e,t,i){e.value=t,e.getSnapshot=i,eg(e)&&tg(n)}function J0(n,e,t){return t(function(){eg(e)&&tg(n)})}function eg(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!$n(n,t)}catch{return!0}}function tg(n){var e=Ai(n,1);e!==null&&qn(e,n,1,-1)}function Kd(n){var e=ti();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Xo,lastRenderedState:n},e.queue=n,n=n.dispatch=Px.bind(null,mt,n),[e.memoizedState,n]}function jo(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=mt.updateQueue,e===null?(e={lastEffect:null,stores:null},mt.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function ng(){return Un().memoizedState}function il(n,e,t,i){var r=ti();mt.flags|=n,r.memoizedState=jo(1|e,t,void 0,i===void 0?null:i)}function Jl(n,e,t,i){var r=Un();i=i===void 0?null:i;var s=void 0;if(bt!==null){var o=bt.memoizedState;if(s=o.destroy,i!==null&&wf(i,o.deps)){r.memoizedState=jo(e,t,s,i);return}}mt.flags|=n,r.memoizedState=jo(1|e,t,s,i)}function Zd(n,e){return il(8390656,8,n,e)}function Cf(n,e){return Jl(2048,8,n,e)}function ig(n,e){return Jl(4,2,n,e)}function rg(n,e){return Jl(4,4,n,e)}function sg(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function og(n,e,t){return t=t!=null?t.concat([n]):null,Jl(4,4,sg.bind(null,e,n),t)}function Rf(){}function ag(n,e){var t=Un();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&wf(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function lg(n,e){var t=Un();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&wf(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function cg(n,e,t){return Ir&21?($n(t,e)||(t=p0(),mt.lanes|=t,Nr|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,cn=!0),n.memoizedState=t)}function Rx(n,e){var t=nt;nt=t!==0&&4>t?t:4,n(!0);var i=zc.transition;zc.transition={};try{n(!1),e()}finally{nt=t,zc.transition=i}}function ug(){return Un().memoizedState}function bx(n,e,t){var i=er(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},hg(n))fg(e,t);else if(t=j0(n,e,t,i),t!==null){var r=nn();qn(t,n,i,r),dg(t,e,i)}}function Px(n,e,t){var i=er(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(hg(n))fg(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,t);if(r.hasEagerState=!0,r.eagerState=a,$n(a,o)){var l=e.interleaved;l===null?(r.next=r,xf(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=j0(n,e,r,i),t!==null&&(r=nn(),qn(t,n,i,r),dg(t,e,i))}}function hg(n){var e=n.alternate;return n===mt||e!==null&&e===mt}function fg(n,e){Eo=Dl=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function dg(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,sf(n,t)}}var Il={readContext:Nn,useCallback:Wt,useContext:Wt,useEffect:Wt,useImperativeHandle:Wt,useInsertionEffect:Wt,useLayoutEffect:Wt,useMemo:Wt,useReducer:Wt,useRef:Wt,useState:Wt,useDebugValue:Wt,useDeferredValue:Wt,useTransition:Wt,useMutableSource:Wt,useSyncExternalStore:Wt,useId:Wt,unstable_isNewReconciler:!1},Lx={readContext:Nn,useCallback:function(n,e){return ti().memoizedState=[n,e===void 0?null:e],n},useContext:Nn,useEffect:Zd,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,il(4194308,4,sg.bind(null,e,n),t)},useLayoutEffect:function(n,e){return il(4194308,4,n,e)},useInsertionEffect:function(n,e){return il(4,2,n,e)},useMemo:function(n,e){var t=ti();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=ti();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=bx.bind(null,mt,n),[i.memoizedState,n]},useRef:function(n){var e=ti();return n={current:n},e.memoizedState=n},useState:Kd,useDebugValue:Rf,useDeferredValue:function(n){return ti().memoizedState=n},useTransition:function(){var n=Kd(!1),e=n[0];return n=Rx.bind(null,n[1]),ti().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=mt,r=ti();if(ft){if(t===void 0)throw Error(te(407));t=t()}else{if(t=e(),Ft===null)throw Error(te(349));Ir&30||Z0(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,Zd(J0.bind(null,i,s,n),[n]),i.flags|=2048,jo(9,Q0.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=ti(),e=Ft.identifierPrefix;if(ft){var t=yi,i=xi;t=(i&~(1<<32-Yn(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Wo++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=Cx++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},Dx={readContext:Nn,useCallback:ag,useContext:Nn,useEffect:Cf,useImperativeHandle:og,useInsertionEffect:ig,useLayoutEffect:rg,useMemo:lg,useReducer:Fc,useRef:ng,useState:function(){return Fc(Xo)},useDebugValue:Rf,useDeferredValue:function(n){var e=Un();return cg(e,bt.memoizedState,n)},useTransition:function(){var n=Fc(Xo)[0],e=Un().memoizedState;return[n,e]},useMutableSource:$0,useSyncExternalStore:K0,useId:ug,unstable_isNewReconciler:!1},Ix={readContext:Nn,useCallback:ag,useContext:Nn,useEffect:Cf,useImperativeHandle:og,useInsertionEffect:ig,useLayoutEffect:rg,useMemo:lg,useReducer:kc,useRef:ng,useState:function(){return kc(Xo)},useDebugValue:Rf,useDeferredValue:function(n){var e=Un();return bt===null?e.memoizedState=n:cg(e,bt.memoizedState,n)},useTransition:function(){var n=kc(Xo)[0],e=Un().memoizedState;return[n,e]},useMutableSource:$0,useSyncExternalStore:K0,useId:ug,unstable_isNewReconciler:!1};function Hn(n,e){if(n&&n.defaultProps){e=gt({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function Zu(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:gt({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var ec={isMounted:function(n){return(n=n._reactInternals)?Or(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=nn(),r=er(n),s=Ei(i,r);s.payload=e,t!=null&&(s.callback=t),e=Qi(n,s,r),e!==null&&(qn(e,n,r,i),tl(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=nn(),r=er(n),s=Ei(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=Qi(n,s,r),e!==null&&(qn(e,n,r,i),tl(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=nn(),i=er(n),r=Ei(t,i);r.tag=2,e!=null&&(r.callback=e),e=Qi(n,r,i),e!==null&&(qn(e,n,i,t),tl(e,n,i))}};function Qd(n,e,t,i,r,s,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!ko(t,i)||!ko(r,s):!0}function pg(n,e,t){var i=!1,r=sr,s=e.contextType;return typeof s=="object"&&s!==null?s=Nn(s):(r=hn(e)?Lr:Kt.current,i=e.contextTypes,s=(i=i!=null)?Ns(n,r):sr),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=ec,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function Jd(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&ec.enqueueReplaceState(e,e.state,null)}function Qu(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},yf(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Nn(s):(s=hn(e)?Lr:Kt.current,r.context=Ns(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Zu(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&ec.enqueueReplaceState(r,r.state,null),Pl(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function ks(n,e){try{var t="",i=e;do t+=a_(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function Oc(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function Ju(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var Nx=typeof WeakMap=="function"?WeakMap:Map;function mg(n,e,t){t=Ei(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){Ul||(Ul=!0,ch=i),Ju(n,e)},t}function gg(n,e,t){t=Ei(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){Ju(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){Ju(n,e),typeof i!="function"&&(Ji===null?Ji=new Set([this]):Ji.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}function ep(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new Nx;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=qx.bind(null,n,e,t),e.then(n,n))}function tp(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function np(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=Ei(-1,1),e.tag=2,Qi(t,e,1))),t.lanes|=1),n)}var Ux=bi.ReactCurrentOwner,cn=!1;function Jt(n,e,t,i){e.child=n===null?X0(e,null,t,i):zs(e,n.child,t,i)}function ip(n,e,t,i,r){t=t.render;var s=e.ref;return Cs(e,r),i=Tf(n,e,t,i,s,r),t=Af(),n!==null&&!cn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ci(n,e,r)):(ft&&t&&df(e),e.flags|=1,Jt(n,e,i,r),e.child)}function rp(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!zf(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,vg(n,e,s,i,r)):(n=al(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:ko,t(o,i)&&n.ref===e.ref)return Ci(n,e,r)}return e.flags|=1,n=tr(s,i),n.ref=e.ref,n.return=e,e.child=n}function vg(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(ko(s,i)&&n.ref===e.ref)if(cn=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(cn=!0);else return e.lanes=n.lanes,Ci(n,e,r)}return eh(n,e,t,i,r)}function _g(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},st(xs,vn),vn|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,st(xs,vn),vn|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,st(xs,vn),vn|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,st(xs,vn),vn|=i;return Jt(n,e,r,t),e.child}function xg(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function eh(n,e,t,i,r){var s=hn(t)?Lr:Kt.current;return s=Ns(e,s),Cs(e,r),t=Tf(n,e,t,i,s,r),i=Af(),n!==null&&!cn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ci(n,e,r)):(ft&&i&&df(e),e.flags|=1,Jt(n,e,t,r),e.child)}function sp(n,e,t,i,r){if(hn(t)){var s=!0;Tl(e)}else s=!1;if(Cs(e,r),e.stateNode===null)rl(n,e),pg(e,t,i),Qu(e,t,i,r),i=!0;else if(n===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=t.contextType;typeof c=="object"&&c!==null?c=Nn(c):(c=hn(t)?Lr:Kt.current,c=Ns(e,c));var u=t.getDerivedStateFromProps,h=typeof u=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&Jd(e,o,i,c),Bi=!1;var d=e.memoizedState;o.state=d,Pl(e,i,o,r),l=e.memoizedState,a!==i||d!==l||un.current||Bi?(typeof u=="function"&&(Zu(e,t,u,i),l=e.memoizedState),(a=Bi||Qd(e,t,a,i,d,l,c))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,Y0(n,e),a=e.memoizedProps,c=e.type===e.elementType?a:Hn(e.type,a),o.props=c,h=e.pendingProps,d=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=Nn(l):(l=hn(t)?Lr:Kt.current,l=Ns(e,l));var p=t.getDerivedStateFromProps;(u=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||d!==l)&&Jd(e,o,i,l),Bi=!1,d=e.memoizedState,o.state=d,Pl(e,i,o,r);var _=e.memoizedState;a!==h||d!==_||un.current||Bi?(typeof p=="function"&&(Zu(e,t,p,i),_=e.memoizedState),(c=Bi||Qd(e,t,c,i,d,_,l)||!1)?(u||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,_,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,_,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&d===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&d===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=_),o.props=i,o.state=_,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&d===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&d===n.memoizedState||(e.flags|=1024),i=!1)}return th(n,e,t,i,s,r)}function th(n,e,t,i,r,s){xg(n,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&Wd(e,t,!1),Ci(n,e,s);i=e.stateNode,Ux.current=e;var a=o&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&o?(e.child=zs(e,n.child,null,s),e.child=zs(e,null,a,s)):Jt(n,e,a,s),e.memoizedState=i.state,r&&Wd(e,t,!0),e.child}function yg(n){var e=n.stateNode;e.pendingContext?Gd(n,e.pendingContext,e.pendingContext!==e.context):e.context&&Gd(n,e.context,!1),Mf(n,e.containerInfo)}function op(n,e,t,i,r){return Us(),mf(r),e.flags|=256,Jt(n,e,t,i),e.child}var nh={dehydrated:null,treeContext:null,retryLane:0};function ih(n){return{baseLanes:n,cachePool:null,transitions:null}}function Mg(n,e,t){var i=e.pendingProps,r=pt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=n!==null&&n.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),st(pt,r&1),n===null)return $u(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,n=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=ic(o,i,0,null),n=Pr(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=ih(t),e.memoizedState=nh,n):bf(e,o));if(r=n.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return zx(n,e,o,i,a,r,t);if(s){s=i.fallback,o=e.mode,r=n.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=tr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=tr(a,s):(s=Pr(s,o,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=n.child.memoizedState,o=o===null?ih(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=n.childLanes&~t,e.memoizedState=nh,i}return s=n.child,n=s.sibling,i=tr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function bf(n,e){return e=ic({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function Ma(n,e,t,i){return i!==null&&mf(i),zs(e,n.child,null,t),n=bf(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function zx(n,e,t,i,r,s,o){if(t)return e.flags&256?(e.flags&=-257,i=Oc(Error(te(422))),Ma(n,e,o,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=ic({mode:"visible",children:i.children},r,0,null),s=Pr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&zs(e,n.child,null,o),e.child.memoizedState=ih(o),e.memoizedState=nh,s);if(!(e.mode&1))return Ma(n,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(te(419)),i=Oc(s,i,void 0),Ma(n,e,o,i)}if(a=(o&n.childLanes)!==0,cn||a){if(i=Ft,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ai(n,r),qn(i,n,r,-1))}return Uf(),i=Oc(Error(te(421))),Ma(n,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=$x.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,yn=Zi(r.nextSibling),Mn=e,ft=!0,Wn=null,n!==null&&(Cn[Rn++]=xi,Cn[Rn++]=yi,Cn[Rn++]=Dr,xi=n.id,yi=n.overflow,Dr=e),e=bf(e,i.children),e.flags|=4096,e)}function ap(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),Ku(n.return,e,t)}function Bc(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function Sg(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Jt(n,e,i.children,t),i=pt.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&ap(n,t,e);else if(n.tag===19)ap(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(st(pt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&Ll(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),Bc(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&Ll(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}Bc(e,!0,t,null,s);break;case"together":Bc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function rl(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function Ci(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),Nr|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(te(153));if(e.child!==null){for(n=e.child,t=tr(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=tr(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function Fx(n,e,t){switch(e.tag){case 3:yg(e),Us();break;case 5:q0(e);break;case 1:hn(e.type)&&Tl(e);break;case 4:Mf(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;st(Rl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(st(pt,pt.current&1),e.flags|=128,null):t&e.child.childLanes?Mg(n,e,t):(st(pt,pt.current&1),n=Ci(n,e,t),n!==null?n.sibling:null);st(pt,pt.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return Sg(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),st(pt,pt.current),i)break;return null;case 22:case 23:return e.lanes=0,_g(n,e,t)}return Ci(n,e,t)}var Eg,rh,wg,Tg;Eg=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};rh=function(){};wg=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,Cr(oi.current);var s=null;switch(t){case"input":r=Au(n,r),i=Au(n,i),s=[];break;case"select":r=gt({},r,{value:void 0}),i=gt({},i,{value:void 0}),s=[];break;case"textarea":r=bu(n,r),i=bu(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=El)}Lu(t,i);var o;t=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Lo.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r?.[c],i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Lo.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&ot("scroll",n),s||a===l||(s=[])):(s=s||[]).push(c,l))}t&&(s=s||[]).push("style",t);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};Tg=function(n,e,t,i){t!==i&&(e.flags|=4)};function so(n,e){if(!ft)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function Xt(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function kx(n,e,t){var i=e.pendingProps;switch(pf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Xt(e),null;case 1:return hn(e.type)&&wl(),Xt(e),null;case 3:return i=e.stateNode,Fs(),ct(un),ct(Kt),Ef(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(xa(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Wn!==null&&(fh(Wn),Wn=null))),rh(n,e),Xt(e),null;case 5:Sf(e);var r=Cr(Go.current);if(t=e.type,n!==null&&e.stateNode!=null)wg(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(te(166));return Xt(e),null}if(n=Cr(oi.current),xa(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[ii]=e,i[Ho]=s,n=(e.mode&1)!==0,t){case"dialog":ot("cancel",i),ot("close",i);break;case"iframe":case"object":case"embed":ot("load",i);break;case"video":case"audio":for(r=0;r<go.length;r++)ot(go[r],i);break;case"source":ot("error",i);break;case"img":case"image":case"link":ot("error",i),ot("load",i);break;case"details":ot("toggle",i);break;case"input":gd(i,s),ot("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ot("invalid",i);break;case"textarea":_d(i,s),ot("invalid",i)}Lu(t,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&_a(i.textContent,a,n),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&_a(i.textContent,a,n),r=["children",""+a]):Lo.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&ot("scroll",i)}switch(t){case"input":ua(i),vd(i,s,!0);break;case"textarea":ua(i),xd(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=El)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Jm(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=o.createElement(t,{is:i.is}):(n=o.createElement(t),t==="select"&&(o=n,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):n=o.createElementNS(n,t),n[ii]=e,n[Ho]=i,Eg(n,e,!1,!1),e.stateNode=n;e:{switch(o=Du(t,i),t){case"dialog":ot("cancel",n),ot("close",n),r=i;break;case"iframe":case"object":case"embed":ot("load",n),r=i;break;case"video":case"audio":for(r=0;r<go.length;r++)ot(go[r],n);r=i;break;case"source":ot("error",n),r=i;break;case"img":case"image":case"link":ot("error",n),ot("load",n),r=i;break;case"details":ot("toggle",n),r=i;break;case"input":gd(n,i),r=Au(n,i),ot("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=gt({},i,{value:void 0}),ot("invalid",n);break;case"textarea":_d(n,i),r=bu(n,i),ot("invalid",n);break;default:r=i}Lu(t,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?n0(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&e0(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&Do(n,l):typeof l=="number"&&Do(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Lo.hasOwnProperty(s)?l!=null&&s==="onScroll"&&ot("scroll",n):l!=null&&Qh(n,s,l,o))}switch(t){case"input":ua(n),vd(n,i,!1);break;case"textarea":ua(n),xd(n);break;case"option":i.value!=null&&n.setAttribute("value",""+rr(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?Es(n,!!i.multiple,s,!1):i.defaultValue!=null&&Es(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=El)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Xt(e),null;case 6:if(n&&e.stateNode!=null)Tg(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(te(166));if(t=Cr(Go.current),Cr(oi.current),xa(e)){if(i=e.stateNode,t=e.memoizedProps,i[ii]=e,(s=i.nodeValue!==t)&&(n=Mn,n!==null))switch(n.tag){case 3:_a(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&_a(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[ii]=e,e.stateNode=i}return Xt(e),null;case 13:if(ct(pt),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(ft&&yn!==null&&e.mode&1&&!(e.flags&128))G0(),Us(),e.flags|=98560,s=!1;else if(s=xa(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(te(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(te(317));s[ii]=e}else Us(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Xt(e),s=!1}else Wn!==null&&(fh(Wn),Wn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||pt.current&1?Lt===0&&(Lt=3):Uf())),e.updateQueue!==null&&(e.flags|=4),Xt(e),null);case 4:return Fs(),rh(n,e),n===null&&Oo(e.stateNode.containerInfo),Xt(e),null;case 10:return _f(e.type._context),Xt(e),null;case 17:return hn(e.type)&&wl(),Xt(e),null;case 19:if(ct(pt),s=e.memoizedState,s===null)return Xt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)so(s,!1);else{if(Lt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(o=Ll(n),o!==null){for(e.flags|=128,so(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,n=o.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return st(pt,pt.current&1|2),e.child}n=n.sibling}s.tail!==null&&St()>Os&&(e.flags|=128,i=!0,so(s,!1),e.lanes=4194304)}else{if(!i)if(n=Ll(o),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),so(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!ft)return Xt(e),null}else 2*St()-s.renderingStartTime>Os&&t!==1073741824&&(e.flags|=128,i=!0,so(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(t=s.last,t!==null?t.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=St(),e.sibling=null,t=pt.current,st(pt,i?t&1|2:t&1),e):(Xt(e),null);case 22:case 23:return Nf(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?vn&1073741824&&(Xt(e),e.subtreeFlags&6&&(e.flags|=8192)):Xt(e),null;case 24:return null;case 25:return null}throw Error(te(156,e.tag))}function Ox(n,e){switch(pf(e),e.tag){case 1:return hn(e.type)&&wl(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return Fs(),ct(un),ct(Kt),Ef(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return Sf(e),null;case 13:if(ct(pt),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(te(340));Us()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return ct(pt),null;case 4:return Fs(),null;case 10:return _f(e.type._context),null;case 22:case 23:return Nf(),null;case 24:return null;default:return null}}var Sa=!1,$t=!1,Bx=typeof WeakSet=="function"?WeakSet:Set,pe=null;function _s(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){yt(n,e,i)}else t.current=null}function sh(n,e,t){try{t()}catch(i){yt(n,e,i)}}var lp=!1;function Hx(n,e){if(Vu=yl,n=P0(),ff(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,l=-1,c=0,u=0,h=n,d=null;t:for(;;){for(var p;h!==t||r!==0&&h.nodeType!==3||(a=o+r),h!==s||i!==0&&h.nodeType!==3||(l=o+i),h.nodeType===3&&(o+=h.nodeValue.length),(p=h.firstChild)!==null;)d=h,h=p;for(;;){if(h===n)break t;if(d===t&&++c===r&&(a=o),d===s&&++u===i&&(l=o),(p=h.nextSibling)!==null)break;h=d,d=h.parentNode}h=p}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(Gu={focusedElem:n,selectionRange:t},yl=!1,pe=e;pe!==null;)if(e=pe,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,pe=n;else for(;pe!==null;){e=pe;try{var _=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(_!==null){var x=_.memoizedProps,m=_.memoizedState,f=e.stateNode,g=f.getSnapshotBeforeUpdate(e.elementType===e.type?x:Hn(e.type,x),m);f.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var v=e.stateNode.containerInfo;v.nodeType===1?v.textContent="":v.nodeType===9&&v.documentElement&&v.removeChild(v.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(te(163))}}catch(M){yt(e,e.return,M)}if(n=e.sibling,n!==null){n.return=e.return,pe=n;break}pe=e.return}return _=lp,lp=!1,_}function wo(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&sh(e,t,s)}r=r.next}while(r!==i)}}function tc(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function oh(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function Ag(n){var e=n.alternate;e!==null&&(n.alternate=null,Ag(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[ii],delete e[Ho],delete e[ju],delete e[Ex],delete e[wx])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Cg(n){return n.tag===5||n.tag===3||n.tag===4}function cp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Cg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function ah(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=El));else if(i!==4&&(n=n.child,n!==null))for(ah(n,e,t),n=n.sibling;n!==null;)ah(n,e,t),n=n.sibling}function lh(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(lh(n,e,t),n=n.sibling;n!==null;)lh(n,e,t),n=n.sibling}var Ht=null,Vn=!1;function Li(n,e,t){for(t=t.child;t!==null;)Rg(n,e,t),t=t.sibling}function Rg(n,e,t){if(si&&typeof si.onCommitFiberUnmount=="function")try{si.onCommitFiberUnmount(Yl,t)}catch{}switch(t.tag){case 5:$t||_s(t,e);case 6:var i=Ht,r=Vn;Ht=null,Li(n,e,t),Ht=i,Vn=r,Ht!==null&&(Vn?(n=Ht,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):Ht.removeChild(t.stateNode));break;case 18:Ht!==null&&(Vn?(n=Ht,t=t.stateNode,n.nodeType===8?Ic(n.parentNode,t):n.nodeType===1&&Ic(n,t),zo(n)):Ic(Ht,t.stateNode));break;case 4:i=Ht,r=Vn,Ht=t.stateNode.containerInfo,Vn=!0,Li(n,e,t),Ht=i,Vn=r;break;case 0:case 11:case 14:case 15:if(!$t&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&sh(t,e,o),r=r.next}while(r!==i)}Li(n,e,t);break;case 1:if(!$t&&(_s(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(a){yt(t,e,a)}Li(n,e,t);break;case 21:Li(n,e,t);break;case 22:t.mode&1?($t=(i=$t)||t.memoizedState!==null,Li(n,e,t),$t=i):Li(n,e,t);break;default:Li(n,e,t)}}function up(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new Bx),e.forEach(function(i){var r=Kx.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function Fn(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Ht=a.stateNode,Vn=!1;break e;case 3:Ht=a.stateNode.containerInfo,Vn=!0;break e;case 4:Ht=a.stateNode.containerInfo,Vn=!0;break e}a=a.return}if(Ht===null)throw Error(te(160));Rg(s,o,r),Ht=null,Vn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){yt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)bg(e,n),e=e.sibling}function bg(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Fn(e,n),Qn(n),i&4){try{wo(3,n,n.return),tc(3,n)}catch(x){yt(n,n.return,x)}try{wo(5,n,n.return)}catch(x){yt(n,n.return,x)}}break;case 1:Fn(e,n),Qn(n),i&512&&t!==null&&_s(t,t.return);break;case 5:if(Fn(e,n),Qn(n),i&512&&t!==null&&_s(t,t.return),n.flags&32){var r=n.stateNode;try{Do(r,"")}catch(x){yt(n,n.return,x)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,o=t!==null?t.memoizedProps:s,a=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Zm(r,s),Du(a,o);var c=Du(a,s);for(o=0;o<l.length;o+=2){var u=l[o],h=l[o+1];u==="style"?n0(r,h):u==="dangerouslySetInnerHTML"?e0(r,h):u==="children"?Do(r,h):Qh(r,u,h,c)}switch(a){case"input":Cu(r,s);break;case"textarea":Qm(r,s);break;case"select":var d=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?Es(r,!!s.multiple,p,!1):d!==!!s.multiple&&(s.defaultValue!=null?Es(r,!!s.multiple,s.defaultValue,!0):Es(r,!!s.multiple,s.multiple?[]:"",!1))}r[Ho]=s}catch(x){yt(n,n.return,x)}}break;case 6:if(Fn(e,n),Qn(n),i&4){if(n.stateNode===null)throw Error(te(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(x){yt(n,n.return,x)}}break;case 3:if(Fn(e,n),Qn(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{zo(e.containerInfo)}catch(x){yt(n,n.return,x)}break;case 4:Fn(e,n),Qn(n);break;case 13:Fn(e,n),Qn(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Df=St())),i&4&&up(n);break;case 22:if(u=t!==null&&t.memoizedState!==null,n.mode&1?($t=(c=$t)||u,Fn(e,n),$t=c):Fn(e,n),Qn(n),i&8192){if(c=n.memoizedState!==null,(n.stateNode.isHidden=c)&&!u&&n.mode&1)for(pe=n,u=n.child;u!==null;){for(h=pe=u;pe!==null;){switch(d=pe,p=d.child,d.tag){case 0:case 11:case 14:case 15:wo(4,d,d.return);break;case 1:_s(d,d.return);var _=d.stateNode;if(typeof _.componentWillUnmount=="function"){i=d,t=d.return;try{e=i,_.props=e.memoizedProps,_.state=e.memoizedState,_.componentWillUnmount()}catch(x){yt(i,t,x)}}break;case 5:_s(d,d.return);break;case 22:if(d.memoizedState!==null){fp(h);continue}}p!==null?(p.return=d,pe=p):fp(h)}u=u.sibling}e:for(u=null,h=n;;){if(h.tag===5){if(u===null){u=h;try{r=h.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=t0("display",o))}catch(x){yt(n,n.return,x)}}}else if(h.tag===6){if(u===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(x){yt(n,n.return,x)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===n)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===n)break e;for(;h.sibling===null;){if(h.return===null||h.return===n)break e;u===h&&(u=null),h=h.return}u===h&&(u=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Fn(e,n),Qn(n),i&4&&up(n);break;case 21:break;default:Fn(e,n),Qn(n)}}function Qn(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(Cg(t)){var i=t;break e}t=t.return}throw Error(te(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Do(r,""),i.flags&=-33);var s=cp(n);lh(n,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=cp(n);ah(n,a,o);break;default:throw Error(te(161))}}catch(l){yt(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function Vx(n,e,t){pe=n,Pg(n)}function Pg(n,e,t){for(var i=(n.mode&1)!==0;pe!==null;){var r=pe,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||Sa;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||$t;a=Sa;var c=$t;if(Sa=o,($t=l)&&!c)for(pe=r;pe!==null;)o=pe,l=o.child,o.tag===22&&o.memoizedState!==null?dp(r):l!==null?(l.return=o,pe=l):dp(r);for(;s!==null;)pe=s,Pg(s),s=s.sibling;pe=r,Sa=a,$t=c}hp(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,pe=s):hp(n)}}function hp(n){for(;pe!==null;){var e=pe;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:$t||tc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!$t)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:Hn(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&$d(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}$d(e,o,t)}break;case 5:var a=e.stateNode;if(t===null&&e.flags&4){t=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var h=u.dehydrated;h!==null&&zo(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(te(163))}$t||e.flags&512&&oh(e)}catch(d){yt(e,e.return,d)}}if(e===n){pe=null;break}if(t=e.sibling,t!==null){t.return=e.return,pe=t;break}pe=e.return}}function fp(n){for(;pe!==null;){var e=pe;if(e===n){pe=null;break}var t=e.sibling;if(t!==null){t.return=e.return,pe=t;break}pe=e.return}}function dp(n){for(;pe!==null;){var e=pe;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{tc(4,e)}catch(l){yt(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){yt(e,r,l)}}var s=e.return;try{oh(e)}catch(l){yt(e,s,l)}break;case 5:var o=e.return;try{oh(e)}catch(l){yt(e,o,l)}}}catch(l){yt(e,e.return,l)}if(e===n){pe=null;break}var a=e.sibling;if(a!==null){a.return=e.return,pe=a;break}pe=e.return}}var Gx=Math.ceil,Nl=bi.ReactCurrentDispatcher,Pf=bi.ReactCurrentOwner,In=bi.ReactCurrentBatchConfig,qe=0,Ft=null,Rt=null,Vt=0,vn=0,xs=cr(0),Lt=0,Yo=null,Nr=0,nc=0,Lf=0,To=null,ln=null,Df=0,Os=1/0,gi=null,Ul=!1,ch=null,Ji=null,Ea=!1,ji=null,zl=0,Ao=0,uh=null,sl=-1,ol=0;function nn(){return qe&6?St():sl!==-1?sl:sl=St()}function er(n){return n.mode&1?qe&2&&Vt!==0?Vt&-Vt:Ax.transition!==null?(ol===0&&(ol=p0()),ol):(n=nt,n!==0||(n=window.event,n=n===void 0?16:M0(n.type)),n):1}function qn(n,e,t,i){if(50<Ao)throw Ao=0,uh=null,Error(te(185));Zo(n,t,i),(!(qe&2)||n!==Ft)&&(n===Ft&&(!(qe&2)&&(nc|=t),Lt===4&&Vi(n,Vt)),fn(n,i),t===1&&qe===0&&!(e.mode&1)&&(Os=St()+500,Ql&&ur()))}function fn(n,e){var t=n.callbackNode;A_(n,e);var i=xl(n,n===Ft?Vt:0);if(i===0)t!==null&&Sd(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&Sd(t),e===1)n.tag===0?Tx(pp.bind(null,n)):B0(pp.bind(null,n)),Mx(function(){!(qe&6)&&ur()}),t=null;else{switch(m0(i)){case 1:t=rf;break;case 4:t=f0;break;case 16:t=_l;break;case 536870912:t=d0;break;default:t=_l}t=kg(t,Lg.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function Lg(n,e){if(sl=-1,ol=0,qe&6)throw Error(te(327));var t=n.callbackNode;if(Rs()&&n.callbackNode!==t)return null;var i=xl(n,n===Ft?Vt:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=Fl(n,i);else{e=i;var r=qe;qe|=2;var s=Ig();(Ft!==n||Vt!==e)&&(gi=null,Os=St()+500,br(n,e));do try{jx();break}catch(a){Dg(n,a)}while(!0);vf(),Nl.current=s,qe=r,Rt!==null?e=0:(Ft=null,Vt=0,e=Lt)}if(e!==0){if(e===2&&(r=Fu(n),r!==0&&(i=r,e=hh(n,r))),e===1)throw t=Yo,br(n,0),Vi(n,i),fn(n,St()),t;if(e===6)Vi(n,i);else{if(r=n.current.alternate,!(i&30)&&!Wx(r)&&(e=Fl(n,i),e===2&&(s=Fu(n),s!==0&&(i=s,e=hh(n,s))),e===1))throw t=Yo,br(n,0),Vi(n,i),fn(n,St()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(te(345));case 2:yr(n,ln,gi);break;case 3:if(Vi(n,i),(i&130023424)===i&&(e=Df+500-St(),10<e)){if(xl(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){nn(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=Xu(yr.bind(null,n,ln,gi),e);break}yr(n,ln,gi);break;case 4:if(Vi(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var o=31-Yn(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=St()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Gx(i/1960))-i,10<i){n.timeoutHandle=Xu(yr.bind(null,n,ln,gi),i);break}yr(n,ln,gi);break;case 5:yr(n,ln,gi);break;default:throw Error(te(329))}}}return fn(n,St()),n.callbackNode===t?Lg.bind(null,n):null}function hh(n,e){var t=To;return n.current.memoizedState.isDehydrated&&(br(n,e).flags|=256),n=Fl(n,e),n!==2&&(e=ln,ln=t,e!==null&&fh(e)),n}function fh(n){ln===null?ln=n:ln.push.apply(ln,n)}function Wx(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!$n(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Vi(n,e){for(e&=~Lf,e&=~nc,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-Yn(e),i=1<<t;n[t]=-1,e&=~i}}function pp(n){if(qe&6)throw Error(te(327));Rs();var e=xl(n,0);if(!(e&1))return fn(n,St()),null;var t=Fl(n,e);if(n.tag!==0&&t===2){var i=Fu(n);i!==0&&(e=i,t=hh(n,i))}if(t===1)throw t=Yo,br(n,0),Vi(n,e),fn(n,St()),t;if(t===6)throw Error(te(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,yr(n,ln,gi),fn(n,St()),null}function If(n,e){var t=qe;qe|=1;try{return n(e)}finally{qe=t,qe===0&&(Os=St()+500,Ql&&ur())}}function Ur(n){ji!==null&&ji.tag===0&&!(qe&6)&&Rs();var e=qe;qe|=1;var t=In.transition,i=nt;try{if(In.transition=null,nt=1,n)return n()}finally{nt=i,In.transition=t,qe=e,!(qe&6)&&ur()}}function Nf(){vn=xs.current,ct(xs)}function br(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,yx(t)),Rt!==null)for(t=Rt.return;t!==null;){var i=t;switch(pf(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&wl();break;case 3:Fs(),ct(un),ct(Kt),Ef();break;case 5:Sf(i);break;case 4:Fs();break;case 13:ct(pt);break;case 19:ct(pt);break;case 10:_f(i.type._context);break;case 22:case 23:Nf()}t=t.return}if(Ft=n,Rt=n=tr(n.current,null),Vt=vn=e,Lt=0,Yo=null,Lf=nc=Nr=0,ln=To=null,Ar!==null){for(e=0;e<Ar.length;e++)if(t=Ar[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}t.pending=i}Ar=null}return n}function Dg(n,e){do{var t=Rt;try{if(vf(),nl.current=Il,Dl){for(var i=mt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Dl=!1}if(Ir=0,zt=bt=mt=null,Eo=!1,Wo=0,Pf.current=null,t===null||t.return===null){Lt=1,Yo=e,Rt=null;break}e:{var s=n,o=t.return,a=t,l=e;if(e=Vt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=a,h=u.tag;if(!(u.mode&1)&&(h===0||h===11||h===15)){var d=u.alternate;d?(u.updateQueue=d.updateQueue,u.memoizedState=d.memoizedState,u.lanes=d.lanes):(u.updateQueue=null,u.memoizedState=null)}var p=tp(o);if(p!==null){p.flags&=-257,np(p,o,a,s,e),p.mode&1&&ep(s,c,e),e=p,l=c;var _=e.updateQueue;if(_===null){var x=new Set;x.add(l),e.updateQueue=x}else _.add(l);break e}else{if(!(e&1)){ep(s,c,e),Uf();break e}l=Error(te(426))}}else if(ft&&a.mode&1){var m=tp(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),np(m,o,a,s,e),mf(ks(l,a));break e}}s=l=ks(l,a),Lt!==4&&(Lt=2),To===null?To=[s]:To.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var f=mg(s,l,e);qd(s,f);break e;case 1:a=l;var g=s.type,v=s.stateNode;if(!(s.flags&128)&&(typeof g.getDerivedStateFromError=="function"||v!==null&&typeof v.componentDidCatch=="function"&&(Ji===null||!Ji.has(v)))){s.flags|=65536,e&=-e,s.lanes|=e;var M=gg(s,a,e);qd(s,M);break e}}s=s.return}while(s!==null)}Ug(t)}catch(b){e=b,Rt===t&&t!==null&&(Rt=t=t.return);continue}break}while(!0)}function Ig(){var n=Nl.current;return Nl.current=Il,n===null?Il:n}function Uf(){(Lt===0||Lt===3||Lt===2)&&(Lt=4),Ft===null||!(Nr&268435455)&&!(nc&268435455)||Vi(Ft,Vt)}function Fl(n,e){var t=qe;qe|=2;var i=Ig();(Ft!==n||Vt!==e)&&(gi=null,br(n,e));do try{Xx();break}catch(r){Dg(n,r)}while(!0);if(vf(),qe=t,Nl.current=i,Rt!==null)throw Error(te(261));return Ft=null,Vt=0,Lt}function Xx(){for(;Rt!==null;)Ng(Rt)}function jx(){for(;Rt!==null&&!v_();)Ng(Rt)}function Ng(n){var e=Fg(n.alternate,n,vn);n.memoizedProps=n.pendingProps,e===null?Ug(n):Rt=e,Pf.current=null}function Ug(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=Ox(t,e),t!==null){t.flags&=32767,Rt=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Lt=6,Rt=null;return}}else if(t=kx(t,e,vn),t!==null){Rt=t;return}if(e=e.sibling,e!==null){Rt=e;return}Rt=e=n}while(e!==null);Lt===0&&(Lt=5)}function yr(n,e,t){var i=nt,r=In.transition;try{In.transition=null,nt=1,Yx(n,e,t,i)}finally{In.transition=r,nt=i}return null}function Yx(n,e,t,i){do Rs();while(ji!==null);if(qe&6)throw Error(te(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(te(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(C_(n,s),n===Ft&&(Rt=Ft=null,Vt=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||Ea||(Ea=!0,kg(_l,function(){return Rs(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=In.transition,In.transition=null;var o=nt;nt=1;var a=qe;qe|=4,Pf.current=null,Hx(n,t),bg(t,n),dx(Gu),yl=!!Vu,Gu=Vu=null,n.current=t,Vx(t),__(),qe=a,nt=o,In.transition=s}else n.current=t;if(Ea&&(Ea=!1,ji=n,zl=r),s=n.pendingLanes,s===0&&(Ji=null),M_(t.stateNode),fn(n,St()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(Ul)throw Ul=!1,n=ch,ch=null,n;return zl&1&&n.tag!==0&&Rs(),s=n.pendingLanes,s&1?n===uh?Ao++:(Ao=0,uh=n):Ao=0,ur(),null}function Rs(){if(ji!==null){var n=m0(zl),e=In.transition,t=nt;try{if(In.transition=null,nt=16>n?16:n,ji===null)var i=!1;else{if(n=ji,ji=null,zl=0,qe&6)throw Error(te(331));var r=qe;for(qe|=4,pe=n.current;pe!==null;){var s=pe,o=s.child;if(pe.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(pe=c;pe!==null;){var u=pe;switch(u.tag){case 0:case 11:case 15:wo(8,u,s)}var h=u.child;if(h!==null)h.return=u,pe=h;else for(;pe!==null;){u=pe;var d=u.sibling,p=u.return;if(Ag(u),u===c){pe=null;break}if(d!==null){d.return=p,pe=d;break}pe=p}}}var _=s.alternate;if(_!==null){var x=_.child;if(x!==null){_.child=null;do{var m=x.sibling;x.sibling=null,x=m}while(x!==null)}}pe=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,pe=o;else e:for(;pe!==null;){if(s=pe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:wo(9,s,s.return)}var f=s.sibling;if(f!==null){f.return=s.return,pe=f;break e}pe=s.return}}var g=n.current;for(pe=g;pe!==null;){o=pe;var v=o.child;if(o.subtreeFlags&2064&&v!==null)v.return=o,pe=v;else e:for(o=g;pe!==null;){if(a=pe,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:tc(9,a)}}catch(b){yt(a,a.return,b)}if(a===o){pe=null;break e}var M=a.sibling;if(M!==null){M.return=a.return,pe=M;break e}pe=a.return}}if(qe=r,ur(),si&&typeof si.onPostCommitFiberRoot=="function")try{si.onPostCommitFiberRoot(Yl,n)}catch{}i=!0}return i}finally{nt=t,In.transition=e}}return!1}function mp(n,e,t){e=ks(t,e),e=mg(n,e,1),n=Qi(n,e,1),e=nn(),n!==null&&(Zo(n,1,e),fn(n,e))}function yt(n,e,t){if(n.tag===3)mp(n,n,t);else for(;e!==null;){if(e.tag===3){mp(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Ji===null||!Ji.has(i))){n=ks(t,n),n=gg(e,n,1),e=Qi(e,n,1),n=nn(),e!==null&&(Zo(e,1,n),fn(e,n));break}}e=e.return}}function qx(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=nn(),n.pingedLanes|=n.suspendedLanes&t,Ft===n&&(Vt&t)===t&&(Lt===4||Lt===3&&(Vt&130023424)===Vt&&500>St()-Df?br(n,0):Lf|=t),fn(n,e)}function zg(n,e){e===0&&(n.mode&1?(e=da,da<<=1,!(da&130023424)&&(da=4194304)):e=1);var t=nn();n=Ai(n,e),n!==null&&(Zo(n,e,t),fn(n,t))}function $x(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),zg(n,t)}function Kx(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(te(314))}i!==null&&i.delete(e),zg(n,t)}var Fg;Fg=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||un.current)cn=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return cn=!1,Fx(n,e,t);cn=!!(n.flags&131072)}else cn=!1,ft&&e.flags&1048576&&H0(e,Cl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;rl(n,e),n=e.pendingProps;var r=Ns(e,Kt.current);Cs(e,t),r=Tf(null,e,i,n,r,t);var s=Af();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,hn(i)?(s=!0,Tl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,yf(e),r.updater=ec,e.stateNode=r,r._reactInternals=e,Qu(e,i,n,t),e=th(null,e,i,!0,s,t)):(e.tag=0,ft&&s&&df(e),Jt(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(rl(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=Qx(i),n=Hn(i,n),r){case 0:e=eh(null,e,i,n,t);break e;case 1:e=sp(null,e,i,n,t);break e;case 11:e=ip(null,e,i,n,t);break e;case 14:e=rp(null,e,i,Hn(i.type,n),t);break e}throw Error(te(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Hn(i,r),eh(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Hn(i,r),sp(n,e,i,r,t);case 3:e:{if(yg(e),n===null)throw Error(te(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Y0(n,e),Pl(e,i,null,t);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=ks(Error(te(423)),e),e=op(n,e,i,t,r);break e}else if(i!==r){r=ks(Error(te(424)),e),e=op(n,e,i,t,r);break e}else for(yn=Zi(e.stateNode.containerInfo.firstChild),Mn=e,ft=!0,Wn=null,t=X0(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Us(),i===r){e=Ci(n,e,t);break e}Jt(n,e,i,t)}e=e.child}return e;case 5:return q0(e),n===null&&$u(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,o=r.children,Wu(i,r)?o=null:s!==null&&Wu(i,s)&&(e.flags|=32),xg(n,e),Jt(n,e,o,t),e.child;case 6:return n===null&&$u(e),null;case 13:return Mg(n,e,t);case 4:return Mf(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=zs(e,null,i,t):Jt(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Hn(i,r),ip(n,e,i,r,t);case 7:return Jt(n,e,e.pendingProps,t),e.child;case 8:return Jt(n,e,e.pendingProps.children,t),e.child;case 12:return Jt(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,st(Rl,i._currentValue),i._currentValue=o,s!==null)if($n(s.value,o)){if(s.children===r.children&&!un.current){e=Ci(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Ei(-1,t&-t),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),Ku(s.return,t,e),a.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(te(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),Ku(o,t,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}Jt(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Cs(e,t),r=Nn(r),i=i(r),e.flags|=1,Jt(n,e,i,t),e.child;case 14:return i=e.type,r=Hn(i,e.pendingProps),r=Hn(i.type,r),rp(n,e,i,r,t);case 15:return vg(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Hn(i,r),rl(n,e),e.tag=1,hn(i)?(n=!0,Tl(e)):n=!1,Cs(e,t),pg(e,i,r),Qu(e,i,r,t),th(null,e,i,!0,n,t);case 19:return Sg(n,e,t);case 22:return _g(n,e,t)}throw Error(te(156,e.tag))};function kg(n,e){return h0(n,e)}function Zx(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ln(n,e,t,i){return new Zx(n,e,t,i)}function zf(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Qx(n){if(typeof n=="function")return zf(n)?1:0;if(n!=null){if(n=n.$$typeof,n===ef)return 11;if(n===tf)return 14}return 2}function tr(n,e){var t=n.alternate;return t===null?(t=Ln(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function al(n,e,t,i,r,s){var o=2;if(i=n,typeof n=="function")zf(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case cs:return Pr(t.children,r,s,e);case Jh:o=8,r|=8;break;case Su:return n=Ln(12,t,e,r|2),n.elementType=Su,n.lanes=s,n;case Eu:return n=Ln(13,t,e,r),n.elementType=Eu,n.lanes=s,n;case wu:return n=Ln(19,t,e,r),n.elementType=wu,n.lanes=s,n;case qm:return ic(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case jm:o=10;break e;case Ym:o=9;break e;case ef:o=11;break e;case tf:o=14;break e;case Oi:o=16,i=null;break e}throw Error(te(130,n==null?n:typeof n,""))}return e=Ln(o,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function Pr(n,e,t,i){return n=Ln(7,n,i,e),n.lanes=t,n}function ic(n,e,t,i){return n=Ln(22,n,i,e),n.elementType=qm,n.lanes=t,n.stateNode={isHidden:!1},n}function Hc(n,e,t){return n=Ln(6,n,null,e),n.lanes=t,n}function Vc(n,e,t){return e=Ln(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function Jx(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Sc(0),this.expirationTimes=Sc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Sc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Ff(n,e,t,i,r,s,o,a,l){return n=new Jx(n,e,t,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Ln(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},yf(s),n}function ey(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ls,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function Og(n){if(!n)return sr;n=n._reactInternals;e:{if(Or(n)!==n||n.tag!==1)throw Error(te(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(hn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(te(171))}if(n.tag===1){var t=n.type;if(hn(t))return O0(n,t,e)}return e}function Bg(n,e,t,i,r,s,o,a,l){return n=Ff(t,i,!0,n,r,s,o,a,l),n.context=Og(null),t=n.current,i=nn(),r=er(t),s=Ei(i,r),s.callback=e??null,Qi(t,s,r),n.current.lanes=r,Zo(n,r,i),fn(n,i),n}function rc(n,e,t,i){var r=e.current,s=nn(),o=er(r);return t=Og(t),e.context===null?e.context=t:e.pendingContext=t,e=Ei(s,o),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=Qi(r,e,o),n!==null&&(qn(n,r,o,s),tl(n,r,o)),o}function kl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function gp(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function kf(n,e){gp(n,e),(n=n.alternate)&&gp(n,e)}function ty(){return null}var Hg=typeof reportError=="function"?reportError:function(n){console.error(n)};function Of(n){this._internalRoot=n}sc.prototype.render=Of.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(te(409));rc(n,e,null,null)};sc.prototype.unmount=Of.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;Ur(function(){rc(null,n,null,null)}),e[Ti]=null}};function sc(n){this._internalRoot=n}sc.prototype.unstable_scheduleHydration=function(n){if(n){var e=_0();n={blockedOn:null,target:n,priority:e};for(var t=0;t<Hi.length&&e!==0&&e<Hi[t].priority;t++);Hi.splice(t,0,n),t===0&&y0(n)}};function Bf(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function oc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function vp(){}function ny(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=kl(o);s.call(c)}}var o=Bg(e,i,n,0,null,!1,!1,"",vp);return n._reactRootContainer=o,n[Ti]=o.current,Oo(n.nodeType===8?n.parentNode:n),Ur(),o}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=kl(l);a.call(c)}}var l=Ff(n,0,!1,null,null,!1,!1,"",vp);return n._reactRootContainer=l,n[Ti]=l.current,Oo(n.nodeType===8?n.parentNode:n),Ur(function(){rc(e,l,t,i)}),l}function ac(n,e,t,i,r){var s=t._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=kl(o);a.call(l)}}rc(e,o,n,r)}else o=ny(t,e,n,r,i);return kl(o)}g0=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=mo(e.pendingLanes);t!==0&&(sf(e,t|1),fn(e,St()),!(qe&6)&&(Os=St()+500,ur()))}break;case 13:Ur(function(){var i=Ai(n,1);if(i!==null){var r=nn();qn(i,n,1,r)}}),kf(n,1)}};of=function(n){if(n.tag===13){var e=Ai(n,134217728);if(e!==null){var t=nn();qn(e,n,134217728,t)}kf(n,134217728)}};v0=function(n){if(n.tag===13){var e=er(n),t=Ai(n,e);if(t!==null){var i=nn();qn(t,n,e,i)}kf(n,e)}};_0=function(){return nt};x0=function(n,e){var t=nt;try{return nt=n,e()}finally{nt=t}};Nu=function(n,e,t){switch(e){case"input":if(Cu(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=Zl(i);if(!r)throw Error(te(90));Km(i),Cu(i,r)}}}break;case"textarea":Qm(n,t);break;case"select":e=t.value,e!=null&&Es(n,!!t.multiple,e,!1)}};s0=If;o0=Ur;var iy={usingClientEntryPoint:!1,Events:[Jo,ds,Zl,i0,r0,If]},oo={findFiberByHostInstance:Tr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},ry={bundleType:oo.bundleType,version:oo.version,rendererPackageName:oo.rendererPackageName,rendererConfig:oo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:bi.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=c0(n),n===null?null:n.stateNode},findFiberByHostInstance:oo.findFiberByHostInstance||ty,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var wa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!wa.isDisabled&&wa.supportsFiber)try{Yl=wa.inject(ry),si=wa}catch{}}En.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=iy;En.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Bf(e))throw Error(te(200));return ey(n,e,null,t)};En.createRoot=function(n,e){if(!Bf(n))throw Error(te(299));var t=!1,i="",r=Hg;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Ff(n,1,!1,null,null,t,!1,i,r),n[Ti]=e.current,Oo(n.nodeType===8?n.parentNode:n),new Of(e)};En.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(te(188)):(n=Object.keys(n).join(","),Error(te(268,n)));return n=c0(e),n=n===null?null:n.stateNode,n};En.flushSync=function(n){return Ur(n)};En.hydrate=function(n,e,t){if(!oc(e))throw Error(te(200));return ac(null,n,e,!0,t)};En.hydrateRoot=function(n,e,t){if(!Bf(n))throw Error(te(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",o=Hg;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=Bg(e,null,n,1,t??null,r,!1,s,o),n[Ti]=e.current,Oo(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new sc(e)};En.render=function(n,e,t){if(!oc(e))throw Error(te(200));return ac(null,n,e,!1,t)};En.unmountComponentAtNode=function(n){if(!oc(n))throw Error(te(40));return n._reactRootContainer?(Ur(function(){ac(null,null,n,!1,function(){n._reactRootContainer=null,n[Ti]=null})}),!0):!1};En.unstable_batchedUpdates=If;En.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!oc(t))throw Error(te(200));if(n==null||n._reactInternals===void 0)throw Error(te(38));return ac(n,e,t,!1,i)};En.version="18.3.1-next-f1338f8080-20240426";function Vg(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Vg)}catch(n){console.error(n)}}Vg(),Vm.exports=En;var sy=Vm.exports,Gg,_p=sy;Gg=_p.createRoot,_p.hydrateRoot;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Hf="166",oy=0,xp=1,ay=2,Wg=1,Xg=2,mi=3,or=0,rn=1,_i=2,nr=0,bs=1,Ps=2,yp=3,Mp=4,ly=5,Er=100,cy=101,uy=102,hy=103,fy=104,dy=200,py=201,my=202,gy=203,dh=204,ph=205,vy=206,_y=207,xy=208,yy=209,My=210,Sy=211,Ey=212,wy=213,Ty=214,Ay=0,Cy=1,Ry=2,Ol=3,by=4,Py=5,Ly=6,Dy=7,Vf=0,Iy=1,Ny=2,ir=0,Uy=1,zy=2,Fy=3,ky=4,Oy=5,By=6,Hy=7,jg=300,Bs=301,Hs=302,mh=303,gh=304,lc=306,Bl=1e3,Yi=1001,vh=1002,Dn=1003,Vy=1004,Ta=1005,Xn=1006,Gc=1007,Rr=1008,Ri=1009,Yg=1010,qg=1011,qo=1012,Gf=1013,zr=1014,Mi=1015,ta=1016,Wf=1017,Xf=1018,Vs=1020,$g=35902,Kg=1021,Zg=1022,jn=1023,Qg=1024,Jg=1025,Ls=1026,Gs=1027,ev=1028,jf=1029,tv=1030,Yf=1031,qf=1033,ll=33776,cl=33777,ul=33778,hl=33779,_h=35840,xh=35841,yh=35842,Mh=35843,Sh=36196,Eh=37492,wh=37496,Th=37808,Ah=37809,Ch=37810,Rh=37811,bh=37812,Ph=37813,Lh=37814,Dh=37815,Ih=37816,Nh=37817,Uh=37818,zh=37819,Fh=37820,kh=37821,fl=36492,Oh=36494,Bh=36495,nv=36283,Hh=36284,Vh=36285,Gh=36286,Gy=3200,Wy=3201,iv=0,Xy=1,Gi="",Gn="srgb",hr="srgb-linear",$f="display-p3",cc="display-p3-linear",Hl="linear",at="srgb",Vl="rec709",Gl="p3",Vr=7680,Sp=519,jy=512,Yy=513,qy=514,rv=515,$y=516,Ky=517,Zy=518,Qy=519,Ep=35044,wp="300 es",Si=2e3,Wl=2001;class qs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Tp=1234567;const Co=Math.PI/180,$o=180/Math.PI;function $s(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(jt[n&255]+jt[n>>8&255]+jt[n>>16&255]+jt[n>>24&255]+"-"+jt[e&255]+jt[e>>8&255]+"-"+jt[e>>16&15|64]+jt[e>>24&255]+"-"+jt[t&63|128]+jt[t>>8&255]+"-"+jt[t>>16&255]+jt[t>>24&255]+jt[i&255]+jt[i>>8&255]+jt[i>>16&255]+jt[i>>24&255]).toLowerCase()}function tn(n,e,t){return Math.max(e,Math.min(t,n))}function Kf(n,e){return(n%e+e)%e}function Jy(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function eM(n,e,t){return n!==e?(t-n)/(e-n):0}function Ro(n,e,t){return(1-t)*n+t*e}function tM(n,e,t,i){return Ro(n,e,1-Math.exp(-t*i))}function nM(n,e=1){return e-Math.abs(Kf(n,e*2)-e)}function iM(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function rM(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function sM(n,e){return n+Math.floor(Math.random()*(e-n+1))}function oM(n,e){return n+Math.random()*(e-n)}function aM(n){return n*(.5-Math.random())}function lM(n){n!==void 0&&(Tp=n);let e=Tp+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function cM(n){return n*Co}function uM(n){return n*$o}function hM(n){return(n&n-1)===0&&n!==0}function fM(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function dM(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function pM(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),d=o((e-i)/2),p=s((i-e)/2),_=o((i-e)/2);switch(r){case"XYX":n.set(a*u,l*h,l*d,a*c);break;case"YZY":n.set(l*d,a*u,l*h,a*c);break;case"ZXZ":n.set(l*h,l*d,a*u,a*c);break;case"XZX":n.set(a*u,l*_,l*p,a*c);break;case"YXY":n.set(l*p,a*u,l*_,a*c);break;case"ZYZ":n.set(l*_,l*p,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function os(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Zt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Wh={DEG2RAD:Co,RAD2DEG:$o,generateUUID:$s,clamp:tn,euclideanModulo:Kf,mapLinear:Jy,inverseLerp:eM,lerp:Ro,damp:tM,pingpong:nM,smoothstep:iM,smootherstep:rM,randInt:sM,randFloat:oM,randFloatSpread:aM,seededRandom:lM,degToRad:cM,radToDeg:uM,isPowerOfTwo:hM,ceilPowerOfTwo:fM,floorPowerOfTwo:dM,setQuaternionFromProperEuler:pM,normalize:Zt,denormalize:os};class Ge{constructor(e=0,t=0){Ge.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(tn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ze{constructor(e,t,i,r,s,o,a,l,c){ze.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],p=i[5],_=i[8],x=r[0],m=r[3],f=r[6],g=r[1],v=r[4],M=r[7],b=r[2],A=r[5],T=r[8];return s[0]=o*x+a*g+l*b,s[3]=o*m+a*v+l*A,s[6]=o*f+a*M+l*T,s[1]=c*x+u*g+h*b,s[4]=c*m+u*v+h*A,s[7]=c*f+u*M+h*T,s[2]=d*x+p*g+_*b,s[5]=d*m+p*v+_*A,s[8]=d*f+p*M+_*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*s,p=c*s-o*l,_=t*h+i*d+r*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/_;return e[0]=h*x,e[1]=(r*c-u*i)*x,e[2]=(a*i-r*o)*x,e[3]=d*x,e[4]=(u*t-r*l)*x,e[5]=(r*s-a*t)*x,e[6]=p*x,e[7]=(i*l-c*t)*x,e[8]=(o*t-i*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Wc.makeScale(e,t)),this}rotate(e){return this.premultiply(Wc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wc=new ze;function sv(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Xl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function mM(){const n=Xl("canvas");return n.style.display="block",n}const Ap={};function ov(n){n in Ap||(Ap[n]=!0,console.warn(n))}function gM(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const Cp=new ze().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Rp=new ze().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Aa={[hr]:{transfer:Hl,primaries:Vl,toReference:n=>n,fromReference:n=>n},[Gn]:{transfer:at,primaries:Vl,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[cc]:{transfer:Hl,primaries:Gl,toReference:n=>n.applyMatrix3(Rp),fromReference:n=>n.applyMatrix3(Cp)},[$f]:{transfer:at,primaries:Gl,toReference:n=>n.convertSRGBToLinear().applyMatrix3(Rp),fromReference:n=>n.applyMatrix3(Cp).convertLinearToSRGB()}},vM=new Set([hr,cc]),tt={enabled:!0,_workingColorSpace:hr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!vM.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=Aa[e].toReference,r=Aa[t].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Aa[n].primaries},getTransfer:function(n){return n===Gi?Hl:Aa[n].transfer}};function Ds(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Xc(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Gr;class _M{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Gr===void 0&&(Gr=Xl("canvas")),Gr.width=e.width,Gr.height=e.height;const i=Gr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Gr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Xl("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ds(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ds(t[i]/255)*255):t[i]=Ds(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xM=0;class av{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xM++}),this.uuid=$s(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(jc(r[o].image)):s.push(jc(r[o]))}else s=jc(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function jc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?_M.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yM=0;class sn extends qs{constructor(e=sn.DEFAULT_IMAGE,t=sn.DEFAULT_MAPPING,i=Yi,r=Yi,s=Xn,o=Rr,a=jn,l=Ri,c=sn.DEFAULT_ANISOTROPY,u=Gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yM++}),this.uuid=$s(),this.name="",this.source=new av(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ge(0,0),this.repeat=new Ge(1,1),this.center=new Ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==jg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Bl:e.x=e.x-Math.floor(e.x);break;case Yi:e.x=e.x<0?0:1;break;case vh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Bl:e.y=e.y-Math.floor(e.y);break;case Yi:e.y=e.y<0?0:1;break;case vh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}sn.DEFAULT_IMAGE=null;sn.DEFAULT_MAPPING=jg;sn.DEFAULT_ANISOTROPY=1;class lt{constructor(e=0,t=0,i=0,r=1){lt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],p=l[5],_=l[9],x=l[2],m=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-x)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+x)<.1&&Math.abs(_+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,M=(p+1)/2,b=(f+1)/2,A=(u+d)/4,T=(h+x)/4,L=(_+m)/4;return v>M&&v>b?v<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(v),r=A/i,s=T/i):M>b?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=A/r,s=L/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=T/s,r=L/s),this.set(i,r,s,t),this}let g=Math.sqrt((m-_)*(m-_)+(h-x)*(h-x)+(d-u)*(d-u));return Math.abs(g)<.001&&(g=1),this.x=(m-_)/g,this.y=(h-x)/g,this.z=(d-u)/g,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class MM extends qs{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new sn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new av(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fr extends MM{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class lv extends sn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=Yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class SM extends sn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=Yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class na{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const d=s[o+0],p=s[o+1],_=s[o+2],x=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=_,e[t+3]=x;return}if(h!==x||l!==d||c!==p||u!==_){let m=1-a;const f=l*d+c*p+u*_+h*x,g=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){const b=Math.sqrt(v),A=Math.atan2(b,f*g);m=Math.sin(m*A)/b,a=Math.sin(a*A)/b}const M=a*g;if(l=l*m+d*M,c=c*m+p*M,u=u*m+_*M,h=h*m+x*M,m===1-a){const b=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=b,c*=b,u*=b,h*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],d=s[o+1],p=s[o+2],_=s[o+3];return e[t]=a*_+u*h+l*p-c*d,e[t+1]=l*_+u*d+c*h-a*p,e[t+2]=c*_+u*p+a*d-l*h,e[t+3]=u*_-a*h-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),d=l(i/2),p=l(r/2),_=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*p*_,this._y=c*p*h-d*u*_,this._z=c*u*_+d*p*h,this._w=c*u*h-d*p*_;break;case"YXZ":this._x=d*u*h+c*p*_,this._y=c*p*h-d*u*_,this._z=c*u*_-d*p*h,this._w=c*u*h+d*p*_;break;case"ZXY":this._x=d*u*h-c*p*_,this._y=c*p*h+d*u*_,this._z=c*u*_+d*p*h,this._w=c*u*h-d*p*_;break;case"ZYX":this._x=d*u*h-c*p*_,this._y=c*p*h+d*u*_,this._z=c*u*_-d*p*h,this._w=c*u*h+d*p*_;break;case"YZX":this._x=d*u*h+c*p*_,this._y=c*p*h+d*u*_,this._z=c*u*_-d*p*h,this._w=c*u*h-d*p*_;break;case"XZY":this._x=d*u*h-c*p*_,this._y=c*p*h-d*u*_,this._z=c*u*_+d*p*h,this._w=c*u*h+d*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tn(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,t=0,i=0){F.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(bp.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(bp.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Yc.copy(this).projectOnVector(e),this.sub(Yc)}reflect(e){return this.sub(Yc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(tn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Yc=new F,bp=new na;class ia{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(kn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(kn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=kn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,kn):kn.fromBufferAttribute(s,o),kn.applyMatrix4(e.matrixWorld),this.expandByPoint(kn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ca.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ca.copy(i.boundingBox)),Ca.applyMatrix4(e.matrixWorld),this.union(Ca)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,kn),kn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ao),Ra.subVectors(this.max,ao),Wr.subVectors(e.a,ao),Xr.subVectors(e.b,ao),jr.subVectors(e.c,ao),Di.subVectors(Xr,Wr),Ii.subVectors(jr,Xr),dr.subVectors(Wr,jr);let t=[0,-Di.z,Di.y,0,-Ii.z,Ii.y,0,-dr.z,dr.y,Di.z,0,-Di.x,Ii.z,0,-Ii.x,dr.z,0,-dr.x,-Di.y,Di.x,0,-Ii.y,Ii.x,0,-dr.y,dr.x,0];return!qc(t,Wr,Xr,jr,Ra)||(t=[1,0,0,0,1,0,0,0,1],!qc(t,Wr,Xr,jr,Ra))?!1:(ba.crossVectors(Di,Ii),t=[ba.x,ba.y,ba.z],qc(t,Wr,Xr,jr,Ra))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ui),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ui=[new F,new F,new F,new F,new F,new F,new F,new F],kn=new F,Ca=new ia,Wr=new F,Xr=new F,jr=new F,Di=new F,Ii=new F,dr=new F,ao=new F,Ra=new F,ba=new F,pr=new F;function qc(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){pr.fromArray(n,s);const a=r.x*Math.abs(pr.x)+r.y*Math.abs(pr.y)+r.z*Math.abs(pr.z),l=e.dot(pr),c=t.dot(pr),u=i.dot(pr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const EM=new ia,lo=new F,$c=new F;class Zf{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):EM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;lo.subVectors(e,this.center);const t=lo.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(lo,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($c.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(lo.copy(e.center).add($c)),this.expandByPoint(lo.copy(e.center).sub($c))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const hi=new F,Kc=new F,Pa=new F,Ni=new F,Zc=new F,La=new F,Qc=new F;class wM{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hi.copy(this.origin).addScaledVector(this.direction,t),hi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Kc.copy(e).add(t).multiplyScalar(.5),Pa.copy(t).sub(e).normalize(),Ni.copy(this.origin).sub(Kc);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Pa),a=Ni.dot(this.direction),l=-Ni.dot(Pa),c=Ni.lengthSq(),u=Math.abs(1-o*o);let h,d,p,_;if(u>0)if(h=o*l-a,d=o*a-l,_=s*u,h>=0)if(d>=-_)if(d<=_){const x=1/u;h*=x,d*=x,p=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d<=-_?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c):d<=_?(h=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Kc).addScaledVector(Pa,d),p}intersectSphere(e,t){hi.subVectors(e.center,this.origin);const i=hi.dot(this.direction),r=hi.dot(hi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,hi)!==null}intersectTriangle(e,t,i,r,s){Zc.subVectors(t,e),La.subVectors(i,e),Qc.crossVectors(Zc,La);let o=this.direction.dot(Qc),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ni.subVectors(this.origin,e);const l=a*this.direction.dot(La.crossVectors(Ni,La));if(l<0)return null;const c=a*this.direction.dot(Zc.cross(Ni));if(c<0||l+c>o)return null;const u=-a*Ni.dot(Qc);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mt{constructor(e,t,i,r,s,o,a,l,c,u,h,d,p,_,x,m){Mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,d,p,_,x,m)}set(e,t,i,r,s,o,a,l,c,u,h,d,p,_,x,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=_,f[11]=x,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Mt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Yr.setFromMatrixColumn(e,0).length(),s=1/Yr.setFromMatrixColumn(e,1).length(),o=1/Yr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*u,p=o*h,_=a*u,x=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=p+_*c,t[5]=d-x*c,t[9]=-a*l,t[2]=x-d*c,t[6]=_+p*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*u,p=l*h,_=c*u,x=c*h;t[0]=d+x*a,t[4]=_*a-p,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=p*a-_,t[6]=x+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*u,p=l*h,_=c*u,x=c*h;t[0]=d-x*a,t[4]=-o*h,t[8]=_+p*a,t[1]=p+_*a,t[5]=o*u,t[9]=x-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*u,p=o*h,_=a*u,x=a*h;t[0]=l*u,t[4]=_*c-p,t[8]=d*c+x,t[1]=l*h,t[5]=x*c+d,t[9]=p*c-_,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,p=o*c,_=a*l,x=a*c;t[0]=l*u,t[4]=x-d*h,t[8]=_*h+p,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*h+_,t[10]=d-x*h}else if(e.order==="XZY"){const d=o*l,p=o*c,_=a*l,x=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+x,t[5]=o*u,t[9]=p*h-_,t[2]=_*h-p,t[6]=a*u,t[10]=x*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(TM,e,AM)}lookAt(e,t,i){const r=this.elements;return mn.subVectors(e,t),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),Ui.crossVectors(i,mn),Ui.lengthSq()===0&&(Math.abs(i.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),Ui.crossVectors(i,mn)),Ui.normalize(),Da.crossVectors(mn,Ui),r[0]=Ui.x,r[4]=Da.x,r[8]=mn.x,r[1]=Ui.y,r[5]=Da.y,r[9]=mn.y,r[2]=Ui.z,r[6]=Da.z,r[10]=mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],p=i[13],_=i[2],x=i[6],m=i[10],f=i[14],g=i[3],v=i[7],M=i[11],b=i[15],A=r[0],T=r[4],L=r[8],w=r[12],y=r[1],D=r[5],H=r[9],C=r[13],X=r[2],Y=r[6],W=r[10],q=r[14],N=r[3],K=r[7],J=r[11],ae=r[15];return s[0]=o*A+a*y+l*X+c*N,s[4]=o*T+a*D+l*Y+c*K,s[8]=o*L+a*H+l*W+c*J,s[12]=o*w+a*C+l*q+c*ae,s[1]=u*A+h*y+d*X+p*N,s[5]=u*T+h*D+d*Y+p*K,s[9]=u*L+h*H+d*W+p*J,s[13]=u*w+h*C+d*q+p*ae,s[2]=_*A+x*y+m*X+f*N,s[6]=_*T+x*D+m*Y+f*K,s[10]=_*L+x*H+m*W+f*J,s[14]=_*w+x*C+m*q+f*ae,s[3]=g*A+v*y+M*X+b*N,s[7]=g*T+v*D+M*Y+b*K,s[11]=g*L+v*H+M*W+b*J,s[15]=g*w+v*C+M*q+b*ae,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],p=e[14],_=e[3],x=e[7],m=e[11],f=e[15];return _*(+s*l*h-r*c*h-s*a*d+i*c*d+r*a*p-i*l*p)+x*(+t*l*p-t*c*d+s*o*d-r*o*p+r*c*u-s*l*u)+m*(+t*c*h-t*a*p-s*o*h+i*o*p+s*a*u-i*c*u)+f*(-r*a*u-t*l*h+t*a*d+r*o*h-i*o*d+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],p=e[11],_=e[12],x=e[13],m=e[14],f=e[15],g=h*m*c-x*d*c+x*l*p-a*m*p-h*l*f+a*d*f,v=_*d*c-u*m*c-_*l*p+o*m*p+u*l*f-o*d*f,M=u*x*c-_*h*c+_*a*p-o*x*p-u*a*f+o*h*f,b=_*h*l-u*x*l-_*a*d+o*x*d+u*a*m-o*h*m,A=t*g+i*v+r*M+s*b;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/A;return e[0]=g*T,e[1]=(x*d*s-h*m*s-x*r*p+i*m*p+h*r*f-i*d*f)*T,e[2]=(a*m*s-x*l*s+x*r*c-i*m*c-a*r*f+i*l*f)*T,e[3]=(h*l*s-a*d*s-h*r*c+i*d*c+a*r*p-i*l*p)*T,e[4]=v*T,e[5]=(u*m*s-_*d*s+_*r*p-t*m*p-u*r*f+t*d*f)*T,e[6]=(_*l*s-o*m*s-_*r*c+t*m*c+o*r*f-t*l*f)*T,e[7]=(o*d*s-u*l*s+u*r*c-t*d*c-o*r*p+t*l*p)*T,e[8]=M*T,e[9]=(_*h*s-u*x*s-_*i*p+t*x*p+u*i*f-t*h*f)*T,e[10]=(o*x*s-_*a*s+_*i*c-t*x*c-o*i*f+t*a*f)*T,e[11]=(u*a*s-o*h*s-u*i*c+t*h*c+o*i*p-t*a*p)*T,e[12]=b*T,e[13]=(u*x*r-_*h*r+_*i*d-t*x*d-u*i*m+t*h*m)*T,e[14]=(_*a*r-o*x*r-_*i*l+t*x*l+o*i*m-t*a*m)*T,e[15]=(o*h*r-u*a*r+u*i*l-t*h*l-o*i*d+t*a*d)*T,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,d=s*c,p=s*u,_=s*h,x=o*u,m=o*h,f=a*h,g=l*c,v=l*u,M=l*h,b=i.x,A=i.y,T=i.z;return r[0]=(1-(x+f))*b,r[1]=(p+M)*b,r[2]=(_-v)*b,r[3]=0,r[4]=(p-M)*A,r[5]=(1-(d+f))*A,r[6]=(m+g)*A,r[7]=0,r[8]=(_+v)*T,r[9]=(m-g)*T,r[10]=(1-(d+x))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Yr.set(r[0],r[1],r[2]).length();const o=Yr.set(r[4],r[5],r[6]).length(),a=Yr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],On.copy(this);const c=1/s,u=1/o,h=1/a;return On.elements[0]*=c,On.elements[1]*=c,On.elements[2]*=c,On.elements[4]*=u,On.elements[5]*=u,On.elements[6]*=u,On.elements[8]*=h,On.elements[9]*=h,On.elements[10]*=h,t.setFromRotationMatrix(On),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=Si){const l=this.elements,c=2*s/(t-e),u=2*s/(i-r),h=(t+e)/(t-e),d=(i+r)/(i-r);let p,_;if(a===Si)p=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Wl)p=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=Si){const l=this.elements,c=1/(t-e),u=1/(i-r),h=1/(o-s),d=(t+e)*c,p=(i+r)*u;let _,x;if(a===Si)_=(o+s)*h,x=-2*h;else if(a===Wl)_=s*h,x=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Yr=new F,On=new Mt,TM=new F(0,0,0),AM=new F(1,1,1),Ui=new F,Da=new F,mn=new F,Pp=new Mt,Lp=new na;class li{constructor(e=0,t=0,i=0,r=li.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(tn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-tn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(tn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-tn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(tn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-tn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Pp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pp,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Lp.setFromEuler(this),this.setFromQuaternion(Lp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}li.DEFAULT_ORDER="XYZ";class cv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let CM=0;const Dp=new F,qr=new na,fi=new Mt,Ia=new F,co=new F,RM=new F,bM=new na,Ip=new F(1,0,0),Np=new F(0,1,0),Up=new F(0,0,1),zp={type:"added"},PM={type:"removed"},$r={type:"childadded",child:null},Jc={type:"childremoved",child:null};class kt extends qs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:CM++}),this.uuid=$s(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=kt.DEFAULT_UP.clone();const e=new F,t=new li,i=new na,r=new F(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Mt},normalMatrix:{value:new ze}}),this.matrix=new Mt,this.matrixWorld=new Mt,this.matrixAutoUpdate=kt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new cv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return qr.setFromAxisAngle(e,t),this.quaternion.multiply(qr),this}rotateOnWorldAxis(e,t){return qr.setFromAxisAngle(e,t),this.quaternion.premultiply(qr),this}rotateX(e){return this.rotateOnAxis(Ip,e)}rotateY(e){return this.rotateOnAxis(Np,e)}rotateZ(e){return this.rotateOnAxis(Up,e)}translateOnAxis(e,t){return Dp.copy(e).applyQuaternion(this.quaternion),this.position.add(Dp.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ip,e)}translateY(e){return this.translateOnAxis(Np,e)}translateZ(e){return this.translateOnAxis(Up,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ia.copy(e):Ia.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),co.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fi.lookAt(co,Ia,this.up):fi.lookAt(Ia,co,this.up),this.quaternion.setFromRotationMatrix(fi),r&&(fi.extractRotation(r.matrixWorld),qr.setFromRotationMatrix(fi),this.quaternion.premultiply(qr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zp),$r.child=e,this.dispatchEvent($r),$r.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(PM),Jc.child=e,this.dispatchEvent(Jc),Jc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fi.multiply(e.parent.matrixWorld)),e.applyMatrix4(fi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zp),$r.child=e,this.dispatchEvent($r),$r.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(co,e,RM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(co,bM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),p=o(e.animations),_=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),_.length>0&&(i.nodes=_)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}kt.DEFAULT_UP=new F(0,1,0);kt.DEFAULT_MATRIX_AUTO_UPDATE=!0;kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Bn=new F,di=new F,eu=new F,pi=new F,Kr=new F,Zr=new F,Fp=new F,tu=new F,nu=new F,iu=new F;class ri{constructor(e=new F,t=new F,i=new F){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Bn.subVectors(e,t),r.cross(Bn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Bn.subVectors(r,t),di.subVectors(i,t),eu.subVectors(e,t);const o=Bn.dot(Bn),a=Bn.dot(di),l=Bn.dot(eu),c=di.dot(di),u=di.dot(eu),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,p=(c*l-a*u)*d,_=(o*u-a*l)*d;return s.set(1-p-_,_,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,pi.x),l.addScaledVector(o,pi.y),l.addScaledVector(a,pi.z),l)}static isFrontFacing(e,t,i,r){return Bn.subVectors(i,t),di.subVectors(e,t),Bn.cross(di).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Bn.subVectors(this.c,this.b),di.subVectors(this.a,this.b),Bn.cross(di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ri.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ri.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return ri.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return ri.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ri.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Kr.subVectors(r,i),Zr.subVectors(s,i),tu.subVectors(e,i);const l=Kr.dot(tu),c=Zr.dot(tu);if(l<=0&&c<=0)return t.copy(i);nu.subVectors(e,r);const u=Kr.dot(nu),h=Zr.dot(nu);if(u>=0&&h<=u)return t.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(Kr,o);iu.subVectors(e,s);const p=Kr.dot(iu),_=Zr.dot(iu);if(_>=0&&p<=_)return t.copy(s);const x=p*c-l*_;if(x<=0&&c>=0&&_<=0)return a=c/(c-_),t.copy(i).addScaledVector(Zr,a);const m=u*_-p*h;if(m<=0&&h-u>=0&&p-_>=0)return Fp.subVectors(s,r),a=(h-u)/(h-u+(p-_)),t.copy(r).addScaledVector(Fp,a);const f=1/(m+x+d);return o=x*f,a=d*f,t.copy(i).addScaledVector(Kr,o).addScaledVector(Zr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const uv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zi={h:0,s:0,l:0},Na={h:0,s:0,l:0};function ru(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Xe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=tt.workingColorSpace){return this.r=e,this.g=t,this.b=i,tt.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=tt.workingColorSpace){if(e=Kf(e,1),t=tn(t,0,1),i=tn(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=ru(o,s,e+1/3),this.g=ru(o,s,e),this.b=ru(o,s,e-1/3)}return tt.toWorkingColorSpace(this,r),this}setStyle(e,t=Gn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gn){const i=uv[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ds(e.r),this.g=Ds(e.g),this.b=Ds(e.b),this}copyLinearToSRGB(e){return this.r=Xc(e.r),this.g=Xc(e.g),this.b=Xc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gn){return tt.fromWorkingColorSpace(Yt.copy(this),e),Math.round(tn(Yt.r*255,0,255))*65536+Math.round(tn(Yt.g*255,0,255))*256+Math.round(tn(Yt.b*255,0,255))}getHexString(e=Gn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.fromWorkingColorSpace(Yt.copy(this),t);const i=Yt.r,r=Yt.g,s=Yt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=tt.workingColorSpace){return tt.fromWorkingColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=Gn){tt.fromWorkingColorSpace(Yt.copy(this),e);const t=Yt.r,i=Yt.g,r=Yt.b;return e!==Gn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(zi),this.setHSL(zi.h+e,zi.s+t,zi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(zi),e.getHSL(Na);const i=Ro(zi.h,Na.h,t),r=Ro(zi.s,Na.s,t),s=Ro(zi.l,Na.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yt=new Xe;Xe.NAMES=uv;let LM=0;class ra extends qs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:LM++}),this.uuid=$s(),this.name="",this.type="Material",this.blending=bs,this.side=or,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=dh,this.blendDst=ph,this.blendEquation=Er,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=Ol,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Vr,this.stencilZFail=Vr,this.stencilZPass=Vr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==bs&&(i.blending=this.blending),this.side!==or&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==dh&&(i.blendSrc=this.blendSrc),this.blendDst!==ph&&(i.blendDst=this.blendDst),this.blendEquation!==Er&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ol&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Sp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Vr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Vr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Vr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class bn extends ra{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.combine=Vf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new F,Ua=new Ge;class ai{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ep,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return ov("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ua.fromBufferAttribute(this,t),Ua.applyMatrix3(e),this.setXY(t,Ua.x,Ua.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=os(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Zt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=os(t,this.array)),t}setX(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=os(t,this.array)),t}setY(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=os(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=os(t,this.array)),t}setW(e,t){return this.normalized&&(t=Zt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),r=Zt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Zt(t,this.array),i=Zt(i,this.array),r=Zt(r,this.array),s=Zt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ep&&(e.usage=this.usage),e}}class hv extends ai{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class fv extends ai{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Dt extends ai{constructor(e,t,i){super(new Float32Array(e),t,i)}}let DM=0;const An=new Mt,su=new kt,Qr=new F,gn=new ia,uo=new ia,Ut=new F;class Kn extends qs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:DM++}),this.uuid=$s(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(sv(e)?fv:hv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ze().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,i){return An.makeTranslation(e,t,i),this.applyMatrix4(An),this}scale(e,t,i){return An.makeScale(e,t,i),this.applyMatrix4(An),this}lookAt(e){return su.lookAt(e),su.updateMatrix(),this.applyMatrix4(su.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qr).negate(),this.translate(Qr.x,Qr.y,Qr.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Dt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ia);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];gn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zf);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const i=this.boundingSphere.center;if(gn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];uo.setFromBufferAttribute(a),this.morphTargetsRelative?(Ut.addVectors(gn.min,uo.min),gn.expandByPoint(Ut),Ut.addVectors(gn.max,uo.max),gn.expandByPoint(Ut)):(gn.expandByPoint(uo.min),gn.expandByPoint(uo.max))}gn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Ut.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ut));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Ut.fromBufferAttribute(a,c),l&&(Qr.fromBufferAttribute(e,c),Ut.add(Qr)),r=Math.max(r,i.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ai(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<i.count;L++)a[L]=new F,l[L]=new F;const c=new F,u=new F,h=new F,d=new Ge,p=new Ge,_=new Ge,x=new F,m=new F;function f(L,w,y){c.fromBufferAttribute(i,L),u.fromBufferAttribute(i,w),h.fromBufferAttribute(i,y),d.fromBufferAttribute(s,L),p.fromBufferAttribute(s,w),_.fromBufferAttribute(s,y),u.sub(c),h.sub(c),p.sub(d),_.sub(d);const D=1/(p.x*_.y-_.x*p.y);isFinite(D)&&(x.copy(u).multiplyScalar(_.y).addScaledVector(h,-p.y).multiplyScalar(D),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(D),a[L].add(x),a[w].add(x),a[y].add(x),l[L].add(m),l[w].add(m),l[y].add(m))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let L=0,w=g.length;L<w;++L){const y=g[L],D=y.start,H=y.count;for(let C=D,X=D+H;C<X;C+=3)f(e.getX(C+0),e.getX(C+1),e.getX(C+2))}const v=new F,M=new F,b=new F,A=new F;function T(L){b.fromBufferAttribute(r,L),A.copy(b);const w=a[L];v.copy(w),v.sub(b.multiplyScalar(b.dot(w))).normalize(),M.crossVectors(A,w);const D=M.dot(l[L])<0?-1:1;o.setXYZW(L,v.x,v.y,v.z,D)}for(let L=0,w=g.length;L<w;++L){const y=g[L],D=y.start,H=y.count;for(let C=D,X=D+H;C<X;C+=3)T(e.getX(C+0)),T(e.getX(C+1)),T(e.getX(C+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ai(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new F,s=new F,o=new F,a=new F,l=new F,c=new F,u=new F,h=new F;if(e)for(let d=0,p=e.count;d<p;d+=3){const _=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,_),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(_,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let p=0,_=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*u;for(let f=0;f<u;f++)d[_++]=c[p++]}return new ai(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Kn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],p=e(d,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const p=c[h];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const kp=new Mt,mr=new wM,za=new Zf,Op=new F,Jr=new F,es=new F,ts=new F,ou=new F,Fa=new F,ka=new Ge,Oa=new Ge,Ba=new Ge,Bp=new F,Hp=new F,Vp=new F,Ha=new F,Va=new F;class Je extends kt{constructor(e=new Kn,t=new bn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Fa.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(ou.fromBufferAttribute(h,e),o?Fa.addScaledVector(ou,u):Fa.addScaledVector(ou.sub(t),u))}t.add(Fa)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),za.copy(i.boundingSphere),za.applyMatrix4(s),mr.copy(e.ray).recast(e.near),!(za.containsPoint(mr.origin)===!1&&(mr.intersectSphere(za,Op)===null||mr.origin.distanceToSquared(Op)>(e.far-e.near)**2))&&(kp.copy(s).invert(),mr.copy(e.ray).applyMatrix4(kp),!(i.boundingBox!==null&&mr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,mr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,x=d.length;_<x;_++){const m=d[_],f=o[m.materialIndex],g=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=g,b=v;M<b;M+=3){const A=a.getX(M),T=a.getX(M+1),L=a.getX(M+2);r=Ga(this,f,e,i,c,u,h,A,T,L),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const _=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=_,f=x;m<f;m+=3){const g=a.getX(m),v=a.getX(m+1),M=a.getX(m+2);r=Ga(this,o,e,i,c,u,h,g,v,M),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,x=d.length;_<x;_++){const m=d[_],f=o[m.materialIndex],g=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=g,b=v;M<b;M+=3){const A=M,T=M+1,L=M+2;r=Ga(this,f,e,i,c,u,h,A,T,L),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const _=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=_,f=x;m<f;m+=3){const g=m,v=m+1,M=m+2;r=Ga(this,o,e,i,c,u,h,g,v,M),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function IM(n,e,t,i,r,s,o,a){let l;if(e.side===rn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===or,a),l===null)return null;Va.copy(a),Va.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Va);return c<t.near||c>t.far?null:{distance:c,point:Va.clone(),object:n}}function Ga(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Jr),n.getVertexPosition(l,es),n.getVertexPosition(c,ts);const u=IM(n,e,t,i,Jr,es,ts,Ha);if(u){r&&(ka.fromBufferAttribute(r,a),Oa.fromBufferAttribute(r,l),Ba.fromBufferAttribute(r,c),u.uv=ri.getInterpolation(Ha,Jr,es,ts,ka,Oa,Ba,new Ge)),s&&(ka.fromBufferAttribute(s,a),Oa.fromBufferAttribute(s,l),Ba.fromBufferAttribute(s,c),u.uv1=ri.getInterpolation(Ha,Jr,es,ts,ka,Oa,Ba,new Ge)),o&&(Bp.fromBufferAttribute(o,a),Hp.fromBufferAttribute(o,l),Vp.fromBufferAttribute(o,c),u.normal=ri.getInterpolation(Ha,Jr,es,ts,Bp,Hp,Vp,new F),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new F,materialIndex:0};ri.getNormal(Jr,es,ts,h.normal),u.face=h}return u}class Pt extends Kn{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,p=0;_("z","y","x",-1,-1,i,t,e,o,s,0),_("z","y","x",1,-1,i,t,-e,o,s,1),_("x","z","y",1,1,e,i,t,r,o,2),_("x","z","y",1,-1,e,i,-t,r,o,3),_("x","y","z",1,-1,e,t,i,r,s,4),_("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Dt(c,3)),this.setAttribute("normal",new Dt(u,3)),this.setAttribute("uv",new Dt(h,2));function _(x,m,f,g,v,M,b,A,T,L,w){const y=M/T,D=b/L,H=M/2,C=b/2,X=A/2,Y=T+1,W=L+1;let q=0,N=0;const K=new F;for(let J=0;J<W;J++){const ae=J*D-C;for(let Me=0;Me<Y;Me++){const je=Me*y-H;K[x]=je*g,K[m]=ae*v,K[f]=X,c.push(K.x,K.y,K.z),K[x]=0,K[m]=0,K[f]=A>0?1:-1,u.push(K.x,K.y,K.z),h.push(Me/T),h.push(1-J/L),q+=1}}for(let J=0;J<L;J++)for(let ae=0;ae<T;ae++){const Me=d+ae+Y*J,je=d+ae+Y*(J+1),j=d+(ae+1)+Y*(J+1),ie=d+(ae+1)+Y*J;l.push(Me,je,ie),l.push(je,j,ie),N+=6}a.addGroup(p,N,w),p+=N,d+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ws(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Qt(n){const e={};for(let t=0;t<n.length;t++){const i=Ws(n[t]);for(const r in i)e[r]=i[r]}return e}function NM(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function dv(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const UM={clone:Ws,merge:Qt};var zM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,FM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ar extends ra{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zM,this.fragmentShader=FM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ws(e.uniforms),this.uniformsGroups=NM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class pv extends kt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Mt,this.projectionMatrix=new Mt,this.projectionMatrixInverse=new Mt,this.coordinateSystem=Si}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Fi=new F,Gp=new Ge,Wp=new Ge;class xn extends pv{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=$o*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Co*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return $o*2*Math.atan(Math.tan(Co*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,t){return this.getViewBounds(e,Gp,Wp),t.subVectors(Wp,Gp)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Co*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ns=-90,is=1;class kM extends kt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new xn(ns,is,e,t);r.layers=this.layers,this.add(r);const s=new xn(ns,is,e,t);s.layers=this.layers,this.add(s);const o=new xn(ns,is,e,t);o.layers=this.layers,this.add(o);const a=new xn(ns,is,e,t);a.layers=this.layers,this.add(a);const l=new xn(ns,is,e,t);l.layers=this.layers,this.add(l);const c=new xn(ns,is,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===Si)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Wl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,d,p),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class mv extends sn{constructor(e,t,i,r,s,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Bs,super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class OM extends Fr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new mv(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Xn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Pt(5,5,5),s=new ar({name:"CubemapFromEquirect",uniforms:Ws(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:rn,blending:nr});s.uniforms.tEquirect.value=t;const o=new Je(r,s),a=t.minFilter;return t.minFilter===Rr&&(t.minFilter=Xn),new kM(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}const au=new F,BM=new F,HM=new ze;class Mr{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=au.subVectors(i,t).cross(BM.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(au),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||HM.getNormalMatrix(e),r=this.coplanarPoint(au).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gr=new Zf,Wa=new F;class Qf{constructor(e=new Mr,t=new Mr,i=new Mr,r=new Mr,s=new Mr,o=new Mr){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Si){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],h=r[6],d=r[7],p=r[8],_=r[9],x=r[10],m=r[11],f=r[12],g=r[13],v=r[14],M=r[15];if(i[0].setComponents(l-s,d-c,m-p,M-f).normalize(),i[1].setComponents(l+s,d+c,m+p,M+f).normalize(),i[2].setComponents(l+o,d+u,m+_,M+g).normalize(),i[3].setComponents(l-o,d-u,m-_,M-g).normalize(),i[4].setComponents(l-a,d-h,m-x,M-v).normalize(),t===Si)i[5].setComponents(l+a,d+h,m+x,M+v).normalize();else if(t===Wl)i[5].setComponents(a,h,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),gr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),gr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(gr)}intersectsSprite(e){return gr.center.set(0,0,0),gr.radius=.7071067811865476,gr.applyMatrix4(e.matrixWorld),this.intersectsSphere(gr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Wa.x=r.normal.x>0?e.max.x:e.min.x,Wa.y=r.normal.y>0?e.max.y:e.min.y,Wa.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Wa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function gv(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function VM(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l._updateRange,d=l.updateRanges;if(n.bindBuffer(c,a),h.count===-1&&d.length===0&&n.bufferSubData(c,0,u),d.length!==0){for(let p=0,_=d.length;p<_;p++){const x=d[p];n.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}h.count!==-1&&(n.bufferSubData(c,h.offset*u.BYTES_PER_ELEMENT,u,h.offset,h.count),h.count=-1),l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class Ks extends Kn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,d=t/l,p=[],_=[],x=[],m=[];for(let f=0;f<u;f++){const g=f*d-o;for(let v=0;v<c;v++){const M=v*h-s;_.push(M,-g,0),x.push(0,0,1),m.push(v/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let g=0;g<a;g++){const v=g+c*f,M=g+c*(f+1),b=g+1+c*(f+1),A=g+1+c*f;p.push(v,M,A),p.push(M,b,A)}this.setIndex(p),this.setAttribute("position",new Dt(_,3)),this.setAttribute("normal",new Dt(x,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ks(e.width,e.height,e.widthSegments,e.heightSegments)}}var GM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,WM=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,XM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,YM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$M=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,KM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ZM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,QM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,JM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,eS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,tS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,nS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,iS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,rS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,oS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,aS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,cS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,uS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,fS=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,dS=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,pS=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,mS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_S=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,xS="gl_FragColor = linearToOutputTexel( gl_FragColor );",yS=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,MS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,SS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ES=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,TS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,AS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,CS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,RS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,PS=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,LS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,DS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,IS=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,NS=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,US=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,zS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,FS=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,OS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,BS=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,HS=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,VS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,GS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,WS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,XS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jS=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,YS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$S=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,KS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ZS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,QS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,JS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,e1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,t1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,n1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,i1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,r1=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,s1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,o1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,a1=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,l1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,c1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,u1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,h1=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,f1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,d1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,p1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,m1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,g1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,v1=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,_1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,x1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,y1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,M1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,S1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,E1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,w1=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,T1=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,A1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,C1=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,R1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,b1=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,P1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,L1=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,D1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,I1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,N1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,U1=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,z1=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,F1=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,k1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,O1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,B1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,H1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const V1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,G1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,X1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,j1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Y1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,q1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,$1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,K1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Z1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Q1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,J1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,iE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,oE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,aE=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lE=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,uE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,dE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,vE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_E=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,yE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ME=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ue={alphahash_fragment:GM,alphahash_pars_fragment:WM,alphamap_fragment:XM,alphamap_pars_fragment:jM,alphatest_fragment:YM,alphatest_pars_fragment:qM,aomap_fragment:$M,aomap_pars_fragment:KM,batching_pars_vertex:ZM,batching_vertex:QM,begin_vertex:JM,beginnormal_vertex:eS,bsdfs:tS,iridescence_fragment:nS,bumpmap_pars_fragment:iS,clipping_planes_fragment:rS,clipping_planes_pars_fragment:sS,clipping_planes_pars_vertex:oS,clipping_planes_vertex:aS,color_fragment:lS,color_pars_fragment:cS,color_pars_vertex:uS,color_vertex:hS,common:fS,cube_uv_reflection_fragment:dS,defaultnormal_vertex:pS,displacementmap_pars_vertex:mS,displacementmap_vertex:gS,emissivemap_fragment:vS,emissivemap_pars_fragment:_S,colorspace_fragment:xS,colorspace_pars_fragment:yS,envmap_fragment:MS,envmap_common_pars_fragment:SS,envmap_pars_fragment:ES,envmap_pars_vertex:wS,envmap_physical_pars_fragment:US,envmap_vertex:TS,fog_vertex:AS,fog_pars_vertex:CS,fog_fragment:RS,fog_pars_fragment:bS,gradientmap_pars_fragment:PS,lightmap_pars_fragment:LS,lights_lambert_fragment:DS,lights_lambert_pars_fragment:IS,lights_pars_begin:NS,lights_toon_fragment:zS,lights_toon_pars_fragment:FS,lights_phong_fragment:kS,lights_phong_pars_fragment:OS,lights_physical_fragment:BS,lights_physical_pars_fragment:HS,lights_fragment_begin:VS,lights_fragment_maps:GS,lights_fragment_end:WS,logdepthbuf_fragment:XS,logdepthbuf_pars_fragment:jS,logdepthbuf_pars_vertex:YS,logdepthbuf_vertex:qS,map_fragment:$S,map_pars_fragment:KS,map_particle_fragment:ZS,map_particle_pars_fragment:QS,metalnessmap_fragment:JS,metalnessmap_pars_fragment:e1,morphinstance_vertex:t1,morphcolor_vertex:n1,morphnormal_vertex:i1,morphtarget_pars_vertex:r1,morphtarget_vertex:s1,normal_fragment_begin:o1,normal_fragment_maps:a1,normal_pars_fragment:l1,normal_pars_vertex:c1,normal_vertex:u1,normalmap_pars_fragment:h1,clearcoat_normal_fragment_begin:f1,clearcoat_normal_fragment_maps:d1,clearcoat_pars_fragment:p1,iridescence_pars_fragment:m1,opaque_fragment:g1,packing:v1,premultiplied_alpha_fragment:_1,project_vertex:x1,dithering_fragment:y1,dithering_pars_fragment:M1,roughnessmap_fragment:S1,roughnessmap_pars_fragment:E1,shadowmap_pars_fragment:w1,shadowmap_pars_vertex:T1,shadowmap_vertex:A1,shadowmask_pars_fragment:C1,skinbase_vertex:R1,skinning_pars_vertex:b1,skinning_vertex:P1,skinnormal_vertex:L1,specularmap_fragment:D1,specularmap_pars_fragment:I1,tonemapping_fragment:N1,tonemapping_pars_fragment:U1,transmission_fragment:z1,transmission_pars_fragment:F1,uv_pars_fragment:k1,uv_pars_vertex:O1,uv_vertex:B1,worldpos_vertex:H1,background_vert:V1,background_frag:G1,backgroundCube_vert:W1,backgroundCube_frag:X1,cube_vert:j1,cube_frag:Y1,depth_vert:q1,depth_frag:$1,distanceRGBA_vert:K1,distanceRGBA_frag:Z1,equirect_vert:Q1,equirect_frag:J1,linedashed_vert:eE,linedashed_frag:tE,meshbasic_vert:nE,meshbasic_frag:iE,meshlambert_vert:rE,meshlambert_frag:sE,meshmatcap_vert:oE,meshmatcap_frag:aE,meshnormal_vert:lE,meshnormal_frag:cE,meshphong_vert:uE,meshphong_frag:hE,meshphysical_vert:fE,meshphysical_frag:dE,meshtoon_vert:pE,meshtoon_frag:mE,points_vert:gE,points_frag:vE,shadow_vert:_E,shadow_frag:xE,sprite_vert:yE,sprite_frag:ME},ce={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new Ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},ni={basic:{uniforms:Qt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:Qt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:Qt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:Qt([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:Qt([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:Qt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:Qt([ce.points,ce.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:Qt([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:Qt([ce.common,ce.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:Qt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:Qt([ce.sprite,ce.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:Qt([ce.common,ce.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:Qt([ce.lights,ce.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};ni.physical={uniforms:Qt([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const Xa={r:0,b:0,g:0},vr=new li,SE=new Mt;function EE(n,e,t,i,r,s,o){const a=new Xe(0);let l=s===!0?0:1,c,u,h=null,d=0,p=null;function _(g){let v=g.isScene===!0?g.background:null;return v&&v.isTexture&&(v=(g.backgroundBlurriness>0?t:e).get(v)),v}function x(g){let v=!1;const M=_(g);M===null?f(a,l):M&&M.isColor&&(f(M,1),v=!0);const b=n.xr.getEnvironmentBlendMode();b==="additive"?i.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(g,v){const M=_(v);M&&(M.isCubeTexture||M.mapping===lc)?(u===void 0&&(u=new Je(new Pt(1,1,1),new ar({name:"BackgroundCubeMaterial",uniforms:Ws(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(b,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),vr.copy(v.backgroundRotation),vr.x*=-1,vr.y*=-1,vr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(vr.y*=-1,vr.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(SE.makeRotationFromEuler(vr)),u.material.toneMapped=tt.getTransfer(M.colorSpace)!==at,(h!==M||d!==M.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,h=M,d=M.version,p=n.toneMapping),u.layers.enableAll(),g.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Je(new Ks(2,2),new ar({name:"BackgroundMaterial",uniforms:Ws(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:or,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=tt.getTransfer(M.colorSpace)!==at,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,h=M,d=M.version,p=n.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function f(g,v){g.getRGB(Xa,dv(n)),i.buffers.color.setClear(Xa.r,Xa.g,Xa.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(g,v=1){a.set(g),l=v,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,f(a,l)},render:x,addToRenderList:m}}function wE(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(y,D,H,C,X){let Y=!1;const W=h(C,H,D);s!==W&&(s=W,c(s.object)),Y=p(y,C,H,X),Y&&_(y,C,H,X),X!==null&&e.update(X,n.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,M(y,D,H,C),X!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return n.createVertexArray()}function c(y){return n.bindVertexArray(y)}function u(y){return n.deleteVertexArray(y)}function h(y,D,H){const C=H.wireframe===!0;let X=i[y.id];X===void 0&&(X={},i[y.id]=X);let Y=X[D.id];Y===void 0&&(Y={},X[D.id]=Y);let W=Y[C];return W===void 0&&(W=d(l()),Y[C]=W),W}function d(y){const D=[],H=[],C=[];for(let X=0;X<t;X++)D[X]=0,H[X]=0,C[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:C,object:y,attributes:{},index:null}}function p(y,D,H,C){const X=s.attributes,Y=D.attributes;let W=0;const q=H.getAttributes();for(const N in q)if(q[N].location>=0){const J=X[N];let ae=Y[N];if(ae===void 0&&(N==="instanceMatrix"&&y.instanceMatrix&&(ae=y.instanceMatrix),N==="instanceColor"&&y.instanceColor&&(ae=y.instanceColor)),J===void 0||J.attribute!==ae||ae&&J.data!==ae.data)return!0;W++}return s.attributesNum!==W||s.index!==C}function _(y,D,H,C){const X={},Y=D.attributes;let W=0;const q=H.getAttributes();for(const N in q)if(q[N].location>=0){let J=Y[N];J===void 0&&(N==="instanceMatrix"&&y.instanceMatrix&&(J=y.instanceMatrix),N==="instanceColor"&&y.instanceColor&&(J=y.instanceColor));const ae={};ae.attribute=J,J&&J.data&&(ae.data=J.data),X[N]=ae,W++}s.attributes=X,s.attributesNum=W,s.index=C}function x(){const y=s.newAttributes;for(let D=0,H=y.length;D<H;D++)y[D]=0}function m(y){f(y,0)}function f(y,D){const H=s.newAttributes,C=s.enabledAttributes,X=s.attributeDivisors;H[y]=1,C[y]===0&&(n.enableVertexAttribArray(y),C[y]=1),X[y]!==D&&(n.vertexAttribDivisor(y,D),X[y]=D)}function g(){const y=s.newAttributes,D=s.enabledAttributes;for(let H=0,C=D.length;H<C;H++)D[H]!==y[H]&&(n.disableVertexAttribArray(H),D[H]=0)}function v(y,D,H,C,X,Y,W){W===!0?n.vertexAttribIPointer(y,D,H,X,Y):n.vertexAttribPointer(y,D,H,C,X,Y)}function M(y,D,H,C){x();const X=C.attributes,Y=H.getAttributes(),W=D.defaultAttributeValues;for(const q in Y){const N=Y[q];if(N.location>=0){let K=X[q];if(K===void 0&&(q==="instanceMatrix"&&y.instanceMatrix&&(K=y.instanceMatrix),q==="instanceColor"&&y.instanceColor&&(K=y.instanceColor)),K!==void 0){const J=K.normalized,ae=K.itemSize,Me=e.get(K);if(Me===void 0)continue;const je=Me.buffer,j=Me.type,ie=Me.bytesPerElement,he=j===n.INT||j===n.UNSIGNED_INT||K.gpuType===Gf;if(K.isInterleavedBufferAttribute){const fe=K.data,De=fe.stride,Oe=K.offset;if(fe.isInstancedInterleavedBuffer){for(let Ve=0;Ve<N.locationSize;Ve++)f(N.location+Ve,fe.meshPerAttribute);y.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Ve=0;Ve<N.locationSize;Ve++)m(N.location+Ve);n.bindBuffer(n.ARRAY_BUFFER,je);for(let Ve=0;Ve<N.locationSize;Ve++)v(N.location+Ve,ae/N.locationSize,j,J,De*ie,(Oe+ae/N.locationSize*Ve)*ie,he)}else{if(K.isInstancedBufferAttribute){for(let fe=0;fe<N.locationSize;fe++)f(N.location+fe,K.meshPerAttribute);y.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let fe=0;fe<N.locationSize;fe++)m(N.location+fe);n.bindBuffer(n.ARRAY_BUFFER,je);for(let fe=0;fe<N.locationSize;fe++)v(N.location+fe,ae/N.locationSize,j,J,ae*ie,ae/N.locationSize*fe*ie,he)}}else if(W!==void 0){const J=W[q];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(N.location,J);break;case 3:n.vertexAttrib3fv(N.location,J);break;case 4:n.vertexAttrib4fv(N.location,J);break;default:n.vertexAttrib1fv(N.location,J)}}}}g()}function b(){L();for(const y in i){const D=i[y];for(const H in D){const C=D[H];for(const X in C)u(C[X].object),delete C[X];delete D[H]}delete i[y]}}function A(y){if(i[y.id]===void 0)return;const D=i[y.id];for(const H in D){const C=D[H];for(const X in C)u(C[X].object),delete C[X];delete D[H]}delete i[y.id]}function T(y){for(const D in i){const H=i[D];if(H[y.id]===void 0)continue;const C=H[y.id];for(const X in C)u(C[X].object),delete C[X];delete H[y.id]}}function L(){w(),o=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:L,resetDefaultState:w,dispose:b,releaseStatesOfGeometry:A,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:m,disableUnusedAttributes:g}}function TE(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let p=0;for(let _=0;_<h;_++)p+=u[_];t.update(p,i,1)}function l(c,u,h,d){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<c.length;_++)o(c[_],u[_],d[_]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let _=0;for(let x=0;x<h;x++)_+=u[x];for(let x=0;x<d.length;x++)t.update(_,i,d[x])}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function AE(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==jn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const T=A===ta&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Ri&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Mi&&!T)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),x=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),f=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),g=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=p>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:x,maxAttributes:m,maxVertexUniforms:f,maxVaryings:g,maxFragmentUniforms:v,vertexTextures:M,maxSamples:b}}function CE(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Mr,a=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||i!==0||r;return r=d,i=h.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,p){const _=h.clippingPlanes,x=h.clipIntersection,m=h.clipShadows,f=n.get(h);if(!r||_===null||_.length===0||s&&!m)s?u(null):c();else{const g=s?0:i,v=g*4;let M=f.clippingState||null;l.value=M,M=u(_,d,v,p);for(let b=0;b!==v;++b)M[b]=t[b];f.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,p,_){const x=h!==null?h.length:0;let m=null;if(x!==0){if(m=l.value,_!==!0||m===null){const f=p+x*4,g=d.matrixWorldInverse;a.getNormalMatrix(g),(m===null||m.length<f)&&(m=new Float32Array(f));for(let v=0,M=p;v!==x;++v,M+=4)o.copy(h[v]).applyMatrix4(g,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function RE(n){let e=new WeakMap;function t(o,a){return a===mh?o.mapping=Bs:a===gh&&(o.mapping=Hs),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===mh||a===gh)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new OM(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class vv extends pv{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ys=4,Xp=[.125,.215,.35,.446,.526,.582],wr=20,lu=new vv,jp=new Xe;let cu=null,uu=0,hu=0,fu=!1;const Sr=(1+Math.sqrt(5))/2,rs=1/Sr,Yp=[new F(-Sr,rs,0),new F(Sr,rs,0),new F(-rs,0,Sr),new F(rs,0,Sr),new F(0,Sr,-rs),new F(0,Sr,rs),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)];class qp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){cu=this._renderer.getRenderTarget(),uu=this._renderer.getActiveCubeFace(),hu=this._renderer.getActiveMipmapLevel(),fu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(cu,uu,hu),this._renderer.xr.enabled=fu,e.scissorTest=!1,ja(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Bs||e.mapping===Hs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),cu=this._renderer.getRenderTarget(),uu=this._renderer.getActiveCubeFace(),hu=this._renderer.getActiveMipmapLevel(),fu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Xn,minFilter:Xn,generateMipmaps:!1,type:ta,format:jn,colorSpace:hr,depthBuffer:!1},r=$p(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$p(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=bE(s)),this._blurMaterial=PE(s,e,t)}return r}_compileMaterial(e){const t=new Je(this._lodPlanes[0],e);this._renderer.compile(t,lu)}_sceneToCubeUV(e,t,i,r){const a=new xn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(jp),u.toneMapping=ir,u.autoClear=!1;const p=new bn({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),_=new Je(new Pt,p);let x=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,x=!0):(p.color.copy(jp),x=!0);for(let f=0;f<6;f++){const g=f%3;g===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):g===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const v=this._cubeSize;ja(r,g*v,f>2?v:0,v,v),u.setRenderTarget(r),x&&u.render(_,a),u.render(e,a)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=d,u.autoClear=h,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Bs||e.mapping===Hs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kp());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Je(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;ja(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,lu)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Yp[(r-s-1)%Yp.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Je(this._lodPlanes[r],c),d=c.uniforms,p=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*wr-1),x=s/_,m=isFinite(s)?1+Math.floor(u*x):wr;m>wr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${wr}`);const f=[];let g=0;for(let T=0;T<wr;++T){const L=T/x,w=Math.exp(-L*L/2);f.push(w),T===0?g+=w:T<m&&(g+=2*w)}for(let T=0;T<f.length;T++)f[T]=f[T]/g;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=_,d.mipInt.value=v-i;const M=this._sizeLods[r],b=3*M*(r>v-ys?r-v+ys:0),A=4*(this._cubeSize-M);ja(t,b,A,3*M,2*M),l.setRenderTarget(t),l.render(h,lu)}}function bE(n){const e=[],t=[],i=[];let r=n;const s=n-ys+1+Xp.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-ys?l=Xp[o-n+ys-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,_=6,x=3,m=2,f=1,g=new Float32Array(x*_*p),v=new Float32Array(m*_*p),M=new Float32Array(f*_*p);for(let A=0;A<p;A++){const T=A%3*2/3-1,L=A>2?0:-1,w=[T,L,0,T+2/3,L,0,T+2/3,L+1,0,T,L,0,T+2/3,L+1,0,T,L+1,0];g.set(w,x*_*A),v.set(d,m*_*A);const y=[A,A,A,A,A,A];M.set(y,f*_*A)}const b=new Kn;b.setAttribute("position",new ai(g,x)),b.setAttribute("uv",new ai(v,m)),b.setAttribute("faceIndex",new ai(M,f)),e.push(b),r>ys&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function $p(n,e,t){const i=new Fr(n,e,t);return i.texture.mapping=lc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ja(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function PE(n,e,t){const i=new Float32Array(wr),r=new F(0,1,0);return new ar({name:"SphericalGaussianBlur",defines:{n:wr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function Kp(){return new ar({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function Zp(){return new ar({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function Jf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function LE(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===mh||l===gh,u=l===Bs||l===Hs;if(c||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new qp(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&r(p)?(t===null&&(t=new qp(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function DE(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&ov("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function IE(n,e,t,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const _ in d.attributes)e.remove(d.attributes[_]);for(const _ in d.morphAttributes){const x=d.morphAttributes[_];for(let m=0,f=x.length;m<f;m++)e.remove(x[m])}d.removeEventListener("dispose",o),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const _ in d)e.update(d[_],n.ARRAY_BUFFER);const p=h.morphAttributes;for(const _ in p){const x=p[_];for(let m=0,f=x.length;m<f;m++)e.update(x[m],n.ARRAY_BUFFER)}}function c(h){const d=[],p=h.index,_=h.attributes.position;let x=0;if(p!==null){const g=p.array;x=p.version;for(let v=0,M=g.length;v<M;v+=3){const b=g[v+0],A=g[v+1],T=g[v+2];d.push(b,A,A,T,T,b)}}else if(_!==void 0){const g=_.array;x=_.version;for(let v=0,M=g.length/3-1;v<M;v+=3){const b=v+0,A=v+1,T=v+2;d.push(b,A,A,T,T,b)}}else return;const m=new(sv(d)?fv:hv)(d,1);m.version=x;const f=s.get(h);f&&e.remove(f),s.set(h,m)}function u(h){const d=s.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function NE(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,p){n.drawElements(i,p,s,d*o),t.update(p,i,1)}function c(d,p,_){_!==0&&(n.drawElementsInstanced(i,p,s,d*o,_),t.update(p,i,_))}function u(d,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,d,0,_);let m=0;for(let f=0;f<_;f++)m+=p[f];t.update(m,i,1)}function h(d,p,_,x){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],x[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,d,0,x,0,_);let f=0;for(let g=0;g<_;g++)f+=p[g];for(let g=0;g<x.length;g++)t.update(f,i,x[g])}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function UE(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function zE(n,e,t){const i=new WeakMap,r=new lt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let y=function(){L.dispose(),i.delete(a),a.removeEventListener("dispose",y)};var p=y;d!==void 0&&d.texture.dispose();const _=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let M=0;_===!0&&(M=1),x===!0&&(M=2),m===!0&&(M=3);let b=a.attributes.position.count*M,A=1;b>e.maxTextureSize&&(A=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const T=new Float32Array(b*A*4*h),L=new lv(T,b,A,h);L.type=Mi,L.needsUpdate=!0;const w=M*4;for(let D=0;D<h;D++){const H=f[D],C=g[D],X=v[D],Y=b*A*4*D;for(let W=0;W<H.count;W++){const q=W*w;_===!0&&(r.fromBufferAttribute(H,W),T[Y+q+0]=r.x,T[Y+q+1]=r.y,T[Y+q+2]=r.z,T[Y+q+3]=0),x===!0&&(r.fromBufferAttribute(C,W),T[Y+q+4]=r.x,T[Y+q+5]=r.y,T[Y+q+6]=r.z,T[Y+q+7]=0),m===!0&&(r.fromBufferAttribute(X,W),T[Y+q+8]=r.x,T[Y+q+9]=r.y,T[Y+q+10]=r.z,T[Y+q+11]=X.itemSize===4?r.w:1)}}d={count:h,texture:L,size:new Ge(b,A)},i.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let _=0;for(let m=0;m<c.length;m++)_+=c[m];const x=a.morphTargetsRelative?1:1-_;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function FE(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class _v extends sn{constructor(e,t,i,r,s,o,a,l,c,u=Ls){if(u!==Ls&&u!==Gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Ls&&(i=zr),i===void 0&&u===Gs&&(i=Vs),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Dn,this.minFilter=l!==void 0?l:Dn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const xv=new sn,Qp=new _v(1,1),yv=new lv,Mv=new SM,Sv=new mv,Jp=[],em=[],tm=new Float32Array(16),nm=new Float32Array(9),im=new Float32Array(4);function Zs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Jp[r];if(s===void 0&&(s=new Float32Array(r),Jp[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function It(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Nt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function uc(n,e){let t=em[e];t===void 0&&(t=new Int32Array(e),em[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function kE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function OE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2fv(this.addr,e),Nt(t,e)}}function BE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(It(t,e))return;n.uniform3fv(this.addr,e),Nt(t,e)}}function HE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4fv(this.addr,e),Nt(t,e)}}function VE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Nt(t,e)}else{if(It(t,i))return;im.set(i),n.uniformMatrix2fv(this.addr,!1,im),Nt(t,i)}}function GE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Nt(t,e)}else{if(It(t,i))return;nm.set(i),n.uniformMatrix3fv(this.addr,!1,nm),Nt(t,i)}}function WE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Nt(t,e)}else{if(It(t,i))return;tm.set(i),n.uniformMatrix4fv(this.addr,!1,tm),Nt(t,i)}}function XE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function jE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2iv(this.addr,e),Nt(t,e)}}function YE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3iv(this.addr,e),Nt(t,e)}}function qE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4iv(this.addr,e),Nt(t,e)}}function $E(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function KE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2uiv(this.addr,e),Nt(t,e)}}function ZE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3uiv(this.addr,e),Nt(t,e)}}function QE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4uiv(this.addr,e),Nt(t,e)}}function JE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Qp.compareFunction=rv,s=Qp):s=xv,t.setTexture2D(e||s,r)}function ew(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Mv,r)}function tw(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Sv,r)}function nw(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||yv,r)}function iw(n){switch(n){case 5126:return kE;case 35664:return OE;case 35665:return BE;case 35666:return HE;case 35674:return VE;case 35675:return GE;case 35676:return WE;case 5124:case 35670:return XE;case 35667:case 35671:return jE;case 35668:case 35672:return YE;case 35669:case 35673:return qE;case 5125:return $E;case 36294:return KE;case 36295:return ZE;case 36296:return QE;case 35678:case 36198:case 36298:case 36306:case 35682:return JE;case 35679:case 36299:case 36307:return ew;case 35680:case 36300:case 36308:case 36293:return tw;case 36289:case 36303:case 36311:case 36292:return nw}}function rw(n,e){n.uniform1fv(this.addr,e)}function sw(n,e){const t=Zs(e,this.size,2);n.uniform2fv(this.addr,t)}function ow(n,e){const t=Zs(e,this.size,3);n.uniform3fv(this.addr,t)}function aw(n,e){const t=Zs(e,this.size,4);n.uniform4fv(this.addr,t)}function lw(n,e){const t=Zs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function cw(n,e){const t=Zs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function uw(n,e){const t=Zs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function hw(n,e){n.uniform1iv(this.addr,e)}function fw(n,e){n.uniform2iv(this.addr,e)}function dw(n,e){n.uniform3iv(this.addr,e)}function pw(n,e){n.uniform4iv(this.addr,e)}function mw(n,e){n.uniform1uiv(this.addr,e)}function gw(n,e){n.uniform2uiv(this.addr,e)}function vw(n,e){n.uniform3uiv(this.addr,e)}function _w(n,e){n.uniform4uiv(this.addr,e)}function xw(n,e,t){const i=this.cache,r=e.length,s=uc(t,r);It(i,s)||(n.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||xv,s[o])}function yw(n,e,t){const i=this.cache,r=e.length,s=uc(t,r);It(i,s)||(n.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Mv,s[o])}function Mw(n,e,t){const i=this.cache,r=e.length,s=uc(t,r);It(i,s)||(n.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Sv,s[o])}function Sw(n,e,t){const i=this.cache,r=e.length,s=uc(t,r);It(i,s)||(n.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||yv,s[o])}function Ew(n){switch(n){case 5126:return rw;case 35664:return sw;case 35665:return ow;case 35666:return aw;case 35674:return lw;case 35675:return cw;case 35676:return uw;case 5124:case 35670:return hw;case 35667:case 35671:return fw;case 35668:case 35672:return dw;case 35669:case 35673:return pw;case 5125:return mw;case 36294:return gw;case 36295:return vw;case 36296:return _w;case 35678:case 36198:case 36298:case 36306:case 35682:return xw;case 35679:case 36299:case 36307:return yw;case 35680:case 36300:case 36308:case 36293:return Mw;case 36289:case 36303:case 36311:case 36292:return Sw}}class ww{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=iw(t.type)}}class Tw{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ew(t.type)}}class Aw{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const du=/(\w+)(\])?(\[|\.)?/g;function rm(n,e){n.seq.push(e),n.map[e.id]=e}function Cw(n,e,t){const i=n.name,r=i.length;for(du.lastIndex=0;;){const s=du.exec(i),o=du.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){rm(t,c===void 0?new ww(a,n,e):new Tw(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new Aw(a),rm(t,h)),t=h}}}class dl{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);Cw(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function sm(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Rw=37297;let bw=0;function Pw(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}function Lw(n){const e=tt.getPrimaries(tt.workingColorSpace),t=tt.getPrimaries(n);let i;switch(e===t?i="":e===Gl&&t===Vl?i="LinearDisplayP3ToLinearSRGB":e===Vl&&t===Gl&&(i="LinearSRGBToLinearDisplayP3"),n){case hr:case cc:return[i,"LinearTransferOETF"];case Gn:case $f:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function om(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Pw(n.getShaderSource(e),o)}else return r}function Dw(n,e){const t=Lw(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Iw(n,e){let t;switch(e){case Uy:t="Linear";break;case zy:t="Reinhard";break;case Fy:t="OptimizedCineon";break;case ky:t="ACESFilmic";break;case By:t="AgX";break;case Hy:t="Neutral";break;case Oy:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Nw(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vo).join(`
`)}function Uw(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function zw(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function vo(n){return n!==""}function am(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function lm(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Fw=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xh(n){return n.replace(Fw,Ow)}const kw=new Map;function Ow(n,e){let t=Ue[e];if(t===void 0){const i=kw.get(e);if(i!==void 0)t=Ue[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Xh(t)}const Bw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cm(n){return n.replace(Bw,Hw)}function Hw(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function um(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Vw(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Wg?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Xg?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===mi&&(e="SHADOWMAP_TYPE_VSM"),e}function Gw(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Bs:case Hs:e="ENVMAP_TYPE_CUBE";break;case lc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ww(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Hs:e="ENVMAP_MODE_REFRACTION";break}return e}function Xw(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Vf:e="ENVMAP_BLENDING_MULTIPLY";break;case Iy:e="ENVMAP_BLENDING_MIX";break;case Ny:e="ENVMAP_BLENDING_ADD";break}return e}function jw(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Yw(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Vw(t),c=Gw(t),u=Ww(t),h=Xw(t),d=jw(t),p=Nw(t),_=Uw(s),x=r.createProgram();let m,f,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(vo).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(vo).join(`
`),f.length>0&&(f+=`
`)):(m=[um(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vo).join(`
`),f=[um(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ir?"#define TONE_MAPPING":"",t.toneMapping!==ir?Ue.tonemapping_pars_fragment:"",t.toneMapping!==ir?Iw("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,Dw("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vo).join(`
`)),o=Xh(o),o=am(o,t),o=lm(o,t),a=Xh(a),a=am(a,t),a=lm(a,t),o=cm(o),a=cm(a),t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===wp?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=g+m+o,M=g+f+a,b=sm(r,r.VERTEX_SHADER,v),A=sm(r,r.FRAGMENT_SHADER,M);r.attachShader(x,b),r.attachShader(x,A),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function T(D){if(n.debug.checkShaderErrors){const H=r.getProgramInfoLog(x).trim(),C=r.getShaderInfoLog(b).trim(),X=r.getShaderInfoLog(A).trim();let Y=!0,W=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(Y=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,x,b,A);else{const q=om(r,b,"vertex"),N=om(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+H+`
`+q+`
`+N)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(C===""||X==="")&&(W=!1);W&&(D.diagnostics={runnable:Y,programLog:H,vertexShader:{log:C,prefix:m},fragmentShader:{log:X,prefix:f}})}r.deleteShader(b),r.deleteShader(A),L=new dl(r,x),w=zw(r,x)}let L;this.getUniforms=function(){return L===void 0&&T(this),L};let w;this.getAttributes=function(){return w===void 0&&T(this),w};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(x,Rw)),y},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=bw++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=b,this.fragmentShader=A,this}let qw=0;class $w{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Kw(e),t.set(e,i)),i}}class Kw{constructor(e){this.id=qw++,this.code=e,this.usedTimes=0}}function Zw(n,e,t,i,r,s,o){const a=new cv,l=new $w,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let p=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,y,D,H,C){const X=H.fog,Y=C.geometry,W=w.isMeshStandardMaterial?H.environment:null,q=(w.isMeshStandardMaterial?t:e).get(w.envMap||W),N=q&&q.mapping===lc?q.image.height:null,K=_[w.type];w.precision!==null&&(p=r.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const J=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ae=J!==void 0?J.length:0;let Me=0;Y.morphAttributes.position!==void 0&&(Me=1),Y.morphAttributes.normal!==void 0&&(Me=2),Y.morphAttributes.color!==void 0&&(Me=3);let je,j,ie,he;if(K){const $e=ni[K];je=$e.vertexShader,j=$e.fragmentShader}else je=w.vertexShader,j=w.fragmentShader,l.update(w),ie=l.getVertexShaderID(w),he=l.getFragmentShaderID(w);const fe=n.getRenderTarget(),De=C.isInstancedMesh===!0,Oe=C.isBatchedMesh===!0,Ve=!!w.map,vt=!!w.matcap,I=!!q,Et=!!w.aoMap,et=!!w.lightMap,it=!!w.bumpMap,Se=!!w.normalMap,wt=!!w.displacementMap,Pe=!!w.emissiveMap,Ie=!!w.metalnessMap,R=!!w.roughnessMap,S=w.anisotropy>0,G=w.clearcoat>0,ee=w.dispersion>0,ne=w.iridescence>0,Q=w.sheen>0,Ee=w.transmission>0,ue=S&&!!w.anisotropyMap,ge=G&&!!w.clearcoatMap,Ne=G&&!!w.clearcoatNormalMap,re=G&&!!w.clearcoatRoughnessMap,me=ne&&!!w.iridescenceMap,We=ne&&!!w.iridescenceThicknessMap,be=Q&&!!w.sheenColorMap,ve=Q&&!!w.sheenRoughnessMap,Le=!!w.specularMap,Be=!!w.specularColorMap,dt=!!w.specularIntensityMap,U=Ee&&!!w.transmissionMap,se=Ee&&!!w.thicknessMap,$=!!w.gradientMap,Z=!!w.alphaMap,le=w.alphaTest>0,Ae=!!w.alphaHash,Ye=!!w.extensions;let Tt=ir;w.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(Tt=n.toneMapping);const Ot={shaderID:K,shaderType:w.type,shaderName:w.name,vertexShader:je,fragmentShader:j,defines:w.defines,customVertexShaderID:ie,customFragmentShaderID:he,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Oe,batchingColor:Oe&&C._colorsTexture!==null,instancing:De,instancingColor:De&&C.instanceColor!==null,instancingMorph:De&&C.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:fe===null?n.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:hr,alphaToCoverage:!!w.alphaToCoverage,map:Ve,matcap:vt,envMap:I,envMapMode:I&&q.mapping,envMapCubeUVHeight:N,aoMap:Et,lightMap:et,bumpMap:it,normalMap:Se,displacementMap:d&&wt,emissiveMap:Pe,normalMapObjectSpace:Se&&w.normalMapType===Xy,normalMapTangentSpace:Se&&w.normalMapType===iv,metalnessMap:Ie,roughnessMap:R,anisotropy:S,anisotropyMap:ue,clearcoat:G,clearcoatMap:ge,clearcoatNormalMap:Ne,clearcoatRoughnessMap:re,dispersion:ee,iridescence:ne,iridescenceMap:me,iridescenceThicknessMap:We,sheen:Q,sheenColorMap:be,sheenRoughnessMap:ve,specularMap:Le,specularColorMap:Be,specularIntensityMap:dt,transmission:Ee,transmissionMap:U,thicknessMap:se,gradientMap:$,opaque:w.transparent===!1&&w.blending===bs&&w.alphaToCoverage===!1,alphaMap:Z,alphaTest:le,alphaHash:Ae,combine:w.combine,mapUv:Ve&&x(w.map.channel),aoMapUv:Et&&x(w.aoMap.channel),lightMapUv:et&&x(w.lightMap.channel),bumpMapUv:it&&x(w.bumpMap.channel),normalMapUv:Se&&x(w.normalMap.channel),displacementMapUv:wt&&x(w.displacementMap.channel),emissiveMapUv:Pe&&x(w.emissiveMap.channel),metalnessMapUv:Ie&&x(w.metalnessMap.channel),roughnessMapUv:R&&x(w.roughnessMap.channel),anisotropyMapUv:ue&&x(w.anisotropyMap.channel),clearcoatMapUv:ge&&x(w.clearcoatMap.channel),clearcoatNormalMapUv:Ne&&x(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&x(w.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&x(w.iridescenceMap.channel),iridescenceThicknessMapUv:We&&x(w.iridescenceThicknessMap.channel),sheenColorMapUv:be&&x(w.sheenColorMap.channel),sheenRoughnessMapUv:ve&&x(w.sheenRoughnessMap.channel),specularMapUv:Le&&x(w.specularMap.channel),specularColorMapUv:Be&&x(w.specularColorMap.channel),specularIntensityMapUv:dt&&x(w.specularIntensityMap.channel),transmissionMapUv:U&&x(w.transmissionMap.channel),thicknessMapUv:se&&x(w.thicknessMap.channel),alphaMapUv:Z&&x(w.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(Se||S),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!Y.attributes.uv&&(Ve||Z),fog:!!X,useFog:w.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:C.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:Me,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:Tt,decodeVideoTexture:Ve&&w.map.isVideoTexture===!0&&tt.getTransfer(w.map.colorSpace)===at,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===_i,flipSided:w.side===rn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Ye&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ye&&w.extensions.multiDraw===!0||Oe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Ot.vertexUv1s=c.has(1),Ot.vertexUv2s=c.has(2),Ot.vertexUv3s=c.has(3),c.clear(),Ot}function f(w){const y=[];if(w.shaderID?y.push(w.shaderID):(y.push(w.customVertexShaderID),y.push(w.customFragmentShaderID)),w.defines!==void 0)for(const D in w.defines)y.push(D),y.push(w.defines[D]);return w.isRawShaderMaterial===!1&&(g(y,w),v(y,w),y.push(n.outputColorSpace)),y.push(w.customProgramCacheKey),y.join()}function g(w,y){w.push(y.precision),w.push(y.outputColorSpace),w.push(y.envMapMode),w.push(y.envMapCubeUVHeight),w.push(y.mapUv),w.push(y.alphaMapUv),w.push(y.lightMapUv),w.push(y.aoMapUv),w.push(y.bumpMapUv),w.push(y.normalMapUv),w.push(y.displacementMapUv),w.push(y.emissiveMapUv),w.push(y.metalnessMapUv),w.push(y.roughnessMapUv),w.push(y.anisotropyMapUv),w.push(y.clearcoatMapUv),w.push(y.clearcoatNormalMapUv),w.push(y.clearcoatRoughnessMapUv),w.push(y.iridescenceMapUv),w.push(y.iridescenceThicknessMapUv),w.push(y.sheenColorMapUv),w.push(y.sheenRoughnessMapUv),w.push(y.specularMapUv),w.push(y.specularColorMapUv),w.push(y.specularIntensityMapUv),w.push(y.transmissionMapUv),w.push(y.thicknessMapUv),w.push(y.combine),w.push(y.fogExp2),w.push(y.sizeAttenuation),w.push(y.morphTargetsCount),w.push(y.morphAttributeCount),w.push(y.numDirLights),w.push(y.numPointLights),w.push(y.numSpotLights),w.push(y.numSpotLightMaps),w.push(y.numHemiLights),w.push(y.numRectAreaLights),w.push(y.numDirLightShadows),w.push(y.numPointLightShadows),w.push(y.numSpotLightShadows),w.push(y.numSpotLightShadowsWithMaps),w.push(y.numLightProbes),w.push(y.shadowMapType),w.push(y.toneMapping),w.push(y.numClippingPlanes),w.push(y.numClipIntersection),w.push(y.depthPacking)}function v(w,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.doubleSided&&a.enable(10),y.flipSided&&a.enable(11),y.useDepthPacking&&a.enable(12),y.dithering&&a.enable(13),y.transmission&&a.enable(14),y.sheen&&a.enable(15),y.opaque&&a.enable(16),y.pointsUvs&&a.enable(17),y.decodeVideoTexture&&a.enable(18),y.alphaToCoverage&&a.enable(19),w.push(a.mask)}function M(w){const y=_[w.type];let D;if(y){const H=ni[y];D=UM.clone(H.uniforms)}else D=w.uniforms;return D}function b(w,y){let D;for(let H=0,C=u.length;H<C;H++){const X=u[H];if(X.cacheKey===y){D=X,++D.usedTimes;break}}return D===void 0&&(D=new Yw(n,y,w,s),u.push(D)),D}function A(w){if(--w.usedTimes===0){const y=u.indexOf(w);u[y]=u[u.length-1],u.pop(),w.destroy()}}function T(w){l.remove(w)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:b,releaseProgram:A,releaseShaderCache:T,programs:u,dispose:L}}function Qw(){let n=new WeakMap;function e(s){let o=n.get(s);return o===void 0&&(o={},n.set(s,o)),o}function t(s){n.delete(s)}function i(s,o,a){n.get(s)[o]=a}function r(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:r}}function Jw(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function hm(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function fm(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,d,p,_,x,m){let f=n[e];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:_,renderOrder:h.renderOrder,z:x,group:m},n[e]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=_,f.renderOrder=h.renderOrder,f.z=x,f.group=m),e++,f}function a(h,d,p,_,x,m){const f=o(h,d,p,_,x,m);p.transmission>0?i.push(f):p.transparent===!0?r.push(f):t.push(f)}function l(h,d,p,_,x,m){const f=o(h,d,p,_,x,m);p.transmission>0?i.unshift(f):p.transparent===!0?r.unshift(f):t.unshift(f)}function c(h,d){t.length>1&&t.sort(h||Jw),i.length>1&&i.sort(d||hm),r.length>1&&r.sort(d||hm)}function u(){for(let h=e,d=n.length;h<d;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function eT(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new fm,n.set(i,[o])):r>=s.length?(o=new fm,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function tT(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Xe};break;case"SpotLight":t={position:new F,direction:new F,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new F,halfWidth:new F,halfHeight:new F};break}return n[e.id]=t,t}}}function nT(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let iT=0;function rT(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function sT(n){const e=new tT,t=nT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new F);const r=new F,s=new Mt,o=new Mt;function a(c){let u=0,h=0,d=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,_=0,x=0,m=0,f=0,g=0,v=0,M=0,b=0,A=0,T=0;c.sort(rT);for(let w=0,y=c.length;w<y;w++){const D=c[w],H=D.color,C=D.intensity,X=D.distance,Y=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=H.r*C,h+=H.g*C,d+=H.b*C;else if(D.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(D.sh.coefficients[W],C);T++}else if(D.isDirectionalLight){const W=e.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const q=D.shadow,N=t.get(D);N.shadowIntensity=q.intensity,N.shadowBias=q.bias,N.shadowNormalBias=q.normalBias,N.shadowRadius=q.radius,N.shadowMapSize=q.mapSize,i.directionalShadow[p]=N,i.directionalShadowMap[p]=Y,i.directionalShadowMatrix[p]=D.shadow.matrix,g++}i.directional[p]=W,p++}else if(D.isSpotLight){const W=e.get(D);W.position.setFromMatrixPosition(D.matrixWorld),W.color.copy(H).multiplyScalar(C),W.distance=X,W.coneCos=Math.cos(D.angle),W.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),W.decay=D.decay,i.spot[x]=W;const q=D.shadow;if(D.map&&(i.spotLightMap[b]=D.map,b++,q.updateMatrices(D),D.castShadow&&A++),i.spotLightMatrix[x]=q.matrix,D.castShadow){const N=t.get(D);N.shadowIntensity=q.intensity,N.shadowBias=q.bias,N.shadowNormalBias=q.normalBias,N.shadowRadius=q.radius,N.shadowMapSize=q.mapSize,i.spotShadow[x]=N,i.spotShadowMap[x]=Y,M++}x++}else if(D.isRectAreaLight){const W=e.get(D);W.color.copy(H).multiplyScalar(C),W.halfWidth.set(D.width*.5,0,0),W.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=W,m++}else if(D.isPointLight){const W=e.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),W.distance=D.distance,W.decay=D.decay,D.castShadow){const q=D.shadow,N=t.get(D);N.shadowIntensity=q.intensity,N.shadowBias=q.bias,N.shadowNormalBias=q.normalBias,N.shadowRadius=q.radius,N.shadowMapSize=q.mapSize,N.shadowCameraNear=q.camera.near,N.shadowCameraFar=q.camera.far,i.pointShadow[_]=N,i.pointShadowMap[_]=Y,i.pointShadowMatrix[_]=D.shadow.matrix,v++}i.point[_]=W,_++}else if(D.isHemisphereLight){const W=e.get(D);W.skyColor.copy(D.color).multiplyScalar(C),W.groundColor.copy(D.groundColor).multiplyScalar(C),i.hemi[f]=W,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ce.LTC_FLOAT_1,i.rectAreaLTC2=ce.LTC_FLOAT_2):(i.rectAreaLTC1=ce.LTC_HALF_1,i.rectAreaLTC2=ce.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const L=i.hash;(L.directionalLength!==p||L.pointLength!==_||L.spotLength!==x||L.rectAreaLength!==m||L.hemiLength!==f||L.numDirectionalShadows!==g||L.numPointShadows!==v||L.numSpotShadows!==M||L.numSpotMaps!==b||L.numLightProbes!==T)&&(i.directional.length=p,i.spot.length=x,i.rectArea.length=m,i.point.length=_,i.hemi.length=f,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=M+b-A,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=T,L.directionalLength=p,L.pointLength=_,L.spotLength=x,L.rectAreaLength=m,L.hemiLength=f,L.numDirectionalShadows=g,L.numPointShadows=v,L.numSpotShadows=M,L.numSpotMaps=b,L.numLightProbes=T,i.version=iT++)}function l(c,u){let h=0,d=0,p=0,_=0,x=0;const m=u.matrixWorldInverse;for(let f=0,g=c.length;f<g;f++){const v=c[f];if(v.isDirectionalLight){const M=i.directional[h];M.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),h++}else if(v.isSpotLight){const M=i.spot[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),p++}else if(v.isRectAreaLight){const M=i.rectArea[_];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),o.identity(),s.copy(v.matrixWorld),s.premultiply(m),o.extractRotation(s),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),_++}else if(v.isPointLight){const M=i.point[d];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){const M=i.hemi[x];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:i}}function dm(n){const e=new sT(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function oT(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new dm(n),e.set(r,[a])):s>=o.length?(a=new dm(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}class aT extends ra{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class lT extends ra{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const cT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,uT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function hT(n,e,t){let i=new Qf;const r=new Ge,s=new Ge,o=new lt,a=new aT({depthPacking:Wy}),l=new lT,c={},u=t.maxTextureSize,h={[or]:rn,[rn]:or,[_i]:_i},d=new ar({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ge},radius:{value:4}},vertexShader:cT,fragmentShader:uT}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const _=new Kn;_.setAttribute("position",new ai(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Je(_,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wg;let f=this.type;this.render=function(A,T,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const w=n.getRenderTarget(),y=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),H=n.state;H.setBlending(nr),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const C=f!==mi&&this.type===mi,X=f===mi&&this.type!==mi;for(let Y=0,W=A.length;Y<W;Y++){const q=A[Y],N=q.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const K=N.getFrameExtents();if(r.multiply(K),s.copy(N.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/K.x),r.x=s.x*K.x,N.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/K.y),r.y=s.y*K.y,N.mapSize.y=s.y)),N.map===null||C===!0||X===!0){const ae=this.type!==mi?{minFilter:Dn,magFilter:Dn}:{};N.map!==null&&N.map.dispose(),N.map=new Fr(r.x,r.y,ae),N.map.texture.name=q.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();const J=N.getViewportCount();for(let ae=0;ae<J;ae++){const Me=N.getViewport(ae);o.set(s.x*Me.x,s.y*Me.y,s.x*Me.z,s.y*Me.w),H.viewport(o),N.updateMatrices(q,ae),i=N.getFrustum(),M(T,L,N.camera,q,this.type)}N.isPointLightShadow!==!0&&this.type===mi&&g(N,L),N.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(w,y,D)};function g(A,T){const L=e.update(x);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Fr(r.x,r.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(T,null,L,d,x,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(T,null,L,p,x,null)}function v(A,T,L,w){let y=null;const D=L.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)y=D;else if(y=L.isPointLight===!0?l:a,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const H=y.uuid,C=T.uuid;let X=c[H];X===void 0&&(X={},c[H]=X);let Y=X[C];Y===void 0&&(Y=y.clone(),X[C]=Y,T.addEventListener("dispose",b)),y=Y}if(y.visible=T.visible,y.wireframe=T.wireframe,w===mi?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:h[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const H=n.properties.get(y);H.light=L}return y}function M(A,T,L,w,y){if(A.visible===!1)return;if(A.layers.test(T.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===mi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,A.matrixWorld);const C=e.update(A),X=A.material;if(Array.isArray(X)){const Y=C.groups;for(let W=0,q=Y.length;W<q;W++){const N=Y[W],K=X[N.materialIndex];if(K&&K.visible){const J=v(A,K,w,y);A.onBeforeShadow(n,A,T,L,C,J,N),n.renderBufferDirect(L,null,C,J,A,N),A.onAfterShadow(n,A,T,L,C,J,N)}}}else if(X.visible){const Y=v(A,X,w,y);A.onBeforeShadow(n,A,T,L,C,Y,null),n.renderBufferDirect(L,null,C,Y,A,null),A.onAfterShadow(n,A,T,L,C,Y,null)}}const H=A.children;for(let C=0,X=H.length;C<X;C++)M(H[C],T,L,w,y)}function b(A){A.target.removeEventListener("dispose",b);for(const L in c){const w=c[L],y=A.target.uuid;y in w&&(w[y].dispose(),delete w[y])}}}function fT(n){function e(){let U=!1;const se=new lt;let $=null;const Z=new lt(0,0,0,0);return{setMask:function(le){$!==le&&!U&&(n.colorMask(le,le,le,le),$=le)},setLocked:function(le){U=le},setClear:function(le,Ae,Ye,Tt,Ot){Ot===!0&&(le*=Tt,Ae*=Tt,Ye*=Tt),se.set(le,Ae,Ye,Tt),Z.equals(se)===!1&&(n.clearColor(le,Ae,Ye,Tt),Z.copy(se))},reset:function(){U=!1,$=null,Z.set(-1,0,0,0)}}}function t(){let U=!1,se=null,$=null,Z=null;return{setTest:function(le){le?he(n.DEPTH_TEST):fe(n.DEPTH_TEST)},setMask:function(le){se!==le&&!U&&(n.depthMask(le),se=le)},setFunc:function(le){if($!==le){switch(le){case Ay:n.depthFunc(n.NEVER);break;case Cy:n.depthFunc(n.ALWAYS);break;case Ry:n.depthFunc(n.LESS);break;case Ol:n.depthFunc(n.LEQUAL);break;case by:n.depthFunc(n.EQUAL);break;case Py:n.depthFunc(n.GEQUAL);break;case Ly:n.depthFunc(n.GREATER);break;case Dy:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}$=le}},setLocked:function(le){U=le},setClear:function(le){Z!==le&&(n.clearDepth(le),Z=le)},reset:function(){U=!1,se=null,$=null,Z=null}}}function i(){let U=!1,se=null,$=null,Z=null,le=null,Ae=null,Ye=null,Tt=null,Ot=null;return{setTest:function($e){U||($e?he(n.STENCIL_TEST):fe(n.STENCIL_TEST))},setMask:function($e){se!==$e&&!U&&(n.stencilMask($e),se=$e)},setFunc:function($e,ci,Zn){($!==$e||Z!==ci||le!==Zn)&&(n.stencilFunc($e,ci,Zn),$=$e,Z=ci,le=Zn)},setOp:function($e,ci,Zn){(Ae!==$e||Ye!==ci||Tt!==Zn)&&(n.stencilOp($e,ci,Zn),Ae=$e,Ye=ci,Tt=Zn)},setLocked:function($e){U=$e},setClear:function($e){Ot!==$e&&(n.clearStencil($e),Ot=$e)},reset:function(){U=!1,se=null,$=null,Z=null,le=null,Ae=null,Ye=null,Tt=null,Ot=null}}}const r=new e,s=new t,o=new i,a=new WeakMap,l=new WeakMap;let c={},u={},h=new WeakMap,d=[],p=null,_=!1,x=null,m=null,f=null,g=null,v=null,M=null,b=null,A=new Xe(0,0,0),T=0,L=!1,w=null,y=null,D=null,H=null,C=null;const X=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,W=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(q)[1]),Y=W>=1):q.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),Y=W>=2);let N=null,K={};const J=n.getParameter(n.SCISSOR_BOX),ae=n.getParameter(n.VIEWPORT),Me=new lt().fromArray(J),je=new lt().fromArray(ae);function j(U,se,$,Z){const le=new Uint8Array(4),Ae=n.createTexture();n.bindTexture(U,Ae),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ye=0;Ye<$;Ye++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(se,0,n.RGBA,1,1,Z,0,n.RGBA,n.UNSIGNED_BYTE,le):n.texImage2D(se+Ye,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,le);return Ae}const ie={};ie[n.TEXTURE_2D]=j(n.TEXTURE_2D,n.TEXTURE_2D,1),ie[n.TEXTURE_CUBE_MAP]=j(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[n.TEXTURE_2D_ARRAY]=j(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ie[n.TEXTURE_3D]=j(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),o.setClear(0),he(n.DEPTH_TEST),s.setFunc(Ol),it(!1),Se(xp),he(n.CULL_FACE),Et(nr);function he(U){c[U]!==!0&&(n.enable(U),c[U]=!0)}function fe(U){c[U]!==!1&&(n.disable(U),c[U]=!1)}function De(U,se){return u[U]!==se?(n.bindFramebuffer(U,se),u[U]=se,U===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=se),U===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=se),!0):!1}function Oe(U,se){let $=d,Z=!1;if(U){$=h.get(se),$===void 0&&($=[],h.set(se,$));const le=U.textures;if($.length!==le.length||$[0]!==n.COLOR_ATTACHMENT0){for(let Ae=0,Ye=le.length;Ae<Ye;Ae++)$[Ae]=n.COLOR_ATTACHMENT0+Ae;$.length=le.length,Z=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,Z=!0);Z&&n.drawBuffers($)}function Ve(U){return p!==U?(n.useProgram(U),p=U,!0):!1}const vt={[Er]:n.FUNC_ADD,[cy]:n.FUNC_SUBTRACT,[uy]:n.FUNC_REVERSE_SUBTRACT};vt[hy]=n.MIN,vt[fy]=n.MAX;const I={[dy]:n.ZERO,[py]:n.ONE,[my]:n.SRC_COLOR,[dh]:n.SRC_ALPHA,[My]:n.SRC_ALPHA_SATURATE,[xy]:n.DST_COLOR,[vy]:n.DST_ALPHA,[gy]:n.ONE_MINUS_SRC_COLOR,[ph]:n.ONE_MINUS_SRC_ALPHA,[yy]:n.ONE_MINUS_DST_COLOR,[_y]:n.ONE_MINUS_DST_ALPHA,[Sy]:n.CONSTANT_COLOR,[Ey]:n.ONE_MINUS_CONSTANT_COLOR,[wy]:n.CONSTANT_ALPHA,[Ty]:n.ONE_MINUS_CONSTANT_ALPHA};function Et(U,se,$,Z,le,Ae,Ye,Tt,Ot,$e){if(U===nr){_===!0&&(fe(n.BLEND),_=!1);return}if(_===!1&&(he(n.BLEND),_=!0),U!==ly){if(U!==x||$e!==L){if((m!==Er||v!==Er)&&(n.blendEquation(n.FUNC_ADD),m=Er,v=Er),$e)switch(U){case bs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ps:n.blendFunc(n.ONE,n.ONE);break;case yp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Mp:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case bs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ps:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case yp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Mp:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}f=null,g=null,M=null,b=null,A.set(0,0,0),T=0,x=U,L=$e}return}le=le||se,Ae=Ae||$,Ye=Ye||Z,(se!==m||le!==v)&&(n.blendEquationSeparate(vt[se],vt[le]),m=se,v=le),($!==f||Z!==g||Ae!==M||Ye!==b)&&(n.blendFuncSeparate(I[$],I[Z],I[Ae],I[Ye]),f=$,g=Z,M=Ae,b=Ye),(Tt.equals(A)===!1||Ot!==T)&&(n.blendColor(Tt.r,Tt.g,Tt.b,Ot),A.copy(Tt),T=Ot),x=U,L=!1}function et(U,se){U.side===_i?fe(n.CULL_FACE):he(n.CULL_FACE);let $=U.side===rn;se&&($=!$),it($),U.blending===bs&&U.transparent===!1?Et(nr):Et(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),s.setFunc(U.depthFunc),s.setTest(U.depthTest),s.setMask(U.depthWrite),r.setMask(U.colorWrite);const Z=U.stencilWrite;o.setTest(Z),Z&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Pe(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?he(n.SAMPLE_ALPHA_TO_COVERAGE):fe(n.SAMPLE_ALPHA_TO_COVERAGE)}function it(U){w!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),w=U)}function Se(U){U!==oy?(he(n.CULL_FACE),U!==y&&(U===xp?n.cullFace(n.BACK):U===ay?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):fe(n.CULL_FACE),y=U}function wt(U){U!==D&&(Y&&n.lineWidth(U),D=U)}function Pe(U,se,$){U?(he(n.POLYGON_OFFSET_FILL),(H!==se||C!==$)&&(n.polygonOffset(se,$),H=se,C=$)):fe(n.POLYGON_OFFSET_FILL)}function Ie(U){U?he(n.SCISSOR_TEST):fe(n.SCISSOR_TEST)}function R(U){U===void 0&&(U=n.TEXTURE0+X-1),N!==U&&(n.activeTexture(U),N=U)}function S(U,se,$){$===void 0&&(N===null?$=n.TEXTURE0+X-1:$=N);let Z=K[$];Z===void 0&&(Z={type:void 0,texture:void 0},K[$]=Z),(Z.type!==U||Z.texture!==se)&&(N!==$&&(n.activeTexture($),N=$),n.bindTexture(U,se||ie[U]),Z.type=U,Z.texture=se)}function G(){const U=K[N];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function ee(){try{n.compressedTexImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ne(){try{n.compressedTexImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{n.texSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ee(){try{n.texSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ue(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ge(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ne(){try{n.texStorage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function re(){try{n.texStorage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function me(){try{n.texImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function We(){try{n.texImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function be(U){Me.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),Me.copy(U))}function ve(U){je.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),je.copy(U))}function Le(U,se){let $=l.get(se);$===void 0&&($=new WeakMap,l.set(se,$));let Z=$.get(U);Z===void 0&&(Z=n.getUniformBlockIndex(se,U.name),$.set(U,Z))}function Be(U,se){const Z=l.get(se).get(U);a.get(se)!==Z&&(n.uniformBlockBinding(se,Z,U.__bindingPointIndex),a.set(se,Z))}function dt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),c={},N=null,K={},u={},h=new WeakMap,d=[],p=null,_=!1,x=null,m=null,f=null,g=null,v=null,M=null,b=null,A=new Xe(0,0,0),T=0,L=!1,w=null,y=null,D=null,H=null,C=null,Me.set(0,0,n.canvas.width,n.canvas.height),je.set(0,0,n.canvas.width,n.canvas.height),r.reset(),s.reset(),o.reset()}return{buffers:{color:r,depth:s,stencil:o},enable:he,disable:fe,bindFramebuffer:De,drawBuffers:Oe,useProgram:Ve,setBlending:Et,setMaterial:et,setFlipSided:it,setCullFace:Se,setLineWidth:wt,setPolygonOffset:Pe,setScissorTest:Ie,activeTexture:R,bindTexture:S,unbindTexture:G,compressedTexImage2D:ee,compressedTexImage3D:ne,texImage2D:me,texImage3D:We,updateUBOMapping:Le,uniformBlockBinding:Be,texStorage2D:Ne,texStorage3D:re,texSubImage2D:Q,texSubImage3D:Ee,compressedTexSubImage2D:ue,compressedTexSubImage3D:ge,scissor:be,viewport:ve,reset:dt}}function pm(n,e,t,i){const r=dT(i);switch(t){case Kg:return n*e;case Qg:return n*e;case Jg:return n*e*2;case ev:return n*e/r.components*r.byteLength;case jf:return n*e/r.components*r.byteLength;case tv:return n*e*2/r.components*r.byteLength;case Yf:return n*e*2/r.components*r.byteLength;case Zg:return n*e*3/r.components*r.byteLength;case jn:return n*e*4/r.components*r.byteLength;case qf:return n*e*4/r.components*r.byteLength;case ll:case cl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ul:case hl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case xh:case Mh:return Math.max(n,16)*Math.max(e,8)/4;case _h:case yh:return Math.max(n,8)*Math.max(e,8)/2;case Sh:case Eh:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case wh:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Th:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ah:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ch:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Rh:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case bh:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ph:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Lh:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Dh:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ih:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Nh:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Uh:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case zh:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Fh:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case kh:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case fl:case Oh:case Bh:return Math.ceil(n/4)*Math.ceil(e/4)*16;case nv:case Hh:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Vh:case Gh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dT(n){switch(n){case Ri:case Yg:return{byteLength:1,components:1};case qo:case qg:case ta:return{byteLength:2,components:1};case Wf:case Xf:return{byteLength:2,components:4};case zr:case Gf:case Mi:return{byteLength:4,components:1};case $g:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function pT(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ge,u=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,S){return p?new OffscreenCanvas(R,S):Xl("canvas")}function x(R,S,G){let ee=1;const ne=Ie(R);if((ne.width>G||ne.height>G)&&(ee=G/Math.max(ne.width,ne.height)),ee<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Q=Math.floor(ee*ne.width),Ee=Math.floor(ee*ne.height);h===void 0&&(h=_(Q,Ee));const ue=S?_(Q,Ee):h;return ue.width=Q,ue.height=Ee,ue.getContext("2d").drawImage(R,0,0,Q,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+Q+"x"+Ee+")."),ue}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),R;return R}function m(R){return R.generateMipmaps&&R.minFilter!==Dn&&R.minFilter!==Xn}function f(R){n.generateMipmap(R)}function g(R,S,G,ee,ne=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Q=S;if(S===n.RED&&(G===n.FLOAT&&(Q=n.R32F),G===n.HALF_FLOAT&&(Q=n.R16F),G===n.UNSIGNED_BYTE&&(Q=n.R8)),S===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.R8UI),G===n.UNSIGNED_SHORT&&(Q=n.R16UI),G===n.UNSIGNED_INT&&(Q=n.R32UI),G===n.BYTE&&(Q=n.R8I),G===n.SHORT&&(Q=n.R16I),G===n.INT&&(Q=n.R32I)),S===n.RG&&(G===n.FLOAT&&(Q=n.RG32F),G===n.HALF_FLOAT&&(Q=n.RG16F),G===n.UNSIGNED_BYTE&&(Q=n.RG8)),S===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.RG8UI),G===n.UNSIGNED_SHORT&&(Q=n.RG16UI),G===n.UNSIGNED_INT&&(Q=n.RG32UI),G===n.BYTE&&(Q=n.RG8I),G===n.SHORT&&(Q=n.RG16I),G===n.INT&&(Q=n.RG32I)),S===n.RGB&&G===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),S===n.RGBA){const Ee=ne?Hl:tt.getTransfer(ee);G===n.FLOAT&&(Q=n.RGBA32F),G===n.HALF_FLOAT&&(Q=n.RGBA16F),G===n.UNSIGNED_BYTE&&(Q=Ee===at?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function v(R,S){let G;return R?S===null||S===zr||S===Vs?G=n.DEPTH24_STENCIL8:S===Mi?G=n.DEPTH32F_STENCIL8:S===qo&&(G=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===zr||S===Vs?G=n.DEPTH_COMPONENT24:S===Mi?G=n.DEPTH_COMPONENT32F:S===qo&&(G=n.DEPTH_COMPONENT16),G}function M(R,S){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Dn&&R.minFilter!==Xn?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function b(R){const S=R.target;S.removeEventListener("dispose",b),T(S),S.isVideoTexture&&u.delete(S)}function A(R){const S=R.target;S.removeEventListener("dispose",A),w(S)}function T(R){const S=i.get(R);if(S.__webglInit===void 0)return;const G=R.source,ee=d.get(G);if(ee){const ne=ee[S.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&L(R),Object.keys(ee).length===0&&d.delete(G)}i.remove(R)}function L(R){const S=i.get(R);n.deleteTexture(S.__webglTexture);const G=R.source,ee=d.get(G);delete ee[S.__cacheKey],o.memory.textures--}function w(R){const S=i.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(S.__webglFramebuffer[ee]))for(let ne=0;ne<S.__webglFramebuffer[ee].length;ne++)n.deleteFramebuffer(S.__webglFramebuffer[ee][ne]);else n.deleteFramebuffer(S.__webglFramebuffer[ee]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[ee])}else{if(Array.isArray(S.__webglFramebuffer))for(let ee=0;ee<S.__webglFramebuffer.length;ee++)n.deleteFramebuffer(S.__webglFramebuffer[ee]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ee=0;ee<S.__webglColorRenderbuffer.length;ee++)S.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[ee]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const G=R.textures;for(let ee=0,ne=G.length;ee<ne;ee++){const Q=i.get(G[ee]);Q.__webglTexture&&(n.deleteTexture(Q.__webglTexture),o.memory.textures--),i.remove(G[ee])}i.remove(R)}let y=0;function D(){y=0}function H(){const R=y;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),y+=1,R}function C(R){const S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function X(R,S){const G=i.get(R);if(R.isVideoTexture&&wt(R),R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){const ee=R.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{je(G,R,S);return}}t.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+S)}function Y(R,S){const G=i.get(R);if(R.version>0&&G.__version!==R.version){je(G,R,S);return}t.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+S)}function W(R,S){const G=i.get(R);if(R.version>0&&G.__version!==R.version){je(G,R,S);return}t.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+S)}function q(R,S){const G=i.get(R);if(R.version>0&&G.__version!==R.version){j(G,R,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+S)}const N={[Bl]:n.REPEAT,[Yi]:n.CLAMP_TO_EDGE,[vh]:n.MIRRORED_REPEAT},K={[Dn]:n.NEAREST,[Vy]:n.NEAREST_MIPMAP_NEAREST,[Ta]:n.NEAREST_MIPMAP_LINEAR,[Xn]:n.LINEAR,[Gc]:n.LINEAR_MIPMAP_NEAREST,[Rr]:n.LINEAR_MIPMAP_LINEAR},J={[jy]:n.NEVER,[Qy]:n.ALWAYS,[Yy]:n.LESS,[rv]:n.LEQUAL,[qy]:n.EQUAL,[Zy]:n.GEQUAL,[$y]:n.GREATER,[Ky]:n.NOTEQUAL};function ae(R,S){if(S.type===Mi&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Xn||S.magFilter===Gc||S.magFilter===Ta||S.magFilter===Rr||S.minFilter===Xn||S.minFilter===Gc||S.minFilter===Ta||S.minFilter===Rr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,N[S.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,N[S.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,N[S.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,K[S.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,K[S.minFilter]),S.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,J[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Dn||S.minFilter!==Ta&&S.minFilter!==Rr||S.type===Mi&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Me(R,S){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",b));const ee=S.source;let ne=d.get(ee);ne===void 0&&(ne={},d.set(ee,ne));const Q=C(S);if(Q!==R.__cacheKey){ne[Q]===void 0&&(ne[Q]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,G=!0),ne[Q].usedTimes++;const Ee=ne[R.__cacheKey];Ee!==void 0&&(ne[R.__cacheKey].usedTimes--,Ee.usedTimes===0&&L(S)),R.__cacheKey=Q,R.__webglTexture=ne[Q].texture}return G}function je(R,S,G){let ee=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ee=n.TEXTURE_3D);const ne=Me(R,S),Q=S.source;t.bindTexture(ee,R.__webglTexture,n.TEXTURE0+G);const Ee=i.get(Q);if(Q.version!==Ee.__version||ne===!0){t.activeTexture(n.TEXTURE0+G);const ue=tt.getPrimaries(tt.workingColorSpace),ge=S.colorSpace===Gi?null:tt.getPrimaries(S.colorSpace),Ne=S.colorSpace===Gi||ue===ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);let re=x(S.image,!1,r.maxTextureSize);re=Pe(S,re);const me=s.convert(S.format,S.colorSpace),We=s.convert(S.type);let be=g(S.internalFormat,me,We,S.colorSpace,S.isVideoTexture);ae(ee,S);let ve;const Le=S.mipmaps,Be=S.isVideoTexture!==!0,dt=Ee.__version===void 0||ne===!0,U=Q.dataReady,se=M(S,re);if(S.isDepthTexture)be=v(S.format===Gs,S.type),dt&&(Be?t.texStorage2D(n.TEXTURE_2D,1,be,re.width,re.height):t.texImage2D(n.TEXTURE_2D,0,be,re.width,re.height,0,me,We,null));else if(S.isDataTexture)if(Le.length>0){Be&&dt&&t.texStorage2D(n.TEXTURE_2D,se,be,Le[0].width,Le[0].height);for(let $=0,Z=Le.length;$<Z;$++)ve=Le[$],Be?U&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ve.width,ve.height,me,We,ve.data):t.texImage2D(n.TEXTURE_2D,$,be,ve.width,ve.height,0,me,We,ve.data);S.generateMipmaps=!1}else Be?(dt&&t.texStorage2D(n.TEXTURE_2D,se,be,re.width,re.height),U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,re.width,re.height,me,We,re.data)):t.texImage2D(n.TEXTURE_2D,0,be,re.width,re.height,0,me,We,re.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Be&&dt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,be,Le[0].width,Le[0].height,re.depth);for(let $=0,Z=Le.length;$<Z;$++)if(ve=Le[$],S.format!==jn)if(me!==null)if(Be){if(U)if(S.layerUpdates.size>0){const le=pm(ve.width,ve.height,S.format,S.type);for(const Ae of S.layerUpdates){const Ye=ve.data.subarray(Ae*le/ve.data.BYTES_PER_ELEMENT,(Ae+1)*le/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,Ae,ve.width,ve.height,1,me,Ye,0,0)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ve.width,ve.height,re.depth,me,ve.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,be,ve.width,ve.height,re.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?U&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ve.width,ve.height,re.depth,me,We,ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,$,be,ve.width,ve.height,re.depth,0,me,We,ve.data)}else{Be&&dt&&t.texStorage2D(n.TEXTURE_2D,se,be,Le[0].width,Le[0].height);for(let $=0,Z=Le.length;$<Z;$++)ve=Le[$],S.format!==jn?me!==null?Be?U&&t.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,ve.width,ve.height,me,ve.data):t.compressedTexImage2D(n.TEXTURE_2D,$,be,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?U&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ve.width,ve.height,me,We,ve.data):t.texImage2D(n.TEXTURE_2D,$,be,ve.width,ve.height,0,me,We,ve.data)}else if(S.isDataArrayTexture)if(Be){if(dt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,be,re.width,re.height,re.depth),U)if(S.layerUpdates.size>0){const $=pm(re.width,re.height,S.format,S.type);for(const Z of S.layerUpdates){const le=re.data.subarray(Z*$/re.data.BYTES_PER_ELEMENT,(Z+1)*$/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Z,re.width,re.height,1,me,We,le)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,me,We,re.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,be,re.width,re.height,re.depth,0,me,We,re.data);else if(S.isData3DTexture)Be?(dt&&t.texStorage3D(n.TEXTURE_3D,se,be,re.width,re.height,re.depth),U&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,me,We,re.data)):t.texImage3D(n.TEXTURE_3D,0,be,re.width,re.height,re.depth,0,me,We,re.data);else if(S.isFramebufferTexture){if(dt)if(Be)t.texStorage2D(n.TEXTURE_2D,se,be,re.width,re.height);else{let $=re.width,Z=re.height;for(let le=0;le<se;le++)t.texImage2D(n.TEXTURE_2D,le,be,$,Z,0,me,We,null),$>>=1,Z>>=1}}else if(Le.length>0){if(Be&&dt){const $=Ie(Le[0]);t.texStorage2D(n.TEXTURE_2D,se,be,$.width,$.height)}for(let $=0,Z=Le.length;$<Z;$++)ve=Le[$],Be?U&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,me,We,ve):t.texImage2D(n.TEXTURE_2D,$,be,me,We,ve);S.generateMipmaps=!1}else if(Be){if(dt){const $=Ie(re);t.texStorage2D(n.TEXTURE_2D,se,be,$.width,$.height)}U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,We,re)}else t.texImage2D(n.TEXTURE_2D,0,be,me,We,re);m(S)&&f(ee),Ee.__version=Q.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function j(R,S,G){if(S.image.length!==6)return;const ee=Me(R,S),ne=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+G);const Q=i.get(ne);if(ne.version!==Q.__version||ee===!0){t.activeTexture(n.TEXTURE0+G);const Ee=tt.getPrimaries(tt.workingColorSpace),ue=S.colorSpace===Gi?null:tt.getPrimaries(S.colorSpace),ge=S.colorSpace===Gi||Ee===ue?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const Ne=S.isCompressedTexture||S.image[0].isCompressedTexture,re=S.image[0]&&S.image[0].isDataTexture,me=[];for(let Z=0;Z<6;Z++)!Ne&&!re?me[Z]=x(S.image[Z],!0,r.maxCubemapSize):me[Z]=re?S.image[Z].image:S.image[Z],me[Z]=Pe(S,me[Z]);const We=me[0],be=s.convert(S.format,S.colorSpace),ve=s.convert(S.type),Le=g(S.internalFormat,be,ve,S.colorSpace),Be=S.isVideoTexture!==!0,dt=Q.__version===void 0||ee===!0,U=ne.dataReady;let se=M(S,We);ae(n.TEXTURE_CUBE_MAP,S);let $;if(Ne){Be&&dt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,se,Le,We.width,We.height);for(let Z=0;Z<6;Z++){$=me[Z].mipmaps;for(let le=0;le<$.length;le++){const Ae=$[le];S.format!==jn?be!==null?Be?U&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le,0,0,Ae.width,Ae.height,be,Ae.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le,Le,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le,0,0,Ae.width,Ae.height,be,ve,Ae.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le,Le,Ae.width,Ae.height,0,be,ve,Ae.data)}}}else{if($=S.mipmaps,Be&&dt){$.length>0&&se++;const Z=Ie(me[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,se,Le,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(re){Be?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,me[Z].width,me[Z].height,be,ve,me[Z].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Le,me[Z].width,me[Z].height,0,be,ve,me[Z].data);for(let le=0;le<$.length;le++){const Ye=$[le].image[Z].image;Be?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le+1,0,0,Ye.width,Ye.height,be,ve,Ye.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le+1,Le,Ye.width,Ye.height,0,be,ve,Ye.data)}}else{Be?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,be,ve,me[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Le,be,ve,me[Z]);for(let le=0;le<$.length;le++){const Ae=$[le];Be?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le+1,0,0,be,ve,Ae.image[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le+1,Le,be,ve,Ae.image[Z])}}}m(S)&&f(n.TEXTURE_CUBE_MAP),Q.__version=ne.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function ie(R,S,G,ee,ne,Q){const Ee=s.convert(G.format,G.colorSpace),ue=s.convert(G.type),ge=g(G.internalFormat,Ee,ue,G.colorSpace);if(!i.get(S).__hasExternalTextures){const re=Math.max(1,S.width>>Q),me=Math.max(1,S.height>>Q);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,Q,ge,re,me,S.depth,0,Ee,ue,null):t.texImage2D(ne,Q,ge,re,me,0,Ee,ue,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),Se(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,ne,i.get(G).__webglTexture,0,it(S)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,ne,i.get(G).__webglTexture,Q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function he(R,S,G){if(n.bindRenderbuffer(n.RENDERBUFFER,R),S.depthBuffer){const ee=S.depthTexture,ne=ee&&ee.isDepthTexture?ee.type:null,Q=v(S.stencilBuffer,ne),Ee=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ue=it(S);Se(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ue,Q,S.width,S.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,ue,Q,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,Q,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ee,n.RENDERBUFFER,R)}else{const ee=S.textures;for(let ne=0;ne<ee.length;ne++){const Q=ee[ne],Ee=s.convert(Q.format,Q.colorSpace),ue=s.convert(Q.type),ge=g(Q.internalFormat,Ee,ue,Q.colorSpace),Ne=it(S);G&&Se(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ne,ge,S.width,S.height):Se(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ne,ge,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,ge,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function fe(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),X(S.depthTexture,0);const ee=i.get(S.depthTexture).__webglTexture,ne=it(S);if(S.depthTexture.format===Ls)Se(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0);else if(S.depthTexture.format===Gs)Se(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function De(R){const S=i.get(R),G=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");fe(S.__webglFramebuffer,R)}else if(G){S.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[ee]),S.__webglDepthbuffer[ee]=n.createRenderbuffer(),he(S.__webglDepthbuffer[ee],R,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=n.createRenderbuffer(),he(S.__webglDepthbuffer,R,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Oe(R,S,G){const ee=i.get(R);S!==void 0&&ie(ee.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&De(R)}function Ve(R){const S=R.texture,G=i.get(R),ee=i.get(S);R.addEventListener("dispose",A);const ne=R.textures,Q=R.isWebGLCubeRenderTarget===!0,Ee=ne.length>1;if(Ee||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=S.version,o.memory.textures++),Q){G.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer[ue]=[];for(let ge=0;ge<S.mipmaps.length;ge++)G.__webglFramebuffer[ue][ge]=n.createFramebuffer()}else G.__webglFramebuffer[ue]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer=[];for(let ue=0;ue<S.mipmaps.length;ue++)G.__webglFramebuffer[ue]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(Ee)for(let ue=0,ge=ne.length;ue<ge;ue++){const Ne=i.get(ne[ue]);Ne.__webglTexture===void 0&&(Ne.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&Se(R)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ue=0;ue<ne.length;ue++){const ge=ne[ue];G.__webglColorRenderbuffer[ue]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[ue]);const Ne=s.convert(ge.format,ge.colorSpace),re=s.convert(ge.type),me=g(ge.internalFormat,Ne,re,ge.colorSpace,R.isXRRenderTarget===!0),We=it(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,We,me,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,G.__webglColorRenderbuffer[ue])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),he(G.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Q){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),ae(n.TEXTURE_CUBE_MAP,S);for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0)for(let ge=0;ge<S.mipmaps.length;ge++)ie(G.__webglFramebuffer[ue][ge],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ge);else ie(G.__webglFramebuffer[ue],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);m(S)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let ue=0,ge=ne.length;ue<ge;ue++){const Ne=ne[ue],re=i.get(Ne);t.bindTexture(n.TEXTURE_2D,re.__webglTexture),ae(n.TEXTURE_2D,Ne),ie(G.__webglFramebuffer,R,Ne,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,0),m(Ne)&&f(n.TEXTURE_2D)}t.unbindTexture()}else{let ue=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ue=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ue,ee.__webglTexture),ae(ue,S),S.mipmaps&&S.mipmaps.length>0)for(let ge=0;ge<S.mipmaps.length;ge++)ie(G.__webglFramebuffer[ge],R,S,n.COLOR_ATTACHMENT0,ue,ge);else ie(G.__webglFramebuffer,R,S,n.COLOR_ATTACHMENT0,ue,0);m(S)&&f(ue),t.unbindTexture()}R.depthBuffer&&De(R)}function vt(R){const S=R.textures;for(let G=0,ee=S.length;G<ee;G++){const ne=S[G];if(m(ne)){const Q=R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Ee=i.get(ne).__webglTexture;t.bindTexture(Q,Ee),f(Q),t.unbindTexture()}}}const I=[],Et=[];function et(R){if(R.samples>0){if(Se(R)===!1){const S=R.textures,G=R.width,ee=R.height;let ne=n.COLOR_BUFFER_BIT;const Q=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ee=i.get(R),ue=S.length>1;if(ue)for(let ge=0;ge<S.length;ge++)t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let ge=0;ge<S.length;ge++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),ue){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[ge]);const Ne=i.get(S[ge]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ne,0)}n.blitFramebuffer(0,0,G,ee,0,0,G,ee,ne,n.NEAREST),l===!0&&(I.length=0,Et.length=0,I.push(n.COLOR_ATTACHMENT0+ge),R.depthBuffer&&R.resolveDepthBuffer===!1&&(I.push(Q),Et.push(Q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Et)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,I))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ue)for(let ge=0;ge<S.length;ge++){t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[ge]);const Ne=i.get(S[ge]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,Ne,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const S=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function it(R){return Math.min(r.maxSamples,R.samples)}function Se(R){const S=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function wt(R){const S=o.render.frame;u.get(R)!==S&&(u.set(R,S),R.update())}function Pe(R,S){const G=R.colorSpace,ee=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||G!==hr&&G!==Gi&&(tt.getTransfer(G)===at?(ee!==jn||ne!==Ri)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),S}function Ie(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=D,this.setTexture2D=X,this.setTexture2DArray=Y,this.setTexture3D=W,this.setTextureCube=q,this.rebindTextures=Oe,this.setupRenderTarget=Ve,this.updateRenderTargetMipmap=vt,this.updateMultisampleRenderTarget=et,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=ie,this.useMultisampledRTT=Se}function mT(n,e){function t(i,r=Gi){let s;const o=tt.getTransfer(r);if(i===Ri)return n.UNSIGNED_BYTE;if(i===Wf)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Xf)return n.UNSIGNED_SHORT_5_5_5_1;if(i===$g)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Yg)return n.BYTE;if(i===qg)return n.SHORT;if(i===qo)return n.UNSIGNED_SHORT;if(i===Gf)return n.INT;if(i===zr)return n.UNSIGNED_INT;if(i===Mi)return n.FLOAT;if(i===ta)return n.HALF_FLOAT;if(i===Kg)return n.ALPHA;if(i===Zg)return n.RGB;if(i===jn)return n.RGBA;if(i===Qg)return n.LUMINANCE;if(i===Jg)return n.LUMINANCE_ALPHA;if(i===Ls)return n.DEPTH_COMPONENT;if(i===Gs)return n.DEPTH_STENCIL;if(i===ev)return n.RED;if(i===jf)return n.RED_INTEGER;if(i===tv)return n.RG;if(i===Yf)return n.RG_INTEGER;if(i===qf)return n.RGBA_INTEGER;if(i===ll||i===cl||i===ul||i===hl)if(o===at)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ll)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===cl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ul)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===hl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ll)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===cl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ul)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===hl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===_h||i===xh||i===yh||i===Mh)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===_h)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===xh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===yh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Mh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Sh||i===Eh||i===wh)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Sh||i===Eh)return o===at?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===wh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Th||i===Ah||i===Ch||i===Rh||i===bh||i===Ph||i===Lh||i===Dh||i===Ih||i===Nh||i===Uh||i===zh||i===Fh||i===kh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Th)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ah)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ch)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===bh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ph)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Lh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Dh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ih)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Nh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Uh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===zh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Fh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===kh)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===fl||i===Oh||i===Bh)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===fl)return o===at?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Oh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Bh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===nv||i===Hh||i===Vh||i===Gh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===fl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Hh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Vh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Gh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Vs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class gT extends xn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ht extends kt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vT={type:"move"};class pu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ht,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ht,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ht,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),f=this._getHandJoint(c,x);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,_=.005;c.inputState.pinching&&d>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(vT)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ht;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const _T=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,xT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class yT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new sn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ar({vertexShader:_T,fragmentShader:xT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Je(new Ks(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class MT extends qs{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,p=null,_=null;const x=new yT,m=t.getContextAttributes();let f=null,g=null;const v=[],M=[],b=new Ge;let A=null;const T=new xn;T.layers.enable(1),T.viewport=new lt;const L=new xn;L.layers.enable(2),L.viewport=new lt;const w=[T,L],y=new gT;y.layers.enable(1),y.layers.enable(2);let D=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ie=v[j];return ie===void 0&&(ie=new pu,v[j]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(j){let ie=v[j];return ie===void 0&&(ie=new pu,v[j]=ie),ie.getGripSpace()},this.getHand=function(j){let ie=v[j];return ie===void 0&&(ie=new pu,v[j]=ie),ie.getHandSpace()};function C(j){const ie=M.indexOf(j.inputSource);if(ie===-1)return;const he=v[ie];he!==void 0&&(he.update(j.inputSource,j.frame,c||o),he.dispatchEvent({type:j.type,data:j.inputSource}))}function X(){r.removeEventListener("select",C),r.removeEventListener("selectstart",C),r.removeEventListener("selectend",C),r.removeEventListener("squeeze",C),r.removeEventListener("squeezestart",C),r.removeEventListener("squeezeend",C),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",Y);for(let j=0;j<v.length;j++){const ie=M[j];ie!==null&&(M[j]=null,v[j].disconnect(ie))}D=null,H=null,x.reset(),e.setRenderTarget(f),p=null,d=null,h=null,r=null,g=null,je.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(b.width,b.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(j){if(r=j,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",C),r.addEventListener("selectstart",C),r.addEventListener("selectend",C),r.addEventListener("squeeze",C),r.addEventListener("squeezestart",C),r.addEventListener("squeezeend",C),r.addEventListener("end",X),r.addEventListener("inputsourceschange",Y),m.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(b),r.renderState.layers===void 0){const ie={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,ie),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),g=new Fr(p.framebufferWidth,p.framebufferHeight,{format:jn,type:Ri,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ie=null,he=null,fe=null;m.depth&&(fe=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=m.stencil?Gs:Ls,he=m.stencil?Vs:zr);const De={colorFormat:t.RGBA8,depthFormat:fe,scaleFactor:s};h=new XRWebGLBinding(r,t),d=h.createProjectionLayer(De),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),g=new Fr(d.textureWidth,d.textureHeight,{format:jn,type:Ri,depthTexture:new _v(d.textureWidth,d.textureHeight,he,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),je.setContext(r),je.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function Y(j){for(let ie=0;ie<j.removed.length;ie++){const he=j.removed[ie],fe=M.indexOf(he);fe>=0&&(M[fe]=null,v[fe].disconnect(he))}for(let ie=0;ie<j.added.length;ie++){const he=j.added[ie];let fe=M.indexOf(he);if(fe===-1){for(let Oe=0;Oe<v.length;Oe++)if(Oe>=M.length){M.push(he),fe=Oe;break}else if(M[Oe]===null){M[Oe]=he,fe=Oe;break}if(fe===-1)break}const De=v[fe];De&&De.connect(he)}}const W=new F,q=new F;function N(j,ie,he){W.setFromMatrixPosition(ie.matrixWorld),q.setFromMatrixPosition(he.matrixWorld);const fe=W.distanceTo(q),De=ie.projectionMatrix.elements,Oe=he.projectionMatrix.elements,Ve=De[14]/(De[10]-1),vt=De[14]/(De[10]+1),I=(De[9]+1)/De[5],Et=(De[9]-1)/De[5],et=(De[8]-1)/De[0],it=(Oe[8]+1)/Oe[0],Se=Ve*et,wt=Ve*it,Pe=fe/(-et+it),Ie=Pe*-et;ie.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Ie),j.translateZ(Pe),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert();const R=Ve+Pe,S=vt+Pe,G=Se-Ie,ee=wt+(fe-Ie),ne=I*vt/S*R,Q=Et*vt/S*R;j.projectionMatrix.makePerspective(G,ee,ne,Q,R,S),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}function K(j,ie){ie===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ie.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(r===null)return;x.texture!==null&&(j.near=x.depthNear,j.far=x.depthFar),y.near=L.near=T.near=j.near,y.far=L.far=T.far=j.far,(D!==y.near||H!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),D=y.near,H=y.far,T.near=D,T.far=H,L.near=D,L.far=H,T.updateProjectionMatrix(),L.updateProjectionMatrix(),j.updateProjectionMatrix());const ie=j.parent,he=y.cameras;K(y,ie);for(let fe=0;fe<he.length;fe++)K(he[fe],ie);he.length===2?N(y,T,L):y.projectionMatrix.copy(T.projectionMatrix),J(j,y,ie)};function J(j,ie,he){he===null?j.matrix.copy(ie.matrixWorld):(j.matrix.copy(he.matrixWorld),j.matrix.invert(),j.matrix.multiply(ie.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ie.projectionMatrix),j.projectionMatrixInverse.copy(ie.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=$o*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(j){l=j,d!==null&&(d.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(y)};let ae=null;function Me(j,ie){if(u=ie.getViewerPose(c||o),_=ie,u!==null){const he=u.views;p!==null&&(e.setRenderTargetFramebuffer(g,p.framebuffer),e.setRenderTarget(g));let fe=!1;he.length!==y.cameras.length&&(y.cameras.length=0,fe=!0);for(let Oe=0;Oe<he.length;Oe++){const Ve=he[Oe];let vt=null;if(p!==null)vt=p.getViewport(Ve);else{const Et=h.getViewSubImage(d,Ve);vt=Et.viewport,Oe===0&&(e.setRenderTargetTextures(g,Et.colorTexture,d.ignoreDepthValues?void 0:Et.depthStencilTexture),e.setRenderTarget(g))}let I=w[Oe];I===void 0&&(I=new xn,I.layers.enable(Oe),I.viewport=new lt,w[Oe]=I),I.matrix.fromArray(Ve.transform.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale),I.projectionMatrix.fromArray(Ve.projectionMatrix),I.projectionMatrixInverse.copy(I.projectionMatrix).invert(),I.viewport.set(vt.x,vt.y,vt.width,vt.height),Oe===0&&(y.matrix.copy(I.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),fe===!0&&y.cameras.push(I)}const De=r.enabledFeatures;if(De&&De.includes("depth-sensing")){const Oe=h.getDepthInformation(he[0]);Oe&&Oe.isValid&&Oe.texture&&x.init(e,Oe,r.renderState)}}for(let he=0;he<v.length;he++){const fe=M[he],De=v[he];fe!==null&&De!==void 0&&De.update(fe,ie,c||o)}ae&&ae(j,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),_=null}const je=new gv;je.setAnimationLoop(Me),this.setAnimationLoop=function(j){ae=j},this.dispose=function(){}}}const _r=new li,ST=new Mt;function ET(n,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,dv(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,g,v,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),h(m,f)):f.isMeshPhongMaterial?(s(m,f),u(m,f)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(s(m,f),_(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),x(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,g,v):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===rn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===rn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const g=e.get(f),v=g.envMap,M=g.envMapRotation;v&&(m.envMap.value=v,_r.copy(M),_r.x*=-1,_r.y*=-1,_r.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(_r.y*=-1,_r.z*=-1),m.envMapRotation.value.setFromMatrix4(ST.makeRotationFromEuler(_r)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,g,v){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*g,m.scale.value=v*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,g){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===rn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=g.texture,m.transmissionSamplerSize.value.set(g.width,g.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,f){f.matcap&&(m.matcap.value=f.matcap)}function x(m,f){const g=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(g.matrixWorld),m.nearDistance.value=g.shadow.camera.near,m.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function wT(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(g,v){const M=v.program;i.uniformBlockBinding(g,M)}function c(g,v){let M=r[g.id];M===void 0&&(_(g),M=u(g),r[g.id]=M,g.addEventListener("dispose",m));const b=v.program;i.updateUBOMapping(g,b);const A=e.render.frame;s[g.id]!==A&&(d(g),s[g.id]=A)}function u(g){const v=h();g.__bindingPointIndex=v;const M=n.createBuffer(),b=g.__size,A=g.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,b,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,M),M}function h(){for(let g=0;g<a;g++)if(o.indexOf(g)===-1)return o.push(g),g;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(g){const v=r[g.id],M=g.uniforms,b=g.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let A=0,T=M.length;A<T;A++){const L=Array.isArray(M[A])?M[A]:[M[A]];for(let w=0,y=L.length;w<y;w++){const D=L[w];if(p(D,A,w,b)===!0){const H=D.__offset,C=Array.isArray(D.value)?D.value:[D.value];let X=0;for(let Y=0;Y<C.length;Y++){const W=C[Y],q=x(W);typeof W=="number"||typeof W=="boolean"?(D.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,H+X,D.__data)):W.isMatrix3?(D.__data[0]=W.elements[0],D.__data[1]=W.elements[1],D.__data[2]=W.elements[2],D.__data[3]=0,D.__data[4]=W.elements[3],D.__data[5]=W.elements[4],D.__data[6]=W.elements[5],D.__data[7]=0,D.__data[8]=W.elements[6],D.__data[9]=W.elements[7],D.__data[10]=W.elements[8],D.__data[11]=0):(W.toArray(D.__data,X),X+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,H,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(g,v,M,b){const A=g.value,T=v+"_"+M;if(b[T]===void 0)return typeof A=="number"||typeof A=="boolean"?b[T]=A:b[T]=A.clone(),!0;{const L=b[T];if(typeof A=="number"||typeof A=="boolean"){if(L!==A)return b[T]=A,!0}else if(L.equals(A)===!1)return L.copy(A),!0}return!1}function _(g){const v=g.uniforms;let M=0;const b=16;for(let T=0,L=v.length;T<L;T++){const w=Array.isArray(v[T])?v[T]:[v[T]];for(let y=0,D=w.length;y<D;y++){const H=w[y],C=Array.isArray(H.value)?H.value:[H.value];for(let X=0,Y=C.length;X<Y;X++){const W=C[X],q=x(W),N=M%b;N!==0&&b-N<q.boundary&&(M+=b-N),H.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=M,M+=q.storage}}}const A=M%b;return A>0&&(M+=b-A),g.__size=M,g.__cache={},this}function x(g){const v={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(v.boundary=4,v.storage=4):g.isVector2?(v.boundary=8,v.storage=8):g.isVector3||g.isColor?(v.boundary=16,v.storage=12):g.isVector4?(v.boundary=16,v.storage=16):g.isMatrix3?(v.boundary=48,v.storage=48):g.isMatrix4?(v.boundary=64,v.storage=64):g.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",g),v}function m(g){const v=g.target;v.removeEventListener("dispose",m);const M=o.indexOf(v.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function f(){for(const g in r)n.deleteBuffer(r[g]);o=[],r={},s={}}return{bind:l,update:c,dispose:f}}class TT{constructor(e={}){const{canvas:t=mM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=o;const p=new Uint32Array(4),_=new Int32Array(4);let x=null,m=null;const f=[],g=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Gn,this.toneMapping=ir,this.toneMappingExposure=1;const v=this;let M=!1,b=0,A=0,T=null,L=-1,w=null;const y=new lt,D=new lt;let H=null;const C=new Xe(0);let X=0,Y=t.width,W=t.height,q=1,N=null,K=null;const J=new lt(0,0,Y,W),ae=new lt(0,0,Y,W);let Me=!1;const je=new Qf;let j=!1,ie=!1;const he=new Mt,fe=new F,De=new lt,Oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ve=!1;function vt(){return T===null?q:1}let I=i;function Et(E,z){return t.getContext(E,z)}try{const E={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Hf}`),t.addEventListener("webglcontextlost",$,!1),t.addEventListener("webglcontextrestored",Z,!1),t.addEventListener("webglcontextcreationerror",le,!1),I===null){const z="webgl2";if(I=Et(z,E),I===null)throw Et(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let et,it,Se,wt,Pe,Ie,R,S,G,ee,ne,Q,Ee,ue,ge,Ne,re,me,We,be,ve,Le,Be,dt;function U(){et=new DE(I),et.init(),Le=new mT(I,et),it=new AE(I,et,e,Le),Se=new fT(I),wt=new UE(I),Pe=new Qw,Ie=new pT(I,et,Se,Pe,it,Le,wt),R=new RE(v),S=new LE(v),G=new VM(I),Be=new wE(I,G),ee=new IE(I,G,wt,Be),ne=new FE(I,ee,G,wt),We=new zE(I,it,Ie),Ne=new CE(Pe),Q=new Zw(v,R,S,et,it,Be,Ne),Ee=new ET(v,Pe),ue=new eT,ge=new oT(et),me=new EE(v,R,S,Se,ne,d,l),re=new hT(v,ne,it),dt=new wT(I,wt,it,Se),be=new TE(I,et,wt),ve=new NE(I,et,wt),wt.programs=Q.programs,v.capabilities=it,v.extensions=et,v.properties=Pe,v.renderLists=ue,v.shadowMap=re,v.state=Se,v.info=wt}U();const se=new MT(v,I);this.xr=se,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const E=et.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=et.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(E){E!==void 0&&(q=E,this.setSize(Y,W,!1))},this.getSize=function(E){return E.set(Y,W)},this.setSize=function(E,z,B=!0){if(se.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=E,W=z,t.width=Math.floor(E*q),t.height=Math.floor(z*q),B===!0&&(t.style.width=E+"px",t.style.height=z+"px"),this.setViewport(0,0,E,z)},this.getDrawingBufferSize=function(E){return E.set(Y*q,W*q).floor()},this.setDrawingBufferSize=function(E,z,B){Y=E,W=z,q=B,t.width=Math.floor(E*B),t.height=Math.floor(z*B),this.setViewport(0,0,E,z)},this.getCurrentViewport=function(E){return E.copy(y)},this.getViewport=function(E){return E.copy(J)},this.setViewport=function(E,z,B,V){E.isVector4?J.set(E.x,E.y,E.z,E.w):J.set(E,z,B,V),Se.viewport(y.copy(J).multiplyScalar(q).round())},this.getScissor=function(E){return E.copy(ae)},this.setScissor=function(E,z,B,V){E.isVector4?ae.set(E.x,E.y,E.z,E.w):ae.set(E,z,B,V),Se.scissor(D.copy(ae).multiplyScalar(q).round())},this.getScissorTest=function(){return Me},this.setScissorTest=function(E){Se.setScissorTest(Me=E)},this.setOpaqueSort=function(E){N=E},this.setTransparentSort=function(E){K=E},this.getClearColor=function(E){return E.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor.apply(me,arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha.apply(me,arguments)},this.clear=function(E=!0,z=!0,B=!0){let V=0;if(E){let k=!1;if(T!==null){const oe=T.texture.format;k=oe===qf||oe===Yf||oe===jf}if(k){const oe=T.texture.type,de=oe===Ri||oe===zr||oe===qo||oe===Vs||oe===Wf||oe===Xf,_e=me.getClearColor(),xe=me.getClearAlpha(),Ce=_e.r,Re=_e.g,we=_e.b;de?(p[0]=Ce,p[1]=Re,p[2]=we,p[3]=xe,I.clearBufferuiv(I.COLOR,0,p)):(_[0]=Ce,_[1]=Re,_[2]=we,_[3]=xe,I.clearBufferiv(I.COLOR,0,_))}else V|=I.COLOR_BUFFER_BIT}z&&(V|=I.DEPTH_BUFFER_BIT),B&&(V|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",$,!1),t.removeEventListener("webglcontextrestored",Z,!1),t.removeEventListener("webglcontextcreationerror",le,!1),ue.dispose(),ge.dispose(),Pe.dispose(),R.dispose(),S.dispose(),ne.dispose(),Be.dispose(),dt.dispose(),Q.dispose(),se.dispose(),se.removeEventListener("sessionstart",Zn),se.removeEventListener("sessionend",id),fr.stop()};function $(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function Z(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const E=wt.autoReset,z=re.enabled,B=re.autoUpdate,V=re.needsUpdate,k=re.type;U(),wt.autoReset=E,re.enabled=z,re.autoUpdate=B,re.needsUpdate=V,re.type=k}function le(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ae(E){const z=E.target;z.removeEventListener("dispose",Ae),Ye(z)}function Ye(E){Tt(E),Pe.remove(E)}function Tt(E){const z=Pe.get(E).programs;z!==void 0&&(z.forEach(function(B){Q.releaseProgram(B)}),E.isShaderMaterial&&Q.releaseShaderCache(E))}this.renderBufferDirect=function(E,z,B,V,k,oe){z===null&&(z=Oe);const de=k.isMesh&&k.matrixWorld.determinant()<0,_e=Rv(E,z,B,V,k);Se.setMaterial(V,de);let xe=B.index,Ce=1;if(V.wireframe===!0){if(xe=ee.getWireframeAttribute(B),xe===void 0)return;Ce=2}const Re=B.drawRange,we=B.attributes.position;let Ke=Re.start*Ce,_t=(Re.start+Re.count)*Ce;oe!==null&&(Ke=Math.max(Ke,oe.start*Ce),_t=Math.min(_t,(oe.start+oe.count)*Ce)),xe!==null?(Ke=Math.max(Ke,0),_t=Math.min(_t,xe.count)):we!=null&&(Ke=Math.max(Ke,0),_t=Math.min(_t,we.count));const xt=_t-Ke;if(xt<0||xt===1/0)return;Be.setup(k,V,_e,B,xe);let dn,Ze=be;if(xe!==null&&(dn=G.get(xe),Ze=ve,Ze.setIndex(dn)),k.isMesh)V.wireframe===!0?(Se.setLineWidth(V.wireframeLinewidth*vt()),Ze.setMode(I.LINES)):Ze.setMode(I.TRIANGLES);else if(k.isLine){let ye=V.linewidth;ye===void 0&&(ye=1),Se.setLineWidth(ye*vt()),k.isLineSegments?Ze.setMode(I.LINES):k.isLineLoop?Ze.setMode(I.LINE_LOOP):Ze.setMode(I.LINE_STRIP)}else k.isPoints?Ze.setMode(I.POINTS):k.isSprite&&Ze.setMode(I.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Ze.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(et.get("WEBGL_multi_draw"))Ze.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const ye=k._multiDrawStarts,Bt=k._multiDrawCounts,Qe=k._multiDrawCount,zn=xe?G.get(xe).bytesPerElement:1,Br=Pe.get(V).currentProgram.getUniforms();for(let pn=0;pn<Qe;pn++)Br.setValue(I,"_gl_DrawID",pn),Ze.render(ye[pn]/zn,Bt[pn])}else if(k.isInstancedMesh)Ze.renderInstances(Ke,xt,k.count);else if(B.isInstancedBufferGeometry){const ye=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Bt=Math.min(B.instanceCount,ye);Ze.renderInstances(Ke,xt,Bt)}else Ze.render(Ke,xt)};function Ot(E,z,B){E.transparent===!0&&E.side===_i&&E.forceSinglePass===!1?(E.side=rn,E.needsUpdate=!0,aa(E,z,B),E.side=or,E.needsUpdate=!0,aa(E,z,B),E.side=_i):aa(E,z,B)}this.compile=function(E,z,B=null){B===null&&(B=E),m=ge.get(B),m.init(z),g.push(m),B.traverseVisible(function(k){k.isLight&&k.layers.test(z.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),E!==B&&E.traverseVisible(function(k){k.isLight&&k.layers.test(z.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),m.setupLights();const V=new Set;return E.traverse(function(k){const oe=k.material;if(oe)if(Array.isArray(oe))for(let de=0;de<oe.length;de++){const _e=oe[de];Ot(_e,B,k),V.add(_e)}else Ot(oe,B,k),V.add(oe)}),g.pop(),m=null,V},this.compileAsync=function(E,z,B=null){const V=this.compile(E,z,B);return new Promise(k=>{function oe(){if(V.forEach(function(de){Pe.get(de).currentProgram.isReady()&&V.delete(de)}),V.size===0){k(E);return}setTimeout(oe,10)}et.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let $e=null;function ci(E){$e&&$e(E)}function Zn(){fr.stop()}function id(){fr.start()}const fr=new gv;fr.setAnimationLoop(ci),typeof self<"u"&&fr.setContext(self),this.setAnimationLoop=function(E){$e=E,se.setAnimationLoop(E),E===null?fr.stop():fr.start()},se.addEventListener("sessionstart",Zn),se.addEventListener("sessionend",id),this.render=function(E,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(se.cameraAutoUpdate===!0&&se.updateCamera(z),z=se.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,z,T),m=ge.get(E,g.length),m.init(z),g.push(m),he.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),je.setFromProjectionMatrix(he),ie=this.localClippingEnabled,j=Ne.init(this.clippingPlanes,ie),x=ue.get(E,f.length),x.init(),f.push(x),se.enabled===!0&&se.isPresenting===!0){const oe=v.xr.getDepthSensingMesh();oe!==null&&dc(oe,z,-1/0,v.sortObjects)}dc(E,z,0,v.sortObjects),x.finish(),v.sortObjects===!0&&x.sort(N,K),Ve=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,Ve&&me.addToRenderList(x,E),this.info.render.frame++,j===!0&&Ne.beginShadows();const B=m.state.shadowsArray;re.render(B,E,z),j===!0&&Ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=x.opaque,k=x.transmissive;if(m.setupLights(),z.isArrayCamera){const oe=z.cameras;if(k.length>0)for(let de=0,_e=oe.length;de<_e;de++){const xe=oe[de];sd(V,k,E,xe)}Ve&&me.render(E);for(let de=0,_e=oe.length;de<_e;de++){const xe=oe[de];rd(x,E,xe,xe.viewport)}}else k.length>0&&sd(V,k,E,z),Ve&&me.render(E),rd(x,E,z);T!==null&&(Ie.updateMultisampleRenderTarget(T),Ie.updateRenderTargetMipmap(T)),E.isScene===!0&&E.onAfterRender(v,E,z),Be.resetDefaultState(),L=-1,w=null,g.pop(),g.length>0?(m=g[g.length-1],j===!0&&Ne.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,f.pop(),f.length>0?x=f[f.length-1]:x=null};function dc(E,z,B,V){if(E.visible===!1)return;if(E.layers.test(z.layers)){if(E.isGroup)B=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(z);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||je.intersectsSprite(E)){V&&De.setFromMatrixPosition(E.matrixWorld).applyMatrix4(he);const de=ne.update(E),_e=E.material;_e.visible&&x.push(E,de,_e,B,De.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||je.intersectsObject(E))){const de=ne.update(E),_e=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),De.copy(E.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),De.copy(de.boundingSphere.center)),De.applyMatrix4(E.matrixWorld).applyMatrix4(he)),Array.isArray(_e)){const xe=de.groups;for(let Ce=0,Re=xe.length;Ce<Re;Ce++){const we=xe[Ce],Ke=_e[we.materialIndex];Ke&&Ke.visible&&x.push(E,de,Ke,B,De.z,we)}}else _e.visible&&x.push(E,de,_e,B,De.z,null)}}const oe=E.children;for(let de=0,_e=oe.length;de<_e;de++)dc(oe[de],z,B,V)}function rd(E,z,B,V){const k=E.opaque,oe=E.transmissive,de=E.transparent;m.setupLightsView(B),j===!0&&Ne.setGlobalState(v.clippingPlanes,B),V&&Se.viewport(y.copy(V)),k.length>0&&oa(k,z,B),oe.length>0&&oa(oe,z,B),de.length>0&&oa(de,z,B),Se.buffers.depth.setTest(!0),Se.buffers.depth.setMask(!0),Se.buffers.color.setMask(!0),Se.setPolygonOffset(!1)}function sd(E,z,B,V){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[V.id]===void 0&&(m.state.transmissionRenderTarget[V.id]=new Fr(1,1,{generateMipmaps:!0,type:et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float")?ta:Ri,minFilter:Rr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const oe=m.state.transmissionRenderTarget[V.id],de=V.viewport||y;oe.setSize(de.z,de.w);const _e=v.getRenderTarget();v.setRenderTarget(oe),v.getClearColor(C),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),Ve?me.render(B):v.clear();const xe=v.toneMapping;v.toneMapping=ir;const Ce=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),m.setupLightsView(V),j===!0&&Ne.setGlobalState(v.clippingPlanes,V),oa(E,B,V),Ie.updateMultisampleRenderTarget(oe),Ie.updateRenderTargetMipmap(oe),et.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let we=0,Ke=z.length;we<Ke;we++){const _t=z[we],xt=_t.object,dn=_t.geometry,Ze=_t.material,ye=_t.group;if(Ze.side===_i&&xt.layers.test(V.layers)){const Bt=Ze.side;Ze.side=rn,Ze.needsUpdate=!0,od(xt,B,V,dn,Ze,ye),Ze.side=Bt,Ze.needsUpdate=!0,Re=!0}}Re===!0&&(Ie.updateMultisampleRenderTarget(oe),Ie.updateRenderTargetMipmap(oe))}v.setRenderTarget(_e),v.setClearColor(C,X),Ce!==void 0&&(V.viewport=Ce),v.toneMapping=xe}function oa(E,z,B){const V=z.isScene===!0?z.overrideMaterial:null;for(let k=0,oe=E.length;k<oe;k++){const de=E[k],_e=de.object,xe=de.geometry,Ce=V===null?de.material:V,Re=de.group;_e.layers.test(B.layers)&&od(_e,z,B,xe,Ce,Re)}}function od(E,z,B,V,k,oe){E.onBeforeRender(v,z,B,V,k,oe),E.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),k.transparent===!0&&k.side===_i&&k.forceSinglePass===!1?(k.side=rn,k.needsUpdate=!0,v.renderBufferDirect(B,z,V,k,E,oe),k.side=or,k.needsUpdate=!0,v.renderBufferDirect(B,z,V,k,E,oe),k.side=_i):v.renderBufferDirect(B,z,V,k,E,oe),E.onAfterRender(v,z,B,V,k,oe)}function aa(E,z,B){z.isScene!==!0&&(z=Oe);const V=Pe.get(E),k=m.state.lights,oe=m.state.shadowsArray,de=k.state.version,_e=Q.getParameters(E,k.state,oe,z,B),xe=Q.getProgramCacheKey(_e);let Ce=V.programs;V.environment=E.isMeshStandardMaterial?z.environment:null,V.fog=z.fog,V.envMap=(E.isMeshStandardMaterial?S:R).get(E.envMap||V.environment),V.envMapRotation=V.environment!==null&&E.envMap===null?z.environmentRotation:E.envMapRotation,Ce===void 0&&(E.addEventListener("dispose",Ae),Ce=new Map,V.programs=Ce);let Re=Ce.get(xe);if(Re!==void 0){if(V.currentProgram===Re&&V.lightsStateVersion===de)return ld(E,_e),Re}else _e.uniforms=Q.getUniforms(E),E.onBeforeCompile(_e,v),Re=Q.acquireProgram(_e,xe),Ce.set(xe,Re),V.uniforms=_e.uniforms;const we=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(we.clippingPlanes=Ne.uniform),ld(E,_e),V.needsLights=Pv(E),V.lightsStateVersion=de,V.needsLights&&(we.ambientLightColor.value=k.state.ambient,we.lightProbe.value=k.state.probe,we.directionalLights.value=k.state.directional,we.directionalLightShadows.value=k.state.directionalShadow,we.spotLights.value=k.state.spot,we.spotLightShadows.value=k.state.spotShadow,we.rectAreaLights.value=k.state.rectArea,we.ltc_1.value=k.state.rectAreaLTC1,we.ltc_2.value=k.state.rectAreaLTC2,we.pointLights.value=k.state.point,we.pointLightShadows.value=k.state.pointShadow,we.hemisphereLights.value=k.state.hemi,we.directionalShadowMap.value=k.state.directionalShadowMap,we.directionalShadowMatrix.value=k.state.directionalShadowMatrix,we.spotShadowMap.value=k.state.spotShadowMap,we.spotLightMatrix.value=k.state.spotLightMatrix,we.spotLightMap.value=k.state.spotLightMap,we.pointShadowMap.value=k.state.pointShadowMap,we.pointShadowMatrix.value=k.state.pointShadowMatrix),V.currentProgram=Re,V.uniformsList=null,Re}function ad(E){if(E.uniformsList===null){const z=E.currentProgram.getUniforms();E.uniformsList=dl.seqWithValue(z.seq,E.uniforms)}return E.uniformsList}function ld(E,z){const B=Pe.get(E);B.outputColorSpace=z.outputColorSpace,B.batching=z.batching,B.batchingColor=z.batchingColor,B.instancing=z.instancing,B.instancingColor=z.instancingColor,B.instancingMorph=z.instancingMorph,B.skinning=z.skinning,B.morphTargets=z.morphTargets,B.morphNormals=z.morphNormals,B.morphColors=z.morphColors,B.morphTargetsCount=z.morphTargetsCount,B.numClippingPlanes=z.numClippingPlanes,B.numIntersection=z.numClipIntersection,B.vertexAlphas=z.vertexAlphas,B.vertexTangents=z.vertexTangents,B.toneMapping=z.toneMapping}function Rv(E,z,B,V,k){z.isScene!==!0&&(z=Oe),Ie.resetTextureUnits();const oe=z.fog,de=V.isMeshStandardMaterial?z.environment:null,_e=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:hr,xe=(V.isMeshStandardMaterial?S:R).get(V.envMap||de),Ce=V.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Re=!!B.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),we=!!B.morphAttributes.position,Ke=!!B.morphAttributes.normal,_t=!!B.morphAttributes.color;let xt=ir;V.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(xt=v.toneMapping);const dn=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Ze=dn!==void 0?dn.length:0,ye=Pe.get(V),Bt=m.state.lights;if(j===!0&&(ie===!0||E!==w)){const Tn=E===w&&V.id===L;Ne.setState(V,E,Tn)}let Qe=!1;V.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Bt.state.version||ye.outputColorSpace!==_e||k.isBatchedMesh&&ye.batching===!1||!k.isBatchedMesh&&ye.batching===!0||k.isBatchedMesh&&ye.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&ye.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&ye.instancing===!1||!k.isInstancedMesh&&ye.instancing===!0||k.isSkinnedMesh&&ye.skinning===!1||!k.isSkinnedMesh&&ye.skinning===!0||k.isInstancedMesh&&ye.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&ye.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&ye.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&ye.instancingMorph===!1&&k.morphTexture!==null||ye.envMap!==xe||V.fog===!0&&ye.fog!==oe||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==Ne.numPlanes||ye.numIntersection!==Ne.numIntersection)||ye.vertexAlphas!==Ce||ye.vertexTangents!==Re||ye.morphTargets!==we||ye.morphNormals!==Ke||ye.morphColors!==_t||ye.toneMapping!==xt||ye.morphTargetsCount!==Ze)&&(Qe=!0):(Qe=!0,ye.__version=V.version);let zn=ye.currentProgram;Qe===!0&&(zn=aa(V,z,k));let Br=!1,pn=!1,pc=!1;const At=zn.getUniforms(),Pi=ye.uniforms;if(Se.useProgram(zn.program)&&(Br=!0,pn=!0,pc=!0),V.id!==L&&(L=V.id,pn=!0),Br||w!==E){At.setValue(I,"projectionMatrix",E.projectionMatrix),At.setValue(I,"viewMatrix",E.matrixWorldInverse);const Tn=At.map.cameraPosition;Tn!==void 0&&Tn.setValue(I,fe.setFromMatrixPosition(E.matrixWorld)),it.logarithmicDepthBuffer&&At.setValue(I,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&At.setValue(I,"isOrthographic",E.isOrthographicCamera===!0),w!==E&&(w=E,pn=!0,pc=!0)}if(k.isSkinnedMesh){At.setOptional(I,k,"bindMatrix"),At.setOptional(I,k,"bindMatrixInverse");const Tn=k.skeleton;Tn&&(Tn.boneTexture===null&&Tn.computeBoneTexture(),At.setValue(I,"boneTexture",Tn.boneTexture,Ie))}k.isBatchedMesh&&(At.setOptional(I,k,"batchingTexture"),At.setValue(I,"batchingTexture",k._matricesTexture,Ie),At.setOptional(I,k,"batchingIdTexture"),At.setValue(I,"batchingIdTexture",k._indirectTexture,Ie),At.setOptional(I,k,"batchingColorTexture"),k._colorsTexture!==null&&At.setValue(I,"batchingColorTexture",k._colorsTexture,Ie));const mc=B.morphAttributes;if((mc.position!==void 0||mc.normal!==void 0||mc.color!==void 0)&&We.update(k,B,zn),(pn||ye.receiveShadow!==k.receiveShadow)&&(ye.receiveShadow=k.receiveShadow,At.setValue(I,"receiveShadow",k.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Pi.envMap.value=xe,Pi.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&z.environment!==null&&(Pi.envMapIntensity.value=z.environmentIntensity),pn&&(At.setValue(I,"toneMappingExposure",v.toneMappingExposure),ye.needsLights&&bv(Pi,pc),oe&&V.fog===!0&&Ee.refreshFogUniforms(Pi,oe),Ee.refreshMaterialUniforms(Pi,V,q,W,m.state.transmissionRenderTarget[E.id]),dl.upload(I,ad(ye),Pi,Ie)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(dl.upload(I,ad(ye),Pi,Ie),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&At.setValue(I,"center",k.center),At.setValue(I,"modelViewMatrix",k.modelViewMatrix),At.setValue(I,"normalMatrix",k.normalMatrix),At.setValue(I,"modelMatrix",k.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Tn=V.uniformsGroups;for(let gc=0,Lv=Tn.length;gc<Lv;gc++){const cd=Tn[gc];dt.update(cd,zn),dt.bind(cd,zn)}}return zn}function bv(E,z){E.ambientLightColor.needsUpdate=z,E.lightProbe.needsUpdate=z,E.directionalLights.needsUpdate=z,E.directionalLightShadows.needsUpdate=z,E.pointLights.needsUpdate=z,E.pointLightShadows.needsUpdate=z,E.spotLights.needsUpdate=z,E.spotLightShadows.needsUpdate=z,E.rectAreaLights.needsUpdate=z,E.hemisphereLights.needsUpdate=z}function Pv(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(E,z,B){Pe.get(E.texture).__webglTexture=z,Pe.get(E.depthTexture).__webglTexture=B;const V=Pe.get(E);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=B===void 0,V.__autoAllocateDepthBuffer||et.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,z){const B=Pe.get(E);B.__webglFramebuffer=z,B.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(E,z=0,B=0){T=E,b=z,A=B;let V=!0,k=null,oe=!1,de=!1;if(E){const xe=Pe.get(E);xe.__useDefaultFramebuffer!==void 0?(Se.bindFramebuffer(I.FRAMEBUFFER,null),V=!1):xe.__webglFramebuffer===void 0?Ie.setupRenderTarget(E):xe.__hasExternalTextures&&Ie.rebindTextures(E,Pe.get(E.texture).__webglTexture,Pe.get(E.depthTexture).__webglTexture);const Ce=E.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(de=!0);const Re=Pe.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Re[z])?k=Re[z][B]:k=Re[z],oe=!0):E.samples>0&&Ie.useMultisampledRTT(E)===!1?k=Pe.get(E).__webglMultisampledFramebuffer:Array.isArray(Re)?k=Re[B]:k=Re,y.copy(E.viewport),D.copy(E.scissor),H=E.scissorTest}else y.copy(J).multiplyScalar(q).floor(),D.copy(ae).multiplyScalar(q).floor(),H=Me;if(Se.bindFramebuffer(I.FRAMEBUFFER,k)&&V&&Se.drawBuffers(E,k),Se.viewport(y),Se.scissor(D),Se.setScissorTest(H),oe){const xe=Pe.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+z,xe.__webglTexture,B)}else if(de){const xe=Pe.get(E.texture),Ce=z||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,xe.__webglTexture,B||0,Ce)}L=-1},this.readRenderTargetPixels=function(E,z,B,V,k,oe,de){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=Pe.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&de!==void 0&&(_e=_e[de]),_e){Se.bindFramebuffer(I.FRAMEBUFFER,_e);try{const xe=E.texture,Ce=xe.format,Re=xe.type;if(!it.textureFormatReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=E.width-V&&B>=0&&B<=E.height-k&&I.readPixels(z,B,V,k,Le.convert(Ce),Le.convert(Re),oe)}finally{const xe=T!==null?Pe.get(T).__webglFramebuffer:null;Se.bindFramebuffer(I.FRAMEBUFFER,xe)}}},this.readRenderTargetPixelsAsync=async function(E,z,B,V,k,oe,de){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=Pe.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&de!==void 0&&(_e=_e[de]),_e){Se.bindFramebuffer(I.FRAMEBUFFER,_e);try{const xe=E.texture,Ce=xe.format,Re=xe.type;if(!it.textureFormatReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=E.width-V&&B>=0&&B<=E.height-k){const we=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,we),I.bufferData(I.PIXEL_PACK_BUFFER,oe.byteLength,I.STREAM_READ),I.readPixels(z,B,V,k,Le.convert(Ce),Le.convert(Re),0),I.flush();const Ke=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);await gM(I,Ke,4);try{I.bindBuffer(I.PIXEL_PACK_BUFFER,we),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,oe)}finally{I.deleteBuffer(we),I.deleteSync(Ke)}return oe}}finally{const xe=T!==null?Pe.get(T).__webglFramebuffer:null;Se.bindFramebuffer(I.FRAMEBUFFER,xe)}}},this.copyFramebufferToTexture=function(E,z=null,B=0){E.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,E=arguments[1]);const V=Math.pow(2,-B),k=Math.floor(E.image.width*V),oe=Math.floor(E.image.height*V),de=z!==null?z.x:0,_e=z!==null?z.y:0;Ie.setTexture2D(E,0),I.copyTexSubImage2D(I.TEXTURE_2D,B,0,0,de,_e,k,oe),Se.unbindTexture()},this.copyTextureToTexture=function(E,z,B=null,V=null,k=0){E.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,E=arguments[1],z=arguments[2],k=arguments[3]||0,B=null);let oe,de,_e,xe,Ce,Re;B!==null?(oe=B.max.x-B.min.x,de=B.max.y-B.min.y,_e=B.min.x,xe=B.min.y):(oe=E.image.width,de=E.image.height,_e=0,xe=0),V!==null?(Ce=V.x,Re=V.y):(Ce=0,Re=0);const we=Le.convert(z.format),Ke=Le.convert(z.type);Ie.setTexture2D(z,0),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,z.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,z.unpackAlignment);const _t=I.getParameter(I.UNPACK_ROW_LENGTH),xt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),dn=I.getParameter(I.UNPACK_SKIP_PIXELS),Ze=I.getParameter(I.UNPACK_SKIP_ROWS),ye=I.getParameter(I.UNPACK_SKIP_IMAGES),Bt=E.isCompressedTexture?E.mipmaps[k]:E.image;I.pixelStorei(I.UNPACK_ROW_LENGTH,Bt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Bt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,_e),I.pixelStorei(I.UNPACK_SKIP_ROWS,xe),E.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,k,Ce,Re,oe,de,we,Ke,Bt.data):E.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,k,Ce,Re,Bt.width,Bt.height,we,Bt.data):I.texSubImage2D(I.TEXTURE_2D,k,Ce,Re,oe,de,we,Ke,Bt),I.pixelStorei(I.UNPACK_ROW_LENGTH,_t),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,xt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,dn),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ze),I.pixelStorei(I.UNPACK_SKIP_IMAGES,ye),k===0&&z.generateMipmaps&&I.generateMipmap(I.TEXTURE_2D),Se.unbindTexture()},this.copyTextureToTexture3D=function(E,z,B=null,V=null,k=0){E.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,V=arguments[1]||null,E=arguments[2],z=arguments[3],k=arguments[4]||0);let oe,de,_e,xe,Ce,Re,we,Ke,_t;const xt=E.isCompressedTexture?E.mipmaps[k]:E.image;B!==null?(oe=B.max.x-B.min.x,de=B.max.y-B.min.y,_e=B.max.z-B.min.z,xe=B.min.x,Ce=B.min.y,Re=B.min.z):(oe=xt.width,de=xt.height,_e=xt.depth,xe=0,Ce=0,Re=0),V!==null?(we=V.x,Ke=V.y,_t=V.z):(we=0,Ke=0,_t=0);const dn=Le.convert(z.format),Ze=Le.convert(z.type);let ye;if(z.isData3DTexture)Ie.setTexture3D(z,0),ye=I.TEXTURE_3D;else if(z.isDataArrayTexture||z.isCompressedArrayTexture)Ie.setTexture2DArray(z,0),ye=I.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,z.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,z.unpackAlignment);const Bt=I.getParameter(I.UNPACK_ROW_LENGTH),Qe=I.getParameter(I.UNPACK_IMAGE_HEIGHT),zn=I.getParameter(I.UNPACK_SKIP_PIXELS),Br=I.getParameter(I.UNPACK_SKIP_ROWS),pn=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,xt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,xt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,xe),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ce),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Re),E.isDataTexture||E.isData3DTexture?I.texSubImage3D(ye,k,we,Ke,_t,oe,de,_e,dn,Ze,xt.data):z.isCompressedArrayTexture?I.compressedTexSubImage3D(ye,k,we,Ke,_t,oe,de,_e,dn,xt.data):I.texSubImage3D(ye,k,we,Ke,_t,oe,de,_e,dn,Ze,xt),I.pixelStorei(I.UNPACK_ROW_LENGTH,Bt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Qe),I.pixelStorei(I.UNPACK_SKIP_PIXELS,zn),I.pixelStorei(I.UNPACK_SKIP_ROWS,Br),I.pixelStorei(I.UNPACK_SKIP_IMAGES,pn),k===0&&z.generateMipmaps&&I.generateMipmap(ye),Se.unbindTexture()},this.initRenderTarget=function(E){Pe.get(E).__webglFramebuffer===void 0&&Ie.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Ie.setTextureCube(E,0):E.isData3DTexture?Ie.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Ie.setTexture2DArray(E,0):Ie.setTexture2D(E,0),Se.unbindTexture()},this.resetState=function(){b=0,A=0,T=null,Se.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===$f?"display-p3":"srgb",t.unpackColorSpace=tt.workingColorSpace===cc?"display-p3":"srgb"}}class ed{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Xe(e),this.near=t,this.far=i}clone(){return new ed(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class AT extends kt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new li,this.environmentIntensity=1,this.environmentRotation=new li,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Ev extends sn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class td extends Kn{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],p=[];let _=0;const x=[],m=i/2;let f=0;g(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new Dt(h,3)),this.setAttribute("normal",new Dt(d,3)),this.setAttribute("uv",new Dt(p,2));function g(){const M=new F,b=new F;let A=0;const T=(t-e)/i;for(let L=0;L<=s;L++){const w=[],y=L/s,D=y*(t-e)+e;for(let H=0;H<=r;H++){const C=H/r,X=C*l+a,Y=Math.sin(X),W=Math.cos(X);b.x=D*Y,b.y=-y*i+m,b.z=D*W,h.push(b.x,b.y,b.z),M.set(Y,T,W).normalize(),d.push(M.x,M.y,M.z),p.push(C,1-y),w.push(_++)}x.push(w)}for(let L=0;L<r;L++)for(let w=0;w<s;w++){const y=x[w][L],D=x[w+1][L],H=x[w+1][L+1],C=x[w][L+1];u.push(y,D,C),u.push(D,H,C),A+=6}c.addGroup(f,A,0),f+=A}function v(M){const b=_,A=new Ge,T=new F;let L=0;const w=M===!0?e:t,y=M===!0?1:-1;for(let H=1;H<=r;H++)h.push(0,m*y,0),d.push(0,y,0),p.push(.5,.5),_++;const D=_;for(let H=0;H<=r;H++){const X=H/r*l+a,Y=Math.cos(X),W=Math.sin(X);T.x=w*W,T.y=m*y,T.z=w*Y,h.push(T.x,T.y,T.z),d.push(0,y,0),A.x=Y*.5+.5,A.y=W*.5*y+.5,p.push(A.x,A.y),_++}for(let H=0;H<r;H++){const C=b+H,X=D+H;M===!0?u.push(X,X+1,C):u.push(X+1,X,C),L+=3}c.addGroup(f,L,M===!0?1:2),f+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new td(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Wi extends Kn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new F,d=new F,p=[],_=[],x=[],m=[];for(let f=0;f<=i;f++){const g=[],v=f/i;let M=0;f===0&&o===0?M=.5/t:f===i&&l===Math.PI&&(M=-.5/t);for(let b=0;b<=t;b++){const A=b/t;h.x=-e*Math.cos(r+A*s)*Math.sin(o+v*a),h.y=e*Math.cos(o+v*a),h.z=e*Math.sin(r+A*s)*Math.sin(o+v*a),_.push(h.x,h.y,h.z),d.copy(h).normalize(),x.push(d.x,d.y,d.z),m.push(A+M,1-v),g.push(c++)}u.push(g)}for(let f=0;f<i;f++)for(let g=0;g<t;g++){const v=u[f][g+1],M=u[f][g],b=u[f+1][g],A=u[f+1][g+1];(f!==0||o>0)&&p.push(v,M,A),(f!==i-1||l<Math.PI)&&p.push(M,b,A)}this.setIndex(p),this.setAttribute("position",new Dt(_,3)),this.setAttribute("normal",new Dt(x,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wi(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class nd extends Kn{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],l=[],c=[],u=new F,h=new F,d=new F;for(let p=0;p<=i;p++)for(let _=0;_<=r;_++){const x=_/r*s,m=p/i*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(x),h.y=(e+t*Math.cos(m))*Math.sin(x),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(_/r),c.push(p/i)}for(let p=1;p<=i;p++)for(let _=1;_<=r;_++){const x=(r+1)*p+_-1,m=(r+1)*(p-1)+_-1,f=(r+1)*(p-1)+_,g=(r+1)*p+_;o.push(x,m,g),o.push(m,f,g)}this.setIndex(o),this.setAttribute("position",new Dt(a,3)),this.setAttribute("normal",new Dt(l,3)),this.setAttribute("uv",new Dt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nd(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Pn extends ra{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=iv,this.normalScale=new Ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.combine=Vf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class hc extends kt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class CT extends hc{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const mu=new Mt,mm=new F,gm=new F;class wv{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ge(512,512),this.map=null,this.mapPass=null,this.matrix=new Mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Qf,this._frameExtents=new Ge(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;mm.setFromMatrixPosition(e.matrixWorld),t.position.copy(mm),gm.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(gm),t.updateMatrixWorld(),mu.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(mu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const vm=new Mt,ho=new F,gu=new F;class RT extends wv{constructor(){super(new xn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ge(4,2),this._viewportCount=6,this._viewports=[new lt(2,1,1,1),new lt(0,1,1,1),new lt(3,1,1,1),new lt(1,1,1,1),new lt(3,0,1,1),new lt(1,0,1,1)],this._cubeDirections=[new F(1,0,0),new F(-1,0,0),new F(0,0,1),new F(0,0,-1),new F(0,1,0),new F(0,-1,0)],this._cubeUps=[new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,0,1),new F(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),ho.setFromMatrixPosition(e.matrixWorld),i.position.copy(ho),gu.copy(i.position),gu.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(gu),i.updateMatrixWorld(),r.makeTranslation(-ho.x,-ho.y,-ho.z),vm.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vm)}}class Tv extends hc{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new RT}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class bT extends wv{constructor(){super(new vv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class PT extends hc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.target=new kt,this.shadow=new bT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class LT extends hc{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hf);const _m=[{name:"T Spawner",x1:-8,z1:44,x2:32,z2:76,zone:"T"},{name:"Long Doors",x1:26,z1:32,x2:46,z2:52},{name:"Outside Mid",x1:-26,z1:18,x2:8,z2:46},{name:"Top Mid",x1:-6,z1:-2,x2:10,z2:22},{name:"Upper Tunnels",x1:-52,z1:6,x2:-20,z2:24,ceiling:4.2},{name:"Tunnel Link",x1:-26,z1:20,x2:-12,z2:42,ceiling:4.2},{name:"CT Mid",x1:-6,z1:-36,x2:10,z2:-2,ceiling:6},{name:"CT Mid Link",x1:-6,z1:-44,x2:10,z2:-30},{name:"Catwalk Ramp",x1:10,z1:4,x2:20,z2:16,h:0,h2:1.6,ramp:{axis:"x",from:10,to:20}},{name:"Catwalk",x1:20,z1:2,x2:28,z2:16,h:1.6},{name:"A Short",x1:28,z1:-18,x2:42,z2:12,h:2},{name:"Long A",x1:40,z1:-6,x2:58,z2:44},{name:"Long Corner",x1:32,z1:6,x2:42,z2:20},{name:"A Long Ramp",x1:48,z1:-16,x2:58,z2:-6,h:2,h2:0,ramp:{axis:"z",from:-16,to:-6}},{name:"A Site",x1:30,z1:-54,x2:62,z2:-16,h:2,zone:"A"},{name:"CT Ramp",x1:16,z1:-50,x2:30,z2:-40,h:0,h2:2,ramp:{axis:"x",from:16,to:30}},{name:"CT Spawner",x1:-16,z1:-78,x2:16,z2:-40,zone:"CT"},{name:"B Tunnels",x1:-52,z1:-8,x2:-34,z2:10,ceiling:4.2},{name:"B Tunnel Ramp",x1:-60,z1:-24,x2:-42,z2:-8,h:0,h2:1.5,ramp:{axis:"z",from:-8,to:-24},ceiling:4.2},{name:"B Site",x1:-66,z1:-60,x2:-34,z2:-24,h:1.5,zone:"B"},{name:"B Doors",x1:-34,z1:-64,x2:-16,z2:-50,h:1.5,h2:0,ramp:{axis:"x",from:-34,to:-16},ceiling:4.4}],xm=[{name:"mid_doors_l",x1:-6,z1:-4.4,x2:-4,z2:-2,h:4.6},{name:"mid_doors_c",x1:-1,z1:-4.4,x2:.5,z2:-2,h:4.6},{name:"mid_doors_r",x1:3.5,z1:-4.4,x2:10,z2:-2,h:4.6},{name:"b_doors_l",x1:-28,z1:-64,x2:-25,z2:-59.5,h:4.4},{name:"b_doors_c",x1:-28,z1:-56.5,x2:-25,z2:-55,h:4.4},{name:"b_doors_r",x1:-28,z1:-52,x2:-25,z2:-50,h:4.4},{name:"long_doors_l",x1:26,z1:40,x2:33.4,z2:42.6,h:4.6},{name:"long_doors_r",x1:36.6,z1:40,x2:46,z2:42.6,h:4.6}],ym=[{x:1.5,z:12.5,w:4,d:4,h:2,kind:"xbox"},{x:-4.5,z:18.5,w:2.6,d:2.6,h:1},{x:20,z:60,w:3,d:3,h:1},{x:6,z:70,w:3.4,d:3.4,h:2},{x:44,z:47,w:3,d:3,h:1},{x:43,z:32,w:3,d:3,h:1},{x:36,z:14,w:3,d:3,h:1},{x:55,z:38,w:2.8,d:2.8,h:1},{x:52,z:34,w:2.8,d:2.8,h:1},{x:55.5,z:-2,w:2.2,d:2.2,h:1.3,kind:"barrel"},{x:55.6,z:.6,w:2.2,d:2.2,h:1.3,kind:"barrel"},{x:42,z:-36,w:5,d:5,h:2},{x:42,z:-30.6,w:5,d:3.6,h:1},{x:34,z:-50,w:3,d:3,h:1},{x:34,z:-46.6,w:3,d:2.6,h:2},{x:57,z:-24,w:3.4,d:3.4,h:1},{x:47,z:-20,w:3,d:3,h:1},{x:38,z:4,w:3,d:3,h:1},{x:25,z:13.5,w:2.4,d:2.4,h:1},{x:-6,z:-70,w:3,d:3,h:1},{x:12,z:-50,w:3.2,d:3.2,h:1},{x:12,z:-46.4,w:3.2,d:3.2,h:2},{x:8,z:-20,w:2.8,d:2.8,h:1},{x:-52,z:-42,w:6,d:6,h:2},{x:-52,z:-35.5,w:6,d:4,h:1},{x:-62,z:-54,w:3,d:3,h:1},{x:-38,z:-28,w:3.2,d:3.2,h:1},{x:-58,z:-28,w:3,d:3,h:1},{x:-48,z:6,w:3,d:3,h:1},{x:-38,z:-14,w:2.8,d:2.8,h:1}],Ms={x1:30,z1:-54,x2:62,z2:-16,cx:45,cz:-34,name:"A"},Ss={x1:-66,z1:-60,x2:-34,z2:-24,cx:-50,cz:-42,name:"B"};function vu(n,e){return n>=Ms.x1&&n<=Ms.x2&&e>=Ms.z1&&e<=Ms.z2?"A":n>=Ss.x1&&n<=Ss.x2&&e>=Ss.z1&&e<=Ss.z2?"B":null}const bo={t_spawn_1:{name:"T Spawn",x:0,z:66},t_spawn_2:{name:"T Spawn",x:14,z:60},t_spawn_3:{name:"T Spawn",x:22,z:70},t_spawn_4:{name:"T Spawn",x:-4,z:58},ct_spawn_1:{name:"CT Spawn",x:0,z:-70},ct_spawn_2:{name:"CT Spawn",x:-10,z:-62},ct_spawn_3:{name:"CT Spawn",x:8,z:-60},ct_spawn_4:{name:"CT Spawn",x:-2,z:-52},a_plant:{name:"A Site",x:44,z:-43},a_plant_2:{name:"A Site",x:50,z:-26},a_hold_1:{name:"A Site",x:56,z:-46},a_hold_2:{name:"A Site",x:33,z:-24},a_hold_3:{name:"A Site",x:44,z:-22},a_cross:{name:"A Cross",x:53,z:-10},long_hall:{name:"Long A",x:50,z:30},long_doors:{name:"Long Doors",x:34,z:44},long_corner:{name:"Long Corner",x:44,z:12},pit:{name:"Pit",x:34,z:18},top_mid:{name:"Top Mid",x:2,z:18},mid_doors:{name:"Mid Doors",x:1,z:-6},ct_mid:{name:"CT Mid",x:2,z:-18},mid_ct_hold:{name:"CT Mid",x:4,z:-30},xbox:{name:"Xbox",x:0,z:16},catwalk:{name:"Catwalk",x:24,z:9},short:{name:"A Short",x:34,z:-4},short_hold:{name:"A Short",x:32,z:-12},b_plant:{name:"B Site",x:-46,z:-42},b_plant_2:{name:"B Site",x:-44,z:-30},b_hold_1:{name:"B Site",x:-62,z:-30},b_hold_2:{name:"B Site",x:-60,z:-48},b_hold_3:{name:"B Site",x:-38,z:-40},b_doors:{name:"B Doors",x:-22,z:-56},b_tunnels:{name:"B Tunnels",x:-43,z:0},b_tunnel_mouth:{name:"B Site",x:-50,z:-20},upper_tunnels:{name:"Upper Tunnels",x:-36,z:15}},qt=1.5,ei=6.5,ki=.55,Po=.42;class DT{constructor(e){P(this,"ids",[]);P(this,"cost");this.cost=new Float64Array(e)}clear(){this.ids.length=0}get size(){return this.ids.length}push(e,t){this.cost[e]=t;const i=this.ids;i.push(e);let r=i.length-1;for(;r>0;){const s=r-1>>1;if(this.cost[i[s]]<=this.cost[i[r]])break;const o=i[s];i[s]=i[r],i[r]=o,r=s}}pop(){const e=this.ids,t=e[0],i=e.pop();if(e.length>0){e[0]=i;let r=0;for(;;){const s=r*2+1,o=s+1;let a=r;if(s<e.length&&this.cost[e[s]]<this.cost[e[a]]&&(a=s),o<e.length&&this.cost[e[o]]<this.cost[e[a]]&&(a=o),a===r)break;const l=e[a];e[a]=e[r],e[r]=l,r=a}}return t}}class IT{constructor(){P(this,"minX");P(this,"minZ");P(this,"gx");P(this,"gz");P(this,"height");P(this,"solid");P(this,"zone");P(this,"crateCell");P(this,"rectOf");P(this,"rectNames",[]);P(this,"colliders",[]);P(this,"wallBoxes",[]);P(this,"floorBoxes",[]);P(this,"crateBoxes",[]);P(this,"crates",[]);P(this,"ceilings",[]);P(this,"cameFrom");P(this,"gScore");P(this,"closed");P(this,"openHeap");P(this,"openStamp");P(this,"stamp",1);let e=1/0,t=-1/0,i=1/0,r=-1/0;const s=(a,l,c,u)=>{e=Math.min(e,a),t=Math.max(t,c),i=Math.min(i,l),r=Math.max(r,u)};for(const a of _m)s(a.x1,a.z1,a.x2,a.z2);for(const a of xm)s(a.x1,a.z1,a.x2,a.z2);for(const a of ym)s(a.x-a.w,a.z-a.d,a.x+a.w,a.z+a.d);e-=10,t+=10,i-=10,r+=10,this.minX=e,this.minZ=i,this.gx=Math.ceil((t-e)/qt),this.gz=Math.ceil((r-i)/qt);const o=this.gx*this.gz;this.height=new Float32Array(o),this.solid=new Uint8Array(o).fill(1),this.zone=new Uint8Array(o),this.crateCell=new Uint8Array(o),this.rectOf=new Int16Array(o).fill(-1),this.cameFrom=new Int32Array(o),this.gScore=new Float32Array(o),this.closed=new Uint8Array(o),this.openStamp=new Int32Array(o),this.openHeap=new DT(o);for(const a of _m)this.stampRect(a);for(const a of xm)this.stampWall(a);for(const a of ym)this.stampCrate(a);for(let a=0;a<o;a++)this.solid[a]&&(this.height[a]=Math.max(this.height[a],ei));this.buildGeometry()}rectHeight(e,t,i){if(e.ramp){const s=e.ramp.axis==="x"?t:i,o=e.ramp.to-e.ramp.from,a=o===0?0:(s-e.ramp.from)/o,l=e.h??0,c=e.h2??l;return l+(c-l)*Math.max(0,Math.min(1,a))}return e.h??0}stampRect(e){const t=this.rectNames.push(e.name)-1,i=e.zone==="A"?1:e.zone==="B"?2:e.zone==="T"?3:e.zone==="CT"?4:0,r=this.cellX(e.x1),s=this.cellX(e.x2-.01),o=this.cellZ(e.z1),a=this.cellZ(e.z2-.01);for(let l=o;l<=a;l++)for(let c=r;c<=s;c++){if(c<0||l<0||c>=this.gx||l>=this.gz)continue;const u=l*this.gx+c;this.solid[u]=0;const h=this.cellCenter(c,l);this.height[u]=this.rectHeight(e,h.x,h.z),this.rectOf[u]=t,i&&(this.zone[u]=i)}e.ceiling&&this.ceilings.push({x1:e.x1,z1:e.z1,x2:e.x2,z2:e.z2,h:e.ceiling})}stampWall(e){const t=e.h??ei,i=this.cellX(e.x1),r=this.cellX(e.x2-.01),s=this.cellZ(e.z1),o=this.cellZ(e.z2-.01);for(let a=s;a<=o;a++)for(let l=i;l<=r;l++){if(l<0||a<0||l>=this.gx||a>=this.gz)continue;const c=a*this.gx+l;this.solid[c]=1,this.height[c]=t}}stampCrate(e){const t=this.cellX(e.x-e.w/2),i=this.cellX(e.x+e.w/2-.01),r=this.cellZ(e.z-e.d/2),s=this.cellZ(e.z+e.d/2-.01);let o=0;for(let l=r;l<=s;l++)for(let c=t;c<=i;c++){if(c<0||l<0||c>=this.gx||l>=this.gz)continue;const u=l*this.gx+c;this.solid[u]||(o=Math.max(o,this.height[u]))}const a=o+e.h;for(let l=r;l<=s;l++)for(let c=t;c<=i;c++){if(c<0||l<0||c>=this.gx||l>=this.gz)continue;const u=l*this.gx+c;this.solid[u]||(this.height[u]=Math.max(this.height[u],a),this.crateCell[u]=1)}this.crates.push(e),this.crateBoxes.push({x1:e.x-e.w/2,z1:e.z-e.d/2,x2:e.x+e.w/2,z2:e.z+e.d/2,h:e.h})}buildGeometry(){const{gx:e,gz:t}=this,i=o=>Math.round(o*4)/4,r=new Uint8Array(e*t);for(let o=0;o<t;o++)for(let a=0;a<e;a++){const l=o*e+a;if(this.solid[l]||r[l])continue;const c=i(this.height[l]);let u=1;for(;a+u<e;){const p=o*e+a+u;if(this.solid[p]||r[p]||i(this.height[p])!==c)break;u++}let h=1;e:for(;o+h<t;){for(let p=0;p<u;p++){const _=(o+h)*e+a+p;if(this.solid[_]||r[_]||i(this.height[_])!==c)break e}h++}for(let p=0;p<h;p++)for(let _=0;_<u;_++)r[(o+p)*e+a+_]=1;const d={x1:this.minX+a*qt,z1:this.minZ+o*qt,x2:this.minX+(a+u)*qt,z2:this.minZ+(o+h)*qt,h:c};this.floorBoxes.push(d),c>.3&&this.colliders.push({x1:d.x1,y1:-2,z1:d.z1,x2:d.x2,y2:c,z2:d.z2})}const s=new Uint8Array(e*t);for(let o=0;o<t;o++)for(let a=0;a<e;a++){const l=o*e+a;if(!this.solid[l]||s[l])continue;let c=1;for(;a+c<e&&this.solid[o*e+a+c]&&!s[o*e+a+c];)c++;let u=1;e:for(;o+u<t;){for(let d=0;d<c;d++){const p=(o+u)*e+a+d;if(!this.solid[p]||s[p])break e}u++}for(let d=0;d<u;d++)for(let p=0;p<c;p++)s[(o+d)*e+a+p]=1;const h={x1:this.minX+a*qt,z1:this.minZ+o*qt,x2:this.minX+(a+c)*qt,z2:this.minZ+(o+u)*qt,h:ei};this.wallBoxes.push(h),this.colliders.push({x1:h.x1,y1:0,z1:h.z1,x2:h.x2,y2:ei,z2:h.z2})}for(const o of this.crateBoxes){const a=this.groundBaseAt((o.x1+o.x2)/2,(o.z1+o.z2)/2);this.colliders.push({x1:o.x1,y1:a-.05,z1:o.z1,x2:o.x2,y2:a+o.h,z2:o.z2})}}cellX(e){return Math.floor((e-this.minX)/qt)}cellZ(e){return Math.floor((e-this.minZ)/qt)}cellCenterX(e){return this.minX+(e+.5)*qt}cellCenterZ(e){return this.minZ+(e+.5)*qt}cellCenter(e,t){return{x:this.cellCenterX(e),z:this.cellCenterZ(t)}}idx(e,t){return t*this.gx+e}inBounds(e,t){return e>=0&&t>=0&&e<this.gx&&t<this.gz}heightAt(e,t){const i=this.cellX(e),r=this.cellZ(t);return this.inBounds(i,r)?this.height[r*this.gx+i]:ei}isSolidAt(e,t){const i=this.cellX(e),r=this.cellZ(t);return this.inBounds(i,r)?this.solid[r*this.gx+i]===1:!0}groundBaseAt(e,t){const i=this.cellX(e),r=this.cellZ(t);if(!this.inBounds(i,r))return 0;const s=r*this.gx+i;return this.solid[s]?0:this.height[s]}zoneAt(e,t){const i=this.cellX(e),r=this.cellZ(t);if(!this.inBounds(i,r))return null;const s=this.zone[r*this.gx+i];return s===1?"A":s===2?"B":s===3?"T":s===4?"CT":null}fits(e,t,i,r=Po){const s=this.cellX(e-r),o=this.cellX(e+r),a=this.cellZ(t-r),l=this.cellZ(t+r);for(let c=a;c<=l;c++)for(let u=s;u<=o;u++)if(!this.inBounds(u,c)||this.height[c*this.gx+u]>i+ki)return!1;return!0}supportHeight(e,t,i,r=Po){const s=this.cellX(e-r),o=this.cellX(e+r),a=this.cellZ(t-r),l=this.cellZ(t+r);let c=-100;for(let u=a;u<=l;u++)for(let h=s;h<=o;h++){if(!this.inBounds(h,u))continue;const d=this.height[u*this.gx+h];d<=i+ki&&d>c&&(c=d)}return c===-100?ei:c}clampMove(e,t,i,r,s,o=Po){let a=e,l=t;return r!==0&&this.fits(e+r,l,i,o)&&(a=e+r),s!==0&&this.fits(a,t+s,i,o)&&(l=t+s),{x:a,z:l}}losClear(e,t,i,r,s,o){const a=r-e,l=o-i,c=Math.hypot(a,l);if(c<.001)return!0;const u=Math.ceil(c/(qt*.5));for(let h=1;h<u;h++){const d=h/u,p=e+a*d,_=i+l*d,x=t+(s-t)*d,m=this.cellX(p),f=this.cellZ(_);if(!this.inBounds(m,f)||this.height[f*this.gx+m]>x+.2)return!1}return!0}walkableLine(e,t,i,r){const s=this.heightAt(e,t),o=this.heightAt(i,r);if(s>=ei||o>=ei)return!1;const a=Math.hypot(i-e,r-t),l=Math.ceil(a/(qt*.5));for(let c=0;c<=l;c++){const u=c/Math.max(1,l),h=e+(i-e)*u,d=t+(r-t)*u,p=this.heightAt(h,d);if(p>=ei||p>Math.max(s,o)+ki||p<Math.min(s,o)-ki)return!1}return!0}findPath(e,t){const i=this.cellX(e.x),r=this.cellZ(e.z);let s=this.cellX(t.x),o=this.cellZ(t.z);if(!this.inBounds(i,r)||!this.inBounds(s,o))return null;if(this.solid[o*this.gx+s]){const g=this.nearestOpenCell(s,o);if(!g)return null;s=g.cx,o=g.cz}if(this.solid[r*this.gx+i]){const g=this.nearestOpenCell(i,r);return g?this.findPath(this.cellCenter(g.cx,g.cz),t):null}const a=r*this.gx+i,l=o*this.gx+s;if(a===l)return[{x:t.x,z:t.z}];this.stamp++;const{gx:c,gz:u,height:h,solid:d}=this,p=this.openHeap;p.clear(),this.gScore[a]=0,this.cameFrom[a]=-1,this.openStamp[a]=this.stamp,this.closed[a]=0,p.push(a,this.heuristic(i,r,s,o));let _=!1,x=0;for(;p.size>0&&x++<6e4;){const g=p.pop();if(g===l){_=!0;break}if(this.openStamp[g]===this.stamp&&this.closed[g])continue;this.closed[g]=1;const v=g%c,M=(g-v)/c,b=h[g];for(let A=-1;A<=1;A++)for(let T=-1;T<=1;T++){if(T===0&&A===0)continue;const L=v+T,w=M+A;if(L<0||w<0||L>=c||w>=u)continue;const y=w*c+L;if(d[y])continue;const D=h[y];if(Math.abs(D-b)>ki||T!==0&&A!==0&&(d[M*c+L]||d[w*c+v]||Math.abs(h[M*c+L]-b)>ki||Math.abs(h[w*c+v]-b)>ki))continue;const H=T!==0&&A!==0?1.4142:1,C=this.gScore[g]+H;(this.openStamp[y]!==this.stamp||C<this.gScore[y])&&(this.openStamp[y]=this.stamp,this.closed[y]=0,this.gScore[y]=C,this.cameFrom[y]=g,p.push(y,C+this.heuristic(L,w,s,o)))}}if(!_)return null;const m=[];let f=l;for(;f!==-1;){const g=f%c,v=(f-g)/c;m.push(this.cellCenter(g,v)),f=this.cameFrom[f]}return m.reverse(),m.push({x:t.x,z:t.z}),this.smooth(m)}heuristic(e,t,i,r){const s=Math.abs(e-i),o=Math.abs(t-r);return s+o+(1.4142-2)*Math.min(s,o)}nearestOpenCell(e,t){for(let i=1;i<24;i++)for(let r=-i;r<=i;r++)for(let s=-i;s<=i;s++){if(Math.max(Math.abs(s),Math.abs(r))!==i)continue;const o=e+s,a=t+r;if(!(o<0||a<0||o>=this.gx||a>=this.gz)&&!this.solid[a*this.gx+o])return{cx:o,cz:a}}return null}smooth(e){if(e.length<=2)return e;const t=[e[0]];let i=0;for(;i<e.length-1;){let r=e.length-1;for(;r>i+1&&!this.walkableLine(e[i].x,e[i].z,e[r].x,e[r].z);r--);t.push(e[r]),i=r}return t}randomOpenPoint(e,t,i){for(let r=0;r<40;r++){const s=Math.random()*Math.PI*2,o=Math.sqrt(Math.random())*i,a=e+Math.cos(s)*o,l=t+Math.sin(s)*o;if(!this.isSolidAt(a,l)&&this.heightAt(a,l)<2.2)return{x:a,z:l}}return null}ascii(e=2){const t=[],i="    "+Array.from({length:this.gx},(r,s)=>s%10===0?"|":" ").join("");t.push(i);for(let r=0;r<this.gz;r+=e){let s="";for(let o=0;o<this.gx;o+=e){let a=0,l=0,c=0,u=0;for(let h=0;h<e;h++)for(let d=0;d<e;d++){const p=(r+h)*this.gx+(o+d);r+h>=this.gz||o+d>=this.gx||(this.solid[p]?a++:(c++,this.height[p]>.3&&l++),(this.zone[p]===1||this.zone[p]===2)&&u++)}a===e*e||c===0?s+="#":l>0?s+=u>0?this.zone[r*this.gx+o]===1?"A":"B":"^":u>0?s+=this.zone[r*this.gx+o]===1?"A":"B":s+="."}t.push(String(r).padStart(3)+" "+s)}return t.join(`
`)}}const ss={head:2,chest:1,stomach:1.25,arm:.9,leg:.75},_n={ak47:{id:"ak47",name:"AK-47",slot:"primary",team:"T",damage:36,fireMode:"auto",rpm:600,magSize:30,reserveAmmo:90,reloadTime:2.4,mult:ss,armorPen:.78,spreadBase:.0035,spreadMoving:.045,spreadJump:.09,spreadPerShot:.011,spreadMax:.075,spreadRecover:.09,recoilPitch:.033,recoilYaw:.011,recoilRecover:5.5,rangeMod:.985,moveSpeed:.92,sound:{thumpF0:150,thumpF1:55,thumpDur:.16,thumpGain:.85,noiseFreq:1900,noiseDur:.2,noiseGain:.75,tail:{f:120,dur:.28,gain:.3}},model:"rifle_t",killAward:300},m4a4:{id:"m4a4",name:"M4A4",slot:"primary",team:"CT",damage:33,fireMode:"auto",rpm:666,magSize:30,reserveAmmo:90,reloadTime:3,mult:ss,armorPen:.7,spreadBase:.003,spreadMoving:.04,spreadJump:.085,spreadPerShot:.0075,spreadMax:.06,spreadRecover:.11,recoilPitch:.019,recoilYaw:.007,recoilRecover:7,rangeMod:.985,moveSpeed:.94,sound:{thumpF0:190,thumpF1:70,thumpDur:.12,thumpGain:.7,noiseFreq:2600,noiseDur:.15,noiseGain:.62,tail:{f:160,dur:.2,gain:.22}},model:"rifle_ct",killAward:300},awp:{id:"awp",name:"AWP",slot:"primary",damage:115,fireMode:"bolt",rpm:41,magSize:10,reserveAmmo:30,reloadTime:3.6,mult:ss,armorPen:.97,spreadBase:6e-4,spreadMoving:.05,spreadJump:.12,spreadPerShot:.02,spreadMax:.1,spreadRecover:.12,recoilPitch:.055,recoilYaw:.006,recoilRecover:4,rangeMod:.995,moveSpeed:.84,scope:{fov:18,sensMult:.28},sound:{thumpF0:90,thumpF1:34,thumpDur:.34,thumpGain:1,noiseFreq:1100,noiseDur:.36,noiseGain:.9,tail:{f:60,dur:.7,gain:.5}},model:"awp",killAward:100},glock:{id:"glock",name:"Glock-18",slot:"secondary",team:"T",damage:28,fireMode:"semi",rpm:400,magSize:20,reserveAmmo:60,reloadTime:2.2,mult:ss,armorPen:.47,spreadBase:.005,spreadMoving:.03,spreadJump:.07,spreadPerShot:.009,spreadMax:.05,spreadRecover:.14,recoilPitch:.014,recoilYaw:.005,recoilRecover:9,rangeMod:.9,moveSpeed:1,sound:{thumpF0:210,thumpF1:80,thumpDur:.09,thumpGain:.55,noiseFreq:3e3,noiseDur:.1,noiseGain:.5},model:"pistol_t",killAward:300},usp:{id:"usp",name:"USP-S",slot:"secondary",team:"CT",damage:35,fireMode:"semi",rpm:352,magSize:12,reserveAmmo:60,reloadTime:2.2,mult:ss,armorPen:.5,spreadBase:.0045,spreadMoving:.028,spreadJump:.07,spreadPerShot:.008,spreadMax:.045,spreadRecover:.15,recoilPitch:.013,recoilYaw:.004,recoilRecover:9.5,rangeMod:.91,moveSpeed:1,sound:{thumpF0:190,thumpF1:75,thumpDur:.1,thumpGain:.5,noiseFreq:2400,noiseDur:.11,noiseGain:.42},model:"pistol_ct",killAward:300},deagle:{id:"deagle",name:"Desert Eagle",slot:"secondary",damage:63,fireMode:"semi",rpm:267,magSize:7,reserveAmmo:35,reloadTime:2.3,mult:ss,armorPen:.93,spreadBase:.004,spreadMoving:.05,spreadJump:.1,spreadPerShot:.02,spreadMax:.07,spreadRecover:.1,recoilPitch:.042,recoilYaw:.01,recoilRecover:6,rangeMod:.96,moveSpeed:.99,sound:{thumpF0:120,thumpF1:45,thumpDur:.22,thumpGain:.95,noiseFreq:1500,noiseDur:.22,noiseGain:.8,tail:{f:90,dur:.3,gain:.3}},model:"deagle",killAward:300},knife:{id:"knife",name:"Knife",slot:"melee",damage:55,fireMode:"melee",rpm:120,magSize:0,reserveAmmo:0,reloadTime:0,mult:{head:2,chest:1,stomach:1.25,arm:.9,leg:.75},armorPen:.85,spreadBase:0,spreadMoving:0,spreadJump:0,spreadPerShot:0,spreadMax:0,spreadRecover:1,recoilPitch:0,recoilYaw:0,recoilRecover:1,rangeMod:1,moveSpeed:1.08,melee:{range:1.9,rate:1.1},sound:{thumpF0:300,thumpF1:120,thumpDur:.08,thumpGain:.35,noiseFreq:4200,noiseDur:.12,noiseGain:.25},model:"knife",killAward:1500}};function Ya(n){const e=_n[n];return{id:n,mag:e.magSize,reserve:e.reserveAmmo}}function NT(n,e){return e<=1?{primary:null,secondary:n==="T"?"glock":"usp",armor:0,helmet:!1}:{primary:n==="T"?"ak47":"m4a4",secondary:n==="T"?"glock":"usp",armor:100,helmet:!0}}function UT(n,e,t){if(t<=0)return{hp:n,armorLeft:0,armorDamage:0};const i=n*e,r=(n-i)*.5,s=Math.max(0,t-r);return{hp:i,armorLeft:s,armorDamage:r}}const Mm=new Map;function zT(n,e,t){const i=`${n}|${e}|${t}`;let r=Mm.get(i);return r||(r=new Pt(n,e,t),Mm.set(i,r)),r}const FT={T:{skin:13279338,shirt:11570254,pants:8218693,boots:4208426,accent:11548714,vest:7298112,gear:3353892},CT:{skin:13673859,shirt:5202560,pants:3818585,boots:2237741,accent:3030364,vest:2568778,gear:1909292}};function rt(n,e={}){const t=new Pn({color:n});return e.emissive!==void 0&&(t.emissive=new Xe(e.emissive)),t}function Te(n,e,t,i,r,s=0,o=0,a=0){const l=new Je(zT(e,t,i),r);return l.position.set(s,o,a),l.castShadow=!0,l.receiveShadow=!1,n.add(l),l}const Sm=new Map;function kT(n){const e=Sm.get(n);if(e)return e.clone(!0);const t=new ht,i=rt(2237482),r=rt(4869461),s=rt(8015658),o=rt(4147770),a=rt(12173513),l=rt(1513500);switch(n){case"rifle_t":{Te(t,.07,.11,.72,i,0,0,.16),Te(t,.05,.05,.34,r,0,.005,.62),Te(t,.06,.1,.26,s,0,-.015,.44),Te(t,.07,.14,.26,s,0,-.05,-.14),Te(t,.05,.16,.09,i,0,-.12,.02),Te(t,.045,.12,.06,l,0,-.11,-.08),Te(t,.02,.05,.02,i,0,.075,-.02);break}case"rifle_ct":{Te(t,.07,.11,.66,i,0,0,.14),Te(t,.05,.05,.36,r,0,.005,.6),Te(t,.065,.065,.28,i,0,-.005,.42),Te(t,.06,.12,.22,i,0,-.04,-.16),Te(t,.05,.15,.08,l,0,-.12,.04),Te(t,.045,.11,.055,l,0,-.1,-.06),Te(t,.03,.045,.22,i,0,.085,.1);break}case"awp":{Te(t,.075,.12,.95,o,0,0,.22),Te(t,.05,.05,.5,i,0,.01,.85),Te(t,.07,.16,.3,o,0,-.05,-.2),Te(t,.05,.1,.26,o,0,-.09,.14),Te(t,.055,.055,.34,i,0,.11,.2),Te(t,.07,.07,.05,i,0,.11,.02),Te(t,.05,.13,.07,l,0,-.11,-.02);break}case"pistol_t":case"pistol_ct":{Te(t,.05,.09,.3,rt(n==="pistol_t"?2829875:3487807),0,0,.1),Te(t,.045,.13,.06,l,0,-.09,-.03),Te(t,.02,.03,.05,i,0,.05,.24);break}case"deagle":{Te(t,.055,.1,.34,r,0,.01,.1),Te(t,.05,.13,.06,l,0,-.1,-.02);break}case"knife":{Te(t,.035,.05,.3,a,0,.01,.2),Te(t,.03,.09,.12,l,0,-.01,-.02);break}default:Te(t,.06,.1,.5,i,0,0,.2)}return Sm.set(n,t),t.clone(!0)}class OT{constructor(e){P(this,"root",new ht);P(this,"body",new ht);P(this,"upper",new ht);P(this,"legL",new ht);P(this,"legR",new ht);P(this,"kneeL",new ht);P(this,"kneeR",new ht);P(this,"armL",new ht);P(this,"armR",new ht);P(this,"elbowL",new ht);P(this,"elbowR",new ht);P(this,"head",new ht);P(this,"gunMount",new ht);P(this,"gun",null);P(this,"gunModel","");P(this,"mats",[]);P(this,"palette");P(this,"team");this.team=e,this.palette=FT[e];const t=this.palette,i=rt(t.skin),r=rt(t.shirt),s=rt(t.pants),o=rt(t.boots),a=rt(t.accent),l=rt(t.vest),c=rt(t.gear);this.mats=[i,r,s,o,a,l,c],this.root.add(this.body),this.body.position.y=.92,this.body.add(this.legL,this.legR),this.legL.position.set(-.115,0,0),this.legR.position.set(.115,0,0);for(const[u,h,d]of[[this.legL,this.kneeL,-1],[this.legR,this.kneeR,1]])Te(u,.18,.46,.2,s,0,-.23,0),h.position.set(0,-.46,0),u.add(h),Te(h,.15,.42,.17,s,0,-.21,0),Te(h,.16,.1,.29,o,0,-.42,.05),Te(u,.2,.16,.24,s,0,.02,0);this.upper.position.y=0,this.body.add(this.upper),Te(this.upper,.44,.52,.25,r,0,.27,0),Te(this.upper,.47,.32,.3,l,0,.26,0),Te(this.upper,.14,.3,.1,c,-.16,.3,.16),Te(this.upper,.14,.3,.1,c,.16,.3,.16),Te(this.upper,.46,.1,.27,s,0,.01,0),this.head.position.set(0,.56,0),this.upper.add(this.head),Te(this.head,.22,.24,.23,i,0,.12,0),Te(this.head,.19,.11,.02,c,0,.1,.115),e==="CT"?(Te(this.head,.25,.13,.26,a,0,.22,-.005),Te(this.head,.24,.05,.05,a,0,.16,.1)):(Te(this.head,.235,.08,.245,a,0,.2,-.005),Te(this.head,.06,.1,.05,a,.1,.15,-.09),Te(this.head,.2,.16,.06,rt(2892825),0,.13,-.1)),this.armL.position.set(-.28,.46,0),this.armR.position.set(.28,.46,0),this.upper.add(this.armL,this.armR);for(const[u,h,d]of[[this.armL,this.elbowL,-1],[this.armR,this.elbowR,1]])Te(u,.13,.34,.14,r,0,-.17,0),h.position.set(0,-.34,0),u.add(h),Te(h,.115,.3,.12,r,0,-.14,.02),Te(h,.1,.1,.1,i,0,-.3,.03);this.gunMount.position.set(.13,.33,.3),this.upper.add(this.gunMount)}setWeapon(e){if(this.gunModel===e||(this.gunModel=e,this.gun&&(this.gunMount.remove(this.gun),this.gun=null),!e))return;const t=kT(e);t.rotation.set(0,0,0),this.gun=t,this.gunMount.add(t)}animate(e,t,i,r,s,o,a){if(o>0){const _=Math.min(1,o/.55),x=1-Math.pow(1-_,3);this.root.rotation.z=x*1.45,this.root.position.y=-.62*x,this.upper.rotation.x=x*.35,this.head.rotation.x=x*.5,this.armL.rotation.x=x*-.6,this.armR.rotation.x=x*-.4,this.legL.rotation.x=x*.4,this.legR.rotation.x=x*-.25,this.gunMount.rotation.x=x*-.7;return}this.root.rotation.z=0;const l=Math.min(1,t/5.6),c=l*.75,u=Math.sin(e*9);r?(this.legL.rotation.x=-.35,this.legR.rotation.x=.25,this.kneeL.rotation.x=.5,this.kneeR.rotation.x=.35):(this.legL.rotation.x=u*c,this.legR.rotation.x=-u*c,this.kneeL.rotation.x=Math.max(0,-u)*c*1.3,this.kneeR.rotation.x=Math.max(0,u)*c*1.3);const h=r?0:Math.abs(Math.sin(e*9))*.045*l;this.body.position.y=.92-i*.34+h,this.upper.rotation.x=Wh.lerp(.02,.35,i)+s*.55+(a>0?.5:0),this.upper.rotation.y=Math.sin(e*4.5)*.03*l,this.head.rotation.x=s*.35+(a>0?.35:0);const d=this.gunModel==="knife"?.9:1,p=a>0?.9:0;this.armL.rotation.x=-1.15*d+s*.4-p+u*.05*l,this.armR.rotation.x=-1.05*d+s*.4-p-u*.05*l,this.armL.rotation.z=.42+(this.gunModel==="knife"?.2:0),this.armR.rotation.z=-.34,this.elbowL.rotation.x=-.85*d,this.elbowR.rotation.x=-1.15*d,this.gunMount.rotation.x=s*.9,this.gunMount.position.set(.13-p*.05,.33-p*.16,.3-p*.16)}flash(e,t){for(const i of this.mats)i.emissive.setHex(e);this.gun}clearFlash(){for(const e of this.mats)e.emissive.setHex(0)}}class BT{constructor(){P(this,"ctx",null);P(this,"master",null);P(this,"noiseBuf",null);P(this,"listener",{x:0,y:0,z:0,fx:0,fz:-1,rx:1,rz:0});P(this,"volume",.7);P(this,"muted",!1)}init(){if(this.ctx){this.ctx.resume();return}try{const e=window.AudioContext||window.webkitAudioContext;this.ctx=new e;const t=this.ctx.createDynamicsCompressor();t.threshold.value=-14,t.knee.value=20,t.ratio.value=8,this.master=this.ctx.createGain(),this.master.gain.value=this.volume,this.master.connect(t),t.connect(this.ctx.destination);const i=this.ctx.sampleRate*2,r=this.ctx.createBuffer(1,i,this.ctx.sampleRate),s=r.getChannelData(0);for(let o=0;o<i;o++)s[o]=Math.random()*2-1;this.noiseBuf=r}catch{}}setVolume(e){this.volume=e,this.master&&(this.master.gain.value=this.muted?0:e)}setMuted(e){this.muted=e,this.master&&(this.master.gain.value=e?0:this.volume)}setListener(e,t,i,r){const s=Math.sin(r),o=Math.cos(r);this.listener={x:e,y:t,z:i,fx:s,fz:o,rx:o,rz:-s}}spatial(e,t){if(e===void 0||t===void 0)return{gain:1,pan:0};const i=e-this.listener.x,r=t-this.listener.z,s=Math.hypot(i,r),o=Math.min(1,14/(10+s)),a=s>.5?Math.max(-1,Math.min(1,(i*this.listener.rx+r*this.listener.rz)/s*.8)):0;return{gain:o,pan:a}}out(e,t,i){if(!this.ctx||!this.master)return null;const r=this.ctx.createGain();r.gain.value=t;let s=r;if(this.ctx.createStereoPanner){const o=this.ctx.createStereoPanner();o.pan.value=e,r.connect(o),s=o}return s.connect(this.master),r}noise(e){if(!this.ctx||!this.noiseBuf)return;const t=this.ctx.currentTime+(e.delay??0),i=this.ctx.createBufferSource();i.buffer=this.noiseBuf,i.loop=!0,i.playbackRate.value=e.playbackRate??1;const r=this.ctx.createBiquadFilter();r.type=e.type??"bandpass",r.frequency.setValueAtTime(e.freq,t),e.freqEnd&&r.frequency.exponentialRampToValueAtTime(Math.max(30,e.freqEnd),t+e.dur),r.Q.value=e.q??.8;const s=this.ctx.createGain();s.gain.setValueAtTime(e.gain,t),s.gain.exponentialRampToValueAtTime(Math.max(5e-4,e.gainEnd??8e-4),t+e.dur),i.connect(r),r.connect(s);const o=this.out(e.pan??0,1,t);o&&s.connect(o),i.start(t),i.stop(t+e.dur+.05)}tone(e){if(!this.ctx)return;const t=this.ctx.currentTime+(e.delay??0),i=this.ctx.createOscillator();i.type=e.type??"sine",i.frequency.setValueAtTime(Math.max(20,e.f0),t),e.f1&&i.frequency.exponentialRampToValueAtTime(Math.max(20,e.f1),t+e.dur);const r=this.ctx.createGain();r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(Math.max(.001,e.gain),t+Math.min(.02,e.dur*.3)),r.gain.exponentialRampToValueAtTime(Math.max(5e-4,e.gainEnd??8e-4),t+e.dur),i.connect(r);const s=this.out(e.pan??0,1,t);s&&r.connect(s),i.start(t),i.stop(t+e.dur+.05)}shot(e,t,i,r=1){if(!this.ctx)return;const{gain:s,pan:o}=this.spatial(t,i),a=s*r;this.tone({f0:e.thumpF0,f1:e.thumpF1,dur:e.thumpDur,gain:e.thumpGain*a,type:"triangle",pan:o}),this.noise({dur:e.noiseDur,freq:e.noiseFreq,freqEnd:e.noiseFreq*.35,gain:e.noiseGain*a,q:.6,pan:o}),e.tail&&this.noise({dur:e.tail.dur,freq:e.tail.f*2,freqEnd:e.tail.f*.5,gain:e.tail.gain*a,q:.4,pan:o,delay:.02})}dryFire(){this.tone({f0:900,f1:500,dur:.05,gain:.25,type:"square"})}reload(e){e===0?(this.tone({f0:420,f1:260,dur:.07,gain:.22,type:"square"}),this.noise({dur:.12,freq:1400,gain:.2,q:1.5,delay:.02})):e===1?(this.tone({f0:300,f1:480,dur:.09,gain:.25,type:"square"}),this.noise({dur:.14,freq:900,gain:.22,q:1.2})):(this.noise({dur:.1,freq:2200,gain:.3,q:2}),this.tone({f0:500,f1:700,dur:.07,gain:.3,type:"square",delay:.05}))}draw(){this.noise({dur:.1,freq:1800,gain:.16,q:1.6})}footstep(e,t,i,r){const{gain:s,pan:o}=this.spatial(e,t),a=i?340:240;this.noise({dur:.075,freq:a+r%2*45,freqEnd:a*.4,gain:(i?.3:.14)*s,q:.9,pan:o}),this.tone({f0:90,f1:55,dur:.06,gain:.12*s,type:"sine",pan:o})}jump(){this.noise({dur:.09,freq:500,gain:.12,q:1})}land(e,t){const{gain:i,pan:r}=this.spatial(e,t);this.tone({f0:110,f1:60,dur:.09,gain:.3*i,type:"sine",pan:r}),this.noise({dur:.1,freq:380,gain:.2*i,q:.8,pan:r})}scopeIn(){this.tone({f0:700,f1:1500,dur:.12,gain:.16,type:"sine"})}scopeOut(){this.tone({f0:1500,f1:600,dur:.1,gain:.13,type:"sine"})}hitConfirm(e){e?(this.tone({f0:1450,f1:1900,dur:.09,gain:.3,type:"square"}),this.tone({f0:2200,dur:.05,gain:.18,type:"sine",delay:.05})):this.tone({f0:1050,f1:1250,dur:.06,gain:.22,type:"square"})}hurt(){this.tone({f0:220,f1:120,dur:.16,gain:.4,type:"sawtooth"}),this.noise({dur:.18,freq:700,gain:.3,q:.7})}blood(e,t){const{gain:i,pan:r}=this.spatial(e,t);this.noise({dur:.09,freq:480,gain:.35*i,q:.7,pan:r,playbackRate:.7})}bulletImpact(e,t){const{gain:i,pan:r}=this.spatial(e,t);this.noise({dur:.08,freq:2600,gain:.28*i,q:1.4,pan:r}),this.tone({f0:1400,f1:300,dur:.05,gain:.1*i,type:"square",pan:r})}bulletWhizz(){this.noise({dur:.14,freq:3200,freqEnd:900,gain:.14,q:2.5,playbackRate:1.6})}knifeSwing(){this.noise({dur:.16,freq:2600,freqEnd:700,gain:.2,q:2.4,playbackRate:1.3})}knifeHit(e,t){const{gain:i,pan:r}=this.spatial(e,t);this.tone({f0:320,f1:130,dur:.12,gain:.5*i,type:"triangle",pan:r}),this.noise({dur:.1,freq:900,gain:.3*i,q:.8,pan:r})}kill(){this.tone({f0:620,dur:.07,gain:.22,type:"square"}),this.tone({f0:930,dur:.1,gain:.22,type:"square",delay:.07})}plantBeep(){this.tone({f0:2100,dur:.07,gain:.2,type:"square"})}defuseTick(){this.tone({f0:1300,dur:.05,gain:.16,type:"square"})}bombPlanted(){this.tone({f0:1600,dur:.1,gain:.25,type:"square"}),this.tone({f0:1600,dur:.16,gain:.25,type:"square",delay:.16})}bombBeep(e,t,i){const{gain:r,pan:s}=this.spatial(e,t);this.tone({f0:2350,dur:i?.06:.08,gain:.3*r,type:"square",pan:s})}bombDefused(){this.tone({f0:900,dur:.12,gain:.25,type:"square"}),this.tone({f0:1350,dur:.2,gain:.25,type:"square",delay:.12})}explosion(e,t){const{gain:i,pan:r}=this.spatial(e,t),s=Math.max(.35,i);this.noise({dur:1.4,freq:900,freqEnd:60,gain:1.1*s,q:.3,pan:r,playbackRate:.85}),this.tone({f0:120,f1:26,dur:1.2,gain:1*s,type:"sine",pan:r}),this.noise({dur:.35,freq:4e3,freqEnd:300,gain:.6*s,q:.5,pan:r})}roundStart(){this.tone({f0:440,dur:.12,gain:.2,type:"triangle"}),this.tone({f0:660,dur:.16,gain:.2,type:"triangle",delay:.13})}win(){[523,659,784,1046].forEach((e,t)=>this.tone({f0:e,dur:.18,gain:.22,type:"triangle",delay:t*.12}))}lose(){[392,330,262].forEach((e,t)=>this.tone({f0:e,dur:.24,gain:.22,type:"triangle",delay:t*.16}))}ui(){this.tone({f0:800,dur:.04,gain:.12,type:"square"})}}const ke=new BT;function en(n,e,t){return n<e?e:n>t?t:n}function Jn(n,e){return n+Math.random()*(e-n)}function Av(n,e,t,i,r,s,o,a){let l=0,c=a;if(Math.abs(i)<1e-8){if(n<o.x1||n>o.x2)return null}else{let u=(o.x1-n)/i,h=(o.x2-n)/i;if(u>h){const d=u;u=h,h=d}if(l=Math.max(l,u),c=Math.min(c,h),l>c)return null}if(Math.abs(r)<1e-8){if(e<o.y1||e>o.y2)return null}else{let u=(o.y1-e)/r,h=(o.y2-e)/r;if(u>h){const d=u;u=h,h=d}if(l=Math.max(l,u),c=Math.min(c,h),l>c)return null}if(Math.abs(s)<1e-8){if(t<o.z1||t>o.z2)return null}else{let u=(o.z1-t)/s,h=(o.z2-t)/s;if(u>h){const d=u;u=h,h=d}if(l=Math.max(l,u),c=Math.min(c,h),l>c)return null}return l}function HT(n,e,t,i){if(i<=0)return[n,e,t];let r=0,s=0,o=0;Math.abs(n)<.9?(r=t,s=0,o=-n):(r=0,s=t,o=-e);const a=Math.hypot(r,s,o)||1;r/=a,s/=a,o/=a;const l=e*o-t*s,c=t*r-n*o,u=n*s-e*r,h=Math.tan(i)*Math.sqrt(Math.random()),d=Math.random()*Math.PI*2,p=Math.cos(d),_=Math.sin(d);return[n+r*h*p+l*h*_,e+s*h*p+c*h*_,t+o*h*p+u*h*_]}function pl(n,e){let t=n-e;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function _u(n,e,t){const i=pl(e,n);return n+en(i,-t,t)}const Em=5.6,VT=6.3,GT=17;function WT(n,e,t,i,r,s,o,a){const l=Math.cos(o.yaw),c=Math.sin(o.yaw),u=n-o.cx,h=t-o.cz,d=u*l-h*c,p=u*c+h*l,_=i*l-s*c,x=i*c+s*l;return Av(d,e,p,_,r,x,{x1:-o.hx,y1:o.y1,z1:-o.hz,x2:o.hx,y2:o.y2,z2:o.hz},a)}let wm=1;const Tm=["Phoenix","Viper","Blaze","Wolf","Cobra","Ghost","Falcon","Rex","Storm","Havoc","Dagger","Ace"];class Am{constructor(e,t){P(this,"id",wm++);P(this,"name");P(this,"team");P(this,"isPlayer",!1);P(this,"x",0);P(this,"y",0);P(this,"z",0);P(this,"vx",0);P(this,"vy",0);P(this,"vz",0);P(this,"yaw",0);P(this,"pitch",0);P(this,"recoilX",0);P(this,"recoilY",0);P(this,"crouch",!1);P(this,"crouchAmt",0);P(this,"walk",!1);P(this,"grounded",!0);P(this,"alive",!0);P(this,"deadTime",0);P(this,"health",100);P(this,"armor",0);P(this,"helmet",!1);P(this,"primary",null);P(this,"secondary",null);P(this,"melee",Ya("knife"));P(this,"slot","primary");P(this,"fireCd",0);P(this,"lastShotAt",-99);P(this,"reloadEnd",-1);P(this,"reloadStart",-1);P(this,"spread",0);P(this,"semiLatch",!1);P(this,"hasC4",!1);P(this,"kills",0);P(this,"deaths",0);P(this,"money",800);P(this,"moveFwd",0);P(this,"moveSide",0);P(this,"wantJump",!1);P(this,"firing",!1);P(this,"scoped",!1);P(this,"plantProgress",0);P(this,"busyAction","none");P(this,"humanoid");P(this,"brain",null);P(this,"spottedAt",-99);P(this,"lastEnemies",[]);P(this,"walkPhase",0);P(this,"footDist",0);P(this,"stepParity",0);P(this,"lastDamageFrom",null);P(this,"flashT",0);P(this,"reloadMid",!1);this.team=e,this.name=t??Tm[wm*7%Tm.length],this.humanoid=new OT(e),this.humanoid.setWeapon(_n.knife.model)}get weaponDef(){const e=this.current();return _n[e.id]}current(){return this.slot==="primary"&&this.primary?this.primary:this.slot==="secondary"&&this.secondary?this.secondary:(this.slot="melee",this.melee)}hasSlot(e){return e==="melee"?!0:e==="primary"?!!this.primary:!!this.secondary}switchSlot(e,t){return!this.hasSlot(e)||this.slot===e?!1:(this.slot=e,this.cancelReload(),this.semiLatch=!0,this.spread=0,this.humanoid.setWeapon(_n[this.current().id].model),this.isPlayer&&ke.draw(),!0)}nextSlot(e,t){const i=["primary","secondary","melee"];let r=i.indexOf(this.slot);for(let s=0;s<3&&(r=(r+e+3)%3,!this.switchSlot(i[r],t));s++);}cancelReload(){this.reloadEnd=-1,this.reloadStart=-1}eyeHeight(){return 1.62-this.crouchAmt*.5}eyeY(){return this.y+this.eyeHeight()}muzzleY(){return this.eyeY()-.12}aimDir(){const e=Math.cos(this.pitch);return[Math.sin(this.yaw)*e,Math.sin(this.pitch),Math.cos(this.yaw)*e]}totalSpread(){const e=this.weaponDef,t=Math.hypot(this.vx,this.vz);let i=e.spreadBase+this.spread;return i+=e.spreadMoving*en(t/Em,0,1)*(this.grounded?1:.3),this.grounded||(i+=e.spreadJump),this.crouch&&(i*=.65),this.scoped&&e.scope&&(i=e.spreadBase*.5),i}startReload(e){const t=this.current(),i=_n[t.id];return i.slot==="melee"||this.reloadEnd>e||t.mag>=i.magSize||t.reserve<=0?!1:(this.reloadEnd=e+i.reloadTime,this.reloadStart=e,this.isPlayer&&ke.reload(0),!0)}finishReload(e){const t=this.current(),r=_n[t.id].magSize-t.mag,s=Math.min(r,t.reserve);t.mag+=s,t.reserve-=s,this.reloadEnd=-1}tryFire(e,t){if(!this.alive)return!1;const i=this.current(),r=_n[i.id];if(this.reloadEnd>e||this.busyAction!=="none")return!1;if(r.fireMode==="melee")return e<this.fireCd?!1:(this.fireCd=e+1/r.melee.rate,t.meleeAttack(this,r),!0);if(r.fireMode==="semi"||r.fireMode==="bolt"){if(!this.firing||this.semiLatch)return!1;this.semiLatch=!0}else if(!this.firing)return!1;if(e<this.fireCd)return!1;if(i.mag<=0)return this.isPlayer?(ke.dryFire(),this.startReload(e)):this.startReload(e),!1;this.fireCd=e+60/r.rpm,this.lastShotAt=e,i.mag--;const[s,o,a]=this.aimDir(),l=this.totalSpread(),[c,u,h]=HT(s,o,a,l),d=this.x,p=this.muzzleY(),_=this.z;return t.fireBullet(this,d,p,_,c,u,h,r),this.spread=Math.min(r.spreadMax,this.spread+r.spreadPerShot),this.recoilX+=r.recoilPitch*(this.crouch?.8:1),this.recoilY+=(Math.random()-.5)*2*r.recoilYaw,this.isPlayer?ke.shot(r.sound,void 0,void 0,1):ke.shot(r.sound,this.x,this.z,1),t.onShotFired(this,r),!0}postUpdate(e,t,i){(this.yaw>Math.PI||this.yaw<=-Math.PI)&&(this.yaw=((this.yaw+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI),this.firing||(this.semiLatch=!1);const r=this.weaponDef;this.spread=Math.max(0,this.spread-r.spreadRecover*t),this.recoilX=Math.max(0,this.recoilX-this.recoilX*r.recoilRecover*t),this.recoilY-=this.recoilY*r.recoilRecover*t,this.reloadEnd>0&&e>=this.reloadEnd?(this.finishReload(e),this.isPlayer&&ke.reload(2)):this.isPlayer&&this.reloadStart>0&&(e-this.reloadStart)/Math.max(.01,this.reloadEnd-this.reloadStart)>.55&&!this.reloadMid&&(this.reloadMid=!0,ke.reload(1)),this.flashT>0&&(this.flashT-=t,this.flashT<=0&&this.humanoid.clearFlash());const s=Math.hypot(this.vx,this.vz);if(this.grounded&&s>.6&&!this.crouch){this.footDist+=s*t;const o=s>3.4?2.35:2.9;this.footDist>o&&(this.footDist=0,this.stepParity++,ke.footstep(this.x,this.z,s>3.4,this.stepParity))}}takeDamage(e,t,i,r,s){if(!this.alive)return!1;const o=_n[r];let a=e;if(t==="head"?this.helmet&&this.armor>0:this.armor>0){const c=UT(e,o.armorPen,this.armor);a=c.hp,this.armor=Math.round(c.armorLeft)}return this.health-=a,this.lastDamageFrom=i,this.flashT=.09,this.humanoid.flash(5579298,90),this.health<=0?(this.health=0,this.alive=!1,this.deaths++,this.deadTime=1e-4,this.firing=!1,this.hasC4=!1,i&&i!==this&&i.kills++,!0):!1}giveLoadout(e,t,i,r){this.primary=e?Ya(e):null,this.secondary=Ya(t),this.melee=Ya("knife"),this.armor=i,this.helmet=r,this.slot=e?"primary":"secondary",this.humanoid.setWeapon(_n[this.current().id].model),this.cancelReload(),this.spread=0}update(e,t,i){if(!this.alive){this.deadTime+=e,this.humanoid.root.position.set(this.x,this.y,this.z),this.humanoid.root.rotation.y=this.yaw,this.humanoid.animate(this.walkPhase,0,0,!1,0,this.deadTime,0);return}this.crouchAmt=en(this.crouchAmt+(this.crouch?1:-1)*e*7,0,1);const r=this.weaponDef;let s=Em*r.moveSpeed;this.walk&&(s*=.52),this.crouch&&(s*=.45),this.scoped&&(s*=.5),this.busyAction!=="none"&&(s=0);const o=Math.sin(this.yaw),a=Math.cos(this.yaw),l=this.moveSide*a+this.moveFwd*o,c=-this.moveSide*o+this.moveFwd*a,u=Math.hypot(l,c),h=u>.001?s/u:0,d=l*h,p=c*h,_=this.grounded?13:3,x=1-Math.exp(-_*e);this.vx+=(d-this.vx)*x,this.vz+=(p-this.vz)*x,this.wantJump&&this.grounded&&this.busyAction==="none"&&(this.vy=VT,this.grounded=!1,ke.jump()),this.vy-=GT*e,this.wantJump=!1;const m=this.y,f=this.vx*e,g=this.vz*e;let v=this.x,M=this.z;f!==0&&t.fits(this.x+f,this.z,m,Po)?v+=f:this.vx=0,g!==0&&t.fits(v,this.z+g,m,Po)?M+=g:this.vz=0,this.x=v,this.z=M;const b=this.y;this.y+=this.vy*e;const A=t.supportHeight(this.x,this.z,this.y+.05);this.y<=A?(!this.grounded&&this.vy<-4&&ke.land(this.x,this.z),this.y=A,this.vy=0,this.grounded=!0):this.y>A+ki*.5&&(this.grounded=!1),b===this.y&&this.vy<0&&(this.vy=0);const T=Math.hypot(this.vx,this.vz);this.walkPhase+=e*(.6+T*.22),this.postUpdate(i,e,t)}syncModel(e){const t=this.humanoid;t.root.position.set(this.x,this.y,this.z),t.root.rotation.y=this.yaw;const i=this.busyAction!=="none"?1:0;t.animate(this.walkPhase,Math.hypot(this.vx,this.vz),this.crouchAmt,!this.grounded,this.pitch,this.alive?0:this.deadTime,i)}hitboxes(){const e=1-this.crouchAmt*.26,t=this.y,i=this.yaw,r=[{region:"head",cx:this.x,cz:this.z,y1:t+1.64*e,y2:t+1.88*e,hx:.135,hz:.145,yaw:i},{region:"chest",cx:this.x,cz:this.z,y1:t+1.2*e,y2:t+1.64*e,hx:.25,hz:.17,yaw:i},{region:"stomach",cx:this.x,cz:this.z,y1:t+.94*e,y2:t+1.2*e,hx:.23,hz:.16,yaw:i},{region:"leg",cx:this.x,cz:this.z,y1:t+0,y2:t+.94*e,hx:.21,hz:.17,yaw:i}];for(const s of[-1,1]){const o=s*.31,a=.03,l=this.x+o*Math.cos(i)+a*Math.sin(i),c=this.z-o*Math.sin(i)+a*Math.cos(i);r.push({region:"arm",cx:l,cz:c,y1:t+1.06*e,y2:t+1.56*e,hx:.11,hz:.12,yaw:i})}return r}dispose(e){e.remove(this.humanoid.root)}}const Cm={A:["a_hold_1","a_hold_2","a_hold_3","a_plant_2"],B:["b_hold_1","b_hold_2","b_hold_3","b_plant_2"]};class XT{constructor(e,t){P(this,"char");P(this,"game");P(this,"world");P(this,"state","objective");P(this,"skill");P(this,"paused",!1);P(this,"routeIdx",0);P(this,"goal",null);P(this,"goalKey","");P(this,"path",[]);P(this,"pathIdx",0);P(this,"pathAge",0);P(this,"repathCd",0);P(this,"stuckTime",0);P(this,"lastDistToGoal",999);P(this,"target",null);P(this,"targetSeenAt",-99);P(this,"firstSeenAt",-99);P(this,"aimErrX",0);P(this,"aimErrY",0);P(this,"strafe",0);P(this,"strafeFlipAt",0);P(this,"burstUntil",0);P(this,"burstPauseUntil",0);P(this,"nextPerception",0);P(this,"holdSpot",null);P(this,"nextReposition",0);P(this,"lastKnownEnemy",null);P(this,"holdSpotName",null);this.char=e,this.game=t,this.world=t.world,this.skill=en(Jn(.5,.9),0,1)}nextRoutePoint(){const e=this.game.routes.get(this.char);if(!e||!e.length)return null;const t=this.char;let i=0;for(;this.routeIdx<e.length&&i++<8;){const s=bo[e[this.routeIdx]];if(Math.hypot(t.x-s.x,t.z-s.z)<9)this.routeIdx++;else break}if(this.routeIdx>=e.length)return null;const r=bo[e[this.routeIdx]];return{x:r.x,z:r.z}}p(e){const t=bo[e];return{x:t.x,z:t.z}}reset(){this.routeIdx=0,this.state="objective",this.target=null,this.path=[],this.pathIdx=0,this.goal=null,this.goalKey="",this.pathAge=99,this.holdSpot=null,this.lastKnownEnemy=null,this.burstUntil=0,this.burstPauseUntil=0}update(e,t){const i=this.char,r=this.game;if(!i.alive||r.phase==="freeze"||r.phase==="over"){i.moveFwd=0,i.moveSide=0,i.firing=!1,i.busyAction="none";return}t>=this.nextPerception&&(this.perceive(t),this.nextPerception=t+Jn(.1,.18));const s=i.current();_n[s.id].fireMode!=="melee"&&(s.mag<=0||!this.target&&s.mag<_n[s.id].magSize*.45&&t-i.lastShotAt>1.2)&&i.startReload(t),this.target&&(!this.target.alive||t-this.targetSeenAt>1.6)&&(this.lastKnownEnemy={x:this.target.x,z:this.target.z},this.target=null),this.target?this.engage(e,t):this.objective(e,t)}perceive(e){const t=this.char,i=this.game;let r=null,s=1/0;const o=i.characters,a=Math.sin(t.yaw),l=Math.cos(t.yaw);for(const c of o){if(!c.alive||c.team===t.team)continue;const u=c.x-t.x,h=c.z-t.z,d=Math.hypot(u,h);if(d>58||t.hasC4&&d>28)continue;if(!((u*a+h*l)/Math.max(.001,d)>.34)&&d>5){e-c.lastShotAt<.7&&d<34&&d<(this.lastKnownEnemy?999:40)&&(this.lastKnownEnemy={x:c.x,z:c.z});continue}if(!i.canSee(t,c))continue;const x=d-(c.hasC4?4:0);x<s&&(s=x,r=c),i.markSpotted(c)}r&&(this.target!==r&&(this.firstSeenAt=e,this.aimErrX=Jn(-1,1)*(1-this.skill)*.055,this.aimErrY=Jn(-1,1)*(1-this.skill)*.035),this.target=r,this.targetSeenAt=e,this.lastKnownEnemy={x:r.x,z:r.z},t.busyAction="none")}engage(e,t){const i=this.char,r=this.target,s=r.x-i.x,o=r.z-i.z,a=Math.hypot(s,o),l=i.weaponDef,c=l.fireMode==="melee"?l.melee.range:l.id==="awp"?85:l.slot==="secondary"?36:46,u=en((t-this.firstSeenAt)/.5,0,1);this.aimErrX*=1-Math.min(1,e*(2+6*this.skill*u)),this.aimErrY*=1-Math.min(1,e*(2+6*this.skill*u));const h=r.y+(this.skill>.75&&a>8?1.72*(1-r.crouchAmt*.26):1.3*(1-r.crouchAmt*.26)),d=Math.atan2(s,o)+this.aimErrX,p=Math.max(.5,a),_=Math.atan2(h-i.eyeY(),p)+this.aimErrY,x=(7+9*this.skill)*e;i.yaw=_u(i.yaw,d,x),i.pitch+=en(_-i.pitch,-x,x),i.pitch=en(i.pitch,-1.3,1.3),t>this.strafeFlipAt&&(this.strafeFlipAt=t+Jn(.5,1.4),this.strafe=Math.random()<.34?0:Math.random()<.5?-1:1);const m=l.fireMode==="melee"?.6:6,f=l.fireMode==="melee"?1.2:c*.72;let g=0;a>f?g=.9:a<m&&(g=-.7),i.moveFwd=g,i.moveSide=this.strafe*.8,i.crouch=this.skill>.6&&a>16&&Math.random()<.02?!0:a>16&&i.crouch,i.walk=!1;const v=Math.abs(pl(d,i.yaw))<.05+.02*(1-this.skill),M=t-this.firstSeenAt>Jn(.16,.2)+(1-this.skill)*.32,b=this.game.canSee(i,r);let A=!1;if(l.fireMode==="melee")A=a<l.melee.range&&b;else if(b&&v&&M&&a<c)if(l.fireMode==="auto")t>this.burstPauseUntil&&t>this.burstUntil&&(this.burstUntil=t+Jn(.12,.3)+this.skill*.35,this.burstPauseUntil=this.burstUntil+Jn(.12,.4)),A=t<this.burstUntil;else{const y=60/l.rpm+.12+(1-this.skill)*.25;A=t-i.lastShotAt>y}i.current().mag<=0&&(i.startReload(t),A=!1,i.slot==="primary"&&i.primary&&i.primary.reserve<=0&&i.secondary&&i.secondary.mag>0&&i.switchSlot("secondary",t)),A&&a>15&&(i.moveFwd=0,i.moveSide=0),t-Math.max(this.firstSeenAt,i.lastShotAt)>2.5&&a>7&&(i.moveFwd=.9,i.moveSide=0),i.hasC4&&a>10&&(i.moveFwd=Math.max(i.moveFwd,.55));const w=!(l.fireMode==="semi"||l.fireMode==="bolt")||t-i.lastShotAt>60/l.rpm+.04;i.firing=A&&w}objective(e,t){const i=this.char,r=this.game;if(i.firing=!1,i.crouch=!1,i.walk=!1,this.lastKnownEnemy&&t-this.targetSeenAt<4){const o=this.lastKnownEnemy.x-i.x,a=this.lastKnownEnemy.z-i.z,l=Math.atan2(o,a);Math.abs(pl(l,i.yaw))>.1&&(i.yaw=_u(i.yaw,l,4*e))}if(i.busyAction==="plant"){i.moveFwd=0,i.moveSide=0,this.state="plant";return}if(i.busyAction==="defuse"){i.moveFwd=0,i.moveSide=0,this.state="defuse";return}const s=r.bomb;if(i.team==="T"){if(s.state==="dropped")r.nearestTToBomb()===i&&this.setGoal({x:s.x,z:s.z},"bomb_loose");else if(s.state==="planted"){if(t>this.nextReposition||!this.goal){this.nextReposition=t+Jn(9,16);const o=s.site==="A"?Cm.A:Cm.B;this.setGoal(this.p(o[Math.floor(Math.random()*o.length)]),"site_hold")}}else if(i.hasC4){const o=r.tacticSite,a=o==="A"?this.p("a_plant"):this.p("b_plant");if(r.inSiteOf(i)===o){if(Math.hypot(i.x-a.x,i.z-a.z)<3.4&&!this.target&&this.world.fits(i.x,i.z,i.y,.45)){i.busyAction="plant",this.state="plant",i.moveFwd=0,i.moveSide=0;return}this.setGoal(a,"plant_"+o)}else{const l=this.nextRoutePoint();l?this.setGoal(l,"route"):this.setGoal(a,"plant_"+o)}}else if(t>this.nextReposition||!this.goal||this.goalKey.startsWith("route")){const o=this.nextRoutePoint();if(o)this.setGoal(o,"route");else{const a=r.tacticSite==="A"?"a_plant_2":"b_plant_2";this.setGoal(this.p(a),"push_"+r.tacticSite)}}}else if(s.state==="planted"){if(Math.hypot(i.x-s.x,i.z-s.z)<1.8&&this.world.fits(i.x,i.z,i.y,.4)){i.busyAction="defuse",this.state="defuse",i.moveFwd=0,i.moveSide=0,i.crouch=!0;return}this.setGoal({x:s.x,z:s.z},"retake")}else if(t>this.nextReposition||!this.goal){this.nextReposition=t+Jn(10,20);const o=this.holdSpotName??r.assignDefenceSpot(i);this.holdSpotName=o;const a=this.p(o),l=r.world.randomOpenPoint(a.x,a.z,3);this.setGoal(l??a,"defend"),this.state="hold"}this.followPath(e,t)}setGoal(e,t){this.goalKey===t&&this.goal&&Math.hypot(this.goal.x-e.x,this.goal.z-e.z)<1.5||(this.goal=e,this.goalKey=t,this.pathAge=99)}followPath(e,t){const i=this.char;if(!this.goal){i.moveFwd=0,i.moveSide=0;return}if(this.pathAge+=e,(this.pathAge>2.5||this.pathIdx>=this.path.length)&&t>this.repathCd){const x=this.world.findPath({x:i.x,z:i.z},this.goal);this.repathCd=t+.5,x&&x.length?(this.path=x,this.pathIdx=0,this.pathAge=0):this.pathAge=1.5}if(!this.path.length){i.moveFwd=0,i.moveSide=0;return}let r=this.path[this.pathIdx],s=Math.hypot(r.x-i.x,r.z-i.z);for(;s<1.1&&this.pathIdx<this.path.length-1;)this.pathIdx++,r=this.path[this.pathIdx],s=Math.hypot(r.x-i.x,r.z-i.z);const o=r.x-i.x,a=r.z-i.z,l=Math.atan2(o,a);this.lastKnownEnemy&&t-this.targetSeenAt<2.5||(i.yaw=_u(i.yaw,l,9*e),i.pitch+=en(0-i.pitch,-2*e,2*e));const c=Math.cos(i.yaw),u=Math.sin(i.yaw),h=en((o*u+a*c)/Math.max(.5,s),-1,1),d=en((o*c-a*u)/Math.max(.5,s),-1,1);i.moveFwd=Math.abs(pl(l,i.yaw))<1.5?h:.25,i.moveSide=d*.6,i.walk=!1;const p=this.lastDistToGoal-s;if(this.lastDistToGoal=s,Math.abs(p)<e*.6?this.stuckTime+=e:this.stuckTime=Math.max(0,this.stuckTime-e*2),this.stuckTime>.8&&(i.wantJump=!0,this.stuckTime>1.6)){this.stuckTime=0,this.pathAge=99;const x=this.world.randomOpenPoint(i.x,i.z,4);x&&(this.goal=x,this.goalKey="unstuck",this.pathAge=99)}Math.hypot(this.goal.x-i.x,this.goal.z-i.z)<1.4&&(i.moveFwd=0,i.moveSide=0,(this.goalKey==="defend"||this.goalKey==="site_hold")&&(this.state="hold"))}}function Qs(n){const e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");return[e,t]}function fc(n,e,t,i){const r=n.getImageData(0,0,e,e),s=r.data;for(let o=0;o<s.length;o+=4){const a=(Math.random()-.5)*t;s[o]=Math.max(0,Math.min(255,s[o]+a)),s[o+1]=Math.max(0,Math.min(255,s[o+1]+a)),s[o+2]=Math.max(0,Math.min(255,s[o+2]+a)),s[o+3]=Math.min(255,s[o+3]*i+255*(1-i))}n.putImageData(r,0,0)}function sa(n,e=!0){const t=new Ev(n);return t.wrapS=t.wrapT=e?Bl:Yi,t.anisotropy=4,t}function jT(){const[n,e]=Qs(256);e.fillStyle="#c8ac7c",e.fillRect(0,0,256,256);for(let t=0;t<256;t+=4)e.fillStyle=`rgba(0,0,0,${.02+Math.random()*.04})`,e.fillRect(0,t,256,2);for(let t=0;t<220;t++){const i=4+Math.random()*22;e.fillStyle=`rgba(${120+Math.random()*60|0},${95+Math.random()*50|0},${55+Math.random()*40|0},${.05+Math.random()*.1})`,e.beginPath(),e.arc(Math.random()*256,Math.random()*256,i,0,Math.PI*2),e.fill()}e.strokeStyle="rgba(90,70,45,0.35)";for(let t=0;t<14;t++){e.beginPath();let i=Math.random()*256,r=Math.random()*256;e.moveTo(i,r);for(let s=0;s<5;s++)i+=(Math.random()-.5)*40,r+=Math.random()*26,e.lineTo(i,r);e.lineWidth=.6+Math.random(),e.stroke()}return fc(e,256,26,1),sa(n)}function YT(){const[n,e]=Qs(256);e.fillStyle="#a8905f",e.fillRect(0,0,256,256);for(let t=0;t<900;t++){const i=1+Math.random()*3.5,r=150+Math.random()*70|0;e.fillStyle=`rgba(${r},${r-25},${r-60|0},${.12+Math.random()*.25})`,e.beginPath(),e.arc(Math.random()*256,Math.random()*256,i,0,Math.PI*2),e.fill()}for(let t=0;t<60;t++){e.strokeStyle=`rgba(90,72,45,${.08+Math.random()*.14})`,e.lineWidth=1+Math.random()*2,e.beginPath();const i=Math.random()*256,r=Math.random()*256;e.moveTo(i,r),e.lineTo(i+(Math.random()-.5)*60,r+(Math.random()-.5)*60),e.stroke()}return fc(e,256,20,1),sa(n)}function qT(){const[n,e]=Qs(256);e.fillStyle="#9a7443",e.fillRect(0,0,256,256);for(let t=0;t<256;t+=32){e.fillStyle=`rgba(${120+Math.random()*50|0},${85+Math.random()*35|0},${45+Math.random()*20|0},0.55)`,e.fillRect(0,t,256,30),e.strokeStyle="rgba(60,40,20,0.6)",e.lineWidth=2,e.strokeRect(-2,t,260,30);for(let i=0;i<20;i++){e.strokeStyle=`rgba(70,48,22,${.1+Math.random()*.2})`,e.lineWidth=1,e.beginPath();const r=t+Math.random()*30;e.moveTo(0,r),e.bezierCurveTo(80,r+Math.random()*6-3,170,r+Math.random()*6-3,256,r),e.stroke()}}return e.strokeStyle="rgba(70,48,22,0.85)",e.lineWidth=16,e.strokeRect(8,8,240,240),e.lineWidth=12,e.beginPath(),e.moveTo(16,16),e.lineTo(240,240),e.stroke(),e.beginPath(),e.moveTo(240,16),e.lineTo(16,240),e.stroke(),fc(e,256,22,1),sa(n)}function Cv(){const[n,e]=Qs(128);e.fillStyle="#5c6a5a",e.fillRect(0,0,128,128);for(let t=0;t<200;t++)e.fillStyle=`rgba(${110+Math.random()*60|0},${70+Math.random()*40|0},${30+Math.random()*20|0},${.1+Math.random()*.3})`,e.beginPath(),e.arc(Math.random()*128,Math.random()*128,2+Math.random()*10,0,Math.PI*2),e.fill();e.fillStyle="rgba(30,34,30,0.5)";for(let t=16;t<128;t+=32)e.fillRect(0,t,128,4);return fc(e,128,18,1),sa(n)}function $T(n){const[e,t]=Qs(256);return t.clearRect(0,0,256,256),t.strokeStyle="rgba(235,225,190,0.85)",t.lineWidth=10,t.strokeRect(14,14,228,228),t.font='bold 190px "Arial Black", Arial, sans-serif',t.textAlign="center",t.textBaseline="middle",t.fillStyle="rgba(235,225,190,0.8)",t.fillText(n,128,138),sa(e,!1)}function KT(){const[n,e]=Qs(256),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#3f74b8"),t.addColorStop(.42,"#8fbede"),t.addColorStop(.62,"#dcd2b4"),t.addColorStop(1,"#c2a678"),e.fillStyle=t,e.fillRect(0,0,256,256);for(let r=0;r<26;r++){const s=Math.random()*256,o=Math.random()*90+20,a=12+Math.random()*30,l=e.createRadialGradient(s,o,0,s,o,a);l.addColorStop(0,"rgba(255,255,255,0.35)"),l.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=l,e.beginPath(),e.arc(s,o,a,0,Math.PI*2),e.fill()}const i=new Ev(n);return i.colorSpace=Gn,i}function as(n,e,t,i,r){const s=n.pos.length/3;for(let o=0;o<4;o++)n.pos.push(e[o][0],e[o][1],e[o][2]),n.norm.push(t[0],t[1],t[2]),n.uv.push((e[o][0]+e[o][1]+e[o][2])/i*.7071,(e[o][0]-e[o][1]+e[o][2])/i*.7071);n.idx.push(s,s+1,s+2,s,s+2,s+3)}function qa(n,e,t,i,r,s,o,a,l=!1){as(n,[[r,t,i],[r,s,i],[r,s,o],[r,t,o]],[1,0,0],a),as(n,[[e,t,o],[e,s,o],[e,s,i],[e,t,i]],[-1,0,0],a),as(n,[[e,t,o],[e,s,o],[r,s,o],[r,t,o]],[0,0,1],a),as(n,[[r,t,i],[r,s,i],[e,s,i],[e,t,i]],[0,0,-1],a),l||as(n,[[e,s,i],[e,s,o],[r,s,o],[r,s,i]],[0,1,0],a)}function $a(n){const e=new Kn;return e.setAttribute("position",new Dt(n.pos,3)),e.setAttribute("normal",new Dt(n.norm,3)),e.setAttribute("uv",new Dt(n.uv,2)),e.setIndex(n.idx),e.computeBoundingSphere(),e}function ZT(n,e){const t=new ht;n.add(t);const i=new Wi(600,24,16),r=new bn({map:KT(),side:rn,depthWrite:!1,fog:!1}),s=new Je(i,r);s.position.y=-40,t.add(s),n.fog=new ed(13615264,110,480);const o=new CT(12376053,10126688,.62);n.add(o);const a=new PT(16773850,1.25);a.position.set(60,95,-45),a.castShadow=!0,a.shadow.mapSize.set(2048,2048);const l=a.shadow.camera;l.left=-110,l.right=110,l.top=110,l.bottom=-110,l.near=10,l.far=320,a.shadow.bias=-7e-4,a.shadow.normalBias=.02,n.add(a),n.add(new LT(16777215,.1));const c=jT(),u=YT(),h=qT(),d=Cv(),p=new Pn({map:c}),_=new Pn({map:u}),x=new Pn({color:11112291}),m=new Pn({map:h}),f=new Pn({map:d}),g={pos:[],norm:[],uv:[],idx:[]},v={pos:[],norm:[],uv:[],idx:[]};for(const C of e.wallBoxes)qa(g,C.x1,0,C.z1,C.x2,ei,C.z2,4.5,!0),qa(v,C.x1-.06,0,C.z1-.06,C.x2+.06,.55,C.z2+.06,4.5,!0);const M={pos:[],norm:[],uv:[],idx:[]};for(const C of e.floorBoxes)C.h<=.3?as(M,[[C.x1,C.h,C.z1],[C.x1,C.h,C.z2],[C.x2,C.h,C.z2],[C.x2,C.h,C.z1]],[0,1,0],4.5):qa(M,C.x1,C.h-1.2,C.z1,C.x2,C.h,C.z2,4.5,!1);const b=$a(g),A=$a(v),T=$a(M),L=new Je(b,p),w=new Je(A,x),y=new Je(T,_);for(const C of[L,w,y])C.castShadow=!1,C.receiveShadow=!0;L.castShadow=!0,t.add(L,w,y);const D=new ht;t.add(D);for(const C of e.crates){const X=e.groundBaseAt(C.x,C.z);if(C.kind==="barrel"){const Y=new td(C.w/2,C.w/2,C.h,14),W=new Je(Y,f);W.position.set(C.x,X+C.h/2,C.z),W.castShadow=!0,W.receiveShadow=!0,D.add(W);const q=new nd(C.w/2+.02,.05,6,16);for(const N of[.28,.72]){const K=new Je(q,f);K.rotation.x=Math.PI/2,K.position.set(C.x,X+C.h*N,C.z),D.add(K)}}else{const Y=new Pt(C.w,C.h,C.d),W=new Je(Y,m);W.position.set(C.x,X+C.h/2,C.z),W.rotation.y=C.yaw??0,W.castShadow=!0,W.receiveShadow=!0,D.add(W);const q=new Je(new Pt(C.w+.04,.06,C.d+.04),x);q.position.set(C.x,X+C.h*.5,C.z),D.add(q)}}for(const C of[Ms,Ss]){const X=e.groundBaseAt(C.cx,C.cz),Y=Math.min(C.x2-C.x1,C.z2-C.z1)*.55,W=new Ks(Y,Y),q=new bn({map:$T(C.name),transparent:!0,depthWrite:!1}),N=new Je(W,q);N.rotation.x=-Math.PI/2,N.position.set(C.cx,X+.03,C.cz),t.add(N)}const H={pos:[],norm:[],uv:[],idx:[]};for(const C of e.ceilings)qa(H,C.x1,C.h,C.z1,C.x2,C.h+.4,C.z2,4.5,!0);if(H.pos.length){const C=new Je($a(H),p);C.castShadow=!0,C.receiveShadow=!0,t.add(C)}return{group:t,dispose(){n.remove(t),t.traverse(C=>{const X=C;X.geometry&&X.geometry.dispose()}),p.dispose(),_.dispose(),m.dispose(),f.dispose(),x.dispose(),c.dispose(),u.dispose(),h.dispose(),d.dispose()}}}const QT=[{x:-4.16,z:-3.2,rot:Math.PI/2,w:2.9,h:3.4},{x:-.84,z:-3.2,rot:Math.PI/2,w:2.9,h:3.4},{x:.34,z:-3.2,rot:Math.PI/2,w:2.9,h:3.4},{x:3.66,z:-3.2,rot:Math.PI/2,w:2.9,h:3.4},{x:-26.5,z:-59.64,rot:Math.PI/2,w:2.9,h:3.2},{x:-26.5,z:-56.36,rot:Math.PI/2,w:2.9,h:3.2},{x:-26.5,z:-55.14,rot:Math.PI/2,w:2.9,h:3.2},{x:-26.5,z:-51.86,rot:Math.PI/2,w:2.9,h:3.2},{x:33.24,z:41.3,rot:Math.PI/2,w:3.4,h:3.4},{x:36.76,z:41.3,rot:Math.PI/2,w:3.4,h:3.4}];function JT(n,e){const t=new Pn({map:Cv()}),i=new Pn({color:3883576}),r=[];for(const s of QT){const o=new Pt(s.w,s.h,.16),a=new Je(o,t);a.position.set(s.x,s.h/2,s.z),a.rotation.y=s.rot,a.castShadow=!0,a.receiveShadow=!0,n.add(a),r.push(a);const l=new Je(new Pt(.06,.06,s.w*.6),i);l.position.set(0,s.h*.5,0),a.add(l);const c=Math.abs(Math.cos(s.rot))>.5,u=c?s.w/2:.1,h=c?.1:s.w/2;e.colliders.push({x1:s.x-u,y1:0,z1:s.z-h,x2:s.x+u,y2:s.h,z2:s.z+h})}return r}class e2{constructor(e){P(this,"scene");P(this,"items",[]);P(this,"lights",[]);P(this,"tracerMat");P(this,"sparkMat");P(this,"bloodMat");P(this,"fireMat");P(this,"debrisMat");P(this,"smokeMat");this.scene=e,this.tracerMat=new bn({color:16769162,transparent:!0,opacity:.9,blending:Ps,depthWrite:!1,fog:!1}),this.sparkMat=new bn({color:14207144,transparent:!0,opacity:.9,blending:Ps,depthWrite:!1}),this.bloodMat=new bn({color:9311252,transparent:!0,opacity:.85,depthWrite:!1}),this.fireMat=new bn({color:16757575,transparent:!0,opacity:.95,blending:Ps,depthWrite:!1}),this.debrisMat=new bn({color:7035712}),this.smokeMat=new bn({color:2762274,transparent:!0,opacity:.6,depthWrite:!1})}spawn(e,t,i,r,s,o){const a=new Je(t,i);a.position.copy(r),this.scene.add(a);const l={mesh:a,life:0,ttl:s,vel:o,kind:e};return this.items.push(l),l}tracer(e,t){const i=new F().subVectors(t,e),r=i.length();if(r<.2)return;const s=new Pt(.035,.035,r),o=this.spawn("tracer",s,this.tracerMat,e.clone().addScaledVector(i,.5),.055);o.mesh.lookAt(t),o.mesh.visible=!0}impact(e,t,i){const r=new Wi(.09,6,5);this.spawn("puff",r,this.sparkMat,new F(e,t,i),.16);for(let s=0;s<3;s++){const o=new Pt(.05,.05,.05),a=new F((Math.random()-.5)*4,Math.random()*3+1,(Math.random()-.5)*4);this.spawn("debris",o,this.debrisMat,new F(e,t,i),.5,a)}}blood(e,t,i,r=!1){const s=new Wi(r?.2:.12,6,5);this.spawn("blood",s,this.bloodMat,new F(e,t,i),r?.3:.22)}muzzle(e,t,i,r=1){const s=new Wi(.11*r,6,5);this.spawn("muzzle",s,this.fireMat,new F(e,t,i),.05).mesh.scale.set(1.4,1.1,1.9),this.flash(e+.1,t,i,2.2*r,.05)}explosion(e,t,i){const r=new Wi(2.4,12,10);this.spawn("boom",r,this.fireMat,new F(e,t+1,i),.75).mesh.scale.set(.4,.4,.4);const o=new Wi(3.4,10,8);this.spawn("smoke",o,this.smokeMat,new F(e,t+2.2,i),2.4).mesh.scale.set(.3,.3,.3),this.flash(e,t+2,i,14,.5);for(let l=0;l<16;l++){const c=new Pt(.16,.16,.16),u=new F((Math.random()-.5)*16,Math.random()*11+2,(Math.random()-.5)*16);this.spawn("debris",c,this.debrisMat,new F(e,t+.6,i),1.6,u)}}flash(e,t,i,r,s){if(this.lights.length>5)return;const o=new Tv(16760938,r,26,2);o.position.set(e,t,i),this.scene.add(o),this.lights.push({light:o,life:0}),this.lights[this.lights.length-1].life=-s}update(e){for(let t=this.items.length-1;t>=0;t--){const i=this.items[t];i.life+=e;const r=i.life/i.ttl;if(r>=1){this.scene.remove(i.mesh),i.mesh.geometry.dispose(),this.items.splice(t,1);continue}if(i.kind==="tracer")i.mesh.material.opacity=.9*(1-r);else if(i.kind==="puff"||i.kind==="blood"){const s=1+r*2.6;i.mesh.scale.set(s,s,s),i.mesh.material.opacity=.85*(1-r)}else if(i.kind==="muzzle")i.mesh.material.opacity=1-r;else if(i.kind==="debris")i.vel.y-=14*e,i.mesh.position.addScaledVector(i.vel,e),i.mesh.rotation.x+=e*7,i.mesh.rotation.z+=e*5,i.mesh.position.y<.05&&(i.mesh.position.y=.05,i.vel.multiplyScalar(.4),i.vel.y=0);else if(i.kind==="boom"){const s=.4+r*2.2;i.mesh.scale.set(s,s*.8,s),i.mesh.material.opacity=1-r}else if(i.kind==="smoke"){const s=.3+r*1.6;i.mesh.scale.set(s,s*.7,s),i.mesh.position.y+=e*1.2,i.mesh.material.opacity=.55*(1-r)}}for(let t=this.lights.length-1;t>=0;t--){const i=this.lights[t];i.life+=e,i.life>=0&&(i.light.intensity=Math.max(0,i.light.intensity*(1-e*14)),i.light.intensity<.15&&(this.scene.remove(i.light),i.light.dispose(),this.lights.splice(t,1)))}}clear(){for(const e of this.items)this.scene.remove(e.mesh),e.mesh.geometry.dispose();this.items.length=0;for(const e of this.lights)this.scene.remove(e.light),e.light.dispose();this.lights.length=0}}function Fe(n,e,t,i,r,s=0,o=0,a=0,l=0,c=0,u=0){const h=new Je(new Pt(e,t,i),r);return h.position.set(s,o,a),h.rotation.set(l,c,u),n.add(h),h}const t2=2040102,n2=5001304,i2=8146728,r2=4213308,s2=12831443,o2=12618590;function a2(n){const e=new ht,t=rt(t2),i=rt(n2),r=rt(i2),s=rt(r2),o=rt(s2),a=rt(o2),l=rt(1447706);n==="ak47"?(Fe(e,.055,.085,.5,t,0,0,-.12),Fe(e,.035,.035,.42,i,0,.008,-.5),Fe(e,.05,.06,.3,r,0,-.005,-.44),Fe(e,.05,.11,.24,r,0,-.045,.16),Fe(e,.045,.17,.08,t,0,-.115,-.16,.32),Fe(e,.04,.13,.05,l,0,-.1,.04,.28),Fe(e,.018,.05,.018,t,0,.06,-.66),Fe(e,.05,.03,.1,t,0,.055,-.05)):n==="m4a4"?(Fe(e,.055,.085,.46,t,0,0,-.1),Fe(e,.035,.035,.4,i,0,.008,-.48),Fe(e,.05,.055,.3,t,0,0,-.42),Fe(e,.05,.1,.2,t,0,-.03,.18),Fe(e,.045,.16,.07,l,0,-.11,-.12,.12),Fe(e,.04,.12,.05,l,0,-.1,.06,.25),Fe(e,.03,.04,.26,t,0,.065,-.12),Fe(e,.02,.045,.02,t,0,.1,-.2)):n==="awp"?(Fe(e,.06,.1,.62,s,0,0,-.14),Fe(e,.04,.04,.62,t,0,.01,-.66),Fe(e,.06,.13,.26,s,0,-.04,.22),Fe(e,.05,.055,.34,t,0,.095,-.2),Fe(e,.065,.065,.05,t,0,.095,-.39),Fe(e,.045,.12,.055,l,0,-.1,.02,.3),Fe(e,.04,.04,.2,s,0,-.065,-.3)):n==="deagle"?(Fe(e,.045,.075,.26,i,0,0,-.12),Fe(e,.04,.11,.055,l,0,-.08,0,.3),Fe(e,.02,.025,.04,t,0,.045,-.24)):n==="glock"||n==="usp"?(Fe(e,.04,.065,.24,rt(n==="glock"?2303531:2895928),0,0,-.1),Fe(e,.038,.1,.05,l,0,-.07,0,.32),n==="usp"&&Fe(e,.045,.045,.12,t,0,.005,-.26),Fe(e,.016,.02,.03,t,0,.04,-.2)):n==="knife"&&(Fe(e,.028,.045,.26,o,0,.01,-.2),Fe(e,.028,.05,.04,i,0,.012,-.05),Fe(e,.032,.06,.12,l,0,0,.03)),n!=="knife"?(Fe(e,.075,.075,.14,a,.005,-.075,.035,.25),Fe(e,.07,.07,.26,rt(4867128),.015,-.1,.16,.5,-.12),Fe(e,.07,.07,.12,a,-.015,-.055,-.36,.1,.2),Fe(e,.07,.07,.24,rt(4867128),-.06,-.11,-.2,.45,.4)):(Fe(e,.075,.075,.14,a,0,-.03,.05),Fe(e,.07,.07,.24,rt(4867128),.02,-.07,.16,.5,-.1));const c=n==="awp"?-.95:n==="ak47"?-.7:n==="m4a4"?-.68:n==="knife"?-.3:-.28,u=new kt;return u.position.set(0,.01,c),e.add(u),e.userData.muzzle=u,e}class l2{constructor(e){P(this,"root",new ht);P(this,"model",null);P(this,"id","");P(this,"kickAmt",0);P(this,"bobT",0);P(this,"swingT",-1);P(this,"muzzleFlash");P(this,"flashLight");this.root.position.set(.2,-.19,-.34),this.root.rotation.set(0,.05,0),this.root.scale.setScalar(.82),e.add(this.root);const t=new Ks(.3,.3);this.muzzleFlash=new Je(t,new bn({color:16765562,transparent:!0,opacity:0,blending:Ps,depthWrite:!1,fog:!1})),this.flashLight=new Tv(16760938,0,9,2),this.root.add(this.muzzleFlash,this.flashLight)}setWeapon(e){this.id!==e&&(this.id=e,this.model&&(this.root.remove(this.model),this.model=null),!(!e||!_n[e])&&(this.model=a2(e),this.model.visible=!0,this.root.add(this.model),this.kickAmt=.4))}onShot(){this.kickAmt=1}onSwing(){this.swingT=0}flash(){if(!this.model)return;const e=this.model.userData.muzzle;e&&(this.muzzleFlash.position.copy(e.position),this.muzzleFlash.position.z-=.06,this.muzzleFlash.rotation.z=Math.random()*Math.PI,this.flashLight.position.copy(this.muzzleFlash.position));const t=this.muzzleFlash.material;t.opacity=.95;const i=.7+Math.random()*.5;this.muzzleFlash.scale.set(i,i,i),this.flashLight.intensity=2.4}update(e,t){this.kickAmt=Math.max(0,this.kickAmt-e*7),this.swingT>=0&&(this.swingT+=e,this.swingT>.35&&(this.swingT=-1));const i=this.muzzleFlash.material;i.opacity=Math.max(0,i.opacity-e*14),this.flashLight.intensity=Math.max(0,this.flashLight.intensity-e*40),this.bobT+=e*(2+t.speed*1.9);const r=Math.min(1,t.speed/5.6)*(t.grounded?1:.2),s=Math.cos(this.bobT)*.014*r,o=Math.abs(Math.sin(this.bobT))*.012*r,a=Wh.clamp(t.swayX,-.06,.06),l=Wh.clamp(t.swayY,-.05,.05),c=this.kickAmt*this.kickAmt;let u=.22+s-a*.6,h=-.22+o+l*.5-c*.012,d=-.38+c*.07,p=c*.16+l*.8,_=.05-a*.8,x=0;if(t.drawProgress<1){const m=1-t.drawProgress;h-=m*.35,p+=m*.9,u+=m*.1}if(t.reloadProgress>=0){const m=t.reloadProgress,f=Math.sin(Math.PI*Math.min(1,m*1.05));h-=f*.16,p+=f*.75,x+=f*.4,u-=f*.04}if(this.swingT>=0){const m=this.swingT/.35,f=Math.sin(m*Math.PI);p-=f*1.1,u-=f*.16,h-=f*.05,x-=f*.5}h+=t.crouch*.02,this.root.position.set(u,h,d),this.root.rotation.set(p,_,x),this.model&&(this.model.visible=!t.scoped)}}class c2{constructor(e){P(this,"keys",new Set);P(this,"pressed",new Set);P(this,"mouseDX",0);P(this,"mouseDY",0);P(this,"fireHeld",!1);P(this,"firePressed",!1);P(this,"rmbHeld",!1);P(this,"rmbPressed",!1);P(this,"wheel",0);P(this,"locked",!1);P(this,"sensitivity",.0021);P(this,"enabled",!0);P(this,"el");P(this,"handlers",[]);P(this,"wheelFn",null);this.el=e;const t=(r,s,o)=>{r.addEventListener(s,o),this.handlers.push([s,o])};t(window,"keydown",r=>{const s=r;if(s.repeat)return;const o=s.code;["Tab","Space","KeyE"].includes(o)&&s.preventDefault(),this.keys.add(o),this.pressed.add(o)}),t(window,"keyup",r=>{this.keys.delete(r.code)}),t(window,"blur",()=>{this.keys.clear(),this.fireHeld=!1,this.rmbHeld=!1}),t(e,"mousedown",r=>{const s=r;this.locked&&(s.button===0&&(this.fireHeld=!0,this.firePressed=!0),s.button===2&&(this.rmbHeld=!0,this.rmbPressed=!0))}),t(window,"mouseup",r=>{const s=r;s.button===0&&(this.fireHeld=!1),s.button===2&&(this.rmbHeld=!1)}),t(e,"contextmenu",r=>r.preventDefault()),t(window,"mousemove",r=>{if(!this.locked||!this.enabled)return;const s=r;this.mouseDX+=s.movementX*this.sensitivity,this.mouseDY+=s.movementY*this.sensitivity});const i=r=>{this.locked&&(this.wheel+=Math.sign(r.deltaY),r.preventDefault())};e.addEventListener("wheel",i,{passive:!1}),this.wheelFn=i,t(document,"pointerlockchange",()=>{this.locked=document.pointerLockElement===this.el,this.locked||(this.keys.clear(),this.fireHeld=!1,this.rmbHeld=!1)})}requestLock(){const e=this.el.requestPointerLock();e&&typeof e.catch=="function"&&e.catch(()=>{})}releaseLock(){document.pointerLockElement===this.el&&document.exitPointerLock()}consumeMouse(){const e=[this.mouseDX,this.mouseDY];return this.mouseDX=0,this.mouseDY=0,e}consumePressed(){const e=new Set(this.pressed);return this.pressed.clear(),e}consumeFire(){const e=this.firePressed;return this.firePressed=!1,e}consumeRmb(){const e=this.rmbPressed;return this.rmbPressed=!1,e}consumeWheel(){const e=this.wheel;return this.wheel=0,e}dispose(){for(const[e,t]of this.handlers)(e==="contextmenu"||e==="mousedown"?this.el:window).removeEventListener(e,t);this.wheelFn&&this.el.removeEventListener("wheel",this.wheelFn),this.handlers=[]}}class u2{constructor(e,t){P(this,"ctx");P(this,"base");P(this,"scale");P(this,"world");P(this,"frame",0);this.canvas=e,this.world=t,this.ctx=e.getContext("2d");const i=t.gx*1.5,r=t.gz*1.5;this.scale=e.width/Math.max(i,r*(e.width/e.height)),this.base=document.createElement("canvas"),this.base.width=e.width,this.base.height=e.height;const s=this.base.getContext("2d");s.fillStyle="rgba(12,14,18,0.82)",s.fillRect(0,0,e.width,e.height);const o=this.scale;for(let a=0;a<t.gz;a++)for(let l=0;l<t.gx;l++){const c=a*t.gx+l;if(t.solid[c])continue;const u=t.height[c],h=t.zone[c];let d=u>.3?"#c7ab74":"#d8c193";h===1&&(d="#cbb87a"),h===2&&(d="#c2b478"),s.fillStyle=d,s.fillRect(l*1.5*o-.4,a*1.5*o-.4,1.5*o+.8,1.5*o+.8)}s.font=`bold ${Math.round(9*o)}px Arial`,s.textAlign="center",s.textBaseline="middle",s.fillStyle="rgba(40,30,10,0.75)";for(const a of[Ms,Ss]){const l=this.toCanvas(a.cx,a.cz);s.fillText(a.name,l.x,l.y)}}toCanvas(e,t){return{x:(e-this.world.minX)*this.scale,y:(t-this.world.minZ)*this.scale}}draw(e){if((this.frame++&1)===1)return;const t=this.ctx,{width:i,height:r}=this.canvas;t.clearRect(0,0,i,r),t.drawImage(this.base,0,0),this.scale;const s=(u,h,d,p=3.4,_=!1)=>{const x=this.toCanvas(u,h);t.beginPath(),t.arc(x.x,x.y,p,0,Math.PI*2),_?(t.fillStyle=d,t.fill(),t.lineWidth=1.2,t.strokeStyle="rgba(0,0,0,0.6)",t.stroke()):(t.fillStyle=d,t.fill())},o=e.time,a=e.controlled.team,l=e.bomb;if(l.state==="dropped"&&s(l.x,l.z,"#ff9d2e",3.2,!0),l.state==="planted"){const u=.5+.5*Math.sin(o*8);s(l.x,l.z,`rgba(255,120,40,${.5+u*.5})`,4.5+u*2,!0)}for(const u of e.characters){if(!u.alive)continue;const h=u.team===a;!h&&o-u.spottedAt>2.5||u!==e.controlled&&s(u.x,u.z,h?u.team==="CT"?"#5aa9ff":"#ffd35c":"#ff5545",3.2,!0)}const c=e.controlled;if(c.alive){const u=this.toCanvas(c.x,c.z);t.save(),t.translate(u.x,u.y),t.rotate(Math.atan2(Math.sin(c.yaw),Math.cos(c.yaw))),t.rotate(Math.PI-c.yaw),t.beginPath(),t.moveTo(0,-6),t.lineTo(4.4,5),t.lineTo(0,2.6),t.lineTo(-4.4,5),t.closePath(),t.fillStyle="#ffffff",t.strokeStyle="rgba(0,0,0,0.7)",t.lineWidth=1.2,t.fill(),t.stroke(),t.restore()}}}const xu=5,h2=115,yu=40,f2=5.5,Rm=3.2,d2=10,bm=8,p2=[["long_doors","long_hall","a_cross"],["top_mid","catwalk","short"]],m2=[["upper_tunnels","b_tunnels","b_tunnel_mouth"]],g2={A:["a_hold_1","a_hold_2","short_hold"],MID:["mid_ct_hold"],B:["b_hold_1","b_hold_2","b_doors"]};class v2{constructor(e){P(this,"world",new IT);P(this,"scene",new AT);P(this,"camera");P(this,"renderer");P(this,"bridge");P(this,"opts");P(this,"characters",[]);P(this,"player");P(this,"controlled");P(this,"brains",[]);P(this,"time",0);P(this,"phase","freeze");P(this,"phaseEnd",xu);P(this,"round",1);P(this,"scoreT",0);P(this,"scoreCT",0);P(this,"roundResult",null);P(this,"roundReason","");P(this,"tacticSite","A");P(this,"bomb",{state:"none",carrier:null,x:0,y:0,z:0,site:null,timer:0,nextBeep:0});P(this,"killfeed",[]);P(this,"message",null);P(this,"messageSub",null);P(this,"messageUntil",0);P(this,"killId",1);P(this,"staticWorld");P(this,"effects");P(this,"viewModel");P(this,"input");P(this,"minimap");P(this,"bombMesh");P(this,"packMesh");P(this,"raf",0);P(this,"watchdog",0);P(this,"lastFrame",0);P(this,"hudAccum",0);P(this,"fps",60);P(this,"shake",0);P(this,"speed",1);P(this,"renderEnabled",!0);P(this,"stats",{plants:0,defuses:0,kills:0,explosions:0,timeOuts:0,wipes:0});P(this,"routes",new Map);P(this,"defence",new Map);P(this,"specTarget",null);P(this,"onResize",()=>{const e=window.innerWidth,t=window.innerHeight;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()});P(this,"loopFn",e=>{this.raf=requestAnimationFrame(this.loopFn);let t=(e-this.lastFrame)/1e3;this.lastFrame=e,!(t<=0)&&this.runFrame(t)});P(this,"watchFn",()=>{const e=performance.now();if(e-this.lastFrame<90)return;const t=Math.min(.05,(e-this.lastFrame)/1e3);this.lastFrame=e,this.runFrame(t)});P(this,"lastSlot","secondary");P(this,"vmDrawStart",-9);P(this,"lookDX",0);P(this,"lookDY",0);this.opts=e,this.bridge=e.bridge,this.renderer=new TT({canvas:e.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Xg,this.camera=new xn(78,1,.06,700),this.camera.rotation.order="YXZ",this.scene.add(this.camera),this.staticWorld=ZT(this.scene,this.world),JT(this.scene,this.world),this.effects=new e2(this.scene),this.input=new c2(e.canvas),this.viewModel=new l2(this.camera),this.minimap=new u2(e.minimap,this.world),this.bombMesh=new ht;const t=new Je(new Pt(.36,.14,.26),new Pn({color:2829096}));t.position.y=.07,t.castShadow=!0;const i=new Je(new Pt(.06,.05,.06),new bn({color:16720384}));i.position.set(.1,.16,0);const r=new Je(new Pt(.3,.03,.03),new Pn({color:11149858}));r.position.set(-.02,.15,.08),this.bombMesh.add(t,i,r),this.bombMesh.visible=!1,this.bombMesh.userData.led=i,this.scene.add(this.bombMesh),this.packMesh=new ht;const s=new Je(new Pt(.3,.36,.14),new Pn({color:5916210}));s.position.set(0,.05,-.2);const o=new Je(new Pt(.31,.06,.15),new Pn({color:3024153}));this.packMesh.add(s,o),this.packMesh.visible=!1,this.setupTeams(),this.startRound(!0),this.onResize(),window.addEventListener("resize",this.onResize)}setupTeams(){const e=this.opts.team,t=e==="T"?"CT":"T";this.player=new Am(e,"You"),this.player.isPlayer=!0,this.characters.push(this.player);for(let i=0;i<4;i++)this.characters.push(this.makeBot(e,i));for(let i=0;i<5;i++)this.characters.push(this.makeBot(t,i+5));for(const i of this.characters)this.scene.add(i.humanoid.root);this.controlled=this.player}makeBot(e,t){const i=e==="T"?["Phoenix","Viper","Blaze","Wolf","Cobra","Ghost"]:["Falcon","Rex","Storm","Havoc","Dagger","Ace"],r=new Am(e,`${i[t%i.length]}`),s=new XT(r,this);return r.brain=s,this.brains.push(s),r}spawnPoint(e,t){const i=e==="T"?["t_spawn_1","t_spawn_2","t_spawn_3","t_spawn_4","t_spawn_2"]:["ct_spawn_1","ct_spawn_2","ct_spawn_3","ct_spawn_4","ct_spawn_1"],r=bo[i[t%i.length]];return this.world.randomOpenPoint(r.x,r.z,5)??{x:r.x,z:r.z}}startRound(e=!1){this.phase="freeze",this.phaseEnd=this.time+(e?xu+1.5:xu),this.roundResult=null,this.roundReason="",this.stats.timeOuts+=0,this.bomb={state:"none",carrier:null,x:0,y:0,z:0,site:null,timer:0,nextBeep:0},this.effects.clear(),this.specTarget=null,this.controlled=this.player,this.viewModel.setWeapon(""),this.tacticSite=Math.random()<.5?"A":"B";const t=this.characters.filter(u=>u.team==="T"),i=this.characters.filter(u=>u.team==="CT");this.routes.clear(),this.defence.clear();const r=this.tacticSite==="A"?p2:m2;t.forEach((u,h)=>this.routes.set(u,r[h%r.length]));const s=["A","A","MID","B","B"];i.forEach((u,h)=>{const d=s[h%s.length],p=g2[d];this.defence.set(u,p[h%p.length])});const o=this.characters.filter(u=>u.team==="T"&&u.brain),a=o[Math.floor(Math.random()*o.length)];let l=0,c=0;for(const u of this.characters){const h=NT(u.team,this.round);u.giveLoadout(h.primary,h.secondary,h.armor,h.helmet),u.hasC4=!1,u.health=100,u.alive=!0,u.deadTime=0,u.busyAction="none",u.plantProgress=0,u.crouch=!1,u.crouchAmt=0,u.walk=!1,u.scoped=!1,u.vx=u.vy=u.vz=0,u.firing=!1,u.humanoid.clearFlash();const d=this.spawnPoint(u.team,u.team==="T"?l++:c++);u.x=d.x,u.z=d.z,u.y=this.world.groundBaseAt(u.x,u.z)+.02,u.yaw=u.team==="T"?Math.PI*.05:Math.PI,u.pitch=0,u.humanoid.root.visible=!0,u.brain&&(u.brain.reset(),u.brain.holdSpotName=this.defence.get(u)??u.brain.holdSpotName)}for(const u of this.brains)u.paused=!1;a.hasC4=!0,this.bomb.state="carried",this.bomb.carrier=a,this.bombMesh.visible=!1,this.packMesh.visible=!0,this.showMessage(`第 ${this.round} 回合`,this.round===1?"手枪局 — 只有手枪与刀":this.opts.team==="T"?`进攻 ${this.tacticSite} 点`:"防守 A / B",3.2),ke.roundStart(),this.pushHud(!0)}endRound(e,t){if(this.phase==="over"||this.phase==="matchover")return;this.phase="over",this.phaseEnd=this.time+f2,this.roundResult=e,this.roundReason=t,e==="T"?this.scoreT++:this.scoreCT++;for(const r of this.characters)r.busyAction="none",r.firing=!1;e===this.opts.team?ke.win():ke.lose(),this.showMessage(e==="T"?"恐怖分子获胜":"反恐精英获胜",t,4.5),(this.scoreT>=bm||this.scoreCT>=bm)&&(this.phase="matchover"),this.pushHud(!0)}restartMatch(){this.scoreT=0,this.scoreCT=0,this.round=1,this.startRound(!0)}showMessage(e,t,i){this.message=e,this.messageSub=t,this.messageUntil=this.time+i}start(){this.lastFrame=performance.now(),this.raf=requestAnimationFrame(this.loopFn),this.watchdog=window.setInterval(this.watchFn,16)}runFrame(e){e>.05&&(e=.05),this.fps=this.fps*.92+1/e*.08;const t=Math.max(1,Math.min(10,Math.round(this.speed)));for(let i=0;i<t;i++)this.update(e);this.renderEnabled&&this.renderer.render(this.scene,this.camera)}stop(){cancelAnimationFrame(this.raf),clearInterval(this.watchdog),window.removeEventListener("resize",this.onResize),this.input.dispose(),this.staticWorld.dispose(),this.renderer.dispose()}update(e){this.time+=e;const t=this.phase;this.phase==="freeze"&&this.time>=this.phaseEnd?(this.phase="live",this.phaseEnd=this.time+h2,this.showMessage("开始行动",null,1.6)):this.phase==="live"&&this.time>=this.phaseEnd?this.bomb.state!=="planted"&&this.endRound("CT","回合时间耗尽"):this.phase==="over"&&this.time>=this.phaseEnd&&this.phase==="over"&&(this.round++,this.startRound());const i=this.phase==="freeze"||this.phase==="over"||this.phase==="matchover";this.handlePlayerInput(e,i);for(const s of this.brains)s.paused||s.update(e,this.time);for(const s of this.characters)i&&(s.moveFwd=0,s.moveSide=0,s.firing=!1,s.wantJump=!1),s.alive&&!i&&s.tryFire(this.time,this),s.update(e,this.world,this.time),s.syncModel(e);this.separateBodies(),this.updateActions(e),this.updateBomb(e),this.checkRoundState();const r=this.characters.find(s=>s.hasC4&&s.alive);if(r&&this.packMesh.parent!==r.humanoid.body?(r.humanoid.body.add(this.packMesh),this.packMesh.visible=!0):r||(this.packMesh.visible=!1),this.bomb.state==="dropped"){for(const s of this.characters)if(!(!s.alive||s.team!=="T")&&Math.hypot(s.x-this.bomb.x,s.z-this.bomb.z)<1.3){this.pickupBomb(s);break}}this.controlled.alive||(this.controlled!==this.player&&this.controlled.brain&&(this.controlled.brain.paused=!1),this.controlled=this.player,this.cycleSpectate(1)),this.effects.update(e),this.updateCamera(e),this.renderEnabled&&this.minimap.draw(this),this.hudAccum+=e,(this.hudAccum>.1||t!==this.phase)&&(this.hudAccum=0,this.pushHud()),t!==this.phase&&this.pushHud(!0)}handlePlayerInput(e,t){const i=this.input,r=i.consumePressed(),s=this.controlled;if(!s.alive){s.firing=!1,i.consumeFire()&&this.cycleSpectate(1),r.has("KeyF")&&this.possessSpecTarget(),r.has("Space")&&this.cycleSpectate(1);return}const[o,a]=i.consumeMouse();this.lookDX=o,this.lookDY=a;const l=s.scoped&&s.weaponDef.scope?s.weaponDef.scope.sensMult:1;if(s.yaw-=o*l,s.pitch=en(s.pitch-a*l,-1.45,1.45),t){s.moveFwd=0,s.moveSide=0,s.firing=!1;return}const c=i.keys;if(s.moveFwd=(c.has("KeyW")?1:0)-(c.has("KeyS")?1:0),s.moveSide=(c.has("KeyD")?1:0)-(c.has("KeyA")?1:0),s.walk=c.has("ShiftLeft")||c.has("ShiftRight"),s.crouch=c.has("ControlLeft")||c.has("KeyC"),r.has("Space")&&(s.wantJump=!0),r.has("Digit1")&&s.hasSlot("primary")&&(this.lastSlot=s.slot,s.switchSlot("primary",this.time)),r.has("Digit2")&&s.hasSlot("secondary")&&(this.lastSlot=s.slot,s.switchSlot("secondary",this.time)),r.has("Digit3")&&(this.lastSlot=s.slot,s.switchSlot("melee",this.time)),r.has("KeyQ")){const p=this.lastSlot;this.lastSlot=s.slot,s.switchSlot(p,this.time)}const u=i.consumeWheel();u!==0&&(this.lastSlot=s.slot,s.nextSlot(u>0?1:-1,this.time)),r.has("KeyR")&&s.startReload(this.time);const h=s.weaponDef;i.consumeRmb()&&h.scope&&(s.scoped=!s.scoped,s.scoped?ke.scopeIn():ke.scopeOut()),!h.scope&&s.scoped&&(s.scoped=!1),s.slot!=="primary"&&s.scoped&&(s.scoped=!1,ke.scopeOut());const d=c.has("KeyE");this.canPlant(s)&&d?s.busyAction!=="plant"&&(s.busyAction="plant",s.plantProgress=0):this.canDefuse(s)&&d?s.busyAction!=="defuse"&&(s.busyAction="defuse",s.plantProgress=0):!s.brain&&s.busyAction!=="none"&&(s.busyAction="none",s.plantProgress=0),s.firing=i.fireHeld,i.consumeFire()&&(s.semiLatch=!1),this.viewModel.id!==s.current().id&&(this.viewModel.setWeapon(s.current().id),this.vmDrawStart=this.time)}canPlant(e){return e.alive&&e.team==="T"&&e.hasC4&&this.phase==="live"&&vu(e.x,e.z)!==null}canDefuse(e){return e.alive&&e.team==="CT"&&this.bomb.state==="planted"&&Math.hypot(e.x-this.bomb.x,e.z-this.bomb.z)<2}inSiteOf(e){return vu(e.x,e.z)}updateActions(e){for(const t of this.characters){if(t.busyAction==="none"||!t.alive){t.alive||(t.busyAction="none");continue}if(t.busyAction==="plant"){if(!this.canPlant(t)){t.busyAction="none",t.plantProgress=0;continue}t.plantProgress+=e/Rm,Math.floor(t.plantProgress*8)!==Math.floor((t.plantProgress-e/Rm)*8)&&ke.plantBeep(),t.plantProgress>=1&&this.plantBomb(t)}else if(t.busyAction==="defuse"){if(!this.canDefuse(t)){t.busyAction="none",t.plantProgress=0;continue}const i=t.plantProgress;t.plantProgress+=e/d2,Math.floor(t.plantProgress*6)!==Math.floor(i*6)&&ke.defuseTick(),t.plantProgress>=1&&this.defuseBomb(t)}}}plantBomb(e){this.stats.plants++,e.busyAction="none",e.plantProgress=0,e.hasC4=!1,e.crouch=!1,this.bomb.state="planted",this.bomb.site=vu(e.x,e.z),this.bomb.x=e.x+Math.sin(e.yaw)*.5,this.bomb.z=e.z+Math.cos(e.yaw)*.5,this.bomb.y=this.world.groundBaseAt(this.bomb.x,this.bomb.z),this.bomb.timer=yu,this.bomb.nextBeep=this.time,this.bombMesh.position.set(this.bomb.x,this.bomb.y,this.bomb.z),this.bombMesh.visible=!0,this.phase="planted",this.phaseEnd=this.time+yu,ke.bombPlanted(),this.showMessage("C4 已安放",`${this.bomb.site} 点 — 40 秒`,3),this.pushHud(!0)}defuseBomb(e){this.stats.defuses++,e.busyAction="none",e.plantProgress=0,this.bomb.state="defused",this.bombMesh.visible=!1,ke.bombDefused(),this.endRound("CT","C4 已被拆除")}explodeBomb(){this.stats.explosions++,this.bomb.state="exploded",this.bombMesh.visible=!1,this.effects.explosion(this.bomb.x,this.bomb.y,this.bomb.z),ke.explosion(this.bomb.x,this.bomb.z),this.shake=1.2;for(const e of this.characters){if(!e.alive)continue;const t=Math.hypot(e.x-this.bomb.x,e.z-this.bomb.z);if(t<16){const i=520*(1-t/16);i>0&&e.takeDamage(i,"chest",null,"ak47",this.time)}}this.endRound("T","C4 爆炸")}pickupBomb(e){this.bomb.state="carried",this.bomb.carrier=e,e.hasC4=!0,this.bombMesh.visible=!1,ke.draw(),e===this.controlled&&this.showMessage("已拾取 C4",null,1.5)}updateBomb(e){const t=this.bomb;if(t.state==="planted"){t.timer-=e;const i=1-t.timer/yu;this.time>=t.nextBeep&&(ke.bombBeep(t.x,t.z,i>.7),t.nextBeep=this.time+Math.max(.12,1-i*.88)),this.bombMesh.userData.led.material.color.setHex(Math.sin(this.time*(6+i*22))>0?16720384:3342336),t.timer<=0&&this.explodeBomb()}else t.state==="dropped"&&(this.bombMesh.visible=!0,this.bombMesh.position.set(t.x,t.y,t.z))}fireBullet(e,t,i,r,s,o,a,l){let u=400,h=null,d="chest";for(const f of this.world.colliders){const g=Av(t,i,r,s,o,a,f,u);g!==null&&g<u&&(u=g,h=null)}for(const f of this.characters)if(!(!f.alive||f===e||f.team===e.team||Math.hypot(f.x-t,f.z-r)>Math.min(u+2,120)))for(const v of f.hitboxes()){const M=WT(t,i,r,s,o,a,v,u);M!==null&&M<u&&(u=M,h=f,d=v.region)}const p=t+s*u,_=i+o*u,x=r+a*u,m=i-.1;if(this.effects.tracer(new F(t+s*.7,m+o*.7,r+a*.7),new F(p,_,x)),h){const f=Math.pow(l.rangeMod,u/10),g=l.damage*f*l.mult[d],v=h.alive,M=h.takeDamage(g,d,e,l.id,this.time);this.effects.blood(p,_,x,d==="head"||d==="chest"),ke.blood(p,x),e===this.controlled&&(ke.hitConfirm(d==="head"),M&&v&&ke.kill()),M&&this.onKill(e,h,l,d==="head"),h===this.controlled&&(ke.hurt(),this.shake=Math.min(.5,this.shake+g*.004)),h.brain&&h.brain.target==null&&(h.brain.lastKnownEnemy={x:e.x,z:e.z})}else u<400&&(this.effects.impact(p,_,x),ke.bulletImpact(p,x));if(e!==this.controlled){const f=this.controlled.x-t,g=this.controlled.eyeY()-i,v=this.controlled.z-r,M=f*s+g*o+v*a;if(M>0&&M<u){const b=t+s*M-this.controlled.x,A=i+o*M-this.controlled.eyeY(),T=r+a*M-this.controlled.z;Math.hypot(b,A,T)<1.4&&ke.bulletWhizz()}}}meleeAttack(e,t){ke.knifeSwing(),e===this.controlled&&this.viewModel.onSwing();const[i,r,s]=e.aimDir();let o=null,a=t.melee.range;for(const l of this.characters){if(!l.alive||l===e||l.team===e.team)continue;const c=l.x-e.x,u=l.y+1.2-e.eyeY(),h=l.z-e.z,d=Math.hypot(c,u,h);d>a||(c*i+u*r+h*s)/Math.max(.001,d)<.55||(o=l,a=d)}if(o){const l=o.takeDamage(t.damage,"chest",e,t.id,this.time);this.effects.blood(o.x,o.y+1.2,o.z),ke.knifeHit(o.x,o.z),e===this.controlled&&(ke.hitConfirm(!1),l&&ke.kill()),l&&this.onKill(e,o,t,!1),o.brain&&!o.brain.target&&(o.brain.lastKnownEnemy={x:e.x,z:e.z})}}onShotFired(e,t){if(e===this.controlled)this.viewModel.onShot(),this.viewModel.flash();else{const[i,r,s]=e.aimDir();this.effects.muzzle(e.x+i*.7,e.eyeY()-.12+r*.7,e.z+s*.7,t.id==="awp"?1.4:1)}this.markSpotted(e),e.spottedAt=this.time}onKill(e,t,i,r){t.hasC4=!1,this.bomb.state==="carried"&&this.bomb.carrier===t&&(this.bomb.state="dropped",this.bomb.carrier=null,this.bomb.x=t.x,this.bomb.z=t.z,this.bomb.y=this.world.groundBaseAt(t.x,t.z)+.02,this.bombMesh.position.set(this.bomb.x,this.bomb.y,this.bomb.z),this.bombMesh.visible=!0,this.packMesh.visible=!1),this.stats.kills++,this.killfeed.push({id:this.killId++,killer:e?e.name:"C4",killerTeam:e?e.team:t.team==="T"?"CT":"T",victim:t.name,victimTeam:t.team,weapon:i.name,headshot:r,t:this.time}),this.killfeed.length>6&&this.killfeed.shift()}canSee(e,t){return!t.alive||Math.hypot(t.x-e.x,t.z-e.z)>58?!1:this.world.losClear(e.x,e.eyeY(),e.z,t.x,t.eyeY(),t.z)}markSpotted(e){e.spottedAt=this.time}nearestTToBomb(){let e=null,t=1/0;for(const i of this.characters){if(!i.alive||i.team!=="T"||i.hasC4)continue;const r=Math.hypot(i.x-this.bomb.x,i.z-this.bomb.z);r<t&&(t=r,e=i)}return e}nextRouteWaypoint(e){const t=this.routes.get(e);if(!t)return null;for(const i of t){const r=bo[i];if(Math.hypot(e.x-r.x,e.z-r.z)>9)return{x:r.x,z:r.z}}return null}assignDefenceSpot(e){return this.defence.get(e)??"mid_ct_hold"}separateBodies(){const e=this.characters.filter(t=>t.alive);for(let t=0;t<e.length;t++)for(let i=t+1;i<e.length;i++){const r=e[t],s=e[i],o=s.x-r.x,a=s.z-r.z,l=Math.hypot(o,a);if(l>.78||l<1e-4)continue;const c=(.78-l)*.5,u=o/l,h=a/l;this.world.fits(r.x-u*c,r.z-h*c,r.y)&&(r.x-=u*c,r.z-=h*c),this.world.fits(s.x+u*c,s.z+h*c,s.y)&&(s.x+=u*c,s.z+=h*c)}}checkRoundState(){if(this.phase!=="live"&&this.phase!=="planted")return;const e=this.characters.filter(i=>i.team==="T"&&i.alive).length;this.characters.filter(i=>i.team==="CT"&&i.alive).length===0?(this.stats.wipes++,this.endRound("T","所有反恐精英被消灭")):e===0&&this.bomb.state!=="planted"&&(this.stats.wipes++,this.endRound("CT","所有恐怖分子被消灭"))}cycleSpectate(e){const t=this.characters.filter(r=>r.team===this.player.team&&r.alive&&r!==this.player);if(!t.length){this.specTarget=null;return}let i=this.specTarget?t.indexOf(this.specTarget):-1;i=(i+e+t.length)%t.length,this.specTarget=t[i],this.controlled!==this.player&&this.controlled!==this.specTarget&&this.controlled.brain&&(this.controlled.brain.paused=!1,this.controlled=this.player)}possessSpecTarget(){const e=this.specTarget;!e||!e.alive||(this.controlled.brain&&(this.controlled.brain.paused=!1),this.controlled=e,e.brain&&(e.brain.paused=!0),e.scoped=!1,ke.ui())}updateCamera(e){const t=this.controlled;!t.alive||t!==this.player&&this.player.alive;let i=t;t.alive||(i=this.specTarget&&this.specTarget.alive?this.specTarget:t,(!this.specTarget||!this.specTarget.alive)&&this.cycleSpectate(1));const r=i.alive?i.eyeY():i.y+.4;this.camera.position.set(i.x,r,i.z);const s=i.yaw+i.recoilY*.6,o=en(i.pitch+i.recoilX*.8,-1.45,1.45),a=Math.cos(o),l=new F(Math.sin(s)*a,Math.sin(o),Math.cos(s)*a);if(this.camera.lookAt(this.camera.position.clone().add(l)),this.shake>.001){this.shake=Math.max(0,this.shake-e*2.2);const d=this.shake*.14;this.camera.position.x+=(Math.random()-.5)*d,this.camera.position.y+=(Math.random()-.5)*d,this.camera.position.z+=(Math.random()-.5)*d}const c=i.weaponDef,u=i.scoped&&c.scope?c.scope.fov:78;Math.abs(this.camera.fov-u)>.05&&(this.camera.fov+=(u-this.camera.fov)*Math.min(1,e*16),this.camera.updateProjectionMatrix());const h=this.controlled.alive&&!i.scoped;this.viewModel.root.visible=h,this.controlled.alive&&this.viewModel.update(e,{speed:Math.hypot(this.controlled.vx,this.controlled.vz),grounded:this.controlled.grounded,scoped:this.controlled.scoped,reloadProgress:this.controlled.reloadEnd>0?en((this.time-this.controlled.reloadStart)/Math.max(.01,this.controlled.reloadEnd-this.controlled.reloadStart),0,1):-1,drawProgress:en((this.time-this.vmDrawStart)/.42,0,1),kick:0,swing:0,swayX:this.lookDX*.9,swayY:this.lookDY*.9,crouch:this.controlled.crouchAmt});for(const d of this.characters)d.humanoid.root.visible=d.alive?d!==i:!0;if(ke.setListener(this.camera.position.x,this.camera.position.y,this.camera.position.z,s),this.opts.crosshair){const p=6+(i.alive&&!i.scoped?i.totalSpread():0)*900;this.opts.crosshair.style.setProperty("--gap",`${p.toFixed(1)}px`),this.opts.crosshair.style.opacity=i.scoped?"0":"1"}}pushHud(e=!1){const t=this.controlled,i=t.current(),r=_n[i.id],s=this.time,o=Math.max(0,this.phase==="freeze"?this.phaseEnd-s:this.phase==="planted"?this.bomb.timer:this.phase==="live"?this.phaseEnd-s:0),a=this.characters.filter(d=>d.team==="T"&&d.alive).length,l=this.characters.filter(d=>d.team==="CT"&&d.alive).length;let c=null;t.alive&&(this.canPlant(t)?c=t.busyAction==="plant"?"正在安放 C4…":"按住 [E] 安放 C4":this.canDefuse(t)?c=t.busyAction==="defuse"?"正在拆除 C4…":"按住 [E] 拆除 C4":this.bomb.state==="dropped"&&t.team==="T"&&Math.hypot(t.x-this.bomb.x,t.z-this.bomb.z)<6&&(c="靠近即可拾取 C4"));const u=t.busyAction!=="none"?en(t.plantProgress,0,1):0,h={phase:this.phase,round:this.round,scoreT:this.scoreT,scoreCT:this.scoreCT,timeLeft:o,bombState:this.bomb.state,bombSite:this.bomb.site,bombTimer:Math.max(0,this.bomb.timer),hp:Math.ceil(t.health),armor:Math.ceil(t.armor),helmet:t.helmet,alive:t.alive,team:t.team,weaponName:r.name,weaponSlot:r.slot,mag:i.mag,reserve:i.reserve,reloading:t.reloadEnd>s,scoped:t.scoped,hasC4:t.hasC4,prompt:c,progress:u,progressLabel:t.busyAction==="plant"?"安放中":t.busyAction==="defuse"?"拆除中":null,kills:this.player.kills,deaths:this.player.deaths,aliveT:a,aliveCT:l,killfeed:this.killfeed.filter(d=>s-d.t<7),message:s<this.messageUntil?this.message:null,messageSub:s<this.messageUntil?this.messageSub:null,spectating:this.player.alive?null:t!==this.player?`接管中: ${t.name}`:this.specTarget?`观战: ${this.specTarget.name}`:"无存活队友",canTakeOver:!!(this.specTarget&&this.specTarget.alive&&t===this.player),players:this.characters.map(d=>({name:d.name,team:d.team,kills:d.kills,deaths:d.deaths,alive:d.alive,isPlayer:d===this.player,hasC4:d.hasC4,money:d.money})),roundResult:this.roundResult,roundReason:this.roundReason,owned:t===this.player,fps:Math.round(this.fps)};this.bridge.push(h)}}const _2={phase:"freeze",round:1,scoreT:0,scoreCT:0,timeLeft:0,bombState:"none",bombSite:null,bombTimer:0,hp:100,armor:0,helmet:!1,alive:!0,team:"T",weaponName:"Glock-18",weaponSlot:"secondary",mag:20,reserve:60,reloading:!1,scoped:!1,hasC4:!1,prompt:null,progress:0,progressLabel:null,kills:0,deaths:0,aliveT:5,aliveCT:5,killfeed:[],message:null,messageSub:null,spectating:null,canTakeOver:!1,players:[],roundResult:null,roundReason:"",owned:!0,fps:0};class x2{constructor(){P(this,"snapshot",_2);P(this,"listeners",new Set);P(this,"subscribe",e=>(this.listeners.add(e),()=>{this.listeners.delete(e)}));P(this,"getSnapshot",()=>this.snapshot)}push(e){this.snapshot=e;for(const t of this.listeners)t()}}function y2(n){const e=Math.max(0,Math.ceil(n));return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}function M2({k:n}){return O.jsxs("div",{className:`kf-row ${n.killerTeam==="CT"?"kf-ct":"kf-t"}`,children:[O.jsx("span",{className:"kf-name",children:n.killer}),O.jsxs("span",{className:"kf-wep",children:[n.headshot?"☠ HS":""," ",n.weapon]}),O.jsx("span",{className:`kf-name ${n.victimTeam==="CT"?"kf-ct":"kf-t"}`,children:n.victim})]})}function Pm({alive:n,total:e,color:t}){return O.jsx("div",{className:"pips",children:Array.from({length:e},(i,r)=>O.jsx("span",{className:"pip",style:{background:r<n?t:"rgba(255,255,255,0.18)"}},r))})}function S2({hud:n}){const[e,t]=ut.useState(!1);ut.useEffect(()=>{const s=a=>{a.code==="Tab"&&(a.preventDefault(),t(!0))},o=a=>{a.code==="Tab"&&t(!1)};return window.addEventListener("keydown",s),window.addEventListener("keyup",o),()=>{window.removeEventListener("keydown",s),window.removeEventListener("keyup",o)}},[]);const i=n.hp<=30,r=n.bombState==="planted";return O.jsxs("div",{className:"hud",children:[O.jsxs("div",{className:"topbar",children:[O.jsx("div",{className:"score t",children:n.scoreT}),O.jsxs("div",{className:"mid",children:[O.jsx("div",{className:`timer ${n.phase==="planted"?"danger":""}`,children:r?"💣 "+Math.ceil(n.bombTimer):y2(n.timeLeft)}),O.jsx("div",{className:"phase-label",children:n.phase==="freeze"?"准备时间":n.phase==="planted"?"C4 已安放":`回合 ${n.round}`}),O.jsxs("div",{className:"pips-row",children:[O.jsx(Pm,{alive:n.aliveT,total:5,color:"#e8b23c"}),O.jsx(Pm,{alive:n.aliveCT,total:5,color:"#5aa9ff"})]})]}),O.jsx("div",{className:"score ct",children:n.scoreCT})]}),O.jsx("div",{className:"killfeed",children:n.killfeed.map(s=>O.jsx(M2,{k:s},s.id))}),O.jsxs("div",{className:`vitals ${i?"low":""}`,children:[O.jsxs("div",{className:"vital",children:[O.jsx("span",{className:"vicon",children:"✚"}),O.jsx("span",{className:"vnum",children:n.hp})]}),O.jsxs("div",{className:"vital",children:[O.jsx("span",{className:"vicon ar",children:n.helmet?"⛨":"▣"}),O.jsx("span",{className:"vnum dim",children:n.armor})]}),n.hasC4&&O.jsx("div",{className:"c4tag",children:"C4"})]}),O.jsxs("div",{className:"ammo",children:[O.jsx("div",{className:"wname",children:n.weaponName}),O.jsx("div",{className:"ammo-nums",children:n.weaponSlot==="melee"?O.jsx("span",{className:"melee-label",children:"knife"}):O.jsxs(O.Fragment,{children:[O.jsx("span",{className:`mag ${n.mag===0?"empty":""}`,children:n.mag}),O.jsx("span",{className:"sep",children:"/"}),O.jsx("span",{className:"reserve",children:n.reserve})]})}),n.reloading&&O.jsx("div",{className:"reload-tag",children:"换弹中…"}),O.jsxs("div",{className:"slots",children:[O.jsx("span",{className:n.weaponSlot==="primary"?"on":"",children:"1"}),O.jsx("span",{className:n.weaponSlot==="secondary"?"on":"",children:"2"}),O.jsx("span",{className:n.weaponSlot==="melee"?"on":"",children:"3"})]})]}),n.prompt&&O.jsx("div",{className:"prompt",children:n.prompt}),n.progressLabel&&O.jsxs("div",{className:"progress-wrap",children:[O.jsx("div",{className:"progress-label",children:n.progressLabel}),O.jsx("div",{className:"progress",children:O.jsx("div",{className:"progress-fill",style:{width:`${n.progress*100}%`}})})]}),n.message&&n.phase!=="over"&&O.jsxs("div",{className:"message",children:[O.jsx("div",{className:"message-main",children:n.message}),n.messageSub&&O.jsx("div",{className:"message-sub",children:n.messageSub})]}),n.phase==="over"&&n.roundResult&&O.jsxs("div",{className:`round-result ${n.roundResult==="T"?"t":"ct"}`,children:[n.roundResult==="T"?"恐怖分子获胜":"反恐精英获胜",O.jsx("div",{className:"rr-sub",children:n.roundReason})]}),!n.alive&&n.phase!=="matchover"&&O.jsxs("div",{className:"spectate",children:[O.jsx("div",{className:"spec-title",children:n.spectating??"阵亡"}),O.jsxs("div",{className:"spec-hint",children:["鼠标左键 / 空格 切换队友视角",n.canTakeOver?" · [F] 接管操控":""]})]}),e&&O.jsxs("div",{className:"scoreboard",children:[O.jsxs("div",{className:"sb-head",children:[O.jsxs("span",{children:["de_dust2 · 第 ",n.round," 回合"]}),O.jsxs("span",{children:["T ",n.scoreT," : ",n.scoreCT," CT"]})]}),["T","CT"].map(s=>O.jsxs("div",{children:[O.jsx("div",{className:`sb-team ${s==="T"?"t":"ct"}`,children:s==="T"?"恐怖分子":"反恐精英"}),O.jsxs("table",{children:[O.jsx("thead",{children:O.jsxs("tr",{children:[O.jsx("th",{children:"玩家"}),O.jsx("th",{children:"K"}),O.jsx("th",{children:"D"}),O.jsx("th",{children:"$"})]})}),O.jsx("tbody",{children:n.players.filter(o=>o.team===s).map(o=>O.jsxs("tr",{className:`${o.alive?"":"dead"} ${o.isPlayer?"me":""}`,children:[O.jsxs("td",{children:[o.name,o.hasC4?" 💣":"",o.isPlayer?" (你)":""]}),O.jsx("td",{children:o.kills}),O.jsx("td",{children:o.deaths}),O.jsx("td",{children:o.money})]},o.name+s))})]})]},s))]}),n.scoped&&O.jsxs("div",{className:"scope",children:[O.jsx("div",{className:"scope-circle"}),O.jsx("div",{className:"scope-h"}),O.jsx("div",{className:"scope-v"})]})]})}function E2({onStart:n}){const[e,t]=ut.useState("T"),[i,r]=ut.useState(2.1),[s,o]=ut.useState(.7);return O.jsx("div",{className:"menu-overlay",children:O.jsxs("div",{className:"menu-card",children:[O.jsxs("h1",{children:["DE_DUST2 ",O.jsx("span",{children:"5v5"})]}),O.jsx("p",{className:"tagline",children:"纯代码生成的战术射击原型 · React + TypeScript + three.js"}),O.jsxs("div",{className:"team-pick",children:[O.jsxs("button",{className:`team-btn t ${e==="T"?"sel":""}`,onClick:()=>t("T"),children:[O.jsx("b",{children:"恐怖分子 T"}),O.jsx("i",{children:"AK-47 · 携带 C4 · 进攻 A/B 点"})]}),O.jsxs("button",{className:`team-btn ct ${e==="CT"?"sel":""}`,onClick:()=>t("CT"),children:[O.jsx("b",{children:"反恐精英 CT"}),O.jsx("i",{children:"M4A4 · 防守 · 拆除 C4"})]})]}),O.jsxs("div",{className:"opt-row",children:[O.jsxs("label",{children:["鼠标灵敏度 ",i.toFixed(1)]}),O.jsx("input",{type:"range",min:.5,max:5,step:.1,value:i,onChange:a=>r(parseFloat(a.target.value))}),O.jsxs("label",{children:["音量 ",Math.round(s*100),"%"]}),O.jsx("input",{type:"range",min:0,max:1,step:.05,value:s,onChange:a=>o(parseFloat(a.target.value))})]}),O.jsx("button",{className:"play",onClick:()=>n(e,{sens:i,vol:s}),children:"进 入 游 戏"}),O.jsxs("div",{className:"controls",children:[O.jsxs("div",{children:[O.jsx("b",{children:"WASD"})," 移动"]}),O.jsxs("div",{children:[O.jsx("b",{children:"空格"})," 跳跃"]}),O.jsxs("div",{children:[O.jsx("b",{children:"Ctrl"})," 蹲下"]}),O.jsxs("div",{children:[O.jsx("b",{children:"Shift"})," 静步"]}),O.jsxs("div",{children:[O.jsx("b",{children:"左键"})," 开火"]}),O.jsxs("div",{children:[O.jsx("b",{children:"右键"})," AWP 开镜"]}),O.jsxs("div",{children:[O.jsx("b",{children:"R"})," 换弹"]}),O.jsxs("div",{children:[O.jsx("b",{children:"1/2/3/Q/滚轮"})," 切枪"]}),O.jsxs("div",{children:[O.jsx("b",{children:"E"})," 下包 / 拆包"]}),O.jsxs("div",{children:[O.jsx("b",{children:"Tab"})," 计分板"]}),O.jsxs("div",{children:[O.jsx("b",{children:"Esc"})," 菜单"]}),O.jsxs("div",{children:[O.jsx("b",{children:"F"})," 死亡后接管队友"]})]}),O.jsx("p",{className:"note",children:"第一回合为手枪局 · 消灭敌方 / C4 爆炸 / 拆包即获胜 · 先赢 8 回合"})]})})}function w2({onResume:n,onRestart:e,onQuit:t,vol:i,onVolume:r}){return O.jsx("div",{className:"menu-overlay translucent",children:O.jsxs("div",{className:"menu-card small",children:[O.jsx("h2",{children:"已暂停"}),O.jsx("p",{className:"tagline",children:"鼠标已解锁 — 游戏仍在后台进行"}),O.jsxs("div",{className:"opt-row",children:[O.jsxs("label",{children:["音量 ",Math.round(i*100),"%"]}),O.jsx("input",{type:"range",min:0,max:1,step:.05,value:i,onChange:s=>r(parseFloat(s.target.value))})]}),O.jsx("button",{className:"play",onClick:n,children:"继续游戏"}),O.jsxs("div",{className:"row",children:[O.jsx("button",{className:"ghost",onClick:e,children:"重新开始比赛"}),O.jsx("button",{className:"ghost",onClick:t,children:"返回主菜单"})]})]})})}function T2({winner:n,scoreT:e,scoreCT:t,onRestart:i}){return O.jsx("div",{className:"menu-overlay translucent",children:O.jsxs("div",{className:"menu-card small",children:[O.jsx("h1",{className:n==="T"?"t-win":"ct-win",children:n==="T"?"恐怖分子 获胜":"反恐精英 获胜"}),O.jsxs("p",{className:"big-score",children:[e," : ",t]}),O.jsx("button",{className:"play",onClick:i,children:"再来一场"})]})})}function A2(){const n=ut.useRef(null),e=ut.useRef(null),t=ut.useRef(null),i=ut.useRef(null),[r]=ut.useState(()=>new x2),s=ut.useSyncExternalStore(r.subscribe,r.getSnapshot),[o,a]=ut.useState(!1),[l,c]=ut.useState(!1),[u,h]=ut.useState(.7);ut.useEffect(()=>{const v=()=>c(document.pointerLockElement!==null);return document.addEventListener("pointerlockchange",v),()=>document.removeEventListener("pointerlockchange",v)},[]),ut.useEffect(()=>()=>{i.current?.stop(),i.current=null},[]);const d=ut.useCallback((v,M)=>{ke.init(),ke.setVolume(M.vol),h(M.vol),i.current&&i.current.stop();const b=n.current,A=e.current,T=new v2({canvas:b,minimap:A,crosshair:t.current,bridge:r,team:v});T.input.sensitivity=M.sens*.001,window.__game=T,i.current=T,T.start(),a(!0),setTimeout(()=>T.input.requestLock(),30)},[r]),p=ut.useCallback(()=>{ke.init(),i.current?.input.requestLock()},[]),_=ut.useCallback(()=>{i.current?.restartMatch(),p()},[p]),x=ut.useCallback(()=>{i.current?.stop(),i.current=null,a(!1)},[]),m=ut.useCallback(v=>{h(v),ke.setVolume(v)},[]),f=ut.useCallback(()=>{o&&!l&&s.phase!=="matchover"&&p()},[o,l,s.phase,p]),g=o&&!l&&s.phase!=="matchover";return O.jsxs("div",{className:"app",children:[O.jsx("canvas",{ref:n,className:"game-canvas",onClick:f}),O.jsxs("div",{className:"crosshair",ref:t,children:[O.jsx("span",{className:"ch t"}),O.jsx("span",{className:"ch b"}),O.jsx("span",{className:"ch l"}),O.jsx("span",{className:"ch r"}),O.jsx("span",{className:"ch dot"})]}),o&&O.jsx(S2,{hud:s}),O.jsxs("div",{className:"minimap-wrap",style:{visibility:o?"visible":"hidden"},children:[O.jsx("canvas",{ref:e,width:230,height:268,className:"minimap"}),O.jsx("div",{className:"map-label",children:"de_dust2"})]}),!o&&O.jsx(E2,{onStart:d}),g&&O.jsx(w2,{onResume:p,onRestart:_,onQuit:x,vol:u,onVolume:m}),s.phase==="matchover"&&O.jsx(T2,{winner:s.scoreT>s.scoreCT?"T":"CT",scoreT:s.scoreT,scoreCT:s.scoreCT,onRestart:_}),o&&O.jsxs("div",{className:"fps-tag",children:[s.fps," fps"]})]})}Gg(document.getElementById("root")).render(O.jsx(A2,{}));
