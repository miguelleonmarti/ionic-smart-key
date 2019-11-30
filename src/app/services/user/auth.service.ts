import { Injectable } from "@angular/core";

// firebase
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor() {}

  loginUser(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((newUserCredential: firebase.auth.UserCredential) => {
        firebase
          .database()
          .ref(`users/${newUserCredential.user.uid}`)
          .set({ email });
        /*.firestore()
          .doc(`/userProfile/${newUserCredential.user.uid}`)
          .set({ email });*/
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }
}
