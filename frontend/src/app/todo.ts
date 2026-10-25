import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Todo{
  id:number;
  title: string;
  done: boolean;

}



@Injectable({providedIn: 'root',})
export class TodoService {
  private http=inject(HttpClient);
  private apiUrl='htttp://localhost:8000/api/todos';


  getTodos(): Observable<Todo[]>{
  return this.http.get<Todo[]>(this.apiUrl);
  }

  addTodo(title: string): Observable<Todo>{
    return this.http.post<Todo>(this.apiUrl, {title, done: false});
  }

  updateTodo(todo:Todo): Observable<Todo>{
    return this.http.put<Todo>('${this.apiUrl}${id}/', todo);
  }

  deleteTodo(id:number): Observable<void>{
    return this.http.delete<void>('${this.apiUrl}${id}/');
  }
}