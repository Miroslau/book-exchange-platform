import Book from "@/app/types/book";
import User from "@/app/types/user";

interface Comment {
  id: number;
  text: string;
  book: Book;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export default Comment;
