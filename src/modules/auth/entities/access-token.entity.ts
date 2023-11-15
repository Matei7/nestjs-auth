import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  ObjectId,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'access-tokens' })
export class AccessToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: ObjectId;

  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.id, {
    cascade: true,
  })
  user: UserEntity | number;

  @Column()
  @RelationId((accessToken: AccessToken) => accessToken.user)
  userId: number;

  @Column()
  tokenId: string;
}
