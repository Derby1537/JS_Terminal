class Calculator extends App {
    static className = 'calculator';
    static text = 'Calcolatrice';
    static instances = [];
    static bottomBarApp;
    static formatter = new Intl.NumberFormat('en-US');
    output;
    first;
    second;
    currentOperator;
    oldOperator;
    buttons;
    secondFlag;
    equalFlag;

    OSTopBar = ['Calcolatrice', 'File', 'Modifica', 'Vista', 'Converti', 'Voce', 'Finestra', 'Aiuto'];
    constructor() {
        super();
        if(!Calculator.bottomBarApp) {
            Calculator.bottomBarApp = new BottomBarApp(Calculator);
        }

        this.imgIcon = Calculator.className;
        this.text.innerHTML = 'Calcolatrice'
        this.innerContainer.classList.add(Calculator.className + '-app');
        this.innerContainer.innerHTML = '\
        <div class="output"><div>0</div></div>\
            <div class="input">\
                <div class="row">\
                    <div class="button extra">AC</div>\
                    <div class="button extra">+/-</div>\
                    <div class="button extra">%</div>\
                    <div class="button operator">/</div>\
                </div>\
                <div class="row">\
                    <div class="button number">7</div>\
                    <div class="button number">8</div>\
                    <div class="button number">9</div>\
                    <div class="button operator">x</div>\
                </div>\
                <div class="row">\
                    <div class="button number">4</div>\
                    <div class="button number">5</div>\
                    <div class="button number">6</div>\
                    <div class="button operator">-</div>\
                </div>\
                <div class="row">\
                    <div class="button number">1</div>\
                    <div class="button number">2</div>\
                    <div class="button number">3</div>\
                    <div class="button operator">+</div>\
                </div>\
                <div class="row">\
                    <div class="button number" style="flex: 2; padding-right: 1px;">0</div>\
                    <div class="button number">.</div>\
                    <div class="button operator">=</div>\
                </div>\
            </div>\
        ';

        this.output = this.innerContainer.querySelector('.output > div');

        this.buttons = this.innerContainer.querySelectorAll('.button');
        for(let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].addEventListener('mousedown', () => {
                this.keyPress(this.buttons[i].innerHTML);
            });
        }

        this.outerContainer.addEventListener('keydown', this.keyboardKeyPress);

        this.maximiseButton.style.backgroundColor = 'rgb(84,84,81)';
        this.maximiseButton.classList.remove('maximise');
        this.maximiseButton.removeEventListener('click', this.maximise);

    }

    keyPress = (event) => {
        this.animateButton(event);
        switch(event) {
            case 'AC':
                break;
            case 'C':
                this.clear();
                break;
            case '+/-':
            case '%':
            case '.':
                this.extra(event);
                break;
            case '/':
            case 'x':
            case '-':
            case '+':
            case '=':
                this.operator(event);
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                this.number(event);
                break;
        }
    }

    keyboardKeyPress = (event) => {
        switch(event.keyCode) {
            case 13:
                this.keyPress('=');
                break;
            case 67:
                this.clear();
                break;
            case 8:
                this.del();
                break;
            case 53: //diviso
                if(event.key == '%') this.keyPress('%');
                else this.keyPress('5');
                break;
            case 191: //diviso
                this.keyPress('/');
                break;
            case 221: // per
                this.keyPress('x');
                break;
            case 187: // piu
                if(event.key == '+') this.keyPress('+');
                else this.keyPress('=');
                break;
            case 189: // meno
                this.keyPress('-');
                break;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 54:
            case 55:
            case 56:
            case 57:
                this.keyPress(String(event.keyCode-48));
                break;
            default:
                break;
        }
    }

    animateButton = (input) => {
        if(input == 'C' || input == 'AC') {
            this.buttons[0].classList.add('pressed');
            setTimeout(() => {
                this.buttons[0].classList.remove('pressed');
            }, 100);
            return;
        }
        for(let i = 0; i < this.buttons.length; i++) {
            if(this.buttons[i].innerHTML == input) {
                this.buttons[i].classList.add('pressed');
                setTimeout(() => {
                    this.buttons[i].classList.remove('pressed');
                }, 100);
            }
        }
    }

    del = () => {
        if(this.output.innerHTML == '0') return;
        if(this.output.innerHTML.length == 1) {
            this.output.innerHTML = '0';
            return;
        }
        this.output.innerHTML = this.output.innerHTML.slice(0, this.output.innerHTML.length-1);
        if(this.output.innerHTML.includes('.')) {
            this.updateFontSize();
            return;
        }
        this.output.innerHTML = ((Calculator.formatter.format(parseFloat(this.output.innerHTML.replaceAll(',', '')))));
        this.updateFontSize();
    }

    number = (input) => {
        if(this.output.innerHTML == 'Infinito') {
            this.clear();
        }
        if(this.secondFlag) {
            this.secondFlag = false;
            this.output.innerHTML = '';
        }
        if(!this.secondFlag && this.equalFlag) {
            this.clear();
        }
        this.buttons[0].innerHTML = 'C';
        if(this.output.innerHTML.length >= 15) return;
        if(this.output.innerHTML == '0') {
            this.output.innerHTML = input;
            return;
        }
        this.output.innerHTML += input;
        if(this.output.innerHTML.includes('.')) {
            this.updateFontSize();
            return;
        }
        this.output.innerHTML = ((Calculator.formatter.format(parseFloat(this.output.innerHTML.replaceAll(',', '')))));
        this.updateFontSize();
    }

    extra = (input) => {
        switch(input) {
            case '.':
                if(this.secondFlag) {
                    this.secondFlag = false;
                    this.output.innerHTML = '0';
                }
                if(!this.secondFlag && this.equalFlag) {
                    this.clear();
                }
                this.output.innerHTML += (this.output.innerHTML.includes('.') ? '' : '.');
                this.updateFontSize();
                break;
            case '+/-':
                this.output.innerHTML = Calculator.formatter.format(parseFloat(this.output.innerHTML.replace(',', '')) * -1);
                break;
            case '%':
                this.output.innerHTML = Calculator.formatter.format(parseFloat(this.output.innerHTML.replace(',', '')) / 100);
                break;
        }
    }

    operator = (input) => {
        if(this.currentOperator != '=') {
            this.oldOperator = this.currentOperator;
        }
        this.currentOperator = input;
        for(let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].classList.remove('selected');
            if(this.buttons[i].innerHTML == input && input != '=') {
                this.buttons[i].classList.add('selected');
            }
        }
        if(!this.first || this.equalFlag) {
            this.first = this.output.innerHTML;
            this.secondFlag = true;
            this.equalFlag = false;
        } 
        else {
            this.second = this.output.innerHTML;
            this.equal();
        }
    }

    equal = () => {
        let result = 0;
        switch (this.currentOperator) {
            case '+':
                result = parseFloat(this.first.replaceAll(',','')) + parseFloat(this.second.replaceAll(',',''));
                break;
            case '-':
                result = parseFloat(this.first.replaceAll(',','')) - parseFloat(this.second.replaceAll(',',''));
                break;
            case 'x':
                result = parseFloat(this.first.replaceAll(',','')) * parseFloat(this.second.replaceAll(',',''));
                break;
            case '/':
                result = parseFloat(this.first.replaceAll(',','')) / parseFloat(this.second.replaceAll(',',''));
                break;
            case '=':
                this.currentOperator = this.oldOperator;
                this.equal();
                return;
        }
        if(result == 'Infinity') {
            this.output.innerHTML = 'Infinito';
            this.updateFontSize();
            this.equalFlag = true;
            this.secondFlag = true;
            return;
        }
        this.first = String(result);
        this.secondFlag = true;
        this.equalFlag = true;
        this.output.innerHTML = result;
        this.output.innerHTML = ((Calculator.formatter.format(parseFloat(this.output.innerHTML.replaceAll(',', '')))));
        this.updateFontSize();
    }

    clear = () => {
        this.output.innerHTML = '0';
        this.output.style.fontSize = '50px';
        this.buttons[0].innerHTML = 'AC';
        this.currentOperator = null;
        this.oldOperator = null;
        this.first = null;
        this.second = null;
        this.equalFlag = false;
        this.secondFlag = false;
        for(let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].classList.remove('selected');
        }
    }

    updateFontSize = () => {
        let newSize = 50;
        this.output.style.fontSize = newSize + 'px';
        while(this.output.getBoundingClientRect().width > 230) {
            newSize--;
            this.output.style.fontSize = newSize + 'px';
        }
        this.output.style.fontSize = newSize + 'px';
    }

    pressButton = (input) => {
        input.classList.add('pressed');
        console.log(input);
    }
    
    releaseButton = (input) => {
        input.classList.remove('pressed');
        console.log(input);
    }

    

    closee = () => {
        Calculator.instances = Calculator.instances.filter(finder => finder != this);
        if(Calculator.bottomBarApp.update()) {
            setTimeout(() => {
                Calculator.bottomBarApp = null;
            }, 200);
        }
    }

}