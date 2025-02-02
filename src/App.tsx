
import { createSignal } from 'solid-js';
import './App.css';
import SankeyChart from './SankeyChart';

const processInteractions = (interactions: any[]) => {
  return interactions.reduce((stats, entry) => {
    const hasLike = !!entry.like;
    const hasMatch = !!entry.match;
    const hasChats = !!entry.chats;
    const hasWeMet = Array.isArray(entry.we_met) &&
      entry.we_met.some((item: { did_meet_subject: string; }) => item.did_meet_subject === "Yes");

    const likeType = hasLike ? "Sent" : "Received";

    stats[`likes${likeType}`]++;

    if (hasMatch) {
      stats.matches++;
      stats[`matchesFromLikes${likeType}`]++;

      if (hasWeMet) {
        stats.meetups++;
        stats[`meetupsFromLikes${likeType}`]++;
      }
    }

    if (hasChats) {
      stats.totalChats += entry.chats.length;
    }

    return stats;
  }, {
    totalInteractions: interactions.length,
    likesSent: 0,
    likesReceived: 0,
    matches: 0,
    matchesFromLikesSent: 0,
    matchesFromLikesReceived: 0,
    meetups: 0,
    meetupsFromLikesSent: 0,
    meetupsFromLikesReceived: 0,
    totalChats: 0,
  });
};

function App() {
  const [stats, setStats] = createSignal<any | null>(null);

  // Handle file selection and read the file contents as text
  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          try {
            const interactions = JSON.parse(text);
            const computedStats = processInteractions(interactions)
            setStats(computedStats)
            console.log(computedStats)
          } catch (error) {
            console.error("error parsing JSON:", error);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div class="min-h-screen p-6">
      {/* Header section centered horizontally at the top */}
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-center">Hinge Analyser</h1>
      </header>

      <main class="max-w-3xl mx-auto flex flex-col items-center">
        <p class="text-lg mb-6">
          Welcome to Hinge Analyser! This tool is designed to help you quickly view and analyze your Hinge data files.
          Simply click the button below to select a local file, and the raw text contents of the file will be displayed.
        </p>

        <div class="mb-6 items-center">
          <input
            id="fileInput"
            type="file"
            class="file-input file-input-bordered file-input-primary file-input-md w-full max-w-xs"
            onChange={handleFileChange}
            />
        </div>

        {stats() && (
          <>
            {/* Summary section */}
            <h2 class="text-xl font-bold text-center">Summary</h2>
            <div class="stats shadow mb-6">
              <div class="stat place-items-center">
                <div class="stat-title">Interactions</div>
                <div class="stat-value">{stats().totalInteractions}</div>
                <div class="stat-desc">Total</div>
              </div>

              <div class="stat place-items-center">
                <div class="stat-title">Matches</div>
                <div class="stat-value">{stats().matches}</div>
                <div class="stat-desc">
                  {stats().totalInteractions > 0
                    ? ((stats().matches / stats().totalInteractions) * 100).toFixed(2) + "%"
                    : "0%"}
                </div>
              </div>

              <div class="stat place-items-center">
                <div class="stat-title">Meetups</div>
                <div class="stat-value">{stats().meetups}</div>
                <div class="stat-desc">
                  {stats().matches > 0
                    ? ((stats().meetups / stats().matches) * 100).toFixed(2) + "%"
                    : "0%"}
                </div>
              </div>
            </div>

            {/* From likes given section */}
            <h2 class="text-xl font-bold text-center">From Likes Given</h2>
            <div class="stats shadow mb-6">
              <div class="stat place-items-center">
                <div class="stat-title">Likes given</div>
                <div class="stat-value">{stats().likesSent}</div>
                <div class="stat-desc">Total</div>
              </div>

              <div class="stat place-items-center">
                <div class="stat-title">Matches from likes given</div>
                <div class="stat-value">{stats().matchesFromLikesSent}</div>
                <div class="stat-desc">
                  {stats().likesSent > 0
                    ? ((stats().matchesFromLikesSent / stats().likesSent) * 100).toFixed(2) + "%"
                    : "0%"}
                </div>
              </div>

              <div class="stat place-items-center">
                <div class="stat-title">Meetups from likes given</div>
                <div class="stat-value">{stats().meetupsFromLikesSent}</div>
                <div class="stat-desc">
                  {stats().matchesFromLikesSent > 0
                    ? ((stats().meetupsFromLikesSent / stats().matchesFromLikesSent) * 100).toFixed(2) + "%"
                    : "0%"}
                </div>
              </div>
            </div>

            {/* From likes received section */}
            <h2 class="text-xl font-bold text-center">From Likes Received</h2>
            <div class="stats shadow mb-6">
              <div class="stat place-items-center">
                <div class="stat-title">Likes received</div>
                <div class="stat-value">{stats().likesReceived}</div>
                <div class="stat-desc">Total</div>
              </div>

              <div class="stat place-items-center">
                <div class="stat-title">Matches from likes received</div>
                <div class="stat-value">{stats().matchesFromLikesReceived}</div>
                <div class="stat-desc">
                  {stats().likesReceived > 0
                    ? ((stats().matchesFromLikesReceived / stats().likesReceived) * 100).toFixed(2) + "%"
                    : "0%"}
                </div>
              </div>

              <div class="stat place-items-center">
                <div class="stat-title">Meetups from likes received</div>
                <div class="stat-value">{stats().meetupsFromLikesReceived}</div>
                <div class="stat-desc">
                  {stats().matchesFromLikesReceived > 0
                    ? ((stats().meetupsFromLikesReceived / stats().matchesFromLikesReceived) * 100).toFixed(2) + "%"
                    : "0%"}
                </div>
              </div>
            </div>

            <h2 class="text-xl font-bold text-center">Sankey diagram</h2>
            <SankeyChart stats={stats()} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
