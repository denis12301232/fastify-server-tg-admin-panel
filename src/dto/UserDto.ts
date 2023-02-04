import type { LeanDocument, Types } from 'mongoose'
import type { IUser } from '@/types/interfaces'


export class UserDto {
    readonly email: string;
    readonly _id: string;
    readonly isActivated: boolean;
    readonly name: string;
    readonly roles: string[];
    readonly login: string;
    readonly avatar: string;
    readonly status: 'online' | 'offline';

    constructor(model: LeanDocument<IUser & { _id: Types.ObjectId }>) {
        this.email = model.email;
        this._id = model._id.toString();
        this.isActivated = model.isActivated;
        this.name = model.name;
        this.roles = model.roles;
        this.login = model.login;
        this.avatar = model.avatar;
        this.status = model.status;
    }
}