import { useMemo } from "react";
import { useQuery } from "react-query";
import Tippy from "@tippyjs/react";

import { fetchGithubRepos, PopularRepoData, LanguageData } from "./fetchers/githubFetchers";

import "./styles/githubRepos.css";
import "tippy.js/dist/tippy.css";

const PopularRepoMetaData = ({ html_url, name, visibility, license, archived, description }: PopularRepoData) => {
  return (
    <>
      <div>
        <a href={html_url} target="_blank">
          <span className="repo-title">{name.length + 4 > 28 ? name.substring(0, 26) + "..." : name}</span>
        </a>
        <div className="repo-attributes">
          <div className="repo-attrib-container">
            <div>
              <span>{visibility.charAt(0).toUpperCase() + visibility.slice(1)}</span>
            </div>
          </div>
          {license && (
            <div className="repo-attrib-container">
              <div>
                <Tippy content={license.description}>
                  <div>
                    <a href={license.html_url}>{license.spdx_id}</a>
                  </div>
                </Tippy>
              </div>
            </div>
          )}
          {archived && (
            <div className="repo-attrib-container">
              <div>
                <span>Archived</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {description ? <span className="repo-description">{description}</span> : <span className="repo-description">&nbsp;</span>}
    </>
  );
};

const PopularRepoLanguagesBar = ({ percents }: { [key: string]: LanguageData[] }) => {
  return (
    <>
      <div className="repo-percentage-bar">
        {percents && percents.length > 0 ? (
          percents.map(({ language, percent, color }, index) => (
            <Tippy content={<span>{language}</span>} key={index}>
              <div className="repo-percentage-bar-item" style={{ backgroundColor: color, width: `${percent}%` }} key={index}></div>
            </Tippy>
          ))
        ) : (
          <span></span>
        )}
      </div>
      <div className="repo-languages">
        {percents && percents.length > 0 ? (
          percents.map(({ language, percent, color }, index) => (
            <div className="repo-language-wrapper" key={index}>
              <div className="repo-language-container">
                <svg style={{ fill: color }} width="16px" height="16px" viewBox="0 0 16 16">
                  <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
                </svg>
                <span className="repo-language-title">{language}</span>
                <span className="repo-language-percentage">{percent}%</span>
              </div>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
};

const PopularRepos = ({ popularReposData }: { [key: string]: PopularRepoData[] }) => {
  return (
    <div className="repos-container">
      <div className="repos-header">
        <span className="repos-header-title">Popular repositories</span>
        <a href={popularReposData[0].owner.html_url + "?tab=repositories"} target="_blank">
          <span className="repos-header-link">view all my repositories</span>
        </a>
      </div>
      <div className="repo-blocks-wapper">
        <div className="repo-blocks-container">
          {popularReposData.map((value, index) => {
            return (
              <div key={index} className="repo-block-container">
                <PopularRepoMetaData {...value} />
                <PopularRepoLanguagesBar percents={value.languages_percentages} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function DisplayGithubPopularRepos() {
  const randNumber = useMemo(() => Math.round(Math.random() * 2) + 4, []);

  const {
    isError: isErrorRepos,
    isLoading: isLoadingRepos,
    data: reposData,
    error: reposError,
  } = useQuery([], fetchGithubRepos, { staleTime: Infinity });

  if (isLoadingRepos) {
    return (
      <div className="repos-skeleton-wapper">
        <div className="repos-skeleton-container">
          {Array.from({ length: randNumber }, (_, index) => (
            <div key={index} className="skeleton-block-container">
              <div>
                <div className="skeleton-line width-80-perc" />
                <div className="skeleton-line width-10-perc" />
              </div>
              <div className="skeleton-line width-60-perc" />
              <div className="skeleton-line width-100-perc" />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (isErrorRepos) {
    console.error(reposError);
    return (
      <div>
        <h1></h1>
      </div>
    );
  }

  if (reposData) return <PopularRepos popularReposData={reposData} />;
}
