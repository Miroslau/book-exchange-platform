interface Book {
  author: string;
  categories: string[];
  createdAt: string;
  description: string;
  id: number;
  images: string[];
  owner: {
    avatar: string;
    email: string;
    id: number;
    username: string;
  };
  title: string;
}

export default Book;
