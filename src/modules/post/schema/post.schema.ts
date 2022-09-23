import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

export type PostDocument = Post & Document;

@Schema()
export class Post {

    @Prop({isRequired: true})
    key: string;

    @Prop({isRequired: true})
    info: string;

    // for cache TTL, used Unix date for default value.
    @Prop({isRequired: true, default: moment().valueOf()})
    post_expiration_date: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
