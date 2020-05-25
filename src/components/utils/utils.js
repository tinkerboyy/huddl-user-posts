// import React, {
//   cloneElement,
//   createContext,
//   isValidElement,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import warning from 'warning';
// import {
//   As,
//   AssignableRef,
//   ComponentWithAs,
//   ComponentWithForwardedRef,
//   DistributiveOmit,
//   PropsFromAs,
//   PropsWithAs,
//   SingleOrArray,
//   ThenArg,
// } from './types';

// export const useIsomorphicLayoutEffect = canUseDOM()
//   ? React.useLayoutEffect
//   : React.useEffect;

// export { warning };

// let checkStyles = noop;

// export { checkStyles };

// export const ponyfillGlobal =
//   typeof window != 'undefined' && window.Math == Math
//     ? window
//     : typeof self != 'undefined' && self.Math == Math
//     ? self
//     : Function('return this')();
// export function assignRef(ref, value) {
//   if (ref == null) return;
//   if (isFunction(ref)) {
//     ref(value);
//   } else {
//     try {
//       ref.current = value;
//     } catch (error) {
//       throw new Error(`Cannot assign value "${value}" to ref "${ref}"`);
//     }
//   }
// }

// export function boolOrBoolString(value) {
//   return value === 'true' ? true : isBoolean(value) ? value : false;
// }

// export function canUseDOM() {
//   return (
//     typeof window !== 'undefined' &&
//     typeof window.document !== 'undefined' &&
//     typeof window.document.createElement !== 'undefined'
//   );
// }

// export function cloneValidElement(element, props, ...children) {
//   return isValidElement(element)
//     ? cloneElement(element, props, ...children)
//     : element;
// }

// export function createNamedContext(name, defaultValue) {
//   const Ctx = createContext(defaultValue);
//   Ctx.displayName = name;
//   return Ctx;
// }

// export function forwardRefWithAs(comp) {
//   return React.forwardRef(comp);
// }

// export function memoWithAs(comp) {
//   return React.memo(comp);
// }

// export function getDocumentDimensions(element) {
//   if (!canUseDOM()) return { width: 0, height: 0 };
//   let doc = element ? getOwnerDocument(element) : document;
//   let win = element ? getOwnerWindow(element) : window;
//   return {
//     width: doc.documentElement.clientWidth || win.innerWidth,
//     height: doc.documentElement.clientHeight || win.innerHeight,
//   };
// }

// export function getScrollPosition(element) {
//   if (!canUseDOM()) return { scrollX: 0, scrollY: 0 };
//   let win = element ? getOwnerWindow(element) : window;
//   return {
//     scrollX: win.scrollX,
//     scrollY: win.scrollY,
//   };
// }

// export function getElementComputedStyle(element, styleProp) {
//   let y = null;
//   let doc = getOwnerDocument(element);
//   if (element.currentStyle) {
//     y = element.currentStyle[styleProp];
//   } else if (
//     doc &&
//     doc.defaultView &&
//     isFunction(doc.defaultView.getComputedStyle)
//   ) {
//     y = doc.defaultView
//       .getComputedStyle(element, null)
//       .getPropertyValue(styleProp);
//   }
//   return y;
// }

// export function getOwnerDocument(element) {
//   return element && element.ownerDocument
//     ? element.ownerDocument
//     : canUseDOM()
//     ? document
//     : null;
// }

// export function getOwnerWindow(element) {
//   let doc = element ? getOwnerDocument(element) : null;
//   return doc ? doc.defaultView || window : null;
// }

// export function getScrollbarOffset() {
//   try {
//     if (window.innerWidth > document.documentElement.clientWidth) {
//       return window.innerWidth - document.documentElement.clientWidth;
//     }
//   } catch (err) {}
//   return 0;
// }

// export function isBoolean(value) {
//   return typeof value === 'boolean';
// }

// export function isFunction(value) {
//   return !!(value && {}.toString.call(value) == '[object Function]');
// }

