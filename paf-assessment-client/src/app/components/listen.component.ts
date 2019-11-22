import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Song, Listen } from '../models/models';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})
export class ListenComponent implements OnInit {

  songList: Listen[];
  records: any;
  isLoading = true;
  isError = false;
  model = {
    username: 'fred'
  };

  constructor(private apiSvc: ApiService, private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isLoading = true;
    this.getList();
  }

  getList() {
    this.apiSvc.getAvailableSongs().then(r => {
      console.log(r);
      this.songList = r as Listen[];
      this.songList.sort((a, b) => a.country.localeCompare(b.country));
      this.isLoading = false;
    })
    .catch(err => {
      console.log(err);
      this.isLoading = false;
      this.isError = true;
    });
  }

  checkoutSong(id, username) {
    console.log(id, username);
    this.apiSvc.checkout(id, username).then(r => {
      console.log(r);
      this.router.navigate(['/song/', r['id'], r['transId']]);
    }).catch(r => { // If had more time would throw specific error : listen count error or user error
      this.snackBar.open('Sorry unable to Listen!', 'OK', { duration: 2000 });
    });
  }

  toEdit(id) {
    this.router.navigate(['/', id]);
  }

  toDelete(name, id) {

  }
}
