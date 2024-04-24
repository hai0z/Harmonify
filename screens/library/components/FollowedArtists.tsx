import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import React from 'react';

import {useNavigation} from '@react-navigation/native';
import useThemeStore from '../../../store/themeStore';
import {useUserStore} from '../../../store/userStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-gesture-handler';
const FollowedArtist = () => {
  const navigation = useNavigation<any>();
  const {COLOR} = useThemeStore();
  const {listFollowArtists} = useUserStore();
  return (
    <ScrollView
      className="pb-[200px]"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
      {listFollowArtists.map((item: any) => {
        return (
          <TouchableOpacity
            key={item?.id}
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
              <Text style={{color: COLOR.TEXT_SECONDARY, fontSize: wp(3.5)}}>
                {item?.totalFollow} người theo dõi
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default FollowedArtist;
