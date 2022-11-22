import { GameResult } from 'src/config/struct';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;
  
  @Column()
  public roomId: number;

  @Column()
  public login: string;

  @Column()
  public enemy: string;

  @Column()
  public result: GameResult;

  @Column()
  public begin: Date;

  @Column()
  public end: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, {eager: true, onDelete: 'CASCADE'})
  public owner: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, {eager: true, onDelete: 'CASCADE'})
  public other: UserEntity;
}