// export function isNumber(value) {
//   return typeof value === 'number';
// }

// export function isRightClick(nativeEvent) {
//   return nativeEvent.which === 3 || nativeEvent.button === 2;
// }

// export function isString(value) {
//   return typeof value === 'string';
// }

// export function makeId(...args) {
//   return args.filter((val) => val != null).join('--');
// }

// export function noop() {}

// export function stateToAttributeString(state) {
//   return String(state)
//     .replace(/([\s_]+)/g, '-')
//     .toLowerCase();
// }

// export function useControlledState(controlledValue, defaultValue) {
//   let controlledRef = useRef(controlledValue != null);
//   let [valueState, setValue] = useState(defaultValue);
//   let set = useCallback((n) => {
//     if (!controlledRef.current) {
//       setValue(n);
//     }
//   }, []);
//   return [controlledRef.current ? controlledValue : valueState, set];
// }

// export function useConstant(fn) {
//   const ref = React.useRef();
//   if (!ref.current) {
//     ref.current = { v: fn() };
//   }
//   return ref.current.v;
// }

// export function useEventCallback(callback) {
//   const ref = useRef(callback);
//   useIsomorphicLayoutEffect(() => {
//     ref.current = callback;
//   });
//   return useCallback((event, ...args) => ref.current(event, ...args), []);
// }

// export function useCallbackProp(callback) {
//   const ref = useRef(callback);
//   useEffect(() => {
//     ref.current = callback;
//   });
//   return useCallback((...args) => ref.current && ref.current(...args), []);
// }

// export function useEventListener(eventName, listener, element = window) {
//   const savedHandler = useRef(listener);
//   useEffect(() => {
//     savedHandler.current = listener;
//   }, [listener]);

//   useEffect(() => {
//     const isSupported = element && element.addEventListener;
//     if (!isSupported) {
//       return;
//     }

//     function eventListener(event) {
//       savedHandler.current(event);
//     }

//     element.addEventListener(eventName, eventListener);
//     return () => {
//       element.removeEventListener(eventName, eventListener);
//     };
//   }, [eventName, element]);
// }

// export function useFocusChange(handleChange, when, ownerDocument = document) {
//   let lastActiveElement = useRef(ownerDocument.activeElement);

//   useEffect(() => {
//     lastActiveElement.current = ownerDocument.activeElement;

//     function onChange(event) {
//       if (lastActiveElement.current !== ownerDocument.activeElement) {
//         handleChange(
//           ownerDocument.activeElement,
//           lastActiveElement.current,
//           event
//         );
//         lastActiveElement.current = ownerDocument.activeElement;
//       }
//     }

//     ownerDocument.addEventListener(when, onChange, true);

//     return () => {
//       ownerDocument.removeEventListener(when, onChange);
//     };
//   }, [when, handleChange, ownerDocument]);
// }

// export function useForkedRef(...refs) {
//   return useMemo(() => {
//     if (refs.every((ref) => ref == null)) {
//       return null;
//     }
//     return (node) => {
//       refs.forEach((ref) => {
//         assignRef(ref, node);
//       });
//     };
//   }, refs);
// }

// export function usePrevious(value) {
//   const ref = useRef(null);
//   useEffect(() => {
//     ref.current = value;
//   }, [value]);
//   return ref.current;
// }

// export function useUpdateEffect(effect, deps) {
//   const mounted = useRef(false);
//   useEffect(() => {
//     if (mounted.current) {
//       effect();
//     } else {
//       mounted.current = true;
//     }
//   }, deps);
// }

// let useStateLogger = (state, DEBUG) => noop;

// export { useStateLogger };

// export function wrapEvent(theirHandler, ourHandler) {
//   return (event) => {
//     theirHandler && theirHandler(event);
//     if (!event.defaultPrevented) {
//       return ourHandler(event);
//     }
//   };
// }

