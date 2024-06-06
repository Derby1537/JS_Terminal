class Terminal extends App {
    static text = 'Terminal';
    static className = 'terminal';
    user;
    inputArea;
    outputArea;
    autoCompleteDiv;
    lastInputs;
    lastInputsCounter;
    input;
    inputDiv;
    repeatedText;
    currentDir;
    OSTopBar = ['Terminale', 'Shell', 'Modifica', 'Vista', 'Finestra', 'Aiuto'];
    static instances = [];
    static commands = ['greet', 'whoami', 'echo', 'lyrics', 'weather', 'time', 'date', 'clear', 'exit', 'help', 'ls', 'cd', 'pwd', 'man', 'mkdir', 'mv', 'rmdir', 'rm', 'cp', 'cat', 'touch', 'open'].sort();
    static bottomBarApp;
    constructor() {
        super();
        if(!Terminal.bottomBarApp) {
            Terminal.bottomBarApp = new BottomBarApp(Terminal);
        }

        this.currentDir = fs.getMainDirectory();
        this.currentDir._++;

        this.imgIcon = 'terminal';
        this.user = 'gabriele_dellerba'
        this.computer = 'MacBook-Pro-di-Gabriele';
        
        this.innerContainer.className += ' terminal-app';
        this.innerContainer.innerHTML = 
        '\
        <div class="output"></div>\
        <div class="input"><span class="repeated-text"></span><span contenteditable="true" spellcheck="false"></div>\
        <div class="autocomplete"></div>\
        ';

        this.repeatedText = this.innerContainer.querySelector('.repeated-text');
        this.updateRepeatedText();

        this.inputDiv = this.innerContainer.querySelector('.input');
        
        this.inputArea = this.innerContainer.querySelector('span[contenteditable="true"]');
        this.outerContainer.addEventListener('keydown', this.keyPress);

        this.autoCompleteDiv = this.innerContainer.querySelector('.autocomplete');
        
        this.outputArea = this.innerContainer.querySelector('.output');

        this.lastInputs = [10];
        for(let i = 0; i < 10; this.lastInputs[i++] = null);
        this.lastInputsCounter = -1;
        
        // this.outerContainer.addEventListener('mouseup', this.click);
        this.outerContainer.removeEventListener('mousedown', this.click);
        this.outerContainer.addEventListener('mousedown', this.click);


        this.inputArea.addEventListener('focus', this.focus);
        this.inputArea.addEventListener('blur', this.blur);


        this.text.innerHTML = '<div>' + this.user + ' — -zsh </div>';

        this.maximiseButton.addEventListener('click', this.maximise);

        this.outerContainer.addEventListener('keydown', this.keyPress);
        
        

    }

    click = (event) => {
        if(!window.getSelection().isCollapsed) {
            return;
        }
        if(event && event.target && !this.outputArea.contains(event.target)) {
            this.inputArea.focus();
        }
        return true;
    }

    keyPress = (event) => {
        switch(event.key) {
            case 'Meta':
            case 'Alt':
            case 'Control':
                this.specialKeyPress(event);
                break;
            case 'Enter':
                event.preventDefault();
                this.enter();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.arrowUp();
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.arrowDown();
                break;
            case 'Tab':
                event.preventDefault();
                this.tab();
                break;
            default:
                this.inputArea.focus();
        }
    }

    specialKeyPress = (event) => {
        this.outerContainer.removeEventListener('keydown', this.keyPress);
        this.outerContainer.addEventListener('keydown', this.metaKeyPressDispatcher);
        this.outerContainer.addEventListener('keyup', this.keyUp);
    }

    metaKeyPressDispatcher = (event) => {
        switch(event.keyCode) {
            default:
                break;
        }
    }

    keyUp = (event) => {
        this.outerContainer.removeEventListener('keyup', this.keyUp);
        this.outerContainer.removeEventListener('keydown', this.metaKeyPressDispatcher);
        this.outerContainer.addEventListener('keydown', this.keyPress);
    }

    enter = () => {
        const input = this.inputArea.innerHTML;
        this.inputArea.innerHTML = '';
        this.print(this.repeatedText.innerHTML + input, true);
        if(input.length <= 0) {
            return;
        }
        this.lastInputs.unshift(input);
        this.lastInputsCounter = -1;
        if(input.startsWith('man')) {
            this.man(input);
            return;
        }
        if(input.startsWith('weather')) {
            this.weather(input);
            return;
        }
        if(input.startsWith('lyrics')) {
            this.lyrics(input);
            return;
        }
        if(input.startsWith('echo')) {
            this.echo(input);
            return;
        }
        if(input.startsWith('cd')) {
            this.cd(input);
            return;
        }
        if(input.startsWith('mkdir')) {
            this.mkdir(input);
            return;
        }
        if(input.startsWith('cp')) {
            this.cp(input);
            return;
        }
        if(input.startsWith('mv')) {
            this.mv(input);
            return;
        }
        if(input.startsWith('rm ') || input.startsWith('rm&nbsp;')) {
            this.rm(input);
            return;
        }
        if(input.startsWith('rmdir')) {
            this.rmdir(input);
            return;
        }
        if(input.startsWith('cat')) {
            this.cat(input);
            return;
        }
        if(input.startsWith('touch')) {
            this.touch(input);
            return;
        }
        if(input.startsWith('open')) {
            this.open(input);
            return;
        }
        switch(input) {
            case 'greet':
            case 'greet&nbsp;':
                this.greet();
                break;
            case 'time':
            case 'time&nbsp;':
                this.time();
                break;
            case 'whoami':
            case 'whoami&nbsp;':
                this.whoami();
                break;
            case 'ls':
            case 'ls&nbsp;':
                this.ls();
                break;
            case 'pwd':
            case 'pwd&nbsp;':
                this.pwd();
                break;
            case 'time':
            case 'time&nbsp;':
                this.time();
                break;
            case 'date':
            case 'date&nbsp;':
                this.date();
                break;
            case 'help':
            case 'help&nbsp;':
                this.help();
                break;
            case 'clear':
            case 'clear&nbsp;':
                this.clear();
                break;
            case 'exit':
            case 'exit&nbsp;':
                this.close();
                break;
            default:
                this.print('zsh: command not found: ' + input)
                break;
        }
        
    }

    help = () => {
        this.print('cat [fileName] - prints [fileName]\'s content');
        this.print('cd [directory] - changes current directory into [directory]');
        this.print('clear - clears the terminal\'s output');
        this.print('cp [oldDirectory] [newDirectory] - copies [oldDirectory] into [newDirectory]');
        this.print('date - tells the date');
        this.print('echo [message] - echoes [message]');
        this.print('exit - close the terminal');
        this.print('greet - greets you');
        this.print('ls - prints the current directory\'s nodes');
        this.print('lyrics [song] - prints the lyrics to [song]');
        this.print('man [page] - prints the manual to [page]');
        this.print('mv [oldDirectory] [newDirectory] - moves [oldDirectory] into [newDirectory]');
        this.print('mkdir [directoryName] - creates a new directory called [directoryName]');
        this.print('open [directory | file] - opens [directory | file]');
        this.print('pwd - prints the current working directory');
        this.print('rm [file] - deletes [file]');
        this.print('rmdir [directory] - deletes [directory] if empty');
        this.print('time - tells the time');
        this.print('touch [fileName] - creates an empty file called [fileName]');
        this.print('weather [city] - tells the weather for [city]');
        this.print('whoami - shows your username');
    }

    mkdir = async (input) => {
        if(input[5] != ' ' || input.length < 5) {
            this.print('try: mkdir [directoryName]');
            return;
        }
        input = input.slice(6);
        try {
            await fs.mkdir(this.currentDir, input);
            
        } catch(e) {
            this.print('mkdir: ' + e.message + ': ' + input);
        }
    }

    rmdir = async (input) => {
        if(input[5] != ' ' || input.length < 5) {
            this.print('try: rmdir [directory]');
            return;
        }
        input = input.slice(6);
        try {
            await fs.rmdir(this.currentDir, input);
            
        } catch(e) {
            this.print('rmdir: ' + e.message + ': ' + input);
        }
    }

    cat = (input) => {
        if(input[3] != ' ' || input.length < 3) {
            this.print('try: cat [fileName]');
            return;
        }
        input = input.slice(4);
        try {
            this.print(fs.cat(this.currentDir, input));
        } catch(e) {
            this.print('cat: ' + e.message + ': ' + input);
        }
    }

    touch = (input) => {
        if(input[5] != ' ' || input.length < 5) {
            this.print('try: touch [fileName]');
            return;
        }
        input = input.slice(6);
        try {
            fs.touch(this.currentDir, input);
            
        } catch(e) {
            this.print('touch: ' + e.message + ': ' + input);
        }
    }

    open = (input) => {
        if(input[4] != ' ' || input.length < 5) {
            this.print('try: open [directory | file]');
            return;
        }
        input = input.slice(5);
        try {
            const folder = fs.cd(this.currentDir, input);
            AppFactory.open(Finder, folder);
        } catch(e) {
            if(e.message == 'not a directory') {
                try {
                    const file = fs.open(this.currentDir,input);
                    input = input.split('/');
                    input = input[input.length-1];
                    AppFactory.open(TextEditor, file, input);
                } catch (error) {
                    this.print('open: ' + e.message + ': ' + input);
                }
            } else {
                this.print('open: ' + e.message + ': ' + input); 
            }
        }
    }
    
    cp = async (input) => {
        if(input[2] != ' ' || input.length < 2) {
            this.print('try: cp [oldName] [newName]');
            return;
        }
        const args = input.slice(3).split(' ');
        if(args.length != 2) {
            this.print('try: cp [oldDirectory] [newDirectory]');
            return;
        }
        try {
            await fs.cp(this.currentDir, args);
            
        } catch(e) {
            this.print('mv: ' + e.message + ': ' + input.slice(3));
        }
    }

    mv = async (input) => {
        if(input[2] != ' ' || input.length < 2) {
            this.print('try: mv [oldName] [newName]');
            return;
        }
        const args = input.slice(3).split(' ');
        if(args.length != 2) {
            this.print('try: mv [oldDirectory] [newDirectory]');
            return;
        }
        try {
            await fs.mv(this.currentDir, args);
            
        } catch(e) {
            this.print('mv: ' + e.message + ': ' + input.slice(3));
        }
    }

    rm = async (input) => {
        if(input[2] != ' ' || input.length < 2) {
            this.print('try: rm [fileName]');
            return;
        }
        input = input.split(' ')[1];
        try {
            await fs.rm(this.currentDir, input);
            
        } catch (e) {
            this.print('rm: ' + e.message + ': ' + input);
        }
    }

    man = (input) => {
        input = input.slice(4);
        if(input == 'nbsp;' || input.length <= 0) {
            this.print('try: man [page]');
            return;
        }
        this.inputDiv.style.display = 'none';
        const googleApiUrl = 'https://www.googleapis.com/customsearch/v1?'
        const googleApiKey = '';
        const googleCx = '';
        fetch(googleApiUrl + 'q=' + encodeURIComponent(input) + '&key=' + googleApiKey + '&cx=' + googleCx + '&num=1')
        .then(response => {
            if(!response.ok) throw new Error('not found')
            return response.json();
        })
        .then(data => {
            const url = data.items[0].formattedUrl;
            const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const fullUrl = corsProxyUrl + encodeURI(url);
            return fetch(fullUrl);
        })
        .then(response => {
            if(!response.ok) throw new Error('not found');
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            data = parser.parseFromString(data, 'text/html');
            const pres = data.querySelectorAll('pre');
            const h2s = data.querySelectorAll('h2');
            this.print('&nbsp;')
            this.print(pres[0].textContent);
            this.print('&nbsp;')
            for(let i = 0; i < pres.length-1; i++) {
                this.print(h2s[i].textContent);
                const line = pres[i+1].innerHTML.split('\n');
                for(let j = 0; j < line.length; j++) {
                    line[j] = parser.parseFromString(line[j], 'text/html');
                    this.print('&nbsp;&nbsp;&nbsp;&nbsp' + line[j].body.textContent);
                }
                this.print('&nbsp;')
                // if(i < )
            }
        })
        .catch(e => {
            this.print('no manual entry for ' + input);
            console.log(e);
        })
        .finally(() => {
            this.inputDiv.style.display = '';
            this.inputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.inputArea.dispatchEvent(new Event('focus'));
        })
    }

    pwd = () => {
        this.print(fs.pwd(this.currentDir));
    }

    ls = () => {
        const elements = fs.ls(this.currentDir);
        for(let i = 0; i < elements.length; i++) {
            this.print(elements[i]);
        }
    }

    cd = (input) => {
        const newDir = input.slice(3);
        try {
            this.currentDir = fs.cd(this.currentDir, newDir);
            this.updateRepeatedText();
        } catch (error) {
            this.print('cd: ' + error.message + ': ' + newDir);
        }
    }

    greet = () => {
        let username = this.user[0].toUpperCase() + this.user.slice(1);
        
        for(let i = 1; i < username.length; i++) {
            if(username[i] == '_') {
                username = username.slice(0, i) + ' ' + username.slice(i+1);
                if(i < username.length -1) {
                    username = username.slice(0, i+1) + username[i+1].toUpperCase() + username.slice(i+2);
                }
            }
        }
        this.print('Hello ' + username);
    }

    whoami = () => {
        this.print(this.user);
    }

    echo = (input) => {
        this.print(input.slice(4));
    } 

    lyrics = (input) => {
        if(!input[6] || input[6] != ' ') {
            this.print('try: lyrics [song]');
            return;
        }
        this.inputDiv.style.display = 'none';
        const song = input.slice(7);
        const apiURL = 'https://api.genius.com/';
        const apiKey = '';
        fetch(apiURL + 'search?per_page=1&access_token=' + apiKey + '&q=' + encodeURIComponent(song))
        .then((response) => {
            if(!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then((data) => {
            const url = data.response.hits[0].result.url;
            this.print('Lyrics to ' + data.response.hits[0].result.full_title);
            const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const fullUrl = corsProxyUrl + encodeURI(url);
            return fetch(fullUrl)
        })
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const ps = doc.querySelectorAll('div[data-lyrics-container="true"');
            for(let i = 0; i < ps.length; i++) {
                const line = ps[i].innerHTML.split('<br>');
                for(let j = 0; j < line.length; j++) {
                    this.print(parser.parseFromString(line[j], 'text/html').body.textContent);
                }
                this.print('&nbsp;')
            }
        })
        .catch(() => {
            this.print('No lyrics found for ' + song);
        })
        .finally(() => {
            this.inputDiv.style.display = '';
            this.inputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.inputArea.dispatchEvent(new Event('focus'));
        })
    }

    weather = (input) => {
        if(!input[7] || input[7] != ' ') {
            this.print('try: weather [city]');
            return;
        }
        this.inputDiv.style.display = 'none';
        const city = input.slice(8);
        fetch('https://api.weatherapi.com/v1/current.json?key=&q=' + city)
        .then((response) => {
            if(!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then((data) => {
            this.print('The weather in ' + data.location.name + ', ' + data.location.country + ', is ' + (data.current.condition.text.toLowerCase()) + ';');
            this.print('The temperature is ' + data.current.temp_c + '°C (' + data.current.temp_f + '°F);');
            let wind;
            if(data.current.wind_kph < 10) {
                wind = 'barely noticable';
            } else if(data.current.wind_kph < 30) {
                wind = 'moderately breezy';
            } else {
                wind = 'very strong';
            }
            this.print('The wind is ' + wind + ' (' + data.current.wind_kph + ' kph|' + data.current.wind_mph + ' mph).');
        })
        .catch((e) => {
            this.print('No weather data found for ' + city);
        })
        .finally(() => {
            this.inputDiv.style.display = '';
            this.inputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.inputArea.dispatchEvent(new Event('focus'));
        })
        
    }

    time = () => {
        let time = (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        this.print('It\'s ' + time);
    }
    
    date = () => {
        this.print('Today is ' + (now.getDate() < 10 ? '0' : '') + now.getDate() + '/' + (now.getMonth()+1 < 10 ? '0' : '') + (now.getMonth()+1) + '/' + now.getFullYear());
    }

    clear = () => {
        this.outputArea.innerHTML = '';
    }

    arrowUp = () => {
        if(this.lastInputsCounter == -1) {
            this.input = this.inputArea.innerHTML;
        }
        this.lastInputsCounter++;
        if(this.lastInputsCounter >= 9 || !this.lastInputs[this.lastInputsCounter]) {
            this.lastInputsCounter--;
        }
        else {
            this.inputArea.innerHTML = this.lastInputs[this.lastInputsCounter];
        }
        this.updateSelection();
    }
    arrowDown = () => {
        if(this.lastInputsCounter == -1) return;
        this.lastInputsCounter--;
        if(this.lastInputsCounter == -1) {
            this.lastInputsCounter = -1;
            this.inputArea.innerHTML = this.input;
        } else {
            this.inputArea.innerHTML = this.lastInputs[this.lastInputsCounter];
        }
        this.updateSelection();
    }

    tab = () => {
        this.autoCompleteDiv.innerHTML = '';
        let input = this.inputArea.innerHTML;
        let arr;
        let flag;
        let oldInput;
        if(input.split(' ').length > 1 || input.split('&nbsp;').length > 1) {
            flag = true;
            if(input.endsWith('&nbsp;')) {
                input = '';
            } else {
                let len = input.split(' ').length;
                input = input.split(' ')[len-1];
            }
            arr = fs.getPossibleDirectories(this.currentDir, input);
            let len = input.split('/').length;
            if(len > 1) {
                input = input.split('/')[len-1];
            }
        }
        else arr = Terminal.commands;
        const possibleCommands = arr.filter(string => string.startsWith(input));
        if(possibleCommands.length == 0) {
            return
        }
        if(possibleCommands.length == 1) {
            let newInput = '';
            if(flag) {
                let c = 0;
                let space = 0;
                for(let i = this.inputArea.innerHTML.length-1; i >= 0; i--) {
                    if(this.inputArea.innerHTML[i] == '/' && c == 0) {
                        c = i;
                    }
                    if(this.inputArea.innerHTML[i] == ' ') {
                        space = i;
                    }
                    if(space && c) break;
                }
                if(space > c) c = space;
                if(c == 0) {
                    newInput = oldInput + possibleCommands[0];
                } else {
                    newInput = this.inputArea.innerHTML.slice(0, c+1) + possibleCommands[0];
                }
            } else {
                newInput = possibleCommands[0] + '&nbsp;';
            }
            this.inputArea.innerHTML = newInput;
            this.inputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.updateSelection();
            return;
        }
        for(let i = 0; i < possibleCommands.length; i++) {
            this.autoCompleteDiv.innerHTML += possibleCommands[i] + ' ';
            this.autoCompleteDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    print = (output, boolean) => {
        const div = document.createElement('div');
        div.innerHTML = output;
        this.outputArea.appendChild(div);
        this.autoCompleteDiv.innerHTML = '';
        if(boolean) div.className = 'repeated-line';
        this.inputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    maximise = () => {
        // if(this.innerContainer.classList.contains('full-screen')) {
        //     this.innerContainer.classList.remove('full-screen');
        //     this.innerContainer.style.width = this.width;
        //     this.innerContainer.style.height = this.height;
        // } else {
        //     this.innerContainer.classList.add('full-screen');
        //     this.width = this.innerContainer.style.width;
        //     this.height = this.innerContainer.style.height;
        //     this.innerContainer.style = '';
        // }
    }
    
    updateRepeatedText = () => {
        this.text.innerHTML = '<div>' + ( this.currentDir.$ == '~' ? this.user : this.currentDir.$) + ' — -zsh </div>';
        this.repeatedText.innerHTML = this.user + '@' + this.computer + ' ' + this.currentDir.$ + ' %&nbsp';
    }

    updateSelection = () => {
        const selection = document.getSelection();
        const range = document.createRange();
        range.selectNodeContents(this.inputArea);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    closee = async () => {
        this.currentDir._--;
        Terminal.instances = Terminal.instances.filter(terminal => terminal != this);
        if(Terminal.bottomBarApp.update()) {
            setTimeout(() => {
                Terminal.bottomBarApp = null;
            }, 200);
        }
    }
}