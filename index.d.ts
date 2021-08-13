import { NativescriptQuietCommon } from './common';

export declare class NativescriptQuiet extends NativescriptQuietCommon {
	static sendMessage(message: string, profile: string): Promise<any>;
	static receiveMessage(profile: String): Promise<any>;
}
