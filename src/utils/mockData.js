export const MOCK_PROFILE = {
    display_name: "Demo User",
    images: [],
    followers: { total: 0 }
};

export const MOCK_TRACKS = [
    {
        id: "mock1",
        name: "Midnight City",
        artists: [{ name: "M83" }],
        album: { 
            name: "Hurry Up, We're Dreaming",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b27329528659d57a242f38d38865" }]
        },
        duration_ms: 243000,
        external_urls: { spotify: "https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt" }
    },
    {
        id: "mock2",
        name: "Starboy",
        artists: [{ name: "The Weeknd" }, { name: "Daft Punk" }],
        album: { 
            name: "Starboy",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b2734718e28d24227b9dc7491d43" }]
        },
        duration_ms: 230000,
        external_urls: { spotify: "https://open.spotify.com/track/7MXVkk9YMctZqd1Srtv4MB" }
    },
    {
        id: "mock3",
        name: "Do I Wanna Know?",
        artists: [{ name: "Arctic Monkeys" }],
        album: { 
            name: "AM",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163" }]
        },
        duration_ms: 272000,
        external_urls: { spotify: "https://open.spotify.com/track/5FVd6KXrgO9B3JPmC8OPst" }
    },
    {
        id: "mock4",
        name: "The Less I Know The Better",
        artists: [{ name: "Tame Impala" }],
        album: { 
            name: "Currents",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b2739e1cfc75c36f079550795232" }]
        },
        duration_ms: 216000,
        external_urls: { spotify: "https://open.spotify.com/track/6K4t31amVTZDgR3sKmwUJJ" }
    },
    {
        id: "mock5",
        name: "Sweater Weather",
        artists: [{ name: "The Neighbourhood" }],
        album: { 
            name: "I Love You.",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36" }]
        },
        duration_ms: 240000,
        external_urls: { spotify: "https://open.spotify.com/track/2QjOHCTQ1Jl3zawyYOpxh6" }
    }
];
