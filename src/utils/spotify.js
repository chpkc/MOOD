const BASE_URL = "https://api.spotify.com/v1";

// Cache configuration
const CACHE_CONFIG = {
    "me/player/currently-playing": 5 * 1000, // 5 seconds
    "me/player/recently-played": 60 * 1000, // 1 minute
    "default": 5 * 60 * 1000 // 5 minutes for everything else (profile, top tracks/artists)
};

async function fetchWebApi(endpoint, method = "GET", body) {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  // Check rate limit cooldown
  const rateLimitReset = localStorage.getItem("spotify_rate_limit_reset");
  if (rateLimitReset && Date.now() < parseInt(rateLimitReset)) {
      console.warn("Rate limit active. Returning cached data or null.");
      // Try to return cached data if available, otherwise throw
      const cacheKey = `spotify_cache_${endpoint}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
          return JSON.parse(cached).data;
      }
      throw new Error("429 Too Many Requests (Cooldown active)");
  }

  // Check cache for GET requests
   if (method === "GET" && !body) {
       const cacheKey = `spotify_cache_${endpoint}`;
       const cached = localStorage.getItem(cacheKey);
       if (cached) {
           try {
               const { timestamp, data } = JSON.parse(cached);
               // Determine TTL based on endpoint
               let ttl = CACHE_CONFIG["default"];
               if (endpoint.includes("currently-playing")) ttl = CACHE_CONFIG["me/player/currently-playing"];
               else if (endpoint.includes("recently-played")) ttl = CACHE_CONFIG["me/player/recently-played"];

               if (Date.now() - timestamp < ttl) {
                   return data;
               }
           } catch (e) {
               console.warn("Cache parsing failed, clearing cache key", cacheKey);
               localStorage.removeItem(cacheKey);
           }
       }
   }
  
  try {
      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.status === 401) {
          // Token expired
          localStorage.removeItem("access_token");
          localStorage.removeItem("verifier");
          window.location.href = "/";
          return null;
      }

      if (res.status === 429) {
          const retryAfter = res.headers.get("Retry-After") || 5; // Default 5 seconds
          const resetTime = Date.now() + (parseInt(retryAfter) * 1000);
          localStorage.setItem("spotify_rate_limit_reset", resetTime);
          console.error(`Rate limited. Retry after ${retryAfter} seconds.`);
          
          // Return cached data if available
          if (method === "GET") {
              const cacheKey = `spotify_cache_${endpoint}`;
              const cached = localStorage.getItem(cacheKey);
              if (cached) return JSON.parse(cached).data;
          }
          
          throw new Error("429 Too Many Requests");
      }

      if (!res.ok) {
          const errorBody = await res.text();
          let errorMessage = errorBody;
          try {
              const errorJson = JSON.parse(errorBody);
              errorMessage = errorJson.error?.message || JSON.stringify(errorJson.error) || errorBody;
          } catch (e) {
              // ignore
          }
          console.error(`Spotify API Error: ${res.status} ${res.statusText}`, errorMessage);
          throw new Error(`${res.status} ${res.statusText}: ${errorMessage}`);
      }

      // Handle 204 No Content
      if (res.status === 204) return null;

      const data = await res.json();

      // Cache successful GET responses
      if (method === "GET" && !body) {
          const cacheKey = `spotify_cache_${endpoint}`;
          localStorage.setItem(cacheKey, JSON.stringify({
              timestamp: Date.now(),
              data
          }));
      }

      return data;
  } catch (e) {
      console.error("Network or parsing error:", e);
      throw e;
  }
}

export async function getProfile() {
  return await fetchWebApi("me");
}

export async function getTopTracks(time_range = "short_term", limit = 20) {
  return await fetchWebApi(`me/top/tracks?time_range=${time_range}&limit=${limit}`);
}

export async function getTopArtists(time_range = "short_term", limit = 20) {
  return await fetchWebApi(`me/top/artists?time_range=${time_range}&limit=${limit}`);
}

export async function getArtists(ids) {
    // ids is comma separated string
    return await fetchWebApi(`artists?ids=${ids}`);
}

export async function getRecentlyPlayed(limit = 50) {
    return await fetchWebApi(`me/player/recently-played?limit=${limit}`);
}

export async function getAudioFeatures(ids) {
    // ids is comma separated string
    return await fetchWebApi(`audio-features?ids=${ids}`);
}

export async function getCurrentlyPlaying() {
    return await fetchWebApi("me/player/currently-playing");
}
