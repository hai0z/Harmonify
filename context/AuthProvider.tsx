import React, {useEffect} from 'react';
import {auth} from '../firebase/config';
import {View, Text} from 'react-native';
interface AuthContextType {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}
export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isLogin, setIsLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        setIsLogin(true);
        setLoading(false);
      } else {
        setIsLogin(false);
        setLoading(false);
      }
    });
    return () => unsubcribe();
  }, []);

  return (
    <AuthContext.Provider value={{isLogin, setIsLogin, loading}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
