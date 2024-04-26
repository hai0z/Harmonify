import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ToastAndroid,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import useThemeStore from '../../store/themeStore';
import tinycolor from 'tinycolor2';
import {usePlayerStore} from '../../store/playerStore';
import {useModalStore} from '../../store/modalStore';

const SleppTimerModal = () => {
  const {setSleepTimer} = usePlayerStore();
  const {setTimerModalVisible, timerModalVisible} = useModalStore();
  const [time, setTime] = useState<number | null>(null);
  const {COLOR} = useThemeStore(state => state);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={timerModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setTimerModalVisible(!timerModalVisible);
        }}>
        <Pressable
          className="flex-1 absolute w-full h-full"
          onPress={() => {
            setTimerModalVisible(!timerModalVisible);
            setTime(null);
          }}></Pressable>
        <View className="justify-end items-center h-full w-full">
          <View
            style={{
              ...styles.modalView,
              backgroundColor: COLOR.isDark
                ? tinycolor(COLOR.BACKGROUND).brighten(10).toString()
                : tinycolor(COLOR.BACKGROUND).darken(5).toString(),
              paddingHorizontal: 16,
              marginHorizontal: 16,
            }}>
            <TextInput
              keyboardType="numeric"
              placeholder="Thời gian đếm ngược (phút)"
              placeholderTextColor={COLOR.TEXT_SECONDARY}
              className="w-full p-2 rounded-md"
              value={time?.toString()}
              style={{
                color: COLOR.TEXT_PRIMARY,
                borderWidth: 1,
                borderColor: COLOR.TEXT_SECONDARY,
              }}
              onChangeText={text => {
                const regex = /^[0-9\b]+$/;
                if (regex.test(text) || text === '') {
                  setTime(Number(text) || null);
                }
              }}
            />
            <Pressable
              className="mt-4 px-4 py-2 rounded-md"
              style={[{backgroundColor: COLOR.PRIMARY}]}
              onPress={() => {
                setTimerModalVisible(!timerModalVisible);
                setSleepTimer(time! * 60);
                setTime(null);
                time !== null &&
                  ToastAndroid.show(
                    `Hẹn giờ ngủ: ${time} phút`,
                    ToastAndroid.SHORT,
                  );
              }}>
              <Text style={{color: COLOR.TEXT_PRIMARY}}>Cài</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    padding: 35,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    width: '100%',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SleppTimerModal;
