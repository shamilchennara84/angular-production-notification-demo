import { Component, OnInit, OnDestroy } from '@angular/core';
import { VersionCheckService } from '../../../services/version-check.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-app-notification',
  templateUrl: './app-notification.component.html',
  styleUrls: ['./app-notification.component.scss']
})
export class AppNotificationComponent implements OnInit, OnDestroy {
  showNotification: boolean = false;
  notificationMessage: string = 'A new build is available. Please refresh the page to update.';
  private subscription: Subscription | undefined;

  constructor(private versionService: VersionCheckService) {}

  ngOnInit(): void {
    this.subscription = interval(60000).subscribe(() => {
      this.checkForUpdates();
    });
  }

  checkForUpdates(): void {
    this.versionService.checkForUpdates().subscribe((response) => {
      const newVersion = response.version;
      if (this.versionService.isUpdateAvailable(newVersion)) {
        this.showNotification = true;
      }
    });
  }

  ngOnDestroy(): void {
   
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refreshPage(): void {
    
    sessionStorage.clear();
    window.location.reload();
  }

  onUserAcknowledge(): void {
    this.refreshPage();
  }
}
