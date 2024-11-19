![메인페이지](https://github.com/Eungae-D/Dallim/assets/135101171/bd848807-e07b-49ae-99c4-970bda51e714)

<br />

## 📌 목차
1. [서비스 소개](#-소개)
2. [팀 구성](#-팀-구성)
3. [주요 기능](#-주요-기능)
4. [주요 기술](#-주요-기술)
5. [빌드 환경](#-빌드-환경)
6. [산출물](#-산출물) (최종발표자료, 아키텍쳐, 디자인, 요구사항 명세서, API 명세서, ERD)

<br />

## ⌚ 서비스 소개

</aside>

⌛ 프로젝트 기간 : 2024.10.14 ~ 2024.11.19 (37일)


### 개요

**SSAFY 11기 2학기 자율 프로젝트**  

 **PortAlio**

Portalio는 비전공자 개발자들의 경험 공유에서 시작되었습니다. .md 파일을 처음 접하는 사용자에게 템플릿과 가이드를 제공하며

**워치**를 이용하여 러닝을 하고, 러닝이 끝나면 실시간으로 연동되는 데이터를 **모바일**에서 러닝 기록을 확인할 수 있습니다. 또한 캐릭터, 행성에 대한 **커스터마이징**, 지정된 날짜/시간에 대한 **알림** 및 실시간 러닝 **랭킹** 시스템 등을 통해 사용자가 꾸준히 러닝을 할 수 있도록 하였습니다.

<br />

## 👥 팀 구성
<table align="center">
  <tr>
    <td align="center"><a href=><img src=" width="100px;" height="120px;" alt=""/><br /><sub><b>김헌규<br>PM/Full-stack<br/></b></sub></a></td>
    <td align="center"><a href="https://github.com/pum005"><img src="https://avatars.githubusercontent.com/u/108645121?v=4" width="100px;" height="120px;" alt=""/><br /><sub><b>차상곤<br>Infra/Full-stack<br/></b></sub></a></td>
    <td align="center"><a href="https://github.com/SeongLI"><img src="https://avatars.githubusercontent.com/u/110223414?v=4" width="100px;" height="120px;" alt=""/><br /><sub><b>이진송<br> Full-Stack<br/></b></sub></a></td>
    <td align="center"><a href="https://github.com/Eungae-D"><img src="https://avatars.githubusercontent.com/u/135101171?v=4" width="100px;" height="120px;" alt=""/><br /><sub><b>박재영<br>AI/BE<br/></b></sub></a></td>
    <td align="center"><a href="https://github.com/soyeonnnb"><img src="https://avatars.githubusercontent.com/u/71217221?v=4" width="100px;" height="120px;" alt=""/><br /><sub><b>윤민재<br> AI/BE<br/></b></sub></a></td>
    <td align="center"><a href="https://github.com/qkrrlgus114"><img src="https://avatars.githubusercontent.com/u/121294224?v=4" width="100px;" height="120px;" alt=""/><br /><sub><b>김은섭<br> AI<br/></b></sub></a></td>
</table>
</br>


## 📌 주요 기능

<details>
<summary>:full_moon:<strong>메인 페이지</strong></summary>
<br>

<table align="center" width="100%">
  <tr>
    <th align="center" width="33%">비로그인</th>
    <th align="center" width="33%">메인</th>
    <th align="center" width="33%">워치 가이드</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="소셜로그인 페이지" src="https://github.com/soyeonnnb/dallim/assets/71217221/84a3cbfd-2989-4f38-b777-e71ce076af7a" ></td>
    <td align="center"><img height="400" alt="메인페이지" src="https://github.com/soyeonnnb/dallim/assets/71217221/5f655bb0-6521-40e3-9a3a-74b004d9bbd8"></td>
    <td align="center"><img height="400" alt="갤럭시워치 가이드" src="https://github.com/soyeonnnb/dallim/assets/71217221/b8600b73-51da-41ac-b406-c49f07092e06"></td>
  </tr>
  <tr>
    <td align="center">어플을 키고 소셜 로그인(네이버, 카카오)을 통해 로그인을 할 수 있습니다.</td>
    <td align="center">소셜 로그인을 성공하면 메인 페이지로 이동하게 됩니다.</td>
    <td align="center">갤럭시 워치에 대한 가이드를 볼 수 있습니다.</td>
  </tr>
</table>

<table align="center" width="100%">
  <tr>
    <th align="center" width="50%">달력</th>
    <th align="center" width="50%">개인정보 처리방침</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="달력" src="https://github.com/soyeonnnb/dallim/assets/71217221/91e4050e-f7bc-4b5f-ad5b-58c0fea0927d"></td>
    <td align="center"><img height="400" alt="개인정보 처리방침" src="https://github.com/soyeonnnb/dallim/assets/71217221/bc19690d-3092-41ed-951d-a210c94ae943"></td>
  </tr>
  <tr>
    <td align="center">서비스 출석일과 관련된 달력입니다. 출석의 경우 해당 날짜에 달리기 종료시, 출석으로 인정됩니다.</td>
    <td align="center">서비스 개인정보 처리에 대한 링크로 이어지는 창이 뜹니다. 확인을 선택하면 서비스 개인정보 처리방침 페이지로 이동하게 됩니다.</td>
  </tr>
</table>

</details>

<details>
<summary>:waxing_gibbous_moon:<strong>차트 페이지</strong></summary>
<br>

<table align="center" width="100%">
  <tr>
    <th align="center" width="33%">차트 메인</th>
    <th align="center" width="33%">차트 메인(하단 스크롤업)</th>
    <th align="center" width="33%">러닝 그래프 터치</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="차트 메인" src="https://github.com/soyeonnnb/dallim/assets/71217221/d5f78e28-573a-4cbd-850f-94e5e2b725b8"></td>
    <td align="center"><img height="400" alt="차트 월별기록" src="https://github.com/soyeonnnb/dallim/assets/71217221/9a30465b-7ae9-454d-a772-2b68c3708e6c"></td>
    <td align="center"><img height="400" alt="차트 월별 상세기록" src="https://github.com/soyeonnnb/dallim/assets/71217221/fc727fc6-29c0-4e2a-a2d4-7a9835d8dbc2"></td>
  </tr>
  <tr>
    <td align="center">차트 메인페이지입니다. 달력을 통해 어느 날짜에 러닝을 했는지, 이번주 기록이 어떻게 되는지 확인할 수 있습니다.</td>
    <td align="center">하단 스크롤바를 위로 올리면 월별로 달린 기록을 확인할 수 있습니다.</td>
    <td align="center">러닝 그래프 터치시 해당 러닝 기록을 볼 수 있습니다.</td>
  </tr>
</table>

<table align="center" width="100%">
  <tr>
    <th align="center" width="25%">차트 메인(슬라이드)</th>
    <th align="center" width="50%">차트 기록</th>
    <th align="center" width="25%">페이스 차트</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="일별 기록 목록" src="https://github.com/soyeonnnb/dallim/assets/71217221/80d05027-1041-4318-8123-d99741d874ad"></td>
    <td align="center">
      <img height="400" alt="기록 상세1" src="https://github.com/soyeonnnb/dallim/assets/71217221/adba23df-2cf2-4274-95cb-643c39b0cb2e">
      <img height="400" alt="기록상세2" src="https://github.com/soyeonnnb/dallim/assets/71217221/88e4e329-d87a-477d-8891-b79377fe73e3">
    </td>
    <td align="center"><img height="400" alt="페이스 차트" src="https://github.com/soyeonnnb/dallim/assets/71217221/b775563b-4111-42ad-bf43-c948fbc0c25b">/td>
  </tr>
  <tr>
    <td align="center">달력에 표시된 러닝 기록 선택 시, 해당 일자에 뛴 기록이 나타나게 됩니다.</td>
    <td align="center">카드 선택 시, 기록의 상세보기로 이동하며 해당 뷰에서 스크롤을 통해 속도, 심박수 그래프, 같이 달린 러닝메이트도 함께 나타납니다.</td>
    <td align="center">차트 기록에서 오른쪽 슬라이드를 통해 페이스 차트를 확인할 수 있습니다.</td>
  </tr>
</table>

<table align="center" width="100%">
  <tr>
    <th align="center" width="25%">페이스 차트 터치</th>
    <th align="center" width="25%">페이스 차트 비교</th>
    <th align="center" width="25%">러닝 메이트와 기록비교</th>
    <th align="center" width="25%">심박수 차트</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="페이스차트 터치" src="https://github.com/soyeonnnb/dallim/assets/71217221/8fee24b2-c3c9-4cbe-af95-443e9326203c"></td>
    <td align="center"><img height="400" alt="페이스차트 비교 1" src="https://github.com/soyeonnnb/dallim/assets/71217221/89906ed1-3d26-4858-b2f2-707e1cb340ff"></td>
    <td align="center"><img height="400" alt="러닝메이트와 기록 비교" src="https://github.com/soyeonnnb/dallim/assets/71217221/5952fe7f-62ed-4540-8d2d-d3e62532899e"></td>
    <td align="center"><img height="400" alt="심박수 기록" src="https://github.com/soyeonnnb/dallim/assets/71217221/96271910-f950-4fa4-900a-096b66ce22ef"></td>
  </tr>
  <tr>
    <td align="center">그래프를 선택하면 선택한 지점의 평균 페이스가 나타납니다.</td>
    <td align="center">같이 달리기 비교 토글 터치 시 함께 달린 러닝메이트와 비교를 할 수 있습니다.</td>
    <td align="center">같이 달린 러닝메이트와 달린 기록 리스트를 확인할 수 있습니다.</td>
    <td align="center">페이스 차트에서 한칸 더 옆으로 이동 시 심박수 차트가 나타납니다. 해당 그래프 선택 시, 해당 지점에서의 심박수가 있는 영역에 따라 색상이 선택됩니다.</td>
  </tr>
</table>

</details>

<details>
<summary>:first_quarter_moon:<strong>소셜 페이지</strong></summary>
<br>

<table align="center" width="100%">
  <tr>
    <th align="center" width="25%">소셜 메인(전체)</th>
    <th align="center" width="25%">러닝메이트 상세보기</th>
    <th align="center" width="25%">러닝메이트와 비교하기</th>
    <th align="center" width="25%">러닝메이트와 친구추가</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="소셜 전체 메인" src="https://github.com/soyeonnnb/dallim/assets/71217221/87e0b9b9-43f8-4522-ba67-36d6608117ac"></td>
    <td align="center"><img height="400" alt="러닝메이트 상세보기" src="https://github.com/soyeonnnb/dallim/assets/71217221/de2f5ce9-7c1e-4ac7-b01a-83b935d5dc6f"></td>
    <td align="center"><img height="400" alt="러닝메이트와 비교하기" src="https://github.com/soyeonnnb/dallim/assets/71217221/120cfb3d-bb72-4591-aca3-df55d04e1bd8"></td>
    <td align="center"><img height="400" alt="러닝메이트와 친구추가" src="https://github.com/soyeonnnb/dallim/assets/71217221/e6ce1f0a-c82d-4f43-88b7-576916e78528"></td>
  </tr>
  <tr>
    <td align="center">소셜버튼 터치시 전체 랭킹을 볼 수 있는 화면입니다.</td>
    <td align="center">랭킹에 나타난 프로필 터치 시 해당 유저의 실제 프로필과 기록들을 볼 수 있습니다. 또한 등록하기 버튼을 통해 러닝메이트를 등록할 수 있습니다.</td>
    <td align="center">카드 터치 시 해당 러닝 메이트와 나와의 기록을 비교할 수 있습니다.</td>
    <td align="center">친구 요청 버튼을 통해 친구 요청을 보낼 수 있습니다.</td>
  </tr>
</table>

<table align="center" width="100%">
  <tr>
    <th align="center" width="25%">소셜 메인(친구)</th>
    <th align="center" width="50%">친구 검색</th>
    <th align="center" width="25%">친구 목록</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="소셜 친구 메인" src="https://github.com/soyeonnnb/dallim/assets/71217221/c985647b-7414-4896-a774-e94fd746453b"></td>
    <td align="center">
      <img height="400" alt="친구 검색" src="https://github.com/soyeonnnb/dallim/assets/71217221/786d66d7-c33c-4599-bf26-d2845db71a7a">
      <img height="400" alt="러닝메이트와 비교하기" src="https://github.com/soyeonnnb/dallim/assets/71217221/059cc262-f358-4216-8373-38541660ae0b">
    </td>
    <td align="center"><img height="400" alt="친구 목록" src="https://github.com/soyeonnnb/dallim/assets/71217221/0595a79f-5c8c-400b-b3d2-229cbb7bd119"></td>
  </tr>
  <tr>
    <td align="center">상단의 토글 바 터치 시 내가 등록한 친구들의 랭킹을 볼 수 있습니다.</td>
    <td align="center">메인(친구)의 우측 상단 버튼을 통해 모달(친구 검색, 목록, 받은 요청)을 보여주며, 닉네임 검색을 통하여 유저를 조회, 요청할 수 있습니다.</td>
    <td align="center">친구 목록 버튼을 터치하여 현재 나의 친구 목록을 볼 수 있습니다.</td>
  </tr>
</table>


<table align="center" width="100%">
  <tr>
    <th align="center" width="33%">친구 목록 삭제</th>
    <th align="center" width="33%">받은 요청</th>
    <th align="center" width="33%">받은요청 수락, 거절</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="친구 목록 삭제" src="https://github.com/soyeonnnb/dallim/assets/71217221/321adc49-fb83-47cc-8d77-17bcb7cd59e8"></td>
    <td align="center"><img height="400" alt="받은 요청" src="https://github.com/soyeonnnb/dallim/assets/71217221/a50f4ce8-ee7d-4198-9a27-79f2f7bca6bf"></td>
    <td align="center"><img height="400" alt="받은 요청 수락/거절" src="https://github.com/soyeonnnb/dallim/assets/71217221/ff8ab67d-921f-4c12-9320-1793535538c6"></td>
  </tr>
  <tr>
    <td align="center">친구 목록에서 삭제 버튼을 누르게 되면 친구가 삭제가 됩니다.</td>
    <td align="center">받은 요청 버튼을 클릭하여 요청받은 목록을 볼 수 있습니다.</td>
    <td align="center">받은 요청을 수락,또는 거절을 할 수 있습니다.</td>
  </tr>
</table>

</details>

<details>
<summary>:waxing_crescent_moon:<strong>편집 페이지</strong></summary>
<br>

<table align="center" width="100%">
  <tr>
    <th align="center" width="50%">편집 메인(캐릭터)</th>
    <th align="center" width="50%">캐릭터 구매</th>
  </tr>
  <tr>
    <td align="center">
      <img height="400" alt="편집 기본캐릭터" src="https://github.com/soyeonnnb/dallim/assets/71217221/2eccb818-dd46-47d6-b432-0e86c1ce2c28">
      <img height="400" alt="소유하지 않은 캐릭터" src="https://github.com/soyeonnnb/dallim/assets/71217221/3c3c4bb2-c85c-4bdc-a38a-633a83c07607">
    </td>
    <td align="center">
      <img height="400" alt="캐릭터 구매 모달" src="https://github.com/soyeonnnb/dallim/assets/71217221/1282b45f-b98b-47d4-b94b-5a6499709ec0">
      <img height="400" alt="캐릭터 구매 성공" src="https://github.com/soyeonnnb/dallim/assets/71217221/875bd77a-0e22-4027-9c20-bc767a7ee9a2">
    </td>
  </tr>
  <tr>
    <td align="center">편집 버튼 터치 시 기본적으로 캐릭터 선택 화면으로 이동하게 됩니다.</td>
    <td align="center">구매 버튼 터치시 포인트를 사용하여 구매할 수 있습니다.</td>
  </tr>
</table>

<table align="center" width="100%">
  <tr>
    <th align="center" width="33%">편집 메인(행성)</th>
    <th align="center" width="33%">워치화면 미리보기</th>
    <th align="center" width="33%">행성 구매</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="편집 기본행성" src="https://github.com/soyeonnnb/dallim/assets/71217221/f7c23a3f-e32f-471d-b91f-602b61ca8c8c"></td>
    <td align="center"><img height="400" alt="행성 워치화면 미리보기" src="https://github.com/soyeonnnb/dallim/assets/71217221/8ac5f117-ad5a-4c70-acea-12e68f843752"></td>
    <td align="center"><img height="400" alt="행성 구매" src="https://github.com/soyeonnnb/dallim/assets/71217221/0d80e324-3b11-413b-a4af-6a68e8d1b183"></td>
  </tr>
  <tr>
    <td align="center">상단의 행성 토글 터치 시 대표 행성을 지정할 수 있는 페이지로 이동합니다.</td>
    <td align="center">행성에 있는 워치 버튼을 터치하면 현재 워치에서 나오는 미리 보기 화면을 볼 수 있습니다.</td>
    <td align="center">잠겨있는 행성을 포인트를 통하여 구매할 수 있습니다.</td>
  </tr>
</table>

</details>

<details>
<summary>:new_moon:<strong>프로필 페이지</strong></summary>
<br>

<table align="center" width="100%">
  <tr>
    <th align="center" width="33%">프로필 메인</th>
    <th align="center" width="33%">닉네임 변경</th>
    <th align="center" width="33%">러닝 메이트 설정</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="프로필 메인" src="https://github.com/soyeonnnb/dallim/assets/71217221/44d9cfce-a78c-4b7a-9628-61a6a325128a"></td>
    <td align="center"><img height="400" alt="닉네임 변경" src="https://github.com/soyeonnnb/dallim/assets/71217221/b326d2cb-b793-4a88-8057-81aae6a2f9ca"></td>
    <td align="center"><img height="400" alt="러닝메이트 설정" src="https://github.com/soyeonnnb/dallim/assets/71217221/1194c2fd-cb26-4c9a-b0c5-5f481b8ce8b8"></td>
  </tr>
  <tr>
    <td align="center">프로필 버튼을 터치 시 프로필 페이지로 이동하며, 나의 정보(레벨, 닉네임, 경험치, 대표캐릭터)를 볼 수 있습니다.</td>
    <td align="center">닉네임 변경은 5글자이상, 띄어쓰기, 닉네임 중복이 발생하게 되면 변경이 불가능합니다. 그 외는 변경할 수 있습니다.</td>
    <td align="center">러닝 메이트 버튼 터치 시 내가 등록한 상대의 러닝 기록을 볼 수 있고, 왼쪽 슬라이드로 러닝 기록 리스트를 볼 수 있습니다. 삭제 버튼 터치 시 내가 설정한 러닝 기록을 삭제 할 수 있습니다.</td>
  </tr>
</table>

<table align="center" width="100%">
  <tr>
    <th align="center" width="33%">워치 설정</th>
    <th align="center" width="33%">운동 알림 설정</th>
    <th align="center" width="33%">로그아웃</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="워치 설정" src="https://github.com/soyeonnnb/dallim/assets/71217221/266962ed-b56c-44dc-b91a-998b37c5b33e"></td>
    <td align="center"><img height="400" alt="운동알림 설정" src="https://github.com/soyeonnnb/dallim/assets/71217221/9eab2d90-e6c6-4f28-a939-69a1f8f6dba0"></td>
    <td align="center"><img height="400" alt="로그아웃" src="https://github.com/soyeonnnb/dallim/assets/71217221/c60ee114-58aa-4d48-86e8-f44f15022636"></td>
  </tr>
  <tr>
    <td align="center">워치 버튼 터치 시 워치 설정 페이지로 이동하며, 워치에서 발급받은 인증번호로 휴대폰이랑 워치를 연동할 수 있습니다.</td>
    <td align="center">알림 버튼 터치 시 알림 설정 페이지로 이동하며, 원하는 때에 운동을 할 수 있도록, 요일과 시간을 설정하여 푸쉬 알림(FCM)을 받을 수 있습니다.</td>
    <td align="center">로그아웃 버튼 클릭시 소셜 로그아웃을 진행할 수 있습니다. 네이버는 서비스 로그아웃을 진행할 수 있습니다.</td>
  </tr>
</table>

</details>

<details>
<summary>:full_moon_with_face:<strong>위젯</strong></summary>
<br>

<table width="100%">
  <tr>
    <th align="center" width="100%">위젯</th>
  </tr>
  <tr>
    <td align="center"><img height="400" alt="위젯" src="https://github.com/soyeonnnb/dallim/assets/71217221/91503194-5b51-4c89-8f98-99f94b3bcf04"></td>
  </tr>
  <tr>
    <td align="center">내가 운동한 날짜, 그리고 귀여운 달림 캐릭터들을 위젯으로 사용할 수 있습니다.</td>
  </tr>
</table>

</details>
<br />

## 🔗 주요 기술

### [ DALLIM ]
- **Blender**: 독창적인 3D 모델링과 커스텀 디자인을 통한 4종의 캐릭터와 5개의 행성 제작

- **Gamification**: 사용자 참여 및 동기 부여를 증진시키는 게임화 요소
    - **CHARACTER (캐릭터)**: 선택 가능한 4종의 캐릭터, 각각 고유의 3단계 진화 과정을 경험
    - **PLANET (행성)**: 사용자가 5종류의 행성 중에서 선택하여 장착
    - **Point (포인트)**: 사용자의 활동에 따라 포인트 부여, 캐릭터 및 행성 구매에 사용
    - **FRIEND MANAGEMENT (친구 관리)**: 온라인 친구와의 연결, 기록 비교 및 대결 기능
    - **ALARM (알람)**: 정해진 시간에 러닝을 시작하도록 동기 부여, 일관된 운동 습관 형성 지원
- **FCM(Firebase Cloud Messaging) Push**: 목표 달성 및 러닝에 대한 지속적인 관심과 참여를 유도하는 푸시 알림
- **Mobile Widget**: 사용자의 모바일 홈 화면에 위젯 추가로 러닝 관련 정보 표시
- **Location Weather**: 현재 위치 기반 날씨 정보를 제공하여 러닝 조건에 최적화된 환경 확인 및 악천후 대비 가능
- **Social Login (NAVER, KAKAO)**: 사용자의 편의성을 높이고 빠른 로그인 경험을 제공하는 네이버 및 카카오 OAuth 인증

### [ FRONT ]
- **React**: 서비스 소개 웹 페이지 제작을 위한 라이브러리
- **React-Native**: 갤럭시워치와 안드로이드 모바일 연결에 적합한 모바일 애플리케이션 프레임워크
- **TypeScript**: 코드의 안정성 및 유지 보수성을 높이는 강력한 타입 시스템을 제공
- **Styled-Components (Atomic Design)**: React 컴포넌트에 직접 CSS 스타일을 적용하는 효율적인 방법, 코드의 가독성 및 유지 보수성 개선

- **Recoil**: React 앱의 상태 관리, atom과 selector를 통해 유연하고 효과적인 상태 관리 가능
    - **CSR (클라이언트 사이드 렌더링) 활용**: 상태 변경(예: 캐릭터, 행성)에 따른 컴포넌트 자동 업데이트로 동적인 UI 및 실시간 상호작용 지원
    - **SSR (서버 사이드 렌더링) 활용**: 초기 상태를 서버에서 설정하고 HTML을 생성하여 클라이언트로 전송, 빠른 페이지 로드
- **Axios**: 애플리케이션에서 HTTP 통신을 쉽고 효율적으로 처리
- **react-native-gifted-charts**: 사용자 데이터를 시각적으로 표현하여 분석과 이해를 돕는 강력한 데이터 시각화 도구

### [ BACK ]
- **Brotli 알고리즘을 활용한, 데이터 전송량 70% 압축**
    - 운동 시간이 증가함에 따라, 갤럭시 워치와 서버 간 데이터 전송량이 너무 많이지는 문제가 발생
    - 네트워크 비용을 줄이기 위해, HTTP 생태계의 gzip, brotli 중 압축 성능이 우수한 brotli 알고리즘 적용
      
- **갤럭시 워치에서 제공한 운동 기록 Raw 데이터를 서버에서 필요한 형태로 가공, 저장 파이프라인 구축**
    - 갤럭시워치에서 제공한 운동 raw 데이터를 그대로 MongoDB로 저장하는 것은 불필요한 데이터로 인해 Disk가 낭비되는 문제가 발생   
    - 달림 서비스에서 운동기록을 사용하는 차트와 함께 달리기 기능에 필요한 정보만을 추출해서 저장하도록 변경
    - 불필요한 데이터를 줄이고, 조회 속도를 0.3ms로 개선
 
### [ WATCH ]
- **EncryptedSharedpreferences 라이브러리**
    - 스마트 워치의 유저 정보를 안전하게 암호화를 통해 저장
    - AES 256 알고리즘 사용

- **Room 라이브러리**
    - SQLite DB를 쉽고 편리하게 사용하게 해주는 라이브러리
    - SQL에 문제가 생길 경우 컴파일단에서 에러 발생시키는 장점

- **기록 측정**
    - FusedLocationProviderClient 클래스를 이용해서 위치 정보 수집
    - 가속도 센서, 자이로스코프, 자기장 센서 등의 여러 가지 종합적인 정보를 통해 예측 위치 서비스 제공
    - Location 클래스를 이용해 속도 정보를 받아서 측정.
    - 속도, 거리, 심박수, 발걸음을 1초마다 리스트에 저장해서 달리기 종료가 되면 모든 데이터를 MongoDB로 전송

### [ 협업툴 ]
- **GitLab**: 프로젝트의 코드와 문서 관리

- **Jira**: 프로젝트 일정, 이슈 및 작업 관리
    - **Scrum (Agile)**: 1주 주기의 프로젝트 스프린트와 매일 5분의 스크럼미팅을 통한 통한 긴밀한 팀 협업과 소통
- **Mattermost**: 팀 내 의사소통 및 파일 공유를 지원하는 협업 도구 활용
- **Figma**: 프로젝트의 UI/UX 설계 및 디자인 가이드라인 구축에 활용, 팀원 간의 효과적인 디자인 커뮤니케이션 및 일관성 있는 디자인 유지

<br />

## 🛠 빌드 환경

| FrontEnd                | BackEnd                                      | Database   | Infra                      |
| :---------------------- | :------------------------------------------- | :--------- | :------------------------- |
| Node.js 18.16.1         | Java 11           | MySQL | AWS EC2 (Ubuntu 20.04 LTS) |
| React.js 18.2.0         | Spring Boot 2.7.15                            | MongoDB    | Docker 23.0.6              |
| react-native        | Gradle 8.1.1                                 | Redis      | Nginx 1.18.0               |
| typescript      | Spring Data JPA                                          |    | Jenkins 2.401.2 LTS        |
| react-native styled components      | Spring Security |            |               |
| | lombok                                       |            |       |
| | Oauth 2.0                                         |   |
| | JWT                                          |  |

<br>
<br>

## 📄 산출물

#### 최종발표자료
[😎 캔바 링크](https://www.canva.com/design/DAFz9CVPbIQ/V0Vt5LbQ50ublWIr1kfoPQ/view?utm_content=DAFz9CVPbIQ&utm_campaign=designshare&utm_medium=link&utm_source=editor)

#### 아키텍쳐
![아키텍쳐구조도](https://github.com/qkrrlgus114/dallim/assets/121294224/892ffed3-c63a-4711-9025-27a837a29fbd)

#### 디자인
![디자인](https://github.com/soyeonnnb/dallim/assets/71217221/208e7f63-553c-4aa7-9a7e-75177067fffe)

#### 요구사항 명세서
![요구사항명세서](https://github.com/soyeonnnb/dallim/assets/71217221/3ce49661-226f-43c7-b8d8-4b6dfb06c62b)

#### API 명세서
![API명세서](https://github.com/soyeonnnb/dallim/assets/71217221/79e9b12e-11da-408d-8709-e5dd3d716a20)

#### ERD
![erd](https://github.com/soyeonnnb/dallim/assets/71217221/80c07fba-03d5-40bc-a2e5-2508cdbf8da8)

<br/>
