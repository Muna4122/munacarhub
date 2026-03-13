import { signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign In with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists in Firestore, if not create it
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create new user profile
      const userData = {
        email: user.email,
        name: user.displayName || 'User',
        joinedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        listings: 0,
        favorites: [],
        verified: true, // Google accounts are verified
        createdAt: new Date(),
      };

      await setDoc(userDocRef, userData);
    }

    // Get user profile
    const userData = (await getDoc(userDocRef)).data();

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: true,
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
