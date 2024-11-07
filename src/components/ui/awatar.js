import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import PocketBase from 'pocketbase';
import { useEffect, useState } from "react";
import Login_dialog from '@/components/ui/dialog_login';


  const pb = new PocketBase('http://172.16.15.136:8080');

export default function Awatar({onLogin , user,setUser}){

//    const [user,setUser] = useState(null)


    useEffect(()=>{

        setUser(pb.authStore.model)


    },[])

 //   const login = async ()=>{
        
       
  //      setUser(pb.authStore.model)


  //  }
    const logout = ()=>{
        pb.authStore.clear();   
        console.log(pb.authStore)
        setUser(null)
    }


 return(

     <DropdownMenu>
  <DropdownMenuTrigger asChild>
  <Avatar>
        <AvatarImage src={(user && pb.files.getUrl(user, user.avatar))}></AvatarImage>
        <AvatarFallback>
            CN
        </AvatarFallback>
    </Avatar>

  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>{user ? user.username : "Niezalogowany"}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {user ? <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem> :<DropdownMenuItem asChild ><Login_dialog onLogin={onLogin}/></DropdownMenuItem>}
    
    
  </DropdownMenuContent>
</DropdownMenu>

)
  



}