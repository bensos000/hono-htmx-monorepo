export interface ITodo {
  id?: string;
  content?: string | null;
  timestamp?: string | null;
  completed?: boolean | null;
  editable?: boolean | null;
  user: string;
}

export interface IUsers {
  id: string;
  username: string;
  password: string;
  roles: string[] | [];
}