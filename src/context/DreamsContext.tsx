import { Dream } from '@/models/Dream';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

type NewDream = Omit<Dream, 'id'>;

type DreamsContextValue = {
  dreams: Dream[];
  addDream: (dream: NewDream) => void;
};

const DreamsContext = createContext<DreamsContextValue | null>(null);

export function DreamsProvider({ children }: PropsWithChildren) {
  const [dreams, setDreams] = useState<Dream[]>([]);

  const addDream = (data: NewDream) => {
    const dream: Dream = {
      id: Date.now(),
      ...data,
    };

    setDreams((currentDreams) => [dream, ...currentDreams]);
  };

  return (
    <DreamsContext.Provider value={{ dreams, addDream }}>
      {children}
    </DreamsContext.Provider>
  );
}

export function useDreams() {
  const context = useContext(DreamsContext);

  if (!context)
    throw new Error('useDreams must be used inside of DreamsProvider');

  return context;
}
