import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import adminReducer, { AdminState } from "./features/admin/adminSlice";
import membersReducer, { MembersState } from "./features/members/membersSlice";
import eventsReducer, { EventsState } from "./features/events/eventsSlice";
import newsReducer, { NewsState } from "./features/news/newsSlice";

export type RootState = {
    admin: AdminState,
    members: MembersState,
    events: EventsState,
    news: NewsState,
};

const store = configureStore({
    reducer: {
        admin: adminReducer,
        members: membersReducer,
        events: eventsReducer,
        news: newsReducer
    },
    middleware: getDefaultMiddleware({ serializableCheck: false })
});

export type AppDispatch = typeof store.dispatch;

export default store;

