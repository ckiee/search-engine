import { prop, Typegoose, ModelType, InstanceType } from "typegoose";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/test");
export class Link extends Typegoose {
    @prop()
	link?: string;
	@prop()
	meta?: Map<string, string>
	@prop()
	title?: string
}

export default new Link().getModelForClass(Link);