
require("dotenv").config();

const mongoose = require("mongoose");
const Question = require("../models/Question");

const topicGroups = {
  "Work and Time": [
    "6ab00c03ed954e136c51ede2",
    "6ac3552caf20ee47946c7408",
  ],

  "Profit and Loss": [
    "6ab00c03ed954e136c51ede3",
    "6ac3552caf20ee47946c7407",
  ],

  "Simple and Compound Interest": [
    "6ab00c03ed954e136c51ede4",
    "6ac3552caf20ee47946c740b",
  ],

  "Algebraic Identities": [
    "6ab00c03ed954e136c51ede5",
    "6ac3552caf20ee47946c7409",
  ],

  "Circle Geometry": [
    "6ab00c03ed954e136c51ede6",
    "6ac3552caf20ee47946c740a",
  ],

  "Blood Relations": ["6ac359caaf20ee47946c74b6"],

  "Classification": ["6ac359caaf20ee47946c74bc"],

  "Missing Number": ["6ac359caaf20ee47946c74b9"],

  "Mathematical Operations": ["6ac359caaf20ee47946c74bb"],

  "Syllogism": ["6ac359caaf20ee47946c74b7"],

  "Direction Sense": ["6ac359caaf20ee47946c74b8"],

  "Coding-Decoding": [
    "6ac359caaf20ee47946c74b5",
    "6ac359caaf20ee47946c74b4",
  ],

  "Ranking and Order": ["6ac359caaf20ee47946c74ba"],

  "Number Series": ["6ac359caaf20ee47946c74b3"],

  "One-Word Substitution": ["6ac359f5af20ee47946c74c1"],

  "Active and Passive Voice": ["6ac359f5af20ee47946c74c3"],

  "Direct and Indirect Speech": ["6ac359f5af20ee47946c74c4"],

  "Subject-Verb Agreement": ["6ac359f5af20ee47946c74bd"],

  "Synonyms": ["6ac359f5af20ee47946c74be"],

  "Antonyms": ["6ac359f5af20ee47946c74bf"],

  "Vocabulary and Usage": ["6ac359f5af20ee47946c74c6"],

  "Spelling": ["6ac359f5af20ee47946c74c5"],

  "Idioms and Phrases": ["6ac359f5af20ee47946c74c0"],

  "Prepositions": ["6ac359f5af20ee47946c74c2"],

  "Ancient Indian History": ["6ac35de0af20ee47946c7619"],

  "Chemistry": ["6ac35de0af20ee47946c761d"],

  "Indian Art and Culture": ["6ac35de0af20ee47946c7620"],

  "Indian Geography": ["6ac35de0af20ee47946c761a"],

  "Indian Economy": ["6ac35de0af20ee47946c761b"],

  "Indian Polity": [
    "6ac35de0af20ee47946c7618",
    "6ac35de0af20ee47946c761f",
  ],

  "Modern Indian History": ["6ac35de0af20ee47946c7621"],

  "Human Physiology": ["6ac35de0af20ee47946c761e"],

  "Physics": ["6ac35de0af20ee47946c761c"],
};

async function main() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MongoDB connection string not found. Check your server .env variable name."
    );
  }

  await mongoose.connect(mongoUri);

  const entries = Object.entries(topicGroups);
  const allIds = entries.flatMap(([, ids]) => ids);

  if (new Set(allIds).size !== allIds.length) {
    throw new Error("Duplicate question IDs found in the topic mapping.");
  }

  const questions = await Question.find({
    _id: { $in: allIds },
    exam: "SSC CGL",
    source: "question-bank",
  })
    .select("_id subject questionText topic")
    .lean();

  const foundIds = new Set(questions.map((q) => String(q._id)));
  const missingIds = allIds.filter((id) => !foundIds.has(id));

  if (missingIds.length > 0) {
    console.error("Safety check failed. Some expected questions were not found:");
    console.error(missingIds);
    throw new Error("No records have been updated.");
  }

  console.log(`Verified ${questions.length} existing questions.`);
  console.log("\nProposed topic distribution:");

  for (const [topic, ids] of entries) {
    console.log(`${topic}: ${ids.length}`);
  }

  if (!process.argv.includes("--apply")) {
    console.log(
      "\nDRY RUN ONLY: Nothing was changed. Run with --apply after reviewing."
    );
    return;
  }

  let updated = 0;

  for (const [topic, ids] of entries) {
    const result = await Question.updateMany(
      {
        _id: { $in: ids },
        exam: "SSC CGL",
        source: "question-bank",
      },
      {
        $set: { topic },
      }
    );

    updated += result.modifiedCount;
  }

  console.log(`\nUpdate complete. Records modified: ${updated}`);
  console.log("Only the topic field was changed.");

  const summary = await Question.aggregate([
    {
      $match: {
        exam: "SSC CGL",
        source: "question-bank",
      },
    },
    {
      $group: {
        _id: "$topic",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  console.log("\nVerified database topic counts:");
  console.table(summary);
}

main()
  .catch((error) => {
    console.error("Topic update failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });