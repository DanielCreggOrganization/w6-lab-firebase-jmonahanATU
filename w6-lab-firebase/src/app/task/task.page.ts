import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TasksService, Task } from '../tasks.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TaskPage implements OnInit {
  userTasks$: Observable<Task[]> | null = null;

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.userTasks$ = this.tasksService.getUserTasks();
  }

  async createTask(content: string) {
    const newTask: Task = { content, completed: false };
    await this.tasksService.createTask(newTask);
  }

  async updateTask(task: Task) {
    await this.tasksService.updateTask(task);
  }

  async toggleTaskCompleted(task: Task) {
    task.completed = !task.completed;
    await this.tasksService.toggleTaskCompleted(task);
  }

  async deleteTask(task: Task) {
    await this.tasksService.deleteTask(task);
  }
}
