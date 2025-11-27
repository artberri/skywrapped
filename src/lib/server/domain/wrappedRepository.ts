import type { Wrapped } from "./wrapped";

export interface WrappedRepository {
	getByDidAndYear(did: string, year: number): Promise<Wrapped | undefined>;
	get(handle: string, year: number): Promise<Wrapped | undefined>;
	save(wrapped: Wrapped): Promise<void>;
	delete(did: string): Promise<void>;
}
