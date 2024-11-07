"use client"
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import  DeleteOne  from '@/components/ui/deleteOne';
import EditOne from '@/components/ui/editOne';
import Awatar from '@/components/ui/awatar';

const pb = new PocketBase('http://172.16.15.136:8080');



export default function Page(){

    const [samochody, setSamochody] = useState(null)
    const [dane, setDane] = useState({marka: null, model: null, czas_parkowania: null})
    const [zdjecie,setZdjecie] = useState(null)
    const [user,setUser] = useState(null)

    useEffect(()=>{

        setUser(pb.authStore.model)


    },[])

    const login = async ()=>{
        
       
        setUser(pb.authStore.model)


    }

useEffect(()=>{

    const getData = async ()=>{
        try{
            const records = await pb.collection('samochody').getFullList({
                sort: '-created',
            });
            console.log(records)
            setSamochody(records)
        }
        catch(err){
            console.log(err)
        }
        finally{

        }


    }
    getData()

},[])

 const handleInputChange = (id, e)=>{

     setDane((prev)=>({   

         ...prev,
         [id]:e.target.value
        }))
        console.log(dane)   
 }


 const handleSubmit = async ()=>{

    const formData = new FormData() 

    formData.append("marka",dane.marka)
    formData.append("model",dane.model)
    formData.append("czas_parkowania",dane.czas_parkowania)
    formData.append("zdjecie",zdjecie)

    try{
        const record = await pb.collection('samochody').create(formData);
        setSamochody((prev)=>([
            ...prev,
            record
        ]))
    }
    catch(err){
        console.log(err)
    }

 }

 const handleZdjecie = (e)=>{

   // console.log(e)
    setZdjecie(e.target.files[0])

 }

 const handleDelete = (id)=>{
    setSamochody((prev)=>(
        prev.filter((el)=>{
            return el.id != id 
        })
    ))
 }

 const updated = (item)=>{
    console.log(item)
    var index = null
    var temSamochody = [...samochody]
    for(let i in samochody){
        if(samochody[i].id==item.id){
            index = i
        }
    }
    temSamochody[index] = item
    setSamochody(temSamochody)
    console.log("index: "+index)
 }

    return(
        <div>

        <h1>Pocketbase</h1> 

        <Awatar onLogin={login} user={user} setUser={setUser}/>

            {user && 
            

        <div className='flex w-full justify-center flex-wrap gap-5'> 
        {

         samochody && 
         samochody.map((samochod)=>(

            <Card className="w-[400px]">
            <CardTitle>{samochod.marka}</CardTitle>
            <CardDescription>{samochod.model}</CardDescription>
            <CardContent>
                <Image
                
                src={pb.files.getUrl(samochod, samochod.zdjecie)}
                alt={samochod.zdjecie}
                width={500}
                height={200}
                className='rounded-md'
                />            

                </CardContent>
                <CardFooter>
                     <div className='w-full flex justify-between'>
                         <div className=' justify-center items-center mt-3 gap-3 flex'>
                             <DeleteOne id={samochod.id} ondeleted={handleDelete} />
                             <EditOne item={samochod} onupdated= {updated}></EditOne>
                         </div>
                         <div className='flex justify-end mt-5 gap-3'>

                             <Timer /> <p>czas parkowania</p>
                             {samochod.czas_parkowania}
                         </div>
                     </div>
                </CardFooter>
        </Card>

         ))   
            
        }
        </div>}
            <div className='flex w-full flex-col items-center flex-wrap gap-5 mt-5'>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="marka">Marka</Label>
                <Input onChange={(e)=>{handleInputChange("marka",e)}} type="text" id="marka" placeholder="Marka" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="model">Model</Label>
                <Input  onChange={(e)=>{handleInputChange("model",e)}} type="text" id="model" placeholder="Model" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="czas_parkowania">Czas parkowania</Label>
                <Input  onChange={(e)=>{handleInputChange("czas_parkowania",e)}} type="number" id="czas_parkowania" placeholder="Czas parkowania" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="zdjecie">Zdjęcie</Label>
                <Input onChange={(e)=>{handleZdjecie(e)}} type="file" id="zdjecie" placeholder="Zdjęcie" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Button onClick={handleSubmit}>Dodaj</Button>
            </div>



            </div>

        
        
        </div>    
    )
        

}