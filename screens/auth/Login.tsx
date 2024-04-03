import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {auth, db} from '../../firebase/config';
import {
  getAdditionalUserInfo,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import useThemeStore from '../../store/themeStore';
import tinycolor from 'tinycolor2';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const Login = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const {COLOR} = useThemeStore(state => state);
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email.trim(),
        password.trim(),
      );
      const {
        user: {uid, photoURL, displayName, email: userEmail},
      } = userCredential;
      console.log(getAdditionalUserInfo(userCredential));
      if (getAdditionalUserInfo(userCredential)?.isNewUser) {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
          uid,
          photoURL,
          displayName,
          email: userEmail,
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Thất bại', 'Sai Email hoặc Mật khẩu');
    }
  };
  const navigation = useNavigation<any>();
  return (
    <View
      className="flex-1  items-center px-8"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <StatusBar
        style={COLOR.isDark ? 'light' : 'dark'}
        backgroundColor="transparent"
      />
      <View
        className="flex justify-center gap-4 w-full"
        style={{marginTop: SCREEN_HEIGHT / 6}}>
        <Image
          source={require('../../assets/evil.png')}
          className="w-28 h-28 mb-4 self-center"
        />
        <Text
          className="font-bold uppercase"
          style={{color: COLOR.TEXT_PRIMARY}}>
          Đăng nhập
        </Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="Email"
          placeholderTextColor={COLOR.TEXT_SECONDARY}
          className=" rounded-full h-10 p-2 "
          style={{
            color: COLOR.TEXT_PRIMARY,
            backgroundColor: COLOR.isDark
              ? tinycolor(COLOR.BACKGROUND).lighten(5).toString()
              : tinycolor(COLOR.BACKGROUND).darken(5).toString(),
          }}
        />
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
          placeholderTextColor={COLOR.TEXT_SECONDARY}
          placeholder="Mật khẩu"
          className=" rounded-full h-10 p-2"
          style={{
            color: COLOR.TEXT_PRIMARY,
            backgroundColor: COLOR.isDark
              ? tinycolor(COLOR.BACKGROUND).lighten(5).toString()
              : tinycolor(COLOR.BACKGROUND).darken(5).toString(),
          }}
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: COLOR.PRIMARY,
          }}
          className="rounded-full h-10 p-2 justify-center items-center ">
          <Text style={{color: COLOR.TEXT_PRIMARY}}>Đăng nhập</Text>
        </TouchableOpacity>
        <View>
          <Text
            style={{color: COLOR.TEXT_PRIMARY}}
            className="ext-[12px] self-center mb-4">
            OR
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            className="justify-center items-center flex h-10 p-2 rounded-full"
            style={{
              borderWidth: 1,
              borderColor: COLOR.PRIMARY,
            }}>
            <Text style={{color: COLOR.TEXT_PRIMARY}}>Đăng kí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
