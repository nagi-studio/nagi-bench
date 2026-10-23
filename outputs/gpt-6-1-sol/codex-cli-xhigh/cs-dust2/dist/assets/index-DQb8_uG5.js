var Xv=Object.defineProperty;var Yv=(s,e,t)=>e in s?Xv(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var Xe=(s,e,t)=>Yv(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();function Pg(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var ku={exports:{}},$o={},Bu={exports:{}},ht={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cm;function qv(){if(cm)return ht;cm=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),u=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),v=Symbol.for("react.lazy"),x=Symbol.iterator;function _(O){return O===null||typeof O!="object"?null:(O=x&&O[x]||O["@@iterator"],typeof O=="function"?O:null)}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,w={};function S(O,re,Ne){this.props=O,this.context=re,this.refs=w,this.updater=Ne||y}S.prototype.isReactComponent={},S.prototype.setState=function(O,re){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,re,"setState")},S.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function p(){}p.prototype=S.prototype;function b(O,re,Ne){this.props=O,this.context=re,this.refs=w,this.updater=Ne||y}var L=b.prototype=new p;L.constructor=b,E(L,S.prototype),L.isPureReactComponent=!0;var A=Array.isArray,k=Object.prototype.hasOwnProperty,N={current:null},U={key:!0,ref:!0,__self:!0,__source:!0};function z(O,re,Ne){var J,fe={},Ee=null,xe=null;if(re!=null)for(J in re.ref!==void 0&&(xe=re.ref),re.key!==void 0&&(Ee=""+re.key),re)k.call(re,J)&&!U.hasOwnProperty(J)&&(fe[J]=re[J]);var Ae=arguments.length-2;if(Ae===1)fe.children=Ne;else if(1<Ae){for(var Ie=Array(Ae),Je=0;Je<Ae;Je++)Ie[Je]=arguments[Je+2];fe.children=Ie}if(O&&O.defaultProps)for(J in Ae=O.defaultProps,Ae)fe[J]===void 0&&(fe[J]=Ae[J]);return{$$typeof:s,type:O,key:Ee,ref:xe,props:fe,_owner:N.current}}function D(O,re){return{$$typeof:s,type:O.type,key:re,ref:O.ref,props:O.props,_owner:O._owner}}function C(O){return typeof O=="object"&&O!==null&&O.$$typeof===s}function B(O){var re={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(Ne){return re[Ne]})}var ee=/\/+/g;function Z(O,re){return typeof O=="object"&&O!==null&&O.key!=null?B(""+O.key):re.toString(36)}function le(O,re,Ne,J,fe){var Ee=typeof O;(Ee==="undefined"||Ee==="boolean")&&(O=null);var xe=!1;if(O===null)xe=!0;else switch(Ee){case"string":case"number":xe=!0;break;case"object":switch(O.$$typeof){case s:case e:xe=!0}}if(xe)return xe=O,fe=fe(xe),O=J===""?"."+Z(xe,0):J,A(fe)?(Ne="",O!=null&&(Ne=O.replace(ee,"$&/")+"/"),le(fe,re,Ne,"",function(Je){return Je})):fe!=null&&(C(fe)&&(fe=D(fe,Ne+(!fe.key||xe&&xe.key===fe.key?"":(""+fe.key).replace(ee,"$&/")+"/")+O)),re.push(fe)),1;if(xe=0,J=J===""?".":J+":",A(O))for(var Ae=0;Ae<O.length;Ae++){Ee=O[Ae];var Ie=J+Z(Ee,Ae);xe+=le(Ee,re,Ne,Ie,fe)}else if(Ie=_(O),typeof Ie=="function")for(O=Ie.call(O),Ae=0;!(Ee=O.next()).done;)Ee=Ee.value,Ie=J+Z(Ee,Ae++),xe+=le(Ee,re,Ne,Ie,fe);else if(Ee==="object")throw re=String(O),Error("Objects are not valid as a React child (found: "+(re==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":re)+"). If you meant to render a collection of children, use an array instead.");return xe}function de(O,re,Ne){if(O==null)return O;var J=[],fe=0;return le(O,J,"","",function(Ee){return re.call(Ne,Ee,fe++)}),J}function ae(O){if(O._status===-1){var re=O._result;re=re(),re.then(function(Ne){(O._status===0||O._status===-1)&&(O._status=1,O._result=Ne)},function(Ne){(O._status===0||O._status===-1)&&(O._status=2,O._result=Ne)}),O._status===-1&&(O._status=0,O._result=re)}if(O._status===1)return O._result.default;throw O._result}var ue={current:null},V={transition:null},ce={ReactCurrentDispatcher:ue,ReactCurrentBatchConfig:V,ReactCurrentOwner:N};function oe(){throw Error("act(...) is not supported in production builds of React.")}return ht.Children={map:de,forEach:function(O,re,Ne){de(O,function(){re.apply(this,arguments)},Ne)},count:function(O){var re=0;return de(O,function(){re++}),re},toArray:function(O){return de(O,function(re){return re})||[]},only:function(O){if(!C(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},ht.Component=S,ht.Fragment=t,ht.Profiler=a,ht.PureComponent=b,ht.StrictMode=r,ht.Suspense=h,ht.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ce,ht.act=oe,ht.cloneElement=function(O,re,Ne){if(O==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+O+".");var J=E({},O.props),fe=O.key,Ee=O.ref,xe=O._owner;if(re!=null){if(re.ref!==void 0&&(Ee=re.ref,xe=N.current),re.key!==void 0&&(fe=""+re.key),O.type&&O.type.defaultProps)var Ae=O.type.defaultProps;for(Ie in re)k.call(re,Ie)&&!U.hasOwnProperty(Ie)&&(J[Ie]=re[Ie]===void 0&&Ae!==void 0?Ae[Ie]:re[Ie])}var Ie=arguments.length-2;if(Ie===1)J.children=Ne;else if(1<Ie){Ae=Array(Ie);for(var Je=0;Je<Ie;Je++)Ae[Je]=arguments[Je+2];J.children=Ae}return{$$typeof:s,type:O.type,key:fe,ref:Ee,props:J,_owner:xe}},ht.createContext=function(O){return O={$$typeof:u,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},O.Provider={$$typeof:l,_context:O},O.Consumer=O},ht.createElement=z,ht.createFactory=function(O){var re=z.bind(null,O);return re.type=O,re},ht.createRef=function(){return{current:null}},ht.forwardRef=function(O){return{$$typeof:d,render:O}},ht.isValidElement=C,ht.lazy=function(O){return{$$typeof:v,_payload:{_status:-1,_result:O},_init:ae}},ht.memo=function(O,re){return{$$typeof:m,type:O,compare:re===void 0?null:re}},ht.startTransition=function(O){var re=V.transition;V.transition={};try{O()}finally{V.transition=re}},ht.unstable_act=oe,ht.useCallback=function(O,re){return ue.current.useCallback(O,re)},ht.useContext=function(O){return ue.current.useContext(O)},ht.useDebugValue=function(){},ht.useDeferredValue=function(O){return ue.current.useDeferredValue(O)},ht.useEffect=function(O,re){return ue.current.useEffect(O,re)},ht.useId=function(){return ue.current.useId()},ht.useImperativeHandle=function(O,re,Ne){return ue.current.useImperativeHandle(O,re,Ne)},ht.useInsertionEffect=function(O,re){return ue.current.useInsertionEffect(O,re)},ht.useLayoutEffect=function(O,re){return ue.current.useLayoutEffect(O,re)},ht.useMemo=function(O,re){return ue.current.useMemo(O,re)},ht.useReducer=function(O,re,Ne){return ue.current.useReducer(O,re,Ne)},ht.useRef=function(O){return ue.current.useRef(O)},ht.useState=function(O){return ue.current.useState(O)},ht.useSyncExternalStore=function(O,re,Ne){return ue.current.useSyncExternalStore(O,re,Ne)},ht.useTransition=function(){return ue.current.useTransition()},ht.version="18.3.1",ht}var um;function xf(){return um||(um=1,Bu.exports=qv()),Bu.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var dm;function $v(){if(dm)return $o;dm=1;var s=xf(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function u(d,h,m){var v,x={},_=null,y=null;m!==void 0&&(_=""+m),h.key!==void 0&&(_=""+h.key),h.ref!==void 0&&(y=h.ref);for(v in h)r.call(h,v)&&!l.hasOwnProperty(v)&&(x[v]=h[v]);if(d&&d.defaultProps)for(v in h=d.defaultProps,h)x[v]===void 0&&(x[v]=h[v]);return{$$typeof:e,type:d,key:_,ref:y,props:x,_owner:a.current}}return $o.Fragment=t,$o.jsx=u,$o.jsxs=u,$o}var fm;function Kv(){return fm||(fm=1,ku.exports=$v()),ku.exports}var M=Kv(),vi=xf();const Zv=Pg(vi);var _l={},Hu={exports:{}},Hn={},Vu={exports:{}},Gu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var hm;function Qv(){return hm||(hm=1,(function(s){function e(V,ce){var oe=V.length;V.push(ce);e:for(;0<oe;){var O=oe-1>>>1,re=V[O];if(0<a(re,ce))V[O]=ce,V[oe]=re,oe=O;else break e}}function t(V){return V.length===0?null:V[0]}function r(V){if(V.length===0)return null;var ce=V[0],oe=V.pop();if(oe!==ce){V[0]=oe;e:for(var O=0,re=V.length,Ne=re>>>1;O<Ne;){var J=2*(O+1)-1,fe=V[J],Ee=J+1,xe=V[Ee];if(0>a(fe,oe))Ee<re&&0>a(xe,fe)?(V[O]=xe,V[Ee]=oe,O=Ee):(V[O]=fe,V[J]=oe,O=J);else if(Ee<re&&0>a(xe,oe))V[O]=xe,V[Ee]=oe,O=Ee;else break e}}return ce}function a(V,ce){var oe=V.sortIndex-ce.sortIndex;return oe!==0?oe:V.id-ce.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;s.unstable_now=function(){return l.now()}}else{var u=Date,d=u.now();s.unstable_now=function(){return u.now()-d}}var h=[],m=[],v=1,x=null,_=3,y=!1,E=!1,w=!1,S=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,b=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function L(V){for(var ce=t(m);ce!==null;){if(ce.callback===null)r(m);else if(ce.startTime<=V)r(m),ce.sortIndex=ce.expirationTime,e(h,ce);else break;ce=t(m)}}function A(V){if(w=!1,L(V),!E)if(t(h)!==null)E=!0,ae(k);else{var ce=t(m);ce!==null&&ue(A,ce.startTime-V)}}function k(V,ce){E=!1,w&&(w=!1,p(z),z=-1),y=!0;var oe=_;try{for(L(ce),x=t(h);x!==null&&(!(x.expirationTime>ce)||V&&!B());){var O=x.callback;if(typeof O=="function"){x.callback=null,_=x.priorityLevel;var re=O(x.expirationTime<=ce);ce=s.unstable_now(),typeof re=="function"?x.callback=re:x===t(h)&&r(h),L(ce)}else r(h);x=t(h)}if(x!==null)var Ne=!0;else{var J=t(m);J!==null&&ue(A,J.startTime-ce),Ne=!1}return Ne}finally{x=null,_=oe,y=!1}}var N=!1,U=null,z=-1,D=5,C=-1;function B(){return!(s.unstable_now()-C<D)}function ee(){if(U!==null){var V=s.unstable_now();C=V;var ce=!0;try{ce=U(!0,V)}finally{ce?Z():(N=!1,U=null)}}else N=!1}var Z;if(typeof b=="function")Z=function(){b(ee)};else if(typeof MessageChannel<"u"){var le=new MessageChannel,de=le.port2;le.port1.onmessage=ee,Z=function(){de.postMessage(null)}}else Z=function(){S(ee,0)};function ae(V){U=V,N||(N=!0,Z())}function ue(V,ce){z=S(function(){V(s.unstable_now())},ce)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(V){V.callback=null},s.unstable_continueExecution=function(){E||y||(E=!0,ae(k))},s.unstable_forceFrameRate=function(V){0>V||125<V?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<V?Math.floor(1e3/V):5},s.unstable_getCurrentPriorityLevel=function(){return _},s.unstable_getFirstCallbackNode=function(){return t(h)},s.unstable_next=function(V){switch(_){case 1:case 2:case 3:var ce=3;break;default:ce=_}var oe=_;_=ce;try{return V()}finally{_=oe}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(V,ce){switch(V){case 1:case 2:case 3:case 4:case 5:break;default:V=3}var oe=_;_=V;try{return ce()}finally{_=oe}},s.unstable_scheduleCallback=function(V,ce,oe){var O=s.unstable_now();switch(typeof oe=="object"&&oe!==null?(oe=oe.delay,oe=typeof oe=="number"&&0<oe?O+oe:O):oe=O,V){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=oe+re,V={id:v++,callback:ce,priorityLevel:V,startTime:oe,expirationTime:re,sortIndex:-1},oe>O?(V.sortIndex=oe,e(m,V),t(h)===null&&V===t(m)&&(w?(p(z),z=-1):w=!0,ue(A,oe-O))):(V.sortIndex=re,e(h,V),E||y||(E=!0,ae(k))),V},s.unstable_shouldYield=B,s.unstable_wrapCallback=function(V){var ce=_;return function(){var oe=_;_=ce;try{return V.apply(this,arguments)}finally{_=oe}}}})(Gu)),Gu}var pm;function Jv(){return pm||(pm=1,Vu.exports=Qv()),Vu.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var mm;function e_(){if(mm)return Hn;mm=1;var s=xf(),e=Jv();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,o=1;o<arguments.length;o++)i+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,a={};function l(n,i){u(n,i),u(n+"Capture",i)}function u(n,i){for(a[n]=i,n=0;n<i.length;n++)r.add(i[n])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,v={},x={};function _(n){return h.call(x,n)?!0:h.call(v,n)?!1:m.test(n)?x[n]=!0:(v[n]=!0,!1)}function y(n,i,o,c){if(o!==null&&o.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:o!==null?!o.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function E(n,i,o,c){if(i===null||typeof i>"u"||y(n,i,o,c))return!0;if(c)return!1;if(o!==null)switch(o.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function w(n,i,o,c,f,g,T){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=f,this.mustUseProperty=o,this.propertyName=n,this.type=i,this.sanitizeURL=g,this.removeEmptyString=T}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new w(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];S[i]=new w(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new w(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new w(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new w(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new w(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new w(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new w(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new w(n,5,!1,n.toLowerCase(),null,!1,!1)});var p=/[\-:]([a-z])/g;function b(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(p,b);S[i]=new w(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(p,b);S[i]=new w(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(p,b);S[i]=new w(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new w("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!0,!0)});function L(n,i,o,c){var f=S.hasOwnProperty(i)?S[i]:null;(f!==null?f.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(E(i,o,f,c)&&(o=null),c||f===null?_(i)&&(o===null?n.removeAttribute(i):n.setAttribute(i,""+o)):f.mustUseProperty?n[f.propertyName]=o===null?f.type===3?!1:"":o:(i=f.attributeName,c=f.attributeNamespace,o===null?n.removeAttribute(i):(f=f.type,o=f===3||f===4&&o===!0?"":""+o,c?n.setAttributeNS(c,i,o):n.setAttribute(i,o))))}var A=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,k=Symbol.for("react.element"),N=Symbol.for("react.portal"),U=Symbol.for("react.fragment"),z=Symbol.for("react.strict_mode"),D=Symbol.for("react.profiler"),C=Symbol.for("react.provider"),B=Symbol.for("react.context"),ee=Symbol.for("react.forward_ref"),Z=Symbol.for("react.suspense"),le=Symbol.for("react.suspense_list"),de=Symbol.for("react.memo"),ae=Symbol.for("react.lazy"),ue=Symbol.for("react.offscreen"),V=Symbol.iterator;function ce(n){return n===null||typeof n!="object"?null:(n=V&&n[V]||n["@@iterator"],typeof n=="function"?n:null)}var oe=Object.assign,O;function re(n){if(O===void 0)try{throw Error()}catch(o){var i=o.stack.trim().match(/\n( *(at )?)/);O=i&&i[1]||""}return`
`+O+n}var Ne=!1;function J(n,i){if(!n||Ne)return"";Ne=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(te){var c=te}Reflect.construct(n,[],i)}else{try{i.call()}catch(te){c=te}n.call(i.prototype)}else{try{throw Error()}catch(te){c=te}n()}}catch(te){if(te&&c&&typeof te.stack=="string"){for(var f=te.stack.split(`
`),g=c.stack.split(`
`),T=f.length-1,F=g.length-1;1<=T&&0<=F&&f[T]!==g[F];)F--;for(;1<=T&&0<=F;T--,F--)if(f[T]!==g[F]){if(T!==1||F!==1)do if(T--,F--,0>F||f[T]!==g[F]){var H=`
`+f[T].replace(" at new "," at ");return n.displayName&&H.includes("<anonymous>")&&(H=H.replace("<anonymous>",n.displayName)),H}while(1<=T&&0<=F);break}}}finally{Ne=!1,Error.prepareStackTrace=o}return(n=n?n.displayName||n.name:"")?re(n):""}function fe(n){switch(n.tag){case 5:return re(n.type);case 16:return re("Lazy");case 13:return re("Suspense");case 19:return re("SuspenseList");case 0:case 2:case 15:return n=J(n.type,!1),n;case 11:return n=J(n.type.render,!1),n;case 1:return n=J(n.type,!0),n;default:return""}}function Ee(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case U:return"Fragment";case N:return"Portal";case D:return"Profiler";case z:return"StrictMode";case Z:return"Suspense";case le:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case B:return(n.displayName||"Context")+".Consumer";case C:return(n._context.displayName||"Context")+".Provider";case ee:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case de:return i=n.displayName||null,i!==null?i:Ee(n.type)||"Memo";case ae:i=n._payload,n=n._init;try{return Ee(n(i))}catch{}}return null}function xe(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ee(i);case 8:return i===z?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Ae(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ie(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Je(n){var i=Ie(n)?"checked":"value",o=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var f=o.get,g=o.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return f.call(this)},set:function(T){c=""+T,g.call(this,T)}}),Object.defineProperty(n,i,{enumerable:o.enumerable}),{getValue:function(){return c},setValue:function(T){c=""+T},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function bt(n){n._valueTracker||(n._valueTracker=Je(n))}function gt(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var o=i.getValue(),c="";return n&&(c=Ie(n)?n.checked?"true":"false":n.value),n=c,n!==o?(i.setValue(n),!0):!1}function Ut(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function q(n,i){var o=i.checked;return oe({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??n._wrapperState.initialChecked})}function wn(n,i){var o=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;o=Ae(i.value!=null?i.value:o),n._wrapperState={initialChecked:c,initialValue:o,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function pt(n,i){i=i.checked,i!=null&&L(n,"checked",i,!1)}function dt(n,i){pt(n,i);var o=Ae(i.value),c=i.type;if(o!=null)c==="number"?(o===0&&n.value===""||n.value!=o)&&(n.value=""+o):n.value!==""+o&&(n.value=""+o);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?Rt(n,i.type,o):i.hasOwnProperty("defaultValue")&&Rt(n,i.type,Ae(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function Ke(n,i,o){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,o||i===n.value||(n.value=i),n.defaultValue=i}o=n.name,o!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,o!==""&&(n.name=o)}function Rt(n,i,o){(i!=="number"||Ut(n.ownerDocument)!==n)&&(o==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+o&&(n.defaultValue=""+o))}var qe=Array.isArray;function I(n,i,o,c){if(n=n.options,i){i={};for(var f=0;f<o.length;f++)i["$"+o[f]]=!0;for(o=0;o<n.length;o++)f=i.hasOwnProperty("$"+n[o].value),n[o].selected!==f&&(n[o].selected=f),f&&c&&(n[o].defaultSelected=!0)}else{for(o=""+Ae(o),i=null,f=0;f<n.length;f++){if(n[f].value===o){n[f].selected=!0,c&&(n[f].defaultSelected=!0);return}i!==null||n[f].disabled||(i=n[f])}i!==null&&(i.selected=!0)}}function R(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return oe({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Q(n,i){var o=i.value;if(o==null){if(o=i.children,i=i.defaultValue,o!=null){if(i!=null)throw Error(t(92));if(qe(o)){if(1<o.length)throw Error(t(93));o=o[0]}i=o}i==null&&(i=""),o=i}n._wrapperState={initialValue:Ae(o)}}function me(n,i){var o=Ae(i.value),c=Ae(i.defaultValue);o!=null&&(o=""+o,o!==n.value&&(n.value=o),i.defaultValue==null&&n.defaultValue!==o&&(n.defaultValue=o)),c!=null&&(n.defaultValue=""+c)}function ve(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function he(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ve(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?he(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Re,Ue=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,o,c,f){MSApp.execUnsafeLocalFunction(function(){return n(i,o,c,f)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(Re=Re||document.createElement("div"),Re.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=Re.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function ut(n,i){if(i){var o=n.firstChild;if(o&&o===n.lastChild&&o.nodeType===3){o.nodeValue=i;return}}n.textContent=i}var Se={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Oe=["Webkit","ms","Moz","O"];Object.keys(Se).forEach(function(n){Oe.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),Se[i]=Se[n]})});function et(n,i,o){return i==null||typeof i=="boolean"||i===""?"":o||typeof i!="number"||i===0||Se.hasOwnProperty(n)&&Se[n]?(""+i).trim():i+"px"}function tt(n,i){n=n.style;for(var o in i)if(i.hasOwnProperty(o)){var c=o.indexOf("--")===0,f=et(o,i[o],c);o==="float"&&(o="cssFloat"),c?n.setProperty(o,f):n[o]=f}}var ze=oe({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ft(n,i){if(i){if(ze[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function st(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var At=null;function j(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Ce=null,se=null,pe=null;function Le(n){if(n=Io(n)){if(typeof Ce!="function")throw Error(t(280));var i=n.stateNode;i&&(i=Na(i),Ce(n.stateNode,n.type,i))}}function Pe(n){se?pe?pe.push(n):pe=[n]:se=n}function ot(){if(se){var n=se,i=pe;if(pe=se=null,Le(n),i)for(n=0;n<i.length;n++)Le(i[n])}}function kt(n,i){return n(i)}function Jt(){}var yt=!1;function In(n,i,o){if(yt)return n(i,o);yt=!0;try{return kt(n,i,o)}finally{yt=!1,(se!==null||pe!==null)&&(Jt(),ot())}}function Tn(n,i){var o=n.stateNode;if(o===null)return null;var c=Na(o);if(c===null)return null;o=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(o&&typeof o!="function")throw Error(t(231,i,typeof o));return o}var fs=!1;if(d)try{var rr={};Object.defineProperty(rr,"passive",{get:function(){fs=!0}}),window.addEventListener("test",rr,rr),window.removeEventListener("test",rr,rr)}catch{fs=!1}function Ii(n,i,o,c,f,g,T,F,H){var te=Array.prototype.slice.call(arguments,3);try{i.apply(o,te)}catch(_e){this.onError(_e)}}var Ui=!1,Or=null,zr=!1,sr=null,ha={onError:function(n){Ui=!0,Or=n}};function hs(n,i,o,c,f,g,T,F,H){Ui=!1,Or=null,Ii.apply(ha,arguments)}function pa(n,i,o,c,f,g,T,F,H){if(hs.apply(this,arguments),Ui){if(Ui){var te=Or;Ui=!1,Or=null}else throw Error(t(198));zr||(zr=!0,sr=te)}}function Ei(n){var i=n,o=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(o=i.return),n=i.return;while(n)}return i.tag===3?o:null}function ma(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function ga(n){if(Ei(n)!==n)throw Error(t(188))}function ac(n){var i=n.alternate;if(!i){if(i=Ei(n),i===null)throw Error(t(188));return i!==n?null:n}for(var o=n,c=i;;){var f=o.return;if(f===null)break;var g=f.alternate;if(g===null){if(c=f.return,c!==null){o=c;continue}break}if(f.child===g.child){for(g=f.child;g;){if(g===o)return ga(f),n;if(g===c)return ga(f),i;g=g.sibling}throw Error(t(188))}if(o.return!==c.return)o=f,c=g;else{for(var T=!1,F=f.child;F;){if(F===o){T=!0,o=f,c=g;break}if(F===c){T=!0,c=f,o=g;break}F=F.sibling}if(!T){for(F=g.child;F;){if(F===o){T=!0,o=g,c=f;break}if(F===c){T=!0,c=g,o=f;break}F=F.sibling}if(!T)throw Error(t(189))}}if(o.alternate!==c)throw Error(t(190))}if(o.tag!==3)throw Error(t(188));return o.stateNode.current===o?n:i}function P(n){return n=ac(n),n!==null?X(n):null}function X(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=X(n);if(i!==null)return i;n=n.sibling}return null}var ne=e.unstable_scheduleCallback,ie=e.unstable_cancelCallback,Y=e.unstable_shouldYield,Te=e.unstable_requestPaint,Me=e.unstable_now,Ge=e.unstable_getCurrentPriorityLevel,Be=e.unstable_ImmediatePriority,nt=e.unstable_UserBlockingPriority,rt=e.unstable_NormalPriority,We=e.unstable_LowPriority,_t=e.unstable_IdlePriority,Tt=null,vt=null;function mn(n){if(vt&&typeof vt.onCommitFiberRoot=="function")try{vt.onCommitFiberRoot(Tt,n,void 0,(n.current.flags&128)===128)}catch{}}var at=Math.clz32?Math.clz32:Et,Ye=Math.log,oi=Math.LN2;function Et(n){return n>>>=0,n===0?32:31-(Ye(n)/oi|0)|0}var gn=64,ai=4194304;function en(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function wi(n,i){var o=n.pendingLanes;if(o===0)return 0;var c=0,f=n.suspendedLanes,g=n.pingedLanes,T=o&268435455;if(T!==0){var F=T&~f;F!==0?c=en(F):(g&=T,g!==0&&(c=en(g)))}else T=o&~f,T!==0?c=en(T):g!==0&&(c=en(g));if(c===0)return 0;if(i!==0&&i!==c&&(i&f)===0&&(f=c&-c,g=i&-i,f>=g||f===16&&(g&4194240)!==0))return i;if((c&4)!==0&&(c|=o&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)o=31-at(i),f=1<<o,c|=n[o],i&=~f;return c}function It(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Zn(n,i){for(var o=n.suspendedLanes,c=n.pingedLanes,f=n.expirationTimes,g=n.pendingLanes;0<g;){var T=31-at(g),F=1<<T,H=f[T];H===-1?((F&o)===0||(F&c)!==0)&&(f[T]=It(F,i)):H<=i&&(n.expiredLanes|=F),g&=~F}}function Fi(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function An(){var n=gn;return gn<<=1,(gn&4194240)===0&&(gn=64),n}function Qn(n){for(var i=[],o=0;31>o;o++)i.push(n);return i}function Un(n,i,o){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-at(i),n[i]=o}function va(n,i){var o=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<o;){var f=31-at(o),g=1<<f;i[f]=0,c[f]=-1,n[f]=-1,o&=~g}}function lc(n,i){var o=n.entangledLanes|=i;for(n=n.entanglements;o;){var c=31-at(o),f=1<<c;f&i|n[c]&i&&(n[c]|=i),o&=~f}}var Ct=0;function Hf(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var Vf,cc,Gf,Wf,jf,uc=!1,_a=[],or=null,ar=null,lr=null,_o=new Map,xo=new Map,cr=[],p0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Xf(n,i){switch(n){case"focusin":case"focusout":or=null;break;case"dragenter":case"dragleave":ar=null;break;case"mouseover":case"mouseout":lr=null;break;case"pointerover":case"pointerout":_o.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":xo.delete(i.pointerId)}}function yo(n,i,o,c,f,g){return n===null||n.nativeEvent!==g?(n={blockedOn:i,domEventName:o,eventSystemFlags:c,nativeEvent:g,targetContainers:[f]},i!==null&&(i=Io(i),i!==null&&cc(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,f!==null&&i.indexOf(f)===-1&&i.push(f),n)}function m0(n,i,o,c,f){switch(i){case"focusin":return or=yo(or,n,i,o,c,f),!0;case"dragenter":return ar=yo(ar,n,i,o,c,f),!0;case"mouseover":return lr=yo(lr,n,i,o,c,f),!0;case"pointerover":var g=f.pointerId;return _o.set(g,yo(_o.get(g)||null,n,i,o,c,f)),!0;case"gotpointercapture":return g=f.pointerId,xo.set(g,yo(xo.get(g)||null,n,i,o,c,f)),!0}return!1}function Yf(n){var i=kr(n.target);if(i!==null){var o=Ei(i);if(o!==null){if(i=o.tag,i===13){if(i=ma(o),i!==null){n.blockedOn=i,jf(n.priority,function(){Gf(o)});return}}else if(i===3&&o.stateNode.current.memoizedState.isDehydrated){n.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}n.blockedOn=null}function xa(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var o=fc(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(o===null){o=n.nativeEvent;var c=new o.constructor(o.type,o);At=c,o.target.dispatchEvent(c),At=null}else return i=Io(o),i!==null&&cc(i),n.blockedOn=o,!1;i.shift()}return!0}function qf(n,i,o){xa(n)&&o.delete(i)}function g0(){uc=!1,or!==null&&xa(or)&&(or=null),ar!==null&&xa(ar)&&(ar=null),lr!==null&&xa(lr)&&(lr=null),_o.forEach(qf),xo.forEach(qf)}function So(n,i){n.blockedOn===i&&(n.blockedOn=null,uc||(uc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,g0)))}function Mo(n){function i(f){return So(f,n)}if(0<_a.length){So(_a[0],n);for(var o=1;o<_a.length;o++){var c=_a[o];c.blockedOn===n&&(c.blockedOn=null)}}for(or!==null&&So(or,n),ar!==null&&So(ar,n),lr!==null&&So(lr,n),_o.forEach(i),xo.forEach(i),o=0;o<cr.length;o++)c=cr[o],c.blockedOn===n&&(c.blockedOn=null);for(;0<cr.length&&(o=cr[0],o.blockedOn===null);)Yf(o),o.blockedOn===null&&cr.shift()}var ps=A.ReactCurrentBatchConfig,ya=!0;function v0(n,i,o,c){var f=Ct,g=ps.transition;ps.transition=null;try{Ct=1,dc(n,i,o,c)}finally{Ct=f,ps.transition=g}}function _0(n,i,o,c){var f=Ct,g=ps.transition;ps.transition=null;try{Ct=4,dc(n,i,o,c)}finally{Ct=f,ps.transition=g}}function dc(n,i,o,c){if(ya){var f=fc(n,i,o,c);if(f===null)bc(n,i,c,Sa,o),Xf(n,c);else if(m0(f,n,i,o,c))c.stopPropagation();else if(Xf(n,c),i&4&&-1<p0.indexOf(n)){for(;f!==null;){var g=Io(f);if(g!==null&&Vf(g),g=fc(n,i,o,c),g===null&&bc(n,i,c,Sa,o),g===f)break;f=g}f!==null&&c.stopPropagation()}else bc(n,i,c,null,o)}}var Sa=null;function fc(n,i,o,c){if(Sa=null,n=j(c),n=kr(n),n!==null)if(i=Ei(n),i===null)n=null;else if(o=i.tag,o===13){if(n=ma(i),n!==null)return n;n=null}else if(o===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return Sa=n,null}function $f(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ge()){case Be:return 1;case nt:return 4;case rt:case We:return 16;case _t:return 536870912;default:return 16}default:return 16}}var ur=null,hc=null,Ma=null;function Kf(){if(Ma)return Ma;var n,i=hc,o=i.length,c,f="value"in ur?ur.value:ur.textContent,g=f.length;for(n=0;n<o&&i[n]===f[n];n++);var T=o-n;for(c=1;c<=T&&i[o-c]===f[g-c];c++);return Ma=f.slice(n,1<c?1-c:void 0)}function Ea(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function wa(){return!0}function Zf(){return!1}function jn(n){function i(o,c,f,g,T){this._reactName=o,this._targetInst=f,this.type=c,this.nativeEvent=g,this.target=T,this.currentTarget=null;for(var F in n)n.hasOwnProperty(F)&&(o=n[F],this[F]=o?o(g):g[F]);return this.isDefaultPrevented=(g.defaultPrevented!=null?g.defaultPrevented:g.returnValue===!1)?wa:Zf,this.isPropagationStopped=Zf,this}return oe(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=wa)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=wa)},persist:function(){},isPersistent:wa}),i}var ms={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},pc=jn(ms),Eo=oe({},ms,{view:0,detail:0}),x0=jn(Eo),mc,gc,wo,Ta=oe({},Eo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:_c,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==wo&&(wo&&n.type==="mousemove"?(mc=n.screenX-wo.screenX,gc=n.screenY-wo.screenY):gc=mc=0,wo=n),mc)},movementY:function(n){return"movementY"in n?n.movementY:gc}}),Qf=jn(Ta),y0=oe({},Ta,{dataTransfer:0}),S0=jn(y0),M0=oe({},Eo,{relatedTarget:0}),vc=jn(M0),E0=oe({},ms,{animationName:0,elapsedTime:0,pseudoElement:0}),w0=jn(E0),T0=oe({},ms,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),A0=jn(T0),R0=oe({},ms,{data:0}),Jf=jn(R0),C0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},b0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},P0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function L0(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=P0[n])?!!i[n]:!1}function _c(){return L0}var D0=oe({},Eo,{key:function(n){if(n.key){var i=C0[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=Ea(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?b0[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:_c,charCode:function(n){return n.type==="keypress"?Ea(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Ea(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),N0=jn(D0),I0=oe({},Ta,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),eh=jn(I0),U0=oe({},Eo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:_c}),F0=jn(U0),O0=oe({},ms,{propertyName:0,elapsedTime:0,pseudoElement:0}),z0=jn(O0),k0=oe({},Ta,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),B0=jn(k0),H0=[9,13,27,32],xc=d&&"CompositionEvent"in window,To=null;d&&"documentMode"in document&&(To=document.documentMode);var V0=d&&"TextEvent"in window&&!To,th=d&&(!xc||To&&8<To&&11>=To),nh=" ",ih=!1;function rh(n,i){switch(n){case"keyup":return H0.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function sh(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var gs=!1;function G0(n,i){switch(n){case"compositionend":return sh(i);case"keypress":return i.which!==32?null:(ih=!0,nh);case"textInput":return n=i.data,n===nh&&ih?null:n;default:return null}}function W0(n,i){if(gs)return n==="compositionend"||!xc&&rh(n,i)?(n=Kf(),Ma=hc=ur=null,gs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return th&&i.locale!=="ko"?null:i.data;default:return null}}var j0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function oh(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!j0[n.type]:i==="textarea"}function ah(n,i,o,c){Pe(c),i=Pa(i,"onChange"),0<i.length&&(o=new pc("onChange","change",null,o,c),n.push({event:o,listeners:i}))}var Ao=null,Ro=null;function X0(n){Th(n,0)}function Aa(n){var i=Ss(n);if(gt(i))return n}function Y0(n,i){if(n==="change")return i}var lh=!1;if(d){var yc;if(d){var Sc="oninput"in document;if(!Sc){var ch=document.createElement("div");ch.setAttribute("oninput","return;"),Sc=typeof ch.oninput=="function"}yc=Sc}else yc=!1;lh=yc&&(!document.documentMode||9<document.documentMode)}function uh(){Ao&&(Ao.detachEvent("onpropertychange",dh),Ro=Ao=null)}function dh(n){if(n.propertyName==="value"&&Aa(Ro)){var i=[];ah(i,Ro,n,j(n)),In(X0,i)}}function q0(n,i,o){n==="focusin"?(uh(),Ao=i,Ro=o,Ao.attachEvent("onpropertychange",dh)):n==="focusout"&&uh()}function $0(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Aa(Ro)}function K0(n,i){if(n==="click")return Aa(i)}function Z0(n,i){if(n==="input"||n==="change")return Aa(i)}function Q0(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var li=typeof Object.is=="function"?Object.is:Q0;function Co(n,i){if(li(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var o=Object.keys(n),c=Object.keys(i);if(o.length!==c.length)return!1;for(c=0;c<o.length;c++){var f=o[c];if(!h.call(i,f)||!li(n[f],i[f]))return!1}return!0}function fh(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function hh(n,i){var o=fh(n);n=0;for(var c;o;){if(o.nodeType===3){if(c=n+o.textContent.length,n<=i&&c>=i)return{node:o,offset:i-n};n=c}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=fh(o)}}function ph(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?ph(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function mh(){for(var n=window,i=Ut();i instanceof n.HTMLIFrameElement;){try{var o=typeof i.contentWindow.location.href=="string"}catch{o=!1}if(o)n=i.contentWindow;else break;i=Ut(n.document)}return i}function Mc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function J0(n){var i=mh(),o=n.focusedElem,c=n.selectionRange;if(i!==o&&o&&o.ownerDocument&&ph(o.ownerDocument.documentElement,o)){if(c!==null&&Mc(o)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in o)o.selectionStart=i,o.selectionEnd=Math.min(n,o.value.length);else if(n=(i=o.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var f=o.textContent.length,g=Math.min(c.start,f);c=c.end===void 0?g:Math.min(c.end,f),!n.extend&&g>c&&(f=c,c=g,g=f),f=hh(o,g);var T=hh(o,c);f&&T&&(n.rangeCount!==1||n.anchorNode!==f.node||n.anchorOffset!==f.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(i=i.createRange(),i.setStart(f.node,f.offset),n.removeAllRanges(),g>c?(n.addRange(i),n.extend(T.node,T.offset)):(i.setEnd(T.node,T.offset),n.addRange(i)))}}for(i=[],n=o;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<i.length;o++)n=i[o],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var ev=d&&"documentMode"in document&&11>=document.documentMode,vs=null,Ec=null,bo=null,wc=!1;function gh(n,i,o){var c=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;wc||vs==null||vs!==Ut(c)||(c=vs,"selectionStart"in c&&Mc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),bo&&Co(bo,c)||(bo=c,c=Pa(Ec,"onSelect"),0<c.length&&(i=new pc("onSelect","select",null,i,o),n.push({event:i,listeners:c}),i.target=vs)))}function Ra(n,i){var o={};return o[n.toLowerCase()]=i.toLowerCase(),o["Webkit"+n]="webkit"+i,o["Moz"+n]="moz"+i,o}var _s={animationend:Ra("Animation","AnimationEnd"),animationiteration:Ra("Animation","AnimationIteration"),animationstart:Ra("Animation","AnimationStart"),transitionend:Ra("Transition","TransitionEnd")},Tc={},vh={};d&&(vh=document.createElement("div").style,"AnimationEvent"in window||(delete _s.animationend.animation,delete _s.animationiteration.animation,delete _s.animationstart.animation),"TransitionEvent"in window||delete _s.transitionend.transition);function Ca(n){if(Tc[n])return Tc[n];if(!_s[n])return n;var i=_s[n],o;for(o in i)if(i.hasOwnProperty(o)&&o in vh)return Tc[n]=i[o];return n}var _h=Ca("animationend"),xh=Ca("animationiteration"),yh=Ca("animationstart"),Sh=Ca("transitionend"),Mh=new Map,Eh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function dr(n,i){Mh.set(n,i),l(i,[n])}for(var Ac=0;Ac<Eh.length;Ac++){var Rc=Eh[Ac],tv=Rc.toLowerCase(),nv=Rc[0].toUpperCase()+Rc.slice(1);dr(tv,"on"+nv)}dr(_h,"onAnimationEnd"),dr(xh,"onAnimationIteration"),dr(yh,"onAnimationStart"),dr("dblclick","onDoubleClick"),dr("focusin","onFocus"),dr("focusout","onBlur"),dr(Sh,"onTransitionEnd"),u("onMouseEnter",["mouseout","mouseover"]),u("onMouseLeave",["mouseout","mouseover"]),u("onPointerEnter",["pointerout","pointerover"]),u("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Po="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),iv=new Set("cancel close invalid load scroll toggle".split(" ").concat(Po));function wh(n,i,o){var c=n.type||"unknown-event";n.currentTarget=o,pa(c,i,void 0,n),n.currentTarget=null}function Th(n,i){i=(i&4)!==0;for(var o=0;o<n.length;o++){var c=n[o],f=c.event;c=c.listeners;e:{var g=void 0;if(i)for(var T=c.length-1;0<=T;T--){var F=c[T],H=F.instance,te=F.currentTarget;if(F=F.listener,H!==g&&f.isPropagationStopped())break e;wh(f,F,te),g=H}else for(T=0;T<c.length;T++){if(F=c[T],H=F.instance,te=F.currentTarget,F=F.listener,H!==g&&f.isPropagationStopped())break e;wh(f,F,te),g=H}}}if(zr)throw n=sr,zr=!1,sr=null,n}function Bt(n,i){var o=i[Uc];o===void 0&&(o=i[Uc]=new Set);var c=n+"__bubble";o.has(c)||(Ah(i,n,2,!1),o.add(c))}function Cc(n,i,o){var c=0;i&&(c|=4),Ah(o,n,c,i)}var ba="_reactListening"+Math.random().toString(36).slice(2);function Lo(n){if(!n[ba]){n[ba]=!0,r.forEach(function(o){o!=="selectionchange"&&(iv.has(o)||Cc(o,!1,n),Cc(o,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[ba]||(i[ba]=!0,Cc("selectionchange",!1,i))}}function Ah(n,i,o,c){switch($f(i)){case 1:var f=v0;break;case 4:f=_0;break;default:f=dc}o=f.bind(null,i,o,n),f=void 0,!fs||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(f=!0),c?f!==void 0?n.addEventListener(i,o,{capture:!0,passive:f}):n.addEventListener(i,o,!0):f!==void 0?n.addEventListener(i,o,{passive:f}):n.addEventListener(i,o,!1)}function bc(n,i,o,c,f){var g=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var T=c.tag;if(T===3||T===4){var F=c.stateNode.containerInfo;if(F===f||F.nodeType===8&&F.parentNode===f)break;if(T===4)for(T=c.return;T!==null;){var H=T.tag;if((H===3||H===4)&&(H=T.stateNode.containerInfo,H===f||H.nodeType===8&&H.parentNode===f))return;T=T.return}for(;F!==null;){if(T=kr(F),T===null)return;if(H=T.tag,H===5||H===6){c=g=T;continue e}F=F.parentNode}}c=c.return}In(function(){var te=g,_e=j(o),ye=[];e:{var ge=Mh.get(n);if(ge!==void 0){var De=pc,ke=n;switch(n){case"keypress":if(Ea(o)===0)break e;case"keydown":case"keyup":De=N0;break;case"focusin":ke="focus",De=vc;break;case"focusout":ke="blur",De=vc;break;case"beforeblur":case"afterblur":De=vc;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":De=Qf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":De=S0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":De=F0;break;case _h:case xh:case yh:De=w0;break;case Sh:De=z0;break;case"scroll":De=x0;break;case"wheel":De=B0;break;case"copy":case"cut":case"paste":De=A0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":De=eh}var He=(i&4)!==0,Yt=!He&&n==="scroll",$=He?ge!==null?ge+"Capture":null:ge;He=[];for(var W=te,K;W!==null;){K=W;var we=K.stateNode;if(K.tag===5&&we!==null&&(K=we,$!==null&&(we=Tn(W,$),we!=null&&He.push(Do(W,we,K)))),Yt)break;W=W.return}0<He.length&&(ge=new De(ge,ke,null,o,_e),ye.push({event:ge,listeners:He}))}}if((i&7)===0){e:{if(ge=n==="mouseover"||n==="pointerover",De=n==="mouseout"||n==="pointerout",ge&&o!==At&&(ke=o.relatedTarget||o.fromElement)&&(kr(ke)||ke[Oi]))break e;if((De||ge)&&(ge=_e.window===_e?_e:(ge=_e.ownerDocument)?ge.defaultView||ge.parentWindow:window,De?(ke=o.relatedTarget||o.toElement,De=te,ke=ke?kr(ke):null,ke!==null&&(Yt=Ei(ke),ke!==Yt||ke.tag!==5&&ke.tag!==6)&&(ke=null)):(De=null,ke=te),De!==ke)){if(He=Qf,we="onMouseLeave",$="onMouseEnter",W="mouse",(n==="pointerout"||n==="pointerover")&&(He=eh,we="onPointerLeave",$="onPointerEnter",W="pointer"),Yt=De==null?ge:Ss(De),K=ke==null?ge:Ss(ke),ge=new He(we,W+"leave",De,o,_e),ge.target=Yt,ge.relatedTarget=K,we=null,kr(_e)===te&&(He=new He($,W+"enter",ke,o,_e),He.target=K,He.relatedTarget=Yt,we=He),Yt=we,De&&ke)t:{for(He=De,$=ke,W=0,K=He;K;K=xs(K))W++;for(K=0,we=$;we;we=xs(we))K++;for(;0<W-K;)He=xs(He),W--;for(;0<K-W;)$=xs($),K--;for(;W--;){if(He===$||$!==null&&He===$.alternate)break t;He=xs(He),$=xs($)}He=null}else He=null;De!==null&&Rh(ye,ge,De,He,!1),ke!==null&&Yt!==null&&Rh(ye,Yt,ke,He,!0)}}e:{if(ge=te?Ss(te):window,De=ge.nodeName&&ge.nodeName.toLowerCase(),De==="select"||De==="input"&&ge.type==="file")var je=Y0;else if(oh(ge))if(lh)je=Z0;else{je=$0;var Ze=q0}else(De=ge.nodeName)&&De.toLowerCase()==="input"&&(ge.type==="checkbox"||ge.type==="radio")&&(je=K0);if(je&&(je=je(n,te))){ah(ye,je,o,_e);break e}Ze&&Ze(n,ge,te),n==="focusout"&&(Ze=ge._wrapperState)&&Ze.controlled&&ge.type==="number"&&Rt(ge,"number",ge.value)}switch(Ze=te?Ss(te):window,n){case"focusin":(oh(Ze)||Ze.contentEditable==="true")&&(vs=Ze,Ec=te,bo=null);break;case"focusout":bo=Ec=vs=null;break;case"mousedown":wc=!0;break;case"contextmenu":case"mouseup":case"dragend":wc=!1,gh(ye,o,_e);break;case"selectionchange":if(ev)break;case"keydown":case"keyup":gh(ye,o,_e)}var Qe;if(xc)e:{switch(n){case"compositionstart":var it="onCompositionStart";break e;case"compositionend":it="onCompositionEnd";break e;case"compositionupdate":it="onCompositionUpdate";break e}it=void 0}else gs?rh(n,o)&&(it="onCompositionEnd"):n==="keydown"&&o.keyCode===229&&(it="onCompositionStart");it&&(th&&o.locale!=="ko"&&(gs||it!=="onCompositionStart"?it==="onCompositionEnd"&&gs&&(Qe=Kf()):(ur=_e,hc="value"in ur?ur.value:ur.textContent,gs=!0)),Ze=Pa(te,it),0<Ze.length&&(it=new Jf(it,n,null,o,_e),ye.push({event:it,listeners:Ze}),Qe?it.data=Qe:(Qe=sh(o),Qe!==null&&(it.data=Qe)))),(Qe=V0?G0(n,o):W0(n,o))&&(te=Pa(te,"onBeforeInput"),0<te.length&&(_e=new Jf("onBeforeInput","beforeinput",null,o,_e),ye.push({event:_e,listeners:te}),_e.data=Qe))}Th(ye,i)})}function Do(n,i,o){return{instance:n,listener:i,currentTarget:o}}function Pa(n,i){for(var o=i+"Capture",c=[];n!==null;){var f=n,g=f.stateNode;f.tag===5&&g!==null&&(f=g,g=Tn(n,o),g!=null&&c.unshift(Do(n,g,f)),g=Tn(n,i),g!=null&&c.push(Do(n,g,f))),n=n.return}return c}function xs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Rh(n,i,o,c,f){for(var g=i._reactName,T=[];o!==null&&o!==c;){var F=o,H=F.alternate,te=F.stateNode;if(H!==null&&H===c)break;F.tag===5&&te!==null&&(F=te,f?(H=Tn(o,g),H!=null&&T.unshift(Do(o,H,F))):f||(H=Tn(o,g),H!=null&&T.push(Do(o,H,F)))),o=o.return}T.length!==0&&n.push({event:i,listeners:T})}var rv=/\r\n?/g,sv=/\u0000|\uFFFD/g;function Ch(n){return(typeof n=="string"?n:""+n).replace(rv,`
`).replace(sv,"")}function La(n,i,o){if(i=Ch(i),Ch(n)!==i&&o)throw Error(t(425))}function Da(){}var Pc=null,Lc=null;function Dc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Nc=typeof setTimeout=="function"?setTimeout:void 0,ov=typeof clearTimeout=="function"?clearTimeout:void 0,bh=typeof Promise=="function"?Promise:void 0,av=typeof queueMicrotask=="function"?queueMicrotask:typeof bh<"u"?function(n){return bh.resolve(null).then(n).catch(lv)}:Nc;function lv(n){setTimeout(function(){throw n})}function Ic(n,i){var o=i,c=0;do{var f=o.nextSibling;if(n.removeChild(o),f&&f.nodeType===8)if(o=f.data,o==="/$"){if(c===0){n.removeChild(f),Mo(i);return}c--}else o!=="$"&&o!=="$?"&&o!=="$!"||c++;o=f}while(o);Mo(i)}function fr(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function Ph(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="$"||o==="$!"||o==="$?"){if(i===0)return n;i--}else o==="/$"&&i++}n=n.previousSibling}return null}var ys=Math.random().toString(36).slice(2),Ti="__reactFiber$"+ys,No="__reactProps$"+ys,Oi="__reactContainer$"+ys,Uc="__reactEvents$"+ys,cv="__reactListeners$"+ys,uv="__reactHandles$"+ys;function kr(n){var i=n[Ti];if(i)return i;for(var o=n.parentNode;o;){if(i=o[Oi]||o[Ti]){if(o=i.alternate,i.child!==null||o!==null&&o.child!==null)for(n=Ph(n);n!==null;){if(o=n[Ti])return o;n=Ph(n)}return i}n=o,o=n.parentNode}return null}function Io(n){return n=n[Ti]||n[Oi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Ss(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Na(n){return n[No]||null}var Fc=[],Ms=-1;function hr(n){return{current:n}}function Ht(n){0>Ms||(n.current=Fc[Ms],Fc[Ms]=null,Ms--)}function Ft(n,i){Ms++,Fc[Ms]=n.current,n.current=i}var pr={},vn=hr(pr),Fn=hr(!1),Br=pr;function Es(n,i){var o=n.type.contextTypes;if(!o)return pr;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var f={},g;for(g in o)f[g]=i[g];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=f),f}function On(n){return n=n.childContextTypes,n!=null}function Ia(){Ht(Fn),Ht(vn)}function Lh(n,i,o){if(vn.current!==pr)throw Error(t(168));Ft(vn,i),Ft(Fn,o)}function Dh(n,i,o){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return o;c=c.getChildContext();for(var f in c)if(!(f in i))throw Error(t(108,xe(n)||"Unknown",f));return oe({},o,c)}function Ua(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||pr,Br=vn.current,Ft(vn,n),Ft(Fn,Fn.current),!0}function Nh(n,i,o){var c=n.stateNode;if(!c)throw Error(t(169));o?(n=Dh(n,i,Br),c.__reactInternalMemoizedMergedChildContext=n,Ht(Fn),Ht(vn),Ft(vn,n)):Ht(Fn),Ft(Fn,o)}var zi=null,Fa=!1,Oc=!1;function Ih(n){zi===null?zi=[n]:zi.push(n)}function dv(n){Fa=!0,Ih(n)}function mr(){if(!Oc&&zi!==null){Oc=!0;var n=0,i=Ct;try{var o=zi;for(Ct=1;n<o.length;n++){var c=o[n];do c=c(!0);while(c!==null)}zi=null,Fa=!1}catch(f){throw zi!==null&&(zi=zi.slice(n+1)),ne(Be,mr),f}finally{Ct=i,Oc=!1}}return null}var ws=[],Ts=0,Oa=null,za=0,Jn=[],ei=0,Hr=null,ki=1,Bi="";function Vr(n,i){ws[Ts++]=za,ws[Ts++]=Oa,Oa=n,za=i}function Uh(n,i,o){Jn[ei++]=ki,Jn[ei++]=Bi,Jn[ei++]=Hr,Hr=n;var c=ki;n=Bi;var f=32-at(c)-1;c&=~(1<<f),o+=1;var g=32-at(i)+f;if(30<g){var T=f-f%5;g=(c&(1<<T)-1).toString(32),c>>=T,f-=T,ki=1<<32-at(i)+f|o<<f|c,Bi=g+n}else ki=1<<g|o<<f|c,Bi=n}function zc(n){n.return!==null&&(Vr(n,1),Uh(n,1,0))}function kc(n){for(;n===Oa;)Oa=ws[--Ts],ws[Ts]=null,za=ws[--Ts],ws[Ts]=null;for(;n===Hr;)Hr=Jn[--ei],Jn[ei]=null,Bi=Jn[--ei],Jn[ei]=null,ki=Jn[--ei],Jn[ei]=null}var Xn=null,Yn=null,Vt=!1,ci=null;function Fh(n,i){var o=ri(5,null,null,0);o.elementType="DELETED",o.stateNode=i,o.return=n,i=n.deletions,i===null?(n.deletions=[o],n.flags|=16):i.push(o)}function Oh(n,i){switch(n.tag){case 5:var o=n.type;return i=i.nodeType!==1||o.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,Xn=n,Yn=fr(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,Xn=n,Yn=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(o=Hr!==null?{id:ki,overflow:Bi}:null,n.memoizedState={dehydrated:i,treeContext:o,retryLane:1073741824},o=ri(18,null,null,0),o.stateNode=i,o.return=n,n.child=o,Xn=n,Yn=null,!0):!1;default:return!1}}function Bc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Hc(n){if(Vt){var i=Yn;if(i){var o=i;if(!Oh(n,i)){if(Bc(n))throw Error(t(418));i=fr(o.nextSibling);var c=Xn;i&&Oh(n,i)?Fh(c,o):(n.flags=n.flags&-4097|2,Vt=!1,Xn=n)}}else{if(Bc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Vt=!1,Xn=n}}}function zh(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Xn=n}function ka(n){if(n!==Xn)return!1;if(!Vt)return zh(n),Vt=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Dc(n.type,n.memoizedProps)),i&&(i=Yn)){if(Bc(n))throw kh(),Error(t(418));for(;i;)Fh(n,i),i=fr(i.nextSibling)}if(zh(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="/$"){if(i===0){Yn=fr(n.nextSibling);break e}i--}else o!=="$"&&o!=="$!"&&o!=="$?"||i++}n=n.nextSibling}Yn=null}}else Yn=Xn?fr(n.stateNode.nextSibling):null;return!0}function kh(){for(var n=Yn;n;)n=fr(n.nextSibling)}function As(){Yn=Xn=null,Vt=!1}function Vc(n){ci===null?ci=[n]:ci.push(n)}var fv=A.ReactCurrentBatchConfig;function Uo(n,i,o){if(n=o.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(t(309));var c=o.stateNode}if(!c)throw Error(t(147,n));var f=c,g=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===g?i.ref:(i=function(T){var F=f.refs;T===null?delete F[g]:F[g]=T},i._stringRef=g,i)}if(typeof n!="string")throw Error(t(284));if(!o._owner)throw Error(t(290,n))}return n}function Ba(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function Bh(n){var i=n._init;return i(n._payload)}function Hh(n){function i($,W){if(n){var K=$.deletions;K===null?($.deletions=[W],$.flags|=16):K.push(W)}}function o($,W){if(!n)return null;for(;W!==null;)i($,W),W=W.sibling;return null}function c($,W){for($=new Map;W!==null;)W.key!==null?$.set(W.key,W):$.set(W.index,W),W=W.sibling;return $}function f($,W){return $=Er($,W),$.index=0,$.sibling=null,$}function g($,W,K){return $.index=K,n?(K=$.alternate,K!==null?(K=K.index,K<W?($.flags|=2,W):K):($.flags|=2,W)):($.flags|=1048576,W)}function T($){return n&&$.alternate===null&&($.flags|=2),$}function F($,W,K,we){return W===null||W.tag!==6?(W=Nu(K,$.mode,we),W.return=$,W):(W=f(W,K),W.return=$,W)}function H($,W,K,we){var je=K.type;return je===U?_e($,W,K.props.children,we,K.key):W!==null&&(W.elementType===je||typeof je=="object"&&je!==null&&je.$$typeof===ae&&Bh(je)===W.type)?(we=f(W,K.props),we.ref=Uo($,W,K),we.return=$,we):(we=ul(K.type,K.key,K.props,null,$.mode,we),we.ref=Uo($,W,K),we.return=$,we)}function te($,W,K,we){return W===null||W.tag!==4||W.stateNode.containerInfo!==K.containerInfo||W.stateNode.implementation!==K.implementation?(W=Iu(K,$.mode,we),W.return=$,W):(W=f(W,K.children||[]),W.return=$,W)}function _e($,W,K,we,je){return W===null||W.tag!==7?(W=Kr(K,$.mode,we,je),W.return=$,W):(W=f(W,K),W.return=$,W)}function ye($,W,K){if(typeof W=="string"&&W!==""||typeof W=="number")return W=Nu(""+W,$.mode,K),W.return=$,W;if(typeof W=="object"&&W!==null){switch(W.$$typeof){case k:return K=ul(W.type,W.key,W.props,null,$.mode,K),K.ref=Uo($,null,W),K.return=$,K;case N:return W=Iu(W,$.mode,K),W.return=$,W;case ae:var we=W._init;return ye($,we(W._payload),K)}if(qe(W)||ce(W))return W=Kr(W,$.mode,K,null),W.return=$,W;Ba($,W)}return null}function ge($,W,K,we){var je=W!==null?W.key:null;if(typeof K=="string"&&K!==""||typeof K=="number")return je!==null?null:F($,W,""+K,we);if(typeof K=="object"&&K!==null){switch(K.$$typeof){case k:return K.key===je?H($,W,K,we):null;case N:return K.key===je?te($,W,K,we):null;case ae:return je=K._init,ge($,W,je(K._payload),we)}if(qe(K)||ce(K))return je!==null?null:_e($,W,K,we,null);Ba($,K)}return null}function De($,W,K,we,je){if(typeof we=="string"&&we!==""||typeof we=="number")return $=$.get(K)||null,F(W,$,""+we,je);if(typeof we=="object"&&we!==null){switch(we.$$typeof){case k:return $=$.get(we.key===null?K:we.key)||null,H(W,$,we,je);case N:return $=$.get(we.key===null?K:we.key)||null,te(W,$,we,je);case ae:var Ze=we._init;return De($,W,K,Ze(we._payload),je)}if(qe(we)||ce(we))return $=$.get(K)||null,_e(W,$,we,je,null);Ba(W,we)}return null}function ke($,W,K,we){for(var je=null,Ze=null,Qe=W,it=W=0,ln=null;Qe!==null&&it<K.length;it++){Qe.index>it?(ln=Qe,Qe=null):ln=Qe.sibling;var wt=ge($,Qe,K[it],we);if(wt===null){Qe===null&&(Qe=ln);break}n&&Qe&&wt.alternate===null&&i($,Qe),W=g(wt,W,it),Ze===null?je=wt:Ze.sibling=wt,Ze=wt,Qe=ln}if(it===K.length)return o($,Qe),Vt&&Vr($,it),je;if(Qe===null){for(;it<K.length;it++)Qe=ye($,K[it],we),Qe!==null&&(W=g(Qe,W,it),Ze===null?je=Qe:Ze.sibling=Qe,Ze=Qe);return Vt&&Vr($,it),je}for(Qe=c($,Qe);it<K.length;it++)ln=De(Qe,$,it,K[it],we),ln!==null&&(n&&ln.alternate!==null&&Qe.delete(ln.key===null?it:ln.key),W=g(ln,W,it),Ze===null?je=ln:Ze.sibling=ln,Ze=ln);return n&&Qe.forEach(function(wr){return i($,wr)}),Vt&&Vr($,it),je}function He($,W,K,we){var je=ce(K);if(typeof je!="function")throw Error(t(150));if(K=je.call(K),K==null)throw Error(t(151));for(var Ze=je=null,Qe=W,it=W=0,ln=null,wt=K.next();Qe!==null&&!wt.done;it++,wt=K.next()){Qe.index>it?(ln=Qe,Qe=null):ln=Qe.sibling;var wr=ge($,Qe,wt.value,we);if(wr===null){Qe===null&&(Qe=ln);break}n&&Qe&&wr.alternate===null&&i($,Qe),W=g(wr,W,it),Ze===null?je=wr:Ze.sibling=wr,Ze=wr,Qe=ln}if(wt.done)return o($,Qe),Vt&&Vr($,it),je;if(Qe===null){for(;!wt.done;it++,wt=K.next())wt=ye($,wt.value,we),wt!==null&&(W=g(wt,W,it),Ze===null?je=wt:Ze.sibling=wt,Ze=wt);return Vt&&Vr($,it),je}for(Qe=c($,Qe);!wt.done;it++,wt=K.next())wt=De(Qe,$,it,wt.value,we),wt!==null&&(n&&wt.alternate!==null&&Qe.delete(wt.key===null?it:wt.key),W=g(wt,W,it),Ze===null?je=wt:Ze.sibling=wt,Ze=wt);return n&&Qe.forEach(function(jv){return i($,jv)}),Vt&&Vr($,it),je}function Yt($,W,K,we){if(typeof K=="object"&&K!==null&&K.type===U&&K.key===null&&(K=K.props.children),typeof K=="object"&&K!==null){switch(K.$$typeof){case k:e:{for(var je=K.key,Ze=W;Ze!==null;){if(Ze.key===je){if(je=K.type,je===U){if(Ze.tag===7){o($,Ze.sibling),W=f(Ze,K.props.children),W.return=$,$=W;break e}}else if(Ze.elementType===je||typeof je=="object"&&je!==null&&je.$$typeof===ae&&Bh(je)===Ze.type){o($,Ze.sibling),W=f(Ze,K.props),W.ref=Uo($,Ze,K),W.return=$,$=W;break e}o($,Ze);break}else i($,Ze);Ze=Ze.sibling}K.type===U?(W=Kr(K.props.children,$.mode,we,K.key),W.return=$,$=W):(we=ul(K.type,K.key,K.props,null,$.mode,we),we.ref=Uo($,W,K),we.return=$,$=we)}return T($);case N:e:{for(Ze=K.key;W!==null;){if(W.key===Ze)if(W.tag===4&&W.stateNode.containerInfo===K.containerInfo&&W.stateNode.implementation===K.implementation){o($,W.sibling),W=f(W,K.children||[]),W.return=$,$=W;break e}else{o($,W);break}else i($,W);W=W.sibling}W=Iu(K,$.mode,we),W.return=$,$=W}return T($);case ae:return Ze=K._init,Yt($,W,Ze(K._payload),we)}if(qe(K))return ke($,W,K,we);if(ce(K))return He($,W,K,we);Ba($,K)}return typeof K=="string"&&K!==""||typeof K=="number"?(K=""+K,W!==null&&W.tag===6?(o($,W.sibling),W=f(W,K),W.return=$,$=W):(o($,W),W=Nu(K,$.mode,we),W.return=$,$=W),T($)):o($,W)}return Yt}var Rs=Hh(!0),Vh=Hh(!1),Ha=hr(null),Va=null,Cs=null,Gc=null;function Wc(){Gc=Cs=Va=null}function jc(n){var i=Ha.current;Ht(Ha),n._currentValue=i}function Xc(n,i,o){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===o)break;n=n.return}}function bs(n,i){Va=n,Gc=Cs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(zn=!0),n.firstContext=null)}function ti(n){var i=n._currentValue;if(Gc!==n)if(n={context:n,memoizedValue:i,next:null},Cs===null){if(Va===null)throw Error(t(308));Cs=n,Va.dependencies={lanes:0,firstContext:n}}else Cs=Cs.next=n;return i}var Gr=null;function Yc(n){Gr===null?Gr=[n]:Gr.push(n)}function Gh(n,i,o,c){var f=i.interleaved;return f===null?(o.next=o,Yc(i)):(o.next=f.next,f.next=o),i.interleaved=o,Hi(n,c)}function Hi(n,i){n.lanes|=i;var o=n.alternate;for(o!==null&&(o.lanes|=i),o=n,n=n.return;n!==null;)n.childLanes|=i,o=n.alternate,o!==null&&(o.childLanes|=i),o=n,n=n.return;return o.tag===3?o.stateNode:null}var gr=!1;function qc(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Wh(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Vi(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function vr(n,i,o){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(St&2)!==0){var f=c.pending;return f===null?i.next=i:(i.next=f.next,f.next=i),c.pending=i,Hi(n,o)}return f=c.interleaved,f===null?(i.next=i,Yc(c)):(i.next=f.next,f.next=i),c.interleaved=i,Hi(n,o)}function Ga(n,i,o){if(i=i.updateQueue,i!==null&&(i=i.shared,(o&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,o|=c,i.lanes=o,lc(n,o)}}function jh(n,i){var o=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,o===c)){var f=null,g=null;if(o=o.firstBaseUpdate,o!==null){do{var T={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};g===null?f=g=T:g=g.next=T,o=o.next}while(o!==null);g===null?f=g=i:g=g.next=i}else f=g=i;o={baseState:c.baseState,firstBaseUpdate:f,lastBaseUpdate:g,shared:c.shared,effects:c.effects},n.updateQueue=o;return}n=o.lastBaseUpdate,n===null?o.firstBaseUpdate=i:n.next=i,o.lastBaseUpdate=i}function Wa(n,i,o,c){var f=n.updateQueue;gr=!1;var g=f.firstBaseUpdate,T=f.lastBaseUpdate,F=f.shared.pending;if(F!==null){f.shared.pending=null;var H=F,te=H.next;H.next=null,T===null?g=te:T.next=te,T=H;var _e=n.alternate;_e!==null&&(_e=_e.updateQueue,F=_e.lastBaseUpdate,F!==T&&(F===null?_e.firstBaseUpdate=te:F.next=te,_e.lastBaseUpdate=H))}if(g!==null){var ye=f.baseState;T=0,_e=te=H=null,F=g;do{var ge=F.lane,De=F.eventTime;if((c&ge)===ge){_e!==null&&(_e=_e.next={eventTime:De,lane:0,tag:F.tag,payload:F.payload,callback:F.callback,next:null});e:{var ke=n,He=F;switch(ge=i,De=o,He.tag){case 1:if(ke=He.payload,typeof ke=="function"){ye=ke.call(De,ye,ge);break e}ye=ke;break e;case 3:ke.flags=ke.flags&-65537|128;case 0:if(ke=He.payload,ge=typeof ke=="function"?ke.call(De,ye,ge):ke,ge==null)break e;ye=oe({},ye,ge);break e;case 2:gr=!0}}F.callback!==null&&F.lane!==0&&(n.flags|=64,ge=f.effects,ge===null?f.effects=[F]:ge.push(F))}else De={eventTime:De,lane:ge,tag:F.tag,payload:F.payload,callback:F.callback,next:null},_e===null?(te=_e=De,H=ye):_e=_e.next=De,T|=ge;if(F=F.next,F===null){if(F=f.shared.pending,F===null)break;ge=F,F=ge.next,ge.next=null,f.lastBaseUpdate=ge,f.shared.pending=null}}while(!0);if(_e===null&&(H=ye),f.baseState=H,f.firstBaseUpdate=te,f.lastBaseUpdate=_e,i=f.shared.interleaved,i!==null){f=i;do T|=f.lane,f=f.next;while(f!==i)}else g===null&&(f.shared.lanes=0);Xr|=T,n.lanes=T,n.memoizedState=ye}}function Xh(n,i,o){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],f=c.callback;if(f!==null){if(c.callback=null,c=o,typeof f!="function")throw Error(t(191,f));f.call(c)}}}var Fo={},Ai=hr(Fo),Oo=hr(Fo),zo=hr(Fo);function Wr(n){if(n===Fo)throw Error(t(174));return n}function $c(n,i){switch(Ft(zo,i),Ft(Oo,n),Ft(Ai,Fo),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Ve(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=Ve(i,n)}Ht(Ai),Ft(Ai,i)}function Ps(){Ht(Ai),Ht(Oo),Ht(zo)}function Yh(n){Wr(zo.current);var i=Wr(Ai.current),o=Ve(i,n.type);i!==o&&(Ft(Oo,n),Ft(Ai,o))}function Kc(n){Oo.current===n&&(Ht(Ai),Ht(Oo))}var Wt=hr(0);function ja(n){for(var i=n;i!==null;){if(i.tag===13){var o=i.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Zc=[];function Qc(){for(var n=0;n<Zc.length;n++)Zc[n]._workInProgressVersionPrimary=null;Zc.length=0}var Xa=A.ReactCurrentDispatcher,Jc=A.ReactCurrentBatchConfig,jr=0,jt=null,tn=null,on=null,Ya=!1,ko=!1,Bo=0,hv=0;function _n(){throw Error(t(321))}function eu(n,i){if(i===null)return!1;for(var o=0;o<i.length&&o<n.length;o++)if(!li(n[o],i[o]))return!1;return!0}function tu(n,i,o,c,f,g){if(jr=g,jt=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Xa.current=n===null||n.memoizedState===null?vv:_v,n=o(c,f),ko){g=0;do{if(ko=!1,Bo=0,25<=g)throw Error(t(301));g+=1,on=tn=null,i.updateQueue=null,Xa.current=xv,n=o(c,f)}while(ko)}if(Xa.current=Ka,i=tn!==null&&tn.next!==null,jr=0,on=tn=jt=null,Ya=!1,i)throw Error(t(300));return n}function nu(){var n=Bo!==0;return Bo=0,n}function Ri(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return on===null?jt.memoizedState=on=n:on=on.next=n,on}function ni(){if(tn===null){var n=jt.alternate;n=n!==null?n.memoizedState:null}else n=tn.next;var i=on===null?jt.memoizedState:on.next;if(i!==null)on=i,tn=n;else{if(n===null)throw Error(t(310));tn=n,n={memoizedState:tn.memoizedState,baseState:tn.baseState,baseQueue:tn.baseQueue,queue:tn.queue,next:null},on===null?jt.memoizedState=on=n:on=on.next=n}return on}function Ho(n,i){return typeof i=="function"?i(n):i}function iu(n){var i=ni(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var c=tn,f=c.baseQueue,g=o.pending;if(g!==null){if(f!==null){var T=f.next;f.next=g.next,g.next=T}c.baseQueue=f=g,o.pending=null}if(f!==null){g=f.next,c=c.baseState;var F=T=null,H=null,te=g;do{var _e=te.lane;if((jr&_e)===_e)H!==null&&(H=H.next={lane:0,action:te.action,hasEagerState:te.hasEagerState,eagerState:te.eagerState,next:null}),c=te.hasEagerState?te.eagerState:n(c,te.action);else{var ye={lane:_e,action:te.action,hasEagerState:te.hasEagerState,eagerState:te.eagerState,next:null};H===null?(F=H=ye,T=c):H=H.next=ye,jt.lanes|=_e,Xr|=_e}te=te.next}while(te!==null&&te!==g);H===null?T=c:H.next=F,li(c,i.memoizedState)||(zn=!0),i.memoizedState=c,i.baseState=T,i.baseQueue=H,o.lastRenderedState=c}if(n=o.interleaved,n!==null){f=n;do g=f.lane,jt.lanes|=g,Xr|=g,f=f.next;while(f!==n)}else f===null&&(o.lanes=0);return[i.memoizedState,o.dispatch]}function ru(n){var i=ni(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var c=o.dispatch,f=o.pending,g=i.memoizedState;if(f!==null){o.pending=null;var T=f=f.next;do g=n(g,T.action),T=T.next;while(T!==f);li(g,i.memoizedState)||(zn=!0),i.memoizedState=g,i.baseQueue===null&&(i.baseState=g),o.lastRenderedState=g}return[g,c]}function qh(){}function $h(n,i){var o=jt,c=ni(),f=i(),g=!li(c.memoizedState,f);if(g&&(c.memoizedState=f,zn=!0),c=c.queue,su(Qh.bind(null,o,c,n),[n]),c.getSnapshot!==i||g||on!==null&&on.memoizedState.tag&1){if(o.flags|=2048,Vo(9,Zh.bind(null,o,c,f,i),void 0,null),an===null)throw Error(t(349));(jr&30)!==0||Kh(o,i,f)}return f}function Kh(n,i,o){n.flags|=16384,n={getSnapshot:i,value:o},i=jt.updateQueue,i===null?(i={lastEffect:null,stores:null},jt.updateQueue=i,i.stores=[n]):(o=i.stores,o===null?i.stores=[n]:o.push(n))}function Zh(n,i,o,c){i.value=o,i.getSnapshot=c,Jh(i)&&ep(n)}function Qh(n,i,o){return o(function(){Jh(i)&&ep(n)})}function Jh(n){var i=n.getSnapshot;n=n.value;try{var o=i();return!li(n,o)}catch{return!0}}function ep(n){var i=Hi(n,1);i!==null&&hi(i,n,1,-1)}function tp(n){var i=Ri();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ho,lastRenderedState:n},i.queue=n,n=n.dispatch=gv.bind(null,jt,n),[i.memoizedState,n]}function Vo(n,i,o,c){return n={tag:n,create:i,destroy:o,deps:c,next:null},i=jt.updateQueue,i===null?(i={lastEffect:null,stores:null},jt.updateQueue=i,i.lastEffect=n.next=n):(o=i.lastEffect,o===null?i.lastEffect=n.next=n:(c=o.next,o.next=n,n.next=c,i.lastEffect=n)),n}function np(){return ni().memoizedState}function qa(n,i,o,c){var f=Ri();jt.flags|=n,f.memoizedState=Vo(1|i,o,void 0,c===void 0?null:c)}function $a(n,i,o,c){var f=ni();c=c===void 0?null:c;var g=void 0;if(tn!==null){var T=tn.memoizedState;if(g=T.destroy,c!==null&&eu(c,T.deps)){f.memoizedState=Vo(i,o,g,c);return}}jt.flags|=n,f.memoizedState=Vo(1|i,o,g,c)}function ip(n,i){return qa(8390656,8,n,i)}function su(n,i){return $a(2048,8,n,i)}function rp(n,i){return $a(4,2,n,i)}function sp(n,i){return $a(4,4,n,i)}function op(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function ap(n,i,o){return o=o!=null?o.concat([n]):null,$a(4,4,op.bind(null,i,n),o)}function ou(){}function lp(n,i){var o=ni();i=i===void 0?null:i;var c=o.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(o.memoizedState=[n,i],n)}function cp(n,i){var o=ni();i=i===void 0?null:i;var c=o.memoizedState;return c!==null&&i!==null&&eu(i,c[1])?c[0]:(n=n(),o.memoizedState=[n,i],n)}function up(n,i,o){return(jr&21)===0?(n.baseState&&(n.baseState=!1,zn=!0),n.memoizedState=o):(li(o,i)||(o=An(),jt.lanes|=o,Xr|=o,n.baseState=!0),i)}function pv(n,i){var o=Ct;Ct=o!==0&&4>o?o:4,n(!0);var c=Jc.transition;Jc.transition={};try{n(!1),i()}finally{Ct=o,Jc.transition=c}}function dp(){return ni().memoizedState}function mv(n,i,o){var c=Sr(n);if(o={lane:c,action:o,hasEagerState:!1,eagerState:null,next:null},fp(n))hp(i,o);else if(o=Gh(n,i,o,c),o!==null){var f=Cn();hi(o,n,c,f),pp(o,i,c)}}function gv(n,i,o){var c=Sr(n),f={lane:c,action:o,hasEagerState:!1,eagerState:null,next:null};if(fp(n))hp(i,f);else{var g=n.alternate;if(n.lanes===0&&(g===null||g.lanes===0)&&(g=i.lastRenderedReducer,g!==null))try{var T=i.lastRenderedState,F=g(T,o);if(f.hasEagerState=!0,f.eagerState=F,li(F,T)){var H=i.interleaved;H===null?(f.next=f,Yc(i)):(f.next=H.next,H.next=f),i.interleaved=f;return}}catch{}finally{}o=Gh(n,i,f,c),o!==null&&(f=Cn(),hi(o,n,c,f),pp(o,i,c))}}function fp(n){var i=n.alternate;return n===jt||i!==null&&i===jt}function hp(n,i){ko=Ya=!0;var o=n.pending;o===null?i.next=i:(i.next=o.next,o.next=i),n.pending=i}function pp(n,i,o){if((o&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,o|=c,i.lanes=o,lc(n,o)}}var Ka={readContext:ti,useCallback:_n,useContext:_n,useEffect:_n,useImperativeHandle:_n,useInsertionEffect:_n,useLayoutEffect:_n,useMemo:_n,useReducer:_n,useRef:_n,useState:_n,useDebugValue:_n,useDeferredValue:_n,useTransition:_n,useMutableSource:_n,useSyncExternalStore:_n,useId:_n,unstable_isNewReconciler:!1},vv={readContext:ti,useCallback:function(n,i){return Ri().memoizedState=[n,i===void 0?null:i],n},useContext:ti,useEffect:ip,useImperativeHandle:function(n,i,o){return o=o!=null?o.concat([n]):null,qa(4194308,4,op.bind(null,i,n),o)},useLayoutEffect:function(n,i){return qa(4194308,4,n,i)},useInsertionEffect:function(n,i){return qa(4,2,n,i)},useMemo:function(n,i){var o=Ri();return i=i===void 0?null:i,n=n(),o.memoizedState=[n,i],n},useReducer:function(n,i,o){var c=Ri();return i=o!==void 0?o(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=mv.bind(null,jt,n),[c.memoizedState,n]},useRef:function(n){var i=Ri();return n={current:n},i.memoizedState=n},useState:tp,useDebugValue:ou,useDeferredValue:function(n){return Ri().memoizedState=n},useTransition:function(){var n=tp(!1),i=n[0];return n=pv.bind(null,n[1]),Ri().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,o){var c=jt,f=Ri();if(Vt){if(o===void 0)throw Error(t(407));o=o()}else{if(o=i(),an===null)throw Error(t(349));(jr&30)!==0||Kh(c,i,o)}f.memoizedState=o;var g={value:o,getSnapshot:i};return f.queue=g,ip(Qh.bind(null,c,g,n),[n]),c.flags|=2048,Vo(9,Zh.bind(null,c,g,o,i),void 0,null),o},useId:function(){var n=Ri(),i=an.identifierPrefix;if(Vt){var o=Bi,c=ki;o=(c&~(1<<32-at(c)-1)).toString(32)+o,i=":"+i+"R"+o,o=Bo++,0<o&&(i+="H"+o.toString(32)),i+=":"}else o=hv++,i=":"+i+"r"+o.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},_v={readContext:ti,useCallback:lp,useContext:ti,useEffect:su,useImperativeHandle:ap,useInsertionEffect:rp,useLayoutEffect:sp,useMemo:cp,useReducer:iu,useRef:np,useState:function(){return iu(Ho)},useDebugValue:ou,useDeferredValue:function(n){var i=ni();return up(i,tn.memoizedState,n)},useTransition:function(){var n=iu(Ho)[0],i=ni().memoizedState;return[n,i]},useMutableSource:qh,useSyncExternalStore:$h,useId:dp,unstable_isNewReconciler:!1},xv={readContext:ti,useCallback:lp,useContext:ti,useEffect:su,useImperativeHandle:ap,useInsertionEffect:rp,useLayoutEffect:sp,useMemo:cp,useReducer:ru,useRef:np,useState:function(){return ru(Ho)},useDebugValue:ou,useDeferredValue:function(n){var i=ni();return tn===null?i.memoizedState=n:up(i,tn.memoizedState,n)},useTransition:function(){var n=ru(Ho)[0],i=ni().memoizedState;return[n,i]},useMutableSource:qh,useSyncExternalStore:$h,useId:dp,unstable_isNewReconciler:!1};function ui(n,i){if(n&&n.defaultProps){i=oe({},i),n=n.defaultProps;for(var o in n)i[o]===void 0&&(i[o]=n[o]);return i}return i}function au(n,i,o,c){i=n.memoizedState,o=o(c,i),o=o==null?i:oe({},i,o),n.memoizedState=o,n.lanes===0&&(n.updateQueue.baseState=o)}var Za={isMounted:function(n){return(n=n._reactInternals)?Ei(n)===n:!1},enqueueSetState:function(n,i,o){n=n._reactInternals;var c=Cn(),f=Sr(n),g=Vi(c,f);g.payload=i,o!=null&&(g.callback=o),i=vr(n,g,f),i!==null&&(hi(i,n,f,c),Ga(i,n,f))},enqueueReplaceState:function(n,i,o){n=n._reactInternals;var c=Cn(),f=Sr(n),g=Vi(c,f);g.tag=1,g.payload=i,o!=null&&(g.callback=o),i=vr(n,g,f),i!==null&&(hi(i,n,f,c),Ga(i,n,f))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var o=Cn(),c=Sr(n),f=Vi(o,c);f.tag=2,i!=null&&(f.callback=i),i=vr(n,f,c),i!==null&&(hi(i,n,c,o),Ga(i,n,c))}};function mp(n,i,o,c,f,g,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,g,T):i.prototype&&i.prototype.isPureReactComponent?!Co(o,c)||!Co(f,g):!0}function gp(n,i,o){var c=!1,f=pr,g=i.contextType;return typeof g=="object"&&g!==null?g=ti(g):(f=On(i)?Br:vn.current,c=i.contextTypes,g=(c=c!=null)?Es(n,f):pr),i=new i(o,g),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Za,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=f,n.__reactInternalMemoizedMaskedChildContext=g),i}function vp(n,i,o,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(o,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(o,c),i.state!==n&&Za.enqueueReplaceState(i,i.state,null)}function lu(n,i,o,c){var f=n.stateNode;f.props=o,f.state=n.memoizedState,f.refs={},qc(n);var g=i.contextType;typeof g=="object"&&g!==null?f.context=ti(g):(g=On(i)?Br:vn.current,f.context=Es(n,g)),f.state=n.memoizedState,g=i.getDerivedStateFromProps,typeof g=="function"&&(au(n,i,g,o),f.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(i=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),i!==f.state&&Za.enqueueReplaceState(f,f.state,null),Wa(n,o,f,c),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308)}function Ls(n,i){try{var o="",c=i;do o+=fe(c),c=c.return;while(c);var f=o}catch(g){f=`
Error generating stack: `+g.message+`
`+g.stack}return{value:n,source:i,stack:f,digest:null}}function cu(n,i,o){return{value:n,source:null,stack:o??null,digest:i??null}}function uu(n,i){try{console.error(i.value)}catch(o){setTimeout(function(){throw o})}}var yv=typeof WeakMap=="function"?WeakMap:Map;function _p(n,i,o){o=Vi(-1,o),o.tag=3,o.payload={element:null};var c=i.value;return o.callback=function(){rl||(rl=!0,Tu=c),uu(n,i)},o}function xp(n,i,o){o=Vi(-1,o),o.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var f=i.value;o.payload=function(){return c(f)},o.callback=function(){uu(n,i)}}var g=n.stateNode;return g!==null&&typeof g.componentDidCatch=="function"&&(o.callback=function(){uu(n,i),typeof c!="function"&&(xr===null?xr=new Set([this]):xr.add(this));var T=i.stack;this.componentDidCatch(i.value,{componentStack:T!==null?T:""})}),o}function yp(n,i,o){var c=n.pingCache;if(c===null){c=n.pingCache=new yv;var f=new Set;c.set(i,f)}else f=c.get(i),f===void 0&&(f=new Set,c.set(i,f));f.has(o)||(f.add(o),n=Iv.bind(null,n,i,o),i.then(n,n))}function Sp(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function Mp(n,i,o,c,f){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(i=Vi(-1,1),i.tag=2,vr(o,i,1))),o.lanes|=1),n):(n.flags|=65536,n.lanes=f,n)}var Sv=A.ReactCurrentOwner,zn=!1;function Rn(n,i,o,c){i.child=n===null?Vh(i,null,o,c):Rs(i,n.child,o,c)}function Ep(n,i,o,c,f){o=o.render;var g=i.ref;return bs(i,f),c=tu(n,i,o,c,g,f),o=nu(),n!==null&&!zn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~f,Gi(n,i,f)):(Vt&&o&&zc(i),i.flags|=1,Rn(n,i,c,f),i.child)}function wp(n,i,o,c,f){if(n===null){var g=o.type;return typeof g=="function"&&!Du(g)&&g.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(i.tag=15,i.type=g,Tp(n,i,g,c,f)):(n=ul(o.type,null,c,i,i.mode,f),n.ref=i.ref,n.return=i,i.child=n)}if(g=n.child,(n.lanes&f)===0){var T=g.memoizedProps;if(o=o.compare,o=o!==null?o:Co,o(T,c)&&n.ref===i.ref)return Gi(n,i,f)}return i.flags|=1,n=Er(g,c),n.ref=i.ref,n.return=i,i.child=n}function Tp(n,i,o,c,f){if(n!==null){var g=n.memoizedProps;if(Co(g,c)&&n.ref===i.ref)if(zn=!1,i.pendingProps=c=g,(n.lanes&f)!==0)(n.flags&131072)!==0&&(zn=!0);else return i.lanes=n.lanes,Gi(n,i,f)}return du(n,i,o,c,f)}function Ap(n,i,o){var c=i.pendingProps,f=c.children,g=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ft(Ns,qn),qn|=o;else{if((o&1073741824)===0)return n=g!==null?g.baseLanes|o:o,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,Ft(Ns,qn),qn|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=g!==null?g.baseLanes:o,Ft(Ns,qn),qn|=c}else g!==null?(c=g.baseLanes|o,i.memoizedState=null):c=o,Ft(Ns,qn),qn|=c;return Rn(n,i,f,o),i.child}function Rp(n,i){var o=i.ref;(n===null&&o!==null||n!==null&&n.ref!==o)&&(i.flags|=512,i.flags|=2097152)}function du(n,i,o,c,f){var g=On(o)?Br:vn.current;return g=Es(i,g),bs(i,f),o=tu(n,i,o,c,g,f),c=nu(),n!==null&&!zn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~f,Gi(n,i,f)):(Vt&&c&&zc(i),i.flags|=1,Rn(n,i,o,f),i.child)}function Cp(n,i,o,c,f){if(On(o)){var g=!0;Ua(i)}else g=!1;if(bs(i,f),i.stateNode===null)Ja(n,i),gp(i,o,c),lu(i,o,c,f),c=!0;else if(n===null){var T=i.stateNode,F=i.memoizedProps;T.props=F;var H=T.context,te=o.contextType;typeof te=="object"&&te!==null?te=ti(te):(te=On(o)?Br:vn.current,te=Es(i,te));var _e=o.getDerivedStateFromProps,ye=typeof _e=="function"||typeof T.getSnapshotBeforeUpdate=="function";ye||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(F!==c||H!==te)&&vp(i,T,c,te),gr=!1;var ge=i.memoizedState;T.state=ge,Wa(i,c,T,f),H=i.memoizedState,F!==c||ge!==H||Fn.current||gr?(typeof _e=="function"&&(au(i,o,_e,c),H=i.memoizedState),(F=gr||mp(i,o,F,c,ge,H,te))?(ye||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(i.flags|=4194308)):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=H),T.props=c,T.state=H,T.context=te,c=F):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{T=i.stateNode,Wh(n,i),F=i.memoizedProps,te=i.type===i.elementType?F:ui(i.type,F),T.props=te,ye=i.pendingProps,ge=T.context,H=o.contextType,typeof H=="object"&&H!==null?H=ti(H):(H=On(o)?Br:vn.current,H=Es(i,H));var De=o.getDerivedStateFromProps;(_e=typeof De=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(F!==ye||ge!==H)&&vp(i,T,c,H),gr=!1,ge=i.memoizedState,T.state=ge,Wa(i,c,T,f);var ke=i.memoizedState;F!==ye||ge!==ke||Fn.current||gr?(typeof De=="function"&&(au(i,o,De,c),ke=i.memoizedState),(te=gr||mp(i,o,te,c,ge,ke,H)||!1)?(_e||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(c,ke,H),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(c,ke,H)),typeof T.componentDidUpdate=="function"&&(i.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof T.componentDidUpdate!="function"||F===n.memoizedProps&&ge===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||F===n.memoizedProps&&ge===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=ke),T.props=c,T.state=ke,T.context=H,c=te):(typeof T.componentDidUpdate!="function"||F===n.memoizedProps&&ge===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||F===n.memoizedProps&&ge===n.memoizedState||(i.flags|=1024),c=!1)}return fu(n,i,o,c,g,f)}function fu(n,i,o,c,f,g){Rp(n,i);var T=(i.flags&128)!==0;if(!c&&!T)return f&&Nh(i,o,!1),Gi(n,i,g);c=i.stateNode,Sv.current=i;var F=T&&typeof o.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&T?(i.child=Rs(i,n.child,null,g),i.child=Rs(i,null,F,g)):Rn(n,i,F,g),i.memoizedState=c.state,f&&Nh(i,o,!0),i.child}function bp(n){var i=n.stateNode;i.pendingContext?Lh(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Lh(n,i.context,!1),$c(n,i.containerInfo)}function Pp(n,i,o,c,f){return As(),Vc(f),i.flags|=256,Rn(n,i,o,c),i.child}var hu={dehydrated:null,treeContext:null,retryLane:0};function pu(n){return{baseLanes:n,cachePool:null,transitions:null}}function Lp(n,i,o){var c=i.pendingProps,f=Wt.current,g=!1,T=(i.flags&128)!==0,F;if((F=T)||(F=n!==null&&n.memoizedState===null?!1:(f&2)!==0),F?(g=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(f|=1),Ft(Wt,f&1),n===null)return Hc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(T=c.children,n=c.fallback,g?(c=i.mode,g=i.child,T={mode:"hidden",children:T},(c&1)===0&&g!==null?(g.childLanes=0,g.pendingProps=T):g=dl(T,c,0,null),n=Kr(n,c,o,null),g.return=i,n.return=i,g.sibling=n,i.child=g,i.child.memoizedState=pu(o),i.memoizedState=hu,n):mu(i,T));if(f=n.memoizedState,f!==null&&(F=f.dehydrated,F!==null))return Mv(n,i,T,c,F,f,o);if(g){g=c.fallback,T=i.mode,f=n.child,F=f.sibling;var H={mode:"hidden",children:c.children};return(T&1)===0&&i.child!==f?(c=i.child,c.childLanes=0,c.pendingProps=H,i.deletions=null):(c=Er(f,H),c.subtreeFlags=f.subtreeFlags&14680064),F!==null?g=Er(F,g):(g=Kr(g,T,o,null),g.flags|=2),g.return=i,c.return=i,c.sibling=g,i.child=c,c=g,g=i.child,T=n.child.memoizedState,T=T===null?pu(o):{baseLanes:T.baseLanes|o,cachePool:null,transitions:T.transitions},g.memoizedState=T,g.childLanes=n.childLanes&~o,i.memoizedState=hu,c}return g=n.child,n=g.sibling,c=Er(g,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=o),c.return=i,c.sibling=null,n!==null&&(o=i.deletions,o===null?(i.deletions=[n],i.flags|=16):o.push(n)),i.child=c,i.memoizedState=null,c}function mu(n,i){return i=dl({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Qa(n,i,o,c){return c!==null&&Vc(c),Rs(i,n.child,null,o),n=mu(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function Mv(n,i,o,c,f,g,T){if(o)return i.flags&256?(i.flags&=-257,c=cu(Error(t(422))),Qa(n,i,T,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(g=c.fallback,f=i.mode,c=dl({mode:"visible",children:c.children},f,0,null),g=Kr(g,f,T,null),g.flags|=2,c.return=i,g.return=i,c.sibling=g,i.child=c,(i.mode&1)!==0&&Rs(i,n.child,null,T),i.child.memoizedState=pu(T),i.memoizedState=hu,g);if((i.mode&1)===0)return Qa(n,i,T,null);if(f.data==="$!"){if(c=f.nextSibling&&f.nextSibling.dataset,c)var F=c.dgst;return c=F,g=Error(t(419)),c=cu(g,c,void 0),Qa(n,i,T,c)}if(F=(T&n.childLanes)!==0,zn||F){if(c=an,c!==null){switch(T&-T){case 4:f=2;break;case 16:f=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:f=32;break;case 536870912:f=268435456;break;default:f=0}f=(f&(c.suspendedLanes|T))!==0?0:f,f!==0&&f!==g.retryLane&&(g.retryLane=f,Hi(n,f),hi(c,n,f,-1))}return Lu(),c=cu(Error(t(421))),Qa(n,i,T,c)}return f.data==="$?"?(i.flags|=128,i.child=n.child,i=Uv.bind(null,n),f._reactRetry=i,null):(n=g.treeContext,Yn=fr(f.nextSibling),Xn=i,Vt=!0,ci=null,n!==null&&(Jn[ei++]=ki,Jn[ei++]=Bi,Jn[ei++]=Hr,ki=n.id,Bi=n.overflow,Hr=i),i=mu(i,c.children),i.flags|=4096,i)}function Dp(n,i,o){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),Xc(n.return,i,o)}function gu(n,i,o,c,f){var g=n.memoizedState;g===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:o,tailMode:f}:(g.isBackwards=i,g.rendering=null,g.renderingStartTime=0,g.last=c,g.tail=o,g.tailMode=f)}function Np(n,i,o){var c=i.pendingProps,f=c.revealOrder,g=c.tail;if(Rn(n,i,c.children,o),c=Wt.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Dp(n,o,i);else if(n.tag===19)Dp(n,o,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Ft(Wt,c),(i.mode&1)===0)i.memoizedState=null;else switch(f){case"forwards":for(o=i.child,f=null;o!==null;)n=o.alternate,n!==null&&ja(n)===null&&(f=o),o=o.sibling;o=f,o===null?(f=i.child,i.child=null):(f=o.sibling,o.sibling=null),gu(i,!1,f,o,g);break;case"backwards":for(o=null,f=i.child,i.child=null;f!==null;){if(n=f.alternate,n!==null&&ja(n)===null){i.child=f;break}n=f.sibling,f.sibling=o,o=f,f=n}gu(i,!0,o,null,g);break;case"together":gu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Ja(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Gi(n,i,o){if(n!==null&&(i.dependencies=n.dependencies),Xr|=i.lanes,(o&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,o=Er(n,n.pendingProps),i.child=o,o.return=i;n.sibling!==null;)n=n.sibling,o=o.sibling=Er(n,n.pendingProps),o.return=i;o.sibling=null}return i.child}function Ev(n,i,o){switch(i.tag){case 3:bp(i),As();break;case 5:Yh(i);break;case 1:On(i.type)&&Ua(i);break;case 4:$c(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,f=i.memoizedProps.value;Ft(Ha,c._currentValue),c._currentValue=f;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(Ft(Wt,Wt.current&1),i.flags|=128,null):(o&i.child.childLanes)!==0?Lp(n,i,o):(Ft(Wt,Wt.current&1),n=Gi(n,i,o),n!==null?n.sibling:null);Ft(Wt,Wt.current&1);break;case 19:if(c=(o&i.childLanes)!==0,(n.flags&128)!==0){if(c)return Np(n,i,o);i.flags|=128}if(f=i.memoizedState,f!==null&&(f.rendering=null,f.tail=null,f.lastEffect=null),Ft(Wt,Wt.current),c)break;return null;case 22:case 23:return i.lanes=0,Ap(n,i,o)}return Gi(n,i,o)}var Ip,vu,Up,Fp;Ip=function(n,i){for(var o=i.child;o!==null;){if(o.tag===5||o.tag===6)n.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===i)break;for(;o.sibling===null;){if(o.return===null||o.return===i)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},vu=function(){},Up=function(n,i,o,c){var f=n.memoizedProps;if(f!==c){n=i.stateNode,Wr(Ai.current);var g=null;switch(o){case"input":f=q(n,f),c=q(n,c),g=[];break;case"select":f=oe({},f,{value:void 0}),c=oe({},c,{value:void 0}),g=[];break;case"textarea":f=R(n,f),c=R(n,c),g=[];break;default:typeof f.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Da)}ft(o,c);var T;o=null;for(te in f)if(!c.hasOwnProperty(te)&&f.hasOwnProperty(te)&&f[te]!=null)if(te==="style"){var F=f[te];for(T in F)F.hasOwnProperty(T)&&(o||(o={}),o[T]="")}else te!=="dangerouslySetInnerHTML"&&te!=="children"&&te!=="suppressContentEditableWarning"&&te!=="suppressHydrationWarning"&&te!=="autoFocus"&&(a.hasOwnProperty(te)?g||(g=[]):(g=g||[]).push(te,null));for(te in c){var H=c[te];if(F=f!=null?f[te]:void 0,c.hasOwnProperty(te)&&H!==F&&(H!=null||F!=null))if(te==="style")if(F){for(T in F)!F.hasOwnProperty(T)||H&&H.hasOwnProperty(T)||(o||(o={}),o[T]="");for(T in H)H.hasOwnProperty(T)&&F[T]!==H[T]&&(o||(o={}),o[T]=H[T])}else o||(g||(g=[]),g.push(te,o)),o=H;else te==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,F=F?F.__html:void 0,H!=null&&F!==H&&(g=g||[]).push(te,H)):te==="children"?typeof H!="string"&&typeof H!="number"||(g=g||[]).push(te,""+H):te!=="suppressContentEditableWarning"&&te!=="suppressHydrationWarning"&&(a.hasOwnProperty(te)?(H!=null&&te==="onScroll"&&Bt("scroll",n),g||F===H||(g=[])):(g=g||[]).push(te,H))}o&&(g=g||[]).push("style",o);var te=g;(i.updateQueue=te)&&(i.flags|=4)}},Fp=function(n,i,o,c){o!==c&&(i.flags|=4)};function Go(n,i){if(!Vt)switch(n.tailMode){case"hidden":i=n.tail;for(var o=null;i!==null;)i.alternate!==null&&(o=i),i=i.sibling;o===null?n.tail=null:o.sibling=null;break;case"collapsed":o=n.tail;for(var c=null;o!==null;)o.alternate!==null&&(c=o),o=o.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function xn(n){var i=n.alternate!==null&&n.alternate.child===n.child,o=0,c=0;if(i)for(var f=n.child;f!==null;)o|=f.lanes|f.childLanes,c|=f.subtreeFlags&14680064,c|=f.flags&14680064,f.return=n,f=f.sibling;else for(f=n.child;f!==null;)o|=f.lanes|f.childLanes,c|=f.subtreeFlags,c|=f.flags,f.return=n,f=f.sibling;return n.subtreeFlags|=c,n.childLanes=o,i}function wv(n,i,o){var c=i.pendingProps;switch(kc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return xn(i),null;case 1:return On(i.type)&&Ia(),xn(i),null;case 3:return c=i.stateNode,Ps(),Ht(Fn),Ht(vn),Qc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(ka(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,ci!==null&&(Cu(ci),ci=null))),vu(n,i),xn(i),null;case 5:Kc(i);var f=Wr(zo.current);if(o=i.type,n!==null&&i.stateNode!=null)Up(n,i,o,c,f),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return xn(i),null}if(n=Wr(Ai.current),ka(i)){c=i.stateNode,o=i.type;var g=i.memoizedProps;switch(c[Ti]=i,c[No]=g,n=(i.mode&1)!==0,o){case"dialog":Bt("cancel",c),Bt("close",c);break;case"iframe":case"object":case"embed":Bt("load",c);break;case"video":case"audio":for(f=0;f<Po.length;f++)Bt(Po[f],c);break;case"source":Bt("error",c);break;case"img":case"image":case"link":Bt("error",c),Bt("load",c);break;case"details":Bt("toggle",c);break;case"input":wn(c,g),Bt("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!g.multiple},Bt("invalid",c);break;case"textarea":Q(c,g),Bt("invalid",c)}ft(o,g),f=null;for(var T in g)if(g.hasOwnProperty(T)){var F=g[T];T==="children"?typeof F=="string"?c.textContent!==F&&(g.suppressHydrationWarning!==!0&&La(c.textContent,F,n),f=["children",F]):typeof F=="number"&&c.textContent!==""+F&&(g.suppressHydrationWarning!==!0&&La(c.textContent,F,n),f=["children",""+F]):a.hasOwnProperty(T)&&F!=null&&T==="onScroll"&&Bt("scroll",c)}switch(o){case"input":bt(c),Ke(c,g,!0);break;case"textarea":bt(c),ve(c);break;case"select":case"option":break;default:typeof g.onClick=="function"&&(c.onclick=Da)}c=f,i.updateQueue=c,c!==null&&(i.flags|=4)}else{T=f.nodeType===9?f:f.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=he(o)),n==="http://www.w3.org/1999/xhtml"?o==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=T.createElement(o,{is:c.is}):(n=T.createElement(o),o==="select"&&(T=n,c.multiple?T.multiple=!0:c.size&&(T.size=c.size))):n=T.createElementNS(n,o),n[Ti]=i,n[No]=c,Ip(n,i,!1,!1),i.stateNode=n;e:{switch(T=st(o,c),o){case"dialog":Bt("cancel",n),Bt("close",n),f=c;break;case"iframe":case"object":case"embed":Bt("load",n),f=c;break;case"video":case"audio":for(f=0;f<Po.length;f++)Bt(Po[f],n);f=c;break;case"source":Bt("error",n),f=c;break;case"img":case"image":case"link":Bt("error",n),Bt("load",n),f=c;break;case"details":Bt("toggle",n),f=c;break;case"input":wn(n,c),f=q(n,c),Bt("invalid",n);break;case"option":f=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},f=oe({},c,{value:void 0}),Bt("invalid",n);break;case"textarea":Q(n,c),f=R(n,c),Bt("invalid",n);break;default:f=c}ft(o,f),F=f;for(g in F)if(F.hasOwnProperty(g)){var H=F[g];g==="style"?tt(n,H):g==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,H!=null&&Ue(n,H)):g==="children"?typeof H=="string"?(o!=="textarea"||H!=="")&&ut(n,H):typeof H=="number"&&ut(n,""+H):g!=="suppressContentEditableWarning"&&g!=="suppressHydrationWarning"&&g!=="autoFocus"&&(a.hasOwnProperty(g)?H!=null&&g==="onScroll"&&Bt("scroll",n):H!=null&&L(n,g,H,T))}switch(o){case"input":bt(n),Ke(n,c,!1);break;case"textarea":bt(n),ve(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Ae(c.value));break;case"select":n.multiple=!!c.multiple,g=c.value,g!=null?I(n,!!c.multiple,g,!1):c.defaultValue!=null&&I(n,!!c.multiple,c.defaultValue,!0);break;default:typeof f.onClick=="function"&&(n.onclick=Da)}switch(o){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return xn(i),null;case 6:if(n&&i.stateNode!=null)Fp(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(o=Wr(zo.current),Wr(Ai.current),ka(i)){if(c=i.stateNode,o=i.memoizedProps,c[Ti]=i,(g=c.nodeValue!==o)&&(n=Xn,n!==null))switch(n.tag){case 3:La(c.nodeValue,o,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&La(c.nodeValue,o,(n.mode&1)!==0)}g&&(i.flags|=4)}else c=(o.nodeType===9?o:o.ownerDocument).createTextNode(c),c[Ti]=i,i.stateNode=c}return xn(i),null;case 13:if(Ht(Wt),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Vt&&Yn!==null&&(i.mode&1)!==0&&(i.flags&128)===0)kh(),As(),i.flags|=98560,g=!1;else if(g=ka(i),c!==null&&c.dehydrated!==null){if(n===null){if(!g)throw Error(t(318));if(g=i.memoizedState,g=g!==null?g.dehydrated:null,!g)throw Error(t(317));g[Ti]=i}else As(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;xn(i),g=!1}else ci!==null&&(Cu(ci),ci=null),g=!0;if(!g)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=o,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(Wt.current&1)!==0?nn===0&&(nn=3):Lu())),i.updateQueue!==null&&(i.flags|=4),xn(i),null);case 4:return Ps(),vu(n,i),n===null&&Lo(i.stateNode.containerInfo),xn(i),null;case 10:return jc(i.type._context),xn(i),null;case 17:return On(i.type)&&Ia(),xn(i),null;case 19:if(Ht(Wt),g=i.memoizedState,g===null)return xn(i),null;if(c=(i.flags&128)!==0,T=g.rendering,T===null)if(c)Go(g,!1);else{if(nn!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(T=ja(n),T!==null){for(i.flags|=128,Go(g,!1),c=T.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=o,o=i.child;o!==null;)g=o,n=c,g.flags&=14680066,T=g.alternate,T===null?(g.childLanes=0,g.lanes=n,g.child=null,g.subtreeFlags=0,g.memoizedProps=null,g.memoizedState=null,g.updateQueue=null,g.dependencies=null,g.stateNode=null):(g.childLanes=T.childLanes,g.lanes=T.lanes,g.child=T.child,g.subtreeFlags=0,g.deletions=null,g.memoizedProps=T.memoizedProps,g.memoizedState=T.memoizedState,g.updateQueue=T.updateQueue,g.type=T.type,n=T.dependencies,g.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),o=o.sibling;return Ft(Wt,Wt.current&1|2),i.child}n=n.sibling}g.tail!==null&&Me()>Is&&(i.flags|=128,c=!0,Go(g,!1),i.lanes=4194304)}else{if(!c)if(n=ja(T),n!==null){if(i.flags|=128,c=!0,o=n.updateQueue,o!==null&&(i.updateQueue=o,i.flags|=4),Go(g,!0),g.tail===null&&g.tailMode==="hidden"&&!T.alternate&&!Vt)return xn(i),null}else 2*Me()-g.renderingStartTime>Is&&o!==1073741824&&(i.flags|=128,c=!0,Go(g,!1),i.lanes=4194304);g.isBackwards?(T.sibling=i.child,i.child=T):(o=g.last,o!==null?o.sibling=T:i.child=T,g.last=T)}return g.tail!==null?(i=g.tail,g.rendering=i,g.tail=i.sibling,g.renderingStartTime=Me(),i.sibling=null,o=Wt.current,Ft(Wt,c?o&1|2:o&1),i):(xn(i),null);case 22:case 23:return Pu(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(qn&1073741824)!==0&&(xn(i),i.subtreeFlags&6&&(i.flags|=8192)):xn(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function Tv(n,i){switch(kc(i),i.tag){case 1:return On(i.type)&&Ia(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return Ps(),Ht(Fn),Ht(vn),Qc(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Kc(i),null;case 13:if(Ht(Wt),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));As()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Ht(Wt),null;case 4:return Ps(),null;case 10:return jc(i.type._context),null;case 22:case 23:return Pu(),null;case 24:return null;default:return null}}var el=!1,yn=!1,Av=typeof WeakSet=="function"?WeakSet:Set,Fe=null;function Ds(n,i){var o=n.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(c){Xt(n,i,c)}else o.current=null}function _u(n,i,o){try{o()}catch(c){Xt(n,i,c)}}var Op=!1;function Rv(n,i){if(Pc=ya,n=mh(),Mc(n)){if("selectionStart"in n)var o={start:n.selectionStart,end:n.selectionEnd};else e:{o=(o=n.ownerDocument)&&o.defaultView||window;var c=o.getSelection&&o.getSelection();if(c&&c.rangeCount!==0){o=c.anchorNode;var f=c.anchorOffset,g=c.focusNode;c=c.focusOffset;try{o.nodeType,g.nodeType}catch{o=null;break e}var T=0,F=-1,H=-1,te=0,_e=0,ye=n,ge=null;t:for(;;){for(var De;ye!==o||f!==0&&ye.nodeType!==3||(F=T+f),ye!==g||c!==0&&ye.nodeType!==3||(H=T+c),ye.nodeType===3&&(T+=ye.nodeValue.length),(De=ye.firstChild)!==null;)ge=ye,ye=De;for(;;){if(ye===n)break t;if(ge===o&&++te===f&&(F=T),ge===g&&++_e===c&&(H=T),(De=ye.nextSibling)!==null)break;ye=ge,ge=ye.parentNode}ye=De}o=F===-1||H===-1?null:{start:F,end:H}}else o=null}o=o||{start:0,end:0}}else o=null;for(Lc={focusedElem:n,selectionRange:o},ya=!1,Fe=i;Fe!==null;)if(i=Fe,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,Fe=n;else for(;Fe!==null;){i=Fe;try{var ke=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(ke!==null){var He=ke.memoizedProps,Yt=ke.memoizedState,$=i.stateNode,W=$.getSnapshotBeforeUpdate(i.elementType===i.type?He:ui(i.type,He),Yt);$.__reactInternalSnapshotBeforeUpdate=W}break;case 3:var K=i.stateNode.containerInfo;K.nodeType===1?K.textContent="":K.nodeType===9&&K.documentElement&&K.removeChild(K.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(we){Xt(i,i.return,we)}if(n=i.sibling,n!==null){n.return=i.return,Fe=n;break}Fe=i.return}return ke=Op,Op=!1,ke}function Wo(n,i,o){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var f=c=c.next;do{if((f.tag&n)===n){var g=f.destroy;f.destroy=void 0,g!==void 0&&_u(i,o,g)}f=f.next}while(f!==c)}}function tl(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var o=i=i.next;do{if((o.tag&n)===n){var c=o.create;o.destroy=c()}o=o.next}while(o!==i)}}function xu(n){var i=n.ref;if(i!==null){var o=n.stateNode;switch(n.tag){case 5:n=o;break;default:n=o}typeof i=="function"?i(n):i.current=n}}function zp(n){var i=n.alternate;i!==null&&(n.alternate=null,zp(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[Ti],delete i[No],delete i[Uc],delete i[cv],delete i[uv])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function kp(n){return n.tag===5||n.tag===3||n.tag===4}function Bp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||kp(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function yu(n,i,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?o.nodeType===8?o.parentNode.insertBefore(n,i):o.insertBefore(n,i):(o.nodeType===8?(i=o.parentNode,i.insertBefore(n,o)):(i=o,i.appendChild(n)),o=o._reactRootContainer,o!=null||i.onclick!==null||(i.onclick=Da));else if(c!==4&&(n=n.child,n!==null))for(yu(n,i,o),n=n.sibling;n!==null;)yu(n,i,o),n=n.sibling}function Su(n,i,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?o.insertBefore(n,i):o.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Su(n,i,o),n=n.sibling;n!==null;)Su(n,i,o),n=n.sibling}var dn=null,di=!1;function _r(n,i,o){for(o=o.child;o!==null;)Hp(n,i,o),o=o.sibling}function Hp(n,i,o){if(vt&&typeof vt.onCommitFiberUnmount=="function")try{vt.onCommitFiberUnmount(Tt,o)}catch{}switch(o.tag){case 5:yn||Ds(o,i);case 6:var c=dn,f=di;dn=null,_r(n,i,o),dn=c,di=f,dn!==null&&(di?(n=dn,o=o.stateNode,n.nodeType===8?n.parentNode.removeChild(o):n.removeChild(o)):dn.removeChild(o.stateNode));break;case 18:dn!==null&&(di?(n=dn,o=o.stateNode,n.nodeType===8?Ic(n.parentNode,o):n.nodeType===1&&Ic(n,o),Mo(n)):Ic(dn,o.stateNode));break;case 4:c=dn,f=di,dn=o.stateNode.containerInfo,di=!0,_r(n,i,o),dn=c,di=f;break;case 0:case 11:case 14:case 15:if(!yn&&(c=o.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){f=c=c.next;do{var g=f,T=g.destroy;g=g.tag,T!==void 0&&((g&2)!==0||(g&4)!==0)&&_u(o,i,T),f=f.next}while(f!==c)}_r(n,i,o);break;case 1:if(!yn&&(Ds(o,i),c=o.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=o.memoizedProps,c.state=o.memoizedState,c.componentWillUnmount()}catch(F){Xt(o,i,F)}_r(n,i,o);break;case 21:_r(n,i,o);break;case 22:o.mode&1?(yn=(c=yn)||o.memoizedState!==null,_r(n,i,o),yn=c):_r(n,i,o);break;default:_r(n,i,o)}}function Vp(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var o=n.stateNode;o===null&&(o=n.stateNode=new Av),i.forEach(function(c){var f=Fv.bind(null,n,c);o.has(c)||(o.add(c),c.then(f,f))})}}function fi(n,i){var o=i.deletions;if(o!==null)for(var c=0;c<o.length;c++){var f=o[c];try{var g=n,T=i,F=T;e:for(;F!==null;){switch(F.tag){case 5:dn=F.stateNode,di=!1;break e;case 3:dn=F.stateNode.containerInfo,di=!0;break e;case 4:dn=F.stateNode.containerInfo,di=!0;break e}F=F.return}if(dn===null)throw Error(t(160));Hp(g,T,f),dn=null,di=!1;var H=f.alternate;H!==null&&(H.return=null),f.return=null}catch(te){Xt(f,i,te)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)Gp(i,n),i=i.sibling}function Gp(n,i){var o=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(fi(i,n),Ci(n),c&4){try{Wo(3,n,n.return),tl(3,n)}catch(He){Xt(n,n.return,He)}try{Wo(5,n,n.return)}catch(He){Xt(n,n.return,He)}}break;case 1:fi(i,n),Ci(n),c&512&&o!==null&&Ds(o,o.return);break;case 5:if(fi(i,n),Ci(n),c&512&&o!==null&&Ds(o,o.return),n.flags&32){var f=n.stateNode;try{ut(f,"")}catch(He){Xt(n,n.return,He)}}if(c&4&&(f=n.stateNode,f!=null)){var g=n.memoizedProps,T=o!==null?o.memoizedProps:g,F=n.type,H=n.updateQueue;if(n.updateQueue=null,H!==null)try{F==="input"&&g.type==="radio"&&g.name!=null&&pt(f,g),st(F,T);var te=st(F,g);for(T=0;T<H.length;T+=2){var _e=H[T],ye=H[T+1];_e==="style"?tt(f,ye):_e==="dangerouslySetInnerHTML"?Ue(f,ye):_e==="children"?ut(f,ye):L(f,_e,ye,te)}switch(F){case"input":dt(f,g);break;case"textarea":me(f,g);break;case"select":var ge=f._wrapperState.wasMultiple;f._wrapperState.wasMultiple=!!g.multiple;var De=g.value;De!=null?I(f,!!g.multiple,De,!1):ge!==!!g.multiple&&(g.defaultValue!=null?I(f,!!g.multiple,g.defaultValue,!0):I(f,!!g.multiple,g.multiple?[]:"",!1))}f[No]=g}catch(He){Xt(n,n.return,He)}}break;case 6:if(fi(i,n),Ci(n),c&4){if(n.stateNode===null)throw Error(t(162));f=n.stateNode,g=n.memoizedProps;try{f.nodeValue=g}catch(He){Xt(n,n.return,He)}}break;case 3:if(fi(i,n),Ci(n),c&4&&o!==null&&o.memoizedState.isDehydrated)try{Mo(i.containerInfo)}catch(He){Xt(n,n.return,He)}break;case 4:fi(i,n),Ci(n);break;case 13:fi(i,n),Ci(n),f=n.child,f.flags&8192&&(g=f.memoizedState!==null,f.stateNode.isHidden=g,!g||f.alternate!==null&&f.alternate.memoizedState!==null||(wu=Me())),c&4&&Vp(n);break;case 22:if(_e=o!==null&&o.memoizedState!==null,n.mode&1?(yn=(te=yn)||_e,fi(i,n),yn=te):fi(i,n),Ci(n),c&8192){if(te=n.memoizedState!==null,(n.stateNode.isHidden=te)&&!_e&&(n.mode&1)!==0)for(Fe=n,_e=n.child;_e!==null;){for(ye=Fe=_e;Fe!==null;){switch(ge=Fe,De=ge.child,ge.tag){case 0:case 11:case 14:case 15:Wo(4,ge,ge.return);break;case 1:Ds(ge,ge.return);var ke=ge.stateNode;if(typeof ke.componentWillUnmount=="function"){c=ge,o=ge.return;try{i=c,ke.props=i.memoizedProps,ke.state=i.memoizedState,ke.componentWillUnmount()}catch(He){Xt(c,o,He)}}break;case 5:Ds(ge,ge.return);break;case 22:if(ge.memoizedState!==null){Xp(ye);continue}}De!==null?(De.return=ge,Fe=De):Xp(ye)}_e=_e.sibling}e:for(_e=null,ye=n;;){if(ye.tag===5){if(_e===null){_e=ye;try{f=ye.stateNode,te?(g=f.style,typeof g.setProperty=="function"?g.setProperty("display","none","important"):g.display="none"):(F=ye.stateNode,H=ye.memoizedProps.style,T=H!=null&&H.hasOwnProperty("display")?H.display:null,F.style.display=et("display",T))}catch(He){Xt(n,n.return,He)}}}else if(ye.tag===6){if(_e===null)try{ye.stateNode.nodeValue=te?"":ye.memoizedProps}catch(He){Xt(n,n.return,He)}}else if((ye.tag!==22&&ye.tag!==23||ye.memoizedState===null||ye===n)&&ye.child!==null){ye.child.return=ye,ye=ye.child;continue}if(ye===n)break e;for(;ye.sibling===null;){if(ye.return===null||ye.return===n)break e;_e===ye&&(_e=null),ye=ye.return}_e===ye&&(_e=null),ye.sibling.return=ye.return,ye=ye.sibling}}break;case 19:fi(i,n),Ci(n),c&4&&Vp(n);break;case 21:break;default:fi(i,n),Ci(n)}}function Ci(n){var i=n.flags;if(i&2){try{e:{for(var o=n.return;o!==null;){if(kp(o)){var c=o;break e}o=o.return}throw Error(t(160))}switch(c.tag){case 5:var f=c.stateNode;c.flags&32&&(ut(f,""),c.flags&=-33);var g=Bp(n);Su(n,g,f);break;case 3:case 4:var T=c.stateNode.containerInfo,F=Bp(n);yu(n,F,T);break;default:throw Error(t(161))}}catch(H){Xt(n,n.return,H)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function Cv(n,i,o){Fe=n,Wp(n)}function Wp(n,i,o){for(var c=(n.mode&1)!==0;Fe!==null;){var f=Fe,g=f.child;if(f.tag===22&&c){var T=f.memoizedState!==null||el;if(!T){var F=f.alternate,H=F!==null&&F.memoizedState!==null||yn;F=el;var te=yn;if(el=T,(yn=H)&&!te)for(Fe=f;Fe!==null;)T=Fe,H=T.child,T.tag===22&&T.memoizedState!==null?Yp(f):H!==null?(H.return=T,Fe=H):Yp(f);for(;g!==null;)Fe=g,Wp(g),g=g.sibling;Fe=f,el=F,yn=te}jp(n)}else(f.subtreeFlags&8772)!==0&&g!==null?(g.return=f,Fe=g):jp(n)}}function jp(n){for(;Fe!==null;){var i=Fe;if((i.flags&8772)!==0){var o=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:yn||tl(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!yn)if(o===null)c.componentDidMount();else{var f=i.elementType===i.type?o.memoizedProps:ui(i.type,o.memoizedProps);c.componentDidUpdate(f,o.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var g=i.updateQueue;g!==null&&Xh(i,g,c);break;case 3:var T=i.updateQueue;if(T!==null){if(o=null,i.child!==null)switch(i.child.tag){case 5:o=i.child.stateNode;break;case 1:o=i.child.stateNode}Xh(i,T,o)}break;case 5:var F=i.stateNode;if(o===null&&i.flags&4){o=F;var H=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":H.autoFocus&&o.focus();break;case"img":H.src&&(o.src=H.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var te=i.alternate;if(te!==null){var _e=te.memoizedState;if(_e!==null){var ye=_e.dehydrated;ye!==null&&Mo(ye)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}yn||i.flags&512&&xu(i)}catch(ge){Xt(i,i.return,ge)}}if(i===n){Fe=null;break}if(o=i.sibling,o!==null){o.return=i.return,Fe=o;break}Fe=i.return}}function Xp(n){for(;Fe!==null;){var i=Fe;if(i===n){Fe=null;break}var o=i.sibling;if(o!==null){o.return=i.return,Fe=o;break}Fe=i.return}}function Yp(n){for(;Fe!==null;){var i=Fe;try{switch(i.tag){case 0:case 11:case 15:var o=i.return;try{tl(4,i)}catch(H){Xt(i,o,H)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var f=i.return;try{c.componentDidMount()}catch(H){Xt(i,f,H)}}var g=i.return;try{xu(i)}catch(H){Xt(i,g,H)}break;case 5:var T=i.return;try{xu(i)}catch(H){Xt(i,T,H)}}}catch(H){Xt(i,i.return,H)}if(i===n){Fe=null;break}var F=i.sibling;if(F!==null){F.return=i.return,Fe=F;break}Fe=i.return}}var bv=Math.ceil,nl=A.ReactCurrentDispatcher,Mu=A.ReactCurrentOwner,ii=A.ReactCurrentBatchConfig,St=0,an=null,$t=null,fn=0,qn=0,Ns=hr(0),nn=0,jo=null,Xr=0,il=0,Eu=0,Xo=null,kn=null,wu=0,Is=1/0,Wi=null,rl=!1,Tu=null,xr=null,sl=!1,yr=null,ol=0,Yo=0,Au=null,al=-1,ll=0;function Cn(){return(St&6)!==0?Me():al!==-1?al:al=Me()}function Sr(n){return(n.mode&1)===0?1:(St&2)!==0&&fn!==0?fn&-fn:fv.transition!==null?(ll===0&&(ll=An()),ll):(n=Ct,n!==0||(n=window.event,n=n===void 0?16:$f(n.type)),n)}function hi(n,i,o,c){if(50<Yo)throw Yo=0,Au=null,Error(t(185));Un(n,o,c),((St&2)===0||n!==an)&&(n===an&&((St&2)===0&&(il|=o),nn===4&&Mr(n,fn)),Bn(n,c),o===1&&St===0&&(i.mode&1)===0&&(Is=Me()+500,Fa&&mr()))}function Bn(n,i){var o=n.callbackNode;Zn(n,i);var c=wi(n,n===an?fn:0);if(c===0)o!==null&&ie(o),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(o!=null&&ie(o),i===1)n.tag===0?dv($p.bind(null,n)):Ih($p.bind(null,n)),av(function(){(St&6)===0&&mr()}),o=null;else{switch(Hf(c)){case 1:o=Be;break;case 4:o=nt;break;case 16:o=rt;break;case 536870912:o=_t;break;default:o=rt}o=im(o,qp.bind(null,n))}n.callbackPriority=i,n.callbackNode=o}}function qp(n,i){if(al=-1,ll=0,(St&6)!==0)throw Error(t(327));var o=n.callbackNode;if(Us()&&n.callbackNode!==o)return null;var c=wi(n,n===an?fn:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=cl(n,c);else{i=c;var f=St;St|=2;var g=Zp();(an!==n||fn!==i)&&(Wi=null,Is=Me()+500,qr(n,i));do try{Dv();break}catch(F){Kp(n,F)}while(!0);Wc(),nl.current=g,St=f,$t!==null?i=0:(an=null,fn=0,i=nn)}if(i!==0){if(i===2&&(f=Fi(n),f!==0&&(c=f,i=Ru(n,f))),i===1)throw o=jo,qr(n,0),Mr(n,c),Bn(n,Me()),o;if(i===6)Mr(n,c);else{if(f=n.current.alternate,(c&30)===0&&!Pv(f)&&(i=cl(n,c),i===2&&(g=Fi(n),g!==0&&(c=g,i=Ru(n,g))),i===1))throw o=jo,qr(n,0),Mr(n,c),Bn(n,Me()),o;switch(n.finishedWork=f,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:$r(n,kn,Wi);break;case 3:if(Mr(n,c),(c&130023424)===c&&(i=wu+500-Me(),10<i)){if(wi(n,0)!==0)break;if(f=n.suspendedLanes,(f&c)!==c){Cn(),n.pingedLanes|=n.suspendedLanes&f;break}n.timeoutHandle=Nc($r.bind(null,n,kn,Wi),i);break}$r(n,kn,Wi);break;case 4:if(Mr(n,c),(c&4194240)===c)break;for(i=n.eventTimes,f=-1;0<c;){var T=31-at(c);g=1<<T,T=i[T],T>f&&(f=T),c&=~g}if(c=f,c=Me()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*bv(c/1960))-c,10<c){n.timeoutHandle=Nc($r.bind(null,n,kn,Wi),c);break}$r(n,kn,Wi);break;case 5:$r(n,kn,Wi);break;default:throw Error(t(329))}}}return Bn(n,Me()),n.callbackNode===o?qp.bind(null,n):null}function Ru(n,i){var o=Xo;return n.current.memoizedState.isDehydrated&&(qr(n,i).flags|=256),n=cl(n,i),n!==2&&(i=kn,kn=o,i!==null&&Cu(i)),n}function Cu(n){kn===null?kn=n:kn.push.apply(kn,n)}function Pv(n){for(var i=n;;){if(i.flags&16384){var o=i.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var c=0;c<o.length;c++){var f=o[c],g=f.getSnapshot;f=f.value;try{if(!li(g(),f))return!1}catch{return!1}}}if(o=i.child,i.subtreeFlags&16384&&o!==null)o.return=i,i=o;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function Mr(n,i){for(i&=~Eu,i&=~il,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var o=31-at(i),c=1<<o;n[o]=-1,i&=~c}}function $p(n){if((St&6)!==0)throw Error(t(327));Us();var i=wi(n,0);if((i&1)===0)return Bn(n,Me()),null;var o=cl(n,i);if(n.tag!==0&&o===2){var c=Fi(n);c!==0&&(i=c,o=Ru(n,c))}if(o===1)throw o=jo,qr(n,0),Mr(n,i),Bn(n,Me()),o;if(o===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,$r(n,kn,Wi),Bn(n,Me()),null}function bu(n,i){var o=St;St|=1;try{return n(i)}finally{St=o,St===0&&(Is=Me()+500,Fa&&mr())}}function Yr(n){yr!==null&&yr.tag===0&&(St&6)===0&&Us();var i=St;St|=1;var o=ii.transition,c=Ct;try{if(ii.transition=null,Ct=1,n)return n()}finally{Ct=c,ii.transition=o,St=i,(St&6)===0&&mr()}}function Pu(){qn=Ns.current,Ht(Ns)}function qr(n,i){n.finishedWork=null,n.finishedLanes=0;var o=n.timeoutHandle;if(o!==-1&&(n.timeoutHandle=-1,ov(o)),$t!==null)for(o=$t.return;o!==null;){var c=o;switch(kc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&Ia();break;case 3:Ps(),Ht(Fn),Ht(vn),Qc();break;case 5:Kc(c);break;case 4:Ps();break;case 13:Ht(Wt);break;case 19:Ht(Wt);break;case 10:jc(c.type._context);break;case 22:case 23:Pu()}o=o.return}if(an=n,$t=n=Er(n.current,null),fn=qn=i,nn=0,jo=null,Eu=il=Xr=0,kn=Xo=null,Gr!==null){for(i=0;i<Gr.length;i++)if(o=Gr[i],c=o.interleaved,c!==null){o.interleaved=null;var f=c.next,g=o.pending;if(g!==null){var T=g.next;g.next=f,c.next=T}o.pending=c}Gr=null}return n}function Kp(n,i){do{var o=$t;try{if(Wc(),Xa.current=Ka,Ya){for(var c=jt.memoizedState;c!==null;){var f=c.queue;f!==null&&(f.pending=null),c=c.next}Ya=!1}if(jr=0,on=tn=jt=null,ko=!1,Bo=0,Mu.current=null,o===null||o.return===null){nn=1,jo=i,$t=null;break}e:{var g=n,T=o.return,F=o,H=i;if(i=fn,F.flags|=32768,H!==null&&typeof H=="object"&&typeof H.then=="function"){var te=H,_e=F,ye=_e.tag;if((_e.mode&1)===0&&(ye===0||ye===11||ye===15)){var ge=_e.alternate;ge?(_e.updateQueue=ge.updateQueue,_e.memoizedState=ge.memoizedState,_e.lanes=ge.lanes):(_e.updateQueue=null,_e.memoizedState=null)}var De=Sp(T);if(De!==null){De.flags&=-257,Mp(De,T,F,g,i),De.mode&1&&yp(g,te,i),i=De,H=te;var ke=i.updateQueue;if(ke===null){var He=new Set;He.add(H),i.updateQueue=He}else ke.add(H);break e}else{if((i&1)===0){yp(g,te,i),Lu();break e}H=Error(t(426))}}else if(Vt&&F.mode&1){var Yt=Sp(T);if(Yt!==null){(Yt.flags&65536)===0&&(Yt.flags|=256),Mp(Yt,T,F,g,i),Vc(Ls(H,F));break e}}g=H=Ls(H,F),nn!==4&&(nn=2),Xo===null?Xo=[g]:Xo.push(g),g=T;do{switch(g.tag){case 3:g.flags|=65536,i&=-i,g.lanes|=i;var $=_p(g,H,i);jh(g,$);break e;case 1:F=H;var W=g.type,K=g.stateNode;if((g.flags&128)===0&&(typeof W.getDerivedStateFromError=="function"||K!==null&&typeof K.componentDidCatch=="function"&&(xr===null||!xr.has(K)))){g.flags|=65536,i&=-i,g.lanes|=i;var we=xp(g,F,i);jh(g,we);break e}}g=g.return}while(g!==null)}Jp(o)}catch(je){i=je,$t===o&&o!==null&&($t=o=o.return);continue}break}while(!0)}function Zp(){var n=nl.current;return nl.current=Ka,n===null?Ka:n}function Lu(){(nn===0||nn===3||nn===2)&&(nn=4),an===null||(Xr&268435455)===0&&(il&268435455)===0||Mr(an,fn)}function cl(n,i){var o=St;St|=2;var c=Zp();(an!==n||fn!==i)&&(Wi=null,qr(n,i));do try{Lv();break}catch(f){Kp(n,f)}while(!0);if(Wc(),St=o,nl.current=c,$t!==null)throw Error(t(261));return an=null,fn=0,nn}function Lv(){for(;$t!==null;)Qp($t)}function Dv(){for(;$t!==null&&!Y();)Qp($t)}function Qp(n){var i=nm(n.alternate,n,qn);n.memoizedProps=n.pendingProps,i===null?Jp(n):$t=i,Mu.current=null}function Jp(n){var i=n;do{var o=i.alternate;if(n=i.return,(i.flags&32768)===0){if(o=wv(o,i,qn),o!==null){$t=o;return}}else{if(o=Tv(o,i),o!==null){o.flags&=32767,$t=o;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{nn=6,$t=null;return}}if(i=i.sibling,i!==null){$t=i;return}$t=i=n}while(i!==null);nn===0&&(nn=5)}function $r(n,i,o){var c=Ct,f=ii.transition;try{ii.transition=null,Ct=1,Nv(n,i,o,c)}finally{ii.transition=f,Ct=c}return null}function Nv(n,i,o,c){do Us();while(yr!==null);if((St&6)!==0)throw Error(t(327));o=n.finishedWork;var f=n.finishedLanes;if(o===null)return null;if(n.finishedWork=null,n.finishedLanes=0,o===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var g=o.lanes|o.childLanes;if(va(n,g),n===an&&($t=an=null,fn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||sl||(sl=!0,im(rt,function(){return Us(),null})),g=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||g){g=ii.transition,ii.transition=null;var T=Ct;Ct=1;var F=St;St|=4,Mu.current=null,Rv(n,o),Gp(o,n),J0(Lc),ya=!!Pc,Lc=Pc=null,n.current=o,Cv(o),Te(),St=F,Ct=T,ii.transition=g}else n.current=o;if(sl&&(sl=!1,yr=n,ol=f),g=n.pendingLanes,g===0&&(xr=null),mn(o.stateNode),Bn(n,Me()),i!==null)for(c=n.onRecoverableError,o=0;o<i.length;o++)f=i[o],c(f.value,{componentStack:f.stack,digest:f.digest});if(rl)throw rl=!1,n=Tu,Tu=null,n;return(ol&1)!==0&&n.tag!==0&&Us(),g=n.pendingLanes,(g&1)!==0?n===Au?Yo++:(Yo=0,Au=n):Yo=0,mr(),null}function Us(){if(yr!==null){var n=Hf(ol),i=ii.transition,o=Ct;try{if(ii.transition=null,Ct=16>n?16:n,yr===null)var c=!1;else{if(n=yr,yr=null,ol=0,(St&6)!==0)throw Error(t(331));var f=St;for(St|=4,Fe=n.current;Fe!==null;){var g=Fe,T=g.child;if((Fe.flags&16)!==0){var F=g.deletions;if(F!==null){for(var H=0;H<F.length;H++){var te=F[H];for(Fe=te;Fe!==null;){var _e=Fe;switch(_e.tag){case 0:case 11:case 15:Wo(8,_e,g)}var ye=_e.child;if(ye!==null)ye.return=_e,Fe=ye;else for(;Fe!==null;){_e=Fe;var ge=_e.sibling,De=_e.return;if(zp(_e),_e===te){Fe=null;break}if(ge!==null){ge.return=De,Fe=ge;break}Fe=De}}}var ke=g.alternate;if(ke!==null){var He=ke.child;if(He!==null){ke.child=null;do{var Yt=He.sibling;He.sibling=null,He=Yt}while(He!==null)}}Fe=g}}if((g.subtreeFlags&2064)!==0&&T!==null)T.return=g,Fe=T;else e:for(;Fe!==null;){if(g=Fe,(g.flags&2048)!==0)switch(g.tag){case 0:case 11:case 15:Wo(9,g,g.return)}var $=g.sibling;if($!==null){$.return=g.return,Fe=$;break e}Fe=g.return}}var W=n.current;for(Fe=W;Fe!==null;){T=Fe;var K=T.child;if((T.subtreeFlags&2064)!==0&&K!==null)K.return=T,Fe=K;else e:for(T=W;Fe!==null;){if(F=Fe,(F.flags&2048)!==0)try{switch(F.tag){case 0:case 11:case 15:tl(9,F)}}catch(je){Xt(F,F.return,je)}if(F===T){Fe=null;break e}var we=F.sibling;if(we!==null){we.return=F.return,Fe=we;break e}Fe=F.return}}if(St=f,mr(),vt&&typeof vt.onPostCommitFiberRoot=="function")try{vt.onPostCommitFiberRoot(Tt,n)}catch{}c=!0}return c}finally{Ct=o,ii.transition=i}}return!1}function em(n,i,o){i=Ls(o,i),i=_p(n,i,1),n=vr(n,i,1),i=Cn(),n!==null&&(Un(n,1,i),Bn(n,i))}function Xt(n,i,o){if(n.tag===3)em(n,n,o);else for(;i!==null;){if(i.tag===3){em(i,n,o);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(xr===null||!xr.has(c))){n=Ls(o,n),n=xp(i,n,1),i=vr(i,n,1),n=Cn(),i!==null&&(Un(i,1,n),Bn(i,n));break}}i=i.return}}function Iv(n,i,o){var c=n.pingCache;c!==null&&c.delete(i),i=Cn(),n.pingedLanes|=n.suspendedLanes&o,an===n&&(fn&o)===o&&(nn===4||nn===3&&(fn&130023424)===fn&&500>Me()-wu?qr(n,0):Eu|=o),Bn(n,i)}function tm(n,i){i===0&&((n.mode&1)===0?i=1:(i=ai,ai<<=1,(ai&130023424)===0&&(ai=4194304)));var o=Cn();n=Hi(n,i),n!==null&&(Un(n,i,o),Bn(n,o))}function Uv(n){var i=n.memoizedState,o=0;i!==null&&(o=i.retryLane),tm(n,o)}function Fv(n,i){var o=0;switch(n.tag){case 13:var c=n.stateNode,f=n.memoizedState;f!==null&&(o=f.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),tm(n,o)}var nm;nm=function(n,i,o){if(n!==null)if(n.memoizedProps!==i.pendingProps||Fn.current)zn=!0;else{if((n.lanes&o)===0&&(i.flags&128)===0)return zn=!1,Ev(n,i,o);zn=(n.flags&131072)!==0}else zn=!1,Vt&&(i.flags&1048576)!==0&&Uh(i,za,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;Ja(n,i),n=i.pendingProps;var f=Es(i,vn.current);bs(i,o),f=tu(null,i,c,n,f,o);var g=nu();return i.flags|=1,typeof f=="object"&&f!==null&&typeof f.render=="function"&&f.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,On(c)?(g=!0,Ua(i)):g=!1,i.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,qc(i),f.updater=Za,i.stateNode=f,f._reactInternals=i,lu(i,c,n,o),i=fu(null,i,c,!0,g,o)):(i.tag=0,Vt&&g&&zc(i),Rn(null,i,f,o),i=i.child),i;case 16:c=i.elementType;e:{switch(Ja(n,i),n=i.pendingProps,f=c._init,c=f(c._payload),i.type=c,f=i.tag=zv(c),n=ui(c,n),f){case 0:i=du(null,i,c,n,o);break e;case 1:i=Cp(null,i,c,n,o);break e;case 11:i=Ep(null,i,c,n,o);break e;case 14:i=wp(null,i,c,ui(c.type,n),o);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,f=i.pendingProps,f=i.elementType===c?f:ui(c,f),du(n,i,c,f,o);case 1:return c=i.type,f=i.pendingProps,f=i.elementType===c?f:ui(c,f),Cp(n,i,c,f,o);case 3:e:{if(bp(i),n===null)throw Error(t(387));c=i.pendingProps,g=i.memoizedState,f=g.element,Wh(n,i),Wa(i,c,null,o);var T=i.memoizedState;if(c=T.element,g.isDehydrated)if(g={element:c,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},i.updateQueue.baseState=g,i.memoizedState=g,i.flags&256){f=Ls(Error(t(423)),i),i=Pp(n,i,c,o,f);break e}else if(c!==f){f=Ls(Error(t(424)),i),i=Pp(n,i,c,o,f);break e}else for(Yn=fr(i.stateNode.containerInfo.firstChild),Xn=i,Vt=!0,ci=null,o=Vh(i,null,c,o),i.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(As(),c===f){i=Gi(n,i,o);break e}Rn(n,i,c,o)}i=i.child}return i;case 5:return Yh(i),n===null&&Hc(i),c=i.type,f=i.pendingProps,g=n!==null?n.memoizedProps:null,T=f.children,Dc(c,f)?T=null:g!==null&&Dc(c,g)&&(i.flags|=32),Rp(n,i),Rn(n,i,T,o),i.child;case 6:return n===null&&Hc(i),null;case 13:return Lp(n,i,o);case 4:return $c(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=Rs(i,null,c,o):Rn(n,i,c,o),i.child;case 11:return c=i.type,f=i.pendingProps,f=i.elementType===c?f:ui(c,f),Ep(n,i,c,f,o);case 7:return Rn(n,i,i.pendingProps,o),i.child;case 8:return Rn(n,i,i.pendingProps.children,o),i.child;case 12:return Rn(n,i,i.pendingProps.children,o),i.child;case 10:e:{if(c=i.type._context,f=i.pendingProps,g=i.memoizedProps,T=f.value,Ft(Ha,c._currentValue),c._currentValue=T,g!==null)if(li(g.value,T)){if(g.children===f.children&&!Fn.current){i=Gi(n,i,o);break e}}else for(g=i.child,g!==null&&(g.return=i);g!==null;){var F=g.dependencies;if(F!==null){T=g.child;for(var H=F.firstContext;H!==null;){if(H.context===c){if(g.tag===1){H=Vi(-1,o&-o),H.tag=2;var te=g.updateQueue;if(te!==null){te=te.shared;var _e=te.pending;_e===null?H.next=H:(H.next=_e.next,_e.next=H),te.pending=H}}g.lanes|=o,H=g.alternate,H!==null&&(H.lanes|=o),Xc(g.return,o,i),F.lanes|=o;break}H=H.next}}else if(g.tag===10)T=g.type===i.type?null:g.child;else if(g.tag===18){if(T=g.return,T===null)throw Error(t(341));T.lanes|=o,F=T.alternate,F!==null&&(F.lanes|=o),Xc(T,o,i),T=g.sibling}else T=g.child;if(T!==null)T.return=g;else for(T=g;T!==null;){if(T===i){T=null;break}if(g=T.sibling,g!==null){g.return=T.return,T=g;break}T=T.return}g=T}Rn(n,i,f.children,o),i=i.child}return i;case 9:return f=i.type,c=i.pendingProps.children,bs(i,o),f=ti(f),c=c(f),i.flags|=1,Rn(n,i,c,o),i.child;case 14:return c=i.type,f=ui(c,i.pendingProps),f=ui(c.type,f),wp(n,i,c,f,o);case 15:return Tp(n,i,i.type,i.pendingProps,o);case 17:return c=i.type,f=i.pendingProps,f=i.elementType===c?f:ui(c,f),Ja(n,i),i.tag=1,On(c)?(n=!0,Ua(i)):n=!1,bs(i,o),gp(i,c,f),lu(i,c,f,o),fu(null,i,c,!0,n,o);case 19:return Np(n,i,o);case 22:return Ap(n,i,o)}throw Error(t(156,i.tag))};function im(n,i){return ne(n,i)}function Ov(n,i,o,c){this.tag=n,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ri(n,i,o,c){return new Ov(n,i,o,c)}function Du(n){return n=n.prototype,!(!n||!n.isReactComponent)}function zv(n){if(typeof n=="function")return Du(n)?1:0;if(n!=null){if(n=n.$$typeof,n===ee)return 11;if(n===de)return 14}return 2}function Er(n,i){var o=n.alternate;return o===null?(o=ri(n.tag,i,n.key,n.mode),o.elementType=n.elementType,o.type=n.type,o.stateNode=n.stateNode,o.alternate=n,n.alternate=o):(o.pendingProps=i,o.type=n.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=n.flags&14680064,o.childLanes=n.childLanes,o.lanes=n.lanes,o.child=n.child,o.memoizedProps=n.memoizedProps,o.memoizedState=n.memoizedState,o.updateQueue=n.updateQueue,i=n.dependencies,o.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},o.sibling=n.sibling,o.index=n.index,o.ref=n.ref,o}function ul(n,i,o,c,f,g){var T=2;if(c=n,typeof n=="function")Du(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case U:return Kr(o.children,f,g,i);case z:T=8,f|=8;break;case D:return n=ri(12,o,i,f|2),n.elementType=D,n.lanes=g,n;case Z:return n=ri(13,o,i,f),n.elementType=Z,n.lanes=g,n;case le:return n=ri(19,o,i,f),n.elementType=le,n.lanes=g,n;case ue:return dl(o,f,g,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case C:T=10;break e;case B:T=9;break e;case ee:T=11;break e;case de:T=14;break e;case ae:T=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=ri(T,o,i,f),i.elementType=n,i.type=c,i.lanes=g,i}function Kr(n,i,o,c){return n=ri(7,n,c,i),n.lanes=o,n}function dl(n,i,o,c){return n=ri(22,n,c,i),n.elementType=ue,n.lanes=o,n.stateNode={isHidden:!1},n}function Nu(n,i,o){return n=ri(6,n,null,i),n.lanes=o,n}function Iu(n,i,o){return i=ri(4,n.children!==null?n.children:[],n.key,i),i.lanes=o,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function kv(n,i,o,c,f){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Qn(0),this.expirationTimes=Qn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Qn(0),this.identifierPrefix=c,this.onRecoverableError=f,this.mutableSourceEagerHydrationData=null}function Uu(n,i,o,c,f,g,T,F,H){return n=new kv(n,i,o,F,H),i===1?(i=1,g===!0&&(i|=8)):i=0,g=ri(3,null,null,i),n.current=g,g.stateNode=n,g.memoizedState={element:c,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},qc(g),n}function Bv(n,i,o){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:N,key:c==null?null:""+c,children:n,containerInfo:i,implementation:o}}function rm(n){if(!n)return pr;n=n._reactInternals;e:{if(Ei(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(On(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var o=n.type;if(On(o))return Dh(n,o,i)}return i}function sm(n,i,o,c,f,g,T,F,H){return n=Uu(o,c,!0,n,f,g,T,F,H),n.context=rm(null),o=n.current,c=Cn(),f=Sr(o),g=Vi(c,f),g.callback=i??null,vr(o,g,f),n.current.lanes=f,Un(n,f,c),Bn(n,c),n}function fl(n,i,o,c){var f=i.current,g=Cn(),T=Sr(f);return o=rm(o),i.context===null?i.context=o:i.pendingContext=o,i=Vi(g,T),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=vr(f,i,T),n!==null&&(hi(n,f,T,g),Ga(n,f,T)),T}function hl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function om(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var o=n.retryLane;n.retryLane=o!==0&&o<i?o:i}}function Fu(n,i){om(n,i),(n=n.alternate)&&om(n,i)}function Hv(){return null}var am=typeof reportError=="function"?reportError:function(n){console.error(n)};function Ou(n){this._internalRoot=n}pl.prototype.render=Ou.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));fl(n,i,null,null)},pl.prototype.unmount=Ou.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Yr(function(){fl(null,n,null,null)}),i[Oi]=null}};function pl(n){this._internalRoot=n}pl.prototype.unstable_scheduleHydration=function(n){if(n){var i=Wf();n={blockedOn:null,target:n,priority:i};for(var o=0;o<cr.length&&i!==0&&i<cr[o].priority;o++);cr.splice(o,0,n),o===0&&Yf(n)}};function zu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function ml(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function lm(){}function Vv(n,i,o,c,f){if(f){if(typeof c=="function"){var g=c;c=function(){var te=hl(T);g.call(te)}}var T=sm(i,c,n,0,null,!1,!1,"",lm);return n._reactRootContainer=T,n[Oi]=T.current,Lo(n.nodeType===8?n.parentNode:n),Yr(),T}for(;f=n.lastChild;)n.removeChild(f);if(typeof c=="function"){var F=c;c=function(){var te=hl(H);F.call(te)}}var H=Uu(n,0,!1,null,null,!1,!1,"",lm);return n._reactRootContainer=H,n[Oi]=H.current,Lo(n.nodeType===8?n.parentNode:n),Yr(function(){fl(i,H,o,c)}),H}function gl(n,i,o,c,f){var g=o._reactRootContainer;if(g){var T=g;if(typeof f=="function"){var F=f;f=function(){var H=hl(T);F.call(H)}}fl(i,T,n,f)}else T=Vv(o,i,n,f,c);return hl(T)}Vf=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var o=en(i.pendingLanes);o!==0&&(lc(i,o|1),Bn(i,Me()),(St&6)===0&&(Is=Me()+500,mr()))}break;case 13:Yr(function(){var c=Hi(n,1);if(c!==null){var f=Cn();hi(c,n,1,f)}}),Fu(n,1)}},cc=function(n){if(n.tag===13){var i=Hi(n,134217728);if(i!==null){var o=Cn();hi(i,n,134217728,o)}Fu(n,134217728)}},Gf=function(n){if(n.tag===13){var i=Sr(n),o=Hi(n,i);if(o!==null){var c=Cn();hi(o,n,i,c)}Fu(n,i)}},Wf=function(){return Ct},jf=function(n,i){var o=Ct;try{return Ct=n,i()}finally{Ct=o}},Ce=function(n,i,o){switch(i){case"input":if(dt(n,o),i=o.name,o.type==="radio"&&i!=null){for(o=n;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<o.length;i++){var c=o[i];if(c!==n&&c.form===n.form){var f=Na(c);if(!f)throw Error(t(90));gt(c),dt(c,f)}}}break;case"textarea":me(n,o);break;case"select":i=o.value,i!=null&&I(n,!!o.multiple,i,!1)}},kt=bu,Jt=Yr;var Gv={usingClientEntryPoint:!1,Events:[Io,Ss,Na,Pe,ot,bu]},qo={findFiberByHostInstance:kr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Wv={bundleType:qo.bundleType,version:qo.version,rendererPackageName:qo.rendererPackageName,rendererConfig:qo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:A.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=P(n),n===null?null:n.stateNode},findFiberByHostInstance:qo.findFiberByHostInstance||Hv,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var vl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vl.isDisabled&&vl.supportsFiber)try{Tt=vl.inject(Wv),vt=vl}catch{}}return Hn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Gv,Hn.createPortal=function(n,i){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!zu(i))throw Error(t(200));return Bv(n,i,null,o)},Hn.createRoot=function(n,i){if(!zu(n))throw Error(t(299));var o=!1,c="",f=am;return i!=null&&(i.unstable_strictMode===!0&&(o=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(f=i.onRecoverableError)),i=Uu(n,1,!1,null,null,o,!1,c,f),n[Oi]=i.current,Lo(n.nodeType===8?n.parentNode:n),new Ou(i)},Hn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=P(i),n=n===null?null:n.stateNode,n},Hn.flushSync=function(n){return Yr(n)},Hn.hydrate=function(n,i,o){if(!ml(i))throw Error(t(200));return gl(null,n,i,!0,o)},Hn.hydrateRoot=function(n,i,o){if(!zu(n))throw Error(t(405));var c=o!=null&&o.hydratedSources||null,f=!1,g="",T=am;if(o!=null&&(o.unstable_strictMode===!0&&(f=!0),o.identifierPrefix!==void 0&&(g=o.identifierPrefix),o.onRecoverableError!==void 0&&(T=o.onRecoverableError)),i=sm(i,null,n,1,o??null,f,!1,g,T),n[Oi]=i.current,Lo(n),c)for(n=0;n<c.length;n++)o=c[n],f=o._getVersion,f=f(o._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[o,f]:i.mutableSourceEagerHydrationData.push(o,f);return new pl(i)},Hn.render=function(n,i,o){if(!ml(i))throw Error(t(200));return gl(null,n,i,!1,o)},Hn.unmountComponentAtNode=function(n){if(!ml(n))throw Error(t(40));return n._reactRootContainer?(Yr(function(){gl(null,null,n,!1,function(){n._reactRootContainer=null,n[Oi]=null})}),!0):!1},Hn.unstable_batchedUpdates=bu,Hn.unstable_renderSubtreeIntoContainer=function(n,i,o,c){if(!ml(o))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return gl(n,i,o,!1,c)},Hn.version="18.3.1-next-f1338f8080-20240426",Hn}var gm;function t_(){if(gm)return Hu.exports;gm=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Hu.exports=e_(),Hu.exports}var vm;function n_(){if(vm)return _l;vm=1;var s=t_();return _l.createRoot=s.createRoot,_l.hydrateRoot=s.hydrateRoot,_l}var i_=n_();const r_=Pg(i_);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const yf="170",s_=0,_m=1,o_=2,Lg=1,Dg=2,Qi=3,Ur=0,Wn=1,Li=2,Nr=0,Js=1,xm=2,ym=3,Sm=4,a_=5,ss=100,l_=101,c_=102,u_=103,d_=104,f_=200,h_=201,p_=202,m_=203,bd=204,Pd=205,g_=206,v_=207,__=208,x_=209,y_=210,S_=211,M_=212,E_=213,w_=214,Ld=0,Dd=1,Nd=2,io=3,Id=4,Ud=5,Fd=6,Od=7,Ng=0,T_=1,A_=2,Ir=0,R_=1,C_=2,b_=3,Ig=4,P_=5,L_=6,D_=7,Ug=300,ro=301,so=302,zd=303,kd=304,tc=306,$l=1e3,as=1001,Bd=1002,Si=1003,N_=1004,xl=1005,Di=1006,Wu=1007,ls=1008,ir=1009,Fg=1010,Og=1011,aa=1012,Sf=1013,us=1014,er=1015,ua=1016,Mf=1017,Ef=1018,oo=1020,zg=35902,kg=1021,Bg=1022,xi=1023,Hg=1024,Vg=1025,eo=1026,ao=1027,Gg=1028,wf=1029,Wg=1030,Tf=1031,Af=1033,Gl=33776,Wl=33777,jl=33778,Xl=33779,Hd=35840,Vd=35841,Gd=35842,Wd=35843,jd=36196,Xd=37492,Yd=37496,qd=37808,$d=37809,Kd=37810,Zd=37811,Qd=37812,Jd=37813,ef=37814,tf=37815,nf=37816,rf=37817,sf=37818,of=37819,af=37820,lf=37821,Yl=36492,cf=36494,uf=36495,jg=36283,df=36284,ff=36285,hf=36286,I_=3200,U_=3201,Xg=0,F_=1,Dr="",Dn="srgb",uo="srgb-linear",nc="linear",Lt="srgb",Fs=7680,Mm=519,O_=512,z_=513,k_=514,Yg=515,B_=516,H_=517,V_=518,G_=519,Em=35044,wm="300 es",tr=2e3,Kl=2001;class fo{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const a=this._listeners[e];if(a!==void 0){const l=a.indexOf(t);l!==-1&&a.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const r=this._listeners[e.type];if(r!==void 0){e.target=this;const a=r.slice(0);for(let l=0,u=a.length;l<u;l++)a[l].call(this,e);e.target=null}}}const Sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Tm=1234567;const sa=Math.PI/180,la=180/Math.PI;function ho(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Sn[s&255]+Sn[s>>8&255]+Sn[s>>16&255]+Sn[s>>24&255]+"-"+Sn[e&255]+Sn[e>>8&255]+"-"+Sn[e>>16&15|64]+Sn[e>>24&255]+"-"+Sn[t&63|128]+Sn[t>>8&255]+"-"+Sn[t>>16&255]+Sn[t>>24&255]+Sn[r&255]+Sn[r>>8&255]+Sn[r>>16&255]+Sn[r>>24&255]).toLowerCase()}function pn(s,e,t){return Math.max(e,Math.min(t,s))}function Rf(s,e){return(s%e+e)%e}function W_(s,e,t,r,a){return r+(s-e)*(a-r)/(t-e)}function j_(s,e,t){return s!==e?(t-s)/(e-s):0}function oa(s,e,t){return(1-t)*s+t*e}function X_(s,e,t,r){return oa(s,e,1-Math.exp(-t*r))}function Y_(s,e=1){return e-Math.abs(Rf(s,e*2)-e)}function q_(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function $_(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function K_(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Z_(s,e){return s+Math.random()*(e-s)}function Q_(s){return s*(.5-Math.random())}function J_(s){s!==void 0&&(Tm=s);let e=Tm+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ex(s){return s*sa}function tx(s){return s*la}function nx(s){return(s&s-1)===0&&s!==0}function ix(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function rx(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function sx(s,e,t,r,a){const l=Math.cos,u=Math.sin,d=l(t/2),h=u(t/2),m=l((e+r)/2),v=u((e+r)/2),x=l((e-r)/2),_=u((e-r)/2),y=l((r-e)/2),E=u((r-e)/2);switch(a){case"XYX":s.set(d*v,h*x,h*_,d*m);break;case"YZY":s.set(h*_,d*v,h*x,d*m);break;case"ZXZ":s.set(h*x,h*_,d*v,d*m);break;case"XZX":s.set(d*v,h*E,h*y,d*m);break;case"YXY":s.set(h*y,d*v,h*E,d*m);break;case"ZYZ":s.set(h*E,h*y,d*v,d*m);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Ks(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Pn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Am={DEG2RAD:sa,RAD2DEG:la,generateUUID:ho,clamp:pn,euclideanModulo:Rf,mapLinear:W_,inverseLerp:j_,lerp:oa,damp:X_,pingpong:Y_,smoothstep:q_,smootherstep:$_,randInt:K_,randFloat:Z_,randFloatSpread:Q_,seededRandom:J_,degToRad:ex,radToDeg:tx,isPowerOfTwo:nx,ceilPowerOfTwo:ix,floorPowerOfTwo:rx,setQuaternionFromProperEuler:sx,normalize:Pn,denormalize:Ks};class mt{constructor(e=0,t=0){mt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,r=this.y,a=e.elements;return this.x=a[0]*t+a[3]*r+a[6],this.y=a[1]*t+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(pn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const r=Math.cos(t),a=Math.sin(t),l=this.x-e.x,u=this.y-e.y;return this.x=l*r-u*a+e.x,this.y=l*a+u*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class lt{constructor(e,t,r,a,l,u,d,h,m){lt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,u,d,h,m)}set(e,t,r,a,l,u,d,h,m){const v=this.elements;return v[0]=e,v[1]=a,v[2]=d,v[3]=t,v[4]=l,v[5]=h,v[6]=r,v[7]=u,v[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,u=r[0],d=r[3],h=r[6],m=r[1],v=r[4],x=r[7],_=r[2],y=r[5],E=r[8],w=a[0],S=a[3],p=a[6],b=a[1],L=a[4],A=a[7],k=a[2],N=a[5],U=a[8];return l[0]=u*w+d*b+h*k,l[3]=u*S+d*L+h*N,l[6]=u*p+d*A+h*U,l[1]=m*w+v*b+x*k,l[4]=m*S+v*L+x*N,l[7]=m*p+v*A+x*U,l[2]=_*w+y*b+E*k,l[5]=_*S+y*L+E*N,l[8]=_*p+y*A+E*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],u=e[4],d=e[5],h=e[6],m=e[7],v=e[8];return t*u*v-t*d*m-r*l*v+r*d*h+a*l*m-a*u*h}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],u=e[4],d=e[5],h=e[6],m=e[7],v=e[8],x=v*u-d*m,_=d*h-v*l,y=m*l-u*h,E=t*x+r*_+a*y;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/E;return e[0]=x*w,e[1]=(a*m-v*r)*w,e[2]=(d*r-a*u)*w,e[3]=_*w,e[4]=(v*t-a*h)*w,e[5]=(a*l-d*t)*w,e[6]=y*w,e[7]=(r*h-m*t)*w,e[8]=(u*t-r*l)*w,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,a,l,u,d){const h=Math.cos(l),m=Math.sin(l);return this.set(r*h,r*m,-r*(h*u+m*d)+u+e,-a*m,a*h,-a*(-m*u+h*d)+d+t,0,0,1),this}scale(e,t){return this.premultiply(ju.makeScale(e,t)),this}rotate(e){return this.premultiply(ju.makeRotation(-e)),this}translate(e,t){return this.premultiply(ju.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<9;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ju=new lt;function qg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Zl(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ox(){const s=Zl("canvas");return s.style.display="block",s}const Rm={};function na(s){s in Rm||(Rm[s]=!0,console.warn(s))}function ax(s,e,t){return new Promise(function(r,a){function l(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:r()}}setTimeout(l,t)})}function lx(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function cx(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Mt={enabled:!0,workingColorSpace:uo,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Lt&&(s.r=nr(s.r),s.g=nr(s.g),s.b=nr(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Lt&&(s.r=to(s.r),s.g=to(s.g),s.b=to(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Dr?nc:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function nr(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function to(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const Cm=[.64,.33,.3,.6,.15,.06],bm=[.2126,.7152,.0722],Pm=[.3127,.329],Lm=new lt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Dm=new lt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Mt.define({[uo]:{primaries:Cm,whitePoint:Pm,transfer:nc,toXYZ:Lm,fromXYZ:Dm,luminanceCoefficients:bm,workingColorSpaceConfig:{unpackColorSpace:Dn},outputColorSpaceConfig:{drawingBufferColorSpace:Dn}},[Dn]:{primaries:Cm,whitePoint:Pm,transfer:Lt,toXYZ:Lm,fromXYZ:Dm,luminanceCoefficients:bm,outputColorSpaceConfig:{drawingBufferColorSpace:Dn}}});let Os;class ux{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Os===void 0&&(Os=Zl("canvas")),Os.width=e.width,Os.height=e.height;const r=Os.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),t=Os}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Zl("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const a=r.getImageData(0,0,e.width,e.height),l=a.data;for(let u=0;u<l.length;u++)l[u]=nr(l[u]/255)*255;return r.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(nr(t[r]/255)*255):t[r]=nr(t[r]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let dx=0;class $g{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:dx++}),this.uuid=ho(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},a=this.data;if(a!==null){let l;if(Array.isArray(a)){l=[];for(let u=0,d=a.length;u<d;u++)a[u].isDataTexture?l.push(Xu(a[u].image)):l.push(Xu(a[u]))}else l=Xu(a);r.url=l}return t||(e.images[this.uuid]=r),r}}function Xu(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?ux.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let fx=0;class En extends fo{constructor(e=En.DEFAULT_IMAGE,t=En.DEFAULT_MAPPING,r=as,a=as,l=Di,u=ls,d=xi,h=ir,m=En.DEFAULT_ANISOTROPY,v=Dr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fx++}),this.uuid=ho(),this.name="",this.source=new $g(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=l,this.minFilter=u,this.anisotropy=m,this.format=d,this.internalFormat=null,this.type=h,this.offset=new mt(0,0),this.repeat=new mt(1,1),this.center=new mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new lt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=v,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ug)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $l:e.x=e.x-Math.floor(e.x);break;case as:e.x=e.x<0?0:1;break;case Bd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $l:e.y=e.y-Math.floor(e.y);break;case as:e.y=e.y<0?0:1;break;case Bd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}En.DEFAULT_IMAGE=null;En.DEFAULT_MAPPING=Ug;En.DEFAULT_ANISOTROPY=1;class Nt{constructor(e=0,t=0,r=0,a=1){Nt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,a){return this.x=e,this.y=t,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=this.w,u=e.elements;return this.x=u[0]*t+u[4]*r+u[8]*a+u[12]*l,this.y=u[1]*t+u[5]*r+u[9]*a+u[13]*l,this.z=u[2]*t+u[6]*r+u[10]*a+u[14]*l,this.w=u[3]*t+u[7]*r+u[11]*a+u[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,a,l;const h=e.elements,m=h[0],v=h[4],x=h[8],_=h[1],y=h[5],E=h[9],w=h[2],S=h[6],p=h[10];if(Math.abs(v-_)<.01&&Math.abs(x-w)<.01&&Math.abs(E-S)<.01){if(Math.abs(v+_)<.1&&Math.abs(x+w)<.1&&Math.abs(E+S)<.1&&Math.abs(m+y+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const L=(m+1)/2,A=(y+1)/2,k=(p+1)/2,N=(v+_)/4,U=(x+w)/4,z=(E+S)/4;return L>A&&L>k?L<.01?(r=0,a=.707106781,l=.707106781):(r=Math.sqrt(L),a=N/r,l=U/r):A>k?A<.01?(r=.707106781,a=0,l=.707106781):(a=Math.sqrt(A),r=N/a,l=z/a):k<.01?(r=.707106781,a=.707106781,l=0):(l=Math.sqrt(k),r=U/l,a=z/l),this.set(r,a,l,t),this}let b=Math.sqrt((S-E)*(S-E)+(x-w)*(x-w)+(_-v)*(_-v));return Math.abs(b)<.001&&(b=1),this.x=(S-E)/b,this.y=(x-w)/b,this.z=(_-v)/b,this.w=Math.acos((m+y+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class hx extends fo{constructor(e=1,t=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Nt(0,0,e,t),this.scissorTest=!1,this.viewport=new Nt(0,0,e,t);const a={width:e,height:t,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Di,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const l=new En(a,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);l.flipY=!1,l.generateMipmaps=r.generateMipmaps,l.internalFormat=r.internalFormat,this.textures=[];const u=r.count;for(let d=0;d<u;d++)this.textures[d]=l.clone(),this.textures[d].isRenderTargetTexture=!0;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let a=0,l=this.textures.length;a<l;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=r;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,a=e.textures.length;r<a;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new $g(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ds extends hx{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}}class Kg extends En{constructor(e=null,t=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=Si,this.minFilter=Si,this.wrapR=as,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class px extends En{constructor(e=null,t=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=Si,this.minFilter=Si,this.wrapR=as,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class da{constructor(e=0,t=0,r=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=a}static slerpFlat(e,t,r,a,l,u,d){let h=r[a+0],m=r[a+1],v=r[a+2],x=r[a+3];const _=l[u+0],y=l[u+1],E=l[u+2],w=l[u+3];if(d===0){e[t+0]=h,e[t+1]=m,e[t+2]=v,e[t+3]=x;return}if(d===1){e[t+0]=_,e[t+1]=y,e[t+2]=E,e[t+3]=w;return}if(x!==w||h!==_||m!==y||v!==E){let S=1-d;const p=h*_+m*y+v*E+x*w,b=p>=0?1:-1,L=1-p*p;if(L>Number.EPSILON){const k=Math.sqrt(L),N=Math.atan2(k,p*b);S=Math.sin(S*N)/k,d=Math.sin(d*N)/k}const A=d*b;if(h=h*S+_*A,m=m*S+y*A,v=v*S+E*A,x=x*S+w*A,S===1-d){const k=1/Math.sqrt(h*h+m*m+v*v+x*x);h*=k,m*=k,v*=k,x*=k}}e[t]=h,e[t+1]=m,e[t+2]=v,e[t+3]=x}static multiplyQuaternionsFlat(e,t,r,a,l,u){const d=r[a],h=r[a+1],m=r[a+2],v=r[a+3],x=l[u],_=l[u+1],y=l[u+2],E=l[u+3];return e[t]=d*E+v*x+h*y-m*_,e[t+1]=h*E+v*_+m*x-d*y,e[t+2]=m*E+v*y+d*_-h*x,e[t+3]=v*E-d*x-h*_-m*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,a){return this._x=e,this._y=t,this._z=r,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const r=e._x,a=e._y,l=e._z,u=e._order,d=Math.cos,h=Math.sin,m=d(r/2),v=d(a/2),x=d(l/2),_=h(r/2),y=h(a/2),E=h(l/2);switch(u){case"XYZ":this._x=_*v*x+m*y*E,this._y=m*y*x-_*v*E,this._z=m*v*E+_*y*x,this._w=m*v*x-_*y*E;break;case"YXZ":this._x=_*v*x+m*y*E,this._y=m*y*x-_*v*E,this._z=m*v*E-_*y*x,this._w=m*v*x+_*y*E;break;case"ZXY":this._x=_*v*x-m*y*E,this._y=m*y*x+_*v*E,this._z=m*v*E+_*y*x,this._w=m*v*x-_*y*E;break;case"ZYX":this._x=_*v*x-m*y*E,this._y=m*y*x+_*v*E,this._z=m*v*E-_*y*x,this._w=m*v*x+_*y*E;break;case"YZX":this._x=_*v*x+m*y*E,this._y=m*y*x+_*v*E,this._z=m*v*E-_*y*x,this._w=m*v*x-_*y*E;break;case"XZY":this._x=_*v*x-m*y*E,this._y=m*y*x-_*v*E,this._z=m*v*E+_*y*x,this._w=m*v*x+_*y*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+u)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const r=t/2,a=Math.sin(r);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,r=t[0],a=t[4],l=t[8],u=t[1],d=t[5],h=t[9],m=t[2],v=t[6],x=t[10],_=r+d+x;if(_>0){const y=.5/Math.sqrt(_+1);this._w=.25/y,this._x=(v-h)*y,this._y=(l-m)*y,this._z=(u-a)*y}else if(r>d&&r>x){const y=2*Math.sqrt(1+r-d-x);this._w=(v-h)/y,this._x=.25*y,this._y=(a+u)/y,this._z=(l+m)/y}else if(d>x){const y=2*Math.sqrt(1+d-r-x);this._w=(l-m)/y,this._x=(a+u)/y,this._y=.25*y,this._z=(h+v)/y}else{const y=2*Math.sqrt(1+x-r-d);this._w=(u-a)/y,this._x=(l+m)/y,this._y=(h+v)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(pn(this.dot(e),-1,1)))}rotateTowards(e,t){const r=this.angleTo(e);if(r===0)return this;const a=Math.min(1,t/r);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const r=e._x,a=e._y,l=e._z,u=e._w,d=t._x,h=t._y,m=t._z,v=t._w;return this._x=r*v+u*d+a*m-l*h,this._y=a*v+u*h+l*d-r*m,this._z=l*v+u*m+r*h-a*d,this._w=u*v-r*d-a*h-l*m,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const r=this._x,a=this._y,l=this._z,u=this._w;let d=u*e._w+r*e._x+a*e._y+l*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=u,this._x=r,this._y=a,this._z=l,this;const h=1-d*d;if(h<=Number.EPSILON){const y=1-t;return this._w=y*u+t*this._w,this._x=y*r+t*this._x,this._y=y*a+t*this._y,this._z=y*l+t*this._z,this.normalize(),this}const m=Math.sqrt(h),v=Math.atan2(m,d),x=Math.sin((1-t)*v)/m,_=Math.sin(t*v)/m;return this._w=u*x+this._w*_,this._x=r*x+this._x*_,this._y=a*x+this._y*_,this._z=l*x+this._z*_,this._onChangeCallback(),this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),a=Math.sqrt(1-r),l=Math.sqrt(r);return this.set(a*Math.sin(e),a*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(e=0,t=0,r=0){G.prototype.isVector3=!0,this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Nm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Nm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[3]*r+l[6]*a,this.y=l[1]*t+l[4]*r+l[7]*a,this.z=l[2]*t+l[5]*r+l[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=e.elements,u=1/(l[3]*t+l[7]*r+l[11]*a+l[15]);return this.x=(l[0]*t+l[4]*r+l[8]*a+l[12])*u,this.y=(l[1]*t+l[5]*r+l[9]*a+l[13])*u,this.z=(l[2]*t+l[6]*r+l[10]*a+l[14])*u,this}applyQuaternion(e){const t=this.x,r=this.y,a=this.z,l=e.x,u=e.y,d=e.z,h=e.w,m=2*(u*a-d*r),v=2*(d*t-l*a),x=2*(l*r-u*t);return this.x=t+h*m+u*x-d*v,this.y=r+h*v+d*m-l*x,this.z=a+h*x+l*v-u*m,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[4]*r+l[8]*a,this.y=l[1]*t+l[5]*r+l[9]*a,this.z=l[2]*t+l[6]*r+l[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const r=e.x,a=e.y,l=e.z,u=t.x,d=t.y,h=t.z;return this.x=a*h-l*d,this.y=l*u-r*h,this.z=r*d-a*u,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Yu.copy(this).projectOnVector(e),this.sub(Yu)}reflect(e){return this.sub(Yu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(pn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return t*t+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){const a=Math.sin(t)*e;return this.x=a*Math.sin(r),this.y=Math.cos(t)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Yu=new G,Nm=new da;class fa{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(pi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(pi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const r=pi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const l=r.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let u=0,d=l.count;u<d;u++)e.isMesh===!0?e.getVertexPosition(u,pi):pi.fromBufferAttribute(l,u),pi.applyMatrix4(e.matrixWorld),this.expandByPoint(pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),yl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),yl.copy(r.boundingBox)),yl.applyMatrix4(e.matrixWorld),this.union(yl)}const a=e.children;for(let l=0,u=a.length;l<u;l++)this.expandByObject(a[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pi),pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ko),Sl.subVectors(this.max,Ko),zs.subVectors(e.a,Ko),ks.subVectors(e.b,Ko),Bs.subVectors(e.c,Ko),Tr.subVectors(ks,zs),Ar.subVectors(Bs,ks),Zr.subVectors(zs,Bs);let t=[0,-Tr.z,Tr.y,0,-Ar.z,Ar.y,0,-Zr.z,Zr.y,Tr.z,0,-Tr.x,Ar.z,0,-Ar.x,Zr.z,0,-Zr.x,-Tr.y,Tr.x,0,-Ar.y,Ar.x,0,-Zr.y,Zr.x,0];return!qu(t,zs,ks,Bs,Sl)||(t=[1,0,0,0,1,0,0,0,1],!qu(t,zs,ks,Bs,Sl))?!1:(Ml.crossVectors(Tr,Ar),t=[Ml.x,Ml.y,Ml.z],qu(t,zs,ks,Bs,Sl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ji[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ji[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ji[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ji[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ji[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ji[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ji[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ji[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ji),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ji=[new G,new G,new G,new G,new G,new G,new G,new G],pi=new G,yl=new fa,zs=new G,ks=new G,Bs=new G,Tr=new G,Ar=new G,Zr=new G,Ko=new G,Sl=new G,Ml=new G,Qr=new G;function qu(s,e,t,r,a){for(let l=0,u=s.length-3;l<=u;l+=3){Qr.fromArray(s,l);const d=a.x*Math.abs(Qr.x)+a.y*Math.abs(Qr.y)+a.z*Math.abs(Qr.z),h=e.dot(Qr),m=t.dot(Qr),v=r.dot(Qr);if(Math.max(-Math.max(h,m,v),Math.min(h,m,v))>d)return!1}return!0}const mx=new fa,Zo=new G,$u=new G;class ic{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const r=this.center;t!==void 0?r.copy(t):mx.setFromPoints(e).getCenter(r);let a=0;for(let l=0,u=e.length;l<u;l++)a=Math.max(a,r.distanceToSquared(e[l]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zo.subVectors(e,this.center);const t=Zo.lengthSq();if(t>this.radius*this.radius){const r=Math.sqrt(t),a=(r-this.radius)*.5;this.center.addScaledVector(Zo,a/r),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($u.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zo.copy(e.center).add($u)),this.expandByPoint(Zo.copy(e.center).sub($u))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Xi=new G,Ku=new G,El=new G,Rr=new G,Zu=new G,wl=new G,Qu=new G;class Cf{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Xi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Xi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Xi.copy(this.origin).addScaledVector(this.direction,t),Xi.distanceToSquared(e))}distanceSqToSegment(e,t,r,a){Ku.copy(e).add(t).multiplyScalar(.5),El.copy(t).sub(e).normalize(),Rr.copy(this.origin).sub(Ku);const l=e.distanceTo(t)*.5,u=-this.direction.dot(El),d=Rr.dot(this.direction),h=-Rr.dot(El),m=Rr.lengthSq(),v=Math.abs(1-u*u);let x,_,y,E;if(v>0)if(x=u*h-d,_=u*d-h,E=l*v,x>=0)if(_>=-E)if(_<=E){const w=1/v;x*=w,_*=w,y=x*(x+u*_+2*d)+_*(u*x+_+2*h)+m}else _=l,x=Math.max(0,-(u*_+d)),y=-x*x+_*(_+2*h)+m;else _=-l,x=Math.max(0,-(u*_+d)),y=-x*x+_*(_+2*h)+m;else _<=-E?(x=Math.max(0,-(-u*l+d)),_=x>0?-l:Math.min(Math.max(-l,-h),l),y=-x*x+_*(_+2*h)+m):_<=E?(x=0,_=Math.min(Math.max(-l,-h),l),y=_*(_+2*h)+m):(x=Math.max(0,-(u*l+d)),_=x>0?l:Math.min(Math.max(-l,-h),l),y=-x*x+_*(_+2*h)+m);else _=u>0?-l:l,x=Math.max(0,-(u*_+d)),y=-x*x+_*(_+2*h)+m;return r&&r.copy(this.origin).addScaledVector(this.direction,x),a&&a.copy(Ku).addScaledVector(El,_),y}intersectSphere(e,t){Xi.subVectors(e.center,this.origin);const r=Xi.dot(this.direction),a=Xi.dot(Xi)-r*r,l=e.radius*e.radius;if(a>l)return null;const u=Math.sqrt(l-a),d=r-u,h=r+u;return h<0?null:d<0?this.at(h,t):this.at(d,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){const r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,a,l,u,d,h;const m=1/this.direction.x,v=1/this.direction.y,x=1/this.direction.z,_=this.origin;return m>=0?(r=(e.min.x-_.x)*m,a=(e.max.x-_.x)*m):(r=(e.max.x-_.x)*m,a=(e.min.x-_.x)*m),v>=0?(l=(e.min.y-_.y)*v,u=(e.max.y-_.y)*v):(l=(e.max.y-_.y)*v,u=(e.min.y-_.y)*v),r>u||l>a||((l>r||isNaN(r))&&(r=l),(u<a||isNaN(a))&&(a=u),x>=0?(d=(e.min.z-_.z)*x,h=(e.max.z-_.z)*x):(d=(e.max.z-_.z)*x,h=(e.min.z-_.z)*x),r>h||d>a)||((d>r||r!==r)&&(r=d),(h<a||a!==a)&&(a=h),a<0)?null:this.at(r>=0?r:a,t)}intersectsBox(e){return this.intersectBox(e,Xi)!==null}intersectTriangle(e,t,r,a,l){Zu.subVectors(t,e),wl.subVectors(r,e),Qu.crossVectors(Zu,wl);let u=this.direction.dot(Qu),d;if(u>0){if(a)return null;d=1}else if(u<0)d=-1,u=-u;else return null;Rr.subVectors(this.origin,e);const h=d*this.direction.dot(wl.crossVectors(Rr,wl));if(h<0)return null;const m=d*this.direction.dot(Zu.cross(Rr));if(m<0||h+m>u)return null;const v=-d*Rr.dot(Qu);return v<0?null:this.at(v/u,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class zt{constructor(e,t,r,a,l,u,d,h,m,v,x,_,y,E,w,S){zt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,u,d,h,m,v,x,_,y,E,w,S)}set(e,t,r,a,l,u,d,h,m,v,x,_,y,E,w,S){const p=this.elements;return p[0]=e,p[4]=t,p[8]=r,p[12]=a,p[1]=l,p[5]=u,p[9]=d,p[13]=h,p[2]=m,p[6]=v,p[10]=x,p[14]=_,p[3]=y,p[7]=E,p[11]=w,p[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new zt().fromArray(this.elements)}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){const t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,r=e.elements,a=1/Hs.setFromMatrixColumn(e,0).length(),l=1/Hs.setFromMatrixColumn(e,1).length(),u=1/Hs.setFromMatrixColumn(e,2).length();return t[0]=r[0]*a,t[1]=r[1]*a,t[2]=r[2]*a,t[3]=0,t[4]=r[4]*l,t[5]=r[5]*l,t[6]=r[6]*l,t[7]=0,t[8]=r[8]*u,t[9]=r[9]*u,t[10]=r[10]*u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,r=e.x,a=e.y,l=e.z,u=Math.cos(r),d=Math.sin(r),h=Math.cos(a),m=Math.sin(a),v=Math.cos(l),x=Math.sin(l);if(e.order==="XYZ"){const _=u*v,y=u*x,E=d*v,w=d*x;t[0]=h*v,t[4]=-h*x,t[8]=m,t[1]=y+E*m,t[5]=_-w*m,t[9]=-d*h,t[2]=w-_*m,t[6]=E+y*m,t[10]=u*h}else if(e.order==="YXZ"){const _=h*v,y=h*x,E=m*v,w=m*x;t[0]=_+w*d,t[4]=E*d-y,t[8]=u*m,t[1]=u*x,t[5]=u*v,t[9]=-d,t[2]=y*d-E,t[6]=w+_*d,t[10]=u*h}else if(e.order==="ZXY"){const _=h*v,y=h*x,E=m*v,w=m*x;t[0]=_-w*d,t[4]=-u*x,t[8]=E+y*d,t[1]=y+E*d,t[5]=u*v,t[9]=w-_*d,t[2]=-u*m,t[6]=d,t[10]=u*h}else if(e.order==="ZYX"){const _=u*v,y=u*x,E=d*v,w=d*x;t[0]=h*v,t[4]=E*m-y,t[8]=_*m+w,t[1]=h*x,t[5]=w*m+_,t[9]=y*m-E,t[2]=-m,t[6]=d*h,t[10]=u*h}else if(e.order==="YZX"){const _=u*h,y=u*m,E=d*h,w=d*m;t[0]=h*v,t[4]=w-_*x,t[8]=E*x+y,t[1]=x,t[5]=u*v,t[9]=-d*v,t[2]=-m*v,t[6]=y*x+E,t[10]=_-w*x}else if(e.order==="XZY"){const _=u*h,y=u*m,E=d*h,w=d*m;t[0]=h*v,t[4]=-x,t[8]=m*v,t[1]=_*x+w,t[5]=u*v,t[9]=y*x-E,t[2]=E*x-y,t[6]=d*v,t[10]=w*x+_}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gx,e,vx)}lookAt(e,t,r){const a=this.elements;return $n.subVectors(e,t),$n.lengthSq()===0&&($n.z=1),$n.normalize(),Cr.crossVectors(r,$n),Cr.lengthSq()===0&&(Math.abs(r.z)===1?$n.x+=1e-4:$n.z+=1e-4,$n.normalize(),Cr.crossVectors(r,$n)),Cr.normalize(),Tl.crossVectors($n,Cr),a[0]=Cr.x,a[4]=Tl.x,a[8]=$n.x,a[1]=Cr.y,a[5]=Tl.y,a[9]=$n.y,a[2]=Cr.z,a[6]=Tl.z,a[10]=$n.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,u=r[0],d=r[4],h=r[8],m=r[12],v=r[1],x=r[5],_=r[9],y=r[13],E=r[2],w=r[6],S=r[10],p=r[14],b=r[3],L=r[7],A=r[11],k=r[15],N=a[0],U=a[4],z=a[8],D=a[12],C=a[1],B=a[5],ee=a[9],Z=a[13],le=a[2],de=a[6],ae=a[10],ue=a[14],V=a[3],ce=a[7],oe=a[11],O=a[15];return l[0]=u*N+d*C+h*le+m*V,l[4]=u*U+d*B+h*de+m*ce,l[8]=u*z+d*ee+h*ae+m*oe,l[12]=u*D+d*Z+h*ue+m*O,l[1]=v*N+x*C+_*le+y*V,l[5]=v*U+x*B+_*de+y*ce,l[9]=v*z+x*ee+_*ae+y*oe,l[13]=v*D+x*Z+_*ue+y*O,l[2]=E*N+w*C+S*le+p*V,l[6]=E*U+w*B+S*de+p*ce,l[10]=E*z+w*ee+S*ae+p*oe,l[14]=E*D+w*Z+S*ue+p*O,l[3]=b*N+L*C+A*le+k*V,l[7]=b*U+L*B+A*de+k*ce,l[11]=b*z+L*ee+A*ae+k*oe,l[15]=b*D+L*Z+A*ue+k*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[4],a=e[8],l=e[12],u=e[1],d=e[5],h=e[9],m=e[13],v=e[2],x=e[6],_=e[10],y=e[14],E=e[3],w=e[7],S=e[11],p=e[15];return E*(+l*h*x-a*m*x-l*d*_+r*m*_+a*d*y-r*h*y)+w*(+t*h*y-t*m*_+l*u*_-a*u*y+a*m*v-l*h*v)+S*(+t*m*x-t*d*y-l*u*x+r*u*y+l*d*v-r*m*v)+p*(-a*d*v-t*h*x+t*d*_+a*u*x-r*u*_+r*h*v)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=r),this}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],u=e[4],d=e[5],h=e[6],m=e[7],v=e[8],x=e[9],_=e[10],y=e[11],E=e[12],w=e[13],S=e[14],p=e[15],b=x*S*m-w*_*m+w*h*y-d*S*y-x*h*p+d*_*p,L=E*_*m-v*S*m-E*h*y+u*S*y+v*h*p-u*_*p,A=v*w*m-E*x*m+E*d*y-u*w*y-v*d*p+u*x*p,k=E*x*h-v*w*h-E*d*_+u*w*_+v*d*S-u*x*S,N=t*b+r*L+a*A+l*k;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/N;return e[0]=b*U,e[1]=(w*_*l-x*S*l-w*a*y+r*S*y+x*a*p-r*_*p)*U,e[2]=(d*S*l-w*h*l+w*a*m-r*S*m-d*a*p+r*h*p)*U,e[3]=(x*h*l-d*_*l-x*a*m+r*_*m+d*a*y-r*h*y)*U,e[4]=L*U,e[5]=(v*S*l-E*_*l+E*a*y-t*S*y-v*a*p+t*_*p)*U,e[6]=(E*h*l-u*S*l-E*a*m+t*S*m+u*a*p-t*h*p)*U,e[7]=(u*_*l-v*h*l+v*a*m-t*_*m-u*a*y+t*h*y)*U,e[8]=A*U,e[9]=(E*x*l-v*w*l-E*r*y+t*w*y+v*r*p-t*x*p)*U,e[10]=(u*w*l-E*d*l+E*r*m-t*w*m-u*r*p+t*d*p)*U,e[11]=(v*d*l-u*x*l-v*r*m+t*x*m+u*r*y-t*d*y)*U,e[12]=k*U,e[13]=(v*w*a-E*x*a+E*r*_-t*w*_-v*r*S+t*x*S)*U,e[14]=(E*d*a-u*w*a-E*r*h+t*w*h+u*r*S-t*d*S)*U,e[15]=(u*x*a-v*d*a+v*r*h-t*x*h-u*r*_+t*d*_)*U,this}scale(e){const t=this.elements,r=e.x,a=e.y,l=e.z;return t[0]*=r,t[4]*=a,t[8]*=l,t[1]*=r,t[5]*=a,t[9]*=l,t[2]*=r,t[6]*=a,t[10]*=l,t[3]*=r,t[7]*=a,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,a))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const r=Math.cos(t),a=Math.sin(t),l=1-r,u=e.x,d=e.y,h=e.z,m=l*u,v=l*d;return this.set(m*u+r,m*d-a*h,m*h+a*d,0,m*d+a*h,v*d+r,v*h-a*u,0,m*h-a*d,v*h+a*u,l*h*h+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,a,l,u){return this.set(1,r,l,0,e,1,u,0,t,a,1,0,0,0,0,1),this}compose(e,t,r){const a=this.elements,l=t._x,u=t._y,d=t._z,h=t._w,m=l+l,v=u+u,x=d+d,_=l*m,y=l*v,E=l*x,w=u*v,S=u*x,p=d*x,b=h*m,L=h*v,A=h*x,k=r.x,N=r.y,U=r.z;return a[0]=(1-(w+p))*k,a[1]=(y+A)*k,a[2]=(E-L)*k,a[3]=0,a[4]=(y-A)*N,a[5]=(1-(_+p))*N,a[6]=(S+b)*N,a[7]=0,a[8]=(E+L)*U,a[9]=(S-b)*U,a[10]=(1-(_+w))*U,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,r){const a=this.elements;let l=Hs.set(a[0],a[1],a[2]).length();const u=Hs.set(a[4],a[5],a[6]).length(),d=Hs.set(a[8],a[9],a[10]).length();this.determinant()<0&&(l=-l),e.x=a[12],e.y=a[13],e.z=a[14],mi.copy(this);const m=1/l,v=1/u,x=1/d;return mi.elements[0]*=m,mi.elements[1]*=m,mi.elements[2]*=m,mi.elements[4]*=v,mi.elements[5]*=v,mi.elements[6]*=v,mi.elements[8]*=x,mi.elements[9]*=x,mi.elements[10]*=x,t.setFromRotationMatrix(mi),r.x=l,r.y=u,r.z=d,this}makePerspective(e,t,r,a,l,u,d=tr){const h=this.elements,m=2*l/(t-e),v=2*l/(r-a),x=(t+e)/(t-e),_=(r+a)/(r-a);let y,E;if(d===tr)y=-(u+l)/(u-l),E=-2*u*l/(u-l);else if(d===Kl)y=-u/(u-l),E=-u*l/(u-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return h[0]=m,h[4]=0,h[8]=x,h[12]=0,h[1]=0,h[5]=v,h[9]=_,h[13]=0,h[2]=0,h[6]=0,h[10]=y,h[14]=E,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,r,a,l,u,d=tr){const h=this.elements,m=1/(t-e),v=1/(r-a),x=1/(u-l),_=(t+e)*m,y=(r+a)*v;let E,w;if(d===tr)E=(u+l)*x,w=-2*x;else if(d===Kl)E=l*x,w=-1*x;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return h[0]=2*m,h[4]=0,h[8]=0,h[12]=-_,h[1]=0,h[5]=2*v,h[9]=0,h[13]=-y,h[2]=0,h[6]=0,h[10]=w,h[14]=-E,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<16;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}}const Hs=new G,mi=new zt,gx=new G(0,0,0),vx=new G(1,1,1),Cr=new G,Tl=new G,$n=new G,Im=new zt,Um=new da;class Ni{constructor(e=0,t=0,r=0,a=Ni.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,a=this._order){return this._x=e,this._y=t,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){const a=e.elements,l=a[0],u=a[4],d=a[8],h=a[1],m=a[5],v=a[9],x=a[2],_=a[6],y=a[10];switch(t){case"XYZ":this._y=Math.asin(pn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-v,y),this._z=Math.atan2(-u,l)):(this._x=Math.atan2(_,m),this._z=0);break;case"YXZ":this._x=Math.asin(-pn(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(d,y),this._z=Math.atan2(h,m)):(this._y=Math.atan2(-x,l),this._z=0);break;case"ZXY":this._x=Math.asin(pn(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(-x,y),this._z=Math.atan2(-u,m)):(this._y=0,this._z=Math.atan2(h,l));break;case"ZYX":this._y=Math.asin(-pn(x,-1,1)),Math.abs(x)<.9999999?(this._x=Math.atan2(_,y),this._z=Math.atan2(h,l)):(this._x=0,this._z=Math.atan2(-u,m));break;case"YZX":this._z=Math.asin(pn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-v,m),this._y=Math.atan2(-x,l)):(this._x=0,this._y=Math.atan2(d,y));break;case"XZY":this._z=Math.asin(-pn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(_,m),this._y=Math.atan2(d,l)):(this._x=Math.atan2(-v,y),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return Im.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Im,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Um.setFromEuler(this),this.setFromQuaternion(Um,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ni.DEFAULT_ORDER="XYZ";class bf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _x=0;const Fm=new G,Vs=new da,Yi=new zt,Al=new G,Qo=new G,xx=new G,yx=new da,Om=new G(1,0,0),zm=new G(0,1,0),km=new G(0,0,1),Bm={type:"added"},Sx={type:"removed"},Gs={type:"childadded",child:null},Ju={type:"childremoved",child:null};class un extends fo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_x++}),this.uuid=ho(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=un.DEFAULT_UP.clone();const e=new G,t=new Ni,r=new da,a=new G(1,1,1);function l(){r.setFromEuler(t,!1)}function u(){t.setFromQuaternion(r,void 0,!1)}t._onChange(l),r._onChange(u),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new zt},normalMatrix:{value:new lt}}),this.matrix=new zt,this.matrixWorld=new zt,this.matrixAutoUpdate=un.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vs.setFromAxisAngle(e,t),this.quaternion.multiply(Vs),this}rotateOnWorldAxis(e,t){return Vs.setFromAxisAngle(e,t),this.quaternion.premultiply(Vs),this}rotateX(e){return this.rotateOnAxis(Om,e)}rotateY(e){return this.rotateOnAxis(zm,e)}rotateZ(e){return this.rotateOnAxis(km,e)}translateOnAxis(e,t){return Fm.copy(e).applyQuaternion(this.quaternion),this.position.add(Fm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Om,e)}translateY(e){return this.translateOnAxis(zm,e)}translateZ(e){return this.translateOnAxis(km,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Yi.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?Al.copy(e):Al.set(e,t,r);const a=this.parent;this.updateWorldMatrix(!0,!1),Qo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yi.lookAt(Qo,Al,this.up):Yi.lookAt(Al,Qo,this.up),this.quaternion.setFromRotationMatrix(Yi),a&&(Yi.extractRotation(a.matrixWorld),Vs.setFromRotationMatrix(Yi),this.quaternion.premultiply(Vs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Bm),Gs.child=e,this.dispatchEvent(Gs),Gs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Sx),Ju.child=e,this.dispatchEvent(Ju),Ju.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Bm),Gs.child=e,this.dispatchEvent(Gs),Gs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,a=this.children.length;r<a;r++){const u=this.children[r].getObjectByProperty(e,t);if(u!==void 0)return u}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);const a=this.children;for(let l=0,u=a.length;l<u;l++)a[l].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qo,e,xx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qo,yx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const a=this.children;for(let l=0,u=a.length;l<u;l++)a[l].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function l(d,h){return d[h.uuid]===void 0&&(d[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=l(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const h=d.shapes;if(Array.isArray(h))for(let m=0,v=h.length;m<v;m++){const x=h[m];l(e.shapes,x)}else l(e.shapes,h)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let h=0,m=this.material.length;h<m;h++)d.push(l(e.materials,this.material[h]));a.material=d}else a.material=l(e.materials,this.material);if(this.children.length>0){a.children=[];for(let d=0;d<this.children.length;d++)a.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let d=0;d<this.animations.length;d++){const h=this.animations[d];a.animations.push(l(e.animations,h))}}if(t){const d=u(e.geometries),h=u(e.materials),m=u(e.textures),v=u(e.images),x=u(e.shapes),_=u(e.skeletons),y=u(e.animations),E=u(e.nodes);d.length>0&&(r.geometries=d),h.length>0&&(r.materials=h),m.length>0&&(r.textures=m),v.length>0&&(r.images=v),x.length>0&&(r.shapes=x),_.length>0&&(r.skeletons=_),y.length>0&&(r.animations=y),E.length>0&&(r.nodes=E)}return r.object=a,r;function u(d){const h=[];for(const m in d){const v=d[m];delete v.metadata,h.push(v)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){const a=e.children[r];this.add(a.clone())}return this}}un.DEFAULT_UP=new G(0,1,0);un.DEFAULT_MATRIX_AUTO_UPDATE=!0;un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const gi=new G,qi=new G,ed=new G,$i=new G,Ws=new G,js=new G,Hm=new G,td=new G,nd=new G,id=new G,rd=new Nt,sd=new Nt,od=new Nt;class _i{constructor(e=new G,t=new G,r=new G){this.a=e,this.b=t,this.c=r}static getNormal(e,t,r,a){a.subVectors(r,t),gi.subVectors(e,t),a.cross(gi);const l=a.lengthSq();return l>0?a.multiplyScalar(1/Math.sqrt(l)):a.set(0,0,0)}static getBarycoord(e,t,r,a,l){gi.subVectors(a,t),qi.subVectors(r,t),ed.subVectors(e,t);const u=gi.dot(gi),d=gi.dot(qi),h=gi.dot(ed),m=qi.dot(qi),v=qi.dot(ed),x=u*m-d*d;if(x===0)return l.set(0,0,0),null;const _=1/x,y=(m*h-d*v)*_,E=(u*v-d*h)*_;return l.set(1-y-E,E,y)}static containsPoint(e,t,r,a){return this.getBarycoord(e,t,r,a,$i)===null?!1:$i.x>=0&&$i.y>=0&&$i.x+$i.y<=1}static getInterpolation(e,t,r,a,l,u,d,h){return this.getBarycoord(e,t,r,a,$i)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(l,$i.x),h.addScaledVector(u,$i.y),h.addScaledVector(d,$i.z),h)}static getInterpolatedAttribute(e,t,r,a,l,u){return rd.setScalar(0),sd.setScalar(0),od.setScalar(0),rd.fromBufferAttribute(e,t),sd.fromBufferAttribute(e,r),od.fromBufferAttribute(e,a),u.setScalar(0),u.addScaledVector(rd,l.x),u.addScaledVector(sd,l.y),u.addScaledVector(od,l.z),u}static isFrontFacing(e,t,r,a){return gi.subVectors(r,t),qi.subVectors(e,t),gi.cross(qi).dot(a)<0}set(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this}setFromPointsAndIndices(e,t,r,a){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,r,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gi.subVectors(this.c,this.b),qi.subVectors(this.a,this.b),gi.cross(qi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return _i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return _i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,r,a,l){return _i.getInterpolation(e,this.a,this.b,this.c,t,r,a,l)}containsPoint(e){return _i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return _i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const r=this.a,a=this.b,l=this.c;let u,d;Ws.subVectors(a,r),js.subVectors(l,r),td.subVectors(e,r);const h=Ws.dot(td),m=js.dot(td);if(h<=0&&m<=0)return t.copy(r);nd.subVectors(e,a);const v=Ws.dot(nd),x=js.dot(nd);if(v>=0&&x<=v)return t.copy(a);const _=h*x-v*m;if(_<=0&&h>=0&&v<=0)return u=h/(h-v),t.copy(r).addScaledVector(Ws,u);id.subVectors(e,l);const y=Ws.dot(id),E=js.dot(id);if(E>=0&&y<=E)return t.copy(l);const w=y*m-h*E;if(w<=0&&m>=0&&E<=0)return d=m/(m-E),t.copy(r).addScaledVector(js,d);const S=v*E-y*x;if(S<=0&&x-v>=0&&y-E>=0)return Hm.subVectors(l,a),d=(x-v)/(x-v+(y-E)),t.copy(a).addScaledVector(Hm,d);const p=1/(S+w+_);return u=w*p,d=_*p,t.copy(r).addScaledVector(Ws,u).addScaledVector(js,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Zg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},br={h:0,s:0,l:0},Rl={h:0,s:0,l:0};function ad(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class xt{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Dn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Mt.toWorkingColorSpace(this,t),this}setRGB(e,t,r,a=Mt.workingColorSpace){return this.r=e,this.g=t,this.b=r,Mt.toWorkingColorSpace(this,a),this}setHSL(e,t,r,a=Mt.workingColorSpace){if(e=Rf(e,1),t=pn(t,0,1),r=pn(r,0,1),t===0)this.r=this.g=this.b=r;else{const l=r<=.5?r*(1+t):r+t-r*t,u=2*r-l;this.r=ad(u,l,e+1/3),this.g=ad(u,l,e),this.b=ad(u,l,e-1/3)}return Mt.toWorkingColorSpace(this,a),this}setStyle(e,t=Dn){function r(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const u=a[1],d=a[2];switch(u){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=a[1],u=l.length;if(u===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(u===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Dn){const r=Zg[e.toLowerCase()];return r!==void 0?this.setHex(r,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=nr(e.r),this.g=nr(e.g),this.b=nr(e.b),this}copyLinearToSRGB(e){return this.r=to(e.r),this.g=to(e.g),this.b=to(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Dn){return Mt.fromWorkingColorSpace(Mn.copy(this),e),Math.round(pn(Mn.r*255,0,255))*65536+Math.round(pn(Mn.g*255,0,255))*256+Math.round(pn(Mn.b*255,0,255))}getHexString(e=Dn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Mt.workingColorSpace){Mt.fromWorkingColorSpace(Mn.copy(this),t);const r=Mn.r,a=Mn.g,l=Mn.b,u=Math.max(r,a,l),d=Math.min(r,a,l);let h,m;const v=(d+u)/2;if(d===u)h=0,m=0;else{const x=u-d;switch(m=v<=.5?x/(u+d):x/(2-u-d),u){case r:h=(a-l)/x+(a<l?6:0);break;case a:h=(l-r)/x+2;break;case l:h=(r-a)/x+4;break}h/=6}return e.h=h,e.s=m,e.l=v,e}getRGB(e,t=Mt.workingColorSpace){return Mt.fromWorkingColorSpace(Mn.copy(this),t),e.r=Mn.r,e.g=Mn.g,e.b=Mn.b,e}getStyle(e=Dn){Mt.fromWorkingColorSpace(Mn.copy(this),e);const t=Mn.r,r=Mn.g,a=Mn.b;return e!==Dn?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(a*255)})`}offsetHSL(e,t,r){return this.getHSL(br),this.setHSL(br.h+e,br.s+t,br.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(br),e.getHSL(Rl);const r=oa(br.h,Rl.h,t),a=oa(br.s,Rl.s,t),l=oa(br.l,Rl.l,t);return this.setHSL(r,a,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,r=this.g,a=this.b,l=e.elements;return this.r=l[0]*t+l[3]*r+l[6]*a,this.g=l[1]*t+l[4]*r+l[7]*a,this.b=l[2]*t+l[5]*r+l[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Mn=new xt;xt.NAMES=Zg;let Mx=0;class po extends fo{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mx++}),this.uuid=ho(),this.name="",this.blending=Js,this.side=Ur,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=bd,this.blendDst=Pd,this.blendEquation=ss,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new xt(0,0,0),this.blendAlpha=0,this.depthFunc=io,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fs,this.stencilZFail=Fs,this.stencilZPass=Fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const r=e[t];if(r===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(r):a&&a.isVector3&&r&&r.isVector3?a.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Js&&(r.blending=this.blending),this.side!==Ur&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==bd&&(r.blendSrc=this.blendSrc),this.blendDst!==Pd&&(r.blendDst=this.blendDst),this.blendEquation!==ss&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==io&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mm&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Fs&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Fs&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Fs&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function a(l){const u=[];for(const d in l){const h=l[d];delete h.metadata,u.push(h)}return u}if(t){const l=a(e.textures),u=a(e.images);l.length>0&&(r.textures=l),u.length>0&&(r.images=u)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let r=null;if(t!==null){const a=t.length;r=new Array(a);for(let l=0;l!==a;++l)r[l]=t[l].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class no extends po{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.combine=Ng,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Kt=new G,Cl=new mt;class Mi{constructor(e,t,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=Em,this.updateRanges=[],this.gpuType=er,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let a=0,l=this.itemSize;a<l;a++)this.array[e+a]=t.array[r+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)Cl.fromBufferAttribute(this,t),Cl.applyMatrix3(e),this.setXY(t,Cl.x,Cl.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)Kt.fromBufferAttribute(this,t),Kt.applyMatrix3(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)Kt.fromBufferAttribute(this,t),Kt.applyMatrix4(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)Kt.fromBufferAttribute(this,t),Kt.applyNormalMatrix(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)Kt.fromBufferAttribute(this,t),Kt.transformDirection(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=Ks(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=Pn(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ks(t,this.array)),t}setX(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ks(t,this.array)),t}setY(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ks(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ks(t,this.array)),t}setW(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),r=Pn(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,a){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),r=Pn(r,this.array),a=Pn(a,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this}setXYZW(e,t,r,a,l){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),r=Pn(r,this.array),a=Pn(a,this.array),l=Pn(l,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Em&&(e.usage=this.usage),e}}class Qg extends Mi{constructor(e,t,r){super(new Uint16Array(e),t,r)}}class Jg extends Mi{constructor(e,t,r){super(new Uint32Array(e),t,r)}}class Qt extends Mi{constructor(e,t,r){super(new Float32Array(e),t,r)}}let Ex=0;const si=new zt,ld=new un,Xs=new G,Kn=new fa,Jo=new fa,cn=new G;class Nn extends fo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ex++}),this.uuid=ho(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(qg(e)?Jg:Qg)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const l=new lt().getNormalMatrix(e);r.applyNormalMatrix(l),r.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return si.makeRotationFromQuaternion(e),this.applyMatrix4(si),this}rotateX(e){return si.makeRotationX(e),this.applyMatrix4(si),this}rotateY(e){return si.makeRotationY(e),this.applyMatrix4(si),this}rotateZ(e){return si.makeRotationZ(e),this.applyMatrix4(si),this}translate(e,t,r){return si.makeTranslation(e,t,r),this.applyMatrix4(si),this}scale(e,t,r){return si.makeScale(e,t,r),this.applyMatrix4(si),this}lookAt(e){return ld.lookAt(e),ld.updateMatrix(),this.applyMatrix4(ld.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xs).negate(),this.translate(Xs.x,Xs.y,Xs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const r=[];for(let a=0,l=e.length;a<l;a++){const u=e[a];r.push(u.x,u.y,u.z||0)}this.setAttribute("position",new Qt(r,3))}else{for(let r=0,a=t.count;r<a;r++){const l=e[r];t.setXYZ(r,l.x,l.y,l.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const l=t[r];Kn.setFromBufferAttribute(l),this.morphTargetsRelative?(cn.addVectors(this.boundingBox.min,Kn.min),this.boundingBox.expandByPoint(cn),cn.addVectors(this.boundingBox.max,Kn.max),this.boundingBox.expandByPoint(cn)):(this.boundingBox.expandByPoint(Kn.min),this.boundingBox.expandByPoint(Kn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ic);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(e){const r=this.boundingSphere.center;if(Kn.setFromBufferAttribute(e),t)for(let l=0,u=t.length;l<u;l++){const d=t[l];Jo.setFromBufferAttribute(d),this.morphTargetsRelative?(cn.addVectors(Kn.min,Jo.min),Kn.expandByPoint(cn),cn.addVectors(Kn.max,Jo.max),Kn.expandByPoint(cn)):(Kn.expandByPoint(Jo.min),Kn.expandByPoint(Jo.max))}Kn.getCenter(r);let a=0;for(let l=0,u=e.count;l<u;l++)cn.fromBufferAttribute(e,l),a=Math.max(a,r.distanceToSquared(cn));if(t)for(let l=0,u=t.length;l<u;l++){const d=t[l],h=this.morphTargetsRelative;for(let m=0,v=d.count;m<v;m++)cn.fromBufferAttribute(d,m),h&&(Xs.fromBufferAttribute(e,m),cn.add(Xs)),a=Math.max(a,r.distanceToSquared(cn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=t.position,a=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mi(new Float32Array(4*r.count),4));const u=this.getAttribute("tangent"),d=[],h=[];for(let z=0;z<r.count;z++)d[z]=new G,h[z]=new G;const m=new G,v=new G,x=new G,_=new mt,y=new mt,E=new mt,w=new G,S=new G;function p(z,D,C){m.fromBufferAttribute(r,z),v.fromBufferAttribute(r,D),x.fromBufferAttribute(r,C),_.fromBufferAttribute(l,z),y.fromBufferAttribute(l,D),E.fromBufferAttribute(l,C),v.sub(m),x.sub(m),y.sub(_),E.sub(_);const B=1/(y.x*E.y-E.x*y.y);isFinite(B)&&(w.copy(v).multiplyScalar(E.y).addScaledVector(x,-y.y).multiplyScalar(B),S.copy(x).multiplyScalar(y.x).addScaledVector(v,-E.x).multiplyScalar(B),d[z].add(w),d[D].add(w),d[C].add(w),h[z].add(S),h[D].add(S),h[C].add(S))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let z=0,D=b.length;z<D;++z){const C=b[z],B=C.start,ee=C.count;for(let Z=B,le=B+ee;Z<le;Z+=3)p(e.getX(Z+0),e.getX(Z+1),e.getX(Z+2))}const L=new G,A=new G,k=new G,N=new G;function U(z){k.fromBufferAttribute(a,z),N.copy(k);const D=d[z];L.copy(D),L.sub(k.multiplyScalar(k.dot(D))).normalize(),A.crossVectors(N,D);const B=A.dot(h[z])<0?-1:1;u.setXYZW(z,L.x,L.y,L.z,B)}for(let z=0,D=b.length;z<D;++z){const C=b[z],B=C.start,ee=C.count;for(let Z=B,le=B+ee;Z<le;Z+=3)U(e.getX(Z+0)),U(e.getX(Z+1)),U(e.getX(Z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new Mi(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let _=0,y=r.count;_<y;_++)r.setXYZ(_,0,0,0);const a=new G,l=new G,u=new G,d=new G,h=new G,m=new G,v=new G,x=new G;if(e)for(let _=0,y=e.count;_<y;_+=3){const E=e.getX(_+0),w=e.getX(_+1),S=e.getX(_+2);a.fromBufferAttribute(t,E),l.fromBufferAttribute(t,w),u.fromBufferAttribute(t,S),v.subVectors(u,l),x.subVectors(a,l),v.cross(x),d.fromBufferAttribute(r,E),h.fromBufferAttribute(r,w),m.fromBufferAttribute(r,S),d.add(v),h.add(v),m.add(v),r.setXYZ(E,d.x,d.y,d.z),r.setXYZ(w,h.x,h.y,h.z),r.setXYZ(S,m.x,m.y,m.z)}else for(let _=0,y=t.count;_<y;_+=3)a.fromBufferAttribute(t,_+0),l.fromBufferAttribute(t,_+1),u.fromBufferAttribute(t,_+2),v.subVectors(u,l),x.subVectors(a,l),v.cross(x),r.setXYZ(_+0,v.x,v.y,v.z),r.setXYZ(_+1,v.x,v.y,v.z),r.setXYZ(_+2,v.x,v.y,v.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)cn.fromBufferAttribute(e,t),cn.normalize(),e.setXYZ(t,cn.x,cn.y,cn.z)}toNonIndexed(){function e(d,h){const m=d.array,v=d.itemSize,x=d.normalized,_=new m.constructor(h.length*v);let y=0,E=0;for(let w=0,S=h.length;w<S;w++){d.isInterleavedBufferAttribute?y=h[w]*d.data.stride+d.offset:y=h[w]*v;for(let p=0;p<v;p++)_[E++]=m[y++]}return new Mi(_,v,x)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Nn,r=this.index.array,a=this.attributes;for(const d in a){const h=a[d],m=e(h,r);t.setAttribute(d,m)}const l=this.morphAttributes;for(const d in l){const h=[],m=l[d];for(let v=0,x=m.length;v<x;v++){const _=m[v],y=e(_,r);h.push(y)}t.morphAttributes[d]=h}t.morphTargetsRelative=this.morphTargetsRelative;const u=this.groups;for(let d=0,h=u.length;d<h;d++){const m=u[d];t.addGroup(m.start,m.count,m.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const h=this.parameters;for(const m in h)h[m]!==void 0&&(e[m]=h[m]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const r=this.attributes;for(const h in r){const m=r[h];e.data.attributes[h]=m.toJSON(e.data)}const a={};let l=!1;for(const h in this.morphAttributes){const m=this.morphAttributes[h],v=[];for(let x=0,_=m.length;x<_;x++){const y=m[x];v.push(y.toJSON(e.data))}v.length>0&&(a[h]=v,l=!0)}l&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const u=this.groups;u.length>0&&(e.data.groups=JSON.parse(JSON.stringify(u)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(t));const a=e.attributes;for(const m in a){const v=a[m];this.setAttribute(m,v.clone(t))}const l=e.morphAttributes;for(const m in l){const v=[],x=l[m];for(let _=0,y=x.length;_<y;_++)v.push(x[_].clone(t));this.morphAttributes[m]=v}this.morphTargetsRelative=e.morphTargetsRelative;const u=e.groups;for(let m=0,v=u.length;m<v;m++){const x=u[m];this.addGroup(x.start,x.count,x.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Vm=new zt,Jr=new Cf,bl=new ic,Gm=new G,Pl=new G,Ll=new G,Dl=new G,cd=new G,Nl=new G,Wm=new G,Il=new G;class Ot extends un{constructor(e=new Nn,t=new no){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=a.length;l<u;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}getVertexPosition(e,t){const r=this.geometry,a=r.attributes.position,l=r.morphAttributes.position,u=r.morphTargetsRelative;t.fromBufferAttribute(a,e);const d=this.morphTargetInfluences;if(l&&d){Nl.set(0,0,0);for(let h=0,m=l.length;h<m;h++){const v=d[h],x=l[h];v!==0&&(cd.fromBufferAttribute(x,e),u?Nl.addScaledVector(cd,v):Nl.addScaledVector(cd.sub(t),v))}t.add(Nl)}return t}raycast(e,t){const r=this.geometry,a=this.material,l=this.matrixWorld;a!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),bl.copy(r.boundingSphere),bl.applyMatrix4(l),Jr.copy(e.ray).recast(e.near),!(bl.containsPoint(Jr.origin)===!1&&(Jr.intersectSphere(bl,Gm)===null||Jr.origin.distanceToSquared(Gm)>(e.far-e.near)**2))&&(Vm.copy(l).invert(),Jr.copy(e.ray).applyMatrix4(Vm),!(r.boundingBox!==null&&Jr.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,Jr)))}_computeIntersections(e,t,r){let a;const l=this.geometry,u=this.material,d=l.index,h=l.attributes.position,m=l.attributes.uv,v=l.attributes.uv1,x=l.attributes.normal,_=l.groups,y=l.drawRange;if(d!==null)if(Array.isArray(u))for(let E=0,w=_.length;E<w;E++){const S=_[E],p=u[S.materialIndex],b=Math.max(S.start,y.start),L=Math.min(d.count,Math.min(S.start+S.count,y.start+y.count));for(let A=b,k=L;A<k;A+=3){const N=d.getX(A),U=d.getX(A+1),z=d.getX(A+2);a=Ul(this,p,e,r,m,v,x,N,U,z),a&&(a.faceIndex=Math.floor(A/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const E=Math.max(0,y.start),w=Math.min(d.count,y.start+y.count);for(let S=E,p=w;S<p;S+=3){const b=d.getX(S),L=d.getX(S+1),A=d.getX(S+2);a=Ul(this,u,e,r,m,v,x,b,L,A),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}else if(h!==void 0)if(Array.isArray(u))for(let E=0,w=_.length;E<w;E++){const S=_[E],p=u[S.materialIndex],b=Math.max(S.start,y.start),L=Math.min(h.count,Math.min(S.start+S.count,y.start+y.count));for(let A=b,k=L;A<k;A+=3){const N=A,U=A+1,z=A+2;a=Ul(this,p,e,r,m,v,x,N,U,z),a&&(a.faceIndex=Math.floor(A/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const E=Math.max(0,y.start),w=Math.min(h.count,y.start+y.count);for(let S=E,p=w;S<p;S+=3){const b=S,L=S+1,A=S+2;a=Ul(this,u,e,r,m,v,x,b,L,A),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}}}function wx(s,e,t,r,a,l,u,d){let h;if(e.side===Wn?h=r.intersectTriangle(u,l,a,!0,d):h=r.intersectTriangle(a,l,u,e.side===Ur,d),h===null)return null;Il.copy(d),Il.applyMatrix4(s.matrixWorld);const m=t.ray.origin.distanceTo(Il);return m<t.near||m>t.far?null:{distance:m,point:Il.clone(),object:s}}function Ul(s,e,t,r,a,l,u,d,h,m){s.getVertexPosition(d,Pl),s.getVertexPosition(h,Ll),s.getVertexPosition(m,Dl);const v=wx(s,e,t,r,Pl,Ll,Dl,Wm);if(v){const x=new G;_i.getBarycoord(Wm,Pl,Ll,Dl,x),a&&(v.uv=_i.getInterpolatedAttribute(a,d,h,m,x,new mt)),l&&(v.uv1=_i.getInterpolatedAttribute(l,d,h,m,x,new mt)),u&&(v.normal=_i.getInterpolatedAttribute(u,d,h,m,x,new G),v.normal.dot(r.direction)>0&&v.normal.multiplyScalar(-1));const _={a:d,b:h,c:m,normal:new G,materialIndex:0};_i.getNormal(Pl,Ll,Dl,_.normal),v.face=_,v.barycoord=x}return v}class mo extends Nn{constructor(e=1,t=1,r=1,a=1,l=1,u=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:a,heightSegments:l,depthSegments:u};const d=this;a=Math.floor(a),l=Math.floor(l),u=Math.floor(u);const h=[],m=[],v=[],x=[];let _=0,y=0;E("z","y","x",-1,-1,r,t,e,u,l,0),E("z","y","x",1,-1,r,t,-e,u,l,1),E("x","z","y",1,1,e,r,t,a,u,2),E("x","z","y",1,-1,e,r,-t,a,u,3),E("x","y","z",1,-1,e,t,r,a,l,4),E("x","y","z",-1,-1,e,t,-r,a,l,5),this.setIndex(h),this.setAttribute("position",new Qt(m,3)),this.setAttribute("normal",new Qt(v,3)),this.setAttribute("uv",new Qt(x,2));function E(w,S,p,b,L,A,k,N,U,z,D){const C=A/U,B=k/z,ee=A/2,Z=k/2,le=N/2,de=U+1,ae=z+1;let ue=0,V=0;const ce=new G;for(let oe=0;oe<ae;oe++){const O=oe*B-Z;for(let re=0;re<de;re++){const Ne=re*C-ee;ce[w]=Ne*b,ce[S]=O*L,ce[p]=le,m.push(ce.x,ce.y,ce.z),ce[w]=0,ce[S]=0,ce[p]=N>0?1:-1,v.push(ce.x,ce.y,ce.z),x.push(re/U),x.push(1-oe/z),ue+=1}}for(let oe=0;oe<z;oe++)for(let O=0;O<U;O++){const re=_+O+de*oe,Ne=_+O+de*(oe+1),J=_+(O+1)+de*(oe+1),fe=_+(O+1)+de*oe;h.push(re,Ne,fe),h.push(Ne,J,fe),V+=6}d.addGroup(y,V,D),y+=V,_+=ue}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function lo(s){const e={};for(const t in s){e[t]={};for(const r in s[t]){const a=s[t][r];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=a.clone():Array.isArray(a)?e[t][r]=a.slice():e[t][r]=a}}return e}function Ln(s){const e={};for(let t=0;t<s.length;t++){const r=lo(s[t]);for(const a in r)e[a]=r[a]}return e}function Tx(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function e0(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Mt.workingColorSpace}const Ax={clone:lo,merge:Ln};var Rx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fr extends po{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rx,this.fragmentShader=Cx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=lo(e.uniforms),this.uniformsGroups=Tx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const u=this.uniforms[a].value;u&&u.isTexture?t.uniforms[a]={type:"t",value:u.toJSON(e).uuid}:u&&u.isColor?t.uniforms[a]={type:"c",value:u.getHex()}:u&&u.isVector2?t.uniforms[a]={type:"v2",value:u.toArray()}:u&&u.isVector3?t.uniforms[a]={type:"v3",value:u.toArray()}:u&&u.isVector4?t.uniforms[a]={type:"v4",value:u.toArray()}:u&&u.isMatrix3?t.uniforms[a]={type:"m3",value:u.toArray()}:u&&u.isMatrix4?t.uniforms[a]={type:"m4",value:u.toArray()}:t.uniforms[a]={value:u}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const r={};for(const a in this.extensions)this.extensions[a]===!0&&(r[a]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}}class t0 extends un{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new zt,this.projectionMatrix=new zt,this.projectionMatrixInverse=new zt,this.coordinateSystem=tr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Pr=new G,jm=new mt,Xm=new mt;class Vn extends t0{constructor(e=50,t=1,r=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=la*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(sa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return la*2*Math.atan(Math.tan(sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){Pr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pr.x,Pr.y).multiplyScalar(-e/Pr.z),Pr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(Pr.x,Pr.y).multiplyScalar(-e/Pr.z)}getViewSize(e,t){return this.getViewBounds(e,jm,Xm),t.subVectors(Xm,jm)}setViewOffset(e,t,r,a,l,u){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(sa*.5*this.fov)/this.zoom,r=2*t,a=this.aspect*r,l=-.5*a;const u=this.view;if(this.view!==null&&this.view.enabled){const h=u.fullWidth,m=u.fullHeight;l+=u.offsetX*a/h,t-=u.offsetY*r/m,a*=u.width/h,r*=u.height/m}const d=this.filmOffset;d!==0&&(l+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+a,t,t-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ys=-90,qs=1;class bx extends un{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Vn(Ys,qs,e,t);a.layers=this.layers,this.add(a);const l=new Vn(Ys,qs,e,t);l.layers=this.layers,this.add(l);const u=new Vn(Ys,qs,e,t);u.layers=this.layers,this.add(u);const d=new Vn(Ys,qs,e,t);d.layers=this.layers,this.add(d);const h=new Vn(Ys,qs,e,t);h.layers=this.layers,this.add(h);const m=new Vn(Ys,qs,e,t);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[r,a,l,u,d,h]=t;for(const m of t)this.remove(m);if(e===tr)r.up.set(0,1,0),r.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),u.up.set(0,0,1),u.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===Kl)r.up.set(0,-1,0),r.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),u.up.set(0,0,-1),u.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const m of t)this.add(m),m.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,u,d,h,m,v]=this.children,x=e.getRenderTarget(),_=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const w=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,a),e.render(t,l),e.setRenderTarget(r,1,a),e.render(t,u),e.setRenderTarget(r,2,a),e.render(t,d),e.setRenderTarget(r,3,a),e.render(t,h),e.setRenderTarget(r,4,a),e.render(t,m),r.texture.generateMipmaps=w,e.setRenderTarget(r,5,a),e.render(t,v),e.setRenderTarget(x,_,y),e.xr.enabled=E,r.texture.needsPMREMUpdate=!0}}class n0 extends En{constructor(e,t,r,a,l,u,d,h,m,v){e=e!==void 0?e:[],t=t!==void 0?t:ro,super(e,t,r,a,l,u,d,h,m,v),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Px extends ds{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},a=[r,r,r,r,r,r];this.texture=new n0(a,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Di}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new mo(5,5,5),l=new Fr({name:"CubemapFromEquirect",uniforms:lo(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Wn,blending:Nr});l.uniforms.tEquirect.value=t;const u=new Ot(a,l),d=t.minFilter;return t.minFilter===ls&&(t.minFilter=Di),new bx(1,10,this).update(e,u),t.minFilter=d,u.geometry.dispose(),u.material.dispose(),this}clear(e,t,r,a){const l=e.getRenderTarget();for(let u=0;u<6;u++)e.setRenderTarget(this,u),e.clear(t,r,a);e.setRenderTarget(l)}}const ud=new G,Lx=new G,Dx=new lt;class is{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,a){return this.normal.set(e,t,r),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){const a=ud.subVectors(r,t).cross(Lx.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const r=e.delta(ud),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/a;return l<0||l>1?null:t.copy(e.start).addScaledVector(r,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const r=t||Dx.getNormalMatrix(e),a=this.coplanarPoint(ud).applyMatrix4(e),l=this.normal.applyMatrix3(r).normalize();return this.constant=-a.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const es=new ic,Fl=new G;class Pf{constructor(e=new is,t=new is,r=new is,a=new is,l=new is,u=new is){this.planes=[e,t,r,a,l,u]}set(e,t,r,a,l,u){const d=this.planes;return d[0].copy(e),d[1].copy(t),d[2].copy(r),d[3].copy(a),d[4].copy(l),d[5].copy(u),this}copy(e){const t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=tr){const r=this.planes,a=e.elements,l=a[0],u=a[1],d=a[2],h=a[3],m=a[4],v=a[5],x=a[6],_=a[7],y=a[8],E=a[9],w=a[10],S=a[11],p=a[12],b=a[13],L=a[14],A=a[15];if(r[0].setComponents(h-l,_-m,S-y,A-p).normalize(),r[1].setComponents(h+l,_+m,S+y,A+p).normalize(),r[2].setComponents(h+u,_+v,S+E,A+b).normalize(),r[3].setComponents(h-u,_-v,S-E,A-b).normalize(),r[4].setComponents(h-d,_-x,S-w,A-L).normalize(),t===tr)r[5].setComponents(h+d,_+x,S+w,A+L).normalize();else if(t===Kl)r[5].setComponents(d,x,w,L).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),es.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),es.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(es)}intersectsSprite(e){return es.center.set(0,0,0),es.radius=.7071067811865476,es.applyMatrix4(e.matrixWorld),this.intersectsSphere(es)}intersectsSphere(e){const t=this.planes,r=e.center,a=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(r)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let r=0;r<6;r++){const a=t[r];if(Fl.x=a.normal.x>0?e.max.x:e.min.x,Fl.y=a.normal.y>0?e.max.y:e.min.y,Fl.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Fl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function i0(){let s=null,e=!1,t=null,r=null;function a(l,u){t(l,u),r=s.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(r=s.requestAnimationFrame(a),e=!0)},stop:function(){s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){s=l}}}function Nx(s){const e=new WeakMap;function t(d,h){const m=d.array,v=d.usage,x=m.byteLength,_=s.createBuffer();s.bindBuffer(h,_),s.bufferData(h,m,v),d.onUploadCallback();let y;if(m instanceof Float32Array)y=s.FLOAT;else if(m instanceof Uint16Array)d.isFloat16BufferAttribute?y=s.HALF_FLOAT:y=s.UNSIGNED_SHORT;else if(m instanceof Int16Array)y=s.SHORT;else if(m instanceof Uint32Array)y=s.UNSIGNED_INT;else if(m instanceof Int32Array)y=s.INT;else if(m instanceof Int8Array)y=s.BYTE;else if(m instanceof Uint8Array)y=s.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)y=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:_,type:y,bytesPerElement:m.BYTES_PER_ELEMENT,version:d.version,size:x}}function r(d,h,m){const v=h.array,x=h.updateRanges;if(s.bindBuffer(m,d),x.length===0)s.bufferSubData(m,0,v);else{x.sort((y,E)=>y.start-E.start);let _=0;for(let y=1;y<x.length;y++){const E=x[_],w=x[y];w.start<=E.start+E.count+1?E.count=Math.max(E.count,w.start+w.count-E.start):(++_,x[_]=w)}x.length=_+1;for(let y=0,E=x.length;y<E;y++){const w=x[y];s.bufferSubData(m,w.start*v.BYTES_PER_ELEMENT,v,w.start,w.count)}h.clearUpdateRanges()}h.onUploadCallback()}function a(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function l(d){d.isInterleavedBufferAttribute&&(d=d.data);const h=e.get(d);h&&(s.deleteBuffer(h.buffer),e.delete(d))}function u(d,h){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const v=e.get(d);(!v||v.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const m=e.get(d);if(m===void 0)e.set(d,t(d,h));else if(m.version<d.version){if(m.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(m.buffer,d,h),m.version=d.version}}return{get:a,remove:l,update:u}}class go extends Nn{constructor(e=1,t=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:a};const l=e/2,u=t/2,d=Math.floor(r),h=Math.floor(a),m=d+1,v=h+1,x=e/d,_=t/h,y=[],E=[],w=[],S=[];for(let p=0;p<v;p++){const b=p*_-u;for(let L=0;L<m;L++){const A=L*x-l;E.push(A,-b,0),w.push(0,0,1),S.push(L/d),S.push(1-p/h)}}for(let p=0;p<h;p++)for(let b=0;b<d;b++){const L=b+m*p,A=b+m*(p+1),k=b+1+m*(p+1),N=b+1+m*p;y.push(L,A,N),y.push(A,k,N)}this.setIndex(y),this.setAttribute("position",new Qt(E,3)),this.setAttribute("normal",new Qt(w,3)),this.setAttribute("uv",new Qt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new go(e.width,e.height,e.widthSegments,e.heightSegments)}}var Ix=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ux=`#ifdef USE_ALPHAHASH
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
#endif`,Fx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ox=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,kx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bx=`#ifdef USE_AOMAP
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
#endif`,Hx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vx=`#ifdef USE_BATCHING
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
#endif`,Gx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Wx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,jx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Yx=`#ifdef USE_IRIDESCENCE
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
#endif`,qx=`#ifdef USE_BUMPMAP
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
#endif`,$x=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Kx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Zx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Jx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ey=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ty=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ny=`#if defined( USE_COLOR_ALPHA )
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
#endif`,iy=`#define PI 3.141592653589793
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
} // validated`,ry=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,sy=`vec3 transformedNormal = objectNormal;
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
#endif`,oy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ay=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ly=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,uy="gl_FragColor = linearToOutputTexel( gl_FragColor );",dy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,fy=`#ifdef USE_ENVMAP
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
#endif`,hy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,py=`#ifdef USE_ENVMAP
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
#endif`,my=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,gy=`#ifdef USE_ENVMAP
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
#endif`,vy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,_y=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,yy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sy=`#ifdef USE_GRADIENTMAP
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
}`,My=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ey=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ty=`uniform bool receiveShadow;
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
#endif`,Ay=`#ifdef USE_ENVMAP
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
#endif`,Ry=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,by=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Py=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ly=`PhysicalMaterial material;
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
#endif`,Dy=`struct PhysicalMaterial {
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
}`,Ny=`
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
#endif`,Iy=`#if defined( RE_IndirectDiffuse )
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
#endif`,Uy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Fy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Oy=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zy=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ky=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,By=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Hy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Gy=`#if defined( USE_POINTS_UV )
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
#endif`,Wy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Yy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$y=`#ifdef USE_MORPHTARGETS
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
#endif`,Ky=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qy=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Jy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,eS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,nS=`#ifdef USE_NORMALMAP
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
#endif`,iS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,rS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,sS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,oS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,aS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,lS=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
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
}`,cS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,uS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,fS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,pS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,mS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,vS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,_S=`float getShadowMask() {
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
}`,xS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,yS=`#ifdef USE_SKINNING
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
#endif`,SS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,MS=`#ifdef USE_SKINNING
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
#endif`,ES=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,TS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,AS=`#ifndef saturate
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
vec3 CineonToneMapping( vec3 color ) {
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,RS=`#ifdef USE_TRANSMISSION
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
#endif`,CS=`#ifdef USE_TRANSMISSION
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
#endif`,bS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,PS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,LS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,DS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const NS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,IS=`uniform sampler2D t2D;
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
}`,US=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,FS=`#ifdef ENVMAP_TYPE_CUBE
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
}`,OS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kS=`#include <common>
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
}`,BS=`#if DEPTH_PACKING == 3200
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
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,HS=`#define DISTANCE
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
}`,VS=`#define DISTANCE
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
}`,GS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,WS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jS=`uniform float scale;
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
}`,XS=`uniform vec3 diffuse;
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
}`,YS=`#include <common>
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
}`,qS=`uniform vec3 diffuse;
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
}`,$S=`#define LAMBERT
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
}`,KS=`#define LAMBERT
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
}`,ZS=`#define MATCAP
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
}`,QS=`#define MATCAP
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
}`,JS=`#define NORMAL
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
}`,eM=`#define NORMAL
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
}`,tM=`#define PHONG
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
}`,nM=`#define PHONG
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
}`,iM=`#define STANDARD
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
}`,rM=`#define STANDARD
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
}`,sM=`#define TOON
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
}`,oM=`#define TOON
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
}`,aM=`uniform float size;
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
}`,lM=`uniform vec3 diffuse;
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
}`,cM=`#include <common>
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
}`,uM=`uniform vec3 color;
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
}`,dM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
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
}`,fM=`uniform vec3 diffuse;
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
}`,ct={alphahash_fragment:Ix,alphahash_pars_fragment:Ux,alphamap_fragment:Fx,alphamap_pars_fragment:Ox,alphatest_fragment:zx,alphatest_pars_fragment:kx,aomap_fragment:Bx,aomap_pars_fragment:Hx,batching_pars_vertex:Vx,batching_vertex:Gx,begin_vertex:Wx,beginnormal_vertex:jx,bsdfs:Xx,iridescence_fragment:Yx,bumpmap_pars_fragment:qx,clipping_planes_fragment:$x,clipping_planes_pars_fragment:Kx,clipping_planes_pars_vertex:Zx,clipping_planes_vertex:Qx,color_fragment:Jx,color_pars_fragment:ey,color_pars_vertex:ty,color_vertex:ny,common:iy,cube_uv_reflection_fragment:ry,defaultnormal_vertex:sy,displacementmap_pars_vertex:oy,displacementmap_vertex:ay,emissivemap_fragment:ly,emissivemap_pars_fragment:cy,colorspace_fragment:uy,colorspace_pars_fragment:dy,envmap_fragment:fy,envmap_common_pars_fragment:hy,envmap_pars_fragment:py,envmap_pars_vertex:my,envmap_physical_pars_fragment:Ay,envmap_vertex:gy,fog_vertex:vy,fog_pars_vertex:_y,fog_fragment:xy,fog_pars_fragment:yy,gradientmap_pars_fragment:Sy,lightmap_pars_fragment:My,lights_lambert_fragment:Ey,lights_lambert_pars_fragment:wy,lights_pars_begin:Ty,lights_toon_fragment:Ry,lights_toon_pars_fragment:Cy,lights_phong_fragment:by,lights_phong_pars_fragment:Py,lights_physical_fragment:Ly,lights_physical_pars_fragment:Dy,lights_fragment_begin:Ny,lights_fragment_maps:Iy,lights_fragment_end:Uy,logdepthbuf_fragment:Fy,logdepthbuf_pars_fragment:Oy,logdepthbuf_pars_vertex:zy,logdepthbuf_vertex:ky,map_fragment:By,map_pars_fragment:Hy,map_particle_fragment:Vy,map_particle_pars_fragment:Gy,metalnessmap_fragment:Wy,metalnessmap_pars_fragment:jy,morphinstance_vertex:Xy,morphcolor_vertex:Yy,morphnormal_vertex:qy,morphtarget_pars_vertex:$y,morphtarget_vertex:Ky,normal_fragment_begin:Zy,normal_fragment_maps:Qy,normal_pars_fragment:Jy,normal_pars_vertex:eS,normal_vertex:tS,normalmap_pars_fragment:nS,clearcoat_normal_fragment_begin:iS,clearcoat_normal_fragment_maps:rS,clearcoat_pars_fragment:sS,iridescence_pars_fragment:oS,opaque_fragment:aS,packing:lS,premultiplied_alpha_fragment:cS,project_vertex:uS,dithering_fragment:dS,dithering_pars_fragment:fS,roughnessmap_fragment:hS,roughnessmap_pars_fragment:pS,shadowmap_pars_fragment:mS,shadowmap_pars_vertex:gS,shadowmap_vertex:vS,shadowmask_pars_fragment:_S,skinbase_vertex:xS,skinning_pars_vertex:yS,skinning_vertex:SS,skinnormal_vertex:MS,specularmap_fragment:ES,specularmap_pars_fragment:wS,tonemapping_fragment:TS,tonemapping_pars_fragment:AS,transmission_fragment:RS,transmission_pars_fragment:CS,uv_pars_fragment:bS,uv_pars_vertex:PS,uv_vertex:LS,worldpos_vertex:DS,background_vert:NS,background_frag:IS,backgroundCube_vert:US,backgroundCube_frag:FS,cube_vert:OS,cube_frag:zS,depth_vert:kS,depth_frag:BS,distanceRGBA_vert:HS,distanceRGBA_frag:VS,equirect_vert:GS,equirect_frag:WS,linedashed_vert:jS,linedashed_frag:XS,meshbasic_vert:YS,meshbasic_frag:qS,meshlambert_vert:$S,meshlambert_frag:KS,meshmatcap_vert:ZS,meshmatcap_frag:QS,meshnormal_vert:JS,meshnormal_frag:eM,meshphong_vert:tM,meshphong_frag:nM,meshphysical_vert:iM,meshphysical_frag:rM,meshtoon_vert:sM,meshtoon_frag:oM,points_vert:aM,points_frag:lM,shadow_vert:cM,shadow_frag:uM,sprite_vert:dM,sprite_frag:fM},be={common:{diffuse:{value:new xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new lt},alphaMap:{value:null},alphaMapTransform:{value:new lt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new lt}},envmap:{envMap:{value:null},envMapRotation:{value:new lt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new lt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new lt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new lt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new lt},normalScale:{value:new mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new lt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new lt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new lt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new lt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new lt},alphaTest:{value:0},uvTransform:{value:new lt}},sprite:{diffuse:{value:new xt(16777215)},opacity:{value:1},center:{value:new mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new lt},alphaMap:{value:null},alphaMapTransform:{value:new lt},alphaTest:{value:0}}},Pi={basic:{uniforms:Ln([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:ct.meshbasic_vert,fragmentShader:ct.meshbasic_frag},lambert:{uniforms:Ln([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new xt(0)}}]),vertexShader:ct.meshlambert_vert,fragmentShader:ct.meshlambert_frag},phong:{uniforms:Ln([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new xt(0)},specular:{value:new xt(1118481)},shininess:{value:30}}]),vertexShader:ct.meshphong_vert,fragmentShader:ct.meshphong_frag},standard:{uniforms:Ln([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ct.meshphysical_vert,fragmentShader:ct.meshphysical_frag},toon:{uniforms:Ln([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new xt(0)}}]),vertexShader:ct.meshtoon_vert,fragmentShader:ct.meshtoon_frag},matcap:{uniforms:Ln([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:ct.meshmatcap_vert,fragmentShader:ct.meshmatcap_frag},points:{uniforms:Ln([be.points,be.fog]),vertexShader:ct.points_vert,fragmentShader:ct.points_frag},dashed:{uniforms:Ln([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ct.linedashed_vert,fragmentShader:ct.linedashed_frag},depth:{uniforms:Ln([be.common,be.displacementmap]),vertexShader:ct.depth_vert,fragmentShader:ct.depth_frag},normal:{uniforms:Ln([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:ct.meshnormal_vert,fragmentShader:ct.meshnormal_frag},sprite:{uniforms:Ln([be.sprite,be.fog]),vertexShader:ct.sprite_vert,fragmentShader:ct.sprite_frag},background:{uniforms:{uvTransform:{value:new lt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ct.background_vert,fragmentShader:ct.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new lt}},vertexShader:ct.backgroundCube_vert,fragmentShader:ct.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ct.cube_vert,fragmentShader:ct.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ct.equirect_vert,fragmentShader:ct.equirect_frag},distanceRGBA:{uniforms:Ln([be.common,be.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ct.distanceRGBA_vert,fragmentShader:ct.distanceRGBA_frag},shadow:{uniforms:Ln([be.lights,be.fog,{color:{value:new xt(0)},opacity:{value:1}}]),vertexShader:ct.shadow_vert,fragmentShader:ct.shadow_frag}};Pi.physical={uniforms:Ln([Pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new lt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new lt},clearcoatNormalScale:{value:new mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new lt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new lt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new lt},sheen:{value:0},sheenColor:{value:new xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new lt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new lt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new lt},transmissionSamplerSize:{value:new mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new lt},attenuationDistance:{value:0},attenuationColor:{value:new xt(0)},specularColor:{value:new xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new lt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new lt},anisotropyVector:{value:new mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new lt}}]),vertexShader:ct.meshphysical_vert,fragmentShader:ct.meshphysical_frag};const Ol={r:0,b:0,g:0},ts=new Ni,hM=new zt;function pM(s,e,t,r,a,l,u){const d=new xt(0);let h=l===!0?0:1,m,v,x=null,_=0,y=null;function E(b){let L=b.isScene===!0?b.background:null;return L&&L.isTexture&&(L=(b.backgroundBlurriness>0?t:e).get(L)),L}function w(b){let L=!1;const A=E(b);A===null?p(d,h):A&&A.isColor&&(p(A,1),L=!0);const k=s.xr.getEnvironmentBlendMode();k==="additive"?r.buffers.color.setClear(0,0,0,1,u):k==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,u),(s.autoClear||L)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function S(b,L){const A=E(L);A&&(A.isCubeTexture||A.mapping===tc)?(v===void 0&&(v=new Ot(new mo(1,1,1),new Fr({name:"BackgroundCubeMaterial",uniforms:lo(Pi.backgroundCube.uniforms),vertexShader:Pi.backgroundCube.vertexShader,fragmentShader:Pi.backgroundCube.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1})),v.geometry.deleteAttribute("normal"),v.geometry.deleteAttribute("uv"),v.onBeforeRender=function(k,N,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(v.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(v)),ts.copy(L.backgroundRotation),ts.x*=-1,ts.y*=-1,ts.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(ts.y*=-1,ts.z*=-1),v.material.uniforms.envMap.value=A,v.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,v.material.uniforms.backgroundBlurriness.value=L.backgroundBlurriness,v.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,v.material.uniforms.backgroundRotation.value.setFromMatrix4(hM.makeRotationFromEuler(ts)),v.material.toneMapped=Mt.getTransfer(A.colorSpace)!==Lt,(x!==A||_!==A.version||y!==s.toneMapping)&&(v.material.needsUpdate=!0,x=A,_=A.version,y=s.toneMapping),v.layers.enableAll(),b.unshift(v,v.geometry,v.material,0,0,null)):A&&A.isTexture&&(m===void 0&&(m=new Ot(new go(2,2),new Fr({name:"BackgroundMaterial",uniforms:lo(Pi.background.uniforms),vertexShader:Pi.background.vertexShader,fragmentShader:Pi.background.fragmentShader,side:Ur,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(m)),m.material.uniforms.t2D.value=A,m.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,m.material.toneMapped=Mt.getTransfer(A.colorSpace)!==Lt,A.matrixAutoUpdate===!0&&A.updateMatrix(),m.material.uniforms.uvTransform.value.copy(A.matrix),(x!==A||_!==A.version||y!==s.toneMapping)&&(m.material.needsUpdate=!0,x=A,_=A.version,y=s.toneMapping),m.layers.enableAll(),b.unshift(m,m.geometry,m.material,0,0,null))}function p(b,L){b.getRGB(Ol,e0(s)),r.buffers.color.setClear(Ol.r,Ol.g,Ol.b,L,u)}return{getClearColor:function(){return d},setClearColor:function(b,L=1){d.set(b),h=L,p(d,h)},getClearAlpha:function(){return h},setClearAlpha:function(b){h=b,p(d,h)},render:w,addToRenderList:S}}function mM(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},a=_(null);let l=a,u=!1;function d(C,B,ee,Z,le){let de=!1;const ae=x(Z,ee,B);l!==ae&&(l=ae,m(l.object)),de=y(C,Z,ee,le),de&&E(C,Z,ee,le),le!==null&&e.update(le,s.ELEMENT_ARRAY_BUFFER),(de||u)&&(u=!1,A(C,B,ee,Z),le!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(le).buffer))}function h(){return s.createVertexArray()}function m(C){return s.bindVertexArray(C)}function v(C){return s.deleteVertexArray(C)}function x(C,B,ee){const Z=ee.wireframe===!0;let le=r[C.id];le===void 0&&(le={},r[C.id]=le);let de=le[B.id];de===void 0&&(de={},le[B.id]=de);let ae=de[Z];return ae===void 0&&(ae=_(h()),de[Z]=ae),ae}function _(C){const B=[],ee=[],Z=[];for(let le=0;le<t;le++)B[le]=0,ee[le]=0,Z[le]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:ee,attributeDivisors:Z,object:C,attributes:{},index:null}}function y(C,B,ee,Z){const le=l.attributes,de=B.attributes;let ae=0;const ue=ee.getAttributes();for(const V in ue)if(ue[V].location>=0){const oe=le[V];let O=de[V];if(O===void 0&&(V==="instanceMatrix"&&C.instanceMatrix&&(O=C.instanceMatrix),V==="instanceColor"&&C.instanceColor&&(O=C.instanceColor)),oe===void 0||oe.attribute!==O||O&&oe.data!==O.data)return!0;ae++}return l.attributesNum!==ae||l.index!==Z}function E(C,B,ee,Z){const le={},de=B.attributes;let ae=0;const ue=ee.getAttributes();for(const V in ue)if(ue[V].location>=0){let oe=de[V];oe===void 0&&(V==="instanceMatrix"&&C.instanceMatrix&&(oe=C.instanceMatrix),V==="instanceColor"&&C.instanceColor&&(oe=C.instanceColor));const O={};O.attribute=oe,oe&&oe.data&&(O.data=oe.data),le[V]=O,ae++}l.attributes=le,l.attributesNum=ae,l.index=Z}function w(){const C=l.newAttributes;for(let B=0,ee=C.length;B<ee;B++)C[B]=0}function S(C){p(C,0)}function p(C,B){const ee=l.newAttributes,Z=l.enabledAttributes,le=l.attributeDivisors;ee[C]=1,Z[C]===0&&(s.enableVertexAttribArray(C),Z[C]=1),le[C]!==B&&(s.vertexAttribDivisor(C,B),le[C]=B)}function b(){const C=l.newAttributes,B=l.enabledAttributes;for(let ee=0,Z=B.length;ee<Z;ee++)B[ee]!==C[ee]&&(s.disableVertexAttribArray(ee),B[ee]=0)}function L(C,B,ee,Z,le,de,ae){ae===!0?s.vertexAttribIPointer(C,B,ee,le,de):s.vertexAttribPointer(C,B,ee,Z,le,de)}function A(C,B,ee,Z){w();const le=Z.attributes,de=ee.getAttributes(),ae=B.defaultAttributeValues;for(const ue in de){const V=de[ue];if(V.location>=0){let ce=le[ue];if(ce===void 0&&(ue==="instanceMatrix"&&C.instanceMatrix&&(ce=C.instanceMatrix),ue==="instanceColor"&&C.instanceColor&&(ce=C.instanceColor)),ce!==void 0){const oe=ce.normalized,O=ce.itemSize,re=e.get(ce);if(re===void 0)continue;const Ne=re.buffer,J=re.type,fe=re.bytesPerElement,Ee=J===s.INT||J===s.UNSIGNED_INT||ce.gpuType===Sf;if(ce.isInterleavedBufferAttribute){const xe=ce.data,Ae=xe.stride,Ie=ce.offset;if(xe.isInstancedInterleavedBuffer){for(let Je=0;Je<V.locationSize;Je++)p(V.location+Je,xe.meshPerAttribute);C.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let Je=0;Je<V.locationSize;Je++)S(V.location+Je);s.bindBuffer(s.ARRAY_BUFFER,Ne);for(let Je=0;Je<V.locationSize;Je++)L(V.location+Je,O/V.locationSize,J,oe,Ae*fe,(Ie+O/V.locationSize*Je)*fe,Ee)}else{if(ce.isInstancedBufferAttribute){for(let xe=0;xe<V.locationSize;xe++)p(V.location+xe,ce.meshPerAttribute);C.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let xe=0;xe<V.locationSize;xe++)S(V.location+xe);s.bindBuffer(s.ARRAY_BUFFER,Ne);for(let xe=0;xe<V.locationSize;xe++)L(V.location+xe,O/V.locationSize,J,oe,O*fe,O/V.locationSize*xe*fe,Ee)}}else if(ae!==void 0){const oe=ae[ue];if(oe!==void 0)switch(oe.length){case 2:s.vertexAttrib2fv(V.location,oe);break;case 3:s.vertexAttrib3fv(V.location,oe);break;case 4:s.vertexAttrib4fv(V.location,oe);break;default:s.vertexAttrib1fv(V.location,oe)}}}}b()}function k(){z();for(const C in r){const B=r[C];for(const ee in B){const Z=B[ee];for(const le in Z)v(Z[le].object),delete Z[le];delete B[ee]}delete r[C]}}function N(C){if(r[C.id]===void 0)return;const B=r[C.id];for(const ee in B){const Z=B[ee];for(const le in Z)v(Z[le].object),delete Z[le];delete B[ee]}delete r[C.id]}function U(C){for(const B in r){const ee=r[B];if(ee[C.id]===void 0)continue;const Z=ee[C.id];for(const le in Z)v(Z[le].object),delete Z[le];delete ee[C.id]}}function z(){D(),u=!0,l!==a&&(l=a,m(l.object))}function D(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:d,reset:z,resetDefaultState:D,dispose:k,releaseStatesOfGeometry:N,releaseStatesOfProgram:U,initAttributes:w,enableAttribute:S,disableUnusedAttributes:b}}function gM(s,e,t){let r;function a(m){r=m}function l(m,v){s.drawArrays(r,m,v),t.update(v,r,1)}function u(m,v,x){x!==0&&(s.drawArraysInstanced(r,m,v,x),t.update(v,r,x))}function d(m,v,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,m,0,v,0,x);let y=0;for(let E=0;E<x;E++)y+=v[E];t.update(y,r,1)}function h(m,v,x,_){if(x===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let E=0;E<m.length;E++)u(m[E],v[E],_[E]);else{y.multiDrawArraysInstancedWEBGL(r,m,0,v,0,_,0,x);let E=0;for(let w=0;w<x;w++)E+=v[w]*_[w];t.update(E,r,1)}}this.setMode=a,this.render=l,this.renderInstances=u,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function vM(s,e,t,r){let a;function l(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function u(U){return!(U!==xi&&r.convert(U)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(U){const z=U===ua&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==ir&&r.convert(U)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&U!==er&&!z)}function h(U){if(U==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=t.precision!==void 0?t.precision:"highp";const v=h(m);v!==m&&(console.warn("THREE.WebGLRenderer:",m,"not supported, using",v,"instead."),m=v);const x=t.logarithmicDepthBuffer===!0,_=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),y=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),E=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=s.getParameter(s.MAX_TEXTURE_SIZE),S=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),b=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),L=s.getParameter(s.MAX_VARYING_VECTORS),A=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),k=E>0,N=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:h,textureFormatReadable:u,textureTypeReadable:d,precision:m,logarithmicDepthBuffer:x,reverseDepthBuffer:_,maxTextures:y,maxVertexTextures:E,maxTextureSize:w,maxCubemapSize:S,maxAttributes:p,maxVertexUniforms:b,maxVaryings:L,maxFragmentUniforms:A,vertexTextures:k,maxSamples:N}}function _M(s){const e=this;let t=null,r=0,a=!1,l=!1;const u=new is,d=new lt,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(x,_){const y=x.length!==0||_||r!==0||a;return a=_,r=x.length,y},this.beginShadows=function(){l=!0,v(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(x,_){t=v(x,_,0)},this.setState=function(x,_,y){const E=x.clippingPlanes,w=x.clipIntersection,S=x.clipShadows,p=s.get(x);if(!a||E===null||E.length===0||l&&!S)l?v(null):m();else{const b=l?0:r,L=b*4;let A=p.clippingState||null;h.value=A,A=v(E,_,L,y);for(let k=0;k!==L;++k)A[k]=t[k];p.clippingState=A,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=b}};function m(){h.value!==t&&(h.value=t,h.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function v(x,_,y,E){const w=x!==null?x.length:0;let S=null;if(w!==0){if(S=h.value,E!==!0||S===null){const p=y+w*4,b=_.matrixWorldInverse;d.getNormalMatrix(b),(S===null||S.length<p)&&(S=new Float32Array(p));for(let L=0,A=y;L!==w;++L,A+=4)u.copy(x[L]).applyMatrix4(b,d),u.normal.toArray(S,A),S[A+3]=u.constant}h.value=S,h.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,S}}function xM(s){let e=new WeakMap;function t(u,d){return d===zd?u.mapping=ro:d===kd&&(u.mapping=so),u}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===zd||d===kd)if(e.has(u)){const h=e.get(u).texture;return t(h,u.mapping)}else{const h=u.image;if(h&&h.height>0){const m=new Px(h.height);return m.fromEquirectangularTexture(s,u),e.set(u,m),u.addEventListener("dispose",a),t(m.texture,u.mapping)}else return null}}return u}function a(u){const d=u.target;d.removeEventListener("dispose",a);const h=e.get(d);h!==void 0&&(e.delete(d),h.dispose())}function l(){e=new WeakMap}return{get:r,dispose:l}}class r0 extends t0{constructor(e=-1,t=1,r=1,a=-1,l=.1,u=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=a,this.near=l,this.far=u,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,a,l,u){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let l=r-e,u=r+e,d=a+t,h=a-t;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,v=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=m*this.view.offsetX,u=l+m*this.view.width,d-=v*this.view.offsetY,h=d-v*this.view.height}this.projectionMatrix.makeOrthographic(l,u,d,h,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Zs=4,Ym=[.125,.215,.35,.446,.526,.582],os=20,dd=new r0,qm=new xt;let fd=null,hd=0,pd=0,md=!1;const rs=(1+Math.sqrt(5))/2,$s=1/rs,$m=[new G(-rs,$s,0),new G(rs,$s,0),new G(-$s,0,rs),new G($s,0,rs),new G(0,rs,-$s),new G(0,rs,$s),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)];class Km{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,r=.1,a=100){fd=this._renderer.getRenderTarget(),hd=this._renderer.getActiveCubeFace(),pd=this._renderer.getActiveMipmapLevel(),md=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,r,a,l),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(fd,hd,pd),this._renderer.xr.enabled=md,e.scissorTest=!1,zl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ro||e.mapping===so?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),fd=this._renderer.getRenderTarget(),hd=this._renderer.getActiveCubeFace(),pd=this._renderer.getActiveMipmapLevel(),md=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:Di,minFilter:Di,generateMipmaps:!1,type:ua,format:xi,colorSpace:uo,depthBuffer:!1},a=Zm(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zm(e,t,r);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=yM(l)),this._blurMaterial=SM(l,e,t)}return a}_compileMaterial(e){const t=new Ot(this._lodPlanes[0],e);this._renderer.compile(t,dd)}_sceneToCubeUV(e,t,r,a){const d=new Vn(90,1,t,r),h=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],v=this._renderer,x=v.autoClear,_=v.toneMapping;v.getClearColor(qm),v.toneMapping=Ir,v.autoClear=!1;const y=new no({name:"PMREM.Background",side:Wn,depthWrite:!1,depthTest:!1}),E=new Ot(new mo,y);let w=!1;const S=e.background;S?S.isColor&&(y.color.copy(S),e.background=null,w=!0):(y.color.copy(qm),w=!0);for(let p=0;p<6;p++){const b=p%3;b===0?(d.up.set(0,h[p],0),d.lookAt(m[p],0,0)):b===1?(d.up.set(0,0,h[p]),d.lookAt(0,m[p],0)):(d.up.set(0,h[p],0),d.lookAt(0,0,m[p]));const L=this._cubeSize;zl(a,b*L,p>2?L:0,L,L),v.setRenderTarget(a),w&&v.render(E,d),v.render(e,d)}E.geometry.dispose(),E.material.dispose(),v.toneMapping=_,v.autoClear=x,e.background=S}_textureToCubeUV(e,t){const r=this._renderer,a=e.mapping===ro||e.mapping===so;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qm());const l=a?this._cubemapMaterial:this._equirectMaterial,u=new Ot(this._lodPlanes[0],l),d=l.uniforms;d.envMap.value=e;const h=this._cubeSize;zl(t,0,0,3*h,2*h),r.setRenderTarget(t),r.render(u,dd)}_applyPMREM(e){const t=this._renderer,r=t.autoClear;t.autoClear=!1;const a=this._lodPlanes.length;for(let l=1;l<a;l++){const u=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),d=$m[(a-l-1)%$m.length];this._blur(e,l-1,l,u,d)}t.autoClear=r}_blur(e,t,r,a,l){const u=this._pingPongRenderTarget;this._halfBlur(e,u,t,r,a,"latitudinal",l),this._halfBlur(u,e,r,r,a,"longitudinal",l)}_halfBlur(e,t,r,a,l,u,d){const h=this._renderer,m=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const v=3,x=new Ot(this._lodPlanes[a],m),_=m.uniforms,y=this._sizeLods[r]-1,E=isFinite(l)?Math.PI/(2*y):2*Math.PI/(2*os-1),w=l/E,S=isFinite(l)?1+Math.floor(v*w):os;S>os&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${os}`);const p=[];let b=0;for(let U=0;U<os;++U){const z=U/w,D=Math.exp(-z*z/2);p.push(D),U===0?b+=D:U<S&&(b+=2*D)}for(let U=0;U<p.length;U++)p[U]=p[U]/b;_.envMap.value=e.texture,_.samples.value=S,_.weights.value=p,_.latitudinal.value=u==="latitudinal",d&&(_.poleAxis.value=d);const{_lodMax:L}=this;_.dTheta.value=E,_.mipInt.value=L-r;const A=this._sizeLods[a],k=3*A*(a>L-Zs?a-L+Zs:0),N=4*(this._cubeSize-A);zl(t,k,N,3*A,2*A),h.setRenderTarget(t),h.render(x,dd)}}function yM(s){const e=[],t=[],r=[];let a=s;const l=s-Zs+1+Ym.length;for(let u=0;u<l;u++){const d=Math.pow(2,a);t.push(d);let h=1/d;u>s-Zs?h=Ym[u-s+Zs-1]:u===0&&(h=0),r.push(h);const m=1/(d-2),v=-m,x=1+m,_=[v,v,x,v,x,x,v,v,x,x,v,x],y=6,E=6,w=3,S=2,p=1,b=new Float32Array(w*E*y),L=new Float32Array(S*E*y),A=new Float32Array(p*E*y);for(let N=0;N<y;N++){const U=N%3*2/3-1,z=N>2?0:-1,D=[U,z,0,U+2/3,z,0,U+2/3,z+1,0,U,z,0,U+2/3,z+1,0,U,z+1,0];b.set(D,w*E*N),L.set(_,S*E*N);const C=[N,N,N,N,N,N];A.set(C,p*E*N)}const k=new Nn;k.setAttribute("position",new Mi(b,w)),k.setAttribute("uv",new Mi(L,S)),k.setAttribute("faceIndex",new Mi(A,p)),e.push(k),a>Zs&&a--}return{lodPlanes:e,sizeLods:t,sigmas:r}}function Zm(s,e,t){const r=new ds(s,e,t);return r.texture.mapping=tc,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function zl(s,e,t,r,a){s.viewport.set(e,t,r,a),s.scissor.set(e,t,r,a)}function SM(s,e,t){const r=new Float32Array(os),a=new G(0,1,0);return new Fr({name:"SphericalGaussianBlur",defines:{n:os,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Lf(),fragmentShader:`

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
		`,blending:Nr,depthTest:!1,depthWrite:!1})}function Qm(){return new Fr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Lf(),fragmentShader:`

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
		`,blending:Nr,depthTest:!1,depthWrite:!1})}function Jm(){return new Fr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Lf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nr,depthTest:!1,depthWrite:!1})}function Lf(){return`

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
	`}function MM(s){let e=new WeakMap,t=null;function r(d){if(d&&d.isTexture){const h=d.mapping,m=h===zd||h===kd,v=h===ro||h===so;if(m||v){let x=e.get(d);const _=x!==void 0?x.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==_)return t===null&&(t=new Km(s)),x=m?t.fromEquirectangular(d,x):t.fromCubemap(d,x),x.texture.pmremVersion=d.pmremVersion,e.set(d,x),x.texture;if(x!==void 0)return x.texture;{const y=d.image;return m&&y&&y.height>0||v&&y&&a(y)?(t===null&&(t=new Km(s)),x=m?t.fromEquirectangular(d):t.fromCubemap(d),x.texture.pmremVersion=d.pmremVersion,e.set(d,x),d.addEventListener("dispose",l),x.texture):null}}}return d}function a(d){let h=0;const m=6;for(let v=0;v<m;v++)d[v]!==void 0&&h++;return h===m}function l(d){const h=d.target;h.removeEventListener("dispose",l);const m=e.get(h);m!==void 0&&(e.delete(h),m.dispose())}function u(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:r,dispose:u}}function EM(s){const e={};function t(r){if(e[r]!==void 0)return e[r];let a;switch(r){case"WEBGL_depth_texture":a=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=s.getExtension(r)}return e[r]=a,a}return{has:function(r){return t(r)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(r){const a=t(r);return a===null&&na("THREE.WebGLRenderer: "+r+" extension not supported."),a}}}function wM(s,e,t,r){const a={},l=new WeakMap;function u(x){const _=x.target;_.index!==null&&e.remove(_.index);for(const E in _.attributes)e.remove(_.attributes[E]);for(const E in _.morphAttributes){const w=_.morphAttributes[E];for(let S=0,p=w.length;S<p;S++)e.remove(w[S])}_.removeEventListener("dispose",u),delete a[_.id];const y=l.get(_);y&&(e.remove(y),l.delete(_)),r.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0&&delete _._maxInstanceCount,t.memory.geometries--}function d(x,_){return a[_.id]===!0||(_.addEventListener("dispose",u),a[_.id]=!0,t.memory.geometries++),_}function h(x){const _=x.attributes;for(const E in _)e.update(_[E],s.ARRAY_BUFFER);const y=x.morphAttributes;for(const E in y){const w=y[E];for(let S=0,p=w.length;S<p;S++)e.update(w[S],s.ARRAY_BUFFER)}}function m(x){const _=[],y=x.index,E=x.attributes.position;let w=0;if(y!==null){const b=y.array;w=y.version;for(let L=0,A=b.length;L<A;L+=3){const k=b[L+0],N=b[L+1],U=b[L+2];_.push(k,N,N,U,U,k)}}else if(E!==void 0){const b=E.array;w=E.version;for(let L=0,A=b.length/3-1;L<A;L+=3){const k=L+0,N=L+1,U=L+2;_.push(k,N,N,U,U,k)}}else return;const S=new(qg(_)?Jg:Qg)(_,1);S.version=w;const p=l.get(x);p&&e.remove(p),l.set(x,S)}function v(x){const _=l.get(x);if(_){const y=x.index;y!==null&&_.version<y.version&&m(x)}else m(x);return l.get(x)}return{get:d,update:h,getWireframeAttribute:v}}function TM(s,e,t){let r;function a(_){r=_}let l,u;function d(_){l=_.type,u=_.bytesPerElement}function h(_,y){s.drawElements(r,y,l,_*u),t.update(y,r,1)}function m(_,y,E){E!==0&&(s.drawElementsInstanced(r,y,l,_*u,E),t.update(y,r,E))}function v(_,y,E){if(E===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,y,0,l,_,0,E);let S=0;for(let p=0;p<E;p++)S+=y[p];t.update(S,r,1)}function x(_,y,E,w){if(E===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let p=0;p<_.length;p++)m(_[p]/u,y[p],w[p]);else{S.multiDrawElementsInstancedWEBGL(r,y,0,l,_,0,w,0,E);let p=0;for(let b=0;b<E;b++)p+=y[b]*w[b];t.update(p,r,1)}}this.setMode=a,this.setIndex=d,this.render=h,this.renderInstances=m,this.renderMultiDraw=v,this.renderMultiDrawInstances=x}function AM(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function r(l,u,d){switch(t.calls++,u){case s.TRIANGLES:t.triangles+=d*(l/3);break;case s.LINES:t.lines+=d*(l/2);break;case s.LINE_STRIP:t.lines+=d*(l-1);break;case s.LINE_LOOP:t.lines+=d*l;break;case s.POINTS:t.points+=d*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:r}}function RM(s,e,t){const r=new WeakMap,a=new Nt;function l(u,d,h){const m=u.morphTargetInfluences,v=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,x=v!==void 0?v.length:0;let _=r.get(d);if(_===void 0||_.count!==x){let C=function(){z.dispose(),r.delete(d),d.removeEventListener("dispose",C)};var y=C;_!==void 0&&_.texture.dispose();const E=d.morphAttributes.position!==void 0,w=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,p=d.morphAttributes.position||[],b=d.morphAttributes.normal||[],L=d.morphAttributes.color||[];let A=0;E===!0&&(A=1),w===!0&&(A=2),S===!0&&(A=3);let k=d.attributes.position.count*A,N=1;k>e.maxTextureSize&&(N=Math.ceil(k/e.maxTextureSize),k=e.maxTextureSize);const U=new Float32Array(k*N*4*x),z=new Kg(U,k,N,x);z.type=er,z.needsUpdate=!0;const D=A*4;for(let B=0;B<x;B++){const ee=p[B],Z=b[B],le=L[B],de=k*N*4*B;for(let ae=0;ae<ee.count;ae++){const ue=ae*D;E===!0&&(a.fromBufferAttribute(ee,ae),U[de+ue+0]=a.x,U[de+ue+1]=a.y,U[de+ue+2]=a.z,U[de+ue+3]=0),w===!0&&(a.fromBufferAttribute(Z,ae),U[de+ue+4]=a.x,U[de+ue+5]=a.y,U[de+ue+6]=a.z,U[de+ue+7]=0),S===!0&&(a.fromBufferAttribute(le,ae),U[de+ue+8]=a.x,U[de+ue+9]=a.y,U[de+ue+10]=a.z,U[de+ue+11]=le.itemSize===4?a.w:1)}}_={count:x,texture:z,size:new mt(k,N)},r.set(d,_),d.addEventListener("dispose",C)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)h.getUniforms().setValue(s,"morphTexture",u.morphTexture,t);else{let E=0;for(let S=0;S<m.length;S++)E+=m[S];const w=d.morphTargetsRelative?1:1-E;h.getUniforms().setValue(s,"morphTargetBaseInfluence",w),h.getUniforms().setValue(s,"morphTargetInfluences",m)}h.getUniforms().setValue(s,"morphTargetsTexture",_.texture,t),h.getUniforms().setValue(s,"morphTargetsTextureSize",_.size)}return{update:l}}function CM(s,e,t,r){let a=new WeakMap;function l(h){const m=r.render.frame,v=h.geometry,x=e.get(h,v);if(a.get(x)!==m&&(e.update(x),a.set(x,m)),h.isInstancedMesh&&(h.hasEventListener("dispose",d)===!1&&h.addEventListener("dispose",d),a.get(h)!==m&&(t.update(h.instanceMatrix,s.ARRAY_BUFFER),h.instanceColor!==null&&t.update(h.instanceColor,s.ARRAY_BUFFER),a.set(h,m))),h.isSkinnedMesh){const _=h.skeleton;a.get(_)!==m&&(_.update(),a.set(_,m))}return x}function u(){a=new WeakMap}function d(h){const m=h.target;m.removeEventListener("dispose",d),t.remove(m.instanceMatrix),m.instanceColor!==null&&t.remove(m.instanceColor)}return{update:l,dispose:u}}class s0 extends En{constructor(e,t,r,a,l,u,d,h,m,v=eo){if(v!==eo&&v!==ao)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&v===eo&&(r=us),r===void 0&&v===ao&&(r=oo),super(null,a,l,u,d,h,v,r,m),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=d!==void 0?d:Si,this.minFilter=h!==void 0?h:Si,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const o0=new En,eg=new s0(1,1),a0=new Kg,l0=new px,c0=new n0,tg=[],ng=[],ig=new Float32Array(16),rg=new Float32Array(9),sg=new Float32Array(4);function vo(s,e,t){const r=s[0];if(r<=0||r>0)return s;const a=e*t;let l=tg[a];if(l===void 0&&(l=new Float32Array(a),tg[a]=l),e!==0){r.toArray(l,0);for(let u=1,d=0;u!==e;++u)d+=t,s[u].toArray(l,d)}return l}function rn(s,e){if(s.length!==e.length)return!1;for(let t=0,r=s.length;t<r;t++)if(s[t]!==e[t])return!1;return!0}function sn(s,e){for(let t=0,r=e.length;t<r;t++)s[t]=e[t]}function rc(s,e){let t=ng[e];t===void 0&&(t=new Int32Array(e),ng[e]=t);for(let r=0;r!==e;++r)t[r]=s.allocateTextureUnit();return t}function bM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function PM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;s.uniform2fv(this.addr,e),sn(t,e)}}function LM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(rn(t,e))return;s.uniform3fv(this.addr,e),sn(t,e)}}function DM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;s.uniform4fv(this.addr,e),sn(t,e)}}function NM(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(rn(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,r))return;sg.set(r),s.uniformMatrix2fv(this.addr,!1,sg),sn(t,r)}}function IM(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(rn(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,r))return;rg.set(r),s.uniformMatrix3fv(this.addr,!1,rg),sn(t,r)}}function UM(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(rn(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,r))return;ig.set(r),s.uniformMatrix4fv(this.addr,!1,ig),sn(t,r)}}function FM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function OM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;s.uniform2iv(this.addr,e),sn(t,e)}}function zM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;s.uniform3iv(this.addr,e),sn(t,e)}}function kM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;s.uniform4iv(this.addr,e),sn(t,e)}}function BM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function HM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;s.uniform2uiv(this.addr,e),sn(t,e)}}function VM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;s.uniform3uiv(this.addr,e),sn(t,e)}}function GM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;s.uniform4uiv(this.addr,e),sn(t,e)}}function WM(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a);let l;this.type===s.SAMPLER_2D_SHADOW?(eg.compareFunction=Yg,l=eg):l=o0,t.setTexture2D(e||l,a)}function jM(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture3D(e||l0,a)}function XM(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTextureCube(e||c0,a)}function YM(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture2DArray(e||a0,a)}function qM(s){switch(s){case 5126:return bM;case 35664:return PM;case 35665:return LM;case 35666:return DM;case 35674:return NM;case 35675:return IM;case 35676:return UM;case 5124:case 35670:return FM;case 35667:case 35671:return OM;case 35668:case 35672:return zM;case 35669:case 35673:return kM;case 5125:return BM;case 36294:return HM;case 36295:return VM;case 36296:return GM;case 35678:case 36198:case 36298:case 36306:case 35682:return WM;case 35679:case 36299:case 36307:return jM;case 35680:case 36300:case 36308:case 36293:return XM;case 36289:case 36303:case 36311:case 36292:return YM}}function $M(s,e){s.uniform1fv(this.addr,e)}function KM(s,e){const t=vo(e,this.size,2);s.uniform2fv(this.addr,t)}function ZM(s,e){const t=vo(e,this.size,3);s.uniform3fv(this.addr,t)}function QM(s,e){const t=vo(e,this.size,4);s.uniform4fv(this.addr,t)}function JM(s,e){const t=vo(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function eE(s,e){const t=vo(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function tE(s,e){const t=vo(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function nE(s,e){s.uniform1iv(this.addr,e)}function iE(s,e){s.uniform2iv(this.addr,e)}function rE(s,e){s.uniform3iv(this.addr,e)}function sE(s,e){s.uniform4iv(this.addr,e)}function oE(s,e){s.uniform1uiv(this.addr,e)}function aE(s,e){s.uniform2uiv(this.addr,e)}function lE(s,e){s.uniform3uiv(this.addr,e)}function cE(s,e){s.uniform4uiv(this.addr,e)}function uE(s,e,t){const r=this.cache,a=e.length,l=rc(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let u=0;u!==a;++u)t.setTexture2D(e[u]||o0,l[u])}function dE(s,e,t){const r=this.cache,a=e.length,l=rc(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let u=0;u!==a;++u)t.setTexture3D(e[u]||l0,l[u])}function fE(s,e,t){const r=this.cache,a=e.length,l=rc(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let u=0;u!==a;++u)t.setTextureCube(e[u]||c0,l[u])}function hE(s,e,t){const r=this.cache,a=e.length,l=rc(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let u=0;u!==a;++u)t.setTexture2DArray(e[u]||a0,l[u])}function pE(s){switch(s){case 5126:return $M;case 35664:return KM;case 35665:return ZM;case 35666:return QM;case 35674:return JM;case 35675:return eE;case 35676:return tE;case 5124:case 35670:return nE;case 35667:case 35671:return iE;case 35668:case 35672:return rE;case 35669:case 35673:return sE;case 5125:return oE;case 36294:return aE;case 36295:return lE;case 36296:return cE;case 35678:case 36198:case 36298:case 36306:case 35682:return uE;case 35679:case 36299:case 36307:return dE;case 35680:case 36300:case 36308:case 36293:return fE;case 36289:case 36303:case 36311:case 36292:return hE}}class mE{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=qM(t.type)}}class gE{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=pE(t.type)}}class vE{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){const a=this.seq;for(let l=0,u=a.length;l!==u;++l){const d=a[l];d.setValue(e,t[d.id],r)}}}const gd=/(\w+)(\])?(\[|\.)?/g;function og(s,e){s.seq.push(e),s.map[e.id]=e}function _E(s,e,t){const r=s.name,a=r.length;for(gd.lastIndex=0;;){const l=gd.exec(r),u=gd.lastIndex;let d=l[1];const h=l[2]==="]",m=l[3];if(h&&(d=d|0),m===void 0||m==="["&&u+2===a){og(t,m===void 0?new mE(d,s,e):new gE(d,s,e));break}else{let x=t.map[d];x===void 0&&(x=new vE(d),og(t,x)),t=x}}}class ql{constructor(e,t){this.seq=[],this.map={};const r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const l=e.getActiveUniform(t,a),u=e.getUniformLocation(t,l.name);_E(l,u,this)}}setValue(e,t,r,a){const l=this.map[t];l!==void 0&&l.setValue(e,r,a)}setOptional(e,t,r){const a=t[r];a!==void 0&&this.setValue(e,r,a)}static upload(e,t,r,a){for(let l=0,u=t.length;l!==u;++l){const d=t[l],h=r[d.id];h.needsUpdate!==!1&&d.setValue(e,h.value,a)}}static seqWithValue(e,t){const r=[];for(let a=0,l=e.length;a!==l;++a){const u=e[a];u.id in t&&r.push(u)}return r}}function ag(s,e,t){const r=s.createShader(e);return s.shaderSource(r,t),s.compileShader(r),r}const xE=37297;let yE=0;function SE(s,e){const t=s.split(`
`),r=[],a=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let u=a;u<l;u++){const d=u+1;r.push(`${d===e?">":" "} ${d}: ${t[u]}`)}return r.join(`
`)}const lg=new lt;function ME(s){Mt._getMatrix(lg,Mt.workingColorSpace,s);const e=`mat3( ${lg.elements.map(t=>t.toFixed(4))} )`;switch(Mt.getTransfer(s)){case nc:return[e,"LinearTransferOETF"];case Lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function cg(s,e,t){const r=s.getShaderParameter(e,s.COMPILE_STATUS),a=s.getShaderInfoLog(e).trim();if(r&&a==="")return"";const l=/ERROR: 0:(\d+)/.exec(a);if(l){const u=parseInt(l[1]);return t.toUpperCase()+`

`+a+`

`+SE(s.getShaderSource(e),u)}else return a}function EE(s,e){const t=ME(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function wE(s,e){let t;switch(e){case R_:t="Linear";break;case C_:t="Reinhard";break;case b_:t="Cineon";break;case Ig:t="ACESFilmic";break;case L_:t="AgX";break;case D_:t="Neutral";break;case P_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const kl=new G;function TE(){Mt.getLuminanceCoefficients(kl);const s=kl.x.toFixed(4),e=kl.y.toFixed(4),t=kl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function AE(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ia).join(`
`)}function RE(s){const e=[];for(const t in s){const r=s[t];r!==!1&&e.push("#define "+t+" "+r)}return e.join(`
`)}function CE(s,e){const t={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const l=s.getActiveAttrib(e,a),u=l.name;let d=1;l.type===s.FLOAT_MAT2&&(d=2),l.type===s.FLOAT_MAT3&&(d=3),l.type===s.FLOAT_MAT4&&(d=4),t[u]={type:l.type,location:s.getAttribLocation(e,u),locationSize:d}}return t}function ia(s){return s!==""}function ug(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function dg(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const bE=/^[ \t]*#include +<([\w\d./]+)>/gm;function pf(s){return s.replace(bE,LE)}const PE=new Map;function LE(s,e){let t=ct[e];if(t===void 0){const r=PE.get(e);if(r!==void 0)t=ct[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return pf(t)}const DE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fg(s){return s.replace(DE,NE)}function NE(s,e,t,r){let a="";for(let l=parseInt(e);l<parseInt(t);l++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return a}function hg(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function IE(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Lg?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Dg?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Qi&&(e="SHADOWMAP_TYPE_VSM"),e}function UE(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case ro:case so:e="ENVMAP_TYPE_CUBE";break;case tc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function FE(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case so:e="ENVMAP_MODE_REFRACTION";break}return e}function OE(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Ng:e="ENVMAP_BLENDING_MULTIPLY";break;case T_:e="ENVMAP_BLENDING_MIX";break;case A_:e="ENVMAP_BLENDING_ADD";break}return e}function zE(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:r,maxMip:t}}function kE(s,e,t,r){const a=s.getContext(),l=t.defines;let u=t.vertexShader,d=t.fragmentShader;const h=IE(t),m=UE(t),v=FE(t),x=OE(t),_=zE(t),y=AE(t),E=RE(l),w=a.createProgram();let S,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(ia).join(`
`),S.length>0&&(S+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(ia).join(`
`),p.length>0&&(p+=`
`)):(S=[hg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+v:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ia).join(`
`),p=[hg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.envMap?"#define "+v:"",t.envMap?"#define "+x:"",_?"#define CUBEUV_TEXEL_WIDTH "+_.texelWidth:"",_?"#define CUBEUV_TEXEL_HEIGHT "+_.texelHeight:"",_?"#define CUBEUV_MAX_MIP "+_.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ir?"#define TONE_MAPPING":"",t.toneMapping!==Ir?ct.tonemapping_pars_fragment:"",t.toneMapping!==Ir?wE("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ct.colorspace_pars_fragment,EE("linearToOutputTexel",t.outputColorSpace),TE(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ia).join(`
`)),u=pf(u),u=ug(u,t),u=dg(u,t),d=pf(d),d=ug(d,t),d=dg(d,t),u=fg(u),d=fg(d),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,S=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,p=["#define varying in",t.glslVersion===wm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const L=b+S+u,A=b+p+d,k=ag(a,a.VERTEX_SHADER,L),N=ag(a,a.FRAGMENT_SHADER,A);a.attachShader(w,k),a.attachShader(w,N),t.index0AttributeName!==void 0?a.bindAttribLocation(w,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(w,0,"position"),a.linkProgram(w);function U(B){if(s.debug.checkShaderErrors){const ee=a.getProgramInfoLog(w).trim(),Z=a.getShaderInfoLog(k).trim(),le=a.getShaderInfoLog(N).trim();let de=!0,ae=!0;if(a.getProgramParameter(w,a.LINK_STATUS)===!1)if(de=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,w,k,N);else{const ue=cg(a,k,"vertex"),V=cg(a,N,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(w,a.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+ee+`
`+ue+`
`+V)}else ee!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ee):(Z===""||le==="")&&(ae=!1);ae&&(B.diagnostics={runnable:de,programLog:ee,vertexShader:{log:Z,prefix:S},fragmentShader:{log:le,prefix:p}})}a.deleteShader(k),a.deleteShader(N),z=new ql(a,w),D=CE(a,w)}let z;this.getUniforms=function(){return z===void 0&&U(this),z};let D;this.getAttributes=function(){return D===void 0&&U(this),D};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=a.getProgramParameter(w,xE)),C},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(w),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=yE++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=k,this.fragmentShader=N,this}let BE=0;class HE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,r=e.fragmentShader,a=this._getShaderStage(t),l=this._getShaderStage(r),u=this._getShaderCacheForMaterial(e);return u.has(a)===!1&&(u.add(a),a.usedTimes++),u.has(l)===!1&&(u.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){const t=this.shaderCache;let r=t.get(e);return r===void 0&&(r=new VE(e),t.set(e,r)),r}}class VE{constructor(e){this.id=BE++,this.code=e,this.usedTimes=0}}function GE(s,e,t,r,a,l,u){const d=new bf,h=new HE,m=new Set,v=[],x=a.logarithmicDepthBuffer,_=a.vertexTextures;let y=a.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(D){return m.add(D),D===0?"uv":`uv${D}`}function S(D,C,B,ee,Z){const le=ee.fog,de=Z.geometry,ae=D.isMeshStandardMaterial?ee.environment:null,ue=(D.isMeshStandardMaterial?t:e).get(D.envMap||ae),V=ue&&ue.mapping===tc?ue.image.height:null,ce=E[D.type];D.precision!==null&&(y=a.getMaxPrecision(D.precision),y!==D.precision&&console.warn("THREE.WebGLProgram.getParameters:",D.precision,"not supported, using",y,"instead."));const oe=de.morphAttributes.position||de.morphAttributes.normal||de.morphAttributes.color,O=oe!==void 0?oe.length:0;let re=0;de.morphAttributes.position!==void 0&&(re=1),de.morphAttributes.normal!==void 0&&(re=2),de.morphAttributes.color!==void 0&&(re=3);let Ne,J,fe,Ee;if(ce){const yt=Pi[ce];Ne=yt.vertexShader,J=yt.fragmentShader}else Ne=D.vertexShader,J=D.fragmentShader,h.update(D),fe=h.getVertexShaderID(D),Ee=h.getFragmentShaderID(D);const xe=s.getRenderTarget(),Ae=s.state.buffers.depth.getReversed(),Ie=Z.isInstancedMesh===!0,Je=Z.isBatchedMesh===!0,bt=!!D.map,gt=!!D.matcap,Ut=!!ue,q=!!D.aoMap,wn=!!D.lightMap,pt=!!D.bumpMap,dt=!!D.normalMap,Ke=!!D.displacementMap,Rt=!!D.emissiveMap,qe=!!D.metalnessMap,I=!!D.roughnessMap,R=D.anisotropy>0,Q=D.clearcoat>0,me=D.dispersion>0,ve=D.iridescence>0,he=D.sheen>0,Ve=D.transmission>0,Re=R&&!!D.anisotropyMap,Ue=Q&&!!D.clearcoatMap,ut=Q&&!!D.clearcoatNormalMap,Se=Q&&!!D.clearcoatRoughnessMap,Oe=ve&&!!D.iridescenceMap,et=ve&&!!D.iridescenceThicknessMap,tt=he&&!!D.sheenColorMap,ze=he&&!!D.sheenRoughnessMap,ft=!!D.specularMap,st=!!D.specularColorMap,At=!!D.specularIntensityMap,j=Ve&&!!D.transmissionMap,Ce=Ve&&!!D.thicknessMap,se=!!D.gradientMap,pe=!!D.alphaMap,Le=D.alphaTest>0,Pe=!!D.alphaHash,ot=!!D.extensions;let kt=Ir;D.toneMapped&&(xe===null||xe.isXRRenderTarget===!0)&&(kt=s.toneMapping);const Jt={shaderID:ce,shaderType:D.type,shaderName:D.name,vertexShader:Ne,fragmentShader:J,defines:D.defines,customVertexShaderID:fe,customFragmentShaderID:Ee,isRawShaderMaterial:D.isRawShaderMaterial===!0,glslVersion:D.glslVersion,precision:y,batching:Je,batchingColor:Je&&Z._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&Z.instanceColor!==null,instancingMorph:Ie&&Z.morphTexture!==null,supportsVertexTextures:_,outputColorSpace:xe===null?s.outputColorSpace:xe.isXRRenderTarget===!0?xe.texture.colorSpace:uo,alphaToCoverage:!!D.alphaToCoverage,map:bt,matcap:gt,envMap:Ut,envMapMode:Ut&&ue.mapping,envMapCubeUVHeight:V,aoMap:q,lightMap:wn,bumpMap:pt,normalMap:dt,displacementMap:_&&Ke,emissiveMap:Rt,normalMapObjectSpace:dt&&D.normalMapType===F_,normalMapTangentSpace:dt&&D.normalMapType===Xg,metalnessMap:qe,roughnessMap:I,anisotropy:R,anisotropyMap:Re,clearcoat:Q,clearcoatMap:Ue,clearcoatNormalMap:ut,clearcoatRoughnessMap:Se,dispersion:me,iridescence:ve,iridescenceMap:Oe,iridescenceThicknessMap:et,sheen:he,sheenColorMap:tt,sheenRoughnessMap:ze,specularMap:ft,specularColorMap:st,specularIntensityMap:At,transmission:Ve,transmissionMap:j,thicknessMap:Ce,gradientMap:se,opaque:D.transparent===!1&&D.blending===Js&&D.alphaToCoverage===!1,alphaMap:pe,alphaTest:Le,alphaHash:Pe,combine:D.combine,mapUv:bt&&w(D.map.channel),aoMapUv:q&&w(D.aoMap.channel),lightMapUv:wn&&w(D.lightMap.channel),bumpMapUv:pt&&w(D.bumpMap.channel),normalMapUv:dt&&w(D.normalMap.channel),displacementMapUv:Ke&&w(D.displacementMap.channel),emissiveMapUv:Rt&&w(D.emissiveMap.channel),metalnessMapUv:qe&&w(D.metalnessMap.channel),roughnessMapUv:I&&w(D.roughnessMap.channel),anisotropyMapUv:Re&&w(D.anisotropyMap.channel),clearcoatMapUv:Ue&&w(D.clearcoatMap.channel),clearcoatNormalMapUv:ut&&w(D.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&w(D.clearcoatRoughnessMap.channel),iridescenceMapUv:Oe&&w(D.iridescenceMap.channel),iridescenceThicknessMapUv:et&&w(D.iridescenceThicknessMap.channel),sheenColorMapUv:tt&&w(D.sheenColorMap.channel),sheenRoughnessMapUv:ze&&w(D.sheenRoughnessMap.channel),specularMapUv:ft&&w(D.specularMap.channel),specularColorMapUv:st&&w(D.specularColorMap.channel),specularIntensityMapUv:At&&w(D.specularIntensityMap.channel),transmissionMapUv:j&&w(D.transmissionMap.channel),thicknessMapUv:Ce&&w(D.thicknessMap.channel),alphaMapUv:pe&&w(D.alphaMap.channel),vertexTangents:!!de.attributes.tangent&&(dt||R),vertexColors:D.vertexColors,vertexAlphas:D.vertexColors===!0&&!!de.attributes.color&&de.attributes.color.itemSize===4,pointsUvs:Z.isPoints===!0&&!!de.attributes.uv&&(bt||pe),fog:!!le,useFog:D.fog===!0,fogExp2:!!le&&le.isFogExp2,flatShading:D.flatShading===!0,sizeAttenuation:D.sizeAttenuation===!0,logarithmicDepthBuffer:x,reverseDepthBuffer:Ae,skinning:Z.isSkinnedMesh===!0,morphTargets:de.morphAttributes.position!==void 0,morphNormals:de.morphAttributes.normal!==void 0,morphColors:de.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:re,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:D.dithering,shadowMapEnabled:s.shadowMap.enabled&&B.length>0,shadowMapType:s.shadowMap.type,toneMapping:kt,decodeVideoTexture:bt&&D.map.isVideoTexture===!0&&Mt.getTransfer(D.map.colorSpace)===Lt,decodeVideoTextureEmissive:Rt&&D.emissiveMap.isVideoTexture===!0&&Mt.getTransfer(D.emissiveMap.colorSpace)===Lt,premultipliedAlpha:D.premultipliedAlpha,doubleSided:D.side===Li,flipSided:D.side===Wn,useDepthPacking:D.depthPacking>=0,depthPacking:D.depthPacking||0,index0AttributeName:D.index0AttributeName,extensionClipCullDistance:ot&&D.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ot&&D.extensions.multiDraw===!0||Je)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:D.customProgramCacheKey()};return Jt.vertexUv1s=m.has(1),Jt.vertexUv2s=m.has(2),Jt.vertexUv3s=m.has(3),m.clear(),Jt}function p(D){const C=[];if(D.shaderID?C.push(D.shaderID):(C.push(D.customVertexShaderID),C.push(D.customFragmentShaderID)),D.defines!==void 0)for(const B in D.defines)C.push(B),C.push(D.defines[B]);return D.isRawShaderMaterial===!1&&(b(C,D),L(C,D),C.push(s.outputColorSpace)),C.push(D.customProgramCacheKey),C.join()}function b(D,C){D.push(C.precision),D.push(C.outputColorSpace),D.push(C.envMapMode),D.push(C.envMapCubeUVHeight),D.push(C.mapUv),D.push(C.alphaMapUv),D.push(C.lightMapUv),D.push(C.aoMapUv),D.push(C.bumpMapUv),D.push(C.normalMapUv),D.push(C.displacementMapUv),D.push(C.emissiveMapUv),D.push(C.metalnessMapUv),D.push(C.roughnessMapUv),D.push(C.anisotropyMapUv),D.push(C.clearcoatMapUv),D.push(C.clearcoatNormalMapUv),D.push(C.clearcoatRoughnessMapUv),D.push(C.iridescenceMapUv),D.push(C.iridescenceThicknessMapUv),D.push(C.sheenColorMapUv),D.push(C.sheenRoughnessMapUv),D.push(C.specularMapUv),D.push(C.specularColorMapUv),D.push(C.specularIntensityMapUv),D.push(C.transmissionMapUv),D.push(C.thicknessMapUv),D.push(C.combine),D.push(C.fogExp2),D.push(C.sizeAttenuation),D.push(C.morphTargetsCount),D.push(C.morphAttributeCount),D.push(C.numDirLights),D.push(C.numPointLights),D.push(C.numSpotLights),D.push(C.numSpotLightMaps),D.push(C.numHemiLights),D.push(C.numRectAreaLights),D.push(C.numDirLightShadows),D.push(C.numPointLightShadows),D.push(C.numSpotLightShadows),D.push(C.numSpotLightShadowsWithMaps),D.push(C.numLightProbes),D.push(C.shadowMapType),D.push(C.toneMapping),D.push(C.numClippingPlanes),D.push(C.numClipIntersection),D.push(C.depthPacking)}function L(D,C){d.disableAll(),C.supportsVertexTextures&&d.enable(0),C.instancing&&d.enable(1),C.instancingColor&&d.enable(2),C.instancingMorph&&d.enable(3),C.matcap&&d.enable(4),C.envMap&&d.enable(5),C.normalMapObjectSpace&&d.enable(6),C.normalMapTangentSpace&&d.enable(7),C.clearcoat&&d.enable(8),C.iridescence&&d.enable(9),C.alphaTest&&d.enable(10),C.vertexColors&&d.enable(11),C.vertexAlphas&&d.enable(12),C.vertexUv1s&&d.enable(13),C.vertexUv2s&&d.enable(14),C.vertexUv3s&&d.enable(15),C.vertexTangents&&d.enable(16),C.anisotropy&&d.enable(17),C.alphaHash&&d.enable(18),C.batching&&d.enable(19),C.dispersion&&d.enable(20),C.batchingColor&&d.enable(21),D.push(d.mask),d.disableAll(),C.fog&&d.enable(0),C.useFog&&d.enable(1),C.flatShading&&d.enable(2),C.logarithmicDepthBuffer&&d.enable(3),C.reverseDepthBuffer&&d.enable(4),C.skinning&&d.enable(5),C.morphTargets&&d.enable(6),C.morphNormals&&d.enable(7),C.morphColors&&d.enable(8),C.premultipliedAlpha&&d.enable(9),C.shadowMapEnabled&&d.enable(10),C.doubleSided&&d.enable(11),C.flipSided&&d.enable(12),C.useDepthPacking&&d.enable(13),C.dithering&&d.enable(14),C.transmission&&d.enable(15),C.sheen&&d.enable(16),C.opaque&&d.enable(17),C.pointsUvs&&d.enable(18),C.decodeVideoTexture&&d.enable(19),C.decodeVideoTextureEmissive&&d.enable(20),C.alphaToCoverage&&d.enable(21),D.push(d.mask)}function A(D){const C=E[D.type];let B;if(C){const ee=Pi[C];B=Ax.clone(ee.uniforms)}else B=D.uniforms;return B}function k(D,C){let B;for(let ee=0,Z=v.length;ee<Z;ee++){const le=v[ee];if(le.cacheKey===C){B=le,++B.usedTimes;break}}return B===void 0&&(B=new kE(s,C,D,l),v.push(B)),B}function N(D){if(--D.usedTimes===0){const C=v.indexOf(D);v[C]=v[v.length-1],v.pop(),D.destroy()}}function U(D){h.remove(D)}function z(){h.dispose()}return{getParameters:S,getProgramCacheKey:p,getUniforms:A,acquireProgram:k,releaseProgram:N,releaseShaderCache:U,programs:v,dispose:z}}function WE(){let s=new WeakMap;function e(u){return s.has(u)}function t(u){let d=s.get(u);return d===void 0&&(d={},s.set(u,d)),d}function r(u){s.delete(u)}function a(u,d,h){s.get(u)[d]=h}function l(){s=new WeakMap}return{has:e,get:t,remove:r,update:a,dispose:l}}function jE(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function pg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function mg(){const s=[];let e=0;const t=[],r=[],a=[];function l(){e=0,t.length=0,r.length=0,a.length=0}function u(x,_,y,E,w,S){let p=s[e];return p===void 0?(p={id:x.id,object:x,geometry:_,material:y,groupOrder:E,renderOrder:x.renderOrder,z:w,group:S},s[e]=p):(p.id=x.id,p.object=x,p.geometry=_,p.material=y,p.groupOrder=E,p.renderOrder=x.renderOrder,p.z=w,p.group=S),e++,p}function d(x,_,y,E,w,S){const p=u(x,_,y,E,w,S);y.transmission>0?r.push(p):y.transparent===!0?a.push(p):t.push(p)}function h(x,_,y,E,w,S){const p=u(x,_,y,E,w,S);y.transmission>0?r.unshift(p):y.transparent===!0?a.unshift(p):t.unshift(p)}function m(x,_){t.length>1&&t.sort(x||jE),r.length>1&&r.sort(_||pg),a.length>1&&a.sort(_||pg)}function v(){for(let x=e,_=s.length;x<_;x++){const y=s[x];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:t,transmissive:r,transparent:a,init:l,push:d,unshift:h,finish:v,sort:m}}function XE(){let s=new WeakMap;function e(r,a){const l=s.get(r);let u;return l===void 0?(u=new mg,s.set(r,[u])):a>=l.length?(u=new mg,l.push(u)):u=l[a],u}function t(){s=new WeakMap}return{get:e,dispose:t}}function YE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new G,color:new xt};break;case"SpotLight":t={position:new G,direction:new G,color:new xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new G,color:new xt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new G,skyColor:new xt,groundColor:new xt};break;case"RectAreaLight":t={color:new xt,position:new G,halfWidth:new G,halfHeight:new G};break}return s[e.id]=t,t}}}function qE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let $E=0;function KE(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function ZE(s){const e=new YE,t=qE(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)r.probe.push(new G);const a=new G,l=new zt,u=new zt;function d(m){let v=0,x=0,_=0;for(let D=0;D<9;D++)r.probe[D].set(0,0,0);let y=0,E=0,w=0,S=0,p=0,b=0,L=0,A=0,k=0,N=0,U=0;m.sort(KE);for(let D=0,C=m.length;D<C;D++){const B=m[D],ee=B.color,Z=B.intensity,le=B.distance,de=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)v+=ee.r*Z,x+=ee.g*Z,_+=ee.b*Z;else if(B.isLightProbe){for(let ae=0;ae<9;ae++)r.probe[ae].addScaledVector(B.sh.coefficients[ae],Z);U++}else if(B.isDirectionalLight){const ae=e.get(B);if(ae.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const ue=B.shadow,V=t.get(B);V.shadowIntensity=ue.intensity,V.shadowBias=ue.bias,V.shadowNormalBias=ue.normalBias,V.shadowRadius=ue.radius,V.shadowMapSize=ue.mapSize,r.directionalShadow[y]=V,r.directionalShadowMap[y]=de,r.directionalShadowMatrix[y]=B.shadow.matrix,b++}r.directional[y]=ae,y++}else if(B.isSpotLight){const ae=e.get(B);ae.position.setFromMatrixPosition(B.matrixWorld),ae.color.copy(ee).multiplyScalar(Z),ae.distance=le,ae.coneCos=Math.cos(B.angle),ae.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),ae.decay=B.decay,r.spot[w]=ae;const ue=B.shadow;if(B.map&&(r.spotLightMap[k]=B.map,k++,ue.updateMatrices(B),B.castShadow&&N++),r.spotLightMatrix[w]=ue.matrix,B.castShadow){const V=t.get(B);V.shadowIntensity=ue.intensity,V.shadowBias=ue.bias,V.shadowNormalBias=ue.normalBias,V.shadowRadius=ue.radius,V.shadowMapSize=ue.mapSize,r.spotShadow[w]=V,r.spotShadowMap[w]=de,A++}w++}else if(B.isRectAreaLight){const ae=e.get(B);ae.color.copy(ee).multiplyScalar(Z),ae.halfWidth.set(B.width*.5,0,0),ae.halfHeight.set(0,B.height*.5,0),r.rectArea[S]=ae,S++}else if(B.isPointLight){const ae=e.get(B);if(ae.color.copy(B.color).multiplyScalar(B.intensity),ae.distance=B.distance,ae.decay=B.decay,B.castShadow){const ue=B.shadow,V=t.get(B);V.shadowIntensity=ue.intensity,V.shadowBias=ue.bias,V.shadowNormalBias=ue.normalBias,V.shadowRadius=ue.radius,V.shadowMapSize=ue.mapSize,V.shadowCameraNear=ue.camera.near,V.shadowCameraFar=ue.camera.far,r.pointShadow[E]=V,r.pointShadowMap[E]=de,r.pointShadowMatrix[E]=B.shadow.matrix,L++}r.point[E]=ae,E++}else if(B.isHemisphereLight){const ae=e.get(B);ae.skyColor.copy(B.color).multiplyScalar(Z),ae.groundColor.copy(B.groundColor).multiplyScalar(Z),r.hemi[p]=ae,p++}}S>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=be.LTC_FLOAT_1,r.rectAreaLTC2=be.LTC_FLOAT_2):(r.rectAreaLTC1=be.LTC_HALF_1,r.rectAreaLTC2=be.LTC_HALF_2)),r.ambient[0]=v,r.ambient[1]=x,r.ambient[2]=_;const z=r.hash;(z.directionalLength!==y||z.pointLength!==E||z.spotLength!==w||z.rectAreaLength!==S||z.hemiLength!==p||z.numDirectionalShadows!==b||z.numPointShadows!==L||z.numSpotShadows!==A||z.numSpotMaps!==k||z.numLightProbes!==U)&&(r.directional.length=y,r.spot.length=w,r.rectArea.length=S,r.point.length=E,r.hemi.length=p,r.directionalShadow.length=b,r.directionalShadowMap.length=b,r.pointShadow.length=L,r.pointShadowMap.length=L,r.spotShadow.length=A,r.spotShadowMap.length=A,r.directionalShadowMatrix.length=b,r.pointShadowMatrix.length=L,r.spotLightMatrix.length=A+k-N,r.spotLightMap.length=k,r.numSpotLightShadowsWithMaps=N,r.numLightProbes=U,z.directionalLength=y,z.pointLength=E,z.spotLength=w,z.rectAreaLength=S,z.hemiLength=p,z.numDirectionalShadows=b,z.numPointShadows=L,z.numSpotShadows=A,z.numSpotMaps=k,z.numLightProbes=U,r.version=$E++)}function h(m,v){let x=0,_=0,y=0,E=0,w=0;const S=v.matrixWorldInverse;for(let p=0,b=m.length;p<b;p++){const L=m[p];if(L.isDirectionalLight){const A=r.directional[x];A.direction.setFromMatrixPosition(L.matrixWorld),a.setFromMatrixPosition(L.target.matrixWorld),A.direction.sub(a),A.direction.transformDirection(S),x++}else if(L.isSpotLight){const A=r.spot[y];A.position.setFromMatrixPosition(L.matrixWorld),A.position.applyMatrix4(S),A.direction.setFromMatrixPosition(L.matrixWorld),a.setFromMatrixPosition(L.target.matrixWorld),A.direction.sub(a),A.direction.transformDirection(S),y++}else if(L.isRectAreaLight){const A=r.rectArea[E];A.position.setFromMatrixPosition(L.matrixWorld),A.position.applyMatrix4(S),u.identity(),l.copy(L.matrixWorld),l.premultiply(S),u.extractRotation(l),A.halfWidth.set(L.width*.5,0,0),A.halfHeight.set(0,L.height*.5,0),A.halfWidth.applyMatrix4(u),A.halfHeight.applyMatrix4(u),E++}else if(L.isPointLight){const A=r.point[_];A.position.setFromMatrixPosition(L.matrixWorld),A.position.applyMatrix4(S),_++}else if(L.isHemisphereLight){const A=r.hemi[w];A.direction.setFromMatrixPosition(L.matrixWorld),A.direction.transformDirection(S),w++}}}return{setup:d,setupView:h,state:r}}function gg(s){const e=new ZE(s),t=[],r=[];function a(v){m.camera=v,t.length=0,r.length=0}function l(v){t.push(v)}function u(v){r.push(v)}function d(){e.setup(t)}function h(v){e.setupView(t,v)}const m={lightsArray:t,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:m,setupLights:d,setupLightsView:h,pushLight:l,pushShadow:u}}function QE(s){let e=new WeakMap;function t(a,l=0){const u=e.get(a);let d;return u===void 0?(d=new gg(s),e.set(a,[d])):l>=u.length?(d=new gg(s),u.push(d)):d=u[l],d}function r(){e=new WeakMap}return{get:t,dispose:r}}class JE extends po{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=I_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class e1 extends po{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const t1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,n1=`uniform sampler2D shadow_pass;
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
}`;function i1(s,e,t){let r=new Pf;const a=new mt,l=new mt,u=new Nt,d=new JE({depthPacking:U_}),h=new e1,m={},v=t.maxTextureSize,x={[Ur]:Wn,[Wn]:Ur,[Li]:Li},_=new Fr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new mt},radius:{value:4}},vertexShader:t1,fragmentShader:n1}),y=_.clone();y.defines.HORIZONTAL_PASS=1;const E=new Nn;E.setAttribute("position",new Mi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new Ot(E,_),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lg;let p=this.type;this.render=function(N,U,z){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||N.length===0)return;const D=s.getRenderTarget(),C=s.getActiveCubeFace(),B=s.getActiveMipmapLevel(),ee=s.state;ee.setBlending(Nr),ee.buffers.color.setClear(1,1,1,1),ee.buffers.depth.setTest(!0),ee.setScissorTest(!1);const Z=p!==Qi&&this.type===Qi,le=p===Qi&&this.type!==Qi;for(let de=0,ae=N.length;de<ae;de++){const ue=N[de],V=ue.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",ue,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;a.copy(V.mapSize);const ce=V.getFrameExtents();if(a.multiply(ce),l.copy(V.mapSize),(a.x>v||a.y>v)&&(a.x>v&&(l.x=Math.floor(v/ce.x),a.x=l.x*ce.x,V.mapSize.x=l.x),a.y>v&&(l.y=Math.floor(v/ce.y),a.y=l.y*ce.y,V.mapSize.y=l.y)),V.map===null||Z===!0||le===!0){const O=this.type!==Qi?{minFilter:Si,magFilter:Si}:{};V.map!==null&&V.map.dispose(),V.map=new ds(a.x,a.y,O),V.map.texture.name=ue.name+".shadowMap",V.camera.updateProjectionMatrix()}s.setRenderTarget(V.map),s.clear();const oe=V.getViewportCount();for(let O=0;O<oe;O++){const re=V.getViewport(O);u.set(l.x*re.x,l.y*re.y,l.x*re.z,l.y*re.w),ee.viewport(u),V.updateMatrices(ue,O),r=V.getFrustum(),A(U,z,V.camera,ue,this.type)}V.isPointLightShadow!==!0&&this.type===Qi&&b(V,z),V.needsUpdate=!1}p=this.type,S.needsUpdate=!1,s.setRenderTarget(D,C,B)};function b(N,U){const z=e.update(w);_.defines.VSM_SAMPLES!==N.blurSamples&&(_.defines.VSM_SAMPLES=N.blurSamples,y.defines.VSM_SAMPLES=N.blurSamples,_.needsUpdate=!0,y.needsUpdate=!0),N.mapPass===null&&(N.mapPass=new ds(a.x,a.y)),_.uniforms.shadow_pass.value=N.map.texture,_.uniforms.resolution.value=N.mapSize,_.uniforms.radius.value=N.radius,s.setRenderTarget(N.mapPass),s.clear(),s.renderBufferDirect(U,null,z,_,w,null),y.uniforms.shadow_pass.value=N.mapPass.texture,y.uniforms.resolution.value=N.mapSize,y.uniforms.radius.value=N.radius,s.setRenderTarget(N.map),s.clear(),s.renderBufferDirect(U,null,z,y,w,null)}function L(N,U,z,D){let C=null;const B=z.isPointLight===!0?N.customDistanceMaterial:N.customDepthMaterial;if(B!==void 0)C=B;else if(C=z.isPointLight===!0?h:d,s.localClippingEnabled&&U.clipShadows===!0&&Array.isArray(U.clippingPlanes)&&U.clippingPlanes.length!==0||U.displacementMap&&U.displacementScale!==0||U.alphaMap&&U.alphaTest>0||U.map&&U.alphaTest>0){const ee=C.uuid,Z=U.uuid;let le=m[ee];le===void 0&&(le={},m[ee]=le);let de=le[Z];de===void 0&&(de=C.clone(),le[Z]=de,U.addEventListener("dispose",k)),C=de}if(C.visible=U.visible,C.wireframe=U.wireframe,D===Qi?C.side=U.shadowSide!==null?U.shadowSide:U.side:C.side=U.shadowSide!==null?U.shadowSide:x[U.side],C.alphaMap=U.alphaMap,C.alphaTest=U.alphaTest,C.map=U.map,C.clipShadows=U.clipShadows,C.clippingPlanes=U.clippingPlanes,C.clipIntersection=U.clipIntersection,C.displacementMap=U.displacementMap,C.displacementScale=U.displacementScale,C.displacementBias=U.displacementBias,C.wireframeLinewidth=U.wireframeLinewidth,C.linewidth=U.linewidth,z.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const ee=s.properties.get(C);ee.light=z}return C}function A(N,U,z,D,C){if(N.visible===!1)return;if(N.layers.test(U.layers)&&(N.isMesh||N.isLine||N.isPoints)&&(N.castShadow||N.receiveShadow&&C===Qi)&&(!N.frustumCulled||r.intersectsObject(N))){N.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,N.matrixWorld);const Z=e.update(N),le=N.material;if(Array.isArray(le)){const de=Z.groups;for(let ae=0,ue=de.length;ae<ue;ae++){const V=de[ae],ce=le[V.materialIndex];if(ce&&ce.visible){const oe=L(N,ce,D,C);N.onBeforeShadow(s,N,U,z,Z,oe,V),s.renderBufferDirect(z,null,Z,oe,N,V),N.onAfterShadow(s,N,U,z,Z,oe,V)}}}else if(le.visible){const de=L(N,le,D,C);N.onBeforeShadow(s,N,U,z,Z,de,null),s.renderBufferDirect(z,null,Z,de,N,null),N.onAfterShadow(s,N,U,z,Z,de,null)}}const ee=N.children;for(let Z=0,le=ee.length;Z<le;Z++)A(ee[Z],U,z,D,C)}function k(N){N.target.removeEventListener("dispose",k);for(const z in m){const D=m[z],C=N.target.uuid;C in D&&(D[C].dispose(),delete D[C])}}}const r1={[Ld]:Dd,[Nd]:Fd,[Id]:Od,[io]:Ud,[Dd]:Ld,[Fd]:Nd,[Od]:Id,[Ud]:io};function s1(s,e){function t(){let j=!1;const Ce=new Nt;let se=null;const pe=new Nt(0,0,0,0);return{setMask:function(Le){se!==Le&&!j&&(s.colorMask(Le,Le,Le,Le),se=Le)},setLocked:function(Le){j=Le},setClear:function(Le,Pe,ot,kt,Jt){Jt===!0&&(Le*=kt,Pe*=kt,ot*=kt),Ce.set(Le,Pe,ot,kt),pe.equals(Ce)===!1&&(s.clearColor(Le,Pe,ot,kt),pe.copy(Ce))},reset:function(){j=!1,se=null,pe.set(-1,0,0,0)}}}function r(){let j=!1,Ce=!1,se=null,pe=null,Le=null;return{setReversed:function(Pe){if(Ce!==Pe){const ot=e.get("EXT_clip_control");Ce?ot.clipControlEXT(ot.LOWER_LEFT_EXT,ot.ZERO_TO_ONE_EXT):ot.clipControlEXT(ot.LOWER_LEFT_EXT,ot.NEGATIVE_ONE_TO_ONE_EXT);const kt=Le;Le=null,this.setClear(kt)}Ce=Pe},getReversed:function(){return Ce},setTest:function(Pe){Pe?xe(s.DEPTH_TEST):Ae(s.DEPTH_TEST)},setMask:function(Pe){se!==Pe&&!j&&(s.depthMask(Pe),se=Pe)},setFunc:function(Pe){if(Ce&&(Pe=r1[Pe]),pe!==Pe){switch(Pe){case Ld:s.depthFunc(s.NEVER);break;case Dd:s.depthFunc(s.ALWAYS);break;case Nd:s.depthFunc(s.LESS);break;case io:s.depthFunc(s.LEQUAL);break;case Id:s.depthFunc(s.EQUAL);break;case Ud:s.depthFunc(s.GEQUAL);break;case Fd:s.depthFunc(s.GREATER);break;case Od:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}pe=Pe}},setLocked:function(Pe){j=Pe},setClear:function(Pe){Le!==Pe&&(Ce&&(Pe=1-Pe),s.clearDepth(Pe),Le=Pe)},reset:function(){j=!1,se=null,pe=null,Le=null,Ce=!1}}}function a(){let j=!1,Ce=null,se=null,pe=null,Le=null,Pe=null,ot=null,kt=null,Jt=null;return{setTest:function(yt){j||(yt?xe(s.STENCIL_TEST):Ae(s.STENCIL_TEST))},setMask:function(yt){Ce!==yt&&!j&&(s.stencilMask(yt),Ce=yt)},setFunc:function(yt,In,Tn){(se!==yt||pe!==In||Le!==Tn)&&(s.stencilFunc(yt,In,Tn),se=yt,pe=In,Le=Tn)},setOp:function(yt,In,Tn){(Pe!==yt||ot!==In||kt!==Tn)&&(s.stencilOp(yt,In,Tn),Pe=yt,ot=In,kt=Tn)},setLocked:function(yt){j=yt},setClear:function(yt){Jt!==yt&&(s.clearStencil(yt),Jt=yt)},reset:function(){j=!1,Ce=null,se=null,pe=null,Le=null,Pe=null,ot=null,kt=null,Jt=null}}}const l=new t,u=new r,d=new a,h=new WeakMap,m=new WeakMap;let v={},x={},_=new WeakMap,y=[],E=null,w=!1,S=null,p=null,b=null,L=null,A=null,k=null,N=null,U=new xt(0,0,0),z=0,D=!1,C=null,B=null,ee=null,Z=null,le=null;const de=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ae=!1,ue=0;const V=s.getParameter(s.VERSION);V.indexOf("WebGL")!==-1?(ue=parseFloat(/^WebGL (\d)/.exec(V)[1]),ae=ue>=1):V.indexOf("OpenGL ES")!==-1&&(ue=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),ae=ue>=2);let ce=null,oe={};const O=s.getParameter(s.SCISSOR_BOX),re=s.getParameter(s.VIEWPORT),Ne=new Nt().fromArray(O),J=new Nt().fromArray(re);function fe(j,Ce,se,pe){const Le=new Uint8Array(4),Pe=s.createTexture();s.bindTexture(j,Pe),s.texParameteri(j,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(j,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ot=0;ot<se;ot++)j===s.TEXTURE_3D||j===s.TEXTURE_2D_ARRAY?s.texImage3D(Ce,0,s.RGBA,1,1,pe,0,s.RGBA,s.UNSIGNED_BYTE,Le):s.texImage2D(Ce+ot,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Le);return Pe}const Ee={};Ee[s.TEXTURE_2D]=fe(s.TEXTURE_2D,s.TEXTURE_2D,1),Ee[s.TEXTURE_CUBE_MAP]=fe(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ee[s.TEXTURE_2D_ARRAY]=fe(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Ee[s.TEXTURE_3D]=fe(s.TEXTURE_3D,s.TEXTURE_3D,1,1),l.setClear(0,0,0,1),u.setClear(1),d.setClear(0),xe(s.DEPTH_TEST),u.setFunc(io),pt(!1),dt(_m),xe(s.CULL_FACE),q(Nr);function xe(j){v[j]!==!0&&(s.enable(j),v[j]=!0)}function Ae(j){v[j]!==!1&&(s.disable(j),v[j]=!1)}function Ie(j,Ce){return x[j]!==Ce?(s.bindFramebuffer(j,Ce),x[j]=Ce,j===s.DRAW_FRAMEBUFFER&&(x[s.FRAMEBUFFER]=Ce),j===s.FRAMEBUFFER&&(x[s.DRAW_FRAMEBUFFER]=Ce),!0):!1}function Je(j,Ce){let se=y,pe=!1;if(j){se=_.get(Ce),se===void 0&&(se=[],_.set(Ce,se));const Le=j.textures;if(se.length!==Le.length||se[0]!==s.COLOR_ATTACHMENT0){for(let Pe=0,ot=Le.length;Pe<ot;Pe++)se[Pe]=s.COLOR_ATTACHMENT0+Pe;se.length=Le.length,pe=!0}}else se[0]!==s.BACK&&(se[0]=s.BACK,pe=!0);pe&&s.drawBuffers(se)}function bt(j){return E!==j?(s.useProgram(j),E=j,!0):!1}const gt={[ss]:s.FUNC_ADD,[l_]:s.FUNC_SUBTRACT,[c_]:s.FUNC_REVERSE_SUBTRACT};gt[u_]=s.MIN,gt[d_]=s.MAX;const Ut={[f_]:s.ZERO,[h_]:s.ONE,[p_]:s.SRC_COLOR,[bd]:s.SRC_ALPHA,[y_]:s.SRC_ALPHA_SATURATE,[__]:s.DST_COLOR,[g_]:s.DST_ALPHA,[m_]:s.ONE_MINUS_SRC_COLOR,[Pd]:s.ONE_MINUS_SRC_ALPHA,[x_]:s.ONE_MINUS_DST_COLOR,[v_]:s.ONE_MINUS_DST_ALPHA,[S_]:s.CONSTANT_COLOR,[M_]:s.ONE_MINUS_CONSTANT_COLOR,[E_]:s.CONSTANT_ALPHA,[w_]:s.ONE_MINUS_CONSTANT_ALPHA};function q(j,Ce,se,pe,Le,Pe,ot,kt,Jt,yt){if(j===Nr){w===!0&&(Ae(s.BLEND),w=!1);return}if(w===!1&&(xe(s.BLEND),w=!0),j!==a_){if(j!==S||yt!==D){if((p!==ss||A!==ss)&&(s.blendEquation(s.FUNC_ADD),p=ss,A=ss),yt)switch(j){case Js:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case xm:s.blendFunc(s.ONE,s.ONE);break;case ym:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Sm:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case Js:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case xm:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case ym:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Sm:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}b=null,L=null,k=null,N=null,U.set(0,0,0),z=0,S=j,D=yt}return}Le=Le||Ce,Pe=Pe||se,ot=ot||pe,(Ce!==p||Le!==A)&&(s.blendEquationSeparate(gt[Ce],gt[Le]),p=Ce,A=Le),(se!==b||pe!==L||Pe!==k||ot!==N)&&(s.blendFuncSeparate(Ut[se],Ut[pe],Ut[Pe],Ut[ot]),b=se,L=pe,k=Pe,N=ot),(kt.equals(U)===!1||Jt!==z)&&(s.blendColor(kt.r,kt.g,kt.b,Jt),U.copy(kt),z=Jt),S=j,D=!1}function wn(j,Ce){j.side===Li?Ae(s.CULL_FACE):xe(s.CULL_FACE);let se=j.side===Wn;Ce&&(se=!se),pt(se),j.blending===Js&&j.transparent===!1?q(Nr):q(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),u.setFunc(j.depthFunc),u.setTest(j.depthTest),u.setMask(j.depthWrite),l.setMask(j.colorWrite);const pe=j.stencilWrite;d.setTest(pe),pe&&(d.setMask(j.stencilWriteMask),d.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),d.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),Rt(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?xe(s.SAMPLE_ALPHA_TO_COVERAGE):Ae(s.SAMPLE_ALPHA_TO_COVERAGE)}function pt(j){C!==j&&(j?s.frontFace(s.CW):s.frontFace(s.CCW),C=j)}function dt(j){j!==s_?(xe(s.CULL_FACE),j!==B&&(j===_m?s.cullFace(s.BACK):j===o_?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ae(s.CULL_FACE),B=j}function Ke(j){j!==ee&&(ae&&s.lineWidth(j),ee=j)}function Rt(j,Ce,se){j?(xe(s.POLYGON_OFFSET_FILL),(Z!==Ce||le!==se)&&(s.polygonOffset(Ce,se),Z=Ce,le=se)):Ae(s.POLYGON_OFFSET_FILL)}function qe(j){j?xe(s.SCISSOR_TEST):Ae(s.SCISSOR_TEST)}function I(j){j===void 0&&(j=s.TEXTURE0+de-1),ce!==j&&(s.activeTexture(j),ce=j)}function R(j,Ce,se){se===void 0&&(ce===null?se=s.TEXTURE0+de-1:se=ce);let pe=oe[se];pe===void 0&&(pe={type:void 0,texture:void 0},oe[se]=pe),(pe.type!==j||pe.texture!==Ce)&&(ce!==se&&(s.activeTexture(se),ce=se),s.bindTexture(j,Ce||Ee[j]),pe.type=j,pe.texture=Ce)}function Q(){const j=oe[ce];j!==void 0&&j.type!==void 0&&(s.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function me(){try{s.compressedTexImage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ve(){try{s.compressedTexImage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function he(){try{s.texSubImage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ve(){try{s.texSubImage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Re(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ue(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ut(){try{s.texStorage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Se(){try{s.texStorage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Oe(){try{s.texImage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function et(){try{s.texImage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function tt(j){Ne.equals(j)===!1&&(s.scissor(j.x,j.y,j.z,j.w),Ne.copy(j))}function ze(j){J.equals(j)===!1&&(s.viewport(j.x,j.y,j.z,j.w),J.copy(j))}function ft(j,Ce){let se=m.get(Ce);se===void 0&&(se=new WeakMap,m.set(Ce,se));let pe=se.get(j);pe===void 0&&(pe=s.getUniformBlockIndex(Ce,j.name),se.set(j,pe))}function st(j,Ce){const pe=m.get(Ce).get(j);h.get(Ce)!==pe&&(s.uniformBlockBinding(Ce,pe,j.__bindingPointIndex),h.set(Ce,pe))}function At(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),u.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),v={},ce=null,oe={},x={},_=new WeakMap,y=[],E=null,w=!1,S=null,p=null,b=null,L=null,A=null,k=null,N=null,U=new xt(0,0,0),z=0,D=!1,C=null,B=null,ee=null,Z=null,le=null,Ne.set(0,0,s.canvas.width,s.canvas.height),J.set(0,0,s.canvas.width,s.canvas.height),l.reset(),u.reset(),d.reset()}return{buffers:{color:l,depth:u,stencil:d},enable:xe,disable:Ae,bindFramebuffer:Ie,drawBuffers:Je,useProgram:bt,setBlending:q,setMaterial:wn,setFlipSided:pt,setCullFace:dt,setLineWidth:Ke,setPolygonOffset:Rt,setScissorTest:qe,activeTexture:I,bindTexture:R,unbindTexture:Q,compressedTexImage2D:me,compressedTexImage3D:ve,texImage2D:Oe,texImage3D:et,updateUBOMapping:ft,uniformBlockBinding:st,texStorage2D:ut,texStorage3D:Se,texSubImage2D:he,texSubImage3D:Ve,compressedTexSubImage2D:Re,compressedTexSubImage3D:Ue,scissor:tt,viewport:ze,reset:At}}function vg(s,e,t,r){const a=o1(r);switch(t){case kg:return s*e;case Hg:return s*e;case Vg:return s*e*2;case Gg:return s*e/a.components*a.byteLength;case wf:return s*e/a.components*a.byteLength;case Wg:return s*e*2/a.components*a.byteLength;case Tf:return s*e*2/a.components*a.byteLength;case Bg:return s*e*3/a.components*a.byteLength;case xi:return s*e*4/a.components*a.byteLength;case Af:return s*e*4/a.components*a.byteLength;case Gl:case Wl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case jl:case Xl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Vd:case Wd:return Math.max(s,16)*Math.max(e,8)/4;case Hd:case Gd:return Math.max(s,8)*Math.max(e,8)/2;case jd:case Xd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Yd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case qd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case $d:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Kd:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Zd:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Qd:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Jd:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case ef:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case tf:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case nf:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case rf:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case sf:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case of:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case af:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case lf:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Yl:case cf:case uf:return Math.ceil(s/4)*Math.ceil(e/4)*16;case jg:case df:return Math.ceil(s/4)*Math.ceil(e/4)*8;case ff:case hf:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function o1(s){switch(s){case ir:case Fg:return{byteLength:1,components:1};case aa:case Og:case ua:return{byteLength:2,components:1};case Mf:case Ef:return{byteLength:2,components:4};case us:case Sf:case er:return{byteLength:4,components:1};case zg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function a1(s,e,t,r,a,l,u){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new mt,v=new WeakMap;let x;const _=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(I,R){return y?new OffscreenCanvas(I,R):Zl("canvas")}function w(I,R,Q){let me=1;const ve=qe(I);if((ve.width>Q||ve.height>Q)&&(me=Q/Math.max(ve.width,ve.height)),me<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const he=Math.floor(me*ve.width),Ve=Math.floor(me*ve.height);x===void 0&&(x=E(he,Ve));const Re=R?E(he,Ve):x;return Re.width=he,Re.height=Ve,Re.getContext("2d").drawImage(I,0,0,he,Ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ve.width+"x"+ve.height+") to ("+he+"x"+Ve+")."),Re}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ve.width+"x"+ve.height+")."),I;return I}function S(I){return I.generateMipmaps}function p(I){s.generateMipmap(I)}function b(I){return I.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?s.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function L(I,R,Q,me,ve=!1){if(I!==null){if(s[I]!==void 0)return s[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let he=R;if(R===s.RED&&(Q===s.FLOAT&&(he=s.R32F),Q===s.HALF_FLOAT&&(he=s.R16F),Q===s.UNSIGNED_BYTE&&(he=s.R8)),R===s.RED_INTEGER&&(Q===s.UNSIGNED_BYTE&&(he=s.R8UI),Q===s.UNSIGNED_SHORT&&(he=s.R16UI),Q===s.UNSIGNED_INT&&(he=s.R32UI),Q===s.BYTE&&(he=s.R8I),Q===s.SHORT&&(he=s.R16I),Q===s.INT&&(he=s.R32I)),R===s.RG&&(Q===s.FLOAT&&(he=s.RG32F),Q===s.HALF_FLOAT&&(he=s.RG16F),Q===s.UNSIGNED_BYTE&&(he=s.RG8)),R===s.RG_INTEGER&&(Q===s.UNSIGNED_BYTE&&(he=s.RG8UI),Q===s.UNSIGNED_SHORT&&(he=s.RG16UI),Q===s.UNSIGNED_INT&&(he=s.RG32UI),Q===s.BYTE&&(he=s.RG8I),Q===s.SHORT&&(he=s.RG16I),Q===s.INT&&(he=s.RG32I)),R===s.RGB_INTEGER&&(Q===s.UNSIGNED_BYTE&&(he=s.RGB8UI),Q===s.UNSIGNED_SHORT&&(he=s.RGB16UI),Q===s.UNSIGNED_INT&&(he=s.RGB32UI),Q===s.BYTE&&(he=s.RGB8I),Q===s.SHORT&&(he=s.RGB16I),Q===s.INT&&(he=s.RGB32I)),R===s.RGBA_INTEGER&&(Q===s.UNSIGNED_BYTE&&(he=s.RGBA8UI),Q===s.UNSIGNED_SHORT&&(he=s.RGBA16UI),Q===s.UNSIGNED_INT&&(he=s.RGBA32UI),Q===s.BYTE&&(he=s.RGBA8I),Q===s.SHORT&&(he=s.RGBA16I),Q===s.INT&&(he=s.RGBA32I)),R===s.RGB&&Q===s.UNSIGNED_INT_5_9_9_9_REV&&(he=s.RGB9_E5),R===s.RGBA){const Ve=ve?nc:Mt.getTransfer(me);Q===s.FLOAT&&(he=s.RGBA32F),Q===s.HALF_FLOAT&&(he=s.RGBA16F),Q===s.UNSIGNED_BYTE&&(he=Ve===Lt?s.SRGB8_ALPHA8:s.RGBA8),Q===s.UNSIGNED_SHORT_4_4_4_4&&(he=s.RGBA4),Q===s.UNSIGNED_SHORT_5_5_5_1&&(he=s.RGB5_A1)}return(he===s.R16F||he===s.R32F||he===s.RG16F||he===s.RG32F||he===s.RGBA16F||he===s.RGBA32F)&&e.get("EXT_color_buffer_float"),he}function A(I,R){let Q;return I?R===null||R===us||R===oo?Q=s.DEPTH24_STENCIL8:R===er?Q=s.DEPTH32F_STENCIL8:R===aa&&(Q=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===us||R===oo?Q=s.DEPTH_COMPONENT24:R===er?Q=s.DEPTH_COMPONENT32F:R===aa&&(Q=s.DEPTH_COMPONENT16),Q}function k(I,R){return S(I)===!0||I.isFramebufferTexture&&I.minFilter!==Si&&I.minFilter!==Di?Math.log2(Math.max(R.width,R.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?R.mipmaps.length:1}function N(I){const R=I.target;R.removeEventListener("dispose",N),z(R),R.isVideoTexture&&v.delete(R)}function U(I){const R=I.target;R.removeEventListener("dispose",U),C(R)}function z(I){const R=r.get(I);if(R.__webglInit===void 0)return;const Q=I.source,me=_.get(Q);if(me){const ve=me[R.__cacheKey];ve.usedTimes--,ve.usedTimes===0&&D(I),Object.keys(me).length===0&&_.delete(Q)}r.remove(I)}function D(I){const R=r.get(I);s.deleteTexture(R.__webglTexture);const Q=I.source,me=_.get(Q);delete me[R.__cacheKey],u.memory.textures--}function C(I){const R=r.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),r.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let me=0;me<6;me++){if(Array.isArray(R.__webglFramebuffer[me]))for(let ve=0;ve<R.__webglFramebuffer[me].length;ve++)s.deleteFramebuffer(R.__webglFramebuffer[me][ve]);else s.deleteFramebuffer(R.__webglFramebuffer[me]);R.__webglDepthbuffer&&s.deleteRenderbuffer(R.__webglDepthbuffer[me])}else{if(Array.isArray(R.__webglFramebuffer))for(let me=0;me<R.__webglFramebuffer.length;me++)s.deleteFramebuffer(R.__webglFramebuffer[me]);else s.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&s.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&s.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let me=0;me<R.__webglColorRenderbuffer.length;me++)R.__webglColorRenderbuffer[me]&&s.deleteRenderbuffer(R.__webglColorRenderbuffer[me]);R.__webglDepthRenderbuffer&&s.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const Q=I.textures;for(let me=0,ve=Q.length;me<ve;me++){const he=r.get(Q[me]);he.__webglTexture&&(s.deleteTexture(he.__webglTexture),u.memory.textures--),r.remove(Q[me])}r.remove(I)}let B=0;function ee(){B=0}function Z(){const I=B;return I>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+a.maxTextures),B+=1,I}function le(I){const R=[];return R.push(I.wrapS),R.push(I.wrapT),R.push(I.wrapR||0),R.push(I.magFilter),R.push(I.minFilter),R.push(I.anisotropy),R.push(I.internalFormat),R.push(I.format),R.push(I.type),R.push(I.generateMipmaps),R.push(I.premultiplyAlpha),R.push(I.flipY),R.push(I.unpackAlignment),R.push(I.colorSpace),R.join()}function de(I,R){const Q=r.get(I);if(I.isVideoTexture&&Ke(I),I.isRenderTargetTexture===!1&&I.version>0&&Q.__version!==I.version){const me=I.image;if(me===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(me.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(Q,I,R);return}}t.bindTexture(s.TEXTURE_2D,Q.__webglTexture,s.TEXTURE0+R)}function ae(I,R){const Q=r.get(I);if(I.version>0&&Q.__version!==I.version){J(Q,I,R);return}t.bindTexture(s.TEXTURE_2D_ARRAY,Q.__webglTexture,s.TEXTURE0+R)}function ue(I,R){const Q=r.get(I);if(I.version>0&&Q.__version!==I.version){J(Q,I,R);return}t.bindTexture(s.TEXTURE_3D,Q.__webglTexture,s.TEXTURE0+R)}function V(I,R){const Q=r.get(I);if(I.version>0&&Q.__version!==I.version){fe(Q,I,R);return}t.bindTexture(s.TEXTURE_CUBE_MAP,Q.__webglTexture,s.TEXTURE0+R)}const ce={[$l]:s.REPEAT,[as]:s.CLAMP_TO_EDGE,[Bd]:s.MIRRORED_REPEAT},oe={[Si]:s.NEAREST,[N_]:s.NEAREST_MIPMAP_NEAREST,[xl]:s.NEAREST_MIPMAP_LINEAR,[Di]:s.LINEAR,[Wu]:s.LINEAR_MIPMAP_NEAREST,[ls]:s.LINEAR_MIPMAP_LINEAR},O={[O_]:s.NEVER,[G_]:s.ALWAYS,[z_]:s.LESS,[Yg]:s.LEQUAL,[k_]:s.EQUAL,[V_]:s.GEQUAL,[B_]:s.GREATER,[H_]:s.NOTEQUAL};function re(I,R){if(R.type===er&&e.has("OES_texture_float_linear")===!1&&(R.magFilter===Di||R.magFilter===Wu||R.magFilter===xl||R.magFilter===ls||R.minFilter===Di||R.minFilter===Wu||R.minFilter===xl||R.minFilter===ls)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(I,s.TEXTURE_WRAP_S,ce[R.wrapS]),s.texParameteri(I,s.TEXTURE_WRAP_T,ce[R.wrapT]),(I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY)&&s.texParameteri(I,s.TEXTURE_WRAP_R,ce[R.wrapR]),s.texParameteri(I,s.TEXTURE_MAG_FILTER,oe[R.magFilter]),s.texParameteri(I,s.TEXTURE_MIN_FILTER,oe[R.minFilter]),R.compareFunction&&(s.texParameteri(I,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(I,s.TEXTURE_COMPARE_FUNC,O[R.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===Si||R.minFilter!==xl&&R.minFilter!==ls||R.type===er&&e.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||r.get(R).__currentAnisotropy){const Q=e.get("EXT_texture_filter_anisotropic");s.texParameterf(I,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,a.getMaxAnisotropy())),r.get(R).__currentAnisotropy=R.anisotropy}}}function Ne(I,R){let Q=!1;I.__webglInit===void 0&&(I.__webglInit=!0,R.addEventListener("dispose",N));const me=R.source;let ve=_.get(me);ve===void 0&&(ve={},_.set(me,ve));const he=le(R);if(he!==I.__cacheKey){ve[he]===void 0&&(ve[he]={texture:s.createTexture(),usedTimes:0},u.memory.textures++,Q=!0),ve[he].usedTimes++;const Ve=ve[I.__cacheKey];Ve!==void 0&&(ve[I.__cacheKey].usedTimes--,Ve.usedTimes===0&&D(R)),I.__cacheKey=he,I.__webglTexture=ve[he].texture}return Q}function J(I,R,Q){let me=s.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(me=s.TEXTURE_2D_ARRAY),R.isData3DTexture&&(me=s.TEXTURE_3D);const ve=Ne(I,R),he=R.source;t.bindTexture(me,I.__webglTexture,s.TEXTURE0+Q);const Ve=r.get(he);if(he.version!==Ve.__version||ve===!0){t.activeTexture(s.TEXTURE0+Q);const Re=Mt.getPrimaries(Mt.workingColorSpace),Ue=R.colorSpace===Dr?null:Mt.getPrimaries(R.colorSpace),ut=R.colorSpace===Dr||Re===Ue?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,R.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,R.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);let Se=w(R.image,!1,a.maxTextureSize);Se=Rt(R,Se);const Oe=l.convert(R.format,R.colorSpace),et=l.convert(R.type);let tt=L(R.internalFormat,Oe,et,R.colorSpace,R.isVideoTexture);re(me,R);let ze;const ft=R.mipmaps,st=R.isVideoTexture!==!0,At=Ve.__version===void 0||ve===!0,j=he.dataReady,Ce=k(R,Se);if(R.isDepthTexture)tt=A(R.format===ao,R.type),At&&(st?t.texStorage2D(s.TEXTURE_2D,1,tt,Se.width,Se.height):t.texImage2D(s.TEXTURE_2D,0,tt,Se.width,Se.height,0,Oe,et,null));else if(R.isDataTexture)if(ft.length>0){st&&At&&t.texStorage2D(s.TEXTURE_2D,Ce,tt,ft[0].width,ft[0].height);for(let se=0,pe=ft.length;se<pe;se++)ze=ft[se],st?j&&t.texSubImage2D(s.TEXTURE_2D,se,0,0,ze.width,ze.height,Oe,et,ze.data):t.texImage2D(s.TEXTURE_2D,se,tt,ze.width,ze.height,0,Oe,et,ze.data);R.generateMipmaps=!1}else st?(At&&t.texStorage2D(s.TEXTURE_2D,Ce,tt,Se.width,Se.height),j&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Se.width,Se.height,Oe,et,Se.data)):t.texImage2D(s.TEXTURE_2D,0,tt,Se.width,Se.height,0,Oe,et,Se.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){st&&At&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,tt,ft[0].width,ft[0].height,Se.depth);for(let se=0,pe=ft.length;se<pe;se++)if(ze=ft[se],R.format!==xi)if(Oe!==null)if(st){if(j)if(R.layerUpdates.size>0){const Le=vg(ze.width,ze.height,R.format,R.type);for(const Pe of R.layerUpdates){const ot=ze.data.subarray(Pe*Le/ze.data.BYTES_PER_ELEMENT,(Pe+1)*Le/ze.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,se,0,0,Pe,ze.width,ze.height,1,Oe,ot)}R.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,se,0,0,0,ze.width,ze.height,Se.depth,Oe,ze.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,se,tt,ze.width,ze.height,Se.depth,0,ze.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else st?j&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,se,0,0,0,ze.width,ze.height,Se.depth,Oe,et,ze.data):t.texImage3D(s.TEXTURE_2D_ARRAY,se,tt,ze.width,ze.height,Se.depth,0,Oe,et,ze.data)}else{st&&At&&t.texStorage2D(s.TEXTURE_2D,Ce,tt,ft[0].width,ft[0].height);for(let se=0,pe=ft.length;se<pe;se++)ze=ft[se],R.format!==xi?Oe!==null?st?j&&t.compressedTexSubImage2D(s.TEXTURE_2D,se,0,0,ze.width,ze.height,Oe,ze.data):t.compressedTexImage2D(s.TEXTURE_2D,se,tt,ze.width,ze.height,0,ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?j&&t.texSubImage2D(s.TEXTURE_2D,se,0,0,ze.width,ze.height,Oe,et,ze.data):t.texImage2D(s.TEXTURE_2D,se,tt,ze.width,ze.height,0,Oe,et,ze.data)}else if(R.isDataArrayTexture)if(st){if(At&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,tt,Se.width,Se.height,Se.depth),j)if(R.layerUpdates.size>0){const se=vg(Se.width,Se.height,R.format,R.type);for(const pe of R.layerUpdates){const Le=Se.data.subarray(pe*se/Se.data.BYTES_PER_ELEMENT,(pe+1)*se/Se.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,pe,Se.width,Se.height,1,Oe,et,Le)}R.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Se.width,Se.height,Se.depth,Oe,et,Se.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,tt,Se.width,Se.height,Se.depth,0,Oe,et,Se.data);else if(R.isData3DTexture)st?(At&&t.texStorage3D(s.TEXTURE_3D,Ce,tt,Se.width,Se.height,Se.depth),j&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Se.width,Se.height,Se.depth,Oe,et,Se.data)):t.texImage3D(s.TEXTURE_3D,0,tt,Se.width,Se.height,Se.depth,0,Oe,et,Se.data);else if(R.isFramebufferTexture){if(At)if(st)t.texStorage2D(s.TEXTURE_2D,Ce,tt,Se.width,Se.height);else{let se=Se.width,pe=Se.height;for(let Le=0;Le<Ce;Le++)t.texImage2D(s.TEXTURE_2D,Le,tt,se,pe,0,Oe,et,null),se>>=1,pe>>=1}}else if(ft.length>0){if(st&&At){const se=qe(ft[0]);t.texStorage2D(s.TEXTURE_2D,Ce,tt,se.width,se.height)}for(let se=0,pe=ft.length;se<pe;se++)ze=ft[se],st?j&&t.texSubImage2D(s.TEXTURE_2D,se,0,0,Oe,et,ze):t.texImage2D(s.TEXTURE_2D,se,tt,Oe,et,ze);R.generateMipmaps=!1}else if(st){if(At){const se=qe(Se);t.texStorage2D(s.TEXTURE_2D,Ce,tt,se.width,se.height)}j&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Oe,et,Se)}else t.texImage2D(s.TEXTURE_2D,0,tt,Oe,et,Se);S(R)&&p(me),Ve.__version=he.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function fe(I,R,Q){if(R.image.length!==6)return;const me=Ne(I,R),ve=R.source;t.bindTexture(s.TEXTURE_CUBE_MAP,I.__webglTexture,s.TEXTURE0+Q);const he=r.get(ve);if(ve.version!==he.__version||me===!0){t.activeTexture(s.TEXTURE0+Q);const Ve=Mt.getPrimaries(Mt.workingColorSpace),Re=R.colorSpace===Dr?null:Mt.getPrimaries(R.colorSpace),Ue=R.colorSpace===Dr||Ve===Re?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,R.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,R.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ue);const ut=R.isCompressedTexture||R.image[0].isCompressedTexture,Se=R.image[0]&&R.image[0].isDataTexture,Oe=[];for(let pe=0;pe<6;pe++)!ut&&!Se?Oe[pe]=w(R.image[pe],!0,a.maxCubemapSize):Oe[pe]=Se?R.image[pe].image:R.image[pe],Oe[pe]=Rt(R,Oe[pe]);const et=Oe[0],tt=l.convert(R.format,R.colorSpace),ze=l.convert(R.type),ft=L(R.internalFormat,tt,ze,R.colorSpace),st=R.isVideoTexture!==!0,At=he.__version===void 0||me===!0,j=ve.dataReady;let Ce=k(R,et);re(s.TEXTURE_CUBE_MAP,R);let se;if(ut){st&&At&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Ce,ft,et.width,et.height);for(let pe=0;pe<6;pe++){se=Oe[pe].mipmaps;for(let Le=0;Le<se.length;Le++){const Pe=se[Le];R.format!==xi?tt!==null?st?j&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le,0,0,Pe.width,Pe.height,tt,Pe.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le,ft,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):st?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le,0,0,Pe.width,Pe.height,tt,ze,Pe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le,ft,Pe.width,Pe.height,0,tt,ze,Pe.data)}}}else{if(se=R.mipmaps,st&&At){se.length>0&&Ce++;const pe=qe(Oe[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Ce,ft,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(Se){st?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,Oe[pe].width,Oe[pe].height,tt,ze,Oe[pe].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,ft,Oe[pe].width,Oe[pe].height,0,tt,ze,Oe[pe].data);for(let Le=0;Le<se.length;Le++){const ot=se[Le].image[pe].image;st?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le+1,0,0,ot.width,ot.height,tt,ze,ot.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le+1,ft,ot.width,ot.height,0,tt,ze,ot.data)}}else{st?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,tt,ze,Oe[pe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,ft,tt,ze,Oe[pe]);for(let Le=0;Le<se.length;Le++){const Pe=se[Le];st?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le+1,0,0,tt,ze,Pe.image[pe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Le+1,ft,tt,ze,Pe.image[pe])}}}S(R)&&p(s.TEXTURE_CUBE_MAP),he.__version=ve.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function Ee(I,R,Q,me,ve,he){const Ve=l.convert(Q.format,Q.colorSpace),Re=l.convert(Q.type),Ue=L(Q.internalFormat,Ve,Re,Q.colorSpace),ut=r.get(R),Se=r.get(Q);if(Se.__renderTarget=R,!ut.__hasExternalTextures){const Oe=Math.max(1,R.width>>he),et=Math.max(1,R.height>>he);ve===s.TEXTURE_3D||ve===s.TEXTURE_2D_ARRAY?t.texImage3D(ve,he,Ue,Oe,et,R.depth,0,Ve,Re,null):t.texImage2D(ve,he,Ue,Oe,et,0,Ve,Re,null)}t.bindFramebuffer(s.FRAMEBUFFER,I),dt(R)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,me,ve,Se.__webglTexture,0,pt(R)):(ve===s.TEXTURE_2D||ve>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ve<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,me,ve,Se.__webglTexture,he),t.bindFramebuffer(s.FRAMEBUFFER,null)}function xe(I,R,Q){if(s.bindRenderbuffer(s.RENDERBUFFER,I),R.depthBuffer){const me=R.depthTexture,ve=me&&me.isDepthTexture?me.type:null,he=A(R.stencilBuffer,ve),Ve=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Re=pt(R);dt(R)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Re,he,R.width,R.height):Q?s.renderbufferStorageMultisample(s.RENDERBUFFER,Re,he,R.width,R.height):s.renderbufferStorage(s.RENDERBUFFER,he,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ve,s.RENDERBUFFER,I)}else{const me=R.textures;for(let ve=0;ve<me.length;ve++){const he=me[ve],Ve=l.convert(he.format,he.colorSpace),Re=l.convert(he.type),Ue=L(he.internalFormat,Ve,Re,he.colorSpace),ut=pt(R);Q&&dt(R)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,ut,Ue,R.width,R.height):dt(R)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ut,Ue,R.width,R.height):s.renderbufferStorage(s.RENDERBUFFER,Ue,R.width,R.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ae(I,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,I),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const me=r.get(R.depthTexture);me.__renderTarget=R,(!me.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),de(R.depthTexture,0);const ve=me.__webglTexture,he=pt(R);if(R.depthTexture.format===eo)dt(R)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ve,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ve,0);else if(R.depthTexture.format===ao)dt(R)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ve,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ve,0);else throw new Error("Unknown depthTexture format")}function Ie(I){const R=r.get(I),Q=I.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==I.depthTexture){const me=I.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),me){const ve=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,me.removeEventListener("dispose",ve)};me.addEventListener("dispose",ve),R.__depthDisposeCallback=ve}R.__boundDepthTexture=me}if(I.depthTexture&&!R.__autoAllocateDepthBuffer){if(Q)throw new Error("target.depthTexture not supported in Cube render targets");Ae(R.__webglFramebuffer,I)}else if(Q){R.__webglDepthbuffer=[];for(let me=0;me<6;me++)if(t.bindFramebuffer(s.FRAMEBUFFER,R.__webglFramebuffer[me]),R.__webglDepthbuffer[me]===void 0)R.__webglDepthbuffer[me]=s.createRenderbuffer(),xe(R.__webglDepthbuffer[me],I,!1);else{const ve=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=R.__webglDepthbuffer[me];s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,ve,s.RENDERBUFFER,he)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=s.createRenderbuffer(),xe(R.__webglDepthbuffer,I,!1);else{const me=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ve=R.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ve),s.framebufferRenderbuffer(s.FRAMEBUFFER,me,s.RENDERBUFFER,ve)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Je(I,R,Q){const me=r.get(I);R!==void 0&&Ee(me.__webglFramebuffer,I,I.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),Q!==void 0&&Ie(I)}function bt(I){const R=I.texture,Q=r.get(I),me=r.get(R);I.addEventListener("dispose",U);const ve=I.textures,he=I.isWebGLCubeRenderTarget===!0,Ve=ve.length>1;if(Ve||(me.__webglTexture===void 0&&(me.__webglTexture=s.createTexture()),me.__version=R.version,u.memory.textures++),he){Q.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(R.mipmaps&&R.mipmaps.length>0){Q.__webglFramebuffer[Re]=[];for(let Ue=0;Ue<R.mipmaps.length;Ue++)Q.__webglFramebuffer[Re][Ue]=s.createFramebuffer()}else Q.__webglFramebuffer[Re]=s.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){Q.__webglFramebuffer=[];for(let Re=0;Re<R.mipmaps.length;Re++)Q.__webglFramebuffer[Re]=s.createFramebuffer()}else Q.__webglFramebuffer=s.createFramebuffer();if(Ve)for(let Re=0,Ue=ve.length;Re<Ue;Re++){const ut=r.get(ve[Re]);ut.__webglTexture===void 0&&(ut.__webglTexture=s.createTexture(),u.memory.textures++)}if(I.samples>0&&dt(I)===!1){Q.__webglMultisampledFramebuffer=s.createFramebuffer(),Q.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,Q.__webglMultisampledFramebuffer);for(let Re=0;Re<ve.length;Re++){const Ue=ve[Re];Q.__webglColorRenderbuffer[Re]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,Q.__webglColorRenderbuffer[Re]);const ut=l.convert(Ue.format,Ue.colorSpace),Se=l.convert(Ue.type),Oe=L(Ue.internalFormat,ut,Se,Ue.colorSpace,I.isXRRenderTarget===!0),et=pt(I);s.renderbufferStorageMultisample(s.RENDERBUFFER,et,Oe,I.width,I.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.RENDERBUFFER,Q.__webglColorRenderbuffer[Re])}s.bindRenderbuffer(s.RENDERBUFFER,null),I.depthBuffer&&(Q.__webglDepthRenderbuffer=s.createRenderbuffer(),xe(Q.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(he){t.bindTexture(s.TEXTURE_CUBE_MAP,me.__webglTexture),re(s.TEXTURE_CUBE_MAP,R);for(let Re=0;Re<6;Re++)if(R.mipmaps&&R.mipmaps.length>0)for(let Ue=0;Ue<R.mipmaps.length;Ue++)Ee(Q.__webglFramebuffer[Re][Ue],I,R,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ue);else Ee(Q.__webglFramebuffer[Re],I,R,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);S(R)&&p(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ve){for(let Re=0,Ue=ve.length;Re<Ue;Re++){const ut=ve[Re],Se=r.get(ut);t.bindTexture(s.TEXTURE_2D,Se.__webglTexture),re(s.TEXTURE_2D,ut),Ee(Q.__webglFramebuffer,I,ut,s.COLOR_ATTACHMENT0+Re,s.TEXTURE_2D,0),S(ut)&&p(s.TEXTURE_2D)}t.unbindTexture()}else{let Re=s.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Re=I.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Re,me.__webglTexture),re(Re,R),R.mipmaps&&R.mipmaps.length>0)for(let Ue=0;Ue<R.mipmaps.length;Ue++)Ee(Q.__webglFramebuffer[Ue],I,R,s.COLOR_ATTACHMENT0,Re,Ue);else Ee(Q.__webglFramebuffer,I,R,s.COLOR_ATTACHMENT0,Re,0);S(R)&&p(Re),t.unbindTexture()}I.depthBuffer&&Ie(I)}function gt(I){const R=I.textures;for(let Q=0,me=R.length;Q<me;Q++){const ve=R[Q];if(S(ve)){const he=b(I),Ve=r.get(ve).__webglTexture;t.bindTexture(he,Ve),p(he),t.unbindTexture()}}}const Ut=[],q=[];function wn(I){if(I.samples>0){if(dt(I)===!1){const R=I.textures,Q=I.width,me=I.height;let ve=s.COLOR_BUFFER_BIT;const he=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ve=r.get(I),Re=R.length>1;if(Re)for(let Ue=0;Ue<R.length;Ue++)t.bindFramebuffer(s.FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ue,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ue,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ve.__webglFramebuffer);for(let Ue=0;Ue<R.length;Ue++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(ve|=s.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(ve|=s.STENCIL_BUFFER_BIT)),Re){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ve.__webglColorRenderbuffer[Ue]);const ut=r.get(R[Ue]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ut,0)}s.blitFramebuffer(0,0,Q,me,0,0,Q,me,ve,s.NEAREST),h===!0&&(Ut.length=0,q.length=0,Ut.push(s.COLOR_ATTACHMENT0+Ue),I.depthBuffer&&I.resolveDepthBuffer===!1&&(Ut.push(he),q.push(he),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,q)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ut))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Re)for(let Ue=0;Ue<R.length;Ue++){t.bindFramebuffer(s.FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ue,s.RENDERBUFFER,Ve.__webglColorRenderbuffer[Ue]);const ut=r.get(R[Ue]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ue,s.TEXTURE_2D,ut,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ve.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&h){const R=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[R])}}}function pt(I){return Math.min(a.maxSamples,I.samples)}function dt(I){const R=r.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function Ke(I){const R=u.render.frame;v.get(I)!==R&&(v.set(I,R),I.update())}function Rt(I,R){const Q=I.colorSpace,me=I.format,ve=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||Q!==uo&&Q!==Dr&&(Mt.getTransfer(Q)===Lt?(me!==xi||ve!==ir)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Q)),R}function qe(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(m.width=I.naturalWidth||I.width,m.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(m.width=I.displayWidth,m.height=I.displayHeight):(m.width=I.width,m.height=I.height),m}this.allocateTextureUnit=Z,this.resetTextureUnits=ee,this.setTexture2D=de,this.setTexture2DArray=ae,this.setTexture3D=ue,this.setTextureCube=V,this.rebindTextures=Je,this.setupRenderTarget=bt,this.updateRenderTargetMipmap=gt,this.updateMultisampleRenderTarget=wn,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=dt}function l1(s,e){function t(r,a=Dr){let l;const u=Mt.getTransfer(a);if(r===ir)return s.UNSIGNED_BYTE;if(r===Mf)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Ef)return s.UNSIGNED_SHORT_5_5_5_1;if(r===zg)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===Fg)return s.BYTE;if(r===Og)return s.SHORT;if(r===aa)return s.UNSIGNED_SHORT;if(r===Sf)return s.INT;if(r===us)return s.UNSIGNED_INT;if(r===er)return s.FLOAT;if(r===ua)return s.HALF_FLOAT;if(r===kg)return s.ALPHA;if(r===Bg)return s.RGB;if(r===xi)return s.RGBA;if(r===Hg)return s.LUMINANCE;if(r===Vg)return s.LUMINANCE_ALPHA;if(r===eo)return s.DEPTH_COMPONENT;if(r===ao)return s.DEPTH_STENCIL;if(r===Gg)return s.RED;if(r===wf)return s.RED_INTEGER;if(r===Wg)return s.RG;if(r===Tf)return s.RG_INTEGER;if(r===Af)return s.RGBA_INTEGER;if(r===Gl||r===Wl||r===jl||r===Xl)if(u===Lt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(r===Gl)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Wl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===jl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Xl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(r===Gl)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Wl)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===jl)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Xl)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Hd||r===Vd||r===Gd||r===Wd)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(r===Hd)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Vd)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Gd)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Wd)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===jd||r===Xd||r===Yd)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(r===jd||r===Xd)return u===Lt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(r===Yd)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===qd||r===$d||r===Kd||r===Zd||r===Qd||r===Jd||r===ef||r===tf||r===nf||r===rf||r===sf||r===of||r===af||r===lf)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(r===qd)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===$d)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Kd)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Zd)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Qd)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Jd)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===ef)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===tf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===nf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===rf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===sf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===of)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===af)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===lf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Yl||r===cf||r===uf)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(r===Yl)return u===Lt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===cf)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===uf)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===jg||r===df||r===ff||r===hf)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(r===Yl)return l.COMPRESSED_RED_RGTC1_EXT;if(r===df)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ff)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===hf)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===oo?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:t}}class c1 extends Vn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class yi extends un{constructor(){super(),this.isGroup=!0,this.type="Group"}}const u1={type:"move"};class vd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let a=null,l=null,u=null;const d=this._targetRay,h=this._grip,m=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(m&&e.hand){u=!0;for(const w of e.hand.values()){const S=t.getJointPose(w,r),p=this._getHandJoint(m,w);S!==null&&(p.matrix.fromArray(S.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=S.radius),p.visible=S!==null}const v=m.joints["index-finger-tip"],x=m.joints["thumb-tip"],_=v.position.distanceTo(x.position),y=.02,E=.005;m.inputState.pinching&&_>y+E?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!m.inputState.pinching&&_<=y-E&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,r),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1));d!==null&&(a=t.getPose(e.targetRaySpace,r),a===null&&l!==null&&(a=l),a!==null&&(d.matrix.fromArray(a.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,a.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(a.linearVelocity)):d.hasLinearVelocity=!1,a.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(a.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(u1)))}return d!==null&&(d.visible=a!==null),h!==null&&(h.visible=l!==null),m!==null&&(m.visible=u!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const r=new yi;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}}const d1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,f1=`
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

}`;class h1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,r){if(this.texture===null){const a=new En,l=e.properties.get(a);l.__webglTexture=t.texture,(t.depthNear!=r.depthNear||t.depthFar!=r.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=a}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,r=new Fr({vertexShader:d1,fragmentShader:f1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ot(new go(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class p1 extends fo{constructor(e,t){super();const r=this;let a=null,l=1,u=null,d="local-floor",h=1,m=null,v=null,x=null,_=null,y=null,E=null;const w=new h1,S=t.getContextAttributes();let p=null,b=null;const L=[],A=[],k=new mt;let N=null;const U=new Vn;U.viewport=new Nt;const z=new Vn;z.viewport=new Nt;const D=[U,z],C=new c1;let B=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let fe=L[J];return fe===void 0&&(fe=new vd,L[J]=fe),fe.getTargetRaySpace()},this.getControllerGrip=function(J){let fe=L[J];return fe===void 0&&(fe=new vd,L[J]=fe),fe.getGripSpace()},this.getHand=function(J){let fe=L[J];return fe===void 0&&(fe=new vd,L[J]=fe),fe.getHandSpace()};function Z(J){const fe=A.indexOf(J.inputSource);if(fe===-1)return;const Ee=L[fe];Ee!==void 0&&(Ee.update(J.inputSource,J.frame,m||u),Ee.dispatchEvent({type:J.type,data:J.inputSource}))}function le(){a.removeEventListener("select",Z),a.removeEventListener("selectstart",Z),a.removeEventListener("selectend",Z),a.removeEventListener("squeeze",Z),a.removeEventListener("squeezestart",Z),a.removeEventListener("squeezeend",Z),a.removeEventListener("end",le),a.removeEventListener("inputsourceschange",de);for(let J=0;J<L.length;J++){const fe=A[J];fe!==null&&(A[J]=null,L[J].disconnect(fe))}B=null,ee=null,w.reset(),e.setRenderTarget(p),y=null,_=null,x=null,a=null,b=null,Ne.stop(),r.isPresenting=!1,e.setPixelRatio(N),e.setSize(k.width,k.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){l=J,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){d=J,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||u},this.setReferenceSpace=function(J){m=J},this.getBaseLayer=function(){return _!==null?_:y},this.getBinding=function(){return x},this.getFrame=function(){return E},this.getSession=function(){return a},this.setSession=async function(J){if(a=J,a!==null){if(p=e.getRenderTarget(),a.addEventListener("select",Z),a.addEventListener("selectstart",Z),a.addEventListener("selectend",Z),a.addEventListener("squeeze",Z),a.addEventListener("squeezestart",Z),a.addEventListener("squeezeend",Z),a.addEventListener("end",le),a.addEventListener("inputsourceschange",de),S.xrCompatible!==!0&&await t.makeXRCompatible(),N=e.getPixelRatio(),e.getSize(k),a.renderState.layers===void 0){const fe={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:l};y=new XRWebGLLayer(a,t,fe),a.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),b=new ds(y.framebufferWidth,y.framebufferHeight,{format:xi,type:ir,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let fe=null,Ee=null,xe=null;S.depth&&(xe=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=S.stencil?ao:eo,Ee=S.stencil?oo:us);const Ae={colorFormat:t.RGBA8,depthFormat:xe,scaleFactor:l};x=new XRWebGLBinding(a,t),_=x.createProjectionLayer(Ae),a.updateRenderState({layers:[_]}),e.setPixelRatio(1),e.setSize(_.textureWidth,_.textureHeight,!1),b=new ds(_.textureWidth,_.textureHeight,{format:xi,type:ir,depthTexture:new s0(_.textureWidth,_.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:_.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(h),m=null,u=await a.requestReferenceSpace(d),Ne.setContext(a),Ne.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return w.getDepthTexture()};function de(J){for(let fe=0;fe<J.removed.length;fe++){const Ee=J.removed[fe],xe=A.indexOf(Ee);xe>=0&&(A[xe]=null,L[xe].disconnect(Ee))}for(let fe=0;fe<J.added.length;fe++){const Ee=J.added[fe];let xe=A.indexOf(Ee);if(xe===-1){for(let Ie=0;Ie<L.length;Ie++)if(Ie>=A.length){A.push(Ee),xe=Ie;break}else if(A[Ie]===null){A[Ie]=Ee,xe=Ie;break}if(xe===-1)break}const Ae=L[xe];Ae&&Ae.connect(Ee)}}const ae=new G,ue=new G;function V(J,fe,Ee){ae.setFromMatrixPosition(fe.matrixWorld),ue.setFromMatrixPosition(Ee.matrixWorld);const xe=ae.distanceTo(ue),Ae=fe.projectionMatrix.elements,Ie=Ee.projectionMatrix.elements,Je=Ae[14]/(Ae[10]-1),bt=Ae[14]/(Ae[10]+1),gt=(Ae[9]+1)/Ae[5],Ut=(Ae[9]-1)/Ae[5],q=(Ae[8]-1)/Ae[0],wn=(Ie[8]+1)/Ie[0],pt=Je*q,dt=Je*wn,Ke=xe/(-q+wn),Rt=Ke*-q;if(fe.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Rt),J.translateZ(Ke),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Ae[10]===-1)J.projectionMatrix.copy(fe.projectionMatrix),J.projectionMatrixInverse.copy(fe.projectionMatrixInverse);else{const qe=Je+Ke,I=bt+Ke,R=pt-Rt,Q=dt+(xe-Rt),me=gt*bt/I*qe,ve=Ut*bt/I*qe;J.projectionMatrix.makePerspective(R,Q,me,ve,qe,I),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ce(J,fe){fe===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(fe.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(a===null)return;let fe=J.near,Ee=J.far;w.texture!==null&&(w.depthNear>0&&(fe=w.depthNear),w.depthFar>0&&(Ee=w.depthFar)),C.near=z.near=U.near=fe,C.far=z.far=U.far=Ee,(B!==C.near||ee!==C.far)&&(a.updateRenderState({depthNear:C.near,depthFar:C.far}),B=C.near,ee=C.far),U.layers.mask=J.layers.mask|2,z.layers.mask=J.layers.mask|4,C.layers.mask=U.layers.mask|z.layers.mask;const xe=J.parent,Ae=C.cameras;ce(C,xe);for(let Ie=0;Ie<Ae.length;Ie++)ce(Ae[Ie],xe);Ae.length===2?V(C,U,z):C.projectionMatrix.copy(U.projectionMatrix),oe(J,C,xe)};function oe(J,fe,Ee){Ee===null?J.matrix.copy(fe.matrixWorld):(J.matrix.copy(Ee.matrixWorld),J.matrix.invert(),J.matrix.multiply(fe.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(fe.projectionMatrix),J.projectionMatrixInverse.copy(fe.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=la*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(_===null&&y===null))return h},this.setFoveation=function(J){h=J,_!==null&&(_.fixedFoveation=J),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=J)},this.hasDepthSensing=function(){return w.texture!==null},this.getDepthSensingMesh=function(){return w.getMesh(C)};let O=null;function re(J,fe){if(v=fe.getViewerPose(m||u),E=fe,v!==null){const Ee=v.views;y!==null&&(e.setRenderTargetFramebuffer(b,y.framebuffer),e.setRenderTarget(b));let xe=!1;Ee.length!==C.cameras.length&&(C.cameras.length=0,xe=!0);for(let Ie=0;Ie<Ee.length;Ie++){const Je=Ee[Ie];let bt=null;if(y!==null)bt=y.getViewport(Je);else{const Ut=x.getViewSubImage(_,Je);bt=Ut.viewport,Ie===0&&(e.setRenderTargetTextures(b,Ut.colorTexture,_.ignoreDepthValues?void 0:Ut.depthStencilTexture),e.setRenderTarget(b))}let gt=D[Ie];gt===void 0&&(gt=new Vn,gt.layers.enable(Ie),gt.viewport=new Nt,D[Ie]=gt),gt.matrix.fromArray(Je.transform.matrix),gt.matrix.decompose(gt.position,gt.quaternion,gt.scale),gt.projectionMatrix.fromArray(Je.projectionMatrix),gt.projectionMatrixInverse.copy(gt.projectionMatrix).invert(),gt.viewport.set(bt.x,bt.y,bt.width,bt.height),Ie===0&&(C.matrix.copy(gt.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),xe===!0&&C.cameras.push(gt)}const Ae=a.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Ie=x.getDepthInformation(Ee[0]);Ie&&Ie.isValid&&Ie.texture&&w.init(e,Ie,a.renderState)}}for(let Ee=0;Ee<L.length;Ee++){const xe=A[Ee],Ae=L[Ee];xe!==null&&Ae!==void 0&&Ae.update(xe,fe,m||u)}O&&O(J,fe),fe.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:fe}),E=null}const Ne=new i0;Ne.setAnimationLoop(re),this.setAnimationLoop=function(J){O=J},this.dispose=function(){}}}const ns=new Ni,m1=new zt;function g1(s,e){function t(S,p){S.matrixAutoUpdate===!0&&S.updateMatrix(),p.value.copy(S.matrix)}function r(S,p){p.color.getRGB(S.fogColor.value,e0(s)),p.isFog?(S.fogNear.value=p.near,S.fogFar.value=p.far):p.isFogExp2&&(S.fogDensity.value=p.density)}function a(S,p,b,L,A){p.isMeshBasicMaterial||p.isMeshLambertMaterial?l(S,p):p.isMeshToonMaterial?(l(S,p),x(S,p)):p.isMeshPhongMaterial?(l(S,p),v(S,p)):p.isMeshStandardMaterial?(l(S,p),_(S,p),p.isMeshPhysicalMaterial&&y(S,p,A)):p.isMeshMatcapMaterial?(l(S,p),E(S,p)):p.isMeshDepthMaterial?l(S,p):p.isMeshDistanceMaterial?(l(S,p),w(S,p)):p.isMeshNormalMaterial?l(S,p):p.isLineBasicMaterial?(u(S,p),p.isLineDashedMaterial&&d(S,p)):p.isPointsMaterial?h(S,p,b,L):p.isSpriteMaterial?m(S,p):p.isShadowMaterial?(S.color.value.copy(p.color),S.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function l(S,p){S.opacity.value=p.opacity,p.color&&S.diffuse.value.copy(p.color),p.emissive&&S.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(S.map.value=p.map,t(p.map,S.mapTransform)),p.alphaMap&&(S.alphaMap.value=p.alphaMap,t(p.alphaMap,S.alphaMapTransform)),p.bumpMap&&(S.bumpMap.value=p.bumpMap,t(p.bumpMap,S.bumpMapTransform),S.bumpScale.value=p.bumpScale,p.side===Wn&&(S.bumpScale.value*=-1)),p.normalMap&&(S.normalMap.value=p.normalMap,t(p.normalMap,S.normalMapTransform),S.normalScale.value.copy(p.normalScale),p.side===Wn&&S.normalScale.value.negate()),p.displacementMap&&(S.displacementMap.value=p.displacementMap,t(p.displacementMap,S.displacementMapTransform),S.displacementScale.value=p.displacementScale,S.displacementBias.value=p.displacementBias),p.emissiveMap&&(S.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,S.emissiveMapTransform)),p.specularMap&&(S.specularMap.value=p.specularMap,t(p.specularMap,S.specularMapTransform)),p.alphaTest>0&&(S.alphaTest.value=p.alphaTest);const b=e.get(p),L=b.envMap,A=b.envMapRotation;L&&(S.envMap.value=L,ns.copy(A),ns.x*=-1,ns.y*=-1,ns.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),S.envMapRotation.value.setFromMatrix4(m1.makeRotationFromEuler(ns)),S.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=p.reflectivity,S.ior.value=p.ior,S.refractionRatio.value=p.refractionRatio),p.lightMap&&(S.lightMap.value=p.lightMap,S.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,S.lightMapTransform)),p.aoMap&&(S.aoMap.value=p.aoMap,S.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,S.aoMapTransform))}function u(S,p){S.diffuse.value.copy(p.color),S.opacity.value=p.opacity,p.map&&(S.map.value=p.map,t(p.map,S.mapTransform))}function d(S,p){S.dashSize.value=p.dashSize,S.totalSize.value=p.dashSize+p.gapSize,S.scale.value=p.scale}function h(S,p,b,L){S.diffuse.value.copy(p.color),S.opacity.value=p.opacity,S.size.value=p.size*b,S.scale.value=L*.5,p.map&&(S.map.value=p.map,t(p.map,S.uvTransform)),p.alphaMap&&(S.alphaMap.value=p.alphaMap,t(p.alphaMap,S.alphaMapTransform)),p.alphaTest>0&&(S.alphaTest.value=p.alphaTest)}function m(S,p){S.diffuse.value.copy(p.color),S.opacity.value=p.opacity,S.rotation.value=p.rotation,p.map&&(S.map.value=p.map,t(p.map,S.mapTransform)),p.alphaMap&&(S.alphaMap.value=p.alphaMap,t(p.alphaMap,S.alphaMapTransform)),p.alphaTest>0&&(S.alphaTest.value=p.alphaTest)}function v(S,p){S.specular.value.copy(p.specular),S.shininess.value=Math.max(p.shininess,1e-4)}function x(S,p){p.gradientMap&&(S.gradientMap.value=p.gradientMap)}function _(S,p){S.metalness.value=p.metalness,p.metalnessMap&&(S.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,S.metalnessMapTransform)),S.roughness.value=p.roughness,p.roughnessMap&&(S.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,S.roughnessMapTransform)),p.envMap&&(S.envMapIntensity.value=p.envMapIntensity)}function y(S,p,b){S.ior.value=p.ior,p.sheen>0&&(S.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),S.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(S.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,S.sheenColorMapTransform)),p.sheenRoughnessMap&&(S.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,S.sheenRoughnessMapTransform))),p.clearcoat>0&&(S.clearcoat.value=p.clearcoat,S.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(S.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,S.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(S.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Wn&&S.clearcoatNormalScale.value.negate())),p.dispersion>0&&(S.dispersion.value=p.dispersion),p.iridescence>0&&(S.iridescence.value=p.iridescence,S.iridescenceIOR.value=p.iridescenceIOR,S.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(S.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,S.iridescenceMapTransform)),p.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),p.transmission>0&&(S.transmission.value=p.transmission,S.transmissionSamplerMap.value=b.texture,S.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(S.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,S.transmissionMapTransform)),S.thickness.value=p.thickness,p.thicknessMap&&(S.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=p.attenuationDistance,S.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(S.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(S.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=p.specularIntensity,S.specularColor.value.copy(p.specularColor),p.specularColorMap&&(S.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,S.specularColorMapTransform)),p.specularIntensityMap&&(S.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,S.specularIntensityMapTransform))}function E(S,p){p.matcap&&(S.matcap.value=p.matcap)}function w(S,p){const b=e.get(p).light;S.referencePosition.value.setFromMatrixPosition(b.matrixWorld),S.nearDistance.value=b.shadow.camera.near,S.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function v1(s,e,t,r){let a={},l={},u=[];const d=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function h(b,L){const A=L.program;r.uniformBlockBinding(b,A)}function m(b,L){let A=a[b.id];A===void 0&&(E(b),A=v(b),a[b.id]=A,b.addEventListener("dispose",S));const k=L.program;r.updateUBOMapping(b,k);const N=e.render.frame;l[b.id]!==N&&(_(b),l[b.id]=N)}function v(b){const L=x();b.__bindingPointIndex=L;const A=s.createBuffer(),k=b.__size,N=b.usage;return s.bindBuffer(s.UNIFORM_BUFFER,A),s.bufferData(s.UNIFORM_BUFFER,k,N),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,L,A),A}function x(){for(let b=0;b<d;b++)if(u.indexOf(b)===-1)return u.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function _(b){const L=a[b.id],A=b.uniforms,k=b.__cache;s.bindBuffer(s.UNIFORM_BUFFER,L);for(let N=0,U=A.length;N<U;N++){const z=Array.isArray(A[N])?A[N]:[A[N]];for(let D=0,C=z.length;D<C;D++){const B=z[D];if(y(B,N,D,k)===!0){const ee=B.__offset,Z=Array.isArray(B.value)?B.value:[B.value];let le=0;for(let de=0;de<Z.length;de++){const ae=Z[de],ue=w(ae);typeof ae=="number"||typeof ae=="boolean"?(B.__data[0]=ae,s.bufferSubData(s.UNIFORM_BUFFER,ee+le,B.__data)):ae.isMatrix3?(B.__data[0]=ae.elements[0],B.__data[1]=ae.elements[1],B.__data[2]=ae.elements[2],B.__data[3]=0,B.__data[4]=ae.elements[3],B.__data[5]=ae.elements[4],B.__data[6]=ae.elements[5],B.__data[7]=0,B.__data[8]=ae.elements[6],B.__data[9]=ae.elements[7],B.__data[10]=ae.elements[8],B.__data[11]=0):(ae.toArray(B.__data,le),le+=ue.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,ee,B.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function y(b,L,A,k){const N=b.value,U=L+"_"+A;if(k[U]===void 0)return typeof N=="number"||typeof N=="boolean"?k[U]=N:k[U]=N.clone(),!0;{const z=k[U];if(typeof N=="number"||typeof N=="boolean"){if(z!==N)return k[U]=N,!0}else if(z.equals(N)===!1)return z.copy(N),!0}return!1}function E(b){const L=b.uniforms;let A=0;const k=16;for(let U=0,z=L.length;U<z;U++){const D=Array.isArray(L[U])?L[U]:[L[U]];for(let C=0,B=D.length;C<B;C++){const ee=D[C],Z=Array.isArray(ee.value)?ee.value:[ee.value];for(let le=0,de=Z.length;le<de;le++){const ae=Z[le],ue=w(ae),V=A%k,ce=V%ue.boundary,oe=V+ce;A+=ce,oe!==0&&k-oe<ue.storage&&(A+=k-oe),ee.__data=new Float32Array(ue.storage/Float32Array.BYTES_PER_ELEMENT),ee.__offset=A,A+=ue.storage}}}const N=A%k;return N>0&&(A+=k-N),b.__size=A,b.__cache={},this}function w(b){const L={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(L.boundary=4,L.storage=4):b.isVector2?(L.boundary=8,L.storage=8):b.isVector3||b.isColor?(L.boundary=16,L.storage=12):b.isVector4?(L.boundary=16,L.storage=16):b.isMatrix3?(L.boundary=48,L.storage=48):b.isMatrix4?(L.boundary=64,L.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),L}function S(b){const L=b.target;L.removeEventListener("dispose",S);const A=u.indexOf(L.__bindingPointIndex);u.splice(A,1),s.deleteBuffer(a[L.id]),delete a[L.id],delete l[L.id]}function p(){for(const b in a)s.deleteBuffer(a[b]);u=[],a={},l={}}return{bind:h,update:m,dispose:p}}class _1{constructor(e={}){const{canvas:t=ox(),context:r=null,depth:a=!0,stencil:l=!1,alpha:u=!1,antialias:d=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:m=!1,powerPreference:v="default",failIfMajorPerformanceCaveat:x=!1,reverseDepthBuffer:_=!1}=e;this.isWebGLRenderer=!0;let y;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");y=r.getContextAttributes().alpha}else y=u;const E=new Uint32Array(4),w=new Int32Array(4);let S=null,p=null;const b=[],L=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Dn,this.toneMapping=Ir,this.toneMappingExposure=1;const A=this;let k=!1,N=0,U=0,z=null,D=-1,C=null;const B=new Nt,ee=new Nt;let Z=null;const le=new xt(0);let de=0,ae=t.width,ue=t.height,V=1,ce=null,oe=null;const O=new Nt(0,0,ae,ue),re=new Nt(0,0,ae,ue);let Ne=!1;const J=new Pf;let fe=!1,Ee=!1;const xe=new zt,Ae=new zt,Ie=new G,Je=new Nt,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let gt=!1;function Ut(){return z===null?V:1}let q=r;function wn(P,X){return t.getContext(P,X)}try{const P={alpha:!0,depth:a,stencil:l,antialias:d,premultipliedAlpha:h,preserveDrawingBuffer:m,powerPreference:v,failIfMajorPerformanceCaveat:x};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${yf}`),t.addEventListener("webglcontextlost",pe,!1),t.addEventListener("webglcontextrestored",Le,!1),t.addEventListener("webglcontextcreationerror",Pe,!1),q===null){const X="webgl2";if(q=wn(X,P),q===null)throw wn(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let pt,dt,Ke,Rt,qe,I,R,Q,me,ve,he,Ve,Re,Ue,ut,Se,Oe,et,tt,ze,ft,st,At,j;function Ce(){pt=new EM(q),pt.init(),st=new l1(q,pt),dt=new vM(q,pt,e,st),Ke=new s1(q,pt),dt.reverseDepthBuffer&&_&&Ke.buffers.depth.setReversed(!0),Rt=new AM(q),qe=new WE,I=new a1(q,pt,Ke,qe,dt,st,Rt),R=new xM(A),Q=new MM(A),me=new Nx(q),At=new mM(q,me),ve=new wM(q,me,Rt,At),he=new CM(q,ve,me,Rt),tt=new RM(q,dt,I),Se=new _M(qe),Ve=new GE(A,R,Q,pt,dt,At,Se),Re=new g1(A,qe),Ue=new XE,ut=new QE(pt),et=new pM(A,R,Q,Ke,he,y,h),Oe=new i1(A,he,dt),j=new v1(q,Rt,dt,Ke),ze=new gM(q,pt,Rt),ft=new TM(q,pt,Rt),Rt.programs=Ve.programs,A.capabilities=dt,A.extensions=pt,A.properties=qe,A.renderLists=Ue,A.shadowMap=Oe,A.state=Ke,A.info=Rt}Ce();const se=new p1(A,q);this.xr=se,this.getContext=function(){return q},this.getContextAttributes=function(){return q.getContextAttributes()},this.forceContextLoss=function(){const P=pt.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=pt.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(P){P!==void 0&&(V=P,this.setSize(ae,ue,!1))},this.getSize=function(P){return P.set(ae,ue)},this.setSize=function(P,X,ne=!0){if(se.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ae=P,ue=X,t.width=Math.floor(P*V),t.height=Math.floor(X*V),ne===!0&&(t.style.width=P+"px",t.style.height=X+"px"),this.setViewport(0,0,P,X)},this.getDrawingBufferSize=function(P){return P.set(ae*V,ue*V).floor()},this.setDrawingBufferSize=function(P,X,ne){ae=P,ue=X,V=ne,t.width=Math.floor(P*ne),t.height=Math.floor(X*ne),this.setViewport(0,0,P,X)},this.getCurrentViewport=function(P){return P.copy(B)},this.getViewport=function(P){return P.copy(O)},this.setViewport=function(P,X,ne,ie){P.isVector4?O.set(P.x,P.y,P.z,P.w):O.set(P,X,ne,ie),Ke.viewport(B.copy(O).multiplyScalar(V).round())},this.getScissor=function(P){return P.copy(re)},this.setScissor=function(P,X,ne,ie){P.isVector4?re.set(P.x,P.y,P.z,P.w):re.set(P,X,ne,ie),Ke.scissor(ee.copy(re).multiplyScalar(V).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(P){Ke.setScissorTest(Ne=P)},this.setOpaqueSort=function(P){ce=P},this.setTransparentSort=function(P){oe=P},this.getClearColor=function(P){return P.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor.apply(et,arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha.apply(et,arguments)},this.clear=function(P=!0,X=!0,ne=!0){let ie=0;if(P){let Y=!1;if(z!==null){const Te=z.texture.format;Y=Te===Af||Te===Tf||Te===wf}if(Y){const Te=z.texture.type,Me=Te===ir||Te===us||Te===aa||Te===oo||Te===Mf||Te===Ef,Ge=et.getClearColor(),Be=et.getClearAlpha(),nt=Ge.r,rt=Ge.g,We=Ge.b;Me?(E[0]=nt,E[1]=rt,E[2]=We,E[3]=Be,q.clearBufferuiv(q.COLOR,0,E)):(w[0]=nt,w[1]=rt,w[2]=We,w[3]=Be,q.clearBufferiv(q.COLOR,0,w))}else ie|=q.COLOR_BUFFER_BIT}X&&(ie|=q.DEPTH_BUFFER_BIT),ne&&(ie|=q.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",pe,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",Pe,!1),Ue.dispose(),ut.dispose(),qe.dispose(),R.dispose(),Q.dispose(),he.dispose(),At.dispose(),j.dispose(),Ve.dispose(),se.dispose(),se.removeEventListener("sessionstart",fs),se.removeEventListener("sessionend",rr),Ii.stop()};function pe(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),k=!0}function Le(){console.log("THREE.WebGLRenderer: Context Restored."),k=!1;const P=Rt.autoReset,X=Oe.enabled,ne=Oe.autoUpdate,ie=Oe.needsUpdate,Y=Oe.type;Ce(),Rt.autoReset=P,Oe.enabled=X,Oe.autoUpdate=ne,Oe.needsUpdate=ie,Oe.type=Y}function Pe(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function ot(P){const X=P.target;X.removeEventListener("dispose",ot),kt(X)}function kt(P){Jt(P),qe.remove(P)}function Jt(P){const X=qe.get(P).programs;X!==void 0&&(X.forEach(function(ne){Ve.releaseProgram(ne)}),P.isShaderMaterial&&Ve.releaseShaderCache(P))}this.renderBufferDirect=function(P,X,ne,ie,Y,Te){X===null&&(X=bt);const Me=Y.isMesh&&Y.matrixWorld.determinant()<0,Ge=ma(P,X,ne,ie,Y);Ke.setMaterial(ie,Me);let Be=ne.index,nt=1;if(ie.wireframe===!0){if(Be=ve.getWireframeAttribute(ne),Be===void 0)return;nt=2}const rt=ne.drawRange,We=ne.attributes.position;let _t=rt.start*nt,Tt=(rt.start+rt.count)*nt;Te!==null&&(_t=Math.max(_t,Te.start*nt),Tt=Math.min(Tt,(Te.start+Te.count)*nt)),Be!==null?(_t=Math.max(_t,0),Tt=Math.min(Tt,Be.count)):We!=null&&(_t=Math.max(_t,0),Tt=Math.min(Tt,We.count));const vt=Tt-_t;if(vt<0||vt===1/0)return;At.setup(Y,ie,Ge,ne,Be);let mn,at=ze;if(Be!==null&&(mn=me.get(Be),at=ft,at.setIndex(mn)),Y.isMesh)ie.wireframe===!0?(Ke.setLineWidth(ie.wireframeLinewidth*Ut()),at.setMode(q.LINES)):at.setMode(q.TRIANGLES);else if(Y.isLine){let Ye=ie.linewidth;Ye===void 0&&(Ye=1),Ke.setLineWidth(Ye*Ut()),Y.isLineSegments?at.setMode(q.LINES):Y.isLineLoop?at.setMode(q.LINE_LOOP):at.setMode(q.LINE_STRIP)}else Y.isPoints?at.setMode(q.POINTS):Y.isSprite&&at.setMode(q.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)at.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(pt.get("WEBGL_multi_draw"))at.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Ye=Y._multiDrawStarts,oi=Y._multiDrawCounts,Et=Y._multiDrawCount,gn=Be?me.get(Be).bytesPerElement:1,ai=qe.get(ie).currentProgram.getUniforms();for(let en=0;en<Et;en++)ai.setValue(q,"_gl_DrawID",en),at.render(Ye[en]/gn,oi[en])}else if(Y.isInstancedMesh)at.renderInstances(_t,vt,Y.count);else if(ne.isInstancedBufferGeometry){const Ye=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,oi=Math.min(ne.instanceCount,Ye);at.renderInstances(_t,vt,oi)}else at.render(_t,vt)};function yt(P,X,ne){P.transparent===!0&&P.side===Li&&P.forceSinglePass===!1?(P.side=Wn,P.needsUpdate=!0,hs(P,X,ne),P.side=Ur,P.needsUpdate=!0,hs(P,X,ne),P.side=Li):hs(P,X,ne)}this.compile=function(P,X,ne=null){ne===null&&(ne=P),p=ut.get(ne),p.init(X),L.push(p),ne.traverseVisible(function(Y){Y.isLight&&Y.layers.test(X.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),P!==ne&&P.traverseVisible(function(Y){Y.isLight&&Y.layers.test(X.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const ie=new Set;return P.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const Te=Y.material;if(Te)if(Array.isArray(Te))for(let Me=0;Me<Te.length;Me++){const Ge=Te[Me];yt(Ge,ne,Y),ie.add(Ge)}else yt(Te,ne,Y),ie.add(Te)}),L.pop(),p=null,ie},this.compileAsync=function(P,X,ne=null){const ie=this.compile(P,X,ne);return new Promise(Y=>{function Te(){if(ie.forEach(function(Me){qe.get(Me).currentProgram.isReady()&&ie.delete(Me)}),ie.size===0){Y(P);return}setTimeout(Te,10)}pt.get("KHR_parallel_shader_compile")!==null?Te():setTimeout(Te,10)})};let In=null;function Tn(P){In&&In(P)}function fs(){Ii.stop()}function rr(){Ii.start()}const Ii=new i0;Ii.setAnimationLoop(Tn),typeof self<"u"&&Ii.setContext(self),this.setAnimationLoop=function(P){In=P,se.setAnimationLoop(P),P===null?Ii.stop():Ii.start()},se.addEventListener("sessionstart",fs),se.addEventListener("sessionend",rr),this.render=function(P,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(k===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(se.cameraAutoUpdate===!0&&se.updateCamera(X),X=se.getCamera()),P.isScene===!0&&P.onBeforeRender(A,P,X,z),p=ut.get(P,L.length),p.init(X),L.push(p),Ae.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),J.setFromProjectionMatrix(Ae),Ee=this.localClippingEnabled,fe=Se.init(this.clippingPlanes,Ee),S=Ue.get(P,b.length),S.init(),b.push(S),se.enabled===!0&&se.isPresenting===!0){const Te=A.xr.getDepthSensingMesh();Te!==null&&Ui(Te,X,-1/0,A.sortObjects)}Ui(P,X,0,A.sortObjects),S.finish(),A.sortObjects===!0&&S.sort(ce,oe),gt=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,gt&&et.addToRenderList(S,P),this.info.render.frame++,fe===!0&&Se.beginShadows();const ne=p.state.shadowsArray;Oe.render(ne,P,X),fe===!0&&Se.endShadows(),this.info.autoReset===!0&&this.info.reset();const ie=S.opaque,Y=S.transmissive;if(p.setupLights(),X.isArrayCamera){const Te=X.cameras;if(Y.length>0)for(let Me=0,Ge=Te.length;Me<Ge;Me++){const Be=Te[Me];zr(ie,Y,P,Be)}gt&&et.render(P);for(let Me=0,Ge=Te.length;Me<Ge;Me++){const Be=Te[Me];Or(S,P,Be,Be.viewport)}}else Y.length>0&&zr(ie,Y,P,X),gt&&et.render(P),Or(S,P,X);z!==null&&(I.updateMultisampleRenderTarget(z),I.updateRenderTargetMipmap(z)),P.isScene===!0&&P.onAfterRender(A,P,X),At.resetDefaultState(),D=-1,C=null,L.pop(),L.length>0?(p=L[L.length-1],fe===!0&&Se.setGlobalState(A.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?S=b[b.length-1]:S=null};function Ui(P,X,ne,ie){if(P.visible===!1)return;if(P.layers.test(X.layers)){if(P.isGroup)ne=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(X);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||J.intersectsSprite(P)){ie&&Je.setFromMatrixPosition(P.matrixWorld).applyMatrix4(Ae);const Me=he.update(P),Ge=P.material;Ge.visible&&S.push(P,Me,Ge,ne,Je.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||J.intersectsObject(P))){const Me=he.update(P),Ge=P.material;if(ie&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Je.copy(P.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),Je.copy(Me.boundingSphere.center)),Je.applyMatrix4(P.matrixWorld).applyMatrix4(Ae)),Array.isArray(Ge)){const Be=Me.groups;for(let nt=0,rt=Be.length;nt<rt;nt++){const We=Be[nt],_t=Ge[We.materialIndex];_t&&_t.visible&&S.push(P,Me,_t,ne,Je.z,We)}}else Ge.visible&&S.push(P,Me,Ge,ne,Je.z,null)}}const Te=P.children;for(let Me=0,Ge=Te.length;Me<Ge;Me++)Ui(Te[Me],X,ne,ie)}function Or(P,X,ne,ie){const Y=P.opaque,Te=P.transmissive,Me=P.transparent;p.setupLightsView(ne),fe===!0&&Se.setGlobalState(A.clippingPlanes,ne),ie&&Ke.viewport(B.copy(ie)),Y.length>0&&sr(Y,X,ne),Te.length>0&&sr(Te,X,ne),Me.length>0&&sr(Me,X,ne),Ke.buffers.depth.setTest(!0),Ke.buffers.depth.setMask(!0),Ke.buffers.color.setMask(!0),Ke.setPolygonOffset(!1)}function zr(P,X,ne,ie){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[ie.id]===void 0&&(p.state.transmissionRenderTarget[ie.id]=new ds(1,1,{generateMipmaps:!0,type:pt.has("EXT_color_buffer_half_float")||pt.has("EXT_color_buffer_float")?ua:ir,minFilter:ls,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Mt.workingColorSpace}));const Te=p.state.transmissionRenderTarget[ie.id],Me=ie.viewport||B;Te.setSize(Me.z,Me.w);const Ge=A.getRenderTarget();A.setRenderTarget(Te),A.getClearColor(le),de=A.getClearAlpha(),de<1&&A.setClearColor(16777215,.5),A.clear(),gt&&et.render(ne);const Be=A.toneMapping;A.toneMapping=Ir;const nt=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),p.setupLightsView(ie),fe===!0&&Se.setGlobalState(A.clippingPlanes,ie),sr(P,ne,ie),I.updateMultisampleRenderTarget(Te),I.updateRenderTargetMipmap(Te),pt.has("WEBGL_multisampled_render_to_texture")===!1){let rt=!1;for(let We=0,_t=X.length;We<_t;We++){const Tt=X[We],vt=Tt.object,mn=Tt.geometry,at=Tt.material,Ye=Tt.group;if(at.side===Li&&vt.layers.test(ie.layers)){const oi=at.side;at.side=Wn,at.needsUpdate=!0,ha(vt,ne,ie,mn,at,Ye),at.side=oi,at.needsUpdate=!0,rt=!0}}rt===!0&&(I.updateMultisampleRenderTarget(Te),I.updateRenderTargetMipmap(Te))}A.setRenderTarget(Ge),A.setClearColor(le,de),nt!==void 0&&(ie.viewport=nt),A.toneMapping=Be}function sr(P,X,ne){const ie=X.isScene===!0?X.overrideMaterial:null;for(let Y=0,Te=P.length;Y<Te;Y++){const Me=P[Y],Ge=Me.object,Be=Me.geometry,nt=ie===null?Me.material:ie,rt=Me.group;Ge.layers.test(ne.layers)&&ha(Ge,X,ne,Be,nt,rt)}}function ha(P,X,ne,ie,Y,Te){P.onBeforeRender(A,X,ne,ie,Y,Te),P.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),Y.onBeforeRender(A,X,ne,ie,P,Te),Y.transparent===!0&&Y.side===Li&&Y.forceSinglePass===!1?(Y.side=Wn,Y.needsUpdate=!0,A.renderBufferDirect(ne,X,ie,Y,P,Te),Y.side=Ur,Y.needsUpdate=!0,A.renderBufferDirect(ne,X,ie,Y,P,Te),Y.side=Li):A.renderBufferDirect(ne,X,ie,Y,P,Te),P.onAfterRender(A,X,ne,ie,Y,Te)}function hs(P,X,ne){X.isScene!==!0&&(X=bt);const ie=qe.get(P),Y=p.state.lights,Te=p.state.shadowsArray,Me=Y.state.version,Ge=Ve.getParameters(P,Y.state,Te,X,ne),Be=Ve.getProgramCacheKey(Ge);let nt=ie.programs;ie.environment=P.isMeshStandardMaterial?X.environment:null,ie.fog=X.fog,ie.envMap=(P.isMeshStandardMaterial?Q:R).get(P.envMap||ie.environment),ie.envMapRotation=ie.environment!==null&&P.envMap===null?X.environmentRotation:P.envMapRotation,nt===void 0&&(P.addEventListener("dispose",ot),nt=new Map,ie.programs=nt);let rt=nt.get(Be);if(rt!==void 0){if(ie.currentProgram===rt&&ie.lightsStateVersion===Me)return Ei(P,Ge),rt}else Ge.uniforms=Ve.getUniforms(P),P.onBeforeCompile(Ge,A),rt=Ve.acquireProgram(Ge,Be),nt.set(Be,rt),ie.uniforms=Ge.uniforms;const We=ie.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(We.clippingPlanes=Se.uniform),Ei(P,Ge),ie.needsLights=ac(P),ie.lightsStateVersion=Me,ie.needsLights&&(We.ambientLightColor.value=Y.state.ambient,We.lightProbe.value=Y.state.probe,We.directionalLights.value=Y.state.directional,We.directionalLightShadows.value=Y.state.directionalShadow,We.spotLights.value=Y.state.spot,We.spotLightShadows.value=Y.state.spotShadow,We.rectAreaLights.value=Y.state.rectArea,We.ltc_1.value=Y.state.rectAreaLTC1,We.ltc_2.value=Y.state.rectAreaLTC2,We.pointLights.value=Y.state.point,We.pointLightShadows.value=Y.state.pointShadow,We.hemisphereLights.value=Y.state.hemi,We.directionalShadowMap.value=Y.state.directionalShadowMap,We.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,We.spotShadowMap.value=Y.state.spotShadowMap,We.spotLightMatrix.value=Y.state.spotLightMatrix,We.spotLightMap.value=Y.state.spotLightMap,We.pointShadowMap.value=Y.state.pointShadowMap,We.pointShadowMatrix.value=Y.state.pointShadowMatrix),ie.currentProgram=rt,ie.uniformsList=null,rt}function pa(P){if(P.uniformsList===null){const X=P.currentProgram.getUniforms();P.uniformsList=ql.seqWithValue(X.seq,P.uniforms)}return P.uniformsList}function Ei(P,X){const ne=qe.get(P);ne.outputColorSpace=X.outputColorSpace,ne.batching=X.batching,ne.batchingColor=X.batchingColor,ne.instancing=X.instancing,ne.instancingColor=X.instancingColor,ne.instancingMorph=X.instancingMorph,ne.skinning=X.skinning,ne.morphTargets=X.morphTargets,ne.morphNormals=X.morphNormals,ne.morphColors=X.morphColors,ne.morphTargetsCount=X.morphTargetsCount,ne.numClippingPlanes=X.numClippingPlanes,ne.numIntersection=X.numClipIntersection,ne.vertexAlphas=X.vertexAlphas,ne.vertexTangents=X.vertexTangents,ne.toneMapping=X.toneMapping}function ma(P,X,ne,ie,Y){X.isScene!==!0&&(X=bt),I.resetTextureUnits();const Te=X.fog,Me=ie.isMeshStandardMaterial?X.environment:null,Ge=z===null?A.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:uo,Be=(ie.isMeshStandardMaterial?Q:R).get(ie.envMap||Me),nt=ie.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,rt=!!ne.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),We=!!ne.morphAttributes.position,_t=!!ne.morphAttributes.normal,Tt=!!ne.morphAttributes.color;let vt=Ir;ie.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(vt=A.toneMapping);const mn=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,at=mn!==void 0?mn.length:0,Ye=qe.get(ie),oi=p.state.lights;if(fe===!0&&(Ee===!0||P!==C)){const An=P===C&&ie.id===D;Se.setState(ie,P,An)}let Et=!1;ie.version===Ye.__version?(Ye.needsLights&&Ye.lightsStateVersion!==oi.state.version||Ye.outputColorSpace!==Ge||Y.isBatchedMesh&&Ye.batching===!1||!Y.isBatchedMesh&&Ye.batching===!0||Y.isBatchedMesh&&Ye.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Ye.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Ye.instancing===!1||!Y.isInstancedMesh&&Ye.instancing===!0||Y.isSkinnedMesh&&Ye.skinning===!1||!Y.isSkinnedMesh&&Ye.skinning===!0||Y.isInstancedMesh&&Ye.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Ye.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Ye.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Ye.instancingMorph===!1&&Y.morphTexture!==null||Ye.envMap!==Be||ie.fog===!0&&Ye.fog!==Te||Ye.numClippingPlanes!==void 0&&(Ye.numClippingPlanes!==Se.numPlanes||Ye.numIntersection!==Se.numIntersection)||Ye.vertexAlphas!==nt||Ye.vertexTangents!==rt||Ye.morphTargets!==We||Ye.morphNormals!==_t||Ye.morphColors!==Tt||Ye.toneMapping!==vt||Ye.morphTargetsCount!==at)&&(Et=!0):(Et=!0,Ye.__version=ie.version);let gn=Ye.currentProgram;Et===!0&&(gn=hs(ie,X,Y));let ai=!1,en=!1,wi=!1;const It=gn.getUniforms(),Zn=Ye.uniforms;if(Ke.useProgram(gn.program)&&(ai=!0,en=!0,wi=!0),ie.id!==D&&(D=ie.id,en=!0),ai||C!==P){Ke.buffers.depth.getReversed()?(xe.copy(P.projectionMatrix),lx(xe),cx(xe),It.setValue(q,"projectionMatrix",xe)):It.setValue(q,"projectionMatrix",P.projectionMatrix),It.setValue(q,"viewMatrix",P.matrixWorldInverse);const Qn=It.map.cameraPosition;Qn!==void 0&&Qn.setValue(q,Ie.setFromMatrixPosition(P.matrixWorld)),dt.logarithmicDepthBuffer&&It.setValue(q,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&It.setValue(q,"isOrthographic",P.isOrthographicCamera===!0),C!==P&&(C=P,en=!0,wi=!0)}if(Y.isSkinnedMesh){It.setOptional(q,Y,"bindMatrix"),It.setOptional(q,Y,"bindMatrixInverse");const An=Y.skeleton;An&&(An.boneTexture===null&&An.computeBoneTexture(),It.setValue(q,"boneTexture",An.boneTexture,I))}Y.isBatchedMesh&&(It.setOptional(q,Y,"batchingTexture"),It.setValue(q,"batchingTexture",Y._matricesTexture,I),It.setOptional(q,Y,"batchingIdTexture"),It.setValue(q,"batchingIdTexture",Y._indirectTexture,I),It.setOptional(q,Y,"batchingColorTexture"),Y._colorsTexture!==null&&It.setValue(q,"batchingColorTexture",Y._colorsTexture,I));const Fi=ne.morphAttributes;if((Fi.position!==void 0||Fi.normal!==void 0||Fi.color!==void 0)&&tt.update(Y,ne,gn),(en||Ye.receiveShadow!==Y.receiveShadow)&&(Ye.receiveShadow=Y.receiveShadow,It.setValue(q,"receiveShadow",Y.receiveShadow)),ie.isMeshGouraudMaterial&&ie.envMap!==null&&(Zn.envMap.value=Be,Zn.flipEnvMap.value=Be.isCubeTexture&&Be.isRenderTargetTexture===!1?-1:1),ie.isMeshStandardMaterial&&ie.envMap===null&&X.environment!==null&&(Zn.envMapIntensity.value=X.environmentIntensity),en&&(It.setValue(q,"toneMappingExposure",A.toneMappingExposure),Ye.needsLights&&ga(Zn,wi),Te&&ie.fog===!0&&Re.refreshFogUniforms(Zn,Te),Re.refreshMaterialUniforms(Zn,ie,V,ue,p.state.transmissionRenderTarget[P.id]),ql.upload(q,pa(Ye),Zn,I)),ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(ql.upload(q,pa(Ye),Zn,I),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&It.setValue(q,"center",Y.center),It.setValue(q,"modelViewMatrix",Y.modelViewMatrix),It.setValue(q,"normalMatrix",Y.normalMatrix),It.setValue(q,"modelMatrix",Y.matrixWorld),ie.isShaderMaterial||ie.isRawShaderMaterial){const An=ie.uniformsGroups;for(let Qn=0,Un=An.length;Qn<Un;Qn++){const va=An[Qn];j.update(va,gn),j.bind(va,gn)}}return gn}function ga(P,X){P.ambientLightColor.needsUpdate=X,P.lightProbe.needsUpdate=X,P.directionalLights.needsUpdate=X,P.directionalLightShadows.needsUpdate=X,P.pointLights.needsUpdate=X,P.pointLightShadows.needsUpdate=X,P.spotLights.needsUpdate=X,P.spotLightShadows.needsUpdate=X,P.rectAreaLights.needsUpdate=X,P.hemisphereLights.needsUpdate=X}function ac(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(P,X,ne){qe.get(P.texture).__webglTexture=X,qe.get(P.depthTexture).__webglTexture=ne;const ie=qe.get(P);ie.__hasExternalTextures=!0,ie.__autoAllocateDepthBuffer=ne===void 0,ie.__autoAllocateDepthBuffer||pt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ie.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,X){const ne=qe.get(P);ne.__webglFramebuffer=X,ne.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(P,X=0,ne=0){z=P,N=X,U=ne;let ie=!0,Y=null,Te=!1,Me=!1;if(P){const Be=qe.get(P);if(Be.__useDefaultFramebuffer!==void 0)Ke.bindFramebuffer(q.FRAMEBUFFER,null),ie=!1;else if(Be.__webglFramebuffer===void 0)I.setupRenderTarget(P);else if(Be.__hasExternalTextures)I.rebindTextures(P,qe.get(P.texture).__webglTexture,qe.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const We=P.depthTexture;if(Be.__boundDepthTexture!==We){if(We!==null&&qe.has(We)&&(P.width!==We.image.width||P.height!==We.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(P)}}const nt=P.texture;(nt.isData3DTexture||nt.isDataArrayTexture||nt.isCompressedArrayTexture)&&(Me=!0);const rt=qe.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(rt[X])?Y=rt[X][ne]:Y=rt[X],Te=!0):P.samples>0&&I.useMultisampledRTT(P)===!1?Y=qe.get(P).__webglMultisampledFramebuffer:Array.isArray(rt)?Y=rt[ne]:Y=rt,B.copy(P.viewport),ee.copy(P.scissor),Z=P.scissorTest}else B.copy(O).multiplyScalar(V).floor(),ee.copy(re).multiplyScalar(V).floor(),Z=Ne;if(Ke.bindFramebuffer(q.FRAMEBUFFER,Y)&&ie&&Ke.drawBuffers(P,Y),Ke.viewport(B),Ke.scissor(ee),Ke.setScissorTest(Z),Te){const Be=qe.get(P.texture);q.framebufferTexture2D(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_CUBE_MAP_POSITIVE_X+X,Be.__webglTexture,ne)}else if(Me){const Be=qe.get(P.texture),nt=X||0;q.framebufferTextureLayer(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,Be.__webglTexture,ne||0,nt)}D=-1},this.readRenderTargetPixels=function(P,X,ne,ie,Y,Te,Me){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ge=qe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Me!==void 0&&(Ge=Ge[Me]),Ge){Ke.bindFramebuffer(q.FRAMEBUFFER,Ge);try{const Be=P.texture,nt=Be.format,rt=Be.type;if(!dt.textureFormatReadable(nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!dt.textureTypeReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=P.width-ie&&ne>=0&&ne<=P.height-Y&&q.readPixels(X,ne,ie,Y,st.convert(nt),st.convert(rt),Te)}finally{const Be=z!==null?qe.get(z).__webglFramebuffer:null;Ke.bindFramebuffer(q.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(P,X,ne,ie,Y,Te,Me){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ge=qe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Me!==void 0&&(Ge=Ge[Me]),Ge){const Be=P.texture,nt=Be.format,rt=Be.type;if(!dt.textureFormatReadable(nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!dt.textureTypeReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=P.width-ie&&ne>=0&&ne<=P.height-Y){Ke.bindFramebuffer(q.FRAMEBUFFER,Ge);const We=q.createBuffer();q.bindBuffer(q.PIXEL_PACK_BUFFER,We),q.bufferData(q.PIXEL_PACK_BUFFER,Te.byteLength,q.STREAM_READ),q.readPixels(X,ne,ie,Y,st.convert(nt),st.convert(rt),0);const _t=z!==null?qe.get(z).__webglFramebuffer:null;Ke.bindFramebuffer(q.FRAMEBUFFER,_t);const Tt=q.fenceSync(q.SYNC_GPU_COMMANDS_COMPLETE,0);return q.flush(),await ax(q,Tt,4),q.bindBuffer(q.PIXEL_PACK_BUFFER,We),q.getBufferSubData(q.PIXEL_PACK_BUFFER,0,Te),q.deleteBuffer(We),q.deleteSync(Tt),Te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,X=null,ne=0){P.isTexture!==!0&&(na("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,P=arguments[1]);const ie=Math.pow(2,-ne),Y=Math.floor(P.image.width*ie),Te=Math.floor(P.image.height*ie),Me=X!==null?X.x:0,Ge=X!==null?X.y:0;I.setTexture2D(P,0),q.copyTexSubImage2D(q.TEXTURE_2D,ne,0,0,Me,Ge,Y,Te),Ke.unbindTexture()},this.copyTextureToTexture=function(P,X,ne=null,ie=null,Y=0){P.isTexture!==!0&&(na("WebGLRenderer: copyTextureToTexture function signature has changed."),ie=arguments[0]||null,P=arguments[1],X=arguments[2],Y=arguments[3]||0,ne=null);let Te,Me,Ge,Be,nt,rt,We,_t,Tt;const vt=P.isCompressedTexture?P.mipmaps[Y]:P.image;ne!==null?(Te=ne.max.x-ne.min.x,Me=ne.max.y-ne.min.y,Ge=ne.isBox3?ne.max.z-ne.min.z:1,Be=ne.min.x,nt=ne.min.y,rt=ne.isBox3?ne.min.z:0):(Te=vt.width,Me=vt.height,Ge=vt.depth||1,Be=0,nt=0,rt=0),ie!==null?(We=ie.x,_t=ie.y,Tt=ie.z):(We=0,_t=0,Tt=0);const mn=st.convert(X.format),at=st.convert(X.type);let Ye;X.isData3DTexture?(I.setTexture3D(X,0),Ye=q.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(I.setTexture2DArray(X,0),Ye=q.TEXTURE_2D_ARRAY):(I.setTexture2D(X,0),Ye=q.TEXTURE_2D),q.pixelStorei(q.UNPACK_FLIP_Y_WEBGL,X.flipY),q.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),q.pixelStorei(q.UNPACK_ALIGNMENT,X.unpackAlignment);const oi=q.getParameter(q.UNPACK_ROW_LENGTH),Et=q.getParameter(q.UNPACK_IMAGE_HEIGHT),gn=q.getParameter(q.UNPACK_SKIP_PIXELS),ai=q.getParameter(q.UNPACK_SKIP_ROWS),en=q.getParameter(q.UNPACK_SKIP_IMAGES);q.pixelStorei(q.UNPACK_ROW_LENGTH,vt.width),q.pixelStorei(q.UNPACK_IMAGE_HEIGHT,vt.height),q.pixelStorei(q.UNPACK_SKIP_PIXELS,Be),q.pixelStorei(q.UNPACK_SKIP_ROWS,nt),q.pixelStorei(q.UNPACK_SKIP_IMAGES,rt);const wi=P.isDataArrayTexture||P.isData3DTexture,It=X.isDataArrayTexture||X.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){const Zn=qe.get(P),Fi=qe.get(X),An=qe.get(Zn.__renderTarget),Qn=qe.get(Fi.__renderTarget);Ke.bindFramebuffer(q.READ_FRAMEBUFFER,An.__webglFramebuffer),Ke.bindFramebuffer(q.DRAW_FRAMEBUFFER,Qn.__webglFramebuffer);for(let Un=0;Un<Ge;Un++)wi&&q.framebufferTextureLayer(q.READ_FRAMEBUFFER,q.COLOR_ATTACHMENT0,qe.get(P).__webglTexture,Y,rt+Un),P.isDepthTexture?(It&&q.framebufferTextureLayer(q.DRAW_FRAMEBUFFER,q.COLOR_ATTACHMENT0,qe.get(X).__webglTexture,Y,Tt+Un),q.blitFramebuffer(Be,nt,Te,Me,We,_t,Te,Me,q.DEPTH_BUFFER_BIT,q.NEAREST)):It?q.copyTexSubImage3D(Ye,Y,We,_t,Tt+Un,Be,nt,Te,Me):q.copyTexSubImage2D(Ye,Y,We,_t,Tt+Un,Be,nt,Te,Me);Ke.bindFramebuffer(q.READ_FRAMEBUFFER,null),Ke.bindFramebuffer(q.DRAW_FRAMEBUFFER,null)}else It?P.isDataTexture||P.isData3DTexture?q.texSubImage3D(Ye,Y,We,_t,Tt,Te,Me,Ge,mn,at,vt.data):X.isCompressedArrayTexture?q.compressedTexSubImage3D(Ye,Y,We,_t,Tt,Te,Me,Ge,mn,vt.data):q.texSubImage3D(Ye,Y,We,_t,Tt,Te,Me,Ge,mn,at,vt):P.isDataTexture?q.texSubImage2D(q.TEXTURE_2D,Y,We,_t,Te,Me,mn,at,vt.data):P.isCompressedTexture?q.compressedTexSubImage2D(q.TEXTURE_2D,Y,We,_t,vt.width,vt.height,mn,vt.data):q.texSubImage2D(q.TEXTURE_2D,Y,We,_t,Te,Me,mn,at,vt);q.pixelStorei(q.UNPACK_ROW_LENGTH,oi),q.pixelStorei(q.UNPACK_IMAGE_HEIGHT,Et),q.pixelStorei(q.UNPACK_SKIP_PIXELS,gn),q.pixelStorei(q.UNPACK_SKIP_ROWS,ai),q.pixelStorei(q.UNPACK_SKIP_IMAGES,en),Y===0&&X.generateMipmaps&&q.generateMipmap(Ye),Ke.unbindTexture()},this.copyTextureToTexture3D=function(P,X,ne=null,ie=null,Y=0){return P.isTexture!==!0&&(na("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ne=arguments[0]||null,ie=arguments[1]||null,P=arguments[2],X=arguments[3],Y=arguments[4]||0),na('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,X,ne,ie,Y)},this.initRenderTarget=function(P){qe.get(P).__webglFramebuffer===void 0&&I.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?I.setTextureCube(P,0):P.isData3DTexture?I.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?I.setTexture2DArray(P,0):I.setTexture2D(P,0),Ke.unbindTexture()},this.resetState=function(){N=0,U=0,z=null,Ke.reset(),At.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return tr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Mt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Mt._getUnpackColorSpace()}}class Df{constructor(e,t=1,r=1e3){this.isFog=!0,this.name="",this.color=new xt(e),this.near=t,this.far=r}clone(){return new Df(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class _g extends un{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ni,this.environmentIntensity=1,this.environmentRotation=new Ni,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Nf extends po{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new xt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ql=new G,Jl=new G,xg=new zt,ea=new Cf,Bl=new ic,_d=new G,yg=new G;class mf extends un{constructor(e=new Nn,t=new Nf){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,r=[0];for(let a=1,l=t.count;a<l;a++)Ql.fromBufferAttribute(t,a-1),Jl.fromBufferAttribute(t,a),r[a]=r[a-1],r[a]+=Ql.distanceTo(Jl);e.setAttribute("lineDistance",new Qt(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const r=this.geometry,a=this.matrixWorld,l=e.params.Line.threshold,u=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),Bl.copy(r.boundingSphere),Bl.applyMatrix4(a),Bl.radius+=l,e.ray.intersectsSphere(Bl)===!1)return;xg.copy(a).invert(),ea.copy(e.ray).applyMatrix4(xg);const d=l/((this.scale.x+this.scale.y+this.scale.z)/3),h=d*d,m=this.isLineSegments?2:1,v=r.index,_=r.attributes.position;if(v!==null){const y=Math.max(0,u.start),E=Math.min(v.count,u.start+u.count);for(let w=y,S=E-1;w<S;w+=m){const p=v.getX(w),b=v.getX(w+1),L=Hl(this,e,ea,h,p,b);L&&t.push(L)}if(this.isLineLoop){const w=v.getX(E-1),S=v.getX(y),p=Hl(this,e,ea,h,w,S);p&&t.push(p)}}else{const y=Math.max(0,u.start),E=Math.min(_.count,u.start+u.count);for(let w=y,S=E-1;w<S;w+=m){const p=Hl(this,e,ea,h,w,w+1);p&&t.push(p)}if(this.isLineLoop){const w=Hl(this,e,ea,h,E-1,y);w&&t.push(w)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=a.length;l<u;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}}function Hl(s,e,t,r,a,l){const u=s.geometry.attributes.position;if(Ql.fromBufferAttribute(u,a),Jl.fromBufferAttribute(u,l),t.distanceSqToSegment(Ql,Jl,_d,yg)>r)return;_d.applyMatrix4(s.matrixWorld);const h=e.ray.origin.distanceTo(_d);if(!(h<e.near||h>e.far))return{distance:h,point:yg.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}class u0 extends En{constructor(e,t,r,a,l,u,d,h,m){super(e,t,r,a,l,u,d,h,m),this.isCanvasTexture=!0,this.needsUpdate=!0}}class x1{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const r=this.getUtoTmapping(e);return this.getPoint(r,t)}getPoints(e=5){const t=[];for(let r=0;r<=e;r++)t.push(this.getPoint(r/e));return t}getSpacedPoints(e=5){const t=[];for(let r=0;r<=e;r++)t.push(this.getPointAt(r/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let r,a=this.getPoint(0),l=0;t.push(0);for(let u=1;u<=e;u++)r=this.getPoint(u/e),l+=r.distanceTo(a),t.push(l),a=r;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const r=this.getLengths();let a=0;const l=r.length;let u;t?u=t:u=e*r[l-1];let d=0,h=l-1,m;for(;d<=h;)if(a=Math.floor(d+(h-d)/2),m=r[a]-u,m<0)d=a+1;else if(m>0)h=a-1;else{h=a;break}if(a=h,r[a]===u)return a/(l-1);const v=r[a],_=r[a+1]-v,y=(u-v)/_;return(a+y)/(l-1)}getTangent(e,t){let a=e-1e-4,l=e+1e-4;a<0&&(a=0),l>1&&(l=1);const u=this.getPoint(a),d=this.getPoint(l),h=t||(u.isVector2?new mt:new G);return h.copy(d).sub(u).normalize(),h}getTangentAt(e,t){const r=this.getUtoTmapping(e);return this.getTangent(r,t)}computeFrenetFrames(e,t){const r=new G,a=[],l=[],u=[],d=new G,h=new zt;for(let y=0;y<=e;y++){const E=y/e;a[y]=this.getTangentAt(E,new G)}l[0]=new G,u[0]=new G;let m=Number.MAX_VALUE;const v=Math.abs(a[0].x),x=Math.abs(a[0].y),_=Math.abs(a[0].z);v<=m&&(m=v,r.set(1,0,0)),x<=m&&(m=x,r.set(0,1,0)),_<=m&&r.set(0,0,1),d.crossVectors(a[0],r).normalize(),l[0].crossVectors(a[0],d),u[0].crossVectors(a[0],l[0]);for(let y=1;y<=e;y++){if(l[y]=l[y-1].clone(),u[y]=u[y-1].clone(),d.crossVectors(a[y-1],a[y]),d.length()>Number.EPSILON){d.normalize();const E=Math.acos(pn(a[y-1].dot(a[y]),-1,1));l[y].applyMatrix4(h.makeRotationAxis(d,E))}u[y].crossVectors(a[y],l[y])}if(t===!0){let y=Math.acos(pn(l[0].dot(l[e]),-1,1));y/=e,a[0].dot(d.crossVectors(l[0],l[e]))>0&&(y=-y);for(let E=1;E<=e;E++)l[E].applyMatrix4(h.makeRotationAxis(a[E],y*E)),u[E].crossVectors(a[E],l[E])}return{tangents:a,normals:l,binormals:u}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function If(){let s=0,e=0,t=0,r=0;function a(l,u,d,h){s=l,e=d,t=-3*l+3*u-2*d-h,r=2*l-2*u+d+h}return{initCatmullRom:function(l,u,d,h,m){a(u,d,m*(d-l),m*(h-u))},initNonuniformCatmullRom:function(l,u,d,h,m,v,x){let _=(u-l)/m-(d-l)/(m+v)+(d-u)/v,y=(d-u)/v-(h-u)/(v+x)+(h-d)/x;_*=v,y*=v,a(u,d,_,y)},calc:function(l){const u=l*l,d=u*l;return s+e*l+t*u+r*d}}}const Vl=new G,xd=new If,yd=new If,Sd=new If;class y1 extends x1{constructor(e=[],t=!1,r="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=r,this.tension=a}getPoint(e,t=new G){const r=t,a=this.points,l=a.length,u=(l-(this.closed?0:1))*e;let d=Math.floor(u),h=u-d;this.closed?d+=d>0?0:(Math.floor(Math.abs(d)/l)+1)*l:h===0&&d===l-1&&(d=l-2,h=1);let m,v;this.closed||d>0?m=a[(d-1)%l]:(Vl.subVectors(a[0],a[1]).add(a[0]),m=Vl);const x=a[d%l],_=a[(d+1)%l];if(this.closed||d+2<l?v=a[(d+2)%l]:(Vl.subVectors(a[l-1],a[l-2]).add(a[l-1]),v=Vl),this.curveType==="centripetal"||this.curveType==="chordal"){const y=this.curveType==="chordal"?.5:.25;let E=Math.pow(m.distanceToSquared(x),y),w=Math.pow(x.distanceToSquared(_),y),S=Math.pow(_.distanceToSquared(v),y);w<1e-4&&(w=1),E<1e-4&&(E=w),S<1e-4&&(S=w),xd.initNonuniformCatmullRom(m.x,x.x,_.x,v.x,E,w,S),yd.initNonuniformCatmullRom(m.y,x.y,_.y,v.y,E,w,S),Sd.initNonuniformCatmullRom(m.z,x.z,_.z,v.z,E,w,S)}else this.curveType==="catmullrom"&&(xd.initCatmullRom(m.x,x.x,_.x,v.x,this.tension),yd.initCatmullRom(m.y,x.y,_.y,v.y,this.tension),Sd.initCatmullRom(m.z,x.z,_.z,v.z,this.tension));return r.set(xd.calc(h),yd.calc(h),Sd.calc(h)),r}copy(e){super.copy(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(a.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,r=this.points.length;t<r;t++){const a=this.points[t];e.points.push(a.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(new G().fromArray(a))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}class Uf extends Nn{constructor(e=1,t=1,r=1,a=32,l=1,u=!1,d=0,h=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:r,radialSegments:a,heightSegments:l,openEnded:u,thetaStart:d,thetaLength:h};const m=this;a=Math.floor(a),l=Math.floor(l);const v=[],x=[],_=[],y=[];let E=0;const w=[],S=r/2;let p=0;b(),u===!1&&(e>0&&L(!0),t>0&&L(!1)),this.setIndex(v),this.setAttribute("position",new Qt(x,3)),this.setAttribute("normal",new Qt(_,3)),this.setAttribute("uv",new Qt(y,2));function b(){const A=new G,k=new G;let N=0;const U=(t-e)/r;for(let z=0;z<=l;z++){const D=[],C=z/l,B=C*(t-e)+e;for(let ee=0;ee<=a;ee++){const Z=ee/a,le=Z*h+d,de=Math.sin(le),ae=Math.cos(le);k.x=B*de,k.y=-C*r+S,k.z=B*ae,x.push(k.x,k.y,k.z),A.set(de,U,ae).normalize(),_.push(A.x,A.y,A.z),y.push(Z,1-C),D.push(E++)}w.push(D)}for(let z=0;z<a;z++)for(let D=0;D<l;D++){const C=w[D][z],B=w[D+1][z],ee=w[D+1][z+1],Z=w[D][z+1];(e>0||D!==0)&&(v.push(C,B,Z),N+=3),(t>0||D!==l-1)&&(v.push(B,ee,Z),N+=3)}m.addGroup(p,N,0),p+=N}function L(A){const k=E,N=new mt,U=new G;let z=0;const D=A===!0?e:t,C=A===!0?1:-1;for(let ee=1;ee<=a;ee++)x.push(0,S*C,0),_.push(0,C,0),y.push(.5,.5),E++;const B=E;for(let ee=0;ee<=a;ee++){const le=ee/a*h+d,de=Math.cos(le),ae=Math.sin(le);U.x=D*ae,U.y=S*C,U.z=D*de,x.push(U.x,U.y,U.z),_.push(0,C,0),N.x=de*.5+.5,N.y=ae*.5*C+.5,y.push(N.x,N.y),E++}for(let ee=0;ee<a;ee++){const Z=k+ee,le=B+ee;A===!0?v.push(le,le+1,Z):v.push(le+1,le,Z),z+=3}m.addGroup(p,z,A===!0?1:2),p+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Uf(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ff extends Nn{constructor(e=[],t=[],r=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:r,detail:a};const l=[],u=[];d(a),m(r),v(),this.setAttribute("position",new Qt(l,3)),this.setAttribute("normal",new Qt(l.slice(),3)),this.setAttribute("uv",new Qt(u,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function d(b){const L=new G,A=new G,k=new G;for(let N=0;N<t.length;N+=3)y(t[N+0],L),y(t[N+1],A),y(t[N+2],k),h(L,A,k,b)}function h(b,L,A,k){const N=k+1,U=[];for(let z=0;z<=N;z++){U[z]=[];const D=b.clone().lerp(A,z/N),C=L.clone().lerp(A,z/N),B=N-z;for(let ee=0;ee<=B;ee++)ee===0&&z===N?U[z][ee]=D:U[z][ee]=D.clone().lerp(C,ee/B)}for(let z=0;z<N;z++)for(let D=0;D<2*(N-z)-1;D++){const C=Math.floor(D/2);D%2===0?(_(U[z][C+1]),_(U[z+1][C]),_(U[z][C])):(_(U[z][C+1]),_(U[z+1][C+1]),_(U[z+1][C]))}}function m(b){const L=new G;for(let A=0;A<l.length;A+=3)L.x=l[A+0],L.y=l[A+1],L.z=l[A+2],L.normalize().multiplyScalar(b),l[A+0]=L.x,l[A+1]=L.y,l[A+2]=L.z}function v(){const b=new G;for(let L=0;L<l.length;L+=3){b.x=l[L+0],b.y=l[L+1],b.z=l[L+2];const A=S(b)/2/Math.PI+.5,k=p(b)/Math.PI+.5;u.push(A,1-k)}E(),x()}function x(){for(let b=0;b<u.length;b+=6){const L=u[b+0],A=u[b+2],k=u[b+4],N=Math.max(L,A,k),U=Math.min(L,A,k);N>.9&&U<.1&&(L<.2&&(u[b+0]+=1),A<.2&&(u[b+2]+=1),k<.2&&(u[b+4]+=1))}}function _(b){l.push(b.x,b.y,b.z)}function y(b,L){const A=b*3;L.x=e[A+0],L.y=e[A+1],L.z=e[A+2]}function E(){const b=new G,L=new G,A=new G,k=new G,N=new mt,U=new mt,z=new mt;for(let D=0,C=0;D<l.length;D+=9,C+=6){b.set(l[D+0],l[D+1],l[D+2]),L.set(l[D+3],l[D+4],l[D+5]),A.set(l[D+6],l[D+7],l[D+8]),N.set(u[C+0],u[C+1]),U.set(u[C+2],u[C+3]),z.set(u[C+4],u[C+5]),k.copy(b).add(L).add(A).divideScalar(3);const B=S(k);w(N,C+0,b,B),w(U,C+2,L,B),w(z,C+4,A,B)}}function w(b,L,A,k){k<0&&b.x===1&&(u[L]=b.x-1),A.x===0&&A.z===0&&(u[L]=k/2/Math.PI+.5)}function S(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ff(e.vertices,e.indices,e.radius,e.details)}}class Of extends Ff{constructor(e=1,t=0){const r=(1+Math.sqrt(5))/2,a=[-1,r,0,1,r,0,-1,-r,0,1,-r,0,0,-1,r,0,1,r,0,-1,-r,0,1,-r,r,0,-1,r,0,1,-r,0,-1,-r,0,1],l=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(a,l,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Of(e.radius,e.detail)}}class zf extends Nn{constructor(e=.5,t=1,r=32,a=1,l=0,u=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:r,phiSegments:a,thetaStart:l,thetaLength:u},r=Math.max(3,r),a=Math.max(1,a);const d=[],h=[],m=[],v=[];let x=e;const _=(t-e)/a,y=new G,E=new mt;for(let w=0;w<=a;w++){for(let S=0;S<=r;S++){const p=l+S/r*u;y.x=x*Math.cos(p),y.y=x*Math.sin(p),h.push(y.x,y.y,y.z),m.push(0,0,1),E.x=(y.x/t+1)/2,E.y=(y.y/t+1)/2,v.push(E.x,E.y)}x+=_}for(let w=0;w<a;w++){const S=w*(r+1);for(let p=0;p<r;p++){const b=p+S,L=b,A=b+r+1,k=b+r+2,N=b+1;d.push(L,A,N),d.push(A,k,N)}}this.setIndex(d),this.setAttribute("position",new Qt(h,3)),this.setAttribute("normal",new Qt(m,3)),this.setAttribute("uv",new Qt(v,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zf(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class co extends Nn{constructor(e=1,t=32,r=16,a=0,l=Math.PI*2,u=0,d=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:r,phiStart:a,phiLength:l,thetaStart:u,thetaLength:d},t=Math.max(3,Math.floor(t)),r=Math.max(2,Math.floor(r));const h=Math.min(u+d,Math.PI);let m=0;const v=[],x=new G,_=new G,y=[],E=[],w=[],S=[];for(let p=0;p<=r;p++){const b=[],L=p/r;let A=0;p===0&&u===0?A=.5/t:p===r&&h===Math.PI&&(A=-.5/t);for(let k=0;k<=t;k++){const N=k/t;x.x=-e*Math.cos(a+N*l)*Math.sin(u+L*d),x.y=e*Math.cos(u+L*d),x.z=e*Math.sin(a+N*l)*Math.sin(u+L*d),E.push(x.x,x.y,x.z),_.copy(x).normalize(),w.push(_.x,_.y,_.z),S.push(N+A,1-L),b.push(m++)}v.push(b)}for(let p=0;p<r;p++)for(let b=0;b<t;b++){const L=v[p][b+1],A=v[p][b],k=v[p+1][b],N=v[p+1][b+1];(p!==0||u>0)&&y.push(L,A,N),(p!==r-1||h<Math.PI)&&y.push(A,k,N)}this.setIndex(y),this.setAttribute("position",new Qt(E,3)),this.setAttribute("normal",new Qt(w,3)),this.setAttribute("uv",new Qt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new co(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Qs extends po{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xg,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class kf extends un{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new xt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Sg extends kf{constructor(e,t,r){super(e,r),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(un.DEFAULT_UP),this.updateMatrix(),this.groundColor=new xt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Md=new zt,Mg=new G,Eg=new G;class d0{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new mt(512,512),this.map=null,this.mapPass=null,this.matrix=new zt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Pf,this._frameExtents=new mt(1,1),this._viewportCount=1,this._viewports=[new Nt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,r=this.matrix;Mg.setFromMatrixPosition(e.matrixWorld),t.position.copy(Mg),Eg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Eg),t.updateMatrixWorld(),Md.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Md),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(Md)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const wg=new zt,ta=new G,Ed=new G;class S1 extends d0{constructor(){super(new Vn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new mt(4,2),this._viewportCount=6,this._viewports=[new Nt(2,1,1,1),new Nt(0,1,1,1),new Nt(3,1,1,1),new Nt(1,1,1,1),new Nt(3,0,1,1),new Nt(1,0,1,1)],this._cubeDirections=[new G(1,0,0),new G(-1,0,0),new G(0,0,1),new G(0,0,-1),new G(0,1,0),new G(0,-1,0)],this._cubeUps=[new G(0,1,0),new G(0,1,0),new G(0,1,0),new G(0,1,0),new G(0,0,1),new G(0,0,-1)]}updateMatrices(e,t=0){const r=this.camera,a=this.matrix,l=e.distance||r.far;l!==r.far&&(r.far=l,r.updateProjectionMatrix()),ta.setFromMatrixPosition(e.matrixWorld),r.position.copy(ta),Ed.copy(r.position),Ed.add(this._cubeDirections[t]),r.up.copy(this._cubeUps[t]),r.lookAt(Ed),r.updateMatrixWorld(),a.makeTranslation(-ta.x,-ta.y,-ta.z),wg.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wg)}}class M1 extends kf{constructor(e,t,r=0,a=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=r,this.decay=a,this.shadow=new S1}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class E1 extends d0{constructor(){super(new r0(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Tg extends kf{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(un.DEFAULT_UP),this.updateMatrix(),this.target=new un,this.shadow=new E1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Ag=new zt;class w1{constructor(e,t,r=0,a=1/0){this.ray=new Cf(e,t),this.near=r,this.far=a,this.camera=null,this.layers=new bf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ag.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ag),this}intersectObject(e,t=!0,r=[]){return gf(e,this,r,t),r.sort(Rg),r}intersectObjects(e,t=!0,r=[]){for(let a=0,l=e.length;a<l;a++)gf(e[a],this,r,t);return r.sort(Rg),r}}function Rg(s,e){return s.distance-e.distance}function gf(s,e,t,r){let a=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(a=!1),a===!0&&r===!0){const l=s.children;for(let u=0,d=l.length;u<d;u++)gf(l[u],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:yf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=yf);function T1(s,e=!1){const t=s[0].index!==null,r=new Set(Object.keys(s[0].attributes)),a=new Set(Object.keys(s[0].morphAttributes)),l={},u={},d=s[0].morphTargetsRelative,h=new Nn;let m=0;for(let v=0;v<s.length;++v){const x=s[v];let _=0;if(t!==(x.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+v+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const y in x.attributes){if(!r.has(y))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+v+'. All geometries must have compatible attributes; make sure "'+y+'" attribute exists among all geometries, or in none of them.'),null;l[y]===void 0&&(l[y]=[]),l[y].push(x.attributes[y]),_++}if(_!==r.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+v+". Make sure all geometries have the same number of attributes."),null;if(d!==x.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+v+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const y in x.morphAttributes){if(!a.has(y))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+v+".  .morphAttributes must be consistent throughout all geometries."),null;u[y]===void 0&&(u[y]=[]),u[y].push(x.morphAttributes[y])}if(e){let y;if(t)y=x.index.count;else if(x.attributes.position!==void 0)y=x.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+v+". The geometry must have either an index or a position attribute"),null;h.addGroup(m,y,v),m+=y}}if(t){let v=0;const x=[];for(let _=0;_<s.length;++_){const y=s[_].index;for(let E=0;E<y.count;++E)x.push(y.getX(E)+v);v+=s[_].attributes.position.count}h.setIndex(x)}for(const v in l){const x=Cg(l[v]);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+v+" attribute."),null;h.setAttribute(v,x)}for(const v in u){const x=u[v][0].length;if(x===0)break;h.morphAttributes=h.morphAttributes||{},h.morphAttributes[v]=[];for(let _=0;_<x;++_){const y=[];for(let w=0;w<u[v].length;++w)y.push(u[v][w][_]);const E=Cg(y);if(!E)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+v+" morphAttribute."),null;h.morphAttributes[v].push(E)}}return h}function Cg(s){let e,t,r,a=-1,l=0;for(let m=0;m<s.length;++m){const v=s[m];if(e===void 0&&(e=v.array.constructor),e!==v.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=v.itemSize),t!==v.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(r===void 0&&(r=v.normalized),r!==v.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(a===-1&&(a=v.gpuType),a!==v.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;l+=v.count*t}const u=new e(l),d=new Mi(u,t,r);let h=0;for(let m=0;m<s.length;++m){const v=s[m];if(v.isInterleavedBufferAttribute){const x=h/t;for(let _=0,y=v.count;_<y;_++)for(let E=0;E<t;E++){const w=v.getComponent(_,E);d.setComponent(_+x,E,w)}}else u.set(v.array,h);h+=v.count*t}return a!==void 0&&(d.gpuType=a),d}const hn=2,sc=-42,A1=44,oc=-34,R1=38,qt=(A1-sc)/hn,ca=(R1-oc)/hn,f0=[{name:"T SPAWN",x:-10,z:24,w:28,d:12},{name:"UPPER MID",x:-6,z:8,w:12,d:20},{name:"MID",x:-6,z:-12,w:12,d:22},{name:"CT SPAWN",x:-14,z:-24,w:32,d:12},{name:"CT CROSS",x:-28,z:-24,w:56,d:8},{name:"LONG APPROACH",x:14,z:20,w:26,d:10},{name:"LONG DOORS",x:30,z:10,w:10,d:16},{name:"A LONG",x:30,z:-24,w:10,d:38},{name:"A SITE",x:18,z:-28,w:22,d:16},{name:"CATWALK",x:4,z:8,w:14,d:6},{name:"SHORT A",x:12,z:-12,w:6,d:24},{name:"A RAMP",x:12,z:-16,w:16,d:8},{name:"TUNNEL APPROACH",x:-30,z:22,w:24,d:8},{name:"B TUNNELS",x:-32,z:-8,w:10,d:34},{name:"LOWER TUNNELS",x:-26,z:4,w:24,d:6},{name:"B SITE",x:-38,z:-28,w:22,d:22}],vf=[{name:"A",x:27,z:-21,r:6.6},{name:"B",x:-28,z:-19,r:7}],Bf=[{x:24,z:-24,w:4,d:3,h:2.5,y:0,kind:"crate"},{x:20,z:-20,w:2.2,d:2.2,h:1.7,y:0,kind:"crate"},{x:34,z:-20,w:2,d:3,h:1.5,y:0,kind:"crate"},{x:30,z:1,w:2,d:3,h:1.8,y:0,kind:"crate"},{x:-34,z:-25,w:4,d:4,h:2.7,y:0,kind:"crate"},{x:-24,z:-20,w:3,d:3,h:2,y:0,kind:"crate"},{x:-36,z:-13,w:3,d:2,h:1.6,y:0,kind:"crate"},{x:-31,z:12,w:2,d:3,h:1.8,y:0,kind:"crate"},{x:-6,z:17,w:2,d:3,h:2.2,y:0,kind:"crate"},{x:12,z:25,w:2,d:3,h:1.6,y:0,kind:"crate"},{x:-5.9,z:-9,w:4.5,d:.5,h:3.4,y:0,kind:"door"},{x:1.4,z:-8,w:4.5,d:.5,h:3.4,y:0,kind:"door"},{x:30,z:12,w:3.5,d:.5,h:3.5,y:0,kind:"door"},{x:36.5,z:13,w:3.5,d:.5,h:3.5,y:0,kind:"door"}];function h0(s,e,t){return s>=t.x&&s<t.x+t.w&&e>=t.z&&e<t.z+t.d}const Gn=Array.from({length:qt*ca},(s,e)=>{const t=sc+(e%qt+.5)*hn,r=oc+(Math.floor(e/qt)+.5)*hn;return f0.some(a=>h0(t,r,a))});function C1(s,e){const t=Math.floor((s-sc)/hn),r=Math.floor((e-oc)/hn);return t<0||r<0||t>=qt||r>=ca?-1:r*qt+t}function bi(s){return{x:sc+(s%qt+.5)*hn,z:oc+(Math.floor(s/qt)+.5)*hn}}function b1(s,e){const t=C1(s,e);return t>=0&&Gn[t]}function cs(s,e,t=.34,r=0){for(const a of[-t,0,t])for(const l of[-t,0,t])if(!b1(s+a,e+l))return!1;return!Bf.some(a=>r<a.y+a.h&&s+t>a.x&&s-t<a.x+a.w&&e+t>a.z&&e-t<a.z+a.d)}function wd(s,e,t,r=.34){const a=Math.max(1,Math.ceil(Math.hypot(e,t)/.17));for(let l=0;l<a;l++)cs(s.x+e/a,s.z,r,s.y)&&(s.x+=e/a),cs(s.x,s.z+t/a,r,s.y)&&(s.z+=t/a)}function P1(s,e){var t;return Math.hypot(s-27,e+21)<9?"A SITE":Math.hypot(s+28,e+19)<10?"B SITE":((t=[...f0].reverse().find(r=>h0(s,e,r)))==null?void 0:t.name)||"DUST II"}class L1{constructor(){Xe(this,"grid",Gn.map((e,t)=>{const r=bi(t);return e&&cs(r.x,r.z,.4)}))}nearest(e,t){let r=-1,a=1/0;for(let l=0;l<this.grid.length;l++)if(this.grid[l]){const u=bi(l),d=(u.x-e)**2+(u.z-t)**2;d<a&&(r=l,a=d)}return r}find(e,t,r,a){const l=this.nearest(e,t),u=this.nearest(r,a);if(l<0||u<0)return[];const d=new Set([l]),h=new Map,m=new Map([[l,0]]),v=new Map([[l,0]]),x=bi(u);for(;d.size;){let _=-1,y=1/0;for(const w of d)(v.get(w)??1/0)<y&&(y=v.get(w),_=w);if(_===u){const w=[bi(_)];for(;h.has(_);)_=h.get(_),w.unshift(bi(_));return w}d.delete(_);const E=_%qt;for(const w of[_-qt,_+qt,...E>0?[_-1]:[],...E<qt-1?[_+1]:[]]){if(w<0||w>=this.grid.length||!this.grid[w])continue;const S=bi(_),p=bi(w);if(!cs((S.x+p.x)/2,(S.z+p.z)/2,.4))continue;const b=m.get(_)+1;b<(m.get(w)??1/0)&&(h.set(w,_),m.set(w,b),v.set(w,b+(Math.abs(p.x-x.x)+Math.abs(p.z-x.z))/hn),d.add(w))}}return[]}}const Td=new Map;function Dt(s,e=0,t=.8){const r=`${s}-${e}-${t}`;return Td.has(r)||Td.set(r,new Qs({color:s,metalness:e,roughness:t})),Td.get(r)}function $e(s,e,t,r,a,l,u,d){const h=new Ot(new mo(e,t,r),d);return h.position.set(a,l,u),h.castShadow=!0,h.receiveShadow=!0,s.add(h),h}function Ji(s,e,t,r,a,l,u,d=12){const h=new Ot(new Uf(e,e,t,d),u);return h.position.set(r,a,l),h.castShadow=!0,s.add(h),h}function ec(s,e=[],t=!1){s.updateMatrixWorld(!0);const r=new Map;for(const a of[...s.children])if(a instanceof Ot&&!Array.isArray(a.material)){const l=r.get(a.material)||[];l.push(a.geometry.clone().applyMatrix4(a.matrix)),r.set(a.material,l),t&&e.includes(a)?a.visible=!1:s.remove(a),e.includes(a)||a.geometry.dispose()}for(const[a,l]of r){const u=T1(l,!1);for(const d of l)d.dispose();if(u){const d=new Ot(u,a);d.castShadow=!0,d.receiveShadow=!0,s.add(d)}}}let Ad=129;function Ki(){return Ad=Ad*16807%2147483647,(Ad-1)/2147483646}function Rd(s,e){const t=document.createElement("canvas");t.width=t.height=256;const r=t.getContext("2d");r.fillStyle=s,r.fillRect(0,0,256,256);for(let l=0;l<12e3;l++){const u=Ki()*.09;r.fillStyle=`rgba(${Ki()>.5?"255,244,220":"50,35,20"},${u})`,r.fillRect(Ki()*256,Ki()*256,Ki()*3+.4,Ki()*2+.4)}if(e==="wood")for(let l=0;l<8;l++){r.fillStyle="rgba(30,20,10,.3)",r.fillRect(l*32,0,2,256);for(let u=0;u<15;u++)r.fillStyle="rgba(50,29,10,.14)",r.fillRect(l*32+Ki()*28,Ki()*256,1,Ki()*120)}if(e==="plaster")for(let l=0;l<16;l++)r.fillStyle="rgba(90,69,40,.025)",r.fillRect(0,l*16,256,1);const a=new u0(t);return a.wrapS=a.wrapT=$l,a.repeat.set(e==="ground"?45:1,e==="ground"?45:1),a.colorSpace=Dn,a}function Zi(s,e,t,r,a,l=0,u=2.3,d=1.4,h="#a9472d",m="#fff1cd"){const v=document.createElement("canvas");v.width=512,v.height=256;const x=v.getContext("2d");x.fillStyle=h,x.fillRect(0,0,512,256),x.strokeStyle=m,x.lineWidth=7,x.strokeRect(14,14,484,228),x.fillStyle=m,x.font=`bold ${e.length<4?170:57}px Arial`,x.textAlign="center",x.textBaseline="middle",x.fillText(e,256,132,460);const _=new u0(v);_.colorSpace=Dn;const y=new Ot(new go(u,d),new Qs({map:_,roughness:.9}));return y.position.set(t,r,a),y.rotation.y=l,s.add(y),y}function D1(s){const e=new yi;s.add(e);const t=[],r=new Qs({color:"#dfc6a1",map:Rd("#c6b08c","plaster"),roughness:.95}),a=Dt("#d9c6a6"),l=Dt("#b5a080"),u=Dt("#474d48"),d=new Qs({map:Rd("#857451","wood"),roughness:.92}),h=new Ot(new go(240,240),new Qs({color:"#c4b596",map:Rd("#c3b69b","ground"),roughness:1}));h.rotation.x=-Math.PI/2,h.receiveShadow=!0,e.add(h);const m=[];for(let p=0;p<ca;p++)for(let b=0;b<qt;b++){const L=p*qt+b;if(!Gn[L])continue;const A=bi(L);(p===0||!Gn[L-qt])&&m.push({x:A.x,z:A.z-hn/2,w:hn,d:.38,axis:"n"}),(p===ca-1||!Gn[L+qt])&&m.push({x:A.x,z:A.z+hn/2,w:hn,d:.38,axis:"s"}),(b===0||!Gn[L-1])&&m.push({x:A.x-hn/2,z:A.z,w:.38,d:hn,axis:"w"}),(b===qt-1||!Gn[L+1])&&m.push({x:A.x+hn/2,z:A.z,w:.38,d:hn,axis:"e"})}const v=[];for(const p of["n","s","w","e"]){const b=p==="n"||p==="s",L=m.filter(A=>A.axis===p).sort((A,k)=>b?A.z-k.z||A.x-k.x:A.x-k.x||A.z-k.z);for(const A of L){const k=v[v.length-1];k&&k.axis===p&&(b?k.z===A.z&&Math.abs(k.x+k.w/2-(A.x-A.w/2))<.01:k.x===A.x&&Math.abs(k.z+k.d/2-(A.z-A.d/2))<.01)?b?(k.x+=A.w/2,k.w+=A.w):(k.z+=A.d/2,k.d+=A.d):v.push({...A})}}for(const p of v){const b=5.4+Math.abs(p.x*3+p.z)%3*.5;t.push($e(e,p.w,b,p.d,p.x,b/2,p.z,r)),$e(e,p.w+.12,.23,p.d+.12,p.x,b-.05,p.z,a),$e(e,p.w+.04,.55,p.d+.04,p.x,.275,p.z,l);const L=Math.max(p.w,p.d);for(let A=2;A<L-1;A+=4.5){const k=p.w>p.d,N=k?p.x-p.w/2+A:p.x,U=k?p.z:p.z-p.d/2+A,z=p.axis==="n"||p.axis==="w"?1:-1,D=$e(e,k?1:.08,1.3,k?.08:1,N+(k?0:.24*z),3.5,U+(k?.24*z:0),Dt("#55605a"));for(const C of[-.27,0,.27])$e(e,k?.035:.1,1.3,k?.1:.035,D.position.x+(k?C:0),3.5,D.position.z+(k?0:C),u)}}for(const p of Bf){const b=$e(e,p.w,p.h,p.d,p.x+p.w/2,p.h/2,p.z+p.d/2,d);if(t.push(b),p.kind==="door"){for(const L of[.45,p.h-.45])$e(e,p.w+.03,.12,p.d+.08,b.position.x,L,b.position.z,Dt("#45423a",.65));for(let L=.25;L<p.w;L+=.65)for(const A of[.45,p.h-.45]){const k=new Ot(new co(.035,6,6),u);k.position.set(p.x+L,A,p.z+p.d+.04),e.add(k)}}else{for(const L of[.16,p.h-.16])$e(e,p.w+.04,.14,p.d+.04,b.position.x,L,b.position.z,l);for(const L of[-p.w/2+.1,p.w/2-.1])$e(e,.15,p.h+.02,p.d+.04,b.position.x+L,p.h/2,b.position.z,l);Zi(e,"↑",b.position.x,p.h/2,p.z+p.d+.025,0,Math.min(p.w*.35,.65),.6,"#857451","#3e3b2e")}}t.push($e(e,10.1,.35,28,-27,4.5,7,r));for(let p=-5;p<21;p+=4)$e(e,10,.25,.32,-27,4.2,p,l);const x=new Qs({color:"#ffdf9f",emissive:"#ffd080",emissiveIntensity:1});for(const p of[-2,9,19]){$e(e,.4,.1,.7,-27,4.27,p,x);const b=new M1("#ffce89",10,10,2);b.position.set(-27,3.7,p),e.add(b)}for(const p of[{x:0,z:-8.5,w:12},{x:35,z:12.5,w:10}])t.push($e(e,p.w,1.2,1.1,p.x,4.5,p.z,r)),$e(e,p.w+.1,.25,1.2,p.x,5.2,p.z,a);Zi(e,"A  →",28,3,19.78,Math.PI,3,1.5),Zi(e,"A",39.78,2.9,-22,-Math.PI/2,2.4,2.3),Zi(e,"B",-37.78,2.8,-22,Math.PI/2,2.3,2.2),Zi(e,"←  B",-5.78,2.5,7,Math.PI/2,2.4,1.1,"#5c766e"),Zi(e,"سوق المدينة",5.78,3.4,18,-Math.PI/2,3.4,1.2,"#486e73"),Zi(e,"HOTEL AURORE",30.22,3.9,-3,Math.PI/2,4,1,"#56696a"),Zi(e,"MID DOORS",0,4.5,-7.91,0,2.7,.55,"#b7a184","#4a493c");for(const p of vf){const b=new Ot(new zf(3.7,3.83,64),new no({color:"#ae6344",transparent:!0,opacity:.7,side:Li}));b.rotation.x=-Math.PI/2,b.position.set(p.x,.016,p.z),e.add(b);const L=Zi(e,p.name,p.x,.025,p.z,0,3,3,"#b5a184","#995333");L.rotation.x=-Math.PI/2}for(const p of[{x:22,z:6,w:10,d:18,h:8},{x:22,z:36,w:15,d:10,h:10},{x:-12,z:-32,w:18,d:8,h:9},{x:45,z:-9,w:10,d:21,h:9},{x:-42,z:12,w:8,d:22,h:7}]){$e(e,p.w,p.h,p.d,p.x,p.h/2,p.z,r),$e(e,p.w+.25,.25,p.d+.25,p.x,p.h,p.z,a);for(let b=0;b<3;b++)$e(e,.6,1.1,1,p.x-p.w/2+2+b*3,p.h+.55,p.z+p.d/2,r)}const _=-17,y=-36;Ji(e,2.5,15,_,7.5,y,a,8),Ji(e,3.1,.5,_,14.8,y,l,12),Ji(e,1.6,3,_,16.5,y,a,12);const E=new Ot(new co(1.7,16,10,0,Math.PI*2,0,Math.PI/2),Dt("#a6af9b"));E.position.set(_,18,y),e.add(E),Ji(e,.08,2,_,19.5,y,u);for(const p of[{x:42,z:-30},{x:-40,z:-31},{x:21,z:33}]){Ji(e,.22,8,p.x,4,p.z,Dt("#8d7b55"));for(let b=0;b<7;b++){const L=b*Math.PI*2/7;$e(e,4.5,.08,.6,p.x+Math.cos(L)*1.7,8,p.z+Math.sin(L)*1.7,Dt("#6b7861")).rotation.set(Math.sin(L)*.22,-L,Math.cos(L)*.22)}}for(const p of[-4,7]){const b=new y1([new G(30,5,p),new G(35,4.6,p),new G(40,5,p)]),L=new mf(new Nn().setFromPoints(b.getPoints(20)),new Nf({color:"#41483e"}));e.add(L)}const w=new yi;$e(w,.48,.16,.34,0,.08,0,Dt("#4b5b3c")),$e(w,.2,.025,.16,0,.175,0,Dt("#1c211b"));const S=$e(w,.035,.015,.035,.13,.175,.1,Dt("#eb613d"));return w.visible=!1,e.add(w),ec(e,t),{group:e,occluders:t,bombModel:w,bombLight:S}}function _f(s,e=!1){const t=new yi,r=Dt("#434e4e",.35,.48),a=Dt("#242c2c",.2,.6),l=Dt("#84908e",.55,.3),u=Dt("#895231",.1,.65),d=Dt("#5b6550",.1,.7);if(s==="knife"){$e(t,.065,.11,.29,0,0,.05,a),$e(t,.18,.025,.045,0,.02,-.1,l);const h=$e(t,.025,.09,.38,0,.025,-.31,l);h.rotation.z=.15}else if(["glock","usp","deagle"].includes(s)){if($e(t,.09,.15,.15,0,-.075,.02,a).rotation.x=-.2,$e(t,s==="deagle"?.12:.1,.105,s==="deagle"?.35:.26,0,.035,-.09,s==="deagle"?l:r),$e(t,.035,.03,.035,0,.105,-.2,a),$e(t,.07,.025,.04,0,.1,.025,a),s==="usp"){const h=Ji(t,.033,.18,0,.035,-.31,a);h.rotation.x=Math.PI/2}$e(t,.065,.02,.12,0,-.09,-.09,r)}else{const h=s==="ak47",m=s==="awp";$e(t,.115,.15,m?.47:.36,0,.025,-.15,m?d:r),$e(t,.09,.16,.11,0,-.1,-.02,a).rotation.x=-.25,$e(t,.12,.13,.23,0,.03,.13,h?u:m?d:a),$e(t,.13,.21,.055,0,0,.265,a),$e(t,.1,.095,.26,0,.015,-.43,h?u:m?d:a);const v=Ji(t,.023,m?.4:.28,0,.04,m?-.73:-.66,r);v.rotation.x=Math.PI/2;const x=$e(t,.075,m?.11:.25,.13,0,-.13,-.18,a);if(x.rotation.x=h?-.24:0,$e(t,.045,.055,.025,0,.1,-.59,a),m){$e(t,.045,.07,.2,0,.14,-.16,r);const _=Ji(t,.049,.32,0,.2,-.18,a);_.rotation.x=Math.PI/2;const y=Ji(t,.045,.014,0,.2,-.347,Dt("#4d9293",.6,.2));y.rotation.x=Math.PI/2}else{$e(t,.045,.04,.13,0,.12,-.13,a);for(let _=0;_<5;_++)$e(t,.125,.015,.012,0,.1,-.32-_*.035,r)}}if(e){const h=Dt("#3c4640"),m=Dt("#777963"),v=Dt("#c29a75");if($e(t,.115,.13,.14,.015,-.1,.065,h).rotation.x=-.3,$e(t,.14,.14,.41,.08,-.18,.29,m).rotation.set(-.2,-.18,0),N1(s)){const _=$e(t,.12,.12,.15,-.055,-.08,-.39,h);_.rotation.z=-.15,$e(t,.14,.15,.47,-.19,-.17,-.2,m).rotation.set(.2,-.6,0),$e(t,.11,.03,.08,-.055,-.05,-.4,v)}}return ec(t),t}const N1=s=>["ak47","m4a4","awp"].includes(s);function I1(s,e){const t=new yi,r=[],a=[],l=Dt(s==="CT"?"#4b6570":"#ac8d61"),u=Dt(s==="CT"?"#374c55":"#746c56"),d=Dt(s==="CT"?"#253d49":"#695e42"),h=Dt("#b58c69"),m=Dt("#252e2b"),v=Dt(s==="CT"?"#344951":"#827c68");function x(y,E,w,S,p,b,L,A,k=t){const N=$e(k,y,E,w,S,p,b,L);return N.userData.zone=A,r.push(N),N}x(.46,.45,.27,0,1.23,0,l,"chest"),x(.38,.25,.25,0,.91,0,u,"abdomen"),$e(t,.49,.37,.09,0,1.24,-.15,d);for(const y of[-.15,.15])$e(t,.1,.15,.08,y,1.15,-.22,d);x(.25,.29,.26,0,1.65,0,h,"head"),$e(t,.29,.12,.29,0,1.79,.015,v),$e(t,.23,.085,.04,0,1.68,-.14,s==="CT"?Dt("#1b2a2f",.6):v),s==="T"&&$e(t,.265,.1,.04,0,1.55,-.14,v);for(const y of[-1,1]){const E=new yi;E.position.set(y*.13,.79,0),t.add(E),a.push(E),x(.18,.64,.21,0,-.33,0,u,"leg",E),$e(E,.2,.15,.31,0,-.72,-.035,m);const w=new yi;w.position.set(y*.31,1.4,-.01),w.rotation.set(.6,y===-1?-.4:.12,-y*.2),t.add(w),x(.17,.36,.19,0,-.16,0,l,"arm",w);const S=x(.15,.32,.17,0,-.39,-.12,l,"arm",w);S.rotation.x=1,$e(w,.14,.13,.14,0,-.47,-.24,m),ec(w,r,!0)}const _=_f(e);return _.position.set(.12,1.16,-.44),t.add(_),$e(t,.3,.08,.015,0,1.35,.151,Dt(s==="CT"?"#a8c7cf":"#d1b582")),ec(t,r,!0),{model:t,hitboxes:r,limbs:a,weapon:_}}class U1{constructor(){Xe(this,"ctx",null);Xe(this,"master",null);Xe(this,"muted",!1);Xe(this,"noise",null)}unlock(){if(!this.ctx){this.ctx=new AudioContext,this.master=this.ctx.createGain(),this.master.gain.value=.3,this.master.connect(this.ctx.destination),this.noise=this.ctx.createBuffer(1,this.ctx.sampleRate,this.ctx.sampleRate);const e=this.noise.getChannelData(0);for(let t=0;t<e.length;t++)e[t]=Math.random()*2-1}this.ctx.resume()}tone(e,t,r=.2,a="sine",l=0,u){if(!this.ctx||!this.master||this.muted)return;const d=this.ctx.currentTime+l,h=this.ctx.createOscillator(),m=this.ctx.createGain();h.type=a,h.frequency.setValueAtTime(e,d),u&&h.frequency.exponentialRampToValueAtTime(u,d+t),m.gain.setValueAtTime(r,d),m.gain.exponentialRampToValueAtTime(.001,d+t),h.connect(m),m.connect(this.master),h.start(d),h.stop(d+t)}burst(e,t,r,a=0){if(!this.ctx||!this.master||!this.noise||this.muted)return;const l=this.ctx.currentTime+a,u=this.ctx.createBufferSource(),d=this.ctx.createBiquadFilter(),h=this.ctx.createGain();u.buffer=this.noise,u.playbackRate.value=.8+Math.random()*.4,d.type="lowpass",d.frequency.value=r,h.gain.setValueAtTime(t,l),h.gain.exponentialRampToValueAtTime(.001,l+e),u.connect(d),d.connect(h),h.connect(this.master),u.start(l,Math.random()*.5),u.stop(l+e)}fire(e,t=0){const r=Math.max(.025,1/(1+t*.13));if(e==="knife"){this.burst(.14,.35*r,2200);return}const a={ak47:[.2,1,2300,105],m4a4:[.13,.7,3400,155],awp:[.6,1.6,1800,64],glock:[.11,.6,4200,235],usp:[.09,.32,1600,210],deagle:[.25,.9,2600,95]},[l,u,d,h]=a[e];this.burst(l,u*r,d),this.tone(h,l,.5*r,"triangle",0,35),this.tone(800,.025,.08*r,"square",.03,160)}reload(){this.burst(.08,.22,3600),this.tone(420,.04,.1,"square",.35),this.burst(.13,.22,2200,.8)}step(e=.2){this.burst(.075,e,550),this.tone(65,.06,e*.3,"sine")}scope(){this.tone(1100,.065,.13,"sine",0,550),this.burst(.035,.08,5200)}hit(e=!1){this.tone(e?1300:800,.08,.16,"triangle",0,e?1800:600)}kill(){this.tone(650,.1,.15,"sine"),this.tone(980,.17,.14,"sine",.09)}plant(){this.tone(880,.12,.22,"square"),this.tone(1320,.17,.17,"square",.2)}defuse(){for(let e=0;e<4;e++)this.tone(500+e*180,.14,.16,"sine",e*.13)}beep(){this.tone(1350,.075,.15,"sine")}explosion(){this.burst(2,2,1600),this.tone(65,1.6,1,"sawtooth",0,15)}round(){this.tone(440,.2,.16,"sine"),this.tone(660,.3,.14,"sine",.15)}dispose(){var e;(e=this.ctx)==null||e.close()}}const Zt={ak47:{id:"ak47",name:"AK-47",short:"ASSAULT RIFLE",slot:1,damage:38,interval:.108,magazine:30,reserve:90,reload:2.4,recoil:.026,spread:.009,automatic:!0,range:110,penetration:.65},m4a4:{id:"m4a4",name:"M4A4",short:"ASSAULT RIFLE",slot:1,damage:31,interval:.085,magazine:30,reserve:90,reload:2.2,recoil:.012,spread:.006,automatic:!0,range:110,penetration:.6},awp:{id:"awp",name:"AWP",short:"SNIPER RIFLE",slot:1,damage:150,interval:1.55,magazine:5,reserve:30,reload:3.5,recoil:.055,spread:.035,automatic:!1,range:150,penetration:.85},glock:{id:"glock",name:"Glock-18",short:"SIDEARM",slot:2,damage:24,interval:.19,magazine:20,reserve:120,reload:1.8,recoil:.012,spread:.012,automatic:!1,range:70,penetration:.4},usp:{id:"usp",name:"USP-S",short:"SUPPRESSED SIDEARM",slot:2,damage:27,interval:.21,magazine:12,reserve:72,reload:2,recoil:.01,spread:.009,automatic:!1,range:75,penetration:.45},deagle:{id:"deagle",name:"Desert Eagle",short:"HEAVY SIDEARM",slot:2,damage:30,interval:.42,magazine:7,reserve:35,reload:2.1,recoil:.034,spread:.014,automatic:!1,range:90,penetration:.7},knife:{id:"knife",name:"Combat knife",short:"MELEE",slot:3,damage:45,interval:.55,magazine:0,reserve:0,reload:0,recoil:0,spread:0,automatic:!1,range:2.4,penetration:1}};function Lr(s){const e=Zt[s];return{id:s,ammo:e.magazine,reserve:e.reserve}}const F1={head:2,chest:1,abdomen:1.15,arm:.75,leg:.65};function O1(s,e,t){const r=Zt[s],a=r.damage*F1[e],l=t>0&&e!=="leg"?Math.min(t,a*(1-r.penetration)*.65):0;return{health:Math.round(a-l),armor:Math.ceil(l*.6)}}const z1=["Atlas","Nomad","Ghost","Viper","Echo"],k1=["Sable","Havoc","Rook","Mirage","Flint"],bn=(s,e)=>Math.hypot(s.x-e.x,s.z-e.z),B1=(s,e)=>Math.atan2(Math.sin(s-e),Math.cos(s-e));class H1{constructor(e,t){Xe(this,"renderer");Xe(this,"scene",new _g);Xe(this,"camera",new Vn(76,1,.045,250));Xe(this,"viewScene",new _g);Xe(this,"viewCamera",new Vn(68,1,.02,5));Xe(this,"viewGun",new yi);Xe(this,"flash");Xe(this,"world");Xe(this,"nav",new L1);Xe(this,"audio",new U1);Xe(this,"actors",[]);Xe(this,"playerId",5);Xe(this,"phase","menu");Xe(this,"locked",!1);Xe(this,"settings",{team:"T",pistol:!1,primary:"ak47",secondary:"glock"});Xe(this,"bomb",{state:"carried",carrier:5,x:0,z:0,time:40,progress:0,actor:null,site:""});Xe(this,"score",{T:0,CT:0});Xe(this,"round",1);Xe(this,"clock",115);Xe(this,"elapsed",0);Xe(this,"winner",null);Xe(this,"reason","");Xe(this,"endTime",0);Xe(this,"keys",new Set);Xe(this,"mouseDown",!1);Xe(this,"trigger",!1);Xe(this,"pitch",0);Xe(this,"yaw",0);Xe(this,"recoil",0);Xe(this,"spread",0);Xe(this,"scoped",!1);Xe(this,"hit",0);Xe(this,"headshot",!1);Xe(this,"hurt",0);Xe(this,"actionLabel","");Xe(this,"notice","");Xe(this,"noticeEnd",0);Xe(this,"kills",[]);Xe(this,"raf",0);Xe(this,"last",0);Xe(this,"accumulator",0);Xe(this,"snapshotAt",0);Xe(this,"beepAt",0);Xe(this,"fps",60);Xe(this,"frameCount",0);Xe(this,"fpsAt",0);Xe(this,"ray",new w1);Xe(this,"effects",[]);Xe(this,"disposed",!1);Xe(this,"currentViewWeapon",null);Xe(this,"listeners",[]);Xe(this,"onSnapshot");Xe(this,"frame",e=>{if(this.disposed)return;const t=Math.min((e-(this.last||e))/1e3,.1);if(this.last=e,this.frameCount++,e-this.fpsAt>1e3&&(this.fps=Math.round(this.frameCount*1e3/(e-this.fpsAt)),this.fpsAt=e,this.frameCount=0),this.phase!=="menu"&&this.locked)for(this.accumulator+=t;this.accumulator>=1/60;)this.step(1/60),this.accumulator-=1/60;this.render(t,e/1e3),e-this.snapshotAt>75&&(this.emit(),this.snapshotAt=e),this.raf=requestAnimationFrame(this.frame)});this.host=e,this.onSnapshot=t,this.renderer=new _1({antialias:!0,powerPreference:"high-performance"});const r=this.renderer.getContext(),a=r.getExtension("WEBGL_debug_renderer_info"),l=a&&/swiftshader|llvmpipe|software/i.test(String(r.getParameter(a.UNMASKED_RENDERER_WEBGL)));this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,l?.75:1.6)),this.renderer.shadowMap.enabled=!l,this.renderer.shadowMap.type=Dg,this.renderer.outputColorSpace=Dn,this.renderer.toneMapping=Ig,this.renderer.toneMappingExposure=1.22,e.appendChild(this.renderer.domElement),this.scene.background=new xt("#b9cbd0"),this.scene.fog=new Df("#c5c8bb",55,155),this.scene.add(new Sg("#e6f1f4","#85735a",2.3));const u=new Tg("#fff0ce",3.4);u.position.set(-23,48,25),u.castShadow=!0,u.shadow.mapSize.set(2048,2048),u.shadow.camera.left=-58,u.shadow.camera.right=58,u.shadow.camera.top=58,u.shadow.camera.bottom=-58,u.shadow.camera.near=1,u.shadow.camera.far=120,u.shadow.bias=-4e-4,u.shadow.normalBias=.025,this.scene.add(u),this.scene.add(u.target),this.world=D1(this.scene),this.viewScene.add(new Sg("#f3f0de","#5d6555",2.8));const d=new Tg("#fff0d0",3);d.position.set(-2,3,1),this.viewScene.add(d),this.viewScene.add(this.viewGun),this.flash=new Ot(new Of(.065,0),new no({color:"#ffe7a0",transparent:!0,opacity:.9})),this.flash.visible=!1,this.viewScene.add(this.flash),this.setupActors(),this.bind(),this.resize(),this.emit(),this.raf=requestAnimationFrame(this.frame)}get player(){return this.actors[this.playerId]}get activeGun(){return this.player.guns.find(e=>Zt[e.id].slot===this.player.slot)||this.player.guns[0]}listen(e,t,r){e.addEventListener(t,r),this.listeners.push(()=>e.removeEventListener(t,r))}bind(){this.listen(window,"resize",()=>this.resize()),this.listen(document,"pointerlockchange",()=>{this.locked=document.pointerLockElement===this.renderer.domElement,this.locked||(this.keys.clear(),this.mouseDown=!1,this.trigger=!1),this.emit()}),this.listen(document,"mousemove",e=>{if(!this.locked||!this.player.alive)return;const t=e,r=this.scoped?75e-5:.002;this.yaw-=t.movementX*r,this.pitch=Am.clamp(this.pitch-t.movementY*r,-1.42,1.42)}),this.listen(window,"keydown",e=>{const t=e;if(t.code==="Escape"&&this.locked){document.exitPointerLock();return}["Space","Tab","KeyW","KeyA","KeyS","KeyD","Digit1","Digit2","Digit3"].includes(t.code)&&this.phase!=="menu"&&t.preventDefault(),this.keys.add(t.code),!(t.repeat||this.phase!=="playing")&&(t.code==="KeyR"&&this.reload(this.player),t.code==="KeyF"&&!this.player.alive&&this.takeover(),["Digit1","Digit2","Digit3"].includes(t.code)&&this.switchWeapon(Number(t.code.slice(-1))),t.code==="KeyG"&&this.dropBomb())}),this.listen(window,"keyup",e=>this.keys.delete(e.code)),this.listen(this.renderer.domElement,"mousedown",e=>{const t=e;!this.locked||this.phase!=="playing"||(t.button===0&&(this.mouseDown=!0,this.trigger=!0),t.button===2&&this.activeGun.id==="awp"&&(this.scoped=!this.scoped,this.audio.scope(),this.emit()))}),this.listen(window,"mouseup",e=>{e.button===0&&(this.mouseDown=!1)}),this.listen(this.renderer.domElement,"contextmenu",e=>e.preventDefault()),this.listen(this.renderer.domElement,"wheel",e=>{if(!this.locked)return;const t=this.player.guns.map(a=>Zt[a.id].slot),r=t.indexOf(this.player.slot);this.switchWeapon(t[(r+(e.deltaY>0?1:t.length-1))%t.length])}),this.listen(window,"blur",()=>{this.keys.clear(),this.mouseDown=!1})}resize(){const e=this.host.clientWidth,t=this.host.clientHeight;this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.viewCamera.aspect=e/t,this.viewCamera.updateProjectionMatrix()}setupActors(){for(const e of this.actors)this.scene.remove(e.model),e.model.traverse(t=>{t instanceof Ot&&t.geometry.dispose()});this.actors=[];for(let e=0;e<10;e++){const t=e<5?"CT":"T",r=e%5,a=r===3?"awp":t==="CT"?"m4a4":"ak47",l=this.settings.pistol?[Lr(t==="CT"?"usp":"glock"),Lr("knife")]:[Lr(a),Lr(t==="CT"?"usp":"glock"),Lr("knife")],u=I1(t,l[0].id),d=t==="T"?new G(-5+r*3.8,0,29+r%2*2):new G(-10+r*5,0,-20+r%2*3),h=r%3===0,m=t==="T"?h?[{x:-26,z:25},{x:-27,z:1},{x:-28,z:-17}]:r%3===1?[{x:34,z:24},{x:35,z:3},{x:35,z:-18},{x:28,z:-20}]:[{x:1,z:15},{x:15,z:11},{x:15,z:-9},{x:27,z:-20}]:h?[{x:-18,z:-20},{x:-28,z:-17}]:r%3===1?[{x:25,z:-20},{x:35,z:-9}]:[{x:1,z:-17},{x:0,z:-5}],v={id:e,name:(t==="CT"?z1:k1)[r],team:t,pos:d,yaw:t==="T"?0:Math.PI,hp:100,armor:this.settings.pistol?0:100,alive:!0,velY:0,guns:l,slot:this.settings.pistol?2:1,shotAt:-10,reloadEnd:0,kills:0,deaths:0,...u,state:"advance",path:[],target:null,thinkAt:0,pathAt:0,stepAt:0,lastSeen:0,reactionAt:0,objective:m[0],route:m,routeIndex:0,action:0,moving:!1};for(const x of v.hitboxes)x.userData.actorId=e;v.model.position.copy(d),v.model.rotation.y=v.yaw,this.scene.add(v.model),this.actors.push(v)}}start(e){this.audio.unlock(),this.settings={...e},this.score={T:0,CT:0},this.round=1;for(const t of this.actors)t.kills=0,t.deaths=0;this.startRound(),this.lock()}startRound(){var a,l;const e=this.actors.map(u=>({kills:u.kills,deaths:u.deaths}));this.setupActors();for(const u of this.actors)u.kills=((a=e[u.id])==null?void 0:a.kills)||0,u.deaths=((l=e[u.id])==null?void 0:l.deaths)||0;this.playerId=this.settings.team==="T"?5:0;const t=this.player;this.settings.pistol||(t.guns=[Lr(this.settings.primary),Lr(this.settings.secondary),Lr("knife")],this.replaceActorGun(t)),this.phase="playing",this.clock=115,this.elapsed=0,this.winner=null,this.reason="",this.endTime=0,this.kills=[],this.yaw=t.team==="T"?0:Math.PI,this.pitch=0,this.recoil=0,this.spread=0,this.trigger=!1,this.actionLabel="",this.scoped=!1,this.hurt=0,this.hit=0,this.keys.clear(),this.mouseDown=!1;const r=5+(this.round-1)%5;this.bomb={state:"carried",carrier:r,x:this.actors[r].pos.x,z:this.actors[r].pos.z,time:40,progress:0,actor:null,site:""},this.audio.round(),this.notice=this.settings.pistol?"PISTOL ROUND · No armor. Make every shot count.":"Bomb carrier marked. Hold E at a site to plant.",this.noticeEnd=5,this.emit()}lock(){this.audio.unlock();const e=this.renderer.domElement.requestPointerLock();e&&typeof e.catch=="function"&&e.catch(()=>{this.notice="Click Resume to capture your mouse.",this.emit()})}menu(){this.phase="menu",this.locked=!1,document.exitPointerLock(),this.world.bombModel.visible=!1,this.emit()}switchWeapon(e){!this.player.alive||!this.player.guns.some(t=>Zt[t.id].slot===e)||(this.player.slot=e,this.player.reloadEnd=0,this.scoped=!1,this.replaceActorGun(this.player),this.emit())}replaceActorGun(e){e.model.remove(e.weapon),e.weapon.traverse(t=>{t instanceof Ot&&t.geometry.dispose()}),e.weapon=_f(e.guns.find(t=>Zt[t.id].slot===e.slot).id),e.weapon.position.set(.12,1.16,-.44),e.model.add(e.weapon)}dropBomb(){if(this.bomb.state==="carried"&&this.bomb.carrier===this.playerId){const e=this.player.pos.x-Math.sin(this.yaw)*1.1,t=this.player.pos.z-Math.cos(this.yaw)*1.1;this.bomb.state="dropped",this.bomb.carrier=null,this.bomb.x=cs(e,t,.1)?e:this.player.pos.x,this.bomb.z=cs(e,t,.1)?t:this.player.pos.z,this.notice="C4 dropped. Teammates can recover it.",this.noticeEnd=this.elapsed+3}}reload(e){const t=e.guns.find(a=>Zt[a.id].slot===e.slot),r=Zt[t.id];e.reloadEnd||t.id==="knife"||t.ammo>=r.magazine||t.reserve<=0||!e.alive||(e.reloadEnd=this.elapsed+r.reload,e.id===this.playerId&&(this.audio.reload(),this.scoped=!1))}takeover(){const e=this.actors.filter(r=>r.team===this.settings.team&&r.alive&&r.id!==this.playerId);if(!e.length)return;const t=e.sort((r,a)=>r.id-a.id)[0];this.playerId=t.id,this.yaw=t.yaw,this.pitch=0,this.recoil=0,this.scoped=!1,t.path=[],t.action=0,this.notice=`Controlling ${t.name}`,this.noticeEnd=this.elapsed+3,this.emit()}step(e){if(this.elapsed+=e,this.hit=Math.max(0,this.hit-e),this.hurt=Math.max(0,this.hurt-e),this.recoil*=Math.exp(-e*7),this.spread*=Math.exp(-e*3.7),this.phase==="ended"){this.endTime-=e,this.endTime<=0&&(this.round++,this.startRound()),this.updateEffects(e);return}this.clock=Math.max(0,this.clock-e);for(const t of this.actors)if(t.alive){if(t.reloadEnd&&this.elapsed>=t.reloadEnd){const r=t.guns.find(l=>Zt[l.id].slot===t.slot),a=Math.min(Zt[r.id].magazine-r.ammo,r.reserve);r.ammo+=a,r.reserve-=a,t.reloadEnd=0}t.id===this.playerId?this.updatePlayer(e):this.updateBot(t,e),t.model.position.copy(t.pos),t.model.rotation.y=t.yaw,t.limbs.forEach((r,a)=>r.rotation.x=t.moving?Math.sin(this.elapsed*11+a*Math.PI)*.45:0)}this.updateBomb(e),this.checkVictory(),this.updateEffects(e)}updatePlayer(e){const t=this.player;t.yaw=this.yaw;let r=0,a=0;this.keys.has("KeyW")&&(r-=Math.sin(this.yaw),a-=Math.cos(this.yaw)),this.keys.has("KeyS")&&(r+=Math.sin(this.yaw),a+=Math.cos(this.yaw)),this.keys.has("KeyD")&&(r+=Math.cos(this.yaw),a-=Math.sin(this.yaw)),this.keys.has("KeyA")&&(r-=Math.cos(this.yaw),a+=Math.sin(this.yaw));const l=Math.hypot(r,a),u=this.keys.has("ShiftLeft");t.moving=l>0;const d=(this.activeGun.id==="knife"?6.8:5.2)*(this.scoped?.48:1)*(u?.5:1);l&&(wd(t.pos,r/l*d*e,a/l*d*e),this.elapsed>t.stepAt&&t.pos.y<.05&&(this.audio.step(u?.08:.22),t.stepAt=this.elapsed+.37)),this.keys.has("Space")&&t.pos.y<=.001&&(t.velY=5.9,this.keys.delete("Space")),t.velY-=17*e,t.pos.y=Math.max(0,t.pos.y+t.velY*e),t.pos.y===0&&(t.velY=0),this.mouseDown&&(Zt[this.activeGun.id].automatic||this.trigger)&&!this.keys.has("KeyE")&&this.shoot(t),this.trigger=!1}visible(e,t){const r=t.pos.clone().sub(e.pos),a=r.length();if(a>48)return!1;const l=new G(-Math.sin(e.yaw),0,-Math.cos(e.yaw));return a>7&&l.dot(r.clone().normalize())<-.15?!1:this.lineOfSight(e.pos.clone().add(new G(0,1.58,0)),t.pos.clone().add(new G(0,1.2,0)))}lineOfSight(e,t){const r=t.clone().sub(e);return this.ray.set(e,r.clone().normalize()),this.ray.far=r.length(),this.ray.intersectObjects(this.world.occluders,!1).length===0}updateBot(e,t){var u;if(this.elapsed>=e.thinkAt){const h=((u=this.actors.filter(m=>m.alive&&m.team!==e.team&&this.visible(e,m)).sort((m,v)=>bn(e.pos,m.pos)-bn(e.pos,v.pos))[0])==null?void 0:u.id)??null;e.target!==h&&h!==null&&(e.reactionAt=this.elapsed+.28+Math.random()*.45),e.target=h,e.thinkAt=this.elapsed+.16+Math.random()*.12}const r=e.target!==null?this.actors[e.target]:null;if(r!=null&&r.alive&&this.visible(e,r)){if(e.state="engage",e.action=0,e.moving=!1,e.yaw=Math.atan2(-(r.pos.x-e.pos.x),-(r.pos.z-e.pos.z)),this.elapsed>e.reactionAt&&Math.sin(this.elapsed*2.5+e.id)>0&&(e.guns.find(h=>Zt[h.id].slot===e.slot).ammo?this.shoot(e,r):this.reload(e)),bn(e.pos,r.pos)>7){const d=Math.sin(this.elapsed*1.6+e.id)>0?1:-1;wd(e.pos,Math.cos(e.yaw)*d*t*.8,-Math.sin(e.yaw)*d*t*.8)}return}e.target=null;const a=this.bomb;if(e.team==="T"&&a.state==="dropped")e.state="recover",e.objective={x:a.x,z:a.z};else if(e.team==="T"&&a.state==="carried"&&a.carrier===e.id){e.state="advance";const d=vf[e.route[e.route.length-1].x<0?1:0];if(bn(e.pos,d)<d.r){e.state="plant",e.moving=!1,this.interact(e,t);return}this.advanceRoute(e,d)}else if(a.state==="planted")if(e.team==="CT"){if(e.state="defuse",e.objective={x:a.x,z:a.z},bn(e.pos,a)<2){e.moving=!1,this.interact(e,t);return}}else{e.state="guard";const d={x:a.x+Math.sin(e.id*2.3)*4,z:a.z+Math.cos(e.id*2.3)*4};e.objective=cs(d.x,d.z)?d:{x:a.x,z:a.z}}else e.state="advance",e.team==="CT"&&this.elapsed>23&&e.routeIndex>=e.route.length?e.objective=e.id%2?{x:0,z:10}:{x:-27,z:6}:this.advanceRoute(e,e.route[e.route.length-1]);for(e.action=0,(this.elapsed>e.pathAt||!e.path.length&&bn(e.pos,e.objective)>1.5)&&(e.path=this.nav.find(e.pos.x,e.pos.z,e.objective.x,e.objective.z),e.pathAt=this.elapsed+1.5+Math.random()*.5,e.path.length&&bn(e.pos,e.path[0])<.6&&e.path.shift());e.path.length&&bn(e.pos,e.path[0])<.28;)e.path.shift();const l=e.path[0];if(e.moving=!!l,l){const d=l.x-e.pos.x,h=l.z-e.pos.z,m=Math.hypot(d,h);e.yaw+=B1(Math.atan2(-d,-h),e.yaw)*Math.min(1,t*12);const v=3.4;wd(e.pos,d/m*Math.min(v*t,m),h/m*Math.min(v*t,m),.34),bn(e.pos,this.player.pos)<12&&this.elapsed>e.stepAt&&(this.audio.step(.08/(1+bn(e.pos,this.player.pos)*.2)),e.stepAt=this.elapsed+.44)}else e.state==="guard"&&(e.yaw+=t*.35)}advanceRoute(e,t){for(;e.routeIndex<e.route.length&&bn(e.pos,e.route[e.routeIndex])<2;)e.routeIndex++;e.objective=e.route[e.routeIndex]||t}shoot(e,t){const r=e.guns.find(y=>Zt[y.id].slot===e.slot),a=Zt[r.id];if(e.reloadEnd||this.elapsed-e.shotAt<a.interval||!e.alive||e.action>0)return;if(a.id!=="knife"&&r.ammo<=0){this.reload(e);return}a.id!=="knife"&&r.ammo--,e.shotAt=this.elapsed;const l=e.id===this.playerId,u=e.pos.clone().add(new G(0,1.58,0));let d;if(l){this.camera.rotation.set(this.pitch+this.recoil,this.yaw,0,"YXZ"),d=new G(0,0,-1).applyEuler(this.camera.rotation);const y=a.id==="awp"&&this.scoped?9e-4:a.spread+this.spread+(e.moving?.018:0);d.add(new G((Math.random()-.5)*y,(Math.random()-.5)*y,(Math.random()-.5)*y)).normalize(),this.recoil=Math.min(.25,this.recoil+a.recoil),this.spread=Math.min(.09,this.spread+a.recoil*.7),a.id==="awp"&&(this.scoped=!1)}else{if(!t)return;d=t.pos.clone().add(new G((Math.random()-.5)*.48,1.08+(Math.random()-.4)*.7,(Math.random()-.5)*.4)).sub(u).normalize(),d.add(new G((Math.random()-.5)*.018,(Math.random()-.5)*.018,0)).normalize()}this.audio.fire(r.id,l?0:bn(e.pos,this.player.pos)),this.scene.updateMatrixWorld(!0),this.ray.set(u,d),this.ray.far=a.range;const h=this.ray.intersectObjects(this.world.occluders,!1)[0],m=(h==null?void 0:h.distance)??a.range,x=this.ray.intersectObjects(this.actors.filter(y=>y.alive&&y.id!==e.id).flatMap(y=>y.hitboxes),!1).find(y=>y.distance<m);let _=u.clone().addScaledVector(d,Math.min(m,55));if(x){_=x.point;const y=this.actors[x.object.userData.actorId];if(y.team!==e.team){const E=x.object.userData.zone,w=O1(r.id,E,y.armor);y.hp=Math.max(0,y.hp-w.health),y.armor=Math.max(0,y.armor-w.armor),l&&(this.hit=.18,this.headshot=E==="head",this.audio.hit(this.headshot)),y.id===this.playerId&&(this.hurt=.35),y.hp<=0&&this.kill(e,y,r.id,E==="head")}}if(a.id!=="knife"){const y=l?u.clone().add(new G(.2,-.13,0)):e.pos.clone().add(new G(0,1.24,0)).addScaledVector(d,.5),E=new mf(new Nn().setFromPoints([y,_]),new Nf({color:l?"#fbe5a2":"#ffd793",transparent:!0,opacity:.55}));if(this.scene.add(E),this.effects.push({mesh:E,life:.055,max:.055}),!x&&h){const w=new Ot(new co(.08,5,5),new no({color:"#b5a184",transparent:!0,opacity:.5}));w.position.copy(_),this.scene.add(w),this.effects.push({mesh:w,life:.25,max:.25,grow:!0})}}}kill(e,t,r,a){t.alive=!1,t.deaths++,t.action=0,e.kills++,t.model.rotation.z=Math.PI*.48,t.model.position.y=.28,this.kills.unshift({id:Math.random(),killer:e.id===this.playerId?"You":e.name,victim:t.id===this.playerId?"You":t.name,team:e.team,weapon:r,head:a,time:this.elapsed}),this.kills=this.kills.slice(0,5),this.bomb.carrier===t.id&&this.bomb.state==="carried"&&(this.bomb.state="dropped",this.bomb.carrier=null,this.bomb.x=t.pos.x,this.bomb.z=t.pos.z),e.id===this.playerId&&this.audio.kill(),t.id===this.playerId&&(this.mouseDown=!1,this.scoped=!1,this.notice="Operator down. Press F to take over a teammate.",this.noticeEnd=this.elapsed+12)}interact(e,t){if(e.team==="T"&&this.bomb.state==="carried"&&this.bomb.carrier===e.id){const r=vf.find(a=>bn(e.pos,a)<a.r);if(!r||e.moving||e.pos.y>.1){e.action=0;return}if(e.action+=t,this.bomb.actor=e.id,this.bomb.progress=e.action/3.2,e.id===this.playerId&&(this.actionLabel=`PLANTING AT SITE ${r.name}`),e.action>=3.2){this.bomb={state:"planted",carrier:null,x:e.pos.x,z:e.pos.z,time:40,progress:0,actor:null,site:r.name},e.action=0,this.audio.plant(),this.notice=`C4 planted at ${r.name}. 40 seconds to detonation.`,this.noticeEnd=this.elapsed+5,this.beepAt=this.elapsed;for(const a of this.actors)a.pathAt=0}}else if(e.team==="CT"&&this.bomb.state==="planted"&&bn(e.pos,this.bomb)<2){if(e.moving||e.pos.y>.1){e.action=0;return}if(this.bomb.actor!==null&&this.bomb.actor!==e.id&&this.actors[this.bomb.actor].alive&&this.actors[this.bomb.actor].action>0)return;e.action+=t,this.bomb.actor=e.id,this.bomb.progress=e.action/8,e.id===this.playerId&&(this.actionLabel="DEFUSING C4"),e.action>=8&&(this.bomb.state="defused",this.bomb.progress=1,this.audio.defuse(),this.finish("CT","Bomb successfully defused"))}else e.action=0}updateBomb(e){const t=this.bomb;this.actionLabel="";const r=this.player;if(r.alive&&(this.keys.has("KeyE")?this.interact(r,e):r.action=0),t.actor!==null&&(!this.actors[t.actor].alive||this.actors[t.actor].action===0)&&(t.actor=null,t.progress=0),t.state==="carried"&&t.carrier!==null&&(t.x=this.actors[t.carrier].pos.x,t.z=this.actors[t.carrier].pos.z),t.state==="dropped"){const a=this.actors.find(l=>l.alive&&l.team==="T"&&bn(l.pos,t)<1.3);a&&(t.state="carried",t.carrier=a.id,this.notice=`${a.id===this.playerId?"You":a.name} recovered C4`,this.noticeEnd=this.elapsed+3)}if(t.state==="planted"&&(t.time=Math.max(0,t.time-e),this.elapsed>this.beepAt&&(this.audio.beep(),this.beepAt=this.elapsed+Math.max(.15,t.time/40)),t.time<=0)){t.state="exploded",this.audio.explosion();const a=new Ot(new co(1,16,16),new no({color:"#ffae57",transparent:!0,opacity:.8}));a.position.set(t.x,.5,t.z),this.scene.add(a),this.effects.push({mesh:a,life:1.3,max:1.3,grow:!0}),this.hurt=1,this.finish("T","C4 detonated")}this.world.bombModel.visible=["dropped","planted","defused"].includes(t.state),this.world.bombModel.position.set(t.x,.05,t.z),this.world.bombLight.visible=t.state==="planted"&&Math.sin(this.elapsed*10)>0}checkVictory(){if(this.phase!=="playing")return;const e=this.actors.filter(r=>r.alive&&r.team==="CT").length,t=this.actors.filter(r=>r.alive&&r.team==="T").length;e?!t&&this.bomb.state!=="planted"?this.finish("CT","All terrorists eliminated"):this.clock<=0&&this.bomb.state!=="planted"&&this.finish("CT","Time expired · Bomb sites secured"):this.finish("T","All counter-terrorists eliminated")}finish(e,t){this.phase==="playing"&&(this.phase="ended",this.winner=e,this.reason=t,this.score[e]++,this.endTime=7,this.audio.round(),this.mouseDown=!1,this.emit())}updateEffects(e){for(let t=this.effects.length-1;t>=0;t--){const r=this.effects[t];r.life-=e;const a=r.mesh.material;a&&(a.opacity=Math.max(0,r.life/r.max)*.65),r.grow&&r.mesh.scale.multiplyScalar(1+e*(r.max>1?5:3)),r.life<=0&&(this.scene.remove(r.mesh),r.mesh.geometry.dispose(),a==null||a.dispose(),this.effects.splice(t,1))}}render(e,t){if(this.phase==="menu"){this.camera.position.set(35.1+Math.sin(t*.07)*.35,2.05,2.5),this.camera.lookAt(25.5,3,-23),this.camera.fov=72,this.camera.updateProjectionMatrix();for(const r of this.actors)r.model.visible=!0}else{const r=this.player,a=r.moving&&r.pos.y<.05?Math.sin(this.elapsed*11)*.025:0;this.camera.position.copy(r.pos).add(new G(0,1.62+a,0)),this.camera.rotation.set(this.pitch+this.recoil,this.yaw,0,"YXZ");const l=this.scoped?25:76;this.camera.fov=Am.lerp(this.camera.fov,l,Math.min(1,e*16)),this.camera.updateProjectionMatrix();for(const u of this.actors)u.model.visible=u.id!==this.playerId||!u.alive;r.alive||(this.camera.position.y=1.1)}if(this.renderer.autoClear=!0,this.renderer.render(this.scene,this.camera),this.phase!=="menu"&&this.player.alive&&!this.scoped){const r=this.activeGun.id;if(r!==this.currentViewWeapon){for(const d of[...this.viewGun.children])this.viewGun.remove(d),d.traverse(h=>{h instanceof Ot&&h.geometry.dispose()});this.viewGun.add(_f(r,!0)),this.currentViewWeapon=r}const a=this.player,l=a.reloadEnd?Math.sin((1-(a.reloadEnd-this.elapsed)/Zt[r].reload)*Math.PI):0,u=a.moving?Math.sin(this.elapsed*9)*.009:Math.sin(t*1.8)*.003;this.viewGun.position.set(.23+u,-.265-l*.18,-.68+this.recoil*.35),this.viewGun.rotation.set(this.recoil*2-l*.5,-l*.5,Math.sin(t*1.8)*.003+l*.25),this.flash.visible=r!=="knife"&&this.elapsed-a.shotAt<.045,this.flash.position.set(.23,-.225,r==="awp"?-1.58:r==="usp"?-1.04:-1.46),this.flash.scale.set(1+Math.random(),.65+Math.random(),1.4),this.renderer.autoClear=!1,this.renderer.clearDepth(),this.renderer.render(this.viewScene,this.viewCamera)}}emit(){if(!this.actors.length)return;const e=this.player,t=this.activeGun;this.onSnapshot({phase:this.phase,locked:this.locked,team:this.settings.team,round:this.round,clock:this.clock,score:{...this.score},hp:e.hp,armor:e.armor,ammo:t.ammo,reserve:t.reserve,weapon:t.id,guns:e.guns.map(r=>r.id),slot:e.slot,reload:e.reloadEnd?Math.max(0,1-(e.reloadEnd-this.elapsed)/Zt[t.id].reload):0,alive:e.alive,ctAlive:this.actors.filter(r=>r.team==="CT"&&r.alive).length,tAlive:this.actors.filter(r=>r.team==="T"&&r.alive).length,kills:this.kills.filter(r=>this.elapsed-r.time<8),bomb:{...this.bomb},action:e.action,actionLabel:this.actionLabel,location:P1(e.pos.x,e.pos.z),spread:this.spread,scoped:this.scoped,hit:this.hit,headshot:this.headshot,hurt:this.hurt,winner:this.winner,reason:this.reason,endTime:this.endTime,carrier:this.bomb.carrier===e.id&&this.bomb.state==="carried",actors:this.actors.map(r=>({id:r.id,name:r.id===this.playerId?"You":r.name,team:r.team,x:r.pos.x,z:r.pos.z,yaw:r.yaw,alive:r.alive,seen:r.team===e.team||r.alive&&this.actors.some(a=>a.team===e.team&&a.alive&&this.visible(a,r)),kills:r.kills,deaths:r.deaths,hp:r.hp})),playerId:this.playerId,fps:this.fps,notice:this.elapsed<this.noticeEnd?this.notice:"",elapsed:this.elapsed})}dispose(){this.disposed=!0,cancelAnimationFrame(this.raf);for(const t of this.listeners)t();document.pointerLockElement===this.renderer.domElement&&document.exitPointerLock(),this.audio.dispose();const e=new Set;for(const t of[this.scene,this.viewScene])t.traverse(r=>{if(r instanceof Ot||r instanceof mf){r.geometry.dispose();for(const a of Array.isArray(r.material)?r.material:[r.material])e.add(a)}});for(const t of this.world.occluders)t instanceof Ot&&t.geometry.dispose();for(const t of e){for(const r of Object.values(t))r instanceof En&&r.dispose();t.dispose()}this.renderer.dispose(),this.renderer.domElement.remove()}}function Pt({name:s,size:e=18,...t}){const r={arrow:M.jsx(M.Fragment,{children:M.jsx("path",{d:"M4 12h15m-6-6 6 6-6 6"})}),cross:M.jsxs(M.Fragment,{children:[M.jsx("path",{d:"M12 2v5m0 10v5M2 12h5m10 0h5"}),M.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),shield:M.jsxs(M.Fragment,{children:[M.jsx("path",{d:"m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"}),M.jsx("path",{d:"m8 12 3 3 5-6"})]}),swords:M.jsx(M.Fragment,{children:M.jsx("path",{d:"m4 3 9 8-2 3L3 5V3zm16 0-9 8 2 3 8-9V3M7 15l-4 6m0-7 6 5m8-4 4 6m0-7-6 5"})}),sound:M.jsx(M.Fragment,{children:M.jsx("path",{d:"M4 9h4l5-4v14l-5-4H4zm13-2c3 3 3 7 0 10m3-13c5 5 5 11 0 16"})}),mute:M.jsx(M.Fragment,{children:M.jsx("path",{d:"M4 9h4l5-4v14l-5-4H4m13 0 6-6m-6 0 6 6"})}),heart:M.jsx(M.Fragment,{children:M.jsx("path",{d:"M21 8c0 6-9 12-9 12S3 14 3 8c0-6 9-6 9-1 0-5 9-5 9 1Z"})}),bomb:M.jsxs(M.Fragment,{children:[M.jsx("circle",{cx:"11",cy:"14",r:"7"}),M.jsx("path",{d:"m14 7 3-3 4 1m-4-4v3m4-3-1 3M7 13l2-2"})]}),skull:M.jsxs(M.Fragment,{children:[M.jsx("path",{d:"M5 13c-5-13 19-13 14 0l-2 3v4H7v-4z"}),M.jsx("circle",{cx:"8",cy:"11",r:"1"}),M.jsx("circle",{cx:"16",cy:"11",r:"1"}),M.jsx("path",{d:"m11 15 1-2 1 2m-3 3v2m4-2v2"})]}),chevron:M.jsx("path",{d:"m8 5 7 7-7 7"}),close:M.jsx("path",{d:"m5 5 14 14M5 19 19 5"}),globe:M.jsxs(M.Fragment,{children:[M.jsx("circle",{cx:"12",cy:"12",r:"9"}),M.jsx("ellipse",{cx:"12",cy:"12",rx:"4",ry:"9"}),M.jsx("path",{d:"M3 12h18"})]}),expand:M.jsx("path",{d:"M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6"}),play:M.jsx("path",{d:"m9 4 11 8-11 8Z"}),clock:M.jsxs(M.Fragment,{children:[M.jsx("circle",{cx:"12",cy:"12",r:"9"}),M.jsx("path",{d:"M12 7v6h4"})]}),info:M.jsxs(M.Fragment,{children:[M.jsx("circle",{cx:"12",cy:"12",r:"9"}),M.jsx("path",{d:"M12 11v6m0-10v1"})]})};return M.jsx("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...t,children:r[s]||r.cross})}function Cd({id:s,className:e=""}){const t=["glock","usp","deagle"].includes(s);return M.jsx("svg",{className:`weapon-art ${e}`,viewBox:"0 0 240 88",fill:"currentColor","aria-hidden":"true",children:s==="knife"?M.jsxs(M.Fragment,{children:[M.jsx("path",{d:"M25 41h72v15H25zm75-7 114-9-18 25-96 6z"}),M.jsx("path",{d:"M91 28h9v40h-9z"})]}):t?M.jsxs(M.Fragment,{children:[M.jsx("path",{d:"M63 24h102v23H95l-5 32H65l8-35H63z"}),M.jsx("path",{d:"M98 45h35v15H94v-5h31v-7z"}),s==="usp"&&M.jsx("path",{d:"M165 29h40v12h-40z"})]}):M.jsxs(M.Fragment,{children:[M.jsx("path",{d:s==="ak47"?"M14 32h38l14-9h75v10h65v9h-63l-5 12h-37l-8 25H76l7-26H59l-7-9H14z":s==="awp"?"M15 38h52l9-10h71l10 7h65v6h-65l-7 13h-45l-8 21H79l6-21H58L15 60z":"M14 33h39V23h14v10h80v-8h10v9h55v8h-57l-12 10h-41l-7 26H78l6-26H61l-9-9H14z"}),M.jsx("path",{d:s==="ak47"?"m112 52 3 23 21 8 7-8-14-6-2-17z":"m111 52-2 20h19V52z"}),s==="awp"&&M.jsxs(M.Fragment,{children:[M.jsx("path",{d:"M92 17h62v10H92zM104 24h6v11h-6m30-11h6v11h-6"}),M.jsx("path",{d:"m175 40 14 31h5l-12-31z"})]}),s==="ak47"&&M.jsx("path",{d:"M192 23h5v12h-5z"})]})})}const V1=Gn.flatMap((s,e)=>s?[bi(e)]:[]);let ra="";for(let s=0;s<Gn.length;s++)if(Gn[s]){const e=bi(s),t=e.x-1,r=e.z-1,a=s%qt,l=Math.floor(s/qt);(l===0||!Gn[s-qt])&&(ra+=`M${t},${r}h2`),(l===ca-1||!Gn[s+qt])&&(ra+=`M${t},${r+2}h2`),(a===0||!Gn[s-1])&&(ra+=`M${t},${r}v2`),(a===qt-1||!Gn[s+1])&&(ra+=`M${t+2},${r}v2`)}function bg({s,menu:e=!1}){const t=s==null?void 0:s.actors.find(r=>r.id===s.playerId);return M.jsxs("svg",{className:`minimap ${e?"menu-map":""}`,viewBox:"-45 -35 90 77","aria-label":"Dust II tactical minimap",children:[M.jsx("defs",{children:M.jsx("pattern",{id:e?"grid-menu":"grid-game",width:"8",height:"8",patternUnits:"userSpaceOnUse",children:M.jsx("path",{d:"M8 0H0V8",stroke:"currentColor",strokeWidth:".12",fill:"none",opacity:".12"})})}),M.jsx("rect",{x:"-45",y:"-35",width:"90",height:"77",fill:`url(#${e?"grid-menu":"grid-game"})`}),M.jsx("g",{fill:"#7f8374",opacity:".38",children:V1.map((r,a)=>M.jsx("rect",{x:r.x-1,y:r.z-1,width:2.05,height:2.05},a))}),M.jsx("path",{d:ra,fill:"none",stroke:"#b6b9a6",strokeWidth:".48",opacity:".7"}),Bf.map((r,a)=>M.jsx("rect",{x:r.x,y:r.z,width:r.w,height:r.d,fill:"#222d28",stroke:"#9a9d86",strokeWidth:".25"},a)),e&&M.jsxs(M.Fragment,{children:[M.jsx("path",{d:"M4 29 1 15 15 11 15-11 27-20M4 29-27 25-27-18M4 29 35 25 35-16",stroke:"#cc995d",strokeWidth:".45",strokeDasharray:"1.2 1.2",opacity:".7",fill:"none"}),M.jsx("text",{x:"2",y:"33",className:"map-word",children:"T SPAWN"}),M.jsx("text",{x:"0",y:"-25",className:"map-word",children:"CT SPAWN"}),M.jsx("text",{x:"0",y:"-3",className:"map-word",children:"MID"}),M.jsx("text",{x:"35",y:"5",className:"map-word",transform:"rotate(-90 35 5)",children:"A LONG"}),M.jsx("text",{x:"-27",y:"8",className:"map-word",transform:"rotate(-90 -27 8)",children:"TUNNELS"})]}),M.jsxs("g",{className:"map-sites",children:[M.jsx("circle",{cx:"27",cy:"-21",r:"3.5"}),M.jsx("text",{x:"27",y:"-19.5",children:"A"}),M.jsx("circle",{cx:"-29",cy:"-19",r:"3.5"}),M.jsx("text",{x:"-29",y:"-17.5",children:"B"})]}),!e&&(s==null?void 0:s.actors.filter(r=>r.alive&&r.id!==s.playerId&&(r.team===s.team||r.seen)).map(r=>M.jsxs("g",{transform:`translate(${r.x} ${r.z})`,children:[M.jsx("circle",{r:"1.25",fill:r.team===s.team?"#a9d0d1":"#f27664",stroke:"#18211d",strokeWidth:".4"}),r.team===s.team&&M.jsx("text",{y:".6",fontSize:"1.8",fill:"#23302b",textAnchor:"middle",children:r.id%5+1})]},r.id))),!e&&t&&t.alive&&M.jsxs("g",{transform:`translate(${t.x} ${t.z}) rotate(${-t.yaw*180/Math.PI})`,children:[M.jsx("path",{d:"M0 0-5-9a10 10 0 0 1 10 0Z",fill:"#efa758",opacity:".2"}),M.jsx("path",{d:"M0-2.3 1.8 1.8 0 .9-1.8 1.8Z",fill:"#ffc078",stroke:"#1d251e",strokeWidth:".35"})]}),!e&&s&&["carried","dropped","planted"].includes(s.bomb.state)&&M.jsxs("g",{transform:`translate(${s.bomb.x} ${s.bomb.z})`,children:[M.jsx("path",{d:"m0-1.6 1.6 1.6-1.6 1.6-1.6-1.6Z",fill:"#ffd278",stroke:"#1d251e",strokeWidth:".3"}),s.bomb.state==="planted"&&M.jsx("circle",{r:"3",fill:"none",stroke:"#ffb45a",strokeWidth:".4",className:"bomb-ping"})]}),M.jsx("text",{x:"39",y:"-29",className:"map-north",children:"N"}),M.jsx("path",{d:"m39-27-1 3h2Z",fill:"#d1d4be"})]})}const G1=s=>{const e=Math.ceil(Math.max(s,0));return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`},Gt=s=>M.jsx("kbd",{children:s});function W1(){var L,A,k;const s=vi.useRef(null),e=vi.useRef(null),[t,r]=vi.useState(null),[a,l]=vi.useState(""),[u,d]=vi.useState({team:"T",pistol:!1,primary:"ak47",secondary:"glock"}),[h,m]=vi.useState(!1),[v,x]=vi.useState(!1),[_,y]=vi.useState(!1);vi.useEffect(()=>{if(s.current)try{const N=new H1(s.current,r);return e.current=N,()=>{N.dispose(),e.current=null}}catch(N){l(N instanceof Error?N.message:"WebGL could not start")}},[]),vi.useEffect(()=>{const N=z=>{z.code==="Tab"&&y(!0),z.code==="KeyH"&&!z.repeat&&(m(D=>!D),document.pointerLockElement&&document.exitPointerLock())},U=z=>{z.code==="Tab"&&y(!1)};return window.addEventListener("keydown",N),window.addEventListener("keyup",U),()=>{window.removeEventListener("keydown",N),window.removeEventListener("keyup",U)}},[]);const E=!t||t.phase==="menu";function w(N){d({...u,team:N,primary:N==="CT"?"m4a4":"ak47",secondary:N==="CT"?"usp":"glock"})}function S(){const N=!v;x(N),e.current&&(e.current.audio.muted=N)}const p=(t==null?void 0:t.bomb.state)==="planted",b=(t==null?void 0:t.alive)&&t.phase==="playing"&&(t.carrier&&["A SITE","B SITE"].includes(t.location)||t.team==="CT"&&p&&Math.hypot((((L=t.actors.find(N=>N.id===t.playerId))==null?void 0:L.x)||0)-t.bomb.x,(((A=t.actors.find(N=>N.id===t.playerId))==null?void 0:A.z)||0)-t.bomb.z)<2);return M.jsxs("div",{className:`app ${E?"is-menu":"in-game"}`,children:[M.jsx("div",{ref:s,className:"game-canvas"}),E?M.jsxs(M.Fragment,{children:[M.jsx("div",{className:"menu-shade"}),M.jsx("div",{className:"film-grain"}),M.jsxs("header",{className:"masthead",children:[M.jsxs("a",{href:"/",className:"brand","aria-label":"Dust II home",children:[M.jsxs("span",{className:"brand-mark",children:[M.jsx("i",{}),M.jsx("i",{}),M.jsx("i",{})]}),M.jsxs("span",{children:["DUST",M.jsx("span",{className:"brand-ii",children:"II"}),M.jsx("small",{children:"TACTICAL PLAYGROUND"})]})]}),M.jsxs("nav",{children:[M.jsx("button",{className:"nav-active",onClick:()=>m(!1),children:"THE EXPERIENCE"}),M.jsxs("button",{onClick:()=>m(!0),children:["FIELD MANUAL ",M.jsx("span",{children:"↗"})]})]}),M.jsxs("div",{className:"header-actions",children:[M.jsxs("span",{className:"local-status",children:[M.jsx("i",{})," SYSTEM ONLINE"]}),M.jsx("button",{className:"icon-button","aria-label":v?"Unmute audio":"Mute audio",onClick:S,children:M.jsx(Pt,{name:v?"mute":"sound"})}),M.jsx("button",{className:"icon-button fullscreen","aria-label":"Fullscreen",onClick:()=>void document.documentElement.requestFullscreen(),children:M.jsx(Pt,{name:"expand"})})]})]}),M.jsxs("main",{className:"menu-main",children:[M.jsxs("section",{className:"deploy-panel",children:[M.jsxs("div",{className:"eyebrow",children:[M.jsx("span",{className:"small-cross",children:"✣"})," A CLASSIC. REBUILT."," ",M.jsx("span",{className:"edition",children:"VOL. 01 / NORTH AFRICA"})]}),M.jsxs("h1",{children:["DUST",M.jsx("span",{children:"II"}),M.jsx("span",{className:"title-period",children:"."})]}),M.jsxs("div",{className:"hero-copy",children:[M.jsx("p",{children:"Familiar ground. Fresh adrenaline."}),M.jsx("span",{children:"Ten operators. Two bomb sites. Every angle matters."})]}),M.jsxs("div",{className:"loadout-config",children:[M.jsxs("div",{className:"config-label",children:[M.jsxs("span",{children:[M.jsx("b",{children:"01"})," CHOOSE YOUR SIDE"]}),M.jsx("span",{children:"5 VS 5"})]}),M.jsxs("div",{className:"team-options",children:[M.jsxs("button",{className:`team-option ct ${u.team==="CT"?"selected":""}`,onClick:()=>w("CT"),children:[M.jsx(Pt,{name:"shield",size:26}),M.jsxs("span",{children:["COUNTER-TERRORISTS",M.jsx("small",{children:"DEFEND & DEFUSE"})]}),M.jsx("i",{className:"radio-dot"})]}),M.jsxs("button",{className:`team-option t ${u.team==="T"?"selected":""}`,onClick:()=>w("T"),children:[M.jsx(Pt,{name:"swords",size:26}),M.jsxs("span",{children:["TERRORISTS",M.jsx("small",{children:"ATTACK & PLANT"})]}),M.jsx("i",{className:"radio-dot"})]})]}),M.jsxs("div",{className:"config-label round-label",children:[M.jsxs("span",{children:[M.jsx("b",{children:"02"})," SET YOUR LOADOUT"]}),M.jsxs("div",{className:"round-toggle",children:[M.jsx("button",{className:u.pistol?"":"active",onClick:()=>d({...u,pistol:!1}),children:"STANDARD"}),M.jsx("button",{className:u.pistol?"active":"",onClick:()=>d({...u,pistol:!0}),children:"PISTOL ROUND"})]})]}),M.jsxs("div",{className:`weapon-options ${u.pistol?"pistol-options":""}`,children:[(u.pistol?[u.team==="CT"?"usp":"glock"]:["ak47","m4a4","awp"]).map(N=>{const U=Zt[N];return M.jsxs("button",{className:`weapon-option ${u.primary===N||u.pistol?"selected":""}`,onClick:()=>!u.pistol&&d({...u,primary:N}),children:[M.jsx("span",{className:"weapon-type",children:U.short}),M.jsx(Cd,{id:N}),M.jsx("span",{className:"weapon-name",children:U.name}),M.jsx("span",{className:"weapon-selected",children:u.primary===N||u.pistol?"●":"○"})]},N)}),u.pistol&&M.jsxs("div",{className:"pistol-explainer",children:[M.jsx(Pt,{name:"cross",size:22}),M.jsxs("div",{children:["BACK TO BASICS",M.jsxs("span",{children:["Default sidearm. No armor.",M.jsx("br",{}),"Precision over firepower."]})]})]})]}),M.jsxs("div",{className:"kit-summary",children:[M.jsxs("span",{children:[M.jsx(Pt,{name:"shield",size:13}),u.pistol?"NO ARMOR":"100 ARMOR"]}),M.jsxs("span",{children:[M.jsx(Pt,{name:"bomb",size:13}),u.team==="T"?"C4 EQUIPPED":"8s DEFUSE"]}),!u.pistol&&M.jsxs("label",{children:["SIDEARM"," ",M.jsxs("select",{"aria-label":"Sidearm",value:u.secondary,onChange:N=>d({...u,secondary:N.target.value}),children:[M.jsx("option",{value:u.team==="T"?"glock":"usp",children:u.team==="T"?"Glock-18":"USP-S"}),M.jsx("option",{value:"deagle",children:"Desert Eagle"})]})]})]})]}),M.jsxs("button",{className:"deploy-button",disabled:!t||!!a,onClick:()=>{var N;return(N=e.current)==null?void 0:N.start(u)},children:[M.jsxs("span",{children:[M.jsx(Pt,{name:"play",size:19})," DEPLOY TO DUST II"]}),M.jsx(Pt,{name:"arrow",size:23})]}),M.jsxs("div",{className:"deploy-subline",children:[M.jsxs("span",{children:[M.jsx("i",{})," SOLO PLAYER + 9 AUTONOMOUS BOTS"]}),M.jsxs("button",{onClick:()=>m(!0),children:["CONTROLS ",M.jsx("kbd",{children:"H"})]})]})]}),M.jsxs("aside",{className:"environment-panel",children:[M.jsxs("div",{className:"environment-label",children:[M.jsx("span",{className:"live-square"}),M.jsx("span",{children:"LIVE ENVIRONMENT"}),M.jsx("span",{className:"environment-separator"})," A LONG"]}),M.jsxs("div",{className:"scene-reticle",children:[M.jsx("span",{}),M.jsx("span",{}),M.jsx("span",{}),M.jsx("span",{})]}),M.jsxs("div",{className:"map-card",children:[M.jsxs("div",{className:"map-card-top",children:[M.jsx("span",{children:"THE BATTLEGROUND"}),M.jsxs("span",{children:["01 ",M.jsx("span",{className:"dim",children:"/ 01"})]})]}),M.jsxs("div",{className:"map-title",children:["A place you know.",M.jsxs("span",{children:["DE_DUST2 ",M.jsx(Pt,{name:"globe",size:14})]})]}),M.jsx(bg,{menu:!0,s:t}),M.jsxs("div",{className:"map-legend",children:[M.jsxs("span",{children:[M.jsx("i",{})," BOMB SITE"]}),M.jsx("span",{children:"36°47′ N   03°03′ E"})]})]}),M.jsxs("div",{className:"scene-caption",children:[M.jsx("span",{children:"WARM STONE. COLD NERVES."}),M.jsx("span",{children:"THE DUST COLLECTION — EST. 2001"})]})]})]}),M.jsxs("footer",{className:"menu-footer",children:[M.jsxs("div",{children:[M.jsx("span",{className:"footer-index",children:"D2 /"}),M.jsx("span",{children:"A TACTICAL FPS EXPERIMENT"})]}),M.jsxs("div",{className:"footer-stats",children:[M.jsxs("span",{children:[M.jsx("b",{children:"10"})," OPERATORS"]}),M.jsxs("span",{children:[M.jsx("b",{children:"02"})," BOMB SITES"]}),M.jsxs("span",{children:[M.jsx("b",{children:"01"})," OBJECTIVE"]})]}),M.jsxs("span",{className:"footer-build",children:["PROCEDURAL WORLD ",M.jsx("i",{})," V.1.0"]})]})]}):t&&M.jsxs(M.Fragment,{children:[M.jsx("div",{className:"hud-vignette"}),M.jsxs("div",{className:"hud-top",children:[M.jsxs("div",{className:"round-heading",children:["DUST II ",M.jsx("span",{children:"/"})," ROUND ",String(t.round).padStart(2,"0")," ",M.jsx("span",{children:"/"})," ",(k=e.current)!=null&&k.settings.pistol?"PISTOL":"BOMB DEFUSAL"]}),M.jsxs("div",{className:"match-score",children:[M.jsxs("div",{className:"score-team ct-color",children:[M.jsx(Pt,{name:"shield",size:22}),M.jsx("div",{className:"alive-pips",children:Array.from({length:5},(N,U)=>M.jsx("i",{className:U<t.ctAlive?"live":""},U))}),M.jsx("strong",{children:t.score.CT})]}),M.jsxs("div",{className:`match-clock ${p?"planted":""}`,children:[M.jsx("small",{children:p?"C4 PLANTED":"ROUND TIME"}),M.jsxs("span",{children:[p&&M.jsx(Pt,{name:"bomb",size:18})," ",G1(p?t.bomb.time:t.clock)]})]}),M.jsxs("div",{className:"score-team t-color",children:[M.jsx("strong",{children:t.score.T}),M.jsx("div",{className:"alive-pips",children:Array.from({length:5},(N,U)=>M.jsx("i",{className:U<t.tAlive?"live":""},U))}),M.jsx(Pt,{name:"swords",size:22})]})]})]}),M.jsxs("div",{className:"radar-panel",children:[M.jsxs("div",{className:"location",children:[M.jsx("span",{className:"live-square"}),t.location,M.jsx("span",{children:t.team})]}),M.jsx(bg,{s:t}),M.jsxs("div",{className:"radar-bottom",children:[M.jsxs("span",{children:["YOU ",M.jsx("i",{className:"self"})]}),M.jsxs("span",{children:["ALLY ",M.jsx("i",{className:"ally"})]}),M.jsxs("span",{children:["ENEMY ",M.jsx("i",{className:"enemy"})]})]})]}),M.jsx("div",{className:"killfeed",children:t.kills.map(N=>M.jsxs("div",{className:N.killer==="You"?"your-kill":"",children:[M.jsx("span",{className:N.team==="CT"?"ct-color":"t-color",children:N.killer}),M.jsx(Cd,{id:N.weapon}),N.head&&M.jsx(Pt,{name:"cross",size:14}),M.jsx("span",{className:N.team==="CT"?"t-color":"ct-color",children:N.victim})]},N.id))}),t.scoped&&M.jsx("div",{className:"scope-mask",children:M.jsxs("div",{className:"scope-circle",children:[M.jsx("div",{className:"scope-h"}),M.jsx("div",{className:"scope-v"}),M.jsx("div",{className:"scope-center"}),M.jsx("span",{className:"scope-range",children:"100 m"})]})}),t.alive&&!t.scoped&&M.jsxs("div",{className:"crosshair",style:{"--gap":`${5+t.spread*160}px`},children:[M.jsx("i",{}),M.jsx("i",{}),M.jsx("i",{}),M.jsx("i",{}),M.jsx("b",{})]}),t.hit>0&&M.jsxs("div",{className:`hitmarker ${t.headshot?"headshot":""}`,children:[M.jsx("i",{}),M.jsx("i",{}),M.jsx("i",{}),M.jsx("i",{})]}),t.hurt>0&&M.jsx("div",{className:"hurt-overlay",style:{opacity:t.hurt*1.6}}),t.carrier&&M.jsxs("div",{className:"carry-badge",children:[M.jsx(Pt,{name:"bomb",size:16})," YOU HAVE THE C4"," ",M.jsx("span",{children:"HOLD E AT A / B TO PLANT"})]}),(t.action>0||b)&&M.jsxs("div",{className:"interaction",children:[M.jsx("kbd",{children:"E"}),M.jsxs("div",{children:[M.jsx("span",{children:t.actionLabel||(t.team==="T"?"HOLD TO PLANT C4":"HOLD TO DEFUSE C4")}),M.jsx("div",{className:"interaction-track",children:M.jsx("i",{style:{width:`${t.bomb.progress*100}%`}})})]})]}),t.notice&&t.alive&&t.phase!=="ended"&&M.jsxs("div",{className:"game-notice",children:[M.jsx(Pt,{name:"info",size:15}),t.notice]}),M.jsxs("div",{className:"hud-bottom",children:[M.jsxs("div",{className:"vitals",children:[M.jsxs("div",{className:`health ${t.hp<30?"critical":""}`,children:[M.jsx("span",{className:"health-plus",children:"+"}),M.jsx("strong",{children:t.hp}),M.jsxs("div",{children:[M.jsx("span",{children:"HEALTH"}),M.jsx("div",{className:"vital-bar",children:M.jsx("i",{style:{width:`${t.hp}%`}})})]})]}),M.jsxs("div",{className:"armor",children:[M.jsx(Pt,{name:"shield",size:23}),M.jsx("strong",{children:t.armor}),M.jsx("span",{children:"ARMOR"})]})]}),M.jsxs("div",{className:"bottom-mid",children:[M.jsxs("span",{children:[Gt("W"),Gt("A"),Gt("S"),Gt("D")," MOVE ",M.jsx("span",{className:"control-sep"})," ",Gt("R")," ","RELOAD ",M.jsx("span",{className:"control-sep"})," ",Gt("TAB")," ROSTER"]}),M.jsxs("small",{children:[M.jsx("i",{})," ",t.fps," FPS ",M.jsx("span",{children:"/"})," LOCAL SESSION"]})]}),M.jsxs("div",{className:"ammo-panel",children:[M.jsx("div",{className:"weapon-slots",children:[1,2,3].map(N=>{const U=t.guns.find(z=>Zt[z].slot===N);return M.jsxs("div",{className:t.slot===N?"equipped":"",children:[M.jsx("kbd",{children:N}),U?M.jsx(Cd,{id:U}):M.jsx("span",{children:"—"})]},N)})}),M.jsxs("div",{className:"ammo-main",children:[M.jsxs("div",{className:"equipped-name",children:[M.jsx("strong",{children:Zt[t.weapon].name}),M.jsx("span",{children:t.reload?"RELOADING…":Zt[t.weapon].short})]}),M.jsx("div",{className:`ammo-numbers ${t.ammo<6?"low":""}`,children:t.weapon==="knife"?M.jsx(Pt,{name:"swords",size:32}):M.jsxs(M.Fragment,{children:[M.jsx("strong",{children:String(t.ammo).padStart(2,"0")}),M.jsxs("span",{children:["/ ",t.reserve]})]})})]}),t.reload>0&&M.jsx("div",{className:"reload-track",children:M.jsx("i",{style:{width:`${t.reload*100}%`}})})]})]}),!t.alive&&t.phase==="playing"&&M.jsxs("div",{className:"death-panel",children:[M.jsx("span",{children:"OPERATOR DOWN"}),M.jsx("h2",{children:"Stay in the fight."}),M.jsx("p",{children:t.actors.some(N=>N.team===t.team&&N.alive)?"Take control of a surviving teammate.":"Your squad has been eliminated."}),t.actors.some(N=>N.team===t.team&&N.alive)&&M.jsxs("button",{onClick:()=>{var N;return(N=e.current)==null?void 0:N.takeover()},children:[M.jsx("kbd",{children:"F"})," TAKE OVER TEAMMATE ",M.jsx(Pt,{name:"arrow"})]})]}),t.phase==="ended"&&M.jsxs("div",{className:`round-result ${t.winner===t.team?"victory":"defeat"}`,children:[M.jsx(Pt,{name:t.winner==="CT"?"shield":"swords",size:36}),M.jsx("span",{children:t.winner===t.team?"ROUND WON":"ROUND LOST"}),M.jsx("h2",{children:t.winner==="CT"?"Counter-terrorists win.":"Terrorists win."}),M.jsx("p",{children:t.reason}),M.jsxs("small",{children:["NEXT ROUND IN ",Math.ceil(t.endTime),"s"]})]}),_&&M.jsxs("div",{className:"scoreboard",children:[M.jsxs("div",{className:"scoreboard-title",children:["DUST II ",M.jsxs("span",{children:["ROUND ",t.round," · 5v5"]})]}),["CT","T"].map(N=>M.jsxs("section",{children:[M.jsxs("h3",{className:N==="CT"?"ct-color":"t-color",children:[N==="CT"?"COUNTER-TERRORISTS":"TERRORISTS"," ",M.jsx("span",{children:t.score[N]})]}),M.jsxs("div",{className:"roster-label",children:[M.jsx("span",{children:"OPERATOR"}),M.jsx("span",{children:"HP"}),M.jsx("span",{children:"K"}),M.jsx("span",{children:"D"})]}),t.actors.filter(U=>U.team===N).map(U=>M.jsxs("div",{className:`roster-row ${U.id===t.playerId?"is-you":""} ${U.alive?"":"is-dead"}`,children:[M.jsxs("span",{children:[U.alive?M.jsx("i",{className:"roster-dot"}):M.jsx(Pt,{name:"skull",size:15}),U.name,U.id!==t.playerId&&M.jsx("small",{children:"BOT"}),t.bomb.carrier===U.id&&M.jsx(Pt,{name:"bomb",size:14})]}),M.jsx("span",{children:U.alive?U.hp:"—"}),M.jsx("span",{children:U.kills}),M.jsx("span",{children:U.deaths})]},U.id))]},N))]}),!t.locked&&!h&&M.jsx("div",{className:"pause-overlay",children:M.jsxs("div",{className:"pause-card",children:[M.jsx("span",{className:"eyebrow",children:"DUST II / SESSION PAUSED"}),M.jsx("h2",{children:"Catch your breath."}),M.jsx("p",{children:"Your squad will be here when you’re ready."}),M.jsxs("button",{className:"deploy-button",onClick:()=>{var N;return(N=e.current)==null?void 0:N.lock()},children:[M.jsxs("span",{children:[M.jsx(Pt,{name:"play"})," RESUME OPERATION"]}),M.jsx(Pt,{name:"arrow"})]}),M.jsxs("div",{className:"pause-actions",children:[M.jsx("button",{onClick:()=>m(!0),children:"FIELD MANUAL"}),M.jsx("button",{onClick:()=>{var N;return(N=e.current)==null?void 0:N.menu()},children:"RETURN TO MENU"})]}),M.jsx("small",{children:"Mouse is captured during play. Press Esc to pause."})]})})]}),h&&M.jsx("div",{className:"manual-overlay",children:M.jsxs("section",{className:"manual-card",children:[M.jsxs("div",{className:"manual-heading",children:[M.jsx("span",{className:"eyebrow",children:"KNOW YOUR WAY AROUND"}),M.jsx("button",{className:"icon-button","aria-label":"Close field manual",onClick:()=>m(!1),children:M.jsx(Pt,{name:"close"})})]}),M.jsxs("h2",{children:["Field manual",M.jsx("span",{children:"."})]}),M.jsx("p",{children:"One life. One objective. Make it count."}),M.jsxs("div",{className:"manual-grid",children:[M.jsxs("div",{children:[M.jsx("h3",{children:"MOVE & LOOK"}),M.jsxs("p",{children:[M.jsxs("span",{children:[Gt("W"),Gt("A"),Gt("S"),Gt("D")]})," ","Move"]}),M.jsxs("p",{children:[M.jsx("span",{children:Gt("MOUSE")})," Look / aim"]}),M.jsxs("p",{children:[M.jsx("span",{children:Gt("SPACE")})," Jump"]}),M.jsxs("p",{children:[M.jsx("span",{children:Gt("SHIFT")})," Walk quietly"]})]}),M.jsxs("div",{children:[M.jsx("h3",{children:"FIGHT & INTERACT"}),M.jsxs("p",{children:[M.jsxs("span",{children:[Gt("LMB")," / ",Gt("RMB")]})," ","Fire / AWP scope"]}),M.jsxs("p",{children:[M.jsxs("span",{children:[Gt("1"),Gt("2"),Gt("3")]})," ","Rifle / pistol / knife"]}),M.jsxs("p",{children:[M.jsxs("span",{children:[Gt("R")," / ",Gt("G")]})," ","Reload / drop C4"]}),M.jsxs("p",{children:[M.jsxs("span",{children:[Gt("E")," HOLD"]})," Plant / defuse"]})]})]}),M.jsxs("div",{className:"manual-objectives",children:[M.jsxs("div",{children:[M.jsx(Pt,{name:"swords"}),M.jsxs("p",{children:[M.jsx("strong",{children:"TERRORISTS"}),"Escort the C4 to A or B. Hold E for 3.2 seconds to plant. Defend it for 40 seconds, or eliminate the defenders."]})]}),M.jsxs("div",{children:[M.jsx(Pt,{name:"shield"}),M.jsxs("p",{children:[M.jsx("strong",{children:"COUNTER-TERRORISTS"}),"Defend both sites. Eliminate the attackers before they plant, or hold E near the C4 for 8 seconds to defuse."]})]})]}),M.jsxs("div",{className:"manual-bottom",children:[M.jsxs("span",{children:[Gt("F")," Take over a living ally after death"]}),M.jsxs("span",{children:[Gt("TAB")," Team roster"]}),M.jsxs("span",{children:[Gt("ESC")," Pause"]})]}),M.jsxs("button",{className:"manual-done",onClick:()=>m(!1),children:["GOT IT. LET’S PLAY. ",M.jsx(Pt,{name:"arrow"})]})]})}),a&&M.jsxs("div",{className:"error-card",children:[M.jsx("h2",{children:"WebGL couldn’t start"}),M.jsx("p",{children:a}),M.jsx("p",{children:"Use a desktop browser with hardware acceleration enabled."})]})]})}r_.createRoot(document.getElementById("root")).render(M.jsx(Zv.StrictMode,{children:M.jsx(W1,{})}));
