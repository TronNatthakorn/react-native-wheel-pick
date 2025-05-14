"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PickerItem;
var React = _interopRequireWildcard(require("react"));
var ReactNativeWeb = _interopRequireWildcard(require("react-native-web"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * 
 *
 */

const Option = props => ReactNativeWeb.unstable_createElement('option', props);

/**
 * PickerItem Component for React Native Web
 * @returns
 */
function PickerItem({
  color,
  label,
  testID,
  value,
  enabled = true
}) {
  return /*#__PURE__*/React.createElement(Option, {
    disabled: enabled === false ? true : undefined,
    style: {
      color
    },
    testID: testID,
    value: value,
    label: label
  }, label);
}
//# sourceMappingURL=PickerItem.js.map