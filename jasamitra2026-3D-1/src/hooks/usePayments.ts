import { useEffect, useState } from "react"
import { db } from "../lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { Payment } from "../types"

export function usePayments(){

const [pendingPayments,setPendingPayments] = useState<Payment[]>([])

useEffect(()=>{

const q = collection(db,"payments")

const unsub = onSnapshot(q,(snap)=>{

const list:Payment[] = []

snap.forEach(doc=>{
list.push({
id:doc.id,
...doc.data()
} as Payment)
})

setPendingPayments(list)

})

return ()=>unsub()

},[])

return { pendingPayments }

}