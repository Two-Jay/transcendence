import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';

@Entity()
export class RoomChatEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column()
  public roomId: number;

  // @Column()
  // public login: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {eager: true, onDelete: 'CASCADE'})
  public member: UserEntity;
}
