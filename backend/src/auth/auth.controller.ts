import { Controller, Get, UseGuards, Req, Res, Post, Body, UnauthorizedException, Delete, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { Request, Response } from 'express';
import { UserDto } from 'src/models/users/dto/user.dto';
import { JwtTwoFactAuthGuard } from './guards/jwt-2fa.guard';

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
    async fortyTwoAuthCallback(
      @Req() req: Request,
      @Res({passthrough: true}) res: Response
      ) {
      //  Find user or signup if does not exist
      let userDto: UserDto = await this.authService.fetchUser(req.user);

      //  If the user is not registered in our database, we create one.
      if (!userDto) {
        userDto = await this.authService.signup(req.user);
      }

      //  Create and store jwt token to enable connection
      const accessToken = await this.authService.generateToken({ 
        sub: userDto.id, 
        IsTwoFactAuth: false
      });
      res.cookie('jwt', accessToken, { httpOnly: true });
    
      //  Redirect to the frontend
      res.status(302).redirect(`http://${process.env.REACT_HOST}:${process.env.REACT_PORT}`);
    }

    @UseGuards(JwtTwoFactAuthGuard)
    @Get('isLogged')
    async isLoggedIn() {
      return {loggedIn: true};
    }
  
    // User logout
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Delete('logout')
    async logout(@Res({passthrough: true}) response: Response) {
      response.clearCookie('jwt');
    }
    
    // Generate QrCode
    @UseGuards(JwtAuthGuard)
    @Get('2fa/generate')
    async generate(@Req() req: Request, @Res() res: Response) {
      
      //  Generate a new token // To change so it can verify if the setup is ok
      const user: any = req.user;
      const accessToken = await this.authService.generateToken({
        sub: user.id,
        isTwoFactAuth: true
      });
      res.cookie('jwt', accessToken, { httpOnly: true });
      
      //  Generate the secret for the user and the qrCode
      const otpauthUrl = await this.authService.generateTwoFactAuthSecret(user);
      return this.authService.pipeQrCodeStream(res, otpauthUrl);
    }
    
    // Qr code auth verification
    @UseGuards(JwtTwoFactAuthGuard)
    @Post('2fa')
    async verifyTwoFactAuth(
      @Req() req: Request, 
      @Body() body, 
      @Res() res: Response
      ) {
      const user: any = req.user;
      const isCodeValid = this.authService.verifyTwoFactAuth(body.twoFactAuth, user);

      if (!isCodeValid) {
        if (user.twoFactAuth === false) {
          return {valid: false};
        }
        throw new UnauthorizedException('Wrong authentication code');
      }

      if (user.twoFactAuth == false) {
        await this.authService.turnOnTfa(user);
      }

      //  Create and store jwt token to enable connection
      const accessToken = await this.authService.generateToken({
        sub: user.id,
        isTwoFactAuth: true,
      });

      res.cookie('jwt', accessToken, { httpOnly: true });
      
      return {valid: true};
    }
  }