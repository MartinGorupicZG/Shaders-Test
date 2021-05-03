import Intro from './app';
import Intro1 from './app1';
import charming from 'charming';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const intro = new Intro('container');
const intro1 = new Intro1('container1');

const text = document.querySelector('.text_intro');
charming(text);

gsap.from('.text_intro span', {
	scrollTrigger: {
		trigger: '#container',
		start: 'top -5%',
	},
	y: 100,
	autoAlpha: 0,
	stagger: 0.1,
});
