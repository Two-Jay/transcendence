import { Accordion, Checkbox, Label } from "flowbite-react";
import React from "react";

const FrontTodoList: React.FC = () => {

  return(<div>

<Accordion>

<Accordion.Panel>
  <Accordion.Title>
          Nov 15 화요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly   />
      <Label >daily-build 방해 요소 시간날 때마다 제거 </Label></div>

    <div className="flex items-center gap-4"><Checkbox readOnly       />
      <Label >퐁 게임 결투 flow 관련 UI 다시 살펴보고 보완 및 점검</Label></div>


  </div></Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          Nov 14 월요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

  <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >daily-build 방해 요소 시간날 때마다 제거 </Label></div>

      <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >gameMatchHistory 정리 </Label></div>

      <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >game join 표시에 socketid null 여부를 이용 </Label></div>


    <div className="flex items-center gap-4"><Checkbox readOnly   checked    />
      <Label >IDetail 업데이트 적용, gameRatio</Label></div>

    <div className="flex items-center gap-4"><Checkbox readOnly  checked     />
      <Label >Ladder 등급 어떻게 할지 생각</Label></div>

    <div className="flex items-center gap-4"><Checkbox readOnly  checked     />
      <Label >_leave_game, _end_game  등등 확인 및 보완</Label></div>


  </div></Accordion.Content>
</Accordion.Panel>


<Accordion.Panel>
  <Accordion.Title>
          Nov 11 금요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >_be_admin 이 안오고 있음 - 확인 및 수정 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >tfa 체크</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly  checked  />
      <Label >matchHistory  체크 - welcomeKit에 자기 자신의 정보 추가 0-2 to 0-3</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>




<Accordion.Panel>
  <Accordion.Title>
          Nov 10 목요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">


    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >daily-build 방해 요소 시간날 때마다 제거 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >SendMessage, Messages에 css 적용하기 - 최소한으로 아바타, 닉네임, 메시지로 적용</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked   />
      <Label >IDetail 관련 전체 다시 점검 및 확인 필요, 확인후 온라인 필드 제거</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked   />
      <Label >IDetail online/offline 제대로 작동하는지 확인 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >iDetail, _iDetail 정리 및 확인 필요 - nickname, avatar 변경시 작동 - online offline 체크 필요</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >프로파일에 gameHistory 시각화</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label > user 선택시 상세정보 프로파일 페이지 users/[pid].tsx로 이동하기</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >next-dev.js?3515:20 Expectation Violation: Duplicate atom key 문제 - nanoid()추가로 처리 -  https://velog.io/@sj_dev_js/Recoil-Duplicate-atom-key </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked       />
      <Label >SendMessage 한글 입력시 노이즈 처리 문제 - 이거는 쓰다보니 vscode도 가끔 발생 - skip해도 될듯</Label></div>


  </div></Accordion.Content>
</Accordion.Panel>


<Accordion.Panel>
  <Accordion.Title>
          Nov 9 수요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">


    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >daily-build 방해 요소 시간날 때마다 제거 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly  checked />
      <Label >join_room, leave_room, be_admin, kick, ban 에서 option에 IDetail을 줄때 isAdmin이 추가 : 프론트에 반영 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly  checked     />
      <Label >방장이 방을 나갔을 경우 방장없는 모드로 진행하기로 결정</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label > Toast icon type 정리, button type 생성</Label></div>




  </div></Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          Nov 8 화요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >socket.open() 시점을 리스너들 이전인 ToastList.useEffect[]에 일단 두고 _connect시 accessLevelRefresh() 또는 nicknameRefresh()로 일단 처리하고 넘어감</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >daily-build 방해 요소 시간날 때마다 제거 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >nickname, avatar 들은 users로만 관리, 채팅방에서 member의 login이용, nickname과 avatar는 users에서 가져다 쓰는 방향으로 전환</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >본인의 nickname, avatar도 users에 추가해서 관리, 보여줄 때는 자신 제외</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >CUserList avatar, nickname 시각화 처리</Label></div>


  </div></Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          Nov 7 월요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >gameRoom도 Map으로 관리하는 방향으로 전환</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >_connect에서 userMap, chatMap, gameMap clear후 refresh할 때 (welcomeKit 다시 받을 때) set</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >socket.open()후 _connect에서 accessLevelRefresh() 클러스터 컴에서는 정상 작동하는 듯</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >중복 nickname 사용시 500 (Internal Server Error) 발생 - duplicate key value violates unique  constraint - 완료</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >채팅방 생성 옵션 구현 - public, protected (public + password), private</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly  checked     />
      <Label >chatAdminInput을 invite에 이용하기위해  userList 사용</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >채팅방 public에 password admin command 사용하면 roomtype.protected로 변경후 password 저장하도록 처리 - 일단 처리 안함 (현재 chatMap에 저장하지 않아도 기능은 작동됨)</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly  checked     />
      <Label >invite 어떻게 처리할지 - public과 protected는 toast 정보로만도 처리 가능, private의 경우 최소한 chatMap.set으로 chatRoom 추가해 주어야 리스트에서 확인가능하게 됨</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked     />
      <Label >채팅방 admin password와 privateMessage는 별도의 입력창 생성하여 사용, chatAdminInput 사용안하도록 변경 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >채팅방 create, create private 하나의 드롭다운으로 변경 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >채팅방 join, join with password 하나의 드롭다운으로 변경??? - 그냥 chatInput을 사용하기로 함 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >로그인시 accessLevel 이상작동 감지 - socket.open을 listener Component 보다 상위로 이동 - ToastList 로딩시 socket.open하도록 변경 + /index and /profile 로딩시 accessLevelFresh() </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
    <Label >모달 폼 component 작성하여 채팅방 admin 명령들 처리 - dropdown 으로 처리</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
    <Label >폼 props로 리스트 정보 (사용자) 넘겨받아 시각화 및 선택 후 admin 명령 처리에 사용 - users를 이용하여 dropdown.item 생성</Label></div>


  </div></Accordion.Content>
</Accordion.Panel>



<Accordion.Panel>
  <Accordion.Title>
          Nov 4 금요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label > WelcomeKit IDetail[] 반영, UserMap 생성시 avatarImgSrc 처리 (UserMapUtils.sets2) </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >Users 테이블과 friend, block api 연계 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >friend, whoisfriend, block, whoisblock api 정상적으로 작동하는지 확인 필요 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >_handleBeAdmin에서 msg.scope필요, 그리고 _handleJoinRoom에서 create후 join + be_admin도 받아야????</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >recoil-persist 사용 고려 - 잘 작동안함 new Map()이 초기값이라 그런지 빈 객체만 저장됨 - 현재 꼭 필요한 것은 아니므로 이쯤에서 멈춤</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>


<Accordion.Panel>
  <Accordion.Title>
          Nov 3 목요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >ChatRoomDto의 member를 백앤드와 같이 다르게 가서 클래서 이름 변경 : ChatRoom</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >채팅방 join, leave 부분 IDetail로 변경</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >Users 의 avatar update를 UserMapUtils로 이동 : async 형태로 제한됨 </Label></div>

  </div></Accordion.Content>
</Accordion.Panel>


<Accordion.Panel>
  <Accordion.Title>
          Nov 2 수요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >ChatRoom을 ChatRoomDto로 전환</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >Users 를 friend, block으로 시작</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>


<Accordion.Panel>
  <Accordion.Title>
          Nov 1 화요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >chatRoom Map으로 관리하는 방향으로 전환</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >필요시 MapUtils 확장하여 ChatMapUtils 생성 후 updateChatRoomsSelector를 대신함  </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >현재 참여중인 채팅방 정보는 currentChatRoom Atom에 담아서 별도로 관리하는 방향으로? - 일단 chatRoomMap 하나로 가기로 결정</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          Oct 31 월요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >아바타 이미지 변경, 업로드 + 다운로드</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >아바타 이미지 업로드 전 resize (maxSize 300) </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >아바타 original image + icon image로 이원화 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label > 처음 로그인시 nickname과 avatar 변경하기</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >토스트 타이머 대신 duration으로 변경</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >토스트 추가 삭제 용이하도록 Map으로 변경</Label></div>


  </div></Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          Oct 28 금요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >accessLevelSelector level4 off</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly  checked      />
      <Label >pong class 좌표값 normalize + PlayGameDto</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly  checked      />
     <Label >join_room, create_room으로 구분 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked      />
      <Label >소켓 emit + 리스너 껍데기 작성 및 테스트</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          Oct 27 목요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >nickName과 tfaEnable 재검토 필요 recoil set 정상 작동 안하는 듯 - axios.post.then() 패턴으로 변경</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >bWhoami와 bWhoami2로 이원화 되어있던 권한 체크를  일원화 - accessLevelSelector</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked  />
      <Label >socket.open은 일단 LEVEL2이상에서만 열리도록 함 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >gameToastMapAtom 를 이용한 toast map 적용 시도중 - 안쓰는 방향으로 결론 - 랜더링시 forEach에서 멀티플 리턴이 되므로 사용 불가</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>


<Accordion.Panel>
  <Accordion.Title>
          Oct 26 수요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">


    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >toast type, close Button 생성 및 gameToastAtom과 연계</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >toast nanoid 적용</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >한번에 하나의 채팅방에만 입장 가능하도록 변경, 입장후 chatList 대신 userList이 보임</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >_movePaddle을 이용한 패들 이동 로직 작성</Label></div>


  </div></Accordion.Content>
</Accordion.Panel>


<Accordion.Panel>
  <Accordion.Title>
          Oct 25 화요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >game recoil status를 GameRoomDto와 GamePlayDto로 통일 </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked />
      <Label >_room, _move_paddle 가 작동하는 안하는 상황 socketid와 관련됨 </Label></div>

  </div></Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          Oct 24 월요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

  <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >GameList 작성</Label></div>
  <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >PongGame 소켓 리스너 연결 시작</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>



<Accordion.Panel>
  <Accordion.Title>
          Oct 21 금요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >global socket listener 가능여부 파악 (SocketButtons에 모든 리스너 넣는 것으로 대처)</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >jotai 테스트 - 장점도 있으나 현재 recoil 복잡한 패턴을 처리해주는 방법을 아직 찾지 못함</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >jotai 테스트 계속 진행 - component 내부에서는 optics를 이용한 처리가 유용할 수 있으므로 시간이 나면 계속 탐색해볼 필요가 있음</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/>
      <Label >selector 내부가 복잡한 패턴이므로 selector 최소화 하는 방향으로 전환 - updateRoomsSelector 하나로 모두 처리하는 방식으로</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          Oct 20 목요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked       />
      <Label >ChatList 업데이트: setRooms대신에 addRoomsToRoomsSelector</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked       />
      <Label >welcome_kit 버튼을 SocketOnOff에 추가하고 수동 welcome_kit 요청으로 전환</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked       />
      <Label >위의 두 작업 통합: addNewRoomsToRoomsSelector</Label></div>
      <div className="flex items-center gap-4"><Checkbox readOnly checked       />
      <Label >_로 시작하는 모든 소켓 리스너를 SocketButtons.tsx로 옮김</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>


<Accordion.Panel>
  <Accordion.Title>
          Oct 19 수요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">

    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >pong class와 p5 로직 분리  </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >setConnected((curVal)에서newVal)로 접근하기</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >setNickname selector.set으로 변경</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >setTfaEnableselector.set으로 변경</Label></div>

    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >Messages 업데이트: setRooms대신에 selector.set (room) 사용하기 시도 실패</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >Messages 업데이트: setRooms대신에 addMsgToRoomsSelector (rooms) 사용하도록 일단 진행</Label></div>


  </div></Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          Oct 18 화요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >ChatList 로딩시 welcomKit[3]와 curRooms merge</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >소켓 리스너들 try catch로 감싸기</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >frontend에 있는 pong 가져오기 </Label></div>

  </div></Accordion.Content>
</Accordion.Panel>



<Accordion.Panel>
  <Accordion.Title>
          Oct 17 월요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >Rooms 타입 및 Atom 정의  </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >Room Selector 정의 : rooms(roomId) </Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >Messages Recoil 사용 패턴</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >RoomList Component 생성 </Label></div>

  </div></Accordion.Content>
</Accordion.Panel>



<Accordion.Panel>
  <Accordion.Title>
          Oct 14 금요일
  </Accordion.Title>
  <Accordion.Content> <div className="flex flex-col gap-2 text-lg">
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >ssr off 모드 설정해보기 (next-js-disable-server-side-rendering-on-some-pages 30 Put this on your _app.tsx)</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >SocketOnOff 버튼과 connectedAtom async를 위한 Promise setTimeout(2000) 적용</Label></div>
    <div className="flex items-center gap-4"><Checkbox readOnly checked/><Label >Socket create_room, join_room, room (msg_to_room) test</Label></div>

  </div></Accordion.Content>
</Accordion.Panel>


<Accordion.Panel>
  <Accordion.Title>
    vi packet policy chat & game
  </Accordion.Title>
  <Accordion.Content>
    <Label > cd /Users/seongcho/goinfre/ft_trans/transcendence/srcs/requirements/backend/socket </Label>
  </Accordion.Content>
</Accordion.Panel>

<Accordion.Panel>
  <Accordion.Title>
          다음에 할일
  </Accordion.Title>
  <Accordion.Content>
    <div className="flex items-center gap-4"><Checkbox        /><Label > nginx 도커 추가하기??? https://steveholgado.com/nginx-for-nextjs/</Label></div>
    <div className="flex items-center gap-4"><Checkbox        /><Label > todo</Label></div>
    <div className="flex items-center gap-4"><Checkbox        /><Label > todo</Label></div>
    <div className="flex items-center gap-4"><Checkbox        /><Label > todo</Label></div>
    <div className="flex items-center gap-4"><Checkbox        /><Label > todo</Label></div>
    <div className="flex items-center gap-4"><Checkbox        /><Label > 비밀번호 암호화하여 db에 저장하기? private 채팅방 비빌번호 db에 저장 그냥 디펜스용 </Label></div>

  </Accordion.Content>
</Accordion.Panel>



</Accordion>


  </div>);

}

export default FrontTodoList;


/*


ssh -p 2222 myname@localhost
chmod 755 setup.sh
./setup.sh

git clone https://github.com/cloudeven-gmail-com/transcendence.git
cd transcendence
docker login -u indivisi

make .
make down
make fclean

깃허브 토큰(seongcho1)
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

ENOSPC 발생시 해결법
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

docker ps -a
docker exec -it socket bash
docker exec -it auth bash
docker exec -it front bash

*/
