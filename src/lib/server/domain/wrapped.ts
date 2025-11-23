export interface Wrapped {
  readonly did: string;
  readonly handle: string;
  readonly year: number;
  readonly displayName: string;
  readonly current: {
    readonly posts: number;
    readonly following: number;
    readonly followers: number;
    readonly accountAge: number;
  };
  readonly yearActivity: {
    readonly posts: number;
    readonly replies: number;
    readonly reposts: number;
    readonly quotes: number;
    readonly likes: number;
    readonly bookmarks: number;
  };
  readonly bestTime: {
    readonly mostActiveDay: number;
    readonly peakPostingHour: number;
  };
}
