import LottieView from 'lottie-react-native';

const Loading = () => {
  return (
    <LottieView
      style={{width: 50, height: 50}}
      autoPlay
      loop
      source={require('../assets/animation/loading.json')}></LottieView>
  );
};
export default Loading;
