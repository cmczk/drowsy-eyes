export interface Dream {
  id: number;
  title: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export type NewDream = Pick<Dream, 'title' | 'text'>;

export type UpdateDream = NewDream & { id: number };

export type DreamPreview = Pick<Dream, 'id' | 'title' | 'createdAt'>;
