import Header from "./components/Header";
import "./styles.css"
import "leaflet/dist/leaflet.css"
import MapComp from "./components/MapComp";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RemoteControl from "./components/RemoteControl";
import { RobotDataContextProvider } from "./components/RobotDataContext";
import Title from "./components/Title";

/* `function App` is defining the main component of the application. It is returning a JSX element that
includes a `Router` component from the `react-router-dom` library, a `RobotDataContextProvider`
component, a `Header` component, and two `Route` components that define the paths and components to
be rendered for the different pages of the application. */
function App() {
  return (
    <Router>
      <RobotDataContextProvider>
        <div className="App">
          <Title />
          <Header />
          <Routes>
            <Route path="/" element={<MapComp />} />
            <Route path="/remote-control" element={<RemoteControl />} />
          </Routes>
        </div>
      </RobotDataContextProvider>
    </Router>
  )
}

export default App;