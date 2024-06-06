class Finder extends App {
    static className = 'finder';
    static text = 'Finder';
    static instances = [];
    static bottomBarApp;
    folderElementsNumber;
    lines;
    currentDir;
    constructor(args) {
        super();
        if(args[0]) {
            this.currentDir = args[0];
        } else {
            this.currentDir = fs.getMainDirectory();
        }
        this.imgIcon = 'finder';
        this.updateRepeatedText();
        this.innerContainer.innerHTML = '';
        this.innerContainer.classList.remove('terminal-app');
        this.innerContainer.classList.add('finder-app');

        this.innerContainer.addEventListener('mousedown', (event) => {this.blurLines(event.target)});
        
        this.lines = [];
        this.update();
    }

    updateRepeatedText = () => {
        this.text.innerHTML = '<div>' + ( this.currentDir.$ == '~' ? user : this.currentDir.$);
    }

    update = () => {
        const nodes = fs.getPossibleDirectories(this.currentDir, '').sort();
        this.folderElementsNumber = nodes.length;
        this.innerContainer.innerHTML = '';
        this.lines = [];
        if(this.currentDir.$ != '~') {
            const line = document.createElement('div');
            line.tabIndex = '0';
            line.classList.add('line');
            line.innerHTML = '..';
            line.addEventListener('mousedown', () => {this.focusLine(line)})
            this.lines.push(line);
            this.innerContainer.appendChild(line);
        }
        for(let i = 0; i < this.folderElementsNumber; i++) {
            const line = document.createElement('div');
            line.tabIndex = '0';
            line.classList.add('line');
            if(nodes[i].endsWith('/')) {
                nodes[i] = nodes[i].slice(0, nodes[i].length-1);
                line.classList.add('folder');
            } else {
                line.classList.add('file');
            }
            line.addEventListener('mousedown', () => {this.focusLine(line)})
            line.innerHTML = nodes[i];
            if(!(i % 2)) line.classList.add('odd');
            this.lines.push(line);
            this.innerContainer.appendChild(line);
        }
    }

    blurLines = (lineToFocus) => {
        for(let i = 0 ; i < this.folderElementsNumber; i++) {
            this.lines[i].classList.remove('selected');
        }
        lineToFocus.classList.add('selected');
    }

    focusLine = (line) => {
        line.addEventListener('mousedown', this.changeDirectory);
        setTimeout(() => {
            line.removeEventListener('mousedown', this.changeDirectory);
        }, 300);
    }

    changeDirectory = (event) => {
        const newDirectory = event.target.innerHTML;
        this.cd(newDirectory);
        this.update();
    }

    cd = (input) => {
        try {
            this.currentDir = fs.cd(this.currentDir, input);
            this.updateRepeatedText();
        } catch(e) {
            if(e.message == 'not a directory') {
                try {
                    const file = fs.open(this.currentDir,input);
                    AppFactory.open(TextEditor, file, input);
                    this.blur();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    closee = () => {
        this.currentDir._--;
        Finder.instances = Finder.instances.filter(finder => finder != this);
        Finder.bottomBarApp.update();
    }

    static pin = () => {
        Finder.bottomBarApp = new BottomBarApp(Finder, true);
    }

    static updateAllInstances = () => {
        for(let i = 0; i < Finder.instances.length; i++) {
            Finder.instances[i].update();
        }
    }

}