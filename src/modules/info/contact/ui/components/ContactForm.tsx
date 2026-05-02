"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';

export function ContactForm() {
    return (
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-ambient relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
            <h2 className="font-heading text-2xl font-bold text-primary mb-8">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                        <SelectTrigger id="subject" className="bg-muted border-none">
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vehicle">Vehicle Inquiry</SelectItem>
                            <SelectItem value="booking">Existing Booking</SelectItem>
                            <SelectItem value="corporate">Corporate Account</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                        id="message" 
                        placeholder="How can we assist you today?" 
                        rows={5}
                        className="bg-muted border-none resize-none"
                    />
                </div>
                <Button className="w-full h-14 text-lg font-heading font-bold rounded-xl btn-executive-primary mt-4">
                    Send Message
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </form>
        </div>
    );
}
