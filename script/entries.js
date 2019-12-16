window.addEventListener('load', () => {
    // Global Variables


    // Create Entry
    const moneyType = document.getElementById('moneyType');
    const objectType = document.getElementById('objectType');
    const currentType = document.getElementById('currentType');
    const createMoneyEntry = document.getElementById('createMoneyEntry');
    const createObjectEntry = document.getElementById('createObjectEntry');
    const choosePerson = document.getElementById('choosePerson');
    const createEntryMoney = document.getElementById('createEntryMoney');
    const createEntryObject = document.getElementById('createEntryObject');

    // execute when loaded
    sessionStorage.setItem('createdNewUser', false);

    // Library to switch types with swipe gestures
    const createMoneyHammer = new Hammer(createMoneyEntry);
    createMoneyHammer.on('swipeleft', () => {
        objectType.click();
    });

    const createObjectHammer = new Hammer(createObjectEntry);
    createObjectHammer.on('swiperight', () => {
        moneyType.click();
    });

    // switch types when clicked
    moneyType.addEventListener('click', () => {
        currentType.style.left = '20vw';
        createMoneyEntry.style.left = 0;
        createObjectEntry.style.left = '105vw';

        setTimeout(() => {
            clearCreateInputs();
        }, 310);
    });

    objectType.addEventListener('click', () => {
        currentType.style.left = '60vw';
        createObjectEntry.style.left = 0;
        createMoneyEntry.style.left = '-105vw';

        setTimeout(() => {
            clearCreateInputs();
        }, 310);
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            initDate('dateMoney');
            initDate('dateObject');
            createPersonSelection('createMoneyEntry', user);
            createPersonSelection('createObjectEntry', user);

            // request data from database and format array
            firebase.database().ref(`users/${user.uid}/entries`).once('value').then((snapshot) => {
                const person = [];
                let tempEntries;

                // convert given array to array with "normal" indizes
                for (const key in snapshot.val()) {
                    person.push(snapshot.val()[key]);
                }
                
                // create array which includes all entries
                for (let i = 0; i < person.length; i++) {
                    const entry = person[i];
                    tempEntries = [];

                    for (const key in entry) {
                        if (key !== 'name') {
                            tempEntries.push(entry[key]);
                        }
                    }
                    
                    person[i] = tempEntries;
                    person[i].name = entry.name;
                }
                
                printEntriesOverview(person);
            });
        }
    });

    createEntryMoney.addEventListener('click', () => {
        let isValid = true;
        const nameMoneyFDB = document.getElementById('nameMoneyFDB');
        const dateMoneyFDB = document.getElementById('dateMoneyFDB');
        const reasonMoneyFDB = document.getElementById('reasonMoneyFDB');
        const sumMoneyFDB = document.getElementById('sumMoneyFDB');
        const name = document.getElementById('choosePerson');
        const date = document.getElementById('dateMoney');
        const reason = document.getElementById('reasonMoney');
        const sum = document.getElementById('sumMoney');


        // validate name
        if (name.value === 'Person auswählen') {
            isValid = false;
            nameMoneyFDB.textContent = 'Bitte wählen Sie einen Namen aus.';
            name.classList.add('errorInput');
        } else {
            nameMoneyFDB.textContent = ''
            name.classList.remove('errorInput');
        }

        // validate date
        if (date.value === '') {
            isValid = false;
            dateMoneyFDB.textContent = 'Bitte geben Sie ein Datum ein.';
            date.classList.add('errorInput');
        } else {
            dateMoneyFDB.textContent = ''
            date.classList.remove('errorInput');
        }

        // validate reason
        if (reason.value === '' || reason.value === ' ') {
            isValid = false;
            reasonMoneyFDB.textContent = 'Bitte geben Sie eine Begründung ein.';
            reason.classList.add('errorInput');
        } else {
            reasonMoneyFDB.textContent = ''
            reason.classList.remove('errorInput');
        }
        
        // validate sum
        if (sum.value === '' || sum.value === ' ') {
            isValid = false;
            sumMoneyFDB.textContent = 'Bitte geben Sie einen Betrag ein.';
            sum.classList.add('errorInput');
        } else {
            sumMoneyFDB.textContent = ''
            sum.classList.remove('errorInput');
        }

        if (isValid) {
            const entryID = new Date().getTime();
            const wrappers = [
                document.getElementById('personWrapper'),
                document.getElementById('personObjectWrapper')
            ];

            // check if a new person is created
            // when a new person is created, the person has to be added to the person selection pop up
            if (sessionStorage.getItem('createdNewUser') === 'true') {
                for (const wrapper of wrappers) {
                    const person = document.createElement('p');
                    person.textContent = name.value;
    
                    person.addEventListener('click', () => {
                        wrapper.style.opacity = 0;
                        wrapper.style.transform = 'scale(0.4)';
                        if (wrapper.id.includes('Object')) document.getElementById('choosePersonObject').value = name.value;
                        else choosePerson.value = name.value;
    
                        setTimeout(() => {
                            wrapper.classList.add('hide');
                        }, 210);
                    });
                    
                    wrapper.appendChild(person);
                    wrapper.appendChild(document.createElement('hr'));
                }
            }

            // store new entry in database
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name.value}/${entryID}`).set({
                date: date.value,
                reason: reason.value,
                entryID: entryID,
                sum: sum.value *= 1,
                type: 'money',
                restored: false
            });

            // store name in database if not stored yet
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name.value}`).update({
                name: name.value
            });

            // create array with current entry, used to print to the entry overview
            let createdEntry = [[{date: date.value, reason: reason.value, entryID: entryID, sum: sum.value *= 1, type: 'money', restored: false}]];
            createdEntry[0].name = name.value;
            
            // check if person already exists
            const persons = document.querySelectorAll('#detailedEntriesWrapper > div');

            for (const person of persons) {
                console.log(person.id);
                console.log(name.value.name.replace(' ', ''));

                if (person.id === ('detailed' + name.value.name.replace(' ', ''))) {
                    console.log('equal');
                }
            }

            clearCreateInputs();
            document.getElementById('entriesFooter').click();
        }
    });

    createEntryObject.addEventListener('click', () => {
        let isValid = true;
        const nameObjectFDB = document.getElementById('nameObjectFDB');
        const dateObjectFDB = document.getElementById('dateObjectFDB');
        const reasonObjectFDB = document.getElementById('reasonObjectFDB');
        const worthObjectFDB = document.getElementById('worthObjectFDB');
        const objectFDB = document.getElementById('objectFDB');
        const name = document.getElementById('choosePersonObject');
        const date = document.getElementById('dateObject');
        const reason = document.getElementById('reasonObject');
        const object = document.getElementById('object');
        const worth = document.getElementById('wothObject');

        // validate name
        if (name.value === 'Person auswählen') {
            isValid = false;
            nameObjectFDB.textContent = 'Bitte wählen Sie einen Namen aus.';
            name.classList.add('errorInput');
        } else {
            nameObjectFDB.textContent = '';
            name.classList.remove('errorInput');
        }

        // validate date
        if (date.value === '') {
            isValid = false;
            dateObjectFDB.textContent = 'Bitte geben Sie ein Datum ein.';
            date.classList.add('errorInput');
        } else {
            dateObjectFDB.textContent = '';
            date.classList.remove('errorInput');
        }

        // validate reason
        if (reason.value === '' || reason.value === ' ') {
            isValid = false;
            reasonObjectFDB.textContent = 'Bitte geben Sie eine Begründung ein.';
            reason.classList.add('errorInput');
        } else {
            reasonObjectFDB.textContent = '';
            reason.classList.remove('errorInput');
        }
        
        // validate worth
        if (worth.value === '' || worth.value === ' ') {
            isValid = false;
            worthObjectFDB.textContent = 'Bitte geben Sie einen Betrag ein.';
            worth.classList.add('errorInput');
        } else {
            worthObjectFDB.textContent = '';
            worth.classList.remove('errorInput');
        }

        // validate object
        if (object.value === '' || object.value === ' ') {
            isValid = false;
            objectFDB.textContent = 'Bitte geben Sie einen Betrag ein.';
            object.classList.add('errorInput');
        } else {
            objectFDB.textContent = '';
            object.classList.remove('errorInput');
        }

        if (isValid) {
            const entryID = new Date().getTime();
            const wrappers = [
                document.getElementById('personWrapper'),
                document.getElementById('personObjectWrapper')
            ];

            if (sessionStorage.getItem('createdNewUser') === 'true') {
                for (const wrapper of wrappers) {
                    const person = document.createElement('p');
                    person.textContent = name.value;
    
                    person.addEventListener('click', () => {
                        wrapper.style.opacity = 0;
                        wrapper.style.transform = 'scale(0.4)';

                        if (!wrapper.id.includes('Object'))
                        document.getElementById('choosePerson').value = name.value;
    
                        setTimeout(() => {
                            wrapper.classList.add('hide');
                        }, 210);
                    });

                    wrapper.appendChild(person);
                    wrapper.appendChild(document.createElement('hr'));
                }
            }

            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name.value}/${entryID}`).set({
                date: date.value,
                reason: reason.value,
                entryID: entryID,
                sum: worth.value *= 1,
                object: object.value,
                type: 'object',
                restored: false
            });

            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name.value}`).update({
                name: name.value
            });

            let createdEntry = [[{date: date.value, reason: reason.value, entryID: entryID, sum: worth.value *= 1, object: object.value, type: 'object', restored: false}]];
            createdEntry[0].name = name.value;
            
            printEntriesOverview(createdEntry, true);
            document.getElementById('entriesFooter').click();
            clearCreateInputs();
        }
    });
});

