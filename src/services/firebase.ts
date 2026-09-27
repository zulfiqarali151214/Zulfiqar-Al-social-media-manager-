import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

// User provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDAn8l-dI3TlC1TLiG82RoeoRL13rJMG14",
  authDomain: "zulfiqar-al-social-media.firebaseapp.com",
  projectId: "zulfiqar-al-social-media",
  storageBucket: "zulfiqar-al-social-media.firebasestorage.app",
  messagingSenderId: "41930512905",
  appId: "1:41930512905:web:e2e6ce278f4b3d83f236d8",
  measurementId: "G-LLMGEZ18SS",
};

// Initialize Firebase only once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Helper functions
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
};
export type { User };

// User-friendly error message parser
export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in popup was closed before completing. Please try again.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Access has been temporarily restricted for security. Please try again later.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase Console. Please verify Authentication providers.';
    default:
      return 'An unexpected error occurred during authentication. Please try again.';
  }
}
