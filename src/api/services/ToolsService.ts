import type {  ToolsTypes } from '@/types/index.js';
import Models from '@/models/mongo/index.js';

export default class ToolsService {
  static async setGoogleServiceAccountSettings(settings: ToolsTypes.SetGoogleServiceAccountSettings['Body']) {
    const { serviceUser, servicePrivateKey, sheetId, folderId } = settings;
    const google = await Models.Tools.findOne({ api: 'google' });

    if (!google) {
      await Models.Tools.create({
        api: 'google',
        settings: {
          serviceUser: serviceUser,
          servicePrivateKey: servicePrivateKey.replace(/\\n/g, '\n'),
          sheetId: sheetId,
          folderId: folderId,
        },
      });
    } else {
      if (serviceUser) google.settings.serviceUser = serviceUser;
      if (servicePrivateKey) google.settings.servicePrivateKey = servicePrivateKey.replace(/\\n/g, '\n');
      if (sheetId) google.settings.sheetId = sheetId;
      if (folderId) google.settings.folderId = folderId;

      google.markModified('settings');
      await google.save();
    }
    return { message: 'Saved' };
  }
}
