import './App.css';
import {useEffect, useRef} from "react";
import {initThree} from "./ThreeFiles/threeInit";

function App() {
  const ref = useRef(null)
  useEffect(() => {
    initThree(ref);
  }, [])
  return (
    <div ref={ref}>
      <div style={{position: 'absolute', top: 0, left: 0}}>
        <h1 style={{color: "white"}}>Testing</h1>
      </div>
    </div>
  );
}

export default App;
