import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {} // ✅ Inject Router

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return { ...this.posts.find((p) => p.id === id) };
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);

        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']); // ✅ Navigate to home after adding a post
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http.put(`http://localhost:3000/api/posts/${id}`, post).subscribe((response) => {
      console.log(response);

      this.router.navigate(['/']); // ✅ Navigate to home after updating a post
    });
  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`).subscribe(() => {
      console.log('Deleted');
      this.posts = this.posts.filter((post) => post.id !== postId);
      this.postsUpdated.next([...this.posts]);

      this.router.navigate(['/']); // ✅ Navigate to home after deleting a post
    });
  }
}
