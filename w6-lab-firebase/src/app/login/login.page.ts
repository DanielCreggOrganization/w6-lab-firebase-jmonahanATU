import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { FirebaseError } from '@angular/fire/app';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule]
})
export class LoginPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly loadingController = inject(LoadingController);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isPasswordVisible = false;

  userAuthForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get emailControl() {
    return this.userAuthForm.controls.email;
  }

  get passwordControl() {
    return this.userAuthForm.controls.password;
  }

   /**
   * Handles user registration
   */
   async handleRegistration() {
    if (this.userAuthForm.invalid) return;

    const loading = await this.loadingController.create({
      message: 'Creating account...'
    });
    await loading.present();

    try {
      await this.authService.registerUser(this.userAuthForm.getRawValue());
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      const errorMessage = (error as FirebaseError).message;
      await this.showAlert('Registration Failed', errorMessage);
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Handles user authentication
   */
  async handleAuthentication() {
    if (this.userAuthForm.invalid) return;

    const loading = await this.loadingController.create({
      message: 'Signing in...'
    });
    await loading.present();

    try {
      await this.authService.authenticateUser(this.userAuthForm.getRawValue());
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      const errorMessage = (error as FirebaseError).message;
      await this.showAlert('Authentication Failed', errorMessage);
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Initiates password reset process
   */
  async handlePasswordReset() {
    const email = this.userAuthForm.value.email;

    if (!this.emailControl.valid || !email) {
      await this.showAlert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Sending password reset email...'
    });
    await loading.present();

    try {
      await this.authService.sendPasswordResetEmail(email);
      await this.showAlert('Success', 'Password reset email sent. Please check your inbox.');
    } catch (error) {
      const errorMessage = this.getFirebaseErrorMessage(error);
      await this.showAlert('Password Reset Failed', errorMessage);
    } finally {
      await loading.dismiss();
    }
  }
  

 

  /**
   * Displays an alert with the given header and message
   */
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

    /**
   * Extracts the message from a FirebaseError
   */
    private getFirebaseErrorMessage(error: unknown): string {
      return (error as FirebaseError).message ?? 'An unknown error occurred';
    }


  constructor() { }

  ngOnInit() {
  }

}
