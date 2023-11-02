import axios from "axios";

interface LicenseData {
  name: string;
  spdx_id: string;
  url: string;
  html_url: string;
  description: string;
}

interface LanguageData {
  language: string;
  percent: string;
  color: string;
}

interface PopularRepoData {
  name: string; //
  owner: {
    login: string; //
    html_url: string; //
  };
  html_url: string; //
  description: string | null;
  languages_percentages: LanguageData[]; //
  created_at: string;
  updated_at: string;
  archived: boolean;
  license: LicenseData;
  visibility: string;
}

interface EventsData {
  type: string;
  actor: {
    display_login: "stojic-luka";
    url: "https://api.github.com/users/stojic-luka";
    avatar_url: "https://avatars.githubusercontent.com/u/124006893?";
  };
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
}

////////////////////////////////

const fetchGithubRepos = async (): Promise<PopularRepoData[]> => {
  // const respData = (await axios.get("https://api.github.com/users/stojic-luka/repos")).data as PopularRepoData[];
  const respData: PopularRepoData[] = (await axios.get("repos.json")).data;

  return Promise.all(
    respData.map(async (obj) => {
      return {
        ...obj,
        languages_percentages: await fetchGithubRepoLanguages(obj.name),
        license: obj.license !== null && (await fetchGithubLicenceUrl(obj.license.url)),
      };
    })
  );
};

////////////////////////////////

const fetchGithubRepo = async (repoName: string): Promise<PopularRepoData | undefined> => {
  // const resp = await axios.get(`https://api.github.com/users/stojic-luka/${repoName}`);
  // const repo = resp.data;
  // return repo;

  const respData: PopularRepoData[] = (await axios.get("repos.json")).data;
  for (let i: number = 0; i < respData.length; i++) {
    if (respData[i].name === repoName) return respData[i];
  }
};

////////////////////////////////

/**
 * Fetches the language distribution of a specific GitHub repository and converts them to percentages identical to GitHub's display.
 *
 * @param context - The query context containing repository name.
 * @returns An object containing language name, language distribution in percentages and color for said language.
 */
const fetchGithubRepoLanguages = async (repoName: string): Promise<LanguageData[]> => {
  // const langData: { [language: string]: number } = (await axios.get(`https://api.github.com/repos/stojic-luka/${repoName}/languages`)).data;

  const langsData: { [language: string]: { [language: string]: number } } = (await axios.get("languages.json")).data;
  const langData: { [language: string]: number } = langsData[repoName];

  const allColors: { [language: string]: string } = await fetchGithubLanguageColors();

  const total = Object.values(langData).reduce((sum, value) => sum + value, 0);
  const languagePercentages: LanguageData[] = Object.keys(langData)
    .sort((a, b) => langData[b] - langData[a])
    .map((key) => ({
      language: key,
      percent: ((langData[key] / total) * 100).toFixed(1),
      color: allColors[key],
    }));

  if (languagePercentages.length > 7) {
    const remainingLanguages = languagePercentages.splice(6);
    const otherPercentage = remainingLanguages.reduce((sum, lang) => sum + Number(lang.percent), 0);

    languagePercentages.push({ language: "Other", percent: otherPercentage.toFixed(1), color: "#ededed" });
  }

  return languagePercentages;
};

const fetchGithubLanguageColors = async () => {
  const resp = await axios.get("colors.json");
  const repo = resp.data;
  return repo;
};

const fetchGithubLicenceUrl = async (licenseUrl: string) => {
  // const resp = await axios.get(licenseUrl);
  const resp = await axios.get("mit.json");
  const repo = resp.data;
  return repo;
};

////////////////////////////////

const fetchGithubEvents = async (): Promise<EventsData[]> => {
  // const resp = await axios.get("https://api.github.com/users/stojic-luka/events");
  const resp = await axios.get("events.json");
  const events = resp.data;
  return events;
};

////////////////////////////////

export type { PopularRepoData, LanguageData, EventsData };
export { fetchGithubRepos, fetchGithubRepo, fetchGithubEvents };
