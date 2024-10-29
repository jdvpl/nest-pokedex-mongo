import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  name: string;
  @Prop({
    index: true,
    max: 10,
  })
  level: number;
  @Prop({
    index: true,
  })
  trainer: string;
  @Prop({ type: [String] })
  abilities: string[];
}
export const PockemonSchema = SchemaFactory.createForClass(Pokemon);
