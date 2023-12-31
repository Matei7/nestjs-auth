import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { UserRolesEnum } from '../../../config/constants/auth.constants';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ select: false })
  password: string;

  @Column('simple-array')
  roles: UserRolesEnum[] = [UserRolesEnum.CLIENT];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      try {
        this.password = await hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException(
          'there are some issue in the hash',
        );
      }
    }
  }
}
