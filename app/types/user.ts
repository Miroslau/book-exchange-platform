import Book from "@/app/types/book";
import Comment from "@/app/types/comment";
import { StaticImageData } from "next/image";

interface User {
  id: string;
  username: string;
  email: string;
  image: string | StaticImageData | null;
  books?: Book[];
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export default User;
