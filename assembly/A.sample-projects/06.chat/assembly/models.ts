import { storage } from 'near-sdk-as';

const PROTOCOL_VERSION = "10";


// Exporting a new class PostedMessage so it can be used outside of this file.
@nearBindgen
export class PostedMessage {

  constructor(
    public message_id: u64,
    public sender: string,
    public text: string,
    public thread_id: u64,
    public channel: string) { }

}

export const THREAD_NAME_PREFIX = "!";

@nearBindgen
export class Thread {

  constructor(
    public channel: string,
    public thread_id: u64,
    public name: string) { }

}

export function getChannelCollectionName(channel: string): string {
  return "CHANNEL" + PROTOCOL_VERSION + ":" + channel;
}

export function getThreadCollectionName(threadId: u64): string {
  return "THREAD" + PROTOCOL_VERSION + ":" + threadId.toString();
}

