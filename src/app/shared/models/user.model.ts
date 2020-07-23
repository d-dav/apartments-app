import { UserRole } from './user-role';

export class UserModel {
  constructor(
    public email: string,
    public firstname: string,
    public lastname: string,
    public role: UserRole,
    public verified: boolean,
    public _id?: string,
  ) { }
}
