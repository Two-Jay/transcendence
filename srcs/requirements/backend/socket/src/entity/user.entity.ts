import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Ladder } from 'src/config/struct';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ unique: true })
  public login: string;

  @CreateDateColumn()
  public createAt: Date;

  @Column({ unique: true })
  public nickname: string;

  @Column()
  public avatar: string;

  @Column()
  public tfaEnable: boolean;

  @Column()
  public authConfirmCode: number;

  @Column({default: Number(Ladder.novice)})
  public ladder: number;

  @Column({default: JSON.stringify({win: 0, lose: 0})})
  public gameRatio: string

  @Column({default: 0})
  public connectionCount: number;

  @Column()
  public accessToken: string;

  @Column()
  public refreshToken: string;
}
