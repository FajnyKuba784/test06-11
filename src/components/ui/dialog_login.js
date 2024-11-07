import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import PocketBase from 'pocketbase';


  const pb = new PocketBase('http://172.16.15.136:8080');

export default function Login_dialog({onLogin}) {

    const [user,setUser] = useState(null)
    const [password, setPassword] = useState(null)
    const [error,setError] = useState(false)
    const [open,setOpen] = useState(false)
    
    useEffect(()=>{
        setError(false)
    },[open])

    const handleUser = (e)=>{

        setUser(e.target.value)

    }
    const handlePassword = (e)=>{

        setPassword(e.target.value)

    }
    const handleLogowanie = async ()=>{

        try{

            const authData = await pb.collection('users').authWithPassword(
                user,
                password,
            );
            onLogin()
        


        }catch(err){
            setError(true)
        }


        console.log(user,password)
        
        

    }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              onChange={(e)=>{handleUser(e)}}
              id="name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              onChange={(e)=>{handlePassword(e)}}
              id="username"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col ">
            <div>
          {error && <p>Zle dane logowania</p>}

          <Button onClick={handleLogowanie}>Save changes</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