// let serverHandoffComplete = false;
// let id = 0;
// const genId = () => ++id;

// export const useId = (idFromProps) => {
//   const initialId = idFromProps || (serverHandoffComplete ? genId() : null);

//   const [id, setId] = useState(initialId);

//   useIsomorphicLayoutEffect(() => {
//     if (id === null) {
//       setId(genId());
//     }
//   }, []);

//   useEffect(() => {
//     if (serverHandoffComplete === false) {
//       serverHandoffComplete = true;
//     }
//   }, []);
//   return id != null ? String(id) : undefined;
// };

////

export function matchStateToTerm(state, value) {
  return state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
}

export function matchStateToTermWithHeaders(state, value) {
  return (
    state.header ||
    state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
    state.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
  );
}

export function sortValues(a, b, value) {
  const aLower = a.name.toLowerCase();
  const bLower = b.name.toLowerCase();
  const valueLower = value.toLowerCase();
  const queryPosA = aLower.indexOf(valueLower);
  const queryPosB = bLower.indexOf(valueLower);
  if (queryPosA !== queryPosB) {
    return queryPosA - queryPosB;
  }
  return aLower < bLower ? -1 : 1;
}

export function fakeRequest(value, cb) {
  return setTimeout(
    cb,
    500,
    value
      ? getStates().filter((state) => matchStateToTerm(state, value))
      : getStates()
  );
}

export function fakeCategorizedRequest(value, cb) {
  setTimeout(
    cb,
    500,
    value
      ? getCategorizedStates().filter((state) =>
          matchStateToTermWithHeaders(state, value)
        )
      : getCategorizedStates()
  );
}

export function getStates() {
  return [
    { abbr: 'AL', name: 'Alabama' },
    { abbr: 'AK', name: 'Alaska' },
    { abbr: 'AZ', name: 'Arizona' },
    { abbr: 'AR', name: 'Arkansas' },
    { abbr: 'CA', name: 'California' },
    { abbr: 'CO', name: 'Colorado' },
    { abbr: 'CT', name: 'Connecticut' },
    { abbr: 'DE', name: 'Delaware' },
    { abbr: 'FL', name: 'Florida' },
    { abbr: 'GA', name: 'Georgia' },
    { abbr: 'HI', name: 'Hawaii' },
    { abbr: 'ID', name: 'Idaho' },
    { abbr: 'IL', name: 'Illinois' },
    { abbr: 'IN', name: 'Indiana' },
    { abbr: 'IA', name: 'Iowa' },
    { abbr: 'KS', name: 'Kansas' },
    { abbr: 'KY', name: 'Kentucky' },
    { abbr: 'LA', name: 'Louisiana' },
    { abbr: 'ME', name: 'Maine' },
    { abbr: 'MD', name: 'Maryland' },
    { abbr: 'MA', name: 'Massachusetts' },
    { abbr: 'MI', name: 'Michigan' },
    { abbr: 'MN', name: 'Minnesota' },
    { abbr: 'MS', name: 'Mississippi' },
    { abbr: 'MO', name: 'Missouri' },
    { abbr: 'MT', name: 'Montana' },
    { abbr: 'NE', name: 'Nebraska' },
    { abbr: 'NV', name: 'Nevada' },
    { abbr: 'NH', name: 'New Hampshire' },
    { abbr: 'NJ', name: 'New Jersey' },
    { abbr: 'NM', name: 'New Mexico' },
    { abbr: 'NY', name: 'New York' },
    { abbr: 'NC', name: 'North Carolina' },
    { abbr: 'ND', name: 'North Dakota' },
    { abbr: 'OH', name: 'Ohio' },
    { abbr: 'OK', name: 'Oklahoma' },
    { abbr: 'OR', name: 'Oregon' },
    { abbr: 'PA', name: 'Pennsylvania' },
    { abbr: 'RI', name: 'Rhode Island' },
    { abbr: 'SC', name: 'South Carolina' },
    { abbr: 'SD', name: 'South Dakota' },
    { abbr: 'TN', name: 'Tennessee' },
    { abbr: 'TX', name: 'Texas' },
    { abbr: 'UT', name: 'Utah' },
    { abbr: 'VT', name: 'Vermont' },
    { abbr: 'VA', name: 'Virginia' },
    { abbr: 'WA', name: 'Washington' },
    { abbr: 'WV', name: 'West Virginia' },
    { abbr: 'WI', name: 'Wisconsin' },
    { abbr: 'WY', name: 'Wyoming' },
  ];
}

