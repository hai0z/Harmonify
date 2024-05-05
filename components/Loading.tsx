import useThemeStore from '../store/themeStore';
import LoaderKit from 'react-native-loader-kit';

const Loading = () => {
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);
  return (
    <LoaderKit
      style={{width: 50, height: 50}}
      name={'LineScalePulseOut'}
      color={theme !== 'amoled' ? COLOR.SECONDARY : '#3cb371'}
    />
  );
};
export default Loading;
