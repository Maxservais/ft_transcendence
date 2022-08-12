import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/models/users/users.module';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './strategies/42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule, 
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret, // env variable.
      signOptions: { expiresIn: '1d' },
    })
  ],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}