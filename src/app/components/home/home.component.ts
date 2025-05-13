import { Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { IPosts } from '../../core/interfaces/iposts';
import { DatePipe } from '@angular/common';
import { CommentsComponent } from "../../shared/ui/comments/comment.component";
import { Subscription } from 'rxjs';
import { IUserDetails } from '../../core/interfaces/iuser-details';
import { UsersService } from '../../core/services/users.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { signValidator } from '../../shared/validators/validation';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [DatePipe, CommentsComponent,FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit,OnDestroy{

  private readonly _PostsService = inject(PostsService);
  private readonly _UsersService = inject(UsersService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ToastrService = inject(ToastrService);
  allPosts:WritableSignal<IPosts[]> = signal([]);
  userDetails:WritableSignal<IUserDetails> = signal({} as IUserDetails);
  getAllPostsSub!:Subscription;
  getUserDataSub!:Subscription;
  createPostSub!:Subscription;
  getMyPostsSub!:Subscription;
  isModalOpen = false;
  createPostForm!:FormGroup;
  numOfPosts:Signal<number> = computed(()=>this._PostsService.postsNum())

  ngOnInit(): void {

    this.createPostForm=this._FormBuilder.group({
      content: ['', signValidator.content],
      image: [null, signValidator.content]
    })

    this.getAllPostsSub = this._PostsService.getAllPosts().subscribe({
      next:(res)=>{
        this.allPosts.set(res.posts);
      }
    })
    
    this.getUserDataSub = this._UsersService.getUserData().subscribe({
      next:(res)=>{
        this.userDetails.set(res.user);      
      }
    })

    this._PostsService.getMyPosts().subscribe({
      next:(res)=>{
        this._PostsService.postsNum.set(res.paginationInfo.total)
      }
    })

  }

  changeImage(e:Event):void{
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {      
      this.createPostForm.patchValue({image:input.files[0]})
    }
    
  }

  createPost():void{
    if (this.createPostForm.valid) {
      const formData = new FormData();
      formData.append('body',this.createPostForm.get('content')?.value);
      formData.append('image',this.createPostForm.get('image')?.value);
      this.createPostSub = this._PostsService.createPost(formData).subscribe({
        next:(res)=>{
          if (res.message === 'success') {
            this.getMyPostsSub = this._PostsService.getMyPosts().subscribe({
              next:(res)=>{
                this._PostsService.postsNum.set(res.paginationInfo.total)
              }
            })
            this.isModalOpen = false;
            this.createPostForm.reset();
            this._ToastrService.success('Your Post Added Successfully','Linkedin');
          }
        }
      })
      
    }
    else{
      this.createPostForm.markAllAsTouched();
    }
  }

  dataReady = computed(() =>
    this.allPosts().length > 0 && !!this.userDetails().name
  );
  
  ngOnDestroy(): void {
    this.getAllPostsSub?.unsubscribe();
    this.getUserDataSub?.unsubscribe();
    this.getMyPostsSub?.unsubscribe();
    this.createPostSub?.unsubscribe();
  }

}
