import * as styles from './Slides.module.css';
import state from '../../stores/state';
import { FC, ReactNode, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { getView } from '../Map/view';

interface Props {
  children?: ReactNode;
}

export const Slides: FC<Props> = observer(() => {
  const { viewLoaded } = state;
  const [slides, setSlides] = useState<__esri.Collection<__esri.Slide>>();
  const [activeSlide, setActiveSlide] = useState(null);
  const [view, setView] = useState(null);

  useEffect(() => {
    if (viewLoaded) {
      const view = getView();
      setView(view);
      const slides = (view.map as __esri.WebScene).presentation.slides;
      setSlides(slides);
    }
  }, [viewLoaded]);
  return (
    <div className={styles.slidesContainer}>
      {slides &&
        slides.length > 0 &&
        slides.map((slide) => (
          <div
            key={slide.id}
            id={slide.id}
            className={styles.slide}
            onClick={() => {
              setActiveSlide(slide.id);
              slide.applyTo(view);
            }}
          >
            <img
              src={slide.thumbnail.url}
              title={slide.title.text}
              className={`${styles.circleImage} ${activeSlide === slide.id ? styles.active : ''}`}
            ></img>
          </div>
        ))}
    </div>
  );
});
