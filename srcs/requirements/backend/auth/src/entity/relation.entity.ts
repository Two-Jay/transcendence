import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { Relation } from 'src/config/struct';

@Entity()
export class RelationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({default: Relation.none})
  public relation: Relation;
  
  @ManyToOne(() => UserEntity, (user) => user.id, {eager: true, onDelete: 'CASCADE'})
  public owner: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, {eager: true, onDelete: 'CASCADE'})
  public other: UserEntity;
}
