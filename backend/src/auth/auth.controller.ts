import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // This function is used to login thanks to the guard.
    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    async login(@Req() req: Request) {}
    
    // Function called by 42 strategy
    @UseGuards(FortyTwoAuthGuard)
    @Get('42/callback')
    async loginCallback(
      @Req() req: Request,
      @Res({passthrough: true}) res: Response
      ) {
      const accessToken = await this.authService.auth42(req);

      //  Store accessToken

      res.cookie('jwt', accessToken, { httpOnly: true });
      
      return req.user;
    }

    // Check if user is logged in.
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Req() req: Request) {
      return req.user;
    }
  }