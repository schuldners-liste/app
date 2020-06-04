setInterval(() => {
    if (!window.navigator.onLine) {
        if (!window.location.pathname.includes('offline')) {
            redirect('offline/index.html');
        }
    } else {
        if (window.location.pathname.includes('offline')) {
            redirect('../index.html');
        }
    }
}, 500);