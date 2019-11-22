import { Injectable, ElementRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get('/api/countries').toPromise();
  }
  getSongs() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return this.http.get('/api/songs', {headers}).toPromise();
  }

  getAvailableSongs() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return this.http.get('/api/songs/available', {headers}).toPromise();
  }

  upload(form: NgForm, fileRef: ElementRef) {
    const formData = new FormData();
    formData.set('title', form.value.title);
    formData.set('listen_slots', form.value.listen_slots);
    formData.set('lyrics', form.value.lyrics);
    formData.set('country_code', form.value.country_code);
    formData.set('musicFile', fileRef.nativeElement.files[0]);

    return this.http.post<any>('/api/upload', formData).toPromise();
  }

  checkout(id, username) {
    return this.http.get('/api/song/checkout/' + username + '/' + id).toPromise();
  }

  

  search(s) {
    const q = s.terms;
    const limit = s.limit || 0;
    const offset = s.offset || 0;
    const params = new HttpParams().append('q', q).append('limit', limit).append('offset', offset);

    return this.http.get<any>('/api/sample/mongo/search', {params}).toPromise();
  }
}
