import { Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TodoService, Todo } from './todo';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
   private todoService= inject(TodoService);

   todos: Todo[]=[];
   newTitle='';
   errorMessage='';
   isAdding=false;
   pendingTodoIds = new Set<number>();
   private nextTemporaryId=-1;

   ngOnInit(){
    this.loadTodos();
     
   }

   loadTodos(){
    this.todoService.getTodos().subscribe((data) => {
      this.todos=data;
      this.errorMessage='';
    }, () => {
      this.errorMessage='Could not load todos. Please try again.';
    });
   }

   add(){
    const title= this.newTitle.trim();
    if(!title || this.isAdding) return;

    const temporaryId=this.nextTemporaryId--;
    this.todos=[...this.todos, {id: temporaryId, title, done: false}];
    this.newTitle='';
    this.isAdding=true;
    this.errorMessage='';

    this.todoService.addTodo(title).subscribe({
      next: (createdTodo) => {
        this.todos=this.todos.map((todo) => todo.id === temporaryId ? createdTodo : todo);
        this.isAdding=false;
      },
      error: () => {
        this.todos=this.todos.filter((todo) => todo.id !== temporaryId);
        if (!this.newTitle) this.newTitle=title;
        this.isAdding=false;
        this.errorMessage='Could not add todo. Please try again.';
      },
    });
   }

   toggle(todo: Todo){
    if (this.pendingTodoIds.has(todo.id)) return;

    if (!todo.done) {
      this.remove(todo);
      return;
    }

    const updatedTodo={...todo, done: !todo.done};
    this.todos=this.todos.map((item) => item.id === todo.id ? updatedTodo : item);
    this.setTodoPending(todo.id, true);
    this.errorMessage='';

    this.todoService.updateTodo(updatedTodo).subscribe({
      next: (savedTodo) => {
        this.todos=this.todos.map((item) => item.id === todo.id ? savedTodo : item);
        this.setTodoPending(todo.id, false);
      },
      error: () => {
        this.todos=this.todos.map((item) => item.id === todo.id ? todo : item);
        this.setTodoPending(todo.id, false);
        this.errorMessage='Could not update todo. Please try again.';
      },
    });
   }

   remove(todo: Todo){
    if (this.pendingTodoIds.has(todo.id)) return;

    const originalIndex=this.todos.findIndex((item) => item.id === todo.id);
    this.todos=this.todos.filter((item) => item.id !== todo.id);
    this.setTodoPending(todo.id, true);
    this.errorMessage='';

    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => this.setTodoPending(todo.id, false),
      error: () => {
        this.todos=[
          ...this.todos.slice(0, originalIndex),
          todo,
          ...this.todos.slice(originalIndex),
        ];
        this.setTodoPending(todo.id, false);
        this.errorMessage='Could not delete todo. Please try again.';
      },
    });
   }

   private setTodoPending(id: number, pending: boolean){
    const pendingIds=new Set(this.pendingTodoIds);
    if (pending) pendingIds.add(id);
    else pendingIds.delete(id);
    this.pendingTodoIds=pendingIds;
   }
}
