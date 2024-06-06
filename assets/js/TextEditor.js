class TextEditor extends App {
    static className = 'textEditor';
    static text = 'Editor di testo';
    static instances = [];
    static bottomBarApp;
    node;
    name;
    modified;
    textArea;
    pressedKeys;
    OSTopBar = ['TextEdit', 'File', 'Modifica', 'Formato', 'Vista', 'Finestra', 'Aiuto'];
    constructor(args) {
        super();
        if(!TextEditor.bottomBarApp) {
            TextEditor.bottomBarApp = new BottomBarApp(TextEditor);
        }
        this.node = args[0];
        this.node._++;

        this.name = args[1];
        this.imgIcon = TextEditor.className;
        this.text.innerHTML = this.name;

        this.modified = document.createElement('div');
        this.modified.innerHTML = '— Modificato';
        
        this.innerContainer.innerHTML = '';
        this.innerContainer.classList.add(TextEditor.className + '-app');


        this.innerContainer.innerHTML = this.node.content;
        this.innerContainer.contentEditable = true;
        this.innerContainer.spellcheck = false;
        this.innerContainer.addEventListener('input', this.modify);
        this.innerContainer.addEventListener('blur', this.blur);

        this.innerContainer.addEventListener('focus', this.focus);

        this.outerContainer.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);

        this.pressedKeys = new Set();

        setTimeout(() => {
            this.click();
            this.outerContainer.focus();
        }, 10);
    }

    keyDown = (event) => {
        this.pressedKeys.add(event.keyCode);
        if(this.pressedKeys.has(91)) { // META
            if(this.pressedKeys.has(83)) { // S
                event.preventDefault();
                this.pressedKeys.delete(83);
                this.save();
            }
        }
        if(this.pressedKeys.has(9)) {
            event.preventDefault();
        }
    }

    keyUp = (event) => {
        this.pressedKeys.delete(event.keyCode);
    }

    modify = () => {
        if(!this.text.contains(this.modified)) {
            this.text.appendChild(this.modified);
        }
    }

    save = () => {
        this.text.innerHTML = this.name;
        fs.save(this.node, this.innerContainer.innerHTML);
    }

    

    closee = () => {
        this.node._--;
        TextEditor.instances = TextEditor.instances.filter(finder => finder != this);
        if(TextEditor.bottomBarApp.update()) {
            setTimeout(() => {
                TextEditor.bottomBarApp = null;
            }, 200);
        }
    }

}