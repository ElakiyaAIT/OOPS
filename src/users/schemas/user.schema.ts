import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USERROLE } from 'src/common/enums/user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

   @Prop({ required: true, select: false })
  password: string;

  @Prop({
    type:[{type:Types.ObjectId, ref:'Role'}],
    default:[],
  })
  role:Types.ObjectId[];

  @Prop()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
