let authorized = false;

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('accountNav').click();
    }, 500);

    const saveNewUsername = document.getElementById('saveNewUsername');
    const saveNewEmail = document.getElementById('saveNewEmail');
    const saveNewPassword = document.getElementById('saveNewPassword');
    const deleteAccount = document.getElementById('deleteAccount');

    saveNewUsername.addEventListener('click', () => {
        const user = firebase.auth().currentUser;
        const newUsername = document.getElementById('newUsername');
        const newUsernameFDB = document.getElementById('newUsernameFDB');
        const usernameField = document.getElementById('usernameField');

        activateLoading(.3);

        if (newUsername.value.trim() === '') {
            newUsername.classList.add('errorInput');
            newUsernameFDB.textContent = 'Feld darf nicht leer sein.';
            deactiveLoading();
        } else {
            newUsername.classList.remove('errorInput');
            newUsernameFDB.innerHTML = '&nbsp;';

            firebase.database().ref(`users/${user.uid}/userdata`).update({
                username: newUsername.value
            }).then(() => {
                deactiveLoading();
                usernameField.textContent = newUsername.value;
                showSuccessMessage('Benutzername erfolgreich geändert', 3);
                newUsername.value = '';
            }).catch(console.error);
        }
    });

    saveNewEmail.addEventListener('click', () => {
        const newEmail = document.getElementById('newEmail');
        const newEmailFDB = document.getElementById('newEmailFDB');

        activateLoading(.3);

        if (newEmail.value.trim() === '') {
            newEmail.classList.add('errorInput');
            newEmailFDB.textContent = 'Feld darf nicht leer sein.';
            deactiveLoading();
        } else if (validateEmail(newEmail.value)) {
            newEmail.classList.remove('errorInput');
            newEmailFDB.innerHTML = '&nbsp;';

            deactiveLoading();

            let interval;

            if (authorized) {
                firebase.auth().currentUser.updateEmail(newEmail.value).then(() => {
                    firebase.database().ref(`users/${firebase.auth().currentUser.uid}/userdata`).update({
                        email: newEmail.value
                    }).then(() => {
                        showSuccessMessage('E-Mail Adresse erfolgreich geändert.', 3);
                    });
                }).catch(() => {
                    showSuccessMessage('Unbekanntes Problem, versuche es später erneut.', 4)
                });
            } else {
                authorize();

                interval = setInterval(() => {
                   if (authorized) {
                        clearInterval(interval);
                        activateLoading(.3);

                        firebase.auth().currentUser.updateEmail(newEmail.value).then(() => {
                            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/userdata`).update({
                                email: newEmail.value
                            }).then(() => {
                                deactiveLoading();
                                showSuccessMessage('E-Mail Adresse erfolgreich geändert.', 3);
                            });
                        }).catch(() => {
                            deactiveLoading();
                            showSuccessMessage('Unbekanntes Problem, versuche es später erneut.', 4)
                        });
                    }
                }, 250);
            }
        } else {
            newEmail.classList.add('errorInput');
            newEmailFDB.textContent = 'Ungültige E-Mail Adresse.';
            deactiveLoading();
        }
    });

    saveNewPassword.addEventListener('click', () => {
        const newPassword = document.getElementById('newPassword');
        const newPasswordFDB = document.getElementById('newPasswordFDB');

        activateLoading(.3);

        if (newPassword.value.trim() === '') {
            newPassword.classList.add('errorInput');
            newPasswordFDB.textContent = 'Feld darf nicht leer sein.';
            deactiveLoading();
        } else if (validatePassword(newPassword.value)) {
            newPassword.classList.remove('errorInput');
            newPasswordFDB.innerHTML = '&nbsp;';

            deactiveLoading();

            let interval;

            if (authorized) {
                firebase.auth().currentUser.updatePassword(newPassword.value).then(() => {
                    deactiveLoading();
                    showSuccessMessage('Passwort erfolgreich geändert.', 3);
                }).catch(() => {
                    deactiveLoading();
                    showSuccessMessage('Unbekanntes Problem, versuche es später erneut.', 4)
                });
            } else {
                authorize();

                interval = setInterval(() => {
                   if (authorized) {
                        clearInterval(interval);
                        activateLoading(.3);

                        firebase.auth().currentUser.updatePassword(newPassword.value).then(() => {
                            deactiveLoading();
                            showSuccessMessage('Passwort erfolgreich geändert.', 3);
                        }).catch(() => {
                            deactiveLoading();
                            showSuccessMessage('Unbekanntes Problem, versuche es später erneut.', 4)
                        });
                    }
                }, 250);
            }
        } else {
            if (!/[a-z]/.test(newPassword.value)) {
                // no lower case letters
                newPasswordFDB.textContent = 'Bitte geben Sie auch kleine Buchstaben ein.';
            } else if (!/[A-Z]/.test(newPassword.value)) {
                // no higer case letters 
                newPasswordFDB.textContent = 'Bitte geben Sie auch große Buchstaben ein.';
            } else if (!/[0-9]/.test(newPassword.value)) {
                // no numbers
                newPasswordFDB.textContent = 'Bitte geben Sie auch Ziffern ein.';
            } else if (newPassword.value.length < 5) {
                // to short
                newPasswordFDB.textContent = 'Das Passwort ist zu kurz.';
            } else {
                // unknown error
                newPasswordFDB.textContent = 'Es ist ein unbekannter Fehler aufgetreten, bitte versuchen Sie es später erneut.';
            }

            newPassword.classList.add('errorInput');
            deactiveLoading();
        }
    });

    deleteAccount.addEventListener('click', () => {
        authorized = false;

        authorize();

        let interval = setInterval(() => {
            if (authorized) {
                clearInterval(interval);
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).remove().then(() => {
                    firebase.auth().currentUser.delete();
                });
            }
        }, 250);
    });
});

function showSuccessMessage(text, duration) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = text;
    successMessage.classList.remove('hide');

    setTimeout(() => {
        successMessage.style.opacity = 1;
        successMessage.style.transform = 'scale(1)';

        setTimeout(() => {
            successMessage.style.opacity = 0;
            successMessage.style.transform = 'scale(.6)';

            setTimeout(() => {
                successMessage.classList.add('hide');
            }, 260);
        }, duration * 1000);
    }, 5);
}

function authorize() {
    const authorizeWrapper = document.getElementById('authorizeWrapper');
    const confirmAuthorize = document.getElementById('confirmAuthorize');
    const footer = document.getElementById('footer');
    const user = firebase.auth().currentUser;

    if (user.providerData[0].providerId === 'google.com') {
        const provider = new firebase.auth.GoogleAuthProvider();

        user.reauthenticateWithPopup(provider).then((result) => {
            authorized = true;
        }, (error) => {
            console.error(error);
        });
    } else if (user.providerData[0].providerId === 'password') {
        authorizeWrapper.classList.remove('hide');
        footer.style.zIndex = 0;
    
        confirmAuthorize.addEventListener('click', () => {
            user.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, document.getElementById('authorizePW').value)).then(() => {
                authorizeWrapper.classList.add('hide');
                footer.style.zIndex = 2
                document.getElementById('authorizePW').value = '';
                authorized = true;

                setTimeout(() => {
                    authorized = false;
                }, 5 * 60000);
            }, (error) => {
                console.error(error);
            });
        });
    } else {
        showSuccessMessage('Unbekanntes Problem, versuche es später erneut.', 4);
    }
}