# react-native-wheel-pick

React native wheel picker for both iOS and android. (Support DatePicker)

This is not original but inspire by  [react-native-wheel-datepicker](https://github.com/pinguinjkeke/react-native-wheel-datepicker)

![](https://preview.ibb.co/iUjDZo/screen1.png)

## How to use

```
npm i react-native-wheel-pick --save
react-native link react-native-wheel-pick
```
[react-native-wheel-pick](https://www.npmjs.com/package/react-native-wheel-pick)

## Example code

```jsx
import { Platform } from 'react-native';
import { Picker, DatePicker } from 'react-native-wheel-pick';

const isIos = Platform.OS === 'ios'

// use Picker
<Picker
  style={{ backgroundColor: 'white', width: 300, height: 215 }}
  selectedValue='item4'
  pickerData={['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7']}
  onValueChange={value => { }}
  itemSpace={30} // this only support in android
/>

// use DatePicker
<DatePicker
  style={{ backgroundColor: 'white', height: 215, width: isIos ? 300 : undefined }} 
  // android not support width
  onDateChange={date => { }}
/>

```
## Note

- Line only has in DatePickerIOS. (Cannot remove this time)
- For iOS use default PickerIOS / DatePickerIOS of React Native.
- For Android use WheelPicker of [WheelPicker](https://github.com/AigeStudio/WheelPicker)

### Pull request are welcome for more support in future (Text / Line Style)

## Release Note

### 1.0.5 (June 24 2018)
- Fix Lifecycle for support React 16 (Remove componentWillMount / componentWillReceiveProps)

[Android]
- Fix bug onValueChange occur first time without change

### 1.0.4 (June 24 2018)
[Android]
- Support compileSDKVersion 26
