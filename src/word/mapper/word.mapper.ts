import { Xml2Json } from 'src/common/util/xml2json';

export async function parseXmlToJson(xmlData: string): Promise<any> {
  return Xml2Json.parse(xmlData);
}
export function mapJsonToStructuredData(jsonData: any): any {
  const channel = jsonData.channel;

  const items = channel.item ? (Array.isArray(channel.item) ? channel.item : [channel.item]) : [];

  return {
    total: parseInt(channel.total, 10),
    items: items.map((item) => ({
      word: item.word,
      pos: item.pos,
      meanings: item.sense
        ? Array.isArray(item.sense)
          ? item.sense.map((sense) => ({
              order: parseInt(sense.sense_order, 10),
              definition: sense.definition,
            }))
          : [
              {
                order: parseInt(item.sense.sense_order, 10),
                definition: item.sense.definition,
              },
            ]
        : [],
    })),
  };
}

export function transformAndExtractDefinitions(data: any): any {
  const { items } = data;

  // Limit items to a maximum of 3
  const limitedItems = items.slice(0, 3);

  // Map through limited items to structure the definitions
  const definitions = limitedItems.map((item) => ({
    pos: item.pos,
    // Limit meanings to a maximum of 3
    meanings: item.meanings.slice(0, 3).map((meaning) => meaning.definition),
  }));

  return definitions;
}
