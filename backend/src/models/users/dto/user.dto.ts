import { UserStatus } from "../entities/user.entity";

//  Dto class for User
export class UserDto {
    id: number;
    pseudo: string;
    status: UserStatus;
}