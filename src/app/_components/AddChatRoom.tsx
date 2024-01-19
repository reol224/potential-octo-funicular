"use client"
import React from "react";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import api from "@/lib/api";
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type AddChatRoomProps = {
    onRoomAdded: () => void;
};

//export

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

const AddChatRoom: React.FC<AddChatRoomProps> = ({ onRoomAdded }: AddChatRoomProps) => {
    const { setTheme } = useTheme();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await api.post("/room", values);
            onRoomAdded(); // Notify the parent component about the room addition
            form.reset();
        } catch (error) {
            console.error("Error adding room:", error);
        }
    };

    function ModeToggle() {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="random" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="random" {...field} />
                            </FormControl>
                            <FormDescription>
                                Use password to restrict access to your chat room.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
                <div className="flex items-center space-x-4 mt-4 mr-4 absolute top-0 right-0">
                    <ModeToggle/>
                </div>
            </form>
        </Form>
    );
}

export default AddChatRoom;
