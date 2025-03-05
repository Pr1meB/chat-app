import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatScreen from "./pages/ChatScreen";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const hideNavbar = location.pathname.startsWith("/chat");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:chatId" element={<ChatScreen />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
