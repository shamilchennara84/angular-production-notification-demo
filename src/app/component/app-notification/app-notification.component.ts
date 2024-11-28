import { Component, OnInit, OnDestroy } from '@angular/core';
import { VersionCheckService } from '../../../services/version-check.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-app-notification',
  templateUrl: './app-notification.component.html',
  styleUrls: ['./app-notification.component.scss']
})
export class AppNotificationComponent implements OnInit, OnDestroy {
  showNotification: boolean = false;  // Make sure this property is correctly typed
  notificationMessage: string = 'A new build is available. Please refresh the page to update.';
  private subscription: Subscription | undefined;

  constructor(private versionService: VersionCheckService) {}

  ngOnInit(): void {
    // Start the interval to check for updates every minute
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
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refreshPage(): void {
    window.location.reload();
  }
}
