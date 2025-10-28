import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { MainLayout } from "./layout/MainLayout";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { Tasks } from "./pages/Tasks";
import { Notes } from "./pages/Notes";
import { Music } from "./pages/Music";
import { Photos } from "./pages/Photos";
import { Learn } from "./pages/Learn";
import { Maps } from "./pages/Maps";
import { NotFound } from "./pages/NotFound";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="notes" element={<Notes />} />
            <Route path="music" element={<Music />} />
            <Route path="photos" element={<Photos />} />
            <Route path="learn" element={<Learn />} />
            <Route path="maps" element={<Maps />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
