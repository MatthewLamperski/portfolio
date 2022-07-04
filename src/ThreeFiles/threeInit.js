import {
  Color, DirectionalLight,
  DoubleSide, FlatShading, GridHelper, Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';

export const initThree = (ref) => {
  // const gui = new dat.GUI();
  // const world = {
  //   plane: {
  //     width: 5,
  //     height: 5,
  //     widthSegments: 10,
  //     heightSegments: 10,
  //   },
  // };
  // const changeGUI = () => {
  //   plane.geometry.dispose();
  //   let {width, height, widthSegments, heightSegments} = world.plane;
  //   plane.geometry = new PlaneGeometry(width, height, widthSegments, heightSegments);
  //   let {array} = plane.geometry.attributes.position;
  //   for (let i = 0; i < array.length; i += 3) {
  //     const x = array[i];
  //     const y = array[i + 1];
  //     const z = array[i + 2];
  //
  //     array[i + 2] = z + Math.random();
  //   }
  // };
  // gui.add(world.plane, 'width', 1, 20).onChange(changeGUI);
  // gui.add(world.plane, 'height', 1, 20).onChange(changeGUI);
  // gui.add(world.plane, 'widthSegments', 1, 20).onChange(changeGUI);
  // gui.add(world.plane, 'heightSegments', 1, 20).onChange(changeGUI);

  const scene = new Scene();
  scene.background = new Color('#1f1f1f');

  const raycaster = new Raycaster();

  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new WebGLRenderer();

  const planeGeometry = new PlaneGeometry(15, 15, 18, 18);
  const planeMaterial = new MeshPhongMaterial({color: 0xff0000, side: DoubleSide, flatShading: FlatShading});
  planeMaterial.opacity = 0.5;
  const plane = new Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  let {array} = plane.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();
  }
// console.log(dat);

  const light = new DirectionalLight(0xffffff, 1);
  light.position.set(1, 0, 1);
  scene.add(light);

  const backLight = new DirectionalLight(0xffffff, 1);
  backLight.position.set(0, 0, -1);
  scene.add(backLight);

  new OrbitControls(camera, renderer.domElement);

  camera.position.z = 5;

  const material = new MeshPhongMaterial({color: 0xffffff, side: DoubleSide, flatShading: FlatShading});

// const loader = new STLLoader();
// loader.load(
//     OcalaNow,
//     (geometry) => {
//         const mesh = new Mesh(geometry, material);
//         // mesh.geometry.boundingSphere.center.x = 0;
//         // mesh.geometry.boundingSphere.center.y = 0;
//         // mesh.geometry.boundingSphere.radius = 25;
//         scene.add(mesh);
//         console.log(mesh.geometry);
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total) * 100 + '% Loaded');
//     },
//     (err) => {
//         console.log(err);
//     }
// );

  const gridHelper = new GridHelper(50, 10, 0x39ff14, 0x39ff14);
  scene.add(gridHelper);

  const mouse = {
    x: undefined,
    y: undefined,
  };
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    const intersectsPlane = raycaster.intersectObject(plane);
    // if (intersectsPlane.length > 0) {
    // }
  };
  animate();

  window.addEventListener('mousemove', ({clientX, clientY}) => {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  ref.current.appendChild(renderer.domElement);
}
