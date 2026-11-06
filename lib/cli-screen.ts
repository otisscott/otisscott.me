import { ANSI } from '@/lib/filesystem/types';
import { NAME, EMAIL, currentRole, getExperience, getSocialLinks } from '@/lib/filesystem/profile';

const RULE = `${ANSI.dim}${'━'.repeat(40)}${ANSI.reset}`;
const SITE = 'https://otisscott.me';

function section(title: string): string[] {
  return [`${ANSI.bold}${title}${ANSI.reset}`, RULE];
}

export function renderCliScreen(): string {
  const role = currentRole();
  const email = EMAIL.replace('@', ' at ').replaceAll('.', ' dot ');
  const lines: string[] = [
    '',
    `${ANSI.bold}${ANSI.brightCyan}otisscott.me${ANSI.reset}`,
    `${ANSI.dim}a terminal in a browser${ANSI.reset}`,
    '',
    `${ANSI.bold}${ANSI.brightCyan}${NAME}${ANSI.reset}`,
    RULE,
    `${ANSI.cyan}Role${ANSI.reset}     ${role.title}`,
    `${ANSI.cyan}Company${ANSI.reset}  ${role.company}`,
    `${ANSI.cyan}Since${ANSI.reset}    ${role.period.split(' - ')[0]}`,
    '',
    ...section('Experience'),
  ];
  for (const { title, company, period } of getExperience()) {
    lines.push(
      `${ANSI.bold}${ANSI.cyan}${title}${ANSI.reset}`,
      `${ANSI.yellow}${company}${ANSI.reset} ${ANSI.dim}${period}${ANSI.reset}`,
      '',
    );
  }
  lines.push(...section('Contact'), `${ANSI.cyan}email${ANSI.reset}      ${email}`);
  for (const { platform, url } of getSocialLinks()) {
    lines.push(`${ANSI.green}${platform.padEnd(11)}${ANSI.reset}${ANSI.blue}https://${url}${ANSI.reset}`);
  }
  lines.push(
    '',
    `Open ${ANSI.bold}${ANSI.brightCyan}${SITE}${ANSI.reset} in a browser for the interactive terminal.`,
    '',
  );
  return lines.join('\n');
}
