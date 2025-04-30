import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/authContext";
import { ProfileProvider } from "./context/ProfileContext";
import { AnimeProvider } from "./context/AnimeContext";
import { WatchlistProvider } from "./context/watchlistContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <ProfileProvider>
        <AnimeProvider>
          <WatchlistProvider>
            <AppRouter />
          </WatchlistProvider>
        </AnimeProvider>
      </ProfileProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;