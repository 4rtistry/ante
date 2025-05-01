import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from "../post.model";
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  totalposts = 0;
  postperpage = 10;
  pageSizeOption = [1, 2, 5, 10];
  currentPage = 1;
  posts: Post[] = [];
  public Loading = false;
  public userIsAuthenticated = false;

  private postsSub!: Subscription;
  private authStatusSub!: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.Loading = true;
    this.postsService.getPosts(this.postperpage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdatedListener().subscribe(
      (postData: { posts: Post[]; totalPosts: number }) => {
        this.Loading = false;
        this.posts = postData.posts;
        this.totalposts = postData.totalPosts;
      }
    );

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  onChangedPage(event: PageEvent) {
    this.Loading = true;
    this.currentPage = event.pageIndex + 1;
    this.postperpage = event.pageSize;
    this.postsService.getPosts(this.postperpage, this.currentPage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
