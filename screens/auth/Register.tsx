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
import {auth, db} from '../../firebase/config';
import {
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import useThemeStore from '../../store/themeStore';
import tinycolor from 'tinycolor2';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const Login = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const {COLOR} = useThemeStore(state => state);
  const handleSignUp = async () => {
    if (password !== confirmPassword || password.length < 6) {
      Alert.alert('Thất bại', 'Mật khẩu nhập lại không đúng');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );
      const {
        user: {uid, photoURL, displayName, email: userEmail},
      } = userCredential;
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
      Alert.alert('Thất bại', 'có lỗi xảy ra vui lòng thử lại sau');
    }
  };
  const navigation = useNavigation<any>();
  return (
    <View
      className="flex-1  items-center px-8"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <View
        className="flex justify-center gap-4 w-full"
        style={{marginTop: SCREEN_HEIGHT / 6}}>
        <Image
          source={require('../../assets/evil.png')}
          className="w-28 h-28 mb-4 self-center"
        />
        <Text
          className=" font-bold uppercase"
          style={{color: COLOR.TEXT_PRIMARY}}>
          Đăng kí
        </Text>
        <TextInput
          onChangeText={text => setEmail(text)}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          placeholderTextColor={COLOR.TEXT_SECONDARY}
          style={{
            backgroundColor: COLOR.isDark
              ? tinycolor(COLOR.BACKGROUND).lighten(5).toString()
              : tinycolor(COLOR.BACKGROUND).darken(5).toString(),
            color: COLOR.TEXT_PRIMARY,
          }}
          className="rounded-full h-10 p-2"
        />
        <TextInput
          secureTextEntry
          onChangeText={text => setPassword(text)}
          placeholder="Mật khẩu"
          value={password}
          placeholderTextColor={COLOR.TEXT_SECONDARY}
          style={{
            backgroundColor: COLOR.isDark
              ? tinycolor(COLOR.BACKGROUND).lighten(5).toString()
              : tinycolor(COLOR.BACKGROUND).darken(5).toString(),
            color: COLOR.TEXT_PRIMARY,
          }}
          className="rounded-full h-10 p-2"
        />
        <TextInput
          secureTextEntry
          onChangeText={text => setConfirmPassword(text)}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          placeholderTextColor={COLOR.TEXT_SECONDARY}
          style={{
            backgroundColor: COLOR.isDark
              ? tinycolor(COLOR.BACKGROUND).lighten(5).toString()
              : tinycolor(COLOR.BACKGROUND).darken(5).toString(),
            color: COLOR.TEXT_PRIMARY,
          }}
          className="rounded-full h-10 p-2"
        />

        <TouchableOpacity
          onPress={handleSignUp}
          style={{
            backgroundColor: COLOR.PRIMARY,
          }}
          className="rounded-full h-10 p-2 justify-center items-center">
          <Text style={{color: COLOR.TEXT_PRIMARY}}>Đăng kí</Text>
        </TouchableOpacity>
        <View>
          <Text
            className="text-[12px] self-center mb-4"
            style={{color: COLOR.TEXT_PRIMARY}}>
            OR
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="justify-center items-center flex h-10 p-2 rounded-full"
            style={{
              borderWidth: 1,
              borderColor: COLOR.PRIMARY,
            }}>
            <Text style={{color: COLOR.TEXT_PRIMARY}}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
