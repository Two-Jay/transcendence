import { Avatar} from "flowbite-react";

type UserAvatarListItemContentProps = {
  altStr?: string;
  imgSrcStr?: string;
  bStatus : boolean;
  upperText: string;
  lowerText: string;
  middleText? : string;
  bFlag? : string;
}

// export const UserAvatarListItemContent: React.FC<UserAvatarListItemContentProps> = ({altStr, imgSrcStr, bStatus, upperText, lowerText, middleText, bFlag}) => {

//   return (
//     <div className="flex w-full gap-4 items-center">
//     <Avatar
//     alt={altStr}
//     img = {imgSrcStr}
//     status={bStatus?"away":undefined} statusPosition="top-right"
//     rounded={true}
//     >
//       {bFlag === true ?
//       <UserChatItemContent upperText={upperText} middleText={middleText} lowerText={lowerText} /> :
//       <UserListItemContent upperText={upperText} lowerText={lowerText} />}
//     </Avatar>
//   </div>
//   );
// }

// export const UserAvatarListItemContent: React.FC<UserAvatarListItemContentProps> = ({altStr, imgSrcStr, bStatus, upperText, lowerText, middleText, bFlag}) => {

//   return (
//     <div className="flex w-full gap-4 items-center ">
//       {bFlag === 'room'
//       ?
//       <ChatRoomItemContent upperText={upperText} middleText={middleText} lowerText={lowerText} />
//       :
//       <Avatar alt={altStr} img = {imgSrcStr} status={bStatus?"away":undefined} statusPosition="top-right" rounded={true}>
//       {bFlag === 'chat'
//       ?
//       <UserChatItemContent upperText={upperText} middleText={middleText} lowerText={lowerText} />
//       :
//       <UserListItemContent upperText={upperText} lowerText={lowerText} />}
//       </Avatar>}
//   </div>
//   );
// }

export const UserAvatarListItemContent: React.FC<UserAvatarListItemContentProps> = ({altStr, imgSrcStr, bStatus, upperText, lowerText, middleText, bFlag}) => {

  return (
    <div className="flex w-full gap-4 items-center ">
      {bFlag === 'room'
        ?
        <ChatRoomItemContent upperText={upperText} middleText={middleText} lowerText={lowerText} />
        :
        <div className="flex w-full">
          <div className="w-14">
          <Avatar alt={altStr} img = {imgSrcStr} status={bStatus?"away":undefined} statusPosition="top-right" rounded={true}/>
          </div>
          <div className="flex w-full break-all">
            {bFlag === 'chat'
              ?
              <UserChatItemContent upperText={upperText} middleText={middleText} lowerText={lowerText} />
              :
              <UserListItemContent upperText={upperText} lowerText={lowerText} />
            }
          </div>
        </div>
      }
    </div>
  );
}

//there was a conflict
//it was pushed to the origin, maybe the blowed part is the latest???
/*
      {bFlag === 'room'
        ?
        <ChatRoomItemContent upperText={upperText} middleText={middleText} lowerText={lowerText} />
        :
        <div className="flex w-full">
          <div className="w-14">
          <Avatar alt={altStr} img = {imgSrcStr} status={bStatus?"away":undefined} statusPosition="top-right" rounded={true}/>
          </div>
          <div className="flex w-full break-all">
            {bFlag === 'chat'
              ?
              <UserChatItemContent upperText={upperText} middleText={middleText} lowerText={lowerText} />
              :
              <UserListItemContent upperText={upperText} lowerText={lowerText} />
            }
          </div>
        </div>
      }
    </div>
*/


type UserListItemContentProps = {
  upperText: string;
  lowerText: string;
  middleText?: string;
  bFlag? : string
}

export const UserListItemContent: React.FC<UserListItemContentProps> = ({upperText, lowerText}) => {
  return (
    <div className="text-left space-y-1 font-medium dark:text-white">
    <div>
      {upperText}
    </div>
    <div className="text-sm text-gray-500 dark:text-gray-400">
      {lowerText}
    </div>
  </div>
  );
}

export const UserChatItemContent: React.FC<UserListItemContentProps> = ({upperText, lowerText, middleText}) => {

  return (
    <div className="text-left space-y-1 font-medium dark:text-white">
    <div>
      <span className="text-base text-gray-600 dark:text-gray-600 font-normal">
        {upperText}
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-400 p-5 font-light">
        {middleText}
        </span>
    </div>
    <div className="text-xl dark:text-gray-900 font-normal">
      {lowerText}
    </div>
  </div>
  );
}

export const ChatRoomItemContent: React.FC<UserListItemContentProps> = ({upperText, lowerText, middleText}) => {

  return (
    <div className="text-left space-y-1 font-medium dark:text-white">
    <div>
      <span className="text-base text-yellow-400 font-normal">
        {upperText}
      </span>
      <span className="inline-flex items-center justify-space-between px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-400 dark:text-gray-700">{middleText}</span>
      {/* <span className="text-xs text-gray-400 dark:text-gray-400 p-5 font-light">
        [{middleText}]
        </span> */}
    </div>
    <div className="text-base dark:text-gray-00 font-normal">
      {lowerText}
    </div>
  </div>
  );
}
