import Landing from './Landing';
import ComingSoon from './ComingSoon';

const isComingSoon = import.meta.env.VITE_COMING_SOON === 'true';

const Index = () => {
  return isComingSoon ? <ComingSoon /> : <Landing />;
};

export default Index;
