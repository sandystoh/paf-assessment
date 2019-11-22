import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  id: number;
  transId: string;
  song: any;
  isLoading = true;
  isError = false;

  constructor(private apiSvc: ApiService, private route: ActivatedRoute,
              private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    // if have more time would route lock to prevent entering without clicking listen button
    this.route.params.subscribe(params => {
      this.id = +params.id;
      this.transId = params.transId;
      // console.log('in song', this.id, this.transId)
      this.apiSvc.getSongDetail(this.id, this.transId).then(r => {
        console.log(r);
        this.song = r['song'];
        this.isLoading = false;
      })
      .catch (e => {
        console.log(e);
        this.isError = true;
        this.isLoading = false;
      });
   });
  }

  checkinSong() {
    this.apiSvc.checkin(this.id, this.transId)
    .then(r => {
      console.log(r);
      this.router.navigate(['/listen']);
    })
    .catch((e) => {
      console.log(e);
      this.snackBar.open('Unable to Checkin! Please Try Again Later!', 'OK', { duration: 2000 });
    });
  }

}
