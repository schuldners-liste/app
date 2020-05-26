window.addEventListener('load', () => {
    const moneyType = document.getElementById('moneyType');
    const objectType = document.getElementById('objectType');
    const currentType = document.getElementById('currentType');
    const createMoneyEntry = document.getElementById('createMoneyEntry');
    const createObjectEntry = document.getElementById('createObjectEntry');
    const createEntryMoney = document.getElementById('createEntryMoney');
    const createEntryObject = document.getElementById('createEntryObject');

    // execute when loaded
    sessionStorage.setItem('createdNewUser', false);
    sessionStorage.setItem('deleteUser', false);
    initDisablePersonSelection();
    activateLoading(.3);

    if (JSON.parse(localStorage.getItem('theme')) !== null) {
        document.getElementById('footer').style.background = JSON.parse(localStorage.getItem('theme')).hex;
        document.getElementById('footer').style.color = JSON.parse(localStorage.getItem('theme')).color;
    }

    // Library to switch types with swipe gestures
    const createMoneyHammer = new Hammer(createMoneyEntry);
    createMoneyHammer.on('swipeleft', () => {
        if (sessionStorage.getItem('isNavTriggered') === 'false') {
            objectType.click();
        }
    });

    const createObjectHammer = new Hammer(createObjectEntry);
    createObjectHammer.on('swiperight', () => {
        if (sessionStorage.getItem('isNavTriggered') === 'false') {
            moneyType.click();
        }
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
            initEyes();
            initDate('dateMoney');
            initDate('dateObject');
            createPersonSelection('createMoneyEntry', user);
            createPersonSelection('createObjectEntry', user);
            document.getElementById('entriesFooter').click();
            sessionStorage.setItem('deleteUser', false);

            if (user.providerData[0].providerId === 'google.com') {
                for (const box of document.getElementsByClassName('hideable')) {
                    box.classList.add('hide');
                }
            } else {
                for (const box of document.getElementsByClassName('hideable')) {
                    box.classList.remove('hide');
                }
            }

            firebase.database().ref('public/themes').once('value').then(snapshot => {
                firebase.database().ref(`users/${user.uid}/customThemes`).once('value').then(snapshot2 => {
                    const themes = snapshot.val();

                    if (snapshot2.val() !== null) {

                        for (const key in snapshot2.val()) {
                            themes.push(snapshot2.val()[key]);
                        }
                    }

                    printThemes(themes, true);

                    const theme = JSON.parse(localStorage.getItem('theme'));

                    if (theme !== null) {
                        useTheme(theme.hex, theme.hex2, theme.color, true);
                    }

                    firebase.database().ref(`users/${user.uid}/theme`).once('value').then(snapshot => {
                        useTheme(snapshot.val().hex, snapshot.val().hex2, snapshot.val().color, false);
                    });
                });  
            });

            // request entries from database and format array
            firebase.database().ref(`users/${user.uid}/entries`).once('value').then((snapshot) => {
                const data = snapshot.val();
                const person = [];
                let tempEntries;

                // convert given array to array with 'normal' indizes
                for (const key in data) {
                    const temp = data[key];
                    temp.name = data[key].name;
                    person.push(temp);
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

                printEntriesOverview(person, false);
                deactiveLoading();
            });

            // request deleted entries from database and format array
            firebase.database().ref(`users/${user.uid}/deletedEntries`).once('value').then((snapshot) => {
                const data = snapshot.val();
                const person = [];
                let tempEntries;

                // convert given array to array with 'normal' indizes
                for (const key in data) {
                    const temp = data[key];
                    temp.name = data[key].name;
                    person.push(temp);
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

                printDeletedEntriesOverview(person, false);
            });

            firebase.database().ref(`users/${user.uid}/userdata/username`).once('value').then(snapshot => {
                document.getElementById('usernameField').textContent = snapshot.val();
            });
        } else {
            deactiveLoading();

            const wrappers = [
                document.getElementById('selectThemes'),
                document.getElementById('createTheme'),
                document.getElementById('createMoneyEntry'),
                document.getElementById('createObjectEntry'),
            ];

            for (const wrapper of wrappers) {
                while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
            }
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
        if (reason.value.trim() === '') {
            isValid = false;
            reasonMoneyFDB.textContent = 'Bitte geben Sie eine Begründung ein.';
            reason.classList.add('errorInput');
        } else {
            reasonMoneyFDB.textContent = ''
            reason.classList.remove('errorInput');
        }

        // validate sum
        if (sum.value.trim() === '') {
            isValid = false;
            sumMoneyFDB.textContent = 'Bitte geben Sie einen Betrag ein.';
            sum.classList.add('errorInput');
        } else {
            sumMoneyFDB.textContent = ''
            sum.classList.remove('errorInput');
        }

        if (isValid) {
            const entryID = Date.now();
            const wrappers = [
                document.getElementById('personWrapper'),
                document.getElementById('personObjectWrapper')
            ];

            if (parseFloat(sum.value) < 0) {
                sum.value = parseFloat(sum.value) * (-1);
            }

            if (sum.value.toString().includes('.')) {
                sum.value = sum.value.split('.')[0] + '.' + sum.value.split('.')[1].substring(0, 2);
            }

            // check if a new person is created
            // when a new person is created, the person has to be added to the person selection pop up
            if (sessionStorage.getItem('createdNewUser') === 'true') {
                for (const wrapper of wrappers) {
                    const person = document.createElement('p');
                    person.textContent = name.value;

                    person.addEventListener('click', () => {
                        wrapper.parentElement.style.opacity = 0;
                        wrapper.parentElement.style.transform = 'scale(0.4)';
                        if (wrapper.id.includes('Object')) document.getElementById('choosePersonObject').value = person.textContent;
                        else choosePerson.value = person.textContent;

                        document.getElementById('disableObjectPersonSelection').classList.add('hide');
                        document.getElementById('disableMoneyPersonSelection').classList.add('hide');

                        setTimeout(() => {
                            wrapper.parentElement.classList.add('hide');
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

            // check if person already exists
            const persons = document.querySelectorAll('#detailedEntriesWrapper > div');
            let personFound = false;

            for (const person of persons) {
                if (person.id === ('detailed' + name.value.replace(' ', ''))) {
                    personFound = true;
                }
            }

            let createdEntry;

            if (!personFound) {
                // format array with current entry to make sure, that the called method can use the data
                createdEntry = [[{date: date.value, reason: reason.value, entryID: entryID, sum: sum.value *= 1, type: 'money', restored: false}]];
                createdEntry[0].name = name.value;

                printEntriesOverview(createdEntry, true);
            } else {
                // format array with current entry to make sure, that the called method can use the data
                createdEntry = {date: date.value, reason: reason.value, entryID: entryID, sum: sum.value *= 1, type: 'money', restored: false};
                createdEntry.name = name.value;
                document.getElementById('detailed' + name.value.replace(' ', '')).appendChild(createDetailedEntry(createdEntry, name.value));
            }

            calculatePersonSum(name.value.replace(' ', ''));
            clearCreateInputs();
            changeTheme();
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
        if (reason.value.trim() === '') {
            isValid = false;
            reasonObjectFDB.textContent = 'Bitte geben Sie eine Begründung ein.';
            reason.classList.add('errorInput');
        } else {
            reasonObjectFDB.textContent = '';
            reason.classList.remove('errorInput');
        }

        // validate worth
        if (worth.value.trim() === '') {
            isValid = false;
            worthObjectFDB.textContent = 'Bitte geben Sie einen Betrag ein.';
            worth.classList.add('errorInput');
        } else {
            worthObjectFDB.textContent = '';
            worth.classList.remove('errorInput');
        }

        // validate object
        if (object.value.trim() === '') {
            isValid = false;
            objectFDB.textContent = 'Bitte geben Sie einen Betrag ein.';
            object.classList.add('errorInput');
        } else {
            objectFDB.textContent = '';
            object.classList.remove('errorInput');
        }

        if (isValid) {
            const entryID = Date.now();
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
                        wrapper.parentElement.style.opacity = 0;
                        wrapper.parentElement.style.transform = 'scale(0.4)';
                        if (wrapper.id.includes('Object')) document.getElementById('choosePersonObject').value = person.textContent;
                        else choosePerson.value = person.textContent;

                        document.getElementById('disableObjectPersonSelection').classList.add('hide');
                        document.getElementById('disableMoneyPersonSelection').classList.add('hide');

                        setTimeout(() => {
                            wrapper.parentElement.classList.add('hide');
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
                sum: worth.value *= 1,
                object: object.value,
                type: 'object',
                restored: false
            });

            // store name in database if not stored yet
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name.value}`).update({
                name: name.value
            });

            // check if person already exists
            const persons = document.querySelectorAll('#detailedEntriesWrapper > div');
            let personFound = false;

            for (const person of persons) {
                if (person.id === ('detailed' + name.value.replace(' ', ''))) {
                    personFound = true;
                }
            }

            let createdEntry;

            if (!personFound) {
                // format array with current entry to make sure, that the called method can use the data
                createdEntry = [[{date: date.value, reason: reason.value, entryID: entryID, sum: worth.value *= 1, object: object.value, type: 'object', restored: false}]];
                createdEntry[0].name = name.value;

                printEntriesOverview(createdEntry, true);
            } else {
                // format array with current entry to make sure, that the called method can use the data
                createdEntry = {date: date.value, reason: reason.value, entryID: entryID, sum: worth.value *= 1, object: object.value, type: 'object', restored: false};
                createdEntry.name = name.value;
                document.getElementById('detailed' + name.value.replace(' ', '')).appendChild(createDetailedEntry(createdEntry, name.value));
            }

            calculatePersonSum(name.value.replace(' ', ''));
            clearCreateInputs();
            changeTheme();
            document.getElementById('entriesFooter').click();
        }
    });

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
                    person.setAttribute('id', `person${key.replace(' ', '')}`);

                    person.addEventListener('click', () => {
                        wrapper.style.opacity = 0;
                        wrapper.style.transform = 'scale(0.4)';
                        choosePerson.value = key;
                        sessionStorage.setItem('createdNewUser', false);

                        document.getElementById('disableObjectPersonSelection').classList.add('hide');
                        document.getElementById('disableMoneyPersonSelection').classList.add('hide');

                        setTimeout(() => {
                            wrapper.classList.add('hide');
                        }, 210);
                    });

                    const hr = document.createElement('hr');
                    hr.setAttribute('id', `hr${key.replace(' ', '')}`);

                    personWrapper.appendChild(person);
                    personWrapper.appendChild(hr);
                }
            }

            choosePerson.addEventListener('click', () => {
                wrapper.classList.remove('hide');
                wrapper.style.top = ((window.innerHeight - wrapper.clientHeight) / 4) + 'px';

                if (wrapperID.includes('Money')) document.getElementById('disableMoneyPersonSelection').classList.remove('hide');
                else document.getElementById('disableObjectPersonSelection').classList.remove('hide');

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

                if (person.value.trim() === '') {
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
                    choosePerson.value = person.value.trim();

                    let personExists = true;

                    for (const p of document.querySelectorAll('#personWrapper p, #personObjectWrapper p')) {
                        if (p.textContent === person.value.trim()) {
                            personExists = false;
                        }
                    }                    

                    sessionStorage.setItem('createdNewUser', personExists);

                    if (wrapperID.includes('Money')) document.getElementById('disableMoneyPersonSelection').classList.add('hide');
                    else document.getElementById('disableObjectPersonSelection').classList.add('hide');

                    setTimeout(() => {
                        wrapper.classList.add('hide');
                        person.value = '';
                        feedback.textContent = ''
                        person.classList.remove('errorInput');
                    }, 210);
                }
            });

            if (wrapperID.includes('Money')) {
                personWrapper.setAttribute('id', 'personWrapper');
                wrapper.setAttribute('id', 'moneyPersonSelection');
            } else {
                personWrapper.setAttribute('id', 'personObjectWrapper');
                wrapper.setAttribute('id', 'objectPersonSelection');
            }

            wrapper.setAttribute('class', 'selectPersonPopUp hide');

            wrapper.appendChild(personWrapper);
            wrapper.appendChild(person);
            wrapper.appendChild(feedback);
            wrapper.appendChild(saveBtn);
            contentWrapper.appendChild(wrapper);
        });
    }

    function printEntriesOverview(person, addedLater) {
        const contentWrapper = document.getElementById('entryWrapper');

        if (!addedLater)
        while (contentWrapper.firstChild) contentWrapper.removeChild(contentWrapper.firstChild);

        if (document.getElementById('entriesErrorMessage') !== null) {
            contentWrapper.removeChild(document.getElementById('entriesErrorMessage'));
        }

        // check if person array is not null
        if (person.length > 0) {
            printDetailedEntries(person);

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

                // format total sum
                sum.textContent = `${totalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`;
                sum.textContent = sum.textContent.replace('.', ',');

                newEntry.addEventListener('click', () => {
                    const detailedBox = document.getElementById('detailed' + entries.name.replace(' ', ''));

                    detailedBox.classList.remove('hide');

                    setTimeout(() => {
                        contentWrapper.style.left = '-100vw';
                        document.getElementById('detailedEntriesWrapper').style.left = 0;
                        document.getElementById('editEntryWrapper').style.left = '100vw';
                    }, 5);

                    changeHeadline(entries.name);
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

            changeTheme();
        } else {
            const text = document.createElement('p');
            text.textContent = 'Keine Einträge verfügbar.';
            text.setAttribute('id', 'entriesErrorMessage');
            contentWrapper.appendChild(text);
        }
    }

    function printDetailedEntries(persons) {
        for (const entries of persons) {
            let personBox

            if (document.getElementById('detailed' + entries.name.replace(' ', '')) === null) {
                personBox = document.createElement('div');
                personBox.setAttribute('id', 'detailed' + entries.name.replace(' ', ''));
                personBox.classList.add('hide');
            } else {
                personBox = document.getElementById('detailed' + entries.name.replace(' ', ''));
            }

            for (const entry of entries) {
                personBox.appendChild(createDetailedEntry(entry, entries.name));
            }

            if (document.getElementById('detailedEntriesWrapper') === null) {
                const contentWrapper = document.createElement('div');
                contentWrapper.appendChild(personBox);
                contentWrapper.setAttribute('id', 'detailedEntriesWrapper');
                document.getElementById('entriesWindow').appendChild(contentWrapper);
            } else {
                document.getElementById('detailedEntriesWrapper').appendChild(personBox);
            }

            const hammer = new Hammer(document.getElementById('detailedEntriesWrapper'));

            hammer.on('swiperight', () => {
                if (sessionStorage.getItem('isNavTriggered') === 'false') {
                    const divs = document.querySelectorAll('#detailedEntriesWrapper > div');

                    document.getElementById('entryWrapper').style.left = 0;
                    document.getElementById('detailedEntriesWrapper').style.left = '100vw';
                    document.getElementById('editEntryWrapper').style.left = '200vw';

                    changeHeadline('Einträge');

                    setTimeout(() => {
                        for (const div of divs) {
                            div.classList.add('hide');
                        }
                    }, 310);
                }
            });

            const hammer2 = new Hammer(document.getElementById('editEntryWrapper'));

            hammer2.on('swiperight', () => {
                if (sessionStorage.getItem('isNavTriggered') === 'false') {
                    document.getElementById('editCancelBtn').click();
                }
            });
        }

        changeTheme();
    }

    function printDeletedEntriesOverview(person, addedLater) {
        const contentWrapper = document.getElementById('deletedEntryWrapper');

        if (!addedLater)
        while (contentWrapper.firstChild) contentWrapper.removeChild(contentWrapper.firstChild);

        if (document.getElementById('deletedEntriesErrorMessage') !== null) {
            contentWrapper.removeChild(document.getElementById('deletedEntriesErrorMessage'));
        }

        // check if person array is not null
        if (person.length > 0) {
            printDeletedDetailedEntries(person);

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

                // format total sum
                sum.textContent = `${totalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`;
                sum.textContent = sum.textContent.replace('.', ',');

                newEntry.addEventListener('click', () => {
                    const detailedBox  = document.getElementById('deletedDetailed' + entries.name.replace(' ', ''));

                    detailedBox.classList.remove('hide');

                    setTimeout(() => {
                        contentWrapper.style.left = '-100vw';
                        document.getElementById('deletedDetailedEntriesWrapper').style.left = 0;
                    }, 5);

                    changeHeadline(entries.name);
                });

                arrowAndMoneyWrapper.appendChild(sum);
                arrowAndMoneyWrapper.appendChild(arrowRight);
                arrowAndMoneyWrapper.classList.add('arrowAndMoneyWrapper');
                newEntry.appendChild(name);
                newEntry.appendChild(arrowAndMoneyWrapper);
                newEntry.classList.add('entry');
                newEntry.setAttribute('id', 'deletedOverview' + entries.name.replace(' ', ''));
                contentWrapper.appendChild(newEntry);
            }

            changeTheme();
        } else {
            const text = document.createElement('p');
            text.textContent = 'Keine Einträge verfügbar.';
            text.setAttribute('id', 'deletedEntriesErrorMessage');
            contentWrapper.appendChild(text);
        }
    }

    function printDeletedDetailedEntries(person) {
        for (const entries of person) {
            const personBox = document.createElement('div');

            for (const entry of entries) {
                personBox.appendChild(createDeletedDetailedEntry(entry, entries.name));
            }

            personBox.setAttribute('id', 'deletedDetailed' + entries.name.replace(' ', ''));
            personBox.classList.add('hide');

            if (document.getElementById('deletedDetailedEntriesWrapper') === null) {
                const contentWrapper = document.createElement('div');
                contentWrapper.appendChild(personBox);
                contentWrapper.setAttribute('id', 'deletedDetailedEntriesWrapper');
                document.getElementById('entriesWindow').appendChild(contentWrapper);
            } else {
                document.getElementById('deletedDetailedEntriesWrapper').appendChild(personBox);
            }

            const hammer = new Hammer(document.getElementById('deletedDetailedEntriesWrapper'));

            hammer.on('swiperight', () => {
                if (sessionStorage.getItem('isNavTriggered') === 'false') {
                    const divs = document.querySelectorAll('#deletedDetailedEntriesWrapper > div');

                    document.getElementById('deletedEntryWrapper').style.left = 0;
                    document.getElementById('deletedDetailedEntriesWrapper').style.left = '100vw';

                    changeHeadline('Gelöscht');

                    setTimeout(() => {
                        for (const div of divs) {
                            div.classList.add('hide');
                        }
                    }, 310);
                }
            });
        }

        changeTheme();
    }

    function createDetailedEntry(entry, name) {
        const newEntry = document.createElement('div');
        const dataWrapper = document.createElement('div');
        const iconWrapper = document.createElement('div');
        let personEntries = [];

        name = name || sessionStorage.getItem('name') || '';
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

        personEntries[personEntries.length - 1].content = personEntries[personEntries.length - 1].content.replace('.', ',');

        if (entry.restored && entry.edited) {
            personEntries.push({prefix: '', content: '(wiederhergestellt & bearbeitet)'});
        } else if (entry.edited) {
            personEntries.push({prefix: '', content: '(bearbeitet)'});
        } else if (entry.restored) {
            personEntries.push({prefix: '', content: '(wiederhergestellt)'});
        } else {
            personEntries.push({prefix: '', content: ''});
        }

        for (const personEntry of personEntries) {
            const prefix = document.createElement('strong');
            const content = document.createElement('p');

            prefix.textContent = `${personEntry.prefix} `;
            content.appendChild(prefix);
            content.innerHTML += personEntry.content;

            dataWrapper.appendChild(content);
        }

        const editEntryIcon = document.createElement('i');
        editEntryIcon.setAttribute('class', 'fas fa-edit');

        const deleteEntryIcon = document.createElement('i');
        deleteEntryIcon.setAttribute('class', 'fas fa-times');

        deleteEntryIcon.addEventListener('click', () => {
            const dataToDelete = {
                date: entry.date,
                deletedDate: Date.now(),
                entryID: entry.entryID,
                reason: entry.reason,
                restored: entry.restored,
                sum: entry.sum,
                type: entry.type,
                edited: entry.edited || false
            };

            if (entry.type === 'object') {
                dataToDelete.object = entry.object;
            }

            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/deletedEntries/${name}/${entry.entryID}`).set(dataToDelete).then(() => {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name}/${entry.entryID}`).remove();
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/deletedEntries/${name}`).update({
                    name: name
                });

                let parent = newEntry.parentElement;

                if (parent.children.length - 1 === 0) {
                    const entryWrapper = document.getElementById('entryWrapper');
                    const overview = document.getElementById(`overview${name.replace(' ', '')}`);

                    entryWrapper.removeChild(overview);

                    if (entryWrapper.children.length === 0) {
                        const text = document.createElement('p');
                        text.textContent = 'Keine Einträge verfügbar.';
                        text.setAttribute('id', 'entriesErrorMessage');
                        entryWrapper.appendChild(text);
                    }

                    firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name}`).remove();
                    const divs = document.querySelectorAll('#detailedEntriesWrapper > div');
                    const personSelectionElmsToDel = document.querySelectorAll(`#person${name.replace(' ', '')}, #hr${name.replace(' ', '')}`);

                    entryWrapper.style.left = 0;
                    document.getElementById('detailedEntriesWrapper').style.left = '100vw';

                    changeHeadline('Einträge');

                    setTimeout(() => {
                        for (const div of divs) {
                            div.classList.add('hide');
                        }

                        for (const elm of personSelectionElmsToDel) {
                           elm.parentElement.removeChild(elm);
                        }

                        parent.removeChild(newEntry);
                        calculatePersonSum(name.replace(' ', ''));
                    }, 310);
                } else {
                    parent.removeChild(newEntry);
                    calculatePersonSum(name.replace(' ', ''));
                }

                const deletedOverview = document.getElementById(`deletedOverview${name.replace(' ', '')}`);
                const deletedDetailed = document.getElementById(`deletedDetailed${name.replace(' ', '')}`);

                if (deletedOverview) {
                    deletedDetailed.appendChild(createDeletedDetailedEntry(dataToDelete, name));
                } else {
                    const data = [[]];
                    data[0][0] = dataToDelete;
                    data[0].name = name;


                    printDeletedEntriesOverview(data, true);
                }

                calculatePersonSum(name.replace(' ', ''));
                changeTheme();
            }).catch(console.error);
        });

        editEntryIcon.addEventListener('click', () => {
            const editEntryWrapper = document.getElementById('editEntryWrapper');

            for (const child of editEntryWrapper.children) {
                if (child.dataset['entryType'].includes(entry.type)) {
                    child.classList.remove('hide');
                } else {
                    child.classList.add('hide');
                }
            }

            // init values
            editName.value = name;
            editDate.value = entry.date;
            editReason.value = entry.reason;
            editObject.value = entry.object;
            editSum.value = entry.sum;
            editWorth.value = entry.sum;

            document.getElementById('entryWrapper').style.left = '-200vw';
            document.getElementById('detailedEntriesWrapper').style.left = '-100vw';
            editEntryWrapper.style.left = 0;

            changeHeadline(`${name} bearbeiten`);

            const editSaveBtn = document.getElementById('editSaveBtn');
            const editCancelBtn = document.getElementById('editCancelBtn');

            editSaveBtn.addEventListener('click', () => {
                activateLoading(.3);
                let now = Date.now();
                let isValid = true;

                const elements = [
                    {value: editDate.value, errorMessage: 'Bitte geben Sie ein Datum ein.', errorID: 'editDateFDB'},
                    {value: editReason.value, errorMessage: 'Bitte geben Sie eine Begründung ein.', errorID: 'editReasonFDB'},
                    {value: editObject.value, errorMessage: 'Bitte geben Sie ein Objekt ein.', errorID: 'editObjectFDB'},
                    {value: editSum.value, errorMessage: 'Bitte geben Sie einen Betrag ein.', errorID: 'editSumFDB'},
                    {value: editWorth.value, errorMessage: 'Bitte geben Sie einen Wert ein.', errorID: 'editWorthFDB'},
                ];

                for (const elmt of elements) {
                    if (elmt.value.trim() === '') {
                        document.getElementById(elmt.errorID.replace('FDB', '')).classList.add('errorInput');
                        document.getElementById(elmt.errorID).textContent = elmt.errorMessage;
                        isValid = false;
                    } else {
                        document.getElementById(elmt.errorID.replace('FDB', '')).classList.remove('errorInput');
                        document.getElementById(elmt.errorID).textContent = '';
                    }
                }

                if (isValid) {
                    const data = {
                        date: editDate.value,
                        reason: editReason.value,
                        object: editObject.value || null,
                        sum: parseFloat(editSum.value),
                        edited: true
                    };

                    entry.type === 'object' ? data.sum = parseFloat(editWorth.value) : '';

                    firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name}/${entry.entryID}`).update(data).then(() => {
                        while (dataWrapper.firstChild) dataWrapper.removeChild(dataWrapper.firstChild);

                        personEntries = [];
                        personEntries.push({prefix: 'Grund:', content: data.reason});

                        let date = new Date(data.date);
                        date = `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;

                        personEntries.push({prefix: 'Datum:', content: date});

                        if (entry.type === 'object') {
                            personEntries.push({prefix: 'Objekt:', content: data.object});
                            personEntries.push({prefix: 'Wert:', content: `${data.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`});
                        } else {
                            personEntries.push({prefix: 'Betrag:', content: `${data.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`});
                        }

                        personEntries[personEntries.length - 1].content = personEntries[personEntries.length - 1].content.replace('.', ',');

                        if (entry.restored) {
                            personEntries.push({prefix: '', content: '(wiederhergestellt & bearbeitet)'});
                        } else {
                            personEntries.push({prefix: '', content: '(bearbeitet)'});
                        }

                        for (const personEntry of personEntries) {
                            const prefix = document.createElement('strong');
                            const content = document.createElement('p');

                            prefix.textContent = `${personEntry.prefix} `;
                            content.appendChild(prefix);
                            content.innerHTML += personEntry.content;

                            dataWrapper.appendChild(content);
                        }

                        entry.date = data.date;
                        entry.reason = data.reason;
                        entry.object = data.object;
                        entry.sum = data.sum;
                        entry.edited = true;

                        let duration = 5;

                        if (now - Date.now() <= 250) {
                            duration = 150;
                        }

                        calculatePersonSum(name);

                        setTimeout(() => {
                            deactiveLoading();

                            document.getElementById('entryWrapper').style.left = '-100vw';
                            document.getElementById('detailedEntriesWrapper').style.left = 0;
                            document.getElementById('editEntryWrapper').style.left = '100vw';

                            changeHeadline(document.getElementById('title').textContent.replace(' bearbeiten', ''));
                        }, duration);
                    });
                }
            });

            editCancelBtn.addEventListener('click', () => {
                let isChanged = false;

                const data = [
                    {oldValue: entry.date, newValue: editDate.value},
                    {oldValue: entry.reason, newValue: editReason.value},
                    {oldValue: entry.object, newValue: editObject.value},
                    {oldValue: entry.sum, newValue: parseFloat(editSum.value)},
                    {oldValue: entry.sum, newValue: parseFloat(editWorth.value)},
                ];

                for (const elm of data) {
                    if (elm.oldValue !== elm.newValue) {
                        isChanged = true;
                    }
                }

                if (!isChanged)  {
                    document.getElementById('entryWrapper').style.left = '-100vw';
                    document.getElementById('detailedEntriesWrapper').style.left = 0;
                    document.getElementById('editEntryWrapper').style.left = '100vw';

                    changeHeadline(document.getElementById('title').textContent.replace(' bearbeiten', ''));
                } else {
                    const editWarningWrapper = document.getElementById('editWarningWrapper');
                    const editConfirmedCancel = document.getElementById('editConfirmedCancel');
                    const editCanceldCancel = document.getElementById('editCanceldCancel');
                    const boxesToLowlight = document.querySelectorAll('#editEntryWrapper .getDataBox, #editButtonBar');
                    const footer = document.getElementById('footer');

                    editWarningWrapper.classList.remove('hide');
                    footer.style.zIndex = 0;

                    for (const box of boxesToLowlight) {
                        box.style.opacity = .15;
                    }

                    setTimeout(() => {
                        editWarningWrapper.style.opacity = 1;
                        editWarningWrapper.style.transform = 'scale(1)';
                    }, 5);

                    editConfirmedCancel.addEventListener('click', () => {
                        editWarningWrapper.style.opacity = 0;
                        editWarningWrapper.style.transform = 'scale(.6)';
                        footer.style.zIndex = 2;

                        for (const box of boxesToLowlight) {
                            box.style.opacity = 1;
                        }

                        document.getElementById('entryWrapper').style.left = '-100vw';
                        document.getElementById('detailedEntriesWrapper').style.left = 0;
                        document.getElementById('editEntryWrapper').style.left = '100vw';

                        changeHeadline(document.getElementById('title').textContent.replace(' bearbeiten', ''));

                        setTimeout(() => {
                            editWarningWrapper.classList.add('hide');
                        }, 310);
                    });

                    editCanceldCancel.addEventListener('click', () => {
                        editWarningWrapper.style.opacity = 0;
                        editWarningWrapper.style.transform = 'scale(.6)';
                        footer.style.zIndex = 2;

                        for (const box of boxesToLowlight) {
                            box.style.opacity = 1;
                        }

                        setTimeout(() => {
                            editWarningWrapper.classList.add('hide');
                        }, 310);
                    });
                }
            });
        });

        iconWrapper.appendChild(deleteEntryIcon);
        iconWrapper.appendChild(editEntryIcon);

        dataWrapper.setAttribute('class', 'entryDataWrapper');
        iconWrapper.setAttribute('class', 'entryIconWrapper');

        newEntry.appendChild(dataWrapper);
        newEntry.appendChild(iconWrapper);

        newEntry.classList.add('detailedEntry');
        return newEntry;
    }

    function createDeletedDetailedEntry(entry, name) {
        const newEntry = document.createElement('div');
        const dataWrapper = document.createElement('div');
        const iconWrapper = document.createElement('div');
        const personEntries = [];

        let sum = entry.sum.toString().replace('.', ',');
        personEntries.push({prefix: 'Grund:', content: entry.reason});

        let date = new Date(entry.date);
        date = `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;

        personEntries.push({prefix: 'Datum:', content: date});

        if (entry.type === 'object') {
            personEntries.push({prefix: 'Objekt:', content: entry.object});
            personEntries.push({prefix: 'Wert:', content: `${sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`});
        } else {
            personEntries.push({prefix: 'Betrag:', content: `${sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`});
        }

        date = new Date(entry.deletedDate);
        date = `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}, ${('0' + (date.getHours())).slice(-2)}:${('0' + (date.getMinutes())).slice(-2)} Uhr`;

        personEntries.push({prefix: 'gelöscht am:', content: date});

        for (const personEntry of personEntries) {
            const prefix = document.createElement('strong');
            const content = document.createElement('p');

            prefix.textContent = `${personEntry.prefix} `;
            content.appendChild(prefix);
            content.innerHTML += personEntry.content;

            dataWrapper.appendChild(content);
        }

        const restoreEntryIcon = document.createElement('i');
        restoreEntryIcon.setAttribute('class', 'fas fa-redo-alt');

        restoreEntryIcon.addEventListener('click', () => {
            const dataToRestore = {
                date: entry.date,
                restoredDate: Date.now(),
                entryID: entry.entryID,
                reason: entry.reason,
                restored: true,
                sum: entry.sum,
                type: entry.type,
                edited: entry.edited || false
            };

            if (entry.type === 'object') {
                dataToRestore.object = entry.object;
            }            

            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name}/${entry.entryID}`).set(dataToRestore).then(() => {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/deletedEntries/${name}/${entry.entryID}`).remove();
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/entries/${name}`).update({
                    name: name
                });

                let parent = newEntry.parentElement;

                if (parent.children.length - 1 === 0) {
                    const entryWrapper = document.getElementById('deletedEntryWrapper');
                    const overview = document.getElementById(`deletedOverview${name.replace(' ', '')}`);
                    const detailed = document.getElementById('deletedDetailedEntriesWrapper');

                    entryWrapper.removeChild(overview);
                    detailed.removeChild(document.getElementById(`deletedDetailed${name.replace(' ', '')}`));

                    if (entryWrapper.children.length === 0) {
                        const text = document.createElement('p');
                        text.textContent = 'Keine Einträge verfügbar.';
                        text.setAttribute('id', 'deletedEntriesErrorMessage');
                        entryWrapper.appendChild(text);
                    }

                    firebase.database().ref(`users/${firebase.auth().currentUser.uid}/deletedEntries/${name}`).remove();
                    const divs = document.querySelectorAll('#deletedDetailedEntriesWrapper > div');

                    entryWrapper.style.left = 0;
                    document.getElementById('deletedDetailedEntriesWrapper').style.left = '100vw';

                    changeHeadline('Gelöscht');

                    setTimeout(() => {
                        for (const div of divs) {
                            div.classList.add('hide');
                        }

                        parent.removeChild(newEntry);
                        calculatePersonSum(name.replace(' ', ''));
                    }, 310);
                } else {
                    parent.removeChild(newEntry);
                    calculatePersonSum(name.replace(' ', ''));
                }

                const overview = document.getElementById(`overview${name.replace(' ', '')}`);
                const detailed = document.getElementById(`detailed${name.replace(' ', '')}`);

                if (overview) {
                    sessionStorage.setItem('name', name);
                    detailed.appendChild(createDetailedEntry(dataToRestore), name);
                } else {
                    const data = [[]];
                    data[0][0] = dataToRestore;
                    data[0].name = name;

                    printEntriesOverview(data, true);
                }

                calculatePersonSum(name.replace(' ', ''));
                changeTheme();
            }).catch(console.error);
        });

        iconWrapper.appendChild(restoreEntryIcon);

        dataWrapper.setAttribute('class', 'entryDataWrapper');
        iconWrapper.setAttribute('class', 'entryIconWrapper');

        newEntry.appendChild(dataWrapper);
        newEntry.appendChild(iconWrapper);

        newEntry.classList.add('detailedEntry');
        return newEntry;
    }

    function initDisablePersonSelection() {
        document.getElementById('disableMoneyPersonSelection').addEventListener('click', () => {
            document.getElementById('moneyPersonSelection').style.opacity = 0;
            document.getElementById('moneyPersonSelection').style.transform = 'scale(0.4)';
            document.getElementById('disableMoneyPersonSelection').classList.add('hide');

            setTimeout(() => {
                document.getElementById('moneyPersonSelection').classList.add('hide');
                document.getElementById('createPerson').classList.remove('errorInput');
                document.getElementById('createPerson').value = '';

                for (const fdb of document.getElementsByClassName('feedback')) {
                    fdb.textContent = '';
                }
            }, 210);
        });

        document.getElementById('disableObjectPersonSelection').addEventListener('click', () => {
            document.getElementById('objectPersonSelection').style.opacity = 0;
            document.getElementById('objectPersonSelection').style.transform = 'scale(0.4)';
            document.getElementById('disableObjectPersonSelection').classList.add('hide');

            setTimeout(() => {
                document.getElementById('objectPersonSelection').classList.add('hide');
                document.getElementById('createObjectPerson').classList.remove('errorInput');
                document.getElementById('createObjectPerson').value = '';

                for (const fdb of document.getElementsByClassName('feedback')) {
                    fdb.textContent = '';
                }
            }, 210);
        });
    }

    function changeTheme() {
        const theme = JSON.parse(localStorage.getItem('theme'));

        if (theme !== null) {
            useTheme(theme.hex, theme.hex2, theme.color, true);
        }
    }
});

