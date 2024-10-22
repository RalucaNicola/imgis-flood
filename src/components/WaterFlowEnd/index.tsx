import state from '../../stores/state';
import { FC, ReactNode, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { getView } from '../Map/view';
import LineLayerAnimation from '../../utils/LineLayerAnimation';
import { startOptimizedAppearAnimation } from 'framer-motion';

interface Props {
  children?: ReactNode;
}

export const WaterFlowEnd: FC<Props> = observer(() => {
  const { viewLoaded } = state;
  const [animatedLayer, setAnimatedLayer] = useState(null);
  const [animation, setAnimation] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'f') {
        let startTime: number | null = null;
        animatedLayer.visible = true;

        const animateUpperRiver = (time: number) => {
          if (!startTime) startTime = time;
          const elapsed = time - startTime;
          if (elapsed < 10000) {
            const proportion = elapsed / 10000;
            animation.seek(proportion, 1);

            requestAnimationFrame(animateUpperRiver);
          } else {
            if (elapsed < 40000) {
              const proportion2 = (elapsed - 10000) / 30000;
              animation.seek(proportion2, 2);
              if (elapsed < 15000) {
                const proportion1 = (elapsed - 10000) / 5000;
                animation.seek(proportion1, 3);
              }
              requestAnimationFrame(animateUpperRiver);
            }
          }
        };

        // Start the animation
        requestAnimationFrame(animateUpperRiver);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [animatedLayer, animation]);

  useEffect(() => {
    if (viewLoaded) {
      const view = getView();
      // get layer with the lines
      const l = view.map.findLayerById('192af07d791-layer-151');
      const animation = new LineLayerAnimation({
        sourceLayer: l
      });
      setAnimation(animation);

      animation.whenAnimatedLayer().then((animatedLayer) => {
        view.map.add(animatedLayer);
        animation.getAnimationGraphic(1);
        animation.getAnimationGraphic(2);
        animation.getAnimationGraphic(3);
        setAnimatedLayer(animatedLayer);
      });
    }
  }, [viewLoaded]);
  return <></>;
});
