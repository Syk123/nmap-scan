import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobScanService } from '../services/job_scan_service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nmap-scan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nmap-scan.component.html',
  styleUrl: './nmap-scan.component.css'
})
export class NmapScanComponent implements OnInit {

  results!: any;
  scanCommand!: string;

  constructor(private jobScanService: JobScanService) { }

  ngOnInit(): void {
    this.jobScanService.getJobs().subscribe({
      next: (response) => {
        this.results = response
      },
      error: (error) => {
        console.error("Error fetching jobs", error)
      }
    })
  }

  downloadFile(jobId: string): void {
    this.jobScanService.download(jobId).subscribe({
      next: (blob) => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = `${jobId}_scan_result.xml`
        a.click()
        URL.revokeObjectURL(objectUrl)
      }
    })
  }

  submitScan() {
    this.jobScanService.scan(this.scanCommand).subscribe({
      next: (response) => {
        this.results = response
      },
      error: (error) => {
        console.error("Error submitting scan request", error)
      }
    })
  }

}
