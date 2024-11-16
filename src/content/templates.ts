export interface Template {
  id: string;
  pageId: string;
  name: string;
  images: string[];
  runCount: number;
  prePrompt: string;
  createdAt: Date;
  isNew: boolean;
}

export const templates: Template[] = [
  {
    id: "0",
    pageId: "0",
    name: "Start from scratch",
    images: [],
    runCount: 0,
    prePrompt: "Your prompt here",
    createdAt: new Date("2024-03-01"),
    isNew: false
  },
  {
    id: "tinder-dating",
    pageId: "tinder-dating",
    name: "Tinder Dating",
    images: [
      "/categories/dating/1.webp",
      "/categories/dating/2.webp"
    ],
    runCount: 10,
    prePrompt: "curly dark hair, seated at a table in a casual setting, wearing a light-colored camisole. smiling warmly at the camera with arms casually crossed on the table. The background features soft, warm lighting from hanging bulbs, creating a cozy atmosphere",
    createdAt: new Date("2024-03-01"),
    isNew: true
  },
  {
    id: "professional-headshot",
    pageId: "professional-headshot",
    name: "Professional Headshot",
    images: [
      "/categories/professional-headshot/1.webp",
      "/categories/professional-headshot/2.webp"
    ],
    runCount: 120,
    prePrompt: "",
    createdAt: new Date("2024-03-02"),
    isNew: true
  },
  {
    id: "ai-selfie",
    pageId: "ai-selfie",
    name: "Ai Selfie",
    images: [
      "/categories/ai-selfie/1.jpg",
      "/categories/ai-selfie/2.webp"
    ],
    runCount: 90,
    prePrompt: "A stunning ultra-HD portrait of a young woman with a modern, stylish flair. slight smirk, she holds her iPhone Pro Max with a chic marble-patterned phone case, taking a selfie in front of a large mirror. The background is a minimalist, modern apartment with clean lines and muted tones, featuring a statement art piece on the wall, which adds a touch of sophistication to the scene, cinematic, fashion",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "black-and-white",
    pageId: "black-and-white",
    name: "Black and White",
    images: [
      "/categories/blackandwhite/1.webp",
      "/categories/blackandwhite/2.webp"
    ],
    runCount: 90,
    prePrompt: "A black and white photograph of a woman with long, dark hair cascading over her shoulders, wearing a high-collar blazer with lace-trimmed cuffs, open to reveal a low-cut neckline. She adorns a statement necklace with a branch-like design, adorned with large, sparkling beads and small, round stones. Soft, diffused lighting highlights the texture of her hair and the intricate details of her jewelry, with the plain, out-of-focus background emphasizing her. The scene is framed with subtle film grain and a warm, nostalgic color grading, evoking the visual style of a classic film noir.",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "cosplay",
    pageId: "cosplay",
    name: "Cosplay",
    images: [
      "/categories/cosplay/1.webp",
      "/categories/cosplay/2.webp"
    ],
    runCount: 90,
    prePrompt: " cute european woman,hot sailormoon cosplay ,posing , epic action scene,real photo,full body,young,sweet,modelposing,full image,stock,white overarm gloves, red overknee boots,hot look",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "cyberpunk",
    pageId: "cyberpunk",
    name: "Cyberpunk",
    images: [
      "/categories/cyberpunk/1.webp",
      "/categories/cyberpunk/2.webp"
    ],
    runCount: 90,
    prePrompt: "Pin up girl of the future,cyberpunk,lingerie,dynamic lights,very high detailed background,8k moviescene,full body on a futuristic motorcycle,blade runner",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "instagram-influencer",
    pageId: "instagram-influencer",
    name: "Instagram Influencer",
    images: [
      "/categories/instagram-influencer/1.webp",
      "/categories/instagram-influencer/2.webp"
    ],
    runCount: 90,
    prePrompt: "",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "landmark-selfie",
    pageId: "landmark-selfie",
    name: "Landmark Selfie",
    images: [
      "/categories/landmark-selfie/1.jpg",
      "/categories/landmark-selfie/2.jpg"
    ],
    runCount: 90,
    prePrompt: "",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "swimsuit",
    pageId: "swimsuit",
    name: "Swimsuit",
    images: [
      "/categories/swimsuit/1.jpg",
      "/categories/swimsuit/2.webp"
    ],
    runCount: 90,
    prePrompt: "",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "latex",
    pageId: "latex",
    name: "Latex",
    images: [
      "/categories/latex/1.webp",
      "/categories/latex/2.webp"
    ],
    runCount: 90,
    prePrompt: "Portrait of a gorgeous woman, 20 years old, with open lush breasts, a thin leather bra, waist-length, with tattoos on her arms, long white hair, and a piercing gaze. The woman playfully sticks out her tongue and smiles. Long white hair frames an expressive face with clearly defined eyebrows and full lips. The skin is smooth, warm tone. The body is decorated with numerous tattoos, especially noticeable on the arms and chest. The neck is adorned with a black latex choker with metal elements. The background is dark, which creates a dramatic contrast. Directional lighting emphasizes facial features and sparkle in the eyes. The style of the photo is a glamorous portrait with elements of alternative aesthetics. Close-up, focus on the face and upper body.",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "lingerie",
    pageId: "lingerie",
    name: "Lingerie",
    images: [
      "/categories/lingerie/1.webp",
      "/categories/lingerie/2.webp"
    ],
    runCount: 90,
    prePrompt: "young woman in vinyl lingerie ,model with stocking,chain,harness,watching a in bed,candlelight,lovely look",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "travel",
    pageId: "travel",
    name: "Travel",
    images: [
      "/categories/travel/2.webp",
      "/categories/travel/3.webp"
    ],
    runCount: 90,
    prePrompt: "",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "nature",
    pageId: "nature",
    name: "Nature",
    images: [
      "/categories/nature/1.webp",
      "/categories/nature/2.jpg"
    ],
    runCount: 90,
    prePrompt: "A woman with long wavy brown hair, sitting on a picnic blanket in a park, wearing a peach-colored sundress with thin straps and a floral pattern, smiling warmly, with legs to the side, leaning slightly back, surrounded by green grass and trees under soft daylight.",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "party-vibes",
    pageId: "party-vibes",
    name: "Party Vibes",
    images: [
      "/categories/party-vibes/1.webp",
      "/categories/party-vibes/2.webp"
    ],
    runCount: 90,
    prePrompt: "brasil carnival, costume , beautiful young woman ,festival,very sweet smile,model,stocking,on a show,lightshow,laser,confetti,dancing",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "polaroid",
    pageId: "polaroid",
    name: "Polaroid",
    images: [
      "/categories/polaroid/1.webp",
      "/categories/polaroid/2.jpg"
    ],
    runCount: 90,
    prePrompt: "A close-up of a woman with long, wavy dark brown hair blowing gently in the wind, her somber, contemplative gaze fixed on the horizon. The cloudy sky casts a soft, diffused light, creating a moody, introspective atmosphere. Her skin is fair with a hint of warmth, and her eyes, a deep hazel, convey a sense of deep thought and melancholy. The lighting is natural, with a soft fill light from the side, casting subtle shadows on her face. The background is a vast, open landscape with rolling hills and distant mountains, adding to the sense of solitude and reflection. The scene is framed with a shallow depth of field, blurring the background slightly, and the color grading is cool and desaturated, enhancing the somber mood. Inspired by the visual style of Terrence Malick, the image has a cinematic quality with a hint of film grain, adding a tactile, organic feel.",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "potraits",
    pageId: "potraits",
    name: "Potraits",
    images: [
      "/categories/potraits/1.webp",
      "/categories/potraits/2.webp"
    ],
    runCount: 90,
    prePrompt: "A close-up portrait with golden-brown eyes, partially covered by a lace veil, with sunlight casting intricate lace shadows on glowing skin. Gazes directly at the camera",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "snow-bikini",
    pageId: "snow-bikini",
    name: "Snow Bikini",
    images: [
      "/categories/snow-bikini/1.webp",
      "/categories/snow-bikini/2.webp"
    ],
    runCount: 90,
    prePrompt: "Very seductive blonde woman in a black bikini in a snow landscape, sweet look",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "wanderlust",
    pageId: "wanderlust",
    name: "Wanderlust",
    images: [
      "/categories/wanderlust/1.webp",
      "/categories/wanderlust/2.webp"
    ],
    runCount: 90,
    prePrompt: "on a boat deck, wearing a light gray button-up shirt. Facing the camera confidently, right hand in her pocket. The background includes the boat, water, and distant hills under a clear sky",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "old-money",
    pageId: "old-money",
    name: "Old Money",
    images: [
      "/categories/old-money/1.jpeg",
      "/categories/old-money/2.webp"
    ],
    runCount: 90,
    prePrompt: "",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "strange-fashion",
    pageId: "strange-fashion",
    name: "Strange Fashion",
    images: [
      "/categories/strange-fashion/1.webp",
      "/categories/strange-fashion/2.webp"
    ],
    runCount: 90,
    prePrompt: "The image features a woman standing confidently with both hands lightly touching the swirling, ribbon-like structures surrounding her. She is wearing an elegant, form-fitting, off-the-shoulder gown in white, with intricate folds and a deep V-neckline. The ribbons gracefully wrap around her body, creating a dynamic flow. Her posture is upright, with her head held high, giving a poised, ethereal appearance. Her hair is pulled back in a sleek, neat style, and her facial expression is calm and composed. Cinematic style, Photorealism",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "only-fans",
    pageId: "only-fans",
    name: "Only Fans",
    images: [
      "/categories/onlyfans/1.webp",
    "/categories/onlyfans/2.webp"
    ],
    runCount: 90,
    prePrompt: "",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "adventure-sports",
    pageId: "adventure-sports",
    name: "Adventure Sports",
    images: [
      "/categories/adventure-sports/1.jpg",
    "/categories/adventure-sports/2.jpg"
    ],
    runCount: 90,
    prePrompt: "",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "mythical",
    pageId: "mythical",
    name: "Mythical",
    images: [
      "/categories/mythical/1.webp",
    "/categories/mythical/2.webp"
    ],
    runCount: 90,
    prePrompt: "",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "nightlife",
    pageId: "nightlife",
    name: "Nightlife",
    images: [
      "/categories/nightlife/1.webp",
    "/categories/nightlife/2.webp"
    ],
    runCount: 90,
    prePrompt: "",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  
  // Add all other templates...
]; 