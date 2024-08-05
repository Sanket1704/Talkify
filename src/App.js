import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./screens/Signin";
import SignUp from "./screens/Signup";
import ChatHome from "./screens/ChatHome";
import Home from './screens/Home';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path = "/" element = {<Home />} />
          <Route path = "Signin" element = {<SignIn />} />
          <Route path = "Signup" element = {<SignUp />} />
          <Route path = "/chat-home/:receiverId" element = {<ChatHome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
