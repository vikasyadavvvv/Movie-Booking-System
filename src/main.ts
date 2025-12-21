import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  console.log('🚀 Starting application...');

  const app = await NestFactory.create(AppModule);
  console.log('✅ Nest application created');

  const dataSource = app.get(DataSource);

  if (!dataSource.isInitialized) {
    console.log('🔌 Initializing database connection...');
    await dataSource.initialize();
  }

  console.log('📦 Running database migrations...');
  const migrations = await dataSource.runMigrations();

  if (migrations.length === 0) {
    console.log('ℹ️ No pending migrations');
  } else {
    console.log(`✅ ${migrations.length} migration(s) applied`);
    migrations.forEach(m => {
      console.log(`   • ${m.name}`);
    });
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🌍 Server running on port ${port}`);
}

bootstrap().catch(err => {
  console.error('❌ Application failed to start');
  console.error(err);
  process.exit(1);
});
