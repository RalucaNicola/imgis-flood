import { CalciteButton, CalciteIcon } from '@esri/calcite-components-react';
import '@esri/calcite-components/dist/components/calcite-button';
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
  const [datesZurich, setDatesZurich] = useState(null);
  const [floodZurich, setFloodZurich] = useState(null);
  const [datesTunnel, setDatesTunnel] = useState(null);
  const [floodTunnel, setFloodTunnel] = useState(null);
  const [view, setView] = useState(null);
  const [runningZurich, setRunningZurich] = useState(false);
  const [runningTunnel, setRunningTunnel] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    if (floodZurich) {
      floodZurich.visible = runningZurich;
    }
  }, [runningZurich, floodZurich]);

  useEffect(() => {
    if (floodTunnel) {
      floodTunnel.visible = runningTunnel;
    }
  }, [runningTunnel, floodTunnel]);

  const runZurichSimulation = () => {
    let currentIndex = 0;
    setRunningZurich(true);

    const animateDates = () => {
      if (datesZurich && datesZurich.length > 0 && currentIndex < datesZurich.length) {
        view.timeExtent = {
          start: datesZurich[currentIndex],
          end: datesZurich[currentIndex]
        };
        currentIndex = currentIndex + 1;

        reactiveUtils
          .whenOnce(() => !view.updating)
          .then(() => {
            animateDates();
          });
      }
    };

    animateDates();
  };

  const runTunnelSimulation = () => {
    let currentIndex = 0;
    setRunningTunnel(true);

    const animateDates = () => {
      if (datesTunnel && datesTunnel.length > 0 && currentIndex < datesTunnel.length) {
        view.timeExtent = {
          start: datesTunnel[currentIndex],
          end: datesTunnel[currentIndex]
        };
        currentIndex = currentIndex + 1;

        reactiveUtils
          .whenOnce(() => !view.updating)
          .then(() => {
            animateDates();
          });
      }
    };

    animateDates();
  };

  useEffect(() => {
    if (viewLoaded) {
      const view = getView();
      const floodZurich = view.map.findLayerById('1929512bf5a-layer-122') as __esri.ImageryTileLayer;
      setFloodZurich(floodZurich);
      setView(view);
      const datesZurich = floodZurich.serviceRasterInfo.multidimensionalInfo.variables[0].dimensions[0].values.map(
        (item) => new Date(item as number)
      );
      setDatesZurich(datesZurich);

      const floodTunnel = view.map.findLayerById('1929a9e90c3-layer-155') as __esri.ImageryTileLayer;
      setFloodTunnel(floodTunnel);
      setView(view);
      const datesTunnel = floodTunnel.serviceRasterInfo.multidimensionalInfo.variables[0].dimensions[0].values.map(
        (item) => new Date(item as number)
      );
      setDatesTunnel(datesTunnel);
    }
  }, [viewLoaded]);
  return (
    <div className={styles.floodSimContainer}>
      <h2>Flood simulation</h2>
      <img
        src='./assets/flood-2005.png'
        width='100%'
        onClick={() => {
          setImageVisible(false);
        }}
        className={styles.floodImage}
        style={{ visibility: imageVisible ? 'visible' : 'hidden', opacity: imageVisible ? 1 : 0 }}
      ></img>
      <div
        className={styles.zurichFlood}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setImageVisible(true);
        }}
      >
        <p>
          Sihl{' '}
          <span className={styles.volume}>
            300m<sup>3</sup>/s
          </span>
        </p>
      </div>
      {datesZurich && (
        <div className={styles.zurichFlood}>
          {' '}
          <p>
            Zürich flood scenario{' '}
            <span className={styles.volume}>
              400m<sup>3</sup>/s
            </span>
          </p>
          {runningZurich ? (
            <CalciteButton
              appearance='outline'
              iconStart='stop-square-f'
              onClick={() => {
                setRunningZurich(false);
              }}
            ></CalciteButton>
          ) : (
            <CalciteButton
              appearance='outline'
              iconStart='play-f'
              onClick={() => {
                runZurichSimulation();
              }}
            ></CalciteButton>
          )}
        </div>
      )}
      {/* 
      {datesTunnel && (
        <div className={styles.zurichFlood}>
          {' '}
          <p>Tunnel relief scenario</p>
          {runningTunnel ? (
            <CalciteButton
              appearance='outline'
              iconStart='stop-square-f'
              onClick={() => {
                setRunningTunnel(false);
              }}
            ></CalciteButton>
          ) : (
            <CalciteButton
              appearance='outline'
              iconStart='play-f'
              onClick={() => {
                runTunnelSimulation();
              }}
            ></CalciteButton>
          )}
        </div>
      )} */}
    </div>
  );
});
