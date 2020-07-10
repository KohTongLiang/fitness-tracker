import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APPID,
    measurementId: "G-KQ9JKCS904"
  };

class Firebase {
    constructor () {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    getFirestore() {
        return this.db;
    }

    // linking with Firebase's authentication API //

    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email,password);

    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => {
        this.auth.sendPasswordResetEmail(email)
    };

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    // *** Merge Auth and DB User API *** //
 
    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
        if (authUser) {
        this.db.collection('users').doc(authUser.uid).get()
            .then(snapshot => {
                const dbUser = snapshot.data();

                if (dbUser != null) {
                    // // default empty roles
                    if (!dbUser.roles) {
                        dbUser.roles = {};
                    }
                }

                // merge auth and db user
                authUser = {
                    uid: authUser.uid,
                    email: authUser.email,
                    ...dbUser,
                };

                next(authUser);
            });
        } else {
            fallback();
        }
    });
}

export default Firebase;