import { buttonVariants } from "./ui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GithubLogo } from "./GithubSvg";

interface GithubButtonProps {
  username: string;
  repo?: string;
}

export function GithubButton({ username, repo }: GithubButtonProps) {
  const href = repo
    ? `https://github.com/${username}/${repo}`
    : `https://github.com/${username}`;

  return (
    <a
      href={href}
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <GithubLogo />
      <span className="sr-only">GitHub</span>
    </a>
  );
}

interface GithubDropdownProps {
  username: string;
  repo: string;
}

export function GithubDropdown({ username, repo }: GithubDropdownProps) {
  const profileHref = `https://github.com/${username}`;
  const repoHref = `https://github.com/${username}/${repo}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default">
          <GithubLogo />
          <span className="sr-only">GitHub</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={profileHref} target="_blank" rel="noopener noreferrer">
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a href={repoHref} target="_blank" rel="noopener noreferrer">
            Repository
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
