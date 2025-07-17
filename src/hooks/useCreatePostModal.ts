import {create} from 'zustand';

interface CreatePostModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useCreatePostModal = create<CreatePostModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({isOpen: true}),
  closeModal: () => set({isOpen: false}),
}));