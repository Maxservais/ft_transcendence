import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarDto } from './dto/avatar.dto';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { Avatar } from './entities/avatar.entity';

@Injectable()
export class AvatarsService {
  constructor(
    @InjectRepository(Avatar) private avatarRepository: Repository<Avatar>) {}

  public async entityToDto(avatar: Avatar) {
    const avatarDto: AvatarDto = new AvatarDto();
    avatarDto.data = avatar.data;
    avatarDto.id = avatar.id;
    avatarDto.user = avatar.user;

    return avatarDto;
  }

  public async create(createAvatarDto: CreateAvatarDto) {
      const avatar: Avatar = new Avatar();
      avatar.user = createAvatarDto.user;
      avatar.data = createAvatarDto.data;
  
      await this.avatarRepository.save(avatar);

      const avatarDto: AvatarDto = await this.entityToDto(avatar);
  
      return avatarDto;
  }

  public async findOneById(id: number)
  {
    const avatar: Avatar = await this.avatarRepository.findOneBy({id: id});

    const avatarDto: AvatarDto = await this.entityToDto(avatar);

    return avatarDto;
  }

  findAll() {
    return `This action returns all avatars`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avatar`;
  }

  remove(id: number) {
    return `This action removes a #${id} avatar`;
  }
}