import { AbstractControl } from "@angular/forms";

export function confirmPassword(g:AbstractControl){
    if (g.get('password')?.value === g.get('rePassword')?.value) {
        return null
    }
    else{
        return {mismatch:true}
    }
}