import type { CommentTypes } from '@/types/index.js';
import Joi from 'joi';

export default class CommentSchemas {
  static readonly store = {
    body: Joi.object<CommentTypes.Store['Body']>()
      .keys({
        text: Joi.string().max(300).required(),
        mediaId: Joi.string().required(),
      })
      .required(),
  };

  static readonly index = {
    querystring: Joi.object<CommentTypes.Index['Querystring']>()
      .keys({
        mediaId: Joi.string().required(),
        skip: Joi.number(),
        limit: Joi.number().min(1).required(),
        descending: Joi.boolean(),
        sort: Joi.string(),
      })
      .required(),
  };

  static readonly update = {
    params: Joi.object<CommentTypes.Update['Params']>().keys({ id: Joi.string().required() }).required(),
    body: Joi.object<CommentTypes.Update['Body']>().keys({ reactions: Joi.array().items(Joi.string()) }),
  };
}
