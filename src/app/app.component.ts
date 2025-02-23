import { Component } from '@angular/core';

// interface Post {
//   id: number;
//   title: string;
//   content: string;
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'it_elec_6a';

  // onPostAdded(post: any): void{
  //   this.storedPosts.push(post);
  // }
  // storedPosts: Post[] = [];

  // onPostAdded(post: Post): void {
  //   this.storedPosts.push(post);
  // }
}