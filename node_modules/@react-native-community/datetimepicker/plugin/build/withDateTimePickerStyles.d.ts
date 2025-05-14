import { ConfigPlugin } from '@expo/config-plugins';
declare const DATE_PICKER_ALLOWED_ATTRIBUTES: {
    readonly colorAccent: {
        readonly attrName: "colorAccent";
    };
    readonly colorControlActivated: {
        readonly attrName: "colorControlActivated";
    };
    readonly colorControlHighlight: {
        readonly attrName: "colorControlHighlight";
    };
    readonly selectableItemBackgroundBorderless: {
        readonly attrName: "android:selectableItemBackgroundBorderless";
    };
    readonly textColor: {
        readonly attrName: "android:textColor";
    };
    readonly textColorPrimary: {
        readonly attrName: "android:textColorPrimary";
    };
    readonly textColorPrimaryInverse: {
        readonly attrName: "android:textColorPrimaryInverse";
    };
    readonly textColorSecondary: {
        readonly attrName: "android:textColorSecondary";
    };
    readonly textColorSecondaryInverse: {
        readonly attrName: "android:textColorSecondaryInverse";
    };
    readonly windowBackground: {
        readonly attrName: "android:windowBackground";
    };
};
type ColorDefinition = {
    light: string;
    dark?: string;
};
type DatePickerProps = {
    [key in keyof typeof DATE_PICKER_ALLOWED_ATTRIBUTES]?: ColorDefinition;
};
declare const TIME_PICKER_ALLOWED_ATTRIBUTES: {
    readonly background: {
        readonly attrName: "android:background";
    };
    readonly headerBackground: {
        readonly attrName: "android:headerBackground";
    };
    readonly numbersBackgroundColor: {
        readonly attrName: "android:numbersBackgroundColor";
    };
    readonly numbersSelectorColor: {
        readonly attrName: "android:numbersSelectorColor";
    };
    readonly numbersTextColor: {
        readonly attrName: "android:numbersTextColor";
    };
};
type TimePickerProps = {
    [key in keyof typeof TIME_PICKER_ALLOWED_ATTRIBUTES]?: ColorDefinition;
};
type Options = {
    android?: {
        datePicker?: DatePickerProps;
        timePicker?: TimePickerProps;
    };
};
declare const withDateTimePickerStyles: ConfigPlugin<Options>;
export default withDateTimePickerStyles;
