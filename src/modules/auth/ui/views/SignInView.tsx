"use client";

import Link from "next/link";
import Image from "next/image";
import * as z from "zod";
import { OctagonAlertIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";


const formSchema = z.object({
    email: z
        .email({ message: "Please enter a valid email address" })
        .min(1, { message: "Email is required" }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
});


export function SignInView() {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null);
        setLoading(true);

        try {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                callbackURL: "/",
            }, {
                onSuccess() {
                    router.push("/");
                }
                ,
                onError({ error }) {
                    setError(error.message);
                }
            }
            );
        } catch (error) {
            console.log(error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const onGoogleSignIn = async () => {
        setError(null);
        setLoading(true);

        try {
            await authClient.signIn.social(
                {
                    provider: "google",
                    callbackURL: "/",
                },
                {
                    onError: ({ error }) => {
                        setError(error.message);
                    },
                }
            );
        } catch (err) {
            // Catch any unhandled promise rejections
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            // Always stop loading no matter what
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden">

            {/* --- BACKGROUND IMAGE --- */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/background-image.jpg')",
                }}
            >
                {/* Premium overlay */}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-xs" />
            </div>

            {/* --- FORM CARD --- */}
            <Card className="relative z-10 w-full max-w-md overflow-hidden backdrop-blur-md shadow-ambient rounded-md">
                <CardContent className="p-8">

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-6"
                        >

                            {/* Header */}
                            <div className="text-center">
                                <h1 className="text-2xl font-semibold text-primary">
                                    Create Account
                                </h1>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Start your journey with Brothers
                                </p>
                            </div>

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            placeholder="iam@example.com"
                                            {...field}
                                            className="input-premium"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            {...field}
                                            className="input-premium"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Error */}
                            {!!error && (
                                <Alert className="bg-destructive/20 border-none">
                                    <OctagonAlertIcon className="w-4 h-4 text-destructive" />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}

                            {/* Button */}
                            <Button
                                type="submit"
                                className="btn-primary w-full h-12"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : "Sign in"}
                            </Button>

                            {/* Divider */}
                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
                            </div>

                            {/* Google Sign In */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border-slate-200"
                                onClick={onGoogleSignIn}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <Image src="/google-icon.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
                                        <span className="text-slate-700 font-semibold">Continue with Google</span>
                                    </>
                                )}
                            </Button>


                            {/* Footer */}
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/sign-up" className="text-primary font-semibold">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </Form>

                </CardContent>
            </Card>
        </div>
    );
}