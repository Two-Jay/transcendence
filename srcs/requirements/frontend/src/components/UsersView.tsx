import { Avatar, Table } from "flowbite-react";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { MapUtils, UserMapUtils } from "../recoil/mapUtils";
import { postBlockQuery, postFriendQuery, userMapAtom } from "../recoil/userState";
import { User } from "../recoil/userType";
import { whoamiAtom } from "../recoil/whoamiState";

/**
 * This is the Presentational Component, which receives callback functions
 * and  data to be displayed via `props`.
 */

// interface UsersViewProps {
//   users: User[];
//   handleUserClick: (
//     userId?: string
//   ) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
// }


//const UsersView: FC<UsersViewProps> = (props) => {
//  const { users, handleUserClick } = props;
const UsersView: FC = () => {
  const router = useRouter();
  const whoami = useRecoilValue(whoamiAtom);
  const [users, setUsers] = useRecoilState(userMapAtom);

  //users.get('seongcho')?.matchHistory

  useEffect(()=>{
  }, [users]);

  const handleUserClick = (login : string) => {
    router.push('/users/'+login);
  }

  const handleFriendClick = async (login: string, add: boolean) => {

    console.log("handleFriendClick", login, add);
    //return;
    postFriendQuery(login, add)
      .then(ret => {
        if (!ret) return;
        console.log("friend", login, add, users.get(login))

        UserMapUtils.set2(users, users.get(login) as User)
          .then(newUsers=>{

            console.log("newUsers", newUsers.size)
            setUsers(newUsers)
          });
        // const messageDataDto = new MessageDataDto(undefined, "friend", add?"true":"false");
        // console.log("emit iDetail --->", messageDataDto);
        // socket.emit("iDetail", messageDataDto);

      })
  }

  const handleBlockClick = async (login: string, add: boolean) => {

    postBlockQuery(login, add)
      .then(ret => {
        if (!ret) return;
        UserMapUtils.set2(users, users.get(login) as User)
          .then(newUsers=>setUsers(newUsers));
        // const messageDataDto = new MessageDataDto(undefined, "block", add?"true":"false");
        // console.log("emit iDetail --->", messageDataDto);
        // socket.emit("iDetail", messageDataDto);
      })
  }
//.filter(user=>user.login != null && user.login !== whoami?.whoami )

  return (
    <div className="">
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Login</Table.HeadCell>
        <Table.HeadCell>Nickname</Table.HeadCell>
        <Table.HeadCell>Avatar</Table.HeadCell>
        <Table.HeadCell>Friend</Table.HeadCell>
        <Table.HeadCell>Block</Table.HeadCell>
      </Table.Head>

      <Table.Body className="divide-y">

      {MapUtils.toArray(users)
        .filter(user=>user.login != null && user.login !== whoami?.whoami )
        .map((user, index) => (
        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">

          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            <div
              key={`login${index}`}
              onClick={()=>handleUserClick(user.login)}
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              {user.login || "no name..."}
            </div>
          </Table.Cell>

          <Table.Cell>{user.nickname || "no nickname..."}</Table.Cell>

          <Table.Cell>
            <Avatar alt={user.avatar} img={user.avatarImgSrc} size="lg" rounded
                    status={user.isOnline?"online":"offline"} />
          </Table.Cell>

          <Table.Cell>
            <label htmlFor={`friend${index}-green-toggle`} className="inline-flex relative items-center mr-5 cursor-pointer">
              <input   key={`friend${index}-green-toggle`}
                      type="checkbox" value="" id={`friend${index}-green-toggle`} className="sr-only peer"
                      checked={user.isFriend} onChange={e => {
                        console.log("friend", e.target, e.currentTarget)
                        handleFriendClick(user.login, e.target.checked)}}/>
              <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </Table.Cell>

          <Table.Cell>
            <label htmlFor={`block${index}-red-toggle`} className="inline-flex relative items-center mr-5 cursor-pointer">
              <input   key={`block${index}-red-toggle`}
                      type="checkbox" value="" id={`block${index}-red-toggle`} className="sr-only peer"
                      checked={user.isBlock} onChange={e => handleBlockClick(user.login, e.target.checked)}/>
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            </label>
          </Table.Cell>

        </Table.Row>
      ))}

      </Table.Body>

    </Table>
    </div>
  );
};

export default UsersView;


/*





        <Table.HeadCell>Online</Table.HeadCell>

          <Table.Cell>
            <Tooltip content={user.isOnline? "On" : "Off"} style="auto">
            <Button  pill={true} size={"md"} color={user.isOnline? 'success':'light'}/>
            </Tooltip>
          </Table.Cell>

          <Table.Cell>
          <div className="flex gap-2">
            <div>{user.isFriend ? "true": "false"}</div>


            <label htmlFor="green-toggle" className="inline-flex relative items-center mr-5 cursor-pointer">
              <input type="checkbox" value="" id="green-toggle" className="sr-only peer"
                     checked={user.isFriend} onChange={e => handleFriendClick(user.login, e.target.checked)}/>
              <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>

            <div
              key={`addfriend${index}`}
              //href="/tables"
              onClick={()=>!user.isFriend?handleFriendClick(user.login, true):null}
              className={!user.isFriend?"font-medium text-blue-600 hover:underline dark:text-blue-500":""}
            >
              add
            </div>

            <div
              key={`removefriend${index}`}
              //href="/tables"
              onClick={()=>user.isFriend?handleFriendClick(user.login, false): null}
              className={user.isFriend?"font-medium text-blue-600 hover:underline dark:text-blue-500":""}
            >
              remove
            </div>
          </div>
          </Table.Cell>


          <Table.Cell>
          <div className="flex gap-2">
            <div>{user.isBlock ? "true": "false"}</div>

            <div
              key={`addblock${index}`}
              //href="/tables"
              onClick={()=>!user.isBlock?handleBlockClick(user.login, true):null}
              className={!user.isBlock?"font-medium text-blue-600 hover:underline dark:text-blue-500":""}
            >
              add
            </div>

            <div
              key={`removeblock${index}`}
              //href="/tables"
              onClick={()=>user.isBlock?handleBlockClick(user.login, false): null}
              className={user.isBlock?"font-medium text-blue-600 hover:underline dark:text-blue-500":""}
            >
              remove
            </div>
          </div>
          </Table.Cell>





  const handleLoadImages = async() => {

    const userArray = MapUtils.toArray(users);
    const resArray : string[] = [];
    for await (const user of userArray) {
      let res;
      if (user.avatarImgSrc && user.avatarImgSrc.length > 0) res = user.avatarImgSrc;
      else res = "";//user.avatar ? await postAvatarDownloadQuery(user.avatar, 128) : "";
      resArray.push(res!);
    }
    console.log("handleLoadImages", resArray);
    setImgSrcs(resArray);
  }
*/
