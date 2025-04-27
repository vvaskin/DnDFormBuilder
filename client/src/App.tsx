import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import FormBuilder from "./components/FormBuilder";
import ViewForms from "./components/ViewForms";
import FormPreview from "./components/FormPreview";

// The main hub, contains all the client side routing

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<FormBuilder />} />
        <Route path="/create/:id" element={<FormBuilder />} />
        <Route path="/forms" element={<ViewForms />} />
        <Route path="/forms/:id" element={<FormPreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
