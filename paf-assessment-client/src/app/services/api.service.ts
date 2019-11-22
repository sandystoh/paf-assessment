import { Injectable, ElementRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getPosts() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return this.http.get('/api/sample/mongo', {headers}).toPromise();
  }

  upload(form: NgForm, fileRef: ElementRef) {
    const formData = new FormData();
    formData.set('title', form.value.title);
    formData.set('email', form.value.email);
    formData.set('article', form.value.article);
    formData.set('artImage', fileRef.nativeElement.files[0]);

    return this.http.post<any>('/api/sample/sqls3mongo', formData).toPromise();
  }

  search(s) {
    const q = s.terms;
    const limit = s.limit || 0;
    const offset = s.offset || 0;
    const params = new HttpParams().append('q', q).append('limit', limit).append('offset', offset);

    return this.http.get<any>('/api/sample/mongo/search', {params}).toPromise();
  }
}
