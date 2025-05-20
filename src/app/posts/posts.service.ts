import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service'; 

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; totalPosts: number }>();

  constructor(private http: HttpClient, private router: Router,  private authService: AuthService) {} 

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `?pagesize=${pageSize}&currentpage=${currentPage}`;
    this.http.get<{ message: string; posts: any; totalPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => ({
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator  
            })),
            totalPosts: postData.totalPosts
          };
        })
      )
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);  
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          totalPosts: transformedPostData.totalPosts
        });
      });
  }  
  
  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
  return this.http.get<{
    _id: string;
    title: string;
    content: string;
    imagePath: string;
    creator: string;          
  }>('http://localhost:3000/api/posts/' + id);
}

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
        console.log(responseData)
        const post: Post = {
            id: responseData.post.id,
            title: title,
            content: content,
            imagePath: responseData.post.imagePath,
            creator: responseData.post.creator 
          };
        this.posts.push(post);
        this.postsUpdated.next({ posts: [...this.posts], totalPosts: this.posts.length });
        this.router.navigate(["/"]);
    })
}

updatePost( id: string, title:string, content:string, image: File | string){  
  let postData: Post|FormData
   if (typeof(image) == 'object') {
       postData = new FormData();
       postData.append('id', id);
       postData.append('title', title);
       postData.append('content', content);
       postData.append('image', image, title);
   } else {
       postData = {
           id:id,
           title:title,
           content:content,
           imagePath: image,
           creator: this.authService.getUserId() 
       };  
   }
   this.http.put<{ message: string; imagePath: string }>("http://localhost:3000/api/posts/"+id,postData)
   .subscribe(response =>{  
       const updatedPosts = [...this.posts];  
       const oldPostIndex = updatedPosts.findIndex(p=> p.id===id);  
       const post: Post ={  
           id: id,  
           title: title,    
           content: content,  
           imagePath: response.imagePath,
           creator: this.authService.getUserId()
         }  
       updatedPosts[oldPostIndex] = post;  
       this.posts = updatedPosts;  
       this.postsUpdated.next({ posts: [...this.posts], totalPosts: this.posts.length });  
       this.router.navigate(["/"]);  
     });  
 }  

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`).subscribe(() => {
      console.log('Deleted');
      this.posts = this.posts.filter((post) => post.id !== postId);
      this.postsUpdated.next({ posts: [...this.posts], totalPosts: this.posts.length });
      this.router.navigate(['/']); 
    });
  }
}
