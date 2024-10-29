import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  name: string;
  type: string;
  @Prop({
    index: true,
    max: 10,
  })
  level: number;
  @Prop({
    index: true,
  })
  trainer: string;
  abilities: string[];
  @Prop({
    index: true,
  })
  dateCaught: Date;
}
export const PockemonSchema = SchemaFactory.createForClass(Pokemon);
