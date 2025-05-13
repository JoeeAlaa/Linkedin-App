import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const _ToastrService = inject(ToastrService);

  return next(req).pipe(catchError((err)=>{
    _ToastrService.error(err.error.error,'Linked In');

    return throwError(()=>err)
  }));
};
