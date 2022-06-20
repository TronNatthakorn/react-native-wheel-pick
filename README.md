
# react-native-wheel-pick

React native wheel picker for both iOS and android. (Support DatePicker)

This is not original but inspire by [react-native-wheel-datepicker](https://github.com/pinguinjkeke/react-native-wheel-datepicker)

# Preview

![](https://i.ibb.co/4W7h12M/rn-wl-pk-1-1-13.png)

## How to use

React Native >= 0.60+
```
npm install react-native-wheel-pick
npx pod-install

npx react-native run-android // re-build native-code for gradle
```

React Native < 0.60
```
npm install react-native-wheel-pick
react-native link react-native-wheel-pick

react-native run-android // re-build native-code for gradle
```
[react-native-wheel-pick](https://www.npmjs.com/package/react-native-wheel-pick)

## Example code 
```jsx
import { Picker, DatePicker } from 'react-native-wheel-pick';

// use Picker
<Picker
  style={{ backgroundColor: 'white', width: 300, height: 215 }}
  selectedValue='item4'
  pickerData={['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7']}
  onValueChange={value => { console.log(value) }}
/>

// use DatePicker
<DatePicker
  style={{ backgroundColor: 'white', width: 370, height: 240 }} 
  onDateChange={date => { console.log(date) }}
/>

```
## Note

- For Picker of iOS use [@react-native-picker/picker](https://github.com/react-native-picker/picker)
- For DatePicker of iOS use [@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker) 
- For Picker and DatePicker of Android use WheelPicker of [WheelPicker](https://github.com/AigeStudio/WheelPicker)
- Pull request are welcome. 

## More Example 

```jsx
// DatePicker set default select date
<DatePicker
  style={{ height: 215, width: 300 }}
  date={new Date('2018-06-27')} // Optional prop - default is Today
  onDateChange={date => { console.log(date) }}
/>

// DatePicker set min/max Date
<DatePicker
  style={{ height: 215, width: 300 }}
  minimumDate={new Date('2000-01-01')}
  maximumDate={new Date('2050-12-31')}
  onDateChange={date => { console.log(date) }}
/>

```
```jsx
// pickerData also support array of object.

// Way 1
<Picker
  selectedValue='item4'
  pickerData={['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7']}
  onValueChange={value => { console.log(value) }}
/>

// Optional Way 2
<Picker
  style={{ backgroundColor: 'white', width: 300, height: 215 }}
  selectedValue='5765387680'
  pickerData={[
    { value : '5765387677', label : 'item1' },
    { value : '5765387678', label : 'item2' },
    { value : '5765387679', label : 'item3' },
    { value : '5765387680', label : 'item4' },
    { value : '5765387681', label : 'item5' },
    { value : '5765387682', label : 'item6' },
    { value : '5765387683', label : 'item7' },
  ]}
  onValueChange={value => { console.log(value) }}
/>
```
```jsx
// Android Only.
// These is special props for Android. (iOS not work)
// You can also use these props for DatePicker, too.
<Picker
  textColor='red'
  textSize={20}

  selectTextColor='green'
  isShowSelectBackground={false} // Default is true
  selectBackgroundColor='#8080801A' // support HEXA color Style (#rrggbbaa)
  // (Please always set 'aa' value for transparent)
  
  isShowSelectLine={false} // Default is true
  selectLineColor='black'
  selectLineSize={6} // Default is 4
/>

// Android Only.
<DatePicker
  order='D-M-Y' // Default is M-D-Y
/>
```
## Release Note

### 1.1.5 (June 20 2022)
- Change License from MIT to Apache-2.0
- Add NOTICE file for credit original author.
- Fix peerDependency do not break other version.
 
[Android]
- Fix WheelCurvedPicker not found for first run.
- DatePicker support order prop.

### 1.1.4 (June 19 2022)
- Fix Readme wrong type.

### 1.1.3 (June 19 2022)
- Restructure code of Picker iOS and Android.
- pickerData support array of object.

[Android]
- Update sdk support for SDK Version 30 (Google Play need sdk version 30+)
- Now android support for style of selectLine / selectBackground. Special thanks to [@kaisv7n](https://github.com/kaisv7n) for his pull request, 
[Update WheelPicker version, exposed more methods and fixed crash on android](https://github.com/TronNatthakorn/react-native-wheel-pick/pull/12) I changed prop name for more understandable.

- DatePicker of Android also support width.
- Deprecated some android prop that make library faster. (Atmospheric / Curved / visibleItemCount / itemSpace)
If you want it back pull request are welcome.
- Change some prop name for make code more understandable.
- If update from version <= 1.1.2. You will get warning about Deprecated prop if you still use, I write some logic for make app not crash. (Please fix warning if possible.)

[IOS]
- Do not use PickerIOS and DatePickerIOS of 'react-native' anymore.

# FYI

For version 1.1.3 - I update this library support for React Native Version 0.68.2 / Android 11 / iOS 15.2

If you use React Native Version less than 0.68.2 / Android older than 11 / iOS older than 15.2. 
It is possible to have unexpected bug.

I rarely check this lib. (6 Months - 3 Years). Up on my life's time.

If you want to pay me coffee for quickly check & merge your request. Please contact me directly [facebook.com/tron.natthakorn](https://facebook.com/tron.natthakorn) OR you can fork this project.

## Preview for version <= 1.12

![](https://preview.ibb.co/iUjDZo/screen1.png)

## Example code for version <= 1.12

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
## Note for version <= 1.12

- For iOS use default PickerIOS / DatePickerIOS of React Native.
- For Android use WheelPicker of [WheelPicker](https://github.com/AigeStudio/WheelPicker)
- Line color is white in android. (Support Line style in future. Pull request welcome)
- Line color is grey in IOS but it has bug line not show in Picker (iOS 11.4 not sure other version).

## More Example for version <= 1.12

```jsx
// DatePicker set default choose date
<DatePicker
  style={{ height: 215, width: isIos ? 300 : undefined }}
  date={new Date('2018-06-27')} // Optional prop - default is Today
  onDateChange={date => { }}
/>

// DatePicker set min/max Date
<DatePicker
  style={{ height: 215, width: isIos ? 300 : undefined }}
  minimumDate={new Date('2000-01-01')}
  maximumDate={new Date('2050-12-31')}
  onDateChange={date => { }}
/>
```

## Release Note for version <= 1.12

### 1.1.2 (April 13 2022)
- Edit broken url.

### 1.1.1 (November 20 2021)
- Edit broken url.

### 1.1.0 (January 14 2020)
- Use react-native.config.js instead of rnpm section. [@darkbluesun](https://github.com/darkbluesun)

[Android]
- Add safeExtGet to get sdk version from root project.[@darkbluesun](https://github.com/darkbluesun)

### 1.0.9 (June 27 2018)
[IOS]
- Fix bug props date of DatePicker is not work right.

### 1.0.8 (June 27 2018)
- Support props for date picker (date / minimumDate / maximumDate)

[IOS]
- Fix bug cannot read property 'getTime' of null

### 1.0.7 (June 25 2018)

[Android]
- Fix bug android value wrong from array

### 1.0.5 (June 24 2018)
- Fix Lifecycle for support React 16 (Remove componentWillMount / componentWillReceiveProps)

[Android]
- Fix bug onValueChange occur first time without change

### 1.0.4 (June 24 2018)
[Android]
- Support compileSDKVersion 26

## License

    Copyright 2022 tron.natthakorn@engineer.com

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
