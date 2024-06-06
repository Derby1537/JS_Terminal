class App {
    outerContainer;
    innerContainer;
    topBar;
    text;
    isDragging;
    bottomBarIcon;
    closeButton;
    minimiseButton;
    maximiseButton;
    resizeButton;
    OSTopBar = ['Finder', 'File', 'Modifica', 'Vista', 'Vai', 'Finestra', 'Aiuto'];
    static top = 200;
    static left = 200;
    mouseX;
    mouseY;
    width;
    height;
    imgIcon;
    static instances = [];

    static text;
    static className;

    static bottomBarApp;
    
    constructor() {
        this.outerContainer = document.createElement('div');
        this.outerContainer.className = 'outer-container';
        this.outerContainer.tabIndex = 0;
        this.outerContainer.style.animation = 'zoom-in 0.2s linear';
        this.outerContainer.addEventListener('animationend', () => {this.outerContainer.style.animation = ''});
        if(App.top > window.innerHeight - 500) App.top = 50;
        if(App.left > window.innerWidth - 750) App.left = 50;
        this.outerContainer.style.top = App.top; App.top += 30;
        this.outerContainer.style.left = App.left; App.left += 30;
        this.outerContainer.innerHTML = 
        '<div class="top-bar">\
            <div class="buttons">\
                <div class="top-button close"></div>\
                <div class="top-button minimise"></div>\
                <div class="top-button maximise"></div>\
            </div>\
            <div class="text"></div>\
        </div>\
        <div class="inner-container">\
            <div>this is a template for an app. This shouldnt be instantiated<div>\
        </div>';

        this.outerContainer.addEventListener('mousedown', this.click);

        this.topBar = this.outerContainer.querySelector('.top-bar');
        this.topBar.addEventListener('mousedown', this.startDrag);
        document.addEventListener('mouseup', this.stopDrag);

        this.text = this.outerContainer.querySelector('.text');
        this.text.innerHTML = 'App';

        this.closeButton = this.outerContainer.querySelector('.close');
        this.closeButton.addEventListener('click', this.close);
        this.minimiseButton = this.outerContainer.querySelector('.minimise');
        this.minimiseButton.addEventListener('click', this.minimise);
        this.maximiseButton = this.outerContainer.querySelector('.maximise');
        this.maximiseButton.addEventListener('click', this.maximise);
        
        this.innerContainer = this.outerContainer.querySelector('.inner-container');

        this.outerContainer.addEventListener('focus', this.focus);
        this.outerContainer.addEventListener('blur', this.blur);

        this.outerContainer.dispatchEvent(new Event('blur'));
        
        
        document.body.appendChild(this.outerContainer);
        this.outerContainer.dispatchEvent(new Event('mousedown'));
        this.outerContainer.focus();
        this.outerContainer.dispatchEvent(new Event('mouseup'));
    }

    click = (event) => {
        if(this.bottomBarIcon == null) {
            const left = this.innerContainer.scrollLeft;
            const top = this.innerContainer.scrollTop;
            document.body.removeChild(this.outerContainer);
            document.body.appendChild(this.outerContainer);
            this.innerContainer.scrollTo(left, top);
        }
    }

    startDrag = (event) => {
        if(this.outerContainer.classList.contains('full-screen-app') || event.target == this.closeButton || event.target == this.minimiseButton || event.target == this.maximiseButton) {event.stopPropagation(); return;}
        this.click();
        this.isDragging = true;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        document.body.addEventListener('mousemove', this.drag);
    }

    drag = (event) => {
        if (!this.isDragging) return;
        document.getSelection().removeAllRanges();
        const deltaX = event.clientX - this.mouseX;
        const deltaY = event.clientY - this.mouseY;
        this.outerContainer.style.left = (parseInt(this.outerContainer.style.left) + deltaX) + 'px';
        this.outerContainer.style.top = (parseInt(this.outerContainer.style.top) + deltaY) + 'px';
        if(parseInt(this.outerContainer.style.top) < 26) {
            this.outerContainer.style.top = '26px';
        }
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    stopDrag = (event) => {
        this.isDragging = false;
        document.body.removeEventListener('mousemove', this.drag);
    }

    close = (event) => {
        if(event) event.stopPropagation();
        this.outerContainer.remove();
        setupTopBar(defaultTopBar);
        this.closee();
    }
    closee;

    minimise = (event) => {
        setupTopBar(defaultTopBar);
        event.stopPropagation();
        this.bottomBarIcon = document.createElement('div');
        this.bottomBarIcon.className = 'icon bottom';
        this.bottomBarIcon.style.display = 'flex';
        this.bottomBarIcon.style.justifyContent = 'center';
        this.bottomBarIcon.style.alignItems = 'center';
        this.bottomBarIcon.addEventListener('click', this.unMinimise);
        
        const bottomHover = document.createElement('div');
        bottomHover.className = 'bottom-hover';
        bottomHover.style.display = 'none';
        bottomHover.innerHTML = this.text.innerHTML;
        this.bottomBarIcon.appendChild(bottomHover);
        updateBottomIcon(this.bottomBarIcon);

        this.outerContainer.style.transition = 'all 0.3s linear';
            
        bottomBar.insertBefore(this.bottomBarIcon, trashCan);
        this.left = this.outerContainer.style.left;
        this.top = this.outerContainer.style.top;
        this.outerContainer.style.left = this.bottomBarIcon.getBoundingClientRect().left;
        this.outerContainer.style.top = this.bottomBarIcon.getBoundingClientRect().top + 10;
        this.outerContainer.style.transformOrigin = 'top left';
        const HEIGHT =  this.outerContainer.getBoundingClientRect().height; const WIDTH =  this.outerContainer.getBoundingClientRect().width;
        this.outerContainer.style.scale = (WIDTH > HEIGHT ? 50 / WIDTH :  40 / HEIGHT);
        this.outerContainer.style.border = '25px solid white'
        this.outerContainer.addEventListener('transitionend', this.minimiseAnimation);

        
    }
    minimiseAnimation = () => {
        this.bottomBarIcon.appendChild(this.outerContainer);

        const imgIconBottom = document.createElement('div');
        imgIconBottom.classList.add(this.imgIcon, 'bottom-icon-smaller');
        this.bottomBarIcon.appendChild(imgIconBottom);

        this.outerContainer.style.margin = '0';
        this.outerContainer.style.left = '50%';
        this.outerContainer.style.top = '50%';
        this.outerContainer.style.transform = `translate(-50%, -50%)`;
        this.outerContainer.removeEventListener('transitionend', this.minimiseAnimation);
    }
    unMinimise = (event) => {
        setupTopBar(this.OSTopBar);
        if(event) event.stopPropagation();
        this.outerContainer.transition = 'all 0.3s linear';
        this.outerContainer.style.scale = '1';
        this.outerContainer.style.border = '';
        this.outerContainer.style.transform = '';
        this.outerContainer.style.left = (parseInt(this.left) - parseInt(this.bottomBarIcon.getBoundingClientRect().left)) - 10;
        this.outerContainer.style.top = (parseInt(this.top) - parseInt(this.bottomBarIcon.getBoundingClientRect().top)) - 10;
        this.outerContainer.addEventListener('transitionend', this.unMinimiseAnimation);
        this.outerContainer.focus();
        // 
    }
    unMinimiseAnimation = () => {
        this.bottomBarIcon.remove();
        this.outerContainer.style = '';
        this.outerContainer.style.left = this.left;
        this.outerContainer.style.top = this.top;
        document.body.appendChild(this.outerContainer);
        
        
        
        this.outerContainer.removeEventListener('transitionend', this.unMinimiseAnimation);
        this.bottomBarIcon = null;
    }

    maximise = () => {
        this.outerContainer.style.transition = 'all 0.2s linear';
        this.outerContainer.addEventListener('transitionend', this.maximiseAnimation);
        if(!this.outerContainer.classList.contains('full-screen-app')) {
            this.left = this.outerContainer.style.left;
            this.top = this.outerContainer.style.top;
            this.outerContainer.style.top = '0';
            this.outerContainer.style.left = '0';
            this.minimiseButton.style.backgroundColor = 'rgb(84,84,81)';
            this.minimiseButton.removeEventListener('click', this.minimise);
            this.outerContainer.classList.add('full-screen-app');
            this.topBar.classList.add('full-screen-app')

            this.innerContainer.classList.add('full-screen');
            this.width = this.innerContainer.style.width;
            this.height = this.innerContainer.style.height;
            this.innerContainer.style = '';
        } else {
            this.outerContainer.style.left = this.left;
            this.outerContainer.style.top = this.top;
            this.minimiseButton.style.backgroundColor = '';
            this.minimiseButton.addEventListener('click', this.minimise);
            this.outerContainer.classList.remove('full-screen-app');
            this.topBar.classList.remove('full-screen-app');

            this.innerContainer.classList.remove('full-screen');
            this.innerContainer.style.width = this.width;
            this.innerContainer.style.height = this.height;

            
        }
    }
    maximiseAnimation = () => {
        this.outerContainer.style.transition = '';
        this.outerContainer.removeEventListener('transitionend', this.maximiseAnimation);
    }
    
    focus = () => {
        setupTopBar(this.OSTopBar);
        this.outerContainer.classList.remove('unfocused');
    }
    
    blur = () => {
        setupTopBar(defaultTopBar);
        this.outerContainer.classList.add('unfocused');
    }
}