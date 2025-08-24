import * as admin from 'firebase-admin';
import { getAndProcessReleaseNotes } from './rssProcessor'; // This file will be created next

// Initialize Firebase Admin SDK
// Make sure to set up Google Application Credentials in your environment
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function main() {
  console.log('Starting batch processing of release notes...');
  try {
    const notes = await getAndProcessReleaseNotes();
    const collectionRef = db.collection('release-notes');

    const batch = db.batch();
    notes.forEach((note) => {
      const docRef = collectionRef.doc(note.id);
      batch.set(docRef, note);
    });

    await batch.commit();
    console.log(
      `Successfully saved ${notes.length} release notes to Firestore.`,
    );
  } catch (error) {
    console.error('Error during batch processing:', error);
    process.exit(1);
  }
}

main();
