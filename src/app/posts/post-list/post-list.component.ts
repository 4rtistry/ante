import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from "../post.model";
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    totalposts = 0;   // ✅ Initialize to 0
    postperpage = 2;  
    pageSizeOption = [1, 2, 5, 10];  
    currentPage = 1;  // ✅ Track current page
    posts: Post[] = [];
    private postsSub!: Subscription;
    public Loading = false;

    constructor(public postsService: PostsService){}
    ngOnInit() {
        this.Loading = true;
        this.postsService.getPosts(this.postperpage, this.currentPage);
        this.postsSub = this.postsService.getPostUpdatedListener().subscribe(
            (postData: { posts: Post[]; totalPosts: number }) => {
              this.Loading = false;
              this.posts = postData.posts; // ✅ Corrected to extract `posts`
              this.totalposts = postData.totalPosts;
            }
          );          
    }

    onChangedPage(event: PageEvent) {
        this.Loading = true;
        this.currentPage = event.pageIndex + 1; // ✅ Angular Paginator uses 0-based index
        this.postperpage = event.pageSize;
        this.postsService.getPosts(this.postperpage, this.currentPage);
    }

    onDelete(postId: string){
        this.postsService.deletePost(postId);
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}