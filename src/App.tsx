import { QueryClient, QueryClientProvider } from "react-query";
import DisplayGithubPopularRepos from "./components/github/displayRepos";
import DisplayGithubContributions from "./components/github/displayContribs";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <DisplayGithubPopularRepos /> */}
      {/* <DisplayGithubContributions /> */}
    </QueryClientProvider>
  );
}
