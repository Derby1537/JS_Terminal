class BottomBarApp {
    app;
    text;
    className;
    outerContainer;
    hoverText;
    dot;
    isPinned;
    constructor(app, pin = false) {
        this.app = app;
        this.text = app.text;
        this.className = app.className;
        this.isPinned = pin;
        this.outerContainer = document.createElement('div');
        this.outerContainer.classList.add('icon');
        this.outerContainer.classList.add('bottom');
        this.outerContainer.classList.add(this.className);
        this.outerContainer.style.transition = 'scale 0.2s linear';
        this.outerContainer.style.scale = 0;
        setTimeout(() => {
            this.outerContainer.style.scale = 1;
        }, 10);

        this.hoverText = document.createElement('div');
        this.hoverText.innerHTML = this.text;
        this.hoverText.classList.add('bottom-hover');
        this.hoverText.style.display = 'none';
        this.outerContainer.appendChild(this.hoverText);

        this.dot = document.createElement('div');
        this.dot.classList.add('dot');
        this.dot.style.display = 'none';
        this.outerContainer.appendChild(this.dot);

        this.outerContainer.addEventListener('mouseover', () => {
            this.hoverText.style.display = '';
        })
        this.outerContainer.addEventListener('mouseleave', () => {
            this.hoverText.style.display = 'none';
        })
        
        if(this.isPinned) {
            bottomBar.insertBefore(this.outerContainer, bottomBar.firstChild);
        } else {
            const line = bottomBar.querySelector('.line');
            bottomBar.insertBefore(this.outerContainer, line)
        }
        this.outerContainer.addEventListener('click', this.click);
        
    }
    
    update = () => {
        if(this.app.instances.length > 0) {
            this.dot.style.display = '';
        } else {
            this.dot.style.display = 'none';
            if(!this.isPinned) {
                this.outerContainer.style.scale = 0;
                this.outerContainer.addEventListener('transitionend', () => {
                    this.outerContainer.remove();
                })
                return true;
            }
        } 
    }

    click = (event) => {
        if(this.app.instances.length == 0) {
            AppFactory.open(this.app);
        } else {
            const application = this.app.instances.pop();
            if(application.bottomBarIcon) {
                application.bottomBarIcon.dispatchEvent(new Event('click'));
            } else 
            if(application.click()) {
                const left = application.innerContainer.scrollLeft;
                const top = application.innerContainer.scrollTop;
                document.body.removeChild(application.outerContainer);
                document.body.appendChild(application.outerContainer);
                application.innerContainer.scrollTo(left, top);
            }
            // application.focus();
            // application.blur();
            // application.focus();
            this.app.instances.unshift(application);
        }
    }
}