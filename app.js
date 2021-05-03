import * as THREE from 'three';
import createInputEvents from 'simple-input-events';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertex from './shaders/first/vertex.glsl';
import fragment from './shaders/first/fragment.glsl';
import gsap from 'gsap';
import Img from './img/imgre.jpg';

const event = createInputEvents(window);

export default class Intro {
	constructor(selector) {
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0xffffff, 1);
		this.renderer.physicallyCorrectLights = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;

		this.container = document.getElementById('container');
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
		//this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.time = 0;
		this.mouse = new THREE.Vector2();
		this.prevMouse = new THREE.Vector2();
		this.paused = false;
		this.speed = 0;
		this.targetSpeed = 0;

		this.setupResize();
		this.tabEvents();
		this.mouseEvents();
		this.addObjects();
		this.resize();
		this.render();
		this.mouseMoveEvent();
	}

	mouseMoveEvent() {
		event.on('move', ({ position, event, inside, dragging }) => {
			this.mouse.x = position[0] / this.width;
			this.mouse.y = 1 - position[1] / this.height;
			this.material.uniforms.mouse.value = this.mouse;
		});
	}
	getSpeed() {
		this.speed = Math.sqrt(
			(this.prevMouse.x - this.mouse.x) ** 2 +
				(this.prevMouse.y - this.mouse.y) ** 2
		);
		this.targetSpeed += 0.1 * (this.speed - this.targetSpeed);
		this.prevMouse.x = this.mouse.x;
		this.prevMouse.y = this.mouse.y;
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

		const dist = this.camera.position.z;
		const heigth = 1;
		this.camera.fov = 2 * (180 / Math.PI) * Math.atan(heigth / (2 * dist));

		if (this.width / this.height > 1) {
			this.plane.scale.x = this.camera.aspect;
			//  this.plane.scale.y = this.camera.aspect
		} else {
			this.plane.scale.y = 1 / this.camera.aspect;
		}

		this.camera.updateProjectionMatrix();
	}

	mouseEvents() {
		document.addEventListener('scroll', () => {
			if (window.pageYOffset > 10) {
				this.material.uniforms.direction.value = 0;
				gsap.to(this.material.uniforms.progress, {
					value: 1,
					duration: 0.9,
				});
			} else {
				this.material.uniforms.direction.value = 1;
				gsap.to(this.material.uniforms.progress, {
					value: 0,
					duration: 0.9,
				});
			}
		});
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
				direction: { type: 'f', value: 0 },
				speed: { type: 'f', value: 0 },
				mouse: { type: 'v2', value: new THREE.Vector2(0, 0) },
				progress: { type: 'f', value: 0 },
				texture1: { type: 't', value: new THREE.TextureLoader().load(Img) },
				resolution: { type: 'v4', value: new THREE.Vector4() },
				uvRate1: {
					value: new THREE.Vector2(1, 1),
				},
			},
			//wireframe: true,
			vertexShader: vertex,
			fragmentShader: fragment,
		});

		this.geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.plane);
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
		this.getSpeed();
		this.material.uniforms.speed.value = this.targetSpeed;
		this.material.uniforms.time.value = this.time;
		requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);
	}
}
