import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';
import { Song } from '../models/models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  songList: Song[];
  records: any;
  isLoading = true;
  isError = false;

  constructor(private apiSvc: ApiService, private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isLoading = true;
    this.getList();
  }

  getList() {
    this.apiSvc.getSongs().then(r => {
      console.log(r);
      this.songList = r['songs'] as Song[];
      this.songList.sort((a, b) => a.name.localeCompare(b.name));
      this.isLoading = false;
    })
    .catch(err => {
      console.log(err);
      this.isLoading = false;
      this.isError = true;
    });
  }
}
