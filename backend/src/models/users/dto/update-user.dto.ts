import { PartialType } from '@nestjs/mapped-types';
import { UserStatus } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    pseudo?: string;
    status?: UserStatus;
}