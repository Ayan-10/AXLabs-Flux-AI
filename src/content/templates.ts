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
    prePrompt: "With a serene, confident smile, standing in a well-appointed office, dressed in a classic, ivory linen blazer and slim-fitting trousers. the potrait  suggests a tone of professionalism and success.",
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
    prePrompt: "A stunning ultra-HD portrait with a modern, stylish flair. slight smirk, holding an iPhone Pro Max with a chic marble-patterned phone case, taking a selfie in front of a large mirror. The background is a minimalist, modern apartment with clean lines and muted tones, featuring a statement art piece on the wall, which adds a touch of sophistication to the scene, cinematic, fashion",
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
    prePrompt: "with natural dark blonde hair, wearing a colorful flower patterned, loose top tied at the waist and white drawstring shorts, stands in a dynamic pose with her eyes closed and head tilted back. Her midriff is exposed, and her wind-blown hair cascades across her face as she raises a hand to move it away. The scene is set on a partly cloudy, warm, and serene day, with sunlight filtering through the clouds, casting a soft, natural glow. The lighting is warm and diffused, with a slight film grain and pastel color grading, evoking the style of a Wes Anderson film. aidmaimageupgrader, aidmaRealisticPeoplePhotograph",
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
    prePrompt: "standing on top of skyscraper, dubai skyline and burj khalifa visible in background, taking a selfie, nicely dressed",
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
    prePrompt: "with long dark hair is seated on a green bench at a beachside location. wearing a black and white polka dot bikini top and blue denim shorts. Her left hand rests on her thigh while her right hand holds onto the armrest of the bench. looking off to the side with a slight smile playing on her lips. The background features a clear sky, palm trees swaying gently in the breeze, and a wooden picnic table. The lighting is natural and soft, suggesting it's either early morning or late afternoon. There are no other people visible in the image.",
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
    prePrompt: "with open lush breasts, a thin latex bra, waist-length, with tattoos on her arms, long white hair, and a piercing gaze. The woman playfully sticks out her tongue and smiles. Long white hair frames an expressive face with clearly defined eyebrows and full lips. The skin is smooth, warm tone. The body is decorated with numerous tattoos, especially noticeable on the arms and chest. The neck is adorned with a black latex choker with metal elements. The background is dark, which creates a dramatic contrast. Directional lighting emphasizes facial features and sparkle in the eyes. The style of the photo is a glamorous portrait with elements of alternative aesthetics. Close-up, focus on the face and upper body.",
    createdAt: new Date("2024-03-03"),
    isNew: true
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
    prePrompt: "in front of mount fuji, looking at the mountain, picture clicked from back",
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
    id: "glamour",
    pageId: "glamour",
    name: "Glamour",
    images: [
    "/categories/glamour/1.webp",
    "/categories/glamour/2.jpeg"
    ],
    runCount: 90,
    prePrompt: "Professional studio portrait of a model with dramatic lighting, wearing a sparkly evening gown, soft beauty lighting from above, perfect makeup with red lips, flowing hair, shot against a dark background, high fashion editorial style, shallow depth of field, shot on Canon 5D Mark IV",
    createdAt: new Date("2024-03-03"),
    isNew: true
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
    isNew: true
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
    prePrompt: "tailored linen pantsuit, wide-brimmed hat, and cat-eye sunglasses, relaxing on a chaise lounge by a turquoise swimming pool, surrounded by lush palm trees, in a stylized 1940s resort setting.",
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
    prePrompt: "with long brunette hair and fair skin is captured in a candid moment. She's wearing a very loose white tank top that has a very low plunging neckline, paired with blue jeans. Her gaze is directed at the viewer. The background is a textured concrete wall, adding an urban feel to the scene. The lighting appears natural and soft, suggesting it might be daylight outside.",
    createdAt: new Date("2024-03-03"),
    isNew: true
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
    prePrompt: "skydiving, just jumped out of the plane, excited look, looking in the camera, plane flying in the background, wearing a jumpsuit",
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
    prePrompt: "Skin texture, Closeup portrait photo, dressed as a highborn noble from game of thrones,f /2.8, Canon, 85mm,cinematic, high quality, looking at the camera",
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
    prePrompt: "short brunette hair, wearing a spaghetti strap form fitting sequin dress, drinking a glass of champagne at a bar, glossy lipstick, bob haircut, smoky makeup, perfect eyes, moody atmosphere, bluish lighting in the background, vibrant setting",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "sports",
    pageId: "sports",
    name: "Sports",
    images: [
    "/categories/sports/1.jpg",
    "/categories/sports/2.jpg"
    ],
    runCount: 90,
    prePrompt: "Dynamic action shot of an athlete mid-motion, low angle perspective, motion blur in background, dramatic lighting, sweat droplets visible, muscles defined, wearing professional sports gear, outdoor stadium setting, captured at golden hour, shot at 1/1000 second",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "fashion-walk",
    pageId: "fashion-walk",
    name: "Fashion Walk",
    images: [
    "/categories/fashionwalk/1.webp",
    "/categories/fashionwalk/2.jpg"
    ],
    runCount: 90,
    prePrompt: "High-end runway scene, model walking on glossy catwalk, dramatic spotlights, blurred audience in background, haute couture outfit, confident pose mid-stride, professional makeup, high heels creating reflection on runway, shot from front row perspective, urban fashion week setting",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "history-character",
    pageId: "history-character",
    name: "History Character",
    images: [
    "/categories/history-character/1.webp",
    "/categories/history-character/2.jpeg"
    ],
    runCount: 90,
    prePrompt: "Portrait of a Victorian-era nobleman, wearing elaborate period costume with detailed embroidery, standing in ornate study with leather-bound books, oil painting style, dramatic Rembrandt lighting, rich dark colors, authentic historical details, antique furniture in background",
    createdAt: new Date("2024-03-03"),
    isNew: true
  },
  {
    id: "speaker",
    pageId: "speaker",
    name: "Speaker",
    images: [
    "/categories/speaker/1.jpeg",
    "/categories/speaker/2.jpg"
    ],
    runCount: 90,
    prePrompt: "Professional speaker on modern stage, red circular carpet, minimalist background with large LED screen, confident pose with hand gesture, business casual attire, warm spotlight, engaged expression, wide shot showing full stage setup, theater-style seating visible in foreground",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "yt-reaction",
    pageId: "yt-reaction",
    name: "YT Reaction",
    images: [
    "/categories/yt-reaction/1.jpg",
    "/categories/yt-reaction/2.jpg"
    ],
    runCount: 90,
    prePrompt: "Pop art style image. Split screen with a surprised look on one side, speech bubble saying 'youtube' starburst background.",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "street-look",
    pageId: "street-look",
    name: "Street Look",
    images: [
    "/categories/street-look/1.webp",
    "/categories/street-look/2.jpg"
    ],
    runCount: 90,
    prePrompt: "An image of a woman in a poised stance on a city street during the golden hour, when the sunlight softens and enriches the colors around her. She wears an ornate shawl draped over her shoulders, featuring intricate paisley patterns in a palette of burnt orange, teal, and touches of gold. The wrap contrasts with her teal pencil skirt adorned with similar ornamental designs. Her makeup is classic, with a bold red lip, and her expression is one of serene confidence.  The city life blurs in the background. This image captures a moment of elegance amidst the vibrancy of urban life.",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "countryside",
    pageId: "countryside",
    name: "Countryside",
    images: [
    "/categories/countryside/1.jpg",
    "/categories/countryside/2.jpg"
    ],
    runCount: 90,
    prePrompt: "in a long, flowing prairie skirt and a crisp white blouse, her hair blowing in the breeze, walking through a field of tall, golden wheat, with a classic Americana farmhouse in the distance.",
    createdAt: new Date("2024-03-03"),
    isNew: true
  },
  {
    id: "cold-war-era",
    pageId: "cold-war-era",
    name: "Cold War Era",
    images: [
    "/categories/cold-war/1.jpg",
    "/categories/cold-war/2.jpg"
    ],
    runCount: 90,
    prePrompt: " in a mod, mid-century inspired miniskirt and go-go boots, posing confidently in front of a mural depicting the ideals of the communist regime in West Germany, 1968.",
    createdAt: new Date("2024-03-03"),
    isNew: true
  },
  {
    id: "royalty",
    pageId: "royalty",
    name: "Royalty",
    images: [
    "/categories/royalty/1.jpg",
    "/categories/royalty/2.jpg"
    ],
    runCount: 90,
    prePrompt: "wearing an ornate, brocade gown in rich jewel tones, standing in a grand, opulent palace interior.",
    createdAt: new Date("2024-03-03"),
    isNew: true
  },
  {
    id: "1950s",
    pageId: "1950s",
    name: "1950s",
    images: [
    "/categories/1950/1.jpg",
    "/categories/1950/2.jpg"
    ],
    runCount: 90,
    prePrompt: "in a coral-colored halter-neck dress, hair styled in victory rolls, sipping a cocktail on the deck of a vintage wooden yacht, with a sparkling ocean vista in the distance, evoking a glamorous mid-century nautical atmosphere.",
    createdAt: new Date("2024-03-03"),
    isNew: true
  },
  {
    id: "vintage-potraits",
    pageId: "vintage-potraits",
    name: "Vintage Potraits",
    images: [
    "/categories/vintage/1.jpg",
    "/categories/vintage/2.jpg"
    ],
    runCount: 90,
    prePrompt: "in a vintage pinup-inspired halter dress, with a playful, vibrant pattern, posing against a backdrop of a classic red-and-white striped awning, evocative of a nostalgic small-town diner.",
    createdAt: new Date("2024-03-03"),
    isNew: true
  },
  {
    id: "aristocrat",
    pageId: "aristocrat",
    name: "Aristocrat",
    images: [
    "/categories/aristocrat/1.jpg",
    "/categories/aristocrat/2.jpg"
    ],
    runCount: 90,
    prePrompt: " aristocratic look, in a shimmering, metallic-threaded gown, standing amidst the grandeur of a sprawling, baroque-style palace.",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  {
    id: "fashion",
    pageId: "fashion",
    name: "Fashion",
    images: [
    "/categories/fashion/1.jpg",
    "/categories/fashion/2.jpg"
    ],
    runCount: 90,
    prePrompt: "in a sleek, minimalist jumpsuit exploring the exhibits of a West German design museum in 1968, surrounded by the clean lines and functional aesthetic of the era.",
    createdAt: new Date("2024-03-03"),
    isNew: false
  },
  
  // Add all other templates...
]; 