function initDate(id) {
    const time = new Date();
    document.getElementById(id).value = `${time.getFullYear()}-${("0" + (time.getMonth() + 1)).slice(-2)}-${("0" + time.getDate()).slice(-2)}`;
}

function clearCreateInputs() {
    const inputs = [
        document.getElementById('reasonMoney'),
        document.getElementById('sumMoney'),
        document.getElementById('reasonObject'),
        document.getElementById('object')
    ];

    initDate('dateMoney');
    initDate('dateObject');

    for (const input of inputs) {
        input.value = '';
    }

    document.getElementById('wothObject').value = 0;
    document.getElementById('choosePerson').value = 'Person auswählen';
    document.getElementById('choosePersonObject').value = 'Person auswählen';
}

function createPersonSelection(wrapperID, user) {
    const contentWrapper = document.getElementById(wrapperID);

    firebase.database().ref(`users/${user.uid}/entries`).once('value').then((snapshot) => {
        const wrapper = document.createElement('div');
        const personWrapper = document.createElement('div');
        let choosePerson;
        if (wrapperID.includes('Money')) choosePerson = document.getElementById('choosePerson');
        else choosePerson = document.getElementById('choosePersonObject');

        if (snapshot.val() !== null) {
            for (const key in snapshot.val()) { 
                const person = document.createElement('p');
                person.textContent = key;

                person.addEventListener('click', () => {
                    wrapper.style.opacity = 0;
                    wrapper.style.transform = 'scale(0.4)';
                    choosePerson.value = key;
                    sessionStorage.setItem('createdNewUser', false);

                    setTimeout(() => {
                        wrapper.classList.add('hide');
                    }, 210);
                });

                personWrapper.appendChild(person);
                personWrapper.appendChild(document.createElement('hr'));
            }
        }

        choosePerson.addEventListener('click', () => {
            wrapper.classList.remove('hide');

            wrapper.style.top = ((window.innerHeight - wrapper.clientHeight) / 4) + 'px';

            // document.getElementsByClassName('hidePopUpBox')[0].classList.remove('hide');

            // setTimeout(() => {
                // document.getElementsByClassName('hidePopUpBox')[0].style.opacity = 1;
            // }, 5);

            setTimeout(() => {
                wrapper.style.opacity = 1;
                wrapper.style.transform = 'scale(1)';
            }, 10);
        });

        const person = document.createElement('input');
        person.placeholder = 'Person hinzufügen';
        if (wrapperID.includes('Money')) person.setAttribute('id', 'createPerson');
        else person.setAttribute('id', 'createObjectPerson');
        const feedback = document.createElement('p');
        feedback.classList.add('feedback')

        const saveBtn = document.createElement('div');
        saveBtn.textContent = 'Auswählen';
        saveBtn.classList.add('button')

        saveBtn.addEventListener('click', () => {
            let isValid = true;

            if (person.value === '' || person.value === ' ') {
                isValid = false;
                feedback.textContent = 'Bitte geben Sie einen Namen ein.';
                person.classList.add('errorInput');
            } else {
                feedback.textContent = ''
                person.classList.remove('errorInput');
            }

            if (isValid) {
                wrapper.style.opacity = 0;
                wrapper.style.transform = 'scale(0.4)';
                choosePerson.value = person.value;

                sessionStorage.setItem('createdNewUser', true);
                
                setTimeout(() => {
                    wrapper.classList.add('hide');
                    person.value = '';
                    feedback.textContent = ''
                    person.classList.remove('errorInput');
                }, 210);
            }
        });

        // create div box in background to disappear the popup
        const hidePopUpBox = document.createElement('div');
        hidePopUpBox.setAttribute('class', 'hidePopUpBox hide');

        hidePopUpBox.addEventListener('click', () => {
            hidePopUpBox.style.opacity = 0;

            setTimeout(() => {
                hidePopUpBox.classList.add('hide');
            }, 210);

            wrapper.style.opacity = 0;
            wrapper.style.transform = 'scale(0.4)';

            setTimeout(() => {
                wrapper.classList.add('hide');
            }, 210);
        });
        
        if (wrapperID.includes('Money')) personWrapper.setAttribute('id', 'personWrapper');
        else personWrapper.setAttribute('id', 'personObjectWrapper');
        wrapper.appendChild(personWrapper);
        wrapper.appendChild(person);
        wrapper.appendChild(feedback);
        wrapper.appendChild(saveBtn);
        wrapper.setAttribute('class', 'selectPersonPopUp hide');
        if (wrapperID.includes('Money')) wrapper.setAttribute('id', 'moneyPersonSelection');
        else wrapper.setAttribute('id', 'objectPersonSelection');
        contentWrapper.appendChild(wrapper);
        // document.body.appendChild(hidePopUpBox);
    });
}

