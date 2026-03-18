import React,{useState} from "react"

type Props={
open:boolean
onClose:()=>void
onReject?:(reason:string)=>void
}

export function RejectPaymentModal({open,onClose,onReject}:Props){

const [reason,setReason]=useState("")

if(!open) return null

function submit(){

if(onReject){
onReject(reason)
}

onClose()

}

return(

<div className="modal-backdrop">

<div className="modal-box">

<h2>Tolak Pembayaran</h2>

<textarea
placeholder="Alasan penolakan"
value={reason}
onChange={e=>setReason(e.target.value)}
/>

<div className="modal-actions">

<button onClick={onClose}>
Batal
</button>

<button onClick={submit}>
Tolak
</button>

</div>

</div>

</div>

)

}