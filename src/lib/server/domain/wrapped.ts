export interface Wrapped {
  did: string;
  handle: string;
  year: number;
  current: {
    posts: number;
    following: number;
    followers: number;
    accountAge: number;
  };
}
