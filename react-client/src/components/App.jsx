import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Comics from "./Comics";
import ComicDetail from "./ComicDetail";
import Collections from "./Collections";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marvel-comics/page/:pagenum" element={<Comics />} />
        <Route path="/marvel-comics/:id" element={<ComicDetail />} />
        <Route path="/marvel-comics/collections" element={<Collections />} />
      </Routes>
    </div>
  );
}

export default App;
