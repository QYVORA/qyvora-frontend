import { Room, Module } from './types';

export function newRoom(): Room {
  return {
    roomId: Date.now(),
    title: "",
    overview: "",
    meetingLink: "",
    cpReward: 250,
  };
}

export function newModule(): Module {
  return {
    moduleId: Date.now(),
    title: "",
    description: "",
    codename: "",
    ctf: "",
    rooms: [newRoom()],
  };
}
