import React,{useState} from "react"
import { uploadPayment } from "../../services/paymentService"

type Props={
open:boolean
onClose:()=>void
userId?:string
}

export function PaymentModal({open,onClose,userId}:Props){

const [amount,setAmount]=useState("")
const [file,setFile]=useState<File | null>(null)

if(!open) return null

async function submit(){

if(!file) return

await uploadPayment(file,Number(amount),userId || "")

onClose()

}

return(

<div className="modal-backdrop">

<div className="modal-box">

<h2>Upload Bukti Pembayaran</h2>

<input
type="number"
placeholder="Jumlah pembayaran"
value={amount}
onChange={e=>setAmount(e.target.value)}
/>

<input
type="file"
onChange={e=>setFile(e.target.files?.[0] || null)}
/>

<div className="modal-actions">

<button onClick={onClose}>
Batal
</button>

<button onClick={submit}>
Upload
</button>

</div>

</div>

</div>

)

}