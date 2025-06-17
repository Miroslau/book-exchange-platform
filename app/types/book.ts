export interface BookImage {
  id: string;
  url: string;
  hash: string;
  bookId: number;
  createdAt: string;
  updatedAt: string;
}

interface Book {
  author: string;
  categories: string[];
  createdAt: string;
  description: string;
  id: number;
  images: BookImage[];
  owner: {
    avatar: string;
    email: string;
    id: number;
    username: string;
  };
  title: string;
}

export default Book;
