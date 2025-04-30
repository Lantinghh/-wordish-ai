// seedVocab.mjs

import fetch from 'node-fetch';

const API_URL = "https://croissant-ai-ms-hackthon.vercel.app/api/vocabulary";
const USER_ID = "550e8400-e29b-41d4-a716-446655440000";

const courseWords = {
  "TOFEL Essential": [
    { text: "Accumulate", status: "A Match" },
    { text: "Assess", status: "We've met" },
    { text: "Consequently", status: "A Match" },
    { text: "Contribute", status: "First Date" },
    { text: "Expose", status: "Stranger" },
    { text: "Mature", status: "Stranger" },
    { text: "Precise", status: "Stranger" },
    { text: "Reinforce", status: "Stranger" },
    { text: "Significant", status: "Stranger" },
    { text: "Viable", status: "Stranger" },
  ],
};

const definitions = {
  Accumulate: "To gather or collect, often in gradual degrees.",
  Assess: "To evaluate or estimate the nature, ability, or quality of.",
  Consequently: "As a result; therefore.",
  Contribute: "To give or supply in common with others.",
  Expose: "To make something visible or revealed.",
  Mature: "Fully developed physically or mentally.",
  Precise: "Marked by exactness and accuracy of expression.",
  Reinforce: "To strengthen or support.",
  Significant: "Sufficiently great or important to be worthy of attention.",
  Viable: "Capable of working successfully; feasible.",
};

async function seed() {
  for (const [category, words] of Object.entries(courseWords)) {
    for (const wordObj of words) {
      const word = wordObj.text;
      const definition = definitions[word] || "Definition not available";

      const payload = {
        word,
        definition,
        category,
        user_id: USER_ID,  // 👈 加上这个字段
      };

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok) {
          console.log(`✅ Created: ${word}`);
        } else {
          console.error(`❌ Failed: ${word}`, data);
        }
      } catch (err) {
        console.error(`❌ Error creating ${word}`, err);
      }
    }
  }
}

seed();
