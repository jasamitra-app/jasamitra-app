import React,{useState} from "react"

type Props={
open:boolean
onClose:()=>void
onSend?:(price:number)=>void
}

export function OfferModal({open,onClose,onSend}:Props){

const [price,setPrice]=useState("")

if(!open) return null

function send(){

if(onSend){
onSend(Number(price))
}

onClose()

}

return(

<div className="modal-backdrop">

<div className="modal-box">

<h2>Kirim Penawaran</h2>

<input
type="number"
placeholder="Harga penawaran"
value={price}
onChange={e=>setPrice(e.target.value)}
/>

<div className="modal-actions">

<button onClick={onClose}>
Batal
</button>

<button onClick={send}>
Kirim
</button>

</div>

</div>

</div>

)

}