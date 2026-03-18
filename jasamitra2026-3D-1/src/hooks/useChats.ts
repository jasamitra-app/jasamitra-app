import { useEffect, useState } from "react"
import { db } from "../lib/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"

export function useChats(chatId:string){

const [messages,setMessages] = useState<any[]>([])

useEffect(()=>{

if(!chatId) return

const q = query(
collection(db,"chats",chatId,"messages"),
orderBy("createdAt","asc")
)

const unsub = onSnapshot(q,(snap)=>{

const list:any[]=[]

snap.forEach(doc=>{
list.push({
id:doc.id,
...doc.data()
})
})

setMessages(list)

})

return ()=>unsub()

},[chatId])

return { messages }

}