function printEntriesOverview(person, addedLater) {
    const contentWrapper = document.getElementById('entryWrapper');

    if (!addedLater)
    while (contentWrapper.firstChild) contentWrapper.removeChild(contentWrapper.firstChild);
 
    // check if person array is not null
    if (person.length > 0) {
        printDetailedEntries(person, false);

        for (let i = 0; i < person.length; i++) {
            const entries = person[i];
            const newEntry = document.createElement('div');
            
            const name = document.createElement('p');
            const arrowAndMoneyWrapper = document.createElement('div');
    
            name.textContent = entries.name;
            const sum = document.createElement('p');
            const arrowRight = document.createElement('i');
            arrowRight.setAttribute('class', 'fas fa-chevron-right');
            
            // calculate total sum
            let totalSum = 0;

            for (const entry of entries) {
                totalSum += entry.sum;
            }        
    
            sum.textContent = `${totalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`;
            
            newEntry.addEventListener('click', () => {
                const detailedBox  = document.getElementById('detailed' + entries.name.replace(' ', ''));

                detailedBox.classList.remove('hide');

                setTimeout(() => {
                    contentWrapper.style.left = '-100vw';
                    document.getElementById('detailedEntriesWrapper').style.left = 0;
                }, 5);
            });

            arrowAndMoneyWrapper.appendChild(sum);
            arrowAndMoneyWrapper.appendChild(arrowRight);
            arrowAndMoneyWrapper.classList.add('arrowAndMoneyWrapper');
            newEntry.appendChild(name);
            newEntry.appendChild(arrowAndMoneyWrapper);
            newEntry.classList.add('entry');
            newEntry.setAttribute('id', 'overview' + entries.name.replace(' ', ''));
            contentWrapper.appendChild(newEntry);
        }
    } else {
        const text = document.createElement('p');
        text.textContent = 'Keine Einträge verfügbar.';
        text.classList.add('errorMessage');
        contentWrapper.appendChild(text);
    }
}

