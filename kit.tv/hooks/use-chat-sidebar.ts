import {create} from "zustand";

export enum ChatVariant {
    CHAT = "CHAT",
    COMMUNITY = "COMMUNITY"
}

interface ChatSidebarStore {
    collapsed: boolean;
    variant: ChatVariant;
    onExapnd: () => void;
    onCollapse: () => void;
    onChangeVariant: (variant: ChatVariant) => void;
}

export const useChatSidebar = create<ChatSidebarStore>((set) => ({
    collapsed: false,
    variant: ChatVariant.CHAT,
    onExapnd: () => set(() => ({collapsed: false})),
    onCollapse: () => set(() => ({collapsed: true})),
    onChangeVariant: (variant: ChatVariant) => set(() => ({variant}))
}));