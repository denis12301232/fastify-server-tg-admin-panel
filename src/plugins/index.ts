import mongoDbPlugin from './mongoDbPlugin'
import socketIoPlugin from './socketIoPlugin'
import staticFoldersCreatePlugin from './staticFoldersCreatePlugin'
import redisPlugin from './redisPlugin'


export default class Plugins {
   static mongoDbPlugin = mongoDbPlugin;
   static socketIoPlugin = socketIoPlugin;
   static staticFoldersCreatePlugin = staticFoldersCreatePlugin;
   static redisPlugin = redisPlugin;
}