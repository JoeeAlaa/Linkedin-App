import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { IPosts } from '../../core/interfaces/iposts';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommentsComponent } from '../../shared/ui/comments/comment.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { signValidator } from '../../shared/validators/validation';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-posts',
  imports: [CommentsComponent,ReactiveFormsModule,DatePipe],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent implements OnInit,OnDestroy{

  private readonly _PostsService = inject(PostsService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _FormBuilder = inject(FormBuilder);
  AllMyPosts:WritableSignal<IPosts[]> = signal([]);
  getMyPostsSub!:Subscription;
  isModalOpen = false;
  postId:WritableSignal<string> = signal('');


  updateForm:FormGroup = this._FormBuilder.group({
    body: ['', signValidator.content],
    image: [null, signValidator.content]
  })

  getMyPost(){
    this.getMyPostsSub = this._PostsService.getMyPosts().subscribe({
      next:(res)=>{
        this.AllMyPosts.set(res.posts);
        this._PostsService.postsNum.set(res.paginationInfo.total)        
      }
    })
  }

  deletePost(id:string):void{
    this._PostsService.deletePost(id).subscribe({
      next:(res)=>{
        if (res.message === 'success') {
          this.getMyPost()
          this._ToastrService.success('Post Deleted','Linkedin')
        }
      }
    })
  }

  setUpdate(post:any,id:string):void{
    this.postId.set(id);    
    this.updateForm.patchValue({
      body: post.body,
      image: null
    });    
    console.log(this.updateForm.value);
  }

  changeImage(e:Event):void{
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {      
      this.updateForm.patchValue({image:input.files[0]})
    }
    
  }

  updatePost():void{
    if (this.updateForm.valid) {
      const formData = new FormData();
      formData.append('body',this.updateForm.get('body')?.value);
      const imageFile = this.updateForm.get('image')?.value;
      if (imageFile) {
        formData.append('image', imageFile);
      }
      this._PostsService.updatePost(this.postId(),formData).subscribe({
        next:(res)=>{
          console.log(res);
          if (res.message === 'success') {
            this.isModalOpen = false;
            this.updateForm.reset();
            this.getMyPost();
            this._ToastrService.success('post your update','Linkedin')
          }
        }
      })
    }
  }


  ngOnInit():void{
    this.getMyPost();
  }

  ngOnDestroy(): void {
    this.getMyPostsSub?.unsubscribe();
  }

}
