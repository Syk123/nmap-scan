import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NmapScanComponent } from './nmap-scan/nmap-scan.component';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NmapScanComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nmap-frontend';
}
