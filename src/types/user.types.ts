import { Document } from "mongoose";

export type User = Document & {
  name: string;
  email: string;
  password: string;
};
