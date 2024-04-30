import LoaderKit from 'react-native-loader-kit';
import useThemeStore from '../store/themeStore';

const Loading = () => {
  const {COLOR} = useThemeStore();
  return (
    <LoaderKit
      style={{width: 50, height: 50}}
      name={'BallClipRotateMultiple'}
      color={COLOR.PRIMARY}
    />
  );
};
export default Loading;
