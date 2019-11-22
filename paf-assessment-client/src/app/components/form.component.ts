import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @ViewChild('musicFile', {static: false})
  musicFile: ElementRef;

  countries;
  // countries = [{code: 'SG', name: 'Singapore'}]; // Fallback Array
  model = {
    country_code: 'SG',
    listen_slots: '3'
  };

  constructor(private apiSvc: ApiService, private router: Router) { }

  ngOnInit() {
    this.apiSvc.getCountries().then(r => {
      console.log(r);
      this.countries = r['countries'] as [];
    });
  }

  performUpload(form: NgForm) {
    console.log(form.value);
    console.log(this.musicFile.nativeElement.files[0]);
    console.log(form.value, this.musicFile.nativeElement.files[0]);
    this.apiSvc.upload(form, this.musicFile).then(() => {
      this.router.navigate(['/list']);
    }).catch(err => console.log(err));
  }
}
