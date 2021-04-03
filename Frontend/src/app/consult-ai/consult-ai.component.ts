import { Component, OnInit } from '@angular/core';
import { GlobalUserServiceService } from '../global-user-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SnackService } from '../services/snack.service';
import { debounceTime, timeout, retry, catchError } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-consult-ai',
  templateUrl: './consult-ai.component.html',
  styleUrls: ['./consult-ai.component.scss']
})
export class ConsultAiComponent implements OnInit {
  isCollapsed = false;
  constructor(
    private domSanitizer: DomSanitizer,
    public globalUserService: GlobalUserServiceService,
    private http: HttpClient,
    public snackbar: SnackService,
    public router: Router) { }
  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.globalUserService.setUserDetailsToFromLocalStorage();
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }

  questions =
    [
      '1. Talk about any times over the past few months that you’ve been bothered by low feelings, stress? ',
      '2. Can you tell me about your hopes and dreams for the future? What feelings have you had recently about working towards those goals?',
      '3. How often during the past 3 months have you felt as though your moods, or your life, were under your control?',
      '4. How frequently have you been bothered by not being able to stop your worrying?',
      '5. Tell me about how confident you have been feeling in your capabilities recently?',
      '6. Let’s talk about how often you have felt satisfied with yourself over the past 12 months.',
      '7. Let’s discuss how you have been feeling about your relationships recently.',
      '8. Have you experienced a heart break any time recently?',
      '9. Talk about your sleeping habits in the past 3 months.',
      '10. Talk about your most recent experience that was closest to an‘attack’ of fear, anxiety, or panic.'
    ]
  index = 0;
  takeQuiz = false;
  responses = [];
  blobs = [];
  results = [];
  flask_server_url = "http://e5077a856c9a.ngrok.io/";
  //this is where the code for the recording is written
  //Lets declare Record OBJ
  record;//Will use this flag for toggeling recording
  recording = false;//URL of Blob
  url; error;
  result = false;
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  initiateRecording() {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true
    }; navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /*
  * Will be called automatically.  
  */
  successCallback(stream) {
    var options = {
      mimeType: "audio/wav",
      numberOfAudioChannels: 2,
      sampleRate: 44000,
    };//Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }

  processRecording(blob) {
    this.url = URL.createObjectURL(blob);
    console.log("blob", blob);
    console.log("url", this.url);
    this.blobs.push(blob);
    this.responses.push(this.url);
  }

  errorCallback(error) {
    this.error = 'Can not play audio in your browser';
  }
  openUserProfile() {
    this.router.navigateByUrl('/userProfile');
  }

  sendfile() {
    var form = new FormData();
    form.append('file', this.blobs[this.index]);
    this.http.post(this.flask_server_url, form).pipe(debounceTime(500), timeout(12000), retry(6), catchError((err) => {
      this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
      throw new Error('Server Timeout' + err);
    })
    ).subscribe((response: any) => {
      console.log(response);
      this.results.push(response);
      this.index += 1;
      this.url = "";
    }, (error: any) => {
      this.snackbar.openSnackBar('Something went wrong', 'OKAY');
      console.log(error);
    });
  }
  final_result = "";
  getResult() {
    this.result = !this.result;
    let temp = 0;
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i] === "sad" || this.results[i] === "sad" || this.results[i] === "sad")
        temp += 1;
      else
        temp -= 1;
    }
    if (temp < 2 && temp > -2) {
      this.final_result = "Consult A Professional, Click Here";
    }
    else if (temp < 5 && temp > -5) {
      this.final_result = "You dont need professional help, try our forums";
    }
    else
      this.final_result = "You Great!!! Just Relax and click here!!";
  }
  redirect() {
    if (this.final_result === "Consult A Professional, Click Here") {
      this.router.navigateByUrl('/getNearbyDocs');
      this.snackbar.openSnackBar('Taking You to Psychiatrists Near You', 'OKAY')
    }
    else if (this.final_result === "You dont need professional help, try our forums") {
      this.router.navigateByUrl('/forums');
      this.snackbar.openSnackBar('Taking You to Psychiatrists Near You', 'OKAY')
    }
    else {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      this.snackbar.openSnackBar('You got RICK-ROLLED', 'OKAY')
    }
  }
}
