import { create } from "zustand";

import type { LiveJoinCredentials } from "@/types";

type LiveRoomState = { credentials: LiveJoinCredentials | null; setCredentials: (value: LiveJoinCredentials | null) => void };
export const useLiveRoomStore = create<LiveRoomState>((set) => ({ credentials: null, setCredentials: (credentials) => set({ credentials }) }));
