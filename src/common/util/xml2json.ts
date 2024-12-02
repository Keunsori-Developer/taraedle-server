import * as xml2js from 'xml2js';

export class Xml2Json {
  private static parser = new xml2js.Parser({ explicitArray: false });

  static async parse(xmlData: string): Promise<any> {
    try {
      return await this.parser.parseStringPromise(xmlData);
    } catch (error) {
      throw new Error(`Failed to parse XML: ${error.message}`);
    }
  }
}
