"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";


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
      code: z.string(),
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
        { name: "Database", marks: 0, code: "DB09" },
        { name: "Operating System", marks: 0, code: "OS98" },
        { name: "Computer Networks", marks: 0, code: "CN65" },
        { name: "Data Structures", marks: 0, code: "DS89" },
        { name: "Image Processing", marks: 0, code: "IP07" },
      ],
    },
  });

  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      console.log("Data is", data)
      const res = await axios.post("http://localhost:3000/api/students", data);
      if (res.status === 201) {
        toast.success("Student added successfully");
        form.reset();
      }
      console.log(res.data);
    } catch (error) {
      const msg = error as AxiosError;
      console.log(msg.response?.data);
      toast.error("Failed to add student");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="w-full shadow-md">
        <CardHeader className="bg-slate-200 mx-10 p-2 border-2 border-slate-500 rounded-2xl font-sans ">
          <CardTitle className="text-2xl font-bold text-center">Add Student</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
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
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                </div>
              </div>

              {/* Academic Information Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Academic Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-600 mb-2">
                    <div className="col-span-6">Subject Name</div>
                    <div className="col-span-3">Subject Code</div>
                    <div className="col-span-3">Marks (0-100)</div>
                  </div>
                  {form.watch("subjects").map((subject, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <Input value={subject.name} disabled className="bg-gray-50" />
                      </div>
                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.code`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} disabled className="bg-gray-50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-3">
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
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Link href="/all-students">
                <Button 
                   disabled={loading} 
                   className="w-full md:w-auto px-8"
                   size="lg"
                 >
                   {loading ? "Wait..." : "See added Students"}
                 </Button>
                 </Link>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full md:w-auto px-8"
                  size="lg"
                >
                  {loading ? "Submitting..." : "Submit Student Data"}
                </Button>
                
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStudent;