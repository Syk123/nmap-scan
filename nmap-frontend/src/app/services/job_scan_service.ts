import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, interval, switchMap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class JobScanService {
    private pollingInterval = 5000; // Poll every 5 seconds
    private pollingUrl = 'http://localhost:3000'; // Replace with your API endpoint

    constructor(private http: HttpClient) { }
    getJobs(): Observable<any> {
        return interval(this.pollingInterval).pipe(
            switchMap(() => this.http.get(`${this.pollingUrl}/jobs`))
        );
    }

    scan(command: string): Observable<any> {
        return this.http.post(`${this.pollingUrl}/scan`, { command: command, jobId: uuidv4() })
    }

    download(jobId: string): Observable<any> {
        const params = new HttpParams().append('jobId', jobId)
        return this.http.get(`${this.pollingUrl}/download`, {params: params, responseType: 'blob'})
    }
}
