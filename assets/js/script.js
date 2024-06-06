

var updateBottomIcon = (i) => {

    i.addEventListener('mouseover', () => {
        i.querySelector('.bottom-hover').style.display = 'block';
    });
    i.addEventListener('mouseleave', () => {
        i.querySelector('.bottom-hover').style.display = 'none';
    });
}

var bottomBar = document.querySelector('.bottom-bar');
var trashCan = document.querySelector('.trashcan');
var defaultTopBar = ['Finder', 'File', 'Modifica', 'Vista', 'Vai', 'Finestra', 'Aiuto'];
var now = new Date();
var timeDiv = document.querySelector('.date-and-time');
var timeDivInside = document.querySelector('.date-and-time-inside');
var user = 'gabriele_dellerba';

var fs;

var setupTopBar = (list) => {
    const topBar = document.querySelector('.top-bar');
    topBar.innerHTML = '<div style="font-size: 20px;"></div>';
    topBar.appendChild(timeDiv);
    for(let i = 0; i < list.length; i++) {
        const div = document.createElement('div');
        div.innerHTML = list[i];
        timeDiv.before(div);
    }
}

const getMonthName = () => {
    switch(now.getMonth()) {
        case 0:
            return 'gen'
        case 1:
            return 'feb'
        case 2:
            return 'mar'
        case 3:
            return 'apr'
        case 4:
            return 'mag'
        case 5:
            return 'giu'
        case 6:
            return 'lug'
        case 7:
            return 'ago'
        case 8:
            return 'set'
        case 9:
            return 'ott'
        case 10:
            return 'nov'
        case 11:
            return 'dic'
    }
}

const updateTime = (node) => {
    now = new Date();
    // console.log(node);
    node.innerHTML = now.getDate() + ' ' + getMonthName();
    node.innerHTML += ' ' + (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ':' + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
}

window.onload = () => {
    const bottomIcons = document.querySelectorAll('.bottom');
    for(let i = 0; i < bottomIcons.length; i++) {
        updateBottomIcon(bottomIcons.item(i));
    }
    Finder.pin(); // I PIN DEVONO PARTIRE DOPO DELLE CHIAMATE A UPDATEBOTTOMICON !!!!!!IMPORTANT!!!!!!
    const terminalCreator = new AppFactory(Terminal, 'Terminal', 'terminal');
    const finderCreator = new AppFactory(Finder, 'Finder', 'finder');
    const calculatorCreator = new AppFactory(Calculator);
    setupTopBar(['Finder', 'File', 'Modifica', 'Vista', 'Vai', 'Finestra', 'Aiuto']);
    updateTime(timeDivInside);
    setInterval(() => {
        updateTime(timeDivInside);
    }, 1000);

    fs = new FS('assets/json/fs.json');
}
