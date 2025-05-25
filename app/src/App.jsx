import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routeHelper from "./helpers/routeHelper";

function App() {
  return (
    <Router>
      <Routes>
        {routeHelper.map(({ path, comp }, index) => (
          <Route key={index} path={path} element={comp} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
