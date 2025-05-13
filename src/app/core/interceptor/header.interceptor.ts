import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

  if (localStorage.getItem('linkedInUserToken') !== null) {
    
    req = req.clone({
      setHeaders:{token:localStorage.getItem('linkedInUserToken')!}
    })
  }
  return next(req);
};
