"use client"

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "City is required"),
  fullAddress: z.string().min(1, "Full Address is required"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface LocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationToEdit?: any | null; // Passed from the Data Table
}

export function LocationFormDialog({ open, onOpenChange, locationToEdit }: LocationFormDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
      fullAddress: "",
      isActive: true,
    },
  });

  // Hydrate form conditionally upon prop change
  useEffect(() => {
    if (locationToEdit && open) {
      form.reset({
        id: locationToEdit.id,
        name: locationToEdit.name,
        city: locationToEdit.city,
        fullAddress: locationToEdit.fullAddress,
        isActive: locationToEdit.isActive,
      });
    } else if (open) {
      form.reset({
        id: undefined,
        name: "",
        city: "",
        fullAddress: "",
        isActive: true,
      });
    }
  }, [locationToEdit, open, form]);

  const createLocation = useMutation(
    trpc.adminLocations.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Hub created successfully!");
        await queryClient.invalidateQueries(trpc.adminLocations.getAll.queryOptions());
        onOpenChange(false);
      },
      onError: (err) => toast.error(`Error: ${err.message}`),
    })
  );

  const updateLocation = useMutation(
    trpc.adminLocations.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Hub updated successfully!");
        await queryClient.invalidateQueries(trpc.adminLocations.getAll.queryOptions());
        onOpenChange(false);
      },
      onError: (err) => toast.error(`Error: ${err.message}`),
    })
  );

  const onSubmit = (values: FormValues) => {
    if (values.id) {
      // Edit mode
      updateLocation.mutate({
        id: values.id,
        name: values.name,
        city: values.city,
        fullAddress: values.fullAddress,
        isActive: values.isActive,
      });
    } else {
      // Create mode
      createLocation.mutate({
        name: values.name,
        city: values.city,
        fullAddress: values.fullAddress,
        isActive: values.isActive,
      });
    }
  };

  const isPending = createLocation.isPending || updateLocation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{locationToEdit ? "Edit Hub" : "Create New Hub"}</DialogTitle>
          <DialogDescription>
            {locationToEdit ? "Update details for this physical hub." : "Configure a new physical hub location where cars will be stored."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hub Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dehradun Airport Hub" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Dehradun" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Terminal 1, Jolly Grant, Dehradun 248140" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm pt-4 pb-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <div className="text-[11px] text-muted-foreground font-medium">Toggle whether customers can select this hub.</div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Hub"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
