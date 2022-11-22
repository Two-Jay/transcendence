import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';

@Entity()
export class RoomGameEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column()
  public roomId: number;

  // @Column()
  // public login: string;

  @Column()
  public isPlayer: boolean;

  @ManyToOne(() => UserEntity, (user) => user.id)
  // @JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
  public member: UserEntity;

  // @OneToOne(() => UserEntity)
  // // @JoinColumn()
  // public target: UserEntity;
}
