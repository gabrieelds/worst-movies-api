import { DataSource } from 'typeorm';

export const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../../src/**/entities/*.entity.{ts,js}'],
});