function changeHeadline(text) {
    document.getElementById('title').textContent = text;
}

function calculatePersonSum(name) {
    const screenInfos = [
        {entriesSum: `detailed${name}`, output: `#overview${name} .arrowAndMoneyWrapper p`},
        {entriesSum: `deletedDetailed${name}`, output: `#deletedOverview${name} .arrowAndMoneyWrapper p`}
    ];

    for (const info of screenInfos) {
        let entriesSum = document.getElementById(info.entriesSum)
        const output = document.querySelector(info.output);

        if (entriesSum !== null && output !== null) {
            let sum = 0;
            entriesSum = entriesSum.getElementsByTagName('p');

            for (const entry of entriesSum) {
                if (entry.textContent.includes('€') && typeof parseFloat(entry.textContent.replace(/[^0-9,.]/ig, '')) === 'number') {
                    sum += parseFloat(entry.textContent.replace(',', '.').replace(/[^0-9,.]/ig, ''));
                }
            }

            output.textContent = `${sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}€`.replace('.', ',');
        }
    }
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
        input.classList.remove('errorInput');
    }

    const fdbs = [
        document.getElementById('nameMoneyFDB'),
        document.getElementById('dateMoneyFDB'),
        document.getElementById('reasonMoneyFDB'),
        document.getElementById('sumMoneyFDB'),
        document.getElementById('nameObjectFDB'),
        document.getElementById('dateObjectFDB'),
        document.getElementById('reasonObjectFDB'),
        document.getElementById('objectFDB'),
    ];

    for (const fdb of fdbs) {
        fdb.textContent = '';
    }

    document.getElementById('wothObject').value = 0;
    document.getElementById('choosePerson').value = 'Person auswählen';
    document.getElementById('choosePersonObject').value = 'Person auswählen';
    document.getElementById('wothObject').classList.remove('errorInput');
    document.getElementById('choosePerson').classList.remove('errorInput');
    document.getElementById('choosePersonObject').classList.remove('errorInput');
}

function initDate(id) {
    const time = new Date();
    document.getElementById(id).value = `${time.getFullYear()}-${('0' + (time.getMonth() + 1)).slice(-2)}-${('0' + time.getDate()).slice(-2)}`;
}

function initEyes() {
    const pwWrapper = document.getElementsByClassName('pwWrapper');

    for (let i = 0; i < pwWrapper.length; i++) {
        for (let j = 1; j < pwWrapper[i].children.length; j++) {        
            const icon = pwWrapper[i].children[j];
            const input = pwWrapper[i].children[j-1];
            
            icon.addEventListener('click', () => {
                if (icon.className.includes('-slash')) {
                    icon.className = icon.className.replace('-slash', '');
                    input.type = 'password';
                } else {
                    icon.className += '-slash';
                    input.type = 'text';
                }
            });
        }
    }
}