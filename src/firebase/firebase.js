import Firebase from 'firebase'
import { config } from './firebaseConfig'
const firebaseApp = Firebase.initializeApp(config)
export default firebaseApp
