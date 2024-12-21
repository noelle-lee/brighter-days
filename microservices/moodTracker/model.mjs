import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */
const moodSchema = mongoose.Schema({
    mood: { type: String, required: true },
    date: { type: String, required: true, unique: true }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Mood = mongoose.model("Mood", moodSchema);

/**
 * Create a mood
 * @param {String} mood 
 * @param {String} date 
 * @returns A promise. Resolves to the JavaScript object for the document created by calling save
 */

const createMood = async(mood, date) => {
    const moods = new Mood({ mood: mood, date: date }); //variable name: arg passed in
    return moods.save(); //persist / save the created mood object to MongoDB
};

const findMood = async(filter, projection, limit) => {
    //filter specifies the conditions that a document in the mood collection must need in order to be returned as a result of calling 'find'
    const query = Mood.find(filter)
        .select(projection)
        .limit(limit);
    return query.exec();
};

const findMoodById = async(_id) => {
    const query = Mood.findById(_id);
    return query.exec();
};

const replaceMood = async(_id, mood, date) => {
    const result = await Mood.replaceOne({_id: _id}, { mood: mood }, { date: date });
    return result.modifiedCount; 
};

async function updateMood(date, mood) {
    try {
        const updatedMood = await Mood.findOneAndUpdate(
            { date: date }, // Find the mood by date
            { mood: mood }, // Update the mood
            { new: true } // Return the updated document
        );
        return updatedMood; // Return the updated document
    } catch (error) {
        console.error('Error updating mood:', error);
        throw error;
    }
};

async function deleteMood(date) {
    try {
        const deletedMood = await Mood.findOneAndDelete({ date: date }); // Find and delete the mood by date
        return deletedMood; // Return the deleted document
    } catch (error) {
        console.error('Error deleting mood:', error);
        throw error;
    }
}

const deleteById = async (_id) => {
    const result = await Mood.deleteOne({ _id: _id });
    return result.deletedCount;
};

export { createMood, findMood, findMoodById, replaceMood, deleteById, updateMood, deleteMood };