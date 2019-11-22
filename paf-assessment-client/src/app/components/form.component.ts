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
  @ViewChild('imageFile', {static: false})
  imageFile: ElementRef;


  imagePath;
  imgURL: any;
  message: string;

  constructor(private apiSvc: ApiService, private router: Router) { }

  ngOnInit() {
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.imgURL = reader.result;
    };
  }

  performUpload(form: NgForm) {
    console.log(form.value);
    console.log(this.imageFile.nativeElement.files[0]);
    this.apiSvc.upload(form, this.imageFile).then(() => {
      this.router.navigate(['/list']);
    }).catch(err => console.log(err));
  }
}
