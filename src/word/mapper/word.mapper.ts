import { Xml2Json } from 'src/common/util/xml2json';

export async function parseXmlToJson(xmlData: string): Promise<any> {
  return Xml2Json.parse(xmlData);
}

export function mapJsonToStructuredData(jsonData: any): any {
  const channel = jsonData.channel;

  // Normalize `item` to always be an array
  const items = Array.isArray(channel.item) ? channel.item : [channel.item];

  return {
    title: channel.title,
    description: channel.description,
    totalResults: parseInt(channel.total, 10),
    items: items.map((item) => ({
      word: item.word,
      pronunciation: item.pronunciation,
      pos: item.pos,
      link: item.link,
      meanings: Array.isArray(item.sense)
        ? item.sense.map((sense) => ({
            order: parseInt(sense.sense_order, 10),
            definition: sense.definition,
          }))
        : [
            {
              order: parseInt(item.sense.sense_order, 10),
              definition: item.sense.definition,
            },
          ],
    })),
  };
}
