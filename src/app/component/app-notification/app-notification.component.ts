import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from '../../../services/version-check.service';


@Component({
  selector: 'app-app-notification',
  templateUrl: './app-notification.component.html',
  styleUrls: ['./app-notification.component.scss']
})
export class AppNotificationComponent implements OnInit {


  constructor(private versionService: VersionCheckService) { }

  ngOnInit(): void {
    this.versionService.updateAvailable$.subscribe((isUpdateAvailable) => {
      if (isUpdateAvailable) {
        alert('A new build is available. The page will now refresh to apply updates.');
        sessionStorage.clear();
        window.location.reload();
      }
    });

  }


}
