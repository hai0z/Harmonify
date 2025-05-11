import {View, Text, Alert, Switch, ToastAndroid} from "react-native";
import React, {useEffect} from "react";
import useThemeStore from "../../store/themeStore";
import Animated, {FadeIn} from "react-native-reanimated";
import {TouchableOpacity} from "react-native-gesture-handler";
import {themeMap} from "../../constants/theme";
import {auth} from "../../firebase/config";
import {navigation} from "../../utils/types/RootStackParamList";
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import tinycolor from "tinycolor2";
import {usePlayerStore} from "../../store/playerStore";
import {widthPercentageToDP} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import {deleteHistory} from "../../service/firebase";
import {GREEN} from "../../constants";
import TrackPlayer from "react-native-track-player";
import {StatusBar} from "expo-status-bar";

const SettingScreen = () => {
  const {theme, COLOR} = useThemeStore();
  const {
    savePlayerState,
    setSavePlayerState,
    imageQuality,
    setImageQuality,
    saveHistory,
    setSaveHistory,
    offlineMode,
    setOfflineMode,
    setPlayList,
    setCurrentSong,
    setIsPlayFromLocal,
    setIsFistInit,
    isBlur,
    setIsBlur,
  } = usePlayerStore();
  const {isTrackThumbnailBorder, setIsTrackThumbnailBorder} = useThemeStore();
  const selectedColor = COLOR.isDark
    ? tinycolor(themeMap[theme]?.BACKGROUND).lighten(10).toString()
    : tinycolor(themeMap[theme]?.BACKGROUND).darken().toString();

  const navigation = useNavigation<navigation<"Setting">>();

  const changeOfflineMode = async () => {
    setCurrentSong(null);
    setOfflineMode(!offlineMode);
    setIsFistInit(false);
    await TrackPlayer.reset();
    await TrackPlayer.pause();
    setPlayList({
      id: "",
      items: [],
    });
    setIsPlayFromLocal(!offlineMode ? true : false);
    navigation.replace(!offlineMode ? "OfflineStack" : "Home");
  };

  useEffect(() => {
    FastImage.clearDiskCache();
    FastImage.clearMemoryCache();
  }, [imageQuality]);

  const renderSettingSection = (title: string, children: React.ReactNode) => (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="mt-4 px-4 py-3 rounded-xl shadow-sm"
      style={{
        backgroundColor: selectedColor,
        borderWidth: 1,
        borderColor: tinycolor(selectedColor).darken(5).toString(),
      }}>
      <Text
        style={{
          color: COLOR?.TEXT_PRIMARY,
          fontSize: widthPercentageToDP(4.5),
          fontWeight: "600",
          marginBottom: 12,
        }}>
        {title}
      </Text>
      {children}
    </Animated.View>
  );

  const renderSwitch = (value: boolean, onToggle: () => void) => (
    <Switch
      thumbColor={theme === "amoled" ? GREEN : COLOR?.PRIMARY}
      trackColor={{
        false: tinycolor(COLOR.TEXT_PRIMARY).setAlpha(0.2).toString(),
        true: tinycolor(theme === "amoled" ? GREEN : COLOR?.PRIMARY)
          .setAlpha(0.2)
          .toString(),
      }}
      value={value}
      onChange={onToggle}
    />
  );

  return (
    <Animated.ScrollView
      style={{flex: 1, backgroundColor: COLOR.BACKGROUND}}
      className="pt-[35px]"
      showsVerticalScrollIndicator={false}>
      {offlineMode && <StatusBar style="auto" backgroundColor="transparent" />}

      <View className="flex flex-row items-center gap-3 px-4 mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full"
          style={{backgroundColor: selectedColor}}>
          <Ionicons name="arrow-back" size={22} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text
          style={{color: COLOR?.TEXT_PRIMARY}}
          className="text-2xl font-bold">
          Cài đặt
        </Text>
      </View>

      {renderSettingSection(
        "Ứng dụng",
        <>
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex flex-row justify-between items-center py-3"
            onPress={() => navigation.navigate("Theme")}>
            <View className="flex flex-row items-center gap-3">
              <MaterialIcons
                name="color-lens"
                size={22}
                color={COLOR.TEXT_PRIMARY}
              />
              <Text
                style={{
                  color: COLOR?.TEXT_PRIMARY,
                  fontSize: widthPercentageToDP(3.8),
                }}>
                Chủ đề hiện tại
              </Text>
            </View>
            <View className="flex flex-row items-center">
              <Text
                style={{
                  color: theme === "amoled" ? GREEN : COLOR?.PRIMARY,
                  fontSize: widthPercentageToDP(3.5),
                }}
                className="mr-2 capitalize">
                {theme}
              </Text>
              <Entypo
                name="chevron-right"
                size={18}
                color={theme === "amoled" ? GREEN : COLOR?.PRIMARY}
              />
            </View>
          </TouchableOpacity>

          <View className="flex flex-row justify-between items-center py-3">
            <View className="flex flex-row items-center gap-3">
              <MaterialIcons
                name="offline-pin"
                size={22}
                color={COLOR.TEXT_PRIMARY}
              />
              <Text
                style={{
                  color: COLOR?.TEXT_PRIMARY,
                  fontSize: widthPercentageToDP(3.8),
                }}>
                Chế độ offline
              </Text>
            </View>
            {renderSwitch(offlineMode, changeOfflineMode)}
          </View>
        </>
      )}

      {renderSettingSection(
        "Lịch sử nghe",
        <>
          <View className="flex flex-row justify-between items-center py-3">
            <View className="flex flex-row items-center gap-3">
              <MaterialIcons
                name="history"
                size={22}
                color={COLOR.TEXT_PRIMARY}
              />
              <Text
                style={{
                  color: COLOR?.TEXT_PRIMARY,
                  fontSize: widthPercentageToDP(3.8),
                }}>
                Lưu lại lịch sử nghe
              </Text>
            </View>
            {renderSwitch(saveHistory, () => setSaveHistory(!saveHistory))}
          </View>

          <TouchableOpacity
            className="flex flex-row items-center gap-3 py-3"
            onPress={() => {
              Alert.alert(
                "Xóa lịch sử nghe",
                "Bạn có muốn xoá toàn bộ lịch sử nghe?",
                [
                  {
                    text: "Huỷ",
                    style: "cancel",
                  },
                  {
                    text: "Xóa",
                    onPress: async () => {
                      await deleteHistory();
                      ToastAndroid.show(
                        "Đã xóa lịch sử nghe",
                        ToastAndroid.SHORT
                      );
                    },
                    style: "destructive",
                  },
                ]
              );
            }}>
            <MaterialIcons
              name="delete-outline"
              size={22}
              color={theme === "amoled" ? GREEN : COLOR?.PRIMARY}
            />
            <Text
              style={{
                color: theme === "amoled" ? GREEN : COLOR?.PRIMARY,
                fontSize: widthPercentageToDP(3.8),
              }}>
              Xoá lịch sử nghe
            </Text>
          </TouchableOpacity>
        </>
      )}

      {renderSettingSection(
        "Chất lượng hình ảnh",
        <>
          <View className="flex justify-center mb-4">
            <View className="flex flex-col gap-4">
              {[
                {value: "low", label: "Thấp"},
                {value: "medium", label: "Trung bình"},
                {value: "high", label: "Cao"},
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex flex-row justify-between items-center"
                  onPress={() => setImageQuality(item.value as any)}>
                  <View className="flex flex-row items-center gap-3">
                    <MaterialIcons
                      name={
                        item.value === "low"
                          ? "network-cell"
                          : item.value === "medium"
                          ? "network-wifi-2-bar"
                          : "network-wifi"
                      }
                      size={22}
                      color={COLOR.TEXT_PRIMARY}
                    />
                    <Text
                      style={{
                        color: COLOR?.TEXT_PRIMARY,
                        fontSize: widthPercentageToDP(3.8),
                      }}>
                      {item.label}
                    </Text>
                  </View>
                  {imageQuality === item.value && (
                    <Entypo
                      name="check"
                      size={18}
                      color={theme === "amoled" ? GREEN : COLOR?.PRIMARY}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex flex-row justify-between items-center py-3">
            <View className="flex flex-row items-center gap-3">
              <MaterialIcons
                name="crop-free"
                size={22}
                color={COLOR.TEXT_PRIMARY}
              />
              <Text
                style={{
                  color: COLOR?.TEXT_PRIMARY,
                  fontSize: widthPercentageToDP(3.8),
                }}>
                Bo góc hình ảnh
              </Text>
            </View>
            {renderSwitch(isTrackThumbnailBorder, () =>
              setIsTrackThumbnailBorder(!isTrackThumbnailBorder)
            )}
          </View>
        </>
      )}

      {renderSettingSection(
        "Trình phát nhạc",
        <>
          <View className="flex flex-row justify-between items-center py-3">
            <View className="flex flex-row items-center gap-3">
              <MaterialIcons name="save" size={22} color={COLOR.TEXT_PRIMARY} />
              <Text
                style={{
                  color: COLOR?.TEXT_PRIMARY,
                  fontSize: widthPercentageToDP(3.8),
                }}>
                Lưu trạng thái trình phát nhạc
              </Text>
            </View>
            {renderSwitch(savePlayerState, () =>
              setSavePlayerState(!savePlayerState)
            )}
          </View>

          <View className="flex flex-row justify-between items-center py-3">
            <View className="flex flex-row items-center gap-3">
              <MaterialIcons
                name="blur-on"
                size={22}
                color={COLOR.TEXT_PRIMARY}
              />
              <Text
                style={{
                  color: COLOR?.TEXT_PRIMARY,
                  fontSize: widthPercentageToDP(3.8),
                }}>
                Hiệu ứng blur
              </Text>
            </View>
            {renderSwitch(isBlur, () => setIsBlur(!isBlur))}
          </View>
        </>
      )}

      {renderSettingSection(
        "Tài khoản",
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex flex-row items-center gap-3 py-3"
          onPress={() => {
            Alert.alert("Đăng xuất", "Bạn có muốn đăng xuất không?", [
              {
                text: "Huỷ",
                style: "cancel",
              },
              {
                text: "Đăng xuất",
                onPress: () => auth.signOut(),
                style: "destructive",
              },
            ]);
          }}>
          <MaterialIcons
            name="logout"
            size={22}
            color={theme === "amoled" ? GREEN : COLOR?.PRIMARY}
          />
          <Text
            style={{
              color: theme === "amoled" ? GREEN : COLOR?.PRIMARY,
              fontSize: widthPercentageToDP(3.8),
            }}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      )}

      <View className="h-40" />
    </Animated.ScrollView>
  );
};

export default SettingScreen;
