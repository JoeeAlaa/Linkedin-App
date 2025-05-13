import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { signValidator } from '../../shared/validators/validation';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnDestroy{

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _UsersService = inject(UsersService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);
  isLoading:boolean = false;
  setIntervalId!:any;
  changePasswordSub!:Subscription;

  changePasswordForm:FormGroup = this._FormBuilder.group({
    password: [null,signValidator.password],
    newPassword: [null,signValidator.password]
  })


  changeSubmit():void{
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.changePasswordSub = this._UsersService.changePassword(this.changePasswordForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          if (res.message == 'success') {
            this._ToastrService.success(res.message,'LinkedIn');
            localStorage.setItem('linkedInUserToken',res.token);
            this._UsersService.saveUserData();
            this.setIntervalId = setInterval(() => {
              this._Router.navigate(['/home']);
            }, 2000);
          }
          console.log(res);
          
        },
        error:(err)=>{
          this.isLoading = false;
          console.log(err);
          
        }
      })
    }
    else{
      this.changePasswordForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.changePasswordSub?.unsubscribe();
    clearInterval(this.setIntervalId);
  }
}
