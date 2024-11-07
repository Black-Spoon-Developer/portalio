import { configureStore } from "@reduxjs/toolkit";

// 중앙 스토어 설정
const store = configureStore({
  reducer: {},
});

// RootState 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
