import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UsersService } from '../../core/services/users.service';
import { signValidator } from '../../shared/validators/validation';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _UsersService = inject(UsersService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);
  isLoading:boolean = false;
  signInSub!:Subscription;
  setIntervalId!:any;

  LoginForm:FormGroup = this._FormBuilder.group({
    email: [null,signValidator.email],
    password: [null,signValidator.password],
  });

  loginSubmit():void{
    if (this.LoginForm.valid) {
      this.isLoading = true;
      this.signInSub = this._UsersService.signIn(this.LoginForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false;          
          if (res.message == 'success') {
            this._ToastrService.success(res.message,'Linked In');
            localStorage.setItem('linkedInUserToken',res.token);
            this._UsersService.saveUserData();
            this.setIntervalId = setInterval(() => {
              this._Router.navigate(['/home'])
            }, 2000);
          }
        },
        error:(err)=>{
          this.isLoading = false;
        }
      })
    }
    else{
      this.LoginForm.markAllAsTouched();
      this.LoginForm.setErrors({mismatch:true});
    }
  }

  ngOnDestroy(): void {
    this.signInSub?.unsubscribe();
    clearInterval(this.setIntervalId)
  }

}
