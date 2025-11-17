import { AudioPlayer } from "../components/AudioPlayer/AudioPlayer";
import "./App.css";
import { Providers } from "./Providers";

function App() {
  return (
    <Providers>
      <AudioPlayer />
    </Providers>
  );
}

export default App;
