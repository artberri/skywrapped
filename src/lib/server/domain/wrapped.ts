export interface Wrapped {
  did: string;
  handle: string;
  year: number;
  displayName: string;
  current: {
    posts: number;
    following: number;
    followers: number;
    accountAge: number;
  };
  bestTime: {
    mostActiveDay: number;
    peakPostingHour: number;
  };
}
