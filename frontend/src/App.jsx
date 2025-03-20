import React, { useContext } from 'react'
import Homepage from './pages/Homepage'
import "./App.css";
import { ThemeContext } from "./themeContext.jsx"

const App = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`App ${theme}`}>
      <Homepage />
    </div>
  )
}

export default App