import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  private currentVersion = '1.0.0'; 
  private versionFile = 'assets/version.json';

  constructor(private http: HttpClient) {}

  checkForUpdates(): Observable<any> {
    return this.http.get<any>(this.versionFile);
  }

  isUpdateAvailable(newVersion: string): boolean {
    return newVersion !== this.currentVersion;
  }
}
