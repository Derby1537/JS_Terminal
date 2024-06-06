class AppFactory {
    app;
    desktopIcon;
    desktopIconText;
    bottomBarApp;
    constructor(app, pin = false) {
        this.app = app;
        const apps = document.querySelector('.apps');
        this.desktopIcon = document.createElement('div');
        this.desktopIcon.className = 'app icon ' + app.className;
        this.desktopIcon.tabIndex = 0;
        this.desktopIconText = document.createElement('div');
        this.desktopIconText.innerHTML = app.text;
        this.desktopIcon.appendChild(this.desktopIconText);
        apps.appendChild(this.desktopIcon);
        this.desktopIcon.addEventListener('click', this.click);
        this.desktopIcon.addEventListener('blur', this.blur);
        this.desktopIcon.addEventListener('dblclick', () => {AppFactory.open(app)});
    }

    click = () => {
        this.desktopIcon.className += ' clicked';
        this.desktopIconText.className += ' clicked';
    }
    blur = () => {
        this.desktopIcon.classList.remove('clicked');
        this.desktopIconText.classList.remove('clicked');
    }
    static open = (app, ... extra) => {
        const application = new app(extra);
        app.instances.push(application);
        app.bottomBarApp.update();
    }
}