import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './book.model';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
// import { LibraryController } from "./library.controller";
// import { LibraryService } from "./library.service";
import redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    SequelizeModule.forFeature([Book]),
    CacheModule.register({
      store: redisStore,
      host: 'cache',
      port: 6379,
      ttl: 5,
    }),
  ],
  providers: [
    LibraryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [LibraryController],
})
export class LibraryModule {}
