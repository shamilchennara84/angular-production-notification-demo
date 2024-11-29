import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  private updateSubject = new BehaviorSubject<boolean>(false);
  public updateAvailable$ = this.updateSubject.asObservable();

  private versionFile = 'assets/Mics/version.json';
  private pollingInterval = 30000;
  private currentVersion: string | null = null;


  constructor(private http: HttpClient) {
      this.initializeCurrentVersion();
      this.startPolling();
  }

  private initializeCurrentVersion(): void {
      this.currentVersion = sessionStorage.getItem('currentVersion');
      if (!this.currentVersion) {
          this.http.get<{ version: string }>(this.versionFile).pipe(
              tap((response) => {
                  const currentVersion = response.version;
                  sessionStorage.setItem('currentVersion', currentVersion);
                  this.currentVersion = currentVersion; 
              })
          ).subscribe({
              error: (error) => console.error('Error initializing current version:', error)
          });
      }
  }

  private startPolling(): void {
      interval(this.pollingInterval)
          .pipe(
              switchMap(() => this.http.get<{ version: string }>(this.versionFile)),
              tap({
                  next: (response) => {
                      const newVersion = response.version;
                      console.log('Polling triggered:', new Date(), 'New version:', newVersion,'  current version',this.currentVersion);  
                      if (newVersion && this.currentVersion !== newVersion) {
                          this.updateSubject.next(true);
                          this.currentVersion = newVersion;
                          sessionStorage.setItem('currentVersion', newVersion);
                      }
                  },
                  error: (error) => console.error('Error fetching version file:', error)
              })
          )
          .subscribe();
  }
}
