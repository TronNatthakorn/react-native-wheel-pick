/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

'use strict';

import * as React from 'react';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
export const Commands = codegenNativeCommands({
  supportedCommands: ['focus', 'blur', 'setNativeSelected']
});
export default codegenNativeComponent('RNCAndroidDialogPicker', {
  excludedPlatforms: ['iOS'],
  interfaceOnly: true
});
//# sourceMappingURL=AndroidDialogPickerNativeComponent.js.map