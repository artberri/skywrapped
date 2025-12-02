export interface Wrapped {
	readonly createdAt: number;
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
		readonly byDay: Record<number, number>;
	};
	readonly bestTime: {
		readonly mostActiveDay: number;
		readonly peakPostingHour: number;
		readonly averagePostsPerDay: number;
	};
	readonly engagement: {
		readonly replies: number;
		readonly reposts: number;
		readonly quotes: number;
		readonly likes: number;
		readonly bookmarks: number;
	};
	readonly topPost?: {
		readonly link: string;
		readonly text: string;
		readonly image?: {
			readonly url: string;
			readonly alt: string;
			readonly aspectRatio?: {
				readonly width: number;
				readonly height: number;
			};
		};
		readonly likes: number;
		readonly reposts: number;
	};
	readonly languages: {
		readonly code: string;
		readonly name: string;
		readonly percentage: number;
	}[];
	readonly hashtags: {
		readonly hashtag: string;
		readonly count: number;
	}[];
	readonly emojis: {
		readonly champions: {
			readonly emoji: string;
			readonly count: number;
		}[];
		readonly total: number;
	};
	readonly connections: {
		readonly handle: string;
		readonly displayName: string;
		readonly avatar?: string;
		readonly following: boolean;
		readonly followsYou: boolean;
	}[];
}
