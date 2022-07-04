import './App.css';
import {useEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";

function App() {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => ref.current.rotation.x += 0.01)
  return (
    <>
      <ambientLight/>
      <pointLight position={[10, 10, 10]}/>
      <mesh
        position={[-1.2, 0, 0]}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={() => click(!clicked)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}>
        <boxGeometry args={[1, 1, 1]}/>
        <meshNormalMaterial color={hovered ? 'hotpink' : 'orange'}/>
      </mesh>
    </>
  );
}

export default App;
