import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router'; 
import { Post } from '../post.model';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  public mode: string = 'create';  
  public postId: string | null = null; 
  public post: Post = { id: '', title: '', content: '' }; // ✅ Made public and initialized

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {  
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        if (this.postId) { // ✅ Ensure postId is a valid string before calling getPost
          const fetchedPost = this.postsService.getPost(this.postId);
          if (fetchedPost) {
            this.post = {
              id: fetchedPost.id,
              title: fetchedPost.title || '', // Handle undefined case
              content: fetchedPost.content || '' // Handle undefined case
            };
          }
        }
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = { id: '', title: '', content: '' }; // ✅ Reset post when in 'create' mode
      }
    });
  }  

  onAddPost(form: NgForm) {  
    if (form.invalid) {  
      return;  
    }  
  
    if (this.mode === "create") {  
      this.postsService.addPost(form.value.title, form.value.content);  
    } else {  
      if (this.postId) {  // Ensure postId is not null before calling updatePost
        this.postsService.updatePost(
          this.postId as string,  // Type assertion to enforce string type
          form.value.title,  
          form.value.content  
        );  
      }
    }  
  
    form.resetForm();  
  }
  
}
