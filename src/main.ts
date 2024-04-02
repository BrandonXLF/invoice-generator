import './app.css';
import App from './routes/+page.svelte';

const app = new App({
	target: document.getElementById('app')!
});

export default app;
