import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { IUserDetails } from '../../core/interfaces/iuser-details';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-details',
  imports: [ReactiveFormsModule,DatePipe,RouterLink],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit,OnDestroy{

  private readonly _UsersService = inject(UsersService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ToastrService = inject(ToastrService);
  userDetails:WritableSignal<IUserDetails> = signal({} as IUserDetails);
  getUserDataSub!:Subscription;
  uploadProfilePhotoSub!:Subscription;
  isModalOpen = false;
  savedFile!:any;


  userDetailsForm:FormGroup = this._FormBuilder.group({
    name:[null],
    email:[null],
    dateOfBirth:[null],
    gender:[null],
    createdAt:[null],
  })

  changeImage(e:Event):void{
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {      
      this.savedFile = input.files[0];
      console.log(this.savedFile);
      
    }
  }

  uploadImage():void{
    const formData = new FormData();
    if (this.savedFile) {      
      formData.append('photo',this.savedFile);
      this.uploadProfilePhotoSub = this._UsersService.uploadProfilePhoto(formData).subscribe({
        next:(res)=>{
          this.isModalOpen = false;
          this.getUserDataSub = this._UsersService.getUserData().subscribe({
            next:(res)=>{
              this.userDetails.set(res.user)
            }
          });
          this._ToastrService.success('Photo Changed Successed','Linkedin');
        }
      })
    }
  }

  ngOnInit(): void {
    this.getUserDataSub = this._UsersService.getUserData().subscribe({
      next:(res)=>{
        this.userDetails.set(res.user);
        this.userDetailsForm.get('name')?.patchValue(this.userDetails().name);
        this.userDetailsForm.get('email')?.patchValue(this.userDetails().email);
        this.userDetailsForm.get('dateOfBirth')?.patchValue(this.userDetails().dateOfBirth);        
      }
    })
  }

  ngOnDestroy(): void {
    this.getUserDataSub?.unsubscribe();
    this.uploadProfilePhotoSub?.unsubscribe();
  }

}
