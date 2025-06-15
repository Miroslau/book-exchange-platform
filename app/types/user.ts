import Book from "@/app/types/book";
import Comment from "@/app/types/comment";
import { StaticImageData } from "next/image";

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | StaticImageData | null;
  books?: Book[];
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export default User;
