const media = window.matchMedia('(prefers-color-scheme: dark)');
let darkModeEnabled = false;

function toggleDarkMode() {
	const r = document.documentElement;
	darkModeEnabled = darkModeEnabled ? false : true;

	if (darkModeEnabled) {
		r.style.setProperty('--background', '#111');
		r.style.setProperty('--accent1-transparent', 'rgba(50, 50, 50, 0.75)');
		r.style.setProperty('--accent1', '#222');
		r.style.setProperty('--accent2', '#333');
		r.style.setProperty('--accent3', '#444');
		r.style.setProperty('--accent4', '#555');
		r.style.setProperty('--accent5', '#666');
		r.style.setProperty('--text', '#fff');
		r.style.setProperty('--link-color', '#66f');
	} else {
		r.style.setProperty('--background', '#fff');
		r.style.setProperty('--accent1-transparent', 'rgba(248, 248, 255, 0.75)');
		r.style.setProperty('--accent1', '#f8f8ff');
		r.style.setProperty('--accent2', '#f5f5f6');
		r.style.setProperty('--accent3', '#ededef');
		r.style.setProperty('--accent4', '#e0e0e2');
		r.style.setProperty('--accent5', '#444');
		r.style.setProperty('--text', '#000');
		r.style.setProperty('--link-color', '#11a');
	}
}

// initial
updateDarkMode(media.matches);

// live changes
if (media.addEventListener) {
	media.addEventListener('change', e => updateDarkMode(e.matches));
} else {
	media.addListener(e => updateDarkMode(e.matches));
}