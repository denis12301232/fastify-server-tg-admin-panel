import type { IUser } from '@/types/index.js';

export default class UserDto {
  readonly email: string;
  readonly _id: string;
  readonly isActivated: boolean;
  readonly name: string;
  readonly roles: string[];
  readonly login: string;
  readonly avatar: string;
  readonly status: 'online' | 'offline';

  constructor(model: IUser) {
    this.email = model.email;
    this._id = String(model._id);
    this.isActivated = model.isActivated;
    this.name = model.name;
    this.roles = model.roles;
    this.login = model.login;
    this.avatar = model.avatar;
    this.status = model.status;
  }
}
