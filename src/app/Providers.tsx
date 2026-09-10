import type { FC, PropsWithChildren } from "react";
import { AudioPlayerProvider } from "../shared/contexts/AudioPlayerContext.tsx";
import { Bounce, ToastContainer } from "react-toastify";
// import { ToastContainer } from "react-bootstrap";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AudioPlayerProvider>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </AudioPlayerProvider>
  );
};
