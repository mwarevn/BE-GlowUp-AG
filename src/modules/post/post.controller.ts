import { Controller } from '@nestjs/common';
import { PostService } from 'src/modules/post/post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  async getAllPosts() {
    // get all posts have visibility public and member-only
  }
}
