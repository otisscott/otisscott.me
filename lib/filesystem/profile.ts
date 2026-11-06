import { fileSystem } from '@/lib/filesystem';
import type { FileNode } from '@/lib/filesystem/types';

export { EMAIL } from '@/lib/filesystem/data';

export const NAME = 'Otis Scott';

export interface Role {
  title: string;
  company: string;
  period: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
  description: string;
}

export function getExperience(): Role[] {
  const dir = fileSystem.getNodeAtPath('work/experience');
  if (!dir || dir.type !== 'directory') return [];
  return Array.from(dir.children.values())
    .filter((node): node is FileNode => node.type === 'file')
    .reverse()
    .map(file => {
      const lines = file.content.split('\n');
      return {
        title: lines[0].replace('# ', ''),
        company: lines[1].replace('## ', ''),
        period: lines[3].replace('📅 ', ''),
      };
    });
}

export function getSocialLinks(): SocialLink[] {
  const content = fileSystem.readFile('contact/social.json');
  if (!content) return [];
  const social = JSON.parse(content) as Record<string, Omit<SocialLink, 'platform'>>;
  return Object.entries(social).map(([platform, data]) => ({ platform, ...data }));
}

export function currentRole(): Role {
  return getExperience()[0];
}
