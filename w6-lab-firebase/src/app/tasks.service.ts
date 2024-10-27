// src/app/tasks.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
  addDoc,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, switchMap, of } from 'rxjs';

/**
 * Interface defining the structure of a Task.
 */
export interface Task {
  id?: string;
  content: string;
  completed: boolean;
  user?: string;
}

/**
 * Service responsible for managing tasks.
 */
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly firestoreDb = inject(Firestore);
  private readonly authService = inject(Auth);
  private readonly tasksCollectionRef = collection(this.firestoreDb, 'tasks');
  private readonly authenticatedUser$ = new BehaviorSubject<User | null>(null);

  /**
   * Observable stream of tasks for the current user.
   */
  userTasks$: Observable<Task[]>;

  constructor() {
    this.userTasks$ = this.authenticatedUser$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        const userTasksQuery = query(this.tasksCollectionRef, where('user', '==', user.uid));
        return collectionData(userTasksQuery, { idField: 'id' }) as Observable<Task[]>;
      })
    );

    // Track user authentication state
    onAuthStateChanged(this.authService, user => this.authenticatedUser$.next(user));
  }

  /**
   * Creates a new task in Firestore.
   * @param task The task to create
   */
  async createTask(task: Task) {
    try {
      const currentUser = this.authService.currentUser;
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
  
      // Add the task with the authenticated user's ID
      return await addDoc(this.tasksCollectionRef, {
        ...task,
        user: currentUser.uid,
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Updates the content of an existing task.
   * @param task The task to update (must include id)
   */
  async updateTask(task: Task) {
    try {
      const taskDocRef = doc(this.firestoreDb, `tasks/${task.id}`);
      return await updateDoc(taskDocRef, { content: task.content });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Toggles the completed status of a task.
   * @param task The task to toggle (must include id and completed status)
   */
  async toggleTaskCompleted(task: Task) {
    try {
      const taskDocRef = doc(this.firestoreDb, `tasks/${task.id}`);
      return await updateDoc(taskDocRef, { completed: !task.completed });
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
  }

  /**
   * Deletes a task from Firestore.
   * @param task The task to delete (must include id)
   */
  async deleteTask(task: Task) {
    try {
      const taskDocRef = doc(this.firestoreDb, `tasks/${task.id}`);
      return await deleteDoc(taskDocRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Returns an Observable of all tasks for the current user.
   */
  getUserTasks(): Observable<Task[]> {
    return this.userTasks$;
  }
}
