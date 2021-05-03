import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertex from './shaders/second/vertex.glsl';
import fragment from './shaders/second/fragment.glsl';
import model from './scene.glb';
import img from './img/texture1.png';

import { TimelineMax } from 'gsap';

export default class Intro1 {
	constructor(selector) {
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0x000000, 1);
		this.renderer.physicallyCorrectLights = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;

		this.container = document.getElementById('container1');
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.container.appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera(
			70,
			window.innerWidth / window.innerHeight,
			0.001,
			1000
		);

		this.camera.position.set(0, 0, 2);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.time = 0;
		this.paused = false;

		this.setupResize();
		this.tabEvents();

		this.addObjects();
		this.resize();
		this.render();
		this.loader = new GLTFLoader();
		this.loader.load(model, (gltf) => {
			console.log(gltf);
			gltf.scene.position.x = -0.2;
			gltf.scene.rotation.y = -1.45;
			gltf.scene.rotation.x = -0.7;

			this.scene.add(gltf.scene);
			gltf.scene.traverse((o) => {
				if (o.isMesh) {
					o.scale.set(0.04, 0.04, 0.04);
					o.geometry.center();
					o.material = this.material;
				}
			});
		});
	}
	setupResize() {
		window.addEventListener('resize', this.resize.bind(this));
	}

	resize() {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;

		this.imageAspect = 853 / 1280;

		let a1;
		let a2;

		if (this.height / this.width > this.imageAspect) {
			a1 = (this.width / this.height) * this.imageAspect;
			a2 = 1;
		} else {
			a1 = 1;
			a2 = (this.width / this.height) * this.imageAspect;
		}
		this.material.uniforms.resolution.value.x = this.width;
		this.material.uniforms.resolution.value.y = this.height;
		this.material.uniforms.resolution.value.z = a1;
		this.material.uniforms.resolution.value.w = a2;

		// const dist = this.camera.position.z
		//const heigth = 1
		//this.camera.fov = 2*(180/Math.PI)*Math.atan(heigth / (2*dist))

		// if (this.width / this.height >1) {
		//	this.plane.scale.x = this.camera.aspect
		//  this.plane.scale.y = this.camera.aspect
		//} else {
		//  this.plane.scale.y = 1/this.camera.aspect
		//}

		this.camera.updateProjectionMatrix();
	}

	addObjects() {
		let that = this;
		this.material = new THREE.ShaderMaterial({
			extensions: {
				derivatives: 'extension GL_OES_standard_derivatives : enable',
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: { type: 'f', value: 0 },
				texture1: { type: 't', value: new THREE.TextureLoader().load(img) },
				resolution: { type: 'v4', value: new THREE.Vector4() },
				uvRate1: {
					value: new THREE.Vector2(1, 1),
				},
			},
			vertexShader: vertex,
			fragmentShader: fragment,
		});

		this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
		this.plane = new THREE.Mesh(this.geometry, this.material);
		//this.scene.add(this.plane);
	}

	tabEvents() {
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.stop();
			} else {
				this.play();
			}
		});
	}
	stop() {
		this.paused = true;
	}
	play() {
		this.paused = false;
	}

	render() {
		if (this.paused) return;
		this.time += 0.05;
		this.material.uniforms.time.value = this.time;
		requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);
	}
}
