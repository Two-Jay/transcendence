import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const transcendenceTypeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'noname',
  password: '1111',
  database: 'transcendence',
  synchronize: true,
  logging: true,
  entities: [
    __dirname + '/../entity/user.entity.{js,ts}',
    __dirname + '/../entity/socket.entity.{js,ts}',
    __dirname + '/../entity/game.entity.{js,ts}',
    __dirname + '/../entity/relation.entity.{js,ts}',
  ],
};
