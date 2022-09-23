import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './schema/post.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Receive array of keys for each post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The array of keys for each post',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
  })

  @Get('/keys')
  private getPostKeys(): Promise<Post[]> {
    return this.postService.getPostKeys();
  }

  @ApiOperation({ summary: 'Delete existing posts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Posts successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
  })

  @Delete('/keys')
  private deletePosts(): Promise<string> {
    return this.postService.deletePosts();
  }

  @ApiOperation({ summary: 'Receive the post for a given key or create one.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns either new post or existing one.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
  })

  @Get('/:key')
  private getPostByKey(@Param('key') key: string): Promise<Post> {
    return this.postService.getPostByKey(key);
  }

  @ApiOperation({ summary: 'Delete a single post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The post with matching key successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Key not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
  })

  @Delete('/:key')
  private deletePostByKey(@Param('key') key: string): Promise<string> {
    return this.postService.deletePostByKey(key);
  }

  @ApiOperation({
    summary: 'Update existing post or create new one with provided data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Existing post with the key updated or creates new one with provided data.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
  })

  @Patch('/:key')
  private update(
    @Param('key') key: string,
    @Body() data: UpdatePostDto,
  ): Promise<Post> {
    return this.postService.updatePostByKey(key, data.info);
  }
}
