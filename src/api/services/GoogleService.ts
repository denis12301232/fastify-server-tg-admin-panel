import { google, type Auth } from 'googleapis';
import Models from '@/models/mongo/index.js';

export default class GoogleService {
  public static async auth(scopes: string[]) {
    const googleApi = await Models.Tools.findOne({ api: 'google' }).lean();

    return new google.auth.GoogleAuth({
      credentials: {
        client_email: googleApi?.settings?.serviceUser as string,
        private_key: googleApi?.settings?.servicePrivateKey as string,
      },
      scopes,
    });
  }

  public static drive(auth: Auth.GoogleAuth) {
    return google.drive({ version: 'v3', auth });
  }

  public static sheets(auth: Auth.GoogleAuth) {
    return google.sheets({ version: 'v4', auth });
  }

  public static exportUrl(id: string) {
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }

  public static sheetUrl(id: string) {
    return `https://docs.google.com/spreadsheets/d/${id}`;
  }
}
