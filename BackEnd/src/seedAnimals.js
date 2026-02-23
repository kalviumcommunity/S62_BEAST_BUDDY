/**
 * Seed script for Animal Encyclopedia
 * Usage: node src/seedAnimals.js
 * 
 * This script populates the database with 15 spirit animals.
 * It clears existing animals before seeding (for idempotency).
 */

const mongoose = require("mongoose");
const path = require("path");

// Load environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: path.resolve(__dirname, "./config/.env"),
  });
}

const Animal = require("./models/Animal");
const connectDatabase = require("./DB/database");

const animalsData = [
  {
    name: "Wolf",
    description:
      "A loyal and intuitive predator known for strong pack bonds and deep emotional intelligence. Wolves are natural leaders with keen instincts and unwavering commitment to their circle.",
    traits: ["Loyalty", "Intuition", "Intelligence", "Teamwork", "Protector"],
    funFacts: [
      "Wolves can hear sounds up to 6 miles away",
      "A wolf's howl can be heard from 10 miles away",
      "Wolves mate for life in most cases",
    ],
    symbolism:
      "Symbol of loyalty, wisdom, and the wild nature within us. Represents guardianship and deep family bonds.",
    imageUrl:
      "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=400&h=300&fit=crop&crop=center",
    tags: ["predator", "land", "pack", "loyal"],
  },
  {
    name: "Eagle",
    description:
      "A visionary creature that soars above it all, seeing the bigger picture. Eagles embody freedom, courage, and the ability to rise above challenges with perspective and clarity.",
    traits: ["Vision", "Freedom", "Courage", "Perspective", "Leadership"],
    funFacts: [
      "Eagles can see 4-8 times better than humans",
      "An eagle can spot a fish from 2 miles away",
      "Bald eagles can fly at speeds up to 100 mph",
    ],
    symbolism:
      "Represents spiritual vision, freedom, and triumph over adversity. Symbol of power and majesty.",
    imageUrl:
      "https://images.unsplash.com/photo-1551085254-e96b210db58a?w=400&h=300&fit=crop&crop=center",
    tags: ["predator", "sky", "freedom", "vision"],
  },
  {
    name: "Dolphin",
    description:
      "Playful, intelligent, and highly social, dolphins embody joy, curiosity, and harmony. Known for their communication skills and ability to bring happiness to those around them.",
    traits: ["Playfulness", "Intelligence", "Sociability", "Harmony", "Joy"],
    funFacts: [
      "Dolphins recognize themselves in mirrors",
      "Dolphins sleep with one eye open",
      "Dolphins call each other by name",
    ],
    symbolism:
      "Symbol of intelligence, joy, and grace. Represents communication, fun, and emotional connection.",
    imageUrl:
      "https://images.unsplash.com/photo-1570481662006-a3a1374699f8?w=400&h=300&fit=crop&crop=center",
    tags: ["water", "social", "intelligent", "playful"],
  },
  {
    name: "Owl",
    description:
      "A symbol of wisdom and deep thought. Owls see in the darkness where others are blind, representing insight, intuition, and the ability to perceive hidden truths.",
    traits: ["Wisdom", "Intuition", "Perception", "Adaptability", "Mystery"],
    funFacts: [
      "Owls can rotate their heads 270 degrees",
      "Owls have excellent night vision",
      "An owl's eyes are actually tubes, not spheres",
    ],
    symbolism:
      "Represents wisdom, secrets, and silent knowledge. Symbol of introspection and intuitive power.",
    imageUrl:
      "https://images.unsplash.com/photo-1535856171126-c7a08e1c0ff0?w=400&h=300&fit=crop&crop=center",
    tags: ["predator", "land", "wise", "nocturnal"],
  },
  {
    name: "Lion",
    description:
      "Regal and confident, the lion embodies courage, strength, and natural leadership. Lions have a commanding presence and unwavering confidence in their abilities.",
    traits: ["Courage", "Strength", "Leadership", "Confidence", "Pride"],
    funFacts: [
      "A lion's roar can be heard from 5 miles away",
      "Male lions sleep up to 20 hours a day",
      "Lions are the only truly social cats",
    ],
    symbolism:
      "Symbol of courage, power, and royal dignity. Represents heart, strength, and noble leadership.",
    imageUrl:
      "https://images.unsplash.com/photo-1567270671170-fdc10a5bf831?w=400&h=300&fit=crop&crop=center",
    tags: ["predator", "land", "powerful", "regal"],
  },
  {
    name: "Fox",
    description:
      "Clever and cunning, the fox is adaptable and strategic. With keen intelligence and quick thinking, foxes navigate complex situations with charm, wit, and resourcefulness.",
    traits: ["Cleverness", "Adaptability", "Strategy", "Charm", "Quick-wit"],
    funFacts: [
      "Foxes use Earth's magnetic field to hunt",
      "A fox's tail helps with balance and warmth",
      "Foxes can hear a mouse squeaking 100 feet away",
    ],
    symbolism:
      "Represents cunning intelligence, strategic thinking, and playful mischief. Symbol of adaptability.",
    imageUrl:
      "https://images.unsplash.com/photo-1583511655857-d19db992cb74?w=400&h=300&fit=crop&crop=center",
    tags: ["predator", "land", "clever", "solitary"],
  },
  {
    name: "Bear",
    description:
      "Strong, introspective, and protective. Bears combine immense power with a contemplative nature. They are independent yet deeply connected to their inner strength and instincts.",
    traits: ["Strength", "Introspection", "Protection", "Independence", "Power"],
    funFacts: [
      "Bears can run up to 35 mph",
      "A bear's sense of smell is 7 times better than a bloodhound's",
      "Bears are naturally right or left-pawed",
    ],
    symbolism:
      "Symbol of strength, introspection, and grounding energy. Represents courage and self-reliance.",
    imageUrl:
      "https://images.unsplash.com/photo-1540573133985-87b6da476e1b?w=400&h=300&fit=crop&crop=center",
    tags: ["powerful", "land", "solitary", "strong"],
  },
  {
    name: "Elephant",
    description:
      "Wise and compassionate, elephants are known for their exceptional memory, emotional depth, and strong family bonds. They are gentle giants with remarkable intelligence and empathy.",
    traits: ["Wisdom", "Compassion", "Memory", "Loyalty", "Gentleness"],
    funFacts: [
      "Elephants have exceptional memory",
      "Elephants can recognize themselves in mirrors",
      "An elephant can communicate over 25 miles away",
    ],
    symbolism:
      "Represents wisdom, gentleness, and emotional depth. Symbol of family bonds and memory.",
    imageUrl:
      "https://images.unsplash.com/photo-1564349382846-3575b7a0c91b?w=400&h=300&fit=crop&crop=center",
    tags: ["land", "gentle", "wise", "social"],
  },
  {
    name: "Raven",
    description:
      "Intelligent and mysterious, ravens are problem-solvers with a playful spirit. They embrace transformation and adaptability, seeing beyond the obvious.",
    traits: ["Intelligence", "Playfulness", "Mystery", "Adaptability", "Magic"],
    funFacts: [
      "Ravens can solve complex problems",
      "Ravens remember human faces",
      "Ravens are one of the smartest bird species",
    ],
    symbolism:
      "Represents intelligence, magic, and transformation. Symbol of introspection and hidden knowledge.",
    imageUrl:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&h=300&fit=crop&crop=center",
    tags: ["sky", "intelligent", "mysterious", "playful"],
  },
  {
    name: "Deer",
    description:
      "Graceful and intuitive, deer embody gentleness, sensitivity, and awareness. They are alert and perceptive, moving through life with grace and gentle strength.",
    traits: ["Grace", "Gentleness", "Sensitivity", "Awareness", "Swiftness"],
    funFacts: [
      "Deers can run at speeds up to 40 mph",
      "Deers have nearly 310-degree vision",
      "A deer's eyes are always alert for danger",
    ],
    symbolism:
      "Represents grace, gentleness, and spiritual awareness. Symbol of sensitivity and natural beauty.",
    imageUrl:
      "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400&h=300&fit=crop&crop=center",
    tags: ["land", "gentle", "graceful", "alert"],
  },
  {
    name: "Tiger",
    description:
      "Powerful and independent, tigers are fierce warriors with intense energy. They combine strength with grace, balancing aggression with beauty and determination.",
    traits: ["Power", "Independence", "Intensity", "Grace", "Determination"],
    funFacts: [
      "Tigers have unique stripe patterns like fingerprints",
      "Tigers can see in darkness 6 times better than humans",
      "A tiger's roar can stun its prey",
    ],
    symbolism:
      "Represents raw power, courage, and spiritual strength. Symbol of passion and transformation.",
    imageUrl:
      "https://images.unsplash.com/photo-1483213097267-aae26bae94ce?w=400&h=300&fit=crop&crop=center",
    tags: ["predator", "land", "powerful", "solitary"],
  },
  {
    name: "Otter",
    description:
      "Playful and curious, otters bring joy and lightheartedness to their environments. They are adaptable, intelligent, and embody the ability to find happiness in simplicity.",
    traits: ["Playfulness", "Curiosity", "Adaptability", "Joy", "Intelligence"],
    funFacts: [
      "Otters hold hands while sleeping",
      "Otters use tools to open shells",
      "An otter's fur is incredibly dense and warm",
    ],
    symbolism:
      "Represents playfulness, adaptation, and joy. Symbol of curiosity and lighthearted wisdom.",
    imageUrl:
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop&crop=center",
    tags: ["water", "playful", "curious", "social"],
  },
  {
    name: "Panda",
    description:
      "Gentle and peaceful, pandas are rare souls who bring balance and calm. Despite their strength, they choose tranquility, embodying the harmony of opposing forces.",
    traits: ["Gentleness", "Peace", "Balance", "Strength", "Serenity"],
    funFacts: [
      "A giant panda has a pseudo-thumb to grip bamboo",
      "Pandas are actually carnivores but eat bamboo",
      "A panda's black and white coloring provides camouflage",
    ],
    symbolism:
      "Represents peace, balance, and gentle strength. Symbol of harmony and contradiction.",
    imageUrl:
      "https://images.unsplash.com/photo-1525382455947-f319bc05fb35?w=400&h=300&fit=crop&crop=center",
    tags: ["land", "gentle", "peaceful", "rare"],
  },
  {
    name: "Phoenix",
    description:
      "A legendary spirit embodying rebirth and resilience. The phoenix rises from challenges transformed, symbolizing hope, renewal, and the power to overcome any adversity.",
    traits: ["Resilience", "Transformation", "Hope", "Rebirth", "Strength"],
    funFacts: [
      "In mythology, the phoenix burns and is reborn from ashes",
      "Phoenix symbolism appears in many world cultures",
      "The phoenix represents the cycle of death and renewal",
    ],
    symbolism:
      "Represents resurrection, transformation, and eternal renewal. Symbol of hope and strength through hardship.",
    imageUrl:
      "https://images.unsplash.com/photo-1614613062282-f04edbffb5dd?w=400&h=300&fit=crop&crop=center",
    tags: ["mythical", "transformation", "powerful", "legendary"],
  },
  {
    name: "Butterfly",
    description:
      "Delicate yet powerful, butterflies represent transformation, beauty, and freedom. They embody metamorphosis and the courage to change and grow beyond limitations.",
    traits: ["Transformation", "Beauty", "Freedom", "Lightness", "Growth"],
    funFacts: [
      "Butterflies taste with their feet",
      "Butterfly wings are made of thousands of scales",
      "Some butterflies migrate thousands of miles",
    ],
    symbolism:
      "Represents metamorphosis, beauty, and spiritual transformation. Symbol of freedom and hope.",
    imageUrl:
      "https://images.unsplash.com/photo-1526745481917-260b470f3c91?w=400&h=300&fit=crop&crop=center",
    tags: ["delicate", "transformation", "beautiful", "free"],
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Connecting to database...");
    await connectDatabase();

    console.log("🗑️  Clearing existing animals...");
    await Animal.deleteMany({});

    console.log("🐾 Seeding 15 spirit animals...");
    const result = await Animal.insertMany(animalsData);

    console.log(`✅ Successfully seeded ${result.length} animals!`);
    console.log("Animals created:");
    result.forEach((animal) => {
      console.log(`  - ${animal.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
