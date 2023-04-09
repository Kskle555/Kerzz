import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://smarty.kerzz.com:4004/api/mock/getFeed';
  private apiKey = 'bW9jay04ODc3NTU2NjExMjEyNGZmZmZmZmJ2';

  constructor(private http: HttpClient) { }

  getFeeds(latitude: number, longitude: number): Observable<any> {
    const headers = new HttpHeaders({ apiKey: this.apiKey });
    const data = {
      skip: 0,
      limit: 700,
      latitude: latitude,
      longitude: longitude
    };
    return this.http.post<any>(this.apiUrl, data, { headers });
  }
}
