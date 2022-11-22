import { Injectable } from '@nestjs/common';

import { RoomChatEntity } from 'src/entity/room.chat.entity';
import { RoomGameEntity } from 'src/entity/room.game.entity';
import { RelationEntity } from 'src/entity/relation.entity';
import { UserEntity } from 'src/entity/user.entity';
import { GameEntity } from 'src/entity/game.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { RoomChatRepository } from 'src/repository/room.chat.repository';
import { RoomGameRepository } from 'src/repository/room.game.repository';
import { RelationRepository } from 'src/repository/relation.repository';
import { GameRepository } from 'src/repository/game.repository';
import { UserRepository } from 'src/repository/user.repository';

import { GameResult, IDetail, Relation } from 'src/config/struct';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(RoomChatEntity)
    private roomChatRepository: RoomChatRepository,
    @InjectRepository(RoomGameEntity)
    private roomGameRepository: RoomGameRepository,
    @InjectRepository(RelationEntity)
    private relationRepository: RelationRepository,
    @InjectRepository(UserEntity)
    private userRepository: UserRepository,
    @InjectRepository(GameEntity)
    private gameRepository: GameRepository,
  ) {}

  async whoIsUser(login: string): Promise<UserEntity> {
    return await this.userRepository.findOne({where: {login}});
  }

  ////////////////////////
  // chat service begin //
  ////////////////////////
  async isChatMember(login: string, roomId: number): Promise<RoomChatEntity> {
    const entity = await this.roomChatRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.member', 'member')
      .where('room.roomId=:roomId', {roomId})
      .andWhere('member.login=:login', {login})
      .getOne();
    
    return entity;
  }

  async addChatMember(login: string, roomId: number): Promise<void> {
    const entity = await this.isChatMember(login, roomId) ?? new RoomChatEntity();
    const user = await this.whoIsUser(login);
    
    entity.roomId = roomId;
    entity.member = user;

    await this.roomChatRepository.save(entity);
  }

  async removeChatMember(login: string, roomId: number): Promise<void> {
    const entity = await this.isChatMember(login, roomId);
    if (!entity) return;
// console.log('owner =', login, '\n[BEFORE CHECK] > remain chat room member detail < [CHECK]\n', 
// await this.roomChatMemberDetail(roomId));

    await this.roomChatRepository.delete(entity.id);

// console.log('owner =', login, '\n[AFTER CHECK] > remain chat room member detail < [CHECK]\n', 
// await this.roomChatMemberDetail(roomId));
  }

  async roomChatMemberDetail(roomId: number): Promise<IDetail[]> {
    const query = await this.roomChatRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.member', 'member')
      .where('room.roomId=:roomId', {roomId})
      .getMany();

    const memberArray = Array.from(query, e => e.member);
    return await this.getDetail(memberArray, null, null);
  }
  //////////////////////
  // chat service end //
  //////////////////////



  ////////////////////////
  // game service begin //
  ////////////////////////
  async isGameMember(login: string, roomId: number): Promise<RoomGameEntity> {
    const entity = await this.roomGameRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.member', 'member')
      .where('room.roomId=:roomId', {roomId})
      .andWhere('member.login=:login', {login})
      .getOne();
    return entity;
  }

  async addGameMember(login: string, roomId: number, isPlayer: boolean): Promise<void> {
    const entity = await this.isGameMember(login, roomId) ?? new RoomGameEntity();
    const user = await this.whoIsUser(login);

    entity.isPlayer = isPlayer;
    entity.roomId = roomId;
    entity.member = user;

    await this.roomGameRepository.save(entity);
  }

  async removeGameMember(login: string, roomId: number): Promise<void> {
    const entity = await this.isGameMember(login, roomId);
    if (!entity) return;

    await this.roomGameRepository.delete(entity.id);
  }

  async roomGameMemberDetail(roomId: number): Promise<IDetail[]> {
    const query = await this.roomGameRepository
      .createQueryBuilder('item')
      .where('item.roomId=:roomId', {roomId})
      .leftJoinAndSelect('item.target', 'member')
      .getMany();

    const memberArray = Array.from(query, e => e.member);
    return await this.getDetail(memberArray, null, null);
  }

  async saveGameEntity(entity: GameEntity): Promise<void> {
    const owner = await this.userRepository.findOne({where: {login: entity.login}});
    const other = await this.userRepository.findOne({where: {login: entity.enemy}});

    entity.owner = owner;
    entity.other = other;
    
    await this.gameRepository.save(entity);
  }

  async endGame(roomId: number, winner: string) {
console.log('\n\n', '>> ENTER ENDGAME << \n>> THIS CALL ONCE! << \n roomId:', roomId, 'winner:', winner, '\n\n')
    const entityArray: GameEntity[] = await this.gameRepository.find({where: {roomId}});
    const endTime = new Date();

    if (entityArray.length !== 2) {
      console.log('Somethig Wrong', entityArray.length, '\n', entityArray);
      return;
    }

    if (winner === entityArray[0].login) {
      entityArray[0].result = GameResult.win;
      entityArray[1].result = GameResult.lose;
    } else if (winner === entityArray[1].login) {
      entityArray[0].result = GameResult.lose;
      entityArray[1].result = GameResult.win;
    } else {
      entityArray[0].result = GameResult.tie;
      entityArray[1].result = GameResult.tie;
    }

    entityArray[0].end = endTime;
    entityArray[1].end = endTime;

    this.gameRepository.save(entityArray);

    const user0 = await this.whoIsUser(entityArray[0].login);
    if (!user0) return;
    const user0Ratio = JSON.parse(user0.gameRatio);

    const user1 = await this.whoIsUser(entityArray[1].login);
    if (!user1) return;
    const user1Ratio = JSON.parse(user1.gameRatio);

    if (user0.login === winner) {
      ++user0.ladder;
      user1.ladder = Math.max(0, user1.ladder - 1);

      ++user0Ratio.win;
      ++user1Ratio.lose;
    }
    else {
      user0.ladder = Math.max(0, user0.ladder - 1);
      ++user1.ladder;

      ++user0Ratio.lose;
      ++user1Ratio.win;
    }

    user0.gameRatio = JSON.stringify(user0Ratio);
    user1.gameRatio = JSON.stringify(user1Ratio);

console.log(user0.gameRatio);
console.log(user1.gameRatio);

    await user0.save();
    await user1.save();
  }
  //////////////////////
  // game service end //
  //////////////////////



  //////////////////////////
  // friend service begin //
  //////////////////////////
  async friendList(login: string): Promise<IDetail[]> {
    const query = await this.relationRepository
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.owner', 'owner')
      .leftJoinAndSelect('relation.other', 'other')
      .where('owner.login=:login', {login})
      .andWhere('relation.other is not null')
      .getMany();

    const temp = Array.from(query, e => {
      if (e.relation & Relation.friend)
        return e.other;
    });
    const friendArray = temp.filter(e => e !== undefined);
// console.log('[> friendArray in friendList <]', friendArray);
    return await this.getDetail(friendArray, true, null);
  }

  async friendedList(login: string) {
    const query = await this.relationRepository      
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.owner', 'owner')
      .leftJoinAndSelect('relation.other', 'other')
      .where('other.login=:login', {login})
      .getMany();

    const temp = Array.from(query, e => {
      if (e.relation & Relation.friend)
        return e.owner;
    });
    const friendedArray = temp.filter(e => e !== undefined);
// console.log('[> friendedArray in friendedList <]', friendedArray);
    return await this.getDetail(friendedArray, null, null);
  }

  async isFriend(owner: string, friend: string): Promise<RelationEntity> {
    const entity = await this.relationRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.owner', 'owner')
      .leftJoinAndSelect('friend.other', 'other')
      .where('owner.login=:owner', {owner})
      .andWhere('other.login=:friend', {friend})
      .getOne();

    return (entity && (entity.relation & Relation.friend)) ? entity : null;
  }

  async getUnFriendDetail(login: string): Promise<IDetail> {
    const detail = await this.getWhoDetail(login);
    detail.isFriend = false;
    return detail;
  }

  async getFriendDetail(owner: string, friend: string): Promise<IDetail> {
    const relation = await this.isFriend(owner, friend);
    if (!relation) return null;

    return (await this.getDetail([relation.other], true, null))[0];
  }
  ////////////////////////
  // friend service end //
  ////////////////////////



  /////////////////////////
  // block service begin //
  /////////////////////////
  async blockList(login: string) {
    const query = await this.relationRepository
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.owner', 'owner')
      .leftJoinAndSelect('relation.other', 'other')
      .where('owner.login=:login', {login})
      .getMany();
    
    const temp = Array.from(query, e => {
      if (e.relation & Relation.block)
        return e.other;
    });
    const blockArray = temp.filter(e => e !== undefined);
// console.log('[> blockArray in blockList <]', blockArray);
    return await this.getDetail(blockArray, null, true);
  }

  async blockerList(login: string) {
    const query = await this.relationRepository
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.owner', 'owner')
      .leftJoinAndSelect('relation.other', 'other')
      .where('other.login=:login', {login})
      .getMany()

    const temp = Array.from(query, e => {
      if (e.relation & Relation.block)
        return e.owner;
    });
    const blockerArray = temp.filter(e => e !== undefined);
// console.log('[> blockerArray in friendedList <]', blockerArray);
    return await this.getDetail(blockerArray, null, null);
  }

  async isBlock(owner: string, block: string): Promise<RelationEntity> {
    const entity = await this.relationRepository
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.owner', 'owner')
      .leftJoinAndSelect('relation.other', 'other')
      .where('owner.login=:owner', {owner})
      .andWhere('other.login=:block', {block})
      .getOne();
    
    return (entity && (entity.relation & Relation.block)) ? entity : null;
  }

  async getUnBlockDetail(login: string): Promise<IDetail> {
    const detail = await this.getWhoDetail(login);
    detail.isBlock = false;
    return detail;
  }

  async getBlockDetail(owner: string, block: string): Promise<IDetail> {
    const relation = await this.isBlock(owner, block);
    if (!relation) return null;

    return (await this.getDetail([relation.other], null, true))[0];
  }
  ///////////////////////
  // block service end //
  ///////////////////////



  //////////////////////////////
  // initialize service begin //
  //////////////////////////////
  // async resetRedis(): Promise<void> {
  //   await this.cacheManager.reset();
  // }

  async clearRooms(): Promise<void> {
    await this.roomChatRepository.clear();
    await this.roomGameRepository.clear();
  }

  async clearHistory(): Promise<void> {
    await this.gameRepository.clear();
  }

