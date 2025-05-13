import { Validators } from "@angular/forms";

export const signValidator = {
    name: [Validators.required , Validators.minLength(3) , Validators.maxLength(20)],
    email: [Validators.required , Validators.email],
    password : [Validators.required , Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)],
    dateOfBirth: [Validators.required],
    content: [Validators.required],
}