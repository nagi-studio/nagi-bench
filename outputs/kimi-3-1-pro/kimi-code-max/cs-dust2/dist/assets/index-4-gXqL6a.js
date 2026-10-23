(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();var ed={exports:{}},Yo={},td={exports:{}},St={};var bm;function P_(){if(bm)return St;bm=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),a=Symbol.for("react.provider"),c=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),h=Symbol.for("react.memo"),m=Symbol.for("react.lazy"),x=Symbol.iterator;function _(B){return B===null||typeof B!="object"?null:(B=x&&B[x]||B["@@iterator"],typeof B=="function"?B:null)}var S={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,w={};function y(B,re,Be){this.props=B,this.context=re,this.refs=w,this.updater=Be||S}y.prototype.isReactComponent={},y.prototype.setState=function(B,re){if(typeof B!="object"&&typeof B!="function"&&B!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,B,re,"setState")},y.prototype.forceUpdate=function(B){this.updater.enqueueForceUpdate(this,B,"forceUpdate")};function v(){}v.prototype=y.prototype;function P(B,re,Be){this.props=B,this.context=re,this.refs=w,this.updater=Be||S}var C=P.prototype=new v;C.constructor=P,M(C,y.prototype),C.isPureReactComponent=!0;var E=Array.isArray,O=Object.prototype.hasOwnProperty,U={current:null},F={key:!0,ref:!0,__self:!0,__source:!0};function V(B,re,Be){var Xe,qe={},ne=null,pe=null;if(re!=null)for(Xe in re.ref!==void 0&&(pe=re.ref),re.key!==void 0&&(ne=""+re.key),re)O.call(re,Xe)&&!F.hasOwnProperty(Xe)&&(qe[Xe]=re[Xe]);var Te=arguments.length-2;if(Te===1)qe.children=Be;else if(1<Te){for(var Ue=Array(Te),Ve=0;Ve<Te;Ve++)Ue[Ve]=arguments[Ve+2];qe.children=Ue}if(B&&B.defaultProps)for(Xe in Te=B.defaultProps,Te)qe[Xe]===void 0&&(qe[Xe]=Te[Xe]);return{$$typeof:s,type:B,key:ne,ref:pe,props:qe,_owner:U.current}}function b(B,re){return{$$typeof:s,type:B.type,key:re,ref:B.ref,props:B.props,_owner:B._owner}}function R(B){return typeof B=="object"&&B!==null&&B.$$typeof===s}function H(B){var re={"=":"=0",":":"=2"};return"$"+B.replace(/[=:]/g,function(Be){return re[Be]})}var Y=/\/+/g;function ee(B,re){return typeof B=="object"&&B!==null&&B.key!=null?H(""+B.key):re.toString(36)}function de(B,re,Be,Xe,qe){var ne=typeof B;(ne==="undefined"||ne==="boolean")&&(B=null);var pe=!1;if(B===null)pe=!0;else switch(ne){case"string":case"number":pe=!0;break;case"object":switch(B.$$typeof){case s:case e:pe=!0}}if(pe)return pe=B,qe=qe(pe),B=Xe===""?"."+ee(pe,0):Xe,E(qe)?(Be="",B!=null&&(Be=B.replace(Y,"$&/")+"/"),de(qe,re,Be,"",function(Ve){return Ve})):qe!=null&&(R(qe)&&(qe=b(qe,Be+(!qe.key||pe&&pe.key===qe.key?"":(""+qe.key).replace(Y,"$&/")+"/")+B)),re.push(qe)),1;if(pe=0,Xe=Xe===""?".":Xe+":",E(B))for(var Te=0;Te<B.length;Te++){ne=B[Te];var Ue=Xe+ee(ne,Te);pe+=de(ne,re,Be,Ue,qe)}else if(Ue=_(B),typeof Ue=="function")for(B=Ue.call(B),Te=0;!(ne=B.next()).done;)ne=ne.value,Ue=Xe+ee(ne,Te++),pe+=de(ne,re,Be,Ue,qe);else if(ne==="object")throw re=String(B),Error("Objects are not valid as a React child (found: "+(re==="[object Object]"?"object with keys {"+Object.keys(B).join(", ")+"}":re)+"). If you meant to render a collection of children, use an array instead.");return pe}function se(B,re,Be){if(B==null)return B;var Xe=[],qe=0;return de(B,Xe,"","",function(ne){return re.call(Be,ne,qe++)}),Xe}function te(B){if(B._status===-1){var re=B._result;re=re(),re.then(function(Be){(B._status===0||B._status===-1)&&(B._status=1,B._result=Be)},function(Be){(B._status===0||B._status===-1)&&(B._status=2,B._result=Be)}),B._status===-1&&(B._status=0,B._result=re)}if(B._status===1)return B._result.default;throw B._result}var le={current:null},W={transition:null},fe={ReactCurrentDispatcher:le,ReactCurrentBatchConfig:W,ReactCurrentOwner:U};function ce(){throw Error("act(...) is not supported in production builds of React.")}return St.Children={map:se,forEach:function(B,re,Be){se(B,function(){re.apply(this,arguments)},Be)},count:function(B){var re=0;return se(B,function(){re++}),re},toArray:function(B){return se(B,function(re){return re})||[]},only:function(B){if(!R(B))throw Error("React.Children.only expected to receive a single React element child.");return B}},St.Component=y,St.Fragment=t,St.Profiler=o,St.PureComponent=P,St.StrictMode=i,St.Suspense=f,St.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=fe,St.act=ce,St.cloneElement=function(B,re,Be){if(B==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+B+".");var Xe=M({},B.props),qe=B.key,ne=B.ref,pe=B._owner;if(re!=null){if(re.ref!==void 0&&(ne=re.ref,pe=U.current),re.key!==void 0&&(qe=""+re.key),B.type&&B.type.defaultProps)var Te=B.type.defaultProps;for(Ue in re)O.call(re,Ue)&&!F.hasOwnProperty(Ue)&&(Xe[Ue]=re[Ue]===void 0&&Te!==void 0?Te[Ue]:re[Ue])}var Ue=arguments.length-2;if(Ue===1)Xe.children=Be;else if(1<Ue){Te=Array(Ue);for(var Ve=0;Ve<Ue;Ve++)Te[Ve]=arguments[Ve+2];Xe.children=Te}return{$$typeof:s,type:B.type,key:qe,ref:ne,props:Xe,_owner:pe}},St.createContext=function(B){return B={$$typeof:c,_currentValue:B,_currentValue2:B,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},B.Provider={$$typeof:a,_context:B},B.Consumer=B},St.createElement=V,St.createFactory=function(B){var re=V.bind(null,B);return re.type=B,re},St.createRef=function(){return{current:null}},St.forwardRef=function(B){return{$$typeof:d,render:B}},St.isValidElement=R,St.lazy=function(B){return{$$typeof:m,_payload:{_status:-1,_result:B},_init:te}},St.memo=function(B,re){return{$$typeof:h,type:B,compare:re===void 0?null:re}},St.startTransition=function(B){var re=W.transition;W.transition={};try{B()}finally{W.transition=re}},St.unstable_act=ce,St.useCallback=function(B,re){return le.current.useCallback(B,re)},St.useContext=function(B){return le.current.useContext(B)},St.useDebugValue=function(){},St.useDeferredValue=function(B){return le.current.useDeferredValue(B)},St.useEffect=function(B,re){return le.current.useEffect(B,re)},St.useId=function(){return le.current.useId()},St.useImperativeHandle=function(B,re,Be){return le.current.useImperativeHandle(B,re,Be)},St.useInsertionEffect=function(B,re){return le.current.useInsertionEffect(B,re)},St.useLayoutEffect=function(B,re){return le.current.useLayoutEffect(B,re)},St.useMemo=function(B,re){return le.current.useMemo(B,re)},St.useReducer=function(B,re,Be){return le.current.useReducer(B,re,Be)},St.useRef=function(B){return le.current.useRef(B)},St.useState=function(B){return le.current.useState(B)},St.useSyncExternalStore=function(B,re,Be){return le.current.useSyncExternalStore(B,re,Be)},St.useTransition=function(){return le.current.useTransition()},St.version="18.3.1",St}var Pm;function zf(){return Pm||(Pm=1,td.exports=P_()),td.exports}var Lm;function L_(){if(Lm)return Yo;Lm=1;var s=zf(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,o=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function c(d,f,h){var m,x={},_=null,S=null;h!==void 0&&(_=""+h),f.key!==void 0&&(_=""+f.key),f.ref!==void 0&&(S=f.ref);for(m in f)i.call(f,m)&&!a.hasOwnProperty(m)&&(x[m]=f[m]);if(d&&d.defaultProps)for(m in f=d.defaultProps,f)x[m]===void 0&&(x[m]=f[m]);return{$$typeof:e,type:d,key:_,ref:S,props:x,_owner:o.current}}return Yo.Fragment=t,Yo.jsx=c,Yo.jsxs=c,Yo}var Nm;function N_(){return Nm||(Nm=1,ed.exports=L_()),ed.exports}var N=N_(),Ai=zf(),Cl={},nd={exports:{}},zn={},id={exports:{}},rd={};var Dm;function D_(){return Dm||(Dm=1,(function(s){function e(W,fe){var ce=W.length;W.push(fe);e:for(;0<ce;){var B=ce-1>>>1,re=W[B];if(0<o(re,fe))W[B]=fe,W[ce]=re,ce=B;else break e}}function t(W){return W.length===0?null:W[0]}function i(W){if(W.length===0)return null;var fe=W[0],ce=W.pop();if(ce!==fe){W[0]=ce;e:for(var B=0,re=W.length,Be=re>>>1;B<Be;){var Xe=2*(B+1)-1,qe=W[Xe],ne=Xe+1,pe=W[ne];if(0>o(qe,ce))ne<re&&0>o(pe,qe)?(W[B]=pe,W[ne]=ce,B=ne):(W[B]=qe,W[Xe]=ce,B=Xe);else if(ne<re&&0>o(pe,ce))W[B]=pe,W[ne]=ce,B=ne;else break e}}return fe}function o(W,fe){var ce=W.sortIndex-fe.sortIndex;return ce!==0?ce:W.id-fe.id}if(typeof performance=="object"&&typeof performance.now=="function"){var a=performance;s.unstable_now=function(){return a.now()}}else{var c=Date,d=c.now();s.unstable_now=function(){return c.now()-d}}var f=[],h=[],m=1,x=null,_=3,S=!1,M=!1,w=!1,y=typeof setTimeout=="function"?setTimeout:null,v=typeof clearTimeout=="function"?clearTimeout:null,P=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function C(W){for(var fe=t(h);fe!==null;){if(fe.callback===null)i(h);else if(fe.startTime<=W)i(h),fe.sortIndex=fe.expirationTime,e(f,fe);else break;fe=t(h)}}function E(W){if(w=!1,C(W),!M)if(t(f)!==null)M=!0,te(O);else{var fe=t(h);fe!==null&&le(E,fe.startTime-W)}}function O(W,fe){M=!1,w&&(w=!1,v(V),V=-1),S=!0;var ce=_;try{for(C(fe),x=t(f);x!==null&&(!(x.expirationTime>fe)||W&&!H());){var B=x.callback;if(typeof B=="function"){x.callback=null,_=x.priorityLevel;var re=B(x.expirationTime<=fe);fe=s.unstable_now(),typeof re=="function"?x.callback=re:x===t(f)&&i(f),C(fe)}else i(f);x=t(f)}if(x!==null)var Be=!0;else{var Xe=t(h);Xe!==null&&le(E,Xe.startTime-fe),Be=!1}return Be}finally{x=null,_=ce,S=!1}}var U=!1,F=null,V=-1,b=5,R=-1;function H(){return!(s.unstable_now()-R<b)}function Y(){if(F!==null){var W=s.unstable_now();R=W;var fe=!0;try{fe=F(!0,W)}finally{fe?ee():(U=!1,F=null)}}else U=!1}var ee;if(typeof P=="function")ee=function(){P(Y)};else if(typeof MessageChannel<"u"){var de=new MessageChannel,se=de.port2;de.port1.onmessage=Y,ee=function(){se.postMessage(null)}}else ee=function(){y(Y,0)};function te(W){F=W,U||(U=!0,ee())}function le(W,fe){V=y(function(){W(s.unstable_now())},fe)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(W){W.callback=null},s.unstable_continueExecution=function(){M||S||(M=!0,te(O))},s.unstable_forceFrameRate=function(W){0>W||125<W?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):b=0<W?Math.floor(1e3/W):5},s.unstable_getCurrentPriorityLevel=function(){return _},s.unstable_getFirstCallbackNode=function(){return t(f)},s.unstable_next=function(W){switch(_){case 1:case 2:case 3:var fe=3;break;default:fe=_}var ce=_;_=fe;try{return W()}finally{_=ce}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(W,fe){switch(W){case 1:case 2:case 3:case 4:case 5:break;default:W=3}var ce=_;_=W;try{return fe()}finally{_=ce}},s.unstable_scheduleCallback=function(W,fe,ce){var B=s.unstable_now();switch(typeof ce=="object"&&ce!==null?(ce=ce.delay,ce=typeof ce=="number"&&0<ce?B+ce:B):ce=B,W){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=ce+re,W={id:m++,callback:fe,priorityLevel:W,startTime:ce,expirationTime:re,sortIndex:-1},ce>B?(W.sortIndex=ce,e(h,W),t(f)===null&&W===t(h)&&(w?(v(V),V=-1):w=!0,le(E,ce-B))):(W.sortIndex=re,e(f,W),M||S||(M=!0,te(O))),W},s.unstable_shouldYield=H,s.unstable_wrapCallback=function(W){var fe=_;return function(){var ce=_;_=fe;try{return W.apply(this,arguments)}finally{_=ce}}}})(rd)),rd}var Im;function I_(){return Im||(Im=1,id.exports=D_()),id.exports}var Um;function U_(){if(Um)return zn;Um=1;var s=zf(),e=I_();function t(n){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+n,l=1;l<arguments.length;l++)r+="&args[]="+encodeURIComponent(arguments[l]);return"Minified React error #"+n+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,o={};function a(n,r){c(n,r),c(n+"Capture",r)}function c(n,r){for(o[n]=r,n=0;n<r.length;n++)i.add(r[n])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),f=Object.prototype.hasOwnProperty,h=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,m={},x={};function _(n){return f.call(x,n)?!0:f.call(m,n)?!1:h.test(n)?x[n]=!0:(m[n]=!0,!1)}function S(n,r,l,u){if(l!==null&&l.type===0)return!1;switch(typeof r){case"function":case"symbol":return!0;case"boolean":return u?!1:l!==null?!l.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,r,l,u){if(r===null||typeof r>"u"||S(n,r,l,u))return!0;if(u)return!1;if(l!==null)switch(l.type){case 3:return!r;case 4:return r===!1;case 5:return isNaN(r);case 6:return isNaN(r)||1>r}return!1}function w(n,r,l,u,p,g,T){this.acceptsBooleans=r===2||r===3||r===4,this.attributeName=u,this.attributeNamespace=p,this.mustUseProperty=l,this.propertyName=n,this.type=r,this.sanitizeURL=g,this.removeEmptyString=T}var y={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){y[n]=new w(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var r=n[0];y[r]=new w(r,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){y[n]=new w(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){y[n]=new w(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){y[n]=new w(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){y[n]=new w(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){y[n]=new w(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){y[n]=new w(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){y[n]=new w(n,5,!1,n.toLowerCase(),null,!1,!1)});var v=/[\-:]([a-z])/g;function P(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var r=n.replace(v,P);y[r]=new w(r,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var r=n.replace(v,P);y[r]=new w(r,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var r=n.replace(v,P);y[r]=new w(r,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){y[n]=new w(n,1,!1,n.toLowerCase(),null,!1,!1)}),y.xlinkHref=new w("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){y[n]=new w(n,1,!1,n.toLowerCase(),null,!0,!0)});function C(n,r,l,u){var p=y.hasOwnProperty(r)?y[r]:null;(p!==null?p.type!==0:u||!(2<r.length)||r[0]!=="o"&&r[0]!=="O"||r[1]!=="n"&&r[1]!=="N")&&(M(r,l,p,u)&&(l=null),u||p===null?_(r)&&(l===null?n.removeAttribute(r):n.setAttribute(r,""+l)):p.mustUseProperty?n[p.propertyName]=l===null?p.type===3?!1:"":l:(r=p.attributeName,u=p.attributeNamespace,l===null?n.removeAttribute(r):(p=p.type,l=p===3||p===4&&l===!0?"":""+l,u?n.setAttributeNS(u,r,l):n.setAttribute(r,l))))}var E=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,O=Symbol.for("react.element"),U=Symbol.for("react.portal"),F=Symbol.for("react.fragment"),V=Symbol.for("react.strict_mode"),b=Symbol.for("react.profiler"),R=Symbol.for("react.provider"),H=Symbol.for("react.context"),Y=Symbol.for("react.forward_ref"),ee=Symbol.for("react.suspense"),de=Symbol.for("react.suspense_list"),se=Symbol.for("react.memo"),te=Symbol.for("react.lazy"),le=Symbol.for("react.offscreen"),W=Symbol.iterator;function fe(n){return n===null||typeof n!="object"?null:(n=W&&n[W]||n["@@iterator"],typeof n=="function"?n:null)}var ce=Object.assign,B;function re(n){if(B===void 0)try{throw Error()}catch(l){var r=l.stack.trim().match(/\n( *(at )?)/);B=r&&r[1]||""}return`
`+B+n}var Be=!1;function Xe(n,r){if(!n||Be)return"";Be=!0;var l=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(r)if(r=function(){throw Error()},Object.defineProperty(r.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(r,[])}catch(ie){var u=ie}Reflect.construct(n,[],r)}else{try{r.call()}catch(ie){u=ie}n.call(r.prototype)}else{try{throw Error()}catch(ie){u=ie}n()}}catch(ie){if(ie&&u&&typeof ie.stack=="string"){for(var p=ie.stack.split(`
`),g=u.stack.split(`
`),T=p.length-1,k=g.length-1;1<=T&&0<=k&&p[T]!==g[k];)k--;for(;1<=T&&0<=k;T--,k--)if(p[T]!==g[k]){if(T!==1||k!==1)do if(T--,k--,0>k||p[T]!==g[k]){var G=`
`+p[T].replace(" at new "," at ");return n.displayName&&G.includes("<anonymous>")&&(G=G.replace("<anonymous>",n.displayName)),G}while(1<=T&&0<=k);break}}}finally{Be=!1,Error.prepareStackTrace=l}return(n=n?n.displayName||n.name:"")?re(n):""}function qe(n){switch(n.tag){case 5:return re(n.type);case 16:return re("Lazy");case 13:return re("Suspense");case 19:return re("SuspenseList");case 0:case 2:case 15:return n=Xe(n.type,!1),n;case 11:return n=Xe(n.type.render,!1),n;case 1:return n=Xe(n.type,!0),n;default:return""}}function ne(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case F:return"Fragment";case U:return"Portal";case b:return"Profiler";case V:return"StrictMode";case ee:return"Suspense";case de:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case H:return(n.displayName||"Context")+".Consumer";case R:return(n._context.displayName||"Context")+".Provider";case Y:var r=n.render;return n=n.displayName,n||(n=r.displayName||r.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case se:return r=n.displayName||null,r!==null?r:ne(n.type)||"Memo";case te:r=n._payload,n=n._init;try{return ne(n(r))}catch{}}return null}function pe(n){var r=n.type;switch(n.tag){case 24:return"Cache";case 9:return(r.displayName||"Context")+".Consumer";case 10:return(r._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=r.render,n=n.displayName||n.name||"",r.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return r;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ne(r);case 8:return r===V?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof r=="function")return r.displayName||r.name||null;if(typeof r=="string")return r}return null}function Te(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ue(n){var r=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(r==="checkbox"||r==="radio")}function Ve(n){var r=Ue(n)?"checked":"value",l=Object.getOwnPropertyDescriptor(n.constructor.prototype,r),u=""+n[r];if(!n.hasOwnProperty(r)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var p=l.get,g=l.set;return Object.defineProperty(n,r,{configurable:!0,get:function(){return p.call(this)},set:function(T){u=""+T,g.call(this,T)}}),Object.defineProperty(n,r,{enumerable:l.enumerable}),{getValue:function(){return u},setValue:function(T){u=""+T},stopTracking:function(){n._valueTracker=null,delete n[r]}}}}function _t(n){n._valueTracker||(n._valueTracker=Ve(n))}function Nt(n){if(!n)return!1;var r=n._valueTracker;if(!r)return!0;var l=r.getValue(),u="";return n&&(u=Ue(n)?n.checked?"true":"false":n.value),n=u,n!==l?(r.setValue(n),!0):!1}function z(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function ye(n,r){var l=r.checked;return ce({},r,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:l??n._wrapperState.initialChecked})}function ve(n,r){var l=r.defaultValue==null?"":r.defaultValue,u=r.checked!=null?r.checked:r.defaultChecked;l=Te(r.value!=null?r.value:l),n._wrapperState={initialChecked:u,initialValue:l,controlled:r.type==="checkbox"||r.type==="radio"?r.checked!=null:r.value!=null}}function ge(n,r){r=r.checked,r!=null&&C(n,"checked",r,!1)}function me(n,r){ge(n,r);var l=Te(r.value),u=r.type;if(l!=null)u==="number"?(l===0&&n.value===""||n.value!=l)&&(n.value=""+l):n.value!==""+l&&(n.value=""+l);else if(u==="submit"||u==="reset"){n.removeAttribute("value");return}r.hasOwnProperty("value")?Ee(n,r.type,l):r.hasOwnProperty("defaultValue")&&Ee(n,r.type,Te(r.defaultValue)),r.checked==null&&r.defaultChecked!=null&&(n.defaultChecked=!!r.defaultChecked)}function Ie(n,r,l){if(r.hasOwnProperty("value")||r.hasOwnProperty("defaultValue")){var u=r.type;if(!(u!=="submit"&&u!=="reset"||r.value!==void 0&&r.value!==null))return;r=""+n._wrapperState.initialValue,l||r===n.value||(n.value=r),n.defaultValue=r}l=n.name,l!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,l!==""&&(n.name=l)}function Ee(n,r,l){(r!=="number"||z(n.ownerDocument)!==n)&&(l==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+l&&(n.defaultValue=""+l))}var Ne=Array.isArray;function ut(n,r,l,u){if(n=n.options,r){r={};for(var p=0;p<l.length;p++)r["$"+l[p]]=!0;for(l=0;l<n.length;l++)p=r.hasOwnProperty("$"+n[l].value),n[l].selected!==p&&(n[l].selected=p),p&&u&&(n[l].defaultSelected=!0)}else{for(l=""+Te(l),r=null,p=0;p<n.length;p++){if(n[p].value===l){n[p].selected=!0,u&&(n[p].defaultSelected=!0);return}r!==null||n[p].disabled||(r=n[p])}r!==null&&(r.selected=!0)}}function ht(n,r){if(r.dangerouslySetInnerHTML!=null)throw Error(t(91));return ce({},r,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function I(n,r){var l=r.value;if(l==null){if(l=r.children,r=r.defaultValue,l!=null){if(r!=null)throw Error(t(92));if(Ne(l)){if(1<l.length)throw Error(t(93));l=l[0]}r=l}r==null&&(r=""),l=r}n._wrapperState={initialValue:Te(l)}}function A(n,r){var l=Te(r.value),u=Te(r.defaultValue);l!=null&&(l=""+l,l!==n.value&&(n.value=l),r.defaultValue==null&&n.defaultValue!==l&&(n.defaultValue=l)),u!=null&&(n.defaultValue=""+u)}function K(n){var r=n.textContent;r===n._wrapperState.initialValue&&r!==""&&r!==null&&(n.value=r)}function ue(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function xe(n,r){return n==null||n==="http://www.w3.org/1999/xhtml"?ue(r):n==="http://www.w3.org/2000/svg"&&r==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var he,Qe=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(r,l,u,p){MSApp.execUnsafeLocalFunction(function(){return n(r,l,u,p)})}:n})(function(n,r){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=r;else{for(he=he||document.createElement("div"),he.innerHTML="<svg>"+r.valueOf().toString()+"</svg>",r=he.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;r.firstChild;)n.appendChild(r.firstChild)}});function Pe(n,r){if(r){var l=n.firstChild;if(l&&l===n.lastChild&&l.nodeType===3){l.nodeValue=r;return}}n.textContent=r}var Ye={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},et=["Webkit","ms","Moz","O"];Object.keys(Ye).forEach(function(n){et.forEach(function(r){r=r+n.charAt(0).toUpperCase()+n.substring(1),Ye[r]=Ye[n]})});function Ae(n,r,l){return r==null||typeof r=="boolean"||r===""?"":l||typeof r!="number"||r===0||Ye.hasOwnProperty(n)&&Ye[n]?(""+r).trim():r+"px"}function He(n,r){n=n.style;for(var l in r)if(r.hasOwnProperty(l)){var u=l.indexOf("--")===0,p=Ae(l,r[l],u);l==="float"&&(l="cssFloat"),u?n.setProperty(l,p):n[l]=p}}var dt=ce({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function nt(n,r){if(r){if(dt[n]&&(r.children!=null||r.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(r.dangerouslySetInnerHTML!=null){if(r.children!=null)throw Error(t(60));if(typeof r.dangerouslySetInnerHTML!="object"||!("__html"in r.dangerouslySetInnerHTML))throw Error(t(61))}if(r.style!=null&&typeof r.style!="object")throw Error(t(62))}}function Oe(n,r){if(n.indexOf("-")===-1)return typeof r.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var vt=null;function j(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Re=null,De=null,Ge=null;function Ce(n){if(n=Do(n)){if(typeof Re!="function")throw Error(t(280));var r=n.stateNode;r&&(r=Ha(r),Re(n.stateNode,n.type,r))}}function _e(n){De?Ge?Ge.push(n):Ge=[n]:De=n}function Je(){if(De){var n=De,r=Ge;if(Ge=De=null,Ce(n),r)for(n=0;n<r.length;n++)Ce(r[n])}}function gt(n,r){return n(r)}function Dt(){}var At=!1;function Qn(n,r,l){if(At)return n(r,l);At=!0;try{return gt(n,r,l)}finally{At=!1,(De!==null||Ge!==null)&&(Dt(),Je())}}function vn(n,r){var l=n.stateNode;if(l===null)return null;var u=Ha(l);if(u===null)return null;l=u[r];e:switch(r){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(u=!u.disabled)||(n=n.type,u=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!u;break e;default:n=!1}if(n)return null;if(l&&typeof l!="function")throw Error(t(231,r,typeof l));return l}var fs=!1;if(d)try{var jn={};Object.defineProperty(jn,"passive",{get:function(){fs=!0}}),window.addEventListener("test",jn,jn),window.removeEventListener("test",jn,jn)}catch{fs=!1}function go(n,r,l,u,p,g,T,k,G){var ie=Array.prototype.slice.call(arguments,3);try{r.apply(l,ie)}catch(Me){this.onError(Me)}}var Qi=!1,Lr=null,Ii=!1,hs=null,ps={onError:function(n){Qi=!0,Lr=n}};function Sa(n,r,l,u,p,g,T,k,G){Qi=!1,Lr=null,go.apply(ps,arguments)}function Ma(n,r,l,u,p,g,T,k,G){if(Sa.apply(this,arguments),Qi){if(Qi){var ie=Lr;Qi=!1,Lr=null}else throw Error(t(198));Ii||(Ii=!0,hs=ie)}}function Ui(n){var r=n,l=n;if(n.alternate)for(;r.return;)r=r.return;else{n=r;do r=n,(r.flags&4098)!==0&&(l=r.return),n=r.return;while(n)}return r.tag===3?l:null}function Ea(n){if(n.tag===13){var r=n.memoizedState;if(r===null&&(n=n.alternate,n!==null&&(r=n.memoizedState)),r!==null)return r.dehydrated}return null}function wa(n){if(Ui(n)!==n)throw Error(t(188))}function Ec(n){var r=n.alternate;if(!r){if(r=Ui(n),r===null)throw Error(t(188));return r!==n?null:n}for(var l=n,u=r;;){var p=l.return;if(p===null)break;var g=p.alternate;if(g===null){if(u=p.return,u!==null){l=u;continue}break}if(p.child===g.child){for(g=p.child;g;){if(g===l)return wa(p),n;if(g===u)return wa(p),r;g=g.sibling}throw Error(t(188))}if(l.return!==u.return)l=p,u=g;else{for(var T=!1,k=p.child;k;){if(k===l){T=!0,l=p,u=g;break}if(k===u){T=!0,u=p,l=g;break}k=k.sibling}if(!T){for(k=g.child;k;){if(k===l){T=!0,l=g,u=p;break}if(k===u){T=!0,u=g,l=p;break}k=k.sibling}if(!T)throw Error(t(189))}}if(l.alternate!==u)throw Error(t(190))}if(l.tag!==3)throw Error(t(188));return l.stateNode.current===l?n:r}function Ta(n){return n=Ec(n),n!==null?Aa(n):null}function Aa(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var r=Aa(n);if(r!==null)return r;n=n.sibling}return null}var L=e.unstable_scheduleCallback,$=e.unstable_cancelCallback,oe=e.unstable_shouldYield,ae=e.unstable_requestPaint,q=e.unstable_now,be=e.unstable_getCurrentPriorityLevel,ke=e.unstable_ImmediatePriority,Ke=e.unstable_UserBlockingPriority,We=e.unstable_NormalPriority,ct=e.unstable_LowPriority,ft=e.unstable_IdlePriority,rt=null,pt=null;function Lt(n){if(pt&&typeof pt.onCommitFiberRoot=="function")try{pt.onCommitFiberRoot(rt,n,void 0,(n.current.flags&128)===128)}catch{}}var Ct=Math.clz32?Math.clz32:ot,kt=Math.log,It=Math.LN2;function ot(n){return n>>>=0,n===0?32:31-(kt(n)/It|0)|0}var Ut=64,Et=4194304;function nn(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function ai(n,r){var l=n.pendingLanes;if(l===0)return 0;var u=0,p=n.suspendedLanes,g=n.pingedLanes,T=l&268435455;if(T!==0){var k=T&~p;k!==0?u=nn(k):(g&=T,g!==0&&(u=nn(g)))}else T=l&~p,T!==0?u=nn(T):g!==0&&(u=nn(g));if(u===0)return 0;if(r!==0&&r!==u&&(r&p)===0&&(p=u&-u,g=r&-r,p>=g||p===16&&(g&4194240)!==0))return r;if((u&4)!==0&&(u|=l&16),r=n.entangledLanes,r!==0)for(n=n.entanglements,r&=u;0<r;)l=31-Ct(r),p=1<<l,u|=n[l],r&=~p;return u}function Cn(n,r){switch(n){case 1:case 2:case 4:return r+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return r+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Nr(n,r){for(var l=n.suspendedLanes,u=n.pingedLanes,p=n.expirationTimes,g=n.pendingLanes;0<g;){var T=31-Ct(g),k=1<<T,G=p[T];G===-1?((k&l)===0||(k&u)!==0)&&(p[T]=Cn(k,r)):G<=r&&(n.expiredLanes|=k),g&=~k}}function zt(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Rn(){var n=Ut;return Ut<<=1,(Ut&4194240)===0&&(Ut=64),n}function _n(n){for(var r=[],l=0;31>l;l++)r.push(n);return r}function Jt(n,r,l){n.pendingLanes|=r,r!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,r=31-Ct(r),n[r]=l}function xn(n,r){var l=n.pendingLanes&~r;n.pendingLanes=r,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=r,n.mutableReadLanes&=r,n.entangledLanes&=r,r=n.entanglements;var u=n.eventTimes;for(n=n.expirationTimes;0<l;){var p=31-Ct(l),g=1<<p;r[p]=0,u[p]=-1,n[p]=-1,l&=~g}}function Dr(n,r){var l=n.entangledLanes|=r;for(n=n.entanglements;l;){var u=31-Ct(l),p=1<<u;p&r|n[u]&r&&(n[u]|=r),l&=~p}}var wt=0;function ah(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var lh,wc,ch,uh,dh,Tc=!1,Ca=[],er=null,tr=null,nr=null,vo=new Map,_o=new Map,ir=[],Jg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function fh(n,r){switch(n){case"focusin":case"focusout":er=null;break;case"dragenter":case"dragleave":tr=null;break;case"mouseover":case"mouseout":nr=null;break;case"pointerover":case"pointerout":vo.delete(r.pointerId);break;case"gotpointercapture":case"lostpointercapture":_o.delete(r.pointerId)}}function xo(n,r,l,u,p,g){return n===null||n.nativeEvent!==g?(n={blockedOn:r,domEventName:l,eventSystemFlags:u,nativeEvent:g,targetContainers:[p]},r!==null&&(r=Do(r),r!==null&&wc(r)),n):(n.eventSystemFlags|=u,r=n.targetContainers,p!==null&&r.indexOf(p)===-1&&r.push(p),n)}function Qg(n,r,l,u,p){switch(r){case"focusin":return er=xo(er,n,r,l,u,p),!0;case"dragenter":return tr=xo(tr,n,r,l,u,p),!0;case"mouseover":return nr=xo(nr,n,r,l,u,p),!0;case"pointerover":var g=p.pointerId;return vo.set(g,xo(vo.get(g)||null,n,r,l,u,p)),!0;case"gotpointercapture":return g=p.pointerId,_o.set(g,xo(_o.get(g)||null,n,r,l,u,p)),!0}return!1}function hh(n){var r=Ir(n.target);if(r!==null){var l=Ui(r);if(l!==null){if(r=l.tag,r===13){if(r=Ea(l),r!==null){n.blockedOn=r,dh(n.priority,function(){ch(l)});return}}else if(r===3&&l.stateNode.current.memoizedState.isDehydrated){n.blockedOn=l.tag===3?l.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Ra(n){if(n.blockedOn!==null)return!1;for(var r=n.targetContainers;0<r.length;){var l=Cc(n.domEventName,n.eventSystemFlags,r[0],n.nativeEvent);if(l===null){l=n.nativeEvent;var u=new l.constructor(l.type,l);vt=u,l.target.dispatchEvent(u),vt=null}else return r=Do(l),r!==null&&wc(r),n.blockedOn=l,!1;r.shift()}return!0}function ph(n,r,l){Ra(n)&&l.delete(r)}function ev(){Tc=!1,er!==null&&Ra(er)&&(er=null),tr!==null&&Ra(tr)&&(tr=null),nr!==null&&Ra(nr)&&(nr=null),vo.forEach(ph),_o.forEach(ph)}function yo(n,r){n.blockedOn===r&&(n.blockedOn=null,Tc||(Tc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,ev)))}function So(n){function r(p){return yo(p,n)}if(0<Ca.length){yo(Ca[0],n);for(var l=1;l<Ca.length;l++){var u=Ca[l];u.blockedOn===n&&(u.blockedOn=null)}}for(er!==null&&yo(er,n),tr!==null&&yo(tr,n),nr!==null&&yo(nr,n),vo.forEach(r),_o.forEach(r),l=0;l<ir.length;l++)u=ir[l],u.blockedOn===n&&(u.blockedOn=null);for(;0<ir.length&&(l=ir[0],l.blockedOn===null);)hh(l),l.blockedOn===null&&ir.shift()}var ms=E.ReactCurrentBatchConfig,ba=!0;function tv(n,r,l,u){var p=wt,g=ms.transition;ms.transition=null;try{wt=1,Ac(n,r,l,u)}finally{wt=p,ms.transition=g}}function nv(n,r,l,u){var p=wt,g=ms.transition;ms.transition=null;try{wt=4,Ac(n,r,l,u)}finally{wt=p,ms.transition=g}}function Ac(n,r,l,u){if(ba){var p=Cc(n,r,l,u);if(p===null)Wc(n,r,u,Pa,l),fh(n,u);else if(Qg(p,n,r,l,u))u.stopPropagation();else if(fh(n,u),r&4&&-1<Jg.indexOf(n)){for(;p!==null;){var g=Do(p);if(g!==null&&lh(g),g=Cc(n,r,l,u),g===null&&Wc(n,r,u,Pa,l),g===p)break;p=g}p!==null&&u.stopPropagation()}else Wc(n,r,u,null,l)}}var Pa=null;function Cc(n,r,l,u){if(Pa=null,n=j(u),n=Ir(n),n!==null)if(r=Ui(n),r===null)n=null;else if(l=r.tag,l===13){if(n=Ea(r),n!==null)return n;n=null}else if(l===3){if(r.stateNode.current.memoizedState.isDehydrated)return r.tag===3?r.stateNode.containerInfo:null;n=null}else r!==n&&(n=null);return Pa=n,null}function mh(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(be()){case ke:return 1;case Ke:return 4;case We:case ct:return 16;case ft:return 536870912;default:return 16}default:return 16}}var rr=null,Rc=null,La=null;function gh(){if(La)return La;var n,r=Rc,l=r.length,u,p="value"in rr?rr.value:rr.textContent,g=p.length;for(n=0;n<l&&r[n]===p[n];n++);var T=l-n;for(u=1;u<=T&&r[l-u]===p[g-u];u++);return La=p.slice(n,1<u?1-u:void 0)}function Na(n){var r=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&r===13&&(n=13)):n=r,n===10&&(n=13),32<=n||n===13?n:0}function Da(){return!0}function vh(){return!1}function Xn(n){function r(l,u,p,g,T){this._reactName=l,this._targetInst=p,this.type=u,this.nativeEvent=g,this.target=T,this.currentTarget=null;for(var k in n)n.hasOwnProperty(k)&&(l=n[k],this[k]=l?l(g):g[k]);return this.isDefaultPrevented=(g.defaultPrevented!=null?g.defaultPrevented:g.returnValue===!1)?Da:vh,this.isPropagationStopped=vh,this}return ce(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var l=this.nativeEvent;l&&(l.preventDefault?l.preventDefault():typeof l.returnValue!="unknown"&&(l.returnValue=!1),this.isDefaultPrevented=Da)},stopPropagation:function(){var l=this.nativeEvent;l&&(l.stopPropagation?l.stopPropagation():typeof l.cancelBubble!="unknown"&&(l.cancelBubble=!0),this.isPropagationStopped=Da)},persist:function(){},isPersistent:Da}),r}var gs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},bc=Xn(gs),Mo=ce({},gs,{view:0,detail:0}),iv=Xn(Mo),Pc,Lc,Eo,Ia=ce({},Mo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Dc,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Eo&&(Eo&&n.type==="mousemove"?(Pc=n.screenX-Eo.screenX,Lc=n.screenY-Eo.screenY):Lc=Pc=0,Eo=n),Pc)},movementY:function(n){return"movementY"in n?n.movementY:Lc}}),_h=Xn(Ia),rv=ce({},Ia,{dataTransfer:0}),sv=Xn(rv),ov=ce({},Mo,{relatedTarget:0}),Nc=Xn(ov),av=ce({},gs,{animationName:0,elapsedTime:0,pseudoElement:0}),lv=Xn(av),cv=ce({},gs,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),uv=Xn(cv),dv=ce({},gs,{data:0}),xh=Xn(dv),fv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},hv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},pv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function mv(n){var r=this.nativeEvent;return r.getModifierState?r.getModifierState(n):(n=pv[n])?!!r[n]:!1}function Dc(){return mv}var gv=ce({},Mo,{key:function(n){if(n.key){var r=fv[n.key]||n.key;if(r!=="Unidentified")return r}return n.type==="keypress"?(n=Na(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?hv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Dc,charCode:function(n){return n.type==="keypress"?Na(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Na(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),vv=Xn(gv),_v=ce({},Ia,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),yh=Xn(_v),xv=ce({},Mo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Dc}),yv=Xn(xv),Sv=ce({},gs,{propertyName:0,elapsedTime:0,pseudoElement:0}),Mv=Xn(Sv),Ev=ce({},Ia,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),wv=Xn(Ev),Tv=[9,13,27,32],Ic=d&&"CompositionEvent"in window,wo=null;d&&"documentMode"in document&&(wo=document.documentMode);var Av=d&&"TextEvent"in window&&!wo,Sh=d&&(!Ic||wo&&8<wo&&11>=wo),Mh=" ",Eh=!1;function wh(n,r){switch(n){case"keyup":return Tv.indexOf(r.keyCode)!==-1;case"keydown":return r.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Th(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var vs=!1;function Cv(n,r){switch(n){case"compositionend":return Th(r);case"keypress":return r.which!==32?null:(Eh=!0,Mh);case"textInput":return n=r.data,n===Mh&&Eh?null:n;default:return null}}function Rv(n,r){if(vs)return n==="compositionend"||!Ic&&wh(n,r)?(n=gh(),La=Rc=rr=null,vs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(r.ctrlKey||r.altKey||r.metaKey)||r.ctrlKey&&r.altKey){if(r.char&&1<r.char.length)return r.char;if(r.which)return String.fromCharCode(r.which)}return null;case"compositionend":return Sh&&r.locale!=="ko"?null:r.data;default:return null}}var bv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ah(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r==="input"?!!bv[n.type]:r==="textarea"}function Ch(n,r,l,u){_e(u),r=za(r,"onChange"),0<r.length&&(l=new bc("onChange","change",null,l,u),n.push({event:l,listeners:r}))}var To=null,Ao=null;function Pv(n){jh(n,0)}function Ua(n){var r=Ms(n);if(Nt(r))return n}function Lv(n,r){if(n==="change")return r}var Rh=!1;if(d){var Uc;if(d){var Fc="oninput"in document;if(!Fc){var bh=document.createElement("div");bh.setAttribute("oninput","return;"),Fc=typeof bh.oninput=="function"}Uc=Fc}else Uc=!1;Rh=Uc&&(!document.documentMode||9<document.documentMode)}function Ph(){To&&(To.detachEvent("onpropertychange",Lh),Ao=To=null)}function Lh(n){if(n.propertyName==="value"&&Ua(Ao)){var r=[];Ch(r,Ao,n,j(n)),Qn(Pv,r)}}function Nv(n,r,l){n==="focusin"?(Ph(),To=r,Ao=l,To.attachEvent("onpropertychange",Lh)):n==="focusout"&&Ph()}function Dv(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Ua(Ao)}function Iv(n,r){if(n==="click")return Ua(r)}function Uv(n,r){if(n==="input"||n==="change")return Ua(r)}function Fv(n,r){return n===r&&(n!==0||1/n===1/r)||n!==n&&r!==r}var li=typeof Object.is=="function"?Object.is:Fv;function Co(n,r){if(li(n,r))return!0;if(typeof n!="object"||n===null||typeof r!="object"||r===null)return!1;var l=Object.keys(n),u=Object.keys(r);if(l.length!==u.length)return!1;for(u=0;u<l.length;u++){var p=l[u];if(!f.call(r,p)||!li(n[p],r[p]))return!1}return!0}function Nh(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Dh(n,r){var l=Nh(n);n=0;for(var u;l;){if(l.nodeType===3){if(u=n+l.textContent.length,n<=r&&u>=r)return{node:l,offset:r-n};n=u}e:{for(;l;){if(l.nextSibling){l=l.nextSibling;break e}l=l.parentNode}l=void 0}l=Nh(l)}}function Ih(n,r){return n&&r?n===r?!0:n&&n.nodeType===3?!1:r&&r.nodeType===3?Ih(n,r.parentNode):"contains"in n?n.contains(r):n.compareDocumentPosition?!!(n.compareDocumentPosition(r)&16):!1:!1}function Uh(){for(var n=window,r=z();r instanceof n.HTMLIFrameElement;){try{var l=typeof r.contentWindow.location.href=="string"}catch{l=!1}if(l)n=r.contentWindow;else break;r=z(n.document)}return r}function Oc(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r&&(r==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||r==="textarea"||n.contentEditable==="true")}function Ov(n){var r=Uh(),l=n.focusedElem,u=n.selectionRange;if(r!==l&&l&&l.ownerDocument&&Ih(l.ownerDocument.documentElement,l)){if(u!==null&&Oc(l)){if(r=u.start,n=u.end,n===void 0&&(n=r),"selectionStart"in l)l.selectionStart=r,l.selectionEnd=Math.min(n,l.value.length);else if(n=(r=l.ownerDocument||document)&&r.defaultView||window,n.getSelection){n=n.getSelection();var p=l.textContent.length,g=Math.min(u.start,p);u=u.end===void 0?g:Math.min(u.end,p),!n.extend&&g>u&&(p=u,u=g,g=p),p=Dh(l,g);var T=Dh(l,u);p&&T&&(n.rangeCount!==1||n.anchorNode!==p.node||n.anchorOffset!==p.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(r=r.createRange(),r.setStart(p.node,p.offset),n.removeAllRanges(),g>u?(n.addRange(r),n.extend(T.node,T.offset)):(r.setEnd(T.node,T.offset),n.addRange(r)))}}for(r=[],n=l;n=n.parentNode;)n.nodeType===1&&r.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof l.focus=="function"&&l.focus(),l=0;l<r.length;l++)n=r[l],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var kv=d&&"documentMode"in document&&11>=document.documentMode,_s=null,kc=null,Ro=null,zc=!1;function Fh(n,r,l){var u=l.window===l?l.document:l.nodeType===9?l:l.ownerDocument;zc||_s==null||_s!==z(u)||(u=_s,"selectionStart"in u&&Oc(u)?u={start:u.selectionStart,end:u.selectionEnd}:(u=(u.ownerDocument&&u.ownerDocument.defaultView||window).getSelection(),u={anchorNode:u.anchorNode,anchorOffset:u.anchorOffset,focusNode:u.focusNode,focusOffset:u.focusOffset}),Ro&&Co(Ro,u)||(Ro=u,u=za(kc,"onSelect"),0<u.length&&(r=new bc("onSelect","select",null,r,l),n.push({event:r,listeners:u}),r.target=_s)))}function Fa(n,r){var l={};return l[n.toLowerCase()]=r.toLowerCase(),l["Webkit"+n]="webkit"+r,l["Moz"+n]="moz"+r,l}var xs={animationend:Fa("Animation","AnimationEnd"),animationiteration:Fa("Animation","AnimationIteration"),animationstart:Fa("Animation","AnimationStart"),transitionend:Fa("Transition","TransitionEnd")},Bc={},Oh={};d&&(Oh=document.createElement("div").style,"AnimationEvent"in window||(delete xs.animationend.animation,delete xs.animationiteration.animation,delete xs.animationstart.animation),"TransitionEvent"in window||delete xs.transitionend.transition);function Oa(n){if(Bc[n])return Bc[n];if(!xs[n])return n;var r=xs[n],l;for(l in r)if(r.hasOwnProperty(l)&&l in Oh)return Bc[n]=r[l];return n}var kh=Oa("animationend"),zh=Oa("animationiteration"),Bh=Oa("animationstart"),Vh=Oa("transitionend"),Hh=new Map,Gh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function sr(n,r){Hh.set(n,r),a(r,[n])}for(var Vc=0;Vc<Gh.length;Vc++){var Hc=Gh[Vc],zv=Hc.toLowerCase(),Bv=Hc[0].toUpperCase()+Hc.slice(1);sr(zv,"on"+Bv)}sr(kh,"onAnimationEnd"),sr(zh,"onAnimationIteration"),sr(Bh,"onAnimationStart"),sr("dblclick","onDoubleClick"),sr("focusin","onFocus"),sr("focusout","onBlur"),sr(Vh,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),a("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),a("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),a("onBeforeInput",["compositionend","keypress","textInput","paste"]),a("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),a("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),a("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var bo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Vv=new Set("cancel close invalid load scroll toggle".split(" ").concat(bo));function Wh(n,r,l){var u=n.type||"unknown-event";n.currentTarget=l,Ma(u,r,void 0,n),n.currentTarget=null}function jh(n,r){r=(r&4)!==0;for(var l=0;l<n.length;l++){var u=n[l],p=u.event;u=u.listeners;e:{var g=void 0;if(r)for(var T=u.length-1;0<=T;T--){var k=u[T],G=k.instance,ie=k.currentTarget;if(k=k.listener,G!==g&&p.isPropagationStopped())break e;Wh(p,k,ie),g=G}else for(T=0;T<u.length;T++){if(k=u[T],G=k.instance,ie=k.currentTarget,k=k.listener,G!==g&&p.isPropagationStopped())break e;Wh(p,k,ie),g=G}}}if(Ii)throw n=hs,Ii=!1,hs=null,n}function Vt(n,r){var l=r[Kc];l===void 0&&(l=r[Kc]=new Set);var u=n+"__bubble";l.has(u)||(Xh(r,n,2,!1),l.add(u))}function Gc(n,r,l){var u=0;r&&(u|=4),Xh(l,n,u,r)}var ka="_reactListening"+Math.random().toString(36).slice(2);function Po(n){if(!n[ka]){n[ka]=!0,i.forEach(function(l){l!=="selectionchange"&&(Vv.has(l)||Gc(l,!1,n),Gc(l,!0,n))});var r=n.nodeType===9?n:n.ownerDocument;r===null||r[ka]||(r[ka]=!0,Gc("selectionchange",!1,r))}}function Xh(n,r,l,u){switch(mh(r)){case 1:var p=tv;break;case 4:p=nv;break;default:p=Ac}l=p.bind(null,r,l,n),p=void 0,!fs||r!=="touchstart"&&r!=="touchmove"&&r!=="wheel"||(p=!0),u?p!==void 0?n.addEventListener(r,l,{capture:!0,passive:p}):n.addEventListener(r,l,!0):p!==void 0?n.addEventListener(r,l,{passive:p}):n.addEventListener(r,l,!1)}function Wc(n,r,l,u,p){var g=u;if((r&1)===0&&(r&2)===0&&u!==null)e:for(;;){if(u===null)return;var T=u.tag;if(T===3||T===4){var k=u.stateNode.containerInfo;if(k===p||k.nodeType===8&&k.parentNode===p)break;if(T===4)for(T=u.return;T!==null;){var G=T.tag;if((G===3||G===4)&&(G=T.stateNode.containerInfo,G===p||G.nodeType===8&&G.parentNode===p))return;T=T.return}for(;k!==null;){if(T=Ir(k),T===null)return;if(G=T.tag,G===5||G===6){u=g=T;continue e}k=k.parentNode}}u=u.return}Qn(function(){var ie=g,Me=j(l),we=[];e:{var Se=Hh.get(n);if(Se!==void 0){var je=bc,Ze=n;switch(n){case"keypress":if(Na(l)===0)break e;case"keydown":case"keyup":je=vv;break;case"focusin":Ze="focus",je=Nc;break;case"focusout":Ze="blur",je=Nc;break;case"beforeblur":case"afterblur":je=Nc;break;case"click":if(l.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":je=_h;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":je=sv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":je=yv;break;case kh:case zh:case Bh:je=lv;break;case Vh:je=Mv;break;case"scroll":je=iv;break;case"wheel":je=wv;break;case"copy":case"cut":case"paste":je=uv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":je=yh}var tt=(r&4)!==0,Qt=!tt&&n==="scroll",Z=tt?Se!==null?Se+"Capture":null:Se;tt=[];for(var X=ie,Q;X!==null;){Q=X;var Le=Q.stateNode;if(Q.tag===5&&Le!==null&&(Q=Le,Z!==null&&(Le=vn(X,Z),Le!=null&&tt.push(Lo(X,Le,Q)))),Qt)break;X=X.return}0<tt.length&&(Se=new je(Se,Ze,null,l,Me),we.push({event:Se,listeners:tt}))}}if((r&7)===0){e:{if(Se=n==="mouseover"||n==="pointerover",je=n==="mouseout"||n==="pointerout",Se&&l!==vt&&(Ze=l.relatedTarget||l.fromElement)&&(Ir(Ze)||Ze[Fi]))break e;if((je||Se)&&(Se=Me.window===Me?Me:(Se=Me.ownerDocument)?Se.defaultView||Se.parentWindow:window,je?(Ze=l.relatedTarget||l.toElement,je=ie,Ze=Ze?Ir(Ze):null,Ze!==null&&(Qt=Ui(Ze),Ze!==Qt||Ze.tag!==5&&Ze.tag!==6)&&(Ze=null)):(je=null,Ze=ie),je!==Ze)){if(tt=_h,Le="onMouseLeave",Z="onMouseEnter",X="mouse",(n==="pointerout"||n==="pointerover")&&(tt=yh,Le="onPointerLeave",Z="onPointerEnter",X="pointer"),Qt=je==null?Se:Ms(je),Q=Ze==null?Se:Ms(Ze),Se=new tt(Le,X+"leave",je,l,Me),Se.target=Qt,Se.relatedTarget=Q,Le=null,Ir(Me)===ie&&(tt=new tt(Z,X+"enter",Ze,l,Me),tt.target=Q,tt.relatedTarget=Qt,Le=tt),Qt=Le,je&&Ze)t:{for(tt=je,Z=Ze,X=0,Q=tt;Q;Q=ys(Q))X++;for(Q=0,Le=Z;Le;Le=ys(Le))Q++;for(;0<X-Q;)tt=ys(tt),X--;for(;0<Q-X;)Z=ys(Z),Q--;for(;X--;){if(tt===Z||Z!==null&&tt===Z.alternate)break t;tt=ys(tt),Z=ys(Z)}tt=null}else tt=null;je!==null&&qh(we,Se,je,tt,!1),Ze!==null&&Qt!==null&&qh(we,Qt,Ze,tt,!0)}}e:{if(Se=ie?Ms(ie):window,je=Se.nodeName&&Se.nodeName.toLowerCase(),je==="select"||je==="input"&&Se.type==="file")var it=Lv;else if(Ah(Se))if(Rh)it=Uv;else{it=Dv;var at=Nv}else(je=Se.nodeName)&&je.toLowerCase()==="input"&&(Se.type==="checkbox"||Se.type==="radio")&&(it=Iv);if(it&&(it=it(n,ie))){Ch(we,it,l,Me);break e}at&&at(n,Se,ie),n==="focusout"&&(at=Se._wrapperState)&&at.controlled&&Se.type==="number"&&Ee(Se,"number",Se.value)}switch(at=ie?Ms(ie):window,n){case"focusin":(Ah(at)||at.contentEditable==="true")&&(_s=at,kc=ie,Ro=null);break;case"focusout":Ro=kc=_s=null;break;case"mousedown":zc=!0;break;case"contextmenu":case"mouseup":case"dragend":zc=!1,Fh(we,l,Me);break;case"selectionchange":if(kv)break;case"keydown":case"keyup":Fh(we,l,Me)}var lt;if(Ic)e:{switch(n){case"compositionstart":var mt="onCompositionStart";break e;case"compositionend":mt="onCompositionEnd";break e;case"compositionupdate":mt="onCompositionUpdate";break e}mt=void 0}else vs?wh(n,l)&&(mt="onCompositionEnd"):n==="keydown"&&l.keyCode===229&&(mt="onCompositionStart");mt&&(Sh&&l.locale!=="ko"&&(vs||mt!=="onCompositionStart"?mt==="onCompositionEnd"&&vs&&(lt=gh()):(rr=Me,Rc="value"in rr?rr.value:rr.textContent,vs=!0)),at=za(ie,mt),0<at.length&&(mt=new xh(mt,n,null,l,Me),we.push({event:mt,listeners:at}),lt?mt.data=lt:(lt=Th(l),lt!==null&&(mt.data=lt)))),(lt=Av?Cv(n,l):Rv(n,l))&&(ie=za(ie,"onBeforeInput"),0<ie.length&&(Me=new xh("onBeforeInput","beforeinput",null,l,Me),we.push({event:Me,listeners:ie}),Me.data=lt))}jh(we,r)})}function Lo(n,r,l){return{instance:n,listener:r,currentTarget:l}}function za(n,r){for(var l=r+"Capture",u=[];n!==null;){var p=n,g=p.stateNode;p.tag===5&&g!==null&&(p=g,g=vn(n,l),g!=null&&u.unshift(Lo(n,g,p)),g=vn(n,r),g!=null&&u.push(Lo(n,g,p))),n=n.return}return u}function ys(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function qh(n,r,l,u,p){for(var g=r._reactName,T=[];l!==null&&l!==u;){var k=l,G=k.alternate,ie=k.stateNode;if(G!==null&&G===u)break;k.tag===5&&ie!==null&&(k=ie,p?(G=vn(l,g),G!=null&&T.unshift(Lo(l,G,k))):p||(G=vn(l,g),G!=null&&T.push(Lo(l,G,k)))),l=l.return}T.length!==0&&n.push({event:r,listeners:T})}var Hv=/\r\n?/g,Gv=/\u0000|\uFFFD/g;function Yh(n){return(typeof n=="string"?n:""+n).replace(Hv,`
`).replace(Gv,"")}function Ba(n,r,l){if(r=Yh(r),Yh(n)!==r&&l)throw Error(t(425))}function Va(){}var jc=null,Xc=null;function qc(n,r){return n==="textarea"||n==="noscript"||typeof r.children=="string"||typeof r.children=="number"||typeof r.dangerouslySetInnerHTML=="object"&&r.dangerouslySetInnerHTML!==null&&r.dangerouslySetInnerHTML.__html!=null}var Yc=typeof setTimeout=="function"?setTimeout:void 0,Wv=typeof clearTimeout=="function"?clearTimeout:void 0,$h=typeof Promise=="function"?Promise:void 0,jv=typeof queueMicrotask=="function"?queueMicrotask:typeof $h<"u"?function(n){return $h.resolve(null).then(n).catch(Xv)}:Yc;function Xv(n){setTimeout(function(){throw n})}function $c(n,r){var l=r,u=0;do{var p=l.nextSibling;if(n.removeChild(l),p&&p.nodeType===8)if(l=p.data,l==="/$"){if(u===0){n.removeChild(p),So(r);return}u--}else l!=="$"&&l!=="$?"&&l!=="$!"||u++;l=p}while(l);So(r)}function or(n){for(;n!=null;n=n.nextSibling){var r=n.nodeType;if(r===1||r===3)break;if(r===8){if(r=n.data,r==="$"||r==="$!"||r==="$?")break;if(r==="/$")return null}}return n}function Kh(n){n=n.previousSibling;for(var r=0;n;){if(n.nodeType===8){var l=n.data;if(l==="$"||l==="$!"||l==="$?"){if(r===0)return n;r--}else l==="/$"&&r++}n=n.previousSibling}return null}var Ss=Math.random().toString(36).slice(2),Si="__reactFiber$"+Ss,No="__reactProps$"+Ss,Fi="__reactContainer$"+Ss,Kc="__reactEvents$"+Ss,qv="__reactListeners$"+Ss,Yv="__reactHandles$"+Ss;function Ir(n){var r=n[Si];if(r)return r;for(var l=n.parentNode;l;){if(r=l[Fi]||l[Si]){if(l=r.alternate,r.child!==null||l!==null&&l.child!==null)for(n=Kh(n);n!==null;){if(l=n[Si])return l;n=Kh(n)}return r}n=l,l=n.parentNode}return null}function Do(n){return n=n[Si]||n[Fi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Ms(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Ha(n){return n[No]||null}var Zc=[],Es=-1;function ar(n){return{current:n}}function Ht(n){0>Es||(n.current=Zc[Es],Zc[Es]=null,Es--)}function Bt(n,r){Es++,Zc[Es]=n.current,n.current=r}var lr={},yn=ar(lr),In=ar(!1),Ur=lr;function ws(n,r){var l=n.type.contextTypes;if(!l)return lr;var u=n.stateNode;if(u&&u.__reactInternalMemoizedUnmaskedChildContext===r)return u.__reactInternalMemoizedMaskedChildContext;var p={},g;for(g in l)p[g]=r[g];return u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=p),p}function Un(n){return n=n.childContextTypes,n!=null}function Ga(){Ht(In),Ht(yn)}function Zh(n,r,l){if(yn.current!==lr)throw Error(t(168));Bt(yn,r),Bt(In,l)}function Jh(n,r,l){var u=n.stateNode;if(r=r.childContextTypes,typeof u.getChildContext!="function")return l;u=u.getChildContext();for(var p in u)if(!(p in r))throw Error(t(108,pe(n)||"Unknown",p));return ce({},l,u)}function Wa(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||lr,Ur=yn.current,Bt(yn,n),Bt(In,In.current),!0}function Qh(n,r,l){var u=n.stateNode;if(!u)throw Error(t(169));l?(n=Jh(n,r,Ur),u.__reactInternalMemoizedMergedChildContext=n,Ht(In),Ht(yn),Bt(yn,n)):Ht(In),Bt(In,l)}var Oi=null,ja=!1,Jc=!1;function ep(n){Oi===null?Oi=[n]:Oi.push(n)}function $v(n){ja=!0,ep(n)}function cr(){if(!Jc&&Oi!==null){Jc=!0;var n=0,r=wt;try{var l=Oi;for(wt=1;n<l.length;n++){var u=l[n];do u=u(!0);while(u!==null)}Oi=null,ja=!1}catch(p){throw Oi!==null&&(Oi=Oi.slice(n+1)),L(ke,cr),p}finally{wt=r,Jc=!1}}return null}var Ts=[],As=0,Xa=null,qa=0,ei=[],ti=0,Fr=null,ki=1,zi="";function Or(n,r){Ts[As++]=qa,Ts[As++]=Xa,Xa=n,qa=r}function tp(n,r,l){ei[ti++]=ki,ei[ti++]=zi,ei[ti++]=Fr,Fr=n;var u=ki;n=zi;var p=32-Ct(u)-1;u&=~(1<<p),l+=1;var g=32-Ct(r)+p;if(30<g){var T=p-p%5;g=(u&(1<<T)-1).toString(32),u>>=T,p-=T,ki=1<<32-Ct(r)+p|l<<p|u,zi=g+n}else ki=1<<g|l<<p|u,zi=n}function Qc(n){n.return!==null&&(Or(n,1),tp(n,1,0))}function eu(n){for(;n===Xa;)Xa=Ts[--As],Ts[As]=null,qa=Ts[--As],Ts[As]=null;for(;n===Fr;)Fr=ei[--ti],ei[ti]=null,zi=ei[--ti],ei[ti]=null,ki=ei[--ti],ei[ti]=null}var qn=null,Yn=null,Wt=!1,ci=null;function np(n,r){var l=si(5,null,null,0);l.elementType="DELETED",l.stateNode=r,l.return=n,r=n.deletions,r===null?(n.deletions=[l],n.flags|=16):r.push(l)}function ip(n,r){switch(n.tag){case 5:var l=n.type;return r=r.nodeType!==1||l.toLowerCase()!==r.nodeName.toLowerCase()?null:r,r!==null?(n.stateNode=r,qn=n,Yn=or(r.firstChild),!0):!1;case 6:return r=n.pendingProps===""||r.nodeType!==3?null:r,r!==null?(n.stateNode=r,qn=n,Yn=null,!0):!1;case 13:return r=r.nodeType!==8?null:r,r!==null?(l=Fr!==null?{id:ki,overflow:zi}:null,n.memoizedState={dehydrated:r,treeContext:l,retryLane:1073741824},l=si(18,null,null,0),l.stateNode=r,l.return=n,n.child=l,qn=n,Yn=null,!0):!1;default:return!1}}function tu(n){return(n.mode&1)!==0&&(n.flags&128)===0}function nu(n){if(Wt){var r=Yn;if(r){var l=r;if(!ip(n,r)){if(tu(n))throw Error(t(418));r=or(l.nextSibling);var u=qn;r&&ip(n,r)?np(u,l):(n.flags=n.flags&-4097|2,Wt=!1,qn=n)}}else{if(tu(n))throw Error(t(418));n.flags=n.flags&-4097|2,Wt=!1,qn=n}}}function rp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;qn=n}function Ya(n){if(n!==qn)return!1;if(!Wt)return rp(n),Wt=!0,!1;var r;if((r=n.tag!==3)&&!(r=n.tag!==5)&&(r=n.type,r=r!=="head"&&r!=="body"&&!qc(n.type,n.memoizedProps)),r&&(r=Yn)){if(tu(n))throw sp(),Error(t(418));for(;r;)np(n,r),r=or(r.nextSibling)}if(rp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,r=0;n;){if(n.nodeType===8){var l=n.data;if(l==="/$"){if(r===0){Yn=or(n.nextSibling);break e}r--}else l!=="$"&&l!=="$!"&&l!=="$?"||r++}n=n.nextSibling}Yn=null}}else Yn=qn?or(n.stateNode.nextSibling):null;return!0}function sp(){for(var n=Yn;n;)n=or(n.nextSibling)}function Cs(){Yn=qn=null,Wt=!1}function iu(n){ci===null?ci=[n]:ci.push(n)}var Kv=E.ReactCurrentBatchConfig;function Io(n,r,l){if(n=l.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(l._owner){if(l=l._owner,l){if(l.tag!==1)throw Error(t(309));var u=l.stateNode}if(!u)throw Error(t(147,n));var p=u,g=""+n;return r!==null&&r.ref!==null&&typeof r.ref=="function"&&r.ref._stringRef===g?r.ref:(r=function(T){var k=p.refs;T===null?delete k[g]:k[g]=T},r._stringRef=g,r)}if(typeof n!="string")throw Error(t(284));if(!l._owner)throw Error(t(290,n))}return n}function $a(n,r){throw n=Object.prototype.toString.call(r),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(r).join(", ")+"}":n))}function op(n){var r=n._init;return r(n._payload)}function ap(n){function r(Z,X){if(n){var Q=Z.deletions;Q===null?(Z.deletions=[X],Z.flags|=16):Q.push(X)}}function l(Z,X){if(!n)return null;for(;X!==null;)r(Z,X),X=X.sibling;return null}function u(Z,X){for(Z=new Map;X!==null;)X.key!==null?Z.set(X.key,X):Z.set(X.index,X),X=X.sibling;return Z}function p(Z,X){return Z=vr(Z,X),Z.index=0,Z.sibling=null,Z}function g(Z,X,Q){return Z.index=Q,n?(Q=Z.alternate,Q!==null?(Q=Q.index,Q<X?(Z.flags|=2,X):Q):(Z.flags|=2,X)):(Z.flags|=1048576,X)}function T(Z){return n&&Z.alternate===null&&(Z.flags|=2),Z}function k(Z,X,Q,Le){return X===null||X.tag!==6?(X=Yu(Q,Z.mode,Le),X.return=Z,X):(X=p(X,Q),X.return=Z,X)}function G(Z,X,Q,Le){var it=Q.type;return it===F?Me(Z,X,Q.props.children,Le,Q.key):X!==null&&(X.elementType===it||typeof it=="object"&&it!==null&&it.$$typeof===te&&op(it)===X.type)?(Le=p(X,Q.props),Le.ref=Io(Z,X,Q),Le.return=Z,Le):(Le=xl(Q.type,Q.key,Q.props,null,Z.mode,Le),Le.ref=Io(Z,X,Q),Le.return=Z,Le)}function ie(Z,X,Q,Le){return X===null||X.tag!==4||X.stateNode.containerInfo!==Q.containerInfo||X.stateNode.implementation!==Q.implementation?(X=$u(Q,Z.mode,Le),X.return=Z,X):(X=p(X,Q.children||[]),X.return=Z,X)}function Me(Z,X,Q,Le,it){return X===null||X.tag!==7?(X=jr(Q,Z.mode,Le,it),X.return=Z,X):(X=p(X,Q),X.return=Z,X)}function we(Z,X,Q){if(typeof X=="string"&&X!==""||typeof X=="number")return X=Yu(""+X,Z.mode,Q),X.return=Z,X;if(typeof X=="object"&&X!==null){switch(X.$$typeof){case O:return Q=xl(X.type,X.key,X.props,null,Z.mode,Q),Q.ref=Io(Z,null,X),Q.return=Z,Q;case U:return X=$u(X,Z.mode,Q),X.return=Z,X;case te:var Le=X._init;return we(Z,Le(X._payload),Q)}if(Ne(X)||fe(X))return X=jr(X,Z.mode,Q,null),X.return=Z,X;$a(Z,X)}return null}function Se(Z,X,Q,Le){var it=X!==null?X.key:null;if(typeof Q=="string"&&Q!==""||typeof Q=="number")return it!==null?null:k(Z,X,""+Q,Le);if(typeof Q=="object"&&Q!==null){switch(Q.$$typeof){case O:return Q.key===it?G(Z,X,Q,Le):null;case U:return Q.key===it?ie(Z,X,Q,Le):null;case te:return it=Q._init,Se(Z,X,it(Q._payload),Le)}if(Ne(Q)||fe(Q))return it!==null?null:Me(Z,X,Q,Le,null);$a(Z,Q)}return null}function je(Z,X,Q,Le,it){if(typeof Le=="string"&&Le!==""||typeof Le=="number")return Z=Z.get(Q)||null,k(X,Z,""+Le,it);if(typeof Le=="object"&&Le!==null){switch(Le.$$typeof){case O:return Z=Z.get(Le.key===null?Q:Le.key)||null,G(X,Z,Le,it);case U:return Z=Z.get(Le.key===null?Q:Le.key)||null,ie(X,Z,Le,it);case te:var at=Le._init;return je(Z,X,Q,at(Le._payload),it)}if(Ne(Le)||fe(Le))return Z=Z.get(Q)||null,Me(X,Z,Le,it,null);$a(X,Le)}return null}function Ze(Z,X,Q,Le){for(var it=null,at=null,lt=X,mt=X=0,un=null;lt!==null&&mt<Q.length;mt++){lt.index>mt?(un=lt,lt=null):un=lt.sibling;var bt=Se(Z,lt,Q[mt],Le);if(bt===null){lt===null&&(lt=un);break}n&&lt&&bt.alternate===null&&r(Z,lt),X=g(bt,X,mt),at===null?it=bt:at.sibling=bt,at=bt,lt=un}if(mt===Q.length)return l(Z,lt),Wt&&Or(Z,mt),it;if(lt===null){for(;mt<Q.length;mt++)lt=we(Z,Q[mt],Le),lt!==null&&(X=g(lt,X,mt),at===null?it=lt:at.sibling=lt,at=lt);return Wt&&Or(Z,mt),it}for(lt=u(Z,lt);mt<Q.length;mt++)un=je(lt,Z,mt,Q[mt],Le),un!==null&&(n&&un.alternate!==null&&lt.delete(un.key===null?mt:un.key),X=g(un,X,mt),at===null?it=un:at.sibling=un,at=un);return n&&lt.forEach(function(_r){return r(Z,_r)}),Wt&&Or(Z,mt),it}function tt(Z,X,Q,Le){var it=fe(Q);if(typeof it!="function")throw Error(t(150));if(Q=it.call(Q),Q==null)throw Error(t(151));for(var at=it=null,lt=X,mt=X=0,un=null,bt=Q.next();lt!==null&&!bt.done;mt++,bt=Q.next()){lt.index>mt?(un=lt,lt=null):un=lt.sibling;var _r=Se(Z,lt,bt.value,Le);if(_r===null){lt===null&&(lt=un);break}n&&lt&&_r.alternate===null&&r(Z,lt),X=g(_r,X,mt),at===null?it=_r:at.sibling=_r,at=_r,lt=un}if(bt.done)return l(Z,lt),Wt&&Or(Z,mt),it;if(lt===null){for(;!bt.done;mt++,bt=Q.next())bt=we(Z,bt.value,Le),bt!==null&&(X=g(bt,X,mt),at===null?it=bt:at.sibling=bt,at=bt);return Wt&&Or(Z,mt),it}for(lt=u(Z,lt);!bt.done;mt++,bt=Q.next())bt=je(lt,Z,mt,bt.value,Le),bt!==null&&(n&&bt.alternate!==null&&lt.delete(bt.key===null?mt:bt.key),X=g(bt,X,mt),at===null?it=bt:at.sibling=bt,at=bt);return n&&lt.forEach(function(b_){return r(Z,b_)}),Wt&&Or(Z,mt),it}function Qt(Z,X,Q,Le){if(typeof Q=="object"&&Q!==null&&Q.type===F&&Q.key===null&&(Q=Q.props.children),typeof Q=="object"&&Q!==null){switch(Q.$$typeof){case O:e:{for(var it=Q.key,at=X;at!==null;){if(at.key===it){if(it=Q.type,it===F){if(at.tag===7){l(Z,at.sibling),X=p(at,Q.props.children),X.return=Z,Z=X;break e}}else if(at.elementType===it||typeof it=="object"&&it!==null&&it.$$typeof===te&&op(it)===at.type){l(Z,at.sibling),X=p(at,Q.props),X.ref=Io(Z,at,Q),X.return=Z,Z=X;break e}l(Z,at);break}else r(Z,at);at=at.sibling}Q.type===F?(X=jr(Q.props.children,Z.mode,Le,Q.key),X.return=Z,Z=X):(Le=xl(Q.type,Q.key,Q.props,null,Z.mode,Le),Le.ref=Io(Z,X,Q),Le.return=Z,Z=Le)}return T(Z);case U:e:{for(at=Q.key;X!==null;){if(X.key===at)if(X.tag===4&&X.stateNode.containerInfo===Q.containerInfo&&X.stateNode.implementation===Q.implementation){l(Z,X.sibling),X=p(X,Q.children||[]),X.return=Z,Z=X;break e}else{l(Z,X);break}else r(Z,X);X=X.sibling}X=$u(Q,Z.mode,Le),X.return=Z,Z=X}return T(Z);case te:return at=Q._init,Qt(Z,X,at(Q._payload),Le)}if(Ne(Q))return Ze(Z,X,Q,Le);if(fe(Q))return tt(Z,X,Q,Le);$a(Z,Q)}return typeof Q=="string"&&Q!==""||typeof Q=="number"?(Q=""+Q,X!==null&&X.tag===6?(l(Z,X.sibling),X=p(X,Q),X.return=Z,Z=X):(l(Z,X),X=Yu(Q,Z.mode,Le),X.return=Z,Z=X),T(Z)):l(Z,X)}return Qt}var Rs=ap(!0),lp=ap(!1),Ka=ar(null),Za=null,bs=null,ru=null;function su(){ru=bs=Za=null}function ou(n){var r=Ka.current;Ht(Ka),n._currentValue=r}function au(n,r,l){for(;n!==null;){var u=n.alternate;if((n.childLanes&r)!==r?(n.childLanes|=r,u!==null&&(u.childLanes|=r)):u!==null&&(u.childLanes&r)!==r&&(u.childLanes|=r),n===l)break;n=n.return}}function Ps(n,r){Za=n,ru=bs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&r)!==0&&(Fn=!0),n.firstContext=null)}function ni(n){var r=n._currentValue;if(ru!==n)if(n={context:n,memoizedValue:r,next:null},bs===null){if(Za===null)throw Error(t(308));bs=n,Za.dependencies={lanes:0,firstContext:n}}else bs=bs.next=n;return r}var kr=null;function lu(n){kr===null?kr=[n]:kr.push(n)}function cp(n,r,l,u){var p=r.interleaved;return p===null?(l.next=l,lu(r)):(l.next=p.next,p.next=l),r.interleaved=l,Bi(n,u)}function Bi(n,r){n.lanes|=r;var l=n.alternate;for(l!==null&&(l.lanes|=r),l=n,n=n.return;n!==null;)n.childLanes|=r,l=n.alternate,l!==null&&(l.childLanes|=r),l=n,n=n.return;return l.tag===3?l.stateNode:null}var ur=!1;function cu(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function up(n,r){n=n.updateQueue,r.updateQueue===n&&(r.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Vi(n,r){return{eventTime:n,lane:r,tag:0,payload:null,callback:null,next:null}}function dr(n,r,l){var u=n.updateQueue;if(u===null)return null;if(u=u.shared,(Rt&2)!==0){var p=u.pending;return p===null?r.next=r:(r.next=p.next,p.next=r),u.pending=r,Bi(n,l)}return p=u.interleaved,p===null?(r.next=r,lu(u)):(r.next=p.next,p.next=r),u.interleaved=r,Bi(n,l)}function Ja(n,r,l){if(r=r.updateQueue,r!==null&&(r=r.shared,(l&4194240)!==0)){var u=r.lanes;u&=n.pendingLanes,l|=u,r.lanes=l,Dr(n,l)}}function dp(n,r){var l=n.updateQueue,u=n.alternate;if(u!==null&&(u=u.updateQueue,l===u)){var p=null,g=null;if(l=l.firstBaseUpdate,l!==null){do{var T={eventTime:l.eventTime,lane:l.lane,tag:l.tag,payload:l.payload,callback:l.callback,next:null};g===null?p=g=T:g=g.next=T,l=l.next}while(l!==null);g===null?p=g=r:g=g.next=r}else p=g=r;l={baseState:u.baseState,firstBaseUpdate:p,lastBaseUpdate:g,shared:u.shared,effects:u.effects},n.updateQueue=l;return}n=l.lastBaseUpdate,n===null?l.firstBaseUpdate=r:n.next=r,l.lastBaseUpdate=r}function Qa(n,r,l,u){var p=n.updateQueue;ur=!1;var g=p.firstBaseUpdate,T=p.lastBaseUpdate,k=p.shared.pending;if(k!==null){p.shared.pending=null;var G=k,ie=G.next;G.next=null,T===null?g=ie:T.next=ie,T=G;var Me=n.alternate;Me!==null&&(Me=Me.updateQueue,k=Me.lastBaseUpdate,k!==T&&(k===null?Me.firstBaseUpdate=ie:k.next=ie,Me.lastBaseUpdate=G))}if(g!==null){var we=p.baseState;T=0,Me=ie=G=null,k=g;do{var Se=k.lane,je=k.eventTime;if((u&Se)===Se){Me!==null&&(Me=Me.next={eventTime:je,lane:0,tag:k.tag,payload:k.payload,callback:k.callback,next:null});e:{var Ze=n,tt=k;switch(Se=r,je=l,tt.tag){case 1:if(Ze=tt.payload,typeof Ze=="function"){we=Ze.call(je,we,Se);break e}we=Ze;break e;case 3:Ze.flags=Ze.flags&-65537|128;case 0:if(Ze=tt.payload,Se=typeof Ze=="function"?Ze.call(je,we,Se):Ze,Se==null)break e;we=ce({},we,Se);break e;case 2:ur=!0}}k.callback!==null&&k.lane!==0&&(n.flags|=64,Se=p.effects,Se===null?p.effects=[k]:Se.push(k))}else je={eventTime:je,lane:Se,tag:k.tag,payload:k.payload,callback:k.callback,next:null},Me===null?(ie=Me=je,G=we):Me=Me.next=je,T|=Se;if(k=k.next,k===null){if(k=p.shared.pending,k===null)break;Se=k,k=Se.next,Se.next=null,p.lastBaseUpdate=Se,p.shared.pending=null}}while(!0);if(Me===null&&(G=we),p.baseState=G,p.firstBaseUpdate=ie,p.lastBaseUpdate=Me,r=p.shared.interleaved,r!==null){p=r;do T|=p.lane,p=p.next;while(p!==r)}else g===null&&(p.shared.lanes=0);Vr|=T,n.lanes=T,n.memoizedState=we}}function fp(n,r,l){if(n=r.effects,r.effects=null,n!==null)for(r=0;r<n.length;r++){var u=n[r],p=u.callback;if(p!==null){if(u.callback=null,u=l,typeof p!="function")throw Error(t(191,p));p.call(u)}}}var Uo={},Mi=ar(Uo),Fo=ar(Uo),Oo=ar(Uo);function zr(n){if(n===Uo)throw Error(t(174));return n}function uu(n,r){switch(Bt(Oo,r),Bt(Fo,n),Bt(Mi,Uo),n=r.nodeType,n){case 9:case 11:r=(r=r.documentElement)?r.namespaceURI:xe(null,"");break;default:n=n===8?r.parentNode:r,r=n.namespaceURI||null,n=n.tagName,r=xe(r,n)}Ht(Mi),Bt(Mi,r)}function Ls(){Ht(Mi),Ht(Fo),Ht(Oo)}function hp(n){zr(Oo.current);var r=zr(Mi.current),l=xe(r,n.type);r!==l&&(Bt(Fo,n),Bt(Mi,l))}function du(n){Fo.current===n&&(Ht(Mi),Ht(Fo))}var Xt=ar(0);function el(n){for(var r=n;r!==null;){if(r.tag===13){var l=r.memoizedState;if(l!==null&&(l=l.dehydrated,l===null||l.data==="$?"||l.data==="$!"))return r}else if(r.tag===19&&r.memoizedProps.revealOrder!==void 0){if((r.flags&128)!==0)return r}else if(r.child!==null){r.child.return=r,r=r.child;continue}if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return null;r=r.return}r.sibling.return=r.return,r=r.sibling}return null}var fu=[];function hu(){for(var n=0;n<fu.length;n++)fu[n]._workInProgressVersionPrimary=null;fu.length=0}var tl=E.ReactCurrentDispatcher,pu=E.ReactCurrentBatchConfig,Br=0,qt=null,rn=null,ln=null,nl=!1,ko=!1,zo=0,Zv=0;function Sn(){throw Error(t(321))}function mu(n,r){if(r===null)return!1;for(var l=0;l<r.length&&l<n.length;l++)if(!li(n[l],r[l]))return!1;return!0}function gu(n,r,l,u,p,g){if(Br=g,qt=r,r.memoizedState=null,r.updateQueue=null,r.lanes=0,tl.current=n===null||n.memoizedState===null?t_:n_,n=l(u,p),ko){g=0;do{if(ko=!1,zo=0,25<=g)throw Error(t(301));g+=1,ln=rn=null,r.updateQueue=null,tl.current=i_,n=l(u,p)}while(ko)}if(tl.current=sl,r=rn!==null&&rn.next!==null,Br=0,ln=rn=qt=null,nl=!1,r)throw Error(t(300));return n}function vu(){var n=zo!==0;return zo=0,n}function Ei(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ln===null?qt.memoizedState=ln=n:ln=ln.next=n,ln}function ii(){if(rn===null){var n=qt.alternate;n=n!==null?n.memoizedState:null}else n=rn.next;var r=ln===null?qt.memoizedState:ln.next;if(r!==null)ln=r,rn=n;else{if(n===null)throw Error(t(310));rn=n,n={memoizedState:rn.memoizedState,baseState:rn.baseState,baseQueue:rn.baseQueue,queue:rn.queue,next:null},ln===null?qt.memoizedState=ln=n:ln=ln.next=n}return ln}function Bo(n,r){return typeof r=="function"?r(n):r}function _u(n){var r=ii(),l=r.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=n;var u=rn,p=u.baseQueue,g=l.pending;if(g!==null){if(p!==null){var T=p.next;p.next=g.next,g.next=T}u.baseQueue=p=g,l.pending=null}if(p!==null){g=p.next,u=u.baseState;var k=T=null,G=null,ie=g;do{var Me=ie.lane;if((Br&Me)===Me)G!==null&&(G=G.next={lane:0,action:ie.action,hasEagerState:ie.hasEagerState,eagerState:ie.eagerState,next:null}),u=ie.hasEagerState?ie.eagerState:n(u,ie.action);else{var we={lane:Me,action:ie.action,hasEagerState:ie.hasEagerState,eagerState:ie.eagerState,next:null};G===null?(k=G=we,T=u):G=G.next=we,qt.lanes|=Me,Vr|=Me}ie=ie.next}while(ie!==null&&ie!==g);G===null?T=u:G.next=k,li(u,r.memoizedState)||(Fn=!0),r.memoizedState=u,r.baseState=T,r.baseQueue=G,l.lastRenderedState=u}if(n=l.interleaved,n!==null){p=n;do g=p.lane,qt.lanes|=g,Vr|=g,p=p.next;while(p!==n)}else p===null&&(l.lanes=0);return[r.memoizedState,l.dispatch]}function xu(n){var r=ii(),l=r.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=n;var u=l.dispatch,p=l.pending,g=r.memoizedState;if(p!==null){l.pending=null;var T=p=p.next;do g=n(g,T.action),T=T.next;while(T!==p);li(g,r.memoizedState)||(Fn=!0),r.memoizedState=g,r.baseQueue===null&&(r.baseState=g),l.lastRenderedState=g}return[g,u]}function pp(){}function mp(n,r){var l=qt,u=ii(),p=r(),g=!li(u.memoizedState,p);if(g&&(u.memoizedState=p,Fn=!0),u=u.queue,yu(_p.bind(null,l,u,n),[n]),u.getSnapshot!==r||g||ln!==null&&ln.memoizedState.tag&1){if(l.flags|=2048,Vo(9,vp.bind(null,l,u,p,r),void 0,null),cn===null)throw Error(t(349));(Br&30)!==0||gp(l,r,p)}return p}function gp(n,r,l){n.flags|=16384,n={getSnapshot:r,value:l},r=qt.updateQueue,r===null?(r={lastEffect:null,stores:null},qt.updateQueue=r,r.stores=[n]):(l=r.stores,l===null?r.stores=[n]:l.push(n))}function vp(n,r,l,u){r.value=l,r.getSnapshot=u,xp(r)&&yp(n)}function _p(n,r,l){return l(function(){xp(r)&&yp(n)})}function xp(n){var r=n.getSnapshot;n=n.value;try{var l=r();return!li(n,l)}catch{return!0}}function yp(n){var r=Bi(n,1);r!==null&&hi(r,n,1,-1)}function Sp(n){var r=Ei();return typeof n=="function"&&(n=n()),r.memoizedState=r.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:n},r.queue=n,n=n.dispatch=e_.bind(null,qt,n),[r.memoizedState,n]}function Vo(n,r,l,u){return n={tag:n,create:r,destroy:l,deps:u,next:null},r=qt.updateQueue,r===null?(r={lastEffect:null,stores:null},qt.updateQueue=r,r.lastEffect=n.next=n):(l=r.lastEffect,l===null?r.lastEffect=n.next=n:(u=l.next,l.next=n,n.next=u,r.lastEffect=n)),n}function Mp(){return ii().memoizedState}function il(n,r,l,u){var p=Ei();qt.flags|=n,p.memoizedState=Vo(1|r,l,void 0,u===void 0?null:u)}function rl(n,r,l,u){var p=ii();u=u===void 0?null:u;var g=void 0;if(rn!==null){var T=rn.memoizedState;if(g=T.destroy,u!==null&&mu(u,T.deps)){p.memoizedState=Vo(r,l,g,u);return}}qt.flags|=n,p.memoizedState=Vo(1|r,l,g,u)}function Ep(n,r){return il(8390656,8,n,r)}function yu(n,r){return rl(2048,8,n,r)}function wp(n,r){return rl(4,2,n,r)}function Tp(n,r){return rl(4,4,n,r)}function Ap(n,r){if(typeof r=="function")return n=n(),r(n),function(){r(null)};if(r!=null)return n=n(),r.current=n,function(){r.current=null}}function Cp(n,r,l){return l=l!=null?l.concat([n]):null,rl(4,4,Ap.bind(null,r,n),l)}function Su(){}function Rp(n,r){var l=ii();r=r===void 0?null:r;var u=l.memoizedState;return u!==null&&r!==null&&mu(r,u[1])?u[0]:(l.memoizedState=[n,r],n)}function bp(n,r){var l=ii();r=r===void 0?null:r;var u=l.memoizedState;return u!==null&&r!==null&&mu(r,u[1])?u[0]:(n=n(),l.memoizedState=[n,r],n)}function Pp(n,r,l){return(Br&21)===0?(n.baseState&&(n.baseState=!1,Fn=!0),n.memoizedState=l):(li(l,r)||(l=Rn(),qt.lanes|=l,Vr|=l,n.baseState=!0),r)}function Jv(n,r){var l=wt;wt=l!==0&&4>l?l:4,n(!0);var u=pu.transition;pu.transition={};try{n(!1),r()}finally{wt=l,pu.transition=u}}function Lp(){return ii().memoizedState}function Qv(n,r,l){var u=mr(n);if(l={lane:u,action:l,hasEagerState:!1,eagerState:null,next:null},Np(n))Dp(r,l);else if(l=cp(n,r,l,u),l!==null){var p=Pn();hi(l,n,u,p),Ip(l,r,u)}}function e_(n,r,l){var u=mr(n),p={lane:u,action:l,hasEagerState:!1,eagerState:null,next:null};if(Np(n))Dp(r,p);else{var g=n.alternate;if(n.lanes===0&&(g===null||g.lanes===0)&&(g=r.lastRenderedReducer,g!==null))try{var T=r.lastRenderedState,k=g(T,l);if(p.hasEagerState=!0,p.eagerState=k,li(k,T)){var G=r.interleaved;G===null?(p.next=p,lu(r)):(p.next=G.next,G.next=p),r.interleaved=p;return}}catch{}l=cp(n,r,p,u),l!==null&&(p=Pn(),hi(l,n,u,p),Ip(l,r,u))}}function Np(n){var r=n.alternate;return n===qt||r!==null&&r===qt}function Dp(n,r){ko=nl=!0;var l=n.pending;l===null?r.next=r:(r.next=l.next,l.next=r),n.pending=r}function Ip(n,r,l){if((l&4194240)!==0){var u=r.lanes;u&=n.pendingLanes,l|=u,r.lanes=l,Dr(n,l)}}var sl={readContext:ni,useCallback:Sn,useContext:Sn,useEffect:Sn,useImperativeHandle:Sn,useInsertionEffect:Sn,useLayoutEffect:Sn,useMemo:Sn,useReducer:Sn,useRef:Sn,useState:Sn,useDebugValue:Sn,useDeferredValue:Sn,useTransition:Sn,useMutableSource:Sn,useSyncExternalStore:Sn,useId:Sn,unstable_isNewReconciler:!1},t_={readContext:ni,useCallback:function(n,r){return Ei().memoizedState=[n,r===void 0?null:r],n},useContext:ni,useEffect:Ep,useImperativeHandle:function(n,r,l){return l=l!=null?l.concat([n]):null,il(4194308,4,Ap.bind(null,r,n),l)},useLayoutEffect:function(n,r){return il(4194308,4,n,r)},useInsertionEffect:function(n,r){return il(4,2,n,r)},useMemo:function(n,r){var l=Ei();return r=r===void 0?null:r,n=n(),l.memoizedState=[n,r],n},useReducer:function(n,r,l){var u=Ei();return r=l!==void 0?l(r):r,u.memoizedState=u.baseState=r,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:r},u.queue=n,n=n.dispatch=Qv.bind(null,qt,n),[u.memoizedState,n]},useRef:function(n){var r=Ei();return n={current:n},r.memoizedState=n},useState:Sp,useDebugValue:Su,useDeferredValue:function(n){return Ei().memoizedState=n},useTransition:function(){var n=Sp(!1),r=n[0];return n=Jv.bind(null,n[1]),Ei().memoizedState=n,[r,n]},useMutableSource:function(){},useSyncExternalStore:function(n,r,l){var u=qt,p=Ei();if(Wt){if(l===void 0)throw Error(t(407));l=l()}else{if(l=r(),cn===null)throw Error(t(349));(Br&30)!==0||gp(u,r,l)}p.memoizedState=l;var g={value:l,getSnapshot:r};return p.queue=g,Ep(_p.bind(null,u,g,n),[n]),u.flags|=2048,Vo(9,vp.bind(null,u,g,l,r),void 0,null),l},useId:function(){var n=Ei(),r=cn.identifierPrefix;if(Wt){var l=zi,u=ki;l=(u&~(1<<32-Ct(u)-1)).toString(32)+l,r=":"+r+"R"+l,l=zo++,0<l&&(r+="H"+l.toString(32)),r+=":"}else l=Zv++,r=":"+r+"r"+l.toString(32)+":";return n.memoizedState=r},unstable_isNewReconciler:!1},n_={readContext:ni,useCallback:Rp,useContext:ni,useEffect:yu,useImperativeHandle:Cp,useInsertionEffect:wp,useLayoutEffect:Tp,useMemo:bp,useReducer:_u,useRef:Mp,useState:function(){return _u(Bo)},useDebugValue:Su,useDeferredValue:function(n){var r=ii();return Pp(r,rn.memoizedState,n)},useTransition:function(){var n=_u(Bo)[0],r=ii().memoizedState;return[n,r]},useMutableSource:pp,useSyncExternalStore:mp,useId:Lp,unstable_isNewReconciler:!1},i_={readContext:ni,useCallback:Rp,useContext:ni,useEffect:yu,useImperativeHandle:Cp,useInsertionEffect:wp,useLayoutEffect:Tp,useMemo:bp,useReducer:xu,useRef:Mp,useState:function(){return xu(Bo)},useDebugValue:Su,useDeferredValue:function(n){var r=ii();return rn===null?r.memoizedState=n:Pp(r,rn.memoizedState,n)},useTransition:function(){var n=xu(Bo)[0],r=ii().memoizedState;return[n,r]},useMutableSource:pp,useSyncExternalStore:mp,useId:Lp,unstable_isNewReconciler:!1};function ui(n,r){if(n&&n.defaultProps){r=ce({},r),n=n.defaultProps;for(var l in n)r[l]===void 0&&(r[l]=n[l]);return r}return r}function Mu(n,r,l,u){r=n.memoizedState,l=l(u,r),l=l==null?r:ce({},r,l),n.memoizedState=l,n.lanes===0&&(n.updateQueue.baseState=l)}var ol={isMounted:function(n){return(n=n._reactInternals)?Ui(n)===n:!1},enqueueSetState:function(n,r,l){n=n._reactInternals;var u=Pn(),p=mr(n),g=Vi(u,p);g.payload=r,l!=null&&(g.callback=l),r=dr(n,g,p),r!==null&&(hi(r,n,p,u),Ja(r,n,p))},enqueueReplaceState:function(n,r,l){n=n._reactInternals;var u=Pn(),p=mr(n),g=Vi(u,p);g.tag=1,g.payload=r,l!=null&&(g.callback=l),r=dr(n,g,p),r!==null&&(hi(r,n,p,u),Ja(r,n,p))},enqueueForceUpdate:function(n,r){n=n._reactInternals;var l=Pn(),u=mr(n),p=Vi(l,u);p.tag=2,r!=null&&(p.callback=r),r=dr(n,p,u),r!==null&&(hi(r,n,u,l),Ja(r,n,u))}};function Up(n,r,l,u,p,g,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(u,g,T):r.prototype&&r.prototype.isPureReactComponent?!Co(l,u)||!Co(p,g):!0}function Fp(n,r,l){var u=!1,p=lr,g=r.contextType;return typeof g=="object"&&g!==null?g=ni(g):(p=Un(r)?Ur:yn.current,u=r.contextTypes,g=(u=u!=null)?ws(n,p):lr),r=new r(l,g),n.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=ol,n.stateNode=r,r._reactInternals=n,u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=p,n.__reactInternalMemoizedMaskedChildContext=g),r}function Op(n,r,l,u){n=r.state,typeof r.componentWillReceiveProps=="function"&&r.componentWillReceiveProps(l,u),typeof r.UNSAFE_componentWillReceiveProps=="function"&&r.UNSAFE_componentWillReceiveProps(l,u),r.state!==n&&ol.enqueueReplaceState(r,r.state,null)}function Eu(n,r,l,u){var p=n.stateNode;p.props=l,p.state=n.memoizedState,p.refs={},cu(n);var g=r.contextType;typeof g=="object"&&g!==null?p.context=ni(g):(g=Un(r)?Ur:yn.current,p.context=ws(n,g)),p.state=n.memoizedState,g=r.getDerivedStateFromProps,typeof g=="function"&&(Mu(n,r,g,l),p.state=n.memoizedState),typeof r.getDerivedStateFromProps=="function"||typeof p.getSnapshotBeforeUpdate=="function"||typeof p.UNSAFE_componentWillMount!="function"&&typeof p.componentWillMount!="function"||(r=p.state,typeof p.componentWillMount=="function"&&p.componentWillMount(),typeof p.UNSAFE_componentWillMount=="function"&&p.UNSAFE_componentWillMount(),r!==p.state&&ol.enqueueReplaceState(p,p.state,null),Qa(n,l,p,u),p.state=n.memoizedState),typeof p.componentDidMount=="function"&&(n.flags|=4194308)}function Ns(n,r){try{var l="",u=r;do l+=qe(u),u=u.return;while(u);var p=l}catch(g){p=`
Error generating stack: `+g.message+`
`+g.stack}return{value:n,source:r,stack:p,digest:null}}function wu(n,r,l){return{value:n,source:null,stack:l??null,digest:r??null}}function Tu(n,r){try{console.error(r.value)}catch(l){setTimeout(function(){throw l})}}var r_=typeof WeakMap=="function"?WeakMap:Map;function kp(n,r,l){l=Vi(-1,l),l.tag=3,l.payload={element:null};var u=r.value;return l.callback=function(){hl||(hl=!0,Bu=u),Tu(n,r)},l}function zp(n,r,l){l=Vi(-1,l),l.tag=3;var u=n.type.getDerivedStateFromError;if(typeof u=="function"){var p=r.value;l.payload=function(){return u(p)},l.callback=function(){Tu(n,r)}}var g=n.stateNode;return g!==null&&typeof g.componentDidCatch=="function"&&(l.callback=function(){Tu(n,r),typeof u!="function"&&(hr===null?hr=new Set([this]):hr.add(this));var T=r.stack;this.componentDidCatch(r.value,{componentStack:T!==null?T:""})}),l}function Bp(n,r,l){var u=n.pingCache;if(u===null){u=n.pingCache=new r_;var p=new Set;u.set(r,p)}else p=u.get(r),p===void 0&&(p=new Set,u.set(r,p));p.has(l)||(p.add(l),n=__.bind(null,n,r,l),r.then(n,n))}function Vp(n){do{var r;if((r=n.tag===13)&&(r=n.memoizedState,r=r!==null?r.dehydrated!==null:!0),r)return n;n=n.return}while(n!==null);return null}function Hp(n,r,l,u,p){return(n.mode&1)===0?(n===r?n.flags|=65536:(n.flags|=128,l.flags|=131072,l.flags&=-52805,l.tag===1&&(l.alternate===null?l.tag=17:(r=Vi(-1,1),r.tag=2,dr(l,r,1))),l.lanes|=1),n):(n.flags|=65536,n.lanes=p,n)}var s_=E.ReactCurrentOwner,Fn=!1;function bn(n,r,l,u){r.child=n===null?lp(r,null,l,u):Rs(r,n.child,l,u)}function Gp(n,r,l,u,p){l=l.render;var g=r.ref;return Ps(r,p),u=gu(n,r,l,u,g,p),l=vu(),n!==null&&!Fn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,Hi(n,r,p)):(Wt&&l&&Qc(r),r.flags|=1,bn(n,r,u,p),r.child)}function Wp(n,r,l,u,p){if(n===null){var g=l.type;return typeof g=="function"&&!qu(g)&&g.defaultProps===void 0&&l.compare===null&&l.defaultProps===void 0?(r.tag=15,r.type=g,jp(n,r,g,u,p)):(n=xl(l.type,null,u,r,r.mode,p),n.ref=r.ref,n.return=r,r.child=n)}if(g=n.child,(n.lanes&p)===0){var T=g.memoizedProps;if(l=l.compare,l=l!==null?l:Co,l(T,u)&&n.ref===r.ref)return Hi(n,r,p)}return r.flags|=1,n=vr(g,u),n.ref=r.ref,n.return=r,r.child=n}function jp(n,r,l,u,p){if(n!==null){var g=n.memoizedProps;if(Co(g,u)&&n.ref===r.ref)if(Fn=!1,r.pendingProps=u=g,(n.lanes&p)!==0)(n.flags&131072)!==0&&(Fn=!0);else return r.lanes=n.lanes,Hi(n,r,p)}return Au(n,r,l,u,p)}function Xp(n,r,l){var u=r.pendingProps,p=u.children,g=n!==null?n.memoizedState:null;if(u.mode==="hidden")if((r.mode&1)===0)r.memoizedState={baseLanes:0,cachePool:null,transitions:null},Bt(Is,$n),$n|=l;else{if((l&1073741824)===0)return n=g!==null?g.baseLanes|l:l,r.lanes=r.childLanes=1073741824,r.memoizedState={baseLanes:n,cachePool:null,transitions:null},r.updateQueue=null,Bt(Is,$n),$n|=n,null;r.memoizedState={baseLanes:0,cachePool:null,transitions:null},u=g!==null?g.baseLanes:l,Bt(Is,$n),$n|=u}else g!==null?(u=g.baseLanes|l,r.memoizedState=null):u=l,Bt(Is,$n),$n|=u;return bn(n,r,p,l),r.child}function qp(n,r){var l=r.ref;(n===null&&l!==null||n!==null&&n.ref!==l)&&(r.flags|=512,r.flags|=2097152)}function Au(n,r,l,u,p){var g=Un(l)?Ur:yn.current;return g=ws(r,g),Ps(r,p),l=gu(n,r,l,u,g,p),u=vu(),n!==null&&!Fn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,Hi(n,r,p)):(Wt&&u&&Qc(r),r.flags|=1,bn(n,r,l,p),r.child)}function Yp(n,r,l,u,p){if(Un(l)){var g=!0;Wa(r)}else g=!1;if(Ps(r,p),r.stateNode===null)ll(n,r),Fp(r,l,u),Eu(r,l,u,p),u=!0;else if(n===null){var T=r.stateNode,k=r.memoizedProps;T.props=k;var G=T.context,ie=l.contextType;typeof ie=="object"&&ie!==null?ie=ni(ie):(ie=Un(l)?Ur:yn.current,ie=ws(r,ie));var Me=l.getDerivedStateFromProps,we=typeof Me=="function"||typeof T.getSnapshotBeforeUpdate=="function";we||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(k!==u||G!==ie)&&Op(r,T,u,ie),ur=!1;var Se=r.memoizedState;T.state=Se,Qa(r,u,T,p),G=r.memoizedState,k!==u||Se!==G||In.current||ur?(typeof Me=="function"&&(Mu(r,l,Me,u),G=r.memoizedState),(k=ur||Up(r,l,k,u,Se,G,ie))?(we||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(r.flags|=4194308)):(typeof T.componentDidMount=="function"&&(r.flags|=4194308),r.memoizedProps=u,r.memoizedState=G),T.props=u,T.state=G,T.context=ie,u=k):(typeof T.componentDidMount=="function"&&(r.flags|=4194308),u=!1)}else{T=r.stateNode,up(n,r),k=r.memoizedProps,ie=r.type===r.elementType?k:ui(r.type,k),T.props=ie,we=r.pendingProps,Se=T.context,G=l.contextType,typeof G=="object"&&G!==null?G=ni(G):(G=Un(l)?Ur:yn.current,G=ws(r,G));var je=l.getDerivedStateFromProps;(Me=typeof je=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(k!==we||Se!==G)&&Op(r,T,u,G),ur=!1,Se=r.memoizedState,T.state=Se,Qa(r,u,T,p);var Ze=r.memoizedState;k!==we||Se!==Ze||In.current||ur?(typeof je=="function"&&(Mu(r,l,je,u),Ze=r.memoizedState),(ie=ur||Up(r,l,ie,u,Se,Ze,G)||!1)?(Me||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(u,Ze,G),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(u,Ze,G)),typeof T.componentDidUpdate=="function"&&(r.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(r.flags|=1024)):(typeof T.componentDidUpdate!="function"||k===n.memoizedProps&&Se===n.memoizedState||(r.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||k===n.memoizedProps&&Se===n.memoizedState||(r.flags|=1024),r.memoizedProps=u,r.memoizedState=Ze),T.props=u,T.state=Ze,T.context=G,u=ie):(typeof T.componentDidUpdate!="function"||k===n.memoizedProps&&Se===n.memoizedState||(r.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||k===n.memoizedProps&&Se===n.memoizedState||(r.flags|=1024),u=!1)}return Cu(n,r,l,u,g,p)}function Cu(n,r,l,u,p,g){qp(n,r);var T=(r.flags&128)!==0;if(!u&&!T)return p&&Qh(r,l,!1),Hi(n,r,g);u=r.stateNode,s_.current=r;var k=T&&typeof l.getDerivedStateFromError!="function"?null:u.render();return r.flags|=1,n!==null&&T?(r.child=Rs(r,n.child,null,g),r.child=Rs(r,null,k,g)):bn(n,r,k,g),r.memoizedState=u.state,p&&Qh(r,l,!0),r.child}function $p(n){var r=n.stateNode;r.pendingContext?Zh(n,r.pendingContext,r.pendingContext!==r.context):r.context&&Zh(n,r.context,!1),uu(n,r.containerInfo)}function Kp(n,r,l,u,p){return Cs(),iu(p),r.flags|=256,bn(n,r,l,u),r.child}var Ru={dehydrated:null,treeContext:null,retryLane:0};function bu(n){return{baseLanes:n,cachePool:null,transitions:null}}function Zp(n,r,l){var u=r.pendingProps,p=Xt.current,g=!1,T=(r.flags&128)!==0,k;if((k=T)||(k=n!==null&&n.memoizedState===null?!1:(p&2)!==0),k?(g=!0,r.flags&=-129):(n===null||n.memoizedState!==null)&&(p|=1),Bt(Xt,p&1),n===null)return nu(r),n=r.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((r.mode&1)===0?r.lanes=1:n.data==="$!"?r.lanes=8:r.lanes=1073741824,null):(T=u.children,n=u.fallback,g?(u=r.mode,g=r.child,T={mode:"hidden",children:T},(u&1)===0&&g!==null?(g.childLanes=0,g.pendingProps=T):g=yl(T,u,0,null),n=jr(n,u,l,null),g.return=r,n.return=r,g.sibling=n,r.child=g,r.child.memoizedState=bu(l),r.memoizedState=Ru,n):Pu(r,T));if(p=n.memoizedState,p!==null&&(k=p.dehydrated,k!==null))return o_(n,r,T,u,k,p,l);if(g){g=u.fallback,T=r.mode,p=n.child,k=p.sibling;var G={mode:"hidden",children:u.children};return(T&1)===0&&r.child!==p?(u=r.child,u.childLanes=0,u.pendingProps=G,r.deletions=null):(u=vr(p,G),u.subtreeFlags=p.subtreeFlags&14680064),k!==null?g=vr(k,g):(g=jr(g,T,l,null),g.flags|=2),g.return=r,u.return=r,u.sibling=g,r.child=u,u=g,g=r.child,T=n.child.memoizedState,T=T===null?bu(l):{baseLanes:T.baseLanes|l,cachePool:null,transitions:T.transitions},g.memoizedState=T,g.childLanes=n.childLanes&~l,r.memoizedState=Ru,u}return g=n.child,n=g.sibling,u=vr(g,{mode:"visible",children:u.children}),(r.mode&1)===0&&(u.lanes=l),u.return=r,u.sibling=null,n!==null&&(l=r.deletions,l===null?(r.deletions=[n],r.flags|=16):l.push(n)),r.child=u,r.memoizedState=null,u}function Pu(n,r){return r=yl({mode:"visible",children:r},n.mode,0,null),r.return=n,n.child=r}function al(n,r,l,u){return u!==null&&iu(u),Rs(r,n.child,null,l),n=Pu(r,r.pendingProps.children),n.flags|=2,r.memoizedState=null,n}function o_(n,r,l,u,p,g,T){if(l)return r.flags&256?(r.flags&=-257,u=wu(Error(t(422))),al(n,r,T,u)):r.memoizedState!==null?(r.child=n.child,r.flags|=128,null):(g=u.fallback,p=r.mode,u=yl({mode:"visible",children:u.children},p,0,null),g=jr(g,p,T,null),g.flags|=2,u.return=r,g.return=r,u.sibling=g,r.child=u,(r.mode&1)!==0&&Rs(r,n.child,null,T),r.child.memoizedState=bu(T),r.memoizedState=Ru,g);if((r.mode&1)===0)return al(n,r,T,null);if(p.data==="$!"){if(u=p.nextSibling&&p.nextSibling.dataset,u)var k=u.dgst;return u=k,g=Error(t(419)),u=wu(g,u,void 0),al(n,r,T,u)}if(k=(T&n.childLanes)!==0,Fn||k){if(u=cn,u!==null){switch(T&-T){case 4:p=2;break;case 16:p=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:p=32;break;case 536870912:p=268435456;break;default:p=0}p=(p&(u.suspendedLanes|T))!==0?0:p,p!==0&&p!==g.retryLane&&(g.retryLane=p,Bi(n,p),hi(u,n,p,-1))}return Xu(),u=wu(Error(t(421))),al(n,r,T,u)}return p.data==="$?"?(r.flags|=128,r.child=n.child,r=x_.bind(null,n),p._reactRetry=r,null):(n=g.treeContext,Yn=or(p.nextSibling),qn=r,Wt=!0,ci=null,n!==null&&(ei[ti++]=ki,ei[ti++]=zi,ei[ti++]=Fr,ki=n.id,zi=n.overflow,Fr=r),r=Pu(r,u.children),r.flags|=4096,r)}function Jp(n,r,l){n.lanes|=r;var u=n.alternate;u!==null&&(u.lanes|=r),au(n.return,r,l)}function Lu(n,r,l,u,p){var g=n.memoizedState;g===null?n.memoizedState={isBackwards:r,rendering:null,renderingStartTime:0,last:u,tail:l,tailMode:p}:(g.isBackwards=r,g.rendering=null,g.renderingStartTime=0,g.last=u,g.tail=l,g.tailMode=p)}function Qp(n,r,l){var u=r.pendingProps,p=u.revealOrder,g=u.tail;if(bn(n,r,u.children,l),u=Xt.current,(u&2)!==0)u=u&1|2,r.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=r.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Jp(n,l,r);else if(n.tag===19)Jp(n,l,r);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===r)break e;for(;n.sibling===null;){if(n.return===null||n.return===r)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}u&=1}if(Bt(Xt,u),(r.mode&1)===0)r.memoizedState=null;else switch(p){case"forwards":for(l=r.child,p=null;l!==null;)n=l.alternate,n!==null&&el(n)===null&&(p=l),l=l.sibling;l=p,l===null?(p=r.child,r.child=null):(p=l.sibling,l.sibling=null),Lu(r,!1,p,l,g);break;case"backwards":for(l=null,p=r.child,r.child=null;p!==null;){if(n=p.alternate,n!==null&&el(n)===null){r.child=p;break}n=p.sibling,p.sibling=l,l=p,p=n}Lu(r,!0,l,null,g);break;case"together":Lu(r,!1,null,null,void 0);break;default:r.memoizedState=null}return r.child}function ll(n,r){(r.mode&1)===0&&n!==null&&(n.alternate=null,r.alternate=null,r.flags|=2)}function Hi(n,r,l){if(n!==null&&(r.dependencies=n.dependencies),Vr|=r.lanes,(l&r.childLanes)===0)return null;if(n!==null&&r.child!==n.child)throw Error(t(153));if(r.child!==null){for(n=r.child,l=vr(n,n.pendingProps),r.child=l,l.return=r;n.sibling!==null;)n=n.sibling,l=l.sibling=vr(n,n.pendingProps),l.return=r;l.sibling=null}return r.child}function a_(n,r,l){switch(r.tag){case 3:$p(r),Cs();break;case 5:hp(r);break;case 1:Un(r.type)&&Wa(r);break;case 4:uu(r,r.stateNode.containerInfo);break;case 10:var u=r.type._context,p=r.memoizedProps.value;Bt(Ka,u._currentValue),u._currentValue=p;break;case 13:if(u=r.memoizedState,u!==null)return u.dehydrated!==null?(Bt(Xt,Xt.current&1),r.flags|=128,null):(l&r.child.childLanes)!==0?Zp(n,r,l):(Bt(Xt,Xt.current&1),n=Hi(n,r,l),n!==null?n.sibling:null);Bt(Xt,Xt.current&1);break;case 19:if(u=(l&r.childLanes)!==0,(n.flags&128)!==0){if(u)return Qp(n,r,l);r.flags|=128}if(p=r.memoizedState,p!==null&&(p.rendering=null,p.tail=null,p.lastEffect=null),Bt(Xt,Xt.current),u)break;return null;case 22:case 23:return r.lanes=0,Xp(n,r,l)}return Hi(n,r,l)}var em,Nu,tm,nm;em=function(n,r){for(var l=r.child;l!==null;){if(l.tag===5||l.tag===6)n.appendChild(l.stateNode);else if(l.tag!==4&&l.child!==null){l.child.return=l,l=l.child;continue}if(l===r)break;for(;l.sibling===null;){if(l.return===null||l.return===r)return;l=l.return}l.sibling.return=l.return,l=l.sibling}},Nu=function(){},tm=function(n,r,l,u){var p=n.memoizedProps;if(p!==u){n=r.stateNode,zr(Mi.current);var g=null;switch(l){case"input":p=ye(n,p),u=ye(n,u),g=[];break;case"select":p=ce({},p,{value:void 0}),u=ce({},u,{value:void 0}),g=[];break;case"textarea":p=ht(n,p),u=ht(n,u),g=[];break;default:typeof p.onClick!="function"&&typeof u.onClick=="function"&&(n.onclick=Va)}nt(l,u);var T;l=null;for(ie in p)if(!u.hasOwnProperty(ie)&&p.hasOwnProperty(ie)&&p[ie]!=null)if(ie==="style"){var k=p[ie];for(T in k)k.hasOwnProperty(T)&&(l||(l={}),l[T]="")}else ie!=="dangerouslySetInnerHTML"&&ie!=="children"&&ie!=="suppressContentEditableWarning"&&ie!=="suppressHydrationWarning"&&ie!=="autoFocus"&&(o.hasOwnProperty(ie)?g||(g=[]):(g=g||[]).push(ie,null));for(ie in u){var G=u[ie];if(k=p?.[ie],u.hasOwnProperty(ie)&&G!==k&&(G!=null||k!=null))if(ie==="style")if(k){for(T in k)!k.hasOwnProperty(T)||G&&G.hasOwnProperty(T)||(l||(l={}),l[T]="");for(T in G)G.hasOwnProperty(T)&&k[T]!==G[T]&&(l||(l={}),l[T]=G[T])}else l||(g||(g=[]),g.push(ie,l)),l=G;else ie==="dangerouslySetInnerHTML"?(G=G?G.__html:void 0,k=k?k.__html:void 0,G!=null&&k!==G&&(g=g||[]).push(ie,G)):ie==="children"?typeof G!="string"&&typeof G!="number"||(g=g||[]).push(ie,""+G):ie!=="suppressContentEditableWarning"&&ie!=="suppressHydrationWarning"&&(o.hasOwnProperty(ie)?(G!=null&&ie==="onScroll"&&Vt("scroll",n),g||k===G||(g=[])):(g=g||[]).push(ie,G))}l&&(g=g||[]).push("style",l);var ie=g;(r.updateQueue=ie)&&(r.flags|=4)}},nm=function(n,r,l,u){l!==u&&(r.flags|=4)};function Ho(n,r){if(!Wt)switch(n.tailMode){case"hidden":r=n.tail;for(var l=null;r!==null;)r.alternate!==null&&(l=r),r=r.sibling;l===null?n.tail=null:l.sibling=null;break;case"collapsed":l=n.tail;for(var u=null;l!==null;)l.alternate!==null&&(u=l),l=l.sibling;u===null?r||n.tail===null?n.tail=null:n.tail.sibling=null:u.sibling=null}}function Mn(n){var r=n.alternate!==null&&n.alternate.child===n.child,l=0,u=0;if(r)for(var p=n.child;p!==null;)l|=p.lanes|p.childLanes,u|=p.subtreeFlags&14680064,u|=p.flags&14680064,p.return=n,p=p.sibling;else for(p=n.child;p!==null;)l|=p.lanes|p.childLanes,u|=p.subtreeFlags,u|=p.flags,p.return=n,p=p.sibling;return n.subtreeFlags|=u,n.childLanes=l,r}function l_(n,r,l){var u=r.pendingProps;switch(eu(r),r.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Mn(r),null;case 1:return Un(r.type)&&Ga(),Mn(r),null;case 3:return u=r.stateNode,Ls(),Ht(In),Ht(yn),hu(),u.pendingContext&&(u.context=u.pendingContext,u.pendingContext=null),(n===null||n.child===null)&&(Ya(r)?r.flags|=4:n===null||n.memoizedState.isDehydrated&&(r.flags&256)===0||(r.flags|=1024,ci!==null&&(Gu(ci),ci=null))),Nu(n,r),Mn(r),null;case 5:du(r);var p=zr(Oo.current);if(l=r.type,n!==null&&r.stateNode!=null)tm(n,r,l,u,p),n.ref!==r.ref&&(r.flags|=512,r.flags|=2097152);else{if(!u){if(r.stateNode===null)throw Error(t(166));return Mn(r),null}if(n=zr(Mi.current),Ya(r)){u=r.stateNode,l=r.type;var g=r.memoizedProps;switch(u[Si]=r,u[No]=g,n=(r.mode&1)!==0,l){case"dialog":Vt("cancel",u),Vt("close",u);break;case"iframe":case"object":case"embed":Vt("load",u);break;case"video":case"audio":for(p=0;p<bo.length;p++)Vt(bo[p],u);break;case"source":Vt("error",u);break;case"img":case"image":case"link":Vt("error",u),Vt("load",u);break;case"details":Vt("toggle",u);break;case"input":ve(u,g),Vt("invalid",u);break;case"select":u._wrapperState={wasMultiple:!!g.multiple},Vt("invalid",u);break;case"textarea":I(u,g),Vt("invalid",u)}nt(l,g),p=null;for(var T in g)if(g.hasOwnProperty(T)){var k=g[T];T==="children"?typeof k=="string"?u.textContent!==k&&(g.suppressHydrationWarning!==!0&&Ba(u.textContent,k,n),p=["children",k]):typeof k=="number"&&u.textContent!==""+k&&(g.suppressHydrationWarning!==!0&&Ba(u.textContent,k,n),p=["children",""+k]):o.hasOwnProperty(T)&&k!=null&&T==="onScroll"&&Vt("scroll",u)}switch(l){case"input":_t(u),Ie(u,g,!0);break;case"textarea":_t(u),K(u);break;case"select":case"option":break;default:typeof g.onClick=="function"&&(u.onclick=Va)}u=p,r.updateQueue=u,u!==null&&(r.flags|=4)}else{T=p.nodeType===9?p:p.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=ue(l)),n==="http://www.w3.org/1999/xhtml"?l==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof u.is=="string"?n=T.createElement(l,{is:u.is}):(n=T.createElement(l),l==="select"&&(T=n,u.multiple?T.multiple=!0:u.size&&(T.size=u.size))):n=T.createElementNS(n,l),n[Si]=r,n[No]=u,em(n,r,!1,!1),r.stateNode=n;e:{switch(T=Oe(l,u),l){case"dialog":Vt("cancel",n),Vt("close",n),p=u;break;case"iframe":case"object":case"embed":Vt("load",n),p=u;break;case"video":case"audio":for(p=0;p<bo.length;p++)Vt(bo[p],n);p=u;break;case"source":Vt("error",n),p=u;break;case"img":case"image":case"link":Vt("error",n),Vt("load",n),p=u;break;case"details":Vt("toggle",n),p=u;break;case"input":ve(n,u),p=ye(n,u),Vt("invalid",n);break;case"option":p=u;break;case"select":n._wrapperState={wasMultiple:!!u.multiple},p=ce({},u,{value:void 0}),Vt("invalid",n);break;case"textarea":I(n,u),p=ht(n,u),Vt("invalid",n);break;default:p=u}nt(l,p),k=p;for(g in k)if(k.hasOwnProperty(g)){var G=k[g];g==="style"?He(n,G):g==="dangerouslySetInnerHTML"?(G=G?G.__html:void 0,G!=null&&Qe(n,G)):g==="children"?typeof G=="string"?(l!=="textarea"||G!=="")&&Pe(n,G):typeof G=="number"&&Pe(n,""+G):g!=="suppressContentEditableWarning"&&g!=="suppressHydrationWarning"&&g!=="autoFocus"&&(o.hasOwnProperty(g)?G!=null&&g==="onScroll"&&Vt("scroll",n):G!=null&&C(n,g,G,T))}switch(l){case"input":_t(n),Ie(n,u,!1);break;case"textarea":_t(n),K(n);break;case"option":u.value!=null&&n.setAttribute("value",""+Te(u.value));break;case"select":n.multiple=!!u.multiple,g=u.value,g!=null?ut(n,!!u.multiple,g,!1):u.defaultValue!=null&&ut(n,!!u.multiple,u.defaultValue,!0);break;default:typeof p.onClick=="function"&&(n.onclick=Va)}switch(l){case"button":case"input":case"select":case"textarea":u=!!u.autoFocus;break e;case"img":u=!0;break e;default:u=!1}}u&&(r.flags|=4)}r.ref!==null&&(r.flags|=512,r.flags|=2097152)}return Mn(r),null;case 6:if(n&&r.stateNode!=null)nm(n,r,n.memoizedProps,u);else{if(typeof u!="string"&&r.stateNode===null)throw Error(t(166));if(l=zr(Oo.current),zr(Mi.current),Ya(r)){if(u=r.stateNode,l=r.memoizedProps,u[Si]=r,(g=u.nodeValue!==l)&&(n=qn,n!==null))switch(n.tag){case 3:Ba(u.nodeValue,l,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Ba(u.nodeValue,l,(n.mode&1)!==0)}g&&(r.flags|=4)}else u=(l.nodeType===9?l:l.ownerDocument).createTextNode(u),u[Si]=r,r.stateNode=u}return Mn(r),null;case 13:if(Ht(Xt),u=r.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Wt&&Yn!==null&&(r.mode&1)!==0&&(r.flags&128)===0)sp(),Cs(),r.flags|=98560,g=!1;else if(g=Ya(r),u!==null&&u.dehydrated!==null){if(n===null){if(!g)throw Error(t(318));if(g=r.memoizedState,g=g!==null?g.dehydrated:null,!g)throw Error(t(317));g[Si]=r}else Cs(),(r.flags&128)===0&&(r.memoizedState=null),r.flags|=4;Mn(r),g=!1}else ci!==null&&(Gu(ci),ci=null),g=!0;if(!g)return r.flags&65536?r:null}return(r.flags&128)!==0?(r.lanes=l,r):(u=u!==null,u!==(n!==null&&n.memoizedState!==null)&&u&&(r.child.flags|=8192,(r.mode&1)!==0&&(n===null||(Xt.current&1)!==0?sn===0&&(sn=3):Xu())),r.updateQueue!==null&&(r.flags|=4),Mn(r),null);case 4:return Ls(),Nu(n,r),n===null&&Po(r.stateNode.containerInfo),Mn(r),null;case 10:return ou(r.type._context),Mn(r),null;case 17:return Un(r.type)&&Ga(),Mn(r),null;case 19:if(Ht(Xt),g=r.memoizedState,g===null)return Mn(r),null;if(u=(r.flags&128)!==0,T=g.rendering,T===null)if(u)Ho(g,!1);else{if(sn!==0||n!==null&&(n.flags&128)!==0)for(n=r.child;n!==null;){if(T=el(n),T!==null){for(r.flags|=128,Ho(g,!1),u=T.updateQueue,u!==null&&(r.updateQueue=u,r.flags|=4),r.subtreeFlags=0,u=l,l=r.child;l!==null;)g=l,n=u,g.flags&=14680066,T=g.alternate,T===null?(g.childLanes=0,g.lanes=n,g.child=null,g.subtreeFlags=0,g.memoizedProps=null,g.memoizedState=null,g.updateQueue=null,g.dependencies=null,g.stateNode=null):(g.childLanes=T.childLanes,g.lanes=T.lanes,g.child=T.child,g.subtreeFlags=0,g.deletions=null,g.memoizedProps=T.memoizedProps,g.memoizedState=T.memoizedState,g.updateQueue=T.updateQueue,g.type=T.type,n=T.dependencies,g.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),l=l.sibling;return Bt(Xt,Xt.current&1|2),r.child}n=n.sibling}g.tail!==null&&q()>Us&&(r.flags|=128,u=!0,Ho(g,!1),r.lanes=4194304)}else{if(!u)if(n=el(T),n!==null){if(r.flags|=128,u=!0,l=n.updateQueue,l!==null&&(r.updateQueue=l,r.flags|=4),Ho(g,!0),g.tail===null&&g.tailMode==="hidden"&&!T.alternate&&!Wt)return Mn(r),null}else 2*q()-g.renderingStartTime>Us&&l!==1073741824&&(r.flags|=128,u=!0,Ho(g,!1),r.lanes=4194304);g.isBackwards?(T.sibling=r.child,r.child=T):(l=g.last,l!==null?l.sibling=T:r.child=T,g.last=T)}return g.tail!==null?(r=g.tail,g.rendering=r,g.tail=r.sibling,g.renderingStartTime=q(),r.sibling=null,l=Xt.current,Bt(Xt,u?l&1|2:l&1),r):(Mn(r),null);case 22:case 23:return ju(),u=r.memoizedState!==null,n!==null&&n.memoizedState!==null!==u&&(r.flags|=8192),u&&(r.mode&1)!==0?($n&1073741824)!==0&&(Mn(r),r.subtreeFlags&6&&(r.flags|=8192)):Mn(r),null;case 24:return null;case 25:return null}throw Error(t(156,r.tag))}function c_(n,r){switch(eu(r),r.tag){case 1:return Un(r.type)&&Ga(),n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 3:return Ls(),Ht(In),Ht(yn),hu(),n=r.flags,(n&65536)!==0&&(n&128)===0?(r.flags=n&-65537|128,r):null;case 5:return du(r),null;case 13:if(Ht(Xt),n=r.memoizedState,n!==null&&n.dehydrated!==null){if(r.alternate===null)throw Error(t(340));Cs()}return n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 19:return Ht(Xt),null;case 4:return Ls(),null;case 10:return ou(r.type._context),null;case 22:case 23:return ju(),null;case 24:return null;default:return null}}var cl=!1,En=!1,u_=typeof WeakSet=="function"?WeakSet:Set,$e=null;function Ds(n,r){var l=n.ref;if(l!==null)if(typeof l=="function")try{l(null)}catch(u){Kt(n,r,u)}else l.current=null}function Du(n,r,l){try{l()}catch(u){Kt(n,r,u)}}var im=!1;function d_(n,r){if(jc=ba,n=Uh(),Oc(n)){if("selectionStart"in n)var l={start:n.selectionStart,end:n.selectionEnd};else e:{l=(l=n.ownerDocument)&&l.defaultView||window;var u=l.getSelection&&l.getSelection();if(u&&u.rangeCount!==0){l=u.anchorNode;var p=u.anchorOffset,g=u.focusNode;u=u.focusOffset;try{l.nodeType,g.nodeType}catch{l=null;break e}var T=0,k=-1,G=-1,ie=0,Me=0,we=n,Se=null;t:for(;;){for(var je;we!==l||p!==0&&we.nodeType!==3||(k=T+p),we!==g||u!==0&&we.nodeType!==3||(G=T+u),we.nodeType===3&&(T+=we.nodeValue.length),(je=we.firstChild)!==null;)Se=we,we=je;for(;;){if(we===n)break t;if(Se===l&&++ie===p&&(k=T),Se===g&&++Me===u&&(G=T),(je=we.nextSibling)!==null)break;we=Se,Se=we.parentNode}we=je}l=k===-1||G===-1?null:{start:k,end:G}}else l=null}l=l||{start:0,end:0}}else l=null;for(Xc={focusedElem:n,selectionRange:l},ba=!1,$e=r;$e!==null;)if(r=$e,n=r.child,(r.subtreeFlags&1028)!==0&&n!==null)n.return=r,$e=n;else for(;$e!==null;){r=$e;try{var Ze=r.alternate;if((r.flags&1024)!==0)switch(r.tag){case 0:case 11:case 15:break;case 1:if(Ze!==null){var tt=Ze.memoizedProps,Qt=Ze.memoizedState,Z=r.stateNode,X=Z.getSnapshotBeforeUpdate(r.elementType===r.type?tt:ui(r.type,tt),Qt);Z.__reactInternalSnapshotBeforeUpdate=X}break;case 3:var Q=r.stateNode.containerInfo;Q.nodeType===1?Q.textContent="":Q.nodeType===9&&Q.documentElement&&Q.removeChild(Q.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Le){Kt(r,r.return,Le)}if(n=r.sibling,n!==null){n.return=r.return,$e=n;break}$e=r.return}return Ze=im,im=!1,Ze}function Go(n,r,l){var u=r.updateQueue;if(u=u!==null?u.lastEffect:null,u!==null){var p=u=u.next;do{if((p.tag&n)===n){var g=p.destroy;p.destroy=void 0,g!==void 0&&Du(r,l,g)}p=p.next}while(p!==u)}}function ul(n,r){if(r=r.updateQueue,r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&n)===n){var u=l.create;l.destroy=u()}l=l.next}while(l!==r)}}function Iu(n){var r=n.ref;if(r!==null){var l=n.stateNode;n.tag,n=l,typeof r=="function"?r(n):r.current=n}}function rm(n){var r=n.alternate;r!==null&&(n.alternate=null,rm(r)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(r=n.stateNode,r!==null&&(delete r[Si],delete r[No],delete r[Kc],delete r[qv],delete r[Yv])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function sm(n){return n.tag===5||n.tag===3||n.tag===4}function om(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||sm(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Uu(n,r,l){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?l.nodeType===8?l.parentNode.insertBefore(n,r):l.insertBefore(n,r):(l.nodeType===8?(r=l.parentNode,r.insertBefore(n,l)):(r=l,r.appendChild(n)),l=l._reactRootContainer,l!=null||r.onclick!==null||(r.onclick=Va));else if(u!==4&&(n=n.child,n!==null))for(Uu(n,r,l),n=n.sibling;n!==null;)Uu(n,r,l),n=n.sibling}function Fu(n,r,l){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?l.insertBefore(n,r):l.appendChild(n);else if(u!==4&&(n=n.child,n!==null))for(Fu(n,r,l),n=n.sibling;n!==null;)Fu(n,r,l),n=n.sibling}var pn=null,di=!1;function fr(n,r,l){for(l=l.child;l!==null;)am(n,r,l),l=l.sibling}function am(n,r,l){if(pt&&typeof pt.onCommitFiberUnmount=="function")try{pt.onCommitFiberUnmount(rt,l)}catch{}switch(l.tag){case 5:En||Ds(l,r);case 6:var u=pn,p=di;pn=null,fr(n,r,l),pn=u,di=p,pn!==null&&(di?(n=pn,l=l.stateNode,n.nodeType===8?n.parentNode.removeChild(l):n.removeChild(l)):pn.removeChild(l.stateNode));break;case 18:pn!==null&&(di?(n=pn,l=l.stateNode,n.nodeType===8?$c(n.parentNode,l):n.nodeType===1&&$c(n,l),So(n)):$c(pn,l.stateNode));break;case 4:u=pn,p=di,pn=l.stateNode.containerInfo,di=!0,fr(n,r,l),pn=u,di=p;break;case 0:case 11:case 14:case 15:if(!En&&(u=l.updateQueue,u!==null&&(u=u.lastEffect,u!==null))){p=u=u.next;do{var g=p,T=g.destroy;g=g.tag,T!==void 0&&((g&2)!==0||(g&4)!==0)&&Du(l,r,T),p=p.next}while(p!==u)}fr(n,r,l);break;case 1:if(!En&&(Ds(l,r),u=l.stateNode,typeof u.componentWillUnmount=="function"))try{u.props=l.memoizedProps,u.state=l.memoizedState,u.componentWillUnmount()}catch(k){Kt(l,r,k)}fr(n,r,l);break;case 21:fr(n,r,l);break;case 22:l.mode&1?(En=(u=En)||l.memoizedState!==null,fr(n,r,l),En=u):fr(n,r,l);break;default:fr(n,r,l)}}function lm(n){var r=n.updateQueue;if(r!==null){n.updateQueue=null;var l=n.stateNode;l===null&&(l=n.stateNode=new u_),r.forEach(function(u){var p=y_.bind(null,n,u);l.has(u)||(l.add(u),u.then(p,p))})}}function fi(n,r){var l=r.deletions;if(l!==null)for(var u=0;u<l.length;u++){var p=l[u];try{var g=n,T=r,k=T;e:for(;k!==null;){switch(k.tag){case 5:pn=k.stateNode,di=!1;break e;case 3:pn=k.stateNode.containerInfo,di=!0;break e;case 4:pn=k.stateNode.containerInfo,di=!0;break e}k=k.return}if(pn===null)throw Error(t(160));am(g,T,p),pn=null,di=!1;var G=p.alternate;G!==null&&(G.return=null),p.return=null}catch(ie){Kt(p,r,ie)}}if(r.subtreeFlags&12854)for(r=r.child;r!==null;)cm(r,n),r=r.sibling}function cm(n,r){var l=n.alternate,u=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(fi(r,n),wi(n),u&4){try{Go(3,n,n.return),ul(3,n)}catch(tt){Kt(n,n.return,tt)}try{Go(5,n,n.return)}catch(tt){Kt(n,n.return,tt)}}break;case 1:fi(r,n),wi(n),u&512&&l!==null&&Ds(l,l.return);break;case 5:if(fi(r,n),wi(n),u&512&&l!==null&&Ds(l,l.return),n.flags&32){var p=n.stateNode;try{Pe(p,"")}catch(tt){Kt(n,n.return,tt)}}if(u&4&&(p=n.stateNode,p!=null)){var g=n.memoizedProps,T=l!==null?l.memoizedProps:g,k=n.type,G=n.updateQueue;if(n.updateQueue=null,G!==null)try{k==="input"&&g.type==="radio"&&g.name!=null&&ge(p,g),Oe(k,T);var ie=Oe(k,g);for(T=0;T<G.length;T+=2){var Me=G[T],we=G[T+1];Me==="style"?He(p,we):Me==="dangerouslySetInnerHTML"?Qe(p,we):Me==="children"?Pe(p,we):C(p,Me,we,ie)}switch(k){case"input":me(p,g);break;case"textarea":A(p,g);break;case"select":var Se=p._wrapperState.wasMultiple;p._wrapperState.wasMultiple=!!g.multiple;var je=g.value;je!=null?ut(p,!!g.multiple,je,!1):Se!==!!g.multiple&&(g.defaultValue!=null?ut(p,!!g.multiple,g.defaultValue,!0):ut(p,!!g.multiple,g.multiple?[]:"",!1))}p[No]=g}catch(tt){Kt(n,n.return,tt)}}break;case 6:if(fi(r,n),wi(n),u&4){if(n.stateNode===null)throw Error(t(162));p=n.stateNode,g=n.memoizedProps;try{p.nodeValue=g}catch(tt){Kt(n,n.return,tt)}}break;case 3:if(fi(r,n),wi(n),u&4&&l!==null&&l.memoizedState.isDehydrated)try{So(r.containerInfo)}catch(tt){Kt(n,n.return,tt)}break;case 4:fi(r,n),wi(n);break;case 13:fi(r,n),wi(n),p=n.child,p.flags&8192&&(g=p.memoizedState!==null,p.stateNode.isHidden=g,!g||p.alternate!==null&&p.alternate.memoizedState!==null||(zu=q())),u&4&&lm(n);break;case 22:if(Me=l!==null&&l.memoizedState!==null,n.mode&1?(En=(ie=En)||Me,fi(r,n),En=ie):fi(r,n),wi(n),u&8192){if(ie=n.memoizedState!==null,(n.stateNode.isHidden=ie)&&!Me&&(n.mode&1)!==0)for($e=n,Me=n.child;Me!==null;){for(we=$e=Me;$e!==null;){switch(Se=$e,je=Se.child,Se.tag){case 0:case 11:case 14:case 15:Go(4,Se,Se.return);break;case 1:Ds(Se,Se.return);var Ze=Se.stateNode;if(typeof Ze.componentWillUnmount=="function"){u=Se,l=Se.return;try{r=u,Ze.props=r.memoizedProps,Ze.state=r.memoizedState,Ze.componentWillUnmount()}catch(tt){Kt(u,l,tt)}}break;case 5:Ds(Se,Se.return);break;case 22:if(Se.memoizedState!==null){fm(we);continue}}je!==null?(je.return=Se,$e=je):fm(we)}Me=Me.sibling}e:for(Me=null,we=n;;){if(we.tag===5){if(Me===null){Me=we;try{p=we.stateNode,ie?(g=p.style,typeof g.setProperty=="function"?g.setProperty("display","none","important"):g.display="none"):(k=we.stateNode,G=we.memoizedProps.style,T=G!=null&&G.hasOwnProperty("display")?G.display:null,k.style.display=Ae("display",T))}catch(tt){Kt(n,n.return,tt)}}}else if(we.tag===6){if(Me===null)try{we.stateNode.nodeValue=ie?"":we.memoizedProps}catch(tt){Kt(n,n.return,tt)}}else if((we.tag!==22&&we.tag!==23||we.memoizedState===null||we===n)&&we.child!==null){we.child.return=we,we=we.child;continue}if(we===n)break e;for(;we.sibling===null;){if(we.return===null||we.return===n)break e;Me===we&&(Me=null),we=we.return}Me===we&&(Me=null),we.sibling.return=we.return,we=we.sibling}}break;case 19:fi(r,n),wi(n),u&4&&lm(n);break;case 21:break;default:fi(r,n),wi(n)}}function wi(n){var r=n.flags;if(r&2){try{e:{for(var l=n.return;l!==null;){if(sm(l)){var u=l;break e}l=l.return}throw Error(t(160))}switch(u.tag){case 5:var p=u.stateNode;u.flags&32&&(Pe(p,""),u.flags&=-33);var g=om(n);Fu(n,g,p);break;case 3:case 4:var T=u.stateNode.containerInfo,k=om(n);Uu(n,k,T);break;default:throw Error(t(161))}}catch(G){Kt(n,n.return,G)}n.flags&=-3}r&4096&&(n.flags&=-4097)}function f_(n,r,l){$e=n,um(n)}function um(n,r,l){for(var u=(n.mode&1)!==0;$e!==null;){var p=$e,g=p.child;if(p.tag===22&&u){var T=p.memoizedState!==null||cl;if(!T){var k=p.alternate,G=k!==null&&k.memoizedState!==null||En;k=cl;var ie=En;if(cl=T,(En=G)&&!ie)for($e=p;$e!==null;)T=$e,G=T.child,T.tag===22&&T.memoizedState!==null?hm(p):G!==null?(G.return=T,$e=G):hm(p);for(;g!==null;)$e=g,um(g),g=g.sibling;$e=p,cl=k,En=ie}dm(n)}else(p.subtreeFlags&8772)!==0&&g!==null?(g.return=p,$e=g):dm(n)}}function dm(n){for(;$e!==null;){var r=$e;if((r.flags&8772)!==0){var l=r.alternate;try{if((r.flags&8772)!==0)switch(r.tag){case 0:case 11:case 15:En||ul(5,r);break;case 1:var u=r.stateNode;if(r.flags&4&&!En)if(l===null)u.componentDidMount();else{var p=r.elementType===r.type?l.memoizedProps:ui(r.type,l.memoizedProps);u.componentDidUpdate(p,l.memoizedState,u.__reactInternalSnapshotBeforeUpdate)}var g=r.updateQueue;g!==null&&fp(r,g,u);break;case 3:var T=r.updateQueue;if(T!==null){if(l=null,r.child!==null)switch(r.child.tag){case 5:l=r.child.stateNode;break;case 1:l=r.child.stateNode}fp(r,T,l)}break;case 5:var k=r.stateNode;if(l===null&&r.flags&4){l=k;var G=r.memoizedProps;switch(r.type){case"button":case"input":case"select":case"textarea":G.autoFocus&&l.focus();break;case"img":G.src&&(l.src=G.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(r.memoizedState===null){var ie=r.alternate;if(ie!==null){var Me=ie.memoizedState;if(Me!==null){var we=Me.dehydrated;we!==null&&So(we)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}En||r.flags&512&&Iu(r)}catch(Se){Kt(r,r.return,Se)}}if(r===n){$e=null;break}if(l=r.sibling,l!==null){l.return=r.return,$e=l;break}$e=r.return}}function fm(n){for(;$e!==null;){var r=$e;if(r===n){$e=null;break}var l=r.sibling;if(l!==null){l.return=r.return,$e=l;break}$e=r.return}}function hm(n){for(;$e!==null;){var r=$e;try{switch(r.tag){case 0:case 11:case 15:var l=r.return;try{ul(4,r)}catch(G){Kt(r,l,G)}break;case 1:var u=r.stateNode;if(typeof u.componentDidMount=="function"){var p=r.return;try{u.componentDidMount()}catch(G){Kt(r,p,G)}}var g=r.return;try{Iu(r)}catch(G){Kt(r,g,G)}break;case 5:var T=r.return;try{Iu(r)}catch(G){Kt(r,T,G)}}}catch(G){Kt(r,r.return,G)}if(r===n){$e=null;break}var k=r.sibling;if(k!==null){k.return=r.return,$e=k;break}$e=r.return}}var h_=Math.ceil,dl=E.ReactCurrentDispatcher,Ou=E.ReactCurrentOwner,ri=E.ReactCurrentBatchConfig,Rt=0,cn=null,en=null,mn=0,$n=0,Is=ar(0),sn=0,Wo=null,Vr=0,fl=0,ku=0,jo=null,On=null,zu=0,Us=1/0,Gi=null,hl=!1,Bu=null,hr=null,pl=!1,pr=null,ml=0,Xo=0,Vu=null,gl=-1,vl=0;function Pn(){return(Rt&6)!==0?q():gl!==-1?gl:gl=q()}function mr(n){return(n.mode&1)===0?1:(Rt&2)!==0&&mn!==0?mn&-mn:Kv.transition!==null?(vl===0&&(vl=Rn()),vl):(n=wt,n!==0||(n=window.event,n=n===void 0?16:mh(n.type)),n)}function hi(n,r,l,u){if(50<Xo)throw Xo=0,Vu=null,Error(t(185));Jt(n,l,u),((Rt&2)===0||n!==cn)&&(n===cn&&((Rt&2)===0&&(fl|=l),sn===4&&gr(n,mn)),kn(n,u),l===1&&Rt===0&&(r.mode&1)===0&&(Us=q()+500,ja&&cr()))}function kn(n,r){var l=n.callbackNode;Nr(n,r);var u=ai(n,n===cn?mn:0);if(u===0)l!==null&&$(l),n.callbackNode=null,n.callbackPriority=0;else if(r=u&-u,n.callbackPriority!==r){if(l!=null&&$(l),r===1)n.tag===0?$v(mm.bind(null,n)):ep(mm.bind(null,n)),jv(function(){(Rt&6)===0&&cr()}),l=null;else{switch(ah(u)){case 1:l=ke;break;case 4:l=Ke;break;case 16:l=We;break;case 536870912:l=ft;break;default:l=We}l=Em(l,pm.bind(null,n))}n.callbackPriority=r,n.callbackNode=l}}function pm(n,r){if(gl=-1,vl=0,(Rt&6)!==0)throw Error(t(327));var l=n.callbackNode;if(Fs()&&n.callbackNode!==l)return null;var u=ai(n,n===cn?mn:0);if(u===0)return null;if((u&30)!==0||(u&n.expiredLanes)!==0||r)r=_l(n,u);else{r=u;var p=Rt;Rt|=2;var g=vm();(cn!==n||mn!==r)&&(Gi=null,Us=q()+500,Gr(n,r));do try{g_();break}catch(k){gm(n,k)}while(!0);su(),dl.current=g,Rt=p,en!==null?r=0:(cn=null,mn=0,r=sn)}if(r!==0){if(r===2&&(p=zt(n),p!==0&&(u=p,r=Hu(n,p))),r===1)throw l=Wo,Gr(n,0),gr(n,u),kn(n,q()),l;if(r===6)gr(n,u);else{if(p=n.current.alternate,(u&30)===0&&!p_(p)&&(r=_l(n,u),r===2&&(g=zt(n),g!==0&&(u=g,r=Hu(n,g))),r===1))throw l=Wo,Gr(n,0),gr(n,u),kn(n,q()),l;switch(n.finishedWork=p,n.finishedLanes=u,r){case 0:case 1:throw Error(t(345));case 2:Wr(n,On,Gi);break;case 3:if(gr(n,u),(u&130023424)===u&&(r=zu+500-q(),10<r)){if(ai(n,0)!==0)break;if(p=n.suspendedLanes,(p&u)!==u){Pn(),n.pingedLanes|=n.suspendedLanes&p;break}n.timeoutHandle=Yc(Wr.bind(null,n,On,Gi),r);break}Wr(n,On,Gi);break;case 4:if(gr(n,u),(u&4194240)===u)break;for(r=n.eventTimes,p=-1;0<u;){var T=31-Ct(u);g=1<<T,T=r[T],T>p&&(p=T),u&=~g}if(u=p,u=q()-u,u=(120>u?120:480>u?480:1080>u?1080:1920>u?1920:3e3>u?3e3:4320>u?4320:1960*h_(u/1960))-u,10<u){n.timeoutHandle=Yc(Wr.bind(null,n,On,Gi),u);break}Wr(n,On,Gi);break;case 5:Wr(n,On,Gi);break;default:throw Error(t(329))}}}return kn(n,q()),n.callbackNode===l?pm.bind(null,n):null}function Hu(n,r){var l=jo;return n.current.memoizedState.isDehydrated&&(Gr(n,r).flags|=256),n=_l(n,r),n!==2&&(r=On,On=l,r!==null&&Gu(r)),n}function Gu(n){On===null?On=n:On.push.apply(On,n)}function p_(n){for(var r=n;;){if(r.flags&16384){var l=r.updateQueue;if(l!==null&&(l=l.stores,l!==null))for(var u=0;u<l.length;u++){var p=l[u],g=p.getSnapshot;p=p.value;try{if(!li(g(),p))return!1}catch{return!1}}}if(l=r.child,r.subtreeFlags&16384&&l!==null)l.return=r,r=l;else{if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return!0;r=r.return}r.sibling.return=r.return,r=r.sibling}}return!0}function gr(n,r){for(r&=~ku,r&=~fl,n.suspendedLanes|=r,n.pingedLanes&=~r,n=n.expirationTimes;0<r;){var l=31-Ct(r),u=1<<l;n[l]=-1,r&=~u}}function mm(n){if((Rt&6)!==0)throw Error(t(327));Fs();var r=ai(n,0);if((r&1)===0)return kn(n,q()),null;var l=_l(n,r);if(n.tag!==0&&l===2){var u=zt(n);u!==0&&(r=u,l=Hu(n,u))}if(l===1)throw l=Wo,Gr(n,0),gr(n,r),kn(n,q()),l;if(l===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=r,Wr(n,On,Gi),kn(n,q()),null}function Wu(n,r){var l=Rt;Rt|=1;try{return n(r)}finally{Rt=l,Rt===0&&(Us=q()+500,ja&&cr())}}function Hr(n){pr!==null&&pr.tag===0&&(Rt&6)===0&&Fs();var r=Rt;Rt|=1;var l=ri.transition,u=wt;try{if(ri.transition=null,wt=1,n)return n()}finally{wt=u,ri.transition=l,Rt=r,(Rt&6)===0&&cr()}}function ju(){$n=Is.current,Ht(Is)}function Gr(n,r){n.finishedWork=null,n.finishedLanes=0;var l=n.timeoutHandle;if(l!==-1&&(n.timeoutHandle=-1,Wv(l)),en!==null)for(l=en.return;l!==null;){var u=l;switch(eu(u),u.tag){case 1:u=u.type.childContextTypes,u!=null&&Ga();break;case 3:Ls(),Ht(In),Ht(yn),hu();break;case 5:du(u);break;case 4:Ls();break;case 13:Ht(Xt);break;case 19:Ht(Xt);break;case 10:ou(u.type._context);break;case 22:case 23:ju()}l=l.return}if(cn=n,en=n=vr(n.current,null),mn=$n=r,sn=0,Wo=null,ku=fl=Vr=0,On=jo=null,kr!==null){for(r=0;r<kr.length;r++)if(l=kr[r],u=l.interleaved,u!==null){l.interleaved=null;var p=u.next,g=l.pending;if(g!==null){var T=g.next;g.next=p,u.next=T}l.pending=u}kr=null}return n}function gm(n,r){do{var l=en;try{if(su(),tl.current=sl,nl){for(var u=qt.memoizedState;u!==null;){var p=u.queue;p!==null&&(p.pending=null),u=u.next}nl=!1}if(Br=0,ln=rn=qt=null,ko=!1,zo=0,Ou.current=null,l===null||l.return===null){sn=1,Wo=r,en=null;break}e:{var g=n,T=l.return,k=l,G=r;if(r=mn,k.flags|=32768,G!==null&&typeof G=="object"&&typeof G.then=="function"){var ie=G,Me=k,we=Me.tag;if((Me.mode&1)===0&&(we===0||we===11||we===15)){var Se=Me.alternate;Se?(Me.updateQueue=Se.updateQueue,Me.memoizedState=Se.memoizedState,Me.lanes=Se.lanes):(Me.updateQueue=null,Me.memoizedState=null)}var je=Vp(T);if(je!==null){je.flags&=-257,Hp(je,T,k,g,r),je.mode&1&&Bp(g,ie,r),r=je,G=ie;var Ze=r.updateQueue;if(Ze===null){var tt=new Set;tt.add(G),r.updateQueue=tt}else Ze.add(G);break e}else{if((r&1)===0){Bp(g,ie,r),Xu();break e}G=Error(t(426))}}else if(Wt&&k.mode&1){var Qt=Vp(T);if(Qt!==null){(Qt.flags&65536)===0&&(Qt.flags|=256),Hp(Qt,T,k,g,r),iu(Ns(G,k));break e}}g=G=Ns(G,k),sn!==4&&(sn=2),jo===null?jo=[g]:jo.push(g),g=T;do{switch(g.tag){case 3:g.flags|=65536,r&=-r,g.lanes|=r;var Z=kp(g,G,r);dp(g,Z);break e;case 1:k=G;var X=g.type,Q=g.stateNode;if((g.flags&128)===0&&(typeof X.getDerivedStateFromError=="function"||Q!==null&&typeof Q.componentDidCatch=="function"&&(hr===null||!hr.has(Q)))){g.flags|=65536,r&=-r,g.lanes|=r;var Le=zp(g,k,r);dp(g,Le);break e}}g=g.return}while(g!==null)}xm(l)}catch(it){r=it,en===l&&l!==null&&(en=l=l.return);continue}break}while(!0)}function vm(){var n=dl.current;return dl.current=sl,n===null?sl:n}function Xu(){(sn===0||sn===3||sn===2)&&(sn=4),cn===null||(Vr&268435455)===0&&(fl&268435455)===0||gr(cn,mn)}function _l(n,r){var l=Rt;Rt|=2;var u=vm();(cn!==n||mn!==r)&&(Gi=null,Gr(n,r));do try{m_();break}catch(p){gm(n,p)}while(!0);if(su(),Rt=l,dl.current=u,en!==null)throw Error(t(261));return cn=null,mn=0,sn}function m_(){for(;en!==null;)_m(en)}function g_(){for(;en!==null&&!oe();)_m(en)}function _m(n){var r=Mm(n.alternate,n,$n);n.memoizedProps=n.pendingProps,r===null?xm(n):en=r,Ou.current=null}function xm(n){var r=n;do{var l=r.alternate;if(n=r.return,(r.flags&32768)===0){if(l=l_(l,r,$n),l!==null){en=l;return}}else{if(l=c_(l,r),l!==null){l.flags&=32767,en=l;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{sn=6,en=null;return}}if(r=r.sibling,r!==null){en=r;return}en=r=n}while(r!==null);sn===0&&(sn=5)}function Wr(n,r,l){var u=wt,p=ri.transition;try{ri.transition=null,wt=1,v_(n,r,l,u)}finally{ri.transition=p,wt=u}return null}function v_(n,r,l,u){do Fs();while(pr!==null);if((Rt&6)!==0)throw Error(t(327));l=n.finishedWork;var p=n.finishedLanes;if(l===null)return null;if(n.finishedWork=null,n.finishedLanes=0,l===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var g=l.lanes|l.childLanes;if(xn(n,g),n===cn&&(en=cn=null,mn=0),(l.subtreeFlags&2064)===0&&(l.flags&2064)===0||pl||(pl=!0,Em(We,function(){return Fs(),null})),g=(l.flags&15990)!==0,(l.subtreeFlags&15990)!==0||g){g=ri.transition,ri.transition=null;var T=wt;wt=1;var k=Rt;Rt|=4,Ou.current=null,d_(n,l),cm(l,n),Ov(Xc),ba=!!jc,Xc=jc=null,n.current=l,f_(l),ae(),Rt=k,wt=T,ri.transition=g}else n.current=l;if(pl&&(pl=!1,pr=n,ml=p),g=n.pendingLanes,g===0&&(hr=null),Lt(l.stateNode),kn(n,q()),r!==null)for(u=n.onRecoverableError,l=0;l<r.length;l++)p=r[l],u(p.value,{componentStack:p.stack,digest:p.digest});if(hl)throw hl=!1,n=Bu,Bu=null,n;return(ml&1)!==0&&n.tag!==0&&Fs(),g=n.pendingLanes,(g&1)!==0?n===Vu?Xo++:(Xo=0,Vu=n):Xo=0,cr(),null}function Fs(){if(pr!==null){var n=ah(ml),r=ri.transition,l=wt;try{if(ri.transition=null,wt=16>n?16:n,pr===null)var u=!1;else{if(n=pr,pr=null,ml=0,(Rt&6)!==0)throw Error(t(331));var p=Rt;for(Rt|=4,$e=n.current;$e!==null;){var g=$e,T=g.child;if(($e.flags&16)!==0){var k=g.deletions;if(k!==null){for(var G=0;G<k.length;G++){var ie=k[G];for($e=ie;$e!==null;){var Me=$e;switch(Me.tag){case 0:case 11:case 15:Go(8,Me,g)}var we=Me.child;if(we!==null)we.return=Me,$e=we;else for(;$e!==null;){Me=$e;var Se=Me.sibling,je=Me.return;if(rm(Me),Me===ie){$e=null;break}if(Se!==null){Se.return=je,$e=Se;break}$e=je}}}var Ze=g.alternate;if(Ze!==null){var tt=Ze.child;if(tt!==null){Ze.child=null;do{var Qt=tt.sibling;tt.sibling=null,tt=Qt}while(tt!==null)}}$e=g}}if((g.subtreeFlags&2064)!==0&&T!==null)T.return=g,$e=T;else e:for(;$e!==null;){if(g=$e,(g.flags&2048)!==0)switch(g.tag){case 0:case 11:case 15:Go(9,g,g.return)}var Z=g.sibling;if(Z!==null){Z.return=g.return,$e=Z;break e}$e=g.return}}var X=n.current;for($e=X;$e!==null;){T=$e;var Q=T.child;if((T.subtreeFlags&2064)!==0&&Q!==null)Q.return=T,$e=Q;else e:for(T=X;$e!==null;){if(k=$e,(k.flags&2048)!==0)try{switch(k.tag){case 0:case 11:case 15:ul(9,k)}}catch(it){Kt(k,k.return,it)}if(k===T){$e=null;break e}var Le=k.sibling;if(Le!==null){Le.return=k.return,$e=Le;break e}$e=k.return}}if(Rt=p,cr(),pt&&typeof pt.onPostCommitFiberRoot=="function")try{pt.onPostCommitFiberRoot(rt,n)}catch{}u=!0}return u}finally{wt=l,ri.transition=r}}return!1}function ym(n,r,l){r=Ns(l,r),r=kp(n,r,1),n=dr(n,r,1),r=Pn(),n!==null&&(Jt(n,1,r),kn(n,r))}function Kt(n,r,l){if(n.tag===3)ym(n,n,l);else for(;r!==null;){if(r.tag===3){ym(r,n,l);break}else if(r.tag===1){var u=r.stateNode;if(typeof r.type.getDerivedStateFromError=="function"||typeof u.componentDidCatch=="function"&&(hr===null||!hr.has(u))){n=Ns(l,n),n=zp(r,n,1),r=dr(r,n,1),n=Pn(),r!==null&&(Jt(r,1,n),kn(r,n));break}}r=r.return}}function __(n,r,l){var u=n.pingCache;u!==null&&u.delete(r),r=Pn(),n.pingedLanes|=n.suspendedLanes&l,cn===n&&(mn&l)===l&&(sn===4||sn===3&&(mn&130023424)===mn&&500>q()-zu?Gr(n,0):ku|=l),kn(n,r)}function Sm(n,r){r===0&&((n.mode&1)===0?r=1:(r=Et,Et<<=1,(Et&130023424)===0&&(Et=4194304)));var l=Pn();n=Bi(n,r),n!==null&&(Jt(n,r,l),kn(n,l))}function x_(n){var r=n.memoizedState,l=0;r!==null&&(l=r.retryLane),Sm(n,l)}function y_(n,r){var l=0;switch(n.tag){case 13:var u=n.stateNode,p=n.memoizedState;p!==null&&(l=p.retryLane);break;case 19:u=n.stateNode;break;default:throw Error(t(314))}u!==null&&u.delete(r),Sm(n,l)}var Mm;Mm=function(n,r,l){if(n!==null)if(n.memoizedProps!==r.pendingProps||In.current)Fn=!0;else{if((n.lanes&l)===0&&(r.flags&128)===0)return Fn=!1,a_(n,r,l);Fn=(n.flags&131072)!==0}else Fn=!1,Wt&&(r.flags&1048576)!==0&&tp(r,qa,r.index);switch(r.lanes=0,r.tag){case 2:var u=r.type;ll(n,r),n=r.pendingProps;var p=ws(r,yn.current);Ps(r,l),p=gu(null,r,u,n,p,l);var g=vu();return r.flags|=1,typeof p=="object"&&p!==null&&typeof p.render=="function"&&p.$$typeof===void 0?(r.tag=1,r.memoizedState=null,r.updateQueue=null,Un(u)?(g=!0,Wa(r)):g=!1,r.memoizedState=p.state!==null&&p.state!==void 0?p.state:null,cu(r),p.updater=ol,r.stateNode=p,p._reactInternals=r,Eu(r,u,n,l),r=Cu(null,r,u,!0,g,l)):(r.tag=0,Wt&&g&&Qc(r),bn(null,r,p,l),r=r.child),r;case 16:u=r.elementType;e:{switch(ll(n,r),n=r.pendingProps,p=u._init,u=p(u._payload),r.type=u,p=r.tag=M_(u),n=ui(u,n),p){case 0:r=Au(null,r,u,n,l);break e;case 1:r=Yp(null,r,u,n,l);break e;case 11:r=Gp(null,r,u,n,l);break e;case 14:r=Wp(null,r,u,ui(u.type,n),l);break e}throw Error(t(306,u,""))}return r;case 0:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:ui(u,p),Au(n,r,u,p,l);case 1:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:ui(u,p),Yp(n,r,u,p,l);case 3:e:{if($p(r),n===null)throw Error(t(387));u=r.pendingProps,g=r.memoizedState,p=g.element,up(n,r),Qa(r,u,null,l);var T=r.memoizedState;if(u=T.element,g.isDehydrated)if(g={element:u,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},r.updateQueue.baseState=g,r.memoizedState=g,r.flags&256){p=Ns(Error(t(423)),r),r=Kp(n,r,u,l,p);break e}else if(u!==p){p=Ns(Error(t(424)),r),r=Kp(n,r,u,l,p);break e}else for(Yn=or(r.stateNode.containerInfo.firstChild),qn=r,Wt=!0,ci=null,l=lp(r,null,u,l),r.child=l;l;)l.flags=l.flags&-3|4096,l=l.sibling;else{if(Cs(),u===p){r=Hi(n,r,l);break e}bn(n,r,u,l)}r=r.child}return r;case 5:return hp(r),n===null&&nu(r),u=r.type,p=r.pendingProps,g=n!==null?n.memoizedProps:null,T=p.children,qc(u,p)?T=null:g!==null&&qc(u,g)&&(r.flags|=32),qp(n,r),bn(n,r,T,l),r.child;case 6:return n===null&&nu(r),null;case 13:return Zp(n,r,l);case 4:return uu(r,r.stateNode.containerInfo),u=r.pendingProps,n===null?r.child=Rs(r,null,u,l):bn(n,r,u,l),r.child;case 11:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:ui(u,p),Gp(n,r,u,p,l);case 7:return bn(n,r,r.pendingProps,l),r.child;case 8:return bn(n,r,r.pendingProps.children,l),r.child;case 12:return bn(n,r,r.pendingProps.children,l),r.child;case 10:e:{if(u=r.type._context,p=r.pendingProps,g=r.memoizedProps,T=p.value,Bt(Ka,u._currentValue),u._currentValue=T,g!==null)if(li(g.value,T)){if(g.children===p.children&&!In.current){r=Hi(n,r,l);break e}}else for(g=r.child,g!==null&&(g.return=r);g!==null;){var k=g.dependencies;if(k!==null){T=g.child;for(var G=k.firstContext;G!==null;){if(G.context===u){if(g.tag===1){G=Vi(-1,l&-l),G.tag=2;var ie=g.updateQueue;if(ie!==null){ie=ie.shared;var Me=ie.pending;Me===null?G.next=G:(G.next=Me.next,Me.next=G),ie.pending=G}}g.lanes|=l,G=g.alternate,G!==null&&(G.lanes|=l),au(g.return,l,r),k.lanes|=l;break}G=G.next}}else if(g.tag===10)T=g.type===r.type?null:g.child;else if(g.tag===18){if(T=g.return,T===null)throw Error(t(341));T.lanes|=l,k=T.alternate,k!==null&&(k.lanes|=l),au(T,l,r),T=g.sibling}else T=g.child;if(T!==null)T.return=g;else for(T=g;T!==null;){if(T===r){T=null;break}if(g=T.sibling,g!==null){g.return=T.return,T=g;break}T=T.return}g=T}bn(n,r,p.children,l),r=r.child}return r;case 9:return p=r.type,u=r.pendingProps.children,Ps(r,l),p=ni(p),u=u(p),r.flags|=1,bn(n,r,u,l),r.child;case 14:return u=r.type,p=ui(u,r.pendingProps),p=ui(u.type,p),Wp(n,r,u,p,l);case 15:return jp(n,r,r.type,r.pendingProps,l);case 17:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:ui(u,p),ll(n,r),r.tag=1,Un(u)?(n=!0,Wa(r)):n=!1,Ps(r,l),Fp(r,u,p),Eu(r,u,p,l),Cu(null,r,u,!0,n,l);case 19:return Qp(n,r,l);case 22:return Xp(n,r,l)}throw Error(t(156,r.tag))};function Em(n,r){return L(n,r)}function S_(n,r,l,u){this.tag=n,this.key=l,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=r,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=u,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function si(n,r,l,u){return new S_(n,r,l,u)}function qu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function M_(n){if(typeof n=="function")return qu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===Y)return 11;if(n===se)return 14}return 2}function vr(n,r){var l=n.alternate;return l===null?(l=si(n.tag,r,n.key,n.mode),l.elementType=n.elementType,l.type=n.type,l.stateNode=n.stateNode,l.alternate=n,n.alternate=l):(l.pendingProps=r,l.type=n.type,l.flags=0,l.subtreeFlags=0,l.deletions=null),l.flags=n.flags&14680064,l.childLanes=n.childLanes,l.lanes=n.lanes,l.child=n.child,l.memoizedProps=n.memoizedProps,l.memoizedState=n.memoizedState,l.updateQueue=n.updateQueue,r=n.dependencies,l.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext},l.sibling=n.sibling,l.index=n.index,l.ref=n.ref,l}function xl(n,r,l,u,p,g){var T=2;if(u=n,typeof n=="function")qu(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case F:return jr(l.children,p,g,r);case V:T=8,p|=8;break;case b:return n=si(12,l,r,p|2),n.elementType=b,n.lanes=g,n;case ee:return n=si(13,l,r,p),n.elementType=ee,n.lanes=g,n;case de:return n=si(19,l,r,p),n.elementType=de,n.lanes=g,n;case le:return yl(l,p,g,r);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case R:T=10;break e;case H:T=9;break e;case Y:T=11;break e;case se:T=14;break e;case te:T=16,u=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return r=si(T,l,r,p),r.elementType=n,r.type=u,r.lanes=g,r}function jr(n,r,l,u){return n=si(7,n,u,r),n.lanes=l,n}function yl(n,r,l,u){return n=si(22,n,u,r),n.elementType=le,n.lanes=l,n.stateNode={isHidden:!1},n}function Yu(n,r,l){return n=si(6,n,null,r),n.lanes=l,n}function $u(n,r,l){return r=si(4,n.children!==null?n.children:[],n.key,r),r.lanes=l,r.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},r}function E_(n,r,l,u,p){this.tag=r,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=_n(0),this.expirationTimes=_n(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=_n(0),this.identifierPrefix=u,this.onRecoverableError=p,this.mutableSourceEagerHydrationData=null}function Ku(n,r,l,u,p,g,T,k,G){return n=new E_(n,r,l,k,G),r===1?(r=1,g===!0&&(r|=8)):r=0,g=si(3,null,null,r),n.current=g,g.stateNode=n,g.memoizedState={element:u,isDehydrated:l,cache:null,transitions:null,pendingSuspenseBoundaries:null},cu(g),n}function w_(n,r,l){var u=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:U,key:u==null?null:""+u,children:n,containerInfo:r,implementation:l}}function wm(n){if(!n)return lr;n=n._reactInternals;e:{if(Ui(n)!==n||n.tag!==1)throw Error(t(170));var r=n;do{switch(r.tag){case 3:r=r.stateNode.context;break e;case 1:if(Un(r.type)){r=r.stateNode.__reactInternalMemoizedMergedChildContext;break e}}r=r.return}while(r!==null);throw Error(t(171))}if(n.tag===1){var l=n.type;if(Un(l))return Jh(n,l,r)}return r}function Tm(n,r,l,u,p,g,T,k,G){return n=Ku(l,u,!0,n,p,g,T,k,G),n.context=wm(null),l=n.current,u=Pn(),p=mr(l),g=Vi(u,p),g.callback=r??null,dr(l,g,p),n.current.lanes=p,Jt(n,p,u),kn(n,u),n}function Sl(n,r,l,u){var p=r.current,g=Pn(),T=mr(p);return l=wm(l),r.context===null?r.context=l:r.pendingContext=l,r=Vi(g,T),r.payload={element:n},u=u===void 0?null:u,u!==null&&(r.callback=u),n=dr(p,r,T),n!==null&&(hi(n,p,T,g),Ja(n,p,T)),T}function Ml(n){return n=n.current,n.child?(n.child.tag===5,n.child.stateNode):null}function Am(n,r){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var l=n.retryLane;n.retryLane=l!==0&&l<r?l:r}}function Zu(n,r){Am(n,r),(n=n.alternate)&&Am(n,r)}function T_(){return null}var Cm=typeof reportError=="function"?reportError:function(n){console.error(n)};function Ju(n){this._internalRoot=n}El.prototype.render=Ju.prototype.render=function(n){var r=this._internalRoot;if(r===null)throw Error(t(409));Sl(n,r,null,null)},El.prototype.unmount=Ju.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var r=n.containerInfo;Hr(function(){Sl(null,n,null,null)}),r[Fi]=null}};function El(n){this._internalRoot=n}El.prototype.unstable_scheduleHydration=function(n){if(n){var r=uh();n={blockedOn:null,target:n,priority:r};for(var l=0;l<ir.length&&r!==0&&r<ir[l].priority;l++);ir.splice(l,0,n),l===0&&hh(n)}};function Qu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function wl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Rm(){}function A_(n,r,l,u,p){if(p){if(typeof u=="function"){var g=u;u=function(){var ie=Ml(T);g.call(ie)}}var T=Tm(r,u,n,0,null,!1,!1,"",Rm);return n._reactRootContainer=T,n[Fi]=T.current,Po(n.nodeType===8?n.parentNode:n),Hr(),T}for(;p=n.lastChild;)n.removeChild(p);if(typeof u=="function"){var k=u;u=function(){var ie=Ml(G);k.call(ie)}}var G=Ku(n,0,!1,null,null,!1,!1,"",Rm);return n._reactRootContainer=G,n[Fi]=G.current,Po(n.nodeType===8?n.parentNode:n),Hr(function(){Sl(r,G,l,u)}),G}function Tl(n,r,l,u,p){var g=l._reactRootContainer;if(g){var T=g;if(typeof p=="function"){var k=p;p=function(){var G=Ml(T);k.call(G)}}Sl(r,T,n,p)}else T=A_(l,r,n,p,u);return Ml(T)}lh=function(n){switch(n.tag){case 3:var r=n.stateNode;if(r.current.memoizedState.isDehydrated){var l=nn(r.pendingLanes);l!==0&&(Dr(r,l|1),kn(r,q()),(Rt&6)===0&&(Us=q()+500,cr()))}break;case 13:Hr(function(){var u=Bi(n,1);if(u!==null){var p=Pn();hi(u,n,1,p)}}),Zu(n,1)}},wc=function(n){if(n.tag===13){var r=Bi(n,134217728);if(r!==null){var l=Pn();hi(r,n,134217728,l)}Zu(n,134217728)}},ch=function(n){if(n.tag===13){var r=mr(n),l=Bi(n,r);if(l!==null){var u=Pn();hi(l,n,r,u)}Zu(n,r)}},uh=function(){return wt},dh=function(n,r){var l=wt;try{return wt=n,r()}finally{wt=l}},Re=function(n,r,l){switch(r){case"input":if(me(n,l),r=l.name,l.type==="radio"&&r!=null){for(l=n;l.parentNode;)l=l.parentNode;for(l=l.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]'),r=0;r<l.length;r++){var u=l[r];if(u!==n&&u.form===n.form){var p=Ha(u);if(!p)throw Error(t(90));Nt(u),me(u,p)}}}break;case"textarea":A(n,l);break;case"select":r=l.value,r!=null&&ut(n,!!l.multiple,r,!1)}},gt=Wu,Dt=Hr;var C_={usingClientEntryPoint:!1,Events:[Do,Ms,Ha,_e,Je,Wu]},qo={findFiberByHostInstance:Ir,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},R_={bundleType:qo.bundleType,version:qo.version,rendererPackageName:qo.rendererPackageName,rendererConfig:qo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:E.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=Ta(n),n===null?null:n.stateNode},findFiberByHostInstance:qo.findFiberByHostInstance||T_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Al=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Al.isDisabled&&Al.supportsFiber)try{rt=Al.inject(R_),pt=Al}catch{}}return zn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=C_,zn.createPortal=function(n,r){var l=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Qu(r))throw Error(t(200));return w_(n,r,null,l)},zn.createRoot=function(n,r){if(!Qu(n))throw Error(t(299));var l=!1,u="",p=Cm;return r!=null&&(r.unstable_strictMode===!0&&(l=!0),r.identifierPrefix!==void 0&&(u=r.identifierPrefix),r.onRecoverableError!==void 0&&(p=r.onRecoverableError)),r=Ku(n,1,!1,null,null,l,!1,u,p),n[Fi]=r.current,Po(n.nodeType===8?n.parentNode:n),new Ju(r)},zn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var r=n._reactInternals;if(r===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=Ta(r),n=n===null?null:n.stateNode,n},zn.flushSync=function(n){return Hr(n)},zn.hydrate=function(n,r,l){if(!wl(r))throw Error(t(200));return Tl(null,n,r,!0,l)},zn.hydrateRoot=function(n,r,l){if(!Qu(n))throw Error(t(405));var u=l!=null&&l.hydratedSources||null,p=!1,g="",T=Cm;if(l!=null&&(l.unstable_strictMode===!0&&(p=!0),l.identifierPrefix!==void 0&&(g=l.identifierPrefix),l.onRecoverableError!==void 0&&(T=l.onRecoverableError)),r=Tm(r,null,n,1,l??null,p,!1,g,T),n[Fi]=r.current,Po(n),u)for(n=0;n<u.length;n++)l=u[n],p=l._getVersion,p=p(l._source),r.mutableSourceEagerHydrationData==null?r.mutableSourceEagerHydrationData=[l,p]:r.mutableSourceEagerHydrationData.push(l,p);return new El(r)},zn.render=function(n,r,l){if(!wl(r))throw Error(t(200));return Tl(null,n,r,!1,l)},zn.unmountComponentAtNode=function(n){if(!wl(n))throw Error(t(40));return n._reactRootContainer?(Hr(function(){Tl(null,null,n,!1,function(){n._reactRootContainer=null,n[Fi]=null})}),!0):!1},zn.unstable_batchedUpdates=Wu,zn.unstable_renderSubtreeIntoContainer=function(n,r,l,u){if(!wl(l))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return Tl(n,r,l,!1,u)},zn.version="18.3.1-next-f1338f8080-20240426",zn}var Fm;function F_(){if(Fm)return nd.exports;Fm=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),nd.exports=U_(),nd.exports}var Om;function O_(){if(Om)return Cl;Om=1;var s=F_();return Cl.createRoot=s.createRoot,Cl.hydrateRoot=s.hydrateRoot,Cl}var k_=O_();const Bf="180",z_=0,km=1,B_=2,sg=1,og=2,$i=3,br=0,Gn=1,Ri=2,Cr=0,io=1,jd=2,zm=3,Bm=4,V_=5,ns=100,H_=101,G_=102,W_=103,j_=104,X_=200,q_=201,Y_=202,$_=203,Xd=204,qd=205,K_=206,Z_=207,J_=208,Q_=209,ex=210,tx=211,nx=212,ix=213,rx=214,Yd=0,$d=1,Kd=2,oo=3,Zd=4,Jd=5,Qd=6,ef=7,ag=0,sx=1,ox=2,Rr=0,ax=1,lx=2,cx=3,lg=4,ux=5,dx=6,fx=7,cg=300,ao=301,lo=302,tf=303,nf=304,_c=306,rf=1e3,rs=1001,sf=1002,xi=1003,hx=1004,Rl=1005,bi=1006,sd=1007,ss=1008,Ni=1009,ug=1010,dg=1011,ca=1012,Vf=1013,os=1014,Ki=1015,xa=1016,Hf=1017,Gf=1018,ua=1020,fg=35902,hg=35899,pg=1021,mg=1022,_i=1023,da=1026,fa=1027,gg=1028,Wf=1029,vg=1030,jf=1031,Xf=1033,ic=33776,rc=33777,sc=33778,oc=33779,of=35840,af=35841,lf=35842,cf=35843,uf=36196,df=37492,ff=37496,hf=37808,pf=37809,mf=37810,gf=37811,vf=37812,_f=37813,xf=37814,yf=37815,Sf=37816,Mf=37817,Ef=37818,wf=37819,Tf=37820,Af=37821,Cf=36492,Rf=36494,bf=36495,Pf=36283,Lf=36284,Nf=36285,Df=36286,px=3200,mx=3201,_g=0,gx=1,Ar="",Hn="srgb",co="srgb-linear",cc="linear",Ft="srgb",Os=7680,Vm=519,vx=512,_x=513,xx=514,xg=515,yx=516,Sx=517,Mx=518,Ex=519,Hm=35044,Gm="300 es",Pi=2e3,uc=2001;class ho{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const o=i[e];if(o!==void 0){const a=o.indexOf(t);a!==-1&&o.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const o=i.slice(0);for(let a=0,c=o.length;a<c;a++)o[a].call(this,e);e.target=null}}}const wn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Wm=1234567;const sa=Math.PI/180,ha=180/Math.PI;function us(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(wn[s&255]+wn[s>>8&255]+wn[s>>16&255]+wn[s>>24&255]+"-"+wn[e&255]+wn[e>>8&255]+"-"+wn[e>>16&15|64]+wn[e>>24&255]+"-"+wn[t&63|128]+wn[t>>8&255]+"-"+wn[t>>16&255]+wn[t>>24&255]+wn[i&255]+wn[i>>8&255]+wn[i>>16&255]+wn[i>>24&255]).toLowerCase()}function Mt(s,e,t){return Math.max(e,Math.min(t,s))}function qf(s,e){return(s%e+e)%e}function wx(s,e,t,i,o){return i+(s-e)*(o-i)/(t-e)}function Tx(s,e,t){return s!==e?(t-s)/(e-s):0}function oa(s,e,t){return(1-t)*s+t*e}function Ax(s,e,t,i){return oa(s,e,1-Math.exp(-t*i))}function Cx(s,e=1){return e-Math.abs(qf(s,e*2)-e)}function Rx(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function bx(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Px(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Lx(s,e){return s+Math.random()*(e-s)}function Nx(s){return s*(.5-Math.random())}function Dx(s){s!==void 0&&(Wm=s);let e=Wm+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ix(s){return s*sa}function Ux(s){return s*ha}function Fx(s){return(s&s-1)===0&&s!==0}function Ox(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function kx(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function zx(s,e,t,i,o){const a=Math.cos,c=Math.sin,d=a(t/2),f=c(t/2),h=a((e+i)/2),m=c((e+i)/2),x=a((e-i)/2),_=c((e-i)/2),S=a((i-e)/2),M=c((i-e)/2);switch(o){case"XYX":s.set(d*m,f*x,f*_,d*h);break;case"YZY":s.set(f*_,d*m,f*x,d*h);break;case"ZXZ":s.set(f*x,f*_,d*m,d*h);break;case"XZX":s.set(d*m,f*M,f*S,d*h);break;case"YXY":s.set(f*S,d*m,f*M,d*h);break;case"ZYZ":s.set(f*M,f*S,d*m,d*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+o)}}function eo(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ln(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Vn={DEG2RAD:sa,RAD2DEG:ha,generateUUID:us,clamp:Mt,euclideanModulo:qf,mapLinear:wx,inverseLerp:Tx,lerp:oa,damp:Ax,pingpong:Cx,smoothstep:Rx,smootherstep:bx,randInt:Px,randFloat:Lx,randFloatSpread:Nx,seededRandom:Dx,degToRad:Ix,radToDeg:Ux,isPowerOfTwo:Fx,ceilPowerOfTwo:Ox,floorPowerOfTwo:kx,setQuaternionFromProperEuler:zx,normalize:Ln,denormalize:eo};class Fe{constructor(e=0,t=0){Fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,o=e.elements;return this.x=o[0]*t+o[3]*i+o[6],this.y=o[1]*t+o[4]*i+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Mt(this.x,e.x,t.x),this.y=Mt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Mt(this.x,e,t),this.y=Mt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Mt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Mt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),o=Math.sin(t),a=this.x-e.x,c=this.y-e.y;return this.x=a*i-c*o+e.x,this.y=a*o+c*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ya{constructor(e=0,t=0,i=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=o}static slerpFlat(e,t,i,o,a,c,d){let f=i[o+0],h=i[o+1],m=i[o+2],x=i[o+3];const _=a[c+0],S=a[c+1],M=a[c+2],w=a[c+3];if(d===0){e[t+0]=f,e[t+1]=h,e[t+2]=m,e[t+3]=x;return}if(d===1){e[t+0]=_,e[t+1]=S,e[t+2]=M,e[t+3]=w;return}if(x!==w||f!==_||h!==S||m!==M){let y=1-d;const v=f*_+h*S+m*M+x*w,P=v>=0?1:-1,C=1-v*v;if(C>Number.EPSILON){const O=Math.sqrt(C),U=Math.atan2(O,v*P);y=Math.sin(y*U)/O,d=Math.sin(d*U)/O}const E=d*P;if(f=f*y+_*E,h=h*y+S*E,m=m*y+M*E,x=x*y+w*E,y===1-d){const O=1/Math.sqrt(f*f+h*h+m*m+x*x);f*=O,h*=O,m*=O,x*=O}}e[t]=f,e[t+1]=h,e[t+2]=m,e[t+3]=x}static multiplyQuaternionsFlat(e,t,i,o,a,c){const d=i[o],f=i[o+1],h=i[o+2],m=i[o+3],x=a[c],_=a[c+1],S=a[c+2],M=a[c+3];return e[t]=d*M+m*x+f*S-h*_,e[t+1]=f*M+m*_+h*x-d*S,e[t+2]=h*M+m*S+d*_-f*x,e[t+3]=m*M-d*x-f*_-h*S,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,o){return this._x=e,this._y=t,this._z=i,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,o=e._y,a=e._z,c=e._order,d=Math.cos,f=Math.sin,h=d(i/2),m=d(o/2),x=d(a/2),_=f(i/2),S=f(o/2),M=f(a/2);switch(c){case"XYZ":this._x=_*m*x+h*S*M,this._y=h*S*x-_*m*M,this._z=h*m*M+_*S*x,this._w=h*m*x-_*S*M;break;case"YXZ":this._x=_*m*x+h*S*M,this._y=h*S*x-_*m*M,this._z=h*m*M-_*S*x,this._w=h*m*x+_*S*M;break;case"ZXY":this._x=_*m*x-h*S*M,this._y=h*S*x+_*m*M,this._z=h*m*M+_*S*x,this._w=h*m*x-_*S*M;break;case"ZYX":this._x=_*m*x-h*S*M,this._y=h*S*x+_*m*M,this._z=h*m*M-_*S*x,this._w=h*m*x+_*S*M;break;case"YZX":this._x=_*m*x+h*S*M,this._y=h*S*x+_*m*M,this._z=h*m*M-_*S*x,this._w=h*m*x-_*S*M;break;case"XZY":this._x=_*m*x-h*S*M,this._y=h*S*x-_*m*M,this._z=h*m*M+_*S*x,this._w=h*m*x+_*S*M;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,o=Math.sin(i);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],o=t[4],a=t[8],c=t[1],d=t[5],f=t[9],h=t[2],m=t[6],x=t[10],_=i+d+x;if(_>0){const S=.5/Math.sqrt(_+1);this._w=.25/S,this._x=(m-f)*S,this._y=(a-h)*S,this._z=(c-o)*S}else if(i>d&&i>x){const S=2*Math.sqrt(1+i-d-x);this._w=(m-f)/S,this._x=.25*S,this._y=(o+c)/S,this._z=(a+h)/S}else if(d>x){const S=2*Math.sqrt(1+d-i-x);this._w=(a-h)/S,this._x=(o+c)/S,this._y=.25*S,this._z=(f+m)/S}else{const S=2*Math.sqrt(1+x-i-d);this._w=(c-o)/S,this._x=(a+h)/S,this._y=(f+m)/S,this._z=.25*S}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Mt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const o=Math.min(1,t/i);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,o=e._y,a=e._z,c=e._w,d=t._x,f=t._y,h=t._z,m=t._w;return this._x=i*m+c*d+o*h-a*f,this._y=o*m+c*f+a*d-i*h,this._z=a*m+c*h+i*f-o*d,this._w=c*m-i*d-o*f-a*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,o=this._y,a=this._z,c=this._w;let d=c*e._w+i*e._x+o*e._y+a*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=c,this._x=i,this._y=o,this._z=a,this;const f=1-d*d;if(f<=Number.EPSILON){const S=1-t;return this._w=S*c+t*this._w,this._x=S*i+t*this._x,this._y=S*o+t*this._y,this._z=S*a+t*this._z,this.normalize(),this}const h=Math.sqrt(f),m=Math.atan2(h,d),x=Math.sin((1-t)*m)/h,_=Math.sin(t*m)/h;return this._w=c*x+this._w*_,this._x=i*x+this._x*_,this._y=o*x+this._y*_,this._z=a*x+this._z*_,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),o=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(o*Math.sin(e),o*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(jm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(jm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,o=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*o,this.y=a[1]*t+a[4]*i+a[7]*o,this.z=a[2]*t+a[5]*i+a[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,o=this.z,a=e.elements,c=1/(a[3]*t+a[7]*i+a[11]*o+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*o+a[12])*c,this.y=(a[1]*t+a[5]*i+a[9]*o+a[13])*c,this.z=(a[2]*t+a[6]*i+a[10]*o+a[14])*c,this}applyQuaternion(e){const t=this.x,i=this.y,o=this.z,a=e.x,c=e.y,d=e.z,f=e.w,h=2*(c*o-d*i),m=2*(d*t-a*o),x=2*(a*i-c*t);return this.x=t+f*h+c*x-d*m,this.y=i+f*m+d*h-a*x,this.z=o+f*x+a*m-c*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,o=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*o,this.y=a[1]*t+a[5]*i+a[9]*o,this.z=a[2]*t+a[6]*i+a[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Mt(this.x,e.x,t.x),this.y=Mt(this.y,e.y,t.y),this.z=Mt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Mt(this.x,e,t),this.y=Mt(this.y,e,t),this.z=Mt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Mt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,o=e.y,a=e.z,c=t.x,d=t.y,f=t.z;return this.x=o*f-a*d,this.y=a*c-i*f,this.z=i*d-o*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return od.copy(this).projectOnVector(e),this.sub(od)}reflect(e){return this.sub(od.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Mt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,o=this.z-e.z;return t*t+i*i+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const o=Math.sin(t)*e;return this.x=o*Math.sin(i),this.y=Math.cos(t)*e,this.z=o*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const od=new D,jm=new ya;class xt{constructor(e,t,i,o,a,c,d,f,h){xt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,o,a,c,d,f,h)}set(e,t,i,o,a,c,d,f,h){const m=this.elements;return m[0]=e,m[1]=o,m[2]=d,m[3]=t,m[4]=a,m[5]=f,m[6]=i,m[7]=c,m[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,o=t.elements,a=this.elements,c=i[0],d=i[3],f=i[6],h=i[1],m=i[4],x=i[7],_=i[2],S=i[5],M=i[8],w=o[0],y=o[3],v=o[6],P=o[1],C=o[4],E=o[7],O=o[2],U=o[5],F=o[8];return a[0]=c*w+d*P+f*O,a[3]=c*y+d*C+f*U,a[6]=c*v+d*E+f*F,a[1]=h*w+m*P+x*O,a[4]=h*y+m*C+x*U,a[7]=h*v+m*E+x*F,a[2]=_*w+S*P+M*O,a[5]=_*y+S*C+M*U,a[8]=_*v+S*E+M*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],o=e[2],a=e[3],c=e[4],d=e[5],f=e[6],h=e[7],m=e[8];return t*c*m-t*d*h-i*a*m+i*d*f+o*a*h-o*c*f}invert(){const e=this.elements,t=e[0],i=e[1],o=e[2],a=e[3],c=e[4],d=e[5],f=e[6],h=e[7],m=e[8],x=m*c-d*h,_=d*f-m*a,S=h*a-c*f,M=t*x+i*_+o*S;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/M;return e[0]=x*w,e[1]=(o*h-m*i)*w,e[2]=(d*i-o*c)*w,e[3]=_*w,e[4]=(m*t-o*f)*w,e[5]=(o*a-d*t)*w,e[6]=S*w,e[7]=(i*f-h*t)*w,e[8]=(c*t-i*a)*w,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,o,a,c,d){const f=Math.cos(a),h=Math.sin(a);return this.set(i*f,i*h,-i*(f*c+h*d)+c+e,-o*h,o*f,-o*(-h*c+f*d)+d+t,0,0,1),this}scale(e,t){return this.premultiply(ad.makeScale(e,t)),this}rotate(e){return this.premultiply(ad.makeRotation(-e)),this}translate(e,t){return this.premultiply(ad.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let o=0;o<9;o++)if(t[o]!==i[o])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ad=new xt;function yg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function dc(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Bx(){const s=dc("canvas");return s.style.display="block",s}const Xm={};function pa(s){s in Xm||(Xm[s]=!0,console.warn(s))}function Vx(s,e,t){return new Promise(function(i,o){function a(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:o();break;case s.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const qm=new xt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ym=new xt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Hx(){const s={enabled:!0,workingColorSpace:co,spaces:{},convert:function(o,a,c){return this.enabled===!1||a===c||!a||!c||(this.spaces[a].transfer===Ft&&(o.r=Zi(o.r),o.g=Zi(o.g),o.b=Zi(o.b)),this.spaces[a].primaries!==this.spaces[c].primaries&&(o.applyMatrix3(this.spaces[a].toXYZ),o.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===Ft&&(o.r=ro(o.r),o.g=ro(o.g),o.b=ro(o.b))),o},workingToColorSpace:function(o,a){return this.convert(o,this.workingColorSpace,a)},colorSpaceToWorking:function(o,a){return this.convert(o,a,this.workingColorSpace)},getPrimaries:function(o){return this.spaces[o].primaries},getTransfer:function(o){return o===Ar?cc:this.spaces[o].transfer},getToneMappingMode:function(o){return this.spaces[o].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(o,a=this.workingColorSpace){return o.fromArray(this.spaces[a].luminanceCoefficients)},define:function(o){Object.assign(this.spaces,o)},_getMatrix:function(o,a,c){return o.copy(this.spaces[a].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(o){return this.spaces[o].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(o=this.workingColorSpace){return this.spaces[o].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(o,a){return pa("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(o,a)},toWorkingColorSpace:function(o,a){return pa("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(o,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[co]:{primaries:e,whitePoint:i,transfer:cc,toXYZ:qm,fromXYZ:Ym,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Hn},outputColorSpaceConfig:{drawingBufferColorSpace:Hn}},[Hn]:{primaries:e,whitePoint:i,transfer:Ft,toXYZ:qm,fromXYZ:Ym,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Hn}}}),s}const Pt=Hx();function Zi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ro(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ks;class Gx{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ks===void 0&&(ks=dc("canvas")),ks.width=e.width,ks.height=e.height;const o=ks.getContext("2d");e instanceof ImageData?o.putImageData(e,0,0):o.drawImage(e,0,0,e.width,e.height),i=ks}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=dc("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const o=i.getImageData(0,0,e.width,e.height),a=o.data;for(let c=0;c<a.length;c++)a[c]=Zi(a[c]/255)*255;return i.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Zi(t[i]/255)*255):t[i]=Zi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Wx=0;class Yf{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wx++}),this.uuid=us(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},o=this.data;if(o!==null){let a;if(Array.isArray(o)){a=[];for(let c=0,d=o.length;c<d;c++)o[c].isDataTexture?a.push(ld(o[c].image)):a.push(ld(o[c]))}else a=ld(o);i.url=a}return t||(e.images[this.uuid]=i),i}}function ld(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Gx.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let jx=0;const cd=new D;class Dn extends ho{constructor(e=Dn.DEFAULT_IMAGE,t=Dn.DEFAULT_MAPPING,i=rs,o=rs,a=bi,c=ss,d=_i,f=Ni,h=Dn.DEFAULT_ANISOTROPY,m=Ar){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jx++}),this.uuid=us(),this.name="",this.source=new Yf(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=o,this.magFilter=a,this.minFilter=c,this.anisotropy=h,this.format=d,this.internalFormat=null,this.type=f,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new xt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(cd).x}get height(){return this.source.getSize(cd).y}get depth(){return this.source.getSize(cd).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}o&&i&&o.isVector2&&i.isVector2||o&&i&&o.isVector3&&i.isVector3||o&&i&&o.isMatrix3&&i.isMatrix3?o.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==cg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rf:e.x=e.x-Math.floor(e.x);break;case rs:e.x=e.x<0?0:1;break;case sf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rf:e.y=e.y-Math.floor(e.y);break;case rs:e.y=e.y<0?0:1;break;case sf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Dn.DEFAULT_IMAGE=null;Dn.DEFAULT_MAPPING=cg;Dn.DEFAULT_ANISOTROPY=1;class Ot{constructor(e=0,t=0,i=0,o=1){Ot.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,o){return this.x=e,this.y=t,this.z=i,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,o=this.z,a=this.w,c=e.elements;return this.x=c[0]*t+c[4]*i+c[8]*o+c[12]*a,this.y=c[1]*t+c[5]*i+c[9]*o+c[13]*a,this.z=c[2]*t+c[6]*i+c[10]*o+c[14]*a,this.w=c[3]*t+c[7]*i+c[11]*o+c[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,o,a;const f=e.elements,h=f[0],m=f[4],x=f[8],_=f[1],S=f[5],M=f[9],w=f[2],y=f[6],v=f[10];if(Math.abs(m-_)<.01&&Math.abs(x-w)<.01&&Math.abs(M-y)<.01){if(Math.abs(m+_)<.1&&Math.abs(x+w)<.1&&Math.abs(M+y)<.1&&Math.abs(h+S+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const C=(h+1)/2,E=(S+1)/2,O=(v+1)/2,U=(m+_)/4,F=(x+w)/4,V=(M+y)/4;return C>E&&C>O?C<.01?(i=0,o=.707106781,a=.707106781):(i=Math.sqrt(C),o=U/i,a=F/i):E>O?E<.01?(i=.707106781,o=0,a=.707106781):(o=Math.sqrt(E),i=U/o,a=V/o):O<.01?(i=.707106781,o=.707106781,a=0):(a=Math.sqrt(O),i=F/a,o=V/a),this.set(i,o,a,t),this}let P=Math.sqrt((y-M)*(y-M)+(x-w)*(x-w)+(_-m)*(_-m));return Math.abs(P)<.001&&(P=1),this.x=(y-M)/P,this.y=(x-w)/P,this.z=(_-m)/P,this.w=Math.acos((h+S+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Mt(this.x,e.x,t.x),this.y=Mt(this.y,e.y,t.y),this.z=Mt(this.z,e.z,t.z),this.w=Mt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Mt(this.x,e,t),this.y=Mt(this.y,e,t),this.z=Mt(this.z,e,t),this.w=Mt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Mt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xx extends ho{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:bi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Ot(0,0,e,t),this.scissorTest=!1,this.viewport=new Ot(0,0,e,t);const o={width:e,height:t,depth:i.depth},a=new Dn(o);this.textures=[];const c=i.count;for(let d=0;d<c;d++)this.textures[d]=a.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:bi,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let o=0,a=this.textures.length;o<a;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=i,this.textures[o].isArrayTexture=this.textures[o].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const o=Object.assign({},e.textures[t].image);this.textures[t].source=new Yf(o)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class as extends Xx{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Sg extends Dn{constructor(e=null,t=1,i=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:o},this.magFilter=xi,this.minFilter=xi,this.wrapR=rs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class qx extends Dn{constructor(e=null,t=1,i=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:o},this.magFilter=xi,this.minFilter=xi,this.wrapR=rs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ds{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(pi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(pi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=pi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let c=0,d=a.count;c<d;c++)e.isMesh===!0?e.getVertexPosition(c,pi):pi.fromBufferAttribute(a,c),pi.applyMatrix4(e.matrixWorld),this.expandByPoint(pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),bl.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),bl.copy(i.boundingBox)),bl.applyMatrix4(e.matrixWorld),this.union(bl)}const o=e.children;for(let a=0,c=o.length;a<c;a++)this.expandByObject(o[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pi),pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter($o),Pl.subVectors(this.max,$o),zs.subVectors(e.a,$o),Bs.subVectors(e.b,$o),Vs.subVectors(e.c,$o),xr.subVectors(Bs,zs),yr.subVectors(Vs,Bs),Xr.subVectors(zs,Vs);let t=[0,-xr.z,xr.y,0,-yr.z,yr.y,0,-Xr.z,Xr.y,xr.z,0,-xr.x,yr.z,0,-yr.x,Xr.z,0,-Xr.x,-xr.y,xr.x,0,-yr.y,yr.x,0,-Xr.y,Xr.x,0];return!ud(t,zs,Bs,Vs,Pl)||(t=[1,0,0,0,1,0,0,0,1],!ud(t,zs,Bs,Vs,Pl))?!1:(Ll.crossVectors(xr,yr),t=[Ll.x,Ll.y,Ll.z],ud(t,zs,Bs,Vs,Pl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Wi=[new D,new D,new D,new D,new D,new D,new D,new D],pi=new D,bl=new ds,zs=new D,Bs=new D,Vs=new D,xr=new D,yr=new D,Xr=new D,$o=new D,Pl=new D,Ll=new D,qr=new D;function ud(s,e,t,i,o){for(let a=0,c=s.length-3;a<=c;a+=3){qr.fromArray(s,a);const d=o.x*Math.abs(qr.x)+o.y*Math.abs(qr.y)+o.z*Math.abs(qr.z),f=e.dot(qr),h=t.dot(qr),m=i.dot(qr);if(Math.max(-Math.max(f,h,m),Math.min(f,h,m))>d)return!1}return!0}const Yx=new ds,Ko=new D,dd=new D;class xc{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Yx.setFromPoints(e).getCenter(i);let o=0;for(let a=0,c=e.length;a<c;a++)o=Math.max(o,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ko.subVectors(e,this.center);const t=Ko.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),o=(i-this.radius)*.5;this.center.addScaledVector(Ko,o/i),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(dd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ko.copy(e.center).add(dd)),this.expandByPoint(Ko.copy(e.center).sub(dd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const ji=new D,fd=new D,Nl=new D,Sr=new D,hd=new D,Dl=new D,pd=new D;class yc{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ji)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ji.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ji.copy(this.origin).addScaledVector(this.direction,t),ji.distanceToSquared(e))}distanceSqToSegment(e,t,i,o){fd.copy(e).add(t).multiplyScalar(.5),Nl.copy(t).sub(e).normalize(),Sr.copy(this.origin).sub(fd);const a=e.distanceTo(t)*.5,c=-this.direction.dot(Nl),d=Sr.dot(this.direction),f=-Sr.dot(Nl),h=Sr.lengthSq(),m=Math.abs(1-c*c);let x,_,S,M;if(m>0)if(x=c*f-d,_=c*d-f,M=a*m,x>=0)if(_>=-M)if(_<=M){const w=1/m;x*=w,_*=w,S=x*(x+c*_+2*d)+_*(c*x+_+2*f)+h}else _=a,x=Math.max(0,-(c*_+d)),S=-x*x+_*(_+2*f)+h;else _=-a,x=Math.max(0,-(c*_+d)),S=-x*x+_*(_+2*f)+h;else _<=-M?(x=Math.max(0,-(-c*a+d)),_=x>0?-a:Math.min(Math.max(-a,-f),a),S=-x*x+_*(_+2*f)+h):_<=M?(x=0,_=Math.min(Math.max(-a,-f),a),S=_*(_+2*f)+h):(x=Math.max(0,-(c*a+d)),_=x>0?a:Math.min(Math.max(-a,-f),a),S=-x*x+_*(_+2*f)+h);else _=c>0?-a:a,x=Math.max(0,-(c*_+d)),S=-x*x+_*(_+2*f)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,x),o&&o.copy(fd).addScaledVector(Nl,_),S}intersectSphere(e,t){ji.subVectors(e.center,this.origin);const i=ji.dot(this.direction),o=ji.dot(ji)-i*i,a=e.radius*e.radius;if(o>a)return null;const c=Math.sqrt(a-o),d=i-c,f=i+c;return f<0?null:d<0?this.at(f,t):this.at(d,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,o,a,c,d,f;const h=1/this.direction.x,m=1/this.direction.y,x=1/this.direction.z,_=this.origin;return h>=0?(i=(e.min.x-_.x)*h,o=(e.max.x-_.x)*h):(i=(e.max.x-_.x)*h,o=(e.min.x-_.x)*h),m>=0?(a=(e.min.y-_.y)*m,c=(e.max.y-_.y)*m):(a=(e.max.y-_.y)*m,c=(e.min.y-_.y)*m),i>c||a>o||((a>i||isNaN(i))&&(i=a),(c<o||isNaN(o))&&(o=c),x>=0?(d=(e.min.z-_.z)*x,f=(e.max.z-_.z)*x):(d=(e.max.z-_.z)*x,f=(e.min.z-_.z)*x),i>f||d>o)||((d>i||i!==i)&&(i=d),(f<o||o!==o)&&(o=f),o<0)?null:this.at(i>=0?i:o,t)}intersectsBox(e){return this.intersectBox(e,ji)!==null}intersectTriangle(e,t,i,o,a){hd.subVectors(t,e),Dl.subVectors(i,e),pd.crossVectors(hd,Dl);let c=this.direction.dot(pd),d;if(c>0){if(o)return null;d=1}else if(c<0)d=-1,c=-c;else return null;Sr.subVectors(this.origin,e);const f=d*this.direction.dot(Dl.crossVectors(Sr,Dl));if(f<0)return null;const h=d*this.direction.dot(hd.cross(Sr));if(h<0||f+h>c)return null;const m=-d*Sr.dot(pd);return m<0?null:this.at(m/c,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class jt{constructor(e,t,i,o,a,c,d,f,h,m,x,_,S,M,w,y){jt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,o,a,c,d,f,h,m,x,_,S,M,w,y)}set(e,t,i,o,a,c,d,f,h,m,x,_,S,M,w,y){const v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=o,v[1]=a,v[5]=c,v[9]=d,v[13]=f,v[2]=h,v[6]=m,v[10]=x,v[14]=_,v[3]=S,v[7]=M,v[11]=w,v[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new jt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,o=1/Hs.setFromMatrixColumn(e,0).length(),a=1/Hs.setFromMatrixColumn(e,1).length(),c=1/Hs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*o,t[1]=i[1]*o,t[2]=i[2]*o,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*c,t[9]=i[9]*c,t[10]=i[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,o=e.y,a=e.z,c=Math.cos(i),d=Math.sin(i),f=Math.cos(o),h=Math.sin(o),m=Math.cos(a),x=Math.sin(a);if(e.order==="XYZ"){const _=c*m,S=c*x,M=d*m,w=d*x;t[0]=f*m,t[4]=-f*x,t[8]=h,t[1]=S+M*h,t[5]=_-w*h,t[9]=-d*f,t[2]=w-_*h,t[6]=M+S*h,t[10]=c*f}else if(e.order==="YXZ"){const _=f*m,S=f*x,M=h*m,w=h*x;t[0]=_+w*d,t[4]=M*d-S,t[8]=c*h,t[1]=c*x,t[5]=c*m,t[9]=-d,t[2]=S*d-M,t[6]=w+_*d,t[10]=c*f}else if(e.order==="ZXY"){const _=f*m,S=f*x,M=h*m,w=h*x;t[0]=_-w*d,t[4]=-c*x,t[8]=M+S*d,t[1]=S+M*d,t[5]=c*m,t[9]=w-_*d,t[2]=-c*h,t[6]=d,t[10]=c*f}else if(e.order==="ZYX"){const _=c*m,S=c*x,M=d*m,w=d*x;t[0]=f*m,t[4]=M*h-S,t[8]=_*h+w,t[1]=f*x,t[5]=w*h+_,t[9]=S*h-M,t[2]=-h,t[6]=d*f,t[10]=c*f}else if(e.order==="YZX"){const _=c*f,S=c*h,M=d*f,w=d*h;t[0]=f*m,t[4]=w-_*x,t[8]=M*x+S,t[1]=x,t[5]=c*m,t[9]=-d*m,t[2]=-h*m,t[6]=S*x+M,t[10]=_-w*x}else if(e.order==="XZY"){const _=c*f,S=c*h,M=d*f,w=d*h;t[0]=f*m,t[4]=-x,t[8]=h*m,t[1]=_*x+w,t[5]=c*m,t[9]=S*x-M,t[2]=M*x-S,t[6]=d*m,t[10]=w*x+_}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose($x,e,Kx)}lookAt(e,t,i){const o=this.elements;return Kn.subVectors(e,t),Kn.lengthSq()===0&&(Kn.z=1),Kn.normalize(),Mr.crossVectors(i,Kn),Mr.lengthSq()===0&&(Math.abs(i.z)===1?Kn.x+=1e-4:Kn.z+=1e-4,Kn.normalize(),Mr.crossVectors(i,Kn)),Mr.normalize(),Il.crossVectors(Kn,Mr),o[0]=Mr.x,o[4]=Il.x,o[8]=Kn.x,o[1]=Mr.y,o[5]=Il.y,o[9]=Kn.y,o[2]=Mr.z,o[6]=Il.z,o[10]=Kn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,o=t.elements,a=this.elements,c=i[0],d=i[4],f=i[8],h=i[12],m=i[1],x=i[5],_=i[9],S=i[13],M=i[2],w=i[6],y=i[10],v=i[14],P=i[3],C=i[7],E=i[11],O=i[15],U=o[0],F=o[4],V=o[8],b=o[12],R=o[1],H=o[5],Y=o[9],ee=o[13],de=o[2],se=o[6],te=o[10],le=o[14],W=o[3],fe=o[7],ce=o[11],B=o[15];return a[0]=c*U+d*R+f*de+h*W,a[4]=c*F+d*H+f*se+h*fe,a[8]=c*V+d*Y+f*te+h*ce,a[12]=c*b+d*ee+f*le+h*B,a[1]=m*U+x*R+_*de+S*W,a[5]=m*F+x*H+_*se+S*fe,a[9]=m*V+x*Y+_*te+S*ce,a[13]=m*b+x*ee+_*le+S*B,a[2]=M*U+w*R+y*de+v*W,a[6]=M*F+w*H+y*se+v*fe,a[10]=M*V+w*Y+y*te+v*ce,a[14]=M*b+w*ee+y*le+v*B,a[3]=P*U+C*R+E*de+O*W,a[7]=P*F+C*H+E*se+O*fe,a[11]=P*V+C*Y+E*te+O*ce,a[15]=P*b+C*ee+E*le+O*B,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],o=e[8],a=e[12],c=e[1],d=e[5],f=e[9],h=e[13],m=e[2],x=e[6],_=e[10],S=e[14],M=e[3],w=e[7],y=e[11],v=e[15];return M*(+a*f*x-o*h*x-a*d*_+i*h*_+o*d*S-i*f*S)+w*(+t*f*S-t*h*_+a*c*_-o*c*S+o*h*m-a*f*m)+y*(+t*h*x-t*d*S-a*c*x+i*c*S+a*d*m-i*h*m)+v*(-o*d*m-t*f*x+t*d*_+o*c*x-i*c*_+i*f*m)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],o=e[2],a=e[3],c=e[4],d=e[5],f=e[6],h=e[7],m=e[8],x=e[9],_=e[10],S=e[11],M=e[12],w=e[13],y=e[14],v=e[15],P=x*y*h-w*_*h+w*f*S-d*y*S-x*f*v+d*_*v,C=M*_*h-m*y*h-M*f*S+c*y*S+m*f*v-c*_*v,E=m*w*h-M*x*h+M*d*S-c*w*S-m*d*v+c*x*v,O=M*x*f-m*w*f-M*d*_+c*w*_+m*d*y-c*x*y,U=t*P+i*C+o*E+a*O;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/U;return e[0]=P*F,e[1]=(w*_*a-x*y*a-w*o*S+i*y*S+x*o*v-i*_*v)*F,e[2]=(d*y*a-w*f*a+w*o*h-i*y*h-d*o*v+i*f*v)*F,e[3]=(x*f*a-d*_*a-x*o*h+i*_*h+d*o*S-i*f*S)*F,e[4]=C*F,e[5]=(m*y*a-M*_*a+M*o*S-t*y*S-m*o*v+t*_*v)*F,e[6]=(M*f*a-c*y*a-M*o*h+t*y*h+c*o*v-t*f*v)*F,e[7]=(c*_*a-m*f*a+m*o*h-t*_*h-c*o*S+t*f*S)*F,e[8]=E*F,e[9]=(M*x*a-m*w*a-M*i*S+t*w*S+m*i*v-t*x*v)*F,e[10]=(c*w*a-M*d*a+M*i*h-t*w*h-c*i*v+t*d*v)*F,e[11]=(m*d*a-c*x*a-m*i*h+t*x*h+c*i*S-t*d*S)*F,e[12]=O*F,e[13]=(m*w*o-M*x*o+M*i*_-t*w*_-m*i*y+t*x*y)*F,e[14]=(M*d*o-c*w*o-M*i*f+t*w*f+c*i*y-t*d*y)*F,e[15]=(c*x*o-m*d*o+m*i*f-t*x*f-c*i*_+t*d*_)*F,this}scale(e){const t=this.elements,i=e.x,o=e.y,a=e.z;return t[0]*=i,t[4]*=o,t[8]*=a,t[1]*=i,t[5]*=o,t[9]*=a,t[2]*=i,t[6]*=o,t[10]*=a,t[3]*=i,t[7]*=o,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,o))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),o=Math.sin(t),a=1-i,c=e.x,d=e.y,f=e.z,h=a*c,m=a*d;return this.set(h*c+i,h*d-o*f,h*f+o*d,0,h*d+o*f,m*d+i,m*f-o*c,0,h*f-o*d,m*f+o*c,a*f*f+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,o,a,c){return this.set(1,i,a,0,e,1,c,0,t,o,1,0,0,0,0,1),this}compose(e,t,i){const o=this.elements,a=t._x,c=t._y,d=t._z,f=t._w,h=a+a,m=c+c,x=d+d,_=a*h,S=a*m,M=a*x,w=c*m,y=c*x,v=d*x,P=f*h,C=f*m,E=f*x,O=i.x,U=i.y,F=i.z;return o[0]=(1-(w+v))*O,o[1]=(S+E)*O,o[2]=(M-C)*O,o[3]=0,o[4]=(S-E)*U,o[5]=(1-(_+v))*U,o[6]=(y+P)*U,o[7]=0,o[8]=(M+C)*F,o[9]=(y-P)*F,o[10]=(1-(_+w))*F,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,i){const o=this.elements;let a=Hs.set(o[0],o[1],o[2]).length();const c=Hs.set(o[4],o[5],o[6]).length(),d=Hs.set(o[8],o[9],o[10]).length();this.determinant()<0&&(a=-a),e.x=o[12],e.y=o[13],e.z=o[14],mi.copy(this);const h=1/a,m=1/c,x=1/d;return mi.elements[0]*=h,mi.elements[1]*=h,mi.elements[2]*=h,mi.elements[4]*=m,mi.elements[5]*=m,mi.elements[6]*=m,mi.elements[8]*=x,mi.elements[9]*=x,mi.elements[10]*=x,t.setFromRotationMatrix(mi),i.x=a,i.y=c,i.z=d,this}makePerspective(e,t,i,o,a,c,d=Pi,f=!1){const h=this.elements,m=2*a/(t-e),x=2*a/(i-o),_=(t+e)/(t-e),S=(i+o)/(i-o);let M,w;if(f)M=a/(c-a),w=c*a/(c-a);else if(d===Pi)M=-(c+a)/(c-a),w=-2*c*a/(c-a);else if(d===uc)M=-c/(c-a),w=-c*a/(c-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return h[0]=m,h[4]=0,h[8]=_,h[12]=0,h[1]=0,h[5]=x,h[9]=S,h[13]=0,h[2]=0,h[6]=0,h[10]=M,h[14]=w,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,o,a,c,d=Pi,f=!1){const h=this.elements,m=2/(t-e),x=2/(i-o),_=-(t+e)/(t-e),S=-(i+o)/(i-o);let M,w;if(f)M=1/(c-a),w=c/(c-a);else if(d===Pi)M=-2/(c-a),w=-(c+a)/(c-a);else if(d===uc)M=-1/(c-a),w=-a/(c-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return h[0]=m,h[4]=0,h[8]=0,h[12]=_,h[1]=0,h[5]=x,h[9]=0,h[13]=S,h[2]=0,h[6]=0,h[10]=M,h[14]=w,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let o=0;o<16;o++)if(t[o]!==i[o])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Hs=new D,mi=new jt,$x=new D(0,0,0),Kx=new D(1,1,1),Mr=new D,Il=new D,Kn=new D,$m=new jt,Km=new ya;class yi{constructor(e=0,t=0,i=0,o=yi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,o=this._order){return this._x=e,this._y=t,this._z=i,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const o=e.elements,a=o[0],c=o[4],d=o[8],f=o[1],h=o[5],m=o[9],x=o[2],_=o[6],S=o[10];switch(t){case"XYZ":this._y=Math.asin(Mt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-m,S),this._z=Math.atan2(-c,a)):(this._x=Math.atan2(_,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Mt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(d,S),this._z=Math.atan2(f,h)):(this._y=Math.atan2(-x,a),this._z=0);break;case"ZXY":this._x=Math.asin(Mt(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(-x,S),this._z=Math.atan2(-c,h)):(this._y=0,this._z=Math.atan2(f,a));break;case"ZYX":this._y=Math.asin(-Mt(x,-1,1)),Math.abs(x)<.9999999?(this._x=Math.atan2(_,S),this._z=Math.atan2(f,a)):(this._x=0,this._z=Math.atan2(-c,h));break;case"YZX":this._z=Math.asin(Mt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-m,h),this._y=Math.atan2(-x,a)):(this._x=0,this._y=Math.atan2(d,S));break;case"XZY":this._z=Math.asin(-Mt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(_,h),this._y=Math.atan2(d,a)):(this._x=Math.atan2(-m,S),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return $m.makeRotationFromQuaternion(e),this.setFromRotationMatrix($m,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Km.setFromEuler(this),this.setFromQuaternion(Km,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yi.DEFAULT_ORDER="XYZ";class Mg{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Zx=0;const Zm=new D,Gs=new ya,Xi=new jt,Ul=new D,Zo=new D,Jx=new D,Qx=new ya,Jm=new D(1,0,0),Qm=new D(0,1,0),e0=new D(0,0,1),t0={type:"added"},ey={type:"removed"},Ws={type:"childadded",child:null},md={type:"childremoved",child:null};class hn extends ho{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zx++}),this.uuid=us(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=hn.DEFAULT_UP.clone();const e=new D,t=new yi,i=new ya,o=new D(1,1,1);function a(){i.setFromEuler(t,!1)}function c(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new jt},normalMatrix:{value:new xt}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=hn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gs.setFromAxisAngle(e,t),this.quaternion.multiply(Gs),this}rotateOnWorldAxis(e,t){return Gs.setFromAxisAngle(e,t),this.quaternion.premultiply(Gs),this}rotateX(e){return this.rotateOnAxis(Jm,e)}rotateY(e){return this.rotateOnAxis(Qm,e)}rotateZ(e){return this.rotateOnAxis(e0,e)}translateOnAxis(e,t){return Zm.copy(e).applyQuaternion(this.quaternion),this.position.add(Zm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jm,e)}translateY(e){return this.translateOnAxis(Qm,e)}translateZ(e){return this.translateOnAxis(e0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Xi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ul.copy(e):Ul.set(e,t,i);const o=this.parent;this.updateWorldMatrix(!0,!1),Zo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xi.lookAt(Zo,Ul,this.up):Xi.lookAt(Ul,Zo,this.up),this.quaternion.setFromRotationMatrix(Xi),o&&(Xi.extractRotation(o.matrixWorld),Gs.setFromRotationMatrix(Xi),this.quaternion.premultiply(Gs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(t0),Ws.child=e,this.dispatchEvent(Ws),Ws.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ey),md.child=e,this.dispatchEvent(md),md.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Xi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Xi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Xi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(t0),Ws.child=e,this.dispatchEvent(Ws),Ws.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,o=this.children.length;i<o;i++){const c=this.children[i].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const o=this.children;for(let a=0,c=o.length;a<c;a++)o[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zo,e,Jx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zo,Qx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,o=t.length;i<o;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,o=t.length;i<o;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,o=t.length;i<o;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const o=this.children;for(let a=0,c=o.length;a<c;a++)o[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.geometryInfo=this._geometryInfo.map(d=>({...d,boundingBox:d.boundingBox?d.boundingBox.toJSON():void 0,boundingSphere:d.boundingSphere?d.boundingSphere.toJSON():void 0})),o.instanceInfo=this._instanceInfo.map(d=>({...d})),o.availableInstanceIds=this._availableInstanceIds.slice(),o.availableGeometryIds=this._availableGeometryIds.slice(),o.nextIndexStart=this._nextIndexStart,o.nextVertexStart=this._nextVertexStart,o.geometryCount=this._geometryCount,o.maxInstanceCount=this._maxInstanceCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.matricesTexture=this._matricesTexture.toJSON(e),o.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(o.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(o.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(o.boundingBox=this.boundingBox.toJSON()));function a(d,f){return d[f.uuid]===void 0&&(d[f.uuid]=f.toJSON(e)),f.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=a(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const f=d.shapes;if(Array.isArray(f))for(let h=0,m=f.length;h<m;h++){const x=f[h];a(e.shapes,x)}else a(e.shapes,f)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let f=0,h=this.material.length;f<h;f++)d.push(a(e.materials,this.material[f]));o.material=d}else o.material=a(e.materials,this.material);if(this.children.length>0){o.children=[];for(let d=0;d<this.children.length;d++)o.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let d=0;d<this.animations.length;d++){const f=this.animations[d];o.animations.push(a(e.animations,f))}}if(t){const d=c(e.geometries),f=c(e.materials),h=c(e.textures),m=c(e.images),x=c(e.shapes),_=c(e.skeletons),S=c(e.animations),M=c(e.nodes);d.length>0&&(i.geometries=d),f.length>0&&(i.materials=f),h.length>0&&(i.textures=h),m.length>0&&(i.images=m),x.length>0&&(i.shapes=x),_.length>0&&(i.skeletons=_),S.length>0&&(i.animations=S),M.length>0&&(i.nodes=M)}return i.object=o,i;function c(d){const f=[];for(const h in d){const m=d[h];delete m.metadata,f.push(m)}return f}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const o=e.children[i];this.add(o.clone())}return this}}hn.DEFAULT_UP=new D(0,1,0);hn.DEFAULT_MATRIX_AUTO_UPDATE=!0;hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const gi=new D,qi=new D,gd=new D,Yi=new D,js=new D,Xs=new D,n0=new D,vd=new D,_d=new D,xd=new D,yd=new Ot,Sd=new Ot,Md=new Ot;class vi{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,o){o.subVectors(i,t),gi.subVectors(e,t),o.cross(gi);const a=o.lengthSq();return a>0?o.multiplyScalar(1/Math.sqrt(a)):o.set(0,0,0)}static getBarycoord(e,t,i,o,a){gi.subVectors(o,t),qi.subVectors(i,t),gd.subVectors(e,t);const c=gi.dot(gi),d=gi.dot(qi),f=gi.dot(gd),h=qi.dot(qi),m=qi.dot(gd),x=c*h-d*d;if(x===0)return a.set(0,0,0),null;const _=1/x,S=(h*f-d*m)*_,M=(c*m-d*f)*_;return a.set(1-S-M,M,S)}static containsPoint(e,t,i,o){return this.getBarycoord(e,t,i,o,Yi)===null?!1:Yi.x>=0&&Yi.y>=0&&Yi.x+Yi.y<=1}static getInterpolation(e,t,i,o,a,c,d,f){return this.getBarycoord(e,t,i,o,Yi)===null?(f.x=0,f.y=0,"z"in f&&(f.z=0),"w"in f&&(f.w=0),null):(f.setScalar(0),f.addScaledVector(a,Yi.x),f.addScaledVector(c,Yi.y),f.addScaledVector(d,Yi.z),f)}static getInterpolatedAttribute(e,t,i,o,a,c){return yd.setScalar(0),Sd.setScalar(0),Md.setScalar(0),yd.fromBufferAttribute(e,t),Sd.fromBufferAttribute(e,i),Md.fromBufferAttribute(e,o),c.setScalar(0),c.addScaledVector(yd,a.x),c.addScaledVector(Sd,a.y),c.addScaledVector(Md,a.z),c}static isFrontFacing(e,t,i,o){return gi.subVectors(i,t),qi.subVectors(e,t),gi.cross(qi).dot(o)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,o){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,i,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gi.subVectors(this.c,this.b),qi.subVectors(this.a,this.b),gi.cross(qi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return vi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return vi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,o,a){return vi.getInterpolation(e,this.a,this.b,this.c,t,i,o,a)}containsPoint(e){return vi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return vi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,o=this.b,a=this.c;let c,d;js.subVectors(o,i),Xs.subVectors(a,i),vd.subVectors(e,i);const f=js.dot(vd),h=Xs.dot(vd);if(f<=0&&h<=0)return t.copy(i);_d.subVectors(e,o);const m=js.dot(_d),x=Xs.dot(_d);if(m>=0&&x<=m)return t.copy(o);const _=f*x-m*h;if(_<=0&&f>=0&&m<=0)return c=f/(f-m),t.copy(i).addScaledVector(js,c);xd.subVectors(e,a);const S=js.dot(xd),M=Xs.dot(xd);if(M>=0&&S<=M)return t.copy(a);const w=S*h-f*M;if(w<=0&&h>=0&&M<=0)return d=h/(h-M),t.copy(i).addScaledVector(Xs,d);const y=m*M-S*x;if(y<=0&&x-m>=0&&S-M>=0)return n0.subVectors(a,o),d=(x-m)/(x-m+(S-M)),t.copy(o).addScaledVector(n0,d);const v=1/(y+w+_);return c=w*v,d=_*v,t.copy(i).addScaledVector(js,c).addScaledVector(Xs,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Eg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Er={h:0,s:0,l:0},Fl={h:0,s:0,l:0};function Ed(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Tt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Hn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Pt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,o=Pt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Pt.colorSpaceToWorking(this,o),this}setHSL(e,t,i,o=Pt.workingColorSpace){if(e=qf(e,1),t=Mt(t,0,1),i=Mt(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,c=2*i-a;this.r=Ed(c,a,e+1/3),this.g=Ed(c,a,e),this.b=Ed(c,a,e-1/3)}return Pt.colorSpaceToWorking(this,o),this}setStyle(e,t=Hn){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const c=o[1],d=o[2];switch(c){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=o[1],c=a.length;if(c===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Hn){const i=Eg[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zi(e.r),this.g=Zi(e.g),this.b=Zi(e.b),this}copyLinearToSRGB(e){return this.r=ro(e.r),this.g=ro(e.g),this.b=ro(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Hn){return Pt.workingToColorSpace(Tn.copy(this),e),Math.round(Mt(Tn.r*255,0,255))*65536+Math.round(Mt(Tn.g*255,0,255))*256+Math.round(Mt(Tn.b*255,0,255))}getHexString(e=Hn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Pt.workingColorSpace){Pt.workingToColorSpace(Tn.copy(this),t);const i=Tn.r,o=Tn.g,a=Tn.b,c=Math.max(i,o,a),d=Math.min(i,o,a);let f,h;const m=(d+c)/2;if(d===c)f=0,h=0;else{const x=c-d;switch(h=m<=.5?x/(c+d):x/(2-c-d),c){case i:f=(o-a)/x+(o<a?6:0);break;case o:f=(a-i)/x+2;break;case a:f=(i-o)/x+4;break}f/=6}return e.h=f,e.s=h,e.l=m,e}getRGB(e,t=Pt.workingColorSpace){return Pt.workingToColorSpace(Tn.copy(this),t),e.r=Tn.r,e.g=Tn.g,e.b=Tn.b,e}getStyle(e=Hn){Pt.workingToColorSpace(Tn.copy(this),e);const t=Tn.r,i=Tn.g,o=Tn.b;return e!==Hn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(o*255)})`}offsetHSL(e,t,i){return this.getHSL(Er),this.setHSL(Er.h+e,Er.s+t,Er.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Er),e.getHSL(Fl);const i=oa(Er.h,Fl.h,t),o=oa(Er.s,Fl.s,t),a=oa(Er.l,Fl.l,t);return this.setHSL(i,o,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,o=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*o,this.g=a[1]*t+a[4]*i+a[7]*o,this.b=a[2]*t+a[5]*i+a[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Tn=new Tt;Tt.NAMES=Eg;let ty=0;class po extends ho{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ty++}),this.uuid=us(),this.name="",this.type="Material",this.blending=io,this.side=br,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xd,this.blendDst=qd,this.blendEquation=ns,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Tt(0,0,0),this.blendAlpha=0,this.depthFunc=oo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Vm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Os,this.stencilZFail=Os,this.stencilZPass=Os,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(i):o&&o.isVector3&&i&&i.isVector3?o.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==io&&(i.blending=this.blending),this.side!==br&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Xd&&(i.blendSrc=this.blendSrc),this.blendDst!==qd&&(i.blendDst=this.blendDst),this.blendEquation!==ns&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==oo&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Vm&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Os&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Os&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Os&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function o(a){const c=[];for(const d in a){const f=a[d];delete f.metadata,c.push(f)}return c}if(t){const a=o(e.textures),c=o(e.images);a.length>0&&(i.textures=a),c.length>0&&(i.images=c)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const o=t.length;i=new Array(o);for(let a=0;a!==o;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class so extends po{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=ag,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const tn=new D,Ol=new Fe;let ny=0;class Li{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ny++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Hm,this.updateRanges=[],this.gpuType=Ki,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let o=0,a=this.itemSize;o<a;o++)this.array[e+o]=t.array[i+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ol.fromBufferAttribute(this,t),Ol.applyMatrix3(e),this.setXY(t,Ol.x,Ol.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix3(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=eo(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ln(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=eo(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=eo(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=eo(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=eo(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ln(t,this.array),i=Ln(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,o){return e*=this.itemSize,this.normalized&&(t=Ln(t,this.array),i=Ln(i,this.array),o=Ln(o,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=o,this}setXYZW(e,t,i,o,a){return e*=this.itemSize,this.normalized&&(t=Ln(t,this.array),i=Ln(i,this.array),o=Ln(o,this.array),a=Ln(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=o,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Hm&&(e.usage=this.usage),e}}class wg extends Li{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Tg extends Li{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Zt extends Li{constructor(e,t,i){super(new Float32Array(e),t,i)}}let iy=0;const oi=new jt,wd=new hn,qs=new D,Zn=new ds,Jo=new ds,dn=new D;class Wn extends ho{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:iy++}),this.uuid=us(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(yg(e)?Tg:wg)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new xt().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return oi.makeRotationFromQuaternion(e),this.applyMatrix4(oi),this}rotateX(e){return oi.makeRotationX(e),this.applyMatrix4(oi),this}rotateY(e){return oi.makeRotationY(e),this.applyMatrix4(oi),this}rotateZ(e){return oi.makeRotationZ(e),this.applyMatrix4(oi),this}translate(e,t,i){return oi.makeTranslation(e,t,i),this.applyMatrix4(oi),this}scale(e,t,i){return oi.makeScale(e,t,i),this.applyMatrix4(oi),this}lookAt(e){return wd.lookAt(e),wd.updateMatrix(),this.applyMatrix4(wd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qs).negate(),this.translate(qs.x,qs.y,qs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let o=0,a=e.length;o<a;o++){const c=e[o];i.push(c.x,c.y,c.z||0)}this.setAttribute("position",new Zt(i,3))}else{const i=Math.min(e.length,t.count);for(let o=0;o<i;o++){const a=e[o];t.setXYZ(o,a.x,a.y,a.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ds);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,o=t.length;i<o;i++){const a=t[i];Zn.setFromBufferAttribute(a),this.morphTargetsRelative?(dn.addVectors(this.boundingBox.min,Zn.min),this.boundingBox.expandByPoint(dn),dn.addVectors(this.boundingBox.max,Zn.max),this.boundingBox.expandByPoint(dn)):(this.boundingBox.expandByPoint(Zn.min),this.boundingBox.expandByPoint(Zn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xc);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(Zn.setFromBufferAttribute(e),t)for(let a=0,c=t.length;a<c;a++){const d=t[a];Jo.setFromBufferAttribute(d),this.morphTargetsRelative?(dn.addVectors(Zn.min,Jo.min),Zn.expandByPoint(dn),dn.addVectors(Zn.max,Jo.max),Zn.expandByPoint(dn)):(Zn.expandByPoint(Jo.min),Zn.expandByPoint(Jo.max))}Zn.getCenter(i);let o=0;for(let a=0,c=e.count;a<c;a++)dn.fromBufferAttribute(e,a),o=Math.max(o,i.distanceToSquared(dn));if(t)for(let a=0,c=t.length;a<c;a++){const d=t[a],f=this.morphTargetsRelative;for(let h=0,m=d.count;h<m;h++)dn.fromBufferAttribute(d,h),f&&(qs.fromBufferAttribute(e,h),dn.add(qs)),o=Math.max(o,i.distanceToSquared(dn))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,o=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Li(new Float32Array(4*i.count),4));const c=this.getAttribute("tangent"),d=[],f=[];for(let V=0;V<i.count;V++)d[V]=new D,f[V]=new D;const h=new D,m=new D,x=new D,_=new Fe,S=new Fe,M=new Fe,w=new D,y=new D;function v(V,b,R){h.fromBufferAttribute(i,V),m.fromBufferAttribute(i,b),x.fromBufferAttribute(i,R),_.fromBufferAttribute(a,V),S.fromBufferAttribute(a,b),M.fromBufferAttribute(a,R),m.sub(h),x.sub(h),S.sub(_),M.sub(_);const H=1/(S.x*M.y-M.x*S.y);isFinite(H)&&(w.copy(m).multiplyScalar(M.y).addScaledVector(x,-S.y).multiplyScalar(H),y.copy(x).multiplyScalar(S.x).addScaledVector(m,-M.x).multiplyScalar(H),d[V].add(w),d[b].add(w),d[R].add(w),f[V].add(y),f[b].add(y),f[R].add(y))}let P=this.groups;P.length===0&&(P=[{start:0,count:e.count}]);for(let V=0,b=P.length;V<b;++V){const R=P[V],H=R.start,Y=R.count;for(let ee=H,de=H+Y;ee<de;ee+=3)v(e.getX(ee+0),e.getX(ee+1),e.getX(ee+2))}const C=new D,E=new D,O=new D,U=new D;function F(V){O.fromBufferAttribute(o,V),U.copy(O);const b=d[V];C.copy(b),C.sub(O.multiplyScalar(O.dot(b))).normalize(),E.crossVectors(U,b);const H=E.dot(f[V])<0?-1:1;c.setXYZW(V,C.x,C.y,C.z,H)}for(let V=0,b=P.length;V<b;++V){const R=P[V],H=R.start,Y=R.count;for(let ee=H,de=H+Y;ee<de;ee+=3)F(e.getX(ee+0)),F(e.getX(ee+1)),F(e.getX(ee+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Li(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let _=0,S=i.count;_<S;_++)i.setXYZ(_,0,0,0);const o=new D,a=new D,c=new D,d=new D,f=new D,h=new D,m=new D,x=new D;if(e)for(let _=0,S=e.count;_<S;_+=3){const M=e.getX(_+0),w=e.getX(_+1),y=e.getX(_+2);o.fromBufferAttribute(t,M),a.fromBufferAttribute(t,w),c.fromBufferAttribute(t,y),m.subVectors(c,a),x.subVectors(o,a),m.cross(x),d.fromBufferAttribute(i,M),f.fromBufferAttribute(i,w),h.fromBufferAttribute(i,y),d.add(m),f.add(m),h.add(m),i.setXYZ(M,d.x,d.y,d.z),i.setXYZ(w,f.x,f.y,f.z),i.setXYZ(y,h.x,h.y,h.z)}else for(let _=0,S=t.count;_<S;_+=3)o.fromBufferAttribute(t,_+0),a.fromBufferAttribute(t,_+1),c.fromBufferAttribute(t,_+2),m.subVectors(c,a),x.subVectors(o,a),m.cross(x),i.setXYZ(_+0,m.x,m.y,m.z),i.setXYZ(_+1,m.x,m.y,m.z),i.setXYZ(_+2,m.x,m.y,m.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)dn.fromBufferAttribute(e,t),dn.normalize(),e.setXYZ(t,dn.x,dn.y,dn.z)}toNonIndexed(){function e(d,f){const h=d.array,m=d.itemSize,x=d.normalized,_=new h.constructor(f.length*m);let S=0,M=0;for(let w=0,y=f.length;w<y;w++){d.isInterleavedBufferAttribute?S=f[w]*d.data.stride+d.offset:S=f[w]*m;for(let v=0;v<m;v++)_[M++]=h[S++]}return new Li(_,m,x)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Wn,i=this.index.array,o=this.attributes;for(const d in o){const f=o[d],h=e(f,i);t.setAttribute(d,h)}const a=this.morphAttributes;for(const d in a){const f=[],h=a[d];for(let m=0,x=h.length;m<x;m++){const _=h[m],S=e(_,i);f.push(S)}t.morphAttributes[d]=f}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let d=0,f=c.length;d<f;d++){const h=c[d];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const f=this.parameters;for(const h in f)f[h]!==void 0&&(e[h]=f[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const f in i){const h=i[f];e.data.attributes[f]=h.toJSON(e.data)}const o={};let a=!1;for(const f in this.morphAttributes){const h=this.morphAttributes[f],m=[];for(let x=0,_=h.length;x<_;x++){const S=h[x];m.push(S.toJSON(e.data))}m.length>0&&(o[f]=m,a=!0)}a&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere=d.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const o=e.attributes;for(const h in o){const m=o[h];this.setAttribute(h,m.clone(t))}const a=e.morphAttributes;for(const h in a){const m=[],x=a[h];for(let _=0,S=x.length;_<S;_++)m.push(x[_].clone(t));this.morphAttributes[h]=m}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let h=0,m=c.length;h<m;h++){const x=c[h];this.addGroup(x.start,x.count,x.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const f=e.boundingSphere;return f!==null&&(this.boundingSphere=f.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const i0=new jt,Yr=new yc,kl=new xc,r0=new D,zl=new D,Bl=new D,Vl=new D,Td=new D,Hl=new D,s0=new D,Gl=new D;class Yt extends hn{constructor(e=new Wn,t=new so){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const o=t[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,c=o.length;a<c;a++){const d=o[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=a}}}}getVertexPosition(e,t){const i=this.geometry,o=i.attributes.position,a=i.morphAttributes.position,c=i.morphTargetsRelative;t.fromBufferAttribute(o,e);const d=this.morphTargetInfluences;if(a&&d){Hl.set(0,0,0);for(let f=0,h=a.length;f<h;f++){const m=d[f],x=a[f];m!==0&&(Td.fromBufferAttribute(x,e),c?Hl.addScaledVector(Td,m):Hl.addScaledVector(Td.sub(t),m))}t.add(Hl)}return t}raycast(e,t){const i=this.geometry,o=this.material,a=this.matrixWorld;o!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),kl.copy(i.boundingSphere),kl.applyMatrix4(a),Yr.copy(e.ray).recast(e.near),!(kl.containsPoint(Yr.origin)===!1&&(Yr.intersectSphere(kl,r0)===null||Yr.origin.distanceToSquared(r0)>(e.far-e.near)**2))&&(i0.copy(a).invert(),Yr.copy(e.ray).applyMatrix4(i0),!(i.boundingBox!==null&&Yr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Yr)))}_computeIntersections(e,t,i){let o;const a=this.geometry,c=this.material,d=a.index,f=a.attributes.position,h=a.attributes.uv,m=a.attributes.uv1,x=a.attributes.normal,_=a.groups,S=a.drawRange;if(d!==null)if(Array.isArray(c))for(let M=0,w=_.length;M<w;M++){const y=_[M],v=c[y.materialIndex],P=Math.max(y.start,S.start),C=Math.min(d.count,Math.min(y.start+y.count,S.start+S.count));for(let E=P,O=C;E<O;E+=3){const U=d.getX(E),F=d.getX(E+1),V=d.getX(E+2);o=Wl(this,v,e,i,h,m,x,U,F,V),o&&(o.faceIndex=Math.floor(E/3),o.face.materialIndex=y.materialIndex,t.push(o))}}else{const M=Math.max(0,S.start),w=Math.min(d.count,S.start+S.count);for(let y=M,v=w;y<v;y+=3){const P=d.getX(y),C=d.getX(y+1),E=d.getX(y+2);o=Wl(this,c,e,i,h,m,x,P,C,E),o&&(o.faceIndex=Math.floor(y/3),t.push(o))}}else if(f!==void 0)if(Array.isArray(c))for(let M=0,w=_.length;M<w;M++){const y=_[M],v=c[y.materialIndex],P=Math.max(y.start,S.start),C=Math.min(f.count,Math.min(y.start+y.count,S.start+S.count));for(let E=P,O=C;E<O;E+=3){const U=E,F=E+1,V=E+2;o=Wl(this,v,e,i,h,m,x,U,F,V),o&&(o.faceIndex=Math.floor(E/3),o.face.materialIndex=y.materialIndex,t.push(o))}}else{const M=Math.max(0,S.start),w=Math.min(f.count,S.start+S.count);for(let y=M,v=w;y<v;y+=3){const P=y,C=y+1,E=y+2;o=Wl(this,c,e,i,h,m,x,P,C,E),o&&(o.faceIndex=Math.floor(y/3),t.push(o))}}}}function ry(s,e,t,i,o,a,c,d){let f;if(e.side===Gn?f=i.intersectTriangle(c,a,o,!0,d):f=i.intersectTriangle(o,a,c,e.side===br,d),f===null)return null;Gl.copy(d),Gl.applyMatrix4(s.matrixWorld);const h=t.ray.origin.distanceTo(Gl);return h<t.near||h>t.far?null:{distance:h,point:Gl.clone(),object:s}}function Wl(s,e,t,i,o,a,c,d,f,h){s.getVertexPosition(d,zl),s.getVertexPosition(f,Bl),s.getVertexPosition(h,Vl);const m=ry(s,e,t,i,zl,Bl,Vl,s0);if(m){const x=new D;vi.getBarycoord(s0,zl,Bl,Vl,x),o&&(m.uv=vi.getInterpolatedAttribute(o,d,f,h,x,new Fe)),a&&(m.uv1=vi.getInterpolatedAttribute(a,d,f,h,x,new Fe)),c&&(m.normal=vi.getInterpolatedAttribute(c,d,f,h,x,new D),m.normal.dot(i.direction)>0&&m.normal.multiplyScalar(-1));const _={a:d,b:f,c:h,normal:new D,materialIndex:0};vi.getNormal(zl,Bl,Vl,_.normal),m.face=_,m.barycoord=x}return m}class Ji extends Wn{constructor(e=1,t=1,i=1,o=1,a=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:o,heightSegments:a,depthSegments:c};const d=this;o=Math.floor(o),a=Math.floor(a),c=Math.floor(c);const f=[],h=[],m=[],x=[];let _=0,S=0;M("z","y","x",-1,-1,i,t,e,c,a,0),M("z","y","x",1,-1,i,t,-e,c,a,1),M("x","z","y",1,1,e,i,t,o,c,2),M("x","z","y",1,-1,e,i,-t,o,c,3),M("x","y","z",1,-1,e,t,i,o,a,4),M("x","y","z",-1,-1,e,t,-i,o,a,5),this.setIndex(f),this.setAttribute("position",new Zt(h,3)),this.setAttribute("normal",new Zt(m,3)),this.setAttribute("uv",new Zt(x,2));function M(w,y,v,P,C,E,O,U,F,V,b){const R=E/F,H=O/V,Y=E/2,ee=O/2,de=U/2,se=F+1,te=V+1;let le=0,W=0;const fe=new D;for(let ce=0;ce<te;ce++){const B=ce*H-ee;for(let re=0;re<se;re++){const Be=re*R-Y;fe[w]=Be*P,fe[y]=B*C,fe[v]=de,h.push(fe.x,fe.y,fe.z),fe[w]=0,fe[y]=0,fe[v]=U>0?1:-1,m.push(fe.x,fe.y,fe.z),x.push(re/F),x.push(1-ce/V),le+=1}}for(let ce=0;ce<V;ce++)for(let B=0;B<F;B++){const re=_+B+se*ce,Be=_+B+se*(ce+1),Xe=_+(B+1)+se*(ce+1),qe=_+(B+1)+se*ce;f.push(re,Be,qe),f.push(Be,Xe,qe),W+=6}d.addGroup(S,W,b),S+=W,_+=le}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ji(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function uo(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const o=s[t][i];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=o.clone():Array.isArray(o)?e[t][i]=o.slice():e[t][i]=o}}return e}function Nn(s){const e={};for(let t=0;t<s.length;t++){const i=uo(s[t]);for(const o in i)e[o]=i[o]}return e}function sy(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Ag(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Pt.workingColorSpace}const oy={clone:uo,merge:Nn};var ay=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ly=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Pr extends po{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ay,this.fragmentShader=ly,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=uo(e.uniforms),this.uniformsGroups=sy(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const c=this.uniforms[o].value;c&&c.isTexture?t.uniforms[o]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[o]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[o]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[o]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[o]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[o]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[o]={type:"m4",value:c.toArray()}:t.uniforms[o]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const o in this.extensions)this.extensions[o]===!0&&(i[o]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Cg extends hn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=Pi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const wr=new D,o0=new Fe,a0=new Fe;class Jn extends Cg{constructor(e=50,t=1,i=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ha*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(sa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ha*2*Math.atan(Math.tan(sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){wr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(wr.x,wr.y).multiplyScalar(-e/wr.z),wr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(wr.x,wr.y).multiplyScalar(-e/wr.z)}getViewSize(e,t){return this.getViewBounds(e,o0,a0),t.subVectors(a0,o0)}setViewOffset(e,t,i,o,a,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=o,this.view.width=a,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(sa*.5*this.fov)/this.zoom,i=2*t,o=this.aspect*i,a=-.5*o;const c=this.view;if(this.view!==null&&this.view.enabled){const f=c.fullWidth,h=c.fullHeight;a+=c.offsetX*o/f,t-=c.offsetY*i/h,o*=c.width/f,i*=c.height/h}const d=this.filmOffset;d!==0&&(a+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+o,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ys=-90,$s=1;class cy extends hn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new Jn(Ys,$s,e,t);o.layers=this.layers,this.add(o);const a=new Jn(Ys,$s,e,t);a.layers=this.layers,this.add(a);const c=new Jn(Ys,$s,e,t);c.layers=this.layers,this.add(c);const d=new Jn(Ys,$s,e,t);d.layers=this.layers,this.add(d);const f=new Jn(Ys,$s,e,t);f.layers=this.layers,this.add(f);const h=new Jn(Ys,$s,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,o,a,c,d,f]=t;for(const h of t)this.remove(h);if(e===Pi)i.up.set(0,1,0),i.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),f.up.set(0,1,0),f.lookAt(0,0,-1);else if(e===uc)i.up.set(0,-1,0),i.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),f.up.set(0,-1,0),f.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,c,d,f,h,m]=this.children,x=e.getRenderTarget(),_=e.getActiveCubeFace(),S=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const w=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,o),e.render(t,a),e.setRenderTarget(i,1,o),e.render(t,c),e.setRenderTarget(i,2,o),e.render(t,d),e.setRenderTarget(i,3,o),e.render(t,f),e.setRenderTarget(i,4,o),e.render(t,h),i.texture.generateMipmaps=w,e.setRenderTarget(i,5,o),e.render(t,m),e.setRenderTarget(x,_,S),e.xr.enabled=M,i.texture.needsPMREMUpdate=!0}}class Rg extends Dn{constructor(e=[],t=ao,i,o,a,c,d,f,h,m){super(e,t,i,o,a,c,d,f,h,m),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class uy extends as{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},o=[i,i,i,i,i,i];this.texture=new Rg(o),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},o=new Ji(5,5,5),a=new Pr({name:"CubemapFromEquirect",uniforms:uo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Gn,blending:Cr});a.uniforms.tEquirect.value=t;const c=new Yt(o,a),d=t.minFilter;return t.minFilter===ss&&(t.minFilter=bi),new cy(1,10,this).update(e,c),t.minFilter=d,c.geometry.dispose(),c.material.dispose(),this}clear(e,t=!0,i=!0,o=!0){const a=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,i,o);e.setRenderTarget(a)}}class Gt extends hn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dy={type:"move"};class Ad{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Gt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Gt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Gt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let o=null,a=null,c=null;const d=this._targetRay,f=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){c=!0;for(const w of e.hand.values()){const y=t.getJointPose(w,i),v=this._getHandJoint(h,w);y!==null&&(v.matrix.fromArray(y.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=y.radius),v.visible=y!==null}const m=h.joints["index-finger-tip"],x=h.joints["thumb-tip"],_=m.position.distanceTo(x.position),S=.02,M=.005;h.inputState.pinching&&_>S+M?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&_<=S-M&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else f!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(f.matrix.fromArray(a.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,a.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(a.linearVelocity)):f.hasLinearVelocity=!1,a.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(a.angularVelocity)):f.hasAngularVelocity=!1));d!==null&&(o=t.getPose(e.targetRaySpace,i),o===null&&a!==null&&(o=a),o!==null&&(d.matrix.fromArray(o.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,o.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(o.linearVelocity)):d.hasLinearVelocity=!1,o.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(o.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(dy)))}return d!==null&&(d.visible=o!==null),f!==null&&(f.visible=a!==null),h!==null&&(h.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Gt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class $f{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Tt(e),this.near=t,this.far=i}clone(){return new $f(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class fy extends hn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Cd=new D,hy=new D,py=new xt;class es{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,o){return this.normal.set(e,t,i),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const o=Cd.subVectors(i,t).cross(hy.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Cd),o=this.normal.dot(i);if(o===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/o;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||py.getNormalMatrix(e),o=this.coplanarPoint(Cd).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-o.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const $r=new xc,my=new Fe(.5,.5),jl=new D;class Kf{constructor(e=new es,t=new es,i=new es,o=new es,a=new es,c=new es){this.planes=[e,t,i,o,a,c]}set(e,t,i,o,a,c){const d=this.planes;return d[0].copy(e),d[1].copy(t),d[2].copy(i),d[3].copy(o),d[4].copy(a),d[5].copy(c),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Pi,i=!1){const o=this.planes,a=e.elements,c=a[0],d=a[1],f=a[2],h=a[3],m=a[4],x=a[5],_=a[6],S=a[7],M=a[8],w=a[9],y=a[10],v=a[11],P=a[12],C=a[13],E=a[14],O=a[15];if(o[0].setComponents(h-c,S-m,v-M,O-P).normalize(),o[1].setComponents(h+c,S+m,v+M,O+P).normalize(),o[2].setComponents(h+d,S+x,v+w,O+C).normalize(),o[3].setComponents(h-d,S-x,v-w,O-C).normalize(),i)o[4].setComponents(f,_,y,E).normalize(),o[5].setComponents(h-f,S-_,v-y,O-E).normalize();else if(o[4].setComponents(h-f,S-_,v-y,O-E).normalize(),t===Pi)o[5].setComponents(h+f,S+_,v+y,O+E).normalize();else if(t===uc)o[5].setComponents(f,_,y,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$r.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$r.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($r)}intersectsSprite(e){$r.center.set(0,0,0);const t=my.distanceTo(e.center);return $r.radius=.7071067811865476+t,$r.applyMatrix4(e.matrixWorld),this.intersectsSphere($r)}intersectsSphere(e){const t=this.planes,i=e.center,o=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const o=t[i];if(jl.x=o.normal.x>0?e.max.x:e.min.x,jl.y=o.normal.y>0?e.max.y:e.min.y,jl.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(jl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class bg extends po{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Tt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const fc=new D,hc=new D,l0=new jt,Qo=new yc,Xl=new xc,Rd=new D,c0=new D;class gy extends hn{constructor(e=new Wn,t=new bg){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let o=1,a=t.count;o<a;o++)fc.fromBufferAttribute(t,o-1),hc.fromBufferAttribute(t,o),i[o]=i[o-1],i[o]+=fc.distanceTo(hc);e.setAttribute("lineDistance",new Zt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,o=this.matrixWorld,a=e.params.Line.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Xl.copy(i.boundingSphere),Xl.applyMatrix4(o),Xl.radius+=a,e.ray.intersectsSphere(Xl)===!1)return;l0.copy(o).invert(),Qo.copy(e.ray).applyMatrix4(l0);const d=a/((this.scale.x+this.scale.y+this.scale.z)/3),f=d*d,h=this.isLineSegments?2:1,m=i.index,_=i.attributes.position;if(m!==null){const S=Math.max(0,c.start),M=Math.min(m.count,c.start+c.count);for(let w=S,y=M-1;w<y;w+=h){const v=m.getX(w),P=m.getX(w+1),C=ql(this,e,Qo,f,v,P,w);C&&t.push(C)}if(this.isLineLoop){const w=m.getX(M-1),y=m.getX(S),v=ql(this,e,Qo,f,w,y,M-1);v&&t.push(v)}}else{const S=Math.max(0,c.start),M=Math.min(_.count,c.start+c.count);for(let w=S,y=M-1;w<y;w+=h){const v=ql(this,e,Qo,f,w,w+1,w);v&&t.push(v)}if(this.isLineLoop){const w=ql(this,e,Qo,f,M-1,S,M-1);w&&t.push(w)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const o=t[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,c=o.length;a<c;a++){const d=o[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=a}}}}}function ql(s,e,t,i,o,a,c){const d=s.geometry.attributes.position;if(fc.fromBufferAttribute(d,o),hc.fromBufferAttribute(d,a),t.distanceSqToSegment(fc,hc,Rd,c0)>i)return;Rd.applyMatrix4(s.matrixWorld);const h=e.ray.origin.distanceTo(Rd);if(!(h<e.near||h>e.far))return{distance:h,point:c0.clone().applyMatrix4(s.matrixWorld),index:c,face:null,faceIndex:null,barycoord:null,object:s}}class vy extends Dn{constructor(e,t,i,o,a,c,d,f,h){super(e,t,i,o,a,c,d,f,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Pg extends Dn{constructor(e,t,i=os,o,a,c,d=xi,f=xi,h,m=da,x=1){if(m!==da&&m!==fa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const _={width:e,height:t,depth:x};super(_,o,a,c,d,f,m,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Yf(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Lg extends Dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Zf extends Wn{constructor(e=1,t=1,i=1,o=32,a=1,c=!1,d=0,f=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:o,heightSegments:a,openEnded:c,thetaStart:d,thetaLength:f};const h=this;o=Math.floor(o),a=Math.floor(a);const m=[],x=[],_=[],S=[];let M=0;const w=[],y=i/2;let v=0;P(),c===!1&&(e>0&&C(!0),t>0&&C(!1)),this.setIndex(m),this.setAttribute("position",new Zt(x,3)),this.setAttribute("normal",new Zt(_,3)),this.setAttribute("uv",new Zt(S,2));function P(){const E=new D,O=new D;let U=0;const F=(t-e)/i;for(let V=0;V<=a;V++){const b=[],R=V/a,H=R*(t-e)+e;for(let Y=0;Y<=o;Y++){const ee=Y/o,de=ee*f+d,se=Math.sin(de),te=Math.cos(de);O.x=H*se,O.y=-R*i+y,O.z=H*te,x.push(O.x,O.y,O.z),E.set(se,F,te).normalize(),_.push(E.x,E.y,E.z),S.push(ee,1-R),b.push(M++)}w.push(b)}for(let V=0;V<o;V++)for(let b=0;b<a;b++){const R=w[b][V],H=w[b+1][V],Y=w[b+1][V+1],ee=w[b][V+1];(e>0||b!==0)&&(m.push(R,H,ee),U+=3),(t>0||b!==a-1)&&(m.push(H,Y,ee),U+=3)}h.addGroup(v,U,0),v+=U}function C(E){const O=M,U=new Fe,F=new D;let V=0;const b=E===!0?e:t,R=E===!0?1:-1;for(let Y=1;Y<=o;Y++)x.push(0,y*R,0),_.push(0,R,0),S.push(.5,.5),M++;const H=M;for(let Y=0;Y<=o;Y++){const de=Y/o*f+d,se=Math.cos(de),te=Math.sin(de);F.x=b*te,F.y=y*R,F.z=b*se,x.push(F.x,F.y,F.z),_.push(0,R,0),U.x=se*.5+.5,U.y=te*.5*R+.5,S.push(U.x,U.y),M++}for(let Y=0;Y<o;Y++){const ee=O+Y,de=H+Y;E===!0?m.push(de,de+1,ee):m.push(de+1,de,ee),V+=3}h.addGroup(v,V,E===!0?1:2),v+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zf(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Jf extends Wn{constructor(e=[],t=[],i=1,o=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:o};const a=[],c=[];d(o),h(i),m(),this.setAttribute("position",new Zt(a,3)),this.setAttribute("normal",new Zt(a.slice(),3)),this.setAttribute("uv",new Zt(c,2)),o===0?this.computeVertexNormals():this.normalizeNormals();function d(P){const C=new D,E=new D,O=new D;for(let U=0;U<t.length;U+=3)S(t[U+0],C),S(t[U+1],E),S(t[U+2],O),f(C,E,O,P)}function f(P,C,E,O){const U=O+1,F=[];for(let V=0;V<=U;V++){F[V]=[];const b=P.clone().lerp(E,V/U),R=C.clone().lerp(E,V/U),H=U-V;for(let Y=0;Y<=H;Y++)Y===0&&V===U?F[V][Y]=b:F[V][Y]=b.clone().lerp(R,Y/H)}for(let V=0;V<U;V++)for(let b=0;b<2*(U-V)-1;b++){const R=Math.floor(b/2);b%2===0?(_(F[V][R+1]),_(F[V+1][R]),_(F[V][R])):(_(F[V][R+1]),_(F[V+1][R+1]),_(F[V+1][R]))}}function h(P){const C=new D;for(let E=0;E<a.length;E+=3)C.x=a[E+0],C.y=a[E+1],C.z=a[E+2],C.normalize().multiplyScalar(P),a[E+0]=C.x,a[E+1]=C.y,a[E+2]=C.z}function m(){const P=new D;for(let C=0;C<a.length;C+=3){P.x=a[C+0],P.y=a[C+1],P.z=a[C+2];const E=y(P)/2/Math.PI+.5,O=v(P)/Math.PI+.5;c.push(E,1-O)}M(),x()}function x(){for(let P=0;P<c.length;P+=6){const C=c[P+0],E=c[P+2],O=c[P+4],U=Math.max(C,E,O),F=Math.min(C,E,O);U>.9&&F<.1&&(C<.2&&(c[P+0]+=1),E<.2&&(c[P+2]+=1),O<.2&&(c[P+4]+=1))}}function _(P){a.push(P.x,P.y,P.z)}function S(P,C){const E=P*3;C.x=e[E+0],C.y=e[E+1],C.z=e[E+2]}function M(){const P=new D,C=new D,E=new D,O=new D,U=new Fe,F=new Fe,V=new Fe;for(let b=0,R=0;b<a.length;b+=9,R+=6){P.set(a[b+0],a[b+1],a[b+2]),C.set(a[b+3],a[b+4],a[b+5]),E.set(a[b+6],a[b+7],a[b+8]),U.set(c[R+0],c[R+1]),F.set(c[R+2],c[R+3]),V.set(c[R+4],c[R+5]),O.copy(P).add(C).add(E).divideScalar(3);const H=y(O);w(U,R+0,P,H),w(F,R+2,C,H),w(V,R+4,E,H)}}function w(P,C,E,O){O<0&&P.x===1&&(c[C]=P.x-1),E.x===0&&E.z===0&&(c[C]=O/2/Math.PI+.5)}function y(P){return Math.atan2(P.z,-P.x)}function v(P){return Math.atan2(-P.y,Math.sqrt(P.x*P.x+P.z*P.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jf(e.vertices,e.indices,e.radius,e.details)}}class Di{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,o=this.getPoint(0),a=0;t.push(0);for(let c=1;c<=e;c++)i=this.getPoint(c/e),a+=i.distanceTo(o),t.push(a),o=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let o=0;const a=i.length;let c;t?c=t:c=e*i[a-1];let d=0,f=a-1,h;for(;d<=f;)if(o=Math.floor(d+(f-d)/2),h=i[o]-c,h<0)d=o+1;else if(h>0)f=o-1;else{f=o;break}if(o=f,i[o]===c)return o/(a-1);const m=i[o],_=i[o+1]-m,S=(c-m)/_;return(o+S)/(a-1)}getTangent(e,t){let o=e-1e-4,a=e+1e-4;o<0&&(o=0),a>1&&(a=1);const c=this.getPoint(o),d=this.getPoint(a),f=t||(c.isVector2?new Fe:new D);return f.copy(d).sub(c).normalize(),f}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new D,o=[],a=[],c=[],d=new D,f=new jt;for(let S=0;S<=e;S++){const M=S/e;o[S]=this.getTangentAt(M,new D)}a[0]=new D,c[0]=new D;let h=Number.MAX_VALUE;const m=Math.abs(o[0].x),x=Math.abs(o[0].y),_=Math.abs(o[0].z);m<=h&&(h=m,i.set(1,0,0)),x<=h&&(h=x,i.set(0,1,0)),_<=h&&i.set(0,0,1),d.crossVectors(o[0],i).normalize(),a[0].crossVectors(o[0],d),c[0].crossVectors(o[0],a[0]);for(let S=1;S<=e;S++){if(a[S]=a[S-1].clone(),c[S]=c[S-1].clone(),d.crossVectors(o[S-1],o[S]),d.length()>Number.EPSILON){d.normalize();const M=Math.acos(Mt(o[S-1].dot(o[S]),-1,1));a[S].applyMatrix4(f.makeRotationAxis(d,M))}c[S].crossVectors(o[S],a[S])}if(t===!0){let S=Math.acos(Mt(a[0].dot(a[e]),-1,1));S/=e,o[0].dot(d.crossVectors(a[0],a[e]))>0&&(S=-S);for(let M=1;M<=e;M++)a[M].applyMatrix4(f.makeRotationAxis(o[M],S*M)),c[M].crossVectors(o[M],a[M])}return{tangents:o,normals:a,binormals:c}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Qf extends Di{constructor(e=0,t=0,i=1,o=1,a=0,c=Math.PI*2,d=!1,f=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=o,this.aStartAngle=a,this.aEndAngle=c,this.aClockwise=d,this.aRotation=f}getPoint(e,t=new Fe){const i=t,o=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const c=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=o;for(;a>o;)a-=o;a<Number.EPSILON&&(c?a=0:a=o),this.aClockwise===!0&&!c&&(a===o?a=-o:a=a-o);const d=this.aStartAngle+e*a;let f=this.aX+this.xRadius*Math.cos(d),h=this.aY+this.yRadius*Math.sin(d);if(this.aRotation!==0){const m=Math.cos(this.aRotation),x=Math.sin(this.aRotation),_=f-this.aX,S=h-this.aY;f=_*m-S*x+this.aX,h=_*x+S*m+this.aY}return i.set(f,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class _y extends Qf{constructor(e,t,i,o,a,c){super(e,t,i,i,o,a,c),this.isArcCurve=!0,this.type="ArcCurve"}}function eh(){let s=0,e=0,t=0,i=0;function o(a,c,d,f){s=a,e=d,t=-3*a+3*c-2*d-f,i=2*a-2*c+d+f}return{initCatmullRom:function(a,c,d,f,h){o(c,d,h*(d-a),h*(f-c))},initNonuniformCatmullRom:function(a,c,d,f,h,m,x){let _=(c-a)/h-(d-a)/(h+m)+(d-c)/m,S=(d-c)/m-(f-c)/(m+x)+(f-d)/x;_*=m,S*=m,o(c,d,_,S)},calc:function(a){const c=a*a,d=c*a;return s+e*a+t*c+i*d}}}const Yl=new D,bd=new eh,Pd=new eh,Ld=new eh;class If extends Di{constructor(e=[],t=!1,i="centripetal",o=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=o}getPoint(e,t=new D){const i=t,o=this.points,a=o.length,c=(a-(this.closed?0:1))*e;let d=Math.floor(c),f=c-d;this.closed?d+=d>0?0:(Math.floor(Math.abs(d)/a)+1)*a:f===0&&d===a-1&&(d=a-2,f=1);let h,m;this.closed||d>0?h=o[(d-1)%a]:(Yl.subVectors(o[0],o[1]).add(o[0]),h=Yl);const x=o[d%a],_=o[(d+1)%a];if(this.closed||d+2<a?m=o[(d+2)%a]:(Yl.subVectors(o[a-1],o[a-2]).add(o[a-1]),m=Yl),this.curveType==="centripetal"||this.curveType==="chordal"){const S=this.curveType==="chordal"?.5:.25;let M=Math.pow(h.distanceToSquared(x),S),w=Math.pow(x.distanceToSquared(_),S),y=Math.pow(_.distanceToSquared(m),S);w<1e-4&&(w=1),M<1e-4&&(M=w),y<1e-4&&(y=w),bd.initNonuniformCatmullRom(h.x,x.x,_.x,m.x,M,w,y),Pd.initNonuniformCatmullRom(h.y,x.y,_.y,m.y,M,w,y),Ld.initNonuniformCatmullRom(h.z,x.z,_.z,m.z,M,w,y)}else this.curveType==="catmullrom"&&(bd.initCatmullRom(h.x,x.x,_.x,m.x,this.tension),Pd.initCatmullRom(h.y,x.y,_.y,m.y,this.tension),Ld.initCatmullRom(h.z,x.z,_.z,m.z,this.tension));return i.set(bd.calc(f),Pd.calc(f),Ld.calc(f)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const o=e.points[t];this.points.push(o.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const o=this.points[t];e.points.push(o.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const o=e.points[t];this.points.push(new D().fromArray(o))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function u0(s,e,t,i,o){const a=(i-e)*.5,c=(o-t)*.5,d=s*s,f=s*d;return(2*t-2*i+a+c)*f+(-3*t+3*i-2*a-c)*d+a*s+t}function xy(s,e){const t=1-s;return t*t*e}function yy(s,e){return 2*(1-s)*s*e}function Sy(s,e){return s*s*e}function aa(s,e,t,i){return xy(s,e)+yy(s,t)+Sy(s,i)}function My(s,e){const t=1-s;return t*t*t*e}function Ey(s,e){const t=1-s;return 3*t*t*s*e}function wy(s,e){return 3*(1-s)*s*s*e}function Ty(s,e){return s*s*s*e}function la(s,e,t,i,o){return My(s,e)+Ey(s,t)+wy(s,i)+Ty(s,o)}class Ng extends Di{constructor(e=new Fe,t=new Fe,i=new Fe,o=new Fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=o}getPoint(e,t=new Fe){const i=t,o=this.v0,a=this.v1,c=this.v2,d=this.v3;return i.set(la(e,o.x,a.x,c.x,d.x),la(e,o.y,a.y,c.y,d.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Ay extends Di{constructor(e=new D,t=new D,i=new D,o=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=o}getPoint(e,t=new D){const i=t,o=this.v0,a=this.v1,c=this.v2,d=this.v3;return i.set(la(e,o.x,a.x,c.x,d.x),la(e,o.y,a.y,c.y,d.y),la(e,o.z,a.z,c.z,d.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Dg extends Di{constructor(e=new Fe,t=new Fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Fe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Cy extends Di{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ig extends Di{constructor(e=new Fe,t=new Fe,i=new Fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Fe){const i=t,o=this.v0,a=this.v1,c=this.v2;return i.set(aa(e,o.x,a.x,c.x),aa(e,o.y,a.y,c.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ug extends Di{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){const i=t,o=this.v0,a=this.v1,c=this.v2;return i.set(aa(e,o.x,a.x,c.x),aa(e,o.y,a.y,c.y),aa(e,o.z,a.z,c.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Fg extends Di{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Fe){const i=t,o=this.points,a=(o.length-1)*e,c=Math.floor(a),d=a-c,f=o[c===0?c:c-1],h=o[c],m=o[c>o.length-2?o.length-1:c+1],x=o[c>o.length-3?o.length-1:c+2];return i.set(u0(d,f.x,h.x,m.x,x.x),u0(d,f.y,h.y,m.y,x.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const o=e.points[t];this.points.push(o.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const o=this.points[t];e.points.push(o.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const o=e.points[t];this.points.push(new Fe().fromArray(o))}return this}}var pc=Object.freeze({__proto__:null,ArcCurve:_y,CatmullRomCurve3:If,CubicBezierCurve:Ng,CubicBezierCurve3:Ay,EllipseCurve:Qf,LineCurve:Dg,LineCurve3:Cy,QuadraticBezierCurve:Ig,QuadraticBezierCurve3:Ug,SplineCurve:Fg});class Ry extends Di{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new pc[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),o=this.getCurveLengths();let a=0;for(;a<o.length;){if(o[a]>=i){const c=o[a]-i,d=this.curves[a],f=d.getLength(),h=f===0?0:1-c/f;return d.getPointAt(h,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,o=this.curves.length;i<o;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let o=0,a=this.curves;o<a.length;o++){const c=a[o],d=c.isEllipseCurve?e*2:c.isLineCurve||c.isLineCurve3?1:c.isSplineCurve?e*c.points.length:e,f=c.getPoints(d);for(let h=0;h<f.length;h++){const m=f[h];i&&i.equals(m)||(t.push(m),i=m)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const o=e.curves[t];this.curves.push(o.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const o=this.curves[t];e.curves.push(o.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const o=e.curves[t];this.curves.push(new pc[o.type]().fromJSON(o))}return this}}class d0 extends Ry{constructor(e){super(),this.type="Path",this.currentPoint=new Fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Dg(this.currentPoint.clone(),new Fe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,o){const a=new Ig(this.currentPoint.clone(),new Fe(e,t),new Fe(i,o));return this.curves.push(a),this.currentPoint.set(i,o),this}bezierCurveTo(e,t,i,o,a,c){const d=new Ng(this.currentPoint.clone(),new Fe(e,t),new Fe(i,o),new Fe(a,c));return this.curves.push(d),this.currentPoint.set(a,c),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Fg(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,o,a,c){const d=this.currentPoint.x,f=this.currentPoint.y;return this.absarc(e+d,t+f,i,o,a,c),this}absarc(e,t,i,o,a,c){return this.absellipse(e,t,i,i,o,a,c),this}ellipse(e,t,i,o,a,c,d,f){const h=this.currentPoint.x,m=this.currentPoint.y;return this.absellipse(e+h,t+m,i,o,a,c,d,f),this}absellipse(e,t,i,o,a,c,d,f){const h=new Qf(e,t,i,o,a,c,d,f);if(this.curves.length>0){const x=h.getPoint(0);x.equals(this.currentPoint)||this.lineTo(x.x,x.y)}this.curves.push(h);const m=h.getPoint(1);return this.currentPoint.copy(m),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Og extends d0{constructor(e){super(e),this.uuid=us(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,o=this.holes.length;i<o;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const o=e.holes[t];this.holes.push(o.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const o=this.holes[t];e.holes.push(o.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const o=e.holes[t];this.holes.push(new d0().fromJSON(o))}return this}}function by(s,e,t=2){const i=e&&e.length,o=i?e[0]*t:s.length;let a=kg(s,0,o,t,!0);const c=[];if(!a||a.next===a.prev)return c;let d,f,h;if(i&&(a=Iy(s,e,a,t)),s.length>80*t){d=1/0,f=1/0;let m=-1/0,x=-1/0;for(let _=t;_<o;_+=t){const S=s[_],M=s[_+1];S<d&&(d=S),M<f&&(f=M),S>m&&(m=S),M>x&&(x=M)}h=Math.max(m-d,x-f),h=h!==0?32767/h:0}return ma(a,c,t,d,f,h,0),c}function kg(s,e,t,i,o){let a;if(o===jy(s,e,t,i)>0)for(let c=e;c<t;c+=i)a=f0(c/i|0,s[c],s[c+1],a);else for(let c=t-i;c>=e;c-=i)a=f0(c/i|0,s[c],s[c+1],a);return a&&fo(a,a.next)&&(va(a),a=a.next),a}function ls(s,e){if(!s)return s;e||(e=s);let t=s,i;do if(i=!1,!t.steiner&&(fo(t,t.next)||$t(t.prev,t,t.next)===0)){if(va(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function ma(s,e,t,i,o,a,c){if(!s)return;!c&&a&&zy(s,i,o,a);let d=s;for(;s.prev!==s.next;){const f=s.prev,h=s.next;if(a?Ly(s,i,o,a):Py(s)){e.push(f.i,s.i,h.i),va(s),s=h.next,d=h.next;continue}if(s=h,s===d){c?c===1?(s=Ny(ls(s),e),ma(s,e,t,i,o,a,2)):c===2&&Dy(s,e,t,i,o,a):ma(ls(s),e,t,i,o,a,1);break}}}function Py(s){const e=s.prev,t=s,i=s.next;if($t(e,t,i)>=0)return!1;const o=e.x,a=t.x,c=i.x,d=e.y,f=t.y,h=i.y,m=Math.min(o,a,c),x=Math.min(d,f,h),_=Math.max(o,a,c),S=Math.max(d,f,h);let M=i.next;for(;M!==e;){if(M.x>=m&&M.x<=_&&M.y>=x&&M.y<=S&&ia(o,d,a,f,c,h,M.x,M.y)&&$t(M.prev,M,M.next)>=0)return!1;M=M.next}return!0}function Ly(s,e,t,i){const o=s.prev,a=s,c=s.next;if($t(o,a,c)>=0)return!1;const d=o.x,f=a.x,h=c.x,m=o.y,x=a.y,_=c.y,S=Math.min(d,f,h),M=Math.min(m,x,_),w=Math.max(d,f,h),y=Math.max(m,x,_),v=Uf(S,M,e,t,i),P=Uf(w,y,e,t,i);let C=s.prevZ,E=s.nextZ;for(;C&&C.z>=v&&E&&E.z<=P;){if(C.x>=S&&C.x<=w&&C.y>=M&&C.y<=y&&C!==o&&C!==c&&ia(d,m,f,x,h,_,C.x,C.y)&&$t(C.prev,C,C.next)>=0||(C=C.prevZ,E.x>=S&&E.x<=w&&E.y>=M&&E.y<=y&&E!==o&&E!==c&&ia(d,m,f,x,h,_,E.x,E.y)&&$t(E.prev,E,E.next)>=0))return!1;E=E.nextZ}for(;C&&C.z>=v;){if(C.x>=S&&C.x<=w&&C.y>=M&&C.y<=y&&C!==o&&C!==c&&ia(d,m,f,x,h,_,C.x,C.y)&&$t(C.prev,C,C.next)>=0)return!1;C=C.prevZ}for(;E&&E.z<=P;){if(E.x>=S&&E.x<=w&&E.y>=M&&E.y<=y&&E!==o&&E!==c&&ia(d,m,f,x,h,_,E.x,E.y)&&$t(E.prev,E,E.next)>=0)return!1;E=E.nextZ}return!0}function Ny(s,e){let t=s;do{const i=t.prev,o=t.next.next;!fo(i,o)&&Bg(i,t,t.next,o)&&ga(i,o)&&ga(o,i)&&(e.push(i.i,t.i,o.i),va(t),va(t.next),t=s=o),t=t.next}while(t!==s);return ls(t)}function Dy(s,e,t,i,o,a){let c=s;do{let d=c.next.next;for(;d!==c.prev;){if(c.i!==d.i&&Hy(c,d)){let f=Vg(c,d);c=ls(c,c.next),f=ls(f,f.next),ma(c,e,t,i,o,a,0),ma(f,e,t,i,o,a,0);return}d=d.next}c=c.next}while(c!==s)}function Iy(s,e,t,i){const o=[];for(let a=0,c=e.length;a<c;a++){const d=e[a]*i,f=a<c-1?e[a+1]*i:s.length,h=kg(s,d,f,i,!1);h===h.next&&(h.steiner=!0),o.push(Vy(h))}o.sort(Uy);for(let a=0;a<o.length;a++)t=Fy(o[a],t);return t}function Uy(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const i=(s.next.y-s.y)/(s.next.x-s.x),o=(e.next.y-e.y)/(e.next.x-e.x);t=i-o}return t}function Fy(s,e){const t=Oy(s,e);if(!t)return e;const i=Vg(t,s);return ls(i,i.next),ls(t,t.next)}function Oy(s,e){let t=e;const i=s.x,o=s.y;let a=-1/0,c;if(fo(s,t))return t;do{if(fo(s,t.next))return t.next;if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const x=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(x<=i&&x>a&&(a=x,c=t.x<t.next.x?t:t.next,x===i))return c}t=t.next}while(t!==e);if(!c)return null;const d=c,f=c.x,h=c.y;let m=1/0;t=c;do{if(i>=t.x&&t.x>=f&&i!==t.x&&zg(o<h?i:a,o,f,h,o<h?a:i,o,t.x,t.y)){const x=Math.abs(o-t.y)/(i-t.x);ga(t,s)&&(x<m||x===m&&(t.x>c.x||t.x===c.x&&ky(c,t)))&&(c=t,m=x)}t=t.next}while(t!==d);return c}function ky(s,e){return $t(s.prev,s,e.prev)<0&&$t(e.next,s,s.next)<0}function zy(s,e,t,i){let o=s;do o.z===0&&(o.z=Uf(o.x,o.y,e,t,i)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==s);o.prevZ.nextZ=null,o.prevZ=null,By(o)}function By(s){let e,t=1;do{let i=s,o;s=null;let a=null;for(e=0;i;){e++;let c=i,d=0;for(let h=0;h<t&&(d++,c=c.nextZ,!!c);h++);let f=t;for(;d>0||f>0&&c;)d!==0&&(f===0||!c||i.z<=c.z)?(o=i,i=i.nextZ,d--):(o=c,c=c.nextZ,f--),a?a.nextZ=o:s=o,o.prevZ=a,a=o;i=c}a.nextZ=null,t*=2}while(e>1);return s}function Uf(s,e,t,i,o){return s=(s-t)*o|0,e=(e-i)*o|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function Vy(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function zg(s,e,t,i,o,a,c,d){return(o-c)*(e-d)>=(s-c)*(a-d)&&(s-c)*(i-d)>=(t-c)*(e-d)&&(t-c)*(a-d)>=(o-c)*(i-d)}function ia(s,e,t,i,o,a,c,d){return!(s===c&&e===d)&&zg(s,e,t,i,o,a,c,d)}function Hy(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!Gy(s,e)&&(ga(s,e)&&ga(e,s)&&Wy(s,e)&&($t(s.prev,s,e.prev)||$t(s,e.prev,e))||fo(s,e)&&$t(s.prev,s,s.next)>0&&$t(e.prev,e,e.next)>0)}function $t(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function fo(s,e){return s.x===e.x&&s.y===e.y}function Bg(s,e,t,i){const o=Kl($t(s,e,t)),a=Kl($t(s,e,i)),c=Kl($t(t,i,s)),d=Kl($t(t,i,e));return!!(o!==a&&c!==d||o===0&&$l(s,t,e)||a===0&&$l(s,i,e)||c===0&&$l(t,s,i)||d===0&&$l(t,e,i))}function $l(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Kl(s){return s>0?1:s<0?-1:0}function Gy(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Bg(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function ga(s,e){return $t(s.prev,s,s.next)<0?$t(s,e,s.next)>=0&&$t(s,s.prev,e)>=0:$t(s,e,s.prev)<0||$t(s,s.next,e)<0}function Wy(s,e){let t=s,i=!1;const o=(s.x+e.x)/2,a=(s.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&o<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==s);return i}function Vg(s,e){const t=Ff(s.i,s.x,s.y),i=Ff(e.i,e.x,e.y),o=s.next,a=e.prev;return s.next=e,e.prev=s,t.next=o,o.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function f0(s,e,t,i){const o=Ff(s,e,t);return i?(o.next=i.next,o.prev=i,i.next.prev=o,i.next=o):(o.prev=o,o.next=o),o}function va(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Ff(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function jy(s,e,t,i){let o=0;for(let a=e,c=t-i;a<t;a+=i)o+=(s[c]-s[a])*(s[a+1]+s[c+1]),c=a;return o}class Xy{static triangulate(e,t,i=2){return by(e,t,i)}}class to{static area(e){const t=e.length;let i=0;for(let o=t-1,a=0;a<t;o=a++)i+=e[o].x*e[a].y-e[a].x*e[o].y;return i*.5}static isClockWise(e){return to.area(e)<0}static triangulateShape(e,t){const i=[],o=[],a=[];h0(e),p0(i,e);let c=e.length;t.forEach(h0);for(let f=0;f<t.length;f++)o.push(c),c+=t[f].length,p0(i,t[f]);const d=Xy.triangulate(i,o);for(let f=0;f<d.length;f+=3)a.push(d.slice(f,f+3));return a}}function h0(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function p0(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class th extends Wn{constructor(e=new Og([new Fe(.5,.5),new Fe(-.5,.5),new Fe(-.5,-.5),new Fe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,o=[],a=[];for(let d=0,f=e.length;d<f;d++){const h=e[d];c(h)}this.setAttribute("position",new Zt(o,3)),this.setAttribute("uv",new Zt(a,2)),this.computeVertexNormals();function c(d){const f=[],h=t.curveSegments!==void 0?t.curveSegments:12,m=t.steps!==void 0?t.steps:1,x=t.depth!==void 0?t.depth:1;let _=t.bevelEnabled!==void 0?t.bevelEnabled:!0,S=t.bevelThickness!==void 0?t.bevelThickness:.2,M=t.bevelSize!==void 0?t.bevelSize:S-.1,w=t.bevelOffset!==void 0?t.bevelOffset:0,y=t.bevelSegments!==void 0?t.bevelSegments:3;const v=t.extrudePath,P=t.UVGenerator!==void 0?t.UVGenerator:qy;let C,E=!1,O,U,F,V;v&&(C=v.getSpacedPoints(m),E=!0,_=!1,O=v.computeFrenetFrames(m,!1),U=new D,F=new D,V=new D),_||(y=0,S=0,M=0,w=0);const b=d.extractPoints(h);let R=b.shape;const H=b.holes;if(!to.isClockWise(R)){R=R.reverse();for(let ye=0,ve=H.length;ye<ve;ye++){const ge=H[ye];to.isClockWise(ge)&&(H[ye]=ge.reverse())}}function ee(ye){const ge=10000000000000001e-36;let me=ye[0];for(let Ie=1;Ie<=ye.length;Ie++){const Ee=Ie%ye.length,Ne=ye[Ee],ut=Ne.x-me.x,ht=Ne.y-me.y,I=ut*ut+ht*ht,A=Math.max(Math.abs(Ne.x),Math.abs(Ne.y),Math.abs(me.x),Math.abs(me.y)),K=ge*A*A;if(I<=K){ye.splice(Ee,1),Ie--;continue}me=Ne}}ee(R),H.forEach(ee);const de=H.length,se=R;for(let ye=0;ye<de;ye++){const ve=H[ye];R=R.concat(ve)}function te(ye,ve,ge){return ve||console.error("THREE.ExtrudeGeometry: vec does not exist"),ye.clone().addScaledVector(ve,ge)}const le=R.length;function W(ye,ve,ge){let me,Ie,Ee;const Ne=ye.x-ve.x,ut=ye.y-ve.y,ht=ge.x-ye.x,I=ge.y-ye.y,A=Ne*Ne+ut*ut,K=Ne*I-ut*ht;if(Math.abs(K)>Number.EPSILON){const ue=Math.sqrt(A),xe=Math.sqrt(ht*ht+I*I),he=ve.x-ut/ue,Qe=ve.y+Ne/ue,Pe=ge.x-I/xe,Ye=ge.y+ht/xe,et=((Pe-he)*I-(Ye-Qe)*ht)/(Ne*I-ut*ht);me=he+Ne*et-ye.x,Ie=Qe+ut*et-ye.y;const Ae=me*me+Ie*Ie;if(Ae<=2)return new Fe(me,Ie);Ee=Math.sqrt(Ae/2)}else{let ue=!1;Ne>Number.EPSILON?ht>Number.EPSILON&&(ue=!0):Ne<-Number.EPSILON?ht<-Number.EPSILON&&(ue=!0):Math.sign(ut)===Math.sign(I)&&(ue=!0),ue?(me=-ut,Ie=Ne,Ee=Math.sqrt(A)):(me=Ne,Ie=ut,Ee=Math.sqrt(A/2))}return new Fe(me/Ee,Ie/Ee)}const fe=[];for(let ye=0,ve=se.length,ge=ve-1,me=ye+1;ye<ve;ye++,ge++,me++)ge===ve&&(ge=0),me===ve&&(me=0),fe[ye]=W(se[ye],se[ge],se[me]);const ce=[];let B,re=fe.concat();for(let ye=0,ve=de;ye<ve;ye++){const ge=H[ye];B=[];for(let me=0,Ie=ge.length,Ee=Ie-1,Ne=me+1;me<Ie;me++,Ee++,Ne++)Ee===Ie&&(Ee=0),Ne===Ie&&(Ne=0),B[me]=W(ge[me],ge[Ee],ge[Ne]);ce.push(B),re=re.concat(B)}let Be;if(y===0)Be=to.triangulateShape(se,H);else{const ye=[],ve=[];for(let ge=0;ge<y;ge++){const me=ge/y,Ie=S*Math.cos(me*Math.PI/2),Ee=M*Math.sin(me*Math.PI/2)+w;for(let Ne=0,ut=se.length;Ne<ut;Ne++){const ht=te(se[Ne],fe[Ne],Ee);Ue(ht.x,ht.y,-Ie),me===0&&ye.push(ht)}for(let Ne=0,ut=de;Ne<ut;Ne++){const ht=H[Ne];B=ce[Ne];const I=[];for(let A=0,K=ht.length;A<K;A++){const ue=te(ht[A],B[A],Ee);Ue(ue.x,ue.y,-Ie),me===0&&I.push(ue)}me===0&&ve.push(I)}}Be=to.triangulateShape(ye,ve)}const Xe=Be.length,qe=M+w;for(let ye=0;ye<le;ye++){const ve=_?te(R[ye],re[ye],qe):R[ye];E?(F.copy(O.normals[0]).multiplyScalar(ve.x),U.copy(O.binormals[0]).multiplyScalar(ve.y),V.copy(C[0]).add(F).add(U),Ue(V.x,V.y,V.z)):Ue(ve.x,ve.y,0)}for(let ye=1;ye<=m;ye++)for(let ve=0;ve<le;ve++){const ge=_?te(R[ve],re[ve],qe):R[ve];E?(F.copy(O.normals[ye]).multiplyScalar(ge.x),U.copy(O.binormals[ye]).multiplyScalar(ge.y),V.copy(C[ye]).add(F).add(U),Ue(V.x,V.y,V.z)):Ue(ge.x,ge.y,x/m*ye)}for(let ye=y-1;ye>=0;ye--){const ve=ye/y,ge=S*Math.cos(ve*Math.PI/2),me=M*Math.sin(ve*Math.PI/2)+w;for(let Ie=0,Ee=se.length;Ie<Ee;Ie++){const Ne=te(se[Ie],fe[Ie],me);Ue(Ne.x,Ne.y,x+ge)}for(let Ie=0,Ee=H.length;Ie<Ee;Ie++){const Ne=H[Ie];B=ce[Ie];for(let ut=0,ht=Ne.length;ut<ht;ut++){const I=te(Ne[ut],B[ut],me);E?Ue(I.x,I.y+C[m-1].y,C[m-1].x+ge):Ue(I.x,I.y,x+ge)}}}ne(),pe();function ne(){const ye=o.length/3;if(_){let ve=0,ge=le*ve;for(let me=0;me<Xe;me++){const Ie=Be[me];Ve(Ie[2]+ge,Ie[1]+ge,Ie[0]+ge)}ve=m+y*2,ge=le*ve;for(let me=0;me<Xe;me++){const Ie=Be[me];Ve(Ie[0]+ge,Ie[1]+ge,Ie[2]+ge)}}else{for(let ve=0;ve<Xe;ve++){const ge=Be[ve];Ve(ge[2],ge[1],ge[0])}for(let ve=0;ve<Xe;ve++){const ge=Be[ve];Ve(ge[0]+le*m,ge[1]+le*m,ge[2]+le*m)}}i.addGroup(ye,o.length/3-ye,0)}function pe(){const ye=o.length/3;let ve=0;Te(se,ve),ve+=se.length;for(let ge=0,me=H.length;ge<me;ge++){const Ie=H[ge];Te(Ie,ve),ve+=Ie.length}i.addGroup(ye,o.length/3-ye,1)}function Te(ye,ve){let ge=ye.length;for(;--ge>=0;){const me=ge;let Ie=ge-1;Ie<0&&(Ie=ye.length-1);for(let Ee=0,Ne=m+y*2;Ee<Ne;Ee++){const ut=le*Ee,ht=le*(Ee+1),I=ve+me+ut,A=ve+Ie+ut,K=ve+Ie+ht,ue=ve+me+ht;_t(I,A,K,ue)}}}function Ue(ye,ve,ge){f.push(ye),f.push(ve),f.push(ge)}function Ve(ye,ve,ge){Nt(ye),Nt(ve),Nt(ge);const me=o.length/3,Ie=P.generateTopUV(i,o,me-3,me-2,me-1);z(Ie[0]),z(Ie[1]),z(Ie[2])}function _t(ye,ve,ge,me){Nt(ye),Nt(ve),Nt(me),Nt(ve),Nt(ge),Nt(me);const Ie=o.length/3,Ee=P.generateSideWallUV(i,o,Ie-6,Ie-3,Ie-2,Ie-1);z(Ee[0]),z(Ee[1]),z(Ee[3]),z(Ee[1]),z(Ee[2]),z(Ee[3])}function Nt(ye){o.push(f[ye*3+0]),o.push(f[ye*3+1]),o.push(f[ye*3+2])}function z(ye){a.push(ye.x),a.push(ye.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Yy(t,i,e)}static fromJSON(e,t){const i=[];for(let a=0,c=e.shapes.length;a<c;a++){const d=t[e.shapes[a]];i.push(d)}const o=e.options.extrudePath;return o!==void 0&&(e.options.extrudePath=new pc[o.type]().fromJSON(o)),new th(i,e.options)}}const qy={generateTopUV:function(s,e,t,i,o){const a=e[t*3],c=e[t*3+1],d=e[i*3],f=e[i*3+1],h=e[o*3],m=e[o*3+1];return[new Fe(a,c),new Fe(d,f),new Fe(h,m)]},generateSideWallUV:function(s,e,t,i,o,a){const c=e[t*3],d=e[t*3+1],f=e[t*3+2],h=e[i*3],m=e[i*3+1],x=e[i*3+2],_=e[o*3],S=e[o*3+1],M=e[o*3+2],w=e[a*3],y=e[a*3+1],v=e[a*3+2];return Math.abs(d-m)<Math.abs(c-h)?[new Fe(c,1-f),new Fe(h,1-x),new Fe(_,1-M),new Fe(w,1-v)]:[new Fe(d,1-f),new Fe(m,1-x),new Fe(S,1-M),new Fe(y,1-v)]}};function Yy(s,e,t){if(t.shapes=[],Array.isArray(s))for(let i=0,o=s.length;i<o;i++){const a=s[i];t.shapes.push(a.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class mc extends Jf{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],o=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,o,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new mc(e.radius,e.detail)}}class cs extends Wn{constructor(e=1,t=1,i=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:o};const a=e/2,c=t/2,d=Math.floor(i),f=Math.floor(o),h=d+1,m=f+1,x=e/d,_=t/f,S=[],M=[],w=[],y=[];for(let v=0;v<m;v++){const P=v*_-c;for(let C=0;C<h;C++){const E=C*x-a;M.push(E,-P,0),w.push(0,0,1),y.push(C/d),y.push(1-v/f)}}for(let v=0;v<f;v++)for(let P=0;P<d;P++){const C=P+h*v,E=P+h*(v+1),O=P+1+h*(v+1),U=P+1+h*v;S.push(C,E,U),S.push(E,O,U)}this.setIndex(S),this.setAttribute("position",new Zt(M,3)),this.setAttribute("normal",new Zt(w,3)),this.setAttribute("uv",new Zt(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cs(e.width,e.height,e.widthSegments,e.heightSegments)}}class nh extends Wn{constructor(e=1,t=32,i=16,o=0,a=Math.PI*2,c=0,d=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:o,phiLength:a,thetaStart:c,thetaLength:d},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const f=Math.min(c+d,Math.PI);let h=0;const m=[],x=new D,_=new D,S=[],M=[],w=[],y=[];for(let v=0;v<=i;v++){const P=[],C=v/i;let E=0;v===0&&c===0?E=.5/t:v===i&&f===Math.PI&&(E=-.5/t);for(let O=0;O<=t;O++){const U=O/t;x.x=-e*Math.cos(o+U*a)*Math.sin(c+C*d),x.y=e*Math.cos(c+C*d),x.z=e*Math.sin(o+U*a)*Math.sin(c+C*d),M.push(x.x,x.y,x.z),_.copy(x).normalize(),w.push(_.x,_.y,_.z),y.push(U+E,1-C),P.push(h++)}m.push(P)}for(let v=0;v<i;v++)for(let P=0;P<t;P++){const C=m[v][P+1],E=m[v][P],O=m[v+1][P],U=m[v+1][P+1];(v!==0||c>0)&&S.push(C,E,U),(v!==i-1||f<Math.PI)&&S.push(E,O,U)}this.setIndex(S),this.setAttribute("position",new Zt(M,3)),this.setAttribute("normal",new Zt(w,3)),this.setAttribute("uv",new Zt(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nh(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class gc extends Wn{constructor(e=new Ug(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,i=1,o=8,a=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:o,closed:a};const c=e.computeFrenetFrames(t,a);this.tangents=c.tangents,this.normals=c.normals,this.binormals=c.binormals;const d=new D,f=new D,h=new Fe;let m=new D;const x=[],_=[],S=[],M=[];w(),this.setIndex(M),this.setAttribute("position",new Zt(x,3)),this.setAttribute("normal",new Zt(_,3)),this.setAttribute("uv",new Zt(S,2));function w(){for(let C=0;C<t;C++)y(C);y(a===!1?t:0),P(),v()}function y(C){m=e.getPointAt(C/t,m);const E=c.normals[C],O=c.binormals[C];for(let U=0;U<=o;U++){const F=U/o*Math.PI*2,V=Math.sin(F),b=-Math.cos(F);f.x=b*E.x+V*O.x,f.y=b*E.y+V*O.y,f.z=b*E.z+V*O.z,f.normalize(),_.push(f.x,f.y,f.z),d.x=m.x+i*f.x,d.y=m.y+i*f.y,d.z=m.z+i*f.z,x.push(d.x,d.y,d.z)}}function v(){for(let C=1;C<=t;C++)for(let E=1;E<=o;E++){const O=(o+1)*(C-1)+(E-1),U=(o+1)*C+(E-1),F=(o+1)*C+E,V=(o+1)*(C-1)+E;M.push(O,U,V),M.push(U,F,V)}}function P(){for(let C=0;C<=t;C++)for(let E=0;E<=o;E++)h.x=C/t,h.y=E/o,S.push(h.x,h.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new gc(new pc[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class An extends po{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_g,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class $y extends po{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=px,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ky extends po{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ih extends hn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Tt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Zy extends ih{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(hn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Tt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Nd=new jt,m0=new D,g0=new D;class Hg{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Fe(512,512),this.mapType=Ni,this.map=null,this.mapPass=null,this.matrix=new jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kf,this._frameExtents=new Fe(1,1),this._viewportCount=1,this._viewports=[new Ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;m0.setFromMatrixPosition(e.matrixWorld),t.position.copy(m0),g0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(g0),t.updateMatrixWorld(),Nd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Nd,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Nd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const v0=new jt,ea=new D,Dd=new D;class Jy extends Hg{constructor(){super(new Jn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Fe(4,2),this._viewportCount=6,this._viewports=[new Ot(2,1,1,1),new Ot(0,1,1,1),new Ot(3,1,1,1),new Ot(1,1,1,1),new Ot(3,0,1,1),new Ot(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,o=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),ea.setFromMatrixPosition(e.matrixWorld),i.position.copy(ea),Dd.copy(i.position),Dd.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Dd),i.updateMatrixWorld(),o.makeTranslation(-ea.x,-ea.y,-ea.z),v0.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(v0,i.coordinateSystem,i.reversedDepth)}}class Qy extends ih{constructor(e,t,i=0,o=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=o,this.shadow=new Jy}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Gg extends Cg{constructor(e=-1,t=1,i=1,o=-1,a=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=o,this.near=a,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,o,a,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=o,this.view.width=a,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let a=i-e,c=i+e,d=o+t,f=o-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,m=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,c=a+h*this.view.width,d-=m*this.view.offsetY,f=d-m*this.view.height}this.projectionMatrix.makeOrthographic(a,c,d,f,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class e1 extends Hg{constructor(){super(new Gg(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class t1 extends ih{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(hn.DEFAULT_UP),this.updateMatrix(),this.target=new hn,this.shadow=new e1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class n1 extends Jn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function _0(s,e,t,i){const o=i1(i);switch(t){case pg:return s*e;case gg:return s*e/o.components*o.byteLength;case Wf:return s*e/o.components*o.byteLength;case vg:return s*e*2/o.components*o.byteLength;case jf:return s*e*2/o.components*o.byteLength;case mg:return s*e*3/o.components*o.byteLength;case _i:return s*e*4/o.components*o.byteLength;case Xf:return s*e*4/o.components*o.byteLength;case ic:case rc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case sc:case oc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case af:case cf:return Math.max(s,16)*Math.max(e,8)/4;case of:case lf:return Math.max(s,8)*Math.max(e,8)/2;case uf:case df:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ff:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case hf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case pf:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case mf:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case gf:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case vf:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case _f:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case xf:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case yf:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Sf:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Mf:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Ef:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case wf:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Tf:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Af:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Cf:case Rf:case bf:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Pf:case Lf:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Nf:case Df:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function i1(s){switch(s){case Ni:case ug:return{byteLength:1,components:1};case ca:case dg:case xa:return{byteLength:2,components:1};case Hf:case Gf:return{byteLength:2,components:4};case os:case Vf:case Ki:return{byteLength:4,components:1};case fg:case hg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Bf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Bf);function Wg(){let s=null,e=!1,t=null,i=null;function o(a,c){t(a,c),i=s.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&(i=s.requestAnimationFrame(o),e=!0)},stop:function(){s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){s=a}}}function r1(s){const e=new WeakMap;function t(d,f){const h=d.array,m=d.usage,x=h.byteLength,_=s.createBuffer();s.bindBuffer(f,_),s.bufferData(f,h,m),d.onUploadCallback();let S;if(h instanceof Float32Array)S=s.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)S=s.HALF_FLOAT;else if(h instanceof Uint16Array)d.isFloat16BufferAttribute?S=s.HALF_FLOAT:S=s.UNSIGNED_SHORT;else if(h instanceof Int16Array)S=s.SHORT;else if(h instanceof Uint32Array)S=s.UNSIGNED_INT;else if(h instanceof Int32Array)S=s.INT;else if(h instanceof Int8Array)S=s.BYTE;else if(h instanceof Uint8Array)S=s.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)S=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:_,type:S,bytesPerElement:h.BYTES_PER_ELEMENT,version:d.version,size:x}}function i(d,f,h){const m=f.array,x=f.updateRanges;if(s.bindBuffer(h,d),x.length===0)s.bufferSubData(h,0,m);else{x.sort((S,M)=>S.start-M.start);let _=0;for(let S=1;S<x.length;S++){const M=x[_],w=x[S];w.start<=M.start+M.count+1?M.count=Math.max(M.count,w.start+w.count-M.start):(++_,x[_]=w)}x.length=_+1;for(let S=0,M=x.length;S<M;S++){const w=x[S];s.bufferSubData(h,w.start*m.BYTES_PER_ELEMENT,m,w.start,w.count)}f.clearUpdateRanges()}f.onUploadCallback()}function o(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function a(d){d.isInterleavedBufferAttribute&&(d=d.data);const f=e.get(d);f&&(s.deleteBuffer(f.buffer),e.delete(d))}function c(d,f){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const m=e.get(d);(!m||m.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const h=e.get(d);if(h===void 0)e.set(d,t(d,f));else if(h.version<d.version){if(h.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,d,f),h.version=d.version}}return{get:o,remove:a,update:c}}var s1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,o1=`#ifdef USE_ALPHAHASH
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
#endif`,a1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,l1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,c1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,u1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,d1=`#ifdef USE_AOMAP
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
#endif`,f1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,h1=`#ifdef USE_BATCHING
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
#endif`,p1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,m1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,g1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,v1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_1=`#ifdef USE_IRIDESCENCE
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
#endif`,x1=`#ifdef USE_BUMPMAP
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
#endif`,y1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,S1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,M1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,E1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,w1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,T1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,A1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,C1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,R1=`#define PI 3.141592653589793
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
} // validated`,b1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,P1=`vec3 transformedNormal = objectNormal;
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
#endif`,L1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,N1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,D1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,I1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,U1="gl_FragColor = linearToOutputTexel( gl_FragColor );",F1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,O1=`#ifdef USE_ENVMAP
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
#endif`,k1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,z1=`#ifdef USE_ENVMAP
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
#endif`,B1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,V1=`#ifdef USE_ENVMAP
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
#endif`,H1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,G1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,W1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,j1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,X1=`#ifdef USE_GRADIENTMAP
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
}`,q1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Y1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,K1=`uniform bool receiveShadow;
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
#endif`,Z1=`#ifdef USE_ENVMAP
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
#endif`,J1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Q1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,eS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,tS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nS=`PhysicalMaterial material;
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
#endif`,iS=`struct PhysicalMaterial {
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
}`,rS=`
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
#endif`,sS=`#if defined( RE_IndirectDiffuse )
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
#endif`,oS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,aS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,lS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,hS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,pS=`#if defined( USE_POINTS_UV )
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
#endif`,mS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,gS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_S=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yS=`#ifdef USE_MORPHTARGETS
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
#endif`,SS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,MS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ES=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,wS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,TS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,AS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,CS=`#ifdef USE_NORMALMAP
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
#endif`,RS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,PS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,LS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,NS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,DS=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,IS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,US=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,FS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,OS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,BS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
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
#endif`,VS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,HS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,GS=`float getShadowMask() {
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
}`,WS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jS=`#ifdef USE_SKINNING
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
#endif`,XS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qS=`#ifdef USE_SKINNING
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
#endif`,YS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$S=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,KS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ZS=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,JS=`#ifdef USE_TRANSMISSION
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
#endif`,QS=`#ifdef USE_TRANSMISSION
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
#endif`,eM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,iM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const rM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,sM=`uniform sampler2D t2D;
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
}`,oM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,lM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uM=`#include <common>
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
}`,dM=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,fM=`#define DISTANCE
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
}`,hM=`#define DISTANCE
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
}`,pM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gM=`uniform float scale;
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
}`,vM=`uniform vec3 diffuse;
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
}`,_M=`#include <common>
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
}`,xM=`uniform vec3 diffuse;
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
}`,yM=`#define LAMBERT
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
}`,SM=`#define LAMBERT
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
}`,MM=`#define MATCAP
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
}`,EM=`#define MATCAP
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
}`,wM=`#define NORMAL
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
}`,TM=`#define NORMAL
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
}`,AM=`#define PHONG
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
}`,CM=`#define PHONG
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
}`,RM=`#define STANDARD
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
}`,bM=`#define STANDARD
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
}`,PM=`#define TOON
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
}`,LM=`#define TOON
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
}`,NM=`uniform float size;
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
}`,DM=`uniform vec3 diffuse;
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
}`,IM=`#include <common>
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
}`,UM=`uniform vec3 color;
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
}`,FM=`uniform float rotation;
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
}`,OM=`uniform vec3 diffuse;
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
}`,yt={alphahash_fragment:s1,alphahash_pars_fragment:o1,alphamap_fragment:a1,alphamap_pars_fragment:l1,alphatest_fragment:c1,alphatest_pars_fragment:u1,aomap_fragment:d1,aomap_pars_fragment:f1,batching_pars_vertex:h1,batching_vertex:p1,begin_vertex:m1,beginnormal_vertex:g1,bsdfs:v1,iridescence_fragment:_1,bumpmap_pars_fragment:x1,clipping_planes_fragment:y1,clipping_planes_pars_fragment:S1,clipping_planes_pars_vertex:M1,clipping_planes_vertex:E1,color_fragment:w1,color_pars_fragment:T1,color_pars_vertex:A1,color_vertex:C1,common:R1,cube_uv_reflection_fragment:b1,defaultnormal_vertex:P1,displacementmap_pars_vertex:L1,displacementmap_vertex:N1,emissivemap_fragment:D1,emissivemap_pars_fragment:I1,colorspace_fragment:U1,colorspace_pars_fragment:F1,envmap_fragment:O1,envmap_common_pars_fragment:k1,envmap_pars_fragment:z1,envmap_pars_vertex:B1,envmap_physical_pars_fragment:Z1,envmap_vertex:V1,fog_vertex:H1,fog_pars_vertex:G1,fog_fragment:W1,fog_pars_fragment:j1,gradientmap_pars_fragment:X1,lightmap_pars_fragment:q1,lights_lambert_fragment:Y1,lights_lambert_pars_fragment:$1,lights_pars_begin:K1,lights_toon_fragment:J1,lights_toon_pars_fragment:Q1,lights_phong_fragment:eS,lights_phong_pars_fragment:tS,lights_physical_fragment:nS,lights_physical_pars_fragment:iS,lights_fragment_begin:rS,lights_fragment_maps:sS,lights_fragment_end:oS,logdepthbuf_fragment:aS,logdepthbuf_pars_fragment:lS,logdepthbuf_pars_vertex:cS,logdepthbuf_vertex:uS,map_fragment:dS,map_pars_fragment:fS,map_particle_fragment:hS,map_particle_pars_fragment:pS,metalnessmap_fragment:mS,metalnessmap_pars_fragment:gS,morphinstance_vertex:vS,morphcolor_vertex:_S,morphnormal_vertex:xS,morphtarget_pars_vertex:yS,morphtarget_vertex:SS,normal_fragment_begin:MS,normal_fragment_maps:ES,normal_pars_fragment:wS,normal_pars_vertex:TS,normal_vertex:AS,normalmap_pars_fragment:CS,clearcoat_normal_fragment_begin:RS,clearcoat_normal_fragment_maps:bS,clearcoat_pars_fragment:PS,iridescence_pars_fragment:LS,opaque_fragment:NS,packing:DS,premultiplied_alpha_fragment:IS,project_vertex:US,dithering_fragment:FS,dithering_pars_fragment:OS,roughnessmap_fragment:kS,roughnessmap_pars_fragment:zS,shadowmap_pars_fragment:BS,shadowmap_pars_vertex:VS,shadowmap_vertex:HS,shadowmask_pars_fragment:GS,skinbase_vertex:WS,skinning_pars_vertex:jS,skinning_vertex:XS,skinnormal_vertex:qS,specularmap_fragment:YS,specularmap_pars_fragment:$S,tonemapping_fragment:KS,tonemapping_pars_fragment:ZS,transmission_fragment:JS,transmission_pars_fragment:QS,uv_pars_fragment:eM,uv_pars_vertex:tM,uv_vertex:nM,worldpos_vertex:iM,background_vert:rM,background_frag:sM,backgroundCube_vert:oM,backgroundCube_frag:aM,cube_vert:lM,cube_frag:cM,depth_vert:uM,depth_frag:dM,distanceRGBA_vert:fM,distanceRGBA_frag:hM,equirect_vert:pM,equirect_frag:mM,linedashed_vert:gM,linedashed_frag:vM,meshbasic_vert:_M,meshbasic_frag:xM,meshlambert_vert:yM,meshlambert_frag:SM,meshmatcap_vert:MM,meshmatcap_frag:EM,meshnormal_vert:wM,meshnormal_frag:TM,meshphong_vert:AM,meshphong_frag:CM,meshphysical_vert:RM,meshphysical_frag:bM,meshtoon_vert:PM,meshtoon_frag:LM,points_vert:NM,points_frag:DM,shadow_vert:IM,shadow_frag:UM,sprite_vert:FM,sprite_frag:OM},ze={common:{diffuse:{value:new Tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new xt},alphaMap:{value:null},alphaMapTransform:{value:new xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new xt}},envmap:{envMap:{value:null},envMapRotation:{value:new xt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new xt},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new xt},alphaTest:{value:0},uvTransform:{value:new xt}},sprite:{diffuse:{value:new Tt(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new xt},alphaMap:{value:null},alphaMapTransform:{value:new xt},alphaTest:{value:0}}},Ci={basic:{uniforms:Nn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.fog]),vertexShader:yt.meshbasic_vert,fragmentShader:yt.meshbasic_frag},lambert:{uniforms:Nn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new Tt(0)}}]),vertexShader:yt.meshlambert_vert,fragmentShader:yt.meshlambert_frag},phong:{uniforms:Nn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new Tt(0)},specular:{value:new Tt(1118481)},shininess:{value:30}}]),vertexShader:yt.meshphong_vert,fragmentShader:yt.meshphong_frag},standard:{uniforms:Nn([ze.common,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.roughnessmap,ze.metalnessmap,ze.fog,ze.lights,{emissive:{value:new Tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag},toon:{uniforms:Nn([ze.common,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.gradientmap,ze.fog,ze.lights,{emissive:{value:new Tt(0)}}]),vertexShader:yt.meshtoon_vert,fragmentShader:yt.meshtoon_frag},matcap:{uniforms:Nn([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,{matcap:{value:null}}]),vertexShader:yt.meshmatcap_vert,fragmentShader:yt.meshmatcap_frag},points:{uniforms:Nn([ze.points,ze.fog]),vertexShader:yt.points_vert,fragmentShader:yt.points_frag},dashed:{uniforms:Nn([ze.common,ze.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:yt.linedashed_vert,fragmentShader:yt.linedashed_frag},depth:{uniforms:Nn([ze.common,ze.displacementmap]),vertexShader:yt.depth_vert,fragmentShader:yt.depth_frag},normal:{uniforms:Nn([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,{opacity:{value:1}}]),vertexShader:yt.meshnormal_vert,fragmentShader:yt.meshnormal_frag},sprite:{uniforms:Nn([ze.sprite,ze.fog]),vertexShader:yt.sprite_vert,fragmentShader:yt.sprite_frag},background:{uniforms:{uvTransform:{value:new xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:yt.background_vert,fragmentShader:yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new xt}},vertexShader:yt.backgroundCube_vert,fragmentShader:yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:yt.cube_vert,fragmentShader:yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:yt.equirect_vert,fragmentShader:yt.equirect_frag},distanceRGBA:{uniforms:Nn([ze.common,ze.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:yt.distanceRGBA_vert,fragmentShader:yt.distanceRGBA_frag},shadow:{uniforms:Nn([ze.lights,ze.fog,{color:{value:new Tt(0)},opacity:{value:1}}]),vertexShader:yt.shadow_vert,fragmentShader:yt.shadow_frag}};Ci.physical={uniforms:Nn([Ci.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new xt},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new xt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new xt},sheen:{value:0},sheenColor:{value:new Tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new xt},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new xt},attenuationDistance:{value:0},attenuationColor:{value:new Tt(0)},specularColor:{value:new Tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new xt},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new xt}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag};const Zl={r:0,b:0,g:0},Kr=new yi,kM=new jt;function zM(s,e,t,i,o,a,c){const d=new Tt(0);let f=a===!0?0:1,h,m,x=null,_=0,S=null;function M(C){let E=C.isScene===!0?C.background:null;return E&&E.isTexture&&(E=(C.backgroundBlurriness>0?t:e).get(E)),E}function w(C){let E=!1;const O=M(C);O===null?v(d,f):O&&O.isColor&&(v(O,1),E=!0);const U=s.xr.getEnvironmentBlendMode();U==="additive"?i.buffers.color.setClear(0,0,0,1,c):U==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,c),(s.autoClear||E)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function y(C,E){const O=M(E);O&&(O.isCubeTexture||O.mapping===_c)?(m===void 0&&(m=new Yt(new Ji(1,1,1),new Pr({name:"BackgroundCubeMaterial",uniforms:uo(Ci.backgroundCube.uniforms),vertexShader:Ci.backgroundCube.vertexShader,fragmentShader:Ci.backgroundCube.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),m.geometry.deleteAttribute("normal"),m.geometry.deleteAttribute("uv"),m.onBeforeRender=function(U,F,V){this.matrixWorld.copyPosition(V.matrixWorld)},Object.defineProperty(m.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(m)),Kr.copy(E.backgroundRotation),Kr.x*=-1,Kr.y*=-1,Kr.z*=-1,O.isCubeTexture&&O.isRenderTargetTexture===!1&&(Kr.y*=-1,Kr.z*=-1),m.material.uniforms.envMap.value=O,m.material.uniforms.flipEnvMap.value=O.isCubeTexture&&O.isRenderTargetTexture===!1?-1:1,m.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,m.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,m.material.uniforms.backgroundRotation.value.setFromMatrix4(kM.makeRotationFromEuler(Kr)),m.material.toneMapped=Pt.getTransfer(O.colorSpace)!==Ft,(x!==O||_!==O.version||S!==s.toneMapping)&&(m.material.needsUpdate=!0,x=O,_=O.version,S=s.toneMapping),m.layers.enableAll(),C.unshift(m,m.geometry,m.material,0,0,null)):O&&O.isTexture&&(h===void 0&&(h=new Yt(new cs(2,2),new Pr({name:"BackgroundMaterial",uniforms:uo(Ci.background.uniforms),vertexShader:Ci.background.vertexShader,fragmentShader:Ci.background.fragmentShader,side:br,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(h)),h.material.uniforms.t2D.value=O,h.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,h.material.toneMapped=Pt.getTransfer(O.colorSpace)!==Ft,O.matrixAutoUpdate===!0&&O.updateMatrix(),h.material.uniforms.uvTransform.value.copy(O.matrix),(x!==O||_!==O.version||S!==s.toneMapping)&&(h.material.needsUpdate=!0,x=O,_=O.version,S=s.toneMapping),h.layers.enableAll(),C.unshift(h,h.geometry,h.material,0,0,null))}function v(C,E){C.getRGB(Zl,Ag(s)),i.buffers.color.setClear(Zl.r,Zl.g,Zl.b,E,c)}function P(){m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return d},setClearColor:function(C,E=1){d.set(C),f=E,v(d,f)},getClearAlpha:function(){return f},setClearAlpha:function(C){f=C,v(d,f)},render:w,addToRenderList:y,dispose:P}}function BM(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},o=_(null);let a=o,c=!1;function d(R,H,Y,ee,de){let se=!1;const te=x(ee,Y,H);a!==te&&(a=te,h(a.object)),se=S(R,ee,Y,de),se&&M(R,ee,Y,de),de!==null&&e.update(de,s.ELEMENT_ARRAY_BUFFER),(se||c)&&(c=!1,E(R,H,Y,ee),de!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(de).buffer))}function f(){return s.createVertexArray()}function h(R){return s.bindVertexArray(R)}function m(R){return s.deleteVertexArray(R)}function x(R,H,Y){const ee=Y.wireframe===!0;let de=i[R.id];de===void 0&&(de={},i[R.id]=de);let se=de[H.id];se===void 0&&(se={},de[H.id]=se);let te=se[ee];return te===void 0&&(te=_(f()),se[ee]=te),te}function _(R){const H=[],Y=[],ee=[];for(let de=0;de<t;de++)H[de]=0,Y[de]=0,ee[de]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:H,enabledAttributes:Y,attributeDivisors:ee,object:R,attributes:{},index:null}}function S(R,H,Y,ee){const de=a.attributes,se=H.attributes;let te=0;const le=Y.getAttributes();for(const W in le)if(le[W].location>=0){const ce=de[W];let B=se[W];if(B===void 0&&(W==="instanceMatrix"&&R.instanceMatrix&&(B=R.instanceMatrix),W==="instanceColor"&&R.instanceColor&&(B=R.instanceColor)),ce===void 0||ce.attribute!==B||B&&ce.data!==B.data)return!0;te++}return a.attributesNum!==te||a.index!==ee}function M(R,H,Y,ee){const de={},se=H.attributes;let te=0;const le=Y.getAttributes();for(const W in le)if(le[W].location>=0){let ce=se[W];ce===void 0&&(W==="instanceMatrix"&&R.instanceMatrix&&(ce=R.instanceMatrix),W==="instanceColor"&&R.instanceColor&&(ce=R.instanceColor));const B={};B.attribute=ce,ce&&ce.data&&(B.data=ce.data),de[W]=B,te++}a.attributes=de,a.attributesNum=te,a.index=ee}function w(){const R=a.newAttributes;for(let H=0,Y=R.length;H<Y;H++)R[H]=0}function y(R){v(R,0)}function v(R,H){const Y=a.newAttributes,ee=a.enabledAttributes,de=a.attributeDivisors;Y[R]=1,ee[R]===0&&(s.enableVertexAttribArray(R),ee[R]=1),de[R]!==H&&(s.vertexAttribDivisor(R,H),de[R]=H)}function P(){const R=a.newAttributes,H=a.enabledAttributes;for(let Y=0,ee=H.length;Y<ee;Y++)H[Y]!==R[Y]&&(s.disableVertexAttribArray(Y),H[Y]=0)}function C(R,H,Y,ee,de,se,te){te===!0?s.vertexAttribIPointer(R,H,Y,de,se):s.vertexAttribPointer(R,H,Y,ee,de,se)}function E(R,H,Y,ee){w();const de=ee.attributes,se=Y.getAttributes(),te=H.defaultAttributeValues;for(const le in se){const W=se[le];if(W.location>=0){let fe=de[le];if(fe===void 0&&(le==="instanceMatrix"&&R.instanceMatrix&&(fe=R.instanceMatrix),le==="instanceColor"&&R.instanceColor&&(fe=R.instanceColor)),fe!==void 0){const ce=fe.normalized,B=fe.itemSize,re=e.get(fe);if(re===void 0)continue;const Be=re.buffer,Xe=re.type,qe=re.bytesPerElement,ne=Xe===s.INT||Xe===s.UNSIGNED_INT||fe.gpuType===Vf;if(fe.isInterleavedBufferAttribute){const pe=fe.data,Te=pe.stride,Ue=fe.offset;if(pe.isInstancedInterleavedBuffer){for(let Ve=0;Ve<W.locationSize;Ve++)v(W.location+Ve,pe.meshPerAttribute);R.isInstancedMesh!==!0&&ee._maxInstanceCount===void 0&&(ee._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let Ve=0;Ve<W.locationSize;Ve++)y(W.location+Ve);s.bindBuffer(s.ARRAY_BUFFER,Be);for(let Ve=0;Ve<W.locationSize;Ve++)C(W.location+Ve,B/W.locationSize,Xe,ce,Te*qe,(Ue+B/W.locationSize*Ve)*qe,ne)}else{if(fe.isInstancedBufferAttribute){for(let pe=0;pe<W.locationSize;pe++)v(W.location+pe,fe.meshPerAttribute);R.isInstancedMesh!==!0&&ee._maxInstanceCount===void 0&&(ee._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let pe=0;pe<W.locationSize;pe++)y(W.location+pe);s.bindBuffer(s.ARRAY_BUFFER,Be);for(let pe=0;pe<W.locationSize;pe++)C(W.location+pe,B/W.locationSize,Xe,ce,B*qe,B/W.locationSize*pe*qe,ne)}}else if(te!==void 0){const ce=te[le];if(ce!==void 0)switch(ce.length){case 2:s.vertexAttrib2fv(W.location,ce);break;case 3:s.vertexAttrib3fv(W.location,ce);break;case 4:s.vertexAttrib4fv(W.location,ce);break;default:s.vertexAttrib1fv(W.location,ce)}}}}P()}function O(){V();for(const R in i){const H=i[R];for(const Y in H){const ee=H[Y];for(const de in ee)m(ee[de].object),delete ee[de];delete H[Y]}delete i[R]}}function U(R){if(i[R.id]===void 0)return;const H=i[R.id];for(const Y in H){const ee=H[Y];for(const de in ee)m(ee[de].object),delete ee[de];delete H[Y]}delete i[R.id]}function F(R){for(const H in i){const Y=i[H];if(Y[R.id]===void 0)continue;const ee=Y[R.id];for(const de in ee)m(ee[de].object),delete ee[de];delete Y[R.id]}}function V(){b(),c=!0,a!==o&&(a=o,h(a.object))}function b(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:d,reset:V,resetDefaultState:b,dispose:O,releaseStatesOfGeometry:U,releaseStatesOfProgram:F,initAttributes:w,enableAttribute:y,disableUnusedAttributes:P}}function VM(s,e,t){let i;function o(h){i=h}function a(h,m){s.drawArrays(i,h,m),t.update(m,i,1)}function c(h,m,x){x!==0&&(s.drawArraysInstanced(i,h,m,x),t.update(m,i,x))}function d(h,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,m,0,x);let S=0;for(let M=0;M<x;M++)S+=m[M];t.update(S,i,1)}function f(h,m,x,_){if(x===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let M=0;M<h.length;M++)c(h[M],m[M],_[M]);else{S.multiDrawArraysInstancedWEBGL(i,h,0,m,0,_,0,x);let M=0;for(let w=0;w<x;w++)M+=m[w]*_[w];t.update(M,i,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function HM(s,e,t,i){let o;function a(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const F=e.get("EXT_texture_filter_anisotropic");o=s.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function c(F){return!(F!==_i&&i.convert(F)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(F){const V=F===xa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(F!==Ni&&i.convert(F)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&F!==Ki&&!V)}function f(F){if(F==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const m=f(h);m!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",m,"instead."),h=m);const x=t.logarithmicDepthBuffer===!0,_=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),S=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),M=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=s.getParameter(s.MAX_TEXTURE_SIZE),y=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),v=s.getParameter(s.MAX_VERTEX_ATTRIBS),P=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),C=s.getParameter(s.MAX_VARYING_VECTORS),E=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),O=M>0,U=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:f,textureFormatReadable:c,textureTypeReadable:d,precision:h,logarithmicDepthBuffer:x,reversedDepthBuffer:_,maxTextures:S,maxVertexTextures:M,maxTextureSize:w,maxCubemapSize:y,maxAttributes:v,maxVertexUniforms:P,maxVaryings:C,maxFragmentUniforms:E,vertexTextures:O,maxSamples:U}}function GM(s){const e=this;let t=null,i=0,o=!1,a=!1;const c=new es,d=new xt,f={value:null,needsUpdate:!1};this.uniform=f,this.numPlanes=0,this.numIntersection=0,this.init=function(x,_){const S=x.length!==0||_||i!==0||o;return o=_,i=x.length,S},this.beginShadows=function(){a=!0,m(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(x,_){t=m(x,_,0)},this.setState=function(x,_,S){const M=x.clippingPlanes,w=x.clipIntersection,y=x.clipShadows,v=s.get(x);if(!o||M===null||M.length===0||a&&!y)a?m(null):h();else{const P=a?0:i,C=P*4;let E=v.clippingState||null;f.value=E,E=m(M,_,C,S);for(let O=0;O!==C;++O)E[O]=t[O];v.clippingState=E,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=P}};function h(){f.value!==t&&(f.value=t,f.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function m(x,_,S,M){const w=x!==null?x.length:0;let y=null;if(w!==0){if(y=f.value,M!==!0||y===null){const v=S+w*4,P=_.matrixWorldInverse;d.getNormalMatrix(P),(y===null||y.length<v)&&(y=new Float32Array(v));for(let C=0,E=S;C!==w;++C,E+=4)c.copy(x[C]).applyMatrix4(P,d),c.normal.toArray(y,E),y[E+3]=c.constant}f.value=y,f.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,y}}function WM(s){let e=new WeakMap;function t(c,d){return d===tf?c.mapping=ao:d===nf&&(c.mapping=lo),c}function i(c){if(c&&c.isTexture){const d=c.mapping;if(d===tf||d===nf)if(e.has(c)){const f=e.get(c).texture;return t(f,c.mapping)}else{const f=c.image;if(f&&f.height>0){const h=new uy(f.height);return h.fromEquirectangularTexture(s,c),e.set(c,h),c.addEventListener("dispose",o),t(h.texture,c.mapping)}else return null}}return c}function o(c){const d=c.target;d.removeEventListener("dispose",o);const f=e.get(d);f!==void 0&&(e.delete(d),f.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const no=4,x0=[.125,.215,.35,.446,.526,.582],is=20,Id=new Gg,y0=new Tt;let Ud=null,Fd=0,Od=0,kd=!1;const ts=(1+Math.sqrt(5))/2,Ks=1/ts,S0=[new D(-ts,Ks,0),new D(ts,Ks,0),new D(-Ks,0,ts),new D(Ks,0,ts),new D(0,ts,-Ks),new D(0,ts,Ks),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],jM=new D;class M0{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,o=100,a={}){const{size:c=256,position:d=jM}=a;Ud=this._renderer.getRenderTarget(),Fd=this._renderer.getActiveCubeFace(),Od=this._renderer.getActiveMipmapLevel(),kd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(c);const f=this._allocateTargets();return f.depthBuffer=!0,this._sceneToCubeUV(e,i,o,f,d),t>0&&this._blur(f,0,0,t),this._applyPMREM(f),this._cleanup(f),f}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=T0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=w0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ud,Fd,Od),this._renderer.xr.enabled=kd,e.scissorTest=!1,Jl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ao||e.mapping===lo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ud=this._renderer.getRenderTarget(),Fd=this._renderer.getActiveCubeFace(),Od=this._renderer.getActiveMipmapLevel(),kd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:bi,minFilter:bi,generateMipmaps:!1,type:xa,format:_i,colorSpace:co,depthBuffer:!1},o=E0(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=E0(e,t,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=XM(a)),this._blurMaterial=qM(a,e,t)}return o}_compileMaterial(e){const t=new Yt(this._lodPlanes[0],e);this._renderer.compile(t,Id)}_sceneToCubeUV(e,t,i,o,a){const f=new Jn(90,1,t,i),h=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],x=this._renderer,_=x.autoClear,S=x.toneMapping;x.getClearColor(y0),x.toneMapping=Rr,x.autoClear=!1,x.state.buffers.depth.getReversed()&&(x.setRenderTarget(o),x.clearDepth(),x.setRenderTarget(null));const w=new so({name:"PMREM.Background",side:Gn,depthWrite:!1,depthTest:!1}),y=new Yt(new Ji,w);let v=!1;const P=e.background;P?P.isColor&&(w.color.copy(P),e.background=null,v=!0):(w.color.copy(y0),v=!0);for(let C=0;C<6;C++){const E=C%3;E===0?(f.up.set(0,h[C],0),f.position.set(a.x,a.y,a.z),f.lookAt(a.x+m[C],a.y,a.z)):E===1?(f.up.set(0,0,h[C]),f.position.set(a.x,a.y,a.z),f.lookAt(a.x,a.y+m[C],a.z)):(f.up.set(0,h[C],0),f.position.set(a.x,a.y,a.z),f.lookAt(a.x,a.y,a.z+m[C]));const O=this._cubeSize;Jl(o,E*O,C>2?O:0,O,O),x.setRenderTarget(o),v&&x.render(y,f),x.render(e,f)}y.geometry.dispose(),y.material.dispose(),x.toneMapping=S,x.autoClear=_,e.background=P}_textureToCubeUV(e,t){const i=this._renderer,o=e.mapping===ao||e.mapping===lo;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=T0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=w0());const a=o?this._cubemapMaterial:this._equirectMaterial,c=new Yt(this._lodPlanes[0],a),d=a.uniforms;d.envMap.value=e;const f=this._cubeSize;Jl(t,0,0,3*f,2*f),i.setRenderTarget(t),i.render(c,Id)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const o=this._lodPlanes.length;for(let a=1;a<o;a++){const c=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),d=S0[(o-a-1)%S0.length];this._blur(e,a-1,a,c,d)}t.autoClear=i}_blur(e,t,i,o,a){const c=this._pingPongRenderTarget;this._halfBlur(e,c,t,i,o,"latitudinal",a),this._halfBlur(c,e,i,i,o,"longitudinal",a)}_halfBlur(e,t,i,o,a,c,d){const f=this._renderer,h=this._blurMaterial;c!=="latitudinal"&&c!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const m=3,x=new Yt(this._lodPlanes[o],h),_=h.uniforms,S=this._sizeLods[i]-1,M=isFinite(a)?Math.PI/(2*S):2*Math.PI/(2*is-1),w=a/M,y=isFinite(a)?1+Math.floor(m*w):is;y>is&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${is}`);const v=[];let P=0;for(let F=0;F<is;++F){const V=F/w,b=Math.exp(-V*V/2);v.push(b),F===0?P+=b:F<y&&(P+=2*b)}for(let F=0;F<v.length;F++)v[F]=v[F]/P;_.envMap.value=e.texture,_.samples.value=y,_.weights.value=v,_.latitudinal.value=c==="latitudinal",d&&(_.poleAxis.value=d);const{_lodMax:C}=this;_.dTheta.value=M,_.mipInt.value=C-i;const E=this._sizeLods[o],O=3*E*(o>C-no?o-C+no:0),U=4*(this._cubeSize-E);Jl(t,O,U,3*E,2*E),f.setRenderTarget(t),f.render(x,Id)}}function XM(s){const e=[],t=[],i=[];let o=s;const a=s-no+1+x0.length;for(let c=0;c<a;c++){const d=Math.pow(2,o);t.push(d);let f=1/d;c>s-no?f=x0[c-s+no-1]:c===0&&(f=0),i.push(f);const h=1/(d-2),m=-h,x=1+h,_=[m,m,x,m,x,x,m,m,x,x,m,x],S=6,M=6,w=3,y=2,v=1,P=new Float32Array(w*M*S),C=new Float32Array(y*M*S),E=new Float32Array(v*M*S);for(let U=0;U<S;U++){const F=U%3*2/3-1,V=U>2?0:-1,b=[F,V,0,F+2/3,V,0,F+2/3,V+1,0,F,V,0,F+2/3,V+1,0,F,V+1,0];P.set(b,w*M*U),C.set(_,y*M*U);const R=[U,U,U,U,U,U];E.set(R,v*M*U)}const O=new Wn;O.setAttribute("position",new Li(P,w)),O.setAttribute("uv",new Li(C,y)),O.setAttribute("faceIndex",new Li(E,v)),e.push(O),o>no&&o--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function E0(s,e,t){const i=new as(s,e,t);return i.texture.mapping=_c,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Jl(s,e,t,i,o){s.viewport.set(e,t,i,o),s.scissor.set(e,t,i,o)}function qM(s,e,t){const i=new Float32Array(is),o=new D(0,1,0);return new Pr({name:"SphericalGaussianBlur",defines:{n:is,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:rh(),fragmentShader:`

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
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function w0(){return new Pr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:rh(),fragmentShader:`

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
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function T0(){return new Pr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:rh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function rh(){return`

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
	`}function YM(s){let e=new WeakMap,t=null;function i(d){if(d&&d.isTexture){const f=d.mapping,h=f===tf||f===nf,m=f===ao||f===lo;if(h||m){let x=e.get(d);const _=x!==void 0?x.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==_)return t===null&&(t=new M0(s)),x=h?t.fromEquirectangular(d,x):t.fromCubemap(d,x),x.texture.pmremVersion=d.pmremVersion,e.set(d,x),x.texture;if(x!==void 0)return x.texture;{const S=d.image;return h&&S&&S.height>0||m&&S&&o(S)?(t===null&&(t=new M0(s)),x=h?t.fromEquirectangular(d):t.fromCubemap(d),x.texture.pmremVersion=d.pmremVersion,e.set(d,x),d.addEventListener("dispose",a),x.texture):null}}}return d}function o(d){let f=0;const h=6;for(let m=0;m<h;m++)d[m]!==void 0&&f++;return f===h}function a(d){const f=d.target;f.removeEventListener("dispose",a);const h=e.get(f);h!==void 0&&(e.delete(f),h.dispose())}function c(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:c}}function $M(s){const e={};function t(i){if(e[i]!==void 0)return e[i];let o;switch(i){case"WEBGL_depth_texture":o=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=s.getExtension(i)}return e[i]=o,o}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const o=t(i);return o===null&&pa("THREE.WebGLRenderer: "+i+" extension not supported."),o}}}function KM(s,e,t,i){const o={},a=new WeakMap;function c(x){const _=x.target;_.index!==null&&e.remove(_.index);for(const M in _.attributes)e.remove(_.attributes[M]);_.removeEventListener("dispose",c),delete o[_.id];const S=a.get(_);S&&(e.remove(S),a.delete(_)),i.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0&&delete _._maxInstanceCount,t.memory.geometries--}function d(x,_){return o[_.id]===!0||(_.addEventListener("dispose",c),o[_.id]=!0,t.memory.geometries++),_}function f(x){const _=x.attributes;for(const S in _)e.update(_[S],s.ARRAY_BUFFER)}function h(x){const _=[],S=x.index,M=x.attributes.position;let w=0;if(S!==null){const P=S.array;w=S.version;for(let C=0,E=P.length;C<E;C+=3){const O=P[C+0],U=P[C+1],F=P[C+2];_.push(O,U,U,F,F,O)}}else if(M!==void 0){const P=M.array;w=M.version;for(let C=0,E=P.length/3-1;C<E;C+=3){const O=C+0,U=C+1,F=C+2;_.push(O,U,U,F,F,O)}}else return;const y=new(yg(_)?Tg:wg)(_,1);y.version=w;const v=a.get(x);v&&e.remove(v),a.set(x,y)}function m(x){const _=a.get(x);if(_){const S=x.index;S!==null&&_.version<S.version&&h(x)}else h(x);return a.get(x)}return{get:d,update:f,getWireframeAttribute:m}}function ZM(s,e,t){let i;function o(_){i=_}let a,c;function d(_){a=_.type,c=_.bytesPerElement}function f(_,S){s.drawElements(i,S,a,_*c),t.update(S,i,1)}function h(_,S,M){M!==0&&(s.drawElementsInstanced(i,S,a,_*c,M),t.update(S,i,M))}function m(_,S,M){if(M===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,S,0,a,_,0,M);let y=0;for(let v=0;v<M;v++)y+=S[v];t.update(y,i,1)}function x(_,S,M,w){if(M===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let v=0;v<_.length;v++)h(_[v]/c,S[v],w[v]);else{y.multiDrawElementsInstancedWEBGL(i,S,0,a,_,0,w,0,M);let v=0;for(let P=0;P<M;P++)v+=S[P]*w[P];t.update(v,i,1)}}this.setMode=o,this.setIndex=d,this.render=f,this.renderInstances=h,this.renderMultiDraw=m,this.renderMultiDrawInstances=x}function JM(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,c,d){switch(t.calls++,c){case s.TRIANGLES:t.triangles+=d*(a/3);break;case s.LINES:t.lines+=d*(a/2);break;case s.LINE_STRIP:t.lines+=d*(a-1);break;case s.LINE_LOOP:t.lines+=d*a;break;case s.POINTS:t.points+=d*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",c);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:i}}function QM(s,e,t){const i=new WeakMap,o=new Ot;function a(c,d,f){const h=c.morphTargetInfluences,m=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,x=m!==void 0?m.length:0;let _=i.get(d);if(_===void 0||_.count!==x){let R=function(){V.dispose(),i.delete(d),d.removeEventListener("dispose",R)};var S=R;_!==void 0&&_.texture.dispose();const M=d.morphAttributes.position!==void 0,w=d.morphAttributes.normal!==void 0,y=d.morphAttributes.color!==void 0,v=d.morphAttributes.position||[],P=d.morphAttributes.normal||[],C=d.morphAttributes.color||[];let E=0;M===!0&&(E=1),w===!0&&(E=2),y===!0&&(E=3);let O=d.attributes.position.count*E,U=1;O>e.maxTextureSize&&(U=Math.ceil(O/e.maxTextureSize),O=e.maxTextureSize);const F=new Float32Array(O*U*4*x),V=new Sg(F,O,U,x);V.type=Ki,V.needsUpdate=!0;const b=E*4;for(let H=0;H<x;H++){const Y=v[H],ee=P[H],de=C[H],se=O*U*4*H;for(let te=0;te<Y.count;te++){const le=te*b;M===!0&&(o.fromBufferAttribute(Y,te),F[se+le+0]=o.x,F[se+le+1]=o.y,F[se+le+2]=o.z,F[se+le+3]=0),w===!0&&(o.fromBufferAttribute(ee,te),F[se+le+4]=o.x,F[se+le+5]=o.y,F[se+le+6]=o.z,F[se+le+7]=0),y===!0&&(o.fromBufferAttribute(de,te),F[se+le+8]=o.x,F[se+le+9]=o.y,F[se+le+10]=o.z,F[se+le+11]=de.itemSize===4?o.w:1)}}_={count:x,texture:V,size:new Fe(O,U)},i.set(d,_),d.addEventListener("dispose",R)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)f.getUniforms().setValue(s,"morphTexture",c.morphTexture,t);else{let M=0;for(let y=0;y<h.length;y++)M+=h[y];const w=d.morphTargetsRelative?1:1-M;f.getUniforms().setValue(s,"morphTargetBaseInfluence",w),f.getUniforms().setValue(s,"morphTargetInfluences",h)}f.getUniforms().setValue(s,"morphTargetsTexture",_.texture,t),f.getUniforms().setValue(s,"morphTargetsTextureSize",_.size)}return{update:a}}function eE(s,e,t,i){let o=new WeakMap;function a(f){const h=i.render.frame,m=f.geometry,x=e.get(f,m);if(o.get(x)!==h&&(e.update(x),o.set(x,h)),f.isInstancedMesh&&(f.hasEventListener("dispose",d)===!1&&f.addEventListener("dispose",d),o.get(f)!==h&&(t.update(f.instanceMatrix,s.ARRAY_BUFFER),f.instanceColor!==null&&t.update(f.instanceColor,s.ARRAY_BUFFER),o.set(f,h))),f.isSkinnedMesh){const _=f.skeleton;o.get(_)!==h&&(_.update(),o.set(_,h))}return x}function c(){o=new WeakMap}function d(f){const h=f.target;h.removeEventListener("dispose",d),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:c}}const jg=new Dn,A0=new Pg(1,1),Xg=new Sg,qg=new qx,Yg=new Rg,C0=[],R0=[],b0=new Float32Array(16),P0=new Float32Array(9),L0=new Float32Array(4);function mo(s,e,t){const i=s[0];if(i<=0||i>0)return s;const o=e*t;let a=C0[o];if(a===void 0&&(a=new Float32Array(o),C0[o]=a),e!==0){i.toArray(a,0);for(let c=1,d=0;c!==e;++c)d+=t,s[c].toArray(a,d)}return a}function on(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function an(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function Sc(s,e){let t=R0[e];t===void 0&&(t=new Int32Array(e),R0[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function tE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function nE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(on(t,e))return;s.uniform2fv(this.addr,e),an(t,e)}}function iE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(on(t,e))return;s.uniform3fv(this.addr,e),an(t,e)}}function rE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(on(t,e))return;s.uniform4fv(this.addr,e),an(t,e)}}function sE(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(on(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),an(t,e)}else{if(on(t,i))return;L0.set(i),s.uniformMatrix2fv(this.addr,!1,L0),an(t,i)}}function oE(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(on(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),an(t,e)}else{if(on(t,i))return;P0.set(i),s.uniformMatrix3fv(this.addr,!1,P0),an(t,i)}}function aE(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(on(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),an(t,e)}else{if(on(t,i))return;b0.set(i),s.uniformMatrix4fv(this.addr,!1,b0),an(t,i)}}function lE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function cE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(on(t,e))return;s.uniform2iv(this.addr,e),an(t,e)}}function uE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(on(t,e))return;s.uniform3iv(this.addr,e),an(t,e)}}function dE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(on(t,e))return;s.uniform4iv(this.addr,e),an(t,e)}}function fE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function hE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(on(t,e))return;s.uniform2uiv(this.addr,e),an(t,e)}}function pE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(on(t,e))return;s.uniform3uiv(this.addr,e),an(t,e)}}function mE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(on(t,e))return;s.uniform4uiv(this.addr,e),an(t,e)}}function gE(s,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(s.uniform1i(this.addr,o),i[0]=o);let a;this.type===s.SAMPLER_2D_SHADOW?(A0.compareFunction=xg,a=A0):a=jg,t.setTexture2D(e||a,o)}function vE(s,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(s.uniform1i(this.addr,o),i[0]=o),t.setTexture3D(e||qg,o)}function _E(s,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(s.uniform1i(this.addr,o),i[0]=o),t.setTextureCube(e||Yg,o)}function xE(s,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(s.uniform1i(this.addr,o),i[0]=o),t.setTexture2DArray(e||Xg,o)}function yE(s){switch(s){case 5126:return tE;case 35664:return nE;case 35665:return iE;case 35666:return rE;case 35674:return sE;case 35675:return oE;case 35676:return aE;case 5124:case 35670:return lE;case 35667:case 35671:return cE;case 35668:case 35672:return uE;case 35669:case 35673:return dE;case 5125:return fE;case 36294:return hE;case 36295:return pE;case 36296:return mE;case 35678:case 36198:case 36298:case 36306:case 35682:return gE;case 35679:case 36299:case 36307:return vE;case 35680:case 36300:case 36308:case 36293:return _E;case 36289:case 36303:case 36311:case 36292:return xE}}function SE(s,e){s.uniform1fv(this.addr,e)}function ME(s,e){const t=mo(e,this.size,2);s.uniform2fv(this.addr,t)}function EE(s,e){const t=mo(e,this.size,3);s.uniform3fv(this.addr,t)}function wE(s,e){const t=mo(e,this.size,4);s.uniform4fv(this.addr,t)}function TE(s,e){const t=mo(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function AE(s,e){const t=mo(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function CE(s,e){const t=mo(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function RE(s,e){s.uniform1iv(this.addr,e)}function bE(s,e){s.uniform2iv(this.addr,e)}function PE(s,e){s.uniform3iv(this.addr,e)}function LE(s,e){s.uniform4iv(this.addr,e)}function NE(s,e){s.uniform1uiv(this.addr,e)}function DE(s,e){s.uniform2uiv(this.addr,e)}function IE(s,e){s.uniform3uiv(this.addr,e)}function UE(s,e){s.uniform4uiv(this.addr,e)}function FE(s,e,t){const i=this.cache,o=e.length,a=Sc(t,o);on(i,a)||(s.uniform1iv(this.addr,a),an(i,a));for(let c=0;c!==o;++c)t.setTexture2D(e[c]||jg,a[c])}function OE(s,e,t){const i=this.cache,o=e.length,a=Sc(t,o);on(i,a)||(s.uniform1iv(this.addr,a),an(i,a));for(let c=0;c!==o;++c)t.setTexture3D(e[c]||qg,a[c])}function kE(s,e,t){const i=this.cache,o=e.length,a=Sc(t,o);on(i,a)||(s.uniform1iv(this.addr,a),an(i,a));for(let c=0;c!==o;++c)t.setTextureCube(e[c]||Yg,a[c])}function zE(s,e,t){const i=this.cache,o=e.length,a=Sc(t,o);on(i,a)||(s.uniform1iv(this.addr,a),an(i,a));for(let c=0;c!==o;++c)t.setTexture2DArray(e[c]||Xg,a[c])}function BE(s){switch(s){case 5126:return SE;case 35664:return ME;case 35665:return EE;case 35666:return wE;case 35674:return TE;case 35675:return AE;case 35676:return CE;case 5124:case 35670:return RE;case 35667:case 35671:return bE;case 35668:case 35672:return PE;case 35669:case 35673:return LE;case 5125:return NE;case 36294:return DE;case 36295:return IE;case 36296:return UE;case 35678:case 36198:case 36298:case 36306:case 35682:return FE;case 35679:case 36299:case 36307:return OE;case 35680:case 36300:case 36308:case 36293:return kE;case 36289:case 36303:case 36311:case 36292:return zE}}class VE{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=yE(t.type)}}class HE{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=BE(t.type)}}class GE{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const o=this.seq;for(let a=0,c=o.length;a!==c;++a){const d=o[a];d.setValue(e,t[d.id],i)}}}const zd=/(\w+)(\])?(\[|\.)?/g;function N0(s,e){s.seq.push(e),s.map[e.id]=e}function WE(s,e,t){const i=s.name,o=i.length;for(zd.lastIndex=0;;){const a=zd.exec(i),c=zd.lastIndex;let d=a[1];const f=a[2]==="]",h=a[3];if(f&&(d=d|0),h===void 0||h==="["&&c+2===o){N0(t,h===void 0?new VE(d,s,e):new HE(d,s,e));break}else{let x=t.map[d];x===void 0&&(x=new GE(d),N0(t,x)),t=x}}}class ac{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);WE(a,c,this)}}setValue(e,t,i,o){const a=this.map[t];a!==void 0&&a.setValue(e,i,o)}setOptional(e,t,i){const o=t[i];o!==void 0&&this.setValue(e,i,o)}static upload(e,t,i,o){for(let a=0,c=t.length;a!==c;++a){const d=t[a],f=i[d.id];f.needsUpdate!==!1&&d.setValue(e,f.value,o)}}static seqWithValue(e,t){const i=[];for(let o=0,a=e.length;o!==a;++o){const c=e[o];c.id in t&&i.push(c)}return i}}function D0(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const jE=37297;let XE=0;function qE(s,e){const t=s.split(`
`),i=[],o=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let c=o;c<a;c++){const d=c+1;i.push(`${d===e?">":" "} ${d}: ${t[c]}`)}return i.join(`
`)}const I0=new xt;function YE(s){Pt._getMatrix(I0,Pt.workingColorSpace,s);const e=`mat3( ${I0.elements.map(t=>t.toFixed(4))} )`;switch(Pt.getTransfer(s)){case cc:return[e,"LinearTransferOETF"];case Ft:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function U0(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),a=(s.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const c=/ERROR: 0:(\d+)/.exec(a);if(c){const d=parseInt(c[1]);return t.toUpperCase()+`

`+a+`

`+qE(s.getShaderSource(e),d)}else return a}function $E(s,e){const t=YE(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function KE(s,e){let t;switch(e){case ax:t="Linear";break;case lx:t="Reinhard";break;case cx:t="Cineon";break;case lg:t="ACESFilmic";break;case dx:t="AgX";break;case fx:t="Neutral";break;case ux:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ql=new D;function ZE(){Pt.getLuminanceCoefficients(Ql);const s=Ql.x.toFixed(4),e=Ql.y.toFixed(4),t=Ql.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function JE(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ra).join(`
`)}function QE(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ew(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let o=0;o<i;o++){const a=s.getActiveAttrib(e,o),c=a.name;let d=1;a.type===s.FLOAT_MAT2&&(d=2),a.type===s.FLOAT_MAT3&&(d=3),a.type===s.FLOAT_MAT4&&(d=4),t[c]={type:a.type,location:s.getAttribLocation(e,c),locationSize:d}}return t}function ra(s){return s!==""}function F0(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function O0(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const tw=/^[ \t]*#include +<([\w\d./]+)>/gm;function Of(s){return s.replace(tw,iw)}const nw=new Map;function iw(s,e){let t=yt[e];if(t===void 0){const i=nw.get(e);if(i!==void 0)t=yt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Of(t)}const rw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function k0(s){return s.replace(rw,sw)}function sw(s,e,t,i){let o="";for(let a=parseInt(e);a<parseInt(t);a++)o+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return o}function z0(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function ow(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===sg?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===og?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===$i&&(e="SHADOWMAP_TYPE_VSM"),e}function aw(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case ao:case lo:e="ENVMAP_TYPE_CUBE";break;case _c:e="ENVMAP_TYPE_CUBE_UV";break}return e}function lw(s){let e="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===lo&&(e="ENVMAP_MODE_REFRACTION"),e}function cw(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case ag:e="ENVMAP_BLENDING_MULTIPLY";break;case sx:e="ENVMAP_BLENDING_MIX";break;case ox:e="ENVMAP_BLENDING_ADD";break}return e}function uw(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function dw(s,e,t,i){const o=s.getContext(),a=t.defines;let c=t.vertexShader,d=t.fragmentShader;const f=ow(t),h=aw(t),m=lw(t),x=cw(t),_=uw(t),S=JE(t),M=QE(a),w=o.createProgram();let y,v,P=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(ra).join(`
`),y.length>0&&(y+=`
`),v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(ra).join(`
`),v.length>0&&(v+=`
`)):(y=[z0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+f:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ra).join(`
`),v=[z0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+m:"",t.envMap?"#define "+x:"",_?"#define CUBEUV_TEXEL_WIDTH "+_.texelWidth:"",_?"#define CUBEUV_TEXEL_HEIGHT "+_.texelHeight:"",_?"#define CUBEUV_MAX_MIP "+_.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+f:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Rr?"#define TONE_MAPPING":"",t.toneMapping!==Rr?yt.tonemapping_pars_fragment:"",t.toneMapping!==Rr?KE("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",yt.colorspace_pars_fragment,$E("linearToOutputTexel",t.outputColorSpace),ZE(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ra).join(`
`)),c=Of(c),c=F0(c,t),c=O0(c,t),d=Of(d),d=F0(d,t),d=O0(d,t),c=k0(c),d=k0(d),t.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,y=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,v=["#define varying in",t.glslVersion===Gm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Gm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const C=P+y+c,E=P+v+d,O=D0(o,o.VERTEX_SHADER,C),U=D0(o,o.FRAGMENT_SHADER,E);o.attachShader(w,O),o.attachShader(w,U),t.index0AttributeName!==void 0?o.bindAttribLocation(w,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(w,0,"position"),o.linkProgram(w);function F(H){if(s.debug.checkShaderErrors){const Y=o.getProgramInfoLog(w)||"",ee=o.getShaderInfoLog(O)||"",de=o.getShaderInfoLog(U)||"",se=Y.trim(),te=ee.trim(),le=de.trim();let W=!0,fe=!0;if(o.getProgramParameter(w,o.LINK_STATUS)===!1)if(W=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(o,w,O,U);else{const ce=U0(o,O,"vertex"),B=U0(o,U,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(w,o.VALIDATE_STATUS)+`

Material Name: `+H.name+`
Material Type: `+H.type+`

Program Info Log: `+se+`
`+ce+`
`+B)}else se!==""?console.warn("THREE.WebGLProgram: Program Info Log:",se):(te===""||le==="")&&(fe=!1);fe&&(H.diagnostics={runnable:W,programLog:se,vertexShader:{log:te,prefix:y},fragmentShader:{log:le,prefix:v}})}o.deleteShader(O),o.deleteShader(U),V=new ac(o,w),b=ew(o,w)}let V;this.getUniforms=function(){return V===void 0&&F(this),V};let b;this.getAttributes=function(){return b===void 0&&F(this),b};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=o.getProgramParameter(w,jE)),R},this.destroy=function(){i.releaseStatesOfProgram(this),o.deleteProgram(w),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=XE++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=O,this.fragmentShader=U,this}let fw=0;class hw{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,o=this._getShaderStage(t),a=this._getShaderStage(i),c=this._getShaderCacheForMaterial(e);return c.has(o)===!1&&(c.add(o),o.usedTimes++),c.has(a)===!1&&(c.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new pw(e),t.set(e,i)),i}}class pw{constructor(e){this.id=fw++,this.code=e,this.usedTimes=0}}function mw(s,e,t,i,o,a,c){const d=new Mg,f=new hw,h=new Set,m=[],x=o.logarithmicDepthBuffer,_=o.vertexTextures;let S=o.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(b){return h.add(b),b===0?"uv":`uv${b}`}function y(b,R,H,Y,ee){const de=Y.fog,se=ee.geometry,te=b.isMeshStandardMaterial?Y.environment:null,le=(b.isMeshStandardMaterial?t:e).get(b.envMap||te),W=le&&le.mapping===_c?le.image.height:null,fe=M[b.type];b.precision!==null&&(S=o.getMaxPrecision(b.precision),S!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",S,"instead."));const ce=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,B=ce!==void 0?ce.length:0;let re=0;se.morphAttributes.position!==void 0&&(re=1),se.morphAttributes.normal!==void 0&&(re=2),se.morphAttributes.color!==void 0&&(re=3);let Be,Xe,qe,ne;if(fe){const At=Ci[fe];Be=At.vertexShader,Xe=At.fragmentShader}else Be=b.vertexShader,Xe=b.fragmentShader,f.update(b),qe=f.getVertexShaderID(b),ne=f.getFragmentShaderID(b);const pe=s.getRenderTarget(),Te=s.state.buffers.depth.getReversed(),Ue=ee.isInstancedMesh===!0,Ve=ee.isBatchedMesh===!0,_t=!!b.map,Nt=!!b.matcap,z=!!le,ye=!!b.aoMap,ve=!!b.lightMap,ge=!!b.bumpMap,me=!!b.normalMap,Ie=!!b.displacementMap,Ee=!!b.emissiveMap,Ne=!!b.metalnessMap,ut=!!b.roughnessMap,ht=b.anisotropy>0,I=b.clearcoat>0,A=b.dispersion>0,K=b.iridescence>0,ue=b.sheen>0,xe=b.transmission>0,he=ht&&!!b.anisotropyMap,Qe=I&&!!b.clearcoatMap,Pe=I&&!!b.clearcoatNormalMap,Ye=I&&!!b.clearcoatRoughnessMap,et=K&&!!b.iridescenceMap,Ae=K&&!!b.iridescenceThicknessMap,He=ue&&!!b.sheenColorMap,dt=ue&&!!b.sheenRoughnessMap,nt=!!b.specularMap,Oe=!!b.specularColorMap,vt=!!b.specularIntensityMap,j=xe&&!!b.transmissionMap,Re=xe&&!!b.thicknessMap,De=!!b.gradientMap,Ge=!!b.alphaMap,Ce=b.alphaTest>0,_e=!!b.alphaHash,Je=!!b.extensions;let gt=Rr;b.toneMapped&&(pe===null||pe.isXRRenderTarget===!0)&&(gt=s.toneMapping);const Dt={shaderID:fe,shaderType:b.type,shaderName:b.name,vertexShader:Be,fragmentShader:Xe,defines:b.defines,customVertexShaderID:qe,customFragmentShaderID:ne,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:S,batching:Ve,batchingColor:Ve&&ee._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&ee.instanceColor!==null,instancingMorph:Ue&&ee.morphTexture!==null,supportsVertexTextures:_,outputColorSpace:pe===null?s.outputColorSpace:pe.isXRRenderTarget===!0?pe.texture.colorSpace:co,alphaToCoverage:!!b.alphaToCoverage,map:_t,matcap:Nt,envMap:z,envMapMode:z&&le.mapping,envMapCubeUVHeight:W,aoMap:ye,lightMap:ve,bumpMap:ge,normalMap:me,displacementMap:_&&Ie,emissiveMap:Ee,normalMapObjectSpace:me&&b.normalMapType===gx,normalMapTangentSpace:me&&b.normalMapType===_g,metalnessMap:Ne,roughnessMap:ut,anisotropy:ht,anisotropyMap:he,clearcoat:I,clearcoatMap:Qe,clearcoatNormalMap:Pe,clearcoatRoughnessMap:Ye,dispersion:A,iridescence:K,iridescenceMap:et,iridescenceThicknessMap:Ae,sheen:ue,sheenColorMap:He,sheenRoughnessMap:dt,specularMap:nt,specularColorMap:Oe,specularIntensityMap:vt,transmission:xe,transmissionMap:j,thicknessMap:Re,gradientMap:De,opaque:b.transparent===!1&&b.blending===io&&b.alphaToCoverage===!1,alphaMap:Ge,alphaTest:Ce,alphaHash:_e,combine:b.combine,mapUv:_t&&w(b.map.channel),aoMapUv:ye&&w(b.aoMap.channel),lightMapUv:ve&&w(b.lightMap.channel),bumpMapUv:ge&&w(b.bumpMap.channel),normalMapUv:me&&w(b.normalMap.channel),displacementMapUv:Ie&&w(b.displacementMap.channel),emissiveMapUv:Ee&&w(b.emissiveMap.channel),metalnessMapUv:Ne&&w(b.metalnessMap.channel),roughnessMapUv:ut&&w(b.roughnessMap.channel),anisotropyMapUv:he&&w(b.anisotropyMap.channel),clearcoatMapUv:Qe&&w(b.clearcoatMap.channel),clearcoatNormalMapUv:Pe&&w(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ye&&w(b.clearcoatRoughnessMap.channel),iridescenceMapUv:et&&w(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ae&&w(b.iridescenceThicknessMap.channel),sheenColorMapUv:He&&w(b.sheenColorMap.channel),sheenRoughnessMapUv:dt&&w(b.sheenRoughnessMap.channel),specularMapUv:nt&&w(b.specularMap.channel),specularColorMapUv:Oe&&w(b.specularColorMap.channel),specularIntensityMapUv:vt&&w(b.specularIntensityMap.channel),transmissionMapUv:j&&w(b.transmissionMap.channel),thicknessMapUv:Re&&w(b.thicknessMap.channel),alphaMapUv:Ge&&w(b.alphaMap.channel),vertexTangents:!!se.attributes.tangent&&(me||ht),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,pointsUvs:ee.isPoints===!0&&!!se.attributes.uv&&(_t||Ge),fog:!!de,useFog:b.fog===!0,fogExp2:!!de&&de.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:x,reversedDepthBuffer:Te,skinning:ee.isSkinnedMesh===!0,morphTargets:se.morphAttributes.position!==void 0,morphNormals:se.morphAttributes.normal!==void 0,morphColors:se.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:re,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&H.length>0,shadowMapType:s.shadowMap.type,toneMapping:gt,decodeVideoTexture:_t&&b.map.isVideoTexture===!0&&Pt.getTransfer(b.map.colorSpace)===Ft,decodeVideoTextureEmissive:Ee&&b.emissiveMap.isVideoTexture===!0&&Pt.getTransfer(b.emissiveMap.colorSpace)===Ft,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ri,flipSided:b.side===Gn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Je&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Je&&b.extensions.multiDraw===!0||Ve)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Dt.vertexUv1s=h.has(1),Dt.vertexUv2s=h.has(2),Dt.vertexUv3s=h.has(3),h.clear(),Dt}function v(b){const R=[];if(b.shaderID?R.push(b.shaderID):(R.push(b.customVertexShaderID),R.push(b.customFragmentShaderID)),b.defines!==void 0)for(const H in b.defines)R.push(H),R.push(b.defines[H]);return b.isRawShaderMaterial===!1&&(P(R,b),C(R,b),R.push(s.outputColorSpace)),R.push(b.customProgramCacheKey),R.join()}function P(b,R){b.push(R.precision),b.push(R.outputColorSpace),b.push(R.envMapMode),b.push(R.envMapCubeUVHeight),b.push(R.mapUv),b.push(R.alphaMapUv),b.push(R.lightMapUv),b.push(R.aoMapUv),b.push(R.bumpMapUv),b.push(R.normalMapUv),b.push(R.displacementMapUv),b.push(R.emissiveMapUv),b.push(R.metalnessMapUv),b.push(R.roughnessMapUv),b.push(R.anisotropyMapUv),b.push(R.clearcoatMapUv),b.push(R.clearcoatNormalMapUv),b.push(R.clearcoatRoughnessMapUv),b.push(R.iridescenceMapUv),b.push(R.iridescenceThicknessMapUv),b.push(R.sheenColorMapUv),b.push(R.sheenRoughnessMapUv),b.push(R.specularMapUv),b.push(R.specularColorMapUv),b.push(R.specularIntensityMapUv),b.push(R.transmissionMapUv),b.push(R.thicknessMapUv),b.push(R.combine),b.push(R.fogExp2),b.push(R.sizeAttenuation),b.push(R.morphTargetsCount),b.push(R.morphAttributeCount),b.push(R.numDirLights),b.push(R.numPointLights),b.push(R.numSpotLights),b.push(R.numSpotLightMaps),b.push(R.numHemiLights),b.push(R.numRectAreaLights),b.push(R.numDirLightShadows),b.push(R.numPointLightShadows),b.push(R.numSpotLightShadows),b.push(R.numSpotLightShadowsWithMaps),b.push(R.numLightProbes),b.push(R.shadowMapType),b.push(R.toneMapping),b.push(R.numClippingPlanes),b.push(R.numClipIntersection),b.push(R.depthPacking)}function C(b,R){d.disableAll(),R.supportsVertexTextures&&d.enable(0),R.instancing&&d.enable(1),R.instancingColor&&d.enable(2),R.instancingMorph&&d.enable(3),R.matcap&&d.enable(4),R.envMap&&d.enable(5),R.normalMapObjectSpace&&d.enable(6),R.normalMapTangentSpace&&d.enable(7),R.clearcoat&&d.enable(8),R.iridescence&&d.enable(9),R.alphaTest&&d.enable(10),R.vertexColors&&d.enable(11),R.vertexAlphas&&d.enable(12),R.vertexUv1s&&d.enable(13),R.vertexUv2s&&d.enable(14),R.vertexUv3s&&d.enable(15),R.vertexTangents&&d.enable(16),R.anisotropy&&d.enable(17),R.alphaHash&&d.enable(18),R.batching&&d.enable(19),R.dispersion&&d.enable(20),R.batchingColor&&d.enable(21),R.gradientMap&&d.enable(22),b.push(d.mask),d.disableAll(),R.fog&&d.enable(0),R.useFog&&d.enable(1),R.flatShading&&d.enable(2),R.logarithmicDepthBuffer&&d.enable(3),R.reversedDepthBuffer&&d.enable(4),R.skinning&&d.enable(5),R.morphTargets&&d.enable(6),R.morphNormals&&d.enable(7),R.morphColors&&d.enable(8),R.premultipliedAlpha&&d.enable(9),R.shadowMapEnabled&&d.enable(10),R.doubleSided&&d.enable(11),R.flipSided&&d.enable(12),R.useDepthPacking&&d.enable(13),R.dithering&&d.enable(14),R.transmission&&d.enable(15),R.sheen&&d.enable(16),R.opaque&&d.enable(17),R.pointsUvs&&d.enable(18),R.decodeVideoTexture&&d.enable(19),R.decodeVideoTextureEmissive&&d.enable(20),R.alphaToCoverage&&d.enable(21),b.push(d.mask)}function E(b){const R=M[b.type];let H;if(R){const Y=Ci[R];H=oy.clone(Y.uniforms)}else H=b.uniforms;return H}function O(b,R){let H;for(let Y=0,ee=m.length;Y<ee;Y++){const de=m[Y];if(de.cacheKey===R){H=de,++H.usedTimes;break}}return H===void 0&&(H=new dw(s,R,b,a),m.push(H)),H}function U(b){if(--b.usedTimes===0){const R=m.indexOf(b);m[R]=m[m.length-1],m.pop(),b.destroy()}}function F(b){f.remove(b)}function V(){f.dispose()}return{getParameters:y,getProgramCacheKey:v,getUniforms:E,acquireProgram:O,releaseProgram:U,releaseShaderCache:F,programs:m,dispose:V}}function gw(){let s=new WeakMap;function e(c){return s.has(c)}function t(c){let d=s.get(c);return d===void 0&&(d={},s.set(c,d)),d}function i(c){s.delete(c)}function o(c,d,f){s.get(c)[d]=f}function a(){s=new WeakMap}return{has:e,get:t,remove:i,update:o,dispose:a}}function vw(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function B0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function V0(){const s=[];let e=0;const t=[],i=[],o=[];function a(){e=0,t.length=0,i.length=0,o.length=0}function c(x,_,S,M,w,y){let v=s[e];return v===void 0?(v={id:x.id,object:x,geometry:_,material:S,groupOrder:M,renderOrder:x.renderOrder,z:w,group:y},s[e]=v):(v.id=x.id,v.object=x,v.geometry=_,v.material=S,v.groupOrder=M,v.renderOrder=x.renderOrder,v.z=w,v.group=y),e++,v}function d(x,_,S,M,w,y){const v=c(x,_,S,M,w,y);S.transmission>0?i.push(v):S.transparent===!0?o.push(v):t.push(v)}function f(x,_,S,M,w,y){const v=c(x,_,S,M,w,y);S.transmission>0?i.unshift(v):S.transparent===!0?o.unshift(v):t.unshift(v)}function h(x,_){t.length>1&&t.sort(x||vw),i.length>1&&i.sort(_||B0),o.length>1&&o.sort(_||B0)}function m(){for(let x=e,_=s.length;x<_;x++){const S=s[x];if(S.id===null)break;S.id=null,S.object=null,S.geometry=null,S.material=null,S.group=null}}return{opaque:t,transmissive:i,transparent:o,init:a,push:d,unshift:f,finish:m,sort:h}}function _w(){let s=new WeakMap;function e(i,o){const a=s.get(i);let c;return a===void 0?(c=new V0,s.set(i,[c])):o>=a.length?(c=new V0,a.push(c)):c=a[o],c}function t(){s=new WeakMap}return{get:e,dispose:t}}function xw(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Tt};break;case"SpotLight":t={position:new D,direction:new D,color:new Tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Tt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Tt,groundColor:new Tt};break;case"RectAreaLight":t={color:new Tt,position:new D,halfWidth:new D,halfHeight:new D};break}return s[e.id]=t,t}}}function yw(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Sw=0;function Mw(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Ew(s){const e=new xw,t=yw(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new D);const o=new D,a=new jt,c=new jt;function d(h){let m=0,x=0,_=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let S=0,M=0,w=0,y=0,v=0,P=0,C=0,E=0,O=0,U=0,F=0;h.sort(Mw);for(let b=0,R=h.length;b<R;b++){const H=h[b],Y=H.color,ee=H.intensity,de=H.distance,se=H.shadow&&H.shadow.map?H.shadow.map.texture:null;if(H.isAmbientLight)m+=Y.r*ee,x+=Y.g*ee,_+=Y.b*ee;else if(H.isLightProbe){for(let te=0;te<9;te++)i.probe[te].addScaledVector(H.sh.coefficients[te],ee);F++}else if(H.isDirectionalLight){const te=e.get(H);if(te.color.copy(H.color).multiplyScalar(H.intensity),H.castShadow){const le=H.shadow,W=t.get(H);W.shadowIntensity=le.intensity,W.shadowBias=le.bias,W.shadowNormalBias=le.normalBias,W.shadowRadius=le.radius,W.shadowMapSize=le.mapSize,i.directionalShadow[S]=W,i.directionalShadowMap[S]=se,i.directionalShadowMatrix[S]=H.shadow.matrix,P++}i.directional[S]=te,S++}else if(H.isSpotLight){const te=e.get(H);te.position.setFromMatrixPosition(H.matrixWorld),te.color.copy(Y).multiplyScalar(ee),te.distance=de,te.coneCos=Math.cos(H.angle),te.penumbraCos=Math.cos(H.angle*(1-H.penumbra)),te.decay=H.decay,i.spot[w]=te;const le=H.shadow;if(H.map&&(i.spotLightMap[O]=H.map,O++,le.updateMatrices(H),H.castShadow&&U++),i.spotLightMatrix[w]=le.matrix,H.castShadow){const W=t.get(H);W.shadowIntensity=le.intensity,W.shadowBias=le.bias,W.shadowNormalBias=le.normalBias,W.shadowRadius=le.radius,W.shadowMapSize=le.mapSize,i.spotShadow[w]=W,i.spotShadowMap[w]=se,E++}w++}else if(H.isRectAreaLight){const te=e.get(H);te.color.copy(Y).multiplyScalar(ee),te.halfWidth.set(H.width*.5,0,0),te.halfHeight.set(0,H.height*.5,0),i.rectArea[y]=te,y++}else if(H.isPointLight){const te=e.get(H);if(te.color.copy(H.color).multiplyScalar(H.intensity),te.distance=H.distance,te.decay=H.decay,H.castShadow){const le=H.shadow,W=t.get(H);W.shadowIntensity=le.intensity,W.shadowBias=le.bias,W.shadowNormalBias=le.normalBias,W.shadowRadius=le.radius,W.shadowMapSize=le.mapSize,W.shadowCameraNear=le.camera.near,W.shadowCameraFar=le.camera.far,i.pointShadow[M]=W,i.pointShadowMap[M]=se,i.pointShadowMatrix[M]=H.shadow.matrix,C++}i.point[M]=te,M++}else if(H.isHemisphereLight){const te=e.get(H);te.skyColor.copy(H.color).multiplyScalar(ee),te.groundColor.copy(H.groundColor).multiplyScalar(ee),i.hemi[v]=te,v++}}y>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ze.LTC_FLOAT_1,i.rectAreaLTC2=ze.LTC_FLOAT_2):(i.rectAreaLTC1=ze.LTC_HALF_1,i.rectAreaLTC2=ze.LTC_HALF_2)),i.ambient[0]=m,i.ambient[1]=x,i.ambient[2]=_;const V=i.hash;(V.directionalLength!==S||V.pointLength!==M||V.spotLength!==w||V.rectAreaLength!==y||V.hemiLength!==v||V.numDirectionalShadows!==P||V.numPointShadows!==C||V.numSpotShadows!==E||V.numSpotMaps!==O||V.numLightProbes!==F)&&(i.directional.length=S,i.spot.length=w,i.rectArea.length=y,i.point.length=M,i.hemi.length=v,i.directionalShadow.length=P,i.directionalShadowMap.length=P,i.pointShadow.length=C,i.pointShadowMap.length=C,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=P,i.pointShadowMatrix.length=C,i.spotLightMatrix.length=E+O-U,i.spotLightMap.length=O,i.numSpotLightShadowsWithMaps=U,i.numLightProbes=F,V.directionalLength=S,V.pointLength=M,V.spotLength=w,V.rectAreaLength=y,V.hemiLength=v,V.numDirectionalShadows=P,V.numPointShadows=C,V.numSpotShadows=E,V.numSpotMaps=O,V.numLightProbes=F,i.version=Sw++)}function f(h,m){let x=0,_=0,S=0,M=0,w=0;const y=m.matrixWorldInverse;for(let v=0,P=h.length;v<P;v++){const C=h[v];if(C.isDirectionalLight){const E=i.directional[x];E.direction.setFromMatrixPosition(C.matrixWorld),o.setFromMatrixPosition(C.target.matrixWorld),E.direction.sub(o),E.direction.transformDirection(y),x++}else if(C.isSpotLight){const E=i.spot[S];E.position.setFromMatrixPosition(C.matrixWorld),E.position.applyMatrix4(y),E.direction.setFromMatrixPosition(C.matrixWorld),o.setFromMatrixPosition(C.target.matrixWorld),E.direction.sub(o),E.direction.transformDirection(y),S++}else if(C.isRectAreaLight){const E=i.rectArea[M];E.position.setFromMatrixPosition(C.matrixWorld),E.position.applyMatrix4(y),c.identity(),a.copy(C.matrixWorld),a.premultiply(y),c.extractRotation(a),E.halfWidth.set(C.width*.5,0,0),E.halfHeight.set(0,C.height*.5,0),E.halfWidth.applyMatrix4(c),E.halfHeight.applyMatrix4(c),M++}else if(C.isPointLight){const E=i.point[_];E.position.setFromMatrixPosition(C.matrixWorld),E.position.applyMatrix4(y),_++}else if(C.isHemisphereLight){const E=i.hemi[w];E.direction.setFromMatrixPosition(C.matrixWorld),E.direction.transformDirection(y),w++}}}return{setup:d,setupView:f,state:i}}function H0(s){const e=new Ew(s),t=[],i=[];function o(m){h.camera=m,t.length=0,i.length=0}function a(m){t.push(m)}function c(m){i.push(m)}function d(){e.setup(t)}function f(m){e.setupView(t,m)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:o,state:h,setupLights:d,setupLightsView:f,pushLight:a,pushShadow:c}}function ww(s){let e=new WeakMap;function t(o,a=0){const c=e.get(o);let d;return c===void 0?(d=new H0(s),e.set(o,[d])):a>=c.length?(d=new H0(s),c.push(d)):d=c[a],d}function i(){e=new WeakMap}return{get:t,dispose:i}}const Tw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Aw=`uniform sampler2D shadow_pass;
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
}`;function Cw(s,e,t){let i=new Kf;const o=new Fe,a=new Fe,c=new Ot,d=new $y({depthPacking:mx}),f=new Ky,h={},m=t.maxTextureSize,x={[br]:Gn,[Gn]:br,[Ri]:Ri},_=new Pr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:Tw,fragmentShader:Aw}),S=_.clone();S.defines.HORIZONTAL_PASS=1;const M=new Wn;M.setAttribute("position",new Li(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new Yt(M,_),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sg;let v=this.type;this.render=function(U,F,V){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||U.length===0)return;const b=s.getRenderTarget(),R=s.getActiveCubeFace(),H=s.getActiveMipmapLevel(),Y=s.state;Y.setBlending(Cr),Y.buffers.depth.getReversed()===!0?Y.buffers.color.setClear(0,0,0,0):Y.buffers.color.setClear(1,1,1,1),Y.buffers.depth.setTest(!0),Y.setScissorTest(!1);const ee=v!==$i&&this.type===$i,de=v===$i&&this.type!==$i;for(let se=0,te=U.length;se<te;se++){const le=U[se],W=le.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",le,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;o.copy(W.mapSize);const fe=W.getFrameExtents();if(o.multiply(fe),a.copy(W.mapSize),(o.x>m||o.y>m)&&(o.x>m&&(a.x=Math.floor(m/fe.x),o.x=a.x*fe.x,W.mapSize.x=a.x),o.y>m&&(a.y=Math.floor(m/fe.y),o.y=a.y*fe.y,W.mapSize.y=a.y)),W.map===null||ee===!0||de===!0){const B=this.type!==$i?{minFilter:xi,magFilter:xi}:{};W.map!==null&&W.map.dispose(),W.map=new as(o.x,o.y,B),W.map.texture.name=le.name+".shadowMap",W.camera.updateProjectionMatrix()}s.setRenderTarget(W.map),s.clear();const ce=W.getViewportCount();for(let B=0;B<ce;B++){const re=W.getViewport(B);c.set(a.x*re.x,a.y*re.y,a.x*re.z,a.y*re.w),Y.viewport(c),W.updateMatrices(le,B),i=W.getFrustum(),E(F,V,W.camera,le,this.type)}W.isPointLightShadow!==!0&&this.type===$i&&P(W,V),W.needsUpdate=!1}v=this.type,y.needsUpdate=!1,s.setRenderTarget(b,R,H)};function P(U,F){const V=e.update(w);_.defines.VSM_SAMPLES!==U.blurSamples&&(_.defines.VSM_SAMPLES=U.blurSamples,S.defines.VSM_SAMPLES=U.blurSamples,_.needsUpdate=!0,S.needsUpdate=!0),U.mapPass===null&&(U.mapPass=new as(o.x,o.y)),_.uniforms.shadow_pass.value=U.map.texture,_.uniforms.resolution.value=U.mapSize,_.uniforms.radius.value=U.radius,s.setRenderTarget(U.mapPass),s.clear(),s.renderBufferDirect(F,null,V,_,w,null),S.uniforms.shadow_pass.value=U.mapPass.texture,S.uniforms.resolution.value=U.mapSize,S.uniforms.radius.value=U.radius,s.setRenderTarget(U.map),s.clear(),s.renderBufferDirect(F,null,V,S,w,null)}function C(U,F,V,b){let R=null;const H=V.isPointLight===!0?U.customDistanceMaterial:U.customDepthMaterial;if(H!==void 0)R=H;else if(R=V.isPointLight===!0?f:d,s.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0||F.alphaToCoverage===!0){const Y=R.uuid,ee=F.uuid;let de=h[Y];de===void 0&&(de={},h[Y]=de);let se=de[ee];se===void 0&&(se=R.clone(),de[ee]=se,F.addEventListener("dispose",O)),R=se}if(R.visible=F.visible,R.wireframe=F.wireframe,b===$i?R.side=F.shadowSide!==null?F.shadowSide:F.side:R.side=F.shadowSide!==null?F.shadowSide:x[F.side],R.alphaMap=F.alphaMap,R.alphaTest=F.alphaToCoverage===!0?.5:F.alphaTest,R.map=F.map,R.clipShadows=F.clipShadows,R.clippingPlanes=F.clippingPlanes,R.clipIntersection=F.clipIntersection,R.displacementMap=F.displacementMap,R.displacementScale=F.displacementScale,R.displacementBias=F.displacementBias,R.wireframeLinewidth=F.wireframeLinewidth,R.linewidth=F.linewidth,V.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const Y=s.properties.get(R);Y.light=V}return R}function E(U,F,V,b,R){if(U.visible===!1)return;if(U.layers.test(F.layers)&&(U.isMesh||U.isLine||U.isPoints)&&(U.castShadow||U.receiveShadow&&R===$i)&&(!U.frustumCulled||i.intersectsObject(U))){U.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,U.matrixWorld);const ee=e.update(U),de=U.material;if(Array.isArray(de)){const se=ee.groups;for(let te=0,le=se.length;te<le;te++){const W=se[te],fe=de[W.materialIndex];if(fe&&fe.visible){const ce=C(U,fe,b,R);U.onBeforeShadow(s,U,F,V,ee,ce,W),s.renderBufferDirect(V,null,ee,ce,U,W),U.onAfterShadow(s,U,F,V,ee,ce,W)}}}else if(de.visible){const se=C(U,de,b,R);U.onBeforeShadow(s,U,F,V,ee,se,null),s.renderBufferDirect(V,null,ee,se,U,null),U.onAfterShadow(s,U,F,V,ee,se,null)}}const Y=U.children;for(let ee=0,de=Y.length;ee<de;ee++)E(Y[ee],F,V,b,R)}function O(U){U.target.removeEventListener("dispose",O);for(const V in h){const b=h[V],R=U.target.uuid;R in b&&(b[R].dispose(),delete b[R])}}}const Rw={[Yd]:$d,[Kd]:Qd,[Zd]:ef,[oo]:Jd,[$d]:Yd,[Qd]:Kd,[ef]:Zd,[Jd]:oo};function bw(s,e){function t(){let j=!1;const Re=new Ot;let De=null;const Ge=new Ot(0,0,0,0);return{setMask:function(Ce){De!==Ce&&!j&&(s.colorMask(Ce,Ce,Ce,Ce),De=Ce)},setLocked:function(Ce){j=Ce},setClear:function(Ce,_e,Je,gt,Dt){Dt===!0&&(Ce*=gt,_e*=gt,Je*=gt),Re.set(Ce,_e,Je,gt),Ge.equals(Re)===!1&&(s.clearColor(Ce,_e,Je,gt),Ge.copy(Re))},reset:function(){j=!1,De=null,Ge.set(-1,0,0,0)}}}function i(){let j=!1,Re=!1,De=null,Ge=null,Ce=null;return{setReversed:function(_e){if(Re!==_e){const Je=e.get("EXT_clip_control");_e?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),Re=_e;const gt=Ce;Ce=null,this.setClear(gt)}},getReversed:function(){return Re},setTest:function(_e){_e?pe(s.DEPTH_TEST):Te(s.DEPTH_TEST)},setMask:function(_e){De!==_e&&!j&&(s.depthMask(_e),De=_e)},setFunc:function(_e){if(Re&&(_e=Rw[_e]),Ge!==_e){switch(_e){case Yd:s.depthFunc(s.NEVER);break;case $d:s.depthFunc(s.ALWAYS);break;case Kd:s.depthFunc(s.LESS);break;case oo:s.depthFunc(s.LEQUAL);break;case Zd:s.depthFunc(s.EQUAL);break;case Jd:s.depthFunc(s.GEQUAL);break;case Qd:s.depthFunc(s.GREATER);break;case ef:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Ge=_e}},setLocked:function(_e){j=_e},setClear:function(_e){Ce!==_e&&(Re&&(_e=1-_e),s.clearDepth(_e),Ce=_e)},reset:function(){j=!1,De=null,Ge=null,Ce=null,Re=!1}}}function o(){let j=!1,Re=null,De=null,Ge=null,Ce=null,_e=null,Je=null,gt=null,Dt=null;return{setTest:function(At){j||(At?pe(s.STENCIL_TEST):Te(s.STENCIL_TEST))},setMask:function(At){Re!==At&&!j&&(s.stencilMask(At),Re=At)},setFunc:function(At,Qn,vn){(De!==At||Ge!==Qn||Ce!==vn)&&(s.stencilFunc(At,Qn,vn),De=At,Ge=Qn,Ce=vn)},setOp:function(At,Qn,vn){(_e!==At||Je!==Qn||gt!==vn)&&(s.stencilOp(At,Qn,vn),_e=At,Je=Qn,gt=vn)},setLocked:function(At){j=At},setClear:function(At){Dt!==At&&(s.clearStencil(At),Dt=At)},reset:function(){j=!1,Re=null,De=null,Ge=null,Ce=null,_e=null,Je=null,gt=null,Dt=null}}}const a=new t,c=new i,d=new o,f=new WeakMap,h=new WeakMap;let m={},x={},_=new WeakMap,S=[],M=null,w=!1,y=null,v=null,P=null,C=null,E=null,O=null,U=null,F=new Tt(0,0,0),V=0,b=!1,R=null,H=null,Y=null,ee=null,de=null;const se=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let te=!1,le=0;const W=s.getParameter(s.VERSION);W.indexOf("WebGL")!==-1?(le=parseFloat(/^WebGL (\d)/.exec(W)[1]),te=le>=1):W.indexOf("OpenGL ES")!==-1&&(le=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),te=le>=2);let fe=null,ce={};const B=s.getParameter(s.SCISSOR_BOX),re=s.getParameter(s.VIEWPORT),Be=new Ot().fromArray(B),Xe=new Ot().fromArray(re);function qe(j,Re,De,Ge){const Ce=new Uint8Array(4),_e=s.createTexture();s.bindTexture(j,_e),s.texParameteri(j,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(j,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Je=0;Je<De;Je++)j===s.TEXTURE_3D||j===s.TEXTURE_2D_ARRAY?s.texImage3D(Re,0,s.RGBA,1,1,Ge,0,s.RGBA,s.UNSIGNED_BYTE,Ce):s.texImage2D(Re+Je,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ce);return _e}const ne={};ne[s.TEXTURE_2D]=qe(s.TEXTURE_2D,s.TEXTURE_2D,1),ne[s.TEXTURE_CUBE_MAP]=qe(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[s.TEXTURE_2D_ARRAY]=qe(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ne[s.TEXTURE_3D]=qe(s.TEXTURE_3D,s.TEXTURE_3D,1,1),a.setClear(0,0,0,1),c.setClear(1),d.setClear(0),pe(s.DEPTH_TEST),c.setFunc(oo),ge(!1),me(km),pe(s.CULL_FACE),ye(Cr);function pe(j){m[j]!==!0&&(s.enable(j),m[j]=!0)}function Te(j){m[j]!==!1&&(s.disable(j),m[j]=!1)}function Ue(j,Re){return x[j]!==Re?(s.bindFramebuffer(j,Re),x[j]=Re,j===s.DRAW_FRAMEBUFFER&&(x[s.FRAMEBUFFER]=Re),j===s.FRAMEBUFFER&&(x[s.DRAW_FRAMEBUFFER]=Re),!0):!1}function Ve(j,Re){let De=S,Ge=!1;if(j){De=_.get(Re),De===void 0&&(De=[],_.set(Re,De));const Ce=j.textures;if(De.length!==Ce.length||De[0]!==s.COLOR_ATTACHMENT0){for(let _e=0,Je=Ce.length;_e<Je;_e++)De[_e]=s.COLOR_ATTACHMENT0+_e;De.length=Ce.length,Ge=!0}}else De[0]!==s.BACK&&(De[0]=s.BACK,Ge=!0);Ge&&s.drawBuffers(De)}function _t(j){return M!==j?(s.useProgram(j),M=j,!0):!1}const Nt={[ns]:s.FUNC_ADD,[H_]:s.FUNC_SUBTRACT,[G_]:s.FUNC_REVERSE_SUBTRACT};Nt[W_]=s.MIN,Nt[j_]=s.MAX;const z={[X_]:s.ZERO,[q_]:s.ONE,[Y_]:s.SRC_COLOR,[Xd]:s.SRC_ALPHA,[ex]:s.SRC_ALPHA_SATURATE,[J_]:s.DST_COLOR,[K_]:s.DST_ALPHA,[$_]:s.ONE_MINUS_SRC_COLOR,[qd]:s.ONE_MINUS_SRC_ALPHA,[Q_]:s.ONE_MINUS_DST_COLOR,[Z_]:s.ONE_MINUS_DST_ALPHA,[tx]:s.CONSTANT_COLOR,[nx]:s.ONE_MINUS_CONSTANT_COLOR,[ix]:s.CONSTANT_ALPHA,[rx]:s.ONE_MINUS_CONSTANT_ALPHA};function ye(j,Re,De,Ge,Ce,_e,Je,gt,Dt,At){if(j===Cr){w===!0&&(Te(s.BLEND),w=!1);return}if(w===!1&&(pe(s.BLEND),w=!0),j!==V_){if(j!==y||At!==b){if((v!==ns||E!==ns)&&(s.blendEquation(s.FUNC_ADD),v=ns,E=ns),At)switch(j){case io:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case jd:s.blendFunc(s.ONE,s.ONE);break;case zm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Bm:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case io:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case jd:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case zm:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Bm:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}P=null,C=null,O=null,U=null,F.set(0,0,0),V=0,y=j,b=At}return}Ce=Ce||Re,_e=_e||De,Je=Je||Ge,(Re!==v||Ce!==E)&&(s.blendEquationSeparate(Nt[Re],Nt[Ce]),v=Re,E=Ce),(De!==P||Ge!==C||_e!==O||Je!==U)&&(s.blendFuncSeparate(z[De],z[Ge],z[_e],z[Je]),P=De,C=Ge,O=_e,U=Je),(gt.equals(F)===!1||Dt!==V)&&(s.blendColor(gt.r,gt.g,gt.b,Dt),F.copy(gt),V=Dt),y=j,b=!1}function ve(j,Re){j.side===Ri?Te(s.CULL_FACE):pe(s.CULL_FACE);let De=j.side===Gn;Re&&(De=!De),ge(De),j.blending===io&&j.transparent===!1?ye(Cr):ye(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),c.setFunc(j.depthFunc),c.setTest(j.depthTest),c.setMask(j.depthWrite),a.setMask(j.colorWrite);const Ge=j.stencilWrite;d.setTest(Ge),Ge&&(d.setMask(j.stencilWriteMask),d.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),d.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),Ee(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?pe(s.SAMPLE_ALPHA_TO_COVERAGE):Te(s.SAMPLE_ALPHA_TO_COVERAGE)}function ge(j){R!==j&&(j?s.frontFace(s.CW):s.frontFace(s.CCW),R=j)}function me(j){j!==z_?(pe(s.CULL_FACE),j!==H&&(j===km?s.cullFace(s.BACK):j===B_?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Te(s.CULL_FACE),H=j}function Ie(j){j!==Y&&(te&&s.lineWidth(j),Y=j)}function Ee(j,Re,De){j?(pe(s.POLYGON_OFFSET_FILL),(ee!==Re||de!==De)&&(s.polygonOffset(Re,De),ee=Re,de=De)):Te(s.POLYGON_OFFSET_FILL)}function Ne(j){j?pe(s.SCISSOR_TEST):Te(s.SCISSOR_TEST)}function ut(j){j===void 0&&(j=s.TEXTURE0+se-1),fe!==j&&(s.activeTexture(j),fe=j)}function ht(j,Re,De){De===void 0&&(fe===null?De=s.TEXTURE0+se-1:De=fe);let Ge=ce[De];Ge===void 0&&(Ge={type:void 0,texture:void 0},ce[De]=Ge),(Ge.type!==j||Ge.texture!==Re)&&(fe!==De&&(s.activeTexture(De),fe=De),s.bindTexture(j,Re||ne[j]),Ge.type=j,Ge.texture=Re)}function I(){const j=ce[fe];j!==void 0&&j.type!==void 0&&(s.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function A(){try{s.compressedTexImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function K(){try{s.compressedTexImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ue(){try{s.texSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function xe(){try{s.texSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function he(){try{s.compressedTexSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Qe(){try{s.compressedTexSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Pe(){try{s.texStorage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ye(){try{s.texStorage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function et(){try{s.texImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ae(){try{s.texImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function He(j){Be.equals(j)===!1&&(s.scissor(j.x,j.y,j.z,j.w),Be.copy(j))}function dt(j){Xe.equals(j)===!1&&(s.viewport(j.x,j.y,j.z,j.w),Xe.copy(j))}function nt(j,Re){let De=h.get(Re);De===void 0&&(De=new WeakMap,h.set(Re,De));let Ge=De.get(j);Ge===void 0&&(Ge=s.getUniformBlockIndex(Re,j.name),De.set(j,Ge))}function Oe(j,Re){const Ge=h.get(Re).get(j);f.get(Re)!==Ge&&(s.uniformBlockBinding(Re,Ge,j.__bindingPointIndex),f.set(Re,Ge))}function vt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),c.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),m={},fe=null,ce={},x={},_=new WeakMap,S=[],M=null,w=!1,y=null,v=null,P=null,C=null,E=null,O=null,U=null,F=new Tt(0,0,0),V=0,b=!1,R=null,H=null,Y=null,ee=null,de=null,Be.set(0,0,s.canvas.width,s.canvas.height),Xe.set(0,0,s.canvas.width,s.canvas.height),a.reset(),c.reset(),d.reset()}return{buffers:{color:a,depth:c,stencil:d},enable:pe,disable:Te,bindFramebuffer:Ue,drawBuffers:Ve,useProgram:_t,setBlending:ye,setMaterial:ve,setFlipSided:ge,setCullFace:me,setLineWidth:Ie,setPolygonOffset:Ee,setScissorTest:Ne,activeTexture:ut,bindTexture:ht,unbindTexture:I,compressedTexImage2D:A,compressedTexImage3D:K,texImage2D:et,texImage3D:Ae,updateUBOMapping:nt,uniformBlockBinding:Oe,texStorage2D:Pe,texStorage3D:Ye,texSubImage2D:ue,texSubImage3D:xe,compressedTexSubImage2D:he,compressedTexSubImage3D:Qe,scissor:He,viewport:dt,reset:vt}}function Pw(s,e,t,i,o,a,c){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,f=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Fe,m=new WeakMap;let x;const _=new WeakMap;let S=!1;try{S=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(I,A){return S?new OffscreenCanvas(I,A):dc("canvas")}function w(I,A,K){let ue=1;const xe=ht(I);if((xe.width>K||xe.height>K)&&(ue=K/Math.max(xe.width,xe.height)),ue<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const he=Math.floor(ue*xe.width),Qe=Math.floor(ue*xe.height);x===void 0&&(x=M(he,Qe));const Pe=A?M(he,Qe):x;return Pe.width=he,Pe.height=Qe,Pe.getContext("2d").drawImage(I,0,0,he,Qe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+xe.width+"x"+xe.height+") to ("+he+"x"+Qe+")."),Pe}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+xe.width+"x"+xe.height+")."),I;return I}function y(I){return I.generateMipmaps}function v(I){s.generateMipmap(I)}function P(I){return I.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?s.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function C(I,A,K,ue,xe=!1){if(I!==null){if(s[I]!==void 0)return s[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let he=A;if(A===s.RED&&(K===s.FLOAT&&(he=s.R32F),K===s.HALF_FLOAT&&(he=s.R16F),K===s.UNSIGNED_BYTE&&(he=s.R8)),A===s.RED_INTEGER&&(K===s.UNSIGNED_BYTE&&(he=s.R8UI),K===s.UNSIGNED_SHORT&&(he=s.R16UI),K===s.UNSIGNED_INT&&(he=s.R32UI),K===s.BYTE&&(he=s.R8I),K===s.SHORT&&(he=s.R16I),K===s.INT&&(he=s.R32I)),A===s.RG&&(K===s.FLOAT&&(he=s.RG32F),K===s.HALF_FLOAT&&(he=s.RG16F),K===s.UNSIGNED_BYTE&&(he=s.RG8)),A===s.RG_INTEGER&&(K===s.UNSIGNED_BYTE&&(he=s.RG8UI),K===s.UNSIGNED_SHORT&&(he=s.RG16UI),K===s.UNSIGNED_INT&&(he=s.RG32UI),K===s.BYTE&&(he=s.RG8I),K===s.SHORT&&(he=s.RG16I),K===s.INT&&(he=s.RG32I)),A===s.RGB_INTEGER&&(K===s.UNSIGNED_BYTE&&(he=s.RGB8UI),K===s.UNSIGNED_SHORT&&(he=s.RGB16UI),K===s.UNSIGNED_INT&&(he=s.RGB32UI),K===s.BYTE&&(he=s.RGB8I),K===s.SHORT&&(he=s.RGB16I),K===s.INT&&(he=s.RGB32I)),A===s.RGBA_INTEGER&&(K===s.UNSIGNED_BYTE&&(he=s.RGBA8UI),K===s.UNSIGNED_SHORT&&(he=s.RGBA16UI),K===s.UNSIGNED_INT&&(he=s.RGBA32UI),K===s.BYTE&&(he=s.RGBA8I),K===s.SHORT&&(he=s.RGBA16I),K===s.INT&&(he=s.RGBA32I)),A===s.RGB&&(K===s.UNSIGNED_INT_5_9_9_9_REV&&(he=s.RGB9_E5),K===s.UNSIGNED_INT_10F_11F_11F_REV&&(he=s.R11F_G11F_B10F)),A===s.RGBA){const Qe=xe?cc:Pt.getTransfer(ue);K===s.FLOAT&&(he=s.RGBA32F),K===s.HALF_FLOAT&&(he=s.RGBA16F),K===s.UNSIGNED_BYTE&&(he=Qe===Ft?s.SRGB8_ALPHA8:s.RGBA8),K===s.UNSIGNED_SHORT_4_4_4_4&&(he=s.RGBA4),K===s.UNSIGNED_SHORT_5_5_5_1&&(he=s.RGB5_A1)}return(he===s.R16F||he===s.R32F||he===s.RG16F||he===s.RG32F||he===s.RGBA16F||he===s.RGBA32F)&&e.get("EXT_color_buffer_float"),he}function E(I,A){let K;return I?A===null||A===os||A===ua?K=s.DEPTH24_STENCIL8:A===Ki?K=s.DEPTH32F_STENCIL8:A===ca&&(K=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===os||A===ua?K=s.DEPTH_COMPONENT24:A===Ki?K=s.DEPTH_COMPONENT32F:A===ca&&(K=s.DEPTH_COMPONENT16),K}function O(I,A){return y(I)===!0||I.isFramebufferTexture&&I.minFilter!==xi&&I.minFilter!==bi?Math.log2(Math.max(A.width,A.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?A.mipmaps.length:1}function U(I){const A=I.target;A.removeEventListener("dispose",U),V(A),A.isVideoTexture&&m.delete(A)}function F(I){const A=I.target;A.removeEventListener("dispose",F),R(A)}function V(I){const A=i.get(I);if(A.__webglInit===void 0)return;const K=I.source,ue=_.get(K);if(ue){const xe=ue[A.__cacheKey];xe.usedTimes--,xe.usedTimes===0&&b(I),Object.keys(ue).length===0&&_.delete(K)}i.remove(I)}function b(I){const A=i.get(I);s.deleteTexture(A.__webglTexture);const K=I.source,ue=_.get(K);delete ue[A.__cacheKey],c.memory.textures--}function R(I){const A=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let ue=0;ue<6;ue++){if(Array.isArray(A.__webglFramebuffer[ue]))for(let xe=0;xe<A.__webglFramebuffer[ue].length;xe++)s.deleteFramebuffer(A.__webglFramebuffer[ue][xe]);else s.deleteFramebuffer(A.__webglFramebuffer[ue]);A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer[ue])}else{if(Array.isArray(A.__webglFramebuffer))for(let ue=0;ue<A.__webglFramebuffer.length;ue++)s.deleteFramebuffer(A.__webglFramebuffer[ue]);else s.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&s.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ue=0;ue<A.__webglColorRenderbuffer.length;ue++)A.__webglColorRenderbuffer[ue]&&s.deleteRenderbuffer(A.__webglColorRenderbuffer[ue]);A.__webglDepthRenderbuffer&&s.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const K=I.textures;for(let ue=0,xe=K.length;ue<xe;ue++){const he=i.get(K[ue]);he.__webglTexture&&(s.deleteTexture(he.__webglTexture),c.memory.textures--),i.remove(K[ue])}i.remove(I)}let H=0;function Y(){H=0}function ee(){const I=H;return I>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+o.maxTextures),H+=1,I}function de(I){const A=[];return A.push(I.wrapS),A.push(I.wrapT),A.push(I.wrapR||0),A.push(I.magFilter),A.push(I.minFilter),A.push(I.anisotropy),A.push(I.internalFormat),A.push(I.format),A.push(I.type),A.push(I.generateMipmaps),A.push(I.premultiplyAlpha),A.push(I.flipY),A.push(I.unpackAlignment),A.push(I.colorSpace),A.join()}function se(I,A){const K=i.get(I);if(I.isVideoTexture&&Ne(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&K.__version!==I.version){const ue=I.image;if(ue===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(K,I,A);return}}else I.isExternalTexture&&(K.__webglTexture=I.sourceTexture?I.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,K.__webglTexture,s.TEXTURE0+A)}function te(I,A){const K=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&K.__version!==I.version){ne(K,I,A);return}t.bindTexture(s.TEXTURE_2D_ARRAY,K.__webglTexture,s.TEXTURE0+A)}function le(I,A){const K=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&K.__version!==I.version){ne(K,I,A);return}t.bindTexture(s.TEXTURE_3D,K.__webglTexture,s.TEXTURE0+A)}function W(I,A){const K=i.get(I);if(I.version>0&&K.__version!==I.version){pe(K,I,A);return}t.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture,s.TEXTURE0+A)}const fe={[rf]:s.REPEAT,[rs]:s.CLAMP_TO_EDGE,[sf]:s.MIRRORED_REPEAT},ce={[xi]:s.NEAREST,[hx]:s.NEAREST_MIPMAP_NEAREST,[Rl]:s.NEAREST_MIPMAP_LINEAR,[bi]:s.LINEAR,[sd]:s.LINEAR_MIPMAP_NEAREST,[ss]:s.LINEAR_MIPMAP_LINEAR},B={[vx]:s.NEVER,[Ex]:s.ALWAYS,[_x]:s.LESS,[xg]:s.LEQUAL,[xx]:s.EQUAL,[Mx]:s.GEQUAL,[yx]:s.GREATER,[Sx]:s.NOTEQUAL};function re(I,A){if(A.type===Ki&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===bi||A.magFilter===sd||A.magFilter===Rl||A.magFilter===ss||A.minFilter===bi||A.minFilter===sd||A.minFilter===Rl||A.minFilter===ss)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(I,s.TEXTURE_WRAP_S,fe[A.wrapS]),s.texParameteri(I,s.TEXTURE_WRAP_T,fe[A.wrapT]),(I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY)&&s.texParameteri(I,s.TEXTURE_WRAP_R,fe[A.wrapR]),s.texParameteri(I,s.TEXTURE_MAG_FILTER,ce[A.magFilter]),s.texParameteri(I,s.TEXTURE_MIN_FILTER,ce[A.minFilter]),A.compareFunction&&(s.texParameteri(I,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(I,s.TEXTURE_COMPARE_FUNC,B[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===xi||A.minFilter!==Rl&&A.minFilter!==ss||A.type===Ki&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const K=e.get("EXT_texture_filter_anisotropic");s.texParameterf(I,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,o.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function Be(I,A){let K=!1;I.__webglInit===void 0&&(I.__webglInit=!0,A.addEventListener("dispose",U));const ue=A.source;let xe=_.get(ue);xe===void 0&&(xe={},_.set(ue,xe));const he=de(A);if(he!==I.__cacheKey){xe[he]===void 0&&(xe[he]={texture:s.createTexture(),usedTimes:0},c.memory.textures++,K=!0),xe[he].usedTimes++;const Qe=xe[I.__cacheKey];Qe!==void 0&&(xe[I.__cacheKey].usedTimes--,Qe.usedTimes===0&&b(A)),I.__cacheKey=he,I.__webglTexture=xe[he].texture}return K}function Xe(I,A,K){return Math.floor(Math.floor(I/K)/A)}function qe(I,A,K,ue){const he=I.updateRanges;if(he.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,A.width,A.height,K,ue,A.data);else{he.sort((Ae,He)=>Ae.start-He.start);let Qe=0;for(let Ae=1;Ae<he.length;Ae++){const He=he[Qe],dt=he[Ae],nt=He.start+He.count,Oe=Xe(dt.start,A.width,4),vt=Xe(He.start,A.width,4);dt.start<=nt+1&&Oe===vt&&Xe(dt.start+dt.count-1,A.width,4)===Oe?He.count=Math.max(He.count,dt.start+dt.count-He.start):(++Qe,he[Qe]=dt)}he.length=Qe+1;const Pe=s.getParameter(s.UNPACK_ROW_LENGTH),Ye=s.getParameter(s.UNPACK_SKIP_PIXELS),et=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,A.width);for(let Ae=0,He=he.length;Ae<He;Ae++){const dt=he[Ae],nt=Math.floor(dt.start/4),Oe=Math.ceil(dt.count/4),vt=nt%A.width,j=Math.floor(nt/A.width),Re=Oe,De=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,vt),s.pixelStorei(s.UNPACK_SKIP_ROWS,j),t.texSubImage2D(s.TEXTURE_2D,0,vt,j,Re,De,K,ue,A.data)}I.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,Pe),s.pixelStorei(s.UNPACK_SKIP_PIXELS,Ye),s.pixelStorei(s.UNPACK_SKIP_ROWS,et)}}function ne(I,A,K){let ue=s.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ue=s.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ue=s.TEXTURE_3D);const xe=Be(I,A),he=A.source;t.bindTexture(ue,I.__webglTexture,s.TEXTURE0+K);const Qe=i.get(he);if(he.version!==Qe.__version||xe===!0){t.activeTexture(s.TEXTURE0+K);const Pe=Pt.getPrimaries(Pt.workingColorSpace),Ye=A.colorSpace===Ar?null:Pt.getPrimaries(A.colorSpace),et=A.colorSpace===Ar||Pe===Ye?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);let Ae=w(A.image,!1,o.maxTextureSize);Ae=ut(A,Ae);const He=a.convert(A.format,A.colorSpace),dt=a.convert(A.type);let nt=C(A.internalFormat,He,dt,A.colorSpace,A.isVideoTexture);re(ue,A);let Oe;const vt=A.mipmaps,j=A.isVideoTexture!==!0,Re=Qe.__version===void 0||xe===!0,De=he.dataReady,Ge=O(A,Ae);if(A.isDepthTexture)nt=E(A.format===fa,A.type),Re&&(j?t.texStorage2D(s.TEXTURE_2D,1,nt,Ae.width,Ae.height):t.texImage2D(s.TEXTURE_2D,0,nt,Ae.width,Ae.height,0,He,dt,null));else if(A.isDataTexture)if(vt.length>0){j&&Re&&t.texStorage2D(s.TEXTURE_2D,Ge,nt,vt[0].width,vt[0].height);for(let Ce=0,_e=vt.length;Ce<_e;Ce++)Oe=vt[Ce],j?De&&t.texSubImage2D(s.TEXTURE_2D,Ce,0,0,Oe.width,Oe.height,He,dt,Oe.data):t.texImage2D(s.TEXTURE_2D,Ce,nt,Oe.width,Oe.height,0,He,dt,Oe.data);A.generateMipmaps=!1}else j?(Re&&t.texStorage2D(s.TEXTURE_2D,Ge,nt,Ae.width,Ae.height),De&&qe(A,Ae,He,dt)):t.texImage2D(s.TEXTURE_2D,0,nt,Ae.width,Ae.height,0,He,dt,Ae.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){j&&Re&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ge,nt,vt[0].width,vt[0].height,Ae.depth);for(let Ce=0,_e=vt.length;Ce<_e;Ce++)if(Oe=vt[Ce],A.format!==_i)if(He!==null)if(j){if(De)if(A.layerUpdates.size>0){const Je=_0(Oe.width,Oe.height,A.format,A.type);for(const gt of A.layerUpdates){const Dt=Oe.data.subarray(gt*Je/Oe.data.BYTES_PER_ELEMENT,(gt+1)*Je/Oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Ce,0,0,gt,Oe.width,Oe.height,1,He,Dt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Ce,0,0,0,Oe.width,Oe.height,Ae.depth,He,Oe.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Ce,nt,Oe.width,Oe.height,Ae.depth,0,Oe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else j?De&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,Ce,0,0,0,Oe.width,Oe.height,Ae.depth,He,dt,Oe.data):t.texImage3D(s.TEXTURE_2D_ARRAY,Ce,nt,Oe.width,Oe.height,Ae.depth,0,He,dt,Oe.data)}else{j&&Re&&t.texStorage2D(s.TEXTURE_2D,Ge,nt,vt[0].width,vt[0].height);for(let Ce=0,_e=vt.length;Ce<_e;Ce++)Oe=vt[Ce],A.format!==_i?He!==null?j?De&&t.compressedTexSubImage2D(s.TEXTURE_2D,Ce,0,0,Oe.width,Oe.height,He,Oe.data):t.compressedTexImage2D(s.TEXTURE_2D,Ce,nt,Oe.width,Oe.height,0,Oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):j?De&&t.texSubImage2D(s.TEXTURE_2D,Ce,0,0,Oe.width,Oe.height,He,dt,Oe.data):t.texImage2D(s.TEXTURE_2D,Ce,nt,Oe.width,Oe.height,0,He,dt,Oe.data)}else if(A.isDataArrayTexture)if(j){if(Re&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ge,nt,Ae.width,Ae.height,Ae.depth),De)if(A.layerUpdates.size>0){const Ce=_0(Ae.width,Ae.height,A.format,A.type);for(const _e of A.layerUpdates){const Je=Ae.data.subarray(_e*Ce/Ae.data.BYTES_PER_ELEMENT,(_e+1)*Ce/Ae.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,_e,Ae.width,Ae.height,1,He,dt,Je)}A.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Ae.width,Ae.height,Ae.depth,He,dt,Ae.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,nt,Ae.width,Ae.height,Ae.depth,0,He,dt,Ae.data);else if(A.isData3DTexture)j?(Re&&t.texStorage3D(s.TEXTURE_3D,Ge,nt,Ae.width,Ae.height,Ae.depth),De&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Ae.width,Ae.height,Ae.depth,He,dt,Ae.data)):t.texImage3D(s.TEXTURE_3D,0,nt,Ae.width,Ae.height,Ae.depth,0,He,dt,Ae.data);else if(A.isFramebufferTexture){if(Re)if(j)t.texStorage2D(s.TEXTURE_2D,Ge,nt,Ae.width,Ae.height);else{let Ce=Ae.width,_e=Ae.height;for(let Je=0;Je<Ge;Je++)t.texImage2D(s.TEXTURE_2D,Je,nt,Ce,_e,0,He,dt,null),Ce>>=1,_e>>=1}}else if(vt.length>0){if(j&&Re){const Ce=ht(vt[0]);t.texStorage2D(s.TEXTURE_2D,Ge,nt,Ce.width,Ce.height)}for(let Ce=0,_e=vt.length;Ce<_e;Ce++)Oe=vt[Ce],j?De&&t.texSubImage2D(s.TEXTURE_2D,Ce,0,0,He,dt,Oe):t.texImage2D(s.TEXTURE_2D,Ce,nt,He,dt,Oe);A.generateMipmaps=!1}else if(j){if(Re){const Ce=ht(Ae);t.texStorage2D(s.TEXTURE_2D,Ge,nt,Ce.width,Ce.height)}De&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,He,dt,Ae)}else t.texImage2D(s.TEXTURE_2D,0,nt,He,dt,Ae);y(A)&&v(ue),Qe.__version=he.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function pe(I,A,K){if(A.image.length!==6)return;const ue=Be(I,A),xe=A.source;t.bindTexture(s.TEXTURE_CUBE_MAP,I.__webglTexture,s.TEXTURE0+K);const he=i.get(xe);if(xe.version!==he.__version||ue===!0){t.activeTexture(s.TEXTURE0+K);const Qe=Pt.getPrimaries(Pt.workingColorSpace),Pe=A.colorSpace===Ar?null:Pt.getPrimaries(A.colorSpace),Ye=A.colorSpace===Ar||Qe===Pe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);const et=A.isCompressedTexture||A.image[0].isCompressedTexture,Ae=A.image[0]&&A.image[0].isDataTexture,He=[];for(let _e=0;_e<6;_e++)!et&&!Ae?He[_e]=w(A.image[_e],!0,o.maxCubemapSize):He[_e]=Ae?A.image[_e].image:A.image[_e],He[_e]=ut(A,He[_e]);const dt=He[0],nt=a.convert(A.format,A.colorSpace),Oe=a.convert(A.type),vt=C(A.internalFormat,nt,Oe,A.colorSpace),j=A.isVideoTexture!==!0,Re=he.__version===void 0||ue===!0,De=xe.dataReady;let Ge=O(A,dt);re(s.TEXTURE_CUBE_MAP,A);let Ce;if(et){j&&Re&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Ge,vt,dt.width,dt.height);for(let _e=0;_e<6;_e++){Ce=He[_e].mipmaps;for(let Je=0;Je<Ce.length;Je++){const gt=Ce[Je];A.format!==_i?nt!==null?j?De&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Je,0,0,gt.width,gt.height,nt,gt.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Je,vt,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):j?De&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Je,0,0,gt.width,gt.height,nt,Oe,gt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Je,vt,gt.width,gt.height,0,nt,Oe,gt.data)}}}else{if(Ce=A.mipmaps,j&&Re){Ce.length>0&&Ge++;const _e=ht(He[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Ge,vt,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(Ae){j?De&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,He[_e].width,He[_e].height,nt,Oe,He[_e].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,vt,He[_e].width,He[_e].height,0,nt,Oe,He[_e].data);for(let Je=0;Je<Ce.length;Je++){const Dt=Ce[Je].image[_e].image;j?De&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Je+1,0,0,Dt.width,Dt.height,nt,Oe,Dt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Je+1,vt,Dt.width,Dt.height,0,nt,Oe,Dt.data)}}else{j?De&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,nt,Oe,He[_e]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,vt,nt,Oe,He[_e]);for(let Je=0;Je<Ce.length;Je++){const gt=Ce[Je];j?De&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Je+1,0,0,nt,Oe,gt.image[_e]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Je+1,vt,nt,Oe,gt.image[_e])}}}y(A)&&v(s.TEXTURE_CUBE_MAP),he.__version=xe.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function Te(I,A,K,ue,xe,he){const Qe=a.convert(K.format,K.colorSpace),Pe=a.convert(K.type),Ye=C(K.internalFormat,Qe,Pe,K.colorSpace),et=i.get(A),Ae=i.get(K);if(Ae.__renderTarget=A,!et.__hasExternalTextures){const He=Math.max(1,A.width>>he),dt=Math.max(1,A.height>>he);xe===s.TEXTURE_3D||xe===s.TEXTURE_2D_ARRAY?t.texImage3D(xe,he,Ye,He,dt,A.depth,0,Qe,Pe,null):t.texImage2D(xe,he,Ye,He,dt,0,Qe,Pe,null)}t.bindFramebuffer(s.FRAMEBUFFER,I),Ee(A)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ue,xe,Ae.__webglTexture,0,Ie(A)):(xe===s.TEXTURE_2D||xe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&xe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ue,xe,Ae.__webglTexture,he),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ue(I,A,K){if(s.bindRenderbuffer(s.RENDERBUFFER,I),A.depthBuffer){const ue=A.depthTexture,xe=ue&&ue.isDepthTexture?ue.type:null,he=E(A.stencilBuffer,xe),Qe=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Pe=Ie(A);Ee(A)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Pe,he,A.width,A.height):K?s.renderbufferStorageMultisample(s.RENDERBUFFER,Pe,he,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,he,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Qe,s.RENDERBUFFER,I)}else{const ue=A.textures;for(let xe=0;xe<ue.length;xe++){const he=ue[xe],Qe=a.convert(he.format,he.colorSpace),Pe=a.convert(he.type),Ye=C(he.internalFormat,Qe,Pe,he.colorSpace),et=Ie(A);K&&Ee(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,et,Ye,A.width,A.height):Ee(A)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,et,Ye,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,Ye,A.width,A.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ve(I,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,I),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ue=i.get(A.depthTexture);ue.__renderTarget=A,(!ue.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),se(A.depthTexture,0);const xe=ue.__webglTexture,he=Ie(A);if(A.depthTexture.format===da)Ee(A)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0);else if(A.depthTexture.format===fa)Ee(A)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0);else throw new Error("Unknown depthTexture format")}function _t(I){const A=i.get(I),K=I.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==I.depthTexture){const ue=I.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ue){const xe=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ue.removeEventListener("dispose",xe)};ue.addEventListener("dispose",xe),A.__depthDisposeCallback=xe}A.__boundDepthTexture=ue}if(I.depthTexture&&!A.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");const ue=I.texture.mipmaps;ue&&ue.length>0?Ve(A.__webglFramebuffer[0],I):Ve(A.__webglFramebuffer,I)}else if(K){A.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[ue]),A.__webglDepthbuffer[ue]===void 0)A.__webglDepthbuffer[ue]=s.createRenderbuffer(),Ue(A.__webglDepthbuffer[ue],I,!1);else{const xe=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=A.__webglDepthbuffer[ue];s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,xe,s.RENDERBUFFER,he)}}else{const ue=I.texture.mipmaps;if(ue&&ue.length>0?t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=s.createRenderbuffer(),Ue(A.__webglDepthbuffer,I,!1);else{const xe=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=A.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,xe,s.RENDERBUFFER,he)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Nt(I,A,K){const ue=i.get(I);A!==void 0&&Te(ue.__webglFramebuffer,I,I.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),K!==void 0&&_t(I)}function z(I){const A=I.texture,K=i.get(I),ue=i.get(A);I.addEventListener("dispose",F);const xe=I.textures,he=I.isWebGLCubeRenderTarget===!0,Qe=xe.length>1;if(Qe||(ue.__webglTexture===void 0&&(ue.__webglTexture=s.createTexture()),ue.__version=A.version,c.memory.textures++),he){K.__webglFramebuffer=[];for(let Pe=0;Pe<6;Pe++)if(A.mipmaps&&A.mipmaps.length>0){K.__webglFramebuffer[Pe]=[];for(let Ye=0;Ye<A.mipmaps.length;Ye++)K.__webglFramebuffer[Pe][Ye]=s.createFramebuffer()}else K.__webglFramebuffer[Pe]=s.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){K.__webglFramebuffer=[];for(let Pe=0;Pe<A.mipmaps.length;Pe++)K.__webglFramebuffer[Pe]=s.createFramebuffer()}else K.__webglFramebuffer=s.createFramebuffer();if(Qe)for(let Pe=0,Ye=xe.length;Pe<Ye;Pe++){const et=i.get(xe[Pe]);et.__webglTexture===void 0&&(et.__webglTexture=s.createTexture(),c.memory.textures++)}if(I.samples>0&&Ee(I)===!1){K.__webglMultisampledFramebuffer=s.createFramebuffer(),K.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let Pe=0;Pe<xe.length;Pe++){const Ye=xe[Pe];K.__webglColorRenderbuffer[Pe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,K.__webglColorRenderbuffer[Pe]);const et=a.convert(Ye.format,Ye.colorSpace),Ae=a.convert(Ye.type),He=C(Ye.internalFormat,et,Ae,Ye.colorSpace,I.isXRRenderTarget===!0),dt=Ie(I);s.renderbufferStorageMultisample(s.RENDERBUFFER,dt,He,I.width,I.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.RENDERBUFFER,K.__webglColorRenderbuffer[Pe])}s.bindRenderbuffer(s.RENDERBUFFER,null),I.depthBuffer&&(K.__webglDepthRenderbuffer=s.createRenderbuffer(),Ue(K.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(he){t.bindTexture(s.TEXTURE_CUBE_MAP,ue.__webglTexture),re(s.TEXTURE_CUBE_MAP,A);for(let Pe=0;Pe<6;Pe++)if(A.mipmaps&&A.mipmaps.length>0)for(let Ye=0;Ye<A.mipmaps.length;Ye++)Te(K.__webglFramebuffer[Pe][Ye],I,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,Ye);else Te(K.__webglFramebuffer[Pe],I,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0);y(A)&&v(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Qe){for(let Pe=0,Ye=xe.length;Pe<Ye;Pe++){const et=xe[Pe],Ae=i.get(et);let He=s.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(He=I.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(He,Ae.__webglTexture),re(He,et),Te(K.__webglFramebuffer,I,et,s.COLOR_ATTACHMENT0+Pe,He,0),y(et)&&v(He)}t.unbindTexture()}else{let Pe=s.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Pe=I.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Pe,ue.__webglTexture),re(Pe,A),A.mipmaps&&A.mipmaps.length>0)for(let Ye=0;Ye<A.mipmaps.length;Ye++)Te(K.__webglFramebuffer[Ye],I,A,s.COLOR_ATTACHMENT0,Pe,Ye);else Te(K.__webglFramebuffer,I,A,s.COLOR_ATTACHMENT0,Pe,0);y(A)&&v(Pe),t.unbindTexture()}I.depthBuffer&&_t(I)}function ye(I){const A=I.textures;for(let K=0,ue=A.length;K<ue;K++){const xe=A[K];if(y(xe)){const he=P(I),Qe=i.get(xe).__webglTexture;t.bindTexture(he,Qe),v(he),t.unbindTexture()}}}const ve=[],ge=[];function me(I){if(I.samples>0){if(Ee(I)===!1){const A=I.textures,K=I.width,ue=I.height;let xe=s.COLOR_BUFFER_BIT;const he=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Qe=i.get(I),Pe=A.length>1;if(Pe)for(let et=0;et<A.length;et++)t.bindFramebuffer(s.FRAMEBUFFER,Qe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+et,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Qe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+et,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Qe.__webglMultisampledFramebuffer);const Ye=I.texture.mipmaps;Ye&&Ye.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Qe.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Qe.__webglFramebuffer);for(let et=0;et<A.length;et++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(xe|=s.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(xe|=s.STENCIL_BUFFER_BIT)),Pe){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Qe.__webglColorRenderbuffer[et]);const Ae=i.get(A[et]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ae,0)}s.blitFramebuffer(0,0,K,ue,0,0,K,ue,xe,s.NEAREST),f===!0&&(ve.length=0,ge.length=0,ve.push(s.COLOR_ATTACHMENT0+et),I.depthBuffer&&I.resolveDepthBuffer===!1&&(ve.push(he),ge.push(he),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ge)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ve))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Pe)for(let et=0;et<A.length;et++){t.bindFramebuffer(s.FRAMEBUFFER,Qe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+et,s.RENDERBUFFER,Qe.__webglColorRenderbuffer[et]);const Ae=i.get(A[et]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Qe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+et,s.TEXTURE_2D,Ae,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Qe.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&f){const A=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[A])}}}function Ie(I){return Math.min(o.maxSamples,I.samples)}function Ee(I){const A=i.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ne(I){const A=c.render.frame;m.get(I)!==A&&(m.set(I,A),I.update())}function ut(I,A){const K=I.colorSpace,ue=I.format,xe=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||K!==co&&K!==Ar&&(Pt.getTransfer(K)===Ft?(ue!==_i||xe!==Ni)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),A}function ht(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(h.width=I.naturalWidth||I.width,h.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(h.width=I.displayWidth,h.height=I.displayHeight):(h.width=I.width,h.height=I.height),h}this.allocateTextureUnit=ee,this.resetTextureUnits=Y,this.setTexture2D=se,this.setTexture2DArray=te,this.setTexture3D=le,this.setTextureCube=W,this.rebindTextures=Nt,this.setupRenderTarget=z,this.updateRenderTargetMipmap=ye,this.updateMultisampleRenderTarget=me,this.setupDepthRenderbuffer=_t,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=Ee}function Lw(s,e){function t(i,o=Ar){let a;const c=Pt.getTransfer(o);if(i===Ni)return s.UNSIGNED_BYTE;if(i===Hf)return s.UNSIGNED_SHORT_4_4_4_4;if(i===Gf)return s.UNSIGNED_SHORT_5_5_5_1;if(i===fg)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===hg)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===ug)return s.BYTE;if(i===dg)return s.SHORT;if(i===ca)return s.UNSIGNED_SHORT;if(i===Vf)return s.INT;if(i===os)return s.UNSIGNED_INT;if(i===Ki)return s.FLOAT;if(i===xa)return s.HALF_FLOAT;if(i===pg)return s.ALPHA;if(i===mg)return s.RGB;if(i===_i)return s.RGBA;if(i===da)return s.DEPTH_COMPONENT;if(i===fa)return s.DEPTH_STENCIL;if(i===gg)return s.RED;if(i===Wf)return s.RED_INTEGER;if(i===vg)return s.RG;if(i===jf)return s.RG_INTEGER;if(i===Xf)return s.RGBA_INTEGER;if(i===ic||i===rc||i===sc||i===oc)if(c===Ft)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===ic)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===rc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===sc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===oc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===ic)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===rc)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===sc)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===oc)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===of||i===af||i===lf||i===cf)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===of)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===af)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===lf)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===cf)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===uf||i===df||i===ff)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===uf||i===df)return c===Ft?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===ff)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===hf||i===pf||i===mf||i===gf||i===vf||i===_f||i===xf||i===yf||i===Sf||i===Mf||i===Ef||i===wf||i===Tf||i===Af)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===hf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===pf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===mf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===gf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===vf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===_f)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===xf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===yf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Sf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Mf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ef)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===wf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Tf)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Af)return c===Ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Cf||i===Rf||i===bf)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===Cf)return c===Ft?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Rf)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===bf)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Pf||i===Lf||i===Nf||i===Df)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===Pf)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Lf)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Nf)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Df)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ua?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const Nw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Dw=`
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

}`;class Iw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Lg(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Pr({vertexShader:Nw,fragmentShader:Dw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Yt(new cs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Uw extends ho{constructor(e,t){super();const i=this;let o=null,a=1,c=null,d="local-floor",f=1,h=null,m=null,x=null,_=null,S=null,M=null;const w=typeof XRWebGLBinding<"u",y=new Iw,v={},P=t.getContextAttributes();let C=null,E=null;const O=[],U=[],F=new Fe;let V=null;const b=new Jn;b.viewport=new Ot;const R=new Jn;R.viewport=new Ot;const H=[b,R],Y=new n1;let ee=null,de=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let pe=O[ne];return pe===void 0&&(pe=new Ad,O[ne]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(ne){let pe=O[ne];return pe===void 0&&(pe=new Ad,O[ne]=pe),pe.getGripSpace()},this.getHand=function(ne){let pe=O[ne];return pe===void 0&&(pe=new Ad,O[ne]=pe),pe.getHandSpace()};function se(ne){const pe=U.indexOf(ne.inputSource);if(pe===-1)return;const Te=O[pe];Te!==void 0&&(Te.update(ne.inputSource,ne.frame,h||c),Te.dispatchEvent({type:ne.type,data:ne.inputSource}))}function te(){o.removeEventListener("select",se),o.removeEventListener("selectstart",se),o.removeEventListener("selectend",se),o.removeEventListener("squeeze",se),o.removeEventListener("squeezestart",se),o.removeEventListener("squeezeend",se),o.removeEventListener("end",te),o.removeEventListener("inputsourceschange",le);for(let ne=0;ne<O.length;ne++){const pe=U[ne];pe!==null&&(U[ne]=null,O[ne].disconnect(pe))}ee=null,de=null,y.reset();for(const ne in v)delete v[ne];e.setRenderTarget(C),S=null,_=null,x=null,o=null,E=null,qe.stop(),i.isPresenting=!1,e.setPixelRatio(V),e.setSize(F.width,F.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ne){a=ne,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){d=ne,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||c},this.setReferenceSpace=function(ne){h=ne},this.getBaseLayer=function(){return _!==null?_:S},this.getBinding=function(){return x===null&&w&&(x=new XRWebGLBinding(o,t)),x},this.getFrame=function(){return M},this.getSession=function(){return o},this.setSession=async function(ne){if(o=ne,o!==null){if(C=e.getRenderTarget(),o.addEventListener("select",se),o.addEventListener("selectstart",se),o.addEventListener("selectend",se),o.addEventListener("squeeze",se),o.addEventListener("squeezestart",se),o.addEventListener("squeezeend",se),o.addEventListener("end",te),o.addEventListener("inputsourceschange",le),P.xrCompatible!==!0&&await t.makeXRCompatible(),V=e.getPixelRatio(),e.getSize(F),w&&"createProjectionLayer"in XRWebGLBinding.prototype){let Te=null,Ue=null,Ve=null;P.depth&&(Ve=P.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Te=P.stencil?fa:da,Ue=P.stencil?ua:os);const _t={colorFormat:t.RGBA8,depthFormat:Ve,scaleFactor:a};x=this.getBinding(),_=x.createProjectionLayer(_t),o.updateRenderState({layers:[_]}),e.setPixelRatio(1),e.setSize(_.textureWidth,_.textureHeight,!1),E=new as(_.textureWidth,_.textureHeight,{format:_i,type:Ni,depthTexture:new Pg(_.textureWidth,_.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,Te),stencilBuffer:P.stencil,colorSpace:e.outputColorSpace,samples:P.antialias?4:0,resolveDepthBuffer:_.ignoreDepthValues===!1,resolveStencilBuffer:_.ignoreDepthValues===!1})}else{const Te={antialias:P.antialias,alpha:!0,depth:P.depth,stencil:P.stencil,framebufferScaleFactor:a};S=new XRWebGLLayer(o,t,Te),o.updateRenderState({baseLayer:S}),e.setPixelRatio(1),e.setSize(S.framebufferWidth,S.framebufferHeight,!1),E=new as(S.framebufferWidth,S.framebufferHeight,{format:_i,type:Ni,colorSpace:e.outputColorSpace,stencilBuffer:P.stencil,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(f),h=null,c=await o.requestReferenceSpace(d),qe.setContext(o),qe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function le(ne){for(let pe=0;pe<ne.removed.length;pe++){const Te=ne.removed[pe],Ue=U.indexOf(Te);Ue>=0&&(U[Ue]=null,O[Ue].disconnect(Te))}for(let pe=0;pe<ne.added.length;pe++){const Te=ne.added[pe];let Ue=U.indexOf(Te);if(Ue===-1){for(let _t=0;_t<O.length;_t++)if(_t>=U.length){U.push(Te),Ue=_t;break}else if(U[_t]===null){U[_t]=Te,Ue=_t;break}if(Ue===-1)break}const Ve=O[Ue];Ve&&Ve.connect(Te)}}const W=new D,fe=new D;function ce(ne,pe,Te){W.setFromMatrixPosition(pe.matrixWorld),fe.setFromMatrixPosition(Te.matrixWorld);const Ue=W.distanceTo(fe),Ve=pe.projectionMatrix.elements,_t=Te.projectionMatrix.elements,Nt=Ve[14]/(Ve[10]-1),z=Ve[14]/(Ve[10]+1),ye=(Ve[9]+1)/Ve[5],ve=(Ve[9]-1)/Ve[5],ge=(Ve[8]-1)/Ve[0],me=(_t[8]+1)/_t[0],Ie=Nt*ge,Ee=Nt*me,Ne=Ue/(-ge+me),ut=Ne*-ge;if(pe.matrixWorld.decompose(ne.position,ne.quaternion,ne.scale),ne.translateX(ut),ne.translateZ(Ne),ne.matrixWorld.compose(ne.position,ne.quaternion,ne.scale),ne.matrixWorldInverse.copy(ne.matrixWorld).invert(),Ve[10]===-1)ne.projectionMatrix.copy(pe.projectionMatrix),ne.projectionMatrixInverse.copy(pe.projectionMatrixInverse);else{const ht=Nt+Ne,I=z+Ne,A=Ie-ut,K=Ee+(Ue-ut),ue=ye*z/I*ht,xe=ve*z/I*ht;ne.projectionMatrix.makePerspective(A,K,ue,xe,ht,I),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert()}}function B(ne,pe){pe===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(pe.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(o===null)return;let pe=ne.near,Te=ne.far;y.texture!==null&&(y.depthNear>0&&(pe=y.depthNear),y.depthFar>0&&(Te=y.depthFar)),Y.near=R.near=b.near=pe,Y.far=R.far=b.far=Te,(ee!==Y.near||de!==Y.far)&&(o.updateRenderState({depthNear:Y.near,depthFar:Y.far}),ee=Y.near,de=Y.far),Y.layers.mask=ne.layers.mask|6,b.layers.mask=Y.layers.mask&3,R.layers.mask=Y.layers.mask&5;const Ue=ne.parent,Ve=Y.cameras;B(Y,Ue);for(let _t=0;_t<Ve.length;_t++)B(Ve[_t],Ue);Ve.length===2?ce(Y,b,R):Y.projectionMatrix.copy(b.projectionMatrix),re(ne,Y,Ue)};function re(ne,pe,Te){Te===null?ne.matrix.copy(pe.matrixWorld):(ne.matrix.copy(Te.matrixWorld),ne.matrix.invert(),ne.matrix.multiply(pe.matrixWorld)),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.updateMatrixWorld(!0),ne.projectionMatrix.copy(pe.projectionMatrix),ne.projectionMatrixInverse.copy(pe.projectionMatrixInverse),ne.isPerspectiveCamera&&(ne.fov=ha*2*Math.atan(1/ne.projectionMatrix.elements[5]),ne.zoom=1)}this.getCamera=function(){return Y},this.getFoveation=function(){if(!(_===null&&S===null))return f},this.setFoveation=function(ne){f=ne,_!==null&&(_.fixedFoveation=ne),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=ne)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(Y)},this.getCameraTexture=function(ne){return v[ne]};let Be=null;function Xe(ne,pe){if(m=pe.getViewerPose(h||c),M=pe,m!==null){const Te=m.views;S!==null&&(e.setRenderTargetFramebuffer(E,S.framebuffer),e.setRenderTarget(E));let Ue=!1;Te.length!==Y.cameras.length&&(Y.cameras.length=0,Ue=!0);for(let z=0;z<Te.length;z++){const ye=Te[z];let ve=null;if(S!==null)ve=S.getViewport(ye);else{const me=x.getViewSubImage(_,ye);ve=me.viewport,z===0&&(e.setRenderTargetTextures(E,me.colorTexture,me.depthStencilTexture),e.setRenderTarget(E))}let ge=H[z];ge===void 0&&(ge=new Jn,ge.layers.enable(z),ge.viewport=new Ot,H[z]=ge),ge.matrix.fromArray(ye.transform.matrix),ge.matrix.decompose(ge.position,ge.quaternion,ge.scale),ge.projectionMatrix.fromArray(ye.projectionMatrix),ge.projectionMatrixInverse.copy(ge.projectionMatrix).invert(),ge.viewport.set(ve.x,ve.y,ve.width,ve.height),z===0&&(Y.matrix.copy(ge.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale)),Ue===!0&&Y.cameras.push(ge)}const Ve=o.enabledFeatures;if(Ve&&Ve.includes("depth-sensing")&&o.depthUsage=="gpu-optimized"&&w){x=i.getBinding();const z=x.getDepthInformation(Te[0]);z&&z.isValid&&z.texture&&y.init(z,o.renderState)}if(Ve&&Ve.includes("camera-access")&&w){e.state.unbindTexture(),x=i.getBinding();for(let z=0;z<Te.length;z++){const ye=Te[z].camera;if(ye){let ve=v[ye];ve||(ve=new Lg,v[ye]=ve);const ge=x.getCameraImage(ye);ve.sourceTexture=ge}}}}for(let Te=0;Te<O.length;Te++){const Ue=U[Te],Ve=O[Te];Ue!==null&&Ve!==void 0&&Ve.update(Ue,pe,h||c)}Be&&Be(ne,pe),pe.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:pe}),M=null}const qe=new Wg;qe.setAnimationLoop(Xe),this.setAnimationLoop=function(ne){Be=ne},this.dispose=function(){}}}const Zr=new yi,Fw=new jt;function Ow(s,e){function t(y,v){y.matrixAutoUpdate===!0&&y.updateMatrix(),v.value.copy(y.matrix)}function i(y,v){v.color.getRGB(y.fogColor.value,Ag(s)),v.isFog?(y.fogNear.value=v.near,y.fogFar.value=v.far):v.isFogExp2&&(y.fogDensity.value=v.density)}function o(y,v,P,C,E){v.isMeshBasicMaterial||v.isMeshLambertMaterial?a(y,v):v.isMeshToonMaterial?(a(y,v),x(y,v)):v.isMeshPhongMaterial?(a(y,v),m(y,v)):v.isMeshStandardMaterial?(a(y,v),_(y,v),v.isMeshPhysicalMaterial&&S(y,v,E)):v.isMeshMatcapMaterial?(a(y,v),M(y,v)):v.isMeshDepthMaterial?a(y,v):v.isMeshDistanceMaterial?(a(y,v),w(y,v)):v.isMeshNormalMaterial?a(y,v):v.isLineBasicMaterial?(c(y,v),v.isLineDashedMaterial&&d(y,v)):v.isPointsMaterial?f(y,v,P,C):v.isSpriteMaterial?h(y,v):v.isShadowMaterial?(y.color.value.copy(v.color),y.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function a(y,v){y.opacity.value=v.opacity,v.color&&y.diffuse.value.copy(v.color),v.emissive&&y.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(y.map.value=v.map,t(v.map,y.mapTransform)),v.alphaMap&&(y.alphaMap.value=v.alphaMap,t(v.alphaMap,y.alphaMapTransform)),v.bumpMap&&(y.bumpMap.value=v.bumpMap,t(v.bumpMap,y.bumpMapTransform),y.bumpScale.value=v.bumpScale,v.side===Gn&&(y.bumpScale.value*=-1)),v.normalMap&&(y.normalMap.value=v.normalMap,t(v.normalMap,y.normalMapTransform),y.normalScale.value.copy(v.normalScale),v.side===Gn&&y.normalScale.value.negate()),v.displacementMap&&(y.displacementMap.value=v.displacementMap,t(v.displacementMap,y.displacementMapTransform),y.displacementScale.value=v.displacementScale,y.displacementBias.value=v.displacementBias),v.emissiveMap&&(y.emissiveMap.value=v.emissiveMap,t(v.emissiveMap,y.emissiveMapTransform)),v.specularMap&&(y.specularMap.value=v.specularMap,t(v.specularMap,y.specularMapTransform)),v.alphaTest>0&&(y.alphaTest.value=v.alphaTest);const P=e.get(v),C=P.envMap,E=P.envMapRotation;C&&(y.envMap.value=C,Zr.copy(E),Zr.x*=-1,Zr.y*=-1,Zr.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Zr.y*=-1,Zr.z*=-1),y.envMapRotation.value.setFromMatrix4(Fw.makeRotationFromEuler(Zr)),y.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,y.reflectivity.value=v.reflectivity,y.ior.value=v.ior,y.refractionRatio.value=v.refractionRatio),v.lightMap&&(y.lightMap.value=v.lightMap,y.lightMapIntensity.value=v.lightMapIntensity,t(v.lightMap,y.lightMapTransform)),v.aoMap&&(y.aoMap.value=v.aoMap,y.aoMapIntensity.value=v.aoMapIntensity,t(v.aoMap,y.aoMapTransform))}function c(y,v){y.diffuse.value.copy(v.color),y.opacity.value=v.opacity,v.map&&(y.map.value=v.map,t(v.map,y.mapTransform))}function d(y,v){y.dashSize.value=v.dashSize,y.totalSize.value=v.dashSize+v.gapSize,y.scale.value=v.scale}function f(y,v,P,C){y.diffuse.value.copy(v.color),y.opacity.value=v.opacity,y.size.value=v.size*P,y.scale.value=C*.5,v.map&&(y.map.value=v.map,t(v.map,y.uvTransform)),v.alphaMap&&(y.alphaMap.value=v.alphaMap,t(v.alphaMap,y.alphaMapTransform)),v.alphaTest>0&&(y.alphaTest.value=v.alphaTest)}function h(y,v){y.diffuse.value.copy(v.color),y.opacity.value=v.opacity,y.rotation.value=v.rotation,v.map&&(y.map.value=v.map,t(v.map,y.mapTransform)),v.alphaMap&&(y.alphaMap.value=v.alphaMap,t(v.alphaMap,y.alphaMapTransform)),v.alphaTest>0&&(y.alphaTest.value=v.alphaTest)}function m(y,v){y.specular.value.copy(v.specular),y.shininess.value=Math.max(v.shininess,1e-4)}function x(y,v){v.gradientMap&&(y.gradientMap.value=v.gradientMap)}function _(y,v){y.metalness.value=v.metalness,v.metalnessMap&&(y.metalnessMap.value=v.metalnessMap,t(v.metalnessMap,y.metalnessMapTransform)),y.roughness.value=v.roughness,v.roughnessMap&&(y.roughnessMap.value=v.roughnessMap,t(v.roughnessMap,y.roughnessMapTransform)),v.envMap&&(y.envMapIntensity.value=v.envMapIntensity)}function S(y,v,P){y.ior.value=v.ior,v.sheen>0&&(y.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),y.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(y.sheenColorMap.value=v.sheenColorMap,t(v.sheenColorMap,y.sheenColorMapTransform)),v.sheenRoughnessMap&&(y.sheenRoughnessMap.value=v.sheenRoughnessMap,t(v.sheenRoughnessMap,y.sheenRoughnessMapTransform))),v.clearcoat>0&&(y.clearcoat.value=v.clearcoat,y.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(y.clearcoatMap.value=v.clearcoatMap,t(v.clearcoatMap,y.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,t(v.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(y.clearcoatNormalMap.value=v.clearcoatNormalMap,t(v.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Gn&&y.clearcoatNormalScale.value.negate())),v.dispersion>0&&(y.dispersion.value=v.dispersion),v.iridescence>0&&(y.iridescence.value=v.iridescence,y.iridescenceIOR.value=v.iridescenceIOR,y.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(y.iridescenceMap.value=v.iridescenceMap,t(v.iridescenceMap,y.iridescenceMapTransform)),v.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=v.iridescenceThicknessMap,t(v.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),v.transmission>0&&(y.transmission.value=v.transmission,y.transmissionSamplerMap.value=P.texture,y.transmissionSamplerSize.value.set(P.width,P.height),v.transmissionMap&&(y.transmissionMap.value=v.transmissionMap,t(v.transmissionMap,y.transmissionMapTransform)),y.thickness.value=v.thickness,v.thicknessMap&&(y.thicknessMap.value=v.thicknessMap,t(v.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=v.attenuationDistance,y.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(y.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(y.anisotropyMap.value=v.anisotropyMap,t(v.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=v.specularIntensity,y.specularColor.value.copy(v.specularColor),v.specularColorMap&&(y.specularColorMap.value=v.specularColorMap,t(v.specularColorMap,y.specularColorMapTransform)),v.specularIntensityMap&&(y.specularIntensityMap.value=v.specularIntensityMap,t(v.specularIntensityMap,y.specularIntensityMapTransform))}function M(y,v){v.matcap&&(y.matcap.value=v.matcap)}function w(y,v){const P=e.get(v).light;y.referencePosition.value.setFromMatrixPosition(P.matrixWorld),y.nearDistance.value=P.shadow.camera.near,y.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:o}}function kw(s,e,t,i){let o={},a={},c=[];const d=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function f(P,C){const E=C.program;i.uniformBlockBinding(P,E)}function h(P,C){let E=o[P.id];E===void 0&&(M(P),E=m(P),o[P.id]=E,P.addEventListener("dispose",y));const O=C.program;i.updateUBOMapping(P,O);const U=e.render.frame;a[P.id]!==U&&(_(P),a[P.id]=U)}function m(P){const C=x();P.__bindingPointIndex=C;const E=s.createBuffer(),O=P.__size,U=P.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,O,U),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,C,E),E}function x(){for(let P=0;P<d;P++)if(c.indexOf(P)===-1)return c.push(P),P;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function _(P){const C=o[P.id],E=P.uniforms,O=P.__cache;s.bindBuffer(s.UNIFORM_BUFFER,C);for(let U=0,F=E.length;U<F;U++){const V=Array.isArray(E[U])?E[U]:[E[U]];for(let b=0,R=V.length;b<R;b++){const H=V[b];if(S(H,U,b,O)===!0){const Y=H.__offset,ee=Array.isArray(H.value)?H.value:[H.value];let de=0;for(let se=0;se<ee.length;se++){const te=ee[se],le=w(te);typeof te=="number"||typeof te=="boolean"?(H.__data[0]=te,s.bufferSubData(s.UNIFORM_BUFFER,Y+de,H.__data)):te.isMatrix3?(H.__data[0]=te.elements[0],H.__data[1]=te.elements[1],H.__data[2]=te.elements[2],H.__data[3]=0,H.__data[4]=te.elements[3],H.__data[5]=te.elements[4],H.__data[6]=te.elements[5],H.__data[7]=0,H.__data[8]=te.elements[6],H.__data[9]=te.elements[7],H.__data[10]=te.elements[8],H.__data[11]=0):(te.toArray(H.__data,de),de+=le.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,Y,H.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function S(P,C,E,O){const U=P.value,F=C+"_"+E;if(O[F]===void 0)return typeof U=="number"||typeof U=="boolean"?O[F]=U:O[F]=U.clone(),!0;{const V=O[F];if(typeof U=="number"||typeof U=="boolean"){if(V!==U)return O[F]=U,!0}else if(V.equals(U)===!1)return V.copy(U),!0}return!1}function M(P){const C=P.uniforms;let E=0;const O=16;for(let F=0,V=C.length;F<V;F++){const b=Array.isArray(C[F])?C[F]:[C[F]];for(let R=0,H=b.length;R<H;R++){const Y=b[R],ee=Array.isArray(Y.value)?Y.value:[Y.value];for(let de=0,se=ee.length;de<se;de++){const te=ee[de],le=w(te),W=E%O,fe=W%le.boundary,ce=W+fe;E+=fe,ce!==0&&O-ce<le.storage&&(E+=O-ce),Y.__data=new Float32Array(le.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=E,E+=le.storage}}}const U=E%O;return U>0&&(E+=O-U),P.__size=E,P.__cache={},this}function w(P){const C={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(C.boundary=4,C.storage=4):P.isVector2?(C.boundary=8,C.storage=8):P.isVector3||P.isColor?(C.boundary=16,C.storage=12):P.isVector4?(C.boundary=16,C.storage=16):P.isMatrix3?(C.boundary=48,C.storage=48):P.isMatrix4?(C.boundary=64,C.storage=64):P.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",P),C}function y(P){const C=P.target;C.removeEventListener("dispose",y);const E=c.indexOf(C.__bindingPointIndex);c.splice(E,1),s.deleteBuffer(o[C.id]),delete o[C.id],delete a[C.id]}function v(){for(const P in o)s.deleteBuffer(o[P]);c=[],o={},a={}}return{bind:f,update:h,dispose:v}}class zw{constructor(e={}){const{canvas:t=Bx(),context:i=null,depth:o=!0,stencil:a=!1,alpha:c=!1,antialias:d=!1,premultipliedAlpha:f=!0,preserveDrawingBuffer:h=!1,powerPreference:m="default",failIfMajorPerformanceCaveat:x=!1,reversedDepthBuffer:_=!1}=e;this.isWebGLRenderer=!0;let S;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");S=i.getContextAttributes().alpha}else S=c;const M=new Uint32Array(4),w=new Int32Array(4);let y=null,v=null;const P=[],C=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Rr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let O=!1;this._outputColorSpace=Hn;let U=0,F=0,V=null,b=-1,R=null;const H=new Ot,Y=new Ot;let ee=null;const de=new Tt(0);let se=0,te=t.width,le=t.height,W=1,fe=null,ce=null;const B=new Ot(0,0,te,le),re=new Ot(0,0,te,le);let Be=!1;const Xe=new Kf;let qe=!1,ne=!1;const pe=new jt,Te=new D,Ue=new Ot,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let _t=!1;function Nt(){return V===null?W:1}let z=i;function ye(L,$){return t.getContext(L,$)}try{const L={alpha:!0,depth:o,stencil:a,antialias:d,premultipliedAlpha:f,preserveDrawingBuffer:h,powerPreference:m,failIfMajorPerformanceCaveat:x};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Bf}`),t.addEventListener("webglcontextlost",De,!1),t.addEventListener("webglcontextrestored",Ge,!1),t.addEventListener("webglcontextcreationerror",Ce,!1),z===null){const $="webgl2";if(z=ye($,L),z===null)throw ye($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let ve,ge,me,Ie,Ee,Ne,ut,ht,I,A,K,ue,xe,he,Qe,Pe,Ye,et,Ae,He,dt,nt,Oe,vt;function j(){ve=new $M(z),ve.init(),nt=new Lw(z,ve),ge=new HM(z,ve,e,nt),me=new bw(z,ve),ge.reversedDepthBuffer&&_&&me.buffers.depth.setReversed(!0),Ie=new JM(z),Ee=new gw,Ne=new Pw(z,ve,me,Ee,ge,nt,Ie),ut=new WM(E),ht=new YM(E),I=new r1(z),Oe=new BM(z,I),A=new KM(z,I,Ie,Oe),K=new eE(z,A,I,Ie),Ae=new QM(z,ge,Ne),Pe=new GM(Ee),ue=new mw(E,ut,ht,ve,ge,Oe,Pe),xe=new Ow(E,Ee),he=new _w,Qe=new ww(ve),et=new zM(E,ut,ht,me,K,S,f),Ye=new Cw(E,K,ge),vt=new kw(z,Ie,ge,me),He=new VM(z,ve,Ie),dt=new ZM(z,ve,Ie),Ie.programs=ue.programs,E.capabilities=ge,E.extensions=ve,E.properties=Ee,E.renderLists=he,E.shadowMap=Ye,E.state=me,E.info=Ie}j();const Re=new Uw(E,z);this.xr=Re,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const L=ve.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=ve.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(L){L!==void 0&&(W=L,this.setSize(te,le,!1))},this.getSize=function(L){return L.set(te,le)},this.setSize=function(L,$,oe=!0){if(Re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}te=L,le=$,t.width=Math.floor(L*W),t.height=Math.floor($*W),oe===!0&&(t.style.width=L+"px",t.style.height=$+"px"),this.setViewport(0,0,L,$)},this.getDrawingBufferSize=function(L){return L.set(te*W,le*W).floor()},this.setDrawingBufferSize=function(L,$,oe){te=L,le=$,W=oe,t.width=Math.floor(L*oe),t.height=Math.floor($*oe),this.setViewport(0,0,L,$)},this.getCurrentViewport=function(L){return L.copy(H)},this.getViewport=function(L){return L.copy(B)},this.setViewport=function(L,$,oe,ae){L.isVector4?B.set(L.x,L.y,L.z,L.w):B.set(L,$,oe,ae),me.viewport(H.copy(B).multiplyScalar(W).round())},this.getScissor=function(L){return L.copy(re)},this.setScissor=function(L,$,oe,ae){L.isVector4?re.set(L.x,L.y,L.z,L.w):re.set(L,$,oe,ae),me.scissor(Y.copy(re).multiplyScalar(W).round())},this.getScissorTest=function(){return Be},this.setScissorTest=function(L){me.setScissorTest(Be=L)},this.setOpaqueSort=function(L){fe=L},this.setTransparentSort=function(L){ce=L},this.getClearColor=function(L){return L.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor(...arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha(...arguments)},this.clear=function(L=!0,$=!0,oe=!0){let ae=0;if(L){let q=!1;if(V!==null){const be=V.texture.format;q=be===Xf||be===jf||be===Wf}if(q){const be=V.texture.type,ke=be===Ni||be===os||be===ca||be===ua||be===Hf||be===Gf,Ke=et.getClearColor(),We=et.getClearAlpha(),ct=Ke.r,ft=Ke.g,rt=Ke.b;ke?(M[0]=ct,M[1]=ft,M[2]=rt,M[3]=We,z.clearBufferuiv(z.COLOR,0,M)):(w[0]=ct,w[1]=ft,w[2]=rt,w[3]=We,z.clearBufferiv(z.COLOR,0,w))}else ae|=z.COLOR_BUFFER_BIT}$&&(ae|=z.DEPTH_BUFFER_BIT),oe&&(ae|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(ae)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",De,!1),t.removeEventListener("webglcontextrestored",Ge,!1),t.removeEventListener("webglcontextcreationerror",Ce,!1),et.dispose(),he.dispose(),Qe.dispose(),Ee.dispose(),ut.dispose(),ht.dispose(),K.dispose(),Oe.dispose(),vt.dispose(),ue.dispose(),Re.dispose(),Re.removeEventListener("sessionstart",vn),Re.removeEventListener("sessionend",fs),jn.stop()};function De(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),O=!0}function Ge(){console.log("THREE.WebGLRenderer: Context Restored."),O=!1;const L=Ie.autoReset,$=Ye.enabled,oe=Ye.autoUpdate,ae=Ye.needsUpdate,q=Ye.type;j(),Ie.autoReset=L,Ye.enabled=$,Ye.autoUpdate=oe,Ye.needsUpdate=ae,Ye.type=q}function Ce(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function _e(L){const $=L.target;$.removeEventListener("dispose",_e),Je($)}function Je(L){gt(L),Ee.remove(L)}function gt(L){const $=Ee.get(L).programs;$!==void 0&&($.forEach(function(oe){ue.releaseProgram(oe)}),L.isShaderMaterial&&ue.releaseShaderCache(L))}this.renderBufferDirect=function(L,$,oe,ae,q,be){$===null&&($=Ve);const ke=q.isMesh&&q.matrixWorld.determinant()<0,Ke=Ui(L,$,oe,ae,q);me.setMaterial(ae,ke);let We=oe.index,ct=1;if(ae.wireframe===!0){if(We=A.getWireframeAttribute(oe),We===void 0)return;ct=2}const ft=oe.drawRange,rt=oe.attributes.position;let pt=ft.start*ct,Lt=(ft.start+ft.count)*ct;be!==null&&(pt=Math.max(pt,be.start*ct),Lt=Math.min(Lt,(be.start+be.count)*ct)),We!==null?(pt=Math.max(pt,0),Lt=Math.min(Lt,We.count)):rt!=null&&(pt=Math.max(pt,0),Lt=Math.min(Lt,rt.count));const Ct=Lt-pt;if(Ct<0||Ct===1/0)return;Oe.setup(q,ae,Ke,oe,We);let kt,It=He;if(We!==null&&(kt=I.get(We),It=dt,It.setIndex(kt)),q.isMesh)ae.wireframe===!0?(me.setLineWidth(ae.wireframeLinewidth*Nt()),It.setMode(z.LINES)):It.setMode(z.TRIANGLES);else if(q.isLine){let ot=ae.linewidth;ot===void 0&&(ot=1),me.setLineWidth(ot*Nt()),q.isLineSegments?It.setMode(z.LINES):q.isLineLoop?It.setMode(z.LINE_LOOP):It.setMode(z.LINE_STRIP)}else q.isPoints?It.setMode(z.POINTS):q.isSprite&&It.setMode(z.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)pa("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),It.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(ve.get("WEBGL_multi_draw"))It.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const ot=q._multiDrawStarts,Ut=q._multiDrawCounts,Et=q._multiDrawCount,nn=We?I.get(We).bytesPerElement:1,ai=Ee.get(ae).currentProgram.getUniforms();for(let Cn=0;Cn<Et;Cn++)ai.setValue(z,"_gl_DrawID",Cn),It.render(ot[Cn]/nn,Ut[Cn])}else if(q.isInstancedMesh)It.renderInstances(pt,Ct,q.count);else if(oe.isInstancedBufferGeometry){const ot=oe._maxInstanceCount!==void 0?oe._maxInstanceCount:1/0,Ut=Math.min(oe.instanceCount,ot);It.renderInstances(pt,Ct,Ut)}else It.render(pt,Ct)};function Dt(L,$,oe){L.transparent===!0&&L.side===Ri&&L.forceSinglePass===!1?(L.side=Gn,L.needsUpdate=!0,ps(L,$,oe),L.side=br,L.needsUpdate=!0,ps(L,$,oe),L.side=Ri):ps(L,$,oe)}this.compile=function(L,$,oe=null){oe===null&&(oe=L),v=Qe.get(oe),v.init($),C.push(v),oe.traverseVisible(function(q){q.isLight&&q.layers.test($.layers)&&(v.pushLight(q),q.castShadow&&v.pushShadow(q))}),L!==oe&&L.traverseVisible(function(q){q.isLight&&q.layers.test($.layers)&&(v.pushLight(q),q.castShadow&&v.pushShadow(q))}),v.setupLights();const ae=new Set;return L.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const be=q.material;if(be)if(Array.isArray(be))for(let ke=0;ke<be.length;ke++){const Ke=be[ke];Dt(Ke,oe,q),ae.add(Ke)}else Dt(be,oe,q),ae.add(be)}),v=C.pop(),ae},this.compileAsync=function(L,$,oe=null){const ae=this.compile(L,$,oe);return new Promise(q=>{function be(){if(ae.forEach(function(ke){Ee.get(ke).currentProgram.isReady()&&ae.delete(ke)}),ae.size===0){q(L);return}setTimeout(be,10)}ve.get("KHR_parallel_shader_compile")!==null?be():setTimeout(be,10)})};let At=null;function Qn(L){At&&At(L)}function vn(){jn.stop()}function fs(){jn.start()}const jn=new Wg;jn.setAnimationLoop(Qn),typeof self<"u"&&jn.setContext(self),this.setAnimationLoop=function(L){At=L,Re.setAnimationLoop(L),L===null?jn.stop():jn.start()},Re.addEventListener("sessionstart",vn),Re.addEventListener("sessionend",fs),this.render=function(L,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),Re.enabled===!0&&Re.isPresenting===!0&&(Re.cameraAutoUpdate===!0&&Re.updateCamera($),$=Re.getCamera()),L.isScene===!0&&L.onBeforeRender(E,L,$,V),v=Qe.get(L,C.length),v.init($),C.push(v),pe.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),Xe.setFromProjectionMatrix(pe,Pi,$.reversedDepth),ne=this.localClippingEnabled,qe=Pe.init(this.clippingPlanes,ne),y=he.get(L,P.length),y.init(),P.push(y),Re.enabled===!0&&Re.isPresenting===!0){const be=E.xr.getDepthSensingMesh();be!==null&&go(be,$,-1/0,E.sortObjects)}go(L,$,0,E.sortObjects),y.finish(),E.sortObjects===!0&&y.sort(fe,ce),_t=Re.enabled===!1||Re.isPresenting===!1||Re.hasDepthSensing()===!1,_t&&et.addToRenderList(y,L),this.info.render.frame++,qe===!0&&Pe.beginShadows();const oe=v.state.shadowsArray;Ye.render(oe,L,$),qe===!0&&Pe.endShadows(),this.info.autoReset===!0&&this.info.reset();const ae=y.opaque,q=y.transmissive;if(v.setupLights(),$.isArrayCamera){const be=$.cameras;if(q.length>0)for(let ke=0,Ke=be.length;ke<Ke;ke++){const We=be[ke];Lr(ae,q,L,We)}_t&&et.render(L);for(let ke=0,Ke=be.length;ke<Ke;ke++){const We=be[ke];Qi(y,L,We,We.viewport)}}else q.length>0&&Lr(ae,q,L,$),_t&&et.render(L),Qi(y,L,$);V!==null&&F===0&&(Ne.updateMultisampleRenderTarget(V),Ne.updateRenderTargetMipmap(V)),L.isScene===!0&&L.onAfterRender(E,L,$),Oe.resetDefaultState(),b=-1,R=null,C.pop(),C.length>0?(v=C[C.length-1],qe===!0&&Pe.setGlobalState(E.clippingPlanes,v.state.camera)):v=null,P.pop(),P.length>0?y=P[P.length-1]:y=null};function go(L,$,oe,ae){if(L.visible===!1)return;if(L.layers.test($.layers)){if(L.isGroup)oe=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update($);else if(L.isLight)v.pushLight(L),L.castShadow&&v.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||Xe.intersectsSprite(L)){ae&&Ue.setFromMatrixPosition(L.matrixWorld).applyMatrix4(pe);const ke=K.update(L),Ke=L.material;Ke.visible&&y.push(L,ke,Ke,oe,Ue.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||Xe.intersectsObject(L))){const ke=K.update(L),Ke=L.material;if(ae&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),Ue.copy(L.boundingSphere.center)):(ke.boundingSphere===null&&ke.computeBoundingSphere(),Ue.copy(ke.boundingSphere.center)),Ue.applyMatrix4(L.matrixWorld).applyMatrix4(pe)),Array.isArray(Ke)){const We=ke.groups;for(let ct=0,ft=We.length;ct<ft;ct++){const rt=We[ct],pt=Ke[rt.materialIndex];pt&&pt.visible&&y.push(L,ke,pt,oe,Ue.z,rt)}}else Ke.visible&&y.push(L,ke,Ke,oe,Ue.z,null)}}const be=L.children;for(let ke=0,Ke=be.length;ke<Ke;ke++)go(be[ke],$,oe,ae)}function Qi(L,$,oe,ae){const q=L.opaque,be=L.transmissive,ke=L.transparent;v.setupLightsView(oe),qe===!0&&Pe.setGlobalState(E.clippingPlanes,oe),ae&&me.viewport(H.copy(ae)),q.length>0&&Ii(q,$,oe),be.length>0&&Ii(be,$,oe),ke.length>0&&Ii(ke,$,oe),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function Lr(L,$,oe,ae){if((oe.isScene===!0?oe.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[ae.id]===void 0&&(v.state.transmissionRenderTarget[ae.id]=new as(1,1,{generateMipmaps:!0,type:ve.has("EXT_color_buffer_half_float")||ve.has("EXT_color_buffer_float")?xa:Ni,minFilter:ss,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Pt.workingColorSpace}));const be=v.state.transmissionRenderTarget[ae.id],ke=ae.viewport||H;be.setSize(ke.z*E.transmissionResolutionScale,ke.w*E.transmissionResolutionScale);const Ke=E.getRenderTarget(),We=E.getActiveCubeFace(),ct=E.getActiveMipmapLevel();E.setRenderTarget(be),E.getClearColor(de),se=E.getClearAlpha(),se<1&&E.setClearColor(16777215,.5),E.clear(),_t&&et.render(oe);const ft=E.toneMapping;E.toneMapping=Rr;const rt=ae.viewport;if(ae.viewport!==void 0&&(ae.viewport=void 0),v.setupLightsView(ae),qe===!0&&Pe.setGlobalState(E.clippingPlanes,ae),Ii(L,oe,ae),Ne.updateMultisampleRenderTarget(be),Ne.updateRenderTargetMipmap(be),ve.has("WEBGL_multisampled_render_to_texture")===!1){let pt=!1;for(let Lt=0,Ct=$.length;Lt<Ct;Lt++){const kt=$[Lt],It=kt.object,ot=kt.geometry,Ut=kt.material,Et=kt.group;if(Ut.side===Ri&&It.layers.test(ae.layers)){const nn=Ut.side;Ut.side=Gn,Ut.needsUpdate=!0,hs(It,oe,ae,ot,Ut,Et),Ut.side=nn,Ut.needsUpdate=!0,pt=!0}}pt===!0&&(Ne.updateMultisampleRenderTarget(be),Ne.updateRenderTargetMipmap(be))}E.setRenderTarget(Ke,We,ct),E.setClearColor(de,se),rt!==void 0&&(ae.viewport=rt),E.toneMapping=ft}function Ii(L,$,oe){const ae=$.isScene===!0?$.overrideMaterial:null;for(let q=0,be=L.length;q<be;q++){const ke=L[q],Ke=ke.object,We=ke.geometry,ct=ke.group;let ft=ke.material;ft.allowOverride===!0&&ae!==null&&(ft=ae),Ke.layers.test(oe.layers)&&hs(Ke,$,oe,We,ft,ct)}}function hs(L,$,oe,ae,q,be){L.onBeforeRender(E,$,oe,ae,q,be),L.modelViewMatrix.multiplyMatrices(oe.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),q.onBeforeRender(E,$,oe,ae,L,be),q.transparent===!0&&q.side===Ri&&q.forceSinglePass===!1?(q.side=Gn,q.needsUpdate=!0,E.renderBufferDirect(oe,$,ae,q,L,be),q.side=br,q.needsUpdate=!0,E.renderBufferDirect(oe,$,ae,q,L,be),q.side=Ri):E.renderBufferDirect(oe,$,ae,q,L,be),L.onAfterRender(E,$,oe,ae,q,be)}function ps(L,$,oe){$.isScene!==!0&&($=Ve);const ae=Ee.get(L),q=v.state.lights,be=v.state.shadowsArray,ke=q.state.version,Ke=ue.getParameters(L,q.state,be,$,oe),We=ue.getProgramCacheKey(Ke);let ct=ae.programs;ae.environment=L.isMeshStandardMaterial?$.environment:null,ae.fog=$.fog,ae.envMap=(L.isMeshStandardMaterial?ht:ut).get(L.envMap||ae.environment),ae.envMapRotation=ae.environment!==null&&L.envMap===null?$.environmentRotation:L.envMapRotation,ct===void 0&&(L.addEventListener("dispose",_e),ct=new Map,ae.programs=ct);let ft=ct.get(We);if(ft!==void 0){if(ae.currentProgram===ft&&ae.lightsStateVersion===ke)return Ma(L,Ke),ft}else Ke.uniforms=ue.getUniforms(L),L.onBeforeCompile(Ke,E),ft=ue.acquireProgram(Ke,We),ct.set(We,ft),ae.uniforms=Ke.uniforms;const rt=ae.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(rt.clippingPlanes=Pe.uniform),Ma(L,Ke),ae.needsLights=wa(L),ae.lightsStateVersion=ke,ae.needsLights&&(rt.ambientLightColor.value=q.state.ambient,rt.lightProbe.value=q.state.probe,rt.directionalLights.value=q.state.directional,rt.directionalLightShadows.value=q.state.directionalShadow,rt.spotLights.value=q.state.spot,rt.spotLightShadows.value=q.state.spotShadow,rt.rectAreaLights.value=q.state.rectArea,rt.ltc_1.value=q.state.rectAreaLTC1,rt.ltc_2.value=q.state.rectAreaLTC2,rt.pointLights.value=q.state.point,rt.pointLightShadows.value=q.state.pointShadow,rt.hemisphereLights.value=q.state.hemi,rt.directionalShadowMap.value=q.state.directionalShadowMap,rt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,rt.spotShadowMap.value=q.state.spotShadowMap,rt.spotLightMatrix.value=q.state.spotLightMatrix,rt.spotLightMap.value=q.state.spotLightMap,rt.pointShadowMap.value=q.state.pointShadowMap,rt.pointShadowMatrix.value=q.state.pointShadowMatrix),ae.currentProgram=ft,ae.uniformsList=null,ft}function Sa(L){if(L.uniformsList===null){const $=L.currentProgram.getUniforms();L.uniformsList=ac.seqWithValue($.seq,L.uniforms)}return L.uniformsList}function Ma(L,$){const oe=Ee.get(L);oe.outputColorSpace=$.outputColorSpace,oe.batching=$.batching,oe.batchingColor=$.batchingColor,oe.instancing=$.instancing,oe.instancingColor=$.instancingColor,oe.instancingMorph=$.instancingMorph,oe.skinning=$.skinning,oe.morphTargets=$.morphTargets,oe.morphNormals=$.morphNormals,oe.morphColors=$.morphColors,oe.morphTargetsCount=$.morphTargetsCount,oe.numClippingPlanes=$.numClippingPlanes,oe.numIntersection=$.numClipIntersection,oe.vertexAlphas=$.vertexAlphas,oe.vertexTangents=$.vertexTangents,oe.toneMapping=$.toneMapping}function Ui(L,$,oe,ae,q){$.isScene!==!0&&($=Ve),Ne.resetTextureUnits();const be=$.fog,ke=ae.isMeshStandardMaterial?$.environment:null,Ke=V===null?E.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:co,We=(ae.isMeshStandardMaterial?ht:ut).get(ae.envMap||ke),ct=ae.vertexColors===!0&&!!oe.attributes.color&&oe.attributes.color.itemSize===4,ft=!!oe.attributes.tangent&&(!!ae.normalMap||ae.anisotropy>0),rt=!!oe.morphAttributes.position,pt=!!oe.morphAttributes.normal,Lt=!!oe.morphAttributes.color;let Ct=Rr;ae.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(Ct=E.toneMapping);const kt=oe.morphAttributes.position||oe.morphAttributes.normal||oe.morphAttributes.color,It=kt!==void 0?kt.length:0,ot=Ee.get(ae),Ut=v.state.lights;if(qe===!0&&(ne===!0||L!==R)){const Jt=L===R&&ae.id===b;Pe.setState(ae,L,Jt)}let Et=!1;ae.version===ot.__version?(ot.needsLights&&ot.lightsStateVersion!==Ut.state.version||ot.outputColorSpace!==Ke||q.isBatchedMesh&&ot.batching===!1||!q.isBatchedMesh&&ot.batching===!0||q.isBatchedMesh&&ot.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&ot.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&ot.instancing===!1||!q.isInstancedMesh&&ot.instancing===!0||q.isSkinnedMesh&&ot.skinning===!1||!q.isSkinnedMesh&&ot.skinning===!0||q.isInstancedMesh&&ot.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&ot.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&ot.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&ot.instancingMorph===!1&&q.morphTexture!==null||ot.envMap!==We||ae.fog===!0&&ot.fog!==be||ot.numClippingPlanes!==void 0&&(ot.numClippingPlanes!==Pe.numPlanes||ot.numIntersection!==Pe.numIntersection)||ot.vertexAlphas!==ct||ot.vertexTangents!==ft||ot.morphTargets!==rt||ot.morphNormals!==pt||ot.morphColors!==Lt||ot.toneMapping!==Ct||ot.morphTargetsCount!==It)&&(Et=!0):(Et=!0,ot.__version=ae.version);let nn=ot.currentProgram;Et===!0&&(nn=ps(ae,$,q));let ai=!1,Cn=!1,Nr=!1;const zt=nn.getUniforms(),Rn=ot.uniforms;if(me.useProgram(nn.program)&&(ai=!0,Cn=!0,Nr=!0),ae.id!==b&&(b=ae.id,Cn=!0),ai||R!==L){me.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),zt.setValue(z,"projectionMatrix",L.projectionMatrix),zt.setValue(z,"viewMatrix",L.matrixWorldInverse);const xn=zt.map.cameraPosition;xn!==void 0&&xn.setValue(z,Te.setFromMatrixPosition(L.matrixWorld)),ge.logarithmicDepthBuffer&&zt.setValue(z,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(ae.isMeshPhongMaterial||ae.isMeshToonMaterial||ae.isMeshLambertMaterial||ae.isMeshBasicMaterial||ae.isMeshStandardMaterial||ae.isShaderMaterial)&&zt.setValue(z,"isOrthographic",L.isOrthographicCamera===!0),R!==L&&(R=L,Cn=!0,Nr=!0)}if(q.isSkinnedMesh){zt.setOptional(z,q,"bindMatrix"),zt.setOptional(z,q,"bindMatrixInverse");const Jt=q.skeleton;Jt&&(Jt.boneTexture===null&&Jt.computeBoneTexture(),zt.setValue(z,"boneTexture",Jt.boneTexture,Ne))}q.isBatchedMesh&&(zt.setOptional(z,q,"batchingTexture"),zt.setValue(z,"batchingTexture",q._matricesTexture,Ne),zt.setOptional(z,q,"batchingIdTexture"),zt.setValue(z,"batchingIdTexture",q._indirectTexture,Ne),zt.setOptional(z,q,"batchingColorTexture"),q._colorsTexture!==null&&zt.setValue(z,"batchingColorTexture",q._colorsTexture,Ne));const _n=oe.morphAttributes;if((_n.position!==void 0||_n.normal!==void 0||_n.color!==void 0)&&Ae.update(q,oe,nn),(Cn||ot.receiveShadow!==q.receiveShadow)&&(ot.receiveShadow=q.receiveShadow,zt.setValue(z,"receiveShadow",q.receiveShadow)),ae.isMeshGouraudMaterial&&ae.envMap!==null&&(Rn.envMap.value=We,Rn.flipEnvMap.value=We.isCubeTexture&&We.isRenderTargetTexture===!1?-1:1),ae.isMeshStandardMaterial&&ae.envMap===null&&$.environment!==null&&(Rn.envMapIntensity.value=$.environmentIntensity),Cn&&(zt.setValue(z,"toneMappingExposure",E.toneMappingExposure),ot.needsLights&&Ea(Rn,Nr),be&&ae.fog===!0&&xe.refreshFogUniforms(Rn,be),xe.refreshMaterialUniforms(Rn,ae,W,le,v.state.transmissionRenderTarget[L.id]),ac.upload(z,Sa(ot),Rn,Ne)),ae.isShaderMaterial&&ae.uniformsNeedUpdate===!0&&(ac.upload(z,Sa(ot),Rn,Ne),ae.uniformsNeedUpdate=!1),ae.isSpriteMaterial&&zt.setValue(z,"center",q.center),zt.setValue(z,"modelViewMatrix",q.modelViewMatrix),zt.setValue(z,"normalMatrix",q.normalMatrix),zt.setValue(z,"modelMatrix",q.matrixWorld),ae.isShaderMaterial||ae.isRawShaderMaterial){const Jt=ae.uniformsGroups;for(let xn=0,Dr=Jt.length;xn<Dr;xn++){const wt=Jt[xn];vt.update(wt,nn),vt.bind(wt,nn)}}return nn}function Ea(L,$){L.ambientLightColor.needsUpdate=$,L.lightProbe.needsUpdate=$,L.directionalLights.needsUpdate=$,L.directionalLightShadows.needsUpdate=$,L.pointLights.needsUpdate=$,L.pointLightShadows.needsUpdate=$,L.spotLights.needsUpdate=$,L.spotLightShadows.needsUpdate=$,L.rectAreaLights.needsUpdate=$,L.hemisphereLights.needsUpdate=$}function wa(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(L,$,oe){const ae=Ee.get(L);ae.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,ae.__autoAllocateDepthBuffer===!1&&(ae.__useRenderToTexture=!1),Ee.get(L.texture).__webglTexture=$,Ee.get(L.depthTexture).__webglTexture=ae.__autoAllocateDepthBuffer?void 0:oe,ae.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,$){const oe=Ee.get(L);oe.__webglFramebuffer=$,oe.__useDefaultFramebuffer=$===void 0};const Ec=z.createFramebuffer();this.setRenderTarget=function(L,$=0,oe=0){V=L,U=$,F=oe;let ae=!0,q=null,be=!1,ke=!1;if(L){const We=Ee.get(L);if(We.__useDefaultFramebuffer!==void 0)me.bindFramebuffer(z.FRAMEBUFFER,null),ae=!1;else if(We.__webglFramebuffer===void 0)Ne.setupRenderTarget(L);else if(We.__hasExternalTextures)Ne.rebindTextures(L,Ee.get(L.texture).__webglTexture,Ee.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const rt=L.depthTexture;if(We.__boundDepthTexture!==rt){if(rt!==null&&Ee.has(rt)&&(L.width!==rt.image.width||L.height!==rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ne.setupDepthRenderbuffer(L)}}const ct=L.texture;(ct.isData3DTexture||ct.isDataArrayTexture||ct.isCompressedArrayTexture)&&(ke=!0);const ft=Ee.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(ft[$])?q=ft[$][oe]:q=ft[$],be=!0):L.samples>0&&Ne.useMultisampledRTT(L)===!1?q=Ee.get(L).__webglMultisampledFramebuffer:Array.isArray(ft)?q=ft[oe]:q=ft,H.copy(L.viewport),Y.copy(L.scissor),ee=L.scissorTest}else H.copy(B).multiplyScalar(W).floor(),Y.copy(re).multiplyScalar(W).floor(),ee=Be;if(oe!==0&&(q=Ec),me.bindFramebuffer(z.FRAMEBUFFER,q)&&ae&&me.drawBuffers(L,q),me.viewport(H),me.scissor(Y),me.setScissorTest(ee),be){const We=Ee.get(L.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+$,We.__webglTexture,oe)}else if(ke){const We=$;for(let ct=0;ct<L.textures.length;ct++){const ft=Ee.get(L.textures[ct]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+ct,ft.__webglTexture,oe,We)}}else if(L!==null&&oe!==0){const We=Ee.get(L.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,We.__webglTexture,oe)}b=-1},this.readRenderTargetPixels=function(L,$,oe,ae,q,be,ke,Ke=0){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let We=Ee.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&ke!==void 0&&(We=We[ke]),We){me.bindFramebuffer(z.FRAMEBUFFER,We);try{const ct=L.textures[Ke],ft=ct.format,rt=ct.type;if(!ge.textureFormatReadable(ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ge.textureTypeReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=L.width-ae&&oe>=0&&oe<=L.height-q&&(L.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+Ke),z.readPixels($,oe,ae,q,nt.convert(ft),nt.convert(rt),be))}finally{const ct=V!==null?Ee.get(V).__webglFramebuffer:null;me.bindFramebuffer(z.FRAMEBUFFER,ct)}}},this.readRenderTargetPixelsAsync=async function(L,$,oe,ae,q,be,ke,Ke=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let We=Ee.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&ke!==void 0&&(We=We[ke]),We)if($>=0&&$<=L.width-ae&&oe>=0&&oe<=L.height-q){me.bindFramebuffer(z.FRAMEBUFFER,We);const ct=L.textures[Ke],ft=ct.format,rt=ct.type;if(!ge.textureFormatReadable(ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ge.textureTypeReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const pt=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,pt),z.bufferData(z.PIXEL_PACK_BUFFER,be.byteLength,z.STREAM_READ),L.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+Ke),z.readPixels($,oe,ae,q,nt.convert(ft),nt.convert(rt),0);const Lt=V!==null?Ee.get(V).__webglFramebuffer:null;me.bindFramebuffer(z.FRAMEBUFFER,Lt);const Ct=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Vx(z,Ct,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,pt),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,be),z.deleteBuffer(pt),z.deleteSync(Ct),be}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,$=null,oe=0){const ae=Math.pow(2,-oe),q=Math.floor(L.image.width*ae),be=Math.floor(L.image.height*ae),ke=$!==null?$.x:0,Ke=$!==null?$.y:0;Ne.setTexture2D(L,0),z.copyTexSubImage2D(z.TEXTURE_2D,oe,0,0,ke,Ke,q,be),me.unbindTexture()};const Ta=z.createFramebuffer(),Aa=z.createFramebuffer();this.copyTextureToTexture=function(L,$,oe=null,ae=null,q=0,be=null){be===null&&(q!==0?(pa("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),be=q,q=0):be=0);let ke,Ke,We,ct,ft,rt,pt,Lt,Ct;const kt=L.isCompressedTexture?L.mipmaps[be]:L.image;if(oe!==null)ke=oe.max.x-oe.min.x,Ke=oe.max.y-oe.min.y,We=oe.isBox3?oe.max.z-oe.min.z:1,ct=oe.min.x,ft=oe.min.y,rt=oe.isBox3?oe.min.z:0;else{const _n=Math.pow(2,-q);ke=Math.floor(kt.width*_n),Ke=Math.floor(kt.height*_n),L.isDataArrayTexture?We=kt.depth:L.isData3DTexture?We=Math.floor(kt.depth*_n):We=1,ct=0,ft=0,rt=0}ae!==null?(pt=ae.x,Lt=ae.y,Ct=ae.z):(pt=0,Lt=0,Ct=0);const It=nt.convert($.format),ot=nt.convert($.type);let Ut;$.isData3DTexture?(Ne.setTexture3D($,0),Ut=z.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(Ne.setTexture2DArray($,0),Ut=z.TEXTURE_2D_ARRAY):(Ne.setTexture2D($,0),Ut=z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,$.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,$.unpackAlignment);const Et=z.getParameter(z.UNPACK_ROW_LENGTH),nn=z.getParameter(z.UNPACK_IMAGE_HEIGHT),ai=z.getParameter(z.UNPACK_SKIP_PIXELS),Cn=z.getParameter(z.UNPACK_SKIP_ROWS),Nr=z.getParameter(z.UNPACK_SKIP_IMAGES);z.pixelStorei(z.UNPACK_ROW_LENGTH,kt.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,kt.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,ct),z.pixelStorei(z.UNPACK_SKIP_ROWS,ft),z.pixelStorei(z.UNPACK_SKIP_IMAGES,rt);const zt=L.isDataArrayTexture||L.isData3DTexture,Rn=$.isDataArrayTexture||$.isData3DTexture;if(L.isDepthTexture){const _n=Ee.get(L),Jt=Ee.get($),xn=Ee.get(_n.__renderTarget),Dr=Ee.get(Jt.__renderTarget);me.bindFramebuffer(z.READ_FRAMEBUFFER,xn.__webglFramebuffer),me.bindFramebuffer(z.DRAW_FRAMEBUFFER,Dr.__webglFramebuffer);for(let wt=0;wt<We;wt++)zt&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ee.get(L).__webglTexture,q,rt+wt),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ee.get($).__webglTexture,be,Ct+wt)),z.blitFramebuffer(ct,ft,ke,Ke,pt,Lt,ke,Ke,z.DEPTH_BUFFER_BIT,z.NEAREST);me.bindFramebuffer(z.READ_FRAMEBUFFER,null),me.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(q!==0||L.isRenderTargetTexture||Ee.has(L)){const _n=Ee.get(L),Jt=Ee.get($);me.bindFramebuffer(z.READ_FRAMEBUFFER,Ta),me.bindFramebuffer(z.DRAW_FRAMEBUFFER,Aa);for(let xn=0;xn<We;xn++)zt?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,_n.__webglTexture,q,rt+xn):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,_n.__webglTexture,q),Rn?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Jt.__webglTexture,be,Ct+xn):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Jt.__webglTexture,be),q!==0?z.blitFramebuffer(ct,ft,ke,Ke,pt,Lt,ke,Ke,z.COLOR_BUFFER_BIT,z.NEAREST):Rn?z.copyTexSubImage3D(Ut,be,pt,Lt,Ct+xn,ct,ft,ke,Ke):z.copyTexSubImage2D(Ut,be,pt,Lt,ct,ft,ke,Ke);me.bindFramebuffer(z.READ_FRAMEBUFFER,null),me.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else Rn?L.isDataTexture||L.isData3DTexture?z.texSubImage3D(Ut,be,pt,Lt,Ct,ke,Ke,We,It,ot,kt.data):$.isCompressedArrayTexture?z.compressedTexSubImage3D(Ut,be,pt,Lt,Ct,ke,Ke,We,It,kt.data):z.texSubImage3D(Ut,be,pt,Lt,Ct,ke,Ke,We,It,ot,kt):L.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,be,pt,Lt,ke,Ke,It,ot,kt.data):L.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,be,pt,Lt,kt.width,kt.height,It,kt.data):z.texSubImage2D(z.TEXTURE_2D,be,pt,Lt,ke,Ke,It,ot,kt);z.pixelStorei(z.UNPACK_ROW_LENGTH,Et),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,nn),z.pixelStorei(z.UNPACK_SKIP_PIXELS,ai),z.pixelStorei(z.UNPACK_SKIP_ROWS,Cn),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Nr),be===0&&$.generateMipmaps&&z.generateMipmap(Ut),me.unbindTexture()},this.initRenderTarget=function(L){Ee.get(L).__webglFramebuffer===void 0&&Ne.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?Ne.setTextureCube(L,0):L.isData3DTexture?Ne.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?Ne.setTexture2DArray(L,0):Ne.setTexture2D(L,0),me.unbindTexture()},this.resetState=function(){U=0,F=0,V=null,me.reset(),Oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Pt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Pt._getUnpackColorSpace()}}const G0=.2,Bw=2,Ti=.005;function Vw(){const s=globalThis;return s.AudioContext??s.webkitAudioContext??null}class Hw{context=null;master=null;noiseBuffer=null;muted=!1;disposed=!1;timers=new Set;constructor(){}resume(){if(this.disposed)return;let e=this.context;if(e?.state==="closed"&&(this.context=null,this.master=null,this.noiseBuffer=null,e=null),!e){const t=Vw();if(!t)return;try{e=new t;const i=e.createGain();i.gain.value=this.muted?0:G0,i.connect(e.destination),this.context=e,this.master=i}catch{if(e)try{e.close().catch(()=>{})}catch{}this.context=null,this.master=null,this.noiseBuffer=null;return}}if(!(!e||e.state==="running"))try{e.resume().catch(()=>{})}catch{}}setMuted(e){if(this.muted=e,!!this.master)try{this.master.gain.value=e?0:G0}catch{}}isMuted(){return this.muted}shot(e,t=0){const i=this.audibleContext();if(i)try{const o=this.createBus(i,t);if(!o)return;const a=i.currentTime+Ti;switch(e){case"ak47":this.tone(i,o,{start:a,duration:.18,frequency:132,endFrequency:46,type:"sawtooth",volume:.42,attack:.002,filter:{type:"lowpass",frequency:1e3,endFrequency:260,q:.7}}),this.noise(i,o,{start:a,duration:.14,volume:.3,attack:.001,filter:{type:"lowpass",frequency:1600,endFrequency:360,q:.6}}),this.noise(i,o,{start:a,duration:.025,volume:.1,filter:{type:"highpass",frequency:1900,q:.5}});break;case"m4a4":this.tone(i,o,{start:a,duration:.105,frequency:280,endFrequency:92,type:"triangle",volume:.28,attack:.001,filter:{type:"lowpass",frequency:2400,endFrequency:850,q:.7}}),this.noise(i,o,{start:a,duration:.075,volume:.24,attack:.001,filter:{type:"bandpass",frequency:2500,endFrequency:1100,q:.8}}),this.noise(i,o,{start:a,duration:.022,volume:.07,filter:{type:"highpass",frequency:4e3,q:.5}});break;case"awp":this.tone(i,o,{start:a,duration:.3,frequency:104,endFrequency:30,type:"sawtooth",volume:.5,attack:.002,filter:{type:"lowpass",frequency:820,endFrequency:180,q:.8}}),this.noise(i,o,{start:a,duration:.24,volume:.38,attack:.001,filter:{type:"lowpass",frequency:1500,endFrequency:220,q:.7}}),this.noise(i,o,{start:a,duration:.04,volume:.12,filter:{type:"highpass",frequency:2300,q:.5}}),this.tone(i,o,{start:a+.02,duration:1.7,frequency:92,endFrequency:28,type:"sine",volume:.18,attack:.008,filter:{type:"lowpass",frequency:600,endFrequency:100,q:.6}}),this.noise(i,o,{start:a+.04,duration:1.9,volume:.16,attack:.008,filter:{type:"lowpass",frequency:900,endFrequency:100,q:.6}});for(let c=0;c<5;c+=1){const d=a+.16+c*.19,f=.12/(c+1);this.tone(i,o,{start:d,duration:.42,frequency:170-c*18,endFrequency:52,type:"sine",volume:f,attack:.004,filter:{type:"lowpass",frequency:1100-c*120,endFrequency:180,q:.6}}),this.noise(i,o,{start:d,duration:.32,volume:f*.65,attack:.004,filter:{type:"bandpass",frequency:900-c*100,endFrequency:240,q:.7}})}break;case"glock":this.tone(i,o,{start:a,duration:.12,frequency:360,endFrequency:120,type:"triangle",volume:.24,attack:.001,filter:{type:"lowpass",frequency:2800,endFrequency:900,q:.7}}),this.noise(i,o,{start:a,duration:.065,volume:.2,attack:.001,filter:{type:"highpass",frequency:2200,endFrequency:1100,q:.6}});break;case"usp":this.tone(i,o,{start:a,duration:.15,frequency:220,endFrequency:72,type:"sine",volume:.28,attack:.002,filter:{type:"lowpass",frequency:1200,endFrequency:360,q:.7}}),this.noise(i,o,{start:a,duration:.09,volume:.13,attack:.001,filter:{type:"lowpass",frequency:1100,endFrequency:280,q:.7}}),this.tone(i,o,{start:a,duration:.05,frequency:900,endFrequency:300,type:"triangle",volume:.06,filter:{type:"lowpass",frequency:1800,q:.6}});break;case"deagle":this.tone(i,o,{start:a,duration:.24,frequency:190,endFrequency:42,type:"sawtooth",volume:.44,attack:.002,filter:{type:"lowpass",frequency:1300,endFrequency:250,q:.8}}),this.noise(i,o,{start:a,duration:.16,volume:.32,attack:.001,filter:{type:"bandpass",frequency:1500,endFrequency:420,q:.7}}),this.noise(i,o,{start:a,duration:.03,volume:.1,filter:{type:"highpass",frequency:2600,q:.5}});break;case"knife":this.noise(i,o,{start:a,duration:.24,volume:.22,attack:.01,filter:{type:"bandpass",frequency:480,endFrequency:2200,q:.7}}),this.noise(i,o,{start:a+.07,duration:.18,volume:.14,attack:.006,filter:{type:"bandpass",frequency:2200,endFrequency:500,q:.7}}),this.tone(i,o,{start:a,duration:.18,frequency:160,endFrequency:70,type:"sine",volume:.035,attack:.005,filter:{type:"lowpass",frequency:500,endFrequency:160,q:.6}});break;default:break}}catch{}}reload(e=0){this.audibleContext()&&(this.playReloadMetal(e,!1),this.schedule(()=>this.playReloadMetal(e,!0),190))}footstep(e=0){const t=this.audibleContext();if(t)try{const i=this.createBus(t,e);if(!i)return;const o=t.currentTime+Ti,a=.9+Math.random()*.2;this.noise(t,i,{start:o,duration:.085,volume:.17,attack:.002,filter:{type:"bandpass",frequency:950*a,endFrequency:300*a,q:.8}}),this.noise(t,i,{start:o+.008,duration:.045,volume:.065,attack:.001,filter:{type:"highpass",frequency:1600*a,endFrequency:800*a,q:.6}}),this.tone(t,i,{start:o,duration:.075,frequency:82*a,endFrequency:44*a,type:"sine",volume:.055,attack:.002,filter:{type:"lowpass",frequency:180,q:.7}})}catch{}}scope(){const e=this.audibleContext();if(e)try{const t=this.createBus(e,0);if(!t)return;const i=e.currentTime+Ti;this.tone(e,t,{start:i,duration:.038,frequency:1350,endFrequency:520,type:"square",volume:.09,attack:.001,filter:{type:"bandpass",frequency:1900,q:4}}),this.noise(e,t,{start:i,duration:.025,volume:.05,filter:{type:"highpass",frequency:2500,q:.7}}),this.tone(e,t,{start:i+.055,duration:.045,frequency:820,endFrequency:320,type:"square",volume:.07,attack:.001,filter:{type:"bandpass",frequency:1300,q:4}})}catch{}}hit(){const e=this.audibleContext();if(e)try{const t=this.createBus(e,0);if(!t)return;const i=e.currentTime+Ti;this.tone(e,t,{start:i,duration:.08,frequency:980,endFrequency:1440,type:"sine",volume:.16,attack:.001,filter:{type:"lowpass",frequency:2600,q:.6}}),this.tone(e,t,{start:i+.018,duration:.055,frequency:1760,endFrequency:1100,type:"triangle",volume:.055,attack:.001,filter:{type:"bandpass",frequency:2200,q:1.2}}),this.noise(e,t,{start:i,duration:.025,volume:.04,filter:{type:"bandpass",frequency:2800,q:2}})}catch{}}kill(){const e=this.audibleContext();if(e)try{const t=this.createBus(e,0);if(!t)return;const i=e.currentTime+Ti;this.tone(e,t,{start:i,duration:.13,frequency:392,endFrequency:440,type:"triangle",volume:.12,attack:.004,filter:{type:"lowpass",frequency:1800,q:.6}}),this.tone(e,t,{start:i+.09,duration:.15,frequency:587,endFrequency:660,type:"triangle",volume:.14,attack:.004,filter:{type:"lowpass",frequency:2100,q:.6}}),this.tone(e,t,{start:i+.19,duration:.24,frequency:784,endFrequency:1046,type:"sine",volume:.16,attack:.005,filter:{type:"lowpass",frequency:2600,q:.6}})}catch{}}plant(){this.audibleContext()&&(this.playPlantBeep(520,!1),this.schedule(()=>this.playPlantBeep(620,!1),160),this.schedule(()=>this.playPlantBeep(740,!1),320),this.schedule(()=>this.playPlantBeep(920,!0),480))}defuse(){const e=this.audibleContext();if(e)try{const t=this.createBus(e,0);if(!t)return;const i=e.currentTime+Ti;this.tone(e,t,{start:i,duration:.18,frequency:523.25,endFrequency:528,type:"sine",volume:.11,attack:.006,filter:{type:"lowpass",frequency:2400,q:.5}}),this.tone(e,t,{start:i+.11,duration:.18,frequency:659.25,endFrequency:665,type:"sine",volume:.11,attack:.006,filter:{type:"lowpass",frequency:2400,q:.5}}),this.tone(e,t,{start:i+.22,duration:.22,frequency:783.99,endFrequency:792,type:"sine",volume:.12,attack:.006,filter:{type:"lowpass",frequency:2500,q:.5}}),this.tone(e,t,{start:i+.34,duration:.45,frequency:1046.5,endFrequency:1058,type:"sine",volume:.16,attack:.008,filter:{type:"lowpass",frequency:2800,q:.5}}),this.tone(e,t,{start:i+.34,duration:.4,frequency:1567.98,endFrequency:1584,type:"triangle",volume:.035,attack:.008,filter:{type:"lowpass",frequency:3e3,q:.5}})}catch{}}explosion(){const e=this.audibleContext();if(e)try{const t=this.createBus(e,0);if(!t)return;const i=e.currentTime+Ti;this.tone(e,t,{start:i,duration:1.25,frequency:68,endFrequency:24,type:"sine",volume:.65,attack:.003,filter:{type:"lowpass",frequency:180,endFrequency:60,q:.8}}),this.tone(e,t,{start:i+.02,duration:1.7,frequency:43,endFrequency:20,type:"triangle",volume:.25,attack:.004,filter:{type:"lowpass",frequency:120,endFrequency:45,q:.7}}),this.noise(e,t,{start:i,duration:1.1,volume:.6,attack:.003,filter:{type:"lowpass",frequency:900,endFrequency:100,q:.8}}),this.noise(e,t,{start:i,duration:.3,volume:.18,attack:.001,filter:{type:"highpass",frequency:1400,endFrequency:420,q:.6}})}catch{}}ui(){const e=this.audibleContext();if(e)try{const t=this.createBus(e,0);if(!t)return;const i=e.currentTime+Ti;this.tone(e,t,{start:i,duration:.06,frequency:660,endFrequency:880,type:"sine",volume:.09,attack:.003,filter:{type:"lowpass",frequency:2200,q:.5}}),this.noise(e,t,{start:i,duration:.018,volume:.025,filter:{type:"highpass",frequency:1800,q:.5}})}catch{}}dispose(){if(this.disposed)return;this.disposed=!0;for(const i of this.timers)clearTimeout(i);this.timers.clear();const e=this.context,t=this.master;if(this.context=null,this.master=null,this.noiseBuffer=null,t)try{t.disconnect()}catch{}if(e&&e.state!=="closed")try{e.close().catch(()=>{})}catch{}}audibleContext(){return this.disposed||!this.context||!this.master||this.context.state!=="running"?null:this.context}createBus(e,t){if(!this.master)return null;const i=e.createGain();return i.gain.value=this.distanceGain(t),i.connect(this.master),i}distanceGain(e){return Number.isNaN(e)?1:1/(1+Math.max(0,e)*.055)}getNoiseBuffer(e){if(this.noiseBuffer)return this.noiseBuffer;try{const t=e.sampleRate,i=Math.max(1,Math.floor(t*Bw)),o=e.createBuffer(1,i,t),a=o.getChannelData(0);for(let c=0;c<a.length;c+=1)a[c]=Math.random()*2-1;return this.noiseBuffer=o,o}catch{return null}}createFilter(e,t,i,o){const a=e.createBiquadFilter();return a.type=t.type,a.frequency.setValueAtTime(Math.max(10,t.frequency),i),t.endFrequency!==void 0&&a.frequency.exponentialRampToValueAtTime(Math.max(10,t.endFrequency),i+Math.max(.01,o)),a.Q.setValueAtTime(Math.max(.001,t.q??.7),i),a}envelope(e,t,i,o,a){const c=t+Math.max(.01,i),d=Math.min(c-.001,t+Math.max(.001,a));e.value=0,e.setValueAtTime(1e-4,t),e.linearRampToValueAtTime(Math.max(1e-4,o),d),e.exponentialRampToValueAtTime(1e-4,c),e.setValueAtTime(0,c+.02)}tone(e,t,i){const o=e.createOscillator(),a=e.createGain(),c=i.start,d=Math.max(.01,i.duration),f=Math.max(1,i.frequency),h=Math.max(1,i.endFrequency??i.frequency);if(o.type=i.type,o.frequency.setValueAtTime(f,c),f!==h&&o.frequency.exponentialRampToValueAtTime(h,c+d),i.filter){const m=this.createFilter(e,i.filter,c,d);o.connect(m),m.connect(a)}else o.connect(a);a.connect(t),this.envelope(a.gain,c,d,i.volume,i.attack??.005),o.start(c),o.stop(c+d+.025)}noise(e,t,i){const o=this.getNoiseBuffer(e);if(!o)return;const a=e.createBufferSource(),c=Math.max(.01,i.duration),d=this.createFilter(e,i.filter,i.start,c),f=e.createGain();a.buffer=o,a.loop=!0,a.connect(d),d.connect(f),f.connect(t),this.envelope(f.gain,i.start,c,i.volume,i.attack??.003),a.start(i.start,Math.random()*o.duration),a.stop(i.start+c+.025)}playReloadMetal(e,t){const i=this.audibleContext();if(i)try{const o=this.createBus(i,e);if(!o)return;const a=i.currentTime+Ti,c=t?480:760;this.tone(i,o,{start:a,duration:t?.09:.07,frequency:c,endFrequency:c*.55,type:"square",volume:t?.1:.12,attack:.001,filter:{type:"bandpass",frequency:t?1200:1900,q:5}}),this.tone(i,o,{start:a+.012,duration:.055,frequency:c*1.8,endFrequency:c*1.2,type:"sine",volume:.055,attack:.001,filter:{type:"bandpass",frequency:t?1800:2600,q:4}}),this.noise(i,o,{start:a,duration:t?.055:.045,volume:.07,filter:{type:"highpass",frequency:2400,q:.8}})}catch{}}playPlantBeep(e,t){const i=this.audibleContext();if(i)try{const o=this.createBus(i,0);if(!o)return;const a=i.currentTime+Ti;this.tone(i,o,{start:a,duration:t?.18:.09,frequency:e,endFrequency:e,type:"square",volume:t?.15:.12,attack:.003,filter:{type:"lowpass",frequency:1800,q:.6}}),this.tone(i,o,{start:a,duration:t?.16:.075,frequency:e*2,endFrequency:e*2,type:"sine",volume:.025,attack:.003,filter:{type:"lowpass",frequency:2400,q:.5}})}catch{}}schedule(e,t){if(this.disposed)return;const i=setTimeout(()=>{if(this.timers.delete(i),!this.disposed)try{e()}catch{}},t);this.timers.add(i)}}const Gw=new Ji(1,1,1),Ww=new Zf(1,1,1,8,1,!1),W0=new Map;function st(s,e=.78,t=0,i=0){const o=`${s}:${e}:${t}:${i}`,a=W0.get(o);if(a)return a;const c=new An({color:s,roughness:e,metalness:t,emissive:i});return W0.set(o,c),c}function _a(s,e,t){const i=new Yt(e,t);return i.castShadow=!0,i.receiveShadow=!0,s.add(i),i}function J(s,e,t,i,o){const a=_a(s,Gw,e);return a.scale.set(...t),a.position.set(...i),o&&a.rotation.set(...o),a}function fn(s,e,t,i,o){const a=_a(s,Ww,e);return a.scale.set(t,i,t),a.position.set(...o),a.rotation.x=Math.PI/2,a}function jw(){const s=new Og;s.moveTo(0,-.026),s.lineTo(-.22,-.018),s.lineTo(-.31,.018),s.lineTo(-.225,.04),s.lineTo(0,.035),s.closePath();const e=new th(s,{depth:.012,steps:1,bevelEnabled:!1});return e.translate(0,0,-.006),e.rotateY(-Math.PI/2),e.computeVertexNormals(),e}const Xw=jw();function Mc(s){const e=s==="CT";return{cloth:st(e?4217968:10586723,.92),clothDark:st(e?2900563:7956039,.94),armor:st(e?3165281:7692614,.82),vest:st(e?1912895:5588531,.9),helmet:st(e?2704472:9007951,.86),accent:st(e?7906496:12625010,.78),skin:st(e?12423538:11370592,.9),glove:st(2369578,.94),boot:st(2106406,.9)}}function qw(s,e){const t=Mc(e),i=new Gt;i.position.set(0,.45,0),s.add(i),J(i,t.skin,[.1,.09,.1],[0,-.035,0]),J(i,t.skin,[.21,.24,.2],[0,.11,0]),J(i,t.skin,[.18,.06,.18],[0,.005,-.005]),J(i,t.skin,[.025,.07,.055],[-.116,.105,0]),J(i,t.skin,[.025,.07,.055],[.116,.105,0]);const o=st(14079177,.72),a=st(1515815,.55);if(J(i,o,[.046,.022,.009],[-.047,.15,-.105]),J(i,o,[.046,.022,.009],[.047,.15,-.105]),J(i,a,[.014,.018,.006],[-.047,.15,-.112]),J(i,a,[.014,.018,.006],[.047,.15,-.112]),J(i,t.clothDark,[.052,.009,.009],[-.047,.181,-.107]),J(i,t.clothDark,[.052,.009,.009],[.047,.181,-.107]),J(i,t.skin,[.035,.045,.035],[0,.102,-.116]),J(i,st(5518381,.9),[.07,.012,.008],[0,.038,-.104]),e==="CT"){J(i,t.helmet,[.25,.1,.24],[0,.225,.01]),J(i,t.helmet,[.21,.045,.2],[0,.285,.015]),J(i,t.armor,[.27,.025,.26],[0,.185,.005]),J(i,t.armor,[.28,.022,.065],[0,.18,-.12]),J(i,t.helmet,[.035,.12,.15],[-.125,.115,.015]),J(i,t.helmet,[.035,.12,.15],[.125,.115,.015]);const c=st(1321785,.25,.35);J(i,c,[.078,.035,.012],[-.049,.151,-.121]),J(i,c,[.078,.035,.012],[.049,.151,-.121]),J(i,t.armor,[.025,.009,.014],[0,.151,-.122]),J(i,t.accent,[.012,.055,.1],[.144,.13,.01])}else J(i,t.helmet,[.23,.075,.215],[0,.22,.01]),J(i,t.clothDark,[.245,.035,.225],[0,.175,.008]),J(i,t.cloth,[.09,.16,.035],[-.065,.105,.115],[0,0,-.12]),J(i,t.clothDark,[.135,.025,.012],[0,.02,-.104]),J(i,t.accent,[.025,.09,.02],[.105,.17,-.095]);return i}function j0(s,e,t,i){const o=Mc(e),a=new Gt;a.position.set(t*.255,.34,0),s.add(a),J(a,o.cloth,[.14,.26,.15],[0,-.13,0]),J(a,o.armor,[.16,.1,.17],[0,-.035,0]),J(a,o.accent,[.145,.035,.155],[0,-.19,0]);const c=new Gt;c.position.y=-.26,a.add(c),J(c,o.clothDark,[.115,.22,.125],[0,-.11,0]),J(c,o.armor,[.12,.09,.04],[0,-.015,-.065]);const d=new Gt;d.position.y=-.24,c.add(d),J(d,o.glove,[.105,.1,.11],[0,0,0]),J(d,o.glove,[.09,.055,.045],[0,-.005,-.065]);const f=i?.3:1,h=i?1.7:.45,m=-t*(i?.5:.72);return a.rotation.set(f,0,m),c.rotation.x=h,{root:a,elbow:c,primary:i,baseX:f,baseElbow:h,baseZ:m}}function X0(s,e,t){const i=Mc(e),o=new Gt;o.position.set(t*.115,.94,0),s.add(o),J(o,i.cloth,[.16,.4,.18],[0,-.2,0]),J(o,i.clothDark,[.165,.055,.185],[0,-.345,0]);const a=new Gt;a.position.y=-.4,o.add(a),J(a,i.clothDark,[.135,.4,.15],[0,-.2,0]),J(a,i.armor,[.145,.13,.04],[0,-.025,-.078]);const c=new Gt;return c.position.y=-.4,a.add(c),J(c,i.boot,[.17,.16,.28],[0,-.06,-.05]),J(c,st(1185303,.96),[.175,.035,.29],[0,-.1175,-.05]),J(c,i.clothDark,[.14,.09,.14],[0,.025,0]),{hip:o,knee:a,boot:c,offset:t>0?0:Math.PI}}function Yw(s){const e=new Gt,t=st(2566956,.48,.65),i=st(1382939,.55,.55),o=st(8538920,.7,.05),a=st(10511413,.72,.03),c=st(6896421,.68,.08);if(J(e,t,[.075,.09,.28],[0,0,-.12]),J(e,i,[.07,.025,.27],[0,.055,-.12]),J(e,o,[.075,.1,.25],[0,-.005,.19]),J(e,a,[.085,.13,.035],[0,-.005,.332]),J(e,o,[.085,.085,.2],[0,0,-.345]),J(e,a,[.088,.018,.17],[0,.045,-.345]),fn(e,t,.012,.34,[0,.012,-.61]),fn(e,i,.009,.28,[0,.065,-.43]),fn(e,t,.018,.07,[0,.012,-.815]),J(e,i,[.018,.075,.022],[0,.065,-.745]),J(e,i,[.055,.015,.025],[0,.102,-.745]),J(e,i,[.055,.04,.025],[0,.08,.005]),J(e,o,[.055,.14,.065],[0,-.095,.02],[-.22,0,0]),J(e,c,[.057,.11,.075],[0,-.09,-.1],[.18,0,0]),J(e,c,[.055,.1,.072],[0,-.17,-.125],[.38,0,0]),J(e,c,[.052,.075,.068],[0,-.235,-.16],[.58,0,0]),J(e,i,[.04,.012,.09],[0,-.065,-.025]),J(e,i,[.012,.05,.012],[0,-.045,-.065]),s){for(let d=0;d<3;d+=1)J(e,st(6910324,.35,.8),[.007,.012,.012],[.041,.02,-.045-d*.07]);J(e,t,[.008,.012,.15],[.043,.035,-.11],[.1,0,0]),J(e,a,[.06,.012,.012],[0,-.277,-.185])}return e}function $w(s){const e=new Gt,t=st(1514786,.48,.62),i=st(2702926,.52,.55),o=st(3753552,.4,.75),a=st(2107695,.76,.15);if(J(e,t,[.075,.09,.27],[0,0,-.105]),J(e,i,[.078,.025,.25],[0,.055,-.115]),J(e,i,[.082,.08,.24],[0,0,-.34]),J(e,t,[.09,.012,.25],[0,.05,-.34]),J(e,t,[.012,.09,.25],[-.046,0,-.34]),J(e,t,[.012,.09,.25],[.046,0,-.34]),fn(e,o,.011,.27,[0,.005,-.59]),fn(e,t,.017,.065,[0,.005,-.755]),fn(e,t,.022,.24,[0,.015,.155]),J(e,a,[.08,.09,.18],[0,-.005,.235]),J(e,a,[.09,.125,.035],[0,-.005,.345]),J(e,t,[.045,.055,.035],[0,.09,-.015]),J(e,o,[.018,.02,.04],[0,.092,-.03]),J(e,t,[.014,.065,.022],[0,.065,-.47]),J(e,t,[.05,.012,.022],[0,.098,-.47]),J(e,a,[.055,.135,.065],[0,-.095,.025],[-.2,0,0]),J(e,i,[.06,.18,.085],[0,-.135,-.105],[.12,0,0]),J(e,t,[.064,.018,.09],[0,-.23,-.116],[.12,0,0]),J(e,t,[.04,.012,.085],[0,-.06,-.02]),s){for(let c=0;c<7;c+=1)J(e,o,[.088,.009,.012],[0,.06,-.24-c*.032]);for(let c=0;c<4;c+=1)J(e,o,[.006,.035,.009],[.04,.005,-.01-c*.014]);J(e,st(7243671,.35,.7),[.007,.014,.055],[.041,.01,-.13])}return e}function Kw(s){const e=new Gt,t=st(3957320,.7,.18),i=st(2440752,.76,.15),o=st(2436397,.4,.72),a=st(1383709,.35,.65),c=st(3630699,.18,.45,1059888);if(J(e,t,[.09,.105,.4],[0,0,-.12]),J(e,i,[.085,.08,.3],[0,-.005,-.39]),J(e,t,[.095,.125,.25],[0,-.01,.22]),J(e,i,[.105,.16,.04],[0,-.01,.365]),J(e,t,[.06,.135,.07],[0,-.095,.065],[-.18,0,0]),J(e,i,[.065,.105,.09],[0,-.1,-.12],[.08,0,0]),fn(e,o,.013,.55,[0,.015,-.735]),fn(e,o,.02,.08,[0,.015,-1.05]),J(e,o,[.065,.04,.16],[0,.065,-.12]),J(e,a,[.018,.055,.035],[0,.095,-.035]),J(e,a,[.018,.055,.035],[0,.095,-.235]),fn(e,a,.035,.3,[0,.14,-.135]),fn(e,a,.043,.055,[0,.14,-.305]),fn(e,a,.04,.045,[0,.14,.037]),fn(e,c,.034,.006,[0,.14,-.335]),fn(e,c,.03,.006,[0,.14,.062]),J(e,o,[.09,.015,.015],[.065,.045,-.015],[0,0,-.35]),J(e,o,[.025,.025,.025],[.105,.028,-.015]),s){J(e,a,[.035,.035,.045],[0,.185,-.135]),J(e,a,[.04,.045,.035],[.047,.14,-.135]);for(let d=0;d<5;d+=1)J(e,i,[.098,.009,.012],[0,-.048,-.28-d*.045]);J(e,st(9148050,.3,.85),[.008,.02,.08],[.049,.01,-.09])}return e}function Zw(s){const e=new Gt,t=st(2435886,.42,.68),i=st(1843748,.82,.12),o=st(4278861,.35,.8);if(J(e,t,[.066,.065,.22],[0,0,-.1]),J(e,i,[.062,.055,.18],[0,-.055,-.075]),J(e,i,[.06,.145,.075],[0,-.13,.015],[-.18,0,0]),J(e,i,[.05,.012,.09],[0,-.09,-.065]),J(e,i,[.012,.05,.012],[0,-.068,-.105]),J(e,t,[.016,.025,.018],[0,.043,-.2]),J(e,t,[.05,.018,.018],[0,.041,.002]),fn(e,o,.011,.006,[0,0,-.213]),J(e,i,[.075,.018,.025],[0,-.205,.035]),s){for(let a=0;a<5;a+=1)J(e,o,[.006,.04,.007],[.035,0,-.005-a*.012]);J(e,st(9673628,.35,.7),[.008,.008,.045],[.034,.018,-.12])}return e}function Jw(s){const e=new Gt,t=st(3160125,.4,.7),i=st(2107178,.8,.12),o=st(1514784,.5,.58),a=st(5792359,.32,.82);if(J(e,t,[.068,.06,.21],[0,0,-.095]),J(e,i,[.066,.06,.18],[0,-.055,-.07]),J(e,i,[.066,.15,.08],[0,-.135,.02],[-.24,0,0]),J(e,i,[.07,.025,.04],[0,-.035,.04]),J(e,i,[.012,.025,.055],[.041,-.03,-.005]),J(e,i,[.052,.012,.09],[0,-.095,-.065]),J(e,i,[.012,.052,.012],[0,-.07,-.105]),fn(e,o,.023,.2,[0,0,-.3]),fn(e,a,.017,.008,[0,0,-.404]),J(e,t,[.014,.028,.018],[0,.043,-.19]),J(e,t,[.052,.018,.02],[0,.04,.002]),s){for(let c=0;c<4;c+=1)J(e,a,[.006,.036,.008],[.036,0,-.005-c*.014]);fn(e,o,.025,.012,[0,0,-.215]),J(e,a,[.007,.012,.04],[.037,.012,-.12])}return e}function Qw(s){const e=new Gt,t=st(10199972,.28,.82),i=st(6450287,.32,.8),o=st(2106920,.78,.18);if(J(e,t,[.08,.08,.3],[0,0,-.11]),J(e,i,[.066,.055,.1],[0,-.005,-.305]),J(e,i,[.035,.014,.31],[0,.047,-.12]),J(e,t,[.075,.06,.22],[0,-.065,-.075]),J(e,o,[.07,.17,.085],[0,-.15,.035],[-.18,0,0]),J(e,i,[.058,.014,.105],[0,-.105,-.075]),J(e,i,[.014,.06,.014],[0,-.075,-.125]),J(e,i,[.02,.032,.025],[0,.052,-.32]),J(e,i,[.06,.022,.022],[0,.052,.025]),fn(e,o,.014,.006,[0,-.005,-.358]),J(e,o,[.076,.02,.026],[0,-.24,.055]),s){for(let a=0;a<5;a+=1)J(e,i,[.007,.05,.008],[.042,0,.015-a*.014]);J(e,i,[.008,.018,.12],[.043,-.02,-.19]),J(e,st(12699590,.22,.9),[.05,.008,.16],[0,.044,-.15])}return e}function eT(s){const e=new Gt,t=st(11121846,.26,.86),i=st(14015965,.2,.9),o=st(2436139,.88,.08),a=st(4279115,.42,.7),c=_a(e,Xw,t);if(c.position.z=-.035,J(e,i,[.014,.008,.22],[0,-.022,-.145],[.04,0,0]),J(e,a,[.12,.025,.035],[0,0,-.022]),J(e,o,[.05,.055,.17],[0,0,.075]),J(e,a,[.056,.06,.03],[0,0,.175]),s){for(let d=0;d<4;d+=1)J(e,a,[.054,.059,.009],[0,0,.02+d*.037]);J(e,i,[.014,.01,.09],[0,.036,-.075])}return e}const tT={ak47:Yw,m4a4:$w,awp:Kw,glock:Zw,usp:Jw,deagle:Qw,knife:eT};function $g(s,e=!1){const t=tT[s](e);return t.name=`${s}${e?"-view-model":"-world-model"}`,t.userData.weaponId=s,e&&t.traverse(i=>{i instanceof Yt&&(i.castShadow=!1,i.receiveShadow=!1)}),t}function nT(s){const e=Mc(s),t=new Gt;t.name=`${s}-character`,t.userData.team=s,t.userData.eyeHeight=1.62;const i=new Gt;t.add(i),J(i,e.clothDark,[.37,.18,.24],[0,.99,0]),J(i,e.vest,[.42,.065,.27],[0,1.035,0]),J(i,e.armor,[.09,.11,.055],[-.12,.965,-.14]),J(i,e.armor,[.09,.11,.055],[.12,.965,-.14]);const o=X0(i,s,-1),a=X0(i,s,1),c=[o,a],d=new Gt;d.position.y=1.02,i.add(d),J(d,e.cloth,[.4,.42,.22],[0,.21,0]),J(d,e.vest,[.36,.33,.045],[0,.215,-.13]),J(d,e.vest,[.35,.34,.045],[0,.21,.13]),J(d,e.armor,[.3,.3,.12],[0,.2,.18]),J(d,e.armor,[.1,.105,.055],[-.095,.14,-.165]),J(d,e.armor,[.1,.105,.055],[.095,.14,-.165]),J(d,e.armor,[.09,.075,.05],[0,.3,-.16]),J(d,e.accent,[.065,.04,.012],[.105,.345,-.157]),J(d,e.vest,[.055,.3,.04],[-.15,.23,-.145],[0,0,-.12]),J(d,e.vest,[.055,.3,.04],[.15,.23,-.145],[0,0,.12]);const f=qw(d,s),h=j0(d,s,1,!0),m=j0(d,s,-1,!1),x=[h,m],_=new Gt;_.position.set(.04,.3,-.27),d.add(_);let S,M=0,w=0,y=0,v=0,P=.3,C=-.27;function E(U){S!==U&&(S=U,_.clear(),_.add($g(U)),v=0,h.baseX=.3,h.baseElbow=1.7,h.baseZ=-.5,U==="knife"?(m.baseX=.08,m.baseElbow=.15,m.baseZ=.08,P=.27,C=-.24):U==="glock"||U==="usp"||U==="deagle"?(m.baseX=.35,m.baseElbow=1.5,m.baseZ=.9,P=.3,C=-.27):(m.baseX=1,m.baseElbow=.45,m.baseZ=.72,P=.3,C=-.27))}E(s==="CT"?"m4a4":"ak47");function O(U,F){const V=Math.min(.1,Math.max(0,U));y=Vn.clamp(y+V*(F.dead?2.7:-3.8),0,1);const b=y*y*(3-2*y),R=Math.max(0,F.speed),H=F.moving&&!F.dead?Vn.clamp(R/4.5,.2,1):0;w+=(H-w)*(1-Math.exp(-V*10)),w>.001&&(M+=V*(4.8+Math.min(R,7)*1.2));const Y=F.firing&&!F.dead?1:0;v+=(Y-v)*(1-Math.exp(-V*(Y>0?32:14)));const ee=Math.sin(M),de=Math.abs(Math.cos(M))*.012*w,se=Vn.clamp(F.pitch,-1.2,1.2)*(1-b);i.rotation.x=b*Math.PI*.5,i.position.y=b*.24,d.position.y=1.02+de*(1-b),d.rotation.x=se*.26+v*.012,d.rotation.z=ee*.01*w*(1-b),f.rotation.x=se*.44-b*.08,f.rotation.z=-ee*.008*w*(1-b);for(const te of c){const le=M+te.offset,W=Math.sin(le)*w*(1-b),fe=Math.max(0,Math.sin(le+.45))*w*(1-b);te.hip.rotation.x=W*.52,te.knee.rotation.x=-fe*.62,te.boot.rotation.x=-te.hip.rotation.x*.5-te.knee.rotation.x*.4}for(const te of x){const le=Math.sin(M+(te.primary?0:Math.PI))*w*(1-b);te.root.rotation.x=te.baseX+le*.04,te.root.rotation.z=te.baseZ+ee*(te.primary?.012:-.012)*w*(1-b),te.elbow.rotation.x=te.baseElbow-le*.025}_.position.set(.04+ee*.004*w*(1-b),P+de+v*.008,C+v*.026),_.rotation.set(v*.09,ee*.008*w*(1-b),-ee*.012*w*(1-b))}return{group:t,setWeapon:E,update:O}}function iT(){const s=new Gt;s.name="bomb";const e=st(7828301,.94),t=st(2567465,.88),i=st(2107173,.72,.18),o=st(9318440,.72),a=st(12163653,.72),c=new An({color:16724004,emissive:16716296,roughness:.35}),d=new An({color:3235147,emissive:1809253,emissiveIntensity:.6,roughness:.42});for(let _=0;_<3;_+=1)J(s,e,[.078,.08,.19],[(_-1)*.083,.04,0]);J(s,t,[.27,.015,.018],[0,.087,-.06]),J(s,t,[.27,.015,.018],[0,.087,.06]),J(s,t,[.018,.085,.2],[-.045,.043,0]),J(s,i,[.18,.05,.115],[.025,.125,-.005]),J(s,d,[.112,.008,.056],[.012,.154,-.018]),J(s,st(10147495,.45,0,3766093),[.012,.006,.034],[-.025,.16,-.018]),J(s,st(10147495,.45,0,3766093),[.012,.006,.034],[.005,.16,-.018]),J(s,st(10147495,.45,0,3766093),[.012,.006,.034],[.035,.16,-.018]);const f=J(s,c,[.018,.012,.018],[.09,.156,.025]);J(s,i,[.012,.11,.012],[-.075,.17,.035]),J(s,st(5857627,.5,.6),[.02,.015,.02],[-.075,.228,.035]);const h=new If([new D(-.05,.13,-.04),new D(-.12,.16,-.07),new D(-.135,.1,-.01),new D(-.09,.085,.075)]);_a(s,new gc(h,12,.004,5,!1),o);const m=new If([new D(.075,.13,-.045),new D(.135,.15,-.075),new D(.14,.09,.005),new D(.085,.085,.07)]);_a(s,new gc(m,12,.004,5,!1),a);function x(_){const S=Math.sin(_*Math.PI*4);f.visible=S>0,c.emissiveIntensity=S>0?3:.15,d.emissiveIntensity=.55+Math.sin(_*2)*.12}return{group:s,update:x}}const Zs=new An({color:12362876,roughness:.96}),Js=new An({color:13284751,roughness:.94}),Jr=new An({color:10191711,roughness:1}),q0=new An({color:14009246,roughness:.9}),Y0=new An({color:7491898,roughness:.88}),Qs=new An({color:4667178,roughness:.9}),$0=new An({color:4475720,roughness:.7,metalness:.35}),rT=new An({color:2699052,roughness:.85}),sT=new An({color:8810578,roughness:.9});function Bn(s,e,t,i){const o=new Yt(new Ji(s,e,t),i);return o.castShadow=!0,o.receiveShadow=!0,o}function ta(s,e,t,i,o,a="#e7d7ad"){const c=document.createElement("canvas");c.width=512,c.height=256;const d=c.getContext("2d");d.clearRect(0,0,512,256),d.strokeStyle=a,d.lineWidth=9,d.globalAlpha=.82,d.strokeRect(20,20,472,216),d.fillStyle=a,d.font="bold 142px Arial",d.textAlign="center",d.textBaseline="middle",d.fillText(e,256,t?115:135),t&&(d.font="bold 29px Arial",d.fillText(t,256,211));const f=new vy(c);f.colorSpace=Hn;const h=new so({map:f,transparent:!0,depthWrite:!1,side:Ri}),m=new Yt(new cs(3.8,1.9),h);m.position.copy(i),m.rotation.y=o,s.add(m)}function oT(){const s=new Gt,e=[];s.name="Dust2 procedural map";const t=new Yt(new cs(96,94),new An({color:11048304,roughness:1}));t.rotation.x=-Math.PI/2,t.position.set(0,-.025,0),t.receiveShadow=!0,s.add(t);const i=new An({color:10193257,roughness:1}),o=[[0,34,18,17],[36,7,13,38],[31,-28,27,22],[-36,-25,20,20],[-39,10,9,36],[0,-35,22,16],[0,5,9,42],[20,-12,23,8]];for(const[y,v,P,C]of o){const E=new Yt(new cs(P,C),i);E.rotation.x=-Math.PI/2,E.position.set(y,-.012,v),E.receiveShadow=!0,s.add(E)}const a=(y,v,P,C,E,O,U=0)=>{e.push({box:new ds(new D(y,U,P),new D(v,U+E,C)),kind:O})},c=(y,v,P,C,E,O=Zs,U="building")=>{const F=Bn(v-y,E,C-P,O);if(F.position.set((y+v)/2,E/2,(P+C)/2),s.add(F),a(y,v,P,C,E,U),U==="building"){const V=Bn(v-y+.16,.16,C-P+.16,q0);V.position.set((y+v)/2,E-.12,(P+C)/2),s.add(V)}return F};c(-47,-45.8,-46,47,7,Jr,"boundary"),c(45.8,47,-46,47,7,Js,"boundary"),c(-47,47,45.8,47,7,Zs,"boundary"),c(-47,47,-46,-44.8,7,Jr,"boundary"),c(-34,-5,-12,24,6.8,Zs),c(6,30,-7,25,7.2,Js),c(-21,-6,-28,-12,5.7,Jr),c(5,15,-29,-16,5.4,Zs),c(-45.8,-43.6,10,17,4.4,Js),c(-15,-5,36,45.8,5.2,Js),c(12,24,38,45.8,4.8,Zs),c(38,45.8,34,45.8,5.7,Js),c(-45.8,-37,-44.8,-39,4.2,Zs),c(31,45.8,-44.8,-40,4.6,Js);const d=Bn(11.8,.28,34,Jr);d.position.set(-39.9,3.35,6.5),s.add(d),a(-45.8,-34,-10.5,23.5,.28,"roof",3.21);for(const y of[-8,2,12,22]){const v=Bn(11.5,.22,.24,Qs);v.position.set(-39.9,3.12,y),s.add(v)}const f=(y,v,P=1.65,C=1.45)=>{const E=c(y-P/2,y+P/2,v-P/2,v+P/2,C,sT,"crate"),O=[[P+.035,.11,.08,0,C*.2,P/2+.02],[P+.035,.11,.08,0,C*.8,P/2+.02],[.09,C,.08,-P*.38,C/2,P/2+.025],[.09,C,.08,P*.38,C/2,P/2+.025]];for(const[U,F,V,b,R,H]of O){const Y=Bn(U,F,V,Qs);Y.position.set(y+b,R,v+H),s.add(Y)}return E};f(38.7,-22.5,2.1,1.65),f(35.8,-24.8,1.7,1.35),f(25.2,-34.4,1.8,1.5),f(40.5,11.5,1.8,1.4),f(32.8,24.3,1.55,1.3),f(-38.5,-26.3,2,1.55),f(-27.2,-19.2,1.7,1.35),f(-40.2,18.3,1.5,1.3),f(-2.8,31.4,1.55,1.3),f(5.2,-37.5,1.7,1.4);const h=4.2;c(-5.05,-1.25,h-.2,h+.2,3.8,Y0,"door"),c(1.25,6.05,h-.2,h+.2,3.8,Y0,"door"),c(-6,-5.02,h-.34,h+.34,4.8,Jr,"door"),c(6.02,7,h-.34,h+.34,4.8,Jr,"door");for(const y of[-1,1]){const v=y<0?-3.15:3.65;for(const C of[.55,1.65,2.75]){const E=Bn(3.1,.07,.07,Qs);E.position.set(v,C,h-.245),s.add(E)}for(const C of[-1.25,1.25]){const E=Bn(.1,3.5,.08,Qs);E.position.set(v+C,1.85,h-.25),s.add(E)}const P=Bn(.1,.42,.13,$0);P.position.set(y*1.48,1.5,h-.29),s.add(P)}const m=Bn(13,1.05,.75,Jr);m.position.set(.5,4.3,h),s.add(m);const x=[[-4.96,3.5,12,Math.PI/2,0],[-4.96,3.5,18,Math.PI/2,0],[5.96,4.1,9,-Math.PI/2,0],[5.96,4.1,17,-Math.PI/2,0],[15.04,3.3,-23,Math.PI/2,0],[-21.04,3.1,-19,-Math.PI/2,0]];for(const[y,v,P,C]of x){const E=Bn(.09,1.5,1.75,q0);E.position.set(y,v,P),s.add(E);const O=Bn(.105,1.15,1.4,rT);O.position.set(y+(C>0?.02:-.02),v,P),s.add(O);for(const U of[-.38,0,.38]){const F=Bn(.13,1.18,.045,$0);F.position.set(y+(C>0?.04:-.04),v,P+U),s.add(F)}}for(const[y,v,P]of[[-3,40,6],[42,28,7],[-43,-9,6]]){const C=Bn(.16,P,.16,Qs);C.position.set(y,P/2,v),s.add(C);const E=Bn(2.1,.13,.13,Qs);E.position.set(y,P-.45,v),s.add(E)}ta(s,"A","BOMBSITE",new D(45.74,3.2,-27),-Math.PI/2,"#d9b687"),ta(s,"B","BOMBSITE",new D(-45.74,3.2,-22),Math.PI/2,"#d9b687"),ta(s,"A →","LONG",new D(29.94,2.8,19),-Math.PI/2),ta(s,"B →","TUNNELS",new D(-34.06,2.7,14),Math.PI/2),ta(s,"MID","DOUBLE DOORS",new D(-4.94,4.6,2),Math.PI/2);const _=[{id:"t",position:new D(1,0,34),links:["tMid","tLong","tB"]},{id:"tMid",position:new D(0,0,27),links:["t","midN","tLong","tB"]},{id:"midN",position:new D(0,0,13),links:["tMid","doorN"]},{id:"doorN",position:new D(0,0,7),links:["midN","doorS"]},{id:"doorS",position:new D(0,0,1),links:["doorN","mid"]},{id:"mid",position:new D(0,0,-8),links:["doorS","ctMid","catEntry"]},{id:"ctMid",position:new D(0,0,-22),links:["mid","ct"]},{id:"ct",position:new D(0,0,-36),links:["ctMid","ctA","ctB"]},{id:"tLong",position:new D(20,0,31),links:["t","tMid","longN"]},{id:"longN",position:new D(36,0,29),links:["tLong","long1"]},{id:"long1",position:new D(35,0,17),links:["longN","long2"]},{id:"long2",position:new D(36,0,1),links:["long1","longA"]},{id:"longA",position:new D(36,0,-14),links:["long2","a","aCross"]},{id:"aCross",position:new D(29,0,-20),links:["longA","a","cat"]},{id:"a",position:new D(32,0,-30),links:["aCross","longA","aSouth"]},{id:"aSouth",position:new D(28,0,-36.5),links:["a","ctA"]},{id:"ctA",position:new D(16,0,-36.5),links:["aSouth","ct"]},{id:"catEntry",position:new D(9,0,-10),links:["mid","catTurn"]},{id:"catTurn",position:new D(22,0,-10),links:["catEntry","cat"]},{id:"cat",position:new D(23,0,-20),links:["catTurn","aCross","a"]},{id:"tB",position:new D(-20,0,32),links:["t","tMid","bN"]},{id:"bN",position:new D(-39,0,30),links:["tB","b1"]},{id:"b1",position:new D(-39,0,20),links:["bN","b2"]},{id:"b2",position:new D(-39,0,1),links:["b1","bExit"]},{id:"bExit",position:new D(-39,0,-14),links:["b2","b"]},{id:"b",position:new D(-33,0,-27),links:["bExit","bSouth"]},{id:"bSouth",position:new D(-23,0,-35),links:["b","ctB"]},{id:"ctB",position:new D(-12,0,-36),links:["bSouth","ct"]}],S={A:{name:"A点",x1:20,x2:44,z1:-38,z2:-18},B:{name:"B点",x1:-43,x2:-24,z1:-35,z2:-17}},M=[{name:"T 出生点",x1:-8,x2:11,z1:32,z2:45},{name:"CT 出生点",x1:-8,x2:14,z1:-44,z2:-31},{name:"A大",x1:30,x2:45,z1:-17,z2:32},{name:"猫道",x1:7,x2:29,z1:-23,z2:-7},{name:"B洞",x1:-45,x2:-34,z1:-16,z2:32},{name:"中门",x1:-5,x2:6,z1:-13,z2:29},S.A,S.B,{name:"A 连接",x1:14,x2:25,z1:-40,z2:-29},{name:"B 连接",x1:-25,x2:-7,z1:-43,z2:-28},{name:"T 广场",x1:-34,x2:30,z1:25,z2:38}],w={T:[[-3,40],[0,40],[3,40],[-3,36.5],[3,36.5]].map(([y,v])=>new D(y,0,v)),CT:[[-3,-41],[0,-41],[3,-41],[-2,-37.5],[8,-34]].map(([y,v])=>new D(y,0,v))};return{group:s,colliders:e,nodes:_,zones:M,bombSites:S,spawns:w,bounds:{minX:-45.8,maxX:45.8,minZ:-44.8,maxZ:45.8}}}function kf(s,e,t,i,o=.36,a=1.76){for(const c of s.colliders){const d=c.box;if(i>=d.max.y-.035||i+a<=d.min.y)continue;const f=Math.max(d.min.x,Math.min(e,d.max.x)),h=Math.max(d.min.z,Math.min(t,d.max.z)),m=e-f,x=t-h;if(m*m+x*x<o*o)return!0}return!1}function aT(s,e,t,i,o=.36){const a=e.x+t;kf(s,a,e.z,e.y,o)||(e.x=a);const c=e.z+i;kf(s,e.x,c,e.y,o)||(e.z=c)}function lT(s,e,t,i=.32){let o=0;if(t<=0)return 0;for(const{box:a}of s.colliders)a.max.y>e.y+.06||a.max.y<t-.01||e.x<a.min.x-i||e.x>a.max.x+i||e.z<a.min.z-i||e.z>a.max.z+i||(o=Math.max(o,a.max.y));return o}function Kg(s,e,t,i){const o=new yc(e,t);let a=i,c=null;for(const{box:d}of s.colliders){const f=o.intersectBox(d,new D);if(!f)continue;const h=f.distanceTo(e);h<a&&h>.015&&(a=h,c=f)}if(t.y<-1e-4){const d=-e.y/t.y;d>0&&d<a&&(a=d,c=e.clone().addScaledVector(t,d))}return c?{distance:a,point:c}:null}function Bd(s,e,t){const i=t.clone().sub(e),o=i.length();if(o<.001)return!0;const a=Kg(s,e,i.multiplyScalar(1/o),o);return!a||a.distance>=o-.12}function vc(s,e,t,i=.4){const o=e.distanceTo(t),a=Math.max(1,Math.ceil(o/.35));for(let c=0;c<=a;c++){const d=c/a,f=Vn.lerp(e.x,t.x,d),h=Vn.lerp(e.z,t.z,d);if(kf(s,f,h,0,i))return!1}return!0}function cT(s,e,t){for(const i of s.zones)if(e>=i.x1&&e<=i.x2&&t>=i.z1&&t<=i.z2)return i.name;return"Dust2"}function K0(s,e,t){for(const i of["A","B"]){const o=s.bombSites[i];if(e>=o.x1&&e<=o.x2&&t>=o.z1&&t<=o.z2)return i}return null}function Z0(s,e){let t=null,i=1/0,o=s.nodes[0],a=1/0;for(const c of s.nodes){const d=c.position.distanceToSquared(e);d<a&&(o=c,a=d),d<i&&vc(s,e,c.position)&&(t=c,i=d)}return t??o}function Vd(s,e){return s.position.distanceTo(e.position)}function uT(s,e,t){if(vc(s,e,t))return[t.clone()];const i=Z0(s,e),o=Z0(s,t),a=new Set([i.id]),c=new Map,d=new Map([[i.id,0]]),f=new Map([[i.id,Vd(i,o)]]),h=new Map(s.nodes.map(m=>[m.id,m]));for(;a.size;){let m="",x=1/0;for(const S of a){const M=f.get(S)??1/0;M<x&&(m=S,x=M)}if(m===o.id){const S=[m];for(;c.has(S[0]);)S.unshift(c.get(S[0]));const M=S.map(w=>h.get(w).position.clone());return M.push(t.clone()),dT(s,e,M)}a.delete(m);const _=h.get(m);for(const S of _.links){const M=h.get(S);if(!M||!vc(s,_.position,M.position))continue;const w=(d.get(m)??1/0)+Vd(_,M);w>=(d.get(S)??1/0)||(c.set(S,m),d.set(S,w),f.set(S,w+Vd(M,o)),a.add(S))}}return[i.position.clone(),t.clone()]}function dT(s,e,t){const i=[];let o=e.clone(),a=0;for(;a<t.length;){let c=a;for(let d=a;d<t.length&&vc(s,o,t[d]);d++)c=d;i.push(t[c]),o=t[c],a=c+1}return i}function ec(s,e,t){const a=e==="CT"?["a","aCross","b","ctMid","longA","cat","bExit"]:["long1","longA","catTurn","midN","b1","b2","aCross"],c=a[Math.floor(t()*a.length)];return s.nodes.find(d=>d.id===c).position.clone()}const gn={ak47:{id:"ak47",name:"AK-47",shortName:"AK",slot:"primary",damage:40,interval:.105,magazine:30,reserve:90,reloadTime:2.35,range:90,spread:.006,recoil:.029,automatic:!0,moveSpeed:4.5,tracer:16761707},m4a4:{id:"m4a4",name:"M4A4",shortName:"M4",slot:"primary",damage:32,interval:.082,magazine:30,reserve:90,reloadTime:2.1,range:85,spread:.004,recoil:.014,automatic:!0,moveSpeed:4.65,tracer:11459839},awp:{id:"awp",name:"AWP",shortName:"AWP",slot:"primary",damage:160,interval:1.45,magazine:5,reserve:15,reloadTime:3.2,range:130,spread:.001,recoil:.065,automatic:!1,moveSpeed:3.9,tracer:14217983},glock:{id:"glock",name:"Glock-18",shortName:"GLOCK",slot:"secondary",damage:26,interval:.16,magazine:20,reserve:80,reloadTime:1.8,range:45,spread:.009,recoil:.012,automatic:!1,moveSpeed:5,tracer:16766362},usp:{id:"usp",name:"USP-S",shortName:"USP",slot:"secondary",damage:25,interval:.18,magazine:12,reserve:48,reloadTime:1.9,range:48,spread:.006,recoil:.011,automatic:!1,moveSpeed:5,tracer:13232639},deagle:{id:"deagle",name:"Desert Eagle",shortName:"DEAGLE",slot:"secondary",damage:44,interval:.28,magazine:7,reserve:35,reloadTime:2.15,range:55,spread:.008,recoil:.031,automatic:!1,moveSpeed:4.9,tracer:16769187},knife:{id:"knife",name:"战术刀",shortName:"KNIFE",slot:"knife",damage:60,interval:.55,magazine:1,reserve:0,reloadTime:0,range:2.25,spread:0,recoil:0,automatic:!1,moveSpeed:5.5,tracer:16777215}},J0={head:2,chest:1,stomach:1.1,arm:.9,leg:.85};function Hd(s){return s==="T"?"glock":"usp"}function Gd(s){return s==="T"?"ak47":"m4a4"}function Tr(s){const e=gn[s];return{id:s,ammo:e.magazine,reserve:e.reserve,reloadRemaining:0}}function fT(s,e,t,i,o,a=.5){const c=Math.max(.72,1-Math.max(0,i-o*.45)/o*.45);let d=s*J0[e]*c,f=t;return t>0&&e!=="leg"&&(d*=a,f=Math.max(0,t-s*J0[e]*.35)),{damage:Math.max(1,Math.round(d)),armor:Math.round(f)}}const tc=new D(0,1,0),lc=1.62,Q0=.34,eg=3.2,tg=5,ng=105,hT=["Vex","Rook","Sable","Ghost","Khan","Flint","Nova","Ash","Bolt"],pT=[{zone:"head",center:new D(0,1.62,0),size:new D(.29,.32,.27)},{zone:"chest",center:new D(0,1.25,0),size:new D(.46,.42,.3)},{zone:"stomach",center:new D(0,.96,0),size:new D(.4,.22,.28)},{zone:"arm",center:new D(-.31,1.19,-.13),size:new D(.17,.5,.22)},{zone:"arm",center:new D(.31,1.19,-.13),size:new D(.17,.5,.22)},{zone:"leg",center:new D(-.12,.45,0),size:new D(.18,.82,.22)},{zone:"leg",center:new D(.12,.45,0),size:new D(.18,.82,.22)}];function Wd(s,e){return Math.atan2(Math.sin(e-s),Math.cos(e-s))}function Qr(s){return s.position.clone().add(new D(0,lc,0))}function na(s){return new D(-Math.sin(s.yaw),0,-Math.cos(s.yaw))}function ig(s){const e=gn[s.id];return{id:s.id,name:e.name,slot:e.slot,ammo:s.ammo,reserve:s.reserve,reloading:s.reloadRemaining>0,reloadProgress:s.reloadRemaining>0?1-s.reloadRemaining/e.reloadTime:0}}class mT{container;onSnapshot;scene=new fy;camera=new Jn(74,1,.035,190);renderer;map=oT();audio=new Hw;actors=[];keys=new Set;viewRig=new Gt;bombModel=iT();tracers=[];impacts=[];bomb={status:"carried",carrierId:null,position:new D,site:null,timer:40};viewWeapon=null;muzzleFlash;controlledId=0;spectatorId=null;playerTeam="CT";phase="menu";paused=!1;disposed=!1;frameId=0;previousTime=performance.now();accumulator=0;elapsed=0;roundElapsed=0;snapshotTimer=0;round=0;roundTime=ng;score={CT:0,T:0};roundWinner=null;roundReason="";killfeed=[];killfeedTimes=[];feedId=0;notice="";noticeAt=0;hitMarkerAt=0;damageAt=0;mouseDown=!1;mousePressed=!1;mouseReadyAt=0;skipNextMouseMove=!0;bobPhase=0;viewKick=0;switchKick=0;interaction=null;visibleEnemies=[];visibilityTimer=0;resizeObserver;constructor(e,t){this.container=e,this.onSnapshot=t,this.renderer=new zw({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=og,this.renderer.outputColorSpace=Hn,this.renderer.toneMapping=lg,this.renderer.toneMappingExposure=1.08,this.renderer.domElement.tabIndex=0,this.renderer.domElement.setAttribute("aria-label","第一人称 3D 战场"),e.appendChild(this.renderer.domElement),this.scene.background=new Tt(10333609),this.scene.fog=new $f(11776672,55,145);const i=new Zy(14281968,7166272,2.15);this.scene.add(i);const o=new t1(16769973,3.15);o.position.set(-35,58,22),o.castShadow=!0,o.shadow.mapSize.set(2048,2048),o.shadow.camera.left=-62,o.shadow.camera.right=62,o.shadow.camera.top=62,o.shadow.camera.bottom=-62,o.shadow.camera.near=1,o.shadow.camera.far=135,o.shadow.bias=-3e-4,this.scene.add(o);const a=new Yt(new nh(3.5,16,12),new so({color:16770224,fog:!1}));a.position.set(-72,72,-115),this.scene.add(a),this.scene.add(this.map.group),this.scene.add(this.bombModel.group),this.bombModel.group.visible=!1,this.scene.add(this.camera),this.camera.add(this.viewRig),this.createViewArms(),this.muzzleFlash=new Yt(new mc(.065,0),new so({color:16766346,transparent:!0,opacity:.95,depthTest:!1})),this.muzzleFlash.visible=!1,this.viewRig.add(this.muzzleFlash),this.createActors(),this.resizeObserver=new ResizeObserver(this.resize),this.resizeObserver.observe(e),this.resize(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("pointerlockchange",this.onPointerLockChange),document.addEventListener("pointerlockerror",this.onPointerLockError),this.renderer.domElement.addEventListener("mousedown",this.onMouseDown),window.addEventListener("mouseup",this.onMouseUp),this.renderer.domElement.addEventListener("contextmenu",this.onContextMenu),this.renderer.domElement.addEventListener("click",this.onCanvasClick),this.camera.position.set(44,35,46),this.camera.lookAt(0,0,0),this.emitSnapshot(),this.frameId=requestAnimationFrame(this.animate)}createViewArms(){const e=new An({color:3427154,roughness:.95,depthTest:!1}),t=new An({color:2501417,roughness:.9,depthTest:!1}),i=(o,a,c)=>{const d=new Yt(new Ji(.09,.09,.42),e);d.position.set(...o),d.rotation.set(...a),d.renderOrder=20,this.viewRig.add(d);const f=new Yt(new Ji(.085,.075,.12),t);f.position.set(...c),f.rotation.set(-.18,0,0),f.renderOrder=20,this.viewRig.add(f)};i([.38,-.5,-.2],[-.5,.18,-.12],[.26,-.35,-.43]),i([.01,-.49,-.34],[-.34,-.5,.28],[.18,-.31,-.61])}createActors(){for(const e of this.actors)this.scene.remove(e.model.group);this.actors.length=0;for(let e=0;e<10;e++){const t=e<5?"CT":"T",i=nT(t);this.scene.add(i.group);const o={id:e,name:e===0||e===5?"YOU":hT[e-(e>5?1:0)],team:t,position:new D,velocityY:0,yaw:t==="CT"?Math.PI:0,pitch:0,recoilPitch:0,recoilYaw:0,health:100,armor:0,alive:!0,onGround:!0,moving:!1,moveAmount:0,kills:0,deaths:0,weapons:{secondary:Tr(Hd(t)),knife:Tr("knife")},slot:"secondary",cooldown:0,switchCooldown:0,bloom:0,scoped:!1,firingFlash:0,stepDistance:0,interaction:null,interactionProgress:0,model:i,ai:{think:Math.random()*.2,reaction:.25,targetId:null,lastSeen:null,goal:new D,path:[],pathIndex:0,repath:0,strafe:e%2?1:-1,strafeTimer:1,stuck:0,lastPosition:new D}};this.actors.push(o)}this.resetActorPositions()}resetActorPositions(){for(const e of this.actors){const t=e.id%5;e.position.copy(this.map.spawns[e.team][t]),e.model.group.position.copy(e.position),e.model.group.rotation.set(0,e.yaw,0),e.model.group.visible=this.phase==="menu"}}start(e,t){this.audio.resume(),this.playerTeam=e,this.controlledId=e==="CT"?0:5,this.spectatorId=null,this.round=0,this.score={CT:0,T:0},this.killfeed=[],this.killfeedTimes=[];for(const i of this.actors)i.kills=0,i.deaths=0;this.startRound(t==="rifle"),this.requestPointerLock()}nextRound(){this.phase==="roundEnd"&&(this.audio.resume(),this.startRound(!0),this.requestPointerLock())}startRound(e){this.round+=1,this.phase="playing",this.paused=!1,this.roundWinner=null,this.roundReason="",this.roundTime=ng,this.roundElapsed=0,this.spectatorId=null,this.notice=e?"主武器已配发 · 购买时段可更换装备":"手枪局 · 全员无护甲，仅配备默认手枪",this.noticeAt=Math.max(.001,this.elapsed),this.interaction=null,this.visibleEnemies=[],this.hitMarkerAt=0,this.damageAt=0,this.mouseDown=!1,this.mousePressed=!1;for(const i of this.actors){if(i.position.copy(this.map.spawns[i.team][i.id%5]),i.velocityY=0,i.yaw=i.team==="CT"?Math.PI:0,i.pitch=0,i.recoilPitch=0,i.recoilYaw=0,i.health=100,i.armor=e?100:0,i.alive=!0,i.onGround=!0,i.moving=!1,i.weapons={secondary:Tr(Hd(i.team)),knife:Tr("knife")},e){const o=i.id%5===3?"awp":Gd(i.team);i.weapons.primary=Tr(o)}i.slot=e?"primary":"secondary",i.cooldown=0,i.switchCooldown=0,i.bloom=0,i.scoped=!1,i.firingFlash=0,i.interaction=null,i.interactionProgress=0,i.ai.targetId=null,i.ai.lastSeen=null,i.ai.path=[],i.ai.pathIndex=0,i.ai.repath=0,i.ai.think=Math.random()*.15,i.ai.goal.copy(ec(this.map,i.team,Math.random)),i.ai.lastPosition.copy(i.position),i.model.group.visible=!0,i.model.group.rotation.set(0,i.yaw,0),i.model.setWeapon(i.weapons[i.slot].id)}const t=this.actors.filter(i=>i.team==="T")[Math.floor(Math.random()*5)];this.bomb={status:"carried",carrierId:t.id,position:t.position.clone(),site:null,timer:40},this.bombModel.group.visible=!0,this.updateViewWeapon(),this.updateControlledModelVisibility(),this.updateCamera(0),this.emitSnapshot()}onKeyDown=e=>{if(["KeyW","KeyA","KeyS","KeyD","Space","Tab","KeyE"].includes(e.code)&&e.preventDefault(),e.code==="KeyM"&&!e.repeat){this.toggleMute();return}if(this.phase!=="playing")return;if(this.paused){e.code==="Escape"&&!e.repeat&&this.resume();return}if(this.keys.add(e.code),e.repeat)return;if(e.code==="Escape"){document.pointerLockElement===this.renderer.domElement?document.exitPointerLock():(this.paused=!0,this.onBlur(),this.emitSnapshot());return}const t=this.controlled;if(e.code==="KeyF"&&!t.alive){this.takeoverNext();return}t.alive&&(e.code==="KeyR"&&this.startReload(t),e.code==="Digit1"&&this.switchWeapon(t,"primary"),e.code==="Digit2"&&this.switchWeapon(t,"secondary"),e.code==="Digit3"&&this.switchWeapon(t,"knife"),e.code==="KeyB"&&this.canBuy()&&this.cyclePrimary(t),e.code==="KeyN"&&this.canBuy()&&this.cyclePistol(t))};onKeyUp=e=>{this.keys.delete(e.code)};onBlur=()=>{this.keys.clear(),this.mouseDown=!1,this.mousePressed=!1};onMouseMove=e=>{if(document.pointerLockElement!==this.renderer.domElement||this.paused||this.phase!=="playing"||performance.now()<this.mouseReadyAt)return;if(this.skipNextMouseMove){this.skipNextMouseMove=!1;return}if(Math.abs(e.movementX)>240||Math.abs(e.movementY)>240)return;const t=this.controlled;if(!t.alive)return;const i=t.scoped?.00105:.00215,o=e.movementX,a=e.movementY;t.yaw-=o*i,t.pitch=Vn.clamp(t.pitch-a*i,-1.42,1.42)};onMouseDown=e=>{if(this.phase==="playing"){if(document.pointerLockElement!==this.renderer.domElement){this.resume();return}if(!(this.paused||!this.controlled.alive)&&(e.button===0&&(this.mouseDown=!0,this.mousePressed=!0),e.button===2)){const t=this.controlled;t.weapons[t.slot]?.id==="awp"&&t.switchCooldown<=0&&(t.scoped=!t.scoped,this.audio.scope())}}};onMouseUp=e=>{e.button===0&&(this.mouseDown=!1)};onContextMenu=e=>e.preventDefault();onCanvasClick=()=>{this.phase==="playing"&&this.paused&&this.resume()};onPointerLockChange=()=>{this.disposed||this.phase!=="playing"||(document.pointerLockElement===this.renderer.domElement?(this.paused=!1,this.mouseReadyAt=performance.now()+140,this.skipNextMouseMove=!0,this.audio.resume()):(this.paused=!0,this.onBlur()),this.emitSnapshot())};onPointerLockError=()=>{this.phase==="playing"&&(this.paused=!0,this.emitSnapshot())};requestPointerLock(){try{const e=this.renderer.domElement.requestPointerLock();e&&e.catch(()=>{this.paused=!0,this.emitSnapshot()})}catch{this.paused=!0}}resume(){this.phase==="playing"&&(this.audio.resume(),this.paused=!1,this.requestPointerLock(),this.emitSnapshot())}toggleMute(){this.audio.setMuted(!this.audio.isMuted()),this.emitSnapshot()}canBuy(){return this.roundElapsed<12&&!!this.controlled.weapons.primary&&this.phase==="playing"}cyclePrimary(e){const t=[Gd(e.team),Gd(e.team==="CT"?"T":"CT"),"awp"],i=e.weapons.primary?.id,o=t[(t.indexOf(i??t[0])+1)%t.length];e.weapons.primary=Tr(o),e.slot="primary",e.switchCooldown=.45,e.scoped=!1,this.switchKick=1,this.setNotice(`已配备 ${gn[o].name}`),this.audio.reload(0),this.updateViewWeapon()}cyclePistol(e){const t=e.weapons.secondary?.id==="deagle"?Hd(e.team):"deagle";e.weapons.secondary=Tr(t),e.slot="secondary",e.switchCooldown=.35,e.scoped=!1,this.setNotice(`已配备 ${gn[t].name}`),this.audio.reload(0),this.updateViewWeapon()}switchWeapon(e,t){!e.weapons[t]||e.slot===t||(e.slot=t,e.switchCooldown=t==="knife"?.28:.42,e.scoped=!1,e.interaction=null,e.interactionProgress=0,e.id===this.controlledId&&(this.switchKick=1,this.updateViewWeapon()),e.model.setWeapon(e.weapons[t].id))}updateViewWeapon(){this.viewWeapon&&(this.viewRig.remove(this.viewWeapon),this.viewWeapon.traverse(i=>{if(!(i instanceof Yt))return;const o=Array.isArray(i.material)?i.material:[i.material];for(const a of o)a.dispose()}),this.viewWeapon=null);const e=this.cameraActor,t=e.weapons[e.slot];t&&(this.viewWeapon=$g(t.id,!0),this.viewWeapon.traverse(i=>{if(i instanceof Yt){i.renderOrder=21,i.material=Array.isArray(i.material)?i.material.map(a=>a.clone()):i.material.clone();const o=Array.isArray(i.material)?i.material:[i.material];for(const a of o)a.depthTest=!1}}),this.viewRig.add(this.viewWeapon),e.model.setWeapon(t.id))}cycleSpectator(){if(this.controlled.alive)return;const e=this.actors.filter(i=>i.team===this.playerTeam&&i.alive);if(!e.length)return;const t=e.findIndex(i=>i.id===this.spectatorId);this.spectatorId=e[(t+1)%e.length].id,this.updateViewWeapon(),this.emitSnapshot()}takeoverNext(){const e=this.actors.filter(o=>o.team===this.playerTeam&&o.alive);if(!e.length)return;const t=e.findIndex(o=>o.id===this.spectatorId),i=e[(t+1)%e.length];this.controlledId=i.id,this.spectatorId=null,this.playerTeam=i.team,this.setNotice(`已接管 ${i.name} · 继续作战`),this.updateControlledModelVisibility(),this.updateViewWeapon(),this.emitSnapshot()}get controlled(){return this.actors[this.controlledId]}get cameraActor(){return this.controlled.alive||this.spectatorId===null?this.controlled:this.actors[this.spectatorId]??this.controlled}updateControlledModelVisibility(){for(const e of this.actors)e.model.group.visible=e.id!==this.cameraActor.id||!e.alive}animate=e=>{if(this.disposed)return;const t=Math.min(.08,Math.max(0,(e-this.previousTime)/1e3));if(this.previousTime=e,this.phase==="playing"&&!this.paused){this.accumulator+=t;const i=1/60;let o=0;for(;this.accumulator>=i&&o<6;)this.fixedUpdate(i),this.accumulator-=i,o++}this.updateVisuals(t),this.updateCamera(t),this.renderer.render(this.scene,this.camera),this.snapshotTimer-=t,this.snapshotTimer<=0&&(this.emitSnapshot(),this.snapshotTimer=.065),this.frameId=requestAnimationFrame(this.animate)};fixedUpdate(e){if(this.phase!=="playing")return;this.elapsed+=e,this.roundElapsed+=e,this.bomb.status!=="planted"&&(this.roundTime=Math.max(0,this.roundTime-e)),this.interaction=null;for(const i of this.actors){i.cooldown=Math.max(0,i.cooldown-e),i.switchCooldown=Math.max(0,i.switchCooldown-e),i.firingFlash=Math.max(0,i.firingFlash-e),i.recoilPitch=Vn.damp(i.recoilPitch,0,7.5,e),i.recoilYaw=Vn.damp(i.recoilYaw,0,8,e),i.bloom=Math.max(0,i.bloom-e*1.35);for(const o of Object.values(i.weapons))if(!(o.reloadRemaining<=0)&&(o.reloadRemaining=Math.max(0,o.reloadRemaining-e),o.reloadRemaining===0)){const c=gn[o.id].magazine-o.ammo,d=Math.min(c,o.reserve);o.ammo+=d,o.reserve-=d}}const t=this.controlled;t.alive&&this.updateHuman(t,e);for(const i of this.actors)if(i.alive&&i.id!==this.controlledId&&this.updateBot(i,e),this.phase!=="playing")return;for(this.mousePressed=!1,this.pickupBomb(),this.updateBomb(e),this.visibilityTimer-=e,this.visibilityTimer<=0&&(this.updateVisibleEnemies(),this.visibilityTimer=.14);this.killfeedTimes.length&&this.elapsed-this.killfeedTimes[0]>5.5;)this.killfeedTimes.shift(),this.killfeed.shift();this.checkRoundEnd()}updateHuman(e,t){const i=e.weapons[e.slot],o=gn[i.id];let a=0,c=0;this.keys.has("KeyW")&&(a+=1),this.keys.has("KeyS")&&(a-=1),this.keys.has("KeyD")&&(c+=1),this.keys.has("KeyA")&&(c-=1);const d=Math.hypot(a,c)||1;a/=d,c/=d;let f=o.moveSpeed;e.scoped&&(f*=.48),e.interaction&&(f=0);const h=(-Math.sin(e.yaw)*a+Math.cos(e.yaw)*c)*f*t,m=(-Math.cos(e.yaw)*a-Math.sin(e.yaw)*c)*f*t;this.keys.has("Space")&&e.onGround&&!e.interaction&&(e.velocityY=6.15,e.onGround=!1),this.applyMovement(e,h,m,t),this.updateHumanInteraction(e,t),(o.automatic?this.mouseDown:this.mousePressed)&&!e.interaction&&this.tryFire(e,!1),this.mouseDown&&i.ammo===0&&i.reloadRemaining<=0&&this.startReload(e)}applyMovement(e,t,i,o){const a=e.position.x,c=e.position.z;aT(this.map,e.position,t,i,Q0);const d=Math.hypot(e.position.x-a,e.position.z-c);e.moving=d>1e-4,e.moveAmount=d/Math.max(o,.001),e.onGround&&e.velocityY<=0&&(e.velocityY=-2),e.velocityY-=18*o;const f=e.position.y+e.velocityY*o,h=lT(this.map,e.position,f,Q0*.85);e.velocityY<=0&&f<=h?(e.position.y=h,e.velocityY=0,e.onGround=!0):(e.position.y=f,e.onGround=!1),e.stepDistance+=d;const m=e.weapons[e.slot]?.id==="knife"?1.75:2.05;if(e.stepDistance>m&&e.onGround){e.stepDistance=0;const x=e.id===this.cameraActor.id?0:e.position.distanceTo(this.cameraActor.position);x<30&&this.audio.footstep(x)}}updateHumanInteraction(e,t){const i=this.keys.has("KeyE"),o=K0(this.map,e.position.x,e.position.z),a=e.team==="T"&&this.bomb.status==="carried"&&this.bomb.carrierId===e.id&&o!==null,c=e.position.distanceTo(this.bomb.position),d=e.team==="CT"&&this.bomb.status==="planted"&&c<2.15;if(i&&(a||d)&&!e.moving&&e.onGround){const f=a?"plant":"defuse";e.interaction!==f&&(e.interaction=f,e.interactionProgress=0);const h=a?eg:tg;e.interactionProgress+=t,this.interaction={label:a?`正在 ${o} 点安放 C4`:"正在拆除 C4",progress:Math.min(1,e.interactionProgress/h)},e.interactionProgress>=h&&(a?this.plantBomb(e,o):this.defuseBomb(e),e.interaction=null,e.interactionProgress=0)}else e.interaction=null,e.interactionProgress=0,i&&a&&e.moving?this.interaction={label:"保持静止以安放 C4",progress:0}:i&&d&&e.moving&&(this.interaction={label:"保持静止以拆包",progress:0})}startReload(e){const t=e.weapons[e.slot];if(!t)return;const i=gn[t.id];if(i.slot==="knife"||t.reloadRemaining>0||t.ammo>=i.magazine||t.reserve<=0)return;t.reloadRemaining=i.reloadTime,e.scoped=!1,e.interaction=null,e.interactionProgress=0;const o=e.id===this.cameraActor.id?0:e.position.distanceTo(this.cameraActor.position);o<32&&this.audio.reload(o)}updateVisuals(e){for(const t of this.actors)t.model.group.position.copy(t.position),t.alive&&(t.model.group.rotation.y=t.yaw),t.model.update(e,{moving:t.moving,speed:t.moveAmount,pitch:t.pitch+t.recoilPitch,dead:!t.alive,firing:t.firingFlash>0});if(this.bombModel.update(this.elapsed+performance.now()/1e3),this.bomb.status==="carried"){const t=this.bomb.carrierId===null?null:this.actors[this.bomb.carrierId];if(t?.alive){this.bomb.position.copy(t.position),this.bombModel.group.position.copy(t.position).add(new D(0,1.14,0));const i=na(t).multiplyScalar(-.19);this.bombModel.group.position.add(i),this.bombModel.group.rotation.set(.25,t.yaw,0)}}else this.bombModel.group.position.copy(this.bomb.position),this.bombModel.group.rotation.set(0,0,0);this.bombModel.group.visible=this.phase!=="menu"&&this.bomb.status!=="defused"&&this.bomb.status!=="exploded";for(let t=this.tracers.length-1;t>=0;t--){const i=this.tracers[t];i.life-=e;const o=i.line.material;o.opacity=Math.max(0,i.life/.085),i.life<=0&&(this.scene.remove(i.line),i.line.geometry.dispose(),o.dispose(),this.tracers.splice(t,1))}for(let t=this.impacts.length-1;t>=0;t--){const i=this.impacts[t];i.life-=e,i.mesh.scale.multiplyScalar(1+e*4),i.life<=0&&(this.scene.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),this.impacts.splice(t,1))}}updateCamera(e){if(this.phase==="menu"){const a=performance.now()*55e-6;this.camera.position.set(Math.cos(a)*59,38,Math.sin(a)*59),this.camera.lookAt(0,0,-2),this.camera.fov=58,this.camera.updateProjectionMatrix(),this.viewRig.visible=!1;return}const t=this.cameraActor,i=t.moving&&t.onGround?Math.sin(this.bobPhase)*.025:0;this.bobPhase+=e*(t.moving?10.5:3),this.camera.position.copy(t.position).add(new D(0,lc+i,0)),this.camera.rotation.order="YXZ",this.camera.rotation.y=t.yaw+t.recoilYaw,this.camera.rotation.x=t.pitch+t.recoilPitch,this.camera.rotation.z=0;const o=t.scoped&&t.weapons[t.slot]?.id==="awp"?23:74;if(this.camera.fov=Vn.damp(this.camera.fov,o,15,e),this.camera.updateProjectionMatrix(),this.viewRig.visible=t.alive&&!t.scoped,this.viewKick=Vn.damp(this.viewKick,0,15,e),this.switchKick=Vn.damp(this.switchKick,0,9,e),this.viewWeapon){const a=(t.weapons[t.slot]?.reloadRemaining??0)>0;this.viewWeapon.position.set(.25+Math.sin(this.bobPhase*.5)*(t.moving?.009:0),-.23+i*.65-this.switchKick*.23-(a?.09:0),-.46+this.viewKick*.12),this.viewWeapon.rotation.set(this.viewKick*.12+(a?.2:0),0,a?.22:-this.viewKick*.025);const c=t.weapons[t.slot]?.id,d=c==="awp"?1.05:c==="ak47"?.82:c==="m4a4"?.76:c==="knife"?.2:.23;this.muzzleFlash.position.set(.25,-.22,-.46-d),this.muzzleFlash.rotation.z+=e*24,this.muzzleFlash.visible=t.firingFlash>0&&c!=="knife"&&!t.scoped}}updateBot(e,t){e.ai.think-=t,e.ai.repath-=t,e.ai.strafeTimer-=t,e.ai.think<=0&&(this.thinkBot(e),e.ai.think=.12+Math.random()*.1);let i=e.ai.targetId===null?null:this.actors[e.ai.targetId];if(i&&(!i.alive||!Bd(this.map,Qr(e),Qr(i)))&&(e.ai.lastSeen=i.position.clone(),e.ai.targetId=null,i=null,e.ai.repath=0),i){e.ai.reaction-=t;const y=i.position.clone().sub(e.position),v=y.length(),P=Math.atan2(-y.x,-y.z);e.yaw+=Wd(e.yaw,P)*Math.min(1,t*10);const C=Math.atan2(lc-.25-lc,Math.max(.1,Math.hypot(y.x,y.z)));e.pitch=Vn.damp(e.pitch,C,9,t),e.scoped=e.weapons[e.slot]?.id==="awp"&&v>10,e.ai.strafeTimer<=0&&(e.ai.strafe*=-1,e.ai.strafeTimer=.65+Math.random()*1.25);const E=na(e),O=new D(-E.z,0,E.x),U=gn[e.weapons[e.slot].id].moveSpeed;let F=v>17&&e.weapons[e.slot]?.id!=="awp"?.48:v<4?-.3:0;e.weapons[e.slot]?.reloadRemaining&&(F=-.2);const V=O.multiplyScalar(e.ai.strafe*U*.42*t).add(E.multiplyScalar(F*U*t));this.applyMovement(e,V.x,V.z,t),e.ai.reaction<=0&&Math.abs(Wd(e.yaw,P))<.16&&this.tryFire(e,!0),e.weapons[e.slot].ammo===0&&this.startReload(e);return}e.scoped=!1,e.ai.reaction=Math.max(.08,e.ai.reaction);const o=e.weapons[e.slot];o.ammo<gn[o.id].magazine*.35&&o.reloadRemaining<=0&&this.startReload(e);const a=K0(this.map,e.position.x,e.position.z),c=e.team==="T"&&this.bomb.status==="carried"&&this.bomb.carrierId===e.id&&a!==null,d=e.team==="CT"&&this.bomb.status==="planted"&&e.position.distanceTo(this.bomb.position)<2.05;if(c||d){const y=c?"plant":"defuse";e.interaction!==y&&(e.interaction=y,e.interactionProgress=0),e.interactionProgress+=t,e.moving=!1,e.moveAmount=0;const v=c?eg:tg;e.interactionProgress>=v&&(c?this.plantBomb(e,a):this.defuseBomb(e),e.interaction=null,e.interactionProgress=0);return}e.interaction=null,e.interactionProgress=0,(!e.ai.path.length||e.ai.repath<=0)&&(e.ai.path=uT(this.map,e.position,e.ai.goal),e.ai.pathIndex=0,e.ai.repath=1.4+Math.random()*.7);let f=e.ai.path[e.ai.pathIndex];for(;f&&e.position.distanceTo(f)<.72;)e.ai.pathIndex++,f=e.ai.path[e.ai.pathIndex];if(!f){e.moving=!1,e.moveAmount=0,e.ai.lastSeen&&(e.ai.lastSeen=null);return}const h=f.clone().sub(e.position);h.y=0;const m=h.length();if(m<.001)return;h.multiplyScalar(1/m);const x=Math.atan2(-h.x,-h.z);e.yaw+=Wd(e.yaw,x)*Math.min(1,t*7),e.pitch=Vn.damp(e.pitch,0,5,t);const _=na(e),S=gn[o.id].moveSpeed*.82;let M=_.x*S*t,w=_.z*S*t;for(const y of this.actors){if(y.id===e.id||!y.alive||y.team!==e.team)continue;const v=e.position.clone().sub(y.position);v.y=0;const P=v.length();P>.01&&P<.9&&(M+=v.x/P*(.9-P)*t*3,w+=v.z/P*(.9-P)*t*3)}this.applyMovement(e,M,w,t),e.moveAmount<.25?e.ai.stuck+=t:e.ai.stuck=Math.max(0,e.ai.stuck-t*2),e.ai.stuck>.7&&(e.ai.path=[],e.ai.repath=0,e.ai.stuck=0,e.yaw+=e.ai.strafe*.65),e.ai.lastPosition.copy(e.position)}thinkBot(e){const t=this.findVisibleEnemy(e);if(t){e.ai.targetId!==t.id&&(e.ai.reaction=.18+Math.random()*.3),e.ai.targetId=t.id,e.ai.lastSeen=t.position.clone();return}if(e.ai.targetId=null,e.ai.lastSeen&&e.position.distanceTo(e.ai.lastSeen)>2){e.ai.goal.copy(e.ai.lastSeen);return}if(this.bomb.status==="planted"){if(e.team==="CT")e.ai.goal.copy(this.bomb.position);else{const a=this.map.nodes.find(c=>c.id===(this.bomb.site==="A"?"aCross":"b"));e.ai.goal.copy(a.position),e.position.distanceTo(this.bomb.position)<7&&Math.random()<.25&&e.ai.goal.copy(ec(this.map,"CT",Math.random))}return}if(this.bomb.status==="dropped"&&e.team==="T"){e.ai.goal.copy(this.bomb.position);return}if(e.team==="T"){if(this.bomb.carrierId===e.id)e.ai.goal.copy(this.map.nodes.find(a=>a.id===(e.id%2?"a":"b")).position);else{const a=this.bomb.carrierId===null?null:this.actors[this.bomb.carrierId];a&&e.id%3===0?e.ai.goal.copy(a.position):(e.position.distanceTo(e.ai.goal)<2||Math.random()<.08)&&e.ai.goal.copy(ec(this.map,"T",Math.random))}return}const i=["a","longA","cat","b","bExit"],o=this.map.nodes.find(a=>a.id===i[e.id%5]);(e.position.distanceTo(e.ai.goal)<1.7||e.ai.goal.lengthSq()===0)&&e.ai.goal.copy(Math.random()<.72?o.position:ec(this.map,"CT",Math.random))}findVisibleEnemy(e){const t=Qr(e),i=na(e);let o=null,a=1/0;for(const c of this.actors){if(!c.alive||c.team===e.team)continue;const d=c.position.clone().sub(e.position),f=d.length();f>52||f>=a||(d.y=0,!(f>3&&d.normalize().dot(i)<.34)&&Bd(this.map,t,Qr(c))&&(o=c,a=f))}return o}updateVisibleEnemies(){const e=this.actors.filter(i=>i.team===this.playerTeam&&i.alive),t=new Set;for(const i of e){const o=Qr(i);for(const a of this.actors)!a.alive||a.team===this.playerTeam||t.has(a.id)||i.position.distanceTo(a.position)>55||Bd(this.map,o,Qr(a))&&t.add(a.id)}this.visibleEnemies=[...t]}tryFire(e,t){if(!e.alive||e.cooldown>0||e.switchCooldown>0||e.interaction)return;const i=e.weapons[e.slot];if(!i||i.reloadRemaining>0)return;const o=gn[i.id];if(o.slot!=="knife"&&i.ammo<=0){this.startReload(e);return}e.cooldown=o.interval,e.firingFlash=o.slot==="knife"?.12:.055,o.slot!=="knife"&&(i.ammo-=1);const a=e.pitch+e.recoilPitch,c=e.yaw+e.recoilYaw,d=new D(0,0,-1).applyEuler(new yi(a,c,0,"YXZ")).normalize(),f=new D(1,0,0).applyAxisAngle(tc,c),h=new D().crossVectors(f,d).normalize();let m=o.spread+e.bloom*(o.automatic?.018:.01)+(e.moving?.004:0)+(e.onGround?0:.018);o.id==="awp"&&(m=e.scoped&&!e.moving?22e-5:.045),t&&(m+=.0045+e.id%3*.0012);const x=Math.random()*Math.PI*2,_=Math.sqrt(Math.random())*m;d.addScaledVector(f,Math.cos(x)*_).addScaledVector(h,Math.sin(x)*_).normalize(),e.recoilPitch=Math.min(.24,e.recoilPitch+o.recoil*(.82+Math.random()*.35)),e.recoilYaw=Vn.clamp(e.recoilYaw+(Math.random()-.5)*o.recoil*.5,-.08,.08),e.bloom=Math.min(1,e.bloom+(o.automatic?.17:.24)),e.id===this.cameraActor.id&&(this.viewKick=Math.min(1.5,this.viewKick+(o.id==="awp"?1.1:.42)));const S=Qr(e),M=Kg(this.map,S,d,o.range);let w=M?.distance??o.range,y=null,v=null,P=M?.point??null;if(o.slot==="knife"||i.ammo>=0)for(const E of this.actors){if(!E.alive||E.team===e.team||E.id===e.id)continue;const O=this.intersectActor(S,d,E,w);O&&O.distance<w&&(w=O.distance,y=E,v=O.zone,P=O.point)}P||(P=S.clone().addScaledVector(d,o.range));const C=e.id===this.cameraActor.id?0:e.position.distanceTo(this.cameraActor.position);if(C<80&&this.audio.shot(o.id,C),o.slot!=="knife"&&this.spawnTracer(S.clone().addScaledVector(d,.55).add(new D(0,-.12,0)),P,o.tracer),y&&v){const E=fT(o.damage,v,y.armor,w,o.range,o.id==="awp"?.9:.5);y.armor=E.armor,y.health=Math.max(0,y.health-E.damage),e.id===this.controlledId&&(this.hitMarkerAt=this.elapsed,this.audio.hit()),y.id===this.controlledId&&(this.damageAt=this.elapsed),this.spawnImpact(P,12145986,.035),y.health<=0&&this.handleKill(e,y,o.id,v==="head")}else M&&this.spawnImpact(P,13942157,.028)}intersectActor(e,t,i,o){const a=e.clone().sub(i.position).applyAxisAngle(tc,-i.yaw),c=t.clone().applyAxisAngle(tc,-i.yaw),d=new yc(a,c);let f=o,h=null,m=null;for(const _ of pT){const S=_.size.clone().multiplyScalar(.5),M=new ds(_.center.clone().sub(S),_.center.clone().add(S)),w=d.intersectBox(M,new D);if(!w)continue;const y=w.distanceTo(a);y<f&&y>.02&&(f=y,h=_.zone,m=w)}if(!h||!m)return null;const x=m.applyAxisAngle(tc,i.yaw).add(i.position);return{distance:f,zone:h,point:x}}spawnTracer(e,t,i){const o=new Wn().setFromPoints([e,t]),a=new bg({color:i,transparent:!0,opacity:.82,depthWrite:!1,blending:jd}),c=new gy(o,a);if(c.renderOrder=4,this.scene.add(c),this.tracers.push({line:c,life:.085}),this.tracers.length>55){const d=this.tracers.shift();this.scene.remove(d.line),d.line.geometry.dispose(),d.line.material.dispose()}}spawnImpact(e,t,i){const o=new so({color:t,transparent:!0,opacity:.9}),a=new Yt(new mc(i,0),o);a.position.copy(e),this.scene.add(a),this.impacts.push({mesh:a,life:.16})}handleKill(e,t,i,o){if(t.alive){if(t.alive=!1,t.health=0,t.deaths+=1,t.scoped=!1,t.interaction=null,t.interactionProgress=0,t.moving=!1,e.kills+=1,this.killfeed.push({id:++this.feedId,killer:e.id===this.controlledId?"YOU":e.name,killerTeam:e.team,victim:t.id===this.controlledId?"YOU":t.name,victimTeam:t.team,weapon:i,headshot:o}),this.killfeedTimes.push(this.elapsed),e.id===this.controlledId&&this.audio.kill(),this.bomb.status==="carried"&&this.bomb.carrierId===t.id&&(this.bomb.status="dropped",this.bomb.carrierId=null,this.bomb.position.copy(t.position),this.bomb.position.y=Math.max(.04,t.position.y+.04),this.setNotice("C4 已掉落 · T 阵营可拾取")),t.id===this.controlledId){const a=this.actors.find(c=>c.team===t.team&&c.alive);this.spectatorId=a?.id??null,this.setNotice("你已阵亡 · F 接管存活队友"),this.updateControlledModelVisibility(),this.updateViewWeapon()}else if(t.id===this.spectatorId){const a=this.actors.find(c=>c.team===this.playerTeam&&c.alive);this.spectatorId=a?.id??null,this.updateControlledModelVisibility(),this.updateViewWeapon()}}}pickupBomb(){if(this.bomb.status==="dropped"){for(const e of this.actors)if(!(!e.alive||e.team!=="T"||e.position.distanceTo(this.bomb.position)>1.35)){this.bomb.status="carried",this.bomb.carrierId=e.id,this.bomb.site=null,this.setNotice(e.id===this.controlledId?"你已拾取 C4 · 前往 A 点或 B 点安放":`${e.name} 已拾取 C4`),this.audio.ui();break}}}plantBomb(e,t){if(this.bomb.status!=="carried"||this.bomb.carrierId!==e.id||this.phase!=="playing")return;const i=na(e);this.bomb.status="planted",this.bomb.carrierId=null,this.bomb.site=t,this.bomb.timer=40,this.bomb.position.copy(e.position).addScaledVector(i,.65),this.bomb.position.y=e.position.y+.035,this.setNotice(`C4 已在 ${t} 点安放 · 40 秒后引爆`),this.audio.plant();for(const o of this.actors)o.ai.repath=0}defuseBomb(e){this.bomb.status!=="planted"||e.team!=="CT"||this.phase!=="playing"||(this.bomb.status="defused",this.audio.defuse(),this.endRound("CT",`${e.name} 成功拆除 C4`))}updateBomb(e){if(!(this.bomb.status!=="planted"||this.phase!=="playing")&&(this.bomb.timer=Math.max(0,this.bomb.timer-e),!(this.bomb.timer>0))){this.bomb.status="exploded",this.audio.explosion(),this.spawnExplosion();for(const t of this.actors){if(!t.alive)continue;const i=t.position.distanceTo(this.bomb.position);if(i<11&&(t.health=Math.max(0,t.health-Math.round(160*(1-i/13))),t.health<=0)){const o=this.actors.find(a=>a.team==="T"&&a.alive)??this.actors[5];this.handleKill(o,t,"deagle",!1)}}this.endRound("T",`C4 在 ${this.bomb.site} 点引爆`)}}spawnExplosion(){const e=new Qy(16747064,45,32,2);e.position.copy(this.bomb.position).add(new D(0,1.2,0)),this.scene.add(e),window.setTimeout(()=>{this.disposed||this.scene.remove(e)},350);for(let t=0;t<28;t++){const i=this.bomb.position.clone().add(new D((Math.random()-.5)*5,Math.random()*3,(Math.random()-.5)*5));this.spawnImpact(i,t%2?16743215:4602928,.09+Math.random()*.13)}}checkRoundEnd(){if(this.phase!=="playing")return;const e=this.actors.some(i=>i.team==="CT"&&i.alive),t=this.actors.some(i=>i.team==="T"&&i.alive);if(!e){this.endRound("T","T 阵营已清空 CT 防守力量");return}if(!t&&this.bomb.status!=="planted"){this.endRound("CT","CT 阵营已清空 T 进攻力量");return}this.roundTime<=0&&this.bomb.status!=="planted"&&this.endRound("CT","回合时间耗尽 · CT 成功守住目标")}endRound(e,t){this.phase==="playing"&&(this.score[e]+=1,this.roundWinner=e,this.roundReason=t,this.phase="roundEnd",this.paused=!1,this.mouseDown=!1,this.keys.clear(),this.setNotice(`${e} 阵营获胜`),document.pointerLockElement===this.renderer.domElement&&document.exitPointerLock(),this.emitSnapshot())}setNotice(e){this.notice=e,this.noticeAt=this.elapsed}emitSnapshot(){if(this.disposed||!this.actors.length)return;const e=this.controlled,t=this.cameraActor,i=t.weapons[t.slot]??Tr("knife"),o=this.actors.map(h=>({id:h.id,name:h.id===this.controlledId?"YOU":h.name,team:h.team,health:h.health,armor:h.armor,alive:h.alive,x:h.position.x,y:h.position.y,z:h.position.z,yaw:h.yaw,kills:h.kills,deaths:h.deaths,controlled:h.id===this.controlledId,hasBomb:this.bomb.status==="carried"&&this.bomb.carrierId===h.id,weapon:h.weapons[h.slot]?.id??"knife"})),a={};for(const[h,m]of Object.entries(t.weapons))a[h]=ig(m);const c=this.bomb.carrierId!==null&&(this.actors[this.bomb.carrierId].team===this.playerTeam||this.visibleEnemies.includes(this.bomb.carrierId)),d=gn[i.id],f={phase:this.phase,paused:this.paused,round:this.round,roundTime:this.roundTime,score:{...this.score},players:o,controlledId:this.controlledId,spectatorId:this.spectatorId,health:e.health,armor:e.armor,alive:e.alive,team:this.playerTeam,position:{x:t.position.x,y:t.position.y,z:t.position.z},yaw:t.yaw,location:cT(this.map,t.position.x,t.position.z),weapon:ig(i),weapons:a,kills:e.kills,deaths:e.deaths,scoped:e.alive&&e.scoped,spread:d.spread+e.bloom*(d.automatic?.018:.01)+(e.moving?.004:0),hitMarkerAt:this.hitMarkerAt,damageAt:this.damageAt,killfeed:this.killfeed.map(h=>({...h})),notice:this.elapsed-this.noticeAt<3.4?this.notice:"",noticeAt:this.noticeAt,roundWinner:this.roundWinner,roundReason:this.roundReason,bomb:{status:this.bomb.status,carrierId:this.bomb.carrierId,x:this.bomb.position.x,y:this.bomb.position.y,z:this.bomb.position.z,site:this.bomb.site,timer:this.bomb.timer,visiblePosition:this.bomb.status==="planted"||this.bomb.status==="dropped"||c},interaction:this.interaction?{...this.interaction}:null,visibleEnemies:[...this.visibleEnemies],muted:this.audio.isMuted(),canBuy:this.canBuy()};this.onSnapshot(f)}getMinimapShapes(){return this.map.colliders.filter(({kind:e})=>e!=="roof").map(({box:e,kind:t})=>({x:(e.min.x+e.max.x)/2,z:(e.min.z+e.max.z)/2,width:e.max.x-e.min.x,depth:e.max.z-e.min.z,kind:t}))}resize=()=>{const e=Math.max(1,this.container.clientWidth||window.innerWidth),t=Math.max(1,this.container.clientHeight||window.innerHeight);this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()};dispose(){if(!this.disposed){this.disposed=!0,cancelAnimationFrame(this.frameId),this.resizeObserver.disconnect(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("pointerlockchange",this.onPointerLockChange),document.removeEventListener("pointerlockerror",this.onPointerLockError),this.renderer.domElement.removeEventListener("mousedown",this.onMouseDown),window.removeEventListener("mouseup",this.onMouseUp),this.renderer.domElement.removeEventListener("contextmenu",this.onContextMenu),this.renderer.domElement.removeEventListener("click",this.onCanvasClick),document.pointerLockElement===this.renderer.domElement&&document.exitPointerLock(),this.audio.dispose(),this.map.group.traverse(e=>{if(e instanceof Yt){e.geometry.dispose();const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i.map&&i.map.dispose()}});for(const e of this.tracers)e.line.geometry.dispose(),e.line.material.dispose();for(const e of this.impacts)e.mesh.geometry.dispose(),e.mesh.material.dispose();this.renderer.dispose(),this.renderer.domElement.remove()}}}const gT=[{slot:"primary",key:"1",label:"主武器"},{slot:"secondary",key:"2",label:"副武器"},{slot:"knife",key:"3",label:"近战"}],vT=[["WASD","战术移动"],["左 / 右键","射击 / 瞄准"],["R","更换弹匣"],["E","安放 / 拆除"],["1 / 2 / 3","切换武器"],["B / N","购买时段换枪"],["F","死亡接管队友"],["TAB","按住记分板"],["ESC","暂停行动"],["M","切换静音"]];function nc(s){return Math.max(0,Math.min(100,s))}function _T(s){const e=Math.max(0,Math.ceil(Number.isFinite(s)?s:0));return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}function sh({team:s}){return s==="CT"?N.jsxs("svg",{className:"team-mark",viewBox:"0 0 32 36","aria-hidden":"true",children:[N.jsx("path",{d:"M16 2 29 7v10c0 8.4-5.2 14.1-13 17C8.2 31.1 3 25.4 3 17V7L16 2Z"}),N.jsx("path",{d:"M10 12h12M16 9v15M11 24l5-4 5 4"})]}):N.jsxs("svg",{className:"team-mark",viewBox:"0 0 32 36","aria-hidden":"true",children:[N.jsx("path",{d:"m16 2 13 7-5 18-8 7-8-7L3 9l13-7Z"}),N.jsx("path",{d:"m9 11 7 4 7-4M16 15v11M11 26l5-5 5 5"})]})}function xT(){return N.jsxs("svg",{className:"hud-icon",viewBox:"0 0 24 24","aria-hidden":"true",children:[N.jsx("path",{d:"M12 20.5S3.5 15.7 3.5 9.3A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.5 3.2c0 6.4-8.5 11.2-8.5 11.2Z"}),N.jsx("path",{d:"M12 8v6M9 11h6"})]})}function yT(){return N.jsx("svg",{className:"hud-icon",viewBox:"0 0 24 24","aria-hidden":"true",children:N.jsx("path",{d:"m12 2.5 8 3v6.2c0 5.1-3.2 8.5-8 10.8-4.8-2.3-8-5.7-8-10.8V5.5l8-3Z"})})}function rg(){return N.jsxs("svg",{className:"hud-icon",viewBox:"0 0 24 24","aria-hidden":"true",children:[N.jsx("rect",{x:"5",y:"7",width:"14",height:"13",rx:"2"}),N.jsx("path",{d:"M9 7V4h6v3M9 11h6M9 15h4M16 4l2-2M18 6l2-2"})]})}function ST(){return N.jsxs("svg",{className:"hud-icon",viewBox:"0 0 24 24","aria-hidden":"true",children:[N.jsx("path",{d:"M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"}),N.jsx("circle",{cx:"12",cy:"10",r:"2.3"})]})}function MT({muted:s}){return N.jsxs("svg",{className:"hud-icon",viewBox:"0 0 24 24","aria-hidden":"true",children:[N.jsx("path",{d:"M4 9v6h4l5 4V5L8 9H4Z"}),s?N.jsx("path",{d:"m17 9 5 6M22 9l-5 6"}):N.jsx("path",{d:"M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"})]})}function oh(){return N.jsx("svg",{className:"button-arrow",viewBox:"0 0 24 24","aria-hidden":"true",children:N.jsx("path",{d:"M4 12h15M14 6l6 6-6 6"})})}function ET(){return N.jsxs("svg",{className:"headshot-icon",viewBox:"0 0 20 20","aria-hidden":"true",children:[N.jsx("circle",{cx:"10",cy:"10",r:"6"}),N.jsx("circle",{cx:"10",cy:"10",r:"1.5"}),N.jsx("path",{d:"M10 0v5M10 15v5M0 10h5M15 10h5"})]})}function wT({id:s}){const e=gn[s].slot;return N.jsx("svg",{className:"weapon-glyph",viewBox:"0 0 160 48","aria-hidden":"true",children:e==="knife"?N.jsxs(N.Fragment,{children:[N.jsx("path",{d:"m17 34 22-8 67-17 31 1-26 13-65 13-15 7Z"}),N.jsx("path",{d:"m39 26 7 10M31 28l8 12"})]}):e==="secondary"?N.jsxs(N.Fragment,{children:[N.jsx("path",{d:"M29 14h80l22 7-5 8H78l-8 6H48l-4-6H29Z"}),N.jsx("path",{d:"m75 34 18 1-5 12H72l-7-5M110 14V9h13v5"}),N.jsx("path",{d:"M43 19h55"})]}):N.jsxs(N.Fragment,{children:[N.jsx("path",{d:"M8 17h95l25 5 25 1v5h-34l-15 7H83l-9-6H47l-13 8H17l8-15H8Z"}),N.jsx("path",{d:"m77 34 22 1-7 13H78l-9-7M49 14V9h32v5M119 22v13"}),s==="awp"&&N.jsxs(N.Fragment,{children:[N.jsx("path",{d:"M42 8h54"}),N.jsx("circle",{cx:"61",cy:"8",r:"5"}),N.jsx("path",{d:"M145 18v15"})]})]})})}function TT({team:s,mode:e,onTeam:t,onMode:i,onStart:o}){return N.jsxs("section",{className:"menu-screen","aria-label":"主菜单",children:[N.jsx("div",{className:"menu-grid"}),N.jsxs("div",{className:"menu-build",children:[N.jsx("span",{})," LOCAL SIMULATION ",N.jsx("b",{children:"READY"})]}),N.jsxs("div",{className:"menu-content",children:[N.jsxs("header",{className:"menu-header",children:[N.jsxs("div",{className:"eyebrow",children:[N.jsx("span",{children:"DP—01"})," TACTICAL COMBAT SIMULATION"]}),N.jsxs("h1",{children:["DUST ",N.jsx("em",{children:"//"})," PROTOCOL"]}),N.jsx("p",{children:"沙尘遮蔽视野，纪律决定胜负。组建五人小队，执行精确突破。"})]}),N.jsxs("div",{className:"menu-section-heading",children:[N.jsx("span",{children:"01"})," 选择作战阵营 ",N.jsx("small",{children:"5 V 5"})]}),N.jsx("div",{className:"team-options",role:"group","aria-label":"作战阵营",children:["T","CT"].map(a=>N.jsxs("button",{type:"button",className:`team-option ${a.toLowerCase()} ${s===a?"selected":""}`,onClick:()=>t(a),"aria-pressed":s===a,children:[N.jsx(sh,{team:a}),N.jsxs("span",{className:"option-copy",children:[N.jsx("strong",{children:a==="T"?"T 阵营":"CT 阵营"}),N.jsx("small",{children:a==="T"?"突破防线 · 安放 C4":"固守目标 · 拆除 C4"})]}),N.jsx("span",{className:"option-check"})]},a))}),N.jsxs("div",{className:"menu-section-heading",children:[N.jsx("span",{children:"02"})," 选择行动协议"]}),N.jsxs("div",{className:"mode-options",role:"group","aria-label":"行动模式",children:[N.jsxs("button",{type:"button",className:e==="pistol"?"selected":"",onClick:()=>i("pistol"),"aria-pressed":e==="pistol",children:[N.jsxs("span",{children:[N.jsx("strong",{children:"手枪局"}),N.jsx("small",{children:"STANDARD OPENING"})]}),N.jsx("b",{children:"标准"})]}),N.jsxs("button",{type:"button",className:e==="rifle"?"selected":"",onClick:()=>i("rifle"),"aria-pressed":e==="rifle",children:[N.jsxs("span",{children:[N.jsx("strong",{children:"步枪训练"}),N.jsx("small",{children:"WEAPON TRAINING"})]}),N.jsx("b",{children:"全武器"})]})]}),N.jsx("p",{className:"mode-description",children:e==="pistol"?"重置比分，无护甲手枪开局；后续回合自动配备主武器。":"全武器训练配置，直接进入步枪作战与弹道演练。"}),N.jsxs("button",{type:"button",className:"deploy-button",onClick:o,children:[N.jsxs("span",{children:[N.jsx("small",{children:"CONFIRM LOADOUT"}),"进入行动"]}),N.jsx(oh,{})]}),N.jsxs("div",{className:"guide-heading",children:["操作指南 ",N.jsx("span",{children:"FIELD MANUAL"})]}),N.jsx("div",{className:"controls-guide",children:vT.map(([a,c])=>N.jsxs("div",{className:"guide-item",children:[N.jsx("kbd",{children:a}),N.jsx("span",{children:c})]},a))}),N.jsxs("footer",{className:"menu-tags",children:[N.jsx("span",{children:"100% PROCEDURAL"}),N.jsx("span",{children:"NO EXTERNAL ASSETS"}),N.jsx("span",{children:"LOCAL 5V5"})]})]}),N.jsxs("div",{className:"menu-coordinate",children:["DUST2 // 96 × 92",N.jsx("br",{}),"TACTICAL ENVIRONMENT"]})]})}function AT({snapshot:s,shapes:e}){const t=new Set(s.visibleEnemies),i=s.spectatorId??s.controlledId,o=s.bomb,a=o.visiblePosition&&(o.status==="carried"||o.status==="dropped"||o.status==="planted");return N.jsxs("div",{className:"minimap-panel",children:[N.jsxs("div",{className:"minimap-heading",children:[N.jsx("strong",{children:"DUST2"}),N.jsx("span",{children:"战术地图"})]}),N.jsxs("svg",{className:"minimap",viewBox:"-48 -46 96 92",role:"img","aria-label":"战术小地图",children:[N.jsx("rect",{className:"map-ground",x:"-48",y:"-46",width:"96",height:"92"}),N.jsx("path",{className:"map-grid-lines",d:"M-24-46V46M0-46V46M24-46V46M-48-23H48M-48 0H48M-48 23H48"}),N.jsx("rect",{className:"bomb-site site-a",x:"20",y:"18",width:"24",height:"20"}),N.jsx("rect",{className:"bomb-site site-b",x:"-43",y:"17",width:"19",height:"18"}),e.map((c,d)=>N.jsx("rect",{className:`map-shape map-shape-${c.kind}`,x:c.x,y:-c.z-c.depth,width:c.width,height:c.depth},`${c.kind}-${d}`)),N.jsxs("g",{className:"map-labels",textAnchor:"middle",children:[N.jsx("text",{className:"site-label",x:"32",y:"30",children:"A"}),N.jsx("text",{className:"site-label",x:"-33.5",y:"28",children:"B"}),N.jsx("text",{x:"0",y:"-38",children:"T"}),N.jsx("text",{x:"1",y:"39",children:"CT"}),N.jsx("text",{className:"mid-label",x:"0",y:"3",children:"MID"})]}),s.players.filter(c=>c.alive&&c.team===s.team&&c.id!==i).map(c=>N.jsxs("g",{className:"map-teammate",transform:`translate(${c.x} ${-c.z})`,children:[N.jsx("circle",{className:"unit-ring",r:"2.2"}),N.jsx("circle",{r:"1.25"})]},c.id)),s.players.filter(c=>c.alive&&c.team!==s.team&&t.has(c.id)).map(c=>N.jsxs("g",{className:"map-enemy",transform:`translate(${c.x} ${-c.z})`,children:[N.jsx("circle",{className:"unit-ring",r:"2.35"}),N.jsx("circle",{r:"1.4"})]},c.id)),a&&N.jsxs("g",{className:`map-bomb ${o.status}`,transform:`translate(${o.x} ${-o.z})`,children:[N.jsx("circle",{className:"bomb-pulse",r:"3.2"}),N.jsx("circle",{r:"1.55"})]}),N.jsx("g",{className:"map-self",transform:`translate(${s.position.x} ${-s.position.z}) rotate(${s.yaw*180/Math.PI})`,children:N.jsx("path",{d:"M0 2.2-1.65-1.55 0-.7 1.65-1.55Z"})})]}),N.jsxs("div",{className:"minimap-footer",children:[N.jsx("span",{children:"T ↑"}),N.jsx("i",{})," ",N.jsx("span",{children:"CT ↓"})]})]})}function CT({snapshot:s}){return N.jsx("div",{className:"scoreboard-layer",children:N.jsxs("section",{className:"scoreboard","aria-label":"回合记分板",children:[N.jsxs("header",{className:"scoreboard-header",children:[N.jsxs("div",{children:[N.jsx("small",{children:"TACTICAL SIMULATION"}),N.jsx("strong",{children:"DUST // PROTOCOL"})]}),N.jsxs("span",{children:["第 ",s.round," 回合"]})]}),["CT","T"].map(e=>{const t=s.players.filter(i=>i.team===e).sort((i,o)=>o.kills-i.kills||i.deaths-o.deaths||i.id-o.id);return N.jsxs("div",{className:`scoreboard-team ${e.toLowerCase()}`,children:[N.jsxs("div",{className:"scoreboard-team-title",children:[N.jsxs("span",{children:[N.jsx(sh,{team:e}),e," 阵营"]}),N.jsx("strong",{children:s.score[e]})]}),N.jsxs("div",{className:"score-row score-columns",children:[N.jsx("span",{children:"作战人员"}),N.jsx("span",{children:"击杀"}),N.jsx("span",{children:"死亡"}),N.jsx("span",{children:"K/D"}),N.jsx("span",{children:"状态"})]}),t.map(i=>N.jsxs("div",{className:`score-row ${i.controlled||i.id===s.controlledId?"controlled":""} ${i.alive?"":"dead"}`,children:[N.jsxs("span",{className:"score-player",children:[N.jsx("i",{}),i.name,i.hasBomb&&N.jsx("b",{children:"C4"})]}),N.jsx("span",{children:i.kills}),N.jsx("span",{children:i.deaths}),N.jsx("span",{children:(i.kills/Math.max(1,i.deaths)).toFixed(2)}),N.jsx("span",{children:i.alive?"存活":"阵亡"})]},i.id))]},e)}),N.jsxs("footer",{className:"scoreboard-footer",children:[N.jsx("kbd",{children:"TAB"})," 松开关闭记分板 ",N.jsx("span",{children:s.location})]})]})})}function RT(s){const e=s.bomb;return e.status==="carried"?e.carrierId===s.controlledId?"你携带 C4":"C4 携带中":e.status==="dropped"?"C4 已掉落":e.status==="planted"?`C4 已安放${e.site?` · ${e.site} 点`:""}`:e.status==="defused"?"C4 已拆除":"C4 已引爆"}function bT(){return N.jsx("div",{className:"scope-overlay",children:N.jsxs("div",{className:"scope-lens",children:[N.jsx("i",{className:"scope-line horizontal left"}),N.jsx("i",{className:"scope-line horizontal right"}),N.jsx("i",{className:"scope-line vertical top"}),N.jsx("i",{className:"scope-line vertical bottom"}),N.jsx("span",{className:"scope-center"})]})})}function PT({snapshot:s,shapes:e,showScoreboard:t,onCycleSpectator:i,onToggleMute:o,onResume:a}){const c=s.players.filter(_=>_.team==="CT"&&_.alive).length,d=s.players.filter(_=>_.team==="T"&&_.alive).length,f=s.players.find(_=>_.id===s.spectatorId)??null,h={"--spread":`${5+Math.min(28,Math.max(0,s.spread)*1200)}px`},m=nc(s.weapon.reloadProgress*100),x=s.interaction?nc(s.interaction.progress*100):0;return N.jsxs(N.Fragment,{children:[s.scoped&&s.alive&&N.jsx(bT,{}),s.damageAt>0&&N.jsx("div",{className:"damage-vignette"},s.damageAt),N.jsxs("div",{className:"hud-layer",children:[N.jsx(AT,{snapshot:s,shapes:e}),N.jsxs("div",{className:"match-strip",children:[N.jsxs("div",{className:"match-team ct",children:[N.jsxs("div",{children:[N.jsx("strong",{children:"CT"}),N.jsxs("span",{children:[c," 存活"]})]}),N.jsx("b",{children:s.score.CT}),N.jsx("div",{className:"alive-pips",children:s.players.filter(_=>_.team==="CT").map(_=>N.jsx("i",{className:_.alive?"alive":""},_.id))})]}),N.jsxs("div",{className:`match-clock ${s.roundTime<=10?"urgent":""}`,children:[N.jsxs("span",{children:["ROUND ",String(s.round).padStart(2,"0")]}),N.jsx("time",{children:_T(s.roundTime)})]}),N.jsxs("div",{className:"match-team t",children:[N.jsx("b",{children:s.score.T}),N.jsxs("div",{children:[N.jsx("strong",{children:"T"}),N.jsxs("span",{children:[d," 存活"]})]}),N.jsx("div",{className:"alive-pips",children:s.players.filter(_=>_.team==="T").map(_=>N.jsx("i",{className:_.alive?"alive":""},_.id))})]})]}),s.bomb.status==="planted"&&N.jsxs("div",{className:"bomb-countdown",children:[N.jsx(rg,{}),N.jsx("span",{children:s.bomb.site?`${s.bomb.site} 点`:"C4"}),N.jsx("strong",{children:s.bomb.timer.toFixed(1)})]}),N.jsxs("button",{type:"button",className:"mute-button",onClick:o,"aria-label":s.muted?"取消静音":"静音",children:[N.jsx(MT,{muted:s.muted}),N.jsx("kbd",{children:"M"})]}),N.jsx("div",{className:"killfeed","aria-label":"击杀信息",children:s.killfeed.slice(-5).reverse().map(_=>N.jsxs("div",{className:"killfeed-item",children:[N.jsx("span",{className:_.killerTeam.toLowerCase(),children:_.killer}),N.jsxs("div",{children:[_.headshot&&N.jsx(ET,{}),N.jsx("b",{children:gn[_.weapon].shortName})]}),N.jsx("span",{className:_.victimTeam.toLowerCase(),children:_.victim})]},_.id))}),s.notice&&s.noticeAt>0&&N.jsxs("div",{className:"system-notice",role:"status",children:[N.jsx("span",{children:"TACTICAL UPDATE"}),s.notice]},`${s.noticeAt}-${s.notice}`),!s.scoped&&s.alive&&N.jsxs("div",{className:"crosshair",style:h,children:[N.jsx("i",{className:"crosshair-line top"}),N.jsx("i",{className:"crosshair-line right"}),N.jsx("i",{className:"crosshair-line bottom"}),N.jsx("i",{className:"crosshair-line left"}),N.jsx("span",{})]}),s.hitMarkerAt>0&&s.alive&&N.jsxs("div",{className:"hit-marker",children:[N.jsx("i",{}),N.jsx("i",{}),N.jsx("i",{}),N.jsx("i",{})]},s.hitMarkerAt),s.interaction&&N.jsxs("div",{className:"interaction-progress",children:[N.jsxs("div",{children:[N.jsx("span",{children:s.interaction.label}),N.jsxs("b",{children:[Math.round(x),"%"]})]}),N.jsx("div",{className:"progress-track",children:N.jsx("i",{style:{width:`${x}%`}})})]}),!s.alive&&N.jsxs("div",{className:"spectator-panel",children:[N.jsx("span",{className:"death-label",children:"YOU ARE DOWN // 你已阵亡"}),N.jsxs("div",{className:"spectator-name",children:[N.jsx("small",{children:"正在观战"}),N.jsx("strong",{className:f?.team.toLowerCase()??"",children:f?.name??"等待可用视角"})]}),N.jsxs("div",{className:"spectator-actions",children:[N.jsx("button",{type:"button",onClick:i,children:"切换观战"}),N.jsxs("span",{children:[N.jsx("kbd",{children:"F"})," 接管存活队友"]})]})]}),N.jsxs("div",{className:"vitals-panel",children:[N.jsxs("div",{className:`vital-row health ${s.health<=25?"critical":""}`,children:[N.jsx(xT,{}),N.jsx("span",{children:"生命"}),N.jsx("strong",{children:Math.ceil(Math.max(0,s.health))}),N.jsx("div",{className:"vital-track",children:N.jsx("i",{style:{width:`${nc(s.health)}%`}})})]}),N.jsxs("div",{className:"vital-row armor",children:[N.jsx(yT,{}),N.jsx("span",{children:"护甲"}),N.jsx("strong",{children:Math.ceil(Math.max(0,s.armor))}),N.jsx("div",{className:"vital-track",children:N.jsx("i",{style:{width:`${nc(s.armor)}%`}})})]})]}),N.jsxs("div",{className:"weapon-panel",children:[N.jsx(wT,{id:s.weapon.id}),N.jsxs("div",{className:"weapon-name",children:[N.jsx("span",{children:gn[s.weapon.id].slot==="primary"?"PRIMARY":gn[s.weapon.id].slot==="secondary"?"SECONDARY":"MELEE"}),N.jsx("strong",{children:s.weapon.name})]}),s.weapon.slot==="knife"?N.jsxs("div",{className:"ammo-count melee",children:[N.jsx("strong",{children:"—"}),N.jsx("span",{children:"近战武器"})]}):N.jsxs("div",{className:"ammo-count",children:[N.jsx("strong",{children:String(s.weapon.ammo).padStart(2,"0")}),N.jsxs("span",{children:["/ ",s.weapon.reserve]})]}),s.weapon.reloading&&N.jsxs("div",{className:"reload-progress",children:[N.jsxs("div",{children:[N.jsx("span",{children:"更换弹匣"}),N.jsxs("b",{children:[Math.round(m),"%"]})]}),N.jsx("div",{className:"progress-track",children:N.jsx("i",{style:{width:`${m}%`}})})]})]}),N.jsxs("div",{className:"bottom-center",children:[s.canBuy&&s.alive&&N.jsxs("div",{className:"buy-hint",children:[N.jsx("span",{children:"购买时段"}),N.jsx("kbd",{children:"B"})," 主武器 ",N.jsx("kbd",{children:"N"})," 手枪"]}),N.jsxs("div",{className:"location-strip",children:[N.jsxs("span",{children:[N.jsx(ST,{}),s.location]}),N.jsx("i",{}),N.jsxs("span",{className:`bomb-status ${s.bomb.status}`,children:[N.jsx(rg,{}),RT(s)]})]}),N.jsx("div",{className:"weapon-slots",children:gT.map(({slot:_,key:S,label:M})=>{const w=s.weapons[_];return N.jsxs("div",{className:`weapon-slot ${s.weapon.slot===_?"active":""}`,children:[N.jsx("kbd",{children:S}),N.jsxs("span",{children:[N.jsx("small",{children:M}),N.jsx("strong",{children:w?gn[w.id].shortName:"—"})]}),w&&_!=="knife"&&N.jsx("b",{children:w.ammo})]},_)})})]})]}),t&&N.jsx(CT,{snapshot:s}),s.paused&&N.jsx("div",{className:"modal-layer pause-layer",children:N.jsxs("section",{className:"pause-panel",children:[N.jsx("small",{children:"SIMULATION SUSPENDED"}),N.jsx("h2",{children:"行动已暂停"}),N.jsx("p",{children:"战术状态已保留。准备好后返回战场。"}),N.jsxs("button",{type:"button",className:"primary-button",onClick:a,children:[N.jsx("span",{children:"继续行动"}),N.jsx(oh,{})]}),N.jsxs("div",{className:"modal-shortcut",children:[N.jsx("kbd",{children:"ESC"})," 也可继续"]})]})})]})}function LT({snapshot:s,onNextRound:e,onRestart:t}){const i=s.roundWinner;return N.jsx("div",{className:"modal-layer round-end-layer",children:N.jsxs("section",{className:`round-end-panel ${i?.toLowerCase()??"draw"}`,children:[N.jsxs("div",{className:"round-end-kicker",children:["ROUND ",String(s.round).padStart(2,"0")," // COMPLETE"]}),i?N.jsx(sh,{team:i}):N.jsx("div",{className:"draw-mark",children:"//"}),N.jsx("h2",{children:i?`${i} 阵营获胜`:"回合结束"}),N.jsx("p",{children:s.roundReason||"回合目标已完成"}),N.jsxs("div",{className:"round-end-score",children:[N.jsxs("span",{children:["CT ",N.jsx("b",{children:s.score.CT})]}),N.jsx("i",{children:":"}),N.jsxs("span",{children:[N.jsx("b",{children:s.score.T})," T"]})]}),N.jsxs("div",{className:"round-end-actions",children:[N.jsxs("button",{type:"button",className:"primary-button",onClick:e,children:[N.jsx("span",{children:"下一回合"}),N.jsx(oh,{})]}),N.jsx("button",{type:"button",className:"secondary-button",onClick:t,children:"重新手枪局"})]}),N.jsx("small",{className:"round-end-note",children:"下一回合将配备主武器"})]})})}function NT(){const s=Ai.useRef(null),e=Ai.useRef(null),[t,i]=Ai.useState(null),[o,a]=Ai.useState([]),[c,d]=Ai.useState("CT"),[f,h]=Ai.useState("pistol"),[m,x]=Ai.useState(!1),_=t?.phase??"menu";Ai.useEffect(()=>{const w=s.current;if(!w)return;let y=!0;const v=new mT(w,P=>{y&&i(P)});return e.current=v,a(v.getMinimapShapes()),()=>{y=!1,e.current===v&&(e.current=null),v.dispose()}},[]),Ai.useEffect(()=>{const w=()=>x(!1),y=C=>{C.code!=="Tab"||_!=="playing"||(C.preventDefault(),x(!0))},v=C=>{C.code==="Tab"&&(_==="playing"&&C.preventDefault(),w())},P=()=>{document.hidden&&w()};return window.addEventListener("keydown",y),window.addEventListener("keyup",v),window.addEventListener("blur",w),document.addEventListener("visibilitychange",P),()=>{window.removeEventListener("keydown",y),window.removeEventListener("keyup",v),window.removeEventListener("blur",w),document.removeEventListener("visibilitychange",P),w()}},[_]);const S=()=>{t&&(d(t.team),h("pistol"),e.current?.start(t.team,"pistol"))},M=!t||t.phase==="menu";return N.jsxs("main",{className:"app-shell",children:[N.jsx("div",{className:"game-viewport",ref:s,"aria-label":"DUST PROTOCOL 三维游戏画面"}),N.jsx("div",{className:"game-ui",children:M?N.jsx(TT,{team:c,mode:f,onTeam:d,onMode:h,onStart:()=>e.current?.start(c,f)}):t.phase==="playing"?N.jsx(PT,{snapshot:t,shapes:o,showScoreboard:m,onCycleSpectator:()=>e.current?.cycleSpectator(),onToggleMute:()=>e.current?.toggleMute(),onResume:()=>e.current?.resume()}):N.jsx(LT,{snapshot:t,onNextRound:()=>e.current?.nextRound(),onRestart:S})})]})}const Zg=document.getElementById("root");if(!Zg)throw new Error("无法找到应用挂载节点");k_.createRoot(Zg).render(N.jsx(Ai.StrictMode,{children:N.jsx(NT,{})}));
