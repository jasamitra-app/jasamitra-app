import { db, storage } from "../lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export async function uploadPayment(file:File,amount:number,userId:string){

const fileRef = ref(storage,"payments/"+Date.now())

await uploadBytes(fileRef,file)

const url = await getDownloadURL(fileRef)

await addDoc(collection(db,"payments"),{

userId,
amount,
proof:url,
status:"pending",
createdAt:serverTimestamp()

})

}