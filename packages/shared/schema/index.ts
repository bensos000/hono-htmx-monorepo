export interface ITodo {
  id?: string;
  content?: string;
  timestamp?: string;
  completed?: boolean;
}

export interface IUsers {
  id: string;
  username: string;
  password: string;
  roles: string[] | [];
}