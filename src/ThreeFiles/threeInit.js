import {
  Clock,
  Color, DirectionalLight,
  DoubleSide, FlatShading, GridHelper, Mesh, MeshNormalMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene, SphereGeometry, SpotLight,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {World, NaiveBroadphase, Sphere, Body, Vec3, Plane} from 'cannon-es'
import * as dat from 'dat.gui';

export const initThree = (ref, setFunctions) => {
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

  const world = new World()
  world.gravity.set(0, -9.82, 0)
  world.broadphase = new NaiveBroadphase()

  const normalMaterial = new MeshNormalMaterial()

  const sphereGeometry = new SphereGeometry()
  const sphereMesh = new Mesh(sphereGeometry, normalMaterial)
  sphereMesh.position.y = 3
  sphereMesh.castShadow = true
  scene.add(sphereMesh)
  const sphereShape = new Sphere(1)
  const sphereBody = new Body({mass: 1})
  sphereBody.addShape(sphereShape)
  sphereBody.position.x = sphereMesh.position.x
  sphereBody.position.y = sphereMesh.position.y
  sphereBody.position.z = sphereMesh.position.z
  world.addBody(sphereBody)

  setFunctions(prevState => ({
    ...prevState,
    resetSphere: () => {
      console.log("RESET")
      sphereMesh.position.set(0, 1, 0)
    }
  }))

  const planeGeometry = new PlaneGeometry(25, 25);
  const planeMaterial = new MeshPhongMaterial({color: 0xa1a1a1, side: DoubleSide, flatShading: FlatShading});
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.rotateX(-Math.PI / 2)
  plane.receiveShadow = true;
  scene.add(plane);
  const planeShape = new Plane()
  const planeBody = new Body({mass: 0})
  planeBody.addShape(planeShape)
  planeBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2)
  world.addBody(planeBody)

  // let {array} = plane.geometry.attributes.position;
  // for (let i = 0; i < array.length; i += 3) {
  //   const x = array[i];
  //   const y = array[i + 1];
  //   const z = array[i + 2];
  //
  //   array[i + 2] = z + Math.random();
  // }
// console.log(dat);

  const light1 = new SpotLight()
  light1.position.set(2.5, 5, 5)
  light1.angle = Math.PI / 4
  light1.penumbra = 0.5
  light1.castShadow = true
  light1.shadow.mapSize.width = 1024
  light1.shadow.mapSize.height = 1024
  light1.shadow.camera.near = 0.5
  light1.shadow.camera.far = 20
  scene.add(light1)

  const light2 = new SpotLight()
  light2.position.set(-2.5, 5, 5)
  light2.angle = Math.PI / 4
  light2.penumbra = 0.5
  light2.castShadow = true
  light2.shadow.mapSize.width = 1024
  light2.shadow.mapSize.height = 1024
  light2.shadow.camera.near = 0.5
  light2.shadow.camera.far = 20
  scene.add(light2)

  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  controls.target.y = 0.5;

  camera.position.set(0, 2, 4);


  const mouse = {
    x: undefined,
    y: undefined,
  };

  const clk = new Clock()
  let delta;

  const animate = () => {
    requestAnimationFrame(animate);

    controls.update()

    delta = Math.min(clk.getDelta(), 0.1)
    world.step(delta)

    sphereMesh.position.set(
      sphereBody.position.x,
      sphereBody.position.y,
      sphereBody.position.z,
    )
    sphereMesh.quaternion.set(
      sphereBody.quaternion.x,
      sphereBody.quaternion.y,
      sphereBody.quaternion.z,
      sphereBody.quaternion.w,
    )

    renderer.render(scene, camera);
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
  renderer.shadowMap.enabled = true;
  ref.current.appendChild(renderer.domElement);
}
