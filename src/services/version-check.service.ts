import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';  // to tap into the observable response

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  private versionFile = 'assets/version.json';

  constructor(private http: HttpClient) {
    this.initializeCurrentVersion();
  }

  private initializeCurrentVersion(): void {
    if (!sessionStorage.getItem('currentVersion')) {
      this.http.get<any>(this.versionFile).pipe(
        tap(response => {
          const currentVersion = response.version || '1.0.0';  
          sessionStorage.setItem('currentVersion', currentVersion);
        })
      ).subscribe();
    }
  }

  checkForUpdates(): Observable<any> {
    return this.http.get<any>(this.versionFile);
  }

  isUpdateAvailable(newVersion: string): boolean {
    const currentVersion = sessionStorage.getItem('currentVersion') ; 
    return newVersion !== currentVersion;
  }

  updateVersion(newVersion: string): void {
    sessionStorage.setItem('currentVersion', newVersion);
  }
}
