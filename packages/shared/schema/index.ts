export interface ITodo {
  id?: string;
  content?: string;
  timestamp?: string;
  completed?: boolean;
  editable?: boolean;
}

export interface IUsers {
  id: string;
  username: string;
  password: string;
  roles: string[] | [];
}