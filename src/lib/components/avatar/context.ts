// Shared context key for Avatar components
export const AVATAR_CONTEXT_KEY = Symbol("avatar");

export type AvatarContext = {
	imageLoading: boolean;
	setImageLoading: (loading: boolean) => void;
	imageError: boolean;
	setImageError: (error: boolean) => void;
	imageLoaded: boolean;
	setImageLoaded: (loaded: boolean) => void;
};
