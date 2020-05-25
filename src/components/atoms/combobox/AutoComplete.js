import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import scrollIntoView from 'dom-scroll-into-view';

const IMPERATIVE_API = [
  'blur',
  'checkValidity',
  'click',
  'focus',
  'select',
  'setCustomValidity',
  'setSelectionRange',
  'setRangeText',
];

function getScrollOffset() {
  return {
    x:
      window.pageXOffset !== undefined
        ? window.pageXOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollLeft,
    y:
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop,
  };
}

class Autocomplete extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    shouldItemRender: PropTypes.func,
    isItemSelectable: PropTypes.func,
    sortItems: PropTypes.func,
    getItemValue: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    renderMenu: PropTypes.func,
    menuStyle: PropTypes.object,
    renderInput: PropTypes.func,
    inputProps: PropTypes.object,
    wrapperProps: PropTypes.object,
    wrapperStyle: PropTypes.object,
    autoHighlight: PropTypes.bool,
    selectOnBlur: PropTypes.bool,
    onMenuVisibilityChange: PropTypes.func,
    open: PropTypes.bool,
    debug: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    wrapperProps: {},
    wrapperStyle: {
      display: 'inline-block',
    },
    inputProps: {},
    renderInput(props) {
      return <input {...props} />;
    },
    onChange() {},
    onSelect() {},
    isItemSelectable() {
      return true;
    },
    renderMenu(items, value, style) {
      return <div style={{ ...style, ...this.menuStyle }} children={items} />;
    },
    menuStyle: {
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2px 0',
      fontSize: '90%',
      position: 'fixed',
      overflow: 'auto',
      maxHeight: '50%',
    },
    autoHighlight: true,
    selectOnBlur: false,
    onMenuVisibilityChange() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      highlightedIndex: null,
    };
    this._debugStates = [];
    this.ensureHighlightedIndex = this.ensureHighlightedIndex.bind(this);
    this.exposeAPI = this.exposeAPI.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.maybeAutoCompleteText = this.maybeAutoCompleteText.bind(this);
  }

  componentWillMount() {
    this.refs = {};
    this._ignoreBlur = false;
    this._ignoreFocus = false;
    this._scrollOffset = null;
    this._scrollTimer = null;
  }

  componentWillUnmount() {
    clearTimeout(this._scrollTimer);
    this._scrollTimer = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.highlightedIndex !== null) {
      this.setState(this.ensureHighlightedIndex);
    }
    if (
      nextProps.autoHighlight &&
      (this.props.value !== nextProps.value ||
        this.state.highlightedIndex === null)
    ) {
      this.setState(this.maybeAutoCompleteText);
    }
  }

  componentDidMount() {
    if (this.isOpen()) {
      this.setMenuPositions();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.state.isOpen && !prevState.isOpen) ||
      ('open' in this.props && this.props.open && !prevProps.open)
    )
      this.setMenuPositions();

    this.maybeScrollItemIntoView();
    if (prevState.isOpen !== this.state.isOpen) {
      this.props.onMenuVisibilityChange(this.state.isOpen);
    }
  }

  exposeAPI(el) {
    this.refs.input = el;
    IMPERATIVE_API.forEach(
      (ev) => (this[ev] = el && el[ev] && el[ev].bind(el))
    );
  }

  maybeScrollItemIntoView() {
    if (this.isOpen() && this.state.highlightedIndex !== null) {
      const itemNode = this.refs[`item-${this.state.highlightedIndex}`];
      const menuNode = this.refs.menu;
      scrollIntoView(findDOMNode(itemNode), findDOMNode(menuNode), {
        onlyScrollIfNeeded: true,
      });
    }
  }

  handleKeyDown(event) {
    if (Autocomplete.keyDownHandlers[event.key])
      Autocomplete.keyDownHandlers[event.key].call(this, event);
    else if (!this.isOpen()) {
      this.setState({
        isOpen: true,
      });
    }
  }

  handleChange(event) {
    this.props.onChange(event, event.target.value);
  }

  static keyDownHandlers = {
    ArrowDown(event) {
      event.preventDefault();
      const items = this.getFilteredItems(this.props);
      if (!items.length) return;
      const { highlightedIndex } = this.state;
      let index = highlightedIndex === null ? -1 : highlightedIndex;
      for (let i = 0; i < items.length; i++) {
        const p = (index + i + 1) % items.length;
        if (this.props.isItemSelectable(items[p])) {
          index = p;
          break;
        }
      }
      if (index > -1 && index !== highlightedIndex) {
        this.setState({
          highlightedIndex: index,
          isOpen: true,
        });
      }
    },

    ArrowUp(event) {
      event.preventDefault();
      const items = this.getFilteredItems(this.props);
      if (!items.length) return;
      const { highlightedIndex } = this.state;
      let index = highlightedIndex === null ? items.length : highlightedIndex;
      for (let i = 0; i < items.length; i++) {
        const p = (index - (1 + i) + items.length) % items.length;
        if (this.props.isItemSelectable(items[p])) {
          index = p;
          break;
        }
      }
      if (index !== items.length) {
        this.setState({
          highlightedIndex: index,
          isOpen: true,
        });
      }
    },

    Enter(event) {
      if (event.keyCode !== 13) return;
      this.setIgnoreBlur(false);
      if (!this.isOpen()) {
        return;
      } else if (this.state.highlightedIndex == null) {
        this.setState(
          {
            isOpen: false,
          },
          () => {
            this.refs.input.select();
          }
        );
      } else {
        event.preventDefault();
        const item = this.getFilteredItems(this.props)[
          this.state.highlightedIndex
        ];
        const value = this.props.getItemValue(item);
        this.setState(
          {
            isOpen: false,
            highlightedIndex: null,
          },
          () => {
            this.refs.input.setSelectionRange(value.length, value.length);
            this.props.onSelect(value, item);
          }
        );
      }
    },

    Escape() {
      this.setIgnoreBlur(false);
      this.setState({
        highlightedIndex: null,
        isOpen: false,
      });
    },

    Tab() {
      this.setIgnoreBlur(false);
    },
  };

  getFilteredItems(props) {
    let items = props.items;

    if (props.shouldItemRender) {
      items = items.filter((item) => props.shouldItemRender(item, props.value));
    }

    if (props.sortItems) {
      items.sort((a, b) => props.sortItems(a, b, props.value));
    }

    return items;
  }

  maybeAutoCompleteText(state, props) {
    const { highlightedIndex } = state;
    const { value, getItemValue } = props;
    let index = highlightedIndex === null ? 0 : highlightedIndex;
    let items = this.getFilteredItems(props);
    for (let i = 0; i < items.length; i++) {
      if (props.isItemSelectable(items[index])) break;
      index = (index + 1) % items.length;
    }
    const matchedItem =
      items[index] && props.isItemSelectable(items[index])
        ? items[index]
        : null;
    if (value !== '' && matchedItem) {
      const itemValue = getItemValue(matchedItem);
      const itemValueDoesMatch =
        itemValue.toLowerCase().indexOf(value.toLowerCase()) === 0;
      if (itemValueDoesMatch) {
        return { highlightedIndex: index };
      }
    }
    return { highlightedIndex: null };
  }

  ensureHighlightedIndex(state, props) {
    if (state.highlightedIndex >= this.getFilteredItems(props).length) {
      return { highlightedIndex: null };
    }
  }

  setMenuPositions() {
    const node = this.refs.input;
    const rect = node.getBoundingClientRect();
    const computedStyle = global.window.getComputedStyle(node);
    const marginBottom = parseInt(computedStyle.marginBottom, 10) || 0;
    const marginLeft = parseInt(computedStyle.marginLeft, 10) || 0;
    const marginRight = parseInt(computedStyle.marginRight, 10) || 0;
    this.setState({
      menuTop: rect.bottom + marginBottom,
      menuLeft: rect.left + marginLeft,
      menuWidth: rect.width + marginLeft + marginRight,
    });
  }

  highlightItemFromMouse(index) {
    this.setState({ highlightedIndex: index });
  }

  selectItemFromMouse(item) {
    const value = this.props.getItemValue(item);

    this.setIgnoreBlur(false);
    this.setState(
      {
        isOpen: false,
        highlightedIndex: null,
      },
      () => {
        this.props.onSelect(value, item);
      }
    );
  }

  setIgnoreBlur(ignore) {
    this._ignoreBlur = ignore;
  }

  renderMenu() {
    const items = this.getFilteredItems(this.props).map((item, index) => {
      const element = this.props.renderItem(
        item,
        this.state.highlightedIndex === index,
        { cursor: 'default' }
      );
      return React.cloneElement(element, {
        onMouseEnter: this.props.isItemSelectable(item)
          ? () => this.highlightItemFromMouse(index)
          : null,
        onClick: this.props.isItemSelectable(item)
          ? () => this.selectItemFromMouse(item)
          : null,
        ref: (e) => (this.refs[`item-${index}`] = e),
      });
    });
    const style = {
      left: this.state.menuLeft,
      top: this.state.menuTop,
      minWidth: this.state.menuWidth,
    };
    const menu = this.props.renderMenu(items, this.props.value, style);
    return React.cloneElement(menu, {
      ref: (e) => (this.refs.menu = e),
      onTouchStart: () => this.setIgnoreBlur(true),
      onMouseEnter: () => this.setIgnoreBlur(true),
      onMouseLeave: () => this.setIgnoreBlur(false),
    });
  }

  handleInputBlur(event) {
    if (this._ignoreBlur) {
      this._ignoreFocus = true;
      this._scrollOffset = getScrollOffset();
      this.refs.input.focus();
      return;
    }
    let setStateCallback;
    const { highlightedIndex } = this.state;
    if (this.props.selectOnBlur && highlightedIndex !== null) {
      const items = this.getFilteredItems(this.props);
      const item = items[highlightedIndex];
      const value = this.props.getItemValue(item);
      setStateCallback = () => this.props.onSelect(value, item);
    }
    this.setState(
      {
        isOpen: false,
        highlightedIndex: null,
      },
      setStateCallback
    );
    const { onBlur } = this.props.inputProps;
    if (onBlur) {
      onBlur(event);
    }
  }

  handleInputFocus(event) {
    if (this._ignoreFocus) {
      this._ignoreFocus = false;
      const { x, y } = this._scrollOffset;
      this._scrollOffset = null;
      window.scrollTo(x, y);
      clearTimeout(this._scrollTimer);
      this._scrollTimer = setTimeout(() => {
        this._scrollTimer = null;
        window.scrollTo(x, y);
      }, 0);
      return;
    }
    this.setState({ isOpen: true });
    const { onFocus } = this.props.inputProps;
    if (onFocus) {
      onFocus(event);
    }
  }

  isInputFocused() {
    const el = this.refs.input;
    return el.ownerDocument && el === el.ownerDocument.activeElement;
  }

  handleInputClick() {
    if (this.isInputFocused() && !this.isOpen())
      this.setState({ isOpen: true });
  }

  composeEventHandlers(internal, external) {
    return external
      ? (e) => {
          internal(e);
          external(e);
        }
      : internal;
  }

  isOpen() {
    return 'open' in this.props ? this.props.open : this.state.isOpen;
  }

  render() {
    if (this.props.debug) {
      this._debugStates.push({
        id: this._debugStates.length,
        state: this.state,
      });
    }

    const { inputProps } = this.props;
    const open = this.isOpen();
    return (
      <div style={{ ...this.props.wrapperStyle }} {...this.props.wrapperProps}>
        {this.props.renderInput({
          ...inputProps,
          role: 'combobox',
          'aria-autocomplete': 'list',
          'aria-expanded': open,
          autoComplete: 'off',
          ref: this.exposeAPI,
          onFocus: this.handleInputFocus,
          onBlur: this.handleInputBlur,
          onChange: this.handleChange,
          onKeyDown: this.composeEventHandlers(
            this.handleKeyDown,
            inputProps.onKeyDown
          ),
          onClick: this.composeEventHandlers(
            this.handleInputClick,
            inputProps.onClick
          ),
          value: this.props.value,
        })}
        {open && this.renderMenu()}
        {this.props.debug && (
          <pre style={{ marginLeft: 300 }}>
            {JSON.stringify(
              this._debugStates.slice(
                Math.max(0, this._debugStates.length - 5),
                this._debugStates.length
              ),
              null,
              2
            )}
          </pre>
        )}
      </div>
    );
  }
}

export default Autocomplete;
