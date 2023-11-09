import { inject, injectable } from 'inversify';
import {Component} from '../../types/component.type.js';
import {ConfigSchema} from '../../modules/config/config.schema.js';
import {ConfigInterface} from '../../modules/config/config.interface.js';
import {LoggerInterface} from '../../modules/logger/logger.interface.js';
import {getMongoURI} from '../../common/db.js';
import {DatabaseClient} from '../../modules/db-client/db-client.interface.js';

@injectable()
export class Application {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.ConfigInterface) private readonly config: ConfigInterface<ConfigSchema>,
    @inject(Component.DatabaseClientInterface) private readonly databaseClient: DatabaseClient
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    this.logger.info('База данных инициализируется');
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);
    this.logger.info('База данных инициализирована');
  }
}
