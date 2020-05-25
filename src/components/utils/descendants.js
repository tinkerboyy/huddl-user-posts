import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  createNamedContext,
  noop,
  useIsomorphicLayoutEffect,
  usePrevious,
} from './utils';

export function createDescendantContext(name, initialValue = {}) {
  const descendants = [];
  return createNamedContext(name, {
    descendants,
    registerDescendant: noop,
    unregisterDescendant: noop,
    ...initialValue,
  });
}

export function useDescendant(descendant, context, indexProp) {
  let [, forceUpdate] = useState();
  let { registerDescendant, unregisterDescendant, descendants } = useContext(
    context
  );

  let index =
    indexProp ??
    descendants.findIndex((item) => item.element === descendant.element);

  let previousDescendants = usePrevious(descendants);
  let someDescendantsHaveChanged = descendants.some((descendant, index) => {
    return descendant.element !== previousDescendants?.[index]?.element;
  });

  useIsomorphicLayoutEffect(() => {
    if (!descendant.element) forceUpdate({});
    registerDescendant({
      ...descendant,
      index,
    });
    return () => unregisterDescendant(descendant.element);
  }, [
    registerDescendant,
    unregisterDescendant,
    index,
    someDescendantsHaveChanged,
    ...Object.values(descendant),
  ]);

  return index;
}

export function useDescendantsInit() {
  return useState([]);
}

export function useDescendants(ctx) {
  return useContext(ctx).descendants;
}

export function DescendantProvider({ context: Ctx, children, items, set }) {
  let registerDescendant = useCallback(
    ({ element, index: explicitIndex, ...rest }) => {
      if (!element) {
        return;
      }

      set((items) => {
        let newItems;
        if (explicitIndex != null) {
          newItems = [
            ...items,
            {
              ...rest,
              element,
              index: explicitIndex,
            },
          ];
        } else if (items.length === 0) {
          newItems = [
            ...items,
            {
              ...rest,
              element,
              index: 0,
            },
          ];
        } else if (items.find((item) => item.element === element)) {
          newItems = items;
        } else {
          let index = items.findIndex((item) => {
            if (!item.element || !element) {
              return false;
            }

            return Boolean(
              item.element.compareDocumentPosition(element) &
                Node.DOCUMENT_POSITION_PRECEDING
            );
          });

          let newItem = {
            ...rest,
            element,
            index,
          };

          if (index === -1) {
            newItems = [...items, newItem];
          } else {
            newItems = [
              ...items.slice(0, index),
              newItem,
              ...items.slice(index),
            ];
          }
        }
        return newItems.map((item, index) => ({ ...item, index }));
      });
    },
    []
  );

  let unregisterDescendant = useCallback((element) => {
    if (!element) {
      return;
    }

    set((items) => items.filter((item) => element !== item.element));
  }, []);

  return (
    <Ctx.Provider
      value={useMemo(() => {
        return {
          descendants: items,
          registerDescendant,
          unregisterDescendant,
        };
      }, [items, registerDescendant, unregisterDescendant])}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useDescendantKeyDown(context, options) {
  let { descendants } = useContext(context);
  let {
    callback,
    currentIndex,
    filter,
    key = 'index',
    orientation = 'vertical',
    rotate = true,
    rtl = false,
  } = options;
  let index = currentIndex ?? -1;

  return function handleKeyDown(event) {
    if (
      ![
        'ArrowDown',
        'ArrowUp',
        'ArrowLeft',
        'ArrowRight',
        'PageUp',
        'PageDown',
        'Home',
        'End',
      ].includes(event.key)
    ) {
      return;
    }

    // If we use a filter function, we need to re-index our descendants array
    // so that filtered descendent elements aren't selected.
    let selectableDescendants = filter
      ? descendants.filter(filter)
      : descendants;

    // Current index should map to the updated array vs. the original
    // descendants array.
    if (filter) {
      index = selectableDescendants.findIndex(
        (descendant) => descendant.index === currentIndex
      );
    }

    // We need some options for any of this to work!
    if (!selectableDescendants.length) {
      return;
    }

    function getNextOption() {
      let atBottom = index === selectableDescendants.length - 1;
      return atBottom
        ? rotate
          ? getFirstOption()
          : selectableDescendants[index]
        : selectableDescendants[(index + 1) % selectableDescendants.length];
    }

    function getPreviousOption() {
      let atTop = index === 0;
      return atTop
        ? rotate
          ? getLastOption()
          : selectableDescendants[index]
        : selectableDescendants[
            (index - 1 + selectableDescendants.length) %
              selectableDescendants.length
          ];
    }

    function getFirstOption() {
      return selectableDescendants[0];
    }

    function getLastOption() {
      return selectableDescendants[selectableDescendants.length - 1];
    }

    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          let next = getNextOption();
          callback(key === 'option' ? next : next[key]);
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          let prev = getPreviousOption();
          callback(key === 'option' ? prev : prev[key]);
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          let nextOrPrev = (rtl ? getNextOption : getPreviousOption)();
          callback(key === 'option' ? nextOrPrev : nextOrPrev[key]);
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          let prevOrNext = (rtl ? getPreviousOption : getNextOption)();
          callback(key === 'option' ? prevOrNext : prevOrNext[key]);
        }
        break;
      case 'PageUp':
        event.preventDefault();
        let prevOrFirst = (event.ctrlKey
          ? getPreviousOption
          : getFirstOption)();
        callback(key === 'option' ? prevOrFirst : prevOrFirst[key]);
        break;
      case 'Home':
        event.preventDefault();
        let first = getFirstOption();
        callback(key === 'option' ? first : first[key]);
        break;
      case 'PageDown':
        event.preventDefault();
        let nextOrLast = (event.ctrlKey ? getNextOption : getLastOption)();
        callback(key === 'option' ? nextOrLast : nextOrLast[key]);
        break;
      case 'End':
        event.preventDefault();
        let last = getLastOption();
        callback(key === 'option' ? last : last[key]);
        break;
    }
  };
}
