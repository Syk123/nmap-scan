import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nmap-scan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nmap-scan.component.html',
  styleUrl: './nmap-scan.component.css'
})
export class NmapScanComponent implements OnInit {
  @Input() command!: any

  results: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  downloadFile(url: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || "";  // Optional: specify a filename here
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  loadData(): void {
    this.http.get('https://your-backend-api.com/data')
      .subscribe({
        next: (response) => {
          console.log('Data fetched successfully:', response);
          this.results = response;
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      });
  }
}
