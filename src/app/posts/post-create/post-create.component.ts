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
  public Loading = false;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {  
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        this.Loading = true;

        if (this.postId) { 
          this.postsService.getPost(this.postId).subscribe(postData => {
            this.Loading = false;
            this.post = {id: postData._id, title:postData.title, content:postData.content}  
          })
          
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

    this.Loading = true;
  
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
