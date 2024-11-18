import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 로컬 스토리지 사용
import authReducer from "./store/auth/AuthSlice"; // authSlice 가져오기
import sideTabReducer from "./store/nav/SideNavSlice";
import aiInterviewReducer from "./store/aiInterview/InterviewSlice";

// persist 설정
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "sideNav", "aiInterview"], // auth, sideTab 슬라이스 추가
};

// 여러 슬라이스를 결합할 때 사용 - 사용할 reducer 하나씩 추가하는 곳!
const rootReducer = combineReducers({
  auth: authReducer,
  sideNav: sideTabReducer, // auth 슬라이스 추가
  aiInterview: aiInterviewReducer,
});

// persistReducer로 rootReducer 감싸기
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 중앙 스토어 설정
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

// persistor 생성
export const persistor = persistStore(store);

// RootState 및 AppDispatch 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
