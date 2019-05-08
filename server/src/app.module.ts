import { Module, MiddlewareConsumer } from '@nestjs/common';
import { CompressionMiddleware } from '@nest-middlewares/compression';
import { AdminModule } from './admin/admin.module';
import { MongoRepoModule } from 'mongo-nest';
import { MFModule } from './mf/mf.module';
import { MacroModule } from './macro/macro.module';
import { TadorModule } from './tador/tador.module';
@Module({
  imports: [
    MFModule,
    MacroModule,
    AdminModule,
    TadorModule,
    MongoRepoModule.forRoot('mongodb://localhost:27017'),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CompressionMiddleware).forRoutes('*');
  }
}
