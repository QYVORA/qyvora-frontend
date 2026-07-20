import type { VFSNode, TerminalState } from '../types';

export function injectBootcampContent(
  state: TerminalState,
  bootcampId: string,
  phaseId?: string,
  roomId?: string,
): TerminalState {
  const root = { ...state.root };

  let projectsDir = root.children.find(c => c.name === 'home');
  if (!projectsDir) return state;
  let homeDir = projectsDir.children.find(c => c.name === 'kali');
  if (!homeDir) return state;
  let projectsNode = homeDir.children.find(c => c.name === 'Projects');
  if (!projectsNode) return state;

  const bootcampDir: VFSNode = {
    name: 'bootcamp-' + bootcampId.replace(/[^a-zA-Z0-9_-]/g, ''),
    type: 'dir',
    children: [
      {
        name: 'README.md',
        type: 'file',
        content: `# Bootcamp: ${bootcampId}\nPhase: ${phaseId || 'N/A'} — Room: ${roomId || 'N/A'}\n\nThis directory contains practice files and exercises\nfor the current bootcamp room.\n`,
        permissions: '-rw-r--r--',
        owner: 'kali',
        group: 'kali',
        size: 140,
        children: [],
      },
      {
        name: 'exercises',
        type: 'dir',
        children: [
          {
            name: 'practice-1.txt',
            type: 'file',
            content: 'Exercise 1: Use ls to explore the file system\nExercise 2: Use cat to read this file\nExercise 3: Try pwd to see your current location\n',
            permissions: '-rw-r--r--',
            owner: 'kali',
            group: 'kali',
            size: 130,
            children: [],
          },
        ],
        permissions: 'drwxr-xr-x',
        owner: 'kali',
        group: 'kali',
        size: 4096,
      },
      {
        name: 'targets',
        type: 'dir',
        children: [],
        permissions: 'drwxr-xr-x',
        owner: 'kali',
        group: 'kali',
        size: 4096,
      },
    ],
    permissions: 'drwxr-xr-x',
    owner: 'kali',
    group: 'kali',
    size: 4096,
  };

  projectsNode.children = [...projectsNode.children, bootcampDir];

  return {
    ...state,
    root,
  };
}

export function injectCourseContent(
  state: TerminalState,
  courseId: string,
  lessonId?: string,
): TerminalState {
  const root = { ...state.root };

  let projectsDir = root.children.find(c => c.name === 'home');
  if (!projectsDir) return state;
  let homeDir = projectsDir.children.find(c => c.name === 'kali');
  if (!homeDir) return state;
  let projectsNode = homeDir.children.find(c => c.name === 'Projects');
  if (!projectsNode) return state;

  const courseDir: VFSNode = {
    name: 'course-' + courseId.replace(/[^a-zA-Z0-9_-]/g, ''),
    type: 'dir',
    children: [
      {
        name: 'README.md',
        type: 'file',
        content: `# Course: ${courseId}\nLesson: ${lessonId || 'Overview'}\n\nThis directory contains practice files and exercises\nfor the current lesson.\n`,
        permissions: '-rw-r--r--',
        owner: 'kali',
        group: 'kali',
        size: 120,
        children: [],
      },
      {
        name: 'exercises',
        type: 'dir',
        children: [
          {
            name: 'practice-1.txt',
            type: 'file',
            content: 'Exercise 1: Use ls to explore the file system\nExercise 2: Use cat to read this file\nExercise 3: Try pwd to see your current location\n',
            permissions: '-rw-r--r--',
            owner: 'kali',
            group: 'kali',
            size: 130,
            children: [],
          },
        ],
        permissions: 'drwxr-xr-x',
        owner: 'kali',
        group: 'kali',
        size: 4096,
      },
    ],
    permissions: 'drwxr-xr-x',
    owner: 'kali',
    group: 'kali',
    size: 4096,
  };

  projectsNode.children = [...projectsNode.children, courseDir];

  return {
    ...state,
    root,
  };
}
