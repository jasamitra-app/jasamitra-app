import React,{useState} from "react"

type Props={
open:boolean
onClose:()=>void
onSubmit?:(rating:number,comment:string)=>void
}

export function ReviewModal({open,onClose,onSubmit}:Props){

const [rating,setRating]=useState(5)
const [comment,setComment]=useState("")

if(!open) return null

function submit(){

if(onSubmit){
onSubmit(rating,comment)
}

onClose()

}

return(

<div className="modal-backdrop">

<div className="modal-box">

<h2>Berikan Review</h2>

<input
type="number"
min="1"
max="5"
value={rating}
onChange={e=>setRating(Number(e.target.value))}
/>

<textarea
placeholder="Komentar"
value={comment}
onChange={e=>setComment(e.target.value)}
/>

<div className="modal-actions">

<button onClick={onClose}>
Batal
</button>

<button onClick={submit}>
Kirim
</button>

</div>

</div>

</div>

)

}