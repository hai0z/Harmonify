import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import React from 'react';

import {useNavigation} from '@react-navigation/native';
import useThemeStore from '../../../store/themeStore';
import {useUserStore} from '../../../store/userStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-gesture-handler';
import useLibraryStore from '../../../store/useLibraryStore';
import Animated, {FadeIn} from 'react-native-reanimated';
const FollowedArtist = () => {
  const navigation = useNavigation<any>();
  const {COLOR} = useThemeStore();
  const {viewType} = useLibraryStore();
  const {listFollowArtists} = useUserStore();
  return (
    <ScrollView
      className="pb-[200px]"
      showsVerticalScrollIndicator={false}
      style={{flex: 1, marginHorizontal: 16, marginTop: 8}}
      nestedScrollEnabled>
      {viewType === 'list' ? (
        listFollowArtists.map((item: any) => {
          return (
            <Animated.View key={item?.id} entering={FadeIn.duration(1000)}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Artists', {
                    name: item.alias,
                  })
                }
                activeOpacity={0.8}
                className="flex-row items-center mt-[16px] mx-[16px]">
                <Image
                  source={{uri: item?.thumbnailM}}
                  className="rounded-full"
                  style={{width: wp(18), height: wp(18)}}
                />
                <View style={{marginLeft: 10}}>
                  <Text
                    className=" font-bold mb-[5px]"
                    style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4)}}>
                    {item?.name}
                  </Text>
                  <Text
                    style={{color: COLOR.TEXT_SECONDARY, fontSize: wp(3.5)}}>
                    {item?.totalFollow} người theo dõi
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })
      ) : (
        <Animated.View
          entering={FadeIn.duration(1000)}
          className="flex flex-row justify-between flex-wrap">
          {listFollowArtists.map((item: any) => {
            return (
              <TouchableOpacity
                style={{width: wp(33) - 16}}
                key={item?.id}
                onPress={() =>
                  navigation.navigate('Artists', {
                    name: item.alias,
                  })
                }
                activeOpacity={0.8}
                className="flex-col items-center my-1 justify-center content-start">
                <Image
                  source={{uri: item?.thumbnailM}}
                  className="rounded-full"
                  style={{width: wp(33) - 16, height: wp(33) - 16}}
                />
                <View>
                  <Text
                    className="font-bold text-center"
                    style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4)}}>
                    {item?.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          {(listFollowArtists.length % 3 === 2 ||
            listFollowArtists.length % 3 === 1) && (
            <TouchableOpacity
              style={{width: wp(33) - 16}}
              activeOpacity={0.8}
              className="flex-col items-center my-1 justify-center content-start">
              <View
                className="rounded-full"
                style={{width: wp(33) - 16, height: wp(33) - 16}}
              />
              <View>
                <Text
                  className="font-bold text-center"
                  style={{color: COLOR.TEXT_PRIMARY, fontSize: wp(4)}}></Text>
              </View>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </ScrollView>
  );
};

export default FollowedArtist;
