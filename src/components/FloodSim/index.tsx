import { CalciteButton, CalciteIcon } from '@esri/calcite-components-react';
import * as styles from './FloodSim.module.css';
import state from '../../stores/state';
import { FC, ReactNode, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { getView } from '../Map/view';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

interface Props {
  children?: ReactNode;
}

export const FloodSim: FC<Props> = observer(() => {
  const { viewLoaded } = state;
  const [dates, setDates] = useState(null);
  const [layer, setLayer] = useState(null);
  const [view, setView] = useState(null);
  const [running, setRunning] = useState(false);

  const runSimulation = () => {
    layer.visible = true;
    let currentIndex = 0;
    setRunning(true);

    const animateDates = () => {
      if (dates && dates.length > 0 && currentIndex < dates.length) {
        view.timeExtent = {
          start: dates[currentIndex],
          end: dates[currentIndex]
        };
        currentIndex = currentIndex + 1;

        reactiveUtils
          .whenOnce(() => !view.updating)
          .then(() => {
            animateDates();
          });
      } else {
        setRunning(false);
      }
    };

    animateDates();
  };

  useEffect(() => {
    if (viewLoaded) {
      const view = getView();
      const layer = view.map.findLayerById('1929512bf5a-layer-122') as __esri.ImageryTileLayer;
      setLayer(layer);
      setView(view);
      const dates = layer.serviceRasterInfo.multidimensionalInfo.variables[0].dimensions[0].values.map(
        (item) => new Date(item as number)
      );
      setDates(dates);
    }
  }, [viewLoaded]);
  return (
    <div className={styles.floodSimContainer}>
      {dates && (
        <button
          className={`${styles.button} ${running ? styles.running : ''}`}
          onClick={() => {
            runSimulation();
          }}
        >
          FLOOD SIMULATION{' '}
          <span className={styles.volume}>
            400m<sup>3</sup>/s
          </span>
        </button>
      )}
    </div>
  );
});
