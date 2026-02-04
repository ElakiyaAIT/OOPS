import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import {Role, RoleDocument} from '../roles/schema/role.schema';


async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<UserDocument>>(
    getModelToken(User.name),
  );

  const roleModel = app.get<Model<RoleDocument>>(
  getModelToken(Role.name),
);

let adminRole = await roleModel.findOne({ name: 'admin' });

if (!adminRole) {
  adminRole = await roleModel.create({ name: 'admin' });
  console.log(' Admin role created');
}

  console.log(' Seeding users...');

  const existingUser = await userModel.findOne({
    email: 'admin@example.com',
  });
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

  if (!existingUser) {
    await userModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password:hashedPassword,
      role:[adminRole._id],
      age: 30,
    });

    console.log(' Admin user created');
  } else {
    console.log(' Admin user already exists');
  }

  await app.close();
  process.exit(0);
}

bootstrap();
