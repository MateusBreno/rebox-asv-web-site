// ./src/assets/animations/lotties/LottieLoading/index.tsx
import React from 'react';

import Lottie from 'react-lottie';

import File from './file.json';

interface IProps {
  isStopped?: boolean;
  isPaused?: boolean;
}

const LottieLoading: React.FC<IProps> = ({ isStopped, isPaused }) => {
  return (
    <Lottie
      options={{
        loop: true,
        autoplay: true,
        animationData: File,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      }}
      height={250}
      width={250}
      isStopped={isStopped}
      isPaused={isPaused}
    />
    //   {children}
    // </Lottie>
  );
};

export default LottieLoading;
