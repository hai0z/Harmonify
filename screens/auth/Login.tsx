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
import {COLOR} from '../../constants';
import {doc, setDoc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const Login = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

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
    <View className="bg-[#121212] flex-1  items-center px-8">
      <StatusBar style="light" backgroundColor="#12121230" />
      <View
        className="flex justify-center gap-4 w-full"
        style={{marginTop: SCREEN_HEIGHT / 6}}>
        <Image
          source={require('../../assets/evil.png')}
          className="w-28 h-28 mb-4 self-center"
        />
        <Text className="text-white font-bold uppercase">Đăng nhập</Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="Email"
          className="bg-white/50 rounded-full h-10 p-2"
        />
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="Mật khẩu"
          className="bg-white/50 rounded-full h-10 p-2"
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: COLOR.PRIMARY,
          }}
          className="rounded-full h-10 p-2 justify-center items-center">
          <Text className="text-white">Đăng nhập</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-white text-[12px] self-center mb-4">OR</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            className="justify-center items-center flex h-10 p-2 rounded-full"
            style={{
              borderWidth: 1,
              borderColor: COLOR.PRIMARY,
            }}>
            <Text style={{color: COLOR.PRIMARY}}>Đăng kí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
