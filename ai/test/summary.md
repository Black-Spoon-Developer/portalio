제목: 타일링(Tiling) 기법을 활용한 지도 조회 API 캐싱

**문제 인식**
- 카카오 지도 API의 `bounds_changed` 이벤트로 인해 화면 이동 시 과도한 API 요청 발생
- 디바운싱 적용 시 이미 호출했던 범위의 API 재호출, 데이터 요청 누락, 불필요한 렌더링 문제 발생

**문제 해결 과정**
1. **사각형 합치기**: Cache된 다각형 영역 생성, Cache Hit 시 API 요청 미발생
2. **Viewport 기반 캐싱**: 화면 이동 시 캐시되지 않은 영역에 대해 API 요청, 데이터 캐싱
3. **타일링(Tiling) 기법**: 전체 지도를 타일로 나누어 캐시 관리, O(1) 시간 복잡도로 Cache Hit 확인

**해결 방법**
- 위경도 범위 설정
- 타일 분할
- 캐싱 방식: 타일마다 조회 여부 boolean[][] 배열에 기록
- 타일 기준 API 요청: `bound_change` 이벤트 발생 시 캐시되지 않은 타일에 대해 API 요청 및 데이터 캐싱

**코드 예시**
- `cachedTileList` 생성: 2차원 배열로 타일 상태 저장
- `findTileByCoords` 함수: 좌표에 해당하는 타일 인덱스 계산
- `isLoaded` 함수: 타일 로드 여부 확인
- `getBoundingCoordsByCoords` 함수: 타일 좌표 범위 계산
- `requestBoundingCoordsList` 함수: viewport 꼭짓점에 해당하는 타일 요청 및 API 호출

- `requestBoundingCoordsList` 함수: viewport 꼭짓점에 해당하는 타일 요청 및 API 호출

**결과**
- 타일링 기법으로 효율적인 캐싱 가능
- 성능 및 비용 문제 해결
- 이미 호출했던 범위의 API 재호출, 데이터 요청 누락, 불필요한 렌더링 문제 해결
(env)
- `requestBoundingCoordsList` 함수: viewport 꼭짓점에 해당하는 타일 요청 및 API 호출
