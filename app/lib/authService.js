import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Sign Up with Email Verification
export const signUpUser = async (email, password, name) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);

    // Save user profile to Firestore
    const userData = {
      email: user.email,
      name: name,
      joinedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      listings: 0,
      favorites: [],
      verified: user.emailVerified,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return {
      success: true,
      message: 'Account created! Please verify your email. Check your inbox.',
      user: user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      return {
        success: false,
        error: 'Please verify your email before logging in.',
        needsVerification: true,
      };
    }

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    return {
      success: true,
      user: {
        uid: user.uid,
        ...userData,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send Password Reset Email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent!',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get Current User
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        resolve({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          ...userDoc.data(),
        });
      } else {
        resolve(null);
      }
      unsubscribe();
    });
  });
};

// Resend Verification Email
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      return {
        success: true,
        message: 'Verification email sent!',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
