import { ErrorAlert } from '../ErrorAlert';
import { FloodSim } from '../FloodSim';
import { Identity } from '../Identity';
import { Map } from '../Map';
import { Slides } from '../Slides';
import { WaterFlowEnd } from '../WaterFlowEnd';

const App = () => {
  return (
    <>
      <Map></Map>
      <FloodSim></FloodSim>
      <Slides></Slides>
      <WaterFlowEnd></WaterFlowEnd>
      <Identity></Identity>
      <ErrorAlert></ErrorAlert>
    </>
  );
};

export default App;
