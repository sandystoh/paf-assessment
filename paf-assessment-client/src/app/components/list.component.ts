import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  articleList: any;
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
    this.apiSvc.getPosts().then(r => {
      this.articleList = r['sample'] as [];
      this.articleList.sort((a, b) => b.posted - a.posted);
      this.isLoading = false;
    })
    .catch(err => {
      console.log(err);
      this.isLoading = false;
      this.isError = true;
    });
  }

  toEdit(id) {
    this.router.navigate(['/', id]);
  }

  toDelete(name, id) {

  }
}
