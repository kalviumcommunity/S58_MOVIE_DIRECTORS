import { Routes, Route, BrowserRouter } from "react-router-dom";
import HOME from "./Components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HOME />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
