import { NAME, EMAIL, currentRole, getExperience, getSocialLinks } from '@/lib/filesystem/profile';

export default function Profile() {
  const role = currentRole();
  return (
    <article className="profile">
      <h1>{NAME}</h1>
      <p>{role.title}, {role.company}. Software engineer building technology for the wine industry.</p>

      <h2>Experience</h2>
      <ul>
        {getExperience().map(({ title, company, period }) => (
          <li key={`${company}-${title}`}>
            {title}, {company} ({period})
          </li>
        ))}
      </ul>

      <h2>Contact</h2>
      <ul>
        <li>{EMAIL.replace('@', ' at ').replaceAll('.', ' dot ')}</li>
        {getSocialLinks().map(({ platform, url, handle }) => (
          <li key={platform}>
            <a href={`https://${url}`} rel="me">{platform}: {handle}</a>
          </li>
        ))}
      </ul>
    </article>
  );
}
