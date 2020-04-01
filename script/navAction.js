window.addEventListener('load', () => {
    const title = document.getElementById('title');
    const disableNav = document.getElementById('disableNav');
    const signOut = document.getElementById('signOut');
    const windows = [
        {navElement: document.getElementById('deletedFooter'), name: 'Gelöscht', window: document.getElementById('deletedEntriesWindow')},
        {navElement: document.getElementById('entriesFooter'), name: 'Einträge', window: document.getElementById('entriesWindow')},
        {navElement: document.getElementById('addEntryFooter'), name: 'Eintrag erstellen', window: document.getElementById('createEntryWindow')},
        {navElement: document.getElementById('deletedNav'), name: 'Gelöscht', window: document.getElementById('deletedEntriesWindow')},
        {navElement: document.getElementById('entriesNav'), name: 'Einträge', window: document.getElementById('entriesWindow')},
    ];

    
    for (const window of windows) {
        window.navElement.addEventListener('click', () => {
            hideAllWindows();
            window.window.classList.remove('hide');
            title.textContent = window.name;

            if (window.navElement.id.toLowerCase().includes('nav')) {
                disableNav.click();
            }
        });
    }

    function hideAllWindows() {
        for (const window of windows) {
            window.window.classList.add('hide');
        }

        // reset entry overview window
        const divs = document.querySelectorAll('#detailedEntriesWrapper > div');

        document.getElementById('entryWrapper').style.left = 0;
        document.getElementById('detailedEntriesWrapper').style.left = '100vw';

        setTimeout(() => {
            for (const div of divs) {
                div.classList.add('hide');
            }

            if (!document.getElementById('entriesWindow').className.includes('hide')) changeHeadline('Einträge');            
        }, 310);
    }

    signOut.addEventListener('click', () => {
        document.getElementById('disableNav').click();
        
        setTimeout(() => {
            firebase.auth().signOut();
        }, 600);
    });
});