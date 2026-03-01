import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import TopTracks from "./pages/TopTracks";
import TopArtists from "./pages/TopArtists";
import Mood from "./pages/Mood";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import Layout from "./components/Layout";

const PrivateRoutes = () => {
    const token = localStorage.getItem("access_token");
    return token ? <Layout /> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/top-tracks" element={<TopTracks />} />
          <Route path="/top-artists" element={<TopArtists />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/history" element={<RecentlyPlayed />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
