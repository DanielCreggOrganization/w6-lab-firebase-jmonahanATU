import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';

interface UserAuthData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Firebase Authentication instance
   */
  private readonly firebaseAuth = inject(Auth);
  /**
   * Registers a new user with email and password
   * @param userAuthData - The user's email and password
   * @returns Promise resolving to UserCredential
   */
  async registerUser(userAuthData: UserAuthData): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.firebaseAuth,
      userAuthData.email,
      userAuthData.password
    );
  }

  /**
   * Authenticates a user with email and password
   * @param userAuthData - The user's email and password
   * @returns Promise resolving to UserCredential
   */
  async authenticateUser(userAuthData: UserAuthData): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.firebaseAuth,
      userAuthData.email,
      userAuthData.password
    );
  }

  /**
   * Gets the current authenticated user
   * @returns The current User or null
   */
  getCurrentUser(): User | null {
    return this.firebaseAuth.currentUser;
  }
  /**
   * Initiates password reset process for a user
   * @param userEmail - The email address for password reset
   * @returns Promise resolving when email is sent
   */

  /**
   * Signs out the current user
   * @returns Promise resolving when sign out is complete
   */

  async sendPasswordResetEmail(userEmail: string): Promise<void> {
    return sendPasswordResetEmail(this.firebaseAuth, userEmail);
  }
  
  async signOutUser(): Promise<void> {
    return signOut(this.firebaseAuth);
  }

  
  constructor() { }
}
