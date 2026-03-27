import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import { UserProvider } from "@/context/UserContext";
import Index from "./pages/Index";
import Setup from "./pages/Setup";
import Game from "./pages/Game";
import Sessions from "./pages/Sessions";
import NotFound from "./pages/NotFound";
import CustomCardsPage from "@/components/custom-cards/CustomCardsPage";
import CreateRoom from "@/components/multiplayer/CreateRoom";
import RoomLobby from "@/components/multiplayer/RoomLobby";
import JoinRoom from "@/components/multiplayer/JoinRoom";
import MultiplayerGame from "@/components/multiplayer/MultiplayerGame";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import UpdatePrompt from "@/components/pwa/UpdatePrompt";
import OfflineIndicator from "@/components/pwa/OfflineIndicator";

const queryClient = new QueryClient();

const isComingSoon = import.meta.env.VITE_COMING_SOON === 'true';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <GameProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {!isComingSoon && (
                <>
                  <Route path="/setup" element={<Setup />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/mis-cartas" element={<CustomCardsPage />} />
                  <Route path="/multiplayer/create" element={<CreateRoom />} />
                  <Route path="/multiplayer/lobby/:roomCode" element={<RoomLobby />} />
                  <Route path="/multiplayer/game/:roomCode" element={<MultiplayerGame />} />
                  <Route path="/join/:roomCode?" element={<JoinRoom />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <InstallPrompt />
          <UpdatePrompt />
          <OfflineIndicator />
        </GameProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
