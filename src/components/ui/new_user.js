import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import PocketBase from 'pocketbase';
import { useEffect, useState } from "react"



const pb = new PocketBase('http://172.16.15.136:8080');

export default function New_user({setOpen}){

    const [user,setUser] = useState(null)
    const [password1, setPassword1] = useState(null)
    const [password2, setPassword2] = useState(null)
    const [error,setError] = useState(false)
    const [zdjecie,setZdjecie] = useState(null)
    
    const handleZdjecie = (e)=>{

        // console.log(e)
         setZdjecie(e.target.files[0])
     
      }

    const handleUser = (e)=>{

        setUser(e.target.value)

    }
    const handlePassword1 = (e)=>{

        setPassword1(e.target.value)

    }
    const handlePassword2 = (e)=>{

        setPassword2(e.target.value)

    }
    const handleLogowanie = async ()=>{

        console.log(user)
        console.log(password1)
        console.log(password2)  

        const formData = new FormData()

    formData.append("username", user)
    formData.append("password", password1)
    formData.append("passwordConfirm", password2)
    formData.append("avatar", zdjecie)

    
        try{
            const record = await pb.collection('users').create(formData);
            setOpen()
        }   
        catch(err){
            console.log(err)
        }

        // try{

        //     const authData = await pb.collection('users').authWithPassword(
        //         user,
        //         password,
        //     );
        //     onLogin()
        


        // }catch(err){
        //     setError(true)
        // }


        // console.log(user,password)
        
        

    }


    return(

        <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            UserName
          </Label>
          <Input
            onChange={(e)=>{handleUser(e)}}
            id="username"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input
            onChange={(e)=>{handlePassword1(e)}}
            id="password"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password2" className="text-right">
            Password again
          </Label>
          <Input
            onChange={(e)=>{handlePassword2(e)}}
            id="password2"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password2" className="text-right">
            Avatar
          </Label>
          <Input
            type="file"
            onChange={(e)=>{handleZdjecie(e)}}
            id="password2"
            className="col-span-3"
          />
        </div>
        <div className="w-full flex flex-col">
        {/*error && <p>Zle dane logowania</p>*/}

        <Button onClick={handleLogowanie}>Zaloguj</Button>
          </div>
      </div>
        
        
        
        
        
        
    )
}