export function getCategorizedStates() {
  return [
    { header: 'West' },
    { abbr: 'AZ', name: 'Arizona' },
    { abbr: 'CA', name: 'California' },
    { abbr: 'CO', name: 'Colorado' },
    { abbr: 'ID', name: 'Idaho' },
    { abbr: 'MT', name: 'Montana' },
    { abbr: 'NV', name: 'Nevada' },
    { abbr: 'NM', name: 'New Mexico' },
    { abbr: 'OK', name: 'Oklahoma' },
    { abbr: 'OR', name: 'Oregon' },
    { abbr: 'TX', name: 'Texas' },
    { abbr: 'UT', name: 'Utah' },
    { abbr: 'WA', name: 'Washington' },
    { abbr: 'WY', name: 'Wyoming' },
    { header: 'Southeast' },
    { abbr: 'AL', name: 'Alabama' },
    { abbr: 'AR', name: 'Arkansas' },
    { abbr: 'FL', name: 'Florida' },
    { abbr: 'GA', name: 'Georgia' },
    { abbr: 'KY', name: 'Kentucky' },
    { abbr: 'LA', name: 'Louisiana' },
    { abbr: 'MS', name: 'Mississippi' },
    { abbr: 'NC', name: 'North Carolina' },
    { abbr: 'SC', name: 'South Carolina' },
    { abbr: 'TN', name: 'Tennessee' },
    { abbr: 'VA', name: 'Virginia' },
    { abbr: 'WV', name: 'West Virginia' },
    { header: 'Midwest' },
    { abbr: 'IL', name: 'Illinois' },
    { abbr: 'IN', name: 'Indiana' },
    { abbr: 'IA', name: 'Iowa' },
    { abbr: 'KS', name: 'Kansas' },
    { abbr: 'MI', name: 'Michigan' },
    { abbr: 'MN', name: 'Minnesota' },
    { abbr: 'MO', name: 'Missouri' },
    { abbr: 'NE', name: 'Nebraska' },
    { abbr: 'OH', name: 'Ohio' },
    { abbr: 'ND', name: 'North Dakota' },
    { abbr: 'SD', name: 'South Dakota' },
    { abbr: 'WI', name: 'Wisconsin' },
    { header: 'Northeast' },
    { abbr: 'CT', name: 'Connecticut' },
    { abbr: 'DE', name: 'Delaware' },
    { abbr: 'ME', name: 'Maine' },
    { abbr: 'MD', name: 'Maryland' },
    { abbr: 'MA', name: 'Massachusetts' },
    { abbr: 'NH', name: 'New Hampshire' },
    { abbr: 'NJ', name: 'New Jersey' },
    { abbr: 'NY', name: 'New York' },
    { abbr: 'PA', name: 'Pennsylvania' },
    { abbr: 'RI', name: 'Rhode Island' },
    { abbr: 'VT', name: 'Vermont' },
    { header: 'Pacific' },
    { abbr: 'AK', name: 'Alaska' },
    { abbr: 'HI', name: 'Hawaii' },
  ];
}

//

// export {
//   As,
//   AssignableRef,
//   ComponentWithAs,
//   ComponentWithForwardedRef,
//   DistributiveOmit,
//   PropsFromAs,
//   PropsWithAs,
//   SingleOrArray,
//   ThenArg,
// };
