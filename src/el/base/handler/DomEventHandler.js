import BaseHandler from "./BaseHandler";
import Event, { CHECK_SAPARATOR, DOM_EVENT_SAPARATOR, SAPARATOR, NAME_SAPARATOR, CHECK_DOM_EVENT_PATTERN } from "../Event";
import { debounce, throttle, isNotUndefined, isFunction, splitMethodByKeyword } from "../functions/func";
import Dom from "../Dom";


const scrollBlockingEvents = {
    'touchstart': true,
    'touchmove': true,
    'mousedown': true,
    'mouseup': true,
    'mousemove': true,
    // 'wheel': true,
    // 'mousewheel': true
}

const eventConverts = {
  'doubletab': 'touchend'
}

const customEventNames = {
  'doubletab': true 
}

export default class DomEventHandler extends BaseHandler {


    initialize() {
        this.destroy();

        if (!this._domEvents) {
          this._domEvents = this.context.filterProps(CHECK_DOM_EVENT_PATTERN)
        }
        this._domEvents.forEach(key => this.parseDomEvent(key));
    }

    destroy() {
        this.removeEventAll();
    }


    removeEventAll() {
        this.getBindings().forEach(obj => {
          this.removeDomEvent(obj);
        });
        this.initBindings();
    }

    removeDomEvent({ eventName, dom, callback }) {
        Event.removeDomEvent(dom, eventName, callback);
    }    

    getBindings() {
        if (!this._bindings) {
          this.initBindings();
        }
    
        return this._bindings;
    }

    addBinding(obj) {
        this.getBindings().push(obj);
    }

    initBindings() {
        this._bindings = [];
    }    


    matchPath (el, selector) {
        if (el) {
          if (el.matches(selector)) {
            return el;
          }
          return this.matchPath(el.parentElement, selector);
        }
        return null;
    }
      
    hasDelegate (e, eventObject) {
        return this.matchPath(e.target || e.srcElement, eventObject.delegate);
    }
      
    makeCallback (eventObject, callback) {
      if (eventObject.delegate) {
        return this.makeDelegateCallback(eventObject, callback);
      } else {
        return this.makeDefaultCallback(eventObject, callback);
      }
    }
      
    makeDefaultCallback (eventObject, callback) {
        return e => {
          var returnValue = this.runEventCallback(e, eventObject, callback);
          if (isNotUndefined(returnValue)) {
            return returnValue;
          }
        };
    }
      
    makeDelegateCallback (eventObject, callback) {
        return e => {
          const delegateTarget = this.hasDelegate(e, eventObject);
      
          if (delegateTarget) {
            // delegate target ??? ?????? ????????? callback ??????
            e.$dt = Dom.create(delegateTarget);      
      
            var returnValue = this.runEventCallback(e, eventObject, callback);
            if (isNotUndefined(returnValue)) {
              return returnValue;
            }
          }
        };
    }
      
    runEventCallback (e, eventObject, callback) {
        const context = this.context;
        e.xy = Event.posXY(e);
      
        if (eventObject.beforeMethods.length) {
          eventObject.beforeMethods.every(before => {
            return context[before.target].call(context, e, before.param);
          });
        }
      
        if (this.checkEventType(e, eventObject)) {
          var returnValue = callback(e, e.$dt, e.xy); 
      
          if (returnValue !== false && eventObject.afterMethods.length) {
            eventObject.afterMethods.forEach(after =>
              context[after.target].call(context, e, after.param)
            );
          }
      
          return returnValue;
        }
    }
      
    checkEventType (e, eventObject) {
        const context = this.context;
        // ?????? keycode ??? ????????? ????????? ??????
        var hasKeyCode = true;
        if (eventObject.codes.length) {
          hasKeyCode =
            (e.code ? eventObject.codes.indexOf(e.code.toLowerCase()) > -1 : false) ||
            (e.key ? eventObject.codes.indexOf(e.key.toLowerCase()) > -1 : false);
        }
      
        // ?????? ??????????????? ?????? ???????????? ??? ??????????????????.
        var isAllCheck = true;
        if (eventObject.checkMethodList.length) {
          isAllCheck = eventObject.checkMethodList.every(field => {
            var fieldValue = context[field];    
            if (isFunction(fieldValue) && fieldValue) {
              // check method
              return fieldValue.call(context, e);
            } else if (isNotUndefined(fieldValue)) {
      
              // check field value
              return !!fieldValue;
            }
            return true;
          });
        }
      
        return hasKeyCode && isAllCheck;
    }
      
    getDefaultDomElement(dom) {
        const context = this.context;
        let el;
      
        if (dom) {
          el = context.refs[dom] || context[dom] || window[dom];
        } else {
          el = context.el || context.$el || context.$root;
        }
      
        if (el instanceof Dom) {
          return el.getElement();
        }
      
        return el;
    };
      
