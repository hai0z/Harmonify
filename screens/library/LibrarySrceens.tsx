import {View, Text, TouchableOpacity, Image, StyleSheet} from "react-native";
import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import LocalSong from "./components/LocalSong";
import Playlist from "./components/Playlist";
import useThemeStore from "../../store/themeStore";
import FollowedArtist from "./components/FollowedArtists";
import {ScrollView} from "react-native-gesture-handler";
import tinycolor from "tinycolor2";
import {Octicons} from "@expo/vector-icons";
import {widthPercentageToDP} from "react-native-responsive-screen";
import useLibraryStore from "../../store/useLibraryStore";
import {useNavigation} from "@react-navigation/native";
import {navigation} from "../../utils/types/RootStackParamList";

const LibrarySrceens = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const {COLOR} = useThemeStore();
  const {viewType, setViewType} = useLibraryStore();
  const navigation = useNavigation<navigation<"Library" | "PlaylistStack">>();

  return (
    <View style={{...styles.container, backgroundColor: COLOR.BACKGROUND}}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <View className="rounded-full overflow-hidden shadow-lg">
            <Image
              resizeMode="cover"
              style={styles.avatar}
              source={require("../../assets/sound.png")}
            />
          </View>
          <Text style={{...styles.txt, color: COLOR.TEXT_PRIMARY}}>
            Thư viện
          </Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: !COLOR.isDark
              ? tinycolor(COLOR.BACKGROUND).darken(5).toString()
              : tinycolor(COLOR.BACKGROUND).lighten(10).toString(),
          }}
          onPress={() => navigation.navigate("PlaylistStack", {})}>
          <AntDesign
            name="plus"
            size={24}
            style={{color: COLOR.TEXT_PRIMARY}}
          />
        </TouchableOpacity>
      </View>

      <View className="mt-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 12,
            minWidth: widthPercentageToDP(100),
          }}>
          {["Danh sách phát", "Nghệ sĩ", "Đã tải xuống"].map((item, index) => (
            <TouchableOpacity
              onPress={() => setSelectedTab(index)}
              key={index}
              style={{
                backgroundColor:
                  selectedTab === index
                    ? COLOR.PRIMARY
                    : !COLOR.isDark
                    ? tinycolor(COLOR.BACKGROUND).darken(5).toString()
                    : tinycolor(COLOR.BACKGROUND).lighten(10).toString(),
              }}
              className="items-center justify-center rounded-full px-4 py-2">
              <Text
                className="font-medium"
                style={{
                  color: selectedTab === index ? "#fff" : COLOR.TEXT_PRIMARY,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="flex flex-row justify-end px-4 items-center py-3">
          <TouchableOpacity
            className="w-8 h-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: !COLOR.isDark
                ? tinycolor(COLOR.BACKGROUND).darken(5).toString()
                : tinycolor(COLOR.BACKGROUND).lighten(10).toString(),
            }}
            onPress={() => {
              setViewType(viewType === "grid" ? "list" : "grid");
            }}>
            {viewType === "list" ? (
              <Octicons name="apps" size={18} color={COLOR.TEXT_PRIMARY} />
            ) : (
              <Octicons
                name="list-unordered"
                size={18}
                color={COLOR.TEXT_PRIMARY}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        {selectedTab === 0 && <Playlist />}
        {selectedTab === 1 && <FollowedArtist />}
        {selectedTab === 2 && <LocalSong />}
      </ScrollView>
    </View>
  );
};

export default LibrarySrceens;

const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  top: {
    height: 60,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    fontWeight: "bold",
    fontSize: 28,
    marginLeft: 16,
  },
});
