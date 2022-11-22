// import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';

import { RelationEntity } from 'src/entity/relation.entity';
import { UserEntity } from 'src/entity/user.entity';
// import { GameEntity } from 'src/entity/game.entity';

import { RelationRepository } from 'src/repository/relation.repository';
import { InjectRepository } from '@nestjs/typeorm';
// import { GameRepository } from 'src/repository/game.repository';
import { UserRepository } from 'src/repository/user.repository';

// import { Cache } from 'cache-manager'
import { Relation } from 'src/config/struct';

const standby: string = "standby";

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: UserRepository,
    // @InjectRepository(GameEntity)
    // private gameRepository: GameRepository,
    @InjectRepository(RelationEntity)
    private relationRepository: RelationRepository,

    // @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
  ) {}

  async whoIsOnline(login: string): Promise<boolean> {
    const user = await this.whoIsUser(login);
    if (!user) return false;

    return 0 < user.connectionCount;
    // const online = await this.cacheManager.get(login);
    // return !!online;
  }

  async whoIsUser(login: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { login } });
  }

  // async updateSocketRepository(login: string, value: string): Promise<void> {
  //   const result = await this.cacheManager.get(login);
  //   if (result === null) throw new BadRequestException();

  //   await this.cacheManager.set(login, value);
  // }

  // async deleteUser(login: string): Promise<void> {
  //   const user = await this.whoIsUser(login);
  //   const deleteUser = await this.userRepository.delete(user.id);
  //   if (deleteUser.affected === 0) throw new BadRequestException();
  // }

  async saveUserRepository(user: UserEntity): Promise<void> {
    await this.userRepository.save(user);
  }

  async updateUserNickname(login: string, nickname: string): Promise<void> {
    const dup = await this.userRepository.findOne({where: {nickname}})
    if (!!dup) throw new BadRequestException();

    const user = await this.whoIsUser(login);
    if (!user || user.nickname === nickname) throw new BadRequestException();

    user.nickname = nickname;
    const updated = await this.userRepository.save(user);
    if (updated.nickname !== nickname) throw new BadRequestException();
  }

  async updateUserAvatar(login: string, avatar: string): Promise<void> {
    const user = await this.whoIsUser(login);
    if (!user || user.avatar === avatar) throw new BadRequestException();

    user.avatar = avatar;
    const updated = await this.userRepository.save(user);
    if (updated.avatar !== avatar) throw new BadRequestException();
  }

  async findRelationEntity(owner: string, other: string): Promise<RelationEntity> {
    const query = await this.relationRepository
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.owner', 'owner')
      .leftJoinAndSelect('relation.other', 'other')
      .where('owner.login=:owner', {owner})
      .andWhere('other.login=:other', {other})
      .getOne();

    return query;
  }

  async isFriend(owner: string, friend: string): Promise<RelationEntity> {
    const query = await this.findRelationEntity(owner, friend);
    return (query && 0 < (Number(query.relation) & Number(Relation.friend))) ? query : null;
  }

  async addFriend(owner: UserEntity, friend: UserEntity): Promise<void> {
    const relationEntity = await this.findRelationEntity(owner.login, friend.login) ?? new RelationEntity();

    relationEntity.relation |= Relation.friend;
    relationEntity.owner = owner;
    relationEntity.other = friend;
    
    await this.relationRepository.save(relationEntity);
  }

  async removeFriend(entity: RelationEntity): Promise<void> {
    entity.relation &= ~Relation.friend;

    if (entity.relation === Relation.none)
      await this.relationRepository.delete(entity.id);
    else
      await this.relationRepository.save(entity);
  }

  async isBlock(owner: string, block: string): Promise<RelationEntity> {
    const query = await this.findRelationEntity(owner, block);
    return (query && 0 < (Number(query.relation) & Number(Relation.block))) ? query : null;
  }

  async addBlock(owner: UserEntity, block: UserEntity): Promise<void> {
    const relationEntity = await this.findRelationEntity(owner.login, block.login) ?? new RelationEntity();

    relationEntity.relation |= Relation.block;
    relationEntity.owner = owner;
    relationEntity.other = block;
    
    await this.relationRepository.save(relationEntity);
  }

  async removeBlock(entity: RelationEntity): Promise<void> {
    entity.relation &= ~Relation.block;

    if (entity.relation === Relation.none)
      await this.relationRepository.delete(entity.id);
    else
      await this.relationRepository.save(entity);
  }





  /* test code */
  // async findWhoInSession(login: string): Promise<boolean> {
  //   return (await this.cacheManager.get(login)) !== null;
  //   // return await this.socketRepository.findOne({ where: { login } });
  // }

  /* test code */
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
  
  // /* test code */
  // async findAll2(): Promise<SocketEntity[]> {
  //   return await this.socketRepository.find();
  // }

  /* test code */
}
