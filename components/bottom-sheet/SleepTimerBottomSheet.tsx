import React, {forwardRef, useCallback, useMemo} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";

import useThemeStore from "../../store/themeStore";
import tinycolor from "tinycolor2";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {usePlayerStore} from "../../store/playerStore";
import {GREEN} from "../../constants";

const SleepTimerBottomSheet = forwardRef(
  (_, ref: React.ForwardedRef<BottomSheetModal>) => {
    const {COLOR, theme} = useThemeStore(state => state);

    const snapPoints = useMemo(() => ["45%"], []);

    const {dismiss} = useBottomSheetModal();
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    const {setSleepTimer} = usePlayerStore();

    const times = React.useMemo(() => [1, 5, 15, 30, 45, 60], []);

    return (
      <BottomSheetModal
        enablePanDownToClose
        handleIndicatorStyle={{
          backgroundColor: tinycolor(COLOR.TEXT_PRIMARY)
            .setAlpha(0.5)
            .toString(),
          width: 40,
        }}
        ref={ref}
        index={0}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(3).toString(),
          borderRadius: 24,
        }}
        snapPoints={snapPoints}>
        <BottomSheetView
          style={{
            ...styles.contentContainer,
            backgroundColor: tinycolor(COLOR.BACKGROUND).lighten(3).toString(),
          }}>
          <View className="flex justify-center items-center">
            <Text
              style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4.5)}}
              className="font-bold">
              Hẹn giờ đi ngủ
            </Text>
            <Text
              style={{
                color: tinycolor(COLOR.TEXT_PRIMARY).setAlpha(0.6).toString(),
                fontSize: wp(3.5),
              }}
              className="mt-1">
              Chọn thời gian để dừng phát nhạc
            </Text>
          </View>
          <View
            className="w-full h-[0.5px] mt-4"
            style={{
              backgroundColor: tinycolor(COLOR.TEXT_PRIMARY)
                .setAlpha(0.1)
                .toString(),
            }}></View>
          <View className="mt-6 flex-row flex-wrap justify-between">
            {times.map(time => (
              <TouchableOpacity
                key={time}
                onPress={() => {
                  setSleepTimer(time * 60);
                  ToastAndroid.show(
                    "Hẹn giờ ngủ sau: " + time + " phút",
                    ToastAndroid.SHORT
                  );
                  dismiss();
                }}
                style={{
                  backgroundColor: tinycolor(COLOR.BACKGROUND)
                    .lighten(8)
                    .toString(),
                  width: "48%",
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: tinycolor(COLOR.TEXT_PRIMARY)
                    .setAlpha(0.1)
                    .toString(),
                }}
                className="py-4 rounded-xl items-center">
                <Text
                  style={{
                    color: theme === "amoled" ? GREEN : COLOR.PRIMARY,
                    fontSize: wp(4),
                  }}
                  className="font-bold">
                  {time % 60 > 0 ? `${time} phút` : `${time / 60} giờ`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
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
