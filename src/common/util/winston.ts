import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

const logTime = () =>
  format.timestamp({
    format: () => {
      return new Date().toLocaleString('ko-KR', {
        day: '2-digit',
        month: '2-digit',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },
  });

export const WinstonLogger = (context: string) => {
  return WinstonModule.createLogger({
    transports: [
      new transports.Console({
        level: 'silly',
        format: format.combine(
          logTime(),
          format.json(),
          format.printf((info) => {
            return JSON.stringify({
              timestamp: info.timestamp,
              level: info.level,
              context: context,
              http: info.http,
              client: info.client,
              message: info.message,
              error: info.error,
            });
          }),
        ),
      }),
    ],
  });
};
