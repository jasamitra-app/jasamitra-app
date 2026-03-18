import React from "react"

type Props={
open:boolean
onClose:()=>void
image?:string
amount?:number
}

export function PaymentViewerModal({open,onClose,image,amount}:Props){

if(!open) return null

return(

<div className="modal-backdrop">

<div className="modal-box">

<h2>Detail Pembayaran</h2>

<p>Jumlah: {amount}</p>

{image && (
<img
src={image}
style={{width:"100%"}}
/>
)}

<div className="modal-actions">

<button onClick={onClose}>
Tutup
</button>

</div>

</div>

</div>

)

}