"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _reactNativeWeb = require("react-native-web");
var _PickerItem = _interopRequireDefault(require("./PickerItem"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /**
 * Copyright (c) Nicolas Gallagher.
 *
 * 
 *
 */
const Select = /*#__PURE__*/(0, _react.forwardRef)((props, forwardedRef) => (0, _reactNativeWeb.unstable_createElement)('select', {
  ...props,
  ref: forwardedRef
}));
const Picker = /*#__PURE__*/(0, _react.forwardRef)((props, forwardedRef) => {
  const {
    enabled,
    onValueChange,
    selectedValue,
    itemStyle,
    mode,
    prompt,
    dropdownIconColor,
    ...other
  } = props;
  const handleChange = React.useCallback(e => {
    const {
      selectedIndex,
      value
    } = e.target;
    if (onValueChange) {
      onValueChange(value, selectedIndex);
    }
  }, [onValueChange]);
  return (
    /*#__PURE__*/
    // $FlowFixMe
    React.createElement(Select, _extends({
      disabled: enabled === false ? true : undefined,
      onChange: handleChange,
      ref: forwardedRef,
      value: selectedValue
    }, other))
  );
});

// $FlowFixMe
Picker.Item = _PickerItem.default;
var _default = exports.default = Picker;
//# sourceMappingURL=Picker.web.js.map