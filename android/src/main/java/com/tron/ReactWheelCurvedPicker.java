package com.tron;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Shader;
import android.os.SystemClock;
import android.util.AttributeSet;

import com.aigestudio.wheelpicker.WheelPicker;
import com.aigestudio.wheelpicker.view.WheelCurvedPicker;
import com.aigestudio.wheelpicker.WheelPicker.OnWheelChangeListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Date;
import java.util.List;

/**
 * Credit Author: Sam Yu
 */
public class ReactWheelCurvedPicker extends WheelPicker {

    private final EventDispatcher mEventDispatcher;
    private List<Object> mValueData;

    private int mState;

    public ReactWheelCurvedPicker(ReactContext reactContext) {
        super(reactContext);
        mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        setOnWheelChangeListener(new OnWheelChangeListener() {
            @Override
            public void onWheelScrolled(int offset) {
            }

            @Override
            public void onWheelSelected(int position) {
                if (mValueData != null && position < mValueData.size()) {
                    mEventDispatcher.dispatchEvent(
                        new ItemSelectedEvent(getId(), mValueData.get(position)));
                }
            }

            @Override
            public void onWheelScrollStateChanged(int state) {
                mState = state;
            }
        });
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    public void setValueData(List<Object> data) {
        mValueData = data;
    }

    public int getState() {
        return mState;
    }
}

class ItemSelectedEvent extends Event<ItemSelectedEvent> {

    public static final String EVENT_NAME = "wheelCurvedPickerPageSelected";

    private final Object mValue;

    protected ItemSelectedEvent(int viewTag, Object value) {
        super(viewTag);
        mValue = value;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();

        Class mValueClass = mValue.getClass();
        if (mValueClass == Integer.class) {
            eventData.putInt("data", (Integer) mValue);
        } else if (mValueClass == String.class) {
            eventData.putString("data", mValue.toString());
        }

        return eventData;
    }
}