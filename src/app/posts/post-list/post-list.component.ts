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
    userId: string = ''; 
    totalposts = 0;
    postperpage = 5;
    pageSizeOption = [1, 2, 3, 4, 5];
    currentPage = 1;
    posts: Post[] = [];
    searchTerm: string = '';
    filteredPosts: Post[] = [];
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
      this.userId = this.authService.getUserId();  
      this.postsSub = this.postsService.getPostUpdatedListener().subscribe(
        (postData: { posts: Post[]; totalPosts: number }) => {
          this.Loading = false;
          this.posts = postData.posts;
          this.filteredPosts = [...this.posts];
          this.totalposts = postData.totalPosts;
        }
      );

      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();  
        }
      );
    }

    onSearch() {
      const term = this.searchTerm.trim().toLowerCase();
      if (!term) {
        this.filteredPosts = [...this.posts];
      } else {
        this.filteredPosts = this.posts.filter(post =>
          post.title.toLowerCase().includes(term)
        );
      }
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
