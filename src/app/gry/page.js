"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"
import PocketBase from 'pocketbase';
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";



export default function Gry() {

    const pb = new PocketBase('http://172.16.15.136:8080');

    const [gry, setGry] = useState(null)
    const [dane, setDane] = useState({ nazwa: null, cena: null, opis: null, stan: false })
    const [zdjecie, setZdjecie] = useState(null)
    const [data, setData] = useState({
        nazwa: "",
        opis: "",
        cena: "",
    });

    useEffect(() => {

        const getData = async () => {
            try {

                const records = await pb.collection('gry').getFullList({
                    sort: '-created',
                });
                console.log(records)
                setGry(records)

            }
            catch (err) {
                console.log(err)

            }


        }
        getData()
    }, [])

    const handleZmiana = async (id, aktualny) => {

        try {
            const zmieniony = !aktualny
            await pb.collection('gry').update(id, { stan: zmieniony })

            setGry((prevRec) =>
                prevRec.map((gra) =>
                    gra.id === id ? { ...gra, stan: zmieniony } : gra
                )
            );
        } catch (err) {
            console.error("Error updating dostepnosc:", err);

        }



    }

    const handleInputChange = (id, e) => {

        setDane((prev) => ({

            ...prev,
            [id]: e.target.value
        }))
        console.log(dane)
    }
    const handleDataChange = (id, value) => {
        setData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async () => {

        const formData = new FormData()

        formData.append("nazwa", dane.nazwa)
        formData.append("cena", dane.cena)
        formData.append("opis", dane.opis)
        formData.append("stan", dane.stan)
        formData.append("zdjecie", zdjecie)

        try {
            const record = await pb.collection('gry').create(formData);
            setGry((prev) => ([
                ...prev,
                record
            ]))
        }
        catch (err) {
            console.log(err)
        }

    }


    const handleZdjecie = (e) => {

        // console.log(e)
        setZdjecie(e.target.files[0])

    }


    const usun = async (id) => {
        try {
            await pb.collection("gry").delete(id)

            setGry((prev) => prev.filter((gra) => gra.id !== id))
            console.log("działa")
        }
        catch (err) {
            console.log("niedziala:" && err)
        }
    }

    const handleEdit = async (id) => {
        try {
            const existingRecord = await pb.collection('gry').getOne(id);

            const updatedData = {
                nazwa: data.nazwa || existingRecord.nazwa,
                opis: data.opis || existingRecord.opis,
                cena: data.cena || existingRecord.cena,
            };

            const formData = new FormData();
            Object.keys(updatedData).forEach(key => {
                formData.append(key, updatedData[key]);
            });

            const updatedRecord = await pb.collection('gry').update(id, formData);

            setGry((prev) =>
                prev.map((gra) => (gra.id === id ? updatedRecord : gra))
            );

        } catch (err) {
            console.log("Error updating record:", err);
        }
    }

    return (

        <div>

            <h1>Skibidi</h1>


            <div className='flex w-full justify-center flex-wrap gap-5'>
                {gry && gry.map((gra) => (

                    <Card className="w-[300px] h-[500px]" id={gra.id}>
                        <CardHeader>
                            <Image
                                src={pb.files.getUrl(gra, gra.zdjecie)}
                                alt={gra.zdjecie}
                                width={500}
                                height={200}
                                className='rounded-md' />

                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center text-center">

                                Nazwa: {gra.nazwa} <br></br>
                                Cena: {gra.cena} zł <br />
                                Opis: {gra.opis}
                            </div>
                        </CardContent>
                        <CardFooter>

                            <DropdownMenu>
                                <DropdownMenuTrigger><Button variant='outline'><Ellipsis size={40} /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel></DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => usun(gra.id)} aschild>Usuń</DropdownMenuItem>
                                    
                                        
                                        <DropdownMenuItem asChild>
                                            <Sheet>

                                                <SheetTrigger>Edytuj</SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>Edycja</SheetTitle>
                                                        <SheetDescription>
                                                            <div className="mb-4" aschild="true">
                                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                                    <Label htmlFor="nazwa">Tytul</Label>
                                                                    <Input
                                                                        onChange={(e) => handleDataChange("nazwa", e.target.value)}
                                                                        type="text"
                                                                        placeholder="nazwa"
                                                                        id="nazwa"
                                                                        defaultValue={gra.nazwa}
                                                                    />                                                            </div>

                                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                                    <Label htmlFor="cena">cena(zl)</Label>
                                                                    <Input
                                                                        onChange={(e) => handleDataChange("cena", e.target.value)}
                                                                        type="number"
                                                                        placeholder="cena"
                                                                        id="cena"
                                                                        defaultValue={gra.cena}
                                                                    />                                                            </div>
                                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                                    <Label htmlFor="opis">Opis</Label>
                                                                    <Input
                                                                        onChange={(e) => handleDataChange("opis", e.target.value)}
                                                                        type="text"
                                                                        placeholder="opis"
                                                                        id="opis"
                                                                        defaultValue={gra.opis}
                                                                    />                                                            </div>
                                                                <div className="grid w-full max-w-sm items-center gap-1.5">






                                                                </div>




                                                                <div className="w-full">
                                                                    <SheetClose>

                                                                        <Button onClick={() => handleEdit(gra.id)}>Zmień</Button>
                                                                    </SheetClose>
                                                                </div>
                                                            </div>
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                </SheetContent>
                                            </Sheet>
                                        </DropdownMenuItem>
                                    
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex items-center space-x-2">
                                <Label>Dostępne: </Label>
                                <Switch id="airplane-mode" checked={gra.stan}
                                    onCheckedChange={() => { handleZmiana(gra.id, gra.stan) }}
                                />
                            </div>
                        </CardFooter>
                    </Card>

                ))}
                <Sheet>
                    <SheetTrigger asChild>
                        <Card className="w-[300px] h-[500px] flex justify-center items-center text-9xl">

                            <CardContent>
                                +
                            </CardContent>

                        </Card>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Dodaj</SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nazwa" className="text-right">
                                    Nazwa
                                </Label>
                                <Input id="nazwa" onChange={(e) => { handleInputChange("nazwa", e) }} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cena" className="text-right">
                                    Cena
                                </Label>
                                <Input id="cena" type="number" onChange={(e) => { handleInputChange("cena", e) }} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="opis" className="text-right">
                                    Opis
                                </Label>
                                <Input id="opis" onChange={(e) => { handleInputChange("opis", e) }} className="col-span-3" />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="stan" className="text-right">
                                    Zdjęcie
                                </Label>
                                <Input onChange={(e) => { handleZdjecie(e) }} type="file" id="zdjecie" />
                            </div>

                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit" onClick={handleSubmit}>Save changes</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

            </div>



        </div>
    )
}