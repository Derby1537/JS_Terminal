class FS {
    json;
    file;
    constructor(dir) {
        fetch(dir)
        .then(response => response.json())
        .then(data => {
            this.file = data;
            this.json = Object.values(data)[0];
            this.#resetUnserscores();
            this.#saveMainDirectory();
        })
        .catch(e => {
            console.log("Error while opening file system: " + e);
        })
    }

    getMainDirectory = () => {
        return this.json;
    }

    #saveMainDirectory = () => { //Utilizzare il php per salvare il file system, altrimenti i cambiamenti verranno persi alla ricarica della pagina
        Finder.updateAllInstances();
        fetch(window.location.href + 'assets/php/fs.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'newFile' : this.file
            })
        })
        .then(response => {
            response.text()
        })
        .then(data => {
            
        })
        .catch(e => {
            console.log(e);
        })
    }

    ls = (directory, flag = false) => {
        let elements = [];
        const keys = Object.keys(directory);
        for(let i = 0; i < keys.length; i++) {
            let slash = '';
            if(flag && directory[keys[i]].$) {
                slash = '/';
            }
            if(keys[i] != '$' && keys[i] != '_') elements.push(keys[i] + slash);
        }
        return elements;
    }

    cd = (oldDir, newDir) => {
        let returnDir = oldDir;
        const args = newDir.split('/');
        for(let i = 0; i < args.length; i++) {
            if(args[i] == '..') {
                if(returnDir.$ == '~') {
                    throw new Error('permission denied');
                }
                returnDir._--;
                returnDir = this.getParent(returnDir);
                continue;
            }
            if(args[i] == '.' || args[i] == 'nbsp;' || args[i] == '' || args[i] == ' ') {
                //resta nella stessa directory
                continue;
            }
            let flag = false;
            const keys = Object.keys(returnDir);
            for(let j = 0; j < keys.length; j++) {
                if(keys[j] == args[i]) {
                    flag = true;
                    if(returnDir[keys[j]].$) {
                        returnDir._--;
                        returnDir = returnDir[keys[j]];
                        break;
                    }
                    throw new Error('not a directory');
                }
            }

            
            if(!flag) throw new Error('no such file or directory');
            
        }
        ++returnDir._;
        return returnDir;
    }

    pwd = (directory) => {
        let str = '/' + directory.$;
        let node = directory;
        while(node = this.getParent(node)) {
            str = '/' + node.$ + str;
        }
        return str;
    }

    mkdir = async (directory, newDirName) => {
        const args = newDirName.split('/');
        let returnDir = directory;
        let flag = false;
        for(let i = 0; i < args.length; i++) {
            if(args[i] == '.' || args[i] == '..' || args[i] == 'nbsp;' || args[i] == '&nbsp;' || args[i] == '' || args[i] == ' ' || args[i] == '_' || args[i] == '$') {
                flag = true;
                break;
            }
            if(returnDir[args[i]]) {
                returnDir = returnDir[args[i]];
                continue;
            }
            returnDir[args[i]] = {'$': args[i], '_': 0};
            returnDir = returnDir[args[i]];
        }
        
        this.#saveMainDirectory();
        if(flag) {
            throw new Error('invalid directory name');
        }
    }

    rmdir = async (currentDir, directoryName) => {
        const path = this.pwd(currentDir).slice(3) + '/' + directoryName;
        const node = this.findNode(path);
        if(!node.$) {
            throw new Error('not a directory');
        }
        if(node._ > 0) {
            throw new Error('permission denied');
        }
        if(Object.keys(node).length > 2) {
            throw new Error('directory must be empty');
        }
        const parentNode = this.getParent(node);
        delete parentNode[node.$];
        
        this.#saveMainDirectory();
    }
    
    touch = (currentDir, input) => {
        if(input.endsWith('/')) input = input.slice(0, input.length-1);
        let oldPath = '';
        input = input.split('/');
        for(let i = 0; i < input.length-1; i++) {
            oldPath += '/' + input[i];
        }
        const fileName = input[input.length-1];
        const path = this.pwd(currentDir).slice(3) + '/' + oldPath;
        const node = this.findNode(path);
        if(!node.$) {
            throw new Error('invalid directory');
        }
        if(fileName == '$' || fileName == '_' || fileName.includes(' ') || fileName == '..' || fileName == '.') {
            throw new Error('invalid name');
        }
        if(!node[fileName]) {
            const obj = {
                '_': 0,
                'type': 'file',
                'content': '',
            }
            node[fileName] = obj;
        }
        
        this.#saveMainDirectory();
    }

    cat = (currentDir, input) => {
        if(input.endsWith('/')) input = input.slice(0, input.length-1);
        const path = this.pwd(currentDir).slice(3) + '/' + input;
        const node = this.findNode(path);
        if(node.$) {
            throw new Error('not a file');
        }
        return node.content;
    }

    cp = async (directory, args) => {
        if(args[0].endsWith('/')) args[0] = args[0].slice(0, args[0].length-1);
        const oldPath = this.pwd(directory).slice(3) + '/' + args[0];
        const oldNode = this.findNode(oldPath);
        if(oldNode._ > 0) {
            throw new Error('permission denied');
        }
        const len = args[0].split('/').length;
        args[0] = args[0].split('/')[len-1];
        
        const params = args[1].split('/');
        let newPathAdder = '';
        for(let i = 0; i < params.length-1; i++) {
            newPathAdder += params[i]; + '/';
        }
        args[1] = params[params.length-1];
        if(args[1] == '') args[1] = args[0];
        const newPath = this.pwd(directory).slice(3) + '/' + newPathAdder;
        const newNodeParent = this.findNode(newPath);
        
        if(this.isDescendant(newNodeParent, oldNode)) {
            throw new Error('permission denied');
        }
        
        
        if(args[1] == '.' || args[1] == '..' || args[1] == 'nbsp;' || args[1] == '&nbsp;' || args[1] == ' ' || args[1] == '_' || args[1] == '$') {
            throw new Error('invalid name');
        }
        newNodeParent[args[1]] = this.#clone(oldNode);
        if(newNodeParent[args[1]].$ && args[1] != '') newNodeParent[args[1]].$ = args[1];
        
        this.#saveMainDirectory();
    }

    mv = async (directory, args) => {
        if(args[0].endsWith('/')) args[0] = args[0].slice(0, args[0].length-1);
        const oldPath = this.pwd(directory).slice(3) + '/' + args[0];
        const oldNode = this.findNode(oldPath);
        const oldNodeParent = this.getParent(oldNode);
        if(oldNode._ > 0) {
            throw new Error('permission denied');
        }
        const len = args[0].split('/').length;
        args[0] = args[0].split('/')[len-1];

        const params = args[1].split('/');
        let newPathAdder = '';
        for(let i = 0; i < params.length-1; i++) {
            newPathAdder += params[i]; + '/';
        }
        args[1] = params[params.length-1];
        if(args[1] == '') args[1] = args[0];
        const newPath = this.pwd(directory).slice(3) + '/' + newPathAdder;
        const newNodeParent = this.findNode(newPath);

        if(this.isDescendant(newNodeParent, oldNode)) {
            throw new Error('permission denied');
        }


        if(args[1] == '.' || args[1] == '..' || args[1] == 'nbsp;' || args[1] == '&nbsp;' || args[1] == ' ' || args[1] == '_' || args[1] == '$') {
            throw new Error('invalid name');
        }
        newNodeParent[args[1]] = oldNode;
        if(newNodeParent[args[1]].$ && args[1] != '') newNodeParent[args[1]].$ = args[1];
        delete oldNodeParent[args[0]];
        
        this.#saveMainDirectory();
    }

    rm = async (currentDir, fileName) => {
        const path = this.pwd(currentDir).slice(3) + '/' + fileName;
        const node = this.findNode(path);
        const parent = this.getParent(node);
        if(node.$) {
            throw new Error('not a file');
        }
        if(node._ > 0) {
            throw new Error('permission denied');
        }
        const keys = Object.keys(parent);
        for(let i = 0; i < keys.length; i++) {
            if(parent[keys[i]] == node) {
                delete parent[keys[i]];
                break;
            }
        }
        
        this.#saveMainDirectory();
    }

    open = (currentDir, fileName) => {
        const path = this.pwd(currentDir).slice(3) + '/' + fileName;
        const node = this.findNode(path);
        if(node.$) {
            throw new Error('not a file');
        }
        return node;
        
    }

    save = (file, content) => {
        file.content = content;
        this.#saveMainDirectory();
    }

    getPossibleDirectories = (currentDir, text) => {
        const args = text.split('/');
        let returnDir = currentDir;
        for(let i = 0; i < args.length; i++) {
            if(i == args.length-1) {
                return this.ls(returnDir, true);
            }
            if(args[i] == '..') {
                if(returnDir.$ == '~') {
                    return [];
                }
                returnDir = this.getParent(returnDir);
                continue;
            }
            if(args[i] == '.' || args[i] == 'nbsp;' || args[i] == '' || args[i] == ' ') {
                //resta nella stessa directory
                continue;
            }
            let flag = false;
            const keys = Object.keys(returnDir);
            for(let j = 0; j < keys.length; j++) {
                if(keys[j] == args[i]) {
                    flag = true;
                    returnDir = returnDir[keys[j]];
                    break;
                }
            }
            if(!flag) return [];
        }
        return [];
    }

    getParent = (node, currentDir = this.json) => {
        let ret = null;
        const keys = Object.keys(currentDir);
        for(let i = 0; i < keys.length; i++) {
            if(node == currentDir[keys[i]]) return currentDir;
            if(currentDir[keys[i]].$) {
                ret = this.getParent(node, currentDir[keys[i]]);
            }
            if(ret != null) break;
        }
        return ret;
    }

    findNode = (path) => {
        const args = path.split('/');
        let dir = this.json;
        for(let i = 0; i < args.length; i++) {
            if(args[i] == '.' || args[i] == '') continue;
            if(args[i] == '..') {
                if(args[i].$ == '~') throw new Error('permission denied');
                dir = this.getParent(dir);
                continue;
            } 
            dir = dir[args[i]];
            if(!dir) {
                throw new Error('no such file or directory');
            }
        }
        return dir;
    }

    isDescendant = (node, ancestor) => {
        do {
            if(ancestor[node]) return true;
        } while(node = this.getParent(node))
        return false;
    }

    #resetUnserscores = (currentDir = this.json) => {
        if(currentDir._ > 0) {
            currentDir._ = 0;
        }
        const keys = Object.keys(currentDir);
        for(let i = 0; i < keys.length; i++) {
            if(currentDir[keys[i]]._) this.#resetUnserscores(currentDir[keys[i]]);
        }
    }

    #clone = (node) => {
        if(node === null || typeof(node) != 'object') {
            return node;
        }
        const clonedNode = {};
        const keys = Object.keys(node);
        for(let i = 0; i < keys.length; i++) {
            clonedNode[keys[i]] = this.#clone(node[keys[i]]);
        }
        return clonedNode;
    }

    #checkUnserscores = (currentDir) => {
        if(currentDir._ > 0) {
            return true;
        }
        const keys = Object.keys(currentDir);
        let ret = false;
        for(let i = 0; i < keys.length; i++) {
            if(currentDir[keys[i]]._) ret = ret | this.#resetUnserscores(currentDir[keys[i]]);
        }
        return ret;
    }
}