    getRealEventName (eventName) {
      return eventConverts[eventName] || eventName;
    }

    getCustomEventName (eventName) {
      return customEventNames[eventName] ? eventName:  '';
    }

    /**
     * 
     * doubletab -> touchend ??? ?????? 
     * 
     * @param {string} eventName  ????????? ?????? 
     * @param {array} checkMethodFilters ?????? ?????? ??????  
     */
    getDefaultEventObject (eventName, checkMethodFilters) {
        const context = this.context;
        let arr = checkMethodFilters;
      
        // context ??? ?????? ????????? ????????? ????????? ??????
        const checkMethodList = arr.filter(code => !!context[code]);
      
        // ????????? ?????? ????????? ?????? ????????? ?????? ????????? ?????? method() ??? ?????? ????????????.
        const [afters, afterMethods] = splitMethodByKeyword(arr, "after");
        const [befores, beforeMethods] = splitMethodByKeyword(arr, "before");
        const [debounces, debounceMethods] = splitMethodByKeyword(arr, "debounce");
        const [delays, delayMethods] = splitMethodByKeyword(arr, "delay");        
        const [throttles, throttleMethods] = splitMethodByKeyword(arr, "throttle");
        const [captures] = splitMethodByKeyword(arr, "capture");
      
        // ?????? 5??? ?????? ????????? ?????? ???????????? keycode ??? ????????????.
        const filteredList = [
          ...checkMethodList,
          ...afters,
          ...befores,
          ...delays,
          ...debounces,
          ...throttles,
          ...captures
        ];
      
        var codes = arr
          .filter(code => filteredList.indexOf(code) === -1)
          .map(code => code.toLowerCase());
      
        return {
          eventName: this.getRealEventName(eventName),
          customEventName: this.getCustomEventName(eventName), 
          codes,
          captures,
          afterMethods,
          beforeMethods,
          delayMethods,
          debounceMethods,
          throttleMethods,
          checkMethodList
        };
    }
      
      
    addDomEvent (eventObject, callback) {
        eventObject.callback = this.makeCallback(eventObject, callback);
        this.addBinding(eventObject);
      
        var options = !!eventObject.captures.length
      
        if (scrollBlockingEvents[eventObject.eventName]) {
          options = {
            passive: true,
            capture: options  
          }
        }
      
        Event.addDomEvent(
          eventObject.dom,
          eventObject.eventName,
          eventObject.callback,
          options
        );
    }

    makeCustomEventCallback (eventObject, callback) {

      if (eventObject.customEventName === 'doubletab') {
        var delay = 300;
        
        if (eventObject.delayMethods.length) {
          delay = +eventObject.delayMethods[0].target;
        }
        return (...args) => {

          if (!this.doubleTab) {
            this.doubleTab = {
                time: performance.now(),
            }
          } else {
            if (performance.now() - this.doubleTab.time < delay) {
              callback(...args);
            }

            this.doubleTab = null;
          }
        }

      } 

      return callback; 
    }
      
    bindingDomEvent ( [eventName, dom, ...delegate], checkMethodFilters, callback ) {
        let eventObject = this.getDefaultEventObject(eventName, checkMethodFilters);
      
        eventObject.dom = this.getDefaultDomElement(dom);
        eventObject.delegate = delegate.join(SAPARATOR);

        
        if (eventObject.debounceMethods.length) {
          var debounceTime = +eventObject.debounceMethods[0].target;
          callback = debounce(callback, debounceTime);
        } else if (eventObject.throttleMethods.length) {
          var throttleTime = +eventObject.throttleMethods[0].target;
          callback = throttle(callback, throttleTime);
        }

        // custom event callback ????????? 
        callback = this.makeCustomEventCallback(eventObject, callback)
      
        this.addDomEvent(eventObject, callback);
    };
      
    getEventNames (eventName) {
        let results = [];
        
        eventName.split(NAME_SAPARATOR).forEach(e => {
            var arr = e.split(NAME_SAPARATOR);
        
            results.push.apply(results, arr);
        });
        
        return results;
    }
    
    /**
     * ????????? ????????? ???????????? 
     * 
     * @param {string} key 
     */
    parseDomEvent (key) {
        const context = this.context;
        let checkMethodFilters = key.split(CHECK_SAPARATOR).map(it => it.trim());
        
        var prefix = checkMethodFilters.shift()
        var eventSelectorAndBehave = prefix.split(DOM_EVENT_SAPARATOR)[1];
        
        var arr = eventSelectorAndBehave.split(SAPARATOR);
        var eventNames = this.getEventNames(arr[0]);
        var callback = context[key].bind(context);
        
        for(let i = 0, len = eventNames.length; i< len; i++) {
          arr[0] = eventNames[i];
          this.bindingDomEvent(arr, checkMethodFilters, callback);
        }
    }  
}