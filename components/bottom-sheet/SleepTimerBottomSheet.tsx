import React, {forwardRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';

import useThemeStore from '../../store/themeStore';
import tinycolor from 'tinycolor2';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {usePlayerStore} from '../../store/playerStore';

const SleepTimerBottomSheet = forwardRef(
  (_, ref: React.ForwardedRef<BottomSheetModal>) => {
    const {COLOR} = useThemeStore(state => state);

    const snapPoints = useMemo(() => ['50%'], []);

    const {dismiss} = useBottomSheetModal();
    // renders
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    const {setSleepTimer} = usePlayerStore();

    const times = React.useMemo(() => [1, 5, 15, 30, 45, 60], []);

    return (
      <BottomSheetModal
        enablePanDownToClose
        handleIndicatorStyle={{backgroundColor: COLOR.TEXT_SECONDARY}}
        ref={ref}
        index={0}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(5).toString(),
        }}
        snapPoints={snapPoints}>
        <BottomSheetView
          style={{
            ...styles.contentContainer,
            backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(5).toString(),
          }}>
          <View className="flex justify-center items-center">
            <Text
              style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4.5)}}
              className="font-bold mb-1">
              Hẹn giờ đi ngủ
            </Text>
          </View>
          <View
            className="w-full h-[1px] mt-2"
            style={{backgroundColor: COLOR.TEXT_SECONDARY}}></View>
          <View className="mt-4 flex flex-col justify-between flex-1">
            {times.map(time => (
              <TouchableOpacity
                key={time}
                onPress={() => {
                  setSleepTimer(time % 60 > 0 ? time * 60 : time * 60);
                  ToastAndroid.show(
                    'Hẹn giờ ngủ sau: ' + time + ' phút',
                    ToastAndroid.SHORT,
                  );
                  dismiss();
                }}
                className="w-full flex-row items-center justify-between flex-1 my-1">
                <Text style={{color: COLOR.TEXT_PRIMARY}} className="font-bold">
                  {time % 60 > 0 ? `${time % 60} phút` : `${time / 60} giờ`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default SleepTimerBottomSheet;
