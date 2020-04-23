import { context, PersistentVector, PersistentMap } from "near-sdk-as";
import { PostedMessage, Thread, THREAD_NAME_PREFIX, getChannelCollectionName, getThreadCollectionName } from './models';

export function addMessage(channel: string, thread_id: u64, text: string): void {
  let allMessages = new PersistentVector<PostedMessage>("messages");
  let msg_id = allMessages.length;

  if (thread_id == 0) {
    thread_id = msg_id;
  }

  let message = new PostedMessage(msg_id, context.sender, text, thread_id, channel);
  let thread = new Thread(channel, thread_id, text);

  allMessages.push(message);

  let threads = new PersistentMap<u64, Thread>("threads");
  threads.set(thread_id, thread);

  let channelMessageIds = new PersistentVector<u32>(getChannelCollectionName(channel));
  channelMessageIds.push(msg_id);

  let threadMessageIds = new PersistentVector<u32>(getThreadCollectionName(thread_id));
  threadMessageIds.push(msg_id);
}

export function getMessagesForThread(channel: string, thread_id: u64): Array<PostedMessage> {
  let allMessages = new PersistentVector<PostedMessage>("messages");
  let threadMessageIds = new PersistentVector<u32>(getThreadCollectionName(thread_id));

  let ret = new Array<PostedMessage>();

  for (let i = 0; i < threadMessageIds.length; ++i) {
    let posted_message = allMessages[threadMessageIds[i]];
    ret.push(posted_message);
  }
  return ret;
}

export function getMessagesForChannel(channel: string): Array<PostedMessage> {
  let allMessages = new PersistentVector<PostedMessage>("messages");
  let channelMessageIds = new PersistentVector<u32>(getChannelCollectionName(channel));

  let ret = new Array<PostedMessage>();

  for (let i = 0; i < channelMessageIds.length; ++i) {
    let posted_message = allMessages[channelMessageIds[i]];
    ret.push(posted_message);
  }
  return ret;
}

export function getAllMessages(): Array<PostedMessage> {
  let allMessages = new PersistentVector<PostedMessage>("messages");

  let ret = new Array<PostedMessage>();

  for (let i = 0; i < allMessages.length; ++i) {
    ret.push(allMessages[i]);
  }
  return ret;
}

export function getThreadName(thread_id: u64): String {
  let threads = new PersistentMap<u64, Thread>("threads");
  return threads.get(thread_id)!.name;
}

export function setThreadName(channel: string, thread_id: u64, name: string): void {
  let thread = new Thread(channel, thread_id, THREAD_NAME_PREFIX + name);
  let threads = new PersistentMap<u64, Thread>("threads");
  let allThreadIds = new PersistentVector<u64>("all_threads");

  let existingThread = threads.get(thread_id)!;
  if (!existingThread.name.startsWith(THREAD_NAME_PREFIX)) {
    allThreadIds.push(thread_id);
  }
  threads.set(thread_id, thread);
}

export function getAllThreads(): Array<Thread> {
  let threads = new PersistentMap<u64, Thread>("threads");
  let allThreadIds = new PersistentVector<u64>("all_threads");

  let ret = new Array<Thread>();

  for (let i = 0; i < allThreadIds.length; ++i) {
    ret.push(threads.get(allThreadIds[i])!);
  }
  return ret;
}
