# react-native-wheel-pick

React native wheel picker for both iOS and android. (Support DatePicker)

This is not original but inspire by  [react-native-wheel-datepicker](https://github.com/pinguinjkeke/react-native-wheel-datepicker)

![](screen1.png)

## How to use

```
npm i react-native-wheel-pick --save
react-native link react-native-wheel-pick
```
## Example code

```jsx
import { Picker, DatePicker } from 'react-native-wheel-pick';

// use Picker
<Picker
  style={{ backgroundColor: 'white', height: 215 }}
  selectedValue='12:15'
  pickerData={['11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00']}
  onValueChange={value => {}}
  itemSpace={30} // this only support in android
/>

// use DatePicker
<DatePicker
  style={{ backgroundColor: 'white', height: 215 }}
  mode='date'
  onDateChange={val => {}}
/>

```
## Note

- For iOS use PickerIOS / DatePickerIOS of React Native
- For Android use WheelPicker of [WheelPicker](https://github.com/AigeStudio/WheelPicker)
