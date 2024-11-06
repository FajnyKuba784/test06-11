import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { useState } from "react"
import PocketBase from 'pocketbase';
import Image from "next/image"

export default function EditOne({item, onupdated}) {
    const pb = new PocketBase('http://172.16.15.136:8080');

    const [dane, setDane] = useState({marka: item.marka, model: item.model, czas_parkowania: item.czas_parkowania})
    const [zdjecie,setZdjecie] = useState(null)

    const handleInputChange = (id, e)=>{

        setDane((prev)=>({   
   
            ...prev,
            [id]:e.target.value
           }))
           console.log(dane)
    }

    const handleZdjecie = (e)=>{

        // console.log(e)
         setZdjecie(e.target.files[0])
     
      }
        
    const handleUpdate = async ()=>{
        const formData = new FormData() 

        formData.append("marka",dane.marka)
        formData.append("model",dane.model)
        formData.append("czas_parkowania",dane.czas_parkowania)
        formData.append("zdjecie",zdjecie)


        const record = await pb.collection('samochody').update(item.id, formData);

        onupdated(record)

    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Pencil/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <div className='flex w-full flex-col items-center flex-wrap gap-5 mt-5'>

<div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="marka">Marka</Label>
    <Input defaultValue={item.marka} onChange={(e)=>{handleInputChange("marka",e)}} type="text" id="marka" placeholder="Marka" />
</div>
<div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="model">Model</Label>
    <Input defaultValue={item.model} onChange={(e)=>{handleInputChange("model",e)}} type="text" id="model" placeholder="Model" />
</div>
<div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="czas_parkowania">Czas parkowania</Label>
    <Input defaultValue={item.czas_parkowania} onChange={(e)=>{handleInputChange("czas_parkowania",e)}} type="number" id="czas_parkowania" placeholder="Czas parkowania" />
</div>
<div className="grid w-full max-w-sm items-center gap-1.5">
<Image
                
                src={pb.files.getUrl(item, item.zdjecie)}
                alt={item.zdjecie}
                width={100}
                height={50}
                className='rounded-md'
                />  
</div>
<div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="zdjecie">Zdjęcie</Label>
    <Input onChange={(e)=>{handleZdjecie(e)}} type="file" id="zdjecie" placeholder="Zdjęcie" />
</div>



</div>

        </div>
        <DialogFooter>
            <DialogClose>

          <Button onClick={handleUpdate}>Save changes</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