function printDetailedEntries(person, addedLater) {
    const contentWrapper = document.createElement('div');
    
    if (!addedLater)
    while (contentWrapper.firstChild) contentWrapper.removeChild(contentWrapper.firstChild);
 
    for (let i = 0; i < person.length; i++) {
        const entries = person[i];
        const personBox = document.createElement('div');
        
        for (const entry of entries) {
            const newEntry = document.createElement('div');

            const personEntries = [];

            personEntries.push({prefix: 'Grund:', content: entry.reason});

            let date = new Date(entry.date);
            date = `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;

            personEntries.push({prefix: 'Datum:', content: date});

            if (entry.type === 'object') {
                personEntries.push({prefix: 'Objekt:', content: entry.object});
                personEntries.push({prefix: 'Wert:', content: `${entry.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`});
            } else {
                personEntries.push({prefix: 'Betrag:', content: `${entry.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`});
            }

            for (const personEntry of personEntries) {
                const prefix = document.createElement('strong');
                const content = document.createElement('p');

                prefix.textContent = `${personEntry.prefix} `;
                content.appendChild(prefix);
                content.innerHTML += personEntry.content;

                newEntry.appendChild(content);
            }
            
            newEntry.classList.add('detailedEntry');
            personBox.appendChild(newEntry);
        }
        
        personBox.setAttribute('id', 'detailed' + entries.name.replace(' ', ''));
        personBox.classList.add('hide')
        contentWrapper.appendChild(personBox);
    }

    contentWrapper.setAttribute('id', 'detailedEntriesWrapper');
    document.getElementById('entriesWindow').appendChild(contentWrapper);
    
    const hammer = new Hammer(contentWrapper);

    hammer.on('swiperight', () => {
        const divs = document.querySelectorAll('#detailedEntriesWrapper > div');

        document.getElementById('entryWrapper').style.left = 0;
        contentWrapper.style.left = '100vw';

        setTimeout(() => {
            for (const div of divs) {
                div.classList.add('hide');
            }
        }, 310);
    });
}