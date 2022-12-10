배포시 IP 설정법.

1. VM이 셋업되어 있는 호스트 PC의 IP를 가져옵니다.
    - 클러스터 안에서의 호스트 PC의 IP는 10번대로 시작합니다. 해당 주소는 클러스터 인트라넷 내부에서 쓰이는 주소입니다.
    - 리눅스 환경에서는 ipconfig 로 조회할 수 있습니다.


2. 다음 경로에 있는 .env 파일들을 찾아 '[IP]' 라고 되어있는 부분을 모두 1번에서 얻은 IP로 바꾸어줍니다.
```
    - ./secrets/auth.env
    - ./secrets/client.env
    - ./secrets/front.env
    - ./requirements/frontend/.env
```

3. 42Intra 에서 API를 생성합니다.

4. 42Intra 에서 callback_url 주소를 다음과 같이 수정합니다. '[IP]' 부분은 1번에서 얻은 IP로 바꾸어줍니다.
```
http://[IP]:8080/auth/login/callback
```

5. 42Intra 에서 생성한 API의 UID와 SECRET을 ./secret/ft.env에 저장합니다.
```
FT_CLIENT_ID=[UID]
FT_CLIENT_SECRET=[SECRET]
```