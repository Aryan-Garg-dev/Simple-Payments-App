import { BrowserRouter, Routes, Route} from "react-router-dom"
import Signin from "./Pages/Signin"
import Dashboard from "./Pages/Dashboard"
import Login from "./Pages/Login"
import Send from "./Pages/Send"
import Home from "./Pages/Home"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<Send />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App
