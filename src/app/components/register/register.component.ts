import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { signValidator } from '../../shared/validators/validation';
import { confirmPassword } from '../../shared/utils/confirm-password';
import { UsersService } from '../../core/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy{

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _UsersService = inject(UsersService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);
  isLoading:boolean = false;
  signUpSub!:Subscription;
  setIntervalId!:any;

  registerForm:FormGroup = this._FormBuilder.group({
    name: [null,signValidator.name],
    email: [null,signValidator.email],
    password: [null,signValidator.password],
    rePassword: [null],
    dateOfBirth: [null,signValidator.dateOfBirth],
    gender: ['male']
  },{validators: confirmPassword});

  registerSubmit():void{
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.signUpSub = this._UsersService.signUp(this.registerForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          if (res.message == 'success') {
            this._ToastrService.success(res.message,'Linked In')
            this.setIntervalId = setInterval(() => {
              this._Router.navigate(['/login'])
            }, 2000);
          }
          
        },
        error:(err)=>{
          this.isLoading = false;
        }
      })
    }
    else{
      this.registerForm.markAllAsTouched();
      this.registerForm.setErrors({mismatch:true});
    }
  }

  ngOnDestroy(): void {
    this.signUpSub?.unsubscribe();
    clearInterval(this.setIntervalId)
  }
}
