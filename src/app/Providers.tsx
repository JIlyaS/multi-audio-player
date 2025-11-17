import type { FC, PropsWithChildren } from "react";
import { AudioPlayerProvider } from "../shared/contexts/AudioPlayerContext.tsx";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return <AudioPlayerProvider>{children}</AudioPlayerProvider>;
};
