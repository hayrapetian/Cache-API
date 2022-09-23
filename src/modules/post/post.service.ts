import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Post, PostDocument } from './schema/post.schema';
import { Document, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { generateRandomString, isTTLExceeded } from '@lib/utils';
import { isLimitReached } from '@utils/isLimitReached.util';
import { generatePostExpirationDate } from '@utils/generate-post-expiration-date.util';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  public async getPostByKey(
    key: string,
  ): Promise<Post & Document & { _id: Types.ObjectId }> {
    try {
      //find key in keys collection
      const cachedPost = await this.postModel.findOne({ key }).exec();

      const post_expiration_date = generatePostExpirationDate();
      const randomString = generateRandomString();

      if (!cachedPost) {
        this.logger.warn('Cache Miss');

        // check if post limit is reached
        const isLimitReached = await this.isLimitReached();

        if (isLimitReached) {
          return this.updateOldPost(key, randomString, post_expiration_date);
        }

        const createdPost = new this.postModel({
          key,
          info: randomString,
          post_expiration_date,
        });
        createdPost.save();
        return createdPost;
      }
      this.logger.log('Cache Hit');

      const ttlExceeded = isTTLExceeded(cachedPost.post_expiration_date);

      return this.postModel.findOneAndUpdate(
        { key },
        ttlExceeded
          ? { post_expiration_date }
          : { post_expiration_date, info: randomString },
        {
          new: true,
        },
      );
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async receiveOldestPost(): Promise<
    Post & Document & { _id: Types.ObjectId }
  > {
    try {
      return this.postModel.findOne({}).sort({ updated_At: 1 });
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async isLimitReached(): Promise<boolean> {
    try {
      const postCount = await this.postModel.count();
      return isLimitReached(postCount);
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updatePostByKey(key: string, info: string): Promise<Post> {
    try {
      const post = await this.getPostByKey(key);
      const post_expiration_date = generatePostExpirationDate();

      return this.postModel.findByIdAndUpdate(
        post._id,
        { info, post_expiration_date },
        {
          new: true,
        },
      );
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async updateOldPost(
    key: string,
    info: string,
    post_expiration_date: number,
  ): Promise<Post & Document & { _id: Types.ObjectId }> {
    try {
      const post = await this.receiveOldestPost();

      return this.postModel.findByIdAndUpdate(
        post.id,
        {
          key,
          info,
          post_expiration_date,
        },
        {
          new: true,
        },
      );
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public getPostKeys(): Promise<Post[]> {
    try {
      return this.postModel.find({}, { key: 1, _id: 0 }).exec();
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deletePosts(): Promise<string> {
    try {
      await this.postModel.deleteMany().exec();
      return 'Posts successfully deleted.';
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deletePostByKey(key: string): Promise<string> {
    const deleteResult = await this.postModel.deleteOne({ key }).exec();
    if (deleteResult.deletedCount) {
      return 'Key successfully deleted.';
    }
    throw new HttpException('Key not found.', HttpStatus.BAD_REQUEST);
  }
}
