'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { benefitSchema } from '@/lib/validations';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { availableIcons, getIconComponent } from '@/lib/iconMap';

interface BenefitFormProps {
  initialData?: any | null;
  onSubmit: (data: z.infer<typeof benefitSchema>) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function BenefitForm({ initialData, onSubmit, isLoading, onCancel }: BenefitFormProps) {
  const form = useForm<z.infer<typeof benefitSchema>>({
    resolver: zodResolver(benefitSchema),
    defaultValues: initialData || {
      icon: 'Zap',
      title: '',
      description: '',
      order: 0,
    },
  });

  const selectedIcon = form.watch('icon');
  const IconComponent = getIconComponent(selectedIcon);

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        icon: initialData.icon || 'Zap',
        title: initialData.title || '',
        description: initialData.description || '',
        order: initialData.order ?? 0,
      });
    } else {
      form.reset({
        icon: 'Zap',
        title: '',
        description: '',
        order: 0,
      });
    }
  }, [initialData, form]);

  const onInvalid = (errors: any) => {
    console.error("Benefit form validation errors:", errors);
    toast.error("Please check the form for errors.");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'Zap'}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {availableIcons.map((name) => (
                        <SelectItem key={name} value={name}>
                            <div className="flex items-center gap-2">
                                {React.createElement(getIconComponent(name), { className: "w-4 h-4" })}
                                <span>{name}</span>
                            </div>
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefit Title</FormLabel>
              <FormControl>
                <Input placeholder="Fast Delivery" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe this benefit..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Benefit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

import React from 'react';
