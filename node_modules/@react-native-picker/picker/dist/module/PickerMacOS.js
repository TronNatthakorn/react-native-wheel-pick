/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

import * as React from 'react';
import UnimplementedView from './UnimplementedView';
class PickerMacOS extends React.Component {
  static Item = UnimplementedView;
  render() {
    return /*#__PURE__*/React.createElement(UnimplementedView, null);
  }
}

/**
 * Fallback for non-MacOS platforms
 */
export default PickerMacOS;
//# sourceMappingURL=PickerMacOS.js.map