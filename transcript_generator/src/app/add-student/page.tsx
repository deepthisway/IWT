"use client"

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import {toast} from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface Subject{
    name: string;
    marks: number;
    grade: string;
}

const formSchema = z.object({
    name: z.string(),
    dob: z.string(),
    roll: z.string(),
    address: z.string(),
    email: z.string(),
    phone: z.string(),
    subjects: z.array(
        z.object({
          name: z.string(),
          marks: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
        })
      ),
})


const AddStudent = () => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        dob: "",
        roll: "",
        address: "",
        email: "",
        phone: "",
        subjects: [
          { name: "Database", marks: 0 },
          { name: "Operating System", marks: 0 },
          { name: "Computer Networks", marks: 0 },
          { name: "Data Structures", marks: 0 },
          { name: "Image Processing", marks: 0 },
        ],
      },
    });
    const { fields } = useFieldArray({ control: form.control, name: "subjects" });

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
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
          <div className="w-full max-w-2xl bg-white shadow-lg p-8 rounded-lg space-y-8">
            <h2 className="text-2xl font-bold text-center mb-6">Add Student</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormDescription>This is your public display name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roll"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your roll number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123, Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="xyz@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormLabel>Subjects & Marks</FormLabel>
                  {form.watch("subjects").map((subject, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <Input value={subject.name} disabled />
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.marks`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" min="0" max="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      );
    };

export default AddStudent