//   async showAllUser(): Promise<void> {
//     const all = await this.userRepository.find();
// console.log('>>> all <<<', all);
//   }

  async clearConnectionCount(): Promise<void> {
    const all = await this.userRepository.find();

    all.forEach(e => {
      e.connectionCount = 0;
    });

    this.userRepository.save(all);
  }
  ////////////////////////////
  // initialize service end //
  ////////////////////////////



  /////////////////////////
  // tools service begin //
  /////////////////////////
  async getWhoDetail(login: string): Promise<IDetail> {
    const user = await this.whoIsUser(login);
    if (!user) return;

    return (await this.getDetail([user], null, null))[0];
  }

  async getDetail(sourceArray: UserEntity[], isFriend?: boolean, isBlock?: boolean): Promise<IDetail[]> {
    if (!sourceArray.length) return [];

    const array: IDetail[] = [];
    for (const e of sourceArray) {
      array.push({
        login: e.login,
        nickname: e.nickname,
        avatar: e.avatar,
        isOnline: 0 < e.connectionCount,
        isFriend,
        isBlock,

        matchHistory: await this.getPongHistory(e.login),
        ladder: e.ladder,
        gameRatio: JSON.parse(e.gameRatio),
      } as IDetail);
    }

    return array;
  }

  //ToDo
  async getPongHistory(login: string): Promise<any[]> {
console.log('enter getPongHistory');
    const query = await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.owner', 'owner')
      .where('owner.login=:login', {login})
      .andWhere('game.result!=0')
      .select(['game.begin', 'game.end', 'game.login', 'game.enemy', 'game.result'])
      .orderBy('game.id', 'DESC')
      .limit(5)
      .getMany();
console.log('query', query);
    return query;
    // return [];
  }

  async setConnectionCount(login: string, value: number): Promise<boolean> {
console.log('enter set connection with value:', value);
    const user = await this.whoIsUser(login);
    if (!user) return false;

    user.connectionCount = value ?? 0;
    await this.userRepository.save(user);
console.log(user.login, ': set connection [as a result]', user.connectionCount);
    return true;
  }

//   async increaseConnection(login: string): Promise<boolean> {
//     const user = await this.whoIsUser(login);
//     if (!user) return false;

//     ++user.connectionCount;
//     await this.userRepository.save(user);
// console.log(user.login, ': increase connection [as a result]', user.connectionCount);
//     return true;
//   }

//   async decreaseConnection(login: string): Promise<boolean> {
//     const user = await this.whoIsUser(login);
//     if (!user) return false;

//     --user.connectionCount;
//     // user.connectionCount = Math.max(0, user.connectionCount - 1);
//     await this.userRepository.save(user);
// console.log(user.login, ': decrease connection [as a result]', user.connectionCount);
//     return true;
//   }

  // async isOnline(login: string): Promise<boolean> {
  //   const user = await this.whoIsUser(login);
  //   if (!user) return false;

  //   return 0 < user.connectionCount;
  // }
  ///////////////////////
  // tools service end //
  ///////////////////////
}
