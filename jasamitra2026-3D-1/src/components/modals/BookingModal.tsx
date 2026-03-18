import React,{useState} from "react"

type Props={
open:boolean
onClose:()=>void
onSubmit?:(data:any)=>void
}

export function BookingModal({open,onClose,onSubmit}:Props){

const [date,setDate]=useState("")
const [note,setNote]=useState("")

if(!open) return null

function submit(){

if(onSubmit){
onSubmit({date,note})
}

onClose()

}

return(

<div className="modal-backdrop">

<div className="modal-box">

<h2>Booking</h2>

<input
type="date"
value={date}
onChange={e=>setDate(e.target.value)}
/>

<textarea
placeholder="Catatan tambahan"
value={note}
onChange={e=>setNote(e.target.value)}
/>

<div className="modal-actions">

<button onClick={onClose}>
Batal
</button>

<button onClick={submit}>
Kirim Booking
</button>

</div>

</div>

</div>

)

}