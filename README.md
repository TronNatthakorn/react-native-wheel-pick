# react-native-wheel-pick

React native wheel picker for both iOS and android. 

This is not original but inspire by  [react-native-wheel-datepicker](https://github.com/pinguinjkeke/react-native-wheel-datepicker)

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
  style={{ flex: 1 }}
  selectedValue={1}
  pickerData={[1, 2, 3, 4, 5, 6]}
  onValueChange={value => {}}
/>

// use DatePicker
<DatePicker mode="date" onValueChange={val => {}}/>

```
