import mongoDbPlugin from './mongoDbPlugin.js';
import redisPlugin from './redisPlugin.js';
import socketIoPlugin from './socketIoPlugin.js';
import staticFoldersCreatePlugin from './staticFoldersCreatePlugin.js';

export default class Plugins {
  static redis = redisPlugin;
  static mongo = mongoDbPlugin;
  static io = socketIoPlugin;
  static staticFolders = staticFoldersCreatePlugin;
}
