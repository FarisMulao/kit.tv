import {create} from "zustand";

interface CreatorSidebarStore{
    collapsed: boolean;
    onExapnd: () => void;
    onCollapse: () => void;
}

export const useCreatorSidebar = create<CreatorSidebarStore>((set) => ({
    collapsed: false,
    onExapnd: () => set(() => ({collapsed: false})),
    onCollapse: () => set(() => ({collapsed: true})),
}));