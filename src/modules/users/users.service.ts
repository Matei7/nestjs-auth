import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

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
      console.log(err);
    }
  }

  async findOne(id: number) {
    return UserEntity.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('UserEntity')
      .addSelect('UserEntity.password')
      .where('UserEntity.email = :email', { email })
      .getOne();
  }
}
