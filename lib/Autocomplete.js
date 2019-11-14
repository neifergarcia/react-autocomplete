"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var React = require('react');

var PropTypes = require('prop-types');

var _require = require('react-dom'),
    findDOMNode = _require.findDOMNode;

var scrollIntoView = require('dom-scroll-into-view');

var IMPERATIVE_API = ['blur', 'checkValidity', 'click', 'focus', 'select', 'setCustomValidity', 'setSelectionRange', 'setRangeText'];

function getScrollOffset() {
  return {
    x: window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
    y: window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
  };
}

var Autocomplete =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(Autocomplete, _React$Component);

  function Autocomplete(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Autocomplete);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Autocomplete).call(this, props));
    _this.state = {
      isOpen: false,
      highlightedIndex: null
    };
    _this._debugStates = [];
    _this.ensureHighlightedIndex = _this.ensureHighlightedIndex.bind((0, _assertThisInitialized2["default"])(_this));
    _this.exposeAPI = _this.exposeAPI.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleInputFocus = _this.handleInputFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleInputBlur = _this.handleInputBlur.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleInputClick = _this.handleInputClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.maybeAutoCompleteText = _this.maybeAutoCompleteText.bind((0, _assertThisInitialized2["default"])(_this));
    _this.refs = {};
    _this._ignoreBlur = false;
    _this._ignoreFocus = false;
    _this._scrollOffset = null;
    _this._scrollTimer = null;
    return _this;
  }

  (0, _createClass2["default"])(Autocomplete, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this._scrollTimer);
      this._scrollTimer = null;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.state.highlightedIndex !== null) {
        this.setState(this.ensureHighlightedIndex);
      }

      if (nextProps.autoHighlight && (this.props.value !== nextProps.value || this.state.highlightedIndex === null)) {
        this.setState(this.maybeAutoCompleteText);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.isOpen()) {
        this.setMenuPositions();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.isOpen && !prevState.isOpen || 'open' in this.props && this.props.open && !prevProps.open) this.setMenuPositions();
      this.maybeScrollItemIntoView();

      if (prevState.isOpen !== this.state.isOpen) {
        this.props.onMenuVisibilityChange(this.state.isOpen);
      }
    }
  }, {
    key: "exposeAPI",
    value: function exposeAPI(el) {
      var _this2 = this;

      this.refs.input = el;
      IMPERATIVE_API.forEach(function (ev) {
        return _this2[ev] = el && el[ev] && el[ev].bind(el);
      });
    }
  }, {
    key: "maybeScrollItemIntoView",
    value: function maybeScrollItemIntoView() {
      if (this.isOpen() && this.state.highlightedIndex !== null) {
        var itemNode = this.refs["item-".concat(this.state.highlightedIndex)];
        var menuNode = this.refs.menu;
        scrollIntoView(findDOMNode(itemNode), findDOMNode(menuNode), {
          onlyScrollIfNeeded: true
        });
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      if (Autocomplete.keyDownHandlers[event.key]) Autocomplete.keyDownHandlers[event.key].call(this, event);else if (!this.isOpen()) {
        this.setState({
          isOpen: true
        });
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      this.props.onChange(event, event.target.value);
    }
  }, {
    key: "getFilteredItems",
    value: function getFilteredItems(props) {
      var items = props.items;

      if (props.shouldItemRender) {
        items = items.filter(function (item) {
          return props.shouldItemRender(item, props.value);
        });
      }

      if (props.sortItems) {
        items.sort(function (a, b) {
          return props.sortItems(a, b, props.value);
        });
      }

      return items;
    }
  }, {
    key: "maybeAutoCompleteText",
    value: function maybeAutoCompleteText(state, props) {
      var highlightedIndex = state.highlightedIndex;
      var value = props.value,
          getItemValue = props.getItemValue;
      var index = highlightedIndex === null ? 0 : highlightedIndex;
      var items = this.getFilteredItems(props);

      for (var i = 0; i < items.length; i++) {
        if (props.isItemSelectable(items[index])) break;
        index = (index + 1) % items.length;
      }

      var matchedItem = items[index] && props.isItemSelectable(items[index]) ? items[index] : null;

      if (value !== '' && matchedItem) {
        var itemValue = getItemValue(matchedItem);
        var itemValueDoesMatch = itemValue.toLowerCase().indexOf(value.toLowerCase()) === 0;

        if (itemValueDoesMatch) {
          return {
            highlightedIndex: index
          };
        }
      }

      return {
        highlightedIndex: null
      };
    }
  }, {
    key: "ensureHighlightedIndex",
    value: function ensureHighlightedIndex(state, props) {
      if (state.highlightedIndex >= this.getFilteredItems(props).length) {
        return {
          highlightedIndex: null
        };
      }
    }
  }, {
    key: "setMenuPositions",
    value: function setMenuPositions() {
      var node = this.refs.input;
      var rect = node.getBoundingClientRect();
      var computedStyle = global.window.getComputedStyle(node);
      var marginBottom = parseInt(computedStyle.marginBottom, 10) || 0;
      var marginLeft = parseInt(computedStyle.marginLeft, 10) || 0;
      var marginRight = parseInt(computedStyle.marginRight, 10) || 0;
      this.setState({
        menuTop: rect.bottom + marginBottom,
        menuLeft: rect.left + marginLeft,
        menuWidth: rect.width + marginLeft + marginRight
      });
    }
  }, {
    key: "highlightItemFromMouse",
    value: function highlightItemFromMouse(index) {
      this.setState({
        highlightedIndex: index
      });
    }
  }, {
    key: "selectItemFromMouse",
    value: function selectItemFromMouse(item) {
      var _this3 = this;

      var value = this.props.getItemValue(item); // The menu will de-render before a mouseLeave event
      // happens. Clear the flag to release control over focus

      this.setIgnoreBlur(false);
      this.setState({
        isOpen: false,
        highlightedIndex: null
      }, function () {
        _this3.props.onSelect(value, item);
      });
    }
  }, {
    key: "setIgnoreBlur",
    value: function setIgnoreBlur(ignore) {
      this._ignoreBlur = ignore;
    }
  }, {
    key: "renderMenu",
    value: function renderMenu() {
      var _this4 = this;

      var items = this.getFilteredItems(this.props).map(function (item, index) {
        var element = _this4.props.renderItem(item, _this4.state.highlightedIndex === index, {
          cursor: 'default'
        });

        return React.cloneElement(element, {
          onMouseEnter: _this4.props.isItemSelectable(item) ? function () {
            return _this4.highlightItemFromMouse(index);
          } : null,
          onClick: _this4.props.isItemSelectable(item) ? function () {
            return _this4.selectItemFromMouse(item);
          } : null,
          ref: function ref(e) {
            return _this4.refs["item-".concat(index)] = e;
          }
        });
      });
      var style = {
        left: this.state.menuLeft,
        top: this.state.menuTop,
        minWidth: this.state.menuWidth
      };
      var menu = this.props.renderMenu(items, this.props.value, style);
      return React.cloneElement(menu, {
        ref: function ref(e) {
          return _this4.refs.menu = e;
        },
        // Ignore blur to prevent menu from de-rendering before we can process click
        onTouchStart: function onTouchStart() {
          return _this4.setIgnoreBlur(true);
        },
        onMouseEnter: function onMouseEnter() {
          return _this4.setIgnoreBlur(true);
        },
        onMouseLeave: function onMouseLeave() {
          return _this4.setIgnoreBlur(false);
        }
      });
    }
  }, {
    key: "handleInputBlur",
    value: function handleInputBlur(event) {
      var _this5 = this;

      if (this._ignoreBlur) {
        this._ignoreFocus = true;
        this._scrollOffset = getScrollOffset();
        this.refs.input.focus();
        return;
      }

      var setStateCallback;
      var highlightedIndex = this.state.highlightedIndex;

      if (this.props.selectOnBlur && highlightedIndex !== null) {
        var items = this.getFilteredItems(this.props);
        var item = items[highlightedIndex];
        var value = this.props.getItemValue(item);

        setStateCallback = function setStateCallback() {
          return _this5.props.onSelect(value, item);
        };
      }

      this.setState({
        isOpen: false,
        highlightedIndex: null
      }, setStateCallback);
      var onBlur = this.props.inputProps.onBlur;

      if (onBlur) {
        onBlur(event);
      }
    }
  }, {
    key: "handleInputFocus",
    value: function handleInputFocus(event) {
      var _this6 = this;

      if (this._ignoreFocus) {
        this._ignoreFocus = false;
        var _this$_scrollOffset = this._scrollOffset,
            x = _this$_scrollOffset.x,
            y = _this$_scrollOffset.y;
        this._scrollOffset = null; // Focus will cause the browser to scroll the <input> into view.
        // This can cause the mouse coords to change, which in turn
        // could cause a new highlight to happen, cancelling the click
        // event (when selecting with the mouse)

        window.scrollTo(x, y); // Some browsers wait until all focus event handlers have been
        // processed before scrolling the <input> into view, so let's
        // scroll again on the next tick to ensure we're back to where
        // the user was before focus was lost. We could do the deferred
        // scroll only, but that causes a jarring split second jump in
        // some browsers that scroll before the focus event handlers
        // are triggered.

        clearTimeout(this._scrollTimer);
        this._scrollTimer = setTimeout(function () {
          _this6._scrollTimer = null;
          window.scrollTo(x, y);
        }, 0);
        return;
      }

      this.setState({
        isOpen: true
      });
      var onFocus = this.props.inputProps.onFocus;

      if (onFocus) {
        onFocus(event);
      }
    }
  }, {
    key: "isInputFocused",
    value: function isInputFocused() {
      var el = this.refs.input;
      return el.ownerDocument && el === el.ownerDocument.activeElement;
    }
  }, {
    key: "handleInputClick",
    value: function handleInputClick() {
      // Input will not be focused if it's disabled
      if (this.isInputFocused() && !this.isOpen()) this.setState({
        isOpen: true
      });
    }
  }, {
    key: "composeEventHandlers",
    value: function composeEventHandlers(internal, external) {
      return external ? function (e) {
        internal(e);
        external(e);
      } : internal;
    }
  }, {
    key: "isOpen",
    value: function isOpen() {
      return 'open' in this.props ? this.props.open : this.state.isOpen;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.debug) {
        // you don't like it, you love it
        this._debugStates.push({
          id: this._debugStates.length,
          state: this.state
        });
      }

      var inputProps = this.props.inputProps;
      var open = this.isOpen();
      return React.createElement("div", (0, _extends2["default"])({
        style: _objectSpread({}, this.props.wrapperStyle)
      }, this.props.wrapperProps), this.props.renderInput(_objectSpread({}, inputProps, {
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-expanded': open,
        autoComplete: 'off',
        ref: this.exposeAPI,
        onFocus: this.handleInputFocus,
        onBlur: this.handleInputBlur,
        onChange: this.handleChange,
        onKeyDown: this.composeEventHandlers(this.handleKeyDown, inputProps.onKeyDown),
        onClick: this.composeEventHandlers(this.handleInputClick, inputProps.onClick),
        value: this.props.value
      })), open && this.renderMenu(), this.props.debug && React.createElement("pre", {
        style: {
          marginLeft: 300
        }
      }, JSON.stringify(this._debugStates.slice(Math.max(0, this._debugStates.length - 5), this._debugStates.length), null, 2)));
    }
  }]);
  return Autocomplete;
}(React.Component);

