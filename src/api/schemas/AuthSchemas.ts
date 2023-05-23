import type { AuthTypes } from '@/types/index.js';
import Joi from 'joi';
import { Validate } from '@/util/index.js';

export default class AuthSchemas {
  static readonly userRegistrationBody = Joi.object<AuthTypes.UserRegistrationBody>()
    .keys({
      login: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string()
        .required()
        .custom((value, helper) => {
          return Validate.isEmail(value) ? value : helper.error('any.invalid');
        }),
      password: Joi.string().required().min(6).max(20),
    })
    .required();

  static readonly userLoginBody = Joi.object<AuthTypes.UserLoginBody>()
    .keys({
      loginOrEmail: Joi.string().required(),
      password: Joi.string().required(),
    })
    .required();

  static readonly userActivateParams = Joi.object<AuthTypes.UserActivateParams>()
    .keys({
      link: Joi.string().required(),
    })
    .required();

  static readonly userPasswordRestoreBody = Joi.object<AuthTypes.UserPasswordRestoreBody>()
    .keys({
      email: Joi.string()
        .required()
        .custom((value, helper) => {
          return Validate.isEmail(value) ? value : helper.error('any.invalid');
        }),
    })
    .required();

  static readonly userNewRestoredPasswordBody = Joi.object<AuthTypes.UserNewRestoredPasswordBody>()
    .keys({
      password: Joi.string().min(6).max(20),
      link: Joi.string().required(),
    })
    .required();
}
