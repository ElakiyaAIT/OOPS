import { Prop,Schema,SchemaFactory}from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role{
    @Prop({unique:true, required:true})
    name:string;

    @Prop()
    description:string;

    @Prop({default:true})
    isActive:boolean;
}

export const RoleSchema=SchemaFactory.createForClass(Role);