(0, _defineProperty2["default"])(Autocomplete, "propTypes", {
  /**
   * The items to display in the dropdown menu
   */
  items: PropTypes.array.isRequired,

  /**
   * The value to display in the input field
   */
  value: PropTypes.any,

  /**
   * Arguments: `event: Event, value: String`
   *
   * Invoked every time the user changes the input's value.
   */
  onChange: PropTypes.func,

  /**
   * Arguments: `value: String, item: Any`
   *
   * Invoked when the user selects an item from the dropdown menu.
   */
  onSelect: PropTypes.func,

  /**
   * Arguments: `item: Any, value: String`
   *
   * Invoked for each entry in `items` and its return value is used to
   * determine whether or not it should be displayed in the dropdown menu.
   * By default all items are always rendered.
   */
  shouldItemRender: PropTypes.func,

  /**
   * Arguments: `item: Any`
   *
   * Invoked when attempting to select an item. The return value is used to
   * determine whether the item should be selectable or not.
   * By default all items are selectable.
   */
  isItemSelectable: PropTypes.func,

  /**
   * Arguments: `itemA: Any, itemB: Any, value: String`
   *
   * The function which is used to sort `items` before display.
   */
  sortItems: PropTypes.func,

  /**
   * Arguments: `item: Any`
   *
   * Used to read the display value from each entry in `items`.
   */
  getItemValue: PropTypes.func.isRequired,

  /**
   * Arguments: `item: Any, isHighlighted: Boolean, styles: Object`
   *
   * Invoked for each entry in `items` that also passes `shouldItemRender` to
   * generate the render tree for each item in the dropdown menu. `styles` is
   * an optional set of styles that can be applied to improve the look/feel
   * of the items in the dropdown menu.
   */
  renderItem: PropTypes.func.isRequired,

  /**
   * Arguments: `items: Array<Any>, value: String, styles: Object`
   *
   * Invoked to generate the render tree for the dropdown menu. Ensure the
   * returned tree includes every entry in `items` or else the highlight order
   * and keyboard navigation logic will break. `styles` will contain
   * { top, left, minWidth } which are the coordinates of the top-left corner
   * and the width of the dropdown menu.
   */
  renderMenu: PropTypes.func,

  /**
   * Styles that are applied to the dropdown menu in the default `renderMenu`
   * implementation. If you override `renderMenu` and you want to use
   * `menuStyle` you must manually apply them (`this.props.menuStyle`).
   */
  menuStyle: PropTypes.object,

  /**
   * Arguments: `props: Object`
   *
   * Invoked to generate the input element. The `props` argument is the result
   * of merging `props.inputProps` with a selection of props that are required
   * both for functionality and accessibility. At the very least you need to
   * apply `props.ref` and all `props.on<event>` event handlers. Failing to do
   * this will cause `Autocomplete` to behave unexpectedly.
   */
  renderInput: PropTypes.func,

  /**
   * Props passed to `props.renderInput`. By default these props will be
   * applied to the `<input />` element rendered by `Autocomplete`, unless you
   * have specified a custom value for `props.renderInput`. Any properties
   * supported by `HTMLInputElement` can be specified, apart from the
   * following which are set by `Autocomplete`: value, autoComplete, role,
   * aria-autocomplete. `inputProps` is commonly used for (but not limited to)
   * placeholder, event handlers (onFocus, onBlur, etc.), autoFocus, etc..
   */
  inputProps: PropTypes.object,

  /**
   * Props that are applied to the element which wraps the `<input />` and
   * dropdown menu elements rendered by `Autocomplete`.
   */
  wrapperProps: PropTypes.object,

  /**
   * This is a shorthand for `wrapperProps={{ style: <your styles> }}`.
   * Note that `wrapperStyle` is applied before `wrapperProps`, so the latter
   * will win if it contains a `style` entry.
   */
  wrapperStyle: PropTypes.object,

  /**
   * Whether or not to automatically highlight the top match in the dropdown
   * menu.
   */
  autoHighlight: PropTypes.bool,

  /**
   * Whether or not to automatically select the highlighted item when the
   * `<input>` loses focus.
   */
  selectOnBlur: PropTypes.bool,

  /**
   * Arguments: `isOpen: Boolean`
   *
   * Invoked every time the dropdown menu's visibility changes (i.e. every
   * time it is displayed/hidden).
   */
  onMenuVisibilityChange: PropTypes.func,

  /**
   * Used to override the internal logic which displays/hides the dropdown
   * menu. This is useful if you want to force a certain state based on your
   * UX/business logic. Use it together with `onMenuVisibilityChange` for
   * fine-grained control over the dropdown menu dynamics.
   */
  open: PropTypes.bool,
  debug: PropTypes.bool
});
(0, _defineProperty2["default"])(Autocomplete, "defaultProps", {
  value: '',
  wrapperProps: {},
  wrapperStyle: {
    display: 'inline-block'
  },
  inputProps: {},
  renderInput: function renderInput(props) {
    return React.createElement("input", props);
  },
  onChange: function onChange() {},
  onSelect: function onSelect() {},
  isItemSelectable: function isItemSelectable() {
    return true;
  },
  renderMenu: function renderMenu(items, value, style) {
    return React.createElement("div", {
      style: _objectSpread({}, style, {}, this.menuStyle),
      children: items
    });
  },
  menuStyle: {
    borderRadius: '3px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2px 0',
    fontSize: '90%',
    position: 'fixed',
    overflow: 'auto',
    maxHeight: '50%' // TODO: don't cheat, let it flow to the bottom

  },
  autoHighlight: true,
  selectOnBlur: false,
  onMenuVisibilityChange: function onMenuVisibilityChange() {}
});
(0, _defineProperty2["default"])(Autocomplete, "keyDownHandlers", {
  ArrowDown: function ArrowDown(event) {
    event.preventDefault();
    var items = this.getFilteredItems(this.props);
    if (!items.length) return;
    var highlightedIndex = this.state.highlightedIndex;
    var index = highlightedIndex === null ? -1 : highlightedIndex;

    for (var i = 0; i < items.length; i++) {
      var p = (index + i + 1) % items.length;

      if (this.props.isItemSelectable(items[p])) {
        index = p;
        break;
      }
    }

    if (index > -1 && index !== highlightedIndex) {
      this.setState({
        highlightedIndex: index,
        isOpen: true
      });
    }
  },
  ArrowUp: function ArrowUp(event) {
    event.preventDefault();
    var items = this.getFilteredItems(this.props);
    if (!items.length) return;
    var highlightedIndex = this.state.highlightedIndex;
    var index = highlightedIndex === null ? items.length : highlightedIndex;

    for (var i = 0; i < items.length; i++) {
      var p = (index - (1 + i) + items.length) % items.length;

      if (this.props.isItemSelectable(items[p])) {
        index = p;
        break;
      }
    }

    if (index !== items.length) {
      this.setState({
        highlightedIndex: index,
        isOpen: true
      });
    }
  },
  Enter: function Enter(event) {
    var _this7 = this;

    // Key code 229 is used for selecting items from character selectors (Pinyin, Kana, etc)
    if (event.keyCode !== 13) return; // In case the user is currently hovering over the menu

    this.setIgnoreBlur(false);

    if (!this.isOpen()) {
      // menu is closed so there is no selection to accept -> do nothing
      return;
    } else if (this.state.highlightedIndex == null) {
      // input has focus but no menu item is selected + enter is hit -> close the menu, highlight whatever's in input
      this.setState({
        isOpen: false
      }, function () {
        _this7.refs.input.select();
      });
    } else {
      // text entered + menu item has been highlighted + enter is hit -> update value to that of selected menu item, close the menu
      event.preventDefault();
      var item = this.getFilteredItems(this.props)[this.state.highlightedIndex];
      var value = this.props.getItemValue(item);
      this.setState({
        isOpen: false,
        highlightedIndex: null
      }, function () {
        //this.refs.input.focus() // TODO: file issue
        _this7.refs.input.setSelectionRange(value.length, value.length);

        _this7.props.onSelect(value, item);
      });
    }
  },
  Escape: function Escape() {
    // In case the user is currently hovering over the menu
    this.setIgnoreBlur(false);
    this.setState({
      highlightedIndex: null,
      isOpen: false
    });
  },
  Tab: function Tab() {
    // In case the user is currently hovering over the menu
    this.setIgnoreBlur(false);
  }
});
module.exports = Autocomplete;