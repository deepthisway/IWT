"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import {toast} from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

interface Subject{
    name: string;
    marks: number;
    grade: string;
}

const formSchema = z.object({
    name: z.string(),
    dob: z.string(),
    address: z.string(),
    email: z.string(),
    phone: z.string(),
    subjects: z.array(z.object({
        name: z.string(),
        marks: z.number(),
        grade: z.string()
    }))
})


const AddStudent = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            dob: "",
            address: "",
            email: "",
            phone: "",
            subjects: [{ name: "", marks: 0, grade:"" }],
          },
    })

    const [loading, setLoading] = useState(false);
    const onSubmit = async (data : z.infer<typeof formSchema>) =>  {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/api/students", data);
            if(res.status === 201){
                toast.success("Student added successfully");
                form.reset();
            }
            console.log(res.data);
            setLoading(false);
            
        } catch (error) {
            const msg = error as AxiosError;
            console.log(msg.response?.data);
        }
        finally{
            setLoading(false);
        }
        
    }
    
  return (

  )
}

export default AddStudent