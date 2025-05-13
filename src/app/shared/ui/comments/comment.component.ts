import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CommentsService } from '../../../core/services/comments.service';
import { IComments } from '../../../core/interfaces/icomments';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe,ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})

export class CommentsComponent implements OnInit,OnDestroy{
  private readonly _CommentsService = inject(CommentsService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ToastrService = inject(ToastrService);
  
  @Input({ required: true }) postId!: string;
  allComments:WritableSignal<IComments[]> = signal([]);
  getPostCommentSub!:Subscription;
  createCommentSub!:Subscription;
  updateCommentSub!:Subscription;
  commentForm!: FormGroup;
  editingCommentId: string | null = null;
  currentUserId = localStorage.getItem('linkedInUserId');

  ngOnInit(): void {
    this.commentForm = this._FormBuilder.group({
      content:[null],
      post:[this.postId]
    })


    this.getPostCommentSub = this._CommentsService.getPostComment(this.postId).subscribe({
      next:(res)=>{
        this.allComments.set(res.comments);        
      }
    })
  }

  commentSubmit(): void {
    
    if (this.editingCommentId) {
      this.updateComment(this.editingCommentId);
    } 
    else {
      this.createCommentSub = this._CommentsService.createComment(this.commentForm.value).subscribe({
        next:(res) => {
          this.allComments.set(res.comments);
          this.commentForm.get('content')?.reset();
        },
      });
    }
    
  }

  startEdit(comment: IComments): void {    
    this.editingCommentId = comment._id;
    this.commentForm.patchValue({
      content: comment.content,
      post: this.postId
    });
  }

  updateComment(id: string): void {
    const content = this.commentForm.get('content')?.value;
    
    this.updateCommentSub = this._CommentsService.updateComment(id, { content }).subscribe({
      next: (res) => {
        this.allComments.update(comments => 
          comments.map(c => c._id === id ? { ...c, content } : c)
        );
        this._ToastrService.success(res.message,'LinkedIn');
        this.cancelEdit();
      },
    });
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.commentForm.reset({ post: this.postId });
  }

  ngOnDestroy(): void {
    this.getPostCommentSub?.unsubscribe();
    this.createCommentSub?.unsubscribe();
    this.updateCommentSub?.unsubscribe();
  }
}