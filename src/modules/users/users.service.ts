import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UsersService {
  async getAllUsers() {
    return await UserEntity.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = await UserEntity.create({ ...createUserDto }).save();
      return user.id;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('User already exists');
      }
    }
  }
}
