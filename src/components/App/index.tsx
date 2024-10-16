import { ErrorAlert } from '../ErrorAlert';
import { FloodSim } from '../FloodSim';
import { Identity } from '../Identity';
import { Map } from '../Map';
import { Slides } from '../Slides';

const App = () => {
  return (
    <>
      <Map></Map>
      <FloodSim></FloodSim>
      <Slides></Slides>
      <Identity></Identity>
      <ErrorAlert></ErrorAlert>
    </>
  );
